import { useState, useEffect, useCallback } from "react";

export function useTextSelection() {
  const [selection, setSelection] = useState(null); // { text, x, y }

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setSelection(null);
      return;
    }

    const text = sel.toString().trim();
    if (!text || text.length < 2) {
      setSelection(null);
      return;
    }

    // Only trigger for English-looking text (contains at least one ASCII letter)
    if (!/[a-zA-Z]/.test(text)) {
      setSelection(null);
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelection({
      text,
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + window.scrollY - 8, // 8px gap above selection
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  return { selection, clearSelection };
}
