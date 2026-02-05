import React from 'react';
import { Search, Star, Eye, Clock, ChevronDown, BookOpen, Crown, TrendingUp, Facebook, Youtube, Mail, Phone } from 'lucide-react';

const Dashboard = ({
  styles, skills, searchQuery, setSearchQuery, showUserMenu,
  setShowUserMenu, handleSkillClick, handleLogout, hoveredSkill,
  setHoveredSkill, hoveredCard, setHoveredCard, allTests, handleTestClick
}) => {
  
  const handleSearch = () => {
    console.log("Tìm kiếm:", searchQuery);
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div className="flex items-center gap-4 cursor-pointer">
          <div style={styles.logo}><BookOpen size={22} /></div>
          <h1 style={styles.headerTitle}>LearnWithMe</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 mr-4">
            <span className="text-orange-600 cursor-pointer">Khám phá</span>
            <span className="hover:text-orange-600 cursor-pointer transition-colors">Thư viện</span>
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">MB</div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

{showUserMenu && (
  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
    {/* Phần thông tin người dùng */}
    <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          MB
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-sm leading-tight">Member User</span>
          <span className="text-[11px] text-slate-500 font-medium">Hạng: Thành viên PRO</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 text-slate-400">
        <Mail size={12} />
        <span className="text-xs truncate">member@toeic.com</span>
      </div>
    </div>

    {/* Các lựa chọn menu */}
    <div className="p-2 space-y-1">
      <button className="w-full text-left px-3 py-2.5 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white">
           <span className="text-xs">👤</span>
        </div>
        Hồ sơ cá nhân
      </button>
      <button className="w-full text-left px-3 py-2.5 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
           <span className="text-xs">📊</span>
        </div>
        Lịch sử bài làm
      </button>
      
      <div className="h-[1px] bg-slate-100 my-1 mx-2" />
      
      <button 
        onClick={handleLogout} 
        className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-semibold flex items-center gap-3 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-red-100/50 flex items-center justify-center">
           <span className="text-xs">🚪</span>
        </div>
        Đăng xuất
      </button>
    </div>
  </div>
)}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto px-6 py-10 md:px-20">
        {/* HERO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold mb-4">
            <TrendingUp size={12}/> #1 NỀN TẢNG LUYỆN THI TOEIC 2026
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
            Chinh phục <span className="text-orange-500">TOEIC®</span> Thông Minh
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Đề thi được biên soạn theo cấu trúc mới nhất, tích hợp AI chấm điểm Speaking & Writing.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-3xl mx-auto mb-20">
          <div style={styles.searchWrapper} className="focus-within:ring-4 focus-within:ring-orange-100 transition-all">
            <Search size={20} className="ml-5 text-slate-400" />
            <input
              type="text"
              placeholder="Nhập tên đề thi, kỹ năng hoặc từ khóa..."
              style={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button style={styles.searchButton} onClick={handleSearch} className="hover:opacity-90 active:scale-95">
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* SKILLS SECTION */}
        <div className="mb-20">
          <h3 className="text-2xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-orange-500 rounded-full"></span> 4 Kỹ Năng Chính
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map(skill => (
              <div
                key={skill.id}
                style={{
                  ...styles.skillCard,
                  boxShadow: hoveredSkill === skill.id ? '0 20px 40px rgba(0,0,0,0.08)' : 'none',
                  transform: hoveredSkill === skill.id ? 'translateY(-8px)' : 'none',
                  borderColor: hoveredSkill === skill.id ? '#ff5200' : '#f1f5f9'
                }}
                onMouseEnter={() => !skill.disabled && setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                onClick={() => handleSkillClick(skill)}
                className={skill.disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
              >
                {skill.disabled && <div style={styles.badge} className="!bg-slate-200 !text-slate-600">SẮP RA MẮT</div>}
                <div style={{ ...styles.skillIcon, backgroundColor: `${skill.color}15`, color: skill.color }}>
                  <span className="text-3xl">{skill.icon}</span>
                </div>
                <div className="text-xl font-black text-slate-800 mb-2">{skill.name}</div>
                <div className="text-slate-400 font-medium">{skill.count} bộ đề chuẩn</div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURED TESTS */}
        <div>
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
              <Star size={24} className="text-yellow-400 fill-yellow-400" /> Đề Thi Tiêu Biểu
            </h3>
            <span className="text-orange-600 font-bold text-sm cursor-pointer hover:underline">Xem tất cả →</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allTests.map(test => (
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
                <div className="flex gap-2">
                  <span style={{ ...styles.tag, backgroundColor: '#eff6ff', color: '#2563eb' }}>#{test.type}</span>
                  <span style={{ ...styles.tag, backgroundColor: '#faf5ff', color: '#9333ea' }}>#{test.skill}</span>
                </div>
                
                <h4 className="text-lg font-bold text-slate-800 line-clamp-2 min-h-[3.5rem] leading-tight hover:text-orange-600 transition-colors cursor-pointer">
                  {test.title || test.name}
                </h4>

                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold py-2 border-y border-slate-50">
                  <span className="flex items-center gap-1"><Clock size={14} /> {test.duration} phút</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {test.views > 1000 ? `${(test.views/1000).toFixed(1)}k` : test.views} lượt</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-[11px] font-bold text-slate-500">
                    {(test.questions?.length ?? test.question_count ?? 0)} câu hỏi
                  </div>
                  <div className="text-[11px] text-orange-500 font-bold">Free</div>
                </div>

                <button 
                  style={styles.searchButton}
                  className="w-full mt-2 !py-3 shadow-lg shadow-orange-200 active:scale-95 transition-all"
                  onClick={() => handleTestClick(test)}
                >
                  Làm bài ngay
                </button>
              </div>
            ))}
          </div>
        </div>
            {/* --- FOOTER SECTION --- */}
        <footer style={styles.footer}>
          <div style={styles.footerGrid} className="flex flex-col md:grid">
            {/* Cột 1: Thông tin chung */}
            <div>
              <span style={styles.footerLogo}>LearnWithMe</span>
              <p style={styles.footerText}>
                Nền tảng luyện thi TOEIC trực tuyến hàng đầu Việt Nam. Chúng tôi giúp bạn chinh phục mục tiêu điểm số một cách thông minh và hiệu quả nhất.
              </p>
              <div className="flex gap-4 mt-4">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all">
                  <Facebook size={18} />
                </div>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all">
                  <Youtube size={18} />
                </div>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all">
                  <Mail size={18} />
                </div>
              </div>
            </div>

            {/* Cột 2: Khám phá */}
            <div>
              <h4 style={styles.footerTitle}>Khám phá</h4>
              <span style={styles.footerLink} className="hover:text-orange-500">Thư viện đề thi</span>
              <span style={styles.footerLink} className="hover:text-orange-500">Lộ trình học</span>
              <span style={styles.footerLink} className="hover:text-orange-500">Thi thử Online</span>
              <span style={styles.footerLink} className="hover:text-orange-500">Bảng xếp hạng</span>
            </div>

            {/* Cột 3: Hỗ trợ */}
            <div>
              <h4 style={styles.footerTitle}>Hỗ trợ</h4>
              <span style={styles.footerLink} className="hover:text-orange-500">Hướng dẫn sử dụng</span>
              <span style={styles.footerLink} className="hover:text-orange-500">Chính sách bảo mật</span>
              <span style={styles.footerLink} className="hover:text-orange-500">Điều khoản dịch vụ</span>
              <span style={styles.footerLink} className="hover:text-orange-500">Câu hỏi thường gặp</span>
            </div>

            {/* Cột 4: Liên hệ */}
            <div>
              <h4 style={styles.footerTitle}>Liên hệ</h4>
              <div className="flex items-center gap-3 text-slate-500 mb-3 text-sm font-medium">
                <Phone size={16} className="text-orange-500" /> 0987.654.321
              </div>
              <div className="flex items-center gap-3 text-slate-500 mb-3 text-sm font-medium">
                <Mail size={16} className="text-orange-500" /> hotro@learnwithme.com
              </div>
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-[11px] text-slate-400">
                Địa chỉ: Hà Đông, Hà Nội.
              </div>
            </div>
          </div>

          {/* Dòng bản quyền dưới cùng */}
          <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-[12px] text-slate-400 font-medium">
            <p>© 2026 LearnWithMe. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-6">
              <span>English (US)</span>
              <span>Tiếng Việt</span>
            </div>
          </div>
        </footer>
        
      </main>
    </div>
  );
};

export default Dashboard;