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
    <div className={`bg-zinc-900 rounded-2xl p-6 border transition-all duration-300 border-zinc-800 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-400">Current mission</span>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MissionStatus)}
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 cursor-pointer"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Edit mission parameters"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-5 text-sm">
          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Mission title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Success condition</label>
            <textarea
              rows={2}
              value={editSuccessCondition}
              onChange={(e) => setEditSuccessCondition(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600 resize-none"
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Next human action</label>
            <input
              type="text"
              value={editNextHumanAction}
              onChange={(e) => setEditNextHumanAction(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={editProgress}
                onChange={(e) => setEditProgress(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Active operation</label>
              <input
                type="text"
                value={editStep}
                onChange={(e) => setEditStep(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/60">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer text-sm font-medium"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 transition-colors cursor-pointer text-sm font-medium"
            >
              <Save className="h-4 w-4" />
              Save changes
            </button>
          </div>
        </div>
      ) : (
        /* Display Mode */
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100 leading-tight">{mission.title}</h2>
            
            <div className="mt-4 space-y-1.5">
              <span className="block text-sm font-medium text-zinc-400">Success condition</span>
              <p className="text-zinc-300 text-base leading-relaxed">{mission.successCondition}</p>
            </div>

            {/* CRITICAL TEXT ENHANCEMENT: Next Human Action */}
            <div className="mt-6 p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="block text-sm font-semibold text-indigo-400">Next human action</span>
              </div>
              <p className="text-base text-zinc-200 leading-relaxed">{mission.nextHumanAction}</p>
            </div>
          </div>

          {/* Simple Spacious Progress */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm text-zinc-400 font-medium">
              <span>Mission progress</span>
              <span className="text-zinc-300">{mission.progress}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-400 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${mission.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
