import React from 'react';
import { Terminal, RotateCcw, AlertTriangle } from 'lucide-react';
import type { MissionStatus, FocusWindow } from '../types';

interface HeaderProps {
  status: MissionStatus;
  focusWindow: FocusWindow;
  activeProjectsCount: number;
  runningJobsCount: number;
  reviewDebtCount: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  focusWindow,
  activeProjectsCount,
  runningJobsCount,
  reviewDebtCount,
  onReset,
}) => {
  const isBudgetExceeded = 
    activeProjectsCount > focusWindow.maxActiveProjects ||
    runningJobsCount > focusWindow.maxRunningJobs ||
    reviewDebtCount > focusWindow.maxReviewDebt;

  const getStatusText = () => {
    return `MISSION // ${status.toUpperCase()}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'created':
      case 'delegated':
        return 'text-zinc-400 border-zinc-800';
      case 'running':
        return 'text-emerald-400 border-emerald-950/60';
      case 'blocked':
      case 'parked':
        return 'text-amber-500 border-amber-950/60';
      case 'returned':
      case 'reviewing':
        return 'text-cyan-400 border-cyan-950/60';
      case 'closed':
      case 'abandoned':
        return 'text-zinc-600 border-zinc-900';
      default:
        return 'text-zinc-400 border-zinc-800';
    }
  };

  return (
    <header className="w-full border-b border-zinc-900 bg-zinc-950 px-6 py-4 sticky top-0 z-50">
      <div className="mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-7xl">
        {/* Title */}
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 m-0">
            Focus Cockpit
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            A calm place to track AI work and close loops.
          </p>
        </div>

        {/* Right side: Controls and Budget */}
        <div className="flex items-center gap-4">
          
          {/* Status indicator */}
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium border bg-zinc-800/50 ${getStatusColor()}`}>
            Current state: {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>

          <span className="text-zinc-700 select-none">|</span>

          {/* Focus Budget Metrics */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${activeProjectsCount > focusWindow.maxActiveProjects ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-transparent border-zinc-800 text-zinc-400'}`}>
              Active {activeProjectsCount} / {focusWindow.maxActiveProjects}
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${runningJobsCount > focusWindow.maxRunningJobs ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-transparent border-zinc-800 text-zinc-400'}`}>
              Running {runningJobsCount} / {focusWindow.maxRunningJobs}
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${reviewDebtCount > focusWindow.maxReviewDebt ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-transparent border-zinc-800 text-zinc-400'}`}>
              Review {reviewDebtCount} / {focusWindow.maxReviewDebt}
            </div>
            
            {isBudgetExceeded && (
              <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-700 ml-1" title="Review, park, or close something before starting more work.">
                <AlertTriangle className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-xs font-medium">Focus budget full</span>
              </div>
            )}
          </div>

          <span className="text-zinc-700 select-none">|</span>

          {/* Reset Link */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer border-none bg-transparent"
            title="Reset console to default template"
          >
            <RotateCcw className="h-4 w-4" />
            Reset demo
          </button>
        </div>
      </div>
    </header>
  );
};
