/**
 * Clinical Real-Time Fluency Scoring Engine
 * Based on Speech-Language Pathology (SLP) standards:
 * - SSI-4 (Stuttering Severity Instrument)
 * - Oral Reading Fluency & Target Text Alignment Standards
 * - Camperdown Behavioral Prolonged Speech Metrics
 * - Continuous Phonation Ratio & Acoustic Pacing Formulae
 */

export interface FormulaComponentBreakdown {
  name: string;
  weightPct: number;
  rawScore: number;
  weightedScore: number;
  metricLabel: string;
  metricValue: string;
  status: 'optimal' | 'acceptable' | 'needs_work';
  description: string;
}

export interface TargetWordMatchItem {
  id: number;
  word: string;
  cleanWord: string;
  isMatched: boolean;
  isCurrent: boolean;
  isPending: boolean;
}

export interface TargetTextAlignmentResult {
  targetWords: TargetWordMatchItem[];
  matchedWordsCount: number;
  totalTargetWords: number;
  spokenWordsCount: number;
  offTargetWordsCount: number;
  targetAccuracyPct: number; // % of spoken words that match the target exercise
  targetCompletionPct: number; // % of the target sentence completed
  offTargetWords: string[];
  currentExpectedIndex: number;
  statusMessage: string;
}

export interface RealTimeFluencyState {
  overallScore: number;
  disfluencyRatePct: number;
  currentWpm: number;
  targetWpm: number;
  durationSeconds: number;
  totalWords: number;
  fluentWordsCount: number;
  disfluentEventsCount: number;
  repetitionsCount: number;
  prolongationsCount: number;
  blocksCount: number;
  voicedContinuityPct: number;
  pitchStabilityPct: number;
  averagePitchHz: number;
  rmsVolumePct: number;
  isFreeSpeechMode: boolean;
  targetAccuracyPct: number;
  targetCompletionPct: number;
  matchedWordsCount: number;
  offTargetWordsCount: number;
  offTargetWords: string[];
  targetAlignmentMessage: string;
  formulaEquation: string;
  components: {
    targetMatchFactor?: FormulaComponentBreakdown;
    disfluencyFactor: FormulaComponentBreakdown;
    pacingFactor: FormulaComponentBreakdown;
    continuityFactor: FormulaComponentBreakdown;
    stabilityFactor: FormulaComponentBreakdown;
  };
  clinicalLevel: 'Exceptional Fluency' | 'Functional Fluency' | 'Mild Disfluency' | 'Moderate Disfluency' | 'Significant Disfluency' | 'Off-Target Speech' | 'Awaiting Speech';
  liveEvents: Array<{
    id: string;
    timestampSec: number;
    type: 'repetition' | 'prolongation' | 'block' | 'pace_warning';
    label: string;
    detail: string;
  }>;
}

/**
 * Normalizes a single word for robust linguistic comparison:
 * strips punctuation, handles stutter hyphens (e.g. "p-p-peter" -> "peter").
 */
function normalizeWord(raw: string): string {
  const clean = raw.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
  // If word has stutter hyphens like p-p-peter or b-ball
  const parts = clean.split('-').filter(Boolean);
  if (parts.length > 1) {
    return parts[parts.length - 1]; // return the base intended phoneme/word
  }
  return clean;
}

/**
 * Calculates Levenshtein edit distance to tolerate slight speech-to-text variance
 */
function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Evaluates real-time alignment between the spoken transcript and the exercise prompt
 */
