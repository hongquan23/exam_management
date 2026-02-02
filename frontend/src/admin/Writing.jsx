import React from 'react';
import { Star, Clock, Eye } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const WritingTests = ({
  styles,
  hoveredCard,
  setHoveredCard,
  writingTests = [],
  setActiveView,
  handleTestClick
}) => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft} onClick={() => navigate('/admin/dashboard')}>
          <div style={styles.logo}>📚</div>
          <h1 style={styles.headerTitle}>Thư viện đề thi</h1>
        </div>
        
        <div style={styles.headerButtons}>
          <div style={styles.userProfile}>
            <div style={styles.avatar}>MB</div>
          </div>
        </div>
      </header>

      <main style={styles.content}>
        <div style={{ marginBottom: '32px' }}>
          <button 
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={() => navigate('/admin/dashboard')}
          >
            ← Quay lại
          </button>
        </div>

        <div>
          <h2 style={styles.sectionTitle}>
            <Star size={24} color="#fbbf24" fill="#fbbf24" />
            Writing Tests
          </h2>

          <div style={styles.testsGrid}>
            {writingTests.map(test => (
              <div
                key={test.id}
                style={{
                  ...styles.testCard,
                  ...(hoveredCard === test.id ? styles.testCardHover : {})
                }}
                onMouseEnter={() => setHoveredCard(test.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* 👉 Title */}
                <div style={styles.testTitle}>
                  {test.title || test.name || "Untitled Test"}
                </div>
                
                {/* 👉 Meta */}
                <div style={styles.testMeta}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {test.duration || test.time_limit || 0}p
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={12} />
                    {test.views 
                      ? (test.views > 1000 ? `${(test.views/1000).toFixed(1)}k` : test.views) 
                      : 0}
                  </span>
                </div>

                {/* 👉 Question count */}
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  {(test.questions?.length 
                    ?? test.question_count 
                    ?? 0)} câu
                </div>

                {/* 👉 Tags */}
                <div style={styles.testTags}>
                  <span style={{ ...styles.tag, ...styles.tagBlue }}>#TOEIC Bridge</span>
                  <span style={{ ...styles.tag, ...styles.tagPurple }}>#Writing</span>
                </div>

                {/* 👉 Action */}
                <button 
                  style={{ ...styles.button, ...styles.buttonPrimary, width: '100%', justifyContent: 'center' }}
                  onClick={() => handleTestClick(test)}
                >
                  Xem
                </button>

                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}>
                  {(test.comments || 0)} bình luận ▼
                </div>
              </div>
            ))}

            {writingTests.length === 0 && (
              <p style={{ color: "#6b7280" }}>Chưa có đề Writing nào.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WritingTests;
