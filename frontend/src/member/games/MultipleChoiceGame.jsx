import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Zap, Clock, RotateCcw, ChevronRight, Home } from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────
const Q_TIME   = 15;   // seconds per question
const Q_COUNT  = 10;
const OPTS     = ["A", "B", "C", "D"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(cards) {
  return shuffle(cards).slice(0, Math.min(Q_COUNT, cards.length)).map((correct) => {
    const decoys = shuffle(cards.filter((c) => c.id !== correct.id)).slice(0, 3);
    return { correct, options: shuffle([correct, ...decoys]) };
  });
}

// ─── Confetti ────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    color: ["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#3b82f6","#ec4899"][i % 7],
    size: 6 + Math.random() * 8,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10001, overflow: "hidden" }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.left}%`, top: "-10px",
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `confettiFall 2.5s ${p.delay}s ease-in forwards`,
        }} />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Feedback Overlay ─────────────────────────────────────────────────────────
function FeedbackFlash({ correct }) {
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      background: correct ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
      borderRadius: 24, zIndex: 10, pointerEvents: "none",
      animation: "flashIn 0.15s ease",
    }}>
      <div style={{ fontSize: 80, animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
        {correct ? "✅" : "❌"}
      </div>
      <style>{`
        @keyframes flashIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn   { from { transform: scale(0.3) } to { transform: scale(1) } }
      `}</style>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MultipleChoiceGame({ cards, onClose }) {
  const [phase, setPhase]         = useState("intro"); // intro | playing | done
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx]           = useState(0);
  const [selected, setSelected]   = useState(null);
  const [feedback, setFeedback]   = useState(null); // "correct"|"wrong"|null
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [history, setHistory]     = useState([]);
  const [qTimer, setQTimer]       = useState(Q_TIME);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef                  = useRef(null);

  const startGame = useCallback(() => {
    const qs = buildQuestions(cards);
    setQuestions(qs);
    setQIdx(0); setSelected(null); setFeedback(null);
    setScore(0); setStreak(0); setMaxStreak(0);
    setHistory([]); setQTimer(Q_TIME); setTotalTime(0);
    setPhase("playing");
  }, [cards]);

  // Per-question timer
  useEffect(() => {
    if (phase !== "playing" || feedback !== null) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setQTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current); handleAnswer(null); return 0; }
        return t - 1;
      });
      setTotalTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, qIdx, feedback]);

  // Keyboard support
  useEffect(() => {
    if (phase !== "playing") return;
    const handle = (e) => {
      if (selected !== null || feedback !== null) {
        if (e.key === "Enter" || e.key === " ") goNext();
        return;
      }
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, "a": 0, "b": 1, "c": 2, "d": 3 };
      const idx = map[e.key.toLowerCase()];
      if (idx !== undefined && questions[qIdx]?.options[idx]) {
        handleAnswer(questions[qIdx].options[idx]);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [phase, qIdx, selected, feedback, questions]);

  const handleAnswer = (card) => {
    if (selected !== null || feedback !== null) return;
    clearInterval(timerRef.current);

    const q = questions[qIdx];
    const isCorrect = card && card.id === q.correct.id;

    setSelected(card ? card.id : null);
    setFeedback(isCorrect ? "correct" : "wrong");

    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    setMaxStreak((m) => Math.max(m, newStreak));
    if (isCorrect) setScore((s) => s + 100 + (newStreak > 1 ? (newStreak - 1) * 25 : 0));
    setHistory((h) => [...h, { correct: q.correct, chosen: card, wasCorrect: isCorrect }]);

    setTimeout(goNext, isCorrect ? 900 : 1400);
  };

  const goNext = () => {
    setFeedback(null);
    setSelected(null);
    setQTimer(Q_TIME);
    if (qIdx + 1 >= questions.length) { setPhase("done"); }
    else { setQIdx((i) => i + 1); }
  };

  const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const pct = questions.length ? Math.round((score / (questions.length * 100)) * 100) : 0;
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

  // ── Intro ───────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <FullScreen onClose={onClose}>
        <div style={{ textAlign: "center", maxWidth: 420, margin: "0 auto" }}>
          <div style={{ fontSize: 72, marginBottom: 12, animation: "bounce 1s ease infinite alternate" }}>🧠</div>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 900, color: "#fff" }}>Multiple Choice</h1>
          <p style={{ margin: "0 0 32px", color: "#94a3b8", fontSize: 15 }}>
            {Math.min(Q_COUNT, cards.length)} câu · {Q_TIME}s mỗi câu · Streak bonus 🔥
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {[
              ["⌨️", "Nhấn A/B/C/D hoặc 1/2/3/4 để chọn nhanh"],
              ["⚡", "Trả lời liên tiếp đúng để nhân điểm combo"],
              ["⏱️", "Hết giờ mỗi câu tự chuyển sang câu kế"],
            ].map(([icon, text]) => (
              <div key={text} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <span style={{ color: "#cbd5e1", fontSize: 13 }}>{text}</span>
              </div>
            ))}
          </div>
          <button onClick={startGame} style={startBtn}>Bắt đầu ngay →</button>
        </div>
        <style>{`@keyframes bounce { from{transform:translateY(0)} to{transform:translateY(-12px)} }`}</style>
      </FullScreen>
    );
  }

  // ── Done ────────────────────────────────────────────────────────────────────
  if (phase === "done") {
    const wrong = history.filter((h) => !h.wasCorrect);
    return (
      <FullScreen onClose={onClose} scrollable>
        {stars === 3 && <Confetti />}
        <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 8, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
            {stars === 3 ? "🏆" : stars === 2 ? "🎯" : "💪"}
          </div>
          <h2 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 900, color: "#fff" }}>
            {stars === 3 ? "Hoàn hảo!" : stars === 2 ? "Khá lắm!" : "Cố lên!"}
          </h2>

          {/* Stars */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "12px 0 20px" }}>
            {[1, 2, 3].map((i) => (
              <span key={i} style={{ fontSize: 32, animation: `popIn 0.4s ${i * 0.15}s both cubic-bezier(0.34,1.56,0.64,1)` }}>
                {i <= stars ? "⭐" : "☆"}
              </span>
            ))}
          </div>

          {/* Score ring */}
          <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto 20px" }}>
            <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
              <circle cx="65" cy="65" r="54" fill="none"
                stroke={stars === 3 ? "#10b981" : stars === 2 ? "#f59e0b" : "#6366f1"} strokeWidth="10"
                strokeDasharray={`${(pct / 100) * 339} 339`} strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>điểm</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { icon: "✅", label: "Đúng", val: history.filter(h=>h.wasCorrect).length },
              { icon: "🔥", label: "Streak cao", val: maxStreak },
              { icon: "⏱️", label: "Thời gian", val: fmtTime(totalTime) },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 8px" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Wrong answers */}
          {wrong.length > 0 && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 20, textAlign: "left" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Ôn lại những từ này</div>
              {wrong.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: "#f87171", fontSize: 16, lineHeight: 1 }}>•</span>
                  <div>
                    <span style={{ fontWeight: 700, color: "#fff" }}>{h.correct.original_text}</span>
                    <span style={{ color: "#64748b" }}> = </span>
                    <span style={{ color: "#34d399" }}>{h.correct.translated_text}</span>
                    {h.chosen && <div style={{ color: "#f87171", fontSize: 11, marginTop: 1 }}>Bạn chọn: {h.chosen.original_text}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px 0", background: "rgba(255,255,255,0.08)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <Home size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> Thoát
            </button>
            <button onClick={startGame} style={startBtn}>
              <RotateCcw size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> Chơi lại
            </button>
          </div>
        </div>
        <style>{`@keyframes popIn { from{transform:scale(0.3);opacity:0} to{transform:scale(1);opacity:1} }`}</style>
      </FullScreen>
    );
  }

  // ── Playing ─────────────────────────────────────────────────────────────────
  const q = questions[qIdx];
  if (!q) return null;
  const timerPct = (qTimer / Q_TIME) * 100;
  const timerColor = qTimer <= 4 ? "#ef4444" : qTimer <= 8 ? "#f59e0b" : "#6366f1";

  return (
    <FullScreen onClose={onClose}>
      {/* HUD */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexShrink: 0 }}>
        {/* Score */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "6px 14px" }}>
          <Zap size={14} color="#f59e0b" fill="#f59e0b" />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{score}</span>
        </div>

        {/* Question count */}
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
          <span style={{ color: "#fff", fontWeight: 800 }}>{qIdx + 1}</span> / {questions.length}
        </div>

        {/* Streak */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, background: streak >= 2 ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)", borderRadius: 20, padding: "6px 14px", transition: "background 0.3s" }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ color: streak >= 2 ? "#fbbf24" : "#64748b", fontWeight: 800, fontSize: 14 }}>{streak}</span>
        </div>
      </div>

      {/* Progress bar (question steps) */}
      <div style={{ display: "flex", gap: 3, marginBottom: 16, flexShrink: 0 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 99,
            background: i < qIdx ? "#6366f1" : i === qIdx ? timerColor : "rgba(255,255,255,0.1)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      {/* Countdown ring */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, flexShrink: 0 }}>
        <div style={{ position: "relative", width: 52, height: 52 }}>
          <svg width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="26" cy="26" r="21" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle cx="26" cy="26" r="21" fill="none"
              stroke={timerColor} strokeWidth="4"
              strokeDasharray={`${(timerPct / 100) * 132} 132`} strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.9s linear, stroke 0.3s" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: timerColor, transition: "color 0.3s" }}>{qTimer}</span>
          </div>
        </div>
      </div>

      {/* Question card */}
      <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, textAlign: "center", flexShrink: 0, position: "relative" }}>
        {feedback && <FeedbackFlash correct={feedback === "correct"} />}
        <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
          Nghĩa tiếng Việt là gì?
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.4, minHeight: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {q.correct.translated_text || q.correct.original_text}
        </div>
        {q.correct.word_type && (
          <div style={{ marginTop: 8, display: "inline-block", background: "rgba(99,102,241,0.25)", color: "#a5b4fc", borderRadius: 20, padding: "2px 12px", fontSize: 11, fontWeight: 700 }}>
            {q.correct.word_type}
          </div>
        )}
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flexShrink: 0 }}>
        {q.options.map((opt, i) => {
          const isThis  = selected === opt.id;
          const isRight = opt.id === q.correct.id;
          let bg = "rgba(255,255,255,0.06)";
          let border = "rgba(255,255,255,0.1)";
          let color = "#e2e8f0";

          if (feedback) {
            if (isRight)       { bg = "rgba(16,185,129,0.2)"; border = "#10b981"; color = "#6ee7b7"; }
            else if (isThis)   { bg = "rgba(239,68,68,0.2)";  border = "#ef4444"; color = "#fca5a5"; }
          }

          return (
            <button
              key={opt.id}
              onClick={() => !feedback && handleAnswer(opt)}
              style={{
                padding: "14px 12px", background: bg, border: `2px solid ${border}`,
                borderRadius: 14, cursor: feedback ? "default" : "pointer",
                color, fontWeight: 700, fontSize: 13, textAlign: "left",
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10,
                minHeight: 56,
              }}
            >
              <span style={{
                width: 26, height: 26, flexShrink: 0, borderRadius: 8,
                background: feedback && isRight ? "#10b981" : feedback && isThis ? "#ef4444" : "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 900, color: "#fff",
              }}>
                {OPTS[i]}
              </span>
              <span style={{ lineHeight: 1.3 }}>{opt.original_text}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback bar */}
      {feedback && (
        <div style={{
          marginTop: 14, padding: "10px 16px", borderRadius: 12, flexShrink: 0,
          background: feedback === "correct" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
          border: `1px solid ${feedback === "correct" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
          fontSize: 13, fontWeight: 600,
          color: feedback === "correct" ? "#6ee7b7" : "#fca5a5",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          animation: "slideUp 0.2s ease",
        }}>
          <span>
            {feedback === "correct"
              ? `✅ Chính xác!${streak > 1 ? ` 🔥 Combo ×${streak}` : ""}`
              : `❌ Đáp án: "${q.correct.original_text}"`}
          </span>
          <span style={{ fontSize: 11, color: "#64748b" }}>tự động chuyển…</span>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes popIn   { from{transform:scale(0.3);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>
    </FullScreen>
  );
}

// ─── Full-screen layout ───────────────────────────────────────────────────────
function FullScreen({ children, onClose, scrollable }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(160deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)",
      display: "flex", flexDirection: "column",
      overflowY: scrollable ? "auto" : "hidden",
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        style={{ position: "fixed", top: 16, right: 16, zIndex: 10000, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", borderRadius: 10, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
      >
        <X size={14} /> Thoát
      </button>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 20px 24px", maxWidth: 500, margin: "0 auto", width: "100%" }}>
        {children}
      </div>
    </div>
  );
}

const startBtn = {
  flex: 1, padding: "14px 28px",
  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  color: "#fff", border: "none", borderRadius: 14,
  fontSize: 16, fontWeight: 800, cursor: "pointer",
  boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
  width: "100%",
};
