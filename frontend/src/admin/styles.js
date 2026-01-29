const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    overflow: 'auto',
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#dbeafe',
    padding: '16px 32px',
    borderBottom: '2px solid #a7f3d0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
    position: 'relative',
    zIndex: 1000
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
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
    transition: 'all 0.2s ease'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#10b981',
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
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
  },
  buttonSecondary: {
    backgroundColor: 'white',
    color: '#10b981',
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
    backgroundColor: '#f9fafb'
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
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
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
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#e5e7eb',
    position: 'relative'
  },
  skillCardDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  skillCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    borderColor: '#10b981'
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
    marginBottom: '12px'
  },
  tag: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600'
  },
  tagBlue: {
    backgroundColor: '#dbeafe',
    color: '#10b981'
  },
  tagPurple: {
    backgroundColor: '#f3e8ff',
    color: '#065f46'
  },
  testExam: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f9fafb',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column'
  },
  examHeader: {
    backgroundColor: 'white',
    padding: '16px 32px',
    borderBottom: '2px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  examTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: 0
  },
  examNav: {
    backgroundColor: 'white',
    padding: '16px 32px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    gap: '16px',
    overflowX: 'auto'
  },
  navTab: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    backgroundColor: '#f3f4f6',
    color: '#6b7280'
  },
  navTabActive: {
    backgroundColor: '#dbeafe',
    color: '#10b981',
    fontWeight: '600'
  },
  examContent: {
    flex: 1,
    display: 'flex',
    gap: '24px',
    padding: '32px',
    overflowY: 'auto'
  },
  examLeft: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  examRight: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  timerBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  timerLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  timerValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#10b981'
  },
  questionsBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  questionsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px'
  },
  questionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '16px'
  },
  questionNumber: {
    padding: '8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e5e7eb'
  },
  questionNumberActive: {
    backgroundColor: '#dbeafe',
    color: '#065f46',
    borderColor: '#10b981'
  },
  questionContent: {
    marginBottom: '32px'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  questionType: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  questionText: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    fontSize: '15px',
    lineHeight: '1.8',
    color: '#374151',
    marginBottom: '20px',
    border: '1px solid #e5e7eb',
    whiteSpace: 'pre-line'
  },
  recordButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#374151',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#374151',
    outline: 'none',
    fontFamily: 'inherit'
  },
  wordCount: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '8px'
  },
  examImage: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '20px'
  },
  imageCaption: {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '20px',
    fontStyle: 'italic'
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
  badge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#fbbf24',
    color: '#92400e',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  wordBox: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#e0e7ff',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    margin: '4px',
    cursor: 'move',
    userSelect: 'none'
  },
  sentenceBuilder: {
    minHeight: '60px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    marginBottom: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px'
  },
  emailBox: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #e5e7eb'
  },
  emailHeader: {
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb'
  },
  emailLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginRight: '8px'
  },
  emailValue: {
    fontSize: '14px',
    color: '#111827',
    fontWeight: '500'
  },
  modal: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modalContent: {
    width: '520px',
    maxWidth: '95vw',
    maxHeight: '85vh',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px 24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    position: 'relative'
  },

  closeButton: {
    position: 'absolute',
    top: '14px',
    right: '16px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  modalTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '20px',
    color: '#111827'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
    display: 'block'
  },
  inputField: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none'
  },
  uploadArea: {
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    backgroundColor: '#f9fafb',
    cursor: 'pointer'
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px'
  },
  usersTable: {
    width: '100%',
    maxWidth: '1500px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.06)'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '100px 2fr 4fr 2fr',
    padding: '22px 32px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#374151',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },

  tableRow: {
    display: 'grid',
    gridTemplateColumns: '100px 2fr 4fr 2fr',
    padding: '22px 32px',
    alignItems: 'center',
    fontSize: '15px',
    borderBottom: '1px solid #f1f5f9'
  },

  actionCell: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px'
  },
adminActions: {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  marginTop: '8px'
},

viewBtn: {
  flex: 1,
  height: '42px',
  borderRadius: '12px',
  backgroundColor: '#10b981',
  color: '#fff',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer'
},

iconBtn: {
  width: '42px',
  height: '42px',
  borderRadius: '12px',
  border: '2px solid #10b981',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0   
},

deleteBtn: {
  border: '2px solid #ef4444'
}
};

export default styles;