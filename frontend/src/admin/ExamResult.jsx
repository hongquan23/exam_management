import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft, RotateCcw, ChevronDown, ChevronUp, Target, Clock, BookOpen } from 'lucide-react';

const FILTER_TABS = [
  { id: 'all',     label: 'Tất cả' },
  { id: 'correct', label: 'Đúng' },
  { id: 'wrong',   label: 'Sai' },
  { id: 'skipped', label: 'Bỏ qua' },
];

const ExamResult = ({ result, test, onBack, onRetry }) => {
  const [expandedQ, setExpandedQ] = useState(null);
  const [filter, setFilter] = useState('all');

  const { score, total, results, created_at } = result;
  const skipped = total - results.length;
  const wrong = total - score - skipped;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const questionMap = {};
  (test?.questions || []).forEach(q => { questionMap[q.id] = q; });

  const allItems = Array.from({ length: total }, (_, i) => {
    const r = results[i] || null;
    return r;
  }).filter(Boolean);

  // Build full list: answered + skipped (unanswered questions)
  const answeredIds = new Set(results.map(r => r.question_id));
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
    if (filter === 'wrong') return !r.is_correct && !r.skipped;
    if (filter === 'skipped') return r.skipped;
    return true;
  });

  const scoreColor = percent >= 80 ? '#16a34a' : percent >= 60 ? '#f59e0b' : '#ef4444';
  const scoreGradient = percent >= 80
    ? 'linear-gradient(135deg, #065f46, #16a34a)'
    : percent >= 60
      ? 'linear-gradient(135deg, #92400e, #f59e0b)'
      : 'linear-gradient(135deg, #7f1d1d, #ef4444)';
  const scoreLabel = percent >= 80 ? 'Xuất sắc 🎉' : percent >= 60 ? 'Khá tốt 👍' : 'Cần cố gắng 💪';

  const dt = created_at ? new Date(created_at) : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>

      {/* ── Hero score section ── */}
      <div style={{ background: scoreGradient, padding: '40px 16px 64px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
            <button onClick={onBack} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(255,255,255,0.15)',
              cursor: 'pointer', fontWeight: 600, color: 'white',
              fontSize: 13, backdropFilter: 'blur(8px)'
            }}>
              <ArrowLeft size={15} /> Về trang chủ
            </button>
            <button onClick={onRetry} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(255,255,255,0.15)',
              cursor: 'pointer', fontWeight: 600, color: 'white',
              fontSize: 13, backdropFilter: 'blur(8px)'
            }}>
              <RotateCcw size={15} /> Làm lại
            </button>
          </div>

          {/* Score display */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6 }}>
              {test?.skill?.toUpperCase()} · {dt ? dt.toLocaleDateString('vi-VN') + ' lúc ' + dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
            </p>
            <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 24 }}>
              {test?.title}
            </h1>

            {/* Circular score */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
              <svg width={160} height={160} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={80} cy={80} r={68} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={10} />
                <circle
                  cx={80} cy={80} r={68} fill="none"
                  stroke="white" strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 68}`}
                  strokeDashoffset={`${2 * Math.PI * 68 * (1 - percent / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: 'white', lineHeight: 1 }}>
                  {percent}
                </span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>%</span>
              </div>
            </div>

            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
              {scoreLabel}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {score} / {total} câu đúng
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div style={{ maxWidth: 720, margin: '-32px auto 0', padding: '0 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Câu đúng', value: score, icon: <CheckCircle size={20} />, color: '#16a34a', bg: '#dcfce7', border: '#86efac' },
            { label: 'Câu sai', value: wrong, icon: <XCircle size={20} />, color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
            { label: 'Bỏ qua', value: skipped, icon: <BookOpen size={20} />, color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' },
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: 'white', borderRadius: 16, padding: '16px 12px',
              textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: `1.5px solid ${stat.border}`
            }}>
              <div style={{ color: stat.color, marginBottom: 6, display: 'flex', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{
          backgroundColor: 'white', borderRadius: 16, padding: '16px 20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tỉ lệ chính xác
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor }}>{percent}%</span>
          </div>
          <div style={{ height: 10, borderRadius: 99, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99, width: `${percent}%`,
              background: scoreGradient, transition: 'width 1s ease'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>
              {score} đúng ({Math.round(score/total*100)}%)
            </span>
            <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>
              {wrong} sai ({total > 0 ? Math.round(wrong/total*100) : 0}%)
            </span>
          </div>
        </div>

        {/* ── Question detail list ── */}
        <div style={{ backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: 40 }}>

          {/* List header + filter tabs */}
          <div style={{ padding: '18px 20px 0', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontWeight: 800, color: '#1e293b', margin: '0 0 14px', fontSize: 16 }}>
              Chi tiết đáp án
            </h3>
            <div style={{ display: 'flex', gap: 4 }}>
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: 'none',
                    cursor: 'pointer', fontSize: 12, fontWeight: 700,
                    transition: 'all 0.15s',
                    backgroundColor: filter === tab.id ? '#1e293b' : 'transparent',
                    color: filter === tab.id ? 'white' : '#94a3b8',
                  }}
                >
                  {tab.label}
                  {tab.id === 'correct' && <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.8 }}>({score})</span>}
                  {tab.id === 'wrong' && <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.8 }}>({wrong})</span>}
                  {tab.id === 'skipped' && <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.8 }}>({skipped})</span>}
                  {tab.id === 'all' && <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.8 }}>({total})</span>}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
              Không có câu hỏi nào trong mục này.
            </div>
          )}

          {filtered.map((r, idx) => {
            const q = questionMap[r.question_id];
            const isOpen = expandedQ === r.question_id;
            const options = q ? [
              { key: 'A', value: q.option_a },
              { key: 'B', value: q.option_b },
              { key: 'C', value: q.option_c },
              { key: 'D', value: q.option_d },
            ].filter(o => o.value) : [];

            const rowBg = r.skipped
              ? '#fafafa'
              : r.is_correct
                ? (isOpen ? '#f0fdf4' : 'white')
                : (isOpen ? '#fff5f5' : 'white');

            return (
              <div key={r.question_id} style={{
                borderBottom: '1px solid #f8fafc',
                transition: 'background 0.15s'
              }}>
                {/* Summary row */}
                <div
                  onClick={() => setExpandedQ(isOpen ? null : r.question_id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 20px', cursor: 'pointer',
                    backgroundColor: rowBg,
                  }}
                >
                  {/* Status icon */}
                  {r.skipped
                    ? <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 14 }}>—</span>
                      </div>
                    : r.is_correct
                      ? <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CheckCircle size={18} color="#16a34a" />
                        </div>
                      : <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <XCircle size={18} color="#dc2626" />
                        </div>
                  }

                  {/* Question number */}
                  <span style={{
                    fontSize: 12, fontWeight: 800, color: '#94a3b8',
                    minWidth: 28, flexShrink: 0
                  }}>
                    #{q?.question_number || idx + 1}
                  </span>

                  {/* Question text */}
                  <span style={{
                    flex: 1, fontSize: 13, color: r.skipped ? '#94a3b8' : '#334155',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    lineHeight: 1.4
                  }}>
                    {q?.question || `Câu ${idx + 1}`}
                  </span>

                  {/* Answer badges */}
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    {r.skipped ? (
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800,
                        backgroundColor: '#fef9c3', color: '#854d0e',
                        border: '1px solid #fde047'
                      }}>
                        Bỏ qua → {r.correct_answer}
                      </span>
                    ) : (
                      <>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800,
                          backgroundColor: r.is_correct ? '#dcfce7' : '#fee2e2',
                          color: r.is_correct ? '#166534' : '#991b1b',
                          minWidth: 40, textAlign: 'center'
                        }}>
                          {r.user_ans}
                        </span>
                        {!r.is_correct && (
                          <>
                            <span style={{ color: '#cbd5e1', fontSize: 10 }}>→</span>
                            <span style={{
                              padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800,
                              backgroundColor: '#dcfce7', color: '#166534',
                              minWidth: 40, textAlign: 'center'
                            }}>
                              {r.correct_answer}
                            </span>
                          </>
                        )}
                      </>
                    )}
                    {isOpen
                      ? <ChevronUp size={15} color="#cbd5e1" />
                      : <ChevronDown size={15} color="#cbd5e1" />
                    }
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && q && (
                  <div style={{ padding: '4px 20px 16px 64px', backgroundColor: r.skipped ? '#fffdf0' : rowBg }}>

                    {/* Passage / Transcript */}
                    {q.passage && (
                      <div style={{
                        background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
                        border: '1px solid #c7d2fe', borderRadius: 12,
                        padding: '12px 14px', marginBottom: 12, fontSize: 13,
                        color: '#312e81', whiteSpace: 'pre-line', lineHeight: 1.6
                      }}>
                        <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6366f1' }}>
                          📝 Transcript
                        </div>
                        {q.passage}
                      </div>
                    )}

                    {/* Audio */}
                    {q.audio_url && (
                      <div style={{ marginBottom: 12 }}>
                        <audio controls src={q.audio_url.startsWith('http') ? q.audio_url : `http://localhost:8000/${q.audio_url}`}
                          style={{ width: '100%', height: 36 }} />
                      </div>
                    )}

                    {/* Full question text */}
                    {q.question && (
                      <p style={{ fontSize: 14, color: '#1e293b', fontWeight: 600, marginBottom: 10, lineHeight: 1.5 }}>
                        {q.question}
                      </p>
                    )}

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {options.map(opt => {
                        const isUserAns = r.user_ans === opt.key;
                        const isCorrectAns = r.correct_answer === opt.key;

                        let bg = '#f8fafc'; let border = '#e2e8f0'; let textColor = '#64748b';
                        let dotBg = '#e2e8f0'; let dotColor = '#94a3b8';

                        if (isCorrectAns) {
                          bg = '#f0fdf4'; border = '#4ade80'; textColor = '#166534';
                          dotBg = '#16a34a'; dotColor = 'white';
                        } else if (isUserAns) {
                          bg = '#fff1f2'; border = '#fda4af'; textColor = '#9f1239';
                          dotBg = '#f43f5e'; dotColor = 'white';
                        }

                        return (
                          <div key={opt.key} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '9px 14px', borderRadius: 10,
                            border: `1.5px solid ${border}`, backgroundColor: bg,
                            transition: 'all 0.15s'
                          }}>
                            <span style={{
                              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                              backgroundColor: dotBg, color: dotColor,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 800, fontSize: 12
                            }}>
                              {opt.key}
                            </span>
                            <span style={{ fontSize: 13, color: textColor, flex: 1, lineHeight: 1.4 }}>
                              {opt.value}
                            </span>
                            {isCorrectAns && (
                              <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                ✓ Đáp án đúng
                              </span>
                            )}
                            {isUserAns && !isCorrectAns && (
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

export default ExamResult;
