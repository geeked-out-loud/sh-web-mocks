"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type Option<T = string> = { value: T; label: string };

type Props<T = string> = {
  value: T;
  options: Option<T>[];
  onChangeAction: (v: T) => void;
  className?: string;
  placeholder?: string;
};

export default function Dropdown<T = string>({ value, options, onChangeAction, className = '', placeholder }: Props<T>) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!btnRef.current) return;
      if (e.target instanceof Node && (btnRef.current.contains(e.target) || listRef.current?.contains(e.target))) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => { if (open) setHighlight(options.findIndex(o => o.value === value)); }, [open, value, options]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight(h => Math.min((h ?? -1) + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setHighlight(h => Math.max((h ?? options.length) - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) return setOpen(true);
      if (highlight != null) onChangeAction(options[highlight].value);
      setOpen(false);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const selected = options.find(o => o.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(s => !s)}
        onKeyDown={handleKey}
        className="w-full relative rounded-md bg-[#436571]/10 border border-white/10 text-white px-3 pr-10 text-left h-12 flex items-center"
      >
        <span className="truncate text-white">{selected?.label ?? placeholder}</span>
        {/* chevron positioned absolutely to the right to avoid layout shift */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown size={18} style={{ color: 'rgba(67,101,113)' }} />
        </div>
      </button>

      {open && (
        <div ref={listRef} role="listbox" tabIndex={-1} className="absolute z-50 mt-2 w-full rounded-md bg-[#202F34] backdrop-blur-sm border border-white/6 shadow-lg max-h-60 overflow-auto text-white">
          {options.map((o, i) => (
            <div
              key={String(o.value)}
              role="option"
              aria-selected={o.value === value}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => { onChangeAction(o.value); setOpen(false); }}
              className={`px-3 py-2 cursor-pointer text-white ${highlight === i ? 'bg-white/10' : ''}`}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
