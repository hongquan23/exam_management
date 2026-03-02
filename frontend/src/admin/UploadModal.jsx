import React, { useState, useRef, useEffect } from 'react';
import { Image } from 'lucide-react';
import { createSection, createWritingQuestion, createSpeakingQuestion } from '../api';

const TOEIC_PARTS = {
  Speaking: [
    { value: 1, label: 'Part 1 - Read aloud' },
    { value: 2, label: 'Part 2 - Describe a picture' },
    { value: 3, label: 'Part 3 - Respond to questions' },
    { value: 4, label: 'Part 4 - Respond using information' },
    { value: 5, label: 'Part 5 - Express an opinion' }
  ],
  Writing: [
    { value: 1, label: 'Part 1 - Write a sentence based on a picture' },
    { value: 2, label: 'Part 2 - Respond to a written request' },
    { value: 3, label: 'Part 3 - Write an opinion essay' }
  ]
};

const getVisibleFields = (skill, part) => {
  if (skill === 'Writing') {
    if (part === 1) return ['question', 'image', 'image_describe', 'required_word_1', 'required_word_2'];
    if (part === 2) return ['passage', 'question', 'sample_answer'];
    if (part === 3) return ['question', 'sample_answer'];
    return ['question'];
  }

  if (skill === 'Speaking') {
    switch (part) {
      case 1: return ['direction', 'question', 'sample_answer'];
      case 2: return ['direction', 'image', 'image_describe', 'sample_answer'];
      case 3: return ['direction', 'question', 'information', 'sample_answer'];
      case 4: return ['direction', 'question', 'information', 'image', 'sample_answer'];
      case 5: return ['direction', 'question', 'sample_answer'];
      default: return [];
    }
  }
  return [];
};

