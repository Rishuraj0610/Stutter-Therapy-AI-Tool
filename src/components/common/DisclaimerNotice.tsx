import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerNotice: React.FC<{ compact?: boolean }> = ({ compact }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="leading-tight text-[11px]">
          Clinical Adjunct: Not a replacement for emergency or psychiatric evaluation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-950 dark:text-amber-100">
            Clinical Therapy Advisory & Disclaimer
          </h4>
          <p className="leading-relaxed text-[11px] text-amber-800 dark:text-amber-300">
            FluencyAI is designed based on evidence-based Speech-Language Pathology principles (Prolonged Speech, Camperdown Program, and CBT for Social Communication Anxiety). It acts as an adjunct biofeedback tool and connects patients with certified Speech-Language Pathologists (SLPs). For acute physical vocal cords or psychiatric distress, consult a medical physician directly.
          </p>
        </div>
      </div>
    </div>
  );
};
