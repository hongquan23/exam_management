import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, ArrowLeft, ArrowRight } from 'lucide-react';
import Dashboard from './Dashboard';
import SpeakingTests from './Speaking';
import WritingTests from './Writing';
import styles from './styles';
import { getSpeakingTests, getWritingTests, getWritingBySection, getSpeakingBySection, scoreWritingQ1_5, scoreWritingQ6_7, scoreWritingQ8, scoreSpeakingQ1_2, scoreSpeakingQ3_4,  scoreSpeakingQ5_7, scoreSpeakingQ8_10, scoreSpeakingQ11 } from "../api";
import { Search, Star, Eye, Clock, ChevronDown, BookOpen, Crown, TrendingUp, Facebook, Youtube, Mail, Phone } from 'lucide-react';

const skills = [
  { id: 'listening', name: 'Listening', icon: '🎧', color: '#3b82f6', disabled: true },
  { id: 'reading', name: 'Reading', icon: '📖', color: '#10b981', disabled: true },
  { id: 'writing', name: 'Writing', icon: '✍️', color: '#8b5cf6', disabled: false },
  { id: 'speaking', name: 'Speaking', icon: '🎤', color: '#f97316', disabled: false }
];
const mapAPIQuestionToUIFormat = (apiQuestion, skill, part) => {
  const baseQuestion = {
    id: apiQuestion.id,
    part: Number(part),
    ...apiQuestion
  };

  if (skill === 'Speaking') {
    let questionType = '';
    let prepTime = 30;
    let responseTime = 30;

    switch(Number(part)) {
      case 1:
        questionType = 'Read a Short Text Aloud';
        prepTime = 25;
        responseTime = 30;
        break;
      case 2:
        questionType = 'Describe a Photograph';
        prepTime = 30;
        responseTime = 30;
        break;
      case 3:
        questionType = 'Respond to questions';
        prepTime = 15;
        responseTime = 30;
        break;
      case 4:
        questionType = 'Respond using information';
        prepTime = 30;
        responseTime = 30;
        break;
      case 5:
        questionType = 'Express an opinion';
        prepTime = 60;
        responseTime = 60;
        break;
      default:
        questionType = 'Speaking Question';
    }

    const rawImage = apiQuestion.image_url || apiQuestion.image;
    return {
      ...baseQuestion,
      type: questionType,
      prepTime,
      responseTime,
      text: apiQuestion.question || '',
      direction: apiQuestion.direction || '',
      instruction: apiQuestion.direction || apiQuestion.question || '',
      image: rawImage
        ? (rawImage.startsWith('http')
          ? rawImage
          : `http://localhost:8000${rawImage.startsWith('/') ? '' : '/'}${rawImage}`)
        : null,
      image_describe: apiQuestion.image_describe || '',
      information: apiQuestion.information || '',
      sample_answer: apiQuestion.sample_answer || '',
      required_word_1: apiQuestion.required_word_1 || '',
      required_word_2: apiQuestion.required_word_2 || ''
    };
  }

  if (skill === 'Writing') {
    let questionType = '';
    let timeLimit = 120;

    switch(Number(part)) {
      case 1:
        questionType = 'Write a Sentence';
        timeLimit = 90;
        break;
      case 2:
        questionType = 'Respond to a written request';
        timeLimit = 600;
        break;
      case 3:
        questionType = 'Write an opinion essay';
        timeLimit = 600;
        break;
      default:
        questionType = 'Writing Question';
    }

    const rawImage = apiQuestion.image_url || apiQuestion.image;
    return {
      ...baseQuestion,
      type: questionType,
      timeLimit,
      question: apiQuestion.question || '',
      instruction: apiQuestion.question || '',
      passage: apiQuestion.passage || '',
      image: rawImage
        ? (rawImage.startsWith('http')
          ? rawImage
          : `http://localhost:8000${rawImage.startsWith('/') ? '' : '/'}${rawImage}`)
        : null,
      image_describe: apiQuestion.image_describe || '',
      sample_answer: apiQuestion.sample_answer || ''
    };
  }

  return baseQuestion;
};

