import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, ArrowLeft, Sun, Moon, Laptop, BookOpen } from 'lucide-react';
import { ThemeMode } from '../types';

interface HeaderProps {
  testName?: string;
  timeRemaining?: number;
  timeElapsed: number;
  isTimed: boolean;
  progressPercent: number;
  soundEnabled: boolean;
  theme: ThemeMode;
  inTest: boolean;
  onToggleSound: () => void;
  onSelectTheme: (theme: ThemeMode) => void;
  onBackToMenu: () => void;
  onOpenPassageSelector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  testName,
  timeRemaining,
  timeElapsed,
  isTimed,
  progressPercent,
  soundEnabled,
  theme,
  inTest,
  onToggleSound,
  onSelectTheme,
  onBackToMenu,
  onOpenPassageSelector,
}) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  // Close theme dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format MM:SS with strict padding
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const displayTime = isTimed && timeRemaining !== undefined
    ? formatTime(timeRemaining)
    : formatTime(timeElapsed);

  return (
    <header 
      className="relative w-full z-30 select-none shadow-xs transition-colors duration-200 border-b border-white/10"
      style={{ backgroundColor: 'var(--header-bg)', color: 'var(--header-text)' }}
    >
      {/* Top Navbar Row */}
      <div className="w-full px-4 sm:px-8 py-2.5 flex items-center justify-between">
        
        {/* Left Side: Brand is just "typing" */}
        <div className="flex items-center gap-3 min-w-[120px]">
          {inTest && (
            <button
              onClick={onBackToMenu}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="Exit Test (Esc)"
            >
              <ArrowLeft size={17} />
            </button>
          )}

          <div 
            onClick={onBackToMenu} 
            className="flex items-center cursor-pointer group"
          >
            <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1 font-ui">
              <span>typing</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Center: ONLY show test badge if currently inside a test */}
        <div className="flex items-center justify-center">
          {inTest && testName && (
            <span className="bg-white/15 px-4 py-1 rounded-full backdrop-blur-xs font-semibold text-xs sm:text-sm tracking-wide text-white font-ui text-center max-w-[280px] truncate shadow-inner">
              {testName}
            </span>
          )}
        </div>

        {/* Right Side: Only show Timer & Sound when IN TEST! Otherwise only Theme */}
        <div className="flex items-center gap-2 sm:gap-3 text-white">
          
          {inTest && (
            <>
              {/* Passage Switcher */}
              {onOpenPassageSelector && (
                <button
                  onClick={onOpenPassageSelector}
                  className="hidden lg:flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition cursor-pointer font-ui active:scale-95"
                  title="Change Text Passage"
                >
                  <BookOpen size={14} />
                  <span>Passage</span>
                </button>
              )}

              {/* Fixed-width Timer Badge */}
              <div className="w-[72px] sm:w-[82px] h-[32px] flex items-center justify-center font-typing font-bold text-base sm:text-lg text-white tracking-widest bg-black/25 rounded-lg tabular-nums select-none shrink-0 shadow-inner">
                {displayTime}
              </div>

              <div className="h-4 w-px bg-white/20 shrink-0" />

              {/* Sound Toggle */}
              <button
                onClick={onToggleSound}
                className="w-[34px] sm:w-[86px] h-[32px] flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-white/15 rounded-lg transition-all cursor-pointer font-ui shrink-0 active:scale-95"
                title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span className="hidden sm:inline w-[44px] text-left">
                  {soundEnabled ? 'Sound' : 'Muted'}
                </span>
              </button>

              <div className="h-4 w-px bg-white/20 shrink-0" />
            </>
          )}

          {/* Theme Dropdown (Always visible: Day / Night / System) */}
          <div ref={themeRef} className="relative shrink-0">
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="w-[34px] sm:w-[86px] h-[32px] flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-white/15 rounded-lg transition-all cursor-pointer font-ui active:scale-95"
              title="Theme Selection"
            >
              {theme === 'day' && <Sun size={15} />}
              {theme === 'night' && <Moon size={15} />}
              {theme === 'system' && <Laptop size={15} />}
              <span className="hidden sm:inline capitalize w-[45px] text-left">{theme}</span>
            </button>

            {/* Dropdown Menu */}
            {isThemeOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-36 rounded-xl shadow-2xl border py-1.5 z-50 font-ui animate-in fade-in zoom-in-95 duration-100"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-main)',
                }}
              >
                <button
                  onClick={() => { onSelectTheme('day'); setIsThemeOpen(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                    theme === 'day' ? 'text-[#0284c7] font-bold bg-[#0284c7]/10' : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Sun size={14} className="text-amber-500" />
                  <span>Day</span>
                </button>

                <button
                  onClick={() => { onSelectTheme('night'); setIsThemeOpen(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                    theme === 'night' ? 'text-sky-400 font-bold bg-[#0284c7]/10' : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Moon size={14} className="text-indigo-400" />
                  <span>Night</span>
                </button>

                <button
                  onClick={() => { onSelectTheme('system'); setIsThemeOpen(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                    theme === 'system' ? 'text-[#0284c7] font-bold bg-[#0284c7]/10' : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Laptop size={14} className="text-emerald-500" />
                  <span>System</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Progress Bar under header (ONLY when in test) */}
      {inTest && (
        <div className="w-full h-1 bg-black/15 overflow-hidden">
          <div 
            className="h-full bg-emerald-400 transition-all duration-150 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}
    </header>
  );
};
