import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { CategorySelector } from './components/CategorySelector';
import { TypingArea, TypingStatsUpdate } from './components/TypingArea';
import { ResultModal } from './components/ResultModal';
import { PassageModal } from './components/PassageModal';
import { CURATED_PASSAGES, GeneratedParagraph, generateParagraph, getWordCountForDuration } from './utils/paragraphGenerator';
import { TestConfig, ThemeMode } from './types';
import { calculateTypingStats, DetailedStats } from './utils/calculator';
import { soundManager } from './utils/sound';
import { VerificationModal, VerifiedCertificateRecord } from './components/VerificationModal';
import { paragraphService } from './services/paragraphService';

// Pixel-perfect GitHub SVG icon
const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const App: React.FC = () => {
  // Theme state: 'day' | 'night' | 'system'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('typing_theme') as ThemeMode;
    return (saved === 'day' || saved === 'night' || saved === 'system') ? saved : 'system';
  });

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundManager.enabled);

  // Active Test Configuration & Passage with Session Storage Persistence
  const [currentConfig, setCurrentConfig] = useState<TestConfig | null>(() => {
    try {
      const saved = sessionStorage.getItem('typing_active_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.config || null;
      }
    } catch {}
    return null;
  });

  const [selectedPassage, setSelectedPassage] = useState<GeneratedParagraph>(() => {
    try {
      const saved = sessionStorage.getItem('typing_active_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.passage && parsed.passage.text) {
          return parsed.passage;
        }
      }
    } catch {}
    return CURATED_PASSAGES[0];
  });

  const [isPassageModalOpen, setIsPassageModalOpen] = useState<boolean>(false);
  const [verificationRecord, setVerificationRecord] = useState<VerifiedCertificateRecord | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);

  // Authenticate certificate verification link from QR code & load R2 paragraph library
  useEffect(() => {
    paragraphService.loadLibrary();
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#\/?/, ''));
      const verifyId = searchParams.get('verify') || hashParams.get('verify');

      if (verifyId) {
        // 1. Try to load from local storage certificates database
        const raw = localStorage.getItem('typing_certificates_db');
        const db: Record<string, VerifiedCertificateRecord> = raw ? JSON.parse(raw) : {};

        if (db[verifyId]) {
          setVerificationRecord(db[verifyId]);
          setIsVerificationOpen(true);
          return;
        }

        // 2. Fallback to URL parameters for verified cross-device verification
        const recipientName = searchParams.get('name') || hashParams.get('name') || 'Certified Typist';
        const testName = searchParams.get('test') || hashParams.get('test') || 'Typing Assessment';
        const netWpm = parseInt(searchParams.get('wpm') || hashParams.get('wpm') || '0', 10);
        const grossWpm = parseInt(searchParams.get('gross') || hashParams.get('gross') || '0', 10);
        const accuracy = parseInt(searchParams.get('acc') || hashParams.get('acc') || '0', 10);
        const rank = searchParams.get('rank') || hashParams.get('rank') || 'Verified';
        const issueDate = searchParams.get('date') || hashParams.get('date') || new Date().toLocaleDateString('en-US');

        const isValid = verifyId.startsWith('CERT-TYP-');
        setVerificationRecord({
          id: verifyId,
          recipientName,
          testName,
          netWpm,
          grossWpm,
          accuracy,
          rank,
          issueDate,
          status: isValid ? 'VALID' : 'INVALID',
          verifiedAt: new Date().toISOString(),
        });
        setIsVerificationOpen(true);
      }
    } catch {}
  }, []);

  // Test Runtime State
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const [elapsedMilliseconds, setElapsedMilliseconds] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(() => {
    return currentConfig?.durationSeconds;
  });

  // High precision metrics state
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [errorKeystrokes, setErrorKeystrokes] = useState<number>(0);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [correctCharsInText, setCorrectCharsInText] = useState<number>(0);
  const [errorCharsInText, setErrorCharsInText] = useState<number>(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // High-resolution timing refs
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const isCompletedRef = useRef<boolean>(false);
  const wpmHistoryRef = useRef<number[]>([]);

  // Apply theme to document root with dynamic System preference listener
  useEffect(() => {
    const applyResolvedTheme = () => {
      let resolved: 'day' | 'night' = 'day';
      if (theme === 'system') {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolved = isSystemDark ? 'night' : 'day';
      } else {
        resolved = theme;
      }
      document.documentElement.setAttribute('data-theme', resolved);
      localStorage.setItem('typing_theme', theme);
    };

    applyResolvedTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  // Toggle audio
  const handleToggleSound = () => {
    const next = soundManager.toggleSound();
    setSoundEnabled(next);
  };

  // Launch test reliably
  const handleStartTest = (config: TestConfig, passage: GeneratedParagraph) => {
    // Clear any previous timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    isCompletedRef.current = false;
    startTimeRef.current = null;
    wpmHistoryRef.current = [];

    // Save session in sessionStorage so it never gets lost during re-renders
    try {
      sessionStorage.setItem('typing_active_session', JSON.stringify({ config, passage }));
    } catch {}

    setCurrentConfig(config);
    setSelectedPassage(passage);
    setHasStarted(false);
    setIsTestFinished(false);
    setElapsedMilliseconds(0);
    setElapsedSeconds(0);
    setTimeRemaining(config.durationSeconds);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setErrorKeystrokes(0);
    setBackspaceCount(0);
    setCorrectCharsInText(0);
    setErrorCharsInText(0);
    setTotalCharsTyped(0);
    setProgressPercent(0);
  };

  // Reset / Redo current test
  const handleRedo = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    isCompletedRef.current = false;
    startTimeRef.current = null;
    wpmHistoryRef.current = [];

    setHasStarted(false);
    setIsTestFinished(false);
    setElapsedMilliseconds(0);
    setElapsedSeconds(0);
    setTimeRemaining(currentConfig?.durationSeconds);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setErrorKeystrokes(0);
    setBackspaceCount(0);
    setCorrectCharsInText(0);
    setErrorCharsInText(0);
    setTotalCharsTyped(0);
    setProgressPercent(0);
  }, [currentConfig]);

  // Back to test categories menu
  const handleBackToMenu = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    isCompletedRef.current = false;
    startTimeRef.current = null;
    wpmHistoryRef.current = [];

    // Clear active session storage
    sessionStorage.removeItem('typing_active_session');

    setCurrentConfig(null);
    setHasStarted(false);
    setIsTestFinished(false);
    setElapsedMilliseconds(0);
    setElapsedSeconds(0);
    setProgressPercent(0);
  };

  // Triggered when user starts typing
  const handleFirstKey = () => {
    if (!hasStarted && !isTestFinished) {
      startTimeRef.current = performance.now();
      setHasStarted(true);
    }
  };

  // Completion handler (guarded against duplicate invocations)
  const handleComplete = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Freeze final elapsed time accurately
    if (startTimeRef.current) {
      const finalElapsedMs = performance.now() - startTimeRef.current;
      setElapsedMilliseconds(finalElapsedMs);
      setElapsedSeconds(Math.max(1, Math.round(finalElapsedMs / 1000)));
    }

    setIsTestFinished(true);
    setProgressPercent(100);
  }, []);

  // Update stats from TypingArea
  const handleStatsUpdate = (stats: TypingStatsUpdate) => {
    setTotalKeystrokes(stats.totalKeystrokes);
    setCorrectKeystrokes(stats.correctKeystrokes);
    setErrorKeystrokes(stats.errorKeystrokes);
    setBackspaceCount(stats.backspaceCount);
    setCorrectCharsInText(stats.correctCharsInText);
    setErrorCharsInText(stats.errorCharsInText);
    setTotalCharsTyped(stats.totalCharsTyped);
    setProgressPercent(stats.progressPercent);
  };

  // High-Resolution Precision Timer Engine
  useEffect(() => {
    if (hasStarted && !isTestFinished) {
      if (!startTimeRef.current) {
        startTimeRef.current = performance.now();
      }

      timerIntervalRef.current = window.setInterval(() => {
        if (!startTimeRef.current || isCompletedRef.current) return;

        const now = performance.now();
        const elapsedMs = Math.max(0, now - startTimeRef.current);
        const elapsedSecs = Math.floor(elapsedMs / 1000);

        setElapsedMilliseconds(elapsedMs);
        setElapsedSeconds(elapsedSecs);

        // Record periodic WPM samples for consistency score
        if (elapsedSecs > 0 && elapsedSecs % 1 === 0) {
          const currentMins = elapsedMs / 60000;
          if (currentMins > 0) {
            const instNetWpm = Math.max(0, Math.round(((totalCharsTyped / 5) - errorCharsInText) / currentMins));
            wpmHistoryRef.current.push(instNetWpm);
          }
        }

        // Handle timed test duration countdown
        if (currentConfig?.durationSeconds) {
          const totalDurationMs = currentConfig.durationSeconds * 1000;
          const remainingSecs = Math.max(0, Math.ceil((totalDurationMs - elapsedMs) / 1000));
          setTimeRemaining(remainingSecs);

          // Expire test exactly on duration completion
          if (elapsedMs >= totalDurationMs) {
            soundManager.playComplete();
            handleComplete();
          }
        }
      }, 250); // Frequent polling avoids interval drift
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [hasStarted, isTestFinished, currentConfig, handleComplete, totalCharsTyped, errorCharsInText]);

  // Seamless extension if fast typist approaches end of passage during timed test
  const handleExtendPassage = () => {
    if (currentConfig?.durationSeconds && !isTestFinished) {
      const extraWords = getWordCountForDuration(Math.min(60, currentConfig.durationSeconds));
      const extra = generateParagraph('general', extraWords);
      setSelectedPassage((prev) => ({
        ...prev,
        text: prev.text + ' ' + extra.text,
        wordCount: prev.wordCount + extra.wordCount,
      }));
    }
  };

  // Calculate detailed scientific stats
  const calculatedStats: DetailedStats = calculateTypingStats({
    totalKeystrokes,
    correctKeystrokes,
    errorKeystrokes,
    backspaceCount,
    correctCharsInText,
    errorCharsInText,
    totalCharsTyped,
    passageLength: selectedPassage.text.length,
    elapsedMilliseconds: Math.max(elapsedMilliseconds, elapsedSeconds * 1000),
    wpmHistory: wpmHistoryRef.current,
  });

  const isTimed = Boolean(
    currentConfig?.category === 'timed' ||
    (currentConfig?.category === 'numeric' && currentConfig.durationSeconds !== undefined) ||
    (currentConfig?.isCustom && currentConfig.durationSeconds !== undefined)
  );

  return (
    <div 
      className="w-full min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-200 font-ui"
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-main)',
      }}
    >
      {/* Top Header Bar */}
      <Header
        testName={currentConfig?.name}
        timeRemaining={timeRemaining}
        timeElapsed={elapsedSeconds}
        isTimed={isTimed}
        progressPercent={progressPercent}
        soundEnabled={soundEnabled}
        theme={theme}
        inTest={currentConfig !== null}
        onToggleSound={handleToggleSound}
        onSelectTheme={setTheme}
        onBackToMenu={handleBackToMenu}
        onOpenPassageSelector={() => setIsPassageModalOpen(true)}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-3 sm:p-5">
        {currentConfig === null ? (
          <CategorySelector onStartTest={handleStartTest} />
        ) : (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <TypingArea
              passageText={selectedPassage.text}
              hasStarted={hasStarted}
              onFirstKey={handleFirstKey}
              onComplete={handleComplete}
              onStatsUpdate={handleStatsUpdate}
              isTestFinished={isTestFinished}
              onExtendPassage={handleExtendPassage}
              onRestart={handleRedo}
            />
          </div>
        )}
      </main>

      {/* Sleek GitHub Profile Footer */}
      <footer 
        className="w-full py-3 px-4 flex items-center justify-center gap-2 text-xs select-none border-t font-ui transition-colors"
        style={{
          borderColor: 'var(--card-border)',
          color: 'var(--text-muted)',
        }}
      >
        <span>Created with precision by</span>
        <a
          href="https://github.com/apandey-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-bold transition px-2.5 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer group"
          style={{ color: 'var(--text-main)' }}
          title="View GitHub Profile"
        >
          <GithubIcon size={15} className="group-hover:text-[#0284c7] transition" />
          <span className="group-hover:text-[#0284c7] transition">apandey-dev</span>
        </a>
      </footer>

      {/* Result Complete Modal */}
      {isTestFinished && (
        <ResultModal
          stats={calculatedStats}
          testName={currentConfig?.name || 'Typing Test'}
          onTakeAgain={handleRedo}
          onBackToTests={handleBackToMenu}
        />
      )}

      {/* Change Passage In-Test Modal */}
      <PassageModal
        isOpen={isPassageModalOpen}
        onClose={() => setIsPassageModalOpen(false)}
        selectedPassage={selectedPassage}
        onSelectPassage={(newPassage) => {
          setSelectedPassage(newPassage);
          handleRedo();
        }}
      />

      {/* Official Certificate Verification Modal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        record={verificationRecord}
      />

    </div>
  );
};

export default App;
