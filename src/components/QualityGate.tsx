import React from 'react';
import { ShieldCheck, ShieldAlert, CheckSquare, Square, ThumbsUp } from 'lucide-react';

export interface GateRule {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

interface QualityGateProps {
  rules: GateRule[];
  setRules: (rules: GateRule[]) => void;
  status: 'running' | 'waiting' | 'review';
  reviewChecklist: boolean[];
  setReviewChecklist: (checklist: boolean[]) => void;
  onAcceptOutput: () => void;
}

// 5 checklist items required for Review Mode
const REVIEW_ITEMS = [
  "I understand the diff",
  "Tests or manual check passed",
  "Edge cases considered",
  "No unrelated changes",
  "I can explain why this solution is okay"
];

export const QualityGate: React.FC<QualityGateProps> = ({
  rules,
  setRules,
  status,
  reviewChecklist,
  setReviewChecklist,
  onAcceptOutput,
}) => {
  const isReviewMode = status === 'review';

  const toggleRule = (id: string) => {
    setRules(
      rules.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r))
    );
  };

  const toggleReviewItem = (index: number) => {
    const nextChecklist = [...reviewChecklist];
    nextChecklist[index] = !nextChecklist[index];
    setReviewChecklist(nextChecklist);
  };

  const allPassed = rules.every((r) => r.checked);
  const checkedCount = rules.filter((r) => r.checked).length;

  const allReviewPassed = reviewChecklist.every((val) => val);
  const reviewCheckedCount = reviewChecklist.filter((val) => val).length;

  return (
    <div className={`console-panel rounded-xl p-6 border transition-all duration-300 flex flex-col min-h-[300px] h-[350px] ${
      status === 'waiting' 
        ? 'border-zinc-800' 
        : status === 'review'
          ? 'border-cyan-900/60 shadow-sm'
          : 'border-zinc-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          {isReviewMode ? (
            allReviewPassed ? (
              <ShieldCheck className="h-4 w-4 text-zinc-400" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-cyan-500 animate-pulse" />
            )
          ) : allPassed ? (
            <ShieldCheck className="h-4 w-4 text-zinc-400" />
          ) : (
            <ShieldAlert className="h-4 w-4 text-zinc-500" />
          )}
          <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
            {isReviewMode ? 'Verification Gate // Output' : 'Quality Gates'}
          </span>
        </div>
        <span className="font-mono-tech text-[9px] text-zinc-500">
          {isReviewMode 
            ? `REVIEW: ${reviewCheckedCount}/${REVIEW_ITEMS.length}` 
            : `VERIFIED: ${checkedCount}/${rules.length}`
          }
        </span>
      </div>

      {isReviewMode ? (
        /* ================= REVIEW MODE ================= */
        <div className="flex-1 flex flex-col justify-between min-h-0 font-mono-tech text-[11px]">
          {/* Instructions */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-lg p-2.5 mb-3 shrink-0">
            <span className="block text-[8px] text-zinc-500 font-bold uppercase tracking-wider">AI Task Returned</span>
            <span className="text-[10px] text-zinc-400 block leading-tight mt-0.5">Validate all 5 safety requirements to sign off.</span>
          </div>

          {/* Checklist */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-3">
            {REVIEW_ITEMS.map((item, idx) => {
              const isChecked = reviewChecklist[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleReviewItem(idx)}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isChecked
                      ? 'bg-zinc-900/20 border-zinc-850 text-zinc-300 hover:border-zinc-800'
                      : 'bg-zinc-950/20 border-zinc-900/60 text-zinc-600 hover:border-zinc-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={isChecked ? 'text-cyan-400' : 'text-zinc-700'}>
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </div>
                    <span className={`text-[11px] leading-tight ${isChecked ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {item}
                    </span>
                  </div>
                  <span className={`text-[8px] font-mono-tech font-bold ${
                    isChecked ? 'text-zinc-400' : 'text-zinc-700'
                  }`}>
                    {isChecked ? 'SIGNED' : 'OPEN'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="shrink-0 pt-2.5 border-t border-zinc-900">
            <button
              disabled={!allReviewPassed}
              onClick={onAcceptOutput}
              className={`w-full py-2 rounded-lg font-mono-tech text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                allReviewPassed
                  ? 'bg-zinc-100 hover:bg-white text-zinc-950 cursor-pointer'
                  : 'bg-zinc-900 border border-zinc-850 text-zinc-650 cursor-not-allowed'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              ACCEPT_OUTPUT_AND_MERGE
            </button>
          </div>
        </div>
      ) : (
        /* ================= STANDARD MODE ================= */
        <div className="flex-1 flex flex-col justify-between min-h-0 font-mono-tech text-[11px]">
          {/* Status read-out */}
          <div className="mb-3 shrink-0">
            {allPassed ? (
              <div className="bg-zinc-950/20 border border-zinc-900 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Metrics Status</span>
                <span className="text-[9px] text-zinc-400 font-bold bg-zinc-900 px-2 py-0.5 border border-zinc-850 rounded">
                  SECURED
                </span>
              </div>
            ) : (
              <div className="bg-zinc-950/20 border border-zinc-900 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Metrics Status</span>
                <span className="text-[9px] text-amber-600 font-bold bg-zinc-900 px-2 py-0.5 border border-zinc-850 rounded">
                  PENDING_VERIFY
                </span>
              </div>
            )}
          </div>

          {/* Checklist items */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-none mb-2">
            {rules.map((rule) => (
              <div
                key={rule.id}
                onClick={() => toggleRule(rule.id)}
                className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                  rule.checked
                    ? 'bg-zinc-900/20 border-zinc-850 text-zinc-300 hover:border-zinc-800'
                    : 'bg-zinc-950/20 border-zinc-900/60 text-zinc-600 hover:border-zinc-850'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={rule.checked ? 'text-zinc-400' : 'text-zinc-700'}>
                    {rule.checked ? (
                      <CheckSquare className="h-4.5 w-4.5" />
                    ) : (
                      <Square className="h-4.5 w-4.5" />
                    )}
                  </div>
                  <div>
                    <span className={`text-[11px] block font-semibold leading-tight ${rule.checked ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {rule.name}
                    </span>
                    <span className="text-[8px] text-zinc-600 uppercase tracking-wider block mt-0.5">
                      {rule.category}
                    </span>
                  </div>
                </div>

                <span className={`text-[9px] font-mono-tech font-bold ${
                  rule.checked ? 'text-zinc-400' : 'text-zinc-700'
                }`}>
                  {rule.checked ? 'VERIFIED' : 'OPEN'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
