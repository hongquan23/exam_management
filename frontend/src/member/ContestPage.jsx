import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Play, Ticket, Users, FileText, Smile } from "lucide-react"; // Cài lucide-react để có icon đẹp
import InfoModal from "./InfoModal";

const ContestPage = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a192f] text-white font-sans">
      
      {/* 1. NÚT QUAY LẠI - Thiết kế Glassmorphism hiện đại */}
      <button
        onClick={() => navigate(-1)}
        className="absolute z-30 top-8 left-8 flex items-center gap-2 
        bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 
        transition-all duration-300 px-5 py-2.5 rounded-2xl shadow-2xl group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Quay lại</span>
      </button>

      {/* BACKGROUND DECORATION (Các quầng sáng mờ tạo chiều sâu) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[40%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid md:grid-cols-2 min-h-screen relative z-10">
        
        {/* 2. CỘT BÊN TRÁI - Nội dung chính */}
        <div className="flex items-center px-12 lg:px-24 py-20 bg-gradient-to-br from-blue-900/40 to-transparent">
          <div className="max-w-xl animate-fade-in-up">
            
            {/* TAG THỜI GIAN */}
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-blue-200 mb-8 shadow-inner">
              <Calendar size={16} />
              Đăng ký mở đến <span className="text-white ml-1">31/03/2026</span>
            </div>

            {/* TIÊU ĐỀ - Typography mạnh mẽ */}
            <h1 className="text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              English <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Contest 2026
              </span>
            </h1>

            {/* MÔ TẢ */}
            <p className="text-xl text-blue-100/80 mb-10 leading-relaxed">
              Cuộc thi tiếng Anh toàn quốc kiến tạo tương lai. 
              Hãy sẵn sàng tỏa sáng và chinh phục những giải thưởng giá trị nhất!
            </p>

            {/* NÚT BẤM (CTA) */}
            <div className="flex flex-wrap gap-5 mb-12">
              <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 px-8 py-4 rounded-2xl font-bold shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)] transition-all hover:scale-105 active:scale-95">
                <Ticket size={20} />
                Register Now
              </button>

              <button
                onClick={() => setShowInfo(true)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-semibold transition-all"
              >
                <Play size={18} fill="white" />
                Xem thông tin
              </button>
            </div>

            {/* THỐNG KÊ (STATS) - Layout chia ngăn tinh tế */}
            <div className="grid grid-cols-3 gap-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-1 overflow-hidden w-full max-w-md shadow-2xl">
              <div className="py-6 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
                <Users size={20} className="text-blue-400 mb-2" />
                <h3 className="text-2xl font-bold">12,480</h3>
                <p className="text-[12px] uppercase tracking-wider text-blue-300/60 font-medium">Thí sinh</p>
              </div>

              <div className="py-6 flex flex-col items-center justify-center border-x border-white/10 hover:bg-white/5 transition-colors">
                <FileText size={20} className="text-blue-400 mb-2" />
                
                <p className="text-[12px] uppercase tracking-wider text-blue-300/60 font-medium">Đề thi sáng tạo</p>
              </div>

              <div className="py-6 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
                <Smile size={20} className="text-blue-400 mb-2" />
                <h3 className="text-2xl font-bold">98%</h3>
                <p className="text-[12px] uppercase tracking-wider text-blue-300/60 font-medium">Hài lòng</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CỘT BÊN PHẢI - Hình ảnh học sinh (Layout 3D ẩn hiện) */}
        <div className="relative h-screen hidden md:flex items-center justify-center p-12">
          {/* Một khung ảnh bo cong mềm mại với viền phát sáng */}
          <div className="relative w-full h-[85%] rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent z-10" />
            <img
              src="https://haycafe.vn/wp-content/uploads/2022/04/Hinh-nen-anh-quyet-tam-on-thi-cute.jpg"
              alt="Students learning"
              className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
            />
            {/* Overlay text nhẹ trên ảnh nếu cần */}
            <div className="absolute bottom-10 left-10 z-20">
              <p className="text-white/70 italic text-lg font-light">"Education is the most powerful weapon..."</p>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL */}
      <InfoModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
      />

    </div>
  );
};

export default ContestPage;