import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { soundManager } from '../utils/sound';

export interface TypingStatsUpdate {
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  backspaceCount: number;
  correctCharsInText: number;
  errorCharsInText: number;
  totalCharsTyped: number;
  progressPercent: number;
}

interface TypingAreaProps {
  passageText: string;
  hasStarted: boolean;
  onFirstKey: () => void;
  onComplete: () => void;
  onStatsUpdate: (stats: TypingStatsUpdate) => void;
  isTestFinished: boolean;
  onExtendPassage?: () => void;
  onRestart?: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  passageText,
  hasStarted,
  onFirstKey,
  onComplete,
  onStatsUpdate,
  isTestFinished,
  onExtendPassage,
  onRestart,
}) => {
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  
  // High-precision keystroke counters
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [errorKeystrokes, setErrorKeystrokes] = useState<number>(0);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const cardScrollContainerRef = useRef<HTMLDivElement>(null);
  const activeCharSpanRef = useRef<HTMLSpanElement>(null);

  const totalLength = passageText.length;
  const currentIndex = typedChars.length;

  // Fully reset typing area internal state
  const resetTypingState = useCallback(() => {
    setTypedChars([]);
    setErrorIndices(new Set());
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setErrorKeystrokes(0);
    setBackspaceCount(0);
    if (cardScrollContainerRef.current) {
      cardScrollContainerRef.current.scrollTop = 0;
    }
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = '';
      hiddenInputRef.current.focus();
    }
  }, []);

  // Reset when text changes completely (different test)
  useEffect(() => {
    resetTypingState();
  }, [passageText, resetTypingState]);

  // Reset when test is restarted from outside (e.g. handleRedo)
  useEffect(() => {
    if (!hasStarted && !isTestFinished) {
      resetTypingState();
    }
  }, [hasStarted, isTestFinished, resetTypingState]);

  // Global window listener: press Esc to quickly restart from anywhere during test
  useEffect(() => {
    const handleGlobalEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isTestFinished) {
        e.preventDefault();
        resetTypingState();
        onRestart?.();
      }
    };
    window.addEventListener('keydown', handleGlobalEsc);
    return () => window.removeEventListener('keydown', handleGlobalEsc);
  }, [isTestFinished, resetTypingState, onRestart]);

  // Maintain active input focus
  const keepFocus = useCallback(() => {
    if (hiddenInputRef.current && !isTestFinished) {
      hiddenInputRef.current.focus();
    }
  }, [isTestFinished]);

  useEffect(() => {
    keepFocus();
  }, [keepFocus, isTestFinished]);

  // Auto-scroll logic: ensures active character is smoothly centered in view
  useEffect(() => {
    if (activeCharSpanRef.current && cardScrollContainerRef.current) {
      const charEl = activeCharSpanRef.current;
      const containerEl = cardScrollContainerRef.current;

      const charTop = charEl.offsetTop;
      const containerScroll = containerEl.scrollTop;
      const containerHeight = containerEl.clientHeight;

      const idealScroll = charTop - (containerHeight * 0.32);

      if (charTop - containerScroll > containerHeight * 0.55 || charTop - containerScroll < containerHeight * 0.15) {
        containerEl.scrollTo({
          top: Math.max(0, idealScroll),
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  // Parse passage into intact words to prevent words breaking across lines
  const wordTokens = useMemo(() => {
    const tokens: {
      wordChars: { char: string; index: number }[];
      spaceIndex?: number;
      isNewline?: boolean;
    }[] = [];

    let currentWord: { char: string; index: number }[] = [];

    for (let i = 0; i < passageText.length; i++) {
      const ch = passageText[i];
      if (ch === ' ' || ch === '\n') {
        tokens.push({
          wordChars: currentWord,
          spaceIndex: i,
          isNewline: ch === '\n',
        });
        currentWord = [];
      } else {
        currentWord.push({ char: ch, index: i });
      }
    }

    if (currentWord.length > 0) {
      tokens.push({
        wordChars: currentWord,
      });
    }

    return tokens;
  }, [passageText]);

  // Handle all keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTestFinished) return;

    // Esc key: quickly restart test
    if (e.key === 'Escape') {
      e.preventDefault();
      resetTypingState();
      onRestart?.();
      return;
    }

    // Ignore browser system commands
    if (e.key === 'Tab' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Meta' || e.key === 'F5' || e.key === 'F12') {
      return;
    }

    if (!hasStarted) {
      onFirstKey();
    }

    // Handle Backspace: remove last typed character and track corrections
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedChars.length > 0) {
        const nextTyped = [...typedChars];
        nextTyped.pop();
        const nextErrors = new Set(errorIndices);
        nextErrors.delete(typedChars.length - 1);

        const newBackspaceCount = backspaceCount + 1;
        const newTotalKeystrokes = totalKeystrokes + 1;

        setTypedChars(nextTyped);
        setErrorIndices(nextErrors);
        setBackspaceCount(newBackspaceCount);
        setTotalKeystrokes(newTotalKeystrokes);

        // Calculate live character counts
        const correctInText = nextTyped.filter((ch, i) => {
          const exp = passageText[i];
          return ch === exp || ((exp === '\n' || exp === ' ') && (ch === ' ' || ch === '\n'));
        }).length;
        const errorInText = nextErrors.size;

        onStatsUpdate({
          totalKeystrokes: newTotalKeystrokes,
          correctKeystrokes,
          errorKeystrokes,
          backspaceCount: newBackspaceCount,
          correctCharsInText: correctInText,
          errorCharsInText: errorInText,
          totalCharsTyped: nextTyped.length,
          progressPercent: totalLength > 0 ? (nextTyped.length / totalLength) * 100 : 0,
        });
      }
      return;
    }

    // Determine pressed character key (support Space and Enter for whitespace/newlines)
    let pressedChar: string | null = null;
    if (e.key === 'Enter') {
      pressedChar = ' ';
    } else if (e.key.length === 1) {
      pressedChar = e.key;
    }

    if (pressedChar !== null) {
      e.preventDefault();

      if (currentIndex >= totalLength) {
        // If user typed faster than the passage, trigger seamless extension if supported
        if (onExtendPassage) {
          onExtendPassage();
        }
        return;
      }

      const expected = passageText[currentIndex];
      // Match characters; accept both space and enter for newline characters in custom text
      const isCorrect = (expected === '\n' && (pressedChar === ' ' || pressedChar === '\n'))
        || pressedChar === expected;

      // Audio feedback
      if (isCorrect) {
        if (pressedChar === ' ' || expected === ' ' || expected === '\n') {
          soundManager.playSpaceKey();
        } else {
          soundManager.playKeyClick();
        }
      } else {
        soundManager.playError();
      }

      const nextTyped = [...typedChars, pressedChar];
      const nextErrors = new Set(errorIndices);
      if (!isCorrect) {
        nextErrors.add(currentIndex);
      }

      const nextTotalStrokes = totalKeystrokes + 1;
      const nextCorrectStrokes = isCorrect ? correctKeystrokes + 1 : correctKeystrokes;
      const nextErrorStrokes = !isCorrect ? errorKeystrokes + 1 : errorKeystrokes;

      const correctInText = nextTyped.filter((ch, i) => {
        const exp = passageText[i];
        return ch === exp || ((exp === '\n' || exp === ' ') && (ch === ' ' || ch === '\n'));
      }).length;
      const errorInText = nextErrors.size;

      setTypedChars(nextTyped);
      setErrorIndices(nextErrors);
      setTotalKeystrokes(nextTotalStrokes);
      setCorrectKeystrokes(nextCorrectStrokes);
      setErrorKeystrokes(nextErrorStrokes);

      const progress = totalLength > 0 ? (nextTyped.length / totalLength) * 100 : 100;

      onStatsUpdate({
        totalKeystrokes: nextTotalStrokes,
        correctKeystrokes: nextCorrectStrokes,
        errorKeystrokes: nextErrorStrokes,
        backspaceCount,
        correctCharsInText: correctInText,
        errorCharsInText: errorInText,
        totalCharsTyped: nextTyped.length,
        progressPercent: progress,
      });

      // Check if nearing end and eligible for dynamic extension
      if (nextTyped.length >= totalLength - 10 && onExtendPassage) {
        onExtendPassage();
      }

      // Check completion
      if (nextTyped.length >= totalLength) {
        soundManager.playComplete();
        onComplete();
      }
    }
  };

  return (
    <div 
      onClick={keepFocus}
      className="relative w-full max-w-4xl mx-auto my-auto px-4 sm:px-6 py-4 flex flex-col items-center justify-center cursor-text select-none"
    >
      {/* Invisible input capturing keystrokes */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute -top-9999px left-0 w-1 h-1 pointer-events-none"
        onKeyDown={handleKeyDown}
        autoFocus
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      <div className="relative w-full">
        
        {/* Floating "Start Typing!" Tooltip */}
        {!hasStarted && currentIndex === 0 && (
          <div className="absolute -top-11 left-6 z-20 flex flex-col items-start animate-soft-bounce pointer-events-none">
            <div className="bg-[#383a42] text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg tracking-wide flex items-center font-ui">
              <span>Start Typing!</span>
            </div>
            {/* Tooltip Downward Arrow pointer */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-[#383a42] ml-3.5" />
          </div>
        )}

        {/* Minimal Modern Typing Card Container */}
        <div 
          ref={cardScrollContainerRef}
          className="w-full rounded-3xl p-6 sm:p-10 shadow-lg border max-h-[50vh] sm:max-h-[54vh] overflow-y-auto relative transition-colors duration-200"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-main)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Main Text Content: Clean character-level highlighting and smooth caret */}
          <div className="font-typing text-base sm:text-lg md:text-[1.25rem] leading-[2.2rem] sm:leading-[2.5rem] md:leading-[2.7rem] tracking-normal text-left select-none">
            {wordTokens.map((token, tokenIdx) => {
              const { wordChars, spaceIndex } = token;

              return (
                <React.Fragment key={tokenIdx}>
                  {/* Word container (Prevents mid-word breaking across lines) */}
                  <span className="inline-block whitespace-nowrap">
                    {wordChars.map(({ char, index }) => {
                      const isTyped = index < currentIndex;
                      const isCurrent = index === currentIndex;
                      const isCorrect = isTyped && typedChars[index] === char;
                      const isError = isTyped && !isCorrect;

                      const style: React.CSSProperties = {
                        backgroundColor: 'transparent',
                      };

                      if (isCorrect) {
                        // Correctly typed character: clean green text, no background block
                        style.color = 'var(--char-correct-text)';
                        style.fontWeight = '500';
                      } else if (isError) {
                        // Mistyped character: crisp red text with accessible subtle underline
                        style.color = 'var(--char-error-text)';
                        style.fontWeight = '600';
                        style.borderBottom = '2px solid var(--char-error-text)';
                      } else {
                        // Untyped upcoming character
                        style.color = 'var(--char-untyped)';
                      }

                      return (
                        <React.Fragment key={index}>
                          {/* Thin Vertical Blinking Caret right before the current character */}
                          {isCurrent && (
                            <span
                              aria-hidden="true"
                              className="inline-block w-[2px] sm:w-[2.5px] rounded-full bg-[#0284c7] dark:bg-sky-400 animate-cursor-blink select-none pointer-events-none"
                              style={{
                                height: '1.2em',
                                marginLeft: '-1px',
                                marginRight: '-1.5px',
                                verticalAlign: '-0.18em',
                              }}
                            />
                          )}

                          <span
                            ref={isCurrent ? activeCharSpanRef : undefined}
                            className="inline-block transition-colors duration-75 px-[0.5px] font-typing"
                            style={style}
                          >
                            {char}
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </span>

                  {/* Space character */}
                  {spaceIndex !== undefined && (() => {
                    const isTyped = spaceIndex < currentIndex;
                    const isCurrent = spaceIndex === currentIndex;
                    const expChar = passageText[spaceIndex];
                    const isError = isTyped && typedChars[spaceIndex] !== ' ' && (expChar !== '\n' || typedChars[spaceIndex] !== '\n');

                    return (
                      <React.Fragment key={`space-fragment-${spaceIndex}`}>
                        {/* Caret before space if current */}
                        {isCurrent && (
                          <span
                            aria-hidden="true"
                            className="inline-block w-[2px] sm:w-[2.5px] rounded-full bg-[#0284c7] dark:bg-sky-400 animate-cursor-blink select-none pointer-events-none"
                            style={{
                              height: '1.2em',
                              marginLeft: '-1px',
                              marginRight: '-1.5px',
                              verticalAlign: '-0.18em',
                            }}
                          />
                        )}

                        <span
                          ref={isCurrent ? activeCharSpanRef : undefined}
                          className="inline-block transition-colors duration-75 px-[1px] font-typing select-none"
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: isError ? '2px solid var(--char-error-text)' : undefined,
                          }}
                        >
                          {isError ? (
                            <span className="text-rose-500 font-typing text-xs sm:text-sm font-bold">_</span>
                          ) : (
                            '\u00A0'
                          )}
                        </span>
                      </React.Fragment>
                    );
                  })()}
                </React.Fragment>
              );
            })}

            {/* Caret at the very end of passage */}
            {currentIndex >= totalLength && totalLength > 0 && (
              <span
                aria-hidden="true"
                className="inline-block w-[2px] sm:w-[2.5px] rounded-full bg-[#0284c7] dark:bg-sky-400 animate-cursor-blink select-none pointer-events-none"
                style={{
                  height: '1.2em',
                  marginLeft: '1px',
                  verticalAlign: '-0.18em',
                }}
              />
            )}
          </div>
        </div>

      </div>

      {/* Bottom Hint */}
      <div 
        className="mt-4 flex items-center justify-between w-full max-w-5xl px-2 text-xs font-ui"
        style={{ color: 'var(--text-muted)' }}
      >
        <div className="flex items-center gap-2">
          <span 
            className="px-2 py-0.5 rounded text-[11px] font-typing border shadow-xs"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-main)',
            }}
          >
            Esc
          </span>
          <span>Press <strong style={{ color: 'var(--text-main)' }}>Esc</strong> to quickly restart</span>
        </div>
        <div className="font-typing text-xs">
          <span style={{ color: 'var(--text-main)' }}>{currentIndex}</span> / <span>{totalLength} chars</span>
        </div>
      </div>
    </div>
  );
};
