import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Mail, Lock, ShieldCheck, Camera, Save, CheckCircle, XCircle,
} from "lucide-react";
import { changePassword } from "../api";

const card = {
  background: "white",
  borderRadius: 24,
  padding: 32,
  boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
  position: "relative",
  overflow: "hidden",
};

const inputWrap = { position: "relative" };

const inputStyle = {
  width: "100%",
  background: "#f8fafc",
  border: "1.5px solid #e2e8f0",
  borderRadius: 14,
  padding: "14px 16px 14px 44px",
  fontSize: 16,
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#475569",
  marginBottom: 8,
  marginLeft: 4,
};

const iconStyle = {
  position: "absolute",
  left: 14,
  top: "50%",
  transform: "translateY(-50%)",
  color: "#64748b",
  pointerEvents: "none",
};

const Profile = ({ currentUser }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser?.name || "Người dùng");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

  const handleUpdateName = () => alert("Tên mới: " + name);

  const handleUpdatePassword = async () => {
    setPwMsg(null);
    if (!currentPassword) { setPwMsg({ type: "error", text: "Vui lòng nhập mật khẩu hiện tại" }); return; }
    if (!newPassword) { setPwMsg({ type: "error", text: "Vui lòng nhập mật khẩu mới" }); return; }
    if (newPassword !== confirmPassword) { setPwMsg({ type: "error", text: "Mật khẩu xác nhận không khớp" }); return; }
    if (newPassword.length < 6) { setPwMsg({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự" }); return; }

    setPwLoading(true);
    try {
      await changePassword(currentUser.id, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPwMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail === "Current password incorrect") {
        setPwMsg({ type: "error", text: "Mật khẩu hiện tại không đúng" });
      } else {
        setPwMsg({ type: "error", text: detail || "Có lỗi xảy ra, vui lòng thử lại" });
      }
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f1f5f9",
      fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
      color: "#0f172a",
      padding: "48px 16px",
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>

        {/* TOP BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "white", border: "1.5px solid #e2e8f0",
              borderRadius: 14, padding: "10px 20px",
              color: "#1e293b", fontWeight: 600, fontSize: 14,
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "white"}
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>Tài khoản</h1>
          <div style={{ width: 96 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}
             className="profile-grid">

          {/* LEFT: Avatar card */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={card}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 4,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }} />
              <div style={{ textAlign: "center", paddingTop: 8 }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
                  <img
                    src="https://i.pravatar.cc/150"
                    alt="avatar"
                    style={{ width: 112, height: 112, borderRadius: "50%", objectFit: "cover", border: "3px solid #e2e8f0" }}
                  />
                  <button style={{
                    position: "absolute", bottom: 0, right: 0,
                    padding: 7, background: "#6366f1", borderRadius: "50%",
                    border: "3px solid #f1f5f9", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Camera size={14} color="white" />
                  </button>
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                  {currentUser?.name || name}
                </h2>
                <p style={{ fontSize: 14, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 24 }}>
                  <Mail size={13} /> {currentUser?.email || "user@example.com"}
                </p>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "#475569" }}>Thành viên từ</span>
                    <span style={{ color: "#1e293b", fontWeight: 600 }}>Tháng 03, 2026</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "#475569" }}>Vai trò</span>
                    <span style={{ color: "#6366f1", fontWeight: 700 }}>Thí sinh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Profile content */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Thông tin cơ bản */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div style={{ padding: 8, background: "#ede9fe", borderRadius: 10 }}>
                  <User size={18} color="#6366f1" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Thông tin cơ bản</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}
                   className="info-grid">
                <div>
                  <label style={labelStyle}>Họ và Tên</label>
                  <div style={inputWrap}>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      style={inputStyle}
                      placeholder="Nhập tên của bạn"
                      onFocus={e => e.target.style.borderColor = "#6366f1"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                    <User style={iconStyle} size={16} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Địa chỉ Email</label>
                  <div style={inputWrap}>
                    <input
                      type="email"
                      value={currentUser?.email || ""}
                      disabled
                      style={{ ...inputStyle, background: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed" }}
                    />
                    <Mail style={iconStyle} size={16} />
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpdateName}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white", fontWeight: 700, fontSize: 15,
                  padding: "12px 28px", borderRadius: 14, border: "none",
                  cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <Save size={16} /> Lưu thay đổi
              </button>
            </div>

            {/* Bảo mật */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div style={{ padding: 8, background: "#fee2e2", borderRadius: 10 }}>
                  <Lock size={18} color="#ef4444" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Bảo mật tài khoản</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Mật khẩu hiện tại</label>
                  <div style={inputWrap}>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      style={inputStyle}
                      placeholder="••••••••"
                      onFocus={e => e.target.style.borderColor = "#ef4444"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                    <Lock style={iconStyle} size={16} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
                     className="pw-grid">
                  <div>
                    <label style={labelStyle}>Mật khẩu mới</label>
                    <div style={inputWrap}>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="••••••••"
                        onFocus={e => e.target.style.borderColor = "#ef4444"}
                        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                      />
                      <ShieldCheck style={iconStyle} size={16} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Xác nhận mật khẩu mới</label>
                    <div style={inputWrap}>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="••••••••"
                        onFocus={e => e.target.style.borderColor = "#ef4444"}
                        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                      />
                      <ShieldCheck style={iconStyle} size={16} />
                    </div>
                  </div>
                </div>

                {pwMsg && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "12px 16px", borderRadius: 12, fontSize: 14, fontWeight: 500,
                    ...(pwMsg.type === "success"
                      ? { background: "#f0fdf4", border: "1.5px solid #bbf7d0", color: "#16a34a" }
                      : { background: "#fff1f2", border: "1.5px solid #fecdd3", color: "#dc2626" }),
                  }}>
                    {pwMsg.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {pwMsg.text}
                  </div>
                )}

                <div>
                  <button
                    onClick={handleUpdatePassword}
                    disabled={pwLoading}
                    style={{
                      background: pwLoading ? "#f1f5f9" : "white",
                      border: "1.5px solid #e2e8f0",
                      color: pwLoading ? "#94a3b8" : "#0f172a",
                      fontWeight: 700, fontSize: 15,
                      padding: "12px 28px", borderRadius: 14,
                      cursor: pwLoading ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { if (!pwLoading) e.currentTarget.style.background = "#f8fafc"; }}
                    onMouseLeave={e => { if (!pwLoading) e.currentTarget.style.background = "white"; }}
                  >
                    {pwLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
          .profile-grid > div { grid-column: span 1 !important; }
          .info-grid, .pw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
