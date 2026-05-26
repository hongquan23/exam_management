import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Search, RotateCcw, Check, X, ChevronLeft, ChevronRight,
  Pencil, Trash2, Star, Brain, Layers, Filter, Calendar, Gamepad2, Shuffle,
} from "lucide-react";
import { getFlashcards, deleteFlashcard, updateFlashcard, markFlashcard } from "../api";
import MultipleChoiceGame from "./games/MultipleChoiceGame";
import WordMatchingGame   from "./games/WordMatchingGame";

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_META = {
  word:     { label: "Từ",       bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6" },
  phrase:   { label: "Cụm từ",   bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  sentence: { label: "Câu",      bg: "#dcfce7", color: "#15803d", dot: "#10b981" },
};

const FILTERS = [
  { value: "",         label: "Tất cả",   icon: <Layers size={13} /> },
  { value: "word",     label: "Từ đơn",   icon: <BookOpen size={13} /> },
  { value: "phrase",   label: "Cụm từ",   icon: <Filter size={13} /> },
  { value: "sentence", label: "Câu",      icon: <Brain size={13} /> },
];

const PAGE_SIZE = 12;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Flashcards({ onBack }) {
  const [cards, setCards]           = useState([]);
  const [total, setTotal]           = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [debouncedSearch, setDeb]   = useState("");
  const [textType, setTextType]     = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIdx, setReviewIdx]   = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [editCard, setEditCard]     = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [activeGame, setActiveGame] = useState(null); // null | "quiz" | "match"
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [allCards, setAllCards]     = useState([]); // unfiltered cards for games

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDeb(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFlashcards({
        page,
        page_size: PAGE_SIZE,
        text_type: textType || undefined,
        search: debouncedSearch || undefined,
      });
      const data = res.data;
      setCards(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
      setKnownCount(data.items.filter((c) => c.is_known).length);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, textType, debouncedSearch]);

  // Load all cards (unfiltered) for games — up to 50 cards
  const fetchAllCards = useCallback(async () => {
    try {
      const res = await getFlashcards({ page: 1, page_size: 50 });
      setAllCards(res.data.items.filter((c) => c.translated_text));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { fetchCards(); }, [fetchCards]);
  useEffect(() => { fetchAllCards(); }, [fetchAllCards]);
  useEffect(() => { setPage(1); }, [textType, debouncedSearch]);

  const handleDelete = async (id) => {
    await deleteFlashcard(id);
    setDeleteId(null);
    fetchCards();
  };

  const handleMark = async (card, val) => {
    await markFlashcard(card.id, val);
    if (reviewMode) {
      setShowAnswer(false);
      if (reviewIdx < cards.length - 1) setReviewIdx((i) => i + 1);
      else { setReviewMode(false); setReviewIdx(0); fetchCards(); }
    } else {
      fetchCards();
    }
  };

  const openEdit = (card) => {
    setEditCard(card);
    setEditForm({
      original_text:      card.original_text      || "",
      translated_text:    card.translated_text    || "",
      ipa:                card.ipa                || "",
      word_type:          card.word_type          || "",
      example:            card.example            || "",
      example_translation:card.example_translation|| "",
      explanation:        card.explanation        || "",
    });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateFlashcard(editCard.id, editForm);
      setEditCard(null);
      fetchCards();
    } finally {
      setSaving(false);
    }
  };

  // ── Review Mode ─────────────────────────────────────────────────────────────
  if (reviewMode && cards.length > 0) {
    const card = cards[reviewIdx];
    const progress = ((reviewIdx) / cards.length) * 100;
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px" }}>
          <button
            onClick={() => { setReviewMode(false); setReviewIdx(0); fetchCards(); }}
            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#cbd5e1", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
          >
            <ChevronLeft size={16} /> Thoát
          </button>
          <div style={{ color: "#94a3b8", fontSize: 13 }}>
            <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{reviewIdx + 1}</span> / {cards.length}
          </div>
          <div style={{ width: 80 }} />
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.1)", margin: "0 28px" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 99, transition: "width 0.4s ease" }} />
        </div>

        {/* Card */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
          <div style={{
            width: "100%", maxWidth: 520,
            background: "#ffffff", borderRadius: 24,
            padding: "36px 32px", textAlign: "center",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
          }}>
            {/* type badge */}
            {card.text_type && (
              <span style={{
                display: "inline-block", marginBottom: 16,
                padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                ...(TYPE_META[card.text_type] || TYPE_META.phrase),
              }}>
                {(TYPE_META[card.text_type] || {}).label || card.text_type}
              </span>
            )}

            {/* Front */}
            <div style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", lineHeight: 1.2, marginBottom: 8 }}>
              {card.original_text}
            </div>
            {card.ipa && (
              <div style={{ fontSize: 16, color: "#6366f1", fontFamily: "serif", marginBottom: 20 }}>
                {card.ipa}
              </div>
            )}

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                style={{ marginTop: 12, padding: "12px 36px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}
              >
                Xem đáp án
              </button>
            ) : (
              <div>
                <div style={{ height: 1, background: "#f1f5f9", margin: "4px 0 20px" }} />
                {card.translated_text && (
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                    {card.translated_text}
                  </div>
                )}
                {card.word_type && (
                  <span style={{ display: "inline-block", background: "#e0e7ff", color: "#3730a3", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, marginBottom: 14 }}>
                    {card.word_type}
                  </span>
                )}
                {card.example && (
                  <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "10px 14px", marginBottom: 10, textAlign: "left" }}>
                    <div style={{ fontSize: 13, color: "#166534", fontStyle: "italic" }}>{card.example}</div>
                    {card.example_translation && (
                      <div style={{ fontSize: 12, color: "#15803d", marginTop: 4 }}>→ {card.example_translation}</div>
                    )}
                  </div>
                )}
                {card.explanation && (
                  <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 10, padding: "10px 14px", marginBottom: 14, textAlign: "left", fontSize: 12, color: "#78350f" }}>
                    {card.explanation}
                  </div>
                )}
                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
                  <button
                    onClick={() => handleMark(card, false)}
                    style={{ flex: 1, padding: "12px 0", background: "#fff1f2", color: "#e11d48", border: "2px solid #fecdd3", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <X size={16} /> Chưa thuộc
                  </button>
                  <button
                    onClick={() => handleMark(card, true)}
                    style={{ flex: 1, padding: "12px 0", background: "#f0fdf4", color: "#15803d", border: "2px solid #86efac", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <Check size={16} /> Đã thuộc
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Main Page ────────────────────────────────────────────────────────────────
  const unknownCount = total - knownCount;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* ── Hero Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #312e81 100%)",
        padding: "28px 32px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -60, left: -20, width: 160, height: 160, background: "rgba(255,255,255,0.03)", borderRadius: "50%" }} />

        <div style={{ position: "relative" }}>
          <button
            onClick={onBack}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, marginBottom: 20 }}
          >
            <ChevronLeft size={15} /> Quay lại
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={18} color="#fff" />
                </div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff" }}>Flashcard của tôi</h1>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                Bôi đen bất kỳ từ tiếng Anh nào để thêm thẻ mới
              </p>
            </div>

            {allCards.length >= 4 && (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setShowGamePicker(true)}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 12, padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  <Gamepad2 size={16} /> Chơi game
                </button>
                <button
                  onClick={() => { setReviewMode(true); setReviewIdx(0); setShowAnswer(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}
                >
                  <Brain size={16} /> Luyện tập ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats cards (floating over gradient) ── */}
      <div style={{ maxWidth: 1100, margin: "-44px auto 0", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
          {[
            { label: "Tổng thẻ",    value: total,        icon: <Layers size={18} color="#6366f1" />,  bg: "#fff", val_color: "#1e293b" },
            { label: "Đã thuộc",    value: knownCount,   icon: <Check size={18} color="#10b981" />,   bg: "#fff", val_color: "#15803d" },
            { label: "Chưa thuộc",  value: unknownCount, icon: <RotateCcw size={18} color="#f59e0b" />, bg: "#fff", val_color: "#92400e" },
          ].map((s) => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "16px 18px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, background: "#f8fafc", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.val_color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 24px 40px" }}>

        {/* ── Filter bar ── */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              style={{ width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", background: "#f8fafc", boxSizing: "border-box" }}
              placeholder="Tìm kiếm từ, nghĩa…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Type filters */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTextType(f.value)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  border: textType === f.value ? "none" : "1px solid #e2e8f0",
                  background: textType === f.value ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f8fafc",
                  color: textType === f.value ? "#fff" : "#64748b",
                  boxShadow: textType === f.value ? "0 2px 10px rgba(99,102,241,0.3)" : "none",
                }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <LoadingGrid />
        ) : cards.length === 0 ? (
          <EmptyState hasSearch={!!debouncedSearch || !!textType} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(275px,1fr))", gap: 16 }}>
            {cards.map((card) => (
              <FlashCard
                key={card.id}
                card={card}
                onDelete={() => setDeleteId(card.id)}
                onMark={(val) => handleMark(card, val)}
                onEdit={() => openEdit(card)}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 32 }}>
            <PageBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={16} />
            </PageBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 36, height: 36, borderRadius: 9, border: "none",
                    background: p === page ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#fff",
                    color: p === page ? "#fff" : "#64748b",
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    boxShadow: p === page ? "0 2px 10px rgba(99,102,241,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >{p}</button>
              ))}
            <PageBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight size={16} />
            </PageBtn>
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <Modal onClose={() => setDeleteId(null)}>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ width: 56, height: 56, background: "#fff1f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Trash2 size={24} color="#e11d48" />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "#1e293b" }}>Xóa flashcard?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#64748b" }}>Hành động này không thể hoàn tác.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={cancelBtnStyle}>Hủy</button>
              <button onClick={() => handleDelete(deleteId)} style={deleteBtnStyle}>Xóa</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Game Picker ── full-screen dark */}
      {showGamePicker && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 60%,#0f2027 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}>
          {/* Animated bg dots */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {["#6366f1","#f59e0b","#10b981","#8b5cf6","#3b82f6","#ec4899"].map((c,i) => (
              <div key={i} style={{
                position: "absolute",
                left: `${12 + i * 16}%`, top: `${20 + (i * 41) % 60}%`,
                width: 4 + i % 3, height: 4 + i % 3,
                background: c, borderRadius: "50%", opacity: 0.35,
                animation: `twinkle2 ${2 + i * 0.4}s ease-in-out infinite alternate`,
              }} />
            ))}
          </div>
          <style>{`@keyframes twinkle2{from{opacity:0.15}to{opacity:0.5}}`}</style>

          <button
            onClick={() => setShowGamePicker(false)}
            style={{ position: "absolute", top: 18, right: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1", borderRadius: 10, padding: "7px 10px", cursor: "pointer", display: "flex" }}
          >
            <X size={18} />
          </button>

          <div style={{ textAlign: "center", marginBottom: 32, position: "relative" }}>
            <div style={{ fontSize: 48, marginBottom: 8, animation: "bounce2 1s ease infinite alternate" }}>🎮</div>
            <style>{`@keyframes bounce2{from{transform:translateY(0)}to{transform:translateY(-10px)}}`}</style>
            <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#fff" }}>Chọn game</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{allCards.length} flashcard sẵn sàng</p>
          </div>

          {/* Game cards */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", position: "relative", maxWidth: 680 }}>
            {[
              {
                key: "quiz", emoji: "🧠",
                title: "Multiple Choice",
                sub: "10 câu · 15s/câu · streak bonus",
                tags: ["Điểm số", "Streak 🔥", "Timer ⏱️"],
                grad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                glow: "rgba(99,102,241,0.45)",
                border: "rgba(139,92,246,0.5)",
              },
              {
                key: "match", emoji: "🔗",
                title: "Word Matching",
                sub: "6 cặp · ghép nhanh · time bonus",
                tags: ["Time bonus ⚡", "Ít lỗi ⭐⭐⭐", "Confetti 🎉"],
                grad: "linear-gradient(135deg,#f59e0b,#d97706)",
                glow: "rgba(245,158,11,0.4)",
                border: "rgba(245,158,11,0.5)",
              },
            ].map((g) => (
              <button
                key={g.key}
                onClick={() => { setShowGamePicker(false); setActiveGame(g.key); }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                  gap: 0, padding: "24px 22px 20px",
                  background: "rgba(255,255,255,0.05)",
                  border: `2px solid ${g.border}`,
                  borderRadius: 20, cursor: "pointer", textAlign: "left",
                  width: 280, transition: "all 0.2s",
                  boxShadow: `0 0 0 0 ${g.glow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${g.glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `0 0 0 0 ${g.glow}`;
                }}
              >
                {/* Icon circle */}
                <div style={{ width: 56, height: 56, borderRadius: 16, background: g.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 16, boxShadow: `0 4px 16px ${g.glow}` }}>
                  {g.emoji}
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{g.title}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>{g.sub}</div>
                {/* Feature tags */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {g.tags.map((t) => (
                    <span key={t} style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 600 }}>
                      {t}
                    </span>
                  ))}
                </div>
                {/* Play arrow */}
                <div style={{ marginTop: 18, alignSelf: "stretch", padding: "9px 0", background: g.grad, borderRadius: 10, textAlign: "center", fontSize: 13, fontWeight: 800, color: "#fff", boxShadow: `0 2px 12px ${g.glow}` }}>
                  Chơi ngay →
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Active Games ── */}
      {activeGame === "quiz" && allCards.length >= 4 && (
        <MultipleChoiceGame cards={allCards} onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "match" && allCards.length >= 4 && (
        <WordMatchingGame cards={allCards} onClose={() => setActiveGame(null)} />
      )}

      {/* ── Edit Modal ── */}
      {editCard && (
        <Modal onClose={() => setEditCard(null)} wide>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: "#ede9fe", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Pencil size={16} color="#7c3aed" />
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Chỉnh sửa Flashcard</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["original_text",      "Từ / Cụm từ gốc",    false],
              ["translated_text",    "Nghĩa tiếng Việt",   false],
              ["ipa",                "Phiên âm IPA",        false],
              ["word_type",          "Loại từ",             false],
              ["example",            "Câu ví dụ",           true ],
              ["example_translation","Nghĩa câu ví dụ",     true ],
              ["explanation",        "Giải thích ngữ cảnh", true ],
            ].map(([key, label, multiline]) => (
              <div key={key} style={{ gridColumn: multiline ? "1 / -1" : "auto" }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>
                  {label}
                </label>
                <textarea
                  rows={multiline ? 2 : 1}
                  style={{ width: "100%", padding: "8px 11px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, resize: "none", boxSizing: "border-box", fontFamily: "inherit", outline: "none", background: "#f8fafc", lineHeight: 1.5 }}
                  value={editForm[key]}
                  onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setEditCard(null)} style={{ ...cancelBtnStyle, flex: 1 }}>Hủy</button>
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              style={{ flex: 2, padding: "10px 0", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Đang lưu…" : "Lưu thay đổi"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── FlashCard Item ──────────────────────────────────────────────────────────

function FlashCard({ card, onDelete, onMark, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const meta = TYPE_META[card.text_type] || TYPE_META.phrase;

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      boxShadow: card.is_known ? "0 0 0 2px #10b981, 0 4px 16px rgba(16,185,129,0.1)" : "0 2px 12px rgba(0,0,0,0.07)",
      display: "flex", flexDirection: "column",
      transition: "box-shadow 0.2s, transform 0.15s",
      overflow: "hidden",
    }}>
      {/* Top color strip */}
      <div style={{ height: 4, background: card.is_known ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#6366f1,#8b5cf6)" }} />

      <div style={{ padding: "14px 16px 0", flex: 1 }}>
        {/* Badges row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {card.text_type && (
              <span style={{ borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", background: meta.bg, color: meta.color }}>
                {meta.label}
              </span>
            )}
            {card.is_known && (
              <span style={{ borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700, background: "#dcfce7", color: "#15803d", display: "flex", alignItems: "center", gap: 3 }}>
                <Check size={9} /> Thuộc
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            <IconBtn onClick={onEdit} title="Sửa"><Pencil size={13} /></IconBtn>
            <IconBtn onClick={onDelete} title="Xóa" danger><Trash2 size={13} /></IconBtn>
          </div>
        </div>

        {/* Original word */}
        <div
          onClick={() => setExpanded((e) => !e)}
          style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, cursor: "pointer", userSelect: "none", marginBottom: 4 }}
        >
          {card.original_text}
        </div>

        {/* IPA */}
        {card.ipa && (
          <div style={{ fontSize: 13, color: "#6366f1", fontFamily: "serif", marginBottom: 6 }}>
            {card.ipa}
          </div>
        )}

        {/* Collapsed: show translation preview */}
        {!expanded && card.translated_text && (
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8, fontStyle: "italic" }}>
            {card.translated_text.length > 50 ? card.translated_text.slice(0, 50) + "…" : card.translated_text}
          </div>
        )}

        {/* Expanded details */}
        {expanded && (
          <div style={{ marginBottom: 8 }}>
            {card.translated_text && (
              <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 600, marginBottom: 6 }}>
                {card.translated_text}
              </div>
            )}
            {card.word_type && (
              <span style={{ display: "inline-block", background: "#e0e7ff", color: "#3730a3", borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700, marginBottom: 8 }}>
                {card.word_type}
              </span>
            )}
            {card.example && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9, padding: "8px 11px", marginBottom: 7, fontSize: 12, color: "#166534", lineHeight: 1.5 }}>
                <em>{card.example}</em>
                {card.example_translation && (
                  <div style={{ color: "#15803d", marginTop: 3, fontStyle: "normal" }}>→ {card.example_translation}</div>
                )}
              </div>
            )}
            {card.explanation && (
              <div style={{ background: "#fefce8", border: "1px solid #fde047", borderRadius: 9, padding: "8px 11px", fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
                {card.explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", marginTop: 6 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onMark(!card.is_known)}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 11px",
              border: "none", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: card.is_known ? "#fff1f2" : "#f0fdf4",
              color: card.is_known ? "#e11d48" : "#15803d",
            }}
          >
            {card.is_known ? <><X size={11} /> Chưa thuộc</> : <><Check size={11} /> Đã thuộc</>}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#cbd5e1" }}>
          <Calendar size={10} />
          {fmtDate(card.created_at)}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function IconBtn({ children, onClick, title, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? (danger ? "#fff1f2" : "#f1f5f9") : "none",
        border: "none", borderRadius: 6, padding: "5px 6px", cursor: "pointer",
        color: hov ? (danger ? "#e11d48" : "#475569") : "#cbd5e1",
        display: "flex", alignItems: "center", transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function PageBtn({ children, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 36, height: 36, borderRadius: 9, border: "1px solid #e2e8f0",
        background: "#fff", color: "#64748b", cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: disabled ? 0.4 : 1, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </button>
  );
}

function Modal({ children, onClose, wide }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 18, padding: "26px 24px 22px", width: "100%", maxWidth: wide ? 520 : 360, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
      >
        {children}
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(275px,1fr))", gap: 16 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 16, height: 160, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <div style={{ height: 4, background: "#f1f5f9" }} />
          <div style={{ padding: 16 }}>
            {[80, 50, 90].map((w, j) => (
              <div key={j} style={{ height: j === 1 ? 12 : 16, width: `${w}%`, background: "#f1f5f9", borderRadius: 6, marginBottom: 10, animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasSearch }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ width: 72, height: 72, background: "linear-gradient(135deg,#ede9fe,#dbeafe)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
        <BookOpen size={30} color="#6366f1" />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
        {hasSearch ? "Không tìm thấy kết quả" : "Chưa có flashcard nào"}
      </div>
      <div style={{ fontSize: 13, color: "#94a3b8", maxWidth: 300, margin: "0 auto" }}>
        {hasSearch
          ? "Thử tìm với từ khóa khác hoặc bỏ bộ lọc."
          : "Bôi đen bất kỳ từ tiếng Anh nào trong bài học, đề thi hoặc chatbot rồi nhấn \"+ Flashcard\"."}
      </div>
    </div>
  );
}

// ─── Shared button styles ─────────────────────────────────────────────────────

const cancelBtnStyle = {
  flex: 1, padding: "10px 0", background: "#f8fafc", color: "#64748b",
  border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer",
};

const deleteBtnStyle = {
  flex: 1, padding: "10px 0", background: "linear-gradient(135deg,#e11d48,#be123c)",
  color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer",
};