const ToeicMember = () => {
  const [audioAnswers, setAudioAnswers] = useState({});
  const [audioBlob, setAudioBlob] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestionInSection, setCurrentQuestionInSection] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [answers, setAnswers] = useState({});
  const [examSubView, setExamSubView] = useState("question"); 
  const [submittedQuestion, setSubmittedQuestion] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [speakingTestsData, setSpeakingTestsData] = useState([]);
  const [writingTestsData, setWritingTestsData] = useState([]);
  const allTests = [...speakingTestsData, ...writingTestsData];
  const resetExamState = () => {
    setExamSubView("question");
    setSubmittedQuestion(null);
    setAnswers({});
  };
  const [isScoring, setIsScoring] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioURL, setAudioURL] = useState(null);
  const resetAudio = () => {
  setAudioBlob(null);
  setAudioURL(null);
  setIsRecording(false);
  setMediaRecorder(null);
  setSubmittedQuestion(null);
};
  
  const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
useEffect(() => {

  
  const path = location.pathname;

  if (path === "/member") {
    navigate("/member/dashboard", { replace: true });
    return;
  }

  if (path.endsWith("/dashboard")) setActiveView("dashboard");
  else if (path.endsWith("/speaking")) setActiveView("speaking");
  else if (path.endsWith("/writing")) setActiveView("writing");
  else if (path.endsWith("/exam")) setActiveView("exam");
}, [location.pathname]);

