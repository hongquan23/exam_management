import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, ArrowLeft, ArrowRight } from 'lucide-react';
import Dashboard from './Dashboard';
import SpeakingTests from './Speaking';
import WritingTests from './Writing';
import styles from './styles';
import { getSpeakingTests, getWritingTests, getWritingBySection, getSpeakingBySection } from "../api";
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
        questionType = 'Propose a solution';
        prepTime = 60;
        responseTime = 60;
        break;
      case 6:
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
      sample_answer: apiQuestion.sample_answer || ''
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

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioURL, setAudioURL] = useState(null);
  
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
      const parsed = JSON.parse(savedTest);
      setSelectedTest(parsed);
      setActiveView("exam");
    } else {
      navigate("/member/dashboard");
    }
  }
}, []);
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
        setAudioChunks(chunks);
        setAudioURL(url);
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
    setSelectedTest(test);
    localStorage.setItem("currentExam", JSON.stringify(test));
    setCurrentSection(0);
    setCurrentQuestionInSection(0);
    setAnswers({});
    setAudioURL(null);
    setIsRecording(false);
    setActiveView("exam");
    navigate("/member/exam");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const getCurrentQuestion = () => {
    if (!selectedTest) return null;
    return selectedTest.questions[currentQuestionInSection];
  };
  const handleNextQuestion = () => {
  if (!selectedTest?.questions) return;

  if (currentQuestionInSection < selectedTest.questions.length - 1) {
    setCurrentQuestionInSection(currentQuestionInSection + 1);
  }

  setAudioURL(null);
  setIsRecording(false);
};

