import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

const UploadModal = ({ styles, setShowUploadModal }) => {
  const [audioFile, setAudioFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes("audio")) {
      setAudioFile(file);
    } else {
      alert("Vui lòng chọn file audio định dạng MP3/WAV!");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.includes("audio")) {
      setAudioFile(file);
    } else {
      alert("File không hợp lệ! Vui lòng chọn file audio MP3/WAV.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSave = () => {
    if (!audioFile) {
      alert("Chưa chọn file audio!");
      return;
    }

    // FRONTEND MOCK - Chưa gửi backend
    alert(`Đã chọn file: ${audioFile.name}`);
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Upload Đề Thi Mới</h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tên đề thi</label>
          <input type="text" style={styles.inputField} placeholder="VD: TOEIC Full Test 2024" />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Loại đề thi </label>
          <select style={styles.inputField}>
            <option>TOEIC</option>
            <option>TOEIC SW</option>
            <option>IELTS General</option>
            <option>IELTS Academic</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Kĩ năng</label>
          <select style={styles.inputField}>
            <option>Listening</option>
            <option>Reading</option>
            <option>Writing</option>
            <option>Speaking</option>
            <option>Full Test</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Thời gian (phút)</label>
            <input type="number" style={styles.inputField} placeholder="120" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Số câu hỏi</label>
            <input type="number" style={styles.inputField} placeholder="200" />
          </div>
        </div>

        {/* --- FILE UPLOAD AREA --- */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload file audio (MP3)</label>

          <div
            style={styles.uploadArea}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <Upload size={32} color="#9ca3af" />
            {audioFile ? (
              <p style={{ marginTop: '12px', color: '#059669', fontSize: '14px', fontWeight: 'bold' }}>
                {audioFile.name}
              </p>
            ) : (
              <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '14px' }}>
                Click để chọn file hoặc kéo thả vào đây
              </p>
            )}
          </div>

          {/* hidden file input */}
          <input
            type="file"
            accept="audio/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>

        <div style={styles.modalButtons}>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={() => setShowUploadModal(false)}
          >
            Huỷ
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={handleSave}
          >
            Lưu đề thi
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
