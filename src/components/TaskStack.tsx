import React, { useState } from 'react';
import { Plus, Tag, FileText } from 'lucide-react';

import type { Task } from '../types';

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
          title: 'Active tasks',
          accent: 'border-t-indigo-500',
          titleColor: 'text-zinc-200',
          bg: 'bg-zinc-900',
        };
      case 'waiting':
        return {
          title: 'Waiting',
          accent: 'border-t-amber-500',
          titleColor: 'text-zinc-300',
          bg: 'bg-zinc-900',
        };
      case 'later':
        return {
          title: 'Later',
          accent: 'border-t-zinc-600',
          titleColor: 'text-zinc-400',
          bg: 'bg-zinc-900',
        };
      case 'done':
        return {
          title: 'Done',
          accent: 'border-t-emerald-500',
          titleColor: 'text-zinc-400',
          bg: 'bg-zinc-900/50',
        };
    }
  };

  const renderColumn = (colStatus: 'active' | 'waiting' | 'later' | 'done') => {
    const colTasks = tasks.filter((t) => t.status === colStatus);
    const config = getColumnConfig(colStatus);

    return (
      <div className={`flex-1 flex flex-col rounded-xl border border-zinc-800/80 overflow-hidden shadow-sm ${config.bg}`}>
        {/* Column Header */}
        <div className={`px-4 py-3 border-t-2 border-b border-zinc-800/60 flex items-center justify-between shrink-0 ${config.accent}`}>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold tracking-wide ${config.titleColor}`}>
              {config.title}
            </span>
            <span className="text-sm text-zinc-500 font-medium">
              {colTasks.length}
            </span>
          </div>
          <button
            onClick={() => {
              setNewStatus(colStatus);
              setShowAddForm(true);
            }}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
            title={`Add to ${config.title}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Task Cards List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[250px] max-h-[450px]">
          {colTasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-zinc-800/60 rounded-lg">
              <span className="text-sm font-medium text-zinc-500">Empty</span>
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
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-zinc-500 font-medium mb-1">Task Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-600"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 font-medium mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 resize-none focus:outline-none focus:border-zinc-600 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 font-medium mb-1">Handoff Note</label>
                        <input
                          type="text"
                          value={editResumeNote}
                          onChange={(e) => setEditResumeNote(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-600"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value as any)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <input
                          type="text"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-600"
                          placeholder="Tag"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingTaskId(null)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer text-xs font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(task.id)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 cursor-pointer text-xs font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Task Details display */
                    <div className="flex flex-col gap-3">
                      {/* Active focus banner */}
                      {isActiveFocus && (
                        <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/20 pb-2 shrink-0 self-stretch">
                          Currently focused
                        </div>
                      )}

                      {/* Header elements */}
                      <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                        <span className={task.priority === 'high' ? 'text-rose-400' : task.priority === 'low' ? 'text-zinc-500' : 'text-amber-400/80'}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-3 w-3 text-zinc-500" />
                          <span>{task.category}</span>
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <div>
                        <h4 className={`text-sm font-medium leading-snug ${isActiveFocus ? 'text-zinc-100' : 'text-zinc-200'}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{task.description}</p>
                        )}
                      </div>

                      {/* Handoff notes */}
                      {task.resumeNote && (
                        <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-md p-2.5 flex items-start gap-2 mt-1">
                          <FileText className="h-3.5 w-3.5 text-zinc-500 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0 text-xs">
                            <span className="block font-medium text-zinc-500 mb-0.5">Handoff note</span>
                            <span className="text-zinc-300 block italic leading-relaxed">{task.resumeNote}</span>
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex flex-col gap-2 pt-3 border-t border-zinc-800/60 shrink-0">
                        {/* Destination moves */}
                        <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                          <span>Move to</span>
                          <div className="flex gap-2.5">
                            {colStatus !== 'active' && (
                              <button onClick={() => handleMoveTask(task.id, 'active')} className="text-zinc-400 hover:text-zinc-200 cursor-pointer">Active</button>
                            )}
                            {colStatus !== 'waiting' && (
                              <button onClick={() => handleMoveTask(task.id, 'waiting')} className="text-zinc-400 hover:text-zinc-200 cursor-pointer">Waiting</button>
                            )}
                            {colStatus !== 'later' && (
                              <button onClick={() => handleMoveTask(task.id, 'later')} className="text-zinc-400 hover:text-zinc-200 cursor-pointer">Later</button>
                            )}
                            {colStatus !== 'done' && (
                              <button onClick={() => handleMoveTask(task.id, 'done')} className="text-zinc-400 hover:text-zinc-200 cursor-pointer">Done</button>
                            )}
                          </div>
                        </div>

                        {/* Modify actions */}
                        <div className="flex items-center justify-between text-xs text-zinc-500 mt-1">
                          <span className="opacity-60">{task.createdAt}</span>
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing(task)}
                              className="hover:text-zinc-300 font-medium cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="hover:text-rose-400 font-medium cursor-pointer"
                            >
                              Delete
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
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
              <h3 className="text-base font-semibold text-zinc-100">Add new task</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer rounded-full p-1 hover:bg-zinc-800 transition-colors"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Task title</label>
                <input
                  type="text"
                  required
                  placeholder="Insert title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Insert details"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600 resize-none font-sans"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Handoff note (Optional)</label>
                <input
                  type="text"
                  placeholder="Insert specific resume action"
                  value={newResumeNote}
                  onChange={(e) => setNewResumeNote(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 focus:outline-none focus:border-zinc-600"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Category tag</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
                    placeholder="Tag"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Initial column</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 focus:outline-none focus:border-zinc-600"
                >
                  <option value="active">Active tasks</option>
                  <option value="waiting">Waiting</option>
                  <option value="later">Later</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/60">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-semibold cursor-pointer transition-colors"
                >
                  Add task
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
