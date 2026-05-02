import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Mail, Lock, ShieldCheck, Camera, Save,
  ClipboardList, ChevronRight, CheckCircle, XCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { getAttemptHistory, getSessionDetail } from "../api";

const SKILL_LABEL = {
  listening: "🎧 Listening",
  reading: "📖 Reading",
  speaking: "🎤 Speaking",
  writing: "✍️ Writing",
};

const SKILL_COLOR = {
  listening: "text-blue-400 bg-blue-500/20",
  reading: "text-emerald-400 bg-emerald-500/20",
  speaking: "text-orange-400 bg-orange-500/20",
  writing: "text-purple-400 bg-purple-500/20",
};

const scoreColor = (p) => p >= 80 ? "#4ade80" : p >= 60 ? "#fbbf24" : "#f87171";
const scoreLabel = (p) => p >= 80 ? "Xuất sắc" : p >= 60 ? "Khá" : "Cần cố gắng";

// ── Session Detail Modal ──────────────────────────────────────────────────────
const SessionDetail = ({ session, userId, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getSessionDetail(userId, session.section_id, session.attempted_at)
      .then(res => setItems(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dt = new Date(session.attempted_at);
  const dateStr = dt.toLocaleDateString("vi-VN");
  const timeStr = dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4"
         style={{ backgroundColor: "rgba(0,0,0,0.7)", overflowY: "auto" }}>
      <div className="w-full max-w-2xl bg-[#0f2744] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{session.section_name}</h3>
            <p className="text-sm text-white/40 mt-1">{dateStr} lúc {timeStr}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-black" style={{ color: scoreColor(session.percent) }}>
                {session.score}/{session.total}
              </div>
              <div className="text-xs font-bold" style={{ color: scoreColor(session.percent) }}>
                {session.percent}% · {scoreLabel(session.percent)}
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all text-xl font-bold">
              ×
            </button>
          </div>
        </div>

        {/* Score bar */}
        <div className="px-6 py-3 bg-white/5">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{
              width: `${session.percent}%`,
              backgroundColor: scoreColor(session.percent)
            }} />
          </div>
        </div>

        {/* Questions */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-white/40">Đang tải chi tiết...</div>
          )}
          {!loading && items.length === 0 && (
            <div className="p-8 text-center text-white/40">Không có dữ liệu chi tiết.</div>
          )}
          {!loading && items.map((item, idx) => {
            const isOpen = expanded === idx;
            const opts = [
              { k: "A", v: item.option_a },
              { k: "B", v: item.option_b },
              { k: "C", v: item.option_c },
              { k: "D", v: item.option_d },
            ].filter(o => o.v);

            return (
              <div key={idx} className="border-b border-white/5">
                {/* Row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : idx)}
                  className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  {item.is_correct
                    ? <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                    : <XCircle size={18} className="text-red-400 flex-shrink-0" />
                  }
                  <span className="text-white/40 text-sm font-bold w-6 flex-shrink-0">
                    {item.question_number || idx + 1}
                  </span>
                  <span className="flex-1 text-sm text-white/80 line-clamp-1">
                    {item.question || `Câu ${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.is_correct ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {item.user_ans || "—"}
                    </span>
                    {!item.is_correct && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                        ✓ {item.correct_answer}
                      </span>
                    )}
                    {isOpen ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="px-6 pb-4 bg-white/5">
                    {item.passage && (
                      <div className="mb-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200 whitespace-pre-line">
                        <strong className="block mb-1 text-blue-300">Transcript:</strong>
                        {item.passage}
                      </div>
                    )}
                    {item.audio_url && (
                      <audio controls src={item.audio_url} className="w-full mb-3 rounded-lg" />
                    )}
                    {item.question && (
                      <p className="text-sm text-white/70 mb-3">{item.question}</p>
                    )}
                    <div className="flex flex-col gap-2">
                      {opts.map(opt => {
                        const isUser = item.user_ans === opt.k;
                        const isCorrect = item.correct_answer === opt.k;
                        let cls = "border-white/10 bg-white/5 text-white/50";
                        if (isCorrect) cls = "border-green-500/50 bg-green-500/10 text-green-300";
                        else if (isUser) cls = "border-red-500/50 bg-red-500/10 text-red-300";
                        return (
                          <div key={opt.k} className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${cls}`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                              ${isCorrect ? "bg-green-500 text-white" : isUser ? "bg-red-500 text-white" : "bg-white/10 text-white/40"}`}>
                              {opt.k}
                            </span>
                            <span className="text-sm">{opt.v}</span>
                            {isCorrect && <span className="ml-auto text-xs font-bold text-green-400">✓ Đúng</span>}
                            {isUser && !isCorrect && <span className="ml-auto text-xs font-bold text-red-400">✗ Bạn chọn</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── History Tab ───────────────────────────────────────────────────────────────
const HistoryTab = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!userId) return;
    getAttemptHistory(userId)
      .then(res => setHistory(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-white/40">Đang tải lịch sử...</div>
  );

  if (history.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="text-5xl">📋</div>
      <p className="text-white/40 font-medium">Chưa có lịch sử làm bài.</p>
      <p className="text-white/30 text-sm">Hoàn thành một bài Listening / Reading để xem tại đây.</p>
    </div>
  );

  return (
    <>
      {selected && (
        <SessionDetail
          session={selected}
          userId={userId}
          onClose={() => setSelected(null)}
        />
      )}

      <div className="space-y-3">
        {history.map((h, idx) => {
          const dt = new Date(h.attempted_at);
          const skillCls = SKILL_COLOR[h.skill] || "text-white/50 bg-white/10";
          return (
            <div
              key={idx}
              onClick={() => setSelected(h)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all group"
            >
              {/* Score circle */}
              <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                   style={{ backgroundColor: `${scoreColor(h.percent)}20`, border: `1.5px solid ${scoreColor(h.percent)}40` }}>
                <span className="text-lg font-black leading-none" style={{ color: scoreColor(h.percent) }}>
                  {h.percent}
                </span>
                <span className="text-[9px] font-bold text-white/30">%</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${skillCls}`}>
                    {SKILL_LABEL[h.skill] || h.skill}
                  </span>
                </div>
                <p className="text-sm font-bold text-white/80 truncate">{h.section_name}</p>
                <p className="text-xs text-white/30 mt-0.5">
                  {dt.toLocaleDateString("vi-VN")} lúc {dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  {" · "}{h.score}/{h.total} câu đúng
                </p>
              </div>

              <ChevronRight size={16} className="text-white/20 group-hover:text-white/50 flex-shrink-0 transition-colors" />
            </div>
          );
        })}
      </div>
    </>
  );
};

// ── Profile Page ──────────────────────────────────────────────────────────────
const Profile = ({ currentUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(currentUser?.name || "Người dùng");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userId = Number(localStorage.getItem("user_id"));

  const handleUpdateName = () => alert("Tên mới: " + name);
  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) { alert("Mật khẩu xác nhận không khớp"); return; }
    alert("Đã cập nhật mật khẩu");
  };

  const tabs = [
    { id: "profile", label: "Hồ sơ cá nhân", icon: <User size={15} /> },
    { id: "history", label: "Lịch sử làm bài", icon: <ClipboardList size={15} /> },
  ];

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
          <div className="lg:col-span-1 space-y-6">
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

            {/* Tab switcher */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left
                    ${activeTab === tab.id
                      ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Tab content */}
          <div className="lg:col-span-2">

            {/* ── Tab: Hồ sơ ── */}
            {activeTab === "profile" && (
              <div className="space-y-8">
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
            )}

            {/* ── Tab: Lịch sử ── */}
            {activeTab === "history" && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <ClipboardList size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Lịch sử làm bài</h3>
                </div>
                <HistoryTab userId={userId} />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