export function evaluateTargetTextAlignment(spokenText: string, targetText: string): TargetTextAlignmentResult {
  if (!targetText || !targetText.trim()) {
    return {
      targetWords: [],
      matchedWordsCount: 0,
      totalTargetWords: 0,
      spokenWordsCount: 0,
      offTargetWordsCount: 0,
      targetAccuracyPct: 100,
      targetCompletionPct: 0,
      offTargetWords: [],
      currentExpectedIndex: 0,
      statusMessage: 'Ready to begin.'
    };
  }

  const rawTargetTokens = targetText.split(/\s+/).filter(Boolean);
  const targetWordsData: TargetWordMatchItem[] = rawTargetTokens.map((raw, idx) => ({
    id: idx,
    word: raw,
    cleanWord: normalizeWord(raw),
    isMatched: false,
    isCurrent: false,
    isPending: true
  }));

  const cleanSpokenTokens = (spokenText || '')
    .split(/\s+/)
    .map(normalizeWord)
    .filter((w) => w.length > 0);

  let targetIndex = 0;
  const offTargetWords: string[] = [];
  let matchedCount = 0;
  let targetRepetitionsCount = 0;

  const hesitationFillers = new Set(['uh', 'um', 'er', 'ah', 'hmm', 'eh']);

  for (let sIdx = 0; sIdx < cleanSpokenTokens.length; sIdx++) {
    const spoken = cleanSpokenTokens[sIdx];

    // If it's a hesitation filler (uh, um, er), it's part of stuttering pattern, not off-target speech
    if (hesitationFillers.has(spoken)) {
      continue;
    }

    if (targetIndex >= targetWordsData.length) {
      // Check if user is repeating the last target word (e.g. at the end of sentence)
      if (targetIndex > 0 && (spoken === targetWordsData[targetIndex - 1].cleanWord || levenshteinDistance(spoken, targetWordsData[targetIndex - 1].cleanWord) <= 1)) {
        targetRepetitionsCount++;
        continue;
      }
      // User has finished target text and is saying extra words
      offTargetWords.push(spoken);
      continue;
    }

    const currentTarget = targetWordsData[targetIndex];
    const prevTarget = targetIndex > 0 ? targetWordsData[targetIndex - 1] : null;

    // Check if user is stuttering/repeating the previous word (e.g. "peter peter opened")
    if (prevTarget && (spoken === prevTarget.cleanWord || (prevTarget.cleanWord.length > 3 && levenshteinDistance(spoken, prevTarget.cleanWord) <= 1))) {
      targetRepetitionsCount++;
      continue;
    }

    // Check direct match, fuzzy match, or common inflected forms (e.g. open/opened, pastry/pastries)
    const isDirectMatch = spoken === currentTarget.cleanWord;
    const isFuzzyMatch = currentTarget.cleanWord.length > 3 && levenshteinDistance(spoken, currentTarget.cleanWord) <= 1;
    const isInflectedMatch = currentTarget.cleanWord.length > 4 && (
      spoken.startsWith(currentTarget.cleanWord.slice(0, 4)) ||
      currentTarget.cleanWord.startsWith(spoken.slice(0, 4))
    );

    if (isDirectMatch || isFuzzyMatch || isInflectedMatch) {
      targetWordsData[targetIndex].isMatched = true;
      targetWordsData[targetIndex].isPending = false;
      targetIndex++;
      matchedCount++;
    } else {
      // Check lookahead of 1 word (in case user skipped a small word like "the", "a")
      let matchedLookahead = false;
      if (targetIndex + 1 < targetWordsData.length) {
        const nextTarget = targetWordsData[targetIndex + 1];
        if (spoken === nextTarget.cleanWord || (nextTarget.cleanWord.length > 3 && levenshteinDistance(spoken, nextTarget.cleanWord) <= 1)) {
          // Skipped word
          targetWordsData[targetIndex + 1].isMatched = true;
          targetWordsData[targetIndex + 1].isPending = false;
          targetIndex += 2;
          matchedCount++;
          matchedLookahead = true;
        }
      }

      if (!matchedLookahead) {
        offTargetWords.push(spoken);
      }
    }
  }

  // Mark current expected word
  if (targetIndex < targetWordsData.length) {
    targetWordsData[targetIndex].isCurrent = true;
  }

  const spokenCount = cleanSpokenTokens.length;
  const offTargetCount = offTargetWords.length;

  let targetAccuracyPct = 100;
  if (spokenCount > 0) {
    // Only genuinely off-target words degrade target reading accuracy
    const onTargetTokens = spokenCount - offTargetCount;
    targetAccuracyPct = Math.max(0, Math.min(100, Math.round((onTargetTokens / spokenCount) * 100)));
  }

  const targetCompletionPct = Math.round((matchedCount / targetWordsData.length) * 100);

  let statusMessage = 'Ready to read prompt.';
  if (spokenCount === 0) {
    statusMessage = 'Awaiting speech. Begin reading aloud.';
  } else if (offTargetCount > 0 && matchedCount === 0) {
    statusMessage = `Off-target words detected ("${offTargetWords.slice(0, 3).join(' ')}..."). Please read the exercise prompt above.`;
  } else if (offTargetCount > 0) {
    statusMessage = `${matchedCount} target words read, but ${offTargetCount} off-target word(s) detected.`;
  } else if (targetRepetitionsCount > 0) {
    statusMessage = `Target reading with ${targetRepetitionsCount} repetition(s) detected.`;
  } else if (matchedCount === targetWordsData.length) {
    statusMessage = 'Exercise prompt completed with 100% target accuracy!';
  } else {
    statusMessage = `Target reading in progress: ${matchedCount}/${targetWordsData.length} words matched accurately.`;
  }

  return {
    targetWords: targetWordsData,
    matchedWordsCount: matchedCount,
    totalTargetWords: targetWordsData.length,
    spokenWordsCount: spokenCount,
    offTargetWordsCount: offTargetCount,
    targetAccuracyPct,
    targetCompletionPct,
    offTargetWords,
    currentExpectedIndex: targetIndex,
    statusMessage
  };
}

