import React from 'react';
import { Terminal, RotateCcw, AlertTriangle } from 'lucide-react';
import { MissionStatus, FocusWindow } from '../types';

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
      <div className="mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between max-w-7xl">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-zinc-500" />
          <h1 className="text-sm font-semibold tracking-wider text-zinc-100 font-mono-tech m-0">
            FOCUS_COCKPIT // <span className="text-zinc-500">CONSOLE v0.2</span>
          </h1>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-4">
          <div className={`px-2.5 py-1 rounded border text-[10px] font-mono-tech tracking-widest font-semibold bg-zinc-900/40 ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        {/* Console Controls and Budget */}
        <div className="flex items-center gap-4">
          {/* Focus Budget Metrics */}
          <div className="flex items-center gap-3 text-[10px] font-mono-tech">
            <span className={activeProjectsCount > focusWindow.maxActiveProjects ? 'text-zinc-300' : 'text-zinc-500'}>
              Active: {activeProjectsCount}/{focusWindow.maxActiveProjects}
            </span>
            <span className={runningJobsCount > focusWindow.maxRunningJobs ? 'text-zinc-300' : 'text-zinc-500'}>
              Running: {runningJobsCount}/{focusWindow.maxRunningJobs}
            </span>
            <span className={reviewDebtCount > focusWindow.maxReviewDebt ? 'text-zinc-300' : 'text-zinc-500'}>
              Review: {reviewDebtCount}/{focusWindow.maxReviewDebt}
            </span>
            
            {isBudgetExceeded && (
              <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-900/60 px-2 py-1 rounded border border-zinc-800" title="Review, park, or close something before starting more work.">
                <AlertTriangle className="h-3 w-3 text-zinc-400" />
                <span>Focus budget is full</span>
              </div>
            )}
          </div>

          <span className="text-zinc-800 text-[10px] select-none">|</span>

          {/* Reset Link */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[10px] font-mono-tech text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer border-none bg-transparent"
            title="Reset console to default template"
          >
            <RotateCcw className="h-3 w-3" />
            RESET_DEMO
          </button>
        </div>
      </div>
    </header>
  );
};
