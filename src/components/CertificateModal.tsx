import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { X, Download, FileDown, Award, CheckCircle2, User, ShieldCheck } from 'lucide-react';
import { DetailedStats } from '../utils/calculator';
import { VerifiedCertificateRecord } from './VerificationModal';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DetailedStats;
  testName: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  stats,
  testName,
}) => {
  // Default to "Your Name" as requested
  const [recipientName, setRecipientName] = useState<string>('Your Name');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [certificateId] = useState<string>(() => {
    return 'CERT-TYP-' + Math.floor(100000 + Math.random() * 900000);
  });
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const certificateRef = useRef<HTMLDivElement>(null);

  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const displayName = recipientName.trim() || 'Your Name';

  // Generate verifiable QR code and persist verified record to localStorage
  useEffect(() => {
    const record: VerifiedCertificateRecord = {
      id: certificateId,
      recipientName: displayName,
      testName,
      netWpm: stats.netWpm,
      grossWpm: stats.grossWpm,
      accuracy: stats.accuracy,
      rank: stats.rank,
      issueDate,
      status: 'VALID',
      verifiedAt: new Date().toISOString(),
    };

    // Save to local certificates registry for instant verification
    try {
      const existingRaw = localStorage.getItem('typing_certificates_db');
      const existingMap: Record<string, VerifiedCertificateRecord> = existingRaw ? JSON.parse(existingRaw) : {};
      existingMap[certificateId] = record;
      localStorage.setItem('typing_certificates_db', JSON.stringify(existingMap));
    } catch {
      // Fallback if storage quota reached
    }

    // Embed verified data directly in verification URL for cross-device compatibility
    const baseUrl = window.location.origin + window.location.pathname;
    const verifyUrl = `${baseUrl}?verify=${certificateId}&name=${encodeURIComponent(displayName)}&wpm=${stats.netWpm}&acc=${stats.accuracy}&gross=${stats.grossWpm}&rank=${encodeURIComponent(stats.rank)}&test=${encodeURIComponent(testName)}&date=${encodeURIComponent(issueDate)}`;

    QRCode.toDataURL(verifyUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [displayName, stats, testName, certificateId, issueDate]);

  // Close certificate modal on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Export as high-resolution PNG image
  const handleDownloadPng = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2.5, // Crisp high-DPI retina output
        useCORS: true,
        backgroundColor: '#fffdf9',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeName = (displayName).replace(/\s+/g, '_');
      link.download = `Certificate_${safeName}_${stats.netWpm}WPM.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export certificate:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // High-Fidelity PDF Export
  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#fffdf9',
      });
      const dataUrl = canvas.toDataURL('image/png');

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Certificate - ${displayName}</title>
              <style>
                @page { size: landscape; margin: 0; }
                body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
                img { width: 100%; max-width: 1050px; height: auto; display: block; margin: auto; }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" onload="window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-ui select-none">
      <div 
        className="w-full max-w-4xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          color: 'var(--text-main)',
        }}
      >
        {/* Top Control Bar */}
        <div 
          className="p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ borderColor: 'var(--card-border)' }}
        >
          {/* User Name Customizer */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <User size={18} />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-bold uppercase block" style={{ color: 'var(--text-muted)' }}>
                Recipient Name on Certificate:
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Your Name"
                className="w-full text-sm font-bold px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 font-ui"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-main)',
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm cursor-pointer transition active:scale-95"
            >
              <Download size={15} />
              <span>{isExporting ? 'Exporting...' : 'Export PNG'}</span>
            </button>

            {/* Changed from 'Print / PDF' to 'PDF' per explicit user instruction */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm cursor-pointer transition active:scale-95"
            >
              <FileDown size={15} />
              <span>PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Certificate Display Container */}
        <div className="p-4 sm:p-8 overflow-x-auto flex justify-center bg-slate-950/25">
          
          <div
            ref={certificateRef}
            className="w-[840px] h-[560px] bg-[#fffdf9] text-slate-900 p-8 rounded-xl shadow-2xl relative flex flex-col justify-between shrink-0 select-none overflow-hidden"
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            }}
          >
            {/* Outer Classic Guilloche Decorative Gold Borders */}
            <div className="absolute inset-3 border-2 border-[#b8860b]/40 rounded-lg pointer-events-none" />
            <div className="absolute inset-4.5 border border-[#b8860b]/20 pointer-events-none" />

            {/* Corner Embellishments */}
            <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-[#b8860b]" />
            <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-[#b8860b]" />
            <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-[#b8860b]" />
            <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-[#b8860b]" />

            {/* Subtle Watermark in Center Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Award size={360} className="text-[#0f172a]" />
            </div>

            {/* 1. Header (Cleaned up: No redundant headings) */}
            <div className="text-center relative z-10 pt-2">
              <p className="text-[11px] font-bold text-[#b8860b] tracking-[0.28em] uppercase mb-1">
                TYPING TEST CERTIFICATE
              </p>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase text-slate-900 font-serif">
                CERTIFICATE OF TYPING PROFICIENCY
              </h1>
              
              <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">
                Recognition of Typing Speed and Accuracy
              </p>
            </div>

            {/* 2. Recipient Section */}
            <div className="text-center relative z-10 my-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                THIS CERTIFICATE IS PRESENTED TO
              </p>
              
              <div className="my-2.5 inline-block">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif px-8 py-1 border-b-2 border-[#b8860b]/70">
                  {displayName}
                </h2>
              </div>

              <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed mt-1">
                For successfully completing the <strong className="text-slate-900 font-bold">{testName}</strong> typing assessment with a verified typing speed of <strong className="text-emerald-700 font-bold">{stats.netWpm} WPM</strong> and an accuracy of <strong className="text-[#0284c7] font-bold">{stats.accuracy}%</strong>.
              </p>
            </div>

            {/* 3. Performance Statistics (Clean 4-column layout) */}
            <div className="relative z-10 bg-slate-50/90 border border-slate-200/80 rounded-xl py-3 px-6 mx-auto w-full max-w-2xl flex items-center justify-around text-center shadow-xs">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">NET SPEED</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {stats.netWpm} <span className="text-xs font-sans font-bold text-slate-500">WPM</span>
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">ACCURACY</span>
                <span className="text-2xl font-black text-[#0284c7] font-mono">
                  {stats.accuracy}%
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">GROSS SPEED</span>
                <span className="text-2xl font-black text-slate-800 font-mono">
                  {stats.grossWpm} <span className="text-xs font-sans font-bold text-slate-500">WPM</span>
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">PERFORMANCE RANK</span>
                <span className="text-base font-bold text-amber-600 block mt-0.5">
                  {stats.rank}
                </span>
              </div>
            </div>

            {/* 4. Certificate Footer (3 Balanced Sections) */}
            <div className="relative z-10 flex items-end justify-between px-4 pb-2 pt-2">
              
              {/* LEFT SECTION: QR Code & Verification Status */}
              <div className="flex items-center gap-2.5">
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt="Verified QR Code"
                    className="w-16 h-16 rounded border border-slate-300 p-0.5 bg-white shadow-xs"
                  />
                )}
                <div className="text-left">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Verification ID</span>
                  <span className="text-xs font-mono font-bold text-slate-800 block">{certificateId}</span>
                  <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={11} /> VERIFIED RECORD
                  </span>
                </div>
              </div>

              {/* CENTER SECTION: Elegant Certificate Seal / Medal */}
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  {/* Medal Ribbons */}
                  <div className="absolute -bottom-2.5 -left-1 w-3.5 h-5 bg-[#b8860b] rotate-15 rounded-b-xs shadow-xs" />
                  <div className="absolute -bottom-2.5 -right-1 w-3.5 h-5 bg-[#b8860b] -rotate-15 rounded-b-xs shadow-xs" />
                  
                  {/* Gold Medal Badge */}
                  <div className="w-15 h-15 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#ffd700] to-[#b8860b] p-1 shadow-lg flex items-center justify-center">
                    <div className="w-full h-full rounded-full border border-amber-800/20 bg-gradient-to-b from-[#ffd700] to-[#b8860b] flex flex-col items-center justify-center text-slate-900 shadow-inner">
                      <Award size={22} className="text-white drop-shadow-xs" />
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-black tracking-widest uppercase text-[#b8860b] mt-3">
                  CERTIFIED ACHIEVEMENT
                </span>
              </div>

              {/* RIGHT SECTION: Issuer & Date */}
              <div className="text-right flex flex-col items-end">
                <div className="font-serif font-black text-xl text-slate-900 tracking-wide">
                  Typing
                </div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                  Certification Platform
                </span>
                <span className="text-[9px] text-slate-500 font-medium mt-1">
                  Issued: {issueDate}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
