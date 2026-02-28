const styles = {
   container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    overflow: 'hidden',
    backgroundColor: '#f8fafc', // Slate 50
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '12px 40px',
    borderBottom: '1px solid #eef2f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    width: '42px',
    height: '42px',
    background: 'linear-gradient(135deg, #ff8a00 0%, #ff5200 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '22px',
    boxShadow: '0 4px 10px rgba(255, 82, 0, 0.2)',
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: '800',
    background: 'linear-gradient(to right, #ff8a00, #ff5200)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  badge: {
  position: 'absolute',
  top: '12px',
  right: '12px',
  padding: '4px 10px',
  fontSize: '10px',
  fontWeight: '700',
  borderRadius: '999px',
  letterSpacing: '0.5px',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '999px',
    padding: '8px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0,0,0,0.05)',
  },
 searchBar: {
  flex: 1,
  border: 'none',
  outline: 'none',
  padding: '14px 18px',
  fontSize: '15px',
  background: 'transparent',
  },
  searchButton: {
    background: 'linear-gradient(to right, #ff8a00, #ff5200)',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '999px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 8px 20px rgba(255, 100, 0, 0.25)',
  },
  // Thẻ kỹ năng
   skillCard: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '32px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '2px solid transparent',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  skillIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '20px',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 15px rgba(0,0,0,0.05)',
  },
  // Thẻ bài thi
  testCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tag: {
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #eef2f6',
    padding: '60px 40px 30px',
    marginTop: 'auto',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  footerLogo: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(to right, #ff8a00, #ff5200)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
    display: 'block'
  },
  footerText: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  footerTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '20px',
  },
  footerLink: {
    color: '#64748b',
    fontSize: '14px',
    display: 'block',
    marginBottom: '12px',
    textDecoration: 'none',
    transition: 'color 0.2s',
    cursor: 'pointer'
  },
  testExam: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: "'Inter', sans-serif",
  },
    examHeader: {
    height: '64px',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  examTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1e293b',
  },

  examNav: {
    backgroundColor: '#f8fafc',
    padding: '12px 24px',
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid #e2e8f0',
    overflowX: 'auto',
  },

 navTab: {
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    border: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },

  navTabActive: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    borderColor: '#3b82f6',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)',
  },

  examContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    padding: '24px',
    gap: '24px',
  },

  examLeft: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },

  examRight: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  // --- NỘI DUNG CÂU HỎI ---
  questionContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
  },

  questionType: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#2563eb',
    textTransform: 'uppercase',
  },

  questionText: {
    fontSize: '17px',
    lineHeight: '1.7',
    color: '#334155',
    marginBottom: '24px',
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
  },

  examImage: {
    maxWidth: '100%',
    maxHeight: '380px',
    objectFit: 'contain',
    borderRadius: '12px',
    marginBottom: '24px',
    alignSelf: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },

  // --- PHẦN NHẬP LIỆU (WRITING) ---
  textarea: {
    width: '100%',
    minHeight: '220px',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    fontSize: '16px',
    lineHeight: '1.6',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: '#fff',
    resize: 'vertical',
    boxSizing: 'border-box',
    '&:focus': {
      border: '1px solid #2563eb',
      boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
    }
  },

  wordCount: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '10px',
    textAlign: 'right',
    fontWeight: '600',
    fontVariantNumeric: 'tabular-nums',
  },

  // --- TIỆN ÍCH BÊN PHẢI (TIMER & GRID) ---
  timerBox: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
  },

  timerLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '4px',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },

timerValue: {
  fontSize: "32px",
  fontWeight: 800,
  color: "#ef4444",
  letterSpacing: "2px"
},

  questionsBox: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    flex: 1,
    overflowY: 'auto',
  },

  questionsTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  questionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
  },

  questionNumber: {
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid transparent',
  },

  questionNumberActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
    transform: 'scale(1.05)',
  },

  // --- KẾT QUẢ AI & MODAL ---
  aiBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '16px',
    color: '#166534',
    fontSize: '15px',
    lineHeight: '1.6',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
  },

  resultOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },

  resultModal: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    width: '560px',
    maxWidth: '90%',
    maxHeight: '85vh',
    padding: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflowY: 'auto',
  },

  // --- NÚT BẤM ---
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  },

  primaryBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#1d4ed8',
      transform: 'translateY(-1px)',
    }
  },

  secondaryBtn: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    '&:hover': {
      backgroundColor: '#e2e8f0',
    }
  },

  submitButton: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '14px 28px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
    '&:hover': {
      backgroundColor: '#059669',
      boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)',
    }
  },
  recordButton: {
    display: 'flex',          // Chuyển về flex để căn chỉnh icon và chữ bên trong
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',               // Khoảng cách giữa icon và chữ
    
    // Kích thước ngắn lại
    padding: '10px 24px', 
    width: 'fit-content',     // Nút chỉ dài bằng nội dung bên trong
    minWidth: '160px',        // Đảm bảo nút không quá ngắn khi đổi chữ
    
    // Căn giữa nút
    margin: '20px auto',      // 20px cách trên dưới, 'auto' để căn giữa trái phải
    
    borderRadius: '50px',     // Bo tròn kiểu capsule
    border: 'none',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  // Tạo class riêng cho trạng thái đang ghi âm
  recordActive: {
    backgroundColor: '#dc2626',
    boxShadow: '0 0 0 4px rgba(220, 38, 38, 0.2), 0 4px 15px rgba(220, 38, 38, 0.4)',
    animation: 'pulse 1.5s infinite', // Nếu bạn dùng CSS keyframes
  },
submitBtn: {
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  padding: "12px 26px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.25s ease",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  position: "relative",
},

submitBtnHover: {
  background: "#43a047",
  transform: "translateY(-1px)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
},

submitBtnActive: {
  transform: "translateY(0)",
  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
},

submitBtnDisabled: {
  background: "#9e9e9e",
  cursor: "not-allowed",
  boxShadow: "none",
  transform: "none",
},

submitBtnLoading: {
  paddingLeft: "42px",
},

spinner: {
  position: "absolute",
  left: "14px",
  top: "50%",
  width: "16px",
  height: "16px",
  border: "3px solid #fff",
  borderTop: "3px solid transparent",
  borderRadius: "50%",
  transform: "translateY(-50%)",
  animation: "spin 0.8s linear infinite",
},
resultModalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  overflowY: "auto"   
},
resultModal: {
  position: "relative",
  width: "80vw",      
  maxWidth: "1100px",
  background: "#fff",
  borderRadius: "14px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  padding: "22px",
  maxHeight: "90vh",   
  overflowY: "auto"   
},
resultHeader: {
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "10px"
},

resultAudio: {
  margin: "10px 0"
},

resultAIBox: {
  background: "#ecfeff",
  border: "1px solid #67e8f9",
  borderRadius: "8px",
  padding: "10px",
  marginTop: "10px"
},

resultActions: {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "14px"
},
closeBtn: {
  position: "absolute",
  top: "10px",
  right: "12px",
  border: "none",
  background: "transparent",
  fontSize: "22px",
  cursor: "pointer",
  color: "#666",
  fontWeight: "bold"
}

};

export default styles;