/**
 * Mathematical Calculation of Fluency Score based on SLP Metrics
 */
export function calculateClinicalFluencyScore(params: {
  totalWords: number;
  repetitions: number;
  prolongations: number;
  blocks: number;
  durationSec: number;
  targetWpm: number;
  voicedFramesPct: number;
  pitchStabilityPct: number;
  averagePitchHz?: number;
  isFreeSpeechMode?: boolean;
  targetAccuracyPct?: number; // 0 - 100
  targetCompletionPct?: number; // 0 - 100
  matchedWordsCount?: number;
  offTargetWordsCount?: number;
}): {
  overallScore: number;
  disfluencyRatePct: number;
  currentWpm: number;
  components: RealTimeFluencyState['components'];
  clinicalLevel: RealTimeFluencyState['clinicalLevel'];
  formulaEquation: string;
} {
  const {
    totalWords,
    repetitions,
    prolongations,
    blocks,
    durationSec,
    targetWpm,
    voicedFramesPct,
    pitchStabilityPct,
    isFreeSpeechMode = false,
    targetAccuracyPct = 100,
    offTargetWordsCount = 0
  } = params;

  // 0. Handle Pre-speech / Baseline State
  if (totalWords === 0) {
    const awaitingComponents: RealTimeFluencyState['components'] = {
      targetMatchFactor: !isFreeSpeechMode ? {
        name: 'Target Word Match',
        weightPct: 35,
        rawScore: 0,
        weightedScore: 0,
        metricLabel: 'Target Match',
        metricValue: '0%',
        status: 'needs_work',
        description: 'Measures alignment with the assigned exercise sentence.'
      } : undefined,
      disfluencyFactor: {
        name: 'Disfluency Rate (%SS)',
        weightPct: isFreeSpeechMode ? 45 : 30,
        rawScore: 0,
        weightedScore: 0,
        metricLabel: 'Disfluency Freq',
        metricValue: '0%',
        status: 'optimal',
        description: 'Percentage of words affected by sound repetitions, prolongations, or articulatory blocks.'
      },
      pacingFactor: {
        name: 'Pacing Adherence',
        weightPct: isFreeSpeechMode ? 25 : 20,
        rawScore: 0,
        weightedScore: 0,
        metricLabel: 'Speaking Rate',
        metricValue: `0 WPM (Target: ${targetWpm})`,
        status: 'acceptable',
        description: 'Consistency of articulatory pacing compared to therapeutic target words per minute.'
      },
      continuityFactor: {
        name: 'Phonation Continuity',
        weightPct: isFreeSpeechMode ? 20 : 15,
        rawScore: 0,
        weightedScore: 0,
        metricLabel: 'Voiced Continuity',
        metricValue: '0%',
        status: 'acceptable',
        description: 'Continuous vocal fold vibration and absence of tense pre-phonatory block freezes.'
      },
      stabilityFactor: {
        name: 'Acoustic Stability',
        weightPct: isFreeSpeechMode ? 10 : 0,
        rawScore: 0,
        weightedScore: 0,
        metricLabel: 'Pitch Stability',
        metricValue: '0%',
        status: 'acceptable',
        description: 'Laryngeal relaxation, absence of abrupt vocal strain spikes and frequency tremors.'
      }
    };

    return {
      overallScore: 0,
      disfluencyRatePct: 0,
      currentWpm: 0,
      formulaEquation: 'Awaiting speech...',
      components: awaitingComponents,
      clinicalLevel: 'Awaiting Speech'
    };
  }

  // 1. Calculate WPM (Words Per Minute) with Progressive Warm-up Pacing
  const effectiveDuration = Math.max(durationSec, 1);
  const rawWpm = Math.min(260, Math.round((totalWords / effectiveDuration) * 60));
  let currentWpm = rawWpm;
  let pacingScoreRaw: number;

  if (totalWords > 0 && totalWords <= 5 && durationSec <= 8) {
    // Early articulation phase: judge by inter-word cadence rather than raw (words/totalSec)*60
    const secPerWord = durationSec / totalWords;
    if (secPerWord >= 0.25 && secPerWord <= 1.2) {
      currentWpm = Math.max(rawWpm, targetWpm);
      pacingScoreRaw = 100;
    } else if (secPerWord > 1.2) {
      currentWpm = Math.max(30, Math.round(60 / secPerWord));
      const wpmDelta = Math.abs(currentWpm - targetWpm);
      pacingScoreRaw = Math.max(45, 100 - wpmDelta * 1.2);
    } else {
      pacingScoreRaw = 92;
    }
  } else {
    // Steady-state reading pace: comfortable reading range 85 - 155 WPM
    const wpmDelta = Math.abs(currentWpm - targetWpm);
    if (wpmDelta <= 25) {
      pacingScoreRaw = 100;
    } else if (wpmDelta <= 45) {
      pacingScoreRaw = Math.max(65, 100 - (wpmDelta - 25) * 1.5);
    } else {
      pacingScoreRaw = Math.max(25, 65 - (wpmDelta - 45) * 1.0);
    }
  }

  // 2. Disfluency Rate (%SS - Percentage of Stuttered Syllables/Words)
  const totalDisfluentEvents = repetitions + prolongations + blocks;
  const rawDisfluencyRate = (totalDisfluentEvents / totalWords) * 100;
  const disfluencyRatePct = Math.round(rawDisfluencyRate * 10) / 10;

  // Clinically graded Disfluency Factor (%SS)
  let disfluencyScoreRaw: number;
  if (disfluencyRatePct <= 1.0) {
    disfluencyScoreRaw = 100;
  } else if (disfluencyRatePct <= 5.0) {
    disfluencyScoreRaw = Math.max(80, 100 - disfluencyRatePct * 4);
  } else if (disfluencyRatePct <= 12.0) {
    disfluencyScoreRaw = Math.max(50, 80 - (disfluencyRatePct - 5) * 4.2);
  } else {
    disfluencyScoreRaw = Math.max(15, 50 - (disfluencyRatePct - 12) * 2.2);
  }

  // 3. Phonation Continuity & Flow (40% - 85% is clinically normal for oral reading)
  let voicingBase: number;
  if (voicedFramesPct >= 38 && voicedFramesPct <= 88) {
    voicingBase = 100;
  } else if (voicedFramesPct < 38) {
    voicingBase = Math.max(35, 100 - (38 - voicedFramesPct) * 1.8);
  } else {
    voicingBase = Math.max(70, 100 - (voicedFramesPct - 88) * 1.5);
  }
  const blockDeduction = Math.min(45, blocks * 8);
  const continuityScoreRaw = Math.max(20, Math.min(100, Math.round(voicingBase - blockDeduction)));

  // 4. Acoustic Pitch Stability
  const stabilityScoreRaw = Math.max(40, Math.min(100, pitchStabilityPct));

  let rawOverall: number;
  let overallScore: number;
  let clinicalLevel: RealTimeFluencyState['clinicalLevel'];
  let components: RealTimeFluencyState['components'];
  let formulaEquation = '';

  if (isFreeSpeechMode) {
    // FREE SPEECH MODE: Pure Motor & Acoustic Fluency
    const weightedDisfluency = disfluencyScoreRaw * 0.45;
    const weightedPacing = pacingScoreRaw * 0.25;
    const weightedContinuity = continuityScoreRaw * 0.20;
    const weightedStability = stabilityScoreRaw * 0.10;

    rawOverall = weightedDisfluency + weightedPacing + weightedContinuity + weightedStability;
    overallScore = Math.max(20, Math.min(100, Math.round(rawOverall * 10) / 10));

    formulaEquation = `(${weightedDisfluency.toFixed(1)} [45% Disfluency]) + (${weightedPacing.toFixed(1)} [25% Pacing]) + (${weightedContinuity.toFixed(1)} [20% Continuity]) + (${weightedStability.toFixed(1)} [10% Stability]) = ${overallScore}%`;

    if (overallScore >= 90) clinicalLevel = 'Exceptional Fluency';
    else if (overallScore >= 80) clinicalLevel = 'Functional Fluency';
    else if (overallScore >= 70) clinicalLevel = 'Mild Disfluency';
    else if (overallScore >= 55) clinicalLevel = 'Moderate Disfluency';
    else clinicalLevel = 'Significant Disfluency';

    components = {
      disfluencyFactor: {
        name: 'Disfluency Rate (%SS)',
        weightPct: 45,
        rawScore: Math.round(disfluencyScoreRaw),
        weightedScore: Math.round(weightedDisfluency * 10) / 10,
        metricLabel: 'Disfluency Freq',
        metricValue: `${disfluencyRatePct}%`,
        status: disfluencyRatePct <= 3.5 ? 'optimal' : disfluencyRatePct <= 7.0 ? 'acceptable' : 'needs_work',
        description: 'Percentage of words affected by sound repetitions, prolongations, or articulatory blocks.'
      },
      pacingFactor: {
        name: 'Pacing Adherence',
        weightPct: 25,
        rawScore: Math.round(pacingScoreRaw),
        weightedScore: Math.round(weightedPacing * 10) / 10,
        metricLabel: 'Speaking Rate',
        metricValue: `${currentWpm} WPM (Target: ${targetWpm})`,
        status: Math.abs(currentWpm - targetWpm) <= 20 ? 'optimal' : Math.abs(currentWpm - targetWpm) <= 40 ? 'acceptable' : 'needs_work',
        description: 'Consistency of articulatory pacing compared to therapeutic target words per minute.'
      },
      continuityFactor: {
        name: 'Phonation Continuity',
        weightPct: 20,
        rawScore: Math.round(continuityScoreRaw),
        weightedScore: Math.round(weightedContinuity * 10) / 10,
        metricLabel: 'Voiced Continuity',
        metricValue: `${Math.round(voicedFramesPct)}%`,
        status: continuityScoreRaw >= 80 ? 'optimal' : continuityScoreRaw >= 65 ? 'acceptable' : 'needs_work',
        description: 'Continuous vocal fold vibration and absence of tense pre-phonatory block freezes.'
      },
      stabilityFactor: {
        name: 'Acoustic Stability',
        weightPct: 10,
        rawScore: Math.round(stabilityScoreRaw),
        weightedScore: Math.round(weightedStability * 10) / 10,
        metricLabel: 'Pitch Stability',
        metricValue: `${Math.round(pitchStabilityPct)}%`,
        status: stabilityScoreRaw >= 80 ? 'optimal' : stabilityScoreRaw >= 60 ? 'acceptable' : 'needs_work',
        description: 'Laryngeal relaxation, absence of abrupt vocal strain spikes and frequency tremors.'
      }
    };
  } else {
    // TARGET PRACTICE MODE: Requires reading the assigned exercise prompt!
    const targetMatchScoreRaw = Math.max(0, Math.min(100, targetAccuracyPct));

    const weightedTargetMatch = targetMatchScoreRaw * 0.35;
    const weightedDisfluency = disfluencyScoreRaw * 0.30;
    const weightedPacing = pacingScoreRaw * 0.20;
    const weightedContinuity = continuityScoreRaw * 0.15;

    rawOverall = weightedTargetMatch + weightedDisfluency + weightedPacing + weightedContinuity;

    // Severe Penalty if user is saying completely other words (e.g. targetAccuracy < 35% with >= 3 words)
    if (totalWords >= 3 && targetAccuracyPct < 35) {
      overallScore = Math.max(12, Math.min(30, Math.round(targetAccuracyPct * 0.5 + 14)));
      clinicalLevel = 'Off-Target Speech';
      formulaEquation = `(${weightedTargetMatch.toFixed(1)} [35% Target]) + (${weightedDisfluency.toFixed(1)} [30% Disfluency]) + (${weightedPacing.toFixed(1)} [20% Pacing]) + (${weightedContinuity.toFixed(1)} [15% Continuity]) -> Capped at ${overallScore}% due to Off-Target Speech`;
    } else {
      overallScore = Math.max(20, Math.min(100, Math.round(rawOverall * 10) / 10));
      formulaEquation = `(${weightedTargetMatch.toFixed(1)} [35% Target]) + (${weightedDisfluency.toFixed(1)} [30% Disfluency]) + (${weightedPacing.toFixed(1)} [20% Pacing]) + (${weightedContinuity.toFixed(1)} [15% Continuity]) = ${overallScore}%`;

      if (overallScore >= 90) clinicalLevel = 'Exceptional Fluency';
      else if (overallScore >= 80) clinicalLevel = 'Functional Fluency';
      else if (overallScore >= 70) clinicalLevel = 'Mild Disfluency';
      else if (overallScore >= 55) clinicalLevel = 'Moderate Disfluency';
      else clinicalLevel = 'Significant Disfluency';
    }

    components = {
      targetMatchFactor: {
        name: 'Target Word Accuracy',
        weightPct: 35,
        rawScore: Math.round(targetMatchScoreRaw),
        weightedScore: Math.round(weightedTargetMatch * 10) / 10,
        metricLabel: 'Target Match',
        metricValue: `${targetAccuracyPct}% (${offTargetWordsCount} off-target)`,
        status: targetAccuracyPct >= 80 ? 'optimal' : targetAccuracyPct >= 50 ? 'acceptable' : 'needs_work',
        description: 'Accuracy in speaking the assigned clinical exercise sentence without saying other words.'
      },
      disfluencyFactor: {
        name: 'Disfluency Rate (%SS)',
        weightPct: 30,
        rawScore: Math.round(disfluencyScoreRaw),
        weightedScore: Math.round(weightedDisfluency * 10) / 10,
        metricLabel: 'Disfluency Freq',
        metricValue: `${disfluencyRatePct}%`,
        status: disfluencyRatePct <= 3.5 ? 'optimal' : disfluencyRatePct <= 7.0 ? 'acceptable' : 'needs_work',
        description: 'Sound repetitions, phoneme prolongations, or articulatory blocks on target words.'
      },
      pacingFactor: {
        name: 'Pacing Adherence',
        weightPct: 20,
        rawScore: Math.round(pacingScoreRaw),
        weightedScore: Math.round(weightedPacing * 10) / 10,
        metricLabel: 'Speaking Rate',
        metricValue: `${currentWpm} WPM (Target: ${targetWpm})`,
        status: Math.abs(currentWpm - targetWpm) <= 20 ? 'optimal' : Math.abs(currentWpm - targetWpm) <= 40 ? 'acceptable' : 'needs_work',
        description: 'Consistency of articulatory pacing compared to therapeutic target words per minute.'
      },
      continuityFactor: {
        name: 'Phonation Continuity',
        weightPct: 15,
        rawScore: Math.round(continuityScoreRaw),
        weightedScore: Math.round(weightedContinuity * 10) / 10,
        metricLabel: 'Voiced Continuity',
        metricValue: `${Math.round(voicedFramesPct)}%`,
        status: continuityScoreRaw >= 80 ? 'optimal' : continuityScoreRaw >= 65 ? 'acceptable' : 'needs_work',
        description: 'Continuous vocal fold vibration and absence of tense pre-phonatory block freezes.'
      },
      stabilityFactor: {
        name: 'Acoustic Stability',
        weightPct: 0,
        rawScore: Math.round(stabilityScoreRaw),
        weightedScore: 0,
        metricLabel: 'Pitch Stability',
        metricValue: `${Math.round(pitchStabilityPct)}%`,
        status: stabilityScoreRaw >= 80 ? 'optimal' : 'acceptable',
        description: 'Fundamental frequency laryngeal stability during phonation.'
      }
    };
  }

  return {
    overallScore,
    disfluencyRatePct,
    currentWpm,
    formulaEquation,
    components,
    clinicalLevel
  };
}

