import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Header } from './components/Header';
import { MissionCard } from './components/MissionCard';
import { ActivityHistory } from './components/ActivityHistory';
import { TaskStack } from './components/TaskStack';
import { ResumeNote } from './components/ResumeNote';
import { ReturnedReviewPanel } from './components/ReturnedReviewPanel';
import type { 
  CockpitStateV2, 
  Mission, 
  Task, 
  GateRule, 
  ActivityLog, 
  MissionStatus, 
  CloseResult 
} from './types';

const DEFAULT_MISSION: Mission = {
  title: "Build Vibe Coding Focus Cockpit Dashboard",
  successCondition: "Implement a single-page responsive cockpit with simulated AI activity loops, interactive task queues, custom markdown notes, and quality checks.",
  nextHumanAction: "Review task stack columns and verify production build compilation output",
  progress: 80,
  currentStep: "Integrating components",
};

const DEFAULT_NOTE = `# Action Plan on Return\n\n- [ ] Run \`pnpm build\` to check path structures\n- [ ] Toggle **Waiting Mode** off to activate the AI Cognitive Engine\n- [ ] Complete linter checks and ensure no console errors\n- [ ] Verify that all 6 user-editable dashboard fields bind successfully to local state`;

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Setup Tailwind CSS v4',
    description: 'Configure @tailwindcss/vite plugin in config and import in index.css',
    status: 'done',
    priority: 'high',
    category: 'Config',
    createdAt: '15:28',
    resumeNote: 'Ensure the @import directive is placed at the top of index.css before all other classes',
  },
  {
    id: '3',
    title: 'Create Quality Gate verification',
    description: 'Integrate rules check block and secure validation state',
    status: 'active',
    priority: 'high',
    category: 'Core',
    createdAt: '15:40',
    resumeNote: 'Update gate checks on user click and show dynamic blocked warnings',
  }
];

const DEFAULT_RULES: GateRule[] = [
  { id: 'g1', name: 'Scaffolding & Boilerplate complete', category: 'Config', checked: true },
];

const DEFAULT_V2_STATE: CockpitStateV2 = {
  mission: DEFAULT_MISSION,
  missionStatus: 'created',
  tasks: DEFAULT_TASKS,
  rules: DEFAULT_RULES,
  note: DEFAULT_NOTE,
  activityHistory: [
    { id: 'init', timestamp: new Date().toLocaleTimeString(), action: 'System Init', details: 'Initialized v0.2 Manual Lifecycle Engine' }
  ],
  focusWindow: {
    maxActiveProjects: 3,
    maxRunningJobs: 5,
    maxReviewDebt: 2,
  },
  closeResult: undefined,
  closeNote: ''
};

const loadState = (key: string, defaultValue: CockpitStateV2): CockpitStateV2 => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Safely merge to prevent undefined property crashes on older state
      return {
        ...defaultValue,
        ...parsed,
        focusWindow: parsed.focusWindow || defaultValue.focusWindow,
        activityHistory: parsed.activityHistory || defaultValue.activityHistory,
        tasks: parsed.tasks || defaultValue.tasks,
        rules: parsed.rules || defaultValue.rules,
        mission: parsed.mission || defaultValue.mission,
      };
    }
    return defaultValue;
  } catch (e) {
    console.error(`Failed to load localStorage key: ${key}`, e);
    return defaultValue;
  }
};

function App() {
  const [state, setState] = useState<CockpitStateV2>(() => loadState('cockpit_state_v2', DEFAULT_V2_STATE));

  // Save state whenever it changes
  useEffect(() => {
    localStorage.setItem('cockpit_state_v2', JSON.stringify(state));
  }, [state]);

  const appendActivity = useCallback((action: string, details: string) => {
    setState(prev => {
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        action,
        details
      };
      return {
        ...prev,
        activityHistory: [...prev.activityHistory, newLog].slice(-100) // keep last 100
      };
    });
  }, []);

  const handleSetMission = (mission: Mission) => {
    setState(prev => ({ ...prev, mission }));
    appendActivity('Mission Update', `Updated mission details: ${mission.title}`);
  };

  const handleSetStatus = (newStatus: MissionStatus) => {
    setState(prev => ({ ...prev, missionStatus: newStatus }));
    appendActivity('Status Change', `Mission transitioned to ${newStatus.toUpperCase()}`);
  };

  const handleSetTasks = (tasks: Task[]) => {
    setState(prev => ({ ...prev, tasks }));
  };

  const handleSetNote = (note: string) => {
    setState(prev => ({ ...prev, note }));
  };

  const handleSetCloseResult = (result: CloseResult) => {
    setState(prev => ({ ...prev, closeResult: result }));
  };

  const handleSetCloseNote = (note: string) => {
    setState(prev => ({ ...prev, closeNote: note }));
  };

  const handleCloseMission = () => {
    const result = state.closeResult;
    const note = state.closeNote;
    setState(prev => ({
      ...prev,
      missionStatus: result === 'abandoned' ? 'abandoned' : 'closed',
      closeResult: undefined,
      closeNote: ''
    }));
    appendActivity('Mission Closed', `Result: ${result?.toUpperCase()}. Note: ${note}`);
  };

  const handleResetDemo = () => {
    localStorage.removeItem('cockpit_state_v2');
    setState(DEFAULT_V2_STATE);
  };

  const activeProjectsCount = 1; // Assuming 1 active project since it's a single mission view
  const runningJobsCount = state.tasks.filter(t => t.status === 'active').length;
  // If the status is returned, we have 1 review debt. (If we supported multiple missions, this would count all returned ones).
  const reviewDebtCount = (state.missionStatus === 'returned' || state.missionStatus === 'reviewing') ? 1 : 0;

  const isWaitingMode = state.missionStatus === 'blocked' || state.missionStatus === 'parked';

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col font-sans select-none pb-16 text-zinc-100">
      
      {/* 1. Header */}
      <Header
        status={state.missionStatus}
        focusWindow={state.focusWindow}
        activeProjectsCount={activeProjectsCount}
        runningJobsCount={runningJobsCount}
        reviewDebtCount={reviewDebtCount}
        onReset={handleResetDemo}
      />
      
      {/* 2. Top Alert Banner for Waiting/Blocked Mode */}
      {isWaitingMode && (
        <div className="w-full max-w-7xl mx-auto px-6 mt-8 shrink-0">
          <div className="bg-amber-950/20 border border-amber-900/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-amber-500">Waiting for intervention</span>
                <p className="text-base text-zinc-300 mt-1 leading-relaxed">
                  Mission is currently <strong>{state.missionStatus}</strong>. Manual intervention or unblocking is required to proceed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Cockpit Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 space-y-8 lg:space-y-0">
          
          {/* LEFT COLUMN: Mission & Activity Status (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <MissionCard
              mission={state.mission}
              setMission={handleSetMission}
              status={state.missionStatus}
              setStatus={handleSetStatus}
            />
            <ResumeNote
              note={state.note}
              setNote={handleSetNote}
              waitingMode={isWaitingMode}
            />
            <ActivityHistory
              logs={state.activityHistory}
            />
          </div>

          {/* RIGHT COLUMN: Tasks and Metrics (Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Task Stack Board */}
            <TaskStack
              tasks={state.tasks}
              setTasks={handleSetTasks}
            />

            {/* Bottom Row: Quality Gates / Close Dialog */}
            <ReturnedReviewPanel
              status={state.missionStatus}
              closeResult={state.closeResult}
              closeNote={state.closeNote}
              setCloseResult={handleSetCloseResult}
              setCloseNote={handleSetCloseNote}
              onCloseMission={handleCloseMission}
            />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
