import React, { useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import type { ActivityLog } from '../types';

interface ActivityHistoryProps {
  logs: ActivityLog[];
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="console-panel rounded-xl p-6 border border-zinc-900 flex flex-col flex-1 min-h-[300px]">
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4 shrink-0">
        <Activity className="h-4 w-4 text-zinc-500" />
        <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Activity History</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2.5 font-mono-tech text-[10px]"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600 italic">
            No activity logged yet.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 leading-relaxed group">
              <span className="text-zinc-600 shrink-0 select-none">[{log.timestamp}]</span>
              <div>
                <span className="text-zinc-400 font-semibold">{log.action}</span>
                <span className="text-zinc-500 ml-2">{log.details}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