/**
 * Text & Speech Recognition Real-Time Analyzer
 * Analyzes live transcribed words to identify acoustic-verbal disfluency events
 */
export function analyzeSpokenTextForDisfluency(text: string): {
  words: string[];
  totalWords: number;
  repetitions: number;
  prolongations: number;
  blocks: number;
  detectedEvents: Array<{
    type: 'repetition' | 'prolongation' | 'block';
    label: string;
    detail: string;
  }>;
} {
  if (!text || text.trim().length === 0) {
    return {
      words: [],
      totalWords: 0,
      repetitions: 0,
      prolongations: 0,
      blocks: 0,
      detectedEvents: []
    };
  }

  // Tokenize words
  const clean = text.toLowerCase().replace(/[^\w\s-]/g, ' ');
  const words = clean.split(/\s+/).filter((w) => w.length > 0);

  let repetitions = 0;
  let prolongations = 0;
  let blocks = 0;
  const detectedEvents: Array<{
    type: 'repetition' | 'prolongation' | 'block';
    label: string;
    detail: string;
  }> = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // 1. Whole-Word Repetition (e.g., "peter peter", "the the", "I I", "and and")
    if (i > 0 && words[i - 1] === word && word.length > 1) {
      repetitions++;
      detectedEvents.push({
        type: 'repetition',
        label: `"${word} ${word}"`,
        detail: `Whole-word repetition detected`
      });
      continue;
    }

    // 2. Fragment / Syllable Repetition in STT (e.g. "p peter", "pe peter", "b began", "s sudden")
    if (i < words.length - 1 && word.length <= 2 && words[i + 1].length > 2 && words[i + 1].startsWith(word)) {
      repetitions++;
      detectedEvents.push({
        type: 'repetition',
        label: `"${word} ${words[i + 1]}"`,
        detail: `Syllable / initial sound stutter repetition`
      });
      continue;
    }

    // 3. Hyphenated Part-Word Repetition (e.g. "p-p-peter", "to-today", "b-ball")
    if (/^([a-z]{1,3})[-]+([a-z]+)/i.test(word) || /^([a-z])\1+[-]?([a-z]+)/i.test(word)) {
      repetitions++;
      detectedEvents.push({
        type: 'repetition',
        label: `"${word}"`,
        detail: `Part-word sound repetition`
      });
      continue;
    }

    // 4. Sound Prolongation (e.g. "ssssun", "whhhhy", "mmmore")
    if (/([a-z])\1{2,}/i.test(word)) {
      prolongations++;
      detectedEvents.push({
        type: 'prolongation',
        label: `"${word}"`,
        detail: `Phoneme prolongation (>300ms elongation)`
      });
      continue;
    }

    // 5. Stutter Filler / Avoidance Hesitations (e.g. "uh", "um", "er", "ah", "hmm")
    if (['uh', 'um', 'er', 'ah', 'hmm', 'eh'].includes(word)) {
      blocks++;
      detectedEvents.push({
        type: 'block',
        label: `"${word}"`,
        detail: `Hesitation filler / block avoidance pause`
      });
      continue;
    }
  }

  // 6. Check for phrase / clause repetitions (e.g. "peter opened peter opened")
  for (let i = 2; i < words.length; i++) {
    if (words[i] === words[i - 2] && words[i - 1] === words[i - 3] && words[i] !== words[i - 1]) {
      repetitions++;
      detectedEvents.push({
        type: 'repetition',
        label: `"${words[i - 3]} ${words[i - 2]} ${words[i - 1]} ${words[i]}"`,
        detail: `Phrase retracement repetition`
      });
    }
  }

  return {
    words,
    totalWords: words.length,
    repetitions,
    prolongations,
    blocks,
    detectedEvents
  };
}
