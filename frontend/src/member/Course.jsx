import React, { useState } from "react";
import { Search, BookOpen, Star, Clock, Globe, Filter, ChevronRight, PlayCircle, Sparkles } from "lucide-react";

const englishCourses = [
  {
    id: 1,
    title: "IELTS Breakthrough: 7.5+ Masterclass",
    level: "Advanced",
    image: "https://down-vn.img.susercontent.com/file/sg-11134201-22120-tom8vbdj51kvc1",
    price: "$99.99",
    rating: "4.9",
    students: "8.5k",
    duration: "45h",
    tag: "Exam Prep"
  },
  {
    id: 2,
    title: "Business English for Professionals",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    price: "$59.99",
    rating: "4.8",
    students: "12k",
    duration: "30h",
    tag: "Business"
  },
  {
    id: 3,
    title: "English Pronunciation & Accent Training",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    price: "Free",
    rating: "4.7",
    students: "25k",
    duration: "12h",
    tag: "Speaking"
  },
  {
    id: 4,
    title: "TOEIC 900+: Intensive Training",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
    price: "$45.00",
    rating: "4.9",
    students: "5.2k",
    duration: "60h",
    tag: "Exam Prep"
  },
];

const Course = () => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-200 font-sans pb-20 selection:bg-blue-500/30">
      
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden bg-slate-900 py-16 px-6 border-b border-white/5">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 rounded-full">
            <Sparkles size={12} /> The Future of Learning
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
            LÀM CHỦ TIẾNG ANH, MỞ RA THẾ GIỚI. 
          </h1>
          <p className="text-base text-slate-400 mb-8 max-w-xl mx-auto">
            Học tiếng Anh theo lộ trình chuẩn quốc tế. Tự tin chinh phục chứng chỉ và giao tiếp như người bản xứ ngay hôm nay.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* SIDEBAR - Nhỏ gọn hơn */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-800/80 backdrop-blur-2xl border border-white/10 rounded-[24px] p-6 sticky top-6 shadow-2xl">
              <h2 className="text-white font-black text-[10px] tracking-[0.2em] mb-6 flex items-center gap-2">
                <Filter size={14} className="text-blue-400" /> BỘ LỌC
              </h2>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Tìm khóa học..."
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:border-blue-500 outline-none text-xs"
                />
              </div>
              <div className="space-y-4">
                {["IELTS", "TOEIC", "Speaking"].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600" />
                    <span className="text-xs font-medium text-slate-400 group-hover:text-blue-400 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* COURSE LIST - Chuyển sang grid 3 cột */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Khóa học Hot</h2>
              <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
                {["All", "Free", "Pro"].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {englishCourses.map((course) => (
                <div key={course.id} className="group bg-slate-800/30 border border-white/5 rounded-[24px] overflow-hidden hover:bg-slate-800/50 transition-all duration-300 hover:translate-y-[-5px]">
                  {/* Image - Giảm chiều cao */}
                  <div className="relative h-44 overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-blue-600/90 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {course.tag}
                    </div>
                  </div>

                  {/* Content - Thu nhỏ padding và font */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                      <span className="flex items-center gap-1"><Globe size={12} /> {course.level}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-snug h-12 line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-6 text-[10px]">
                        <div className="flex items-center gap-0.5 text-yellow-500">
                          <Star size={12} fill="currentColor" />
                          <span className="font-bold">{course.rating}</span>
                        </div>
                        <span className="text-slate-500">({course.students})</span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                      <span className="text-lg font-black text-white">{course.price}</span>
                      <button className="bg-white text-slate-950 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1">
                        JOIN <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Course;