import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft, RotateCcw, ChevronDown, ChevronUp, BookOpen, MinusCircle } from 'lucide-react';

const FILTER_TABS = [
  { id: 'all',     label: 'Tất cả' },
  { id: 'correct', label: 'Đúng' },
  { id: 'wrong',   label: 'Sai' },
  { id: 'skipped', label: 'Bỏ qua' },
];

const SCORE_THEME = (pct) => {
  if (pct >= 80) return {
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    color: '#059669', lightBg: '#ecfdf5', border: '#6ee7b7', label: 'Xuất sắc', emoji: '🎉',
  };
  if (pct >= 60) return {
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    color: '#d97706', lightBg: '#fffbeb', border: '#fde68a', label: 'Khá tốt', emoji: '👍',
  };
  return {
    gradient: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
    color: '#dc2626', lightBg: '#fef2f2', border: '#fca5a5', label: 'Cần cố gắng', emoji: '💪',
  };
};

const ExamResult = ({ result, test, onBack, onRetry }) => {
  const [expandedQ, setExpandedQ] = useState(null);
  const [filter, setFilter]       = useState('all');

  const { score, total, results } = result;
  const created_at = result.created_at;
  const skipped  = total - results.length;
  const wrong    = total - score - skipped;
  const percent  = total > 0 ? Math.round((score / total) * 100) : 0;
  const theme    = SCORE_THEME(percent);

  const questionMap = {};
  (test?.questions || []).forEach(q => { questionMap[q.id] = q; });

  const answeredIds  = new Set(results.map(r => r.question_id));
  const skippedItems = (test?.questions || [])
    .filter(q => !answeredIds.has(q.id))
    .map(q => ({ question_id: q.id, user_ans: null, correct_answer: q.correct_answer, is_correct: false, skipped: true }));

  const allResults = [...results, ...skippedItems].sort((a, b) => {
    const qa = questionMap[a.question_id];
    const qb = questionMap[b.question_id];
    return (qa?.question_number || 0) - (qb?.question_number || 0);
  });

  const filtered = allResults.filter(r => {
    if (filter === 'correct') return r.is_correct;
    if (filter === 'wrong')   return !r.is_correct && !r.skipped;
    if (filter === 'skipped') return r.skipped;
    return true;
  });

  const dt = created_at ? new Date(created_at) : null;
  const dateStr = dt
    ? dt.toLocaleDateString('vi-VN') + ' lúc ' + dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : '';

  const CIRCUMFERENCE = 2 * Math.PI * 54;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Inter', sans-serif" }}>

      {/* ── TOP BANNER ── */}
      <div style={{ background: theme.gradient, paddingBottom: '56px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 24px 0' }}>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            <button onClick={onBack} style={btnStyle}>
              <ArrowLeft size={14} /> Về trang chủ
            </button>
            <button onClick={onRetry} style={btnStyle}>
              <RotateCcw size={14} /> Làm lại
            </button>
          </div>

          {/* Score + info — horizontal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>

            {/* Circular score */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width={132} height={132} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={66} cy={66} r={54} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={9} />
                <circle
                  cx={66} cy={66} r={54} fill="none"
                  stroke="white" strokeWidth={9} strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 34, fontWeight: 900, color: 'white', lineHeight: 1 }}>{percent}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>%</span>
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
                  backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 10px',
                  borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {test?.skill}
                </span>
                {dateStr && (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{dateStr}</span>
                )}
              </div>
              <h1 style={{
                color: 'white', fontSize: 22, fontWeight: 800,
                margin: '0 0 10px', lineHeight: 1.3,
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {test?.title}
              </h1>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 600 }}>
                {score} / {total} câu đúng &nbsp;·&nbsp;
                <span style={{ fontSize: 14 }}>{theme.emoji} {theme.label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 960, margin: '-40px auto 0', padding: '0 24px 48px', position: 'relative', zIndex: 1 }}>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Câu đúng',  value: score,   icon: <CheckCircle size={18} />, color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
            { label: 'Câu sai',   value: wrong,   icon: <XCircle size={18} />,     color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
            { label: 'Bỏ qua',   value: skipped, icon: <MinusCircle size={18} />, color: '#64748b', bg: '#f8fafc', border: '#cbd5e1' },
          ].map(s => (
            <div key={s.label} style={{
              backgroundColor: s.bg, borderRadius: 14, padding: '16px 14px',
              textAlign: 'center', border: `1.5px solid ${s.border}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar card */}
        <div style={{
          backgroundColor: 'white', borderRadius: 14, padding: '14px 20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 20,
          border: '1px solid #e8edf4',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tỉ lệ chính xác
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: theme.color }}>{percent}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 99, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99, width: `${percent}%`,
              background: theme.gradient, transition: 'width 1.2s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>
              {score} đúng ({total > 0 ? Math.round(score / total * 100) : 0}%)
            </span>
            <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>
              {wrong} sai ({total > 0 ? Math.round(wrong / total * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* ── Question list ── */}
        <div style={{
          backgroundColor: 'white', borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #e8edf4', overflow: 'hidden',
        }}>
          {/* Header + filter */}
          <div style={{ padding: '16px 20px 0', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontWeight: 800, color: '#1e293b', margin: '0 0 12px', fontSize: 15 }}>
              Chi tiết đáp án
            </h3>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {FILTER_TABS.map(tab => {
                const count = tab.id === 'correct' ? score : tab.id === 'wrong' ? wrong : tab.id === 'skipped' ? skipped : total;
                const active = filter === tab.id;
                return (
                  <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
                    padding: '5px 12px', borderRadius: 7, border: 'none',
                    cursor: 'pointer', fontSize: 12, fontWeight: 700,
                    transition: 'all 0.15s',
                    backgroundColor: active ? '#1e293b' : '#f1f5f9',
                    color: active ? 'white' : '#64748b',
                    marginBottom: 12,
                  }}>
                    {tab.label}
                    <span style={{ marginLeft: 5, opacity: active ? 0.7 : 0.5, fontWeight: 600 }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              Không có câu hỏi nào trong mục này.
            </div>
          )}

          {filtered.map((r, idx) => {
            const q      = questionMap[r.question_id];
            const isOpen = expandedQ === r.question_id;
            const options = q ? [
              { key: 'A', value: q.option_a },
              { key: 'B', value: q.option_b },
              { key: 'C', value: q.option_c },
              { key: 'D', value: q.option_d },
            ].filter(o => o.value) : [];

            const rowBg = isOpen
              ? (r.skipped ? '#fefce8' : r.is_correct ? '#f0fdf4' : '#fff5f5')
              : 'white';

            return (
              <div key={r.question_id} style={{ borderBottom: '1px solid #f8fafc' }}>

                {/* Row */}
                <div
                  onClick={() => setExpandedQ(isOpen ? null : r.question_id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 20px', cursor: 'pointer',
                    backgroundColor: rowBg, transition: 'background 0.15s',
                  }}
                >
                  {/* Status dot */}
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: r.skipped ? '#f1f5f9' : r.is_correct ? '#dcfce7' : '#fee2e2',
                  }}>
                    {r.skipped
                      ? <MinusCircle size={15} color="#94a3b8" />
                      : r.is_correct
                        ? <CheckCircle size={15} color="#16a34a" />
                        : <XCircle size={15} color="#dc2626" />
                    }
                  </div>

                  {/* # */}
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1', minWidth: 24, flexShrink: 0 }}>
                    {q?.question_number || idx + 1}
                  </span>

                  {/* Question text */}
                  <span style={{
                    flex: 1, fontSize: 13, color: r.skipped ? '#94a3b8' : '#334155',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {q?.question || `Câu ${idx + 1}`}
                  </span>

                  {/* Answer badges */}
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
                    {r.skipped ? (
                      <span style={badgeStyle('#fef9c3', '#92400e', '#fde047')}>
                        Bỏ qua → {r.correct_answer}
                      </span>
                    ) : (
                      <>
                        <span style={badgeStyle(
                          r.is_correct ? '#dcfce7' : '#fee2e2',
                          r.is_correct ? '#166534' : '#991b1b',
                          r.is_correct ? '#86efac' : '#fca5a5',
                        )}>
                          {r.user_ans}
                        </span>
                        {!r.is_correct && (
                          <>
                            <span style={{ color: '#cbd5e1', fontSize: 11 }}>→</span>
                            <span style={badgeStyle('#dcfce7', '#166534', '#86efac')}>
                              {r.correct_answer}
                            </span>
                          </>
                        )}
                      </>
                    )}
                    {isOpen
                      ? <ChevronUp size={14} color="#cbd5e1" />
                      : <ChevronDown size={14} color="#cbd5e1" />
                    }
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && q && (
                  <div style={{ padding: '10px 24px 18px', backgroundColor: rowBg, borderTop: '1px dashed #e8edf4' }}>

                    {/* Transcript */}
                    {q.passage && (
                      <div style={{
                        background: '#eef2ff', border: '1px solid #c7d2fe',
                        borderRadius: 10, padding: '10px 14px', marginBottom: 10,
                        fontSize: 13, color: '#312e81', whiteSpace: 'pre-line', lineHeight: 1.6,
                      }}>
                        <div style={{ fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6366f1', marginBottom: 5 }}>
                          Transcript
                        </div>
                        {q.passage}
                      </div>
                    )}

                    {/* Audio */}
                    {q.audio_url && (
                      <div style={{ marginBottom: 10 }}>
                        <audio controls
                          src={q.audio_url.startsWith('http') ? q.audio_url : `http://localhost:8000/${q.audio_url}`}
                          style={{ width: '100%', height: 34 }}
                        />
                      </div>
                    )}

                    {/* Full question */}
                    {q.question && (
                      <p style={{ fontSize: 13, color: '#1e293b', fontWeight: 600, margin: '0 0 10px', lineHeight: 1.5 }}>
                        {q.question}
                      </p>
                    )}

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {options.map(opt => {
                        const isUser    = r.user_ans === opt.key;
                        const isCorrect = r.correct_answer === opt.key;

                        let bg = '#f8fafc', border = '#e2e8f0', text = '#64748b';
                        let dot = '#e2e8f0', dotText = '#94a3b8';

                        if (isCorrect) {
                          bg = '#f0fdf4'; border = '#4ade80'; text = '#166534';
                          dot = '#16a34a'; dotText = 'white';
                        } else if (isUser) {
                          bg = '#fff1f2'; border = '#fda4af'; text = '#9f1239';
                          dot = '#f43f5e'; dotText = 'white';
                        }

                        return (
                          <div key={opt.key} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '8px 12px', borderRadius: 9,
                            border: `1.5px solid ${border}`, backgroundColor: bg,
                          }}>
                            <span style={{
                              width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                              backgroundColor: dot, color: dotText,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 800, fontSize: 11,
                            }}>
                              {opt.key}
                            </span>
                            <span style={{ fontSize: 13, color: text, flex: 1, lineHeight: 1.4 }}>
                              {opt.value}
                            </span>
                            {isCorrect && (
                              <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                ✓ Đúng
                              </span>
                            )}
                            {isUser && !isCorrect && (
                              <span style={{ fontSize: 11, color: '#f43f5e', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                ✗ Bạn chọn
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
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

// ── helpers ──────────────────────────────────────────────────────────────────
const btnStyle = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '7px 16px', borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.3)',
  backgroundColor: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(8px)',
  cursor: 'pointer', fontWeight: 600, color: 'white', fontSize: 13,
};

const badgeStyle = (bg, color, border) => ({
  padding: '2px 9px', borderRadius: 20, fontSize: 12, fontWeight: 800,
  backgroundColor: bg, color, border: `1px solid ${border}`,
  minWidth: 30, textAlign: 'center',
});

export default ExamResult;
