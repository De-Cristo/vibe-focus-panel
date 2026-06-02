import React, { useRef, useEffect, useState } from 'react';
import { Brain, Edit3, Clock } from 'lucide-react';

interface AiTaskStatusProps {
  aiTaskDescription: string;
  setAiTaskDescription: (val: string) => void;
  currentThought: string;
  currentOperation: string;
  logs: string[];
  waitingMode: boolean;
  runningElapsed: number;
}

export const AiTaskStatus: React.FC<AiTaskStatusProps> = ({
  aiTaskDescription,
  setAiTaskDescription,
  currentThought,
  currentOperation,
  logs,
  waitingMode,
  runningElapsed,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(aiTaskDescription);

  // Auto-scroll terminal logs to bottom on changes
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleSave = () => {
    setAiTaskDescription(editVal);
    setIsEditing(false);
  };

  const formatElapsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Minimal non-gamified developer wait suggestions
  const getWaitingSuggestion = (seconds: number) => {
    if (waitingMode) {
      return {
        mode: 'Feedback',
        color: 'border-zinc-800 text-zinc-400 bg-zinc-950/20',
        text: 'AI process suspended. Complete required human validations or review plan.'
      };
    }
    if (seconds < 30) {
      return {
        mode: 'Stay Mode',
        color: 'border-zinc-800 text-zinc-400 bg-zinc-950/20',
        text: 'Short task executing. Stand by for immediate console return.'
      };
    } else if (seconds < 180) {
      return {
        mode: 'Verify Mode',
        color: 'border-zinc-800 text-zinc-400 bg-zinc-950/20',
        text: 'Review active changes, check formatting standards, or prepare test specs.'
      };
    } else if (seconds < 600) {
      return {
        mode: 'Same-project Mode',
        color: 'border-zinc-800 text-zinc-400 bg-zinc-950/20',
        text: 'Identify code optimizations or refactor utility structures in separate files.'
      };
    } else {
      return {
        mode: 'Break Mode',
        color: 'border-zinc-800 text-zinc-400 bg-zinc-950/20',
        text: 'Long compilation active. Stand up and rest your eyes; process will cycle in background.'
      };
    }
  };

  const suggestion = getWaitingSuggestion(runningElapsed);

  return (
    <div className={`console-panel rounded-xl p-6 border transition-all duration-300 flex flex-col h-[500px] md:h-[550px] ${
      waitingMode ? 'border-zinc-800' : 'border-zinc-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-zinc-500" />
          <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Cognitive Telemetry</span>
        </div>
      </div>

      {/* AI Task Description (Editable) */}
      <div className="mb-3.5 shrink-0 bg-zinc-950/40 border border-zinc-900 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="block text-[8px] font-mono-tech text-zinc-600 uppercase tracking-widest font-semibold">Active AI Task</span>
          {!isEditing ? (
            <button
              onClick={() => {
                setEditVal(aiTaskDescription);
                setIsEditing(true);
              }}
              className="p-0.5 rounded text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
            >
              <Edit3 className="h-3 w-3" />
            </button>
          ) : (
            <div className="flex gap-1.5 font-mono-tech text-[9px]">
              <button onClick={() => setIsEditing(false)} className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                X
              </button>
              <button onClick={handleSave} className="text-zinc-300 hover:text-white cursor-pointer font-bold">
                SAVE
              </button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-850 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono-tech"
          />
        ) : (
          <p className="text-xs text-zinc-300 font-mono-tech leading-snug">{aiTaskDescription}</p>
        )}
      </div>

      {/* Thought Stream Panel */}
      <div className="mb-3.5 shrink-0">
        <div className="bg-zinc-950/10 border border-zinc-900 rounded-lg p-3">
          <span className="block text-[8px] font-mono-tech text-zinc-600 uppercase tracking-widest font-semibold">Thought Stream</span>
          <p className="text-zinc-400 text-xs italic leading-relaxed mt-1 font-mono-tech truncate">
            "{waitingMode ? 'System idle. Listening for return signal...' : currentThought}"
          </p>
        </div>
      </div>

      {/* Developer Suggestion Banner */}
      <div className={`mb-3.5 p-3 rounded-lg border text-xs leading-relaxed shrink-0 font-mono-tech ${suggestion.color}`}>
        <div className="flex items-center justify-between mb-1.5 text-[9px] text-zinc-500">
          <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
            <Clock className="h-3 w-3" />
            RECOMMENDED: {suggestion.mode}
          </span>
          {!waitingMode && <span>ELAPSED: {formatElapsed(runningElapsed)}</span>}
        </div>
        <p className="text-[11px] text-zinc-300 leading-snug font-sans">{suggestion.text}</p>
      </div>

      {/* Terminal View */}
      <div className="flex-1 min-h-0 bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 font-mono-tech text-xs relative flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-2 shrink-0">
          <span className="text-zinc-600 text-[9px] uppercase tracking-wider font-semibold">Terminal logs // antigravity</span>
          <div className="text-[10px] text-zinc-600">{currentOperation}</div>
        </div>

        {/* Scrolling logs container (Minimal low-contrast coloring) */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 select-text">
          {logs.map((log, index) => {
            let colorClass = 'text-zinc-400';
            if (log.startsWith('[WARN]') || log.includes('Awaiting') || log.includes('SUSPENDED')) {
              colorClass = 'text-zinc-500';
            } else if (log.startsWith('$')) {
              colorClass = 'text-zinc-300';
            } else if (log.startsWith('[SUCCESS]')) {
              colorClass = 'text-zinc-200';
            }

            return (
              <div key={index} className={`leading-relaxed break-all text-[11px] ${colorClass}`}>
                {log}
              </div>
            );
          })}
          {!waitingMode && (
            <div className="flex items-center gap-1 text-zinc-700 animate-pulse mt-1">
              <span>$ processing...</span>
              <span className="h-3 w-1 bg-zinc-600" />
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
