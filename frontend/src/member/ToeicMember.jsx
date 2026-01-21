import React, { useState, useEffect } from 'react';
import { Mic, ArrowLeft, ArrowRight } from 'lucide-react';
import Dashboard from './Dashboard';
import SpeakingTests from './Speaking';
import WritingTests from './Writing';


// ====== DATA & UI TỪ ORIGINAL CODE ======
const speakingTests = [
  {
    id: 1,
    title: 'TOEIC Bridge Speaking Test - Sample',
    duration: 15,
    views: 12300,
    comments: 45,
    questions: 8,
    type: 'TOEIC Bridge',
    skill: 'Speaking',
    rating: 4.8,
    sections: [
      {
        id: 'q1-2',
        name: 'Questions 1-2',
        title: 'Read a Short Text Aloud',
        questions: [
          {
            id: 1,
            type: 'Read a Short Text Aloud',
            prepTime: 25,
            responseTime: 30,
            text: "And now it's time for the local weather report. It will be warm and sunny on Wednesday, Thursday, and Friday. However, we expect it to rain all day on Saturday. So don't forget to take your umbrella!"
          },
          {
            id: 2,
            type: 'Read a Short Text Aloud',
            prepTime: 25,
            responseTime: 30,
            text: 'Thank you for coming to this class on watercolor painting. Before we start, please go to the back of the room to pick up your supplies. There should be enough brushes, paper, and paint for everyone.'
          }
        ]
      },
      {
        id: 'q3-4',
        name: 'Questions 3-4',
        title: 'Describe a Photograph',
        questions: [
          {
            id: 3,
            type: 'Describe a Photograph',
            prepTime: 30,
            responseTime: 30,
            instruction: 'Look at the picture on your screen. Describe where the people are and what they are doing. Provide as much detail as you can.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop'
          },
          {
            id: 4,
            type: 'Describe a Photograph',
            prepTime: 30,
            responseTime: 30,
            instruction: 'Look at the picture on your screen. Describe where the people are and what they are doing. Provide as much detail as you can.',
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop'
          }
        ]
      },
      {
        id: 'q5',
        name: 'Question 5',
        title: 'Listen and Retell',
        questions: [
          {
            id: 5,
            type: 'Listen and Retell',
            prepTime: 15,
            responseTime: 30,
            context: "You are at a staff meeting. The company president makes an announcement.",
            audio: "To begin today's staff meeting, I'd like to give you some updates about the office move we're planning. We've found a very convenient new building right in the center of the city. We plan to move at the end of the month. Let me say that again: the new office building we've found is more centrally located. The move is scheduled to take place at the end of this month.",
            task: 'Your coworker was late to the meeting. Tell your coworker what the company president said.'
          }
        ]
      },
      {
        id: 'q6',
        name: 'Question 6',
        title: 'Short Interaction',
        questions: [
          {
            id: 6,
            type: 'Short Interaction',
            prepTime: 30,
            responseTime: 30,
            scenario: "You have been invited to Carla's party, but you lost the invitation.",
            task: 'Leave a voice message for Carla. Ask her two questions about the party based on your notes below.',
            notes: ['Time?', 'Address?']
          }
        ]
      },
      {
        id: 'q7',
        name: 'Question 7',
        title: 'Tell a Story',
        questions: [
          {
            id: 7,
            type: 'Tell a Story',
            prepTime: 45,
            responseTime: 60,
            instruction: 'The four pictures below illustrate a story. In your own words, tell the story. Your story should explain what happens in the pictures and why. You can describe places, people, actions, and feelings.',
            images: [
              'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=300&h=200&fit=crop'
            ]
          }
        ]
      },
      {
        id: 'q8',
        name: 'Question 8',
        title: 'Make and Support a Recommendation',
        questions: [
          {
            id: 8,
            type: 'Make and Support a Recommendation',
            prepTime: 60,
            responseTime: 60,
            scenario: 'Your friend Liz is looking for an apartment to rent. She has asked for your advice. You found the two options below.',
            task: '• Tell Liz about the two options using ALL of the information provided\n• Recommend one of the options, and\n• Explain why the option you chose is better than the other',
            options: [
              { name: 'Apartment A', rent: '$800/month', bedrooms: 2, location: 'Near downtown' },
              { name: 'Apartment B', rent: '$650/month', bedrooms: 1, location: 'Suburban area' }
            ]
          }
        ]
      }
    ]
  }
];