useEffect(() => {
  
  fetchTests();
}, []);
useEffect(() => {
  if (location.pathname.endsWith("/exam")) {
    const savedTest = localStorage.getItem("currentExam");
    if (savedTest) {
      resetExamState();
      const parsed = JSON.parse(savedTest);
      setSelectedTest(parsed);
      setActiveView("exam");
    } else {
      navigate("/member/dashboard");
    }
  }
}, [location.pathname]);
useEffect(() => {
  const q = getCurrentQuestion();
  if (!q) return;

  const saved = audioAnswers[q.id];

  if (saved) {
    setAudioBlob(saved.blob);
    setAudioURL(saved.url);
  } else {
    setAudioBlob(null);
    setAudioURL(null);
  }
}, [currentQuestionInSection, audioAnswers, selectedTest]);
const fetchTests = async () => {
  try {
    // ===== SPEAKING =====
    const speakingRes = await getSpeakingTests();
    const groupedSpeaking = {};
    
    for (const section of speakingRes.data || []) {
      const baseName = section.name?.replace(/\s*-\s*Part\s*\d+\s*$/i, '').trim() || 'Untitled Test';
      
      if (!groupedSpeaking[baseName]) {
        groupedSpeaking[baseName] = {
          id: `speaking-${baseName}`,
          title: baseName,
          name: baseName,
          skill: 'Speaking',
          type: 'TOEIC Bridge',
          duration: section.time_limit || 15,
          views: 0,
          comments: 0,
          sections: [],
          questions: []
        };
      }
      
      try {
        const qRes = await getSpeakingBySection(section.id);
        const part = section.part || parseInt(section.name?.match(/Part\s*(\d+)/i)?.[1]) || 1;
        
        const mappedQuestions = (qRes.data || []).map(q => 
          mapAPIQuestionToUIFormat(q, 'Speaking', part)
        );
        
        groupedSpeaking[baseName].sections.push({
          id: section.id,
          name: section.name,
          title: section.name,
          part: part,
          questions: mappedQuestions
        });
        
        groupedSpeaking[baseName].questions.push(...mappedQuestions);
      } catch (e) {
        console.error('Lỗi load speaking section:', e);
      }
    }

    // ===== WRITING =====
    const writingRes = await getWritingTests();
    const groupedWriting = {};
    
    for (const section of writingRes.data || []) {
      const baseName = section.name?.replace(/\s*-\s*Part\s*\d+\s*$/i, '').trim() || 'Untitled Test';
      
      if (!groupedWriting[baseName]) {
        groupedWriting[baseName] = {
          id: `writing-${baseName}`,
          title: baseName,
          name: baseName,
          skill: 'Writing',
          type: 'TOEIC Bridge',
          duration: section.time_limit || 37,
          views: 0,
          comments: 0,
          sections: [],
          questions: []
        };
      }
      
      try {
        const qRes = await getWritingBySection(section.id);
        const part = section.part || parseInt(section.name?.match(/Part\s*(\d+)/i)?.[1]) || 1;
        
        const mappedQuestions = (qRes.data || []).map(q => 
          mapAPIQuestionToUIFormat(q, 'Writing', part)
        );
        
        groupedWriting[baseName].sections.push({
          id: section.id,
          name: section.name,
          title: section.name,
          part: part,
          questions: mappedQuestions
        });
        
        groupedWriting[baseName].questions.push(...mappedQuestions);
      } catch (e) {
        console.error('Lỗi load writing section:', e);
      }
    }

    setSpeakingTestsData(Object.values(groupedSpeaking));
    setWritingTestsData(Object.values(groupedWriting));
  } catch (err) {
    console.error("Lỗi load test:", err);
    alert('Không thể tải dữ liệu. Vui lòng thử lại!');
  }
};

  useEffect(() => {
    if (activeView === 'exam' && selectedTest) {
      const minutes = selectedTest.duration;
      const seconds = minutes * 60;
      setTimeRemaining(seconds);
      
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [activeView, selectedTest]);

  const startRecording = async (maxDurationSec) => {
    setSubmittedQuestion(null);
    setAudioBlob(null);
    setAudioURL(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Trình duyệt không hỗ trợ ghi âm!');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioURL(url);

        const q = getCurrentQuestion();
        if (q) {
          setAudioAnswers(prev => ({
            ...prev,
            [q.id]: { blob, url }
          }));
        }
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      if (maxDurationSec && maxDurationSec > 0) {
        setTimeout(() => {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }, maxDurationSec * 1000);
      }
    } catch (err) {
      console.error(err);
      alert('Không thể truy cập micro!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  const handleSkillClick = (skill) => {
    if (skill.disabled) {
      alert(`Kỹ năng ${skill.name} đang được phát triển!`);
      return;
    }
    setSelectedSkill(skill.id);
    if (skill.id === "speaking") {
      setActiveView("speaking");
      navigate("/member/speaking");
    }

    if (skill.id === "writing") {
      setActiveView("writing");
      navigate("/member/writing");
    }
  };

  const handleTestClick = (test) => {
    resetExamState();
    setSelectedTest(test);
    localStorage.setItem("currentExam", JSON.stringify(test));
    setCurrentSection(0);
    setCurrentQuestionInSection(0);
    setAnswers({});
    resetAudio();
    setActiveView("exam");
    navigate("/member/exam");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const getCurrentQuestion = () => {
    if (!selectedTest?.questions) return null;
    return selectedTest.questions[currentQuestionInSection];
  };
  const handleNextQuestion = () => {
  if (!selectedTest?.questions) return;

  if (currentQuestionInSection < selectedTest.questions.length - 1) {
    setCurrentQuestionInSection(currentQuestionInSection + 1);
    setExamSubView("question");
    setSubmittedQuestion(null);
  }
};

const handlePrevQuestion = () => {
  if (!selectedTest?.questions) return;

  if (currentQuestionInSection > 0) {
    setCurrentQuestionInSection(currentQuestionInSection - 1);
    setExamSubView("question");
    setSubmittedQuestion(null);
  }
};
const submitSpeaking = async (question) => {
  if (!audioBlob) {
    alert("Bạn chưa ghi âm!");
    return;
  }

  try {
    setIsScoring(true);

    const formData = new FormData();
    formData.append("audio", audioBlob);

    const part = Number(question.part);
    let res = null;

    switch (part) {
      case 1:
        formData.append("reference_text", question.text || "");
        res = await scoreSpeakingQ1_2(formData);
        break;

      case 2:
        formData.append("image_description", question.image_describe || "");
        res = await scoreSpeakingQ3_4(formData);
        break;

      case 3:
        formData.append("question", question.text || "");
        res = await scoreSpeakingQ5_7(formData);
        break;

      case 4:
        formData.append("information", question.information || "");
        formData.append("question", question.text || "");
        res = await scoreSpeakingQ8_10(formData);
        break;

      case 5:
        formData.append("question", question.text || "");
        res = await scoreSpeakingQ11(formData);
        break;

      default:
        alert("Không xác định Part Speaking");
        return;
    }

    if (!res || !res.data) {
      alert("API không trả kết quả!");
      return;
    }

    setSubmittedQuestion({
      question,
      transcript: res.data.transcript || "",
      feedback: res.data.feedback || res.data.evaluation || "",
      audioURL
    });

    setExamSubView("result");

  } catch (err) {
  console.error("API ERROR:", err?.response?.data || err.message || err);
  alert("Lỗi gửi Speaking!");
  } finally {
    setIsScoring(false);
  }
};

 const renderExamQuestion = () => {
   const question = getCurrentQuestion();
   if (!question) return null;
  const savedAudio = audioAnswers[question.id];
    if (!question) return null;

    const isSpeaking = selectedTest.skill === 'Speaking';
    const isWriting = selectedTest.skill === 'Writing';

const renderRecordControls = (responseTime, question) => {
  const savedAudio = audioAnswers[question.id];

  return (
    <>
      <button 
        style={{
          ...styles.recordButton,
          backgroundColor: isRecording ? '#dc2626' : '#ef4444',
          transform: isRecording ? 'scale(1.02)' : 'scale(1)',
        }}
        onClick={() => {
          if (!isRecording) {
            startRecording(responseTime);
          } else {
            stopRecording();
          }
        }}
      >
        {isRecording && (
          <span style={{
            width: '6px',
            height: '6px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            marginRight: '2px',
            display: 'inline-block',
            animation: 'blink 1s infinite'
          }} />
        )}

        <Mic size={14} strokeWidth={2.5} />
        <span>
          {isRecording ? 'DỪNG' : 'THU ÂM'}
        </span>
      </button>

      {savedAudio && (
        <div style={{ marginTop: '16px' }}>
          <audio controls src={savedAudio.url} />
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button
          disabled={!audioBlob || isScoring}
          style={{
            ...styles.submitBtn,
            ...(isScoring ? styles.submitBtnLoading : {}),
            ...((!audioBlob || isScoring) ? styles.submitBtnDisabled : {})
          }}
          onClick={() => submitSpeaking(question)}
        >
          {isScoring && <span style={styles.spinner} />}
          {isScoring ? "AI đang chấm..." : "Nộp câu này"}
        </button>

        {!audioBlob && (
          <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>
            Bạn cần ghi âm trước khi nộp
          </div>
        )}
      </div>
    </>
  );
};
    // Speaking Questions
    if (isSpeaking) {
      if (question.type === 'Read a Short Text Aloud') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Preparation: {question.prepTime}s | Response: {question.responseTime}s
              </div>
            </div>

            {question.direction && (
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', border: '1px solid #3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
                <strong>📝 Sample Answer:</strong>
                <div style={{ marginTop: '6px', whiteSpace: 'pre-line', color: '#166534' }}>{question.sample_answer}</div>
              </div>
            )}
            <div style={styles.questionText}>{question.text}</div>

            {renderRecordControls(question.responseTime, question)}
          </div>
        );
      }

      if (question.type === 'Describe a Photograph') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Preparation: {question.prepTime}s | Response: {question.responseTime}s
              </div>
            </div>

            {question.direction && (
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', border: '1px solid #3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}

            {question.image && question.image.trim() !== '' && (
              <img src={question.image} alt="Question" style={styles.examImage} 
              onError={(e) => console.log("❌ Load ảnh lỗi:", question.image)}/>
            )}

            {question.image_describe && (
              <div style={{ ...styles.questionText, backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', fontSize: '13px', fontStyle: 'italic' }}>
                {question.image_describe}
              </div>
            )}
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
                <strong>📝 Sample Answer:</strong>
                <div style={{ marginTop: '6px', whiteSpace: 'pre-line', color: '#166534' }}>{question.sample_answer}</div>
              </div>
            )}
            {renderRecordControls(question.responseTime, question)}
          </div>
        );
      }
      if (question.type === 'Respond to questions') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Preparation: {question.prepTime}s | Response: {question.responseTime}s
              </div>
            </div>
            {question.direction && (
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', border: '1px solid #3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}
            {question.information && (
              <div style={{ ...styles.questionText, backgroundColor: '#fef3c7', border: '1px solid #fbbf24', marginBottom: '12px' }}>
                <strong>Information:</strong> {question.information}
              </div>
            )}
            <div style={styles.questionText}>{question.text}</div>
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
                <strong>📝 Sample Answer:</strong>
                <div style={{ marginTop: '6px', whiteSpace: 'pre-line', color: '#166534' }}>{question.sample_answer}</div>
              </div>
            )}
            {renderRecordControls(question.responseTime, question)}
          </div>
        );
      }
      if (question.type === 'Respond using information') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Preparation: {question.prepTime}s | Response: {question.responseTime}s
              </div>
            </div>
            {question.direction && (
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', border: '1px solid #3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}
            {question.text && (
              <div style={styles.questionText}>{question.text}</div>
            )}
            {question.information && (
              <div style={{ ...styles.questionText, backgroundColor: '#fef3c7', border: '1px solid #fbbf24', marginBottom: '12px' }}>
                <strong>Information:</strong> {question.information}
              </div>
            )}
            {question.image && question.image.trim() !== '' && (
              <img src={question.image} alt="Question" style={styles.examImage} />
            )}
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
                <strong>📝 Sample Answer:</strong>
                <div style={{ marginTop: '6px', whiteSpace: 'pre-line', color: '#166534' }}>{question.sample_answer}</div>
              </div>
            )}
            {renderRecordControls(question.responseTime, question)}
          </div>
        );
      }

      if (question.type === 'Express an opinion') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Preparation: {question.prepTime}s | Response: {question.responseTime}s
              </div>
            </div>
            {question.direction && (
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', border: '1px solid #3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}
            <div style={styles.questionText}>{question.text}</div>
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
                <strong>📝 Sample Answer:</strong>
                <div style={{ marginTop: '6px', whiteSpace: 'pre-line', color: '#166534' }}>{question.sample_answer}</div>
              </div>
            )}
            {renderRecordControls(question.responseTime, question)}
          </div>
        );
      }
    }
    // Writing Questions
    if (isWriting) {
      if (question.type === 'Write a Sentence') {
        const wordCount = answers[question.id]?.split(' ').filter(w => w).length || 0;

        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Time limit: {question.timeLimit}s
              </div>
            </div>

            <div style={styles.questionText}>{question.instruction}</div>

            {question.image && question.image.trim() !== '' && (
              <img src={question.image} alt="Question" style={styles.examImage} />
            )}

            {question.image_describe && (
              <div style={{ ...styles.questionText, backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', fontSize: '13px', fontStyle: 'italic' }}>
                {question.image_describe}
              </div>
            )}
            {(question.required_word_1 || question.required_word_2) && (
                <div style={{
                  background: "#fef9c3",
                  border: "1px solid #fde047",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  fontSize: "14px"
                }}>
                  <b>Required words:</b>{" "}
                  <span style={{ color: "#92400e", fontWeight: 600 }}>
                    {question.required_word_1}
                  </span>
                  {question.required_word_2 && (
                    <>
                      {" , "}
                      <span style={{ color: "#92400e", fontWeight: 600 }}>
                        {question.required_word_2}
                      </span>
                    </>
                  )}
                </div>
              )}
            <textarea
              style={styles.textarea}
              placeholder="Write your sentence here..."
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            />
            <div style={{ marginTop: '16px' }}>
              <button
                disabled={isScoring}
                style={{
                  ...styles.submitBtn,
                  ...(isScoring ? styles.submitBtnLoading : {}),
                  ...(isScoring ? styles.submitBtnDisabled : {})
                }}
                onClick={async () => {
                  const studentSentence = (answers[question.id] || "").trim();
                  if (!studentSentence) {
                    alert("Bạn chưa nhập câu trả lời!");
                    return;
                  }

                  try {
                    setIsScoring(true);

                    const formData = new URLSearchParams();
                    formData.append("image_description", question.image_describe || "");
                    formData.append("required_word_1", question.required_word_1 || "");
                    formData.append("required_word_2", question.required_word_2 || "");
                    formData.append("student_sentence", studentSentence);

                    const res = await scoreWritingQ1_5(formData);

                    setSubmittedQuestion({
                      question,
                      answer: studentSentence,
                      feedback: res.data.feedback
                    });

                    setExamSubView("result");
                  } catch (err) {
                    console.error(err);
                    alert("Lỗi chấm điểm Writing!");
                  } finally {
                    setIsScoring(false);
                  }
                }}
              >
                {isScoring && <span style={styles.spinner} />}
                {isScoring ? "AI đang chấm..." : "Nộp câu này"}
              </button>
            </div>
            <div style={styles.wordCount}>Word count: {wordCount}</div>
          </div>
          
        );
      }
      if (question.type === 'Respond to a written request') {
        const wordCount = answers[question.id]?.split(' ').filter(w => w).length || 0;
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Time limit: {Math.floor((question.timeLimit || 0) / 60)} minutes
              </div>
            </div>
            {question.passage && (
              <div style={{
                ...styles.questionText,
                backgroundColor: '#eef2ff',
                border: '1px solid #6366f1',
                whiteSpace: 'pre-line'
              }}>
                <strong>Email / Request:</strong>
                <div style={{ marginTop: 6 }}>
                  {question.passage}
                </div>
              </div>
            )}
            <div style={styles.questionText}>{question.instruction || question.question}</div>
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
                <strong>📝 Sample Answer:</strong>
                <div style={{ marginTop: '6px', whiteSpace: 'pre-line', color: '#166534' }}>{question.sample_answer}</div>
              </div>
            )}
            <textarea
              style={{ ...styles.textarea, minHeight: 200, height: 'auto',resize: 'vertical' }}
              placeholder="Write your response here..."
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            />
           <div style={{ marginTop: '16px' }}>
            <button
              disabled={isScoring}
                style={{
                  ...styles.submitBtn,
                  ...(isScoring ? styles.submitBtnLoading : {}),
                  ...(isScoring ? styles.submitBtnDisabled : {})
                }}
              onClick={async () => {
                const studentResponse = (answers[question.id] || "").trim();

                if (!studentResponse) {
                  alert("Bạn chưa nhập câu trả lời!");
                  return;
                }

                try {
                  setIsScoring(true);

                  const formData = new FormData();
                  formData.append("email_prompt", question.passage || "");
                  formData.append("directions", question.instruction || question.question || "");
                  formData.append("student_response", studentResponse);

                  const res = await scoreWritingQ6_7(formData);

                  setSubmittedQuestion({
                    question,
                    answer: studentResponse,
                    feedback: res.data.feedback || res.data
                  });

                  setExamSubView("result");
                } catch (err) {
                  console.error(err);
                  alert("Lỗi chấm điểm Writing Part 2!");
                } finally {
                  setIsScoring(false);
                }
              }}
            >
                {isScoring && <span style={styles.spinner} />}
                {isScoring ? "AI đang chấm..." : "Nộp câu này"}
            </button>
            </div>
            <div style={styles.wordCount}>Word count: {wordCount}</div>
          </div>
          
        );
      }

      if (question.type === 'Write an opinion essay') {
        const wordCount = answers[question.id]?.split(' ').filter(w => w).length || 0;
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Time limit: {Math.floor((question.timeLimit || 0) / 60)} minutes
              </div>
            </div>
            <div style={styles.questionText}>{question.instruction || question.question}</div>
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
                <strong>📝 Sample Answer:</strong>
                <div style={{ marginTop: '6px', whiteSpace: 'pre-line', color: '#166534' }}>{question.sample_answer}</div>
              </div>
            )}
            <textarea
              style={{ ...styles.textarea, minHeight: 200, height: 'auto',resize: 'vertical' }}
              placeholder="Write your essay here..."
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            />
             <div style={{ marginTop: '16px' }}>
              <button
                disabled={isScoring}
                  style={{
                    ...styles.submitBtn,
                    ...(isScoring ? styles.submitBtnLoading : {}),
                    ...(isScoring ? styles.submitBtnDisabled : {})
                  }}
                onClick={async () => {
                  const studentResponse = (answers[question.id] || "").trim();

                  if (!studentResponse) {
                    alert("Bạn chưa nhập bài viết!");
                    return;
                  }

                  try {
                    setIsScoring(true);

                    const formData = new FormData();
                    formData.append("question", question.question || "");
                    formData.append("student_response", studentResponse);

                    const res = await scoreWritingQ8(formData);

                    setSubmittedQuestion({
                      question,
                      feedback: res.data.feedback || res.data.evaluation || "",
                    });

                    setExamSubView("result");
                  } catch (err) {
                    console.error(err);
                    alert("Lỗi chấm điểm Writing Part 3!");
                  } finally {
                    setIsScoring(false);
                  }
                }}
              >
                  {isScoring && <span style={styles.spinner} />}
                  {isScoring ? "AI đang chấm..." : "Nộp câu này"}   
              </button>
            </div>
            <div style={styles.wordCount}>Word count: {wordCount}</div>
          </div>
          
        );
      }
    }

    return null;
  };
  

  const renderExam = () => {
    if (!selectedTest) return null;

    return (
      <div style={styles.testExam}>
        <div style={styles.examHeader}>
          <h1 style={styles.examTitle}>{selectedTest.title}</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={() => {
              resetExamState();   // ⭐ reset trạng thái bài thi
              setSelectedTest(null);
              setCurrentQuestionInSection(0);
              setCurrentSection(0);
              setAudioURL(null);
              setIsRecording(false);

              setActiveView("dashboard");
              navigate("/member/dashboard");
            }}
          >
            Thoát
          </button>
          </div>
        </div>
    <div style={styles.examNav}>
      {(() => {
        const questions = selectedTest.questions || [];
        const groupedByPart = questions.reduce((acc, q, index) => {
          const part = q.part || 1;
          if (!acc[part]) {
            acc[part] = [];
          }
          acc[part].push({ ...q, originalIndex: index });
          return acc;
        }, {});

        return Object.entries(groupedByPart)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([part, partQuestions]) => {
            const firstIdx = partQuestions[0].originalIndex;
            const lastIdx = partQuestions[partQuestions.length - 1].originalIndex;
            const label = partQuestions.length === 1
              ? `Question ${firstIdx + 1}`
              : `Questions ${firstIdx + 1}-${lastIdx + 1}`;

            return (
              <div
                key={part}
                style={{
                  ...styles.navTab,
                  ...(questions[currentQuestionInSection]?.part === Number(part) 
                    ? styles.navTabActive 
                    : {})
                }}
                onClick={() => {
                  setCurrentQuestionInSection(firstIdx);
                  resetExamState();
                  resetAudio();
                }}
              >
                {label}
              </div>
            );
          });
      })()}
    </div>
        <div style={styles.examContent}>
          <div style={styles.examLeft}>
            {examSubView === "question"
              ? renderExamQuestion()
              : renderQuestionResult()
            } 
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'space-between' }}>
              <button
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={handlePrevQuestion}
                disabled={currentSection === 0 && currentQuestionInSection === 0}
              >
                <ArrowLeft size={16} />
                Câu trước
              </button>
              <button
                style={{ ...styles.button, ...styles.buttonPrimary }}
                onClick={handleNextQuestion}
                disabled={
                  currentSection === selectedTest.sections.length - 1 &&
                  currentQuestionInSection === selectedTest.sections[currentSection].questions.length - 1
                }
              >
                Câu sau
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div style={styles.examRight}>
            <div style={styles.timerBox}>
              <div style={styles.timerLabel}>Thời gian còn lại:</div>
              <div style={styles.timerValue}>{timeRemaining ? formatTime(timeRemaining) : '--:--'}</div>
            </div>
          <div style={styles.questionsBox}>
            <div style={styles.questionsTitle}>Danh sách câu hỏi</div>
            
            {(() => {
              const questions = selectedTest.questions || [];
              const groupedByPart = questions.reduce((acc, q, index) => {
                const part = q.part || 1;
                if (!acc[part]) {
                  acc[part] = [];
                }
                acc[part].push({ ...q, originalIndex: index });
                return acc;
              }, {});

              return Object.entries(groupedByPart)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([part, partQuestions]) => (
                  <div key={part} style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '8px',
                      paddingLeft: '4px'
                    }}>
                      {partQuestions.length === 1 
                        ? `Question ${partQuestions[0].originalIndex + 1}`
                        : `Questions ${partQuestions[0].originalIndex + 1}-${partQuestions[partQuestions.length - 1].originalIndex + 1}`
                      }
                    </div>

                    <div style={styles.questionGrid}>
                      {partQuestions.map((q) => (
                        <div
                          key={q.id}
                          style={{
                            ...styles.questionNumber,
                            ...(currentQuestionInSection === q.originalIndex 
                              ? styles.questionNumberActive 
                              : {})
                          }}
                          onClick={() => {
                            setCurrentQuestionInSection(q.originalIndex);
                            resetAudio();
                          }}
                        >
                          {q.originalIndex + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                ));
            })()}
          </div>
            <div style={{ fontSize: '11px', color: '#f97316', textAlign: 'center', padding: '8px' }}>
              Khôi phục/lưu bài làm
              <br />
              Chú ý: Bạn có thể click vào số thứ tự câu hỏi trong bảng để đánh dấu review
            </div>
          </div>
        </div>
      </div>
    );
  };

