import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Play, CheckCircle2, AlertCircle, Clock, Calculator } from 'lucide-react';
import { GeneratedParagraph, sanitizeCustomText } from '../utils/paragraphGenerator';
import { TestConfig } from '../types';

interface CustomUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCustomTest: (config: TestConfig, passage: GeneratedParagraph) => void;
  categoryContext?: 'page' | 'numeric' | 'general';
}

const DURATION_PRESETS = [
  { label: 'Full Text', value: 0 },
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '3 min', value: 180 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
];

export const CustomUploadModal: React.FC<CustomUploadModalProps> = ({
  isOpen,
  onClose,
  onStartCustomTest,
  categoryContext = 'page',
}) => {
  const isNumeric = categoryContext === 'numeric';
  const storageSuffix = isNumeric ? '_numeric' : '';

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('paste');
  const [pastedText, setPastedText] = useState<string>(() => {
    return sessionStorage.getItem(`typing_saved_paste${storageSuffix}`) || '';
  });
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(() => {
    return sessionStorage.getItem(`typing_saved_filename${storageSuffix}`) || null;
  });
  const [uploadedContent, setUploadedContent] = useState<string>(() => {
    return sessionStorage.getItem(`typing_saved_upload${storageSuffix}`) || '';
  });
  const [selectedDuration, setSelectedDuration] = useState<number>(0); // 0 = complete passage
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close modal when pressing Escape key
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

  // Save drafts to sessionStorage so work is never lost
  useEffect(() => {
    if (pastedText) {
      sessionStorage.setItem(`typing_saved_paste${storageSuffix}`, pastedText);
    }
  }, [pastedText, storageSuffix]);

  useEffect(() => {
    if (uploadedContent && uploadedFileName) {
      sessionStorage.setItem(`typing_saved_upload${storageSuffix}`, uploadedContent);
      sessionStorage.setItem(`typing_saved_filename${storageSuffix}`, uploadedFileName);
    }
  }, [uploadedContent, uploadedFileName, storageSuffix]);

  if (!isOpen) return null;

  // Handle .txt file selection with proper sanitization
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension or MIME type
    const isTextFile = file.name.toLowerCase().endsWith('.txt') || file.type === 'text/plain' || file.type === '';
    if (!isTextFile) {
      setErrorMsg('Please select a valid plain text (.txt) file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawContent = (event.target?.result as string) || '';
        const cleaned = sanitizeCustomText(rawContent);

        if (!cleaned || cleaned.trim().length === 0) {
          setErrorMsg('The selected text file is empty.');
          return;
        }

        setUploadedFileName(file.name);
        setUploadedContent(cleaned);
      } catch {
        setErrorMsg('Error processing file text. Please try another file.');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file from disk.');
    };
    reader.readAsText(file);
  };

  // Launch test with the sanitized custom content
  const handleStart = () => {
    setErrorMsg(null);
    const rawContent = activeTab === 'upload' ? uploadedContent : pastedText;
    const sanitized = sanitizeCustomText(rawContent);

    if (!sanitized) {
      setErrorMsg(activeTab === 'upload' ? 'Please upload a .txt file first.' : 'Please paste your test text into the box.');
      return;
    }

    const words = sanitized.split(/\s+/).filter(Boolean).length;
    if (isNumeric) {
      if (words < 2 && sanitized.length < 4) {
        setErrorMsg('Data is too short. Please provide at least 2 numbers or codes.');
        return;
      }
    } else {
      if (words < 3) {
        setErrorMsg('Text is too short. Please provide at least 3 words.');
        return;
      }
    }

    const defaultTitle = isNumeric ? 'Custom Numeric Drill' : 'Custom Passage';
    const title = activeTab === 'upload' && uploadedFileName 
      ? uploadedFileName.replace(/\.txt$/i, '') 
      : defaultTitle;

    const customPassage: GeneratedParagraph = {
      id: `${isNumeric ? 'custom-num-p' : 'custom-p'}-${Date.now()}`,
      title,
      category: isNumeric ? 'numbers' : 'general',
      text: sanitized,
      wordCount: words,
    };

    const isTimedMode = selectedDuration > 0;
    const config: TestConfig = {
      id: `${isNumeric ? 'custom-numeric' : 'custom-test'}-${Date.now()}`,
      category: isNumeric ? 'numeric' : (isTimedMode ? 'timed' : 'page'),
      name: isTimedMode 
        ? `${DURATION_PRESETS.find(d => d.value === selectedDuration)?.label || ''} Custom ${isNumeric ? '10-Key ' : ''}Test (${title})`
        : `Custom ${isNumeric ? '10-Key ' : ''}Test (${title})`,
      subtitle: isTimedMode 
        ? `${selectedDuration}s Timed ${isNumeric ? '10-Key' : 'Custom'} Drill` 
        : `${words} ${isNumeric ? 'numbers' : 'words'} custom document`,
      durationSeconds: isTimedMode ? selectedDuration : undefined,
      targetWords: words,
      isCustom: true,
    };

    // Store custom session persistently
    try {
      sessionStorage.setItem('typing_custom_session', JSON.stringify({ config, passage: customPassage }));
    } catch {
      // Storage quota fallback
    }

    // Launch test with verified data
    onStartCustomTest(config, customPassage);
    onClose();
  };

  const rawActiveText = activeTab === 'upload' ? uploadedContent : pastedText;
  const wordCount = rawActiveText.trim() ? rawActiveText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = rawActiveText.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none font-ui animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col"
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
              isNumeric ? 'bg-amber-500/15 text-amber-600' : 'bg-sky-500/15 text-[#0284c7]'
            }`}>
              {isNumeric ? <Calculator size={20} /> : <FileText size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>
                {isNumeric ? 'Custom Numeric & Upload' : 'Custom Test & Upload'}
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {isNumeric 
                  ? 'Practice 10-key numeric typing with your custom data or numbers'
                  : 'Practice typing using your own text or files'}
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

        {/* Mode Selector Tabs (Upload .txt vs Paste) */}
        <div 
          className="p-3 border-b flex gap-2"
          style={{
            backgroundColor: 'var(--card-bg-subtle)',
            borderColor: 'var(--card-border)',
          }}
        >
          <button
            onClick={() => { setActiveTab('paste'); setErrorMsg(null); }}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition ${
              activeTab === 'paste'
                ? (isNumeric ? 'bg-amber-600 text-white shadow-xs' : 'bg-[#0284c7] text-white shadow-xs')
                : 'hover:opacity-80'
            }`}
            style={activeTab !== 'paste' ? {
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-muted)',
              border: '1px solid var(--card-border)'
            } : undefined}
          >
            <FileText size={16} />
            <span>{isNumeric ? 'Paste Numbers' : 'Paste Text'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('upload'); setErrorMsg(null); }}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition ${
              activeTab === 'upload'
                ? (isNumeric ? 'bg-amber-600 text-white shadow-xs' : 'bg-[#0284c7] text-white shadow-xs')
                : 'hover:opacity-80'
            }`}
            style={activeTab !== 'upload' ? {
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-muted)',
              border: '1px solid var(--card-border)'
            } : undefined}
          >
            <Upload size={16} />
            <span>Upload .txt File</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 flex flex-col gap-4">
          
          {/* TAB 1: PASTE TEXT */}
          {activeTab === 'paste' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>
                {isNumeric ? 'Paste your numeric data below:' : 'Paste your text below:'}
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder={isNumeric 
                  ? 'Paste numbers, financial codes, or numeric drills... (e.g. 5928 4019 8271 3918 6401...)'
                  : 'Paste any article, paragraph, speech, or text here...'}
                rows={6}
                className="w-full text-sm font-typing p-3.5 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none transition"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-main)',
                }}
              />
            </div>
          )}

          {/* TAB 2: UPLOAD .TXT FILE */}
          {activeTab === 'upload' && (
            <div className="flex flex-col gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-sky-500 transition group"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: uploadedFileName ? '#10b981' : 'var(--input-border)',
                }}
              >
                {uploadedFileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 size={36} className="text-emerald-500" />
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                        {uploadedFileName}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        File loaded and validated (Click to replace)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-[#0284c7] flex items-center justify-center group-hover:scale-110 transition">
                      <Upload size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                        Click to browse or drop .txt file here
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Only plain text (.txt) files are supported
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {uploadedContent && (
                <div 
                  className="p-3 rounded-xl border text-xs font-typing line-clamp-2"
                  style={{
                    backgroundColor: 'var(--card-bg-subtle)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <strong className="block text-[11px] font-ui text-[#0284c7] mb-0.5">Preview:</strong>
                  {uploadedContent}
                </div>
              )}
            </div>
          )}

          {/* Test Duration Selector for Custom Text */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              <Clock size={13} />
              <span>Test Duration:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setSelectedDuration(preset.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    selectedDuration === preset.value
                      ? 'bg-[#0284c7] text-white shadow-xs'
                      : 'hover:opacity-80'
                  }`}
                  style={selectedDuration !== preset.value ? {
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--input-border)',
                  } : undefined}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Word & Character Counter */}
          {rawActiveText.trim().length > 0 && (
            <div 
              className="flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs"
              style={{
                backgroundColor: 'var(--card-bg-subtle)',
                borderColor: 'var(--card-border)',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Document Stats:</span>
              <div className="flex items-center gap-3 font-typing font-semibold">
                <span style={{ color: 'var(--text-main)' }}>{wordCount} words</span>
                <span style={{ color: 'var(--text-subtle)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>{charCount} characters</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div 
          className="p-4 border-t flex items-center justify-end gap-2.5"
          style={{
            backgroundColor: 'var(--card-bg-subtle)',
            borderColor: 'var(--card-border)',
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm cursor-pointer transition"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-muted)',
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleStart}
            disabled={!rawActiveText.trim()}
            className="py-2.5 px-6 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-40 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer font-ui uppercase"
          >
            <Play size={14} className="fill-white" />
            <span>{isNumeric ? 'Start Custom Numeric Test' : 'Start Custom Test'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