const writingTests = [
  {
    id: 2,
    title: 'TOEIC Bridge Writing Test - Sample',
    duration: 37,
    views: 8900,
    comments: 32,
    questions: 9,
    type: 'TOEIC Bridge',
    skill: 'Writing',
    rating: 4.7,
    sections: [
      {
        id: 'q1-3',
        name: 'Questions 1-3',
        title: 'Build a Sentence',
        questions: [
          {
            id: 1,
            type: 'Build a Sentence',
            timeLimit: 60,
            prompt: 'What',
            words: ['movies', 'kinds', 'of', 'do', 'like', 'you']
          },
          {
            id: 2,
            type: 'Build a Sentence',
            timeLimit: 60,
            prompt: 'There is',
            words: ['Mr. Scott', 'late', 'traffic', 'so', 'will', 'be', 'a lot of']
          },
          {
            id: 3,
            type: 'Build a Sentence',
            timeLimit: 60,
            prompt: 'What',
            words: ['about', 'you', 'a new', 'do', 'think', 'copy machine', 'ordering']
          }
        ]
      },
      {
        id: 'q4-6',
        name: 'Questions 4-6',
        title: 'Write a Sentence',
        questions: [
          {
            id: 4,
            type: 'Write a Sentence',
            timeLimit: 90,
            instruction: 'Write ONE sentence based on the picture. Use the TWO words or phrases under the picture. You can change the forms of the words and you can use them in any order.',
            image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=350&fit=crop',
            words: ['woman', 'clean']
          },
          {
            id: 5,
            type: 'Write a Sentence',
            timeLimit: 90,
            instruction: 'Write ONE sentence based on the picture. Use the TWO words or phrases under the picture.',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=350&fit=crop',
            words: ['go', 'stairs']
          },
          {
            id: 6,
            type: 'Write a Sentence',
            timeLimit: 90,
            instruction: 'Write ONE sentence based on the picture. Use the TWO words or phrases under the picture.',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=350&fit=crop',
            words: ['phone', 'and']
          }
        ]
      },
      {
        id: 'q7',
        name: 'Question 7',
        title: 'Respond to a Brief Message',
        questions: [
          {
            id: 7,
            type: 'Respond to a Brief Message',
            timeLimit: 480,
            message: 'Hi! I want to cook something special for dinner tonight. Do you have any suggestions?',
            from: 'Chris',
            tasks: ['• Suggest one dish you like, and', '• Briefly explain to Chris how to make it']
          }
        ]
      },
      {
        id: 'q8',
        name: 'Question 8',
        title: 'Write a Narrative',
        questions: [
          {
            id: 8,
            type: 'Write a Narrative',
            timeLimit: 600,
            instruction: 'Write a short blog post about a problem you solved. Tell a story about it, including what the problem was and how you solved it.\n\nIn your story, you can describe people, places, actions, and feelings.',
            note: 'Write as much as you can in the time provided.'
          }
        ]
      },
      {
        id: 'q9',
        name: 'Question 9',
        title: 'Respond to an Extended Message',
        questions: [
          {
            id: 9,
            type: 'Respond to an Extended Message',
            timeLimit: 600,
            email: {
              to: 'You',
              from: 'psorani@RPEmployers.com',
              subject: 'Survey about jobs',
              body: "Hello,\n\nThank you for agreeing to answer some questions I have for an article I'm writing about jobs and work.\n\nFirst, at what age do people in your country usually begin to work, and at what age do they typically retire?\n\nAlso, what types of training or education do you think people will need to get well-paid jobs in the future? Why?\n\nThank you in advance for your comments.\n\nPamela Sorani"
            },
            instruction: "Respond to this e-mail from Pamela Sorani. In your response, be sure to answer all of Pamela's questions."
          }
        ]
      }
    ]
  }
];
const skills = [
  { id: 'listening', name: 'Listening', icon: '🎧', color: '#3b82f6', count: 45, disabled: true },
  { id: 'reading', name: 'Reading', icon: '📖', color: '#10b981', count: 52, disabled: true },
  { id: 'writing', name: 'Writing', icon: '✍️', color: '#8b5cf6', count: 12, disabled: false },
  { id: 'speaking', name: 'Speaking', icon: '🎤', color: '#f97316', count: 15, disabled: false }
];
const allTests = [...speakingTests, ...writingTests];

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#dbeafe',
    padding: '16px 32px',
    borderBottom: '2px solid #a7f3d0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer'
  },
  logo: {
    width: '48px',
    height: '48px',
    backgroundColor: '#10b981',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
    transition: 'all 0.2s ease'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#10b981',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease',
    margin: 0
  },
  headerButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  buttonPrimary: {
    backgroundColor: '#10b981',
    color: 'white',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
  },
  buttonSecondary: {
    backgroundColor: 'white',
    color: '#10b981',
    border: '2px solid #10b981'
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    cursor: 'pointer'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
    backgroundColor: '#f9fafb'
  },
