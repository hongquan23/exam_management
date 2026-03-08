import React from "react";
import { useNavigate } from "react-router-dom";

const ContestPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center py-20"
      style={{
        backgroundImage:
          "url('https://cdn.bhdw.net/im/landscape-minimalist-wallpaper-81021_w635.webp')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-10 max-w-5xl w-full">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-8">
          CUỘC THI TIẾNG ANH TOÀN QUỐC
        </h1>

        {/* BANNER */}
        <div className="bg-gradient-to-r from-blue-700 to-green-500 text-white rounded-2xl p-6 flex items-center justify-between mb-10">
          <div className="text-xl font-bold">
            CHINH PHỤC TIẾNG ANH -<br/> MỞ KHÓA TƯƠNG LAI
          </div>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            className="w-24"
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* RULE */}
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <h3 className="font-bold mb-3">THỂ LỆ CUỘC THI</h3>

            <p className="text-sm text-gray-600 mb-3">
              - Đối tượng: Học sinh, Sinh viên
              <br/>
              - Đăng ký: Trước 15/11/2024
              <br/>
              - Lệ phí: Miễn phí
            </p>

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              ĐĂNG KÝ NGAY
            </button>
          </div>

          {/* DEADLINE */}
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <h3 className="font-bold mb-4">HẠN CHÓT NỘP BÀI</h3>

            <p className="text-lg font-bold text-gray-700">
              VÒNG 1: 30/11/2024
            </p>
          </div>

          {/* RANK */}
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <h3 className="font-bold mb-3">BẢNG XẾP HẠNG</h3>

            <p className="text-sm">
              1. Nguyen Van A – 98 pts
              <br/>
              2. Tran Thi B – 96 pts
              <br/>
              3. Le Van C – 94 pts
            </p>

            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
              XEM CHI TIẾT
            </button>
          </div>

          {/* DOC */}
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <h3 className="font-bold mb-3">TÀI LIỆU ÔN TẬP</h3>

            <p className="text-sm text-blue-600 underline">
              Ngữ pháp nâng cao
            </p>

            <p className="text-sm text-blue-600 underline">
              Luyện nghe TOEIC
            </p>

            <p className="text-sm text-blue-600 underline">
              Bài thi mẫu
            </p>

            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
              TẢI TÀI LIỆU
            </button>
          </div>

        </div>

        {/* BACK */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Quay lại
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContestPage;