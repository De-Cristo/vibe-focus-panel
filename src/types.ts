export type MissionStatus = 'created' | 'delegated' | 'running' | 'blocked' | 'returned' | 'reviewing' | 'parked' | 'closed' | 'abandoned';

export type CloseResult = 'accepted' | 'rejected' | 'partial' | 'follow-up' | 'abandoned';

export interface FocusWindow {
  maxActiveProjects: number;
  maxRunningJobs: number;
  maxReviewDebt: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface Mission {
  title: string;
  successCondition: string;
  nextHumanAction: string;
  progress: number;
  currentStep: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'waiting' | 'later' | 'done';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  resumeNote?: string;
}

export interface GateRule {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export interface CockpitStateV2 {
  mission: Mission;
  missionStatus: MissionStatus;
  tasks: Task[];
  rules: GateRule[];
  note: string; // Handoff note
  activityHistory: ActivityLog[];
  focusWindow: FocusWindow;
  // State variables for close dialog
  closeResult?: CloseResult;
  closeNote?: string;
}
