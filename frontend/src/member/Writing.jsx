import React from 'react';
import { 
  Search, Star, Eye, Clock, ChevronDown, BookOpen, 
  Crown, ArrowLeft, Facebook, Youtube, Mail, Phone 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const WritingTests = ({
  user,
  styles,
  hoveredCard,
  setHoveredCard,
  writingTests = [],
  showUserMenu,
  setShowUserMenu,
  handleLogout,
  handleTestClick
}) => {
  const navigate = useNavigate();

  // Hàm lấy chữ cái đầu của tên user cho Avatar
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  return (
    <div style={styles.container}>
      {/* HEADER ĐỒNG BỘ CHUYÊN NGHIỆP */}
      <header style={styles.header}>
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/member/dashboard')}>
          <div style={styles.logo}><BookOpen size={22} /></div>
          <h1 style={styles.headerTitle}>EstudyMe</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 mr-4">
            <span className="hover:text-orange-600 cursor-pointer transition-colors" onClick={() => navigate('/member/dashboard')}>Khám phá</span>
            <span className="text-orange-600 cursor-pointer">Thư viện</span>
            <span className="hover:text-orange-600 cursor-pointer transition-colors">Lộ trình</span>
          </nav>

          <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full font-bold text-xs hover:bg-orange-100 transition-all">
            <Crown size={14} /> NÂNG CẤP PRO
          </button>

          <div className="relative group">
            <div 
              className="flex items-center gap-2 cursor-pointer p-1 pr-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-all"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {getInitials(user?.name)}
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-5 py-4 border-b border-slate-50">
                  <p className="font-bold text-slate-800 text-sm truncate">{user?.name || 'Người dùng'}</p>
                  <div className="flex items-center gap-2 mt-1 text-slate-400">
                    <Mail size={12} />
                    <p className="text-xs truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <button className="w-full text-left px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2">👤 Hồ sơ</button>
                  <button className="w-full text-left px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2">📊 Lịch sử</button>
                  <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-bold flex items-center gap-2">🚪 Đăng xuất</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-10 md:px-20">
          {/* NAVIGATION & TITLE */}
          <div className="mb-10">
            <button 
              onClick={() => navigate('/member/dashboard')}
              className="flex items-center gap-2 text-slate-500 hover:text-orange-600 font-semibold text-sm transition-colors mb-4"
            >
              <ArrowLeft size={18} /> Quay lại trang chủ
            </button>
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <span className="w-2 h-10 bg-purple-500 rounded-full"></span>
              Kỹ năng Writing
            </h2>
            <p className="text-slate-500 mt-2 italic text-sm">Hệ thống AI tự động chấm điểm và sửa lỗi ngữ pháp ngay lập tức.</p>
          </div>

          {/* GRID WRITING TESTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {writingTests.map(test => (
              <div
                key={test.id}
                style={{
                  ...styles.testCard,
                  boxShadow: hoveredCard === test.id ? '0 15px 30px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.02)',
                  borderColor: hoveredCard === test.id ? '#8b5cf6' : '#f1f5f9' // Viền tím cho Writing
                }}
                onMouseEnter={() => setHoveredCard(test.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex gap-2 mb-3">
                  <span style={{ ...styles.tag, backgroundColor: '#f5f3ff', color: '#7c3aed' }}>#TOEIC Writing</span>
                  <span style={{ ...styles.tag, backgroundColor: '#f0fdf4', color: '#16a34a' }}>#Free</span>
                </div>
                
                <h4 className="text-lg font-bold text-slate-800 line-clamp-2 min-h-[3.5rem] leading-tight hover:text-purple-600 transition-colors cursor-pointer">
                  {test.title || test.name || "Untitled Writing Test"}
                </h4>

                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold py-2 border-y border-slate-50">
                  <span className="flex items-center gap-1"><Clock size={14} /> {test.duration || test.time_limit || 0} phút</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {test.views > 1000 ? `${(test.views/1000).toFixed(1)}k` : (test.views || 0)}</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-[11px] font-bold text-slate-500">
                    {(test.questions?.length ?? test.question_count ?? 0)} phần thi
                  </div>
                  <div className="text-[11px] text-purple-600 font-bold">AI Feedback</div>
                </div>

                <button 
                  style={{ ...styles.searchButton, background: 'linear-gradient(to right, #8b5cf6, #7c3aed)' }}
                  className="w-full mt-4 !py-3 shadow-lg shadow-purple-100 active:scale-95 transition-all"
                  onClick={() => handleTestClick(test)}
                >
                  Viết bài ngay
                </button>
              </div>
            ))}

            {writingTests.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Chưa có đề Writing nào được cập nhật.</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ĐỒNG BỘ */}
        <footer style={styles.footer}>
          <div style={styles.footerGrid}>
            <div>
              <span style={styles.footerLogo}>EstudyMe</span>
              <p style={styles.footerText}>Luyện thi TOEIC 4 kỹ năng với công nghệ AI hàng đầu.</p>
              <div className="flex gap-3 mt-4">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all"><Facebook size={18} /></div>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all"><Youtube size={18} /></div>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all"><Mail size={18} /></div>
              </div>
            </div>

            <div>
              <h4 style={styles.footerTitle}>Khám phá</h4>
              <nav className="flex flex-col space-y-2">
                <span className="text-sm text-slate-500 hover:text-orange-500 cursor-pointer">Thư viện Writing</span>
                <span className="text-sm text-slate-500 hover:text-orange-500 cursor-pointer">Thư viện Speaking</span>
                <span className="text-sm text-slate-500 hover:text-orange-500 cursor-pointer">Thi thử Full Test</span>
              </nav>
            </div>

            <div>
              <h4 style={styles.footerTitle}>Pháp lý</h4>
              <nav className="flex flex-col space-y-2">
                <span className="text-sm text-slate-500 hover:text-orange-500 cursor-pointer">Điều khoản</span>
                <span className="text-sm text-slate-500 hover:text-orange-500 cursor-pointer">Bảo mật</span>
              </nav>
            </div>

            <div>
              <h4 style={styles.footerTitle}>Liên hệ</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-500 text-sm"><Phone size={16} className="text-orange-500" /> 0987.654.321</div>
                <div className="flex items-center gap-3 text-slate-500 text-sm"><Mail size={16} className="text-orange-500" /> hotro@estudyme.com</div>
              </div>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-slate-100 text-center text-[12px] text-slate-400">
            © 2026 EstudyMe - Học thông minh, thi điểm cao.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default WritingTests;