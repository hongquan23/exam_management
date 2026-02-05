import React from 'react';
import { 
  Search, Star, Eye, Clock, ChevronDown, BookOpen, 
  Crown, ArrowLeft, Facebook, Youtube, Mail, Phone 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const SpeakingTests = ({
  user,
  styles,
  hoveredCard,
  setHoveredCard,
  speakingTests = [],
  showUserMenu,
  setShowUserMenu,
  handleLogout,
  handleTestClick
}) => {
  const navigate = useNavigate();

  // Lấy chữ cái đầu của tên user
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  return (
    <div style={styles.container}>
      {/* HEADER ĐỒNG BỘ VỚI DASHBOARD */}
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
                  <button className="w-full text-left px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">👤 Hồ sơ cá nhân</button>
                  <button className="w-full text-left px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">📊 Lịch sử bài làm</button>
                  <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-bold">🚪 Đăng xuất</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-10 md:px-20">
          {/* BACK BUTTON & TITLE */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <button 
                onClick={() => navigate('/member/dashboard')}
                className="flex items-center gap-2 text-slate-500 hover:text-orange-600 font-semibold text-sm transition-colors mb-4"
              >
                <ArrowLeft size={18} /> Quay lại trang chủ
              </button>
              <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <span className="w-2 h-10 bg-orange-500 rounded-full"></span>
                Kỹ năng Speaking
              </h2>
              <p className="text-slate-500 mt-2">Tổng hợp {speakingTests.length} đề thi Speaking theo format chuẩn.</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm đề Speaking..." 
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-64"
                  />
               </div>
            </div>
          </div>

          {/* GRID TESTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {speakingTests.map(test => (
              <div
                key={test.id}
                style={{
                  ...styles.testCard,
                  boxShadow: hoveredCard === test.id ? '0 15px 30px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.02)',
                  borderColor: hoveredCard === test.id ? '#ff8a00' : '#f1f5f9'
                }}
                onMouseEnter={() => setHoveredCard(test.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex gap-2 mb-3">
                  <span style={{ ...styles.tag, backgroundColor: '#eff6ff', color: '#2563eb' }}>#TOEIC Bridge</span>
                  <span style={{ ...styles.tag, backgroundColor: '#fff7ed', color: '#ea580c' }}>#Speaking</span>
                </div>
                
                <h4 className="text-lg font-bold text-slate-800 line-clamp-2 min-h-[3.5rem] leading-tight hover:text-orange-600 transition-colors cursor-pointer">
                  {test.title || test.name || "Untitled Test"}
                </h4>

                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold py-2 border-y border-slate-50">
                  <span className="flex items-center gap-1"><Clock size={14} /> {test.duration || test.time_limit || 0} phút</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {test.views > 1000 ? `${(test.views/1000).toFixed(1)}k` : (test.views || 0)}</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-[11px] font-bold text-slate-500">
                    {(test.questions?.length ?? test.question_count ?? 0)} câu hỏi
                  </div>
                  <div className="text-[11px] text-orange-500 font-bold">{(test.comments || 0)} bình luận</div>
                </div>

                <button 
                  style={styles.searchButton}
                  className="w-full mt-4 !py-3 shadow-lg shadow-orange-200 active:scale-95 transition-all"
                  onClick={() => handleTestClick(test)}
                >
                  Bắt đầu thi
                </button>
              </div>
            ))}

            {speakingTests.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium text-lg">Chưa có đề Speaking nào trong thư viện.</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ĐỒNG BỘ */}
        <footer style={styles.footer}>
          <div style={styles.footerGrid}>
            <div className="space-y-4">
              <span style={styles.footerLogo}>EstudyMe</span>
              <p style={styles.footerText}>Nền tảng luyện thi TOEIC trực tuyến hàng đầu Việt Nam.</p>
              <div className="flex gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all"><Facebook size={18} /></div>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all"><Youtube size={18} /></div>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all"><Mail size={18} /></div>
              </div>
            </div>

            <div>
              <h4 style={styles.footerTitle}>Khám phá</h4>
              <nav className="flex flex-col">
                <span style={styles.footerLink}>Thư viện đề thi</span>
                <span style={styles.footerLink}>Lộ trình học</span>
                <span style={styles.footerLink}>Thi thử Online</span>
              </nav>
            </div>

            <div>
              <h4 style={styles.footerTitle}>Hỗ trợ</h4>
              <nav className="flex flex-col">
                <span style={styles.footerLink}>Chính sách bảo mật</span>
                <span style={styles.footerLink}>Điều khoản dịch vụ</span>
                <span style={styles.footerLink}>Câu hỏi thường gặp</span>
              </nav>
            </div>

            <div>
              <h4 style={styles.footerTitle}>Liên hệ</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium"><Phone size={16} className="text-orange-500" /> 0987.654.321</div>
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium"><Mail size={16} className="text-orange-500" /> hotro@estudyme.com</div>
              </div>
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-slate-400 font-medium">
            <p>© 2026 EstudyMe. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-6"><span>English (US)</span><span>Tiếng Việt</span></div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default SpeakingTests;