import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckSquare } from 'lucide-react';
import type { MissionStatus, CloseResult } from '../types';

interface ReturnedReviewPanelProps {
  status: MissionStatus;
  closeResult?: CloseResult;
  closeNote?: string;
  setCloseResult: (result: CloseResult) => void;
  setCloseNote: (note: string) => void;
  onCloseMission: () => void;
}

export const ReturnedReviewPanel: React.FC<ReturnedReviewPanelProps> = ({
  status,
  closeResult,
  closeNote,
  setCloseResult,
  setCloseNote,
  onCloseMission,
}) => {
  const isReviewMode = status === 'returned' || status === 'reviewing';
  
  if (!isReviewMode) {
    return (
      <div className="console-panel rounded-xl p-6 border border-zinc-900 flex flex-col min-h-[300px] items-center justify-center text-center opacity-50">
        <ShieldCheck className="h-6 w-6 text-zinc-600 mb-2" />
        <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
          Verification Gate
        </span>
        <span className="text-zinc-600 text-xs mt-1">Not in review phase.</span>
      </div>
    );
  }

  const canClose = closeResult !== undefined && (closeNote || '').trim().length > 0;

  return (
    <div className="console-panel rounded-xl p-6 border border-cyan-900/60 shadow-sm flex flex-col min-h-[300px] h-[350px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-cyan-500 animate-pulse" />
          <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
            Returned // Needs Review
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between min-h-0 font-mono-tech text-[11px]">
        {/* Instructions */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-lg p-2.5 mb-3 shrink-0">
          <span className="block text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Review Debt Generated</span>
          <span className="text-[10px] text-zinc-400 block leading-tight mt-0.5">Please review the returned mission and close it to reduce review debt.</span>
        </div>

        {/* Close Dialog Form */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
          <div>
            <label className="block text-[9px] text-zinc-500 uppercase mb-1">Close Result</label>
            <select
              value={closeResult || ''}
              onChange={(e) => setCloseResult(e.target.value as CloseResult)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-700 uppercase"
            >
              <option value="" disabled>Select Result...</option>
              <option value="accepted">Accepted</option>
              <option value="partial">Partial</option>
              <option value="follow-up">Follow-up</option>
              <option value="rejected">Rejected</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col h-full min-h-[80px]">
            <label className="block text-[9px] text-zinc-500 uppercase mb-1">Close Note (Mandatory)</label>
            <textarea
              value={closeNote || ''}
              onChange={(e) => setCloseNote(e.target.value)}
              placeholder="Provide context on the review outcome..."
              className="w-full flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 resize-none focus:outline-none focus:border-zinc-700 font-sans"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 pt-2.5 border-t border-zinc-900">
          <button
            disabled={!canClose}
            onClick={onCloseMission}
            className={`w-full py-2 rounded-lg font-mono-tech text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${
              canClose
                ? 'bg-zinc-100 hover:bg-white text-zinc-950 cursor-pointer'
                : 'bg-zinc-900 border border-zinc-850 text-zinc-650 cursor-not-allowed'
            }`}
          >
            <CheckSquare className="h-3 w-3" />
            CLOSE_MISSION
          </button>
        </div>
      </div>
    </div>
  );
};