const renderQuestionResult = () => {
  if (!submittedQuestion) return null;

  const q = submittedQuestion.question;

  return (
    <div style={styles.resultModalOverlay}>
      <div style={styles.resultModal}>
      <button
        onClick={() => {
          setSubmittedQuestion(null);
          setExamSubView("question");
        }}
        style={styles.closeBtn}
      >
        ×
      </button>
        <div style={styles.resultHeader}>
          Đáp án câu {currentQuestionInSection + 1}
        </div>

        {/* Question */}
        <div style={styles.questionText}>
          <b>Câu hỏi:</b> {q.text || q.instruction || q.question}
        </div>

        {/* Audio */}
        {submittedQuestion.audioURL && (
          <div style={styles.resultAudio}>
            <b>Bài làm của bạn:</b>
            <audio controls src={submittedQuestion.audioURL} />
          </div>
        )}

        {/* Transcript */}
        {submittedQuestion.transcript && (
          <div style={styles.resultAIBox}>
            <b>Transcript:</b>
            <div>{submittedQuestion.transcript}</div>
          </div>
        )}

        {/* Writing answer */}
        {submittedQuestion.answer && (
          <div style={styles.resultAIBox}>
            <b>Bài viết của bạn:</b>
            <div style={{ whiteSpace: "pre-line" }}>
              {submittedQuestion.answer}
            </div>
          </div>
        )}

        {/* AI feedback */}
        {submittedQuestion.feedback && (
          <div style={styles.resultAIBox}>
            <b>Nhận xét AI:</b>
            <div style={{ whiteSpace: "pre-line" }}>
              {typeof submittedQuestion.feedback === "object"
                ? JSON.stringify(submittedQuestion.feedback, null, 2)
                : submittedQuestion.feedback}
            </div>
          </div>
        )}

        <div style={styles.resultActions}>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={() => setExamSubView("question")}
          >
            Quay lại
          </button>

          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={handleNextQuestion}
          >
            Làm câu tiếp theo
          </button>
        </div>
      </div>
    </div>
  );
};

  if (activeView === 'dashboard') {
    return (
      <Dashboard
        styles={styles}
        skills={skills}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        handleSkillClick={handleSkillClick}
        handleLogout={handleLogout}
        hoveredSkill={hoveredSkill}
        setHoveredSkill={setHoveredSkill}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
        allTests={allTests}
        handleTestClick={handleTestClick}
      />
    );
  }

  if (activeView === 'speaking') {
    return (
      <SpeakingTests
        styles={styles}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
        speakingTests={speakingTestsData}
        setActiveView={setActiveView}
        handleTestClick={handleTestClick}
      />
    );
  }

  if (activeView === 'writing') {
    return (
      <WritingTests
        styles={styles}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
        writingTests={writingTestsData}
        setActiveView={setActiveView}
        handleTestClick={handleTestClick}
      />
    );
  }

  if (activeView === 'exam') {
    return renderExam();
  }

  return null;
};

export default ToeicMember;