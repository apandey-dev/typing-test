import React from 'react';
import { CheckCircle2, XCircle, Award, ShieldCheck, X, ExternalLink, Calendar, Zap, Target } from 'lucide-react';
import { ProficiencyRank } from '../utils/calculator';

export interface VerifiedCertificateRecord {
  id: string;
  recipientName: string;
  testName: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  rank: ProficiencyRank | string;
  issueDate: string;
  status: 'VALID' | 'REVOKED' | 'INVALID';
  verifiedAt?: string;
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: VerifiedCertificateRecord | null;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!isOpen || !record) return null;

  const isValid = record.status === 'VALID';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-ui animate-in fade-in duration-150 select-none">
      <div 
        className="w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden flex flex-col"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          color: 'var(--text-main)',
        }}
      >
        {/* Header */}
        <div 
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isValid ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-600'
            }`}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--text-main)' }}>
                Official Certificate Verification
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Authenticity and Registry Verification System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center text-center gap-4">
          
          {/* Status Badge */}
          <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2 ${
            isValid 
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
          }`}>
            {isValid ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            <span>{isValid ? 'VERIFIED & GENUINE CERTIFICATE' : 'INVALID OR UNVERIFIED RECORD'}</span>
          </div>

          {/* Certificate ID */}
          <div className="font-mono text-xs px-3 py-1 rounded-lg bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-300">
            Certificate ID: <strong className="font-bold">{record.id}</strong>
          </div>

          {/* Recipient Details */}
          <div className="w-full rounded-2xl p-4 border flex flex-col gap-3 text-left" style={{
            backgroundColor: 'var(--card-bg-subtle)',
            borderColor: 'var(--card-border)',
          }}>
            <div className="border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
              <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Certified Typist
              </span>
              <h4 className="text-lg sm:text-xl font-black font-serif tracking-tight mt-0.5" style={{ color: 'var(--text-main)' }}>
                {record.recipientName}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Assessment
                </span>
                <span className="font-semibold block mt-0.5" style={{ color: 'var(--text-main)' }}>
                  {record.testName}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Date Issued
                </span>
                <span className="font-semibold block mt-0.5" style={{ color: 'var(--text-main)' }}>
                  {record.issueDate}
                </span>
              </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t text-center" style={{ borderColor: 'var(--card-border)' }}>
              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
                <span className="text-[9px] uppercase font-bold block" style={{ color: 'var(--text-muted)' }}>Net Speed</span>
                <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">{record.netWpm} WPM</span>
              </div>

              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
                <span className="text-[9px] uppercase font-bold block" style={{ color: 'var(--text-muted)' }}>Accuracy</span>
                <span className="font-mono font-black text-sm text-[#0284c7] dark:text-sky-400">{record.accuracy}%</span>
              </div>

              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
                <span className="text-[9px] uppercase font-bold block" style={{ color: 'var(--text-muted)' }}>Gross</span>
                <span className="font-mono font-black text-sm" style={{ color: 'var(--text-main)' }}>{record.grossWpm} WPM</span>
              </div>

              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
                <span className="text-[9px] uppercase font-bold block" style={{ color: 'var(--text-muted)' }}>Rank</span>
                <span className="font-bold text-xs text-amber-600 dark:text-amber-400 block mt-0.5">{record.rank}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            This certification record has been cryptographically validated against the Typing platform registry.
          </p>

        </div>

        {/* Footer */}
        <div 
          className="p-4 border-t flex items-center justify-between"
          style={{
            backgroundColor: 'var(--card-bg-subtle)',
            borderColor: 'var(--card-border)',
          }}
        >
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Typing Certification Authority
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs cursor-pointer transition shadow-xs"
          >
            Close Verification
          </button>
        </div>

      </div>
    </div>
  );
};
