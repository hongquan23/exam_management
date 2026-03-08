import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ currentUser }) => {
    const navigate = useNavigate();
  const [name, setName] = useState(currentUser?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateName = () => {
    alert("Tên mới: " + name);
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    alert("Đã cập nhật mật khẩu");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-start pt-16"
      style={{
        backgroundImage:
          "url('https://cdn.bhdw.net/im/landscape-minimalist-wallpaper-81021_w635.webp')",
      }}
    >
      <div className="w-full max-w-4xl">
         <button
    onClick={() => navigate(-1)}
    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
  >
    ← Quay lại
  </button>
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          Hồ sơ cá nhân
        </h1>

        {/* User Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6 mb-8">
          
          <img
            src="https://i.pravatar.cc/120"
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover"
          />

          <div>
            <p className="text-gray-500 text-sm">Tên</p>
            <p className="text-lg font-semibold">{currentUser?.name}</p>

            <p className="text-gray-500 text-sm mt-2">Email</p>
            <p className="text-lg font-semibold">{currentUser?.email}</p>
          </div>

        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Edit Name */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Chỉnh sửa thông tin
            </h2>

            <label className="text-gray-600 text-sm">
              Đổi Tên
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1 mb-4"
            />

            <button
              onClick={handleUpdateName}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Lưu Tên Mới
            </button>
          </div>

          {/* Change Password */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Đổi mật khẩu
            </h2>

            <label className="text-gray-600 text-sm">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1 mb-3"
            />

            <label className="text-gray-600 text-sm">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1 mb-3"
            />

            <label className="text-gray-600 text-sm">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1 mb-4"
            />

            <button
              onClick={handleUpdatePassword}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Cập nhật Mật khẩu
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;