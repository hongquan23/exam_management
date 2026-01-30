import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Users = ({ styles, mockUsers, handleTabChange, handleDeleteUser }) => {
  const navigate = useNavigate();
  return (
    <>
      {/* ===== HEADER ===== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <button
          style={{
            ...styles.button,
            ...styles.buttonSecondary,
            padding: '10px 16px'
          }}
          onClick={() => navigate('/admin/dashboard')}
        >
          ← Quay lại
        </button>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}
        >
          Quản lý người dùng
        </h1>
      </div>

      {/* ===== TABLE ===== */}
      <div style={styles.usersTable}>
        {/* TABLE HEADER */}
        <div
          style={{
            ...styles.tableHeader,
            display: 'grid',
            gridTemplateColumns: '100px 2fr 3fr 2fr 180px',
            alignItems: 'center'
          }}
        >
          <div>ID</div>
          <div>Tên</div>
          <div>Email</div>
          <div>Ngày đăng ký</div>
          <div style={{ textAlign: 'center' }}>Hành động</div>
        </div>

        {/* TABLE ROWS */}
        {mockUsers.map((user) => (
          <div
            key={user.id}
            style={{
              ...styles.tableRow,
              display: 'grid',
              gridTemplateColumns: '100px 2fr 3fr 2fr 180px',
              alignItems: 'center'
            }}
          >
            <div>#{user.id}</div>

            <div style={{ fontWeight: 600 }}>
              {user.name}
            </div>

            <div style={{ color: '#2563eb' }}>
              {user.email}
            </div>

            <div>{user.registeredDate}</div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px'
              }}
            >
              <Eye
                size={22}
                color="#2563eb"
                style={{ cursor: 'pointer' }}
                title="Xem chi tiết"
              />

              <Trash2
                size={22}
                color="#dc2626"
                style={{ cursor: 'pointer' }}
                title="Xoá người dùng"
                onClick={() => handleDeleteUser && handleDeleteUser(user.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Users;
