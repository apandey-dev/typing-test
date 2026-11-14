import React, { useState } from 'react';
import { X, BookOpen, Check, RefreshCw } from 'lucide-react';
import { GeneratedParagraph, CURATED_PASSAGES } from '../utils/paragraphGenerator';
import { paragraphService } from '../services/paragraphService';

interface PassageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPassage: GeneratedParagraph;
  onSelectPassage: (passage: GeneratedParagraph) => void;
}

export const PassageModal: React.FC<PassageModalProps> = ({
  isOpen,
  onClose,
  selectedPassage,
  onSelectPassage,
}) => {
  const [passagesList, setPassagesList] = useState<GeneratedParagraph[]>(CURATED_PASSAGES);

  if (!isOpen) return null;

  const handleGenerateFresh = () => {
    const r2Sel = paragraphService.selectParagraph();
    const fresh: GeneratedParagraph = {
      id: r2Sel.id,
      title: r2Sel.title,
      category: 'general',
      text: r2Sel.text,
      wordCount: r2Sel.wordCount,
    };
    setPassagesList((prev) => [fresh, ...prev]);
    onSelectPassage(fresh);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none font-ui">
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
          className="p-4 sm:p-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-[#0284c7]" />
            <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--text-main)' }}>
              Select or Generate Passage
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Generate Fresh Button */}
        <div 
          className="p-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: 'var(--card-bg-subtle)',
            borderColor: 'var(--card-border)',
          }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Need fresh text? Generate a new random paragraph:
          </span>
          <button
            onClick={handleGenerateFresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Generate New</span>
          </button>
        </div>

        {/* Passage list */}
        <div className="p-4 flex flex-col gap-2.5 max-h-[55vh] overflow-y-auto">
          {passagesList.map((passage) => {
            const isSelected = selectedPassage.id === passage.id;
            return (
              <div
                key={passage.id}
                onClick={() => {
                  onSelectPassage(passage);
                  onClose();
                }}
                className="p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 shadow-xs"
                style={{
                  backgroundColor: isSelected ? 'var(--card-bg-subtle)' : 'var(--card-bg)',
                  borderColor: isSelected ? '#0284c7' : 'var(--card-border)',
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm" style={{ color: isSelected ? '#0284c7' : 'var(--text-main)' }}>
                      {passage.title}
                    </h4>
                    <span 
                      className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {passage.category}
                    </span>
                    <span className="text-[10px] font-typing" style={{ color: 'var(--text-subtle)' }}>
                      {passage.wordCount} words
                    </span>
                  </div>
                  <p className="text-xs line-clamp-2 mt-1 font-typing" style={{ color: 'var(--text-muted)' }}>
                    {passage.text}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0">
                    <Check size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
