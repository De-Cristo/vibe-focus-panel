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
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex flex-col min-h-[300px] items-center justify-center text-center opacity-70 shadow-sm">
        <ShieldCheck className="h-8 w-8 text-zinc-600 mb-3" />
        <span className="text-sm font-semibold text-zinc-400">
          Verification gate
        </span>
        <span className="text-zinc-500 text-sm mt-1.5">Not in review phase.</span>
      </div>
    );
  }

  const canClose = closeResult !== undefined && (closeNote || '').trim().length > 0;

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 border border-indigo-500/30 shadow-sm flex flex-col min-h-[300px] h-[350px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-indigo-400 animate-pulse" />
          <span className="text-sm font-semibold text-indigo-400">
            Returned: Needs review
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between min-h-0 text-sm">
        {/* Instructions */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3.5 mb-4 shrink-0">
          <span className="block text-sm font-semibold text-indigo-400">Review debt generated</span>
          <span className="text-sm text-zinc-300 block leading-relaxed mt-1">Please review the returned mission and close it to reduce review debt.</span>
        </div>

        {/* Close Dialog Form */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
          <div>
            <label className="block text-zinc-400 font-medium mb-1.5">Close result</label>
            <select
              value={closeResult || ''}
              onChange={(e) => setCloseResult(e.target.value as CloseResult)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
            >
              <option value="" disabled>Select result...</option>
              <option value="accepted">Accepted</option>
              <option value="partial">Partial</option>
              <option value="follow-up">Follow-up</option>
              <option value="rejected">Rejected</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col h-full min-h-[80px]">
            <label className="block text-zinc-400 font-medium mb-1.5">Close note (Mandatory)</label>
            <textarea
              value={closeNote || ''}
              onChange={(e) => setCloseNote(e.target.value)}
              placeholder="Provide context on the review outcome..."
              className="w-full flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 resize-none focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 pt-3 border-t border-zinc-800/60">
          <button
            disabled={!canClose}
            onClick={onCloseMission}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              canClose
                ? 'bg-zinc-100 hover:bg-white text-zinc-900 cursor-pointer shadow-sm'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            Close mission
          </button>
        </div>
      </div>
    </div>
  );
};
