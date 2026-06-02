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
      return <p className="text-zinc-600 italic text-xs font-mono-tech">No return instructions set.</p>;
    }

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="text-zinc-300 text-xs list-disc list-inside ml-2 leading-relaxed font-mono-tech">
            {parseInlineStyles(itemText)}
          </li>
        );
      }
      if (line.trim().startsWith('# ')) {
        const headerText = line.trim().replace(/^#\s+/, '');
        return (
          <h4 key={idx} className="text-xs font-bold text-zinc-100 uppercase tracking-wider font-mono-tech mt-3 mb-1.5 border-b border-zinc-900 pb-1">
            {parseInlineStyles(headerText)}
          </h4>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-zinc-400 text-xs leading-relaxed mb-1.5 font-mono-tech">
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
        return <strong key={index} className="text-zinc-200 font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-900 text-zinc-300 font-mono-tech text-[10px]">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className={`console-panel rounded-xl p-6 border transition-all duration-300 flex flex-col min-h-[300px] h-[350px] ${
      waitingMode ? 'border-zinc-800' : 'border-zinc-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 shrink-0">
        <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">AI Return Sequence Notes</span>

        {/* Edit / View Toggle */}
        <div className="flex items-center gap-1">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono-tech text-zinc-950 font-semibold bg-zinc-100 hover:bg-white cursor-pointer transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <span className="h-2.5 w-2.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-3 w-3" />
              )}
              SAVE
            </button>
          ) : (
            <button
              onClick={() => {
                setTempNote(note);
                setIsEditing(true);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer text-[10px] font-mono-tech"
            >
              <Edit className="h-3 w-3" />
              EDIT
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
            className="w-full flex-1 bg-zinc-950 border border-zinc-850 rounded-lg p-3 text-zinc-300 text-xs font-mono-tech focus:outline-none focus:border-zinc-800 resize-none shadow-inner"
            placeholder="Set instructions for return sequence..."
          />
        ) : (
          <div className="w-full flex-1 bg-zinc-950/20 border border-zinc-900 rounded-lg p-3.5 overflow-y-auto select-text">
            <div className="space-y-1">
              {renderMarkdown(note)}
            </div>
          </div>
        )}
      </div>

      {/* Footer Saved Status */}
      <div className="mt-3.5 flex items-center justify-between font-mono-tech text-[8px] text-zinc-600 shrink-0 border-t border-zinc-900 pt-2.5">
        <span>AUTO_SAVED</span>
        <span>UPDATED // {lastSaved}</span>
      </div>
    </div>
  );
};
