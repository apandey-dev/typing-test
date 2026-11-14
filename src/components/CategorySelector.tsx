import React, { useState, useEffect } from 'react';
import { Timer, FileText, Calculator, Play, ArrowLeft, Clock, Sliders, Upload } from 'lucide-react';
import { TestCategory, TestConfig } from '../types';
import { GeneratedParagraph, CURATED_PASSAGES, generateParagraph, generateNumericDrill, getWordCountForDuration } from '../utils/paragraphGenerator';
import { CustomUploadModal } from './CustomUploadModal';
import { paragraphService } from '../services/paragraphService';

interface CategorySelectorProps {
  onStartTest: (config: TestConfig, passage: GeneratedParagraph) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onStartTest }) => {
  // Navigation state: null = 3 Main Cards; or 'timed' | 'page' | 'numeric'
  const [activeCategory, setActiveCategory] = useState<TestCategory | null>(() => {
    return (sessionStorage.getItem('typing_active_category') as TestCategory) || null;
  });

  // Custom Time inputs for Timed Test
  const [customMinutes, setCustomMinutes] = useState<string>('2');
  const [customSeconds, setCustomSeconds] = useState<string>('0');

  // Custom Upload / Paste Modal state
  const [isCustomUploadModalOpen, setIsCustomUploadModalOpen] = useState<boolean>(false);
  const [customModalCategory, setCustomModalCategory] = useState<'page' | 'numeric'>('page');

  // Sync activeCategory with sessionStorage so state is never lost
  useEffect(() => {
    if (activeCategory) {
      sessionStorage.setItem('typing_active_category', activeCategory);
    } else {
      sessionStorage.removeItem('typing_active_category');
    }
  }, [activeCategory]);

  // Handle Esc key to go back from sub-category view to 3 cards view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeCategory !== null && !isCustomUploadModalOpen) {
        e.preventDefault();
        setActiveCategory(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategory, isCustomUploadModalOpen]);

  // Launch helper with Cloudflare R2 paragraph selection and smart word count
  const handleLaunch = (config: TestConfig, passage?: GeneratedParagraph) => {
    let finalPassage = passage;
    if (!finalPassage) {
      if (config.category === 'numeric') {
        const targetWords = config.targetWords || getWordCountForDuration(config.durationSeconds);
        finalPassage = generateNumericDrill(Math.max(15, Math.round(targetWords / 2)));
      } else {
        const r2Selection = paragraphService.selectParagraph({
          durationSeconds: config.durationSeconds,
          targetWords: config.targetWords,
        });
        finalPassage = {
          id: r2Selection.id,
          title: r2Selection.title,
          category: 'general',
          text: r2Selection.text,
          wordCount: r2Selection.wordCount,
        };
      }
    }
    const finalWords = finalPassage.wordCount;
    onStartTest({ ...config, targetWords: finalWords }, finalPassage);
  };

  // Custom Time Launch with proportional paragraph generation
  const handleCustomTimeLaunch = () => {
    const mins = Math.max(0, parseInt(customMinutes, 10) || 0);
    const secs = Math.max(0, parseInt(customSeconds, 10) || 0);
    const totalSecs = (mins * 60) + secs;

    if (totalSecs < 10) {
      alert('Please enter at least 10 seconds for the typing test.');
      return;
    }

    const calculatedWords = getWordCountForDuration(totalSecs);
    const config: TestConfig = {
      id: `custom-timed-${Date.now()}`,
      category: 'timed',
      name: `${mins > 0 ? `${mins}m ` : ''}${secs > 0 ? `${secs}s ` : ''}Custom Test`,
      subtitle: `${totalSecs}s Proportional Drill (${calculatedWords} words)`,
      durationSeconds: totalSecs,
      targetWords: calculatedWords,
      isCustom: true,
    };

    handleLaunch(config);
  };

  // VIEW 1: Initial 3 Category Cards
  if (activeCategory === null) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center gap-6">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 
            className="text-2xl sm:text-3xl font-extrabold tracking-tight font-ui"
            style={{ color: 'var(--text-main)' }}
          >
            Select Your Practice Category
          </h1>
          <p 
            className="text-xs sm:text-sm mt-1.5 font-ui"
            style={{ color: 'var(--text-muted)' }}
          >
            Distraction-free typing practice. Select a category below to get started.
          </p>
        </div>

        {/* 3 Main Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2">
          
          {/* 1. Timed Test */}
          <div 
            onClick={() => setActiveCategory('timed')}
            className="group relative rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between gap-5"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-main)',
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-500/15 text-[#0284c7] dark:text-sky-400 flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
              <Timer size={36} className="animate-pulse" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-ui" style={{ color: 'var(--text-main)' }}>
                Timed Tests
              </h2>
              <p className="text-xs sm:text-sm mt-2 font-ui leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Test your typing speed against a live clock. Choose 1 min, 3 min, or enter a custom duration.
              </p>
            </div>

            <button 
              className="w-full py-3 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-ui uppercase"
            >
              <span>Open Timed Tests</span>
              <Play size={15} className="fill-white" />
            </button>
          </div>

          {/* 2. Page Test */}
          <div 
            onClick={() => setActiveCategory('page')}
            className="group relative rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between gap-5"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-main)',
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
              <FileText size={36} />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-ui" style={{ color: 'var(--text-main)' }}>
                Page Tests
              </h2>
              <p className="text-xs sm:text-sm mt-2 font-ui leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Complete fixed passages or upload/paste your custom document.
              </p>
            </div>

            <button 
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-ui uppercase"
            >
              <span>Open Page Tests</span>
              <Play size={15} className="fill-white" />
            </button>
          </div>

          {/* 3. Numeric Test */}
          <div 
            onClick={() => setActiveCategory('numeric')}
            className="group relative rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between gap-5"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-main)',
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
              <Calculator size={36} />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-ui" style={{ color: 'var(--text-main)' }}>
                Numeric Tests
              </h2>
              <p className="text-xs sm:text-sm mt-2 font-ui leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                10-Key keypad and number row precision drills for accounting and data entry speed.
              </p>
            </div>

            <button 
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-ui uppercase"
            >
              <span>Open Numeric Tests</span>
              <Play size={15} className="fill-white" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // VIEW 2: Sub-page options
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
      
      {/* Clean Header Bar with Back Button */}
      <div 
        className="rounded-2xl p-5 sm:p-6 text-white shadow-md flex items-center justify-between gap-4"
        style={{
          background: activeCategory === 'timed' 
            ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
            : activeCategory === 'page'
            ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
            : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
        }}
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-ui">
            {activeCategory === 'timed' && 'Timed Tests'}
            {activeCategory === 'page' && 'Page Tests'}
            {activeCategory === 'numeric' && '10-Key Numeric Drill'}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 mt-1 font-ui">
            {activeCategory === 'timed' && 'Select a preset duration or enter your custom time.'}
            {activeCategory === 'page' && 'Select a standard passage or open custom upload/paste.'}
            {activeCategory === 'numeric' && 'Practice high-speed numeric data entry.'}
          </p>
        </div>

        {/* Back Button (Esc key supported) */}
        <button
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition cursor-pointer font-ui shadow-xs shrink-0 active:scale-95"
          title="Back to Categories (Esc)"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
          <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded ml-0.5 opacity-80 hidden sm:inline">Esc</span>
        </button>
      </div>

      {/* 3 Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        
        {/* ===================== TIMED CATEGORY ===================== */}
        {activeCategory === 'timed' && (
          <>
            {/* Template 1: 1 Minute Test (Smart proportional 58 words) */}
            <div 
              className="rounded-2xl p-6 shadow-sm border flex flex-col items-center text-center justify-between gap-4 transition-all"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-main)',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-sky-500/15 text-[#0284c7] flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-ui" style={{ color: 'var(--text-main)' }}>1:00 Test</h3>
                <p className="text-xs mt-1 font-ui" style={{ color: 'var(--text-muted)' }}>
                  1 Minute quick typing speed and accuracy sprint.
                </p>
              </div>
              <button
                onClick={() => handleLaunch({
                  id: 'timed-1',
                  category: 'timed',
                  name: '1 Minute Typing Test',
                  subtitle: '1:00 Sprint',
                  durationSeconds: 60,
                  targetWords: getWordCountForDuration(60),
                })}
                className="w-full py-2.5 px-4 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer font-ui uppercase"
              >
                <Play size={14} className="fill-white" />
                <span>Start 1 Minute Test</span>
              </button>
            </div>

            {/* Template 2: 3 Minute Test (Smart proportional 160 words) */}
            <div 
              className="rounded-2xl p-6 shadow-sm border flex flex-col items-center text-center justify-between gap-4 transition-all"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-main)',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-sky-500/15 text-[#0284c7] flex items-center justify-center">
                <Timer size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-ui" style={{ color: 'var(--text-main)' }}>3:00 Test</h3>
                <p className="text-xs mt-1 font-ui" style={{ color: 'var(--text-muted)' }}>
                  3 Minute standard test (Matching Sample Screenshot 133122).
                </p>
              </div>
              <button
                onClick={() => handleLaunch({
                  id: 'timed-3',
                  category: 'timed',
                  name: '3 Minute Typing Test',
                  subtitle: '3:00 Standard Test',
                  durationSeconds: 180,
                  targetWords: getWordCountForDuration(180),
                })}
                className="w-full py-2.5 px-4 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer font-ui uppercase"
              >
                <Play size={14} className="fill-white" />
                <span>Start 3 Minute Test</span>
              </button>
            </div>

            {/* Template 3: CUSTOM TIME ENTER */}
            <div 
              className="rounded-2xl p-6 shadow-sm border-2 border-sky-500/60 flex flex-col justify-between gap-4"
              style={{
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-main)',
              }}
            >
              <div className="flex items-center gap-2">
                <Sliders size={20} className="text-[#0284c7]" />
                <h3 className="font-bold text-base font-ui" style={{ color: 'var(--text-main)' }}>Custom Time</h3>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-ui" style={{ color: 'var(--text-muted)' }}>
                  Enter your desired duration:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-subtle)' }}>Minutes</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      className="w-full text-center font-typing font-bold text-base p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--text-main)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-subtle)' }}>Seconds</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customSeconds}
                      onChange={(e) => setCustomSeconds(e.target.value)}
                      className="w-full text-center font-typing font-bold text-base p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--text-main)',
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleCustomTimeLaunch}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer font-ui uppercase"
              >
                <Play size={14} className="fill-white" />
                <span>Start Custom Test</span>
              </button>
            </div>
          </>
        )}

        {/* ===================== PAGE CATEGORY ===================== */}
        {activeCategory === 'page' && (
          <>
            {/* Template 1: 1 Page Test */}
            <div 
              className="rounded-2xl p-6 shadow-sm border flex flex-col items-center text-center justify-between gap-4"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-main)',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-ui" style={{ color: 'var(--text-main)' }}>1 Page Test</h3>
                <p className="text-xs mt-1 font-ui" style={{ color: 'var(--text-muted)' }}>
                  Approximately 60 words concise reading & typing test.
                </p>
              </div>
              <button
                onClick={() => handleLaunch({
                  id: 'page-1',
                  category: 'page',
                  name: '1 Page Typing Test',
                  subtitle: 'Single Page Drill',
                  targetWords: 60,
                })}
                className="w-full py-2.5 px-4 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer font-ui uppercase"
              >
                <Play size={14} className="fill-white" />
                <span>Start 1 Page Test</span>
              </button>
            </div>

            {/* Template 2: 2 Page Test */}
            <div 
              className="rounded-2xl p-6 shadow-sm border flex flex-col items-center text-center justify-between gap-4"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-main)',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-ui" style={{ color: 'var(--text-main)' }}>2 Page Test</h3>
                <p className="text-xs mt-1 font-ui" style={{ color: 'var(--text-muted)' }}>
                  Approximately 120 words comprehensive passage.
                </p>
              </div>
              <button
                onClick={() => handleLaunch({
                  id: 'page-2',
                  category: 'page',
                  name: '2 Page Typing Test',
                  subtitle: 'Double Page Drill',
                  targetWords: 120,
                })}
                className="w-full py-2.5 px-4 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer font-ui uppercase"
              >
                <Play size={14} className="fill-white" />
                <span>Start 2 Page Test</span>
              </button>
            </div>

            {/* Template 3: CUSTOM TEST AND UPLOAD (Opens Modal as requested by user) */}
            <div 
              className="rounded-2xl p-6 shadow-sm border-2 border-emerald-500/60 flex flex-col items-center text-center justify-between gap-4 transition-all"
              style={{
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-main)',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <Upload size={24} />
              </div>

              <div>
                <h3 className="font-bold text-lg font-ui" style={{ color: 'var(--text-main)' }}>
                  Custom Test & Upload
                </h3>
                <p className="text-xs mt-1 font-ui" style={{ color: 'var(--text-muted)' }}>
                  Upload your own .txt file or paste custom passage in modal.
                </p>
              </div>

              <button
                onClick={() => {
                  setCustomModalCategory('page');
                  setIsCustomUploadModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer font-ui uppercase"
              >
                <Upload size={15} />
                <span>Custom Test & Upload</span>
              </button>
            </div>
          </>
        )}

        {/* ===================== NUMERIC CATEGORY ===================== */}
        {activeCategory === 'numeric' && (
          <>
            {/* Template 1: 1 Minute Numeric */}
            <div 
              className="rounded-2xl p-6 shadow-sm border flex flex-col items-center text-center justify-between gap-4"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-main)',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center">
                <Calculator size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-ui" style={{ color: 'var(--text-main)' }}>1:00 Numeric Test</h3>
                <p className="text-xs mt-1 font-ui" style={{ color: 'var(--text-muted)' }}>
                  1 Minute rapid 10-key numeric keypad speed test.
                </p>
              </div>
              <button
                onClick={() => handleLaunch({
                  id: 'num-1',
                  category: 'numeric',
                  name: '1 Minute 10 Key Test',
                  subtitle: '10-Key Speed Drill',
                  durationSeconds: 60,
                }, CURATED_PASSAGES[3])}
                className="w-full py-2.5 px-4 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer font-ui uppercase"
              >
                <Play size={14} className="fill-white" />
                <span>Start 1 Minute Test</span>
              </button>
            </div>

            {/* Template 2: 3 Minute Numeric */}
            <div 
              className="rounded-2xl p-6 shadow-sm border flex flex-col items-center text-center justify-between gap-4"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-main)',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center">
                <Calculator size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-ui" style={{ color: 'var(--text-main)' }}>3:00 Numeric Test</h3>
                <p className="text-xs mt-1 font-ui" style={{ color: 'var(--text-muted)' }}>
                  3 Minute sustained numeric data entry proficiency.
                </p>
              </div>
              <button
                onClick={() => handleLaunch({
                  id: 'num-3',
                  category: 'numeric',
                  name: '3 Minute 10 Key Test',
                  subtitle: 'Sustained Numeric Test',
                  durationSeconds: 180,
                }, generateNumericDrill(40))}
                className="w-full py-2.5 px-4 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer font-ui uppercase"
              >
                <Play size={14} className="fill-white" />
                <span>Start 3 Minute Test</span>
              </button>
            </div>

            {/* Template 3: CUSTOM NUMERIC TEST & UPLOAD */}
            <div 
              className="rounded-2xl p-6 shadow-sm border-2 border-amber-500/60 flex flex-col items-center text-center justify-between gap-4 transition-all"
              style={{
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-main)',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center">
                <Upload size={24} />
              </div>

              <div>
                <h3 className="font-bold text-lg font-ui" style={{ color: 'var(--text-main)' }}>
                  Custom Test & Upload
                </h3>
                <p className="text-xs mt-1 font-ui" style={{ color: 'var(--text-muted)' }}>
                  Upload your own .txt file or paste custom numbers & data in modal.
                </p>
              </div>

              <button
                onClick={() => {
                  setCustomModalCategory('numeric');
                  setIsCustomUploadModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer font-ui uppercase"
              >
                <Upload size={15} />
                <span>Custom Test & Upload</span>
              </button>
            </div>
          </>
        )}

      </div>

      {/* Custom Test & Upload Modal */}
      <CustomUploadModal
        isOpen={isCustomUploadModalOpen}
        onClose={() => setIsCustomUploadModalOpen(false)}
        onStartCustomTest={onStartTest}
        categoryContext={customModalCategory}
      />

    </div>
  );
};
