import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

const ExamResult = ({ result, test, onBack, onRetry }) => {
  const [expandedQ, setExpandedQ] = useState(null);

  const { score, total, results, created_at } = result;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  // Map question_id → full question data từ test
  const questionMap = {};
  (test?.questions || []).forEach(q => { questionMap[q.id] = q; });

  const getScoreColor = () => {
    if (percent >= 80) return '#16a34a';
    if (percent >= 60) return '#d97706';
    return '#dc2626';
  };

  const getScoreBg = () => {
    if (percent >= 80) return '#dcfce7';
    if (percent >= 60) return '#fef3c7';
    return '#fee2e2';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              border: '1px solid #e2e8f0', backgroundColor: 'white',
              cursor: 'pointer', fontWeight: 600, color: '#475569'
            }}
          >
            <ArrowLeft size={16} /> Về trang chủ
          </button>
          <button
            onClick={onRetry}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              border: '1px solid #6366f1', backgroundColor: '#eef2ff',
              cursor: 'pointer', fontWeight: 600, color: '#4f46e5'
            }}
          >
            <RotateCcw size={16} /> Làm lại
          </button>
        </div>

        {/* Score card */}
        <div style={{
          backgroundColor: 'white', borderRadius: 16, padding: 32,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)', marginBottom: 24,
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>
            {test?.title}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>
            {test?.skill} · {created_at ? new Date(created_at).toLocaleString('vi-VN') : ''}
          </p>

          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
            backgroundColor: getScoreBg(), borderRadius: 16, padding: '20px 48px',
            marginBottom: 20
          }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: getScoreColor(), lineHeight: 1 }}>
              {score}/{total}
            </span>
            <span style={{ fontSize: 28, fontWeight: 700, color: getScoreColor() }}>
              {percent}%
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a' }}>{score}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Đúng</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#dc2626' }}>{total - score}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Sai</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>
                {total - results.length}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Bỏ qua</div>
            </div>
          </div>
        </div>

        {/* Chi tiết từng câu */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>Chi tiết đáp án</h3>
          </div>

          {results.map((r, idx) => {
            const q = questionMap[r.question_id];
            const isOpen = expandedQ === r.question_id;
            const options = q ? [
              { key: 'A', value: q.option_a },
              { key: 'B', value: q.option_b },
              { key: 'C', value: q.option_c },
              { key: 'D', value: q.option_d },
            ].filter(o => o.value) : [];

            return (
              <div key={r.question_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {/* Row tóm tắt */}
                <div
                  onClick={() => setExpandedQ(isOpen ? null : r.question_id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 24px', cursor: 'pointer',
                    backgroundColor: isOpen ? '#f8fafc' : 'white',
                    transition: 'background 0.15s'
                  }}
                >
                  {r.is_correct
                    ? <CheckCircle size={20} color="#16a34a" />
                    : <XCircle size={20} color="#dc2626" />
                  }
                  <span style={{ fontWeight: 600, color: '#475569', minWidth: 24 }}>
                    {q?.question_number || idx + 1}
                  </span>
                  <span style={{ flex: 1, fontSize: 14, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q?.question || `Câu ${idx + 1}`}
                  </span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                      backgroundColor: r.is_correct ? '#dcfce7' : '#fee2e2',
                      color: r.is_correct ? '#166534' : '#991b1b'
                    }}>
                      Bạn: {r.user_ans || '—'}
                    </span>
                    {!r.is_correct && (
                      <span style={{
                        padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                        backgroundColor: '#dcfce7', color: '#166534'
                      }}>
                        Đúng: {r.correct_answer}
                      </span>
                    )}
                    {isOpen ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                  </div>
                </div>

                {/* Expand: hiển thị passage + options */}
                {isOpen && q && (
                  <div style={{ padding: '0 24px 16px 56px', backgroundColor: '#f8fafc' }}>
                    {q.passage && (
                      <div style={{
                        backgroundColor: '#eef2ff', border: '1px solid #c7d2fe',
                        borderRadius: 8, padding: '10px 14px', marginBottom: 12,
                        fontSize: 13, color: '#3730a3', whiteSpace: 'pre-line'
                      }}>
                        <strong>Transcript:</strong>
                        <div style={{ marginTop: 4 }}>{q.passage}</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {options.map(opt => {
                        const isUserAns = r.user_ans === opt.key;
                        const isCorrectAns = r.correct_answer === opt.key;
                        let bg = 'white'; let border = '#e2e8f0'; let color = '#334155';
                        if (isCorrectAns) { bg = '#dcfce7'; border = '#22c55e'; color = '#166534'; }
                        else if (isUserAns) { bg = '#fee2e2'; border = '#fca5a5'; color = '#991b1b'; }

                        return (
                          <div key={opt.key} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '8px 12px', borderRadius: 8,
                            border: `1.5px solid ${border}`, backgroundColor: bg
                          }}>
                            <span style={{
                              width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                              backgroundColor: isCorrectAns ? '#22c55e' : isUserAns ? '#f87171' : '#f1f5f9',
                              color: (isCorrectAns || isUserAns) ? 'white' : '#64748b',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: 12
                            }}>{opt.key}</span>
                            <span style={{ fontSize: 13, color }}>{opt.value}</span>
                            {isCorrectAns && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#16a34a', fontWeight: 700 }}>✓ Đúng</span>}
                            {isUserAns && !isCorrectAns && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#dc2626', fontWeight: 700 }}>✗ Bạn chọn</span>}
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
