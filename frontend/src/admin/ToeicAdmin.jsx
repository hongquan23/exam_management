import React, { useState } from 'react';
import { Users, Plus, ChevronDown } from 'lucide-react';
import Dashboard from './Dashboard';
import UsersPage from './Users';
import UploadModal from './Upload';

const ToeicAdmin = () => {

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [newComment, setNewComment] = useState({});

  const [tests, setTests] = useState([
    {
      id: 1,
      title: 'TOEIC Full Test 2024 - Part 1-7',
      duration: 120,
      views: 28500,
      comments: 95,
      parts: 7,
      questions: 200,
      type: 'TOEIC',
      skill: 'Full Test',
      rating: 4.7,
      userComments: [
        { id: 1, user: 'Mai Thu H', avatar: '👩', text: 'Full test rất chi tiết!', likes: 30, timestamp: Date.now() },
        { id: 2, user: 'Truong Van I', avatar: '🧑', text: 'Audio chuẩn!', likes: 22, timestamp: Date.now() }
      ]
    },
    {
      id: 2,
      title: 'TOEIC Speaking Practice - Q1-11',
      duration: 20,
      views: 12300,
      comments: 45,
      parts: 11,
      questions: 11,
      type: 'TOEIC SW',
      skill: 'Speaking',
      rating: 4.8,
      userComments: [
        { id: 1, user: 'Bùi Van K', avatar: '🧑', text: 'AI chấm điểm chính xác!', likes: 28, timestamp: Date.now() }
      ]
    },
    {
      id: 3,
      title: 'IELTS General Reading Test 1',
      duration: 60,
      views: 55779,
      comments: 62,
      parts: 3,
      questions: 40,
      type: 'IELTS',
      skill: 'Reading',
      rating: 4.9,
      userComments: []
    },
    {
      id: 4,
      title: 'TOEIC Listening Part 1-4',
      duration: 45,
      views: 18900,
      comments: 34,
      parts: 4,
      questions: 100,
      type: 'TOEIC',
      skill: 'Listening',
      rating: 4.6,
      userComments: []
    }
  ]);

  const handleTabChange = (tab) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 150);
  };

  const handleAddComment = (testId) => {
    const commentText = newComment[testId];
    if (!commentText || commentText.trim() === '') return;

    setTests(prevTests => prevTests.map(test => {
      if (test.id === testId) {
        const newCommentObj = {
          id: Date.now(),
          user: 'Admin User',
          avatar: '👤',
          text: commentText.trim(),
          likes: 0,
          timestamp: Date.now()
        };
        return {
          ...test,
          userComments: [...test.userComments, newCommentObj],
          comments: test.comments + 1
        };
      }
      return test;
    }));

    setNewComment(prev => ({ ...prev, [testId]: '' }));
  };

  const handleDeleteComment = (testId, commentId) => {
    if (!window.confirm('Bạn có chắc muốn xoá bình luận này?')) return;

    setTests(prevTests => prevTests.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          userComments: test.userComments.filter(c => c.id !== commentId),
          comments: test.comments - 1
        };
      }
      return test;
    }));
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const skills = [
    { id: 'listening', name: 'Listening', icon: '🎧', color: '#3b82f6', count: 45 },
    { id: 'reading', name: 'Reading', icon: '📚', color: '#10b981', count: 52 },
    { id: 'writing', name: 'Writing', icon: '✍️', color: '#8b5cf6', count: 38 },
    { id: 'speaking', name: 'Speaking', icon: '🎤', color: '#f97316', count: 41 }
  ];

  const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'user1@email.com', registeredDate: '01/01/2026' },
    { id: 2, name: 'Trần Thị B', email: 'user2@email.com', registeredDate: '01/01/2026' },
    { id: 3, name: 'Lê Văn C', email: 'user3@email.com', registeredDate: '01/01/2026' },
    { id: 4, name: 'Phạm Thị D', email: 'user4@email.com', registeredDate: '01/01/2026' },
    { id: 5, name: 'Hoàng Văn E', email: 'user5@email.com', registeredDate: '01/01/2026' }
  ];

  const handleDeleteUser = (userId, name) => {
    if (window.confirm(`Bạn có chắc muốn xoá người dùng "${name}"?`)) {
      alert(`Đã xoá người dùng "${name}"`);
    }
  };

  const handleSearch = () => {
    console.log('Tìm kiếm:', searchQuery);
  };

  const handleLogout = () => {
    alert('Đăng xuất thành công!');
  };

  // ===== STYLES =====
  const styles = { 
    container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#d1fae5',
    padding: '16px 32px',
    borderBottom: '2px solid #a7f3d0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer'
  },
  logo: {
    width: '48px',
    height: '48px',
    backgroundColor: '#10b981',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.2s ease'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#065f46',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease',
    margin: 0
  },
  headerButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  buttonPrimary: {
    backgroundColor: '#10b981',
    color: 'white',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
  },
  buttonSecondary: {
    backgroundColor: 'white',
    color: '#059669',
    border: '2px solid #10b981'
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    cursor: 'pointer'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
    backgroundColor: '#f9fafb',
    opacity: 1,
    transition: 'opacity 0.15s ease'
  },
  contentTransitioning: {
    opacity: 0
  },
searchContainer: {
  display: 'flex',
  alignItems: 'center',
  maxWidth: '900px',
  marginBottom: '32px'
},
searchWrapper: {
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  border: '2px solid #10b981',
  borderRadius: '999px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
},
searchBar: {
  flex: 1,
  border: 'none',
  padding: '14px 20px 14px 50px',
  fontSize: '15px',
  outline: 'none',
  color: '#374151'
},
searchIcon: {
  position: 'absolute',
  left: '18px',
  color: '#10b981'
},

