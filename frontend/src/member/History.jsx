import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { getAttemptHistory } from '../api';

const SKILL_COLOR = {
  listening: { bg: '#dbeafe', text: '#1d4ed8', label: '🎧 Listening' },
  reading:   { bg: '#d1fae5', text: '#065f46', label: '📖 Reading' },
  speaking:  { bg: '#fed7aa', text: '#c2410c', label: '🎤 Speaking' },
  writing:   { bg: '#ede9fe', text: '#5b21b6', label: '✍️ Writing' },
};

const ScoreBar = ({ percent }) => {
  const color = percent >= 80 ? '#16a34a' : percent >= 60 ? '#d97706' : '#dc2626';
  return (
    <div style={{ height: 6, borderRadius: 99, backgroundColor: '#f1f5f9', overflow: 'hidden', marginTop: 6 }}>
      <div style={{ height: '100%', width: `${percent}%`, backgroundColor: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
    </div>
  );
};

const History = ({ userId, onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getAttemptHistory(userId)
      .then(res => setHistory(res.data || []))
      .catch(err => console.error('Load history error:', err))
      .finally(() => setLoading(false));
  }, [userId]);

  const skillGroups = history.reduce((acc, h) => {
    const skill = h.skill || 'unknown';
    if (!acc[skill]) acc[skill] = [];
    acc[skill].push(h);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              border: '1px solid #e2e8f0', backgroundColor: 'white',
              cursor: 'pointer', fontWeight: 600, color: '#475569'
            }}
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', margin: 0 }}>
              Lịch sử làm bài
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '2px 0 0' }}>
              {history.length} lần làm bài
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Đang tải...</div>
        )}

        {/* Empty */}
        {!loading && history.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 64,
            backgroundColor: 'white', borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <p style={{ color: '#64748b', fontWeight: 600 }}>Bạn chưa làm bài thi nào.</p>
            <p style={{ color: '#94a3b8', fontSize: 13 }}>Hoàn thành một bài Listening hoặc Reading để xem lịch sử tại đây.</p>
          </div>
        )}

        {/* Grouped by skill */}
        {!loading && Object.entries(skillGroups).map(([skill, items]) => {
          const sc = SKILL_COLOR[skill] || { bg: '#f1f5f9', text: '#475569', label: skill };
          return (
            <div key={skill} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                  backgroundColor: sc.bg, color: sc.text
                }}>{sc.label}</span>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{items.length} lần</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((h, idx) => (
                  <div key={idx} style={{
                    backgroundColor: 'white', borderRadius: 12, padding: '16px 20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: '1px solid #f1f5f9',
                    display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 16
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                        {h.section_name}
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} /> {h.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <BookOpen size={12} /> {h.total} câu
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle size={12} color={h.percent >= 80 ? '#16a34a' : h.percent >= 60 ? '#d97706' : '#dc2626'} />
                          {h.score}/{h.total} đúng
                        </span>
                      </div>
                      <ScoreBar percent={h.percent} />
                    </div>

                    <div style={{ textAlign: 'center', minWidth: 64 }}>
                      <div style={{
                        fontSize: 24, fontWeight: 900,
                        color: h.percent >= 80 ? '#16a34a' : h.percent >= 60 ? '#d97706' : '#dc2626'
                      }}>
                        {h.percent}%
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                        {h.percent >= 80 ? 'Xuất sắc' : h.percent >= 60 ? 'Khá' : 'Cần cải thiện'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
