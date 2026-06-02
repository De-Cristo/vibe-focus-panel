import React, { useState } from 'react';
import { Target, Edit3, Save, X } from 'lucide-react';
import type { Mission, MissionStatus } from '../types';

interface MissionCardProps {
  mission: Mission;
  setMission: (mission: Mission) => void;
  status: MissionStatus;
  setStatus: (status: MissionStatus) => void;
}

const STATUS_OPTIONS: MissionStatus[] = [
  'created', 'delegated', 'running', 'blocked', 'returned', 'reviewing', 'parked', 'closed', 'abandoned'
];

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  setMission,
  status,
  setStatus,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(mission.title);
  const [editSuccessCondition, setEditSuccessCondition] = useState(mission.successCondition);
  const [editNextHumanAction, setEditNextHumanAction] = useState(mission.nextHumanAction);
  const [editProgress, setEditProgress] = useState(mission.progress);
  const [editStep, setEditStep] = useState(mission.currentStep);

  const handleSave = () => {
    setMission({
      title: editTitle,
      successCondition: editSuccessCondition,
      nextHumanAction: editNextHumanAction,
      progress: Math.min(100, Math.max(0, editProgress)),
      currentStep: editStep,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(mission.title);
    setEditSuccessCondition(mission.successCondition);
    setEditNextHumanAction(mission.nextHumanAction);
    setEditProgress(mission.progress);
    setEditStep(mission.currentStep);
    setIsEditing(false);
  };

  return (
    <div className={`console-panel rounded-xl p-6 border transition-all duration-300 border-zinc-900`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-zinc-500" />
          <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Active Mission</span>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MissionStatus)}
            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono-tech text-zinc-300 focus:outline-none focus:border-zinc-700 uppercase"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
              title="Edit mission parameters"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-4 text-xs font-mono-tech">
          <div>
            <label className="block text-[9px] text-zinc-500 uppercase mb-1">Mission Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-[9px] text-zinc-500 uppercase mb-1">Success Condition</label>
            <textarea
              rows={2}
              value={editSuccessCondition}
              onChange={(e) => setEditSuccessCondition(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-700 resize-none font-sans"
            />
          </div>
          <div>
            <label className="block text-[9px] text-zinc-500 uppercase mb-1">Next Human Action</label>
            <input
              type="text"
              value={editNextHumanAction}
              onChange={(e) => setEditNextHumanAction(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={editProgress}
                onChange={(e) => setEditProgress(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Active Operation</label>
              <input
                type="text"
                value={editStep}
                onChange={(e) => setEditStep(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
            >
              <X className="h-3 w-3" />
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-bold cursor-pointer transition-colors"
            >
              <Save className="h-3 w-3" />
              SAVE
            </button>
          </div>
        </div>
      ) : (
        /* Display Mode */
        <div className="space-y-4">
          <div>
            <h2 className="text-md font-medium text-zinc-100 leading-snug">{mission.title}</h2>
            
            <div className="mt-3.5 space-y-1">
              <span className="block text-[9px] font-mono-tech text-zinc-500 uppercase tracking-wider">Success Condition</span>
              <p className="text-zinc-400 text-xs leading-relaxed">{mission.successCondition}</p>
            </div>

            {/* CRITICAL TEXT ENHANCEMENT: Next Human Action */}
            <div className="mt-4 p-4 rounded bg-zinc-100 text-zinc-900 shadow-sm border border-zinc-200">
              <span className="block text-[8px] font-mono-tech text-zinc-500 uppercase font-bold tracking-widest leading-none">NEXT HUMAN ACTION</span>
              <p className="text-xs font-semibold leading-relaxed mt-1 text-zinc-950">{mission.nextHumanAction}</p>
            </div>
          </div>

          {/* Simple Spacious Progress */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[9px] font-mono-tech text-zinc-500 uppercase tracking-wider">
              <span>Mission Progress</span>
              <span className="font-semibold text-zinc-300">{mission.progress}%</span>
            </div>
            <div className="h-1 w-full bg-zinc-900 rounded overflow-hidden">
              <div 
                className="h-full bg-zinc-300 transition-all duration-1000 ease-out"
                style={{ width: `${mission.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