searchButton: {
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  padding: '14px 32px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  borderRadius: '0 999px 999px 0',
  transition: 'all 0.2s ease'
},

  skillsSection: {
    marginBottom: '48px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '20px'
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },
  skillCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid #e5e7eb'
  },
  skillCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    borderColor: '#2563eb'
  },
  skillIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px'
  },
  skillName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px'
  },
  skillCount: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  },
  testsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },
  testCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease',
    padding: '16px'
  },
  testCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
  },
  testImage: {
    width: '100%',
    height: '120px',
    objectFit: 'cover'
  },
  testInfo: {
    padding: 0
  },
  testTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    minHeight: '48px'
  },
  testMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  testTags: {
    display: 'flex',
    gap: '4px',
    marginBottom: '8px'
  },
  tag: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600'
  },
  tagBlue: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  tagPurple: {
    backgroundColor: '#f3e8ff',
    color: '#7c3aed'
  },
  actionButtons: {
    display: 'flex',
    gap: '6px',
    marginBottom: '8px'
  },
  commentsSection: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '8px'
  },
  commentToggle: {
    width: '100%',
    background: 'none',
    border: 'none',
    padding: '4px 0',
    fontSize: '12px',
    color: '#6b7280',
    cursor: 'pointer',
    fontWeight: '500',
    textAlign: 'left'
  },
  commentsList: {
    marginTop: '8px',
    maxHeight: '150px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  comment: {
    display: 'flex',
    gap: '6px'
  },
  commentAvatar: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    flexShrink: 0
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '6px'
  },
  commentUser: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '2px'
  },
  commentText: {
    fontSize: '11px',
    color: '#374151',
    marginBottom: '4px'
  },
  commentActions: {
    display: 'flex',
    gap: '8px',
    fontSize: '10px',
    color: '#6b7280',
    alignItems: 'center'
  },
  deleteCommentButton: {
    marginLeft: 'auto',
    cursor: 'pointer',
    color: '#dc2626',
    padding: '2px 6px',
    borderRadius: '4px',
    transition: 'background 0.2s ease'
  },
  commentInput: {
    display: 'flex',
    gap: '6px',
    marginTop: '8px'
  },
  input: {
    flex: 1,
    padding: '6px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    fontSize: '11px',
    outline: 'none'
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: '8px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    padding: '8px',
    minWidth: '200px',
    zIndex: 1000
  },
  dropdownItem: {
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'background 0.2s ease'
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '8px 0'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '16px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  inputField: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none'
  },
  uploadArea: {
    border: '2px dashed #e5e7eb',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
  },
  usersTable: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'grid',
    gridTemplateColumns: '100px 1fr 1.5fr 200px',
    gap: '20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  tableRow: {
    padding: '20px',
    borderBottom: '1px solid #f3f4f6',
    display: 'grid',
    gridTemplateColumns: '100px 1fr 1.5fr 200px',
    gap: '20px',
    fontSize: '14px',
    alignItems: 'center',
    transition: 'background 0.2s ease'
  },
  tableRowHover: {
    backgroundColor: '#f9fafb'
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600'
  },
  actionIcon: {
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

 const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <Dashboard
          styles={styles}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredTests={filteredTests}
          skills={skills}
          hoveredSkill={hoveredSkill}
          setHoveredSkill={setHoveredSkill}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          showComments={showComments}
          setShowComments={setShowComments}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          handleDeleteComment={handleDeleteComment}
          handleSearch={handleSearch}
        />
      );
    }

    if (activeTab === 'users') {
      return (
        <UsersPage
          styles={styles}
          mockUsers={mockUsers}
          handleTabChange={handleTabChange}
          handleDeleteUser={handleDeleteUser}
        />
      );
    }

    return null;
  };

  // ===== RETURN GỐC =====
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div
          style={styles.headerLeft}
          onClick={() => handleTabChange('dashboard')}
        >
          <div style={styles.logo}>📚</div>
          <h1 style={styles.headerTitle}>Thư viện đề thi</h1>
        </div>

        <div style={styles.headerButtons}>
          <button
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              ...(activeTab === 'users' ? { backgroundColor: '#10b981', color: 'white', border: 'none' } : {})
            }}
            onClick={() => handleTabChange('users')}
          >
            <Users size={18} />
            Quản lý người dùng
          </button>

          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={() => setShowUploadModal(true)}
          >
            <Plus size={18} />
            Upload đề thi
          </button>

          <div style={styles.userProfile} onClick={() => setShowUserMenu(!showUserMenu)}>
            <div style={styles.avatar}>AD</div>
            <ChevronDown size={20} color="#059669" />

            {showUserMenu && (
              <div style={styles.dropdown}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Admin User</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>admin@toeic.com</div>
                </div>
                <div style={styles.dropdownItem}>Thông tin tài khoản</div>
                <div style={styles.dropdownItem}>Cài đặt</div>
                <div style={styles.dropdownDivider}></div>
                <div style={{ ...styles.dropdownItem, color: '#dc2626' }} onClick={handleLogout}>
                  Đăng xuất
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{ ...styles.content, ...(isTransitioning ? styles.contentTransitioning : {}) }}>
        {renderContent()}
      </main>

      {showUploadModal && (
        <UploadModal
          styles={styles}
          setShowUploadModal={setShowUploadModal}
        />
      )}
    </div>
  );
};

export default ToeicAdmin;