searchContainer: {
  display: 'flex',
  alignItems: 'center',
  maxWidth: '900px',
  marginBottom: '32px'
},

searchWrapper: {
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  border: '2px solid #10b981',
  borderRadius: '999px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
},

searchBar: {
  flex: 1,
  border: 'none',
  padding: '14px 20px 14px 50px',
  fontSize: '15px',
  outline: 'none',
  color: '#374151'
},

searchIcon: {
  position: 'absolute',
  left: '18px',
  color: '#10b981'
},

searchButton: {
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  padding: '14px 32px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  borderRadius: '0 999px 999px 0',
  transition: 'all 0.2s ease'
},

  skillsSection: {
    marginBottom: '48px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },
  skillCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid #e5e7eb',
    position: 'relative'
  },
  skillCardDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  skillCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    borderColor: '#10b981'
  },
  skillIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px'
  },
  skillName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px'
  },
  skillCount: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  },
  testsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },
  testCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease',
    padding: '16px'
  },
  testCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
  },
  testTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    minHeight: '48px'
  },
  testMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  testTags: {
    display: 'flex',
    gap: '4px',
    marginBottom: '12px'
  },
  tag: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600'
  },
  tagBlue: {
    backgroundColor: '#dbeafe',
    color: '#10b981'
  },
  tagPurple: {
    backgroundColor: '#f3e8ff',
    color: '#065f46'
  },
  testExam: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f9fafb',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column'
  },
  examHeader: {
    backgroundColor: 'white',
    padding: '16px 32px',
    borderBottom: '2px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  examTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: 0
  },
  examNav: {
    backgroundColor: 'white',
    padding: '16px 32px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    gap: '16px',
    overflowX: 'auto'
  },
  navTab: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    backgroundColor: '#f3f4f6',
    color: '#6b7280'
  },
  navTabActive: {
    backgroundColor: '#dbeafe',
    color: '#10b981',
    fontWeight: '600'
  },
  examContent: {
    flex: 1,
    display: 'flex',
    gap: '24px',
    padding: '32px',
    overflowY: 'auto'
  },
  examLeft: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  examRight: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  timerBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  timerLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  timerValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#10b981'
  },
  questionsBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  questionsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px'
  },
  questionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '16px'
  },
  questionNumber: {
    padding: '8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: '1px solid #e5e7eb'
  },
  questionNumberActive: {
    backgroundColor: '#dbeafe',
    color: '#065f46',
    borderColor: '#10b981'
  },
  questionContent: {
    marginBottom: '32px'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  questionType: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  questionText: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    fontSize: '15px',
    lineHeight: '1.8',
    color: '#374151',
    marginBottom: '20px',
    border: '1px solid #e5e7eb',
    whiteSpace: 'pre-line'
  },
  recordButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#374151',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#374151',
    outline: 'none',
    fontFamily: 'inherit'
  },
  wordCount: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '8px'
  },
  examImage: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '20px'
  },
  imageCaption: {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '20px',
    fontStyle: 'italic'
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: '8px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    padding: '8px',
    minWidth: '200px',
    zIndex: 1000
  },
  dropdownItem: {
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'background 0.2s ease'
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '8px 0'
  },
  badge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#fbbf24',
    color: '#92400e',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  wordBox: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#e0e7ff',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    margin: '4px',
    cursor: 'move',
    userSelect: 'none'
  },
  sentenceBuilder: {
    minHeight: '60px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    marginBottom: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px'
  },
  emailBox: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #e5e7eb'
  },
  emailHeader: {
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb'
  },
  emailLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginRight: '8px'
  },
  emailValue: {
    fontSize: '14px',
    color: '#111827',
    fontWeight: '500'
  }
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
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioURL, setAudioURL] = useState(null);
  
  const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    if (skill.id === "speaking") setActiveView("speaking");
    if (skill.id === "writing") setActiveView("writing");
  };

  const handleTestClick = (test) => {
    setSelectedTest(test);
    setCurrentSection(0);
    setCurrentQuestionInSection(0);
    setAnswers({});
    setAudioURL(null);
    setIsRecording(false);
    setActiveView('exam');
  };

  const handleLogout = () => {
    alert('Đăng xuất thành công!');
  };

  const getCurrentQuestion = () => {
    if (!selectedTest) return null;
    const section = selectedTest.sections[currentSection];
    return section?.questions[currentQuestionInSection];
  };

  const handleNextQuestion = () => {
    const section = selectedTest.sections[currentSection];
    if (currentQuestionInSection < section.questions.length - 1) {
      setCurrentQuestionInSection(currentQuestionInSection + 1);
    } else if (currentSection < selectedTest.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestionInSection(0);
    }
    setAudioURL(null);
    setIsRecording(false);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionInSection > 0) {
      setCurrentQuestionInSection(currentQuestionInSection - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      const prevSection = selectedTest.sections[currentSection - 1];
      setCurrentQuestionInSection(prevSection.questions.length - 1);
    }
    setAudioURL(null);
    setIsRecording(false);
  };

 const renderExamQuestion = () => {
    const question = getCurrentQuestion();
    if (!question) return null;

    const isSpeaking = selectedTest.skill === 'Speaking';
    const isWriting = selectedTest.skill === 'Writing';

    const renderRecordControls = (responseTime) => (
      <>
        <button 
          style={{
            ...styles.recordButton,
            backgroundColor: isRecording ? '#dc2626' : '#ef4444'
          }}
          onClick={() => {
            if (!isRecording) {
              startRecording(responseTime);
            } else {
              stopRecording();
            }
          }}
        >
          <Mic size={18} />
          {isRecording ? 'DỪNG GHI' : 'THU ÂM'}
        </button>

        {audioURL && (
          <div style={{ marginTop: '16px' }}>
            <audio controls src={audioURL} />
          </div>
        )}
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

            <div style={styles.questionText}>{question.text}</div>

            {renderRecordControls(question.responseTime)}
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

            <div style={styles.questionText}>{question.instruction}</div>
            
            <img src={question.image} alt="Question" style={styles.examImage} />

            {renderRecordControls(question.responseTime)}
          </div>
        );
      }

      if (question.type === 'Listen and Retell') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Preparation: {question.prepTime}s | Response: {question.responseTime}s
              </div>
            </div>

            <div style={{ ...styles.questionText, backgroundColor: '#fef3c7', borderColor: '#fbbf24', marginBottom: '12px' }}>
              <strong>Context:</strong> {question.context}
            </div>

            <div style={styles.questionText}>
              <strong>Audio Script:</strong><br/>
              {question.audio}
            </div>

            <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', borderColor: '#3b82f6' }}>
              <strong>Your Task:</strong><br/>
              {question.task}
            </div>

            {renderRecordControls(question.responseTime)}
          </div>
        );
      }

      if (question.type === 'Short Interaction') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Preparation: {question.prepTime}s | Response: {question.responseTime}s
              </div>
            </div>

            <div style={styles.questionText}>
              <strong>Scenario:</strong><br/>
              {question.scenario}
            </div>

            <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', borderColor: '#3b82f6' }}>
              <strong>Task:</strong><br/>
              {question.task}
              {question.notes && (
                <div style={{ marginTop: '12px' }}>
                  <strong>Notes:</strong>
                  <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                    {question.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {renderRecordControls(question.responseTime)}
          </div>
        );
      }

      if (question.type === 'Tell a Story') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Preparation: {question.prepTime}s | Response: {question.responseTime}s
              </div>
            </div>

            <div style={styles.questionText}>{question.instruction}</div>
            
            <div style={styles.imageGrid}>
              {question.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Story ${idx + 1}`} style={{ width: '100%', borderRadius: '8px' }} />
              ))}
            </div>

            {renderRecordControls(question.responseTime)}
          </div>
        );
      }

      if (question.type === 'Make and Support a Recommendation') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Preparation: {question.prepTime}s | Response: {question.responseTime}s
              </div>
            </div>

            <div style={styles.questionText}>
              <strong>Scenario:</strong><br/>
              {question.scenario}
            </div>

            {question.options && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {question.options.map((opt, idx) => (
                  <div key={idx} style={{ ...styles.questionText, backgroundColor: '#f3f4f6' }}>
                    <strong>{opt.name}</strong><br/>
                    Rent: {opt.rent}<br/>
                    Bedrooms: {opt.bedrooms}<br/>
                    Location: {opt.location}
                  </div>
                ))}
              </div>
            )}

            <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', borderColor: '#3b82f6', whiteSpace: 'pre-line' }}>
              <strong>Task:</strong><br/>
              {question.task}
            </div>

            {renderRecordControls(question.responseTime)}
          </div>
        );
      }
    }

    // Writing Questions
    if (isWriting) {
      if (question.type === 'Build a Sentence') {
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Time limit: {question.timeLimit}s
              </div>
            </div>

            <div style={styles.questionText}>
              Drag the words in the boxes to form an appropriate sentence that is grammatically correct. The first part of the sentence is provided for you.
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                {question.prompt} ______________________ ?
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                {question.words.map((word, idx) => (
                  <div key={idx} style={styles.wordBox}>{word}</div>
                ))}
              </div>
            </div>

            <input
              type="text"
              style={styles.input}
              placeholder="Type your answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({...answers, [question.id]: e.target.value})}
            />
          </div>
        );
      }

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
            
            <img src={question.image} alt="Question" style={styles.examImage} />
            
            <div style={styles.imageCaption}>
              {question.words.join(' / ')}
            </div>

            <textarea
              style={styles.textarea}
              placeholder="Write your sentence here..."
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({...answers, [question.id]: e.target.value})}
            />
            <div style={styles.wordCount}>Word count: {wordCount}</div>
          </div>
        );
      }

      if (question.type === 'Respond to a Brief Message') {
        const wordCount = answers[question.id]?.split(' ').filter(w => w).length || 0;
        
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Time limit: {Math.floor(question.timeLimit / 60)} minutes
              </div>
            </div>

            <div style={styles.questionText}>
              Respond clearly and fully to the message from your friend {question.from}.
            </div>

            <div style={styles.emailBox}>
              <div style={{ fontStyle: 'italic', marginBottom: '12px' }}>
                "{question.message}"
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>— {question.from}</div>
            </div>

            <div style={{ ...styles.questionText, backgroundColor: '#dbeafe', borderColor: '#3b82f6' }}>
              {question.tasks.map((task, idx) => (
                <div key={idx}>{task}</div>
              ))}
            </div>

            <textarea
              style={{...styles.textarea, minHeight: '250px'}}
              placeholder="Write your response here..."
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({...answers, [question.id]: e.target.value})}
            />
            <div style={styles.wordCount}>Word count: {wordCount}</div>
          </div>
        );
      }

      if (question.type === 'Write a Narrative') {
        const wordCount = answers[question.id]?.split(' ').filter(w => w).length || 0;
        
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Time limit: {Math.floor(question.timeLimit / 60)} minutes
              </div>
            </div>

            <div style={styles.questionText}>{question.instruction}</div>

            {question.note && (
              <div style={{ ...styles.questionText, backgroundColor: '#fef3c7', borderColor: '#fbbf24' }}>
                <strong>Note:</strong> {question.note}
              </div>
            )}

            <textarea
              style={{...styles.textarea, minHeight: '300px'}}
              placeholder="Write your blog post here..."
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({...answers, [question.id]: e.target.value})}
            />
            <div style={styles.wordCount}>Word count: {wordCount}</div>
          </div>
        );
      }

      if (question.type === 'Respond to an Extended Message') {
        const wordCount = answers[question.id]?.split(' ').filter(w => w).length || 0;
        
        return (
          <div style={styles.questionContent}>
            <div style={styles.questionHeader}>
              <span style={styles.questionType}>{question.type}</span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Time limit: {Math.floor(question.timeLimit / 60)} minutes
              </div>
            </div>

            <div style={styles.questionText}>{question.instruction}</div>

            <div style={styles.emailBox}>
              <div style={styles.emailHeader}>
                <div><span style={styles.emailLabel}>To:</span><span style={styles.emailValue}>{question.email.to}</span></div>
                <div><span style={styles.emailLabel}>From:</span><span style={styles.emailValue}>{question.email.from}</span></div>
                <div><span style={styles.emailLabel}>Subject:</span><span style={styles.emailValue}>{question.email.subject}</span></div>
              </div>
              <div style={{ whiteSpace: 'pre-line', fontSize: '14px', lineHeight: '1.6' }}>
                {question.email.body}
              </div>
            </div>

            <textarea
              style={{...styles.textarea, minHeight: '300px'}}
              placeholder="Write your response here..."
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({...answers, [question.id]: e.target.value})}
            />
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
              onClick={() => setActiveView('dashboard')}
            >
              Thoát
            </button>
          </div>
        </div>

        <div style={styles.examNav}>
          {selectedTest.sections.map((section, idx) => (
            <div
              key={section.id}
              style={{
                ...styles.navTab,
                ...(currentSection === idx ? styles.navTabActive : {})
              }}
              onClick={() => {
                setCurrentSection(idx);
                setCurrentQuestionInSection(0);
                setAudioURL(null);
                setIsRecording(false);
              }}
            >
              {section.name}
            </div>
          ))}
        </div>

        <div style={styles.examContent}>
          <div style={styles.examLeft}>
            {renderExamQuestion()}
            
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
              {selectedTest.sections.map((section, sIdx) => (
                <div key={section.id} style={{ marginBottom: '16px' }}>
                  <div style={styles.questionsTitle}>{section.name}</div>
                  <div style={styles.questionGrid}>
                    {section.questions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        style={{
                          ...styles.questionNumber,
                          ...(currentSection === sIdx && currentQuestionInSection === qIdx ? styles.questionNumberActive : {})
                        }}
                        onClick={() => {
                          setCurrentSection(sIdx);
                          setCurrentQuestionInSection(qIdx);
                          setAudioURL(null);
                          setIsRecording(false);
                        }}
                      >
                        {q.id}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              style={{ ...styles.button, ...styles.buttonPrimary, width: '100%', justifyContent: 'center' }}
            >
              NỘP BÀI
            </button>

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
        speakingTests={speakingTests}
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
        writingTests={writingTests}
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
