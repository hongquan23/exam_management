import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, RotateCcw, Zap, Timer } from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────
const PAIR_COUNT = 6;
const COLORS = ["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#3b82f6","#ec4899","#14b8a6"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(cards) {
  const picked = shuffle(cards).slice(0, Math.min(PAIR_COUNT, cards.length));
  // Assign a color per pair so matched tiles light up with same hue
  const pairColor = {};
  picked.forEach((c, i) => { pairColor[c.id] = COLORS[i % COLORS.length]; });
  const left  = shuffle(picked.map((c) => ({ id: c.id, text: c.original_text,  side: "en" })));
  const right = shuffle(picked.map((c) => ({ id: c.id, text: c.translated_text || c.original_text, side: "vi" })));
  return { left, right, total: picked.length, pairColor };
}

const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

// ─── Confetti ────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 48 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 0.8,
    color: COLORS[i % COLORS.length], size: 6 + Math.random() * 8,
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:10001, overflow:"hidden" }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.left}%`, top:"-10px",
          width:p.size, height:p.size, background:p.color,
          borderRadius: Math.random()>0.5 ? "50%" : "2px",
          animation:`confettiFall 2.5s ${p.delay}s ease-in forwards`,
        }} />
      ))}
      <style>{`@keyframes confettiFall{0%{transform:translateY(0)rotate(0);opacity:1}100%{transform:translateY(110vh)rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

// ─── Floating feedback label ──────────────────────────────────────────────────
function FloatLabel({ text, color, key: k }) {
  return (
    <div key={k} style={{
      position:"fixed", top:"42%", left:"50%", transform:"translateX(-50%)",
      background:color, color:"#fff", padding:"8px 22px", borderRadius:40,
      fontSize:18, fontWeight:900, pointerEvents:"none", zIndex:10002,
      animation:"floatUp 0.9s ease forwards",
      boxShadow:`0 4px 20px ${color}66`,
    }}>
      {text}
      <style>{`@keyframes floatUp{0%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-60px)}}`}</style>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function WordMatchingGame({ cards, onClose }) {
  const [phase, setPhase]         = useState("intro"); // intro | playing | done
  const [left, setLeft]           = useState([]);
  const [right, setRight]         = useState([]);
  const [pairColor, setPairColor] = useState({});
  const [totalPairs, setTotalPairs] = useState(0);
  const [selL, setSelL]           = useState(null);
  const [selR, setSelR]           = useState(null);
  const [matched, setMatched]     = useState(new Set());   // Set of matched ids
  const [wrongSet, setWrongSet]   = useState(new Set());   // shaking red
  const [popSet, setPopSet]       = useState(new Set());   // just matched → pop anim
  const [mistakes, setMistakes]   = useState(0);
  const [score, setScore]         = useState(0);
  const [timer, setTimer]         = useState(0);
  const [floatLabel, setFloatLabel] = useState(null);
  const floatKey                  = useRef(0);

  const startGame = useCallback(() => {
    const { left:l, right:r, total, pairColor:pc } = buildRound(cards);
    setLeft(l); setRight(r); setPairColor(pc); setTotalPairs(total);
    setSelL(null); setSelR(null);
    setMatched(new Set()); setWrongSet(new Set()); setPopSet(new Set());
    setMistakes(0); setScore(0); setTimer(0); setFloatLabel(null);
    setPhase("playing");
  }, [cards]);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const showFloat = (text, color) => {
    floatKey.current += 1;
    setFloatLabel({ text, color, key: floatKey.current });
    setTimeout(() => setFloatLabel(null), 900);
  };

  // Evaluate when both selected
  useEffect(() => {
    if (selL === null || selR === null) return;

    if (selL === selR) {
      // ✅ Correct
      const timeBonus = Math.max(0, 50 - timer * 2);
      const pts = 100 + timeBonus;
      setScore((s) => s + pts);
      setPopSet((prev) => new Set([...prev, selL]));
      setTimeout(() => {
        setMatched((prev) => {
          const next = new Set([...prev, selL]);
          if (next.size >= totalPairs) setPhase("done");
          return next;
        });
        setPopSet((prev) => { const n = new Set(prev); n.delete(selL); return n; });
      }, 400);
      showFloat(`+${pts} ✓`, "#10b981");
      setSelL(null); setSelR(null);
    } else {
      // ❌ Wrong
      setMistakes((m) => m + 1);
      setWrongSet(new Set([selL, selR]));
      showFloat("✗ Sai rồi!", "#ef4444");
      setTimeout(() => {
        setWrongSet(new Set());
        setSelL(null); setSelR(null);
      }, 650);
    }
  }, [selL, selR]);

  const pickLeft = (id) => {
    if (matched.has(id) || wrongSet.size > 0 || popSet.has(id)) return;
    setSelL((prev) => (prev === id ? null : id));
  };

  const pickRight = (id) => {
    if (matched.has(id) || wrongSet.size > 0 || selL === null || popSet.has(id)) return;
    setSelR(id);
  };

  // ── Tile style ───────────────────────────────────────────────────────────────
  const tileStyle = (id, side) => {
    const isMatched   = matched.has(id);
    const isWrong     = wrongSet.has(id);
    const isPop       = popSet.has(id);
    const isSelected  = side === "en" ? selL === id : selR === id;
    const color       = pairColor[id] || "#6366f1";

    let bg = "rgba(255,255,255,0.07)", border = "rgba(255,255,255,0.12)", textColor = "#e2e8f0", transform = "scale(1)";
    let boxShadow = "none", anim = "none", opacity = 1;

    if (isMatched) {
      bg = `${color}22`; border = `${color}88`; textColor = color;
      opacity = 0.45; transform = "scale(0.95)";
    } else if (isPop) {
      bg = `${color}33`; border = color; textColor = color;
      transform = "scale(1.08)"; boxShadow = `0 0 18px ${color}66`;
      anim = "popMatch 0.4s cubic-bezier(0.34,1.56,0.64,1)";
    } else if (isWrong) {
      bg = "rgba(239,68,68,0.18)"; border = "#ef4444"; textColor = "#fca5a5";
      anim = "shake 0.35s ease";
    } else if (isSelected) {
      bg = `${color}25`; border = color; textColor = "#fff";
      boxShadow = `0 0 0 3px ${color}44, 0 4px 20px ${color}44`;
      transform = "scale(1.04)";
    }

    return {
      padding: "12px 14px", borderRadius: 13, border: `2px solid ${border}`,
      background: bg, color: textColor, opacity,
      cursor: isMatched || isPop ? "default" : "pointer",
      fontSize: 13, fontWeight: 700, textAlign: "center",
      transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
      lineHeight: 1.4, wordBreak: "break-word",
      boxShadow, transform, animation: anim,
      minHeight: 52, display: "flex", alignItems: "center", justifyContent: "center",
    };
  };

  const stars = mistakes === 0 ? 3 : mistakes <= totalPairs ? 2 : 1;

  // ── Intro ───────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <FullScreen onClose={onClose}>
        <div style={{ textAlign:"center", maxWidth:420, margin:"0 auto" }}>
          <div style={{ fontSize:72, marginBottom:12, animation:"bounce 1s ease infinite alternate" }}>🔗</div>
          <h1 style={{ margin:"0 0 8px", fontSize:28, fontWeight:900, color:"#fff" }}>Word Matching</h1>
          <p style={{ margin:"0 0 28px", color:"#94a3b8", fontSize:15 }}>
            {Math.min(PAIR_COUNT, cards.length)} cặp từ · ghép nhanh để ghi điểm cao
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
            {[
              ["🎯", "Click từ tiếng Anh → click nghĩa tiếng Việt để ghép"],
              ["⚡", "Ghép càng nhanh càng được nhiều điểm time bonus"],
              ["✨", "0 lỗi → 3 sao + mưa confetti"],
            ].map(([icon, text]) => (
              <div key={text} style={{ background:"rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 18px", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
                <span style={{ fontSize:20 }}>{icon}</span>
                <span style={{ color:"#cbd5e1", fontSize:13 }}>{text}</span>
              </div>
            ))}
          </div>
          {/* Preview tiles */}
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:28, flexWrap:"wrap" }}>
            {COLORS.slice(0,5).map((c,i)=>(
              <div key={i} style={{ width:36,height:36,borderRadius:9,background:`${c}33`,border:`2px solid ${c}88`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>
                {["🔤","📖","💬","🔊","✏️"][i]}
              </div>
            ))}
          </div>
          <button onClick={startGame} style={startBtn}>Bắt đầu ngay →</button>
        </div>
        <Css />
      </FullScreen>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  if (phase === "done") {
    const perfect = mistakes === 0;
    return (
      <FullScreen onClose={onClose}>
        {perfect && <Confetti />}
        <div style={{ textAlign:"center", maxWidth:420, margin:"0 auto" }}>
          <div style={{ fontSize:72, marginBottom:8, animation:"bounce 0.8s ease infinite alternate" }}>
            {stars===3?"🏆":stars===2?"🎯":"💪"}
          </div>
          <h1 style={{ margin:"0 0 6px", fontSize:28, fontWeight:900, color:"#fff" }}>
            {stars===3?"Hoàn hảo!":stars===2?"Tốt lắm!":"Cố gắng hơn!"}
          </h1>
          {perfect && <p style={{ color:"#fcd34d", fontWeight:700, fontSize:14, margin:"0 0 16px" }}>🎉 Không lỗi nào! Xuất sắc!</p>}

          {/* Stars */}
          <div style={{ display:"flex", justifyContent:"center", gap:10, margin:"10px 0 22px" }}>
            {[1,2,3].map((i)=>(
              <span key={i} style={{ fontSize:34, filter: i<=stars?"drop-shadow(0 0 8px #fbbf24)":"none", opacity: i<=stars?1:0.25 }}>⭐</span>
            ))}
          </div>

          {/* Score big */}
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:20, padding:"20px 28px", marginBottom:20 }}>
            <div style={{ fontSize:48, fontWeight:900, color:"#fff", lineHeight:1 }}>{score.toLocaleString()}</div>
            <div style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>điểm</div>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:28 }}>
            {[
              { label:"Cặp ghép", value:`${totalPairs}/${totalPairs}`, color:"#10b981" },
              { label:"Lỗi",      value:mistakes,                      color: mistakes===0?"#10b981":"#ef4444" },
              { label:"Thời gian",value:fmtTime(timer),                color:"#6366f1" },
            ].map((s)=>(
              <div key={s.label} style={{ background:"rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 16px", minWidth:84, flex:1 }}>
                <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:11, color:"#64748b", marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onClose} style={doneSecondary}>Đóng</button>
            <button onClick={startGame} style={donePrimary}><RotateCcw size={14}/> Chơi lại</button>
          </div>
        </div>
        <Css />
      </FullScreen>
    );
  }

  // ── Playing ──────────────────────────────────────────────────────────────────
  const remaining = totalPairs - matched.size - popSet.size;

  return (
    <FullScreen onClose={onClose}>
      {floatLabel && <FloatLabel {...floatLabel} />}

      {/* HUD */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, maxWidth:560, margin:"0 auto 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:14, color:"#a78bfa", fontWeight:700 }}>
          <Timer size={14}/> {fmtTime(timer)}
        </div>
        <div style={{ fontSize:22, fontWeight:900, color:"#fff" }}>{score.toLocaleString()} pts</div>
        <div style={{ display:"flex", gap:14 }}>
          <span style={{ fontSize:13, color:"#94a3b8" }}>Còn: <strong style={{color:"#fff"}}>{remaining}</strong></span>
          <span style={{ fontSize:13, color: mistakes>0?"#f87171":"#94a3b8" }}>Lỗi: <strong style={{color:mistakes>0?"#f87171":"#fff"}}>{mistakes}</strong></span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:4, background:"rgba(255,255,255,0.1)", borderRadius:99, marginBottom:22, maxWidth:560, margin:"0 auto 22px" }}>
        <div style={{ height:"100%", width:`${(matched.size/totalPairs)*100}%`, background:"linear-gradient(90deg,#10b981,#34d399)", borderRadius:99, transition:"width 0.5s ease" }}/>
      </div>

      {/* Hint */}
      <div style={{ textAlign:"center", fontSize:12, color: selL?"#a78bfa":"#64748b", fontWeight:600, marginBottom:16, maxWidth:560, margin:"0 auto 16px", minHeight:18 }}>
        {selL
          ? `✦ Đã chọn "${left.find(l=>l.id===selL)?.text}" — chọn nghĩa bên phải`
          : matched.size===0 ? "Click từ tiếng Anh trước, rồi click nghĩa tiếng Việt" : ""}
      </div>

      {/* Game grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, maxWidth:560, margin:"0 auto" }}>
        {/* Column labels */}
        <div style={{ fontSize:10, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.1em", textAlign:"center", marginBottom:-4 }}>🇬🇧 Tiếng Anh</div>
        <div style={{ fontSize:10, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.1em", textAlign:"center", marginBottom:-4 }}>🇻🇳 Tiếng Việt</div>

        {/* Tiles */}
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {left.map((item)=>(
            <div key={item.id} onClick={()=>pickLeft(item.id)} style={tileStyle(item.id,"en")}>
              {matched.has(item.id) && <span style={{marginRight:5,fontSize:12}}>✓</span>}
              {item.text}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {right.map((item)=>(
            <div
              key={item.id}
              onClick={()=>pickRight(item.id)}
              style={{
                ...tileStyle(item.id,"vi"),
                cursor: matched.has(item.id)||popSet.has(item.id) ? "default" : selL===null ? "not-allowed" : "pointer",
                opacity: selL===null && !matched.has(item.id) && !popSet.has(item.id)
                  ? 0.35
                  : tileStyle(item.id,"vi").opacity,
              }}
            >
              {matched.has(item.id) && <span style={{marginRight:5,fontSize:12}}>✓</span>}
              {item.text}
            </div>
          ))}
        </div>
      </div>
      <Css />
    </FullScreen>
  );
}

// ─── Full-screen wrapper ─────────────────────────────────────────────────────
function FullScreen({ children, onClose }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 60%,#0f2027 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:24, overflowY:"auto",
    }}>
      <button
        onClick={onClose}
        style={{ position:"fixed", top:16, right:20, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", color:"#cbd5e1", borderRadius:10, padding:"7px 10px", cursor:"pointer", display:"flex", zIndex:1 }}
      >
        <X size={18}/>
      </button>

      {/* Animated background dots */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        {[...Array(12)].map((_,i)=>(
          <div key={i} style={{
            position:"absolute",
            left:`${10+i*8}%`, top:`${15+((i*37)%70)}%`,
            width: 3+i%3, height: 3+i%3,
            background: COLORS[i%COLORS.length],
            borderRadius:"50%", opacity:0.3,
            animation:`twinkle ${2+i*0.3}s ease-in-out infinite alternate`,
          }}/>
        ))}
      </div>

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:580 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Global CSS ──────────────────────────────────────────────────────────────
function Css() {
  return (
    <style>{`
      @keyframes bounce     { from{transform:translateY(0)} to{transform:translateY(-12px)} }
      @keyframes shake      { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-7px)} 40%,80%{transform:translateX(7px)} }
      @keyframes popMatch   { 0%{transform:scale(1)} 50%{transform:scale(1.15)} 100%{transform:scale(1.08)} }
      @keyframes twinkle    { from{opacity:0.15} to{opacity:0.5} }
    `}</style>
  );
}

// ─── Button styles ────────────────────────────────────────────────────────────
const startBtn = {
  width:"100%", padding:"14px 0",
  background:"linear-gradient(135deg,#10b981,#059669)",
  color:"#fff", border:"none", borderRadius:14,
  fontSize:16, fontWeight:800, cursor:"pointer",
  boxShadow:"0 4px 20px rgba(16,185,129,0.45)",
  letterSpacing:"0.02em",
};

const donePrimary = {
  flex:1, padding:"12px 0", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
  background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
  color:"#fff", border:"none", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer",
};

const doneSecondary = {
  flex:1, padding:"12px 0",
  background:"rgba(255,255,255,0.08)", color:"#94a3b8",
  border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, fontSize:14, fontWeight:600, cursor:"pointer",
};