const handlePrevQuestion = () => {
  if (!selectedTest?.questions) return;

  if (currentQuestionInSection > 0) {
    setCurrentQuestionInSection(currentQuestionInSection - 1);
  }

  setAudioURL(null);
  setIsRecording(false);
};

 const renderExamQuestion = () => {
    const question = getCurrentQuestion();
    if (!question) return null;

    const isSpeaking = selectedTest.skill === 'Speaking';
    const isWriting = selectedTest.skill === 'Writing';

    const renderRecordControls = (responseTime, question) => (
      <>
       <button 
  style={{
    ...styles.recordButton,
    backgroundColor: isRecording ? '#dc2626' : '#ef4444',
    // Hiệu ứng scale nhẹ hơn khi ghi âm cho nút nhỏ
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
  {/* Chấm tròn nhỏ khi đang ghi âm */}
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
  
  <Mic size={14} strokeWidth={2.5} /> {/* Giảm Mic xuống size 14 */}
  <span>
    {isRecording ? 'DỪNG' : 'THU ÂM'}
  </span>
</button>

        {audioURL && (
          <div style={{ marginTop: '16px' }}>
            <audio controls src={audioURL} />
          </div>
        )}

        {/* ✅ NÚT NỘP CÂU SPEAKING */}
        <div style={{ marginTop: '20px' }}>
          <button
            style={styles.submitButton}
            disabled={!audioURL}
            onClick={() => {
              setSubmittedQuestion({
                question,
                answer: audioURL   // speaking dùng audio
              });
              setExamSubView("result");
            }}
          >
            Nộp câu này
          </button>

          {!audioURL && (
            <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>
              Bạn cần ghi âm trước khi nộp
            </div>
          )}
        </div>
      </>
    );
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
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', borderColor: '#3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
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
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', borderColor: '#3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}

            {question.image && question.image.trim() !== '' && (
              <img src={question.image} alt="Question" style={styles.examImage} 
              onError={(e) => console.log("❌ Load ảnh lỗi:", question.image)}/>
            )}
            {console.log("👉 IMAGE URL FE:", question.image)}

            {question.image_describe && (
              <div style={{ ...styles.questionText, backgroundColor: '#f3f4f6', borderColor: '#d1d5db', fontSize: '13px', fontStyle: 'italic' }}>
                {question.image_describe}
              </div>
            )}
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
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
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', borderColor: '#3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}
            {question.information && (
              <div style={{ ...styles.questionText, backgroundColor: '#fef3c7', borderColor: '#fbbf24', marginBottom: '12px' }}>
                <strong>Information:</strong> {question.information}
              </div>
            )}
            <div style={styles.questionText}>{question.text}</div>
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
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
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', borderColor: '#3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}
            {question.text && (
              <div style={styles.questionText}>{question.text}</div>
            )}
            {question.information && (
              <div style={{ ...styles.questionText, backgroundColor: '#fef3c7', borderColor: '#fbbf24', marginBottom: '12px' }}>
                <strong>Information:</strong> {question.information}
              </div>
            )}
            {question.image && question.image.trim() !== '' && (
              <img src={question.image} alt="Question" style={styles.examImage} />
            )}
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
                <strong>📝 Sample Answer:</strong>
                <div style={{ marginTop: '6px', whiteSpace: 'pre-line', color: '#166534' }}>{question.sample_answer}</div>
              </div>
            )}
            {renderRecordControls(question.responseTime, question)}
          </div>
        );
      }

      if (question.type === 'Propose a solution') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Preparation: {question.prepTime}s | Response: {question.responseTime}s
              </div>
            </div>
            {question.direction && (
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', borderColor: '#3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}
            <div style={styles.questionText}>{question.text}</div>
            {question.information && (
              <div style={{ ...styles.questionText, backgroundColor: '#fef3c7', borderColor: '#fbbf24' }}>
                <strong>Information:</strong> {question.information}
              </div>
            )}
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
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
              <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', borderColor: '#3b82f6', marginBottom: '12px' }}>
                <strong>Direction:</strong> {question.direction}
              </div>
            )}
            <div style={styles.questionText}>{question.text}</div>
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
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
              <div style={{ ...styles.questionText, backgroundColor: '#f3f4f6', borderColor: '#d1d5db', fontSize: '13px', fontStyle: 'italic' }}>
                {question.image_describe}
              </div>
            )}
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
                <strong>📝 Sample Answer:</strong>
                <div style={{ marginTop: '6px', whiteSpace: 'pre-line', color: '#166534' }}>{question.sample_answer}</div>
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
                style={styles.submitButton}
                onClick={() => {
                  setSubmittedQuestion({
                    question: question,
                    answer: answers[question.id] || ""
                  });
                  setExamSubView("result");
                }}
              >
                Nộp câu này
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
            <div style={styles.questionText}>{question.instruction || question.question}</div>
            {question.sample_answer && (
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
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
                style={styles.submitButton}
                onClick={() => {
                  setSubmittedQuestion({
                    question: question,
                    answer: answers[question.id] || ""
                  });
                  setExamSubView("result");
                }}
              >
                Nộp câu này
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
              <div style={{ ...styles.questionText, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
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
                style={styles.submitButton}
                onClick={() => {
                  setSubmittedQuestion({
                    question: question,
                    answer: answers[question.id] || ""
                  });
                  setExamSubView("result");
                }}
              >
                Nộp câu này
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
                  setAudioURL(null);
                  setIsRecording(false);
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
                            setAudioURL(null);
                            setIsRecording(false);
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

  const { question, answer } = submittedQuestion;

  return (
    <div style={styles.resultOverlay}>
      <div style={styles.resultModal}>
        
        <div style={styles.resultHeader}>
          Kết quả
        </div>

        <div style={styles.resultBody}>
          <p><b>Câu hỏi:</b></p>
          <p>{question?.prompt || question?.type || '—'}</p>
          <p style={{ marginTop: '12px' }}><b>Bài làm của bạn:</b></p>
          {typeof answer === "string" && answer.startsWith("blob:") ? (
              <audio controls src={answer} />
            ) : (
              <p>{answer || <i>Chưa nhập</i>}</p>
            )}
          <p style={{ marginTop: '12px' }}><b>AI nhận xét:</b></p>
          <div style={styles.aiBox}>
            (Sẽ chấm bằng AI backend)
          </div>
        </div>

        <div style={styles.resultFooter}>
          <button
            style={styles.secondaryBtn}
            onClick={() => setExamSubView("question")}
          >
            Quay lại
          </button>

          <button
            style={styles.primaryBtn}
            onClick={() => {
              setExamSubView("question");
              setSubmittedQuestion(null)
              handleNextQuestion();
            }}
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