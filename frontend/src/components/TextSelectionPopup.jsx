import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./TextSelectionPopup.module.css";
import { translateSelection, createFlashcard } from "../api";

export default function TextSelectionPopup({ selection, onClose }) {
  const [phase, setPhase] = useState("toolbar"); // toolbar | translating | result | saving | saved
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const wrapperRef = useRef(null);

  // Reset when selection changes
  useEffect(() => {
    setPhase("toolbar");
    setResult(null);
    setError(null);
  }, [selection]);

  // Close on outside click
  useEffect(() => {
    const handleDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [onClose]);

  if (!selection) return null;

  const handleTranslate = async () => {
    setPhase("translating");
    setError(null);
    try {
      const res = await translateSelection({ text: selection.text });
      setResult(res.data);
      setPhase("result");
    } catch (err) {
      setError(err?.response?.data?.detail || "Lỗi kết nối. Thử lại!");
      setPhase("toolbar");
    }
  };

  const handleSave = async () => {
    setPhase("saving");
    const payload = {
      original_text: result?.original_text || selection.text,
      translated_text: result?.translated_text,
      explanation: result?.explanation,
      example: result?.example,
      example_translation: result?.example_translation,
      ipa: result?.ipa,
      word_type: result?.word_type,
      text_type: result?.text_type,
      source_type: "exam",
    };
    try {
      await createFlashcard(payload);
      setPhase("result");
      showToast("Đã lưu vào Flashcard!");
    } catch (err) {
      setPhase("result");
      showToast(err?.response?.data?.detail || "Lưu thất bại!", true);
    }
  };

  const handleQuickSave = async () => {
    setPhase("saving");
    try {
      await createFlashcard({
        original_text: selection.text,
        source_type: "exam",
      });
      setPhase("toolbar");
      showToast("Đã lưu vào Flashcard!");
      onClose();
    } catch (err) {
      setPhase("toolbar");
      showToast(err?.response?.data?.detail || "Lưu thất bại!", true);
    }
  };

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 2500);
  };

  const popupStyle = {
    left: selection.x,
    top: selection.y,
  };

  return createPortal(
    <>
      <div ref={wrapperRef} className={styles.wrapper} style={popupStyle}>
        {phase === "toolbar" && (
          <div className={styles.toolbar}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleTranslate}>
              Dịch
            </button>
            <button
              className={`${styles.btn} ${styles.btnSuccess}`}
              onClick={handleQuickSave}
            >
              + Flashcard
            </button>
            <button className={styles.btn} onClick={onClose}>✕</button>
          </div>
        )}

        {phase === "translating" && (
          <div className={styles.toolbar}>
            <span className={styles.spinner} />
            <span style={{ color: "#cbd5e1", fontSize: 12 }}>Đang dịch…</span>
          </div>
        )}

        {phase === "saving" && (
          <div className={styles.toolbar}>
            <span className={styles.spinner} />
            <span style={{ color: "#cbd5e1", fontSize: 12 }}>Đang lưu…</span>
          </div>
        )}

        {error && (
          <div className={styles.toolbar}>
            <span style={{ color: "#fca5a5", fontSize: 12 }}>{error}</span>
            <button className={styles.btn} onClick={handleTranslate}>Thử lại</button>
            <button className={styles.btn} onClick={onClose}>✕</button>
          </div>
        )}

        {phase === "result" && result && (
          <div className={styles.card}>
            <button className={styles.closeBtn} onClick={onClose}>×</button>

            <div className={styles.selectedText}>"{result.original_text}"</div>

            <div className={styles.translationRow}>
              <div className={styles.label}>Nghĩa tiếng Việt</div>
              <div className={styles.value}>{result.translated_text}</div>
            </div>

            <div className={styles.meta}>
              {result.text_type && (
                <span className={styles.badge}>{result.text_type}</span>
              )}
              {result.word_type && (
                <span className={`${styles.badge} ${styles.badgeBlue}`}>{result.word_type}</span>
              )}
              {result.ipa && (
                <span className={styles.badge}>{result.ipa}</span>
              )}
            </div>

            {result.example && (
              <div className={styles.example}>
                <strong>Ví dụ:</strong> {result.example}
                {result.example_translation && (
                  <div style={{ marginTop: 3, color: "#15803d" }}>→ {result.example_translation}</div>
                )}
              </div>
            )}

            {result.explanation && (
              <div className={styles.explanation}>
                <strong>Giải thích:</strong> {result.explanation}
              </div>
            )}

            <div className={styles.cardActions}>
              <button
                className={`${styles.btn} ${styles.btnSuccess}`}
                style={{ flex: 1, justifyContent: "center" }}
                onClick={handleSave}
              >
                Lưu Flashcard
              </button>
              <button className={styles.btn} onClick={onClose} style={{ justifyContent: "center" }}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div
          className={styles.toast}
          style={{ background: toast.isError ? "#ef4444" : "#10b981" }}
        >
          {toast.msg}
        </div>
      )}
    </>,
    document.body
  );
}
