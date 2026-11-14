import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowLeft, Award, CheckCircle2, Zap, Target, Clock } from 'lucide-react';
import { DetailedStats } from '../utils/calculator';
import { CertificateModal } from './CertificateModal';

interface ResultModalProps {
  stats: DetailedStats;
  testName: string;
  onTakeAgain: () => void;
  onBackToTests: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  stats,
  testName,
  onTakeAgain,
  onBackToTests,
}) => {
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  // Fire celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#38bdf8', '#f59e0b', '#10b981'],
      });
    } catch {
      // fallback
    }
  }, []);

  // Listen to Esc key to quickly restart test from results screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCertificateOpen) {
        e.preventDefault();
        onTakeAgain();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCertificateOpen, onTakeAgain]);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
        <div 
          className="w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col font-ui"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-main)',
          }}
        >
          {/* Main Content Area */}
          <div className="p-6 sm:p-10 flex flex-col items-center text-center relative">
            
            {/* Subtle star decorative icons */}
            <div className="absolute top-6 left-8 text-amber-400 text-lg opacity-80 animate-pulse">★</div>
            <div className="absolute top-10 right-10 text-amber-400 text-sm opacity-70">★</div>
            <div className="absolute top-14 left-1/4 text-amber-300 text-xs opacity-60">★</div>
            <div className="absolute top-12 right-1/4 text-amber-300 text-xs opacity-60">★</div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-main)' }}>
              Typing Test Complete!
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              You typed the <strong className="font-bold" style={{ color: 'var(--text-main)' }}>{testName}</strong>.
            </p>

            {/* Speed & Accuracy Highlight */}
            <div 
              className="my-5 py-3.5 px-6 rounded-2xl border w-full max-w-lg"
              style={{
                backgroundColor: 'var(--card-bg-subtle)',
                borderColor: 'var(--card-border)',
              }}
            >
              <p className="text-lg sm:text-xl font-medium" style={{ color: 'var(--text-main)' }}>
                Your speed was{' '}
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-typing">
                  {stats.netWpm} <span className="text-sm font-ui font-bold">WPM</span>
                </span>{' '}
                with{' '}
                <span className="text-2xl sm:text-3xl font-extrabold text-sky-500 font-typing">
                  {stats.accuracy}%
                </span>{' '}
                accuracy!
              </p>
            </div>

            {/* Detailed Scientific Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg mb-6">
              <div 
                className="p-3 rounded-2xl border flex flex-col items-center"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <Zap size={18} className="text-amber-500 mb-1" />
                <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-subtle)' }}>Gross Speed</span>
                <span className="text-base font-bold font-typing" style={{ color: 'var(--text-main)' }}>{stats.rawWpm} WPM</span>
              </div>

              <div 
                className="p-3 rounded-2xl border flex flex-col items-center"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <Clock size={18} className="text-sky-500 mb-1" />
                <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-subtle)' }}>Time Taken</span>
                <span className="text-base font-bold font-typing" style={{ color: 'var(--text-main)' }}>{stats.elapsedSeconds}s</span>
              </div>

              <div 
                className="p-3 rounded-2xl border flex flex-col items-center"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <CheckCircle2 size={18} className="text-emerald-500 mb-1" />
                <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-subtle)' }}>Keystrokes</span>
                <span className="text-base font-bold font-typing" style={{ color: 'var(--text-main)' }}>{stats.correctKeystrokes}/{stats.totalKeystrokes}</span>
              </div>

              <div 
                className="p-3 rounded-2xl border flex flex-col items-center"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <Target size={18} className="text-rose-500 mb-1" />
                <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-subtle)' }}>Errors</span>
                <span className="text-base font-bold font-typing" style={{ color: 'var(--text-main)' }}>{stats.errorKeystrokes}</span>
              </div>
            </div>

            {/* Achievement Status Bar */}
            <div 
              className="w-full max-w-md rounded-full border p-2 flex items-center justify-between gap-3 shadow-inner"
              style={{
                backgroundColor: 'var(--card-bg-subtle)',
                borderColor: 'var(--card-border)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block" style={{ color: 'var(--text-main)' }}>
                    {stats.tier.title} ({stats.tier.level})
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {stats.tier.xp} earned
                  </span>
                </div>
              </div>

              <div className="pr-3 text-right">
                <span className="text-xs font-bold text-[#0284c7]">Test Passed</span>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div 
            className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{
              backgroundColor: 'var(--card-bg-subtle)',
              borderColor: 'var(--card-border)',
            }}
          >
            {/* Back to Typing Tests */}
            <button
              onClick={onBackToTests}
              className="text-xs sm:text-sm font-bold text-sky-500 hover:underline flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
            >
              <ArrowLeft size={16} />
              <span>« Back to Typing Tests</span>
            </button>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
              <button
                onClick={onTakeAgain}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-main)',
                }}
              >
                <RotateCcw size={15} />
                <span>Take Again</span>
              </button>

              {/* Opens Certificate Modal */}
              <button
                onClick={() => setIsCertificateOpen(true)}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Award size={16} />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Verified Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        stats={stats}
        testName={testName}
      />
    </>
  );
};
