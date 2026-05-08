import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, BookOpen, Clock, CheckCircle, XCircle,
  TrendingUp, Award, Target, ChevronDown, ChevronUp,
  BarChart2, Filter, Calendar, X
} from 'lucide-react';
import { getAttemptHistory, getSessionDetail } from '../api';

// ─── Constants ────────────────────────────────────────────────────────────────

const SKILL = {
  listening: { label: '🎧 Listening', bg: '#dbeafe', text: '#1d4ed8', dot: '#3b82f6' },
  reading:   { label: '📖 Reading',   bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
  speaking:  { label: '🎤 Speaking',  bg: '#fed7aa', text: '#c2410c', dot: '#f97316' },
  writing:   { label: '✍️ Writing',   bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' },
};

const grade = (p) => {
  if (p >= 80) return { label: 'Xuất sắc', color: '#16a34a', bg: '#f0fdf4', border: '#86efac' };
  if (p >= 60) return { label: 'Khá',      color: '#d97706', bg: '#fffbeb', border: '#fcd34d' };
  return             { label: 'Cần cố gắng', color: '#dc2626', bg: '#fff1f2', border: '#fca5a5' };
};

// ─── ScoreRing ─────────────────────────────────────────────────────────────────

const ScoreRing = ({ percent, size = 56 }) => {
  const g = grade(percent);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={g.color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.7s ease' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        style={{ fill: g.color, fontSize: size * 0.22, fontWeight: 900, transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        {percent}%
      </text>
    </svg>
  );
};

// ─── ScoreBar ─────────────────────────────────────────────────────────────────

const ScoreBar = ({ percent }) => {
  const g = grade(percent);
  return (
    <div style={{ height: 4, borderRadius: 99, backgroundColor: '#f1f5f9', overflow: 'hidden', marginTop: 6 }}>
      <div style={{
        height: '100%', width: `${percent}%`, borderRadius: 99,
        backgroundColor: g.color, transition: 'width 0.7s ease'
      }} />
    </div>
  );
};

// ─── Session Detail Modal ─────────────────────────────────────────────────────

const DetailModal = ({ session, userId, onClose }) => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    getSessionDetail(userId, session.section_id, session.attempted_at)
      .then(res => setItems(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const g  = grade(session.percent);
  const sk = SKILL[session.skill];
  const dt = new Date(session.attempted_at);
  const dateStr = dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                + ' lúc '
                + dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const correctCount = items.filter(i => i.is_correct).length;
  const wrongCount   = items.filter(i => !i.is_correct && i.user_ans).length;
  const skipCount    = items.filter(i => !i.user_ans).length;

  const FILTERS = [
    { id: 'all',     label: 'Tất cả',  count: items.length,  activeColor: '#334155' },
    { id: 'correct', label: 'Đúng',    count: correctCount,  activeColor: '#16a34a' },
    { id: 'wrong',   label: 'Sai',     count: wrongCount,    activeColor: '#dc2626' },
    { id: 'skip',    label: 'Bỏ qua',  count: skipCount,     activeColor: '#d97706' },
  ];

  const filtered = items.filter(item => {
    if (filter === 'correct') return item.is_correct;
    if (filter === 'wrong')   return !item.is_correct && item.user_ans;
    if (filter === 'skip')    return !item.user_ans;
    return true;
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Modal shell — 2-column tall layout */}
      <div style={{
        width: '100%', maxWidth: 860,
        height: '90vh',
        backgroundColor: 'white', borderRadius: 20,
        boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* ── Header (fixed height) ── */}
        <div style={{
          padding: '18px 24px 16px',
          borderBottom: '1px solid #f1f5f9',
          background: `linear-gradient(135deg, ${g.color}12, transparent)`,
          flexShrink: 0,
        }}>
          {/* Top row: info left, ring + close right */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                {sk && (
                  <span style={{
                    padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    backgroundColor: sk.bg, color: sk.text,
                  }}>
                    {sk.label}
                  </span>
                )}
                <span style={{
                  padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  backgroundColor: g.bg, color: g.color,
                }}>
                  {g.label}
                </span>
              </div>
              <h2 style={{
                fontSize: 16, fontWeight: 800, color: '#0f172a',
                margin: '0 0 4px', lineHeight: 1.3,
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {session.section_name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94a3b8' }}>
                <Calendar size={12} /> {dateStr}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <ScoreRing percent={session.percent} size={64} />
              <button
                onClick={onClose}
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  border: '1px solid #e2e8f0', backgroundColor: 'white',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94a3b8', flexShrink: 0,
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Stats row — horizontal pills */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'Đúng',    value: correctCount, color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
              { label: 'Sai',     value: wrongCount,   color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
              { label: 'Bỏ qua',  value: skipCount,    color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 20,
                backgroundColor: s.bg, border: `1px solid ${s.border}`,
              }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</span>
                <span style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div style={{
          display: 'flex', gap: 4, padding: '10px 24px',
          borderBottom: '1px solid #f1f5f9', flexShrink: 0,
        }}>
          {FILTERS.map(f => {
            const active = filter === f.id;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                padding: '5px 12px', borderRadius: 7, border: 'none',
                cursor: 'pointer', fontSize: 12, fontWeight: 700,
                backgroundColor: active ? f.activeColor : '#f1f5f9',
                color: active ? 'white' : '#64748b',
                transition: 'all 0.15s',
              }}>
                {f.label}
                <span style={{ marginLeft: 4, opacity: 0.75, fontSize: 11 }}>{f.count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Question list (scrollable, fills remaining height) ── */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {loading && (
            <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Đang tải chi tiết...</div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Không có câu nào.</div>
          )}

          {!loading && filtered.map((item, idx) => {
            const isOpen = expanded === idx;
            const opts = [
              { k: 'A', v: item.option_a },
              { k: 'B', v: item.option_b },
              { k: 'C', v: item.option_c },
              { k: 'D', v: item.option_d },
            ].filter(o => o.v);

            const rowBg = isOpen
              ? (item.is_correct ? '#f0fdf4' : item.user_ans ? '#fff5f5' : '#fffbeb')
              : 'white';

            return (
              <div key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>

                {/* Summary row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : idx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 24px', cursor: 'pointer',
                    backgroundColor: rowBg, transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!isOpen) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={e => { if (!isOpen) e.currentTarget.style.backgroundColor = 'white'; }}
                >
                  {/* Status icon */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: item.is_correct ? '#dcfce7' : item.user_ans ? '#fee2e2' : '#fef9c3',
                  }}>
                    {item.is_correct
                      ? <CheckCircle size={15} color="#16a34a" />
                      : item.user_ans
                        ? <XCircle size={15} color="#dc2626" />
                        : <span style={{ fontSize: 12, color: '#d97706', fontWeight: 800 }}>—</span>
                    }
                  </div>

                  {/* Number */}
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1', width: 22, flexShrink: 0, textAlign: 'center' }}>
                    {item.question_number || idx + 1}
                  </span>

                  {/* Question text */}
                  <span style={{
                    flex: 1, fontSize: 13, color: '#334155',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.question || `Câu ${idx + 1}`}
                  </span>

                  {/* Answer badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    {item.user_ans ? (
                      <span style={pill(
                        item.is_correct ? '#f0fdf4' : '#fef2f2',
                        item.is_correct ? '#16a34a' : '#dc2626',
                        item.is_correct ? '#86efac' : '#fca5a5',
                      )}>
                        {item.user_ans}
                      </span>
                    ) : (
                      <span style={pill('#fffbeb', '#d97706', '#fde68a')}>Bỏ qua</span>
                    )}
                    {!item.is_correct && item.user_ans && (
                      <>
                        <span style={{ color: '#cbd5e1', fontSize: 10 }}>→</span>
                        <span style={pill('#f0fdf4', '#16a34a', '#86efac')}>
                          {item.correct_answer}
                        </span>
                      </>
                    )}
                    {isOpen
                      ? <ChevronUp size={13} color="#cbd5e1" />
                      : <ChevronDown size={13} color="#cbd5e1" />
                    }
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ padding: '10px 24px 16px', backgroundColor: rowBg, borderTop: '1px dashed #e8edf4' }}>

                    {/* Transcript */}
                    {item.passage && (
                      <div style={{
                        padding: '10px 14px', borderRadius: 9,
                        backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
                        marginBottom: 10,
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 5 }}>
                          Transcript
                        </div>
                        <div style={{ fontSize: 13, color: '#1e3a8a', whiteSpace: 'pre-line', lineHeight: 1.65 }}>
                          {item.passage}
                        </div>
                      </div>
                    )}

                    {/* Audio */}
                    {item.audio_url && (
                      <audio controls
                        src={item.audio_url.startsWith('http') ? item.audio_url : `http://localhost:8000/${item.audio_url}`}
                        style={{ width: '100%', height: 34, marginBottom: 10 }}
                      />
                    )}

                    {/* Question */}
                    {item.question && (
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 10, lineHeight: 1.5 }}>
                        {item.question}
                      </div>
                    )}

                    {/* Options */}
                    {opts.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {opts.map(opt => {
                          const isUser    = item.user_ans === opt.k;
                          const isCorrect = item.correct_answer === opt.k;
                          const bg     = isCorrect ? '#f0fdf4' : isUser ? '#fff1f2' : 'white';
                          const border = isCorrect ? '#4ade80' : isUser ? '#fda4af' : '#e8edf4';
                          const dot    = isCorrect ? '#16a34a' : isUser ? '#f43f5e' : '#e2e8f0';
                          const dotTxt = (isCorrect || isUser) ? 'white' : '#94a3b8';
                          const txt    = isCorrect ? '#166534' : isUser ? '#9f1239' : '#64748b';
                          return (
                            <div key={opt.k} style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '8px 12px', borderRadius: 9,
                              backgroundColor: bg, border: `1.5px solid ${border}`,
                            }}>
                              <span style={{
                                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                backgroundColor: dot, color: dotTxt,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: 11,
                              }}>
                                {opt.k}
                              </span>
                              <span style={{ fontSize: 13, color: txt, flex: 1, lineHeight: 1.4 }}>{opt.v}</span>
                              {isCorrect && <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, whiteSpace: 'nowrap' }}>✓ Đúng</span>}
                              {isUser && !isCorrect && <span style={{ fontSize: 11, color: '#f43f5e', fontWeight: 700, whiteSpace: 'nowrap' }}>✗ Bạn chọn</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const pill = (bg, color, border) => ({
  padding: '2px 9px', borderRadius: 20, fontSize: 12, fontWeight: 800,
  backgroundColor: bg, color, border: `1px solid ${border}`,
  minWidth: 28, textAlign: 'center',
});

// ─── Main History Page ─────────────────────────────────────────────────────────

const History = ({ userId, onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSkill, setActiveSkill] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!userId) return;
    getAttemptHistory(userId)
      .then(res => setHistory(res.data || []))
      .catch(err => console.error('Load history error:', err))
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered = activeSkill === 'all' ? history : history.filter(h => h.skill === activeSkill);

  const totalSessions = history.length;
  const avgScore = totalSessions ? Math.round(history.reduce((s, h) => s + h.percent, 0) / totalSessions) : 0;
  const bestScore = totalSessions ? Math.max(...history.map(h => h.percent)) : 0;
  const skillsUsed = [...new Set(history.map(h => h.skill))];

  const skillCounts = history.reduce((acc, h) => {
    acc[h.skill] = (acc[h.skill] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>

      {/* ── Top bar ── */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#475569' }}
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
          <div style={{ width: 1, height: 24, backgroundColor: '#e2e8f0' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Lịch sử làm bài</h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Stats cards ── */}
        {!loading && totalSessions > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
            {[
              { icon: <BarChart2 size={20} color="#3b82f6" />, label: 'Tổng lần làm', value: totalSessions, bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
              { icon: <TrendingUp size={20} color="#8b5cf6" />, label: 'Điểm trung bình', value: `${avgScore}%`, bg: '#f5f3ff', border: '#ddd6fe', color: '#5b21b6' },
              { icon: <Award size={20} color="#d97706" />, label: 'Điểm cao nhất', value: `${bestScore}%`, bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Skill filter ── */}
        {!loading && skillsUsed.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8', fontWeight: 600, marginRight: 4 }}>
              <Filter size={13} /> Lọc:
            </div>
            <button
              onClick={() => setActiveSkill('all')}
              style={{ padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', backgroundColor: activeSkill === 'all' ? '#334155' : '#f1f5f9', color: activeSkill === 'all' ? 'white' : '#64748b', transition: 'all 0.15s' }}
            >
              Tất cả ({totalSessions})
            </button>
            {skillsUsed.map(skill => {
              const sc = SKILL[skill];
              if (!sc) return null;
              return (
                <button
                  key={skill}
                  onClick={() => setActiveSkill(skill)}
                  style={{ padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', backgroundColor: activeSkill === skill ? sc.dot : '#f1f5f9', color: activeSkill === skill ? 'white' : '#64748b', transition: 'all 0.15s' }}
                >
                  {sc.label} ({skillCounts[skill]})
                </button>
              );
            })}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 80, color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
            Đang tải lịch sử...
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && history.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80, backgroundColor: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📋</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#334155', margin: '0 0 8px' }}>Chưa có lịch sử làm bài</p>
            <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>Hoàn thành một bài Listening hoặc Reading để xem lịch sử tại đây.</p>
          </div>
        )}

        {/* ── History list ── */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((h, idx) => {
              const sc = SKILL[h.skill];
              const g = grade(h.percent);
              const dt = new Date(h.attempted_at);
              return (
                <div
                  key={idx}
                  onClick={() => setSelected(h)}
                  style={{
                    backgroundColor: 'white', borderRadius: 16, padding: '18px 22px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', gap: 18, cursor: 'pointer',
                    transition: 'all 0.18s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = g.border; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                >
                  {/* Score ring */}
                  <ScoreRing percent={h.percent} size={60} />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      {sc && (
                        <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, backgroundColor: sc.bg, color: sc.text }}>
                          {sc.label}
                        </span>
                      )}
                      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, backgroundColor: g.bg, color: g.color }}>
                        {g.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {h.section_name}
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={11} />
                        {dt.toLocaleDateString('vi-VN')} lúc {dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <BookOpen size={11} /> {h.total} câu
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#16a34a', fontWeight: 600 }}>
                        <CheckCircle size={11} /> {h.score}/{h.total} đúng
                      </span>
                    </div>
                    <ScoreBar percent={h.percent} />
                  </div>

                  {/* Arrow */}
                  <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#94a3b8', transition: 'all 0.15s' }}>
                    <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <DetailModal
          session={selected}
          userId={userId}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default History;
