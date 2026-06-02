import React, { useState } from 'react';
import { Save, Edit } from 'lucide-react';

interface ResumeNoteProps {
  note: string;
  setNote: (note: string) => void;
  waitingMode: boolean;
}

export const ResumeNote: React.FC<ResumeNoteProps> = ({
  note,
  setNote,
  waitingMode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNote, setTempNote] = useState(note);
  const [lastSaved, setLastSaved] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setNote(tempNote);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsSaving(false);
      setIsEditing(false);
    }, 300);
  };

  // Simple Markdown-to-HTML parser for rendering notes
  const renderMarkdown = (text: string) => {
    if (!text.trim()) {
      return <p className="text-zinc-500 italic text-sm">No return instructions set.</p>;
    }

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="text-zinc-300 text-sm list-disc list-inside ml-2 leading-relaxed">
            {parseInlineStyles(itemText)}
          </li>
        );
      }
      if (line.trim().startsWith('# ')) {
        const headerText = line.trim().replace(/^#\s+/, '');
        return (
          <h4 key={idx} className="text-base font-semibold text-zinc-100 mt-4 mb-2 border-b border-zinc-800/60 pb-2">
            {parseInlineStyles(headerText)}
          </h4>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-zinc-300 text-sm leading-relaxed mb-2">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  const parseInlineStyles = (text: string) => {
    let currentText = text;
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const matches = currentText.split(regex);

    if (matches.length === 1) return text;

    return matches.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-zinc-100 font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className={`bg-zinc-900 rounded-2xl p-6 border transition-all duration-300 flex flex-col min-h-[300px] h-[350px] shadow-sm ${
      waitingMode ? 'border-zinc-700' : 'border-zinc-800'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-4 shrink-0">
        <span className="text-sm font-medium text-zinc-400">Resume note</span>

        {/* Edit / View Toggle */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-900 font-medium bg-zinc-100 hover:bg-white cursor-pointer transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <span className="h-3 w-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </button>
          ) : (
            <button
              onClick={() => {
                setTempNote(note);
                setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-sm font-medium"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Editor or Preview */}
      <div className="flex-1 min-h-0 flex flex-col relative">
        {isEditing ? (
          <textarea
            value={tempNote}
            onChange={(e) => setTempNote(e.target.value)}
            className="w-full flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 text-sm focus:outline-none focus:border-zinc-600 resize-none shadow-inner"
            placeholder="Set instructions for return sequence..."
          />
        ) : (
          <div className="w-full flex-1 bg-zinc-800/20 border border-zinc-800/50 rounded-xl p-4 overflow-y-auto select-text">
            <div className="space-y-1">
              {renderMarkdown(note)}
            </div>
          </div>
        )}
      </div>

      {/* Footer Saved Status */}
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 shrink-0 border-t border-zinc-800/60 pt-3 font-medium">
        <span>Auto-saved</span>
        <span>Updated: {lastSaved}</span>
      </div>
    </div>
  );
};
