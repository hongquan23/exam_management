import React from 'react';
import { Search, Star, Eye, Clock, ChevronDown } from 'lucide-react';


const Dashboard = ({
  styles,
  skills,
  searchQuery,
  setSearchQuery,
  showUserMenu,
  setShowUserMenu,
  handleSkillClick,
  handleLogout,
  hoveredSkill,
  setHoveredSkill,
  hoveredCard,
  setHoveredCard,
  allTests,
  handleTestClick
}) => {
    const handleSearch = () => {
    console.log("Search:", searchQuery);
  };
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>📚</div>
          <h1 style={styles.headerTitle}>Thư viện đề thi</h1>
        </div>
        
        <div style={styles.headerButtons}>
          <div style={styles.userProfile} onClick={() => setShowUserMenu(!showUserMenu)}>
            <div style={styles.avatar}>MB</div>
            <ChevronDown size={20} color="#2563eb" />

            {showUserMenu && (
              <div style={styles.dropdown}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Member User</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>member@toeic.com</div>
                </div>

                <div 
                  style={styles.dropdownItem}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Thông tin tài khoản
                </div>

                <div 
                  style={styles.dropdownItem}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Lịch sử làm bài
                </div>

                <div style={styles.dropdownDivider}></div>

                <div 
                  style={{ ...styles.dropdownItem, color: '#dc2626' }}
                  onClick={handleLogout}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#fee2e2'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Đăng xuất
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={styles.content}>
        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <Search size={20} style={styles.searchIcon} />

            <input
              type="text"
              placeholder="Nhập từ khóa bạn muốn tìm kiếm:..."
              style={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            <button
              style={styles.searchButton}
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>


        <div style={styles.skillsSection}>
          <h2 style={styles.sectionTitle}>4 Kỹ Năng TOEIC</h2>
          <div style={styles.skillsGrid}>
            {skills.map(skill => (
              <div
                key={skill.id}
                style={{
                  ...styles.skillCard,
                  ...(skill.disabled ? styles.skillCardDisabled : {}),
                  ...(hoveredSkill === skill.id && !skill.disabled ? styles.skillCardHover : {})
                }}
                onMouseEnter={() => !skill.disabled && setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                onClick={() => handleSkillClick(skill)}
              >
                {skill.disabled && <div style={styles.badge}>COMING SOON</div>}
                <div style={{ ...styles.skillIcon, backgroundColor: skill.color }}>
                  <span style={{ fontSize: '32px' }}>{skill.icon}</span>
                </div>
                <div style={styles.skillName}>{skill.name}</div>
                <div style={styles.skillCount}>{skill.count} đề thi</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={styles.sectionTitle}>
            <Star size={24} color="#fbbf24" fill="#fbbf24" />
            Đề Tiêu Biểu
          </h2>

          <div style={styles.testsGrid}>
            {allTests.map(test => (
              <div
                key={test.id}
                style={{
                  ...styles.testCard,
                  ...(hoveredCard === test.id ? styles.testCardHover : {})
                }}
                onMouseEnter={() => setHoveredCard(test.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.testTitle}>{test.title}</div>
                
                <div style={styles.testMeta}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {test.duration}p
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={12} />
                    {test.views > 1000 ? `${(test.views/1000).toFixed(1)}k` : test.views}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  {test.questions} câu
                </div>

                <div style={styles.testTags}>
                  <span style={{ ...styles.tag, ...styles.tagBlue }}>#{test.type}</span>
                  <span style={{ ...styles.tag, ...styles.tagPurple }}>#{test.skill}</span>
                </div>

                <button 
                  style={{ ...styles.button, ...styles.buttonPrimary, width: '100%', justifyContent: 'center' }}
                  onClick={() => handleTestClick(test)}
                >
                  Xem
                </button>

                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}>
                  {test.comments} bình luận ▼
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;