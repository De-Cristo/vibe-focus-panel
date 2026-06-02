import React from 'react';
import { Terminal, RotateCcw, Power, CheckSquare } from 'lucide-react';

export type CockpitStatus = 'running' | 'waiting' | 'review';

interface HeaderProps {
  status: CockpitStatus;
  setStatus: (status: CockpitStatus) => void;
  logsCount: number;
  activeTasksCount: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  setStatus,
  onReset,
}) => {
  const getStatusText = () => {
    switch (status) {
      case 'running':
        return 'AI // EXECUTING';
      case 'waiting':
        return 'DEV // AWAITING INPUT';
      case 'review':
        return 'GATE // PR SIGN-OFF';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'text-zinc-400 border-zinc-800';
      case 'waiting':
        return 'text-amber-500 border-amber-950/60';
      case 'review':
        return 'text-cyan-400 border-cyan-950/60';
    }
  };

  return (
    <header className="w-full border-b border-zinc-900 bg-zinc-950 px-6 py-4 sticky top-0 z-50">
      <div className="mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between max-w-7xl">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-zinc-500" />
          <h1 className="text-sm font-semibold tracking-wider text-zinc-100 font-mono-tech m-0">
            FOCUS_COCKPIT // <span className="text-zinc-500">CONSOLE</span>
          </h1>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-4">
          <div className={`px-2.5 py-1 rounded border text-[10px] font-mono-tech tracking-widest font-semibold bg-zinc-900/40 ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        {/* Console Controls */}
        <div className="flex items-center gap-3">
          {/* Reset Link */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[10px] font-mono-tech text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer border-none bg-transparent"
            title="Reset console to default template"
          >
            <RotateCcw className="h-3 w-3" />
            RESET_DEMO
          </button>

          <span className="text-zinc-800 text-[10px] select-none">|</span>

          {/* Action buttons (spacious, minimal, simple borders) */}
          {status === 'running' && (
            <div className="flex gap-2">
              <button
                onClick={() => setStatus('waiting')}
                className="flex items-center gap-1 px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-mono-tech text-[10px] cursor-pointer transition-colors"
              >
                <Power className="h-3 w-3" />
                PAUSE_AI
              </button>
              <button
                onClick={() => setStatus('review')}
                className="flex items-center gap-1 px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-mono-tech text-[10px] cursor-pointer transition-colors"
              >
                <CheckSquare className="h-3 w-3" />
                RETURN_TASK
              </button>
            </div>
          )}

          {status === 'waiting' && (
            <button
              onClick={() => setStatus('running')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/40 text-amber-400 font-mono-tech text-[10px] cursor-pointer transition-colors"
            >
              <Power className="h-3 w-3" />
              RESUME_AI
            </button>
          )}

          {status === 'review' && (
            <button
              onClick={() => setStatus('running')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-400 font-mono-tech text-[10px] cursor-pointer transition-colors"
            >
              <Terminal className="h-3 w-3" />
              FORCE_RESUME
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
