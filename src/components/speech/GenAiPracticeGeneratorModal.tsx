import React, { useState } from 'react';
import { Sparkles, Wand2, X, Check, RefreshCw, BookOpen, Volume2 } from 'lucide-react';

interface GenAiPracticeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPractice: (customItem: {
    title: string;
    sample: string;
    technique: string;
    wpm: number;
    description: string;
    phoneticFocus: string;
  }) => void;
}

export const GenAiPracticeGeneratorModal: React.FC<GenAiPracticeGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyPractice
}) => {
  const [selectedPhonemes, setSelectedPhonemes] = useState<string[]>(['/p/', '/b/']);
  const [topic, setTopic] = useState<string>('space exploration');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [language, setLanguage] = useState<string>('en');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const phonemeOptions = [
    { label: '/p/ & /b/ (Bilabial Stops)', values: ['/p/', '/b/'] },
    { label: '/t/ & /d/ (Alveolar Tongue Stops)', values: ['/t/', '/d/'] },
    { label: '/k/ & /g/ (Velar Throat Stops)', values: ['/k/', '/g/'] },
    { label: '/s/ & /z/ (Fricatives & Sibilants)', values: ['/s/', '/z/'] },
    { label: '/f/ & /v/ (Labiodental Friction)', values: ['/f/', '/v/'] },
    { label: '/r/ & /l/ (Liquids & Glides)', values: ['/r/', '/l/'] },
    { label: 'Vowel Onsets (/æ/, /i/, /oʊ/)', values: ['/vowels/'] }
  ];

  const topicSuggestions = [
    'Space exploration & Mars colony',
    'Ordering espresso at a busy café',
    'Tech job interview introduction',
    'Mountain hiking adventure',
    'Cooking a delicious Italian pasta',
    'Mindful morning walk in the park'
  ];

  const handleTogglePhonemeGroup = (values: string[]) => {
    setSelectedPhonemes(values);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/generate-custom-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPhonemes: selectedPhonemes,
          topic,
          difficulty,
          language,
          desiredWordCount: difficulty === 'beginner' ? 35 : difficulty === 'advanced' ? 65 : 45
        })
      });

      const data = await response.json();
      if (data.success && data.customPractice) {
        setGeneratedResult(data.customPractice);
      } else {
        throw new Error('Generation failed');
      }
    } catch (err: any) {
      setErrorMsg('Could not generate custom passage. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToWorkspace = () => {
    if (!generatedResult) return;

    // Clean [breath] tags for reading prompter
    const cleanSample = generatedResult.passageText.replace(/\[breath\]/g, ', ').replace(/\s+/g, ' ').trim();

    onApplyPractice({
      title: generatedResult.title,
      sample: cleanSample,
      technique: 'Custom AI Gentle Onset',
      wpm: generatedResult.recommendedWpm || 115,
      description: generatedResult.clinicalGoal,
      phoneticFocus: generatedResult.targetPhonemes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white shadow-xs">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Generative AI Practice Passage Creator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate personalized clinical drills targeting your exact trouble phonemes and interests.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Parameters */}
        <div className="space-y-4 text-xs">
          {/* Target Phonemes */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              1. Select Target Speech Sounds (Stuttering Trigger Phonemes):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {phonemeOptions.map((opt, idx) => {
                const isSelected = selectedPhonemes.join('') === opt.values.join('');
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTogglePhonemeGroup(opt.values)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-bold ring-1 ring-teal-500'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic & Interest */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              2. Enter a Topic or Scenario of Personal Interest:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Preparing for a marketing meeting or walking my dog"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-teal-500"
            />
            {/* Quick Topic Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {topicSuggestions.slice(0, 4).map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(sug)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] text-slate-600 dark:text-slate-400 transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Language */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty:</label>
              <select
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              >
                <option value="beginner">Beginner (Slow, short phrases)</option>
                <option value="intermediate">Intermediate (Standard speech flow)</option>
                <option value="advanced">Advanced (Complex multisyllabic words)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (Spanish)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
                <option value="zh">中文 (Mandarin)</option>
              </select>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Clinical AI Passage...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Tailored Speech Passage with Gemini</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Passage Result */}
        {generatedResult && (
          <div className="p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {generatedResult.title}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-[10px] font-bold">
                Target: {generatedResult.recommendedWpm} WPM
              </span>
            </div>

            <p className="font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-100 p-3 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800">
              {generatedResult.passageText}
            </p>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p><strong>Clinical Focus:</strong> {generatedResult.clinicalGoal}</p>
              <p><strong>SLP Motor Tip:</strong> {generatedResult.techniqueTip}</p>
            </div>

            <button
              onClick={handleApplyToWorkspace}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Load into Real-Time Speech Practice Prompter</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
