import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Mail, Lock, ShieldCheck, Camera, Save,
} from "lucide-react";

const Profile = ({ currentUser }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser?.name || "Người dùng");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateName = () => alert("Tên mới: " + name);
  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) { alert("Mật khẩu xác nhận không khớp"); return; }
    alert("Đã cập nhật mật khẩu");
  };

  return (
    <div
      className="min-h-screen bg-[#0a192f] text-white flex justify-center items-start pt-12 px-4 pb-12 relative overflow-hidden"
      style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(37,99,235,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(79,70,229,0.15) 0%, transparent 40%)" }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center"
           style={{ backgroundImage: "url('https://cdn.bhdw.net/im/landscape-minimalist-wallpaper-81021_w635.webp')" }} />

      <div className="w-full max-w-5xl relative z-10">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)}
            className="group flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 px-5 py-2.5 rounded-2xl transition-all">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Tài khoản</h1>
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Avatar card */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <div className="relative inline-block mb-6">
                <img src="https://i.pravatar.cc/150" alt="avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/10 shadow-xl group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full border-4 border-[#0a192f] hover:bg-blue-600 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-1">{currentUser?.name || name}</h2>
              <p className="text-blue-300/60 text-sm mb-6 flex items-center justify-center gap-2">
                <Mail size={14} /> {currentUser?.email || "user@example.com"}
              </p>
              <div className="pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Thành viên từ</span>
                  <span className="text-white/80">Tháng 03, 2026</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Vai trò</span>
                  <span className="text-blue-400 font-medium">Thí sinh</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Profile content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Thông tin cơ bản */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><User size={20} /></div>
                <h3 className="text-xl font-bold">Thông tin cơ bản</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold ml-1">Họ và Tên</label>
                  <div className="relative">
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10"
                      placeholder="Nhập tên của bạn" />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold ml-1">Địa chỉ Email</label>
                  <div className="relative">
                    <input type="email" value={currentUser?.email || ""} disabled
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 pl-12 text-white/30 cursor-not-allowed outline-none" />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                  </div>
                </div>
              </div>
              <button onClick={handleUpdateName}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Save size={18} /> Lưu thay đổi
              </button>
            </div>

            {/* Bảo mật */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><Lock size={20} /></div>
                <h3 className="text-xl font-bold">Bảo mật tài khoản</h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white/50 text-xs uppercase tracking-widest font-bold ml-1">Mật khẩu mới</label>
                    <div className="relative">
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 focus:border-rose-500/50 outline-none transition-all focus:bg-white/10"
                        placeholder="••••••••" />
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/50 text-xs uppercase tracking-widest font-bold ml-1">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 focus:border-rose-500/50 outline-none transition-all focus:bg-white/10"
                        placeholder="••••••••" />
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    </div>
                  </div>
                </div>
                <button onClick={handleUpdatePassword}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold py-4 px-10 rounded-2xl transition-all active:scale-[0.98]">
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
