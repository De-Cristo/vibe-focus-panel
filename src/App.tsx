import { useState, useEffect } from 'react';
import { AlertTriangle, Edit3 } from 'lucide-react';
import { Header } from './components/Header';
import type { CockpitStatus } from './components/Header';
import { MissionCard } from './components/MissionCard';
import type { Mission } from './components/MissionCard';
import { AiTaskStatus } from './components/AiTaskStatus';
import { TaskStack } from './components/TaskStack';
import type { Task } from './components/TaskStack';
import { ResumeNote } from './components/ResumeNote';
import { QualityGate } from './components/QualityGate';
import type { GateRule } from './components/QualityGate';

// Default Demo Values
const DEFAULT_MISSION: Mission = {
  title: "Build Vibe Coding Focus Cockpit Dashboard",
  successCondition: "Implement a single-page responsive cockpit with simulated AI activity loops, interactive task queues, custom markdown notes, and quality checks.",
  nextHumanAction: "Review task stack columns and verify production build compilation output",
  progress: 80,
  currentStep: "Integrating components",
};

const DEFAULT_AI_TASK_DESCRIPTION = "Processing workspace layout parameters and rendering visual cockpit metrics";

const DEFAULT_WAITING_REASON = "Handoff validation check and approval on the implementation plan";

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
    id: '2',
    title: 'Build Header.tsx Component',
    description: 'Create status bar with uptime counter and waiting mode controls',
    status: 'done',
    priority: 'medium',
    category: 'UI',
    createdAt: '15:35',
    resumeNote: 'Toggles global theme color between neon purple and glowing amber on select',
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
  },
  {
    id: '4',
    title: 'Integrate mock simulation loop',
    description: 'Code a setInterval hook that updates AI thought streams and logs',
    status: 'active',
    priority: 'medium',
    category: 'Simulator',
    createdAt: '15:42',
  },
  {
    id: '5',
    title: 'Compile and type-check build',
    description: 'Run pnpm build to confirm bundler output files succeed',
    status: 'later',
    priority: 'low',
    category: 'QA',
    createdAt: '15:45',
  },
];

const DEFAULT_RULES: GateRule[] = [
  { id: 'g1', name: 'Scaffolding & Boilerplate complete', category: 'Config', checked: true },
  { id: 'g2', name: 'Tailwind CSS v4 config setup', category: 'Styles', checked: true },
  { id: 'g3', name: 'Vibe Cockpit Layout composed', category: 'Layout', checked: true },
  { id: 'g4', name: 'No TypeScript compilation errors', category: 'Build', checked: true },
  { id: 'g5', name: 'All 6 interactive cards operational', category: 'QA', checked: true },
];

const DEFAULT_LOGS = [
  "[INFO] Initializing Vibe Coding Focus Cockpit v2.4.0...",
  "[INFO] System environment loaded successfully.",
  "[INFO] Port path set to E:/playground/vibecoding buddy",
  "[SUCCESS] pnpm store configuration redirected to E:/pnpm-store",
  "[INFO] Tailwind CSS compiler v4 initialized in 12ms",
  "[SUCCESS] Scaffolding complete. Project live at local port 5173",
  "[INFO] Main process listening for changes...",
];

// Simulated operations for log outputs
const SIMULATED_OPS = [
  { op: "dependency-analysis", log: "[INFO] Parsing import tree: 5 files resolved." },
  { op: "writing-css", log: "[SUCCESS] Injected Tailwind CSS utility classes into compiler buffer." },
  { op: "compiling-js", log: "[INFO] Rendered inline note components. Hot module replacement triggered." },
  { op: "responsive-layout", log: "[INFO] Browser simulator check: 100% viewport coverage." },
  { op: "state-checks", log: "[SUCCESS] Stack transition listener verified. Active state stable." },
  { op: "compilation-verify", log: "[SUCCESS] tsc completed with 0 errors in 143ms." },
  { op: "aesthetics-lint", log: "[INFO] Linter checking: formatting matches Google Style Guidelines." }
];

// Helper to load state from localStorage safely
const loadState = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error(`Failed to load localStorage key: ${key}`, e);
    return defaultValue;
  }
};