const UploadModal = ({ styles, setShowUploadModal, selectedSkill, onUploaded }) => {
  const [form, setForm] = useState({
    title: '',
    skill: 'Speaking',
    part: 1,
    duration: '',
    direction: '',
    question: '',
    passage: '',
    information: '',
    image_describe: '',
    sample_answer: '',
    required_word_1: '',
    required_word_2: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);

  const [sectionsByPart, setSectionsByPart] = useState({});
  const sectionsByPartRef = useRef({});

  useEffect(() => {
    if (selectedSkill) {
      setForm(prev => ({ ...prev, skill: selectedSkill, part: 1 }));
      setImageFile(null);
      sectionsByPartRef.current = {};
      setSectionsByPart({});
    }
  }, [selectedSkill]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('image')) setImageFile(file);
    else alert('Vui lòng chọn file ảnh (JPG/PNG)');
  };

  const getOrCreateSectionForPart = async (part) => {
    const partNum = Number(part);
    if (sectionsByPartRef.current[partNum]) return sectionsByPartRef.current[partNum];

    const sectionPayload = {
      skill: form.skill.toLowerCase(),
      time_limit: Number(form.duration),
      name: `${form.title} - Part ${partNum}`,
      part: partNum
    };

    const sectionRes = await createSection(sectionPayload);
    const sectionId = sectionRes.data.id;

    sectionsByPartRef.current[partNum] = sectionId;
    setSectionsByPart(prev => ({ ...prev, [partNum]: sectionId }));
    return sectionId;
  };

  const uploadQuestion = async () => {
    const currentPart = Number(form.part);
    const sectionId = await getOrCreateSectionForPart(currentPart);

    const fd = new FormData();
    fd.append('section_id', sectionId);
    fd.append('part', String(form.part));
    fd.append('question', form.question || '');
    fd.append('passage', form.passage || '');
    fd.append('direction', form.direction || '');
    fd.append('information', form.information || '');
    fd.append('sample_answer', form.sample_answer || '');
    fd.append('image_describe', form.image_describe || '');
    fd.append('required_word_1', form.required_word_1 || '');
    fd.append('required_word_2', form.required_word_2 || '');

    if (imageFile) fd.append('image', imageFile);

    if (form.skill === 'Speaking') {
      await createSpeakingQuestion(fd);
    } else {
      await createWritingQuestion(fd);
    }
  };

  const resetQuestionFields = () => {
    setForm(prev => ({
      ...prev,
      direction: '',
      question: '',
      passage: '',
      information: '',
      image_describe: '',
      sample_answer: '',
      required_word_1: '',
      required_word_2: ''
    }));
    setImageFile(null);
  };

  const handleSaveAndContinue = async () => {
    if (!form.title || !form.duration) {
      alert('Vui lòng nhập Tên đề và Thời gian!');
      return;
    }
    try {
      await uploadQuestion();
      alert('Đã lưu câu hỏi! Nhập câu tiếp theo');
      resetQuestionFields();
      onUploaded?.();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload thất bại! Kiểm tra console.');
    }
  };

  const handleFinishPart = async () => {
    if (!form.title || !form.duration) {
      alert('Vui lòng nhập Tên đề và Thời gian!');
      return;
    }
    try {
      await uploadQuestion();
      alert(`Đã hoàn tất Part ${form.part}!`);
      resetQuestionFields();
      onUploaded?.();
    } catch (err) {
      console.error('Finish part error:', err);
      alert('Lưu part thất bại!');
    }
  };

  const visibleFields = getVisibleFields(form.skill, Number(form.part));

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <button style={styles.closeButton} onClick={() => setShowUploadModal(false)}>×</button>
        <h2 style={styles.modalTitle}>Upload Đề TOEIC</h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>Title</label>
          <input name="title" value={form.title} onChange={handleChange} style={styles.inputField} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Skill</label>
          <select name="skill" value={form.skill} onChange={handleChange} style={styles.inputField}>
            <option>Speaking</option>
            <option>Writing</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Part TOEIC</label>
          <select name="part" value={form.part} onChange={handleChange} style={styles.inputField}>
            {TOEIC_PARTS[form.skill].map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Time (minutes)</label>
          <input type="number" name="duration" value={form.duration} onChange={handleChange} style={styles.inputField} />
        </div>

        {visibleFields.includes('direction') && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Direction</label>
            <textarea name="direction" value={form.direction} onChange={handleChange} style={styles.inputField} />
          </div>
        )}
        {visibleFields.includes('passage') && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Passage / Email</label>
            <textarea
              name="passage"
              value={form.passage || ''}
              onChange={handleChange}
              style={styles.inputField}
            />
          </div>
        )}

        {visibleFields.includes('question') && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Question</label>
            <textarea name="question" value={form.question || ''} onChange={handleChange} style={styles.inputField} />
          </div>
        )}

        {visibleFields.includes('information') && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Information</label>
            <textarea name="information" value={form.information || ''} onChange={handleChange} style={styles.inputField} />
          </div>
        )}

        {visibleFields.includes('sample_answer') && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Sample Answer</label>
            <textarea name="sample_answer" value={form.sample_answer} onChange={handleChange} style={styles.inputField} />
          </div>
        )}

        {visibleFields.includes('required_word_1') && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Required word 1</label>
            <input name="required_word_1" value={form.required_word_1} onChange={handleChange} style={styles.inputField} />
          </div>
        )}

        {visibleFields.includes('required_word_2') && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Required word 2</label>
            <input name="required_word_2" value={form.required_word_2} onChange={handleChange} style={styles.inputField} />
          </div>
        )}

        {visibleFields.includes('image') && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Upload image</label>
            <div style={styles.uploadArea} onClick={() => imageInputRef.current.click()}>
              <Image size={24} />
              <p>{imageFile ? imageFile.name : 'Click để chọn ảnh'}</p>
            </div>
            <input type="file" accept="image/*" ref={imageInputRef} style={{ display: 'none' }} onChange={handleImageSelect} />
          </div>
        )}

        {visibleFields.includes('image_describe') && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Describe image</label>
            <textarea name="image_describe" value={form.image_describe || ''} onChange={handleChange} style={styles.inputField} />
          </div>
        )}

        <div style={styles.modalButtons}>
          <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={handleFinishPart}>
            Hoàn tất Part {form.part}
          </button>
          <button style={{ ...styles.button, ...styles.buttonPrimary }} onClick={handleSaveAndContinue}>
            Lưu & Thêm câu tiếp
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
