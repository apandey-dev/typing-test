// Industry-Standard Typing Test Scientific Calculation Engine

export interface CalculationInput {
  totalKeystrokes: number;       // All key presses attempted (including errors and backspaces)
  correctKeystrokes: number;     // Key presses that matched the expected character
  errorKeystrokes: number;       // Key presses that did not match expected character
  backspaceCount: number;        // Number of backspaces used
  correctCharsInText: number;    // Correct characters currently in the passage
  errorCharsInText: number;      // Uncorrected errors currently in the passage
  totalCharsTyped: number;       // Total characters typed forward (currentIndex)
  passageLength: number;         // Total length of target passage
  elapsedMilliseconds: number;   // Precise elapsed time in milliseconds
  wpmHistory?: number[];         // Periodic samples of instantaneous WPM for consistency
}

export interface DetailedStats {
  netWpm: number;                // Standard net words per minute (industry standard)
  rawWpm: number;                // Gross words per minute based on all forward characters
  grossWpm: number;              // Gross words per minute based on total keystrokes
  accuracy: number;              // Final accuracy %: (correctChars / totalCharsTyped) * 100
  keystrokeAccuracy: number;     // Keystroke accuracy %: (correctKeystrokes / totalKeystrokes) * 100
  cpm: number;                   // Characters per minute
  elapsedSeconds: number;        // Elapsed seconds (rounded)
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  backspaceCount: number;
  totalCharsTyped: number;
  correctCharsInText: number;
  errorCharsInText: number;
  consistency: number;           // Typing consistency score (0 - 100%)
  bestWpm: number;               // Highest instantaneous WPM recorded
  rank: ProficiencyRank;         // Performance Rank (Beginner -> Master)
  tier: {
    title: string;
    level: string;
    xp: string;
    color: string;
  };
}

export type ProficiencyRank = 'Beginner' | 'Developing' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';

export function calculatePerformanceRank(netWpm: number, accuracy: number): ProficiencyRank {
  if (netWpm >= 90 && accuracy >= 97) return 'Master';
  if (netWpm >= 70 && accuracy >= 95) return 'Expert';
  if (netWpm >= 50 && accuracy >= 92) return 'Advanced';
  if (netWpm >= 35 && accuracy >= 88) return 'Intermediate';
  if (netWpm >= 20 && accuracy >= 80) return 'Developing';
  return 'Beginner';
}

/**
 * Universal Typing Formula Standards:
 * - 1 standard typing 'word' = 5 characters (including letters, spaces, and punctuation).
 * - Elapsed Time (Minutes) = elapsedMilliseconds / 60,000.
 * 
 * Gross WPM = (Total Typed Characters / 5) / Elapsed Minutes
 * Net WPM = max(0, ((Total Typed Characters / 5) - Uncorrected Errors) / Elapsed Minutes)
 * 
 * Keystroke Accuracy = (Correct Keystrokes / Total Keystrokes) * 100
 * Accuracy = (Correct Characters In Text / Total Characters Typed) * 100
 */
export function calculateTypingStats(input: CalculationInput): DetailedStats {
  const {
    totalKeystrokes,
    correctKeystrokes,
    errorKeystrokes,
    backspaceCount,
    correctCharsInText,
    errorCharsInText,
    totalCharsTyped,
    elapsedMilliseconds,
    wpmHistory = [],
  } = input;

  // Use precise fractional minutes, minimum 1 second (1/60 min) to avoid division by zero
  const elapsedMinutes = Math.max(elapsedMilliseconds / 60000, 1 / 60);
  const elapsedSeconds = Math.max(1, Math.round(elapsedMilliseconds / 1000));

  // Gross WPM: based on total characters typed forward divided by 5 words
  const rawWpm = Math.max(0, Math.round((totalCharsTyped / 5) / elapsedMinutes));

  // Gross WPM based on total keystrokes
  const grossWpm = Math.max(0, Math.round((totalKeystrokes / 5) / elapsedMinutes));

  // Net WPM: Deducts uncorrected errors from typed words (Standard typing competition formula)
  // Net Words = max(0, (totalCharsTyped / 5) - errorCharsInText)
  const netWords = Math.max(0, (totalCharsTyped / 5) - errorCharsInText);
  const netWpm = Math.max(0, Math.round(netWords / elapsedMinutes));

  // Accuracy %: Ratio of correctly typed characters to total characters entered
  const accuracy = totalCharsTyped > 0
    ? Math.max(0, Math.min(100, Math.round((correctCharsInText / totalCharsTyped) * 100)))
    : 100;

  // Keystroke Accuracy %: Considers mistypes even if corrected with backspace
  const keystrokeAccuracy = totalKeystrokes > 0
    ? Math.max(0, Math.min(100, Math.round((correctKeystrokes / totalKeystrokes) * 100)))
    : 100;

  // Characters per minute (CPM)
  const cpm = Math.max(0, Math.round(totalCharsTyped / elapsedMinutes));

  // Consistency Score calculation (using Coefficient of Variation: 100 - CV)
  let consistency = 100;
  let bestWpm = Math.max(netWpm, rawWpm);

  if (wpmHistory.length >= 2) {
    const validSamples = wpmHistory.filter((v) => typeof v === 'number' && !isNaN(v) && v > 0);
    if (validSamples.length >= 2) {
      bestWpm = Math.max(bestWpm, ...validSamples);
      const mean = validSamples.reduce((a, b) => a + b, 0) / validSamples.length;
      if (mean > 0) {
        const variance = validSamples.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / validSamples.length;
        const stdDev = Math.sqrt(variance);
        const cv = (stdDev / mean) * 100;
        consistency = Math.max(0, Math.min(100, Math.round(100 - cv)));
      }
    }
  }

  // Proficiency Tier Assessment
  let tier = { title: 'Typing Seedling', level: '1/5', xp: '2,500 XP', color: 'text-teal-600' };
  if (netWpm >= 85) {
    tier = { title: 'Typing Grandmaster', level: '5/5', xp: '15,000 XP', color: 'text-amber-500' };
  } else if (netWpm >= 65) {
    tier = { title: 'Speed Specialist', level: '4/5', xp: '10,000 XP', color: 'text-sky-500' };
  } else if (netWpm >= 45) {
    tier = { title: 'Fluent Typist', level: '3/5', xp: '7,000 XP', color: 'text-emerald-500' };
  } else if (netWpm >= 28) {
    tier = { title: 'Steady Practitioner', level: '2/5', xp: '4,500 XP', color: 'text-indigo-500' };
  }

  // Calculate standard performance rank
  const rank = calculatePerformanceRank(netWpm, accuracy);

  return {
    netWpm,
    rawWpm,
    grossWpm,
    accuracy,
    keystrokeAccuracy,
    cpm,
    elapsedSeconds,
    totalKeystrokes,
    correctKeystrokes,
    errorKeystrokes,
    backspaceCount,
    totalCharsTyped,
    correctCharsInText,
    errorCharsInText,
    consistency,
    bestWpm,
    rank,
    tier,
  };
}