function App() {
  // Load States from localStorage on initialization
  const [status, setStatus] = useState<CockpitStatus>(() => {
    const savedStatus = localStorage.getItem('cockpit_status');
    if (savedStatus) {
      try {
        const parsed = JSON.parse(savedStatus);
        if (parsed === 'running' || parsed === 'waiting' || parsed === 'review') return parsed;
      } catch (e) {}
    }
    // Fallback to legacy waitingMode
    const savedWaitingMode = localStorage.getItem('cockpit_waitingMode');
    if (savedWaitingMode) {
      try {
        return JSON.parse(savedWaitingMode) ? 'waiting' : 'running';
      } catch (e) {}
    }
    return 'running';
  });

  const [mission, setMission] = useState<Mission>(() => loadState('cockpit_mission', DEFAULT_MISSION));
  const [aiTaskDescription, setAiTaskDescription] = useState<string>(() => loadState('cockpit_aiTaskDescription', DEFAULT_AI_TASK_DESCRIPTION));
  const [waitingReason, setWaitingReason] = useState<string>(() => loadState('cockpit_waitingReason', DEFAULT_WAITING_REASON));
  const [note, setNote] = useState<string>(() => loadState('cockpit_note', DEFAULT_NOTE));
  const [tasks, setTasks] = useState<Task[]>(() => loadState('cockpit_tasks', DEFAULT_TASKS));
  const [rules, setRules] = useState<GateRule[]>(() => loadState('cockpit_rules', DEFAULT_RULES));
  const [logs, setLogs] = useState<string[]>(() => loadState('cockpit_logs', DEFAULT_LOGS));
  const [reviewChecklist, setReviewChecklist] = useState<boolean[]>(() => loadState('cockpit_reviewChecklist', [false, false, false, false, false]));

  // runningElapsed timer (resets on reload, pause, or task change)
  const [runningElapsed, setRunningElapsed] = useState<number>(0);

  // Temporary state for waiting reason editor
  const [isEditingWaitingReason, setIsEditingWaitingReason] = useState(false);
  const [editWaitingReasonVal, setEditWaitingReasonVal] = useState(waitingReason);

  // Live thoughts generated dynamically
  const [currentThought, setCurrentThought] = useState<string>(
    "Analyzing cockpit layout parameters and binding state metrics between dashboard card nodes..."
  );
  const [currentOperation, setCurrentOperation] = useState<string>("init-workspace");

  // Save States to localStorage on changes
  useEffect(() => {
    localStorage.setItem('cockpit_status', JSON.stringify(status));
    localStorage.setItem('cockpit_waitingMode', JSON.stringify(status === 'waiting'));
  }, [status]);

  useEffect(() => {
    localStorage.setItem('cockpit_mission', JSON.stringify(mission));
  }, [mission]);

  useEffect(() => {
    localStorage.setItem('cockpit_aiTaskDescription', JSON.stringify(aiTaskDescription));
  }, [aiTaskDescription]);

  useEffect(() => {
    localStorage.setItem('cockpit_waitingReason', JSON.stringify(waitingReason));
  }, [waitingReason]);

  useEffect(() => {
    localStorage.setItem('cockpit_note', JSON.stringify(note));
  }, [note]);

  useEffect(() => {
    localStorage.setItem('cockpit_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('cockpit_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('cockpit_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('cockpit_reviewChecklist', JSON.stringify(reviewChecklist));
  }, [reviewChecklist]);

  // Track elapsed running time when execution is active
  useEffect(() => {
    if (status !== 'running') {
      setRunningElapsed(0);
      return;
    }
    const timer = setInterval(() => {
      setRunningElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Reset running timer when AI task changes
  useEffect(() => {
    setRunningElapsed(0);
  }, [aiTaskDescription]);

  // Effect to handle AI Task Status Simulation
  useEffect(() => {
    if (status === 'waiting') {
      setLogs((prev) => [
        ...prev,
        `[WARN] ${new Date().toLocaleTimeString()} - AI PROCESS SUSPENDED: Awaiting: "${waitingReason}"`,
      ]);
      return;
    }

    if (status === 'review') {
      setLogs((prev) => [
        ...prev,
        `[INFO] ${new Date().toLocaleTimeString()} - AI TASK COMPLETED. Waiting for developer sign-off in Quality Gate...`,
      ]);
      return;
    }

    // If running mode
    setLogs((prev) => [
      ...prev,
      `[INFO] ${new Date().toLocaleTimeString()} - AI ENGINE RESUMED: Executing: "${aiTaskDescription}"`,
    ]);

    let stepIndex = 0;
    const interval = setInterval(() => {
      const step = SIMULATED_OPS[stepIndex];
      setCurrentThought(`Verifying task flow for "${aiTaskDescription}" and checking module hooks...`);
      setCurrentOperation(step.op);
      
      setLogs((prev) => {
        const nextLogs = [
          ...prev, 
          `[INFO] ${new Date().toLocaleTimeString()} - Agent executing action [${step.op}] on: "${aiTaskDescription}"`, 
          step.log
        ];
        return nextLogs.slice(-60);
      });

      stepIndex++;
      
      // Auto-trigger Review Mode after 5 simulation cycles
      if (stepIndex >= 5) {
        clearInterval(interval);
        setStatus('review');
        setLogs((prev) => [
          ...prev,
          `[SUCCESS] ${new Date().toLocaleTimeString()} - AI TASK RETURNED. Operations completed. Opening Review Gate checklist...`
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [status, aiTaskDescription, waitingReason]);

  // Reset Demo Callback
  const handleResetDemo = () => {
    localStorage.removeItem('cockpit_status');
    localStorage.removeItem('cockpit_waitingMode');
    localStorage.removeItem('cockpit_mission');
    localStorage.removeItem('cockpit_aiTaskDescription');
    localStorage.removeItem('cockpit_waitingReason');
    localStorage.removeItem('cockpit_note');
    localStorage.removeItem('cockpit_tasks');
    localStorage.removeItem('cockpit_rules');
    localStorage.removeItem('cockpit_logs');
    localStorage.removeItem('cockpit_reviewChecklist');

    setStatus('running');
    setMission(DEFAULT_MISSION);
    setAiTaskDescription(DEFAULT_AI_TASK_DESCRIPTION);
    setWaitingReason(DEFAULT_WAITING_REASON);
    setNote(DEFAULT_NOTE);
    setTasks(DEFAULT_TASKS);
    setRules(DEFAULT_RULES);
    setLogs(DEFAULT_LOGS);
    setReviewChecklist([false, false, false, false, false]);
    setEditWaitingReasonVal(DEFAULT_WAITING_REASON);
    setIsEditingWaitingReason(false);
    setRunningElapsed(0);
  };

  // Accept Output and Merge handler
  const handleAcceptOutput = () => {
    setStatus('running');
    setReviewChecklist([false, false, false, false, false]);
    setLogs((prev) => [
      ...prev,
      `[SUCCESS] ${new Date().toLocaleTimeString()} - DEVELOPER SIGN-OFF: AI output reviewed and accepted. Merging code changes...`
    ]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans select-none pb-12 text-zinc-100">
      
      {/* 1. Header */}
      <Header
        status={status}
        setStatus={setStatus}
        logsCount={logs.length}
        activeTasksCount={tasks.filter(t => t.status === 'active').length}
        onReset={handleResetDemo}
      />
      
      {/* 2. Top Alert Banner for Waiting Mode */}
      {status === 'waiting' && (
        <div className="w-full max-w-7xl mx-auto px-6 mt-6 shrink-0">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <AlertTriangle className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-mono-tech text-zinc-500 uppercase tracking-wider font-semibold">Active Wait Condition</span>
                {isEditingWaitingReason ? (
                  <input
                    type="text"
                    value={editWaitingReasonVal}
                    onChange={(e) => setEditWaitingReasonVal(e.target.value)}
                    className="mt-1.5 w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-750 font-sans"
                  />
                ) : (
                  <p className="text-sm text-zinc-350 mt-0.5 leading-relaxed font-semibold">
                    We are waiting for: <span className="text-zinc-200 font-normal font-mono-tech">"{waitingReason}"</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center font-mono-tech text-xs">
              {isEditingWaitingReason ? (
                <>
                  <button
                    onClick={() => setIsEditingWaitingReason(false)}
                    className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setWaitingReason(editWaitingReasonVal);
                      setIsEditingWaitingReason(false);
                    }}
                    className="px-2.5 py-1.5 rounded bg-zinc-100 text-zinc-950 font-bold hover:bg-white cursor-pointer transition-colors"
                  >
                    Save Condition
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditWaitingReasonVal(waitingReason);
                    setIsEditingWaitingReason(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Wait Reason
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Cockpit Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 md:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6 space-y-6 lg:space-y-0">
          
          {/* LEFT COLUMN: Mission & Cognitive Status (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <MissionCard
              mission={mission}
              setMission={setMission}
              waitingMode={status !== 'running'}
            />
            <AiTaskStatus
              aiTaskDescription={aiTaskDescription}
              setAiTaskDescription={setAiTaskDescription}
              currentThought={currentThought}
              currentOperation={currentOperation}
              logs={logs}
              waitingMode={status !== 'running'}
              runningElapsed={runningElapsed}
            />
          </div>

          {/* RIGHT COLUMN: Tasks, Handoff and Metrics (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Task Stack Board */}
            <TaskStack
              tasks={tasks}
              setTasks={setTasks}
            />

            {/* Bottom Row: Handoff Notes & Quality Gates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResumeNote
                note={note}
                setNote={setNote}
                waitingMode={status !== 'running'}
              />
              <QualityGate
                rules={rules}
                setRules={setRules}
                status={status}
                reviewChecklist={reviewChecklist}
                setReviewChecklist={setReviewChecklist}
                onAcceptOutput={handleAcceptOutput}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
