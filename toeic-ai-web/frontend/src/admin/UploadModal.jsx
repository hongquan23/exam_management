import React, { useState, useRef } from 'react';
import { Image } from 'lucide-react';

const UploadModal = ({ styles, setShowUploadModal }) => {
  const [form, setForm] = useState({
    title: '',
    skill: 'Speaking',
    duration: '',
    part: 1,
    descriptionMain: '',
    descriptionExtra: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('image')) {
      setImageFile(file);
    } else {
      alert('Vui lòng chọn file ảnh (JPG/PNG)');
    }
  };

  const handleSave = () => {
    if (!form.title || !form.duration || !form.descriptionMain) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const payload = {
      title: form.title,
      skill: form.skill,
      duration: Number(form.duration),
      part: Number(form.part),
      descriptionMain: form.descriptionMain,
      descriptionExtra: form.descriptionExtra,
      imageFile
    };

    console.log('UPLOAD PAYLOAD:', payload);

    alert('Lưu đề thi thành công (mock frontend)');
    setShowUploadModal(false);
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <button
          style={styles.closeButton}
          onClick={() => setShowUploadModal(false)}
        >
          ×
        </button>

        <h2 style={styles.modalTitle}>Upload Đề Thi Mới</h2>

        {/* Tên đề */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Tên đề thi</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            style={styles.inputField}
            placeholder="VD: TOEIC Speaking Part 2"
          />
        </div>

        {/* Kỹ năng */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Kỹ năng</label>
          <select
            name="skill"
            value={form.skill}
            onChange={handleChange}
            style={styles.inputField}
          >
            <option>Speaking</option>
            <option>Writing</option>
          </select>
        </div>

        {/* Thời gian + Part */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Thời gian (phút)</label>
            <input
              name="duration"
              type="number"
              value={form.duration}
              onChange={handleChange}
              style={styles.inputField}
              placeholder="15"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Question</label>
            <select
              name="Question"
              value={form.part}
              onChange={handleChange}
              style={styles.inputField}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(p => (
                <option key={p} value={p}>Question {p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Đề bài chính */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Đề bài</label>
          <textarea
            name="descriptionMain"
            value={form.descriptionMain}
            onChange={handleChange}
            rows={3}
            style={{ ...styles.inputField, resize: 'none' }}
            placeholder="Nhập nội dung đề bài chính..."
          />
        </div>

        {/* Đề bài phụ */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Mô tả đề bài</label>
          <textarea
            name="descriptionExtra"
            value={form.descriptionExtra}
            onChange={handleChange}
            rows={2}
            style={{ ...styles.inputField, resize: 'none' }}
            placeholder="Ví dụ: You have 45 seconds to prepare..."
          />
        </div>

        {/* Upload ảnh */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload ảnh (nếu có)</label>
          <div
            style={styles.uploadArea}
            onClick={() => imageInputRef.current.click()}
          >
            <Image size={28} />
            <p>{imageFile ? imageFile.name : 'Click để chọn ảnh hoặc kéo thả'}</p>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />
        </div>

        {/* Buttons */}
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
