import React, { useState } from 'react';
import { Plus, Tag, FileText } from 'lucide-react';

import { Task } from '../types';

interface TaskStackProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const TaskStack: React.FC<TaskStackProps> = ({
  tasks,
  setTasks,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState('Core');
  const [newStatus, setNewStatus] = useState<'active' | 'waiting' | 'later' | 'done'>('active');
  const [newResumeNote, setNewResumeNote] = useState('');

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editCategory, setEditCategory] = useState('');
  const [editResumeNote, setEditResumeNote] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: newStatus,
      priority: newPriority,
      category: newCategory.trim() || 'General',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resumeNote: newResumeNote.trim(),
    };

    setTasks([...tasks, newTask]);
    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setNewCategory('Core');
    setNewResumeNote('');
    setShowAddForm(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleMoveTask = (id: string, nextStatus: 'active' | 'waiting' | 'later' | 'done') => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditResumeNote(task.resumeNote || '');
  };

  const handleSaveEdit = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              title: editTitle,
              description: editDesc,
              priority: editPriority,
              category: editCategory || 'General',
              resumeNote: editResumeNote,
            }
          : t
      )
    );
    setEditingTaskId(null);
  };

  const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return '[high]';
      case 'medium':
        return '[med]';
      case 'low':
        return '[low]';
    }
  };

  const getColumnConfig = (colStatus: 'active' | 'waiting' | 'later' | 'done') => {
    switch (colStatus) {
      case 'active':
        return {
          title: 'ACTIVE_STACK',
          accent: 'border-t-zinc-500',
          titleColor: 'text-zinc-300',
          bg: 'bg-zinc-900/10',
        };
      case 'waiting':
        return {
          title: 'WAITING_BLOCK',
          accent: 'border-t-zinc-700',
          titleColor: 'text-zinc-400',
          bg: 'bg-zinc-900/5',
        };
      case 'later':
        return {
          title: 'LATER_BACKLOG',
          accent: 'border-t-zinc-800',
          titleColor: 'text-zinc-500',
          bg: 'bg-zinc-900/5',
        };
      case 'done':
        return {
          title: 'DONE_STACK',
          accent: 'border-t-zinc-600',
          titleColor: 'text-zinc-400',
          bg: 'bg-zinc-900/5',
        };
    }
  };

  const renderColumn = (colStatus: 'active' | 'waiting' | 'later' | 'done') => {
    const colTasks = tasks.filter((t) => t.status === colStatus);
    const config = getColumnConfig(colStatus);

    return (
      <div className="flex-1 flex flex-col rounded-xl border border-zinc-900 bg-zinc-950 overflow-hidden">
        {/* Column Header */}
        <div className={`px-4 py-3 border-t-2 border-b border-zinc-900 flex items-center justify-between shrink-0 ${config.accent}`}>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono-tech uppercase tracking-wider font-semibold ${config.titleColor}`}>
              {config.title}
            </span>
            <span className="text-[10px] font-mono-tech text-zinc-600 font-bold">
              / {colTasks.length}
            </span>
          </div>
          <button
            onClick={() => {
              setNewStatus(colStatus);
              setShowAddForm(true);
            }}
            className="p-0.5 rounded text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
            title={`Add to ${config.title}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Task Cards List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 min-h-[250px] max-h-[450px]">
          {colTasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-zinc-900 rounded-lg">
              <span className="text-[9px] font-mono-tech text-zinc-700">QUEUE_EMPTY</span>
            </div>
          ) : (
            colTasks.map((task, index) => {
              const isEditing = editingTaskId === task.id;
              const isActiveFocus = colStatus === 'active' && index === 0;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all duration-200 group ${
                    isEditing 
                      ? 'bg-zinc-900 border-zinc-700' 
                      : isActiveFocus 
                        ? 'active-focus-card border-zinc-600' 
                        : 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  {isEditing ? (
                    /* In-card Editor */
                    <div className="space-y-3 text-[10px] font-mono-tech">
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Task Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded px-2 py-1 text-zinc-300 focus:outline-none focus:border-zinc-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Description</label>
                        <textarea
                          rows={2}
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded px-2 py-1 text-zinc-300 resize-none focus:outline-none focus:border-zinc-700 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Task Action Handoff Note</label>
                        <input
                          type="text"
                          value={editResumeNote}
                          onChange={(e) => setEditResumeNote(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded px-2 py-1 text-zinc-300 focus:outline-none focus:border-zinc-700"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value as any)}
                          className="bg-zinc-950 border border-zinc-850 rounded px-1.5 py-1 text-zinc-400"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <input
                          type="text"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="flex-1 min-w-0 bg-zinc-950 border border-zinc-850 rounded px-2 py-1 text-zinc-300 focus:outline-none focus:border-zinc-700"
                          placeholder="Tag"
                        />
                      </div>
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          onClick={() => setEditingTaskId(null)}
                          className="px-2 py-1 rounded bg-zinc-850 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(task.id)}
                          className="px-2 py-1 rounded bg-zinc-100 text-zinc-950 font-bold hover:bg-white cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Task Details display */
                    <div className="flex flex-col gap-2.5">
                      {/* Active focus banner (Very minimal, non-gamified text tag) */}
                      {isActiveFocus && (
                        <div className="text-[8px] font-mono-tech font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-800 pb-1.5 shrink-0 self-stretch">
                          [ ACTIVE_FOCUS_TOP ]
                        </div>
                      )}

                      {/* Header elements */}
                      <div className="flex items-center justify-between text-[9px] font-mono-tech text-zinc-500">
                        <span>{getPriorityText(task.priority)}</span>
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-2.5 w-2.5 text-zinc-600" />
                          <span>{task.category}</span>
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <div>
                        <h4 className={`text-xs font-semibold leading-snug ${isActiveFocus ? 'text-zinc-100' : 'text-zinc-300'}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{task.description}</p>
                        )}
                      </div>

                      {/* Handoff notes */}
                      {task.resumeNote && (
                        <div className="bg-zinc-950/20 border border-zinc-900 rounded p-2 flex items-start gap-1.5">
                          <FileText className="h-3 w-3 text-zinc-600 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0 text-[10px]">
                            <span className="block text-[7px] font-mono-tech text-zinc-600 uppercase">Handoff Note</span>
                            <span className="text-zinc-400 block italic leading-tight truncate">{task.resumeNote}</span>
                          </div>
                        </div>
                      )}

                      {/* Footer Actions (Extremely minimal text linkages) */}
                      <div className="flex flex-col gap-2 pt-2 border-t border-zinc-900 shrink-0">
                        {/* Destination moves */}
                        <div className="flex items-center justify-between text-[9px] font-mono-tech text-zinc-500">
                          <span>MOVE //</span>
                          <div className="flex gap-1.5">
                            {colStatus !== 'active' && (
                              <button onClick={() => handleMoveTask(task.id, 'active')} className="text-zinc-500 hover:text-zinc-300 cursor-pointer hover:underline">Active</button>
                            )}
                            {colStatus !== 'waiting' && (
                              <button onClick={() => handleMoveTask(task.id, 'waiting')} className="text-zinc-500 hover:text-zinc-300 cursor-pointer hover:underline">Wait</button>
                            )}
                            {colStatus !== 'later' && (
                              <button onClick={() => handleMoveTask(task.id, 'later')} className="text-zinc-500 hover:text-zinc-300 cursor-pointer hover:underline">Later</button>
                            )}
                            {colStatus !== 'done' && (
                              <button onClick={() => handleMoveTask(task.id, 'done')} className="text-zinc-500 hover:text-zinc-300 cursor-pointer hover:underline">Done</button>
                            )}
                          </div>
                        </div>

                        {/* Modify actions */}
                        <div className="flex items-center justify-between text-[8px] font-mono-tech text-zinc-600 mt-0.5">
                          <span>{task.createdAt}</span>
                          <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing(task)}
                              className="hover:text-zinc-300 cursor-pointer"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="hover:text-rose-500 cursor-pointer"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Add Task Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-2xl space-y-4 font-mono-tech text-xs">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Push Task Stack Entry</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-3.5">
              <div>
                <label className="block text-[9px] text-zinc-500 uppercase mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="Insert title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 uppercase mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Insert details"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-700 resize-none font-sans"
                />
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 uppercase mb-1">Handoff Note (Optional)</label>
                <input
                  type="text"
                  placeholder="Insert specific resume action"
                  value={newResumeNote}
                  onChange={(e) => setNewResumeNote(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-zinc-500 uppercase mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-400 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-zinc-500 uppercase mb-1">Tag/Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                    placeholder="Tag"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 uppercase mb-1">Initial Stack Position</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-400 focus:outline-none focus:border-zinc-700"
                >
                  <option value="active">Active Stack</option>
                  <option value="waiting">Waiting Block</option>
                  <option value="later">Later Backlog</option>
                  <option value="done">Done Stack</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-bold cursor-pointer"
                >
                  PUSH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main 4-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        {renderColumn('active')}
        {renderColumn('waiting')}
        {renderColumn('later')}
        {renderColumn('done')}
      </div>
    </div>
  );
};
