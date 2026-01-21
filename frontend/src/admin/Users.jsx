import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

const Users = ({ styles, mockUsers, handleTabChange, handleDeleteUser }) => {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          style={{ ...styles.button, ...styles.buttonSecondary, padding: '10px 16px' }}
          onClick={() => handleTabChange('dashboard')}
        >
          ← Quay lại
        </button>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>
          Quản lý người dùng
        </h1>
      </div>

      <div style={styles.usersTable}>
        <div style={styles.tableHeader}>
          <div>ID</div>
          <div>Tên</div>
          <div>Email</div>
          <div>Ngày đăng ký</div>
        </div>

        {mockUsers.map(user => (
          <div key={user.id} style={styles.tableRow}>
            <div>#{user.id}</div>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{user.registeredDate}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Users;
