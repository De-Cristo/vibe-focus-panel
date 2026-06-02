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
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex flex-col flex-1 min-h-[300px] shadow-sm">
      <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-4 mb-5 shrink-0">
        <Activity className="h-4 w-4 text-zinc-400" />
        <span className="text-sm font-medium text-zinc-400">Activity history</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-500 italic text-sm">
            No activity logged yet.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-4 leading-relaxed group">
              <span className="text-zinc-500 shrink-0 select-none text-xs mt-0.5">{log.timestamp}</span>
              <div className="text-sm">
                <span className="text-zinc-200 font-medium">{log.action}</span>
                <span className="text-zinc-400 ml-2">{log.details}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
