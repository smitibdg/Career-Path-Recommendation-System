import React, { useState, useEffect } from 'react';
import './TestCard.css';
import { useUser } from '../../../context/UserContext';


const TestCards = () => {
  // Get user context with education level
  const { getQuestionLevel, hasEducationLevel, currentEducationLevel, profile } = useUser();
  
  // Use Set to track unique completed tests (prevents duplicates)
  const [completedTests, setCompletedTests] = useState(new Set());
  const [activeTest, setActiveTest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [showModal]);

  // Get user's education level and question level
  const userEducationLevel = currentEducationLevel || profile?.educationLevel || 'intermediate-12th';
  const questionLevel = getQuestionLevel();

  const tests = [
    {
      id: 'Personality',
      title: 'Personality Assessment',
      description: 'Discover your personality traits and work preferences based on the Big Five model',
      icon: '🧠',
      duration: questionLevel === 'Foundation' ? '10-15 mins' : 
                questionLevel === 'Intermediate' ? '12-18 mins' : '15-20 mins',
      questions: 19, // All levels have 19 personality questions
      status: 'not-started',
      color: '#6366f1',
      category: 'Personality'
    },
    {
      id: 'Skills',
      title: 'Skills Evaluation',
      description: 'Assess your technical and soft skills across various domains',
      icon: '⚡',
      duration: questionLevel === 'Foundation' ? '12-18 mins' : 
                questionLevel === 'Intermediate' ? '15-20 mins' : '18-25 mins',
      questions: 19, // All levels have 19 skills questions
      status: 'not-started',
      color: '#8b5cf6',
      category: 'Skills'
    },
    {
      id: 'Cognitive',
      title: 'Cognitive Assessment',
      description: 'Test your logical reasoning, problem-solving, and mathematical abilities',
      icon: '🧮',
      duration: questionLevel === 'Foundation' ? '8-12 mins' : 
                questionLevel === 'Intermediate' ? '10-15 mins' : '12-18 mins',
      questions: 15, // All levels have 15 cognitive questions
      status: 'not-started',
      color: '#06b6d4',
      category: 'Cognitive'
    },
    {
      id: 'Values',
      title: 'Values Assessment',
      description: 'Understand what matters most to you in work and life',
      icon: '💎',
      duration: questionLevel === 'Foundation' ? '6-10 mins' : 
                questionLevel === 'Intermediate' ? '7-12 mins' : '8-12 mins',
      questions: 11, // All levels have 11 values questions
      status: 'not-started',
      color: '#10b981',
      category: 'Values'
    },
    {
      id: 'Situational',
      title: 'Situational Judgment',
      description: 'Evaluate decision-making skills in realistic scenarios',
      icon: '🎯',
      duration: questionLevel === 'Foundation' ? '7-12 mins' : 
                questionLevel === 'Intermediate' ? '8-15 mins' : '10-15 mins',
      questions: 11, // All levels have 11 situational questions
      status: 'not-started',
      color: '#f59e0b',
      category: 'Situational'
    }
  ];


  // ALL QUESTIONS EMBEDDED - Select based on education level
  const getAllAssessmentQuestions = () => {
    // FOUNDATION LEVEL QUESTIONS
    const foundationQuestions = {
      Personality: [
        {
          id: 'F_P001',
          question: 'I enjoy meeting new people and making friends at school/college',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P002',
          question: 'I prefer studying alone rather than in groups',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P003',
          question: 'I feel confident speaking in front of my classmates',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P004',
          question: 'I often volunteer to lead group projects or activities',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P005',
          question: 'I keep my room and study space well organized',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P006',
          question: 'I complete my homework and assignments on time',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P007',
          question: 'I often forget to bring my books or stationery to school',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P008',
          question: 'I enjoy learning about different cultures and places',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P009',
          question: 'I like trying new activities and hobbies',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P010',
          question: 'I prefer familiar activities rather than trying something new',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P011',
          question: 'I try to help classmates who are struggling with their studies',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P012',
          question: 'I get along well with most of my classmates',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P013',
          question: 'I often argue with others about small things',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P014',
          question: 'I worry a lot about my exam results',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P015',
          question: 'I remain calm even during stressful situations like exams',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P016',
          question: 'My mood changes quickly from happy to sad',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P017',
          question: 'I bounce back quickly from setbacks or failures',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P018',
          question: 'I enjoy creative activities like art, music, or writing',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'F_P019',
          question: 'I pay attention to details in my work and assignments',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        }
      ],

      Skills: [
        {
          id: 'F_S001',
          question: 'Which of these is used to browse the internet?',
          options: ['Microsoft Word', 'Chrome/Firefox', 'Calculator', 'Notepad', 'Paint']
        },
        {
          id: 'F_S002',
          question: 'What does \'www\' stand for in website addresses?',
          options: ['World Wide Web', 'Web World Wide', 'Wide World Web', 'World Web Wide', 'Web Wide World']
        },
        {
          id: 'F_S003',
          question: 'Which key is used to make letters CAPITAL while typing?',
          options: ['Alt', 'Ctrl', 'Shift', 'Tab', 'Enter']
        },
        {
          id: 'F_S004',
          question: 'What should you do first when starting a group project?',
          options: ['Start working immediately', 'Discuss and plan together', 'Divide work randomly', 'Wait for others', 'Do everything yourself']
        },
        {
          id: 'F_S005',
          question: 'How do you show active listening in a conversation?',
          options: ['Look at your phone', 'Think about what to say next', 'Make eye contact and nod', 'Interrupt frequently', 'Stay silent always']
        },
        {
          id: 'F_S006',
          question: 'Which of these is the best way to manage your study time?',
          options: ['Study everything the night before exam', 'Make a study schedule and follow it', 'Study only your favorite subjects', 'Study only when you feel like it', 'Copy from friends']
        },
        {
          id: 'F_S007',
          question: 'What is 15% of 200?',
          options: ['20', '25', '30', '35', '40']
        },
        {
          id: 'F_S008',
          question: 'If you buy 3 notebooks at ₹25 each, how much do you pay in total?',
          options: ['₹60', '₹65', '₹70', '₹75', '₹80']
        },
        {
          id: 'F_S009',
          question: 'What should you do when you don\'t understand something in class?',
          options: ['Ignore and move on', 'Ask the teacher for clarification', 'Pretend you understand', 'Sleep in class', 'Copy from classmates']
        },
        {
          id: 'F_S010',
          question: 'Which is the best way to remember what you study?',
          options: ['Read once quickly', 'Just listen in class', 'Take notes and review regularly', 'Memorize without understanding', 'Study only before exams']
        },
        {
          id: 'F_S011',
          question: 'What does \'email\' stand for?',
          options: ['Electronic mail', 'Emergency mail', 'Easy mail', 'Extra mail', 'Expert mail']
        },
        {
          id: 'F_S012',
          question: 'How do you save a document in most computer programs?',
          options: ['Alt + S', 'Ctrl + S', 'Shift + S', 'Tab + S', 'F1 + S']
        },
        {
          id: 'F_S013',
          question: 'When presenting in front of class, you should:',
          options: ['Speak very fast', 'Look only at your notes', 'Speak clearly and make eye contact', 'Turn your back to audience', 'Whisper quietly']
        },
        {
          id: 'F_S014',
          question: 'What is 25% of 80?',
          options: ['15', '20', '25', '30', '35']
        },
        {
          id: 'F_S015',
          question: 'If a train leaves at 2:30 PM and takes 3 hours 45 minutes, what time does it arrive?',
          options: ['6:15 PM', '6:30 PM', '5:45 PM', '5:15 PM', '6:00 PM']
        },
        {
          id: 'F_S016',
          question: 'What is the best way to resolve a conflict with a friend?',
          options: ['Avoid them completely', 'Talk calmly and listen to their side', 'Get angry and shout', 'Ignore the problem', 'Get others involved immediately']
        },
        {
          id: 'F_S017',
          question: 'When working in a group, what should you do if someone is not participating?',
          options: ['Do all the work yourself', 'Complain to the teacher immediately', 'Gently encourage them to participate', 'Exclude them from the group', 'Ignore them completely']
        },
        {
          id: 'F_S018',
          question: 'What should you do before starting any assignment?',
          options: ['Start writing immediately', 'Read the instructions carefully', 'Ask friends for their answers', 'Wait until the last day', 'Guess what\'s required']
        },
        {
          id: 'F_S019',
          question: 'Which of these helps you learn new things better?',
          options: ['Memorizing without understanding', 'Understanding concepts and practicing', 'Just reading once', 'Copying from others', 'Avoiding difficult topics']
        }
      ],

      Cognitive: [
        {
          id: 'F_C001',
          question: 'What comes next in the pattern: 2, 4, 6, 8, ?',
          options: ['10', '12', '14', '16', '18']
        },
        {
          id: 'F_C002',
          question: 'If all cats are animals and Fluffy is a cat, then Fluffy is:',
          options: ['A dog', 'An animal', 'A bird', 'A fish', 'A plant']
        },
        {
          id: 'F_C003',
          question: 'Which number is different from the others: 2, 4, 6, 9, 8?',
          options: ['2', '4', '6', '9', '8']
        },
        {
          id: 'F_C004',
          question: 'What is 12 × 8?',
          options: ['84', '96', '104', '112', '120']
        },
        {
          id: 'F_C005',
          question: 'If today is Wednesday, what day will it be in 10 days?',
          options: ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday']
        },
        {
          id: 'F_C006',
          question: 'Which word does not belong: Apple, Banana, Car, Orange?',
          options: ['Apple', 'Banana', 'Car', 'Orange', 'None']
        },
        {
          id: 'F_C007',
          question: 'Complete the sequence: A, B, C, D, ?',
          options: ['E', 'F', 'G', 'H', 'I']
        },
        {
          id: 'F_C008',
          question: 'What is half of 150?',
          options: ['65', '70', '75', '80', '85']
        },
        {
          id: 'F_C009',
          question: 'If 5 pencils cost ₹25, how much does 1 pencil cost?',
          options: ['₹3', '₹4', '₹5', '₹6', '₹7']
        },
        {
          id: 'F_C010',
          question: 'Which shape has 3 sides?',
          options: ['Circle', 'Square', 'Triangle', 'Rectangle', 'Pentagon']
        },
        {
          id: 'F_C011',
          question: 'What comes next: Monday, Tuesday, Wednesday, ?',
          options: ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday']
        },
        {
          id: 'F_C012',
          question: 'If you have 100 rupees and spend 35 rupees, how much is left?',
          options: ['55', '60', '65', '70', '75']
        },
        {
          id: 'F_C013',
          question: 'Which is the largest number: 45, 54, 34, 43?',
          options: ['45', '54', '34', '43', 'Same']
        },
        {
          id: 'F_C014',
          question: 'Complete: Hot is to Cold as Up is to ?',
          options: ['Down', 'Left', 'Right', 'Forward', 'Backward']
        },
        {
          id: 'F_C015',
          question: 'How many minutes are there in 2 hours?',
          options: ['100', '110', '120', '130', '140']
        }
      ],

      Situational: [
        {
          id: 'F_T001',
          question: 'Your friend asks you to let them copy your homework. What do you do?',
          options: ['Let them copy everything', 'Help them understand the concepts', 'Refuse and walk away', 'Tell the teacher immediately', 'Ignore them completely']
        },
        {
          id: 'F_T002',
          question: 'You see a classmate being bullied. What is your best response?',
          options: ['Join the bullying', 'Ignore the situation', 'Tell an adult or teacher', 'Laugh at the situation', 'Record it on phone']
        },
        {
          id: 'F_T003',
          question: 'You have two important tests on the same day. How do you prepare?',
          options: ['Study for just one test', 'Panic and give up', 'Create a study plan for both', 'Ask friends for answers', 'Skip both tests']
        },
        {
          id: 'F_T004',
          question: 'Your group project partner is not doing their share of work. You:',
          options: ['Do all the work yourself', 'Complain to everyone about them', 'Talk to them about contributing', 'Remove them from the group', 'Give up on the project']
        },
        {
          id: 'F_T005',
          question: 'You made a mistake in class and everyone laughed. You feel:',
          options: ['Very embarrassed and angry', 'Normal - everyone makes mistakes', 'Like you want to hide forever', 'Angry at your classmates', 'Sad and disappointed']
        },
        {
          id: 'F_T006',
          question: 'Your parents want you to study science but you love art. What do you do?',
          options: ['Immediately choose art', 'Follow parents\' choice without question', 'Discuss your interests with parents', 'Get angry and argue', 'Ignore the decision']
        },
        {
          id: 'F_T007',
          question: 'You find someone\'s wallet with money in the school corridor. You:',
          options: ['Keep it for yourself', 'Take the money and return wallet', 'Return it to lost and found', 'Give it to a friend', 'Throw it away']
        },
        {
          id: 'F_T008',
          question: 'During a group discussion you disagree with everyone else. You:',
          options: ['Stay quiet and agree', 'Argue loudly until they agree', 'Respectfully share your viewpoint', 'Get up and leave', 'Make fun of their ideas']
        },
        {
          id: 'F_T009',
          question: 'You have been chosen as class monitor. Your first action is:',
          options: ['Make strict rules for everyone', 'Ask classmates what they need help with', 'Use the position to get special treatment', 'Ignore the responsibility', 'Give the position to someone else']
        },
        {
          id: 'F_T010',
          question: 'Your friend is upset about failing a test. You:',
          options: ['Tell them it\'s not important', 'Help them plan better study methods', 'Avoid them until they feel better', 'Make jokes to cheer them up', 'Share your own test results']
        },
        {
          id: 'F_T011',
          question: 'You want to join the school debate team but are nervous about public speaking. You:',
          options: ['Give up on the idea', 'Force yourself to join despite fear', 'Practice speaking in front of mirror first', 'Ask friends to speak for you', 'Wait until next year']
        }
      ],

      Values: [
        {
          id: 'F_V001',
          question: 'What matters most to you in choosing future studies?',
          options: ['High salary potential', 'Personal interest and passion', 'Family expectations', 'Easy subjects only', 'Popular career choices']
        },
        {
          id: 'F_V002',
          question: 'Your ideal future work environment would be:',
          options: ['Quiet and independent', 'Collaborative team setting', 'Mix of both depending on task', 'Competitive environment', 'Constantly changing']
        },
        {
          id: 'F_V003',
          question: 'When choosing subjects to study, you prioritize:',
          options: ['What your friends are taking', 'What seems easiest', 'What interests you most', 'What parents suggest', 'What has best job prospects']
        },
        {
          id: 'F_V004',
          question: 'Success in life means:',
          options: ['Making lots of money', 'Being happy and fulfilled', 'Being famous', 'Having power over others', 'Being better than everyone']
        },
        {
          id: 'F_V005',
          question: 'You prefer activities that:',
          options: ['Help other people', 'Let you be creative', 'Involve solving problems', 'Are physical and active', 'Make you money']
        },
        {
          id: 'F_V006',
          question: 'In group work you enjoy:',
          options: ['Leading the team', 'Supporting team members', 'Contributing ideas equally', 'Working on technical tasks', 'Presenting to others']
        },
        {
          id: 'F_V007',
          question: 'You feel most proud when you:',
          options: ['Get the highest marks in class', 'Help someone learn something', 'Finish a challenging project', 'Win a competition', 'Get praised by teachers']
        },
        {
          id: 'F_V008',
          question: 'Your ideal day would include:',
          options: ['Learning something new', 'Relaxing with friends', 'Solving interesting problems', 'Being physically active', 'Creating something']
        },
        {
          id: 'F_V009',
          question: 'When facing a difficult decision you:',
          options: ['Ask parents for advice', 'Think it through yourself', 'Discuss with friends', 'Research all options thoroughly', 'Go with your gut feeling']
        },
        {
          id: 'F_V010',
          question: 'You would rather be known as someone who is:',
          options: ['Very intelligent', 'Very kind and helpful', 'Very creative', 'Very hardworking', 'Very popular']
        },
        {
          id: 'F_V011',
          question: 'In the future you want a career that:',
          options: ['Makes a positive difference', 'Provides financial security', 'Allows creative expression', 'Offers variety and change', 'Gives recognition and status']
        }
      ]
    };

    // INTERMEDIATE LEVEL QUESTIONS - Add similar structure
    const intermediateQuestions = {
      Personality: [
        {
          id: 'I_P001',
          question: 'I actively seek leadership roles in group projects and organizations',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P002',
          question: 'I prefer working independently on complex tasks rather than collaborating',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P003',
          question: 'I feel comfortable presenting my ideas to professors and senior colleagues',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P004',
          question: 'I enjoy networking events and building professional connections',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P005',
          question: 'I maintain detailed schedules and prioritize tasks systematically',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P006',
          question: 'I complete assignments well before deadlines to ensure quality',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P007',
          question: 'I often procrastinate on important tasks until the last minute',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P008',
          question: 'I actively seek out new learning opportunities and skill development',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P009',
          question: 'I enjoy exploring abstract concepts and theoretical frameworks',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P010',
          question: 'I prefer proven methods over experimenting with new approaches',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P011',
          question: 'I go out of my way to help teammates succeed even when not required',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P012',
          question: 'I can work effectively with people who have different perspectives',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P013',
          question: 'I become frustrated when others don\'t meet my standards',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P014',
          question: 'I worry extensively about my academic and career performance',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P015',
          question: 'I maintain composure during high-pressure situations like interviews',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P016',
          question: 'My confidence levels fluctuate significantly based on external feedback',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P017',
          question: 'I recover quickly from academic setbacks and professional rejections',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P018',
          question: 'I enjoy developing innovative solutions to complex problems',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'I_P019',
          question: 'I thoroughly research topics before forming opinions or making decisions',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        }
      ],

      Skills: [
        {
          id: 'I_S001',
          question: 'Which software is primarily used for data analysis and visualization?',
          options: ['Microsoft Word', 'Excel/Google Sheets', 'PowerPoint', 'Notepad', 'Paint']
        },
        {
          id: 'I_S002',
          question: 'What does API stand for in software development?',
          options: ['Application Program Interface', 'Advanced Programming Interface', 'Application Programming Interface', 'Automated Program Interface', 'Advanced Program Integration']
        },
        {
          id: 'I_S003',
          question: 'Which project management methodology emphasizes iterative development?',
          options: ['Waterfall', 'Agile', 'Traditional', 'Linear', 'Sequential']
        },
        {
          id: 'I_S004',
          question: 'In effective team communication, you should:',
          options: ['Send long detailed emails', 'Use clear concise language with specific examples', 'Assume everyone understands context', 'Communicate only when problems arise', 'Rely primarily on verbal communication']
        },
        {
          id: 'I_S005',
          question: 'What is the most effective way to give constructive feedback?',
          options: ['Focus only on negative aspects', 'Provide specific examples with improvement suggestions', 'Give general positive comments', 'Wait until annual reviews', 'Avoid giving feedback to maintain relationships']
        },
        {
          id: 'I_S006',
          question: 'When managing multiple deadlines, you should:',
          options: ['Work on everything simultaneously', 'Focus on the easiest tasks first', 'Prioritize based on importance and urgency', 'Complete tasks in chronological order', 'Delegate everything to others']
        },
        {
          id: 'I_S007',
          question: 'Calculate: If a project budget increases by 15% from ₹200,000, what is the new budget?',
          options: ['₹215,000', '₹220,000', '₹225,000', '₹230,000', '₹235,000']
        },
        {
          id: 'I_S008',
          question: 'In a dataset of 1000 entries, if 25% are incomplete, how many complete entries exist?',
          options: ['700', '725', '750', '775', '800']
        },
        {
          id: 'I_S009',
          question: 'Which research method is best for understanding user behavior patterns?',
          options: ['Surveys only', 'Interviews only', 'Combination of surveys, interviews and observation', 'Focus groups only', 'Secondary research only']
        },
        {
          id: 'I_S010',
          question: 'What should you do when you encounter a problem outside your expertise?',
          options: ['Guess the solution', 'Ask for help from knowledgeable colleagues', 'Avoid the problem', 'Make up an answer', 'Wait for someone else to solve it']
        },
        {
          id: 'I_S011',
          question: 'Which presentation technique is most effective for technical audiences?',
          options: ['Use lots of animations', 'Focus on detailed technical specifications', 'Balance technical details with clear explanations', 'Show only high-level concepts', 'Read directly from slides']
        },
        {
          id: 'I_S012',
          question: 'In database management, what does SQL primarily help you do?',
          options: ['Design graphics', 'Query and manipulate data', 'Create presentations', 'Write documents', 'Send emails']
        },
        {
          id: 'I_S013',
          question: 'What is the first step in solving a complex analytical problem?',
          options: ['Start calculating immediately', 'Define the problem clearly and gather relevant data', 'Look for similar solutions online', 'Ask others for the answer', 'Assume a solution and work backwards']
        },
        {
          id: 'I_S014',
          question: 'Calculate the compound interest on ₹50,000 at 8% annually for 2 years:',
          options: ['₹8,000', '₹8,320', '₹8,500', '₹8,640', '₹9,000']
        },
        {
          id: 'I_S015',
          question: 'Which communication approach works best in multicultural teams?',
          options: ['Use only English', 'Adapt communication style to cultural contexts', 'Ignore cultural differences', 'Use formal language always', 'Communicate only in writing']
        },
        {
          id: 'I_S016',
          question: 'When leading a team project, the most important initial step is:',
          options: ['Assign tasks immediately', 'Establish clear objectives and expectations', 'Start working on deliverables', 'Set strict deadlines', 'Create detailed schedules']
        },
        {
          id: 'I_S017',
          question: 'What is the best approach to continuous learning in your field?',
          options: ['Attend one annual conference', 'Read industry publications and take relevant courses', 'Rely on on-the-job experience only', 'Learn only when required by employer', 'Focus solely on technical skills']
        },
        {
          id: 'I_S018',
          question: 'In conflict resolution, the most effective approach is:',
          options: ['Avoid the conflict entirely', 'Listen to all parties and find common ground', 'Take sides with the stronger party', 'Let conflicts resolve themselves', 'Focus only on who is right']
        },
        {
          id: 'I_S019',
          question: 'Which metric is most important for evaluating project success?',
          options: ['Time spent on project', 'Budget adherence only', 'Achievement of defined objectives and stakeholder satisfaction', 'Number of team members involved', 'Amount of documentation created']
        }
      ],

      Cognitive: [
        {
          id: 'I_C001',
          question: 'If the pattern is 3, 6, 12, 24, 48, what comes next?',
          options: ['84', '96', '108', '120', '132']
        },
        {
          id: 'I_C002',
          question: 'All managers are leaders. Some leaders are innovative. Therefore:',
          options: ['All managers are innovative', 'Some managers may be innovative', 'No managers are innovative', 'All leaders are managers', 'Some innovative people are not leaders']
        },
        {
          id: 'I_C003',
          question: 'Which number doesn\'t fit: 144, 121, 100, 81, 63, 64?',
          options: ['144', '121', '100', '81', '63']
        },
        {
          id: 'I_C004',
          question: 'A company\'s profit increased by 20% to ₹600,000. What was the original profit?',
          options: ['₹480,000', '₹500,000', '₹520,000', '₹540,000', '₹580,000']
        },
        {
          id: 'I_C005',
          question: 'If Event A has 30% probability and Event B has 40% probability and they\'re independent, what\'s P(A and B)?',
          options: ['10%', '12%', '15%', '18%', '20%']
        },
        {
          id: 'I_C006',
          question: 'Complete the analogy: Democracy : Voting :: Monarchy : ?',
          options: ['Election', 'Parliament', 'Crown', 'Republic', 'Federation']
        },
        {
          id: 'I_C007',
          question: 'In a sequence 2, 5, 11, 23, 47, what is the pattern rule?',
          options: ['Add 3 then double', 'Add consecutive prime numbers', 'Each term = 2×previous + 1', 'Add powers of 2', 'Multiply by 2.5']
        },
        {
          id: 'I_C008',
          question: 'If 15 workers complete a task in 8 hours, how many workers needed for 6 hours?',
          options: ['18', '20', '22', '24', '26']
        },
        {
          id: 'I_C009',
          question: 'Which conclusion is logically valid? Premise: All successful entrepreneurs take calculated risks',
          options: ['Some risk-takers are not successful entrepreneurs', 'All successful people are entrepreneurs', 'No entrepreneurs avoid risks', 'Some non-risk-takers may be successful entrepreneurs', 'Taking calculated risks guarantees entrepreneurial success']
        },
        {
          id: 'I_C010',
          question: 'Find the missing term: ACE, GIK, MOQ, ?',
          options: ['SUW', 'STV', 'STU', 'RTV', 'RTU']
        },
        {
          id: 'I_C011',
          question: 'If a store offers 25% discount on marked price of ₹2400 and then 10% tax, what\'s the final price?',
          options: ['₹1,890', '₹1,950', '₹1,980', '₹2,010', '₹2,040']
        },
        {
          id: 'I_C012',
          question: 'Which statement must be true? Given: Some artists are introverts. All introverts are creative.',
          options: ['Some artists are creative', 'All artists are creative', 'All creative people are artists', 'No artists are extroverts', 'Some introverts are not artists']
        },
        {
          id: 'I_C013',
          question: 'In a data set with values 12, 15, 18, 21, 24, 27, what is the median after adding 30?',
          options: ['18', '19.5', '20', '21', '22.5']
        },
        {
          id: 'I_C014',
          question: 'Complete: Innovation : Progress :: Tradition : ?',
          options: ['Change', 'Stability', 'Revolution', 'Disruption', 'Transformation']
        },
        {
          id: 'I_C015',
          question: 'If investment of ₹100,000 grows to ₹133,100 in 3 years, what\'s the annual compound rate?',
          options: ['9%', '10%', '11%', '12%', '13%']
        }
      ],

      Situational: [
        {
          id: 'I_T001',
          question: 'Your team member consistently misses deadlines affecting project quality. You:',
          options: ['Complete their work without discussion', 'Report them to supervisor immediately', 'Have a private conversation to understand and help', 'Publicly criticize their performance', 'Reassign them to easier tasks']
        },
        {
          id: 'I_T002',
          question: 'You discover an error in your submitted report that could impact decisions. You:',
          options: ['Hope no one notices the mistake', 'Quietly correct it in future versions', 'Immediately inform stakeholders and provide correction', 'Blame the error on insufficient data', 'Wait to see if anyone questions it']
        },
        {
          id: 'I_T003',
          question: 'Your innovative idea is rejected by senior management. You:',
          options: ['Abandon the idea completely', 'Argue forcefully for reconsideration', 'Gather more data and present refined version', 'Implement it secretly anyway', 'Complain to colleagues about management']
        },
        {
          id: 'I_T004',
          question: 'You\'re assigned to work with a difficult colleague known for conflicts. You:',
          options: ['Request a different assignment', 'Maintain professional interactions and focus on work', 'Confront them about their reputation', 'Avoid communication as much as possible', 'Rally others against them']
        },
        {
          id: 'I_T005',
          question: 'Your manager asks you to use methods you believe are less effective. You:',
          options: ['Follow instructions without question', 'Express concerns and suggest alternatives respectfully', 'Refuse to comply with the request', 'Use effective methods without telling them', 'Complain to other managers']
        },
        {
          id: 'I_T006',
          question: 'You have opportunity for promotion but it requires relocating. You:',
          options: ['Accept immediately for career growth', 'Decline to maintain current lifestyle', 'Evaluate all factors and discuss with stakeholders', 'Accept but plan to change mind later', 'Ask for promotion without relocation']
        },
        {
          id: 'I_T007',
          question: 'Your team is behind schedule on critical project deadline. You:',
          options: ['Work overtime alone to catch up', 'Inform client about delay immediately', 'Assess resources and create recovery plan', 'Reduce project scope without approval', 'Blame team members for delays']
        },
        {
          id: 'I_T008',
          question: 'You receive confidential information that affects a colleague\'s project. You:',
          options: ['Share information to help them', 'Keep information confidential', 'Hint at the information indirectly', 'Use information for personal advantage', 'Tell them to find out themselves']
        },
        {
          id: 'I_T009',
          question: 'Your expertise is questioned by someone less experienced in the field. You:',
          options: ['Assert your superiority aggressively', 'Provide evidence-based explanations calmly', 'Ignore their questions completely', 'Appeal to authority for validation', 'Become defensive about your knowledge']
        },
        {
          id: 'I_T010',
          question: 'You identify a more efficient process but implementation requires team training. You:',
          options: ['Implement it yourself without telling others', 'Propose the change with training plan', 'Wait for someone else to suggest it', 'Use new process only for your work', 'Criticize current inefficient methods']
        },
        {
          id: 'I_T011',
          question: 'Your mentor offers advice that conflicts with your research findings. You:',
          options: ['Follow mentor\'s advice without question', 'Respectfully discuss your findings and reasoning', 'Ignore the advice and follow research', 'Seek a third opinion secretly', 'Pretend to follow advice but don\'t']
        }
      ],

    Values: [
        {
          id: 'I_V001',
          question: 'In choosing a career path, you prioritize:',
          options: ['Highest possible salary', 'Work-life balance and personal fulfillment', 'Prestige and social recognition', 'Job security and stability', 'Opportunities for innovation and impact']
        },
        {
          id: 'I_V002',
          question: 'Your ideal work environment emphasizes:',
          options: ['Individual competition and recognition', 'Collaborative teamwork and shared success', 'Hierarchical structure with clear authority', 'Flexible and autonomous work arrangements', 'Continuous learning and development']
        },
        {
          id: 'I_V003',
          question: 'When making important decisions you value most:',
          options: ['Quick decisive action', 'Thorough analysis and consultation', 'Intuition and personal experience', 'Consensus from all stakeholders', 'Expert opinions and best practices']
        },
        {
          id: 'I_V004',
          question: 'Professional success means:',
          options: ['Achieving financial independence', 'Making meaningful contribution to society', 'Gaining recognition as industry expert', 'Building lasting professional relationships', 'Continuously growing and learning']
        },
        {
          id: 'I_V005',
          question: 'You prefer projects that:',
          options: ['Have clear defined outcomes', 'Allow creative problem-solving', 'Involve working with diverse teams', 'Focus on helping others', 'Provide intellectual challenges']
        },
        {
          id: 'I_V006',
          question: 'In leadership roles you emphasize:',
          options: ['Maintaining authority and control', 'Developing and empowering team members', 'Achieving results efficiently', 'Building consensus and agreement', 'Setting vision and inspiring others']
        },
        {
          id: 'I_V007',
          question: 'You feel most satisfied when:',
          options: ['Exceeding performance targets', 'Solving complex challenging problems', 'Mentoring junior colleagues', 'Contributing to team achievements', 'Learning new skills and knowledge']
        },
        {
          id: 'I_V008',
          question: 'Your approach to professional relationships focuses on:',
          options: ['Networking for career advancement', 'Building genuine mutual respect', 'Maintaining professional boundaries', 'Helping others succeed', 'Creating collaborative partnerships']
        },
        {
          id: 'I_V009',
          question: 'When facing ethical dilemmas you prioritize:',
          options: ['Following company policies strictly', 'Considering impact on all stakeholders', 'Protecting your career interests', 'Seeking guidance from mentors', 'Acting according to personal values']
        },
        {
          id: 'I_V010',
          question: 'You prefer feedback that:',
          options: ['Focuses on areas for improvement', 'Balances strengths with development areas', 'Emphasizes positive achievements', 'Provides specific actionable steps', 'Comes from multiple perspectives']
        },
        {
          id: 'I_V011',
          question: 'Long-term career fulfillment comes from:',
          options: ['Financial security and benefits', 'Making positive impact on others', 'Achieving expertise and mastery', 'Having variety and new challenges', 'Building something lasting and meaningful']
        }
      ]

    };

    // ADVANCED LEVEL QUESTIONS - Add this to your advancedQuestions object
    const advancedQuestions = {
      Personality: [
        {
          id: 'A_P001',
          question: 'I proactively identify and pursue high-impact leadership opportunities across organizations',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P002',
          question: 'I prefer autonomous decision-making in complex strategic initiatives',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P003',
          question: 'I excel at influencing C-suite executives and board members',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P004',
          question: 'I actively build and leverage extensive professional networks for organizational impact',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P005',
          question: 'I design and implement systematic processes for complex organizational challenges',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P006',
          question: 'I consistently deliver exceptional results under extreme pressure and tight deadlines',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P007',
          question: 'I sometimes compromise on thoroughness when facing competing priorities',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P008',
          question: 'I continuously explore cutting-edge methodologies and disruptive innovations',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P009',
          question: 'I synthesize complex interdisciplinary concepts to create novel frameworks',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P010',
          question: 'I prefer established best practices over unproven experimental approaches',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P011',
          question: 'I invest significant personal resources in developing others\' professional capabilities',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P012',
          question: 'I successfully manage stakeholders with conflicting interests and competing agendas',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P013',
          question: 'I become impatient with individuals who cannot match my professional standards',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P014',
          question: 'I experience significant stress when organizational outcomes depend on my decisions',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P015',
          question: 'I maintain strategic perspective and emotional equilibrium during organizational crises',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P016',
          question: 'My confidence in professional judgment varies based on external validation and market feedback',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P017',
          question: 'I quickly adapt strategy and rebuild momentum after significant professional setbacks',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P018',
          question: 'I develop groundbreaking solutions that redefine industry standards and practices',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
          id: 'A_P019',
          question: 'I conduct exhaustive analysis before making high-stakes strategic decisions',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        }
      ],

        Skills: [
        {
          id: 'A_S001',
          question: 'Which advanced statistical method is most appropriate for predictive modeling with multiple variables?',
          options: ['Linear regression', 'Multiple regression analysis', 'Correlation analysis', 'Descriptive statistics', 'Frequency distribution']
        },
        {
          id: 'A_S002',
          question: 'In enterprise architecture, what does SOA primarily enable?',
          options: ['Service-Oriented Architecture for modular system integration', 'Software Operations Automation', 'System Optimization Analysis', 'Structured Operational Assessment', 'Strategic Organizational Alignment']
        },
        {
          id: 'A_S003',
          question: 'Which leadership framework is most effective for driving organizational transformation?',
          options: ['Transactional leadership', 'Transformational leadership', 'Situational leadership', 'Servant leadership', 'Autocratic leadership']
        },
        {
          id: 'A_S004',
          question: 'In stakeholder management, the most critical success factor is:',
          options: ['Maintaining formal communication protocols', 'Aligning diverse interests with strategic objectives', 'Minimizing stakeholder involvement', 'Following hierarchical decision-making', 'Standardizing all stakeholder interactions']
        },
        {
          id: 'A_S005',
          question: 'What is the primary advantage of Design Thinking methodology?',
          options: ['Reduces development costs', 'Focuses on user-centered innovation and problem-solving', 'Accelerates project timelines', 'Eliminates need for market research', 'Simplifies technical implementation']
        },
        {
          id: 'A_S006',
          question: 'In change management, the most effective approach for overcoming resistance is:',
          options: ['Mandating compliance through policy', 'Creating compelling vision with stakeholder engagement', 'Implementing changes gradually without announcement', 'Using financial incentives exclusively', 'Delegating change to external consultants']
        },
        {
          id: 'A_S007',
          question: 'Calculate IRR for project: Initial investment ₹1,000,000, returns ₹400,000 annually for 3 years:',
          options: ['12.5%', '15.2%', '18.7%', '21.3%', '23.4%']
        },
        {
          id: 'A_S008',
          question: 'In Six Sigma methodology, what does DMAIC represent?',
          options: ['Define Measure Analyze Improve Control', 'Develop Manage Assess Integrate Communicate', 'Design Manufacture Assemble Install Check', 'Determine Monitor Analyze Investigate Conclude', 'Deploy Measure Adapt Implement Confirm']
        },
        {
          id: 'A_S009',
          question: 'Which research methodology provides deepest insights into complex organizational behavior?',
          options: ['Quantitative surveys exclusively', 'Mixed-methods combining qualitative and quantitative', 'Observational studies only', 'Secondary data analysis', 'Focus groups exclusively']
        },
        {
          id: 'A_S010',
          question: 'In crisis communication, the most critical first step is:',
          options: ['Identify responsible parties', 'Develop consistent messaging strategy', 'Control media narrative', 'Minimize legal exposure', 'Delegate to PR agency']
        },
        {
          id: 'A_S011',
          question: 'Which negotiation strategy is most effective in complex multi-party deals?',
          options: ['Competitive win-lose approach', 'Collaborative value-creation approach', 'Accommodating relationship-first approach', 'Avoiding confrontational approach', 'Compromising split-difference approach']
        },
        {
          id: 'A_S012',
          question: 'In data governance, what is the primary purpose of establishing data lineage?',
          options: ['Improve data processing speed', 'Track data origin transformation and usage', 'Reduce storage costs', 'Enhance user interface design', 'Simplify database architecture']
        },
        {
          id: 'A_S013',
          question: 'Which strategic framework best addresses disruptive innovation threats?',
          options: ['SWOT Analysis', 'Blue Ocean Strategy', 'Porter\'s Five Forces', 'Balanced Scorecard', 'McKinsey 7S Model']
        },
        {
          id: 'A_S014',
          question: 'Calculate economic value added (EVA): NOPAT ₹5M, WACC 12%, Capital ₹30M:',
          options: ['₹1.4M', '₹1.6M', '₹1.8M', '₹2.0M', '₹2.2M']
        },
        {
          id: 'A_S015',
          question: 'In agile transformation, what is the most critical organizational capability?',
          options: ['Technical infrastructure', 'Cultural mindset shift', 'Process documentation', 'Tool implementation', 'Training completion']
        },
        {
          id: 'A_S016',
          question: 'Which approach best ensures sustainable competitive advantage?',
          options: ['Cost leadership exclusively', 'Differentiation through innovation and customer value', 'Market share maximization', 'Operational efficiency focus', 'Price competition strategies']
        },
        {
          id: 'A_S017',
          question: 'In talent development, what creates highest ROI for organizations?',
          options: ['Generic training programs', 'Personalized development aligned with business strategy', 'External certification programs', 'Team building activities', 'Mentoring programs only']
        },
        {
          id: 'A_S018',
          question: 'Which risk management approach is most comprehensive for complex projects?',
          options: ['Risk avoidance exclusively', 'Integrated risk assessment with mitigation strategies', 'Insurance coverage only', 'Contingency planning', 'Risk transfer mechanisms']
        },
        {
          id: 'A_S019',
          question: 'In digital transformation, the most critical success factor is:',
          options: ['Technology platform selection', 'Change management and user adoption', 'Budget allocation', 'Vendor relationships', 'Timeline adherence']
        }
      ],

        Cognitive: [
        {
          id: 'A_C001',
          question: 'In the sequence 2, 6, 18, 54, 162, what is the underlying mathematical relationship?',
          options: ['Multiply by 3', 'Add 4 then multiply by 3', 'Multiply by 3 consistently', 'Add consecutive squares', 'Multiple by increasing factors']
        },
        {
          id: 'A_C002',
          question: 'Given: All innovative companies embrace failure. Some successful companies are innovative. Therefore:',
          options: ['All successful companies embrace failure', 'Some successful companies may embrace failure', 'No successful companies embrace failure', 'All companies that embrace failure are successful', 'Some innovative companies are not successful']
        },
        {
          id: 'A_C003',
          question: 'Which data point is most significant outlier in ROI analysis: 15%, 18%, 22%, 45%, 19%, 21%?',
          options: ['15%', '18%', '22%', '45%', '21%']
        },
        {
          id: 'A_C004',
          question: 'A merger creates 25% synergies on combined revenue of ₹800M. If Company A contributes 60%, what are Company A\'s synergies?',
          options: ['₹120M', '₹150M', '₹180M', '₹200M', '₹240M']
        },
        {
          id: 'A_C005',
          question: 'In game theory, what is the optimal strategy when facing prisoner\'s dilemma in repeated interactions?',
          options: ['Always cooperate', 'Always defect', 'Tit-for-tat strategy', 'Random strategy', 'Always compromise']
        },
        {
          id: 'A_C006',
          question: 'Complete the strategic analogy: Disruption : Innovation :: Optimization : ?',
          options: ['Efficiency', 'Transformation', 'Evolution', 'Standardization', 'Integration']
        },
        {
          id: 'A_C007',
          question: 'If market penetration is 15% and addressable market is ₹2B, what\'s the revenue potential with 40% market share of penetration?',
          options: ['₹120M', '₹150M', '₹200M', '₹240M', '₹300M']
        },
        {
          id: 'A_C008',
          question: 'Which conclusion is most valid? Premise: Digital transformation requires cultural change to succeed:',
          options: ['All technology implementations need cultural change', 'Cultural change guarantees digital success', 'Some digital transformations may fail without cultural change', 'Cultural change is sufficient for digital transformation', 'Technology is more important than culture']
        },
        {
          id: 'A_C009',
          question: 'In organizational network analysis, what indicates highest influence potential?',
          options: ['Centrality measures', 'Betweenness centrality', 'Degree centrality', 'Closeness centrality', 'Eigenvector centrality']
        },
        {
          id: 'A_C010',
          question: 'Find the pattern: Alpha 100, Beta 200, Gamma 300, Delta ?',
          options: ['350', '400', '450', '500', '550']
        },
        {
          id: 'A_C011',
          question: 'NPV calculation: Cash flows ₹200K, ₹300K, ₹400K over 3 years, discount rate 10%:',
          options: ['₹743K', '₹789K', '₹834K', '₹876K', '₹923K']
        },
        {
          id: 'A_C012',
          question: 'Which statement represents strongest causal inference? Correlation between training and performance is 0.8:',
          options: ['Training causes improved performance', 'Performance improvement causes more training', 'Strong relationship exists requiring further analysis', 'Training and performance are perfectly related', 'Both variables influence each other equally']
        },
        {
          id: 'A_C013',
          question: 'In supply chain optimization, what is the optimal order quantity using EOQ model? Demand 10,000 units, Order cost ₹500, Holding cost ₹50 per unit:',
          options: ['1000 units', '1414 units', '2000 units', '2236 units', '3162 units']
        },
        {
          id: 'A_C014',
          question: 'Complete: Agility : Adaptation :: Resilience : ?',
          options: ['Recovery', 'Strength', 'Flexibility', 'Endurance', 'Stability']
        },
        {
          id: 'A_C015',
          question: 'Monte Carlo simulation with 10,000 iterations shows 68% probability of success. What\'s the confidence interval?',
          options: ['±5%', '±10%', '±15%', '±20%', '±25%']
        }
      ],

        Situational: [
        {
          id: 'A_T001',
          question: 'Your organization faces potential bankruptcy while stakeholders expect growth projections. You:',
          options: ['Provide optimistic projections to maintain confidence', 'Present realistic scenarios with recovery strategies', 'Focus only on positive indicators', 'Delay disclosure until situation improves', 'Transfer responsibility to board of directors']
        },
        {
          id: 'A_T002',
          question: 'A key client demands unethical practices threatening a $10M contract. You:',
          options: ['Comply to preserve business relationship', 'Refuse and accept contract loss', 'Negotiate alternative approaches that meet their needs ethically', 'Report them to regulatory authorities', 'Delegate decision to sales team']
        },
        {
          id: 'A_T003',
          question: 'Your innovative strategy receives strong opposition from senior leadership and board. You:',
          options: ['Abandon strategy to maintain relationships', 'Implement strategy despite opposition', 'Build coalition and present compelling business case', 'Compromise on key strategic elements', 'Seek external validation before proceeding']
        },
        {
          id: 'A_T004',
          question: 'Industry disruption threatens your organization\'s core business model within 24 months. You:',
          options: ['Continue current operations while monitoring', 'Immediately pivot to new business model', 'Acquire disruptive competitors', 'Accelerate innovation while strengthening core business', 'Focus on cost reduction and efficiency']
        },
        {
          id: 'A_T005',
          question: 'Your data analysis reveals that current growth strategy will fail in 18 months. You:',
          options: ['Continue strategy and hope for market changes', 'Immediately halt all growth initiatives', 'Develop alternative strategies while managing current one', 'Share findings with competitors', 'Focus on short-term revenue maximization']
        },
        {
          id: 'A_T006',
          question: 'A major acquisition opportunity arises but requires significant debt and cultural integration risks. You:',
          options: ['Proceed with acquisition for growth', 'Reject due to financial risks', 'Conduct thorough due diligence and develop integration plan', 'Seek joint venture instead', 'Acquire smaller companies instead']
        },
        {
          id: 'A_T007',
          question: 'Key talent threatens to leave taking critical knowledge and client relationships. You:',
          options: ['Offer immediate salary increases', 'Accept their departure and hire replacements', 'Develop comprehensive retention and knowledge transfer strategies', 'Report them for potential non-compete violations', 'Counteroffer with competitor information']
        },
        {
          id: 'A_T008',
          question: 'Regulatory changes require fundamental shifts in operations within 6 months. You:',
          options: ['Challenge regulations through legal action', 'Comply minimally to meet requirements', 'Develop comprehensive transformation plan exceeding requirements', 'Delay implementation until enforcement', 'Lobby for regulation modifications']
        },
        {
          id: 'A_T009',
          question: 'Your research contradicts widely accepted industry practices supported by major consulting firms. You:',
          options: ['Conform to industry consensus', 'Aggressively promote contrary findings', 'Conduct additional research and engage thought leaders', 'Keep findings confidential', 'Publish anonymously']
        },
        {
          id: 'A_T010',
          question: 'Global economic crisis impacts all business units requiring 30% cost reduction immediately. You:',
          options: ['Implement across-the-board cuts', 'Eliminate lowest performing units', 'Develop strategic cost optimization preserving core capabilities', 'Freeze all operations temporarily', 'Sell non-core assets immediately']
        },
        {
          id: 'A_T011',
          question: 'Board pressures for short-term results conflict with necessary long-term investments for sustainability. You:',
          options: ['Prioritize short-term results exclusively', 'Focus only on long-term vision', 'Develop balanced approach demonstrating near-term progress toward long-term goals', 'Educate board on long-term thinking', 'Seek new board members']
        }
      ],

        Values: [
        {
          id: 'A_V001',
          question: 'In executive decision-making you prioritize:',
          options: ['Maximizing shareholder value', 'Balancing stakeholder interests sustainably', 'Maintaining personal reputation', 'Following industry best practices', 'Achieving immediate performance targets']
        },
        {
          id: 'A_V002',
          question: 'Your ideal organizational culture emphasizes:',
          options: ['High performance and results', 'Innovation and calculated risk-taking', 'Collaboration and inclusive decision-making', 'Stability and operational excellence', 'Agility and continuous adaptation']
        },
        {
          id: 'A_V003',
          question: 'When facing complex strategic decisions you rely most on:',
          options: ['Quantitative data and analytics', 'Intuition and experience', 'Stakeholder consultation and consensus', 'External expert opinions', 'Historical precedents and benchmarks']
        },
        {
          id: 'A_V004',
          question: 'True professional legacy involves:',
          options: ['Building profitable enterprises', 'Developing future leaders and organizational capabilities', 'Achieving industry recognition', 'Creating innovative solutions', 'Accumulating personal wealth']
        },
        {
          id: 'A_V005',
          question: 'You prefer leading initiatives that:',
          options: ['Generate measurable ROI quickly', 'Transform industries and create new paradigms', 'Build sustainable competitive advantages', 'Solve complex societal challenges', 'Establish market dominance']
        },
        {
          id: 'A_V006',
          question: 'Your leadership philosophy centers on:',
          options: ['Driving results through accountability', 'Empowering others to achieve extraordinary outcomes', 'Maintaining control and oversight', 'Building consensus and alignment', 'Setting vision and inspiring transformation']
        },
        {
          id: 'A_V007',
          question: 'You feel most professionally fulfilled when:',
          options: ['Exceeding financial performance targets', 'Solving complex strategic challenges', 'Developing exceptional talent', 'Creating lasting organizational change', 'Gaining industry thought leadership']
        },
        {
          id: 'A_V008',
          question: 'In stakeholder relationships you emphasize:',
          options: ['Clear contractual arrangements', 'Mutual value creation and trust', 'Professional boundaries and protocols', 'Long-term partnership development', 'Strategic alliance building']
        },
        {
          id: 'A_V009',
          question: 'When organizational values conflict with performance pressure you:',
          options: ['Prioritize performance results', 'Maintain values regardless of consequences', 'Seek creative solutions honoring both', 'Escalate decision to board level', 'Adapt values to circumstances']
        },
        {
          id: 'A_V010',
          question: 'You prefer feedback that:',
          options: ['Focuses on quantitative performance metrics', 'Provides strategic perspective and development insights', 'Comes from multiple stakeholder perspectives', 'Emphasizes leadership impact and influence', 'Includes external benchmarking and recognition']
        },
        {
          id: 'A_V011',
          question: 'Ultimate career satisfaction comes from:',
          options: ['Achieving financial independence and security', 'Creating transformational impact on organizations and people', 'Becoming recognized thought leader in your field', 'Building successful enterprises and ventures', 'Developing next generation of leaders']
        }
      ]
    };

  
    // Return questions based on education level
    const levelMap = {
      'intermediate-10th': foundationQuestions,
      'intermediate-11th': foundationQuestions,
      'intermediate-12th': foundationQuestions,
      'diploma': intermediateQuestions,
      'bachelors': intermediateQuestions,
      'masters': advancedQuestions,
      'phd': advancedQuestions
    };

    return levelMap[userEducationLevel] || foundationQuestions;
  };

  const assessmentQuestions = getAllAssessmentQuestions();

  const handleStartTest = (testId) => {
    console.log(`Starting test: ${testId}`);
    setActiveTest(testId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveTest(null);
  };

  const handleTestComplete = (testId, results) => {
    console.log(`✅ Test "${testId}" completed with results:`, results);
    setShowModal(false);
    setActiveTest(null);
    
    // Add test to completed set (prevents duplicates)
    setCompletedTests(prev => new Set([...prev, testId]));
    
    // Update test status to completed - find and update the test
    const testIndex = tests.findIndex(test => test.id === testId);
    if (testIndex !== -1) {
      tests[testIndex].status = 'completed';
    }
  };

  const totalTests = tests.length;
  const completedCount = completedTests.size; // Use Set size for unique count
  const progressPercentage = (completedCount / totalTests) * 100;

  return (
    <div className="test-cards-container">
      <div className="section-header">
        <h2>Career Assessment Tests</h2>
        <p>Complete all assessments to get personalized career recommendations tailored to your profile</p>
        {hasEducationLevel() && (
          <div className="level-info">
            <span className="level-badge">{questionLevel} Level</span>
            <span className="level-detail">Based on: {userEducationLevel}</span>
          </div>
        )}
      </div>

      {!hasEducationLevel() && (
        <div className="education-warning">
          <div className="warning-content">
            <span className="warning-icon">⚠️</span>
            <div className="warning-text">
              <h4>Complete Your Profile First</h4>
              <p>Please set your education level in your profile to get personalized assessment questions.</p>
            </div>
          </div>
        </div>
      )}

      <div className="progress-overview">
        <div className="progress-stats">
          <div className="progress-stat">
            <span className="stat-number">{completedCount}/{totalTests}</span>
            <span className="stat-label">Tests Completed</span>
          </div>
          <div className="progress-stat">
            <span className="stat-number">{Math.round(progressPercentage)}%</span>
            <span className="stat-label">Overall Progress</span>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="test-cards-grid">
        {tests.map((test) => (
          <div key={test.id} className="test-card">
            <div className="test-card-header">
              <div 
                className="test-icon" 
                style={{ backgroundColor: test.color }}
              >
                {test.icon}
              </div>
              <div className="test-meta">
                <span className="test-category">{test.category}</span>
                <span className={`status-badge ${completedTests.has(test.id) ? 'completed' : test.status}`}>
                  {completedTests.has(test.id) ? 'Completed' : 
                   test.status === 'not-started' ? 'Not Started' : 
                   test.status === 'in-progress' ? 'In Progress' : 'Completed'}
                </span>
              </div>
            </div>

            <div className="test-content">
              <h3>{test.title}</h3>
              <p>{test.description}</p>
              
              <div className="test-details">
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <span>{test.duration}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📝</span>
                  <span>{test.questions} questions</span>
                </div>
              </div>
            </div>

            <div className="test-actions">
              <button 
                className={`start-test-btn ${completedTests.has(test.id) ? 'completed' : ''}`}
                onClick={() => handleStartTest(test.id)}
                style={{ backgroundColor: completedTests.has(test.id) ? '#48bb78' : test.color }}
                disabled={completedTests.has(test.id)}
              >
                <span>
                  {completedTests.has(test.id) ? 'Completed ✓' : 'Start Assessment'}
                </span>
                {!completedTests.has(test.id) && <span className="btn-arrow">→</span>}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="completion-message">
        <div className="message-icon">🎓</div>
        <h3>Ready to discover your perfect career?</h3>
        <p>Complete all assessments above to unlock personalized career recommendations, detailed analysis, and curated learning paths.</p>
      </div>

      {/* Test Modal - Shows your complete education-level questions */}
      {showModal && activeTest && hasEducationLevel() && (
        <CompleteTestModal
          testType={activeTest}
          testData={tests.find(t => t.id === activeTest)}
          questions={assessmentQuestions[activeTest] || []}
          questionLevel={questionLevel}
          onClose={handleCloseModal}
          onComplete={(results) => handleTestComplete(activeTest, results)}
        />
      )}
    </div>
  );
};

// UPDATED Modal Component - Ready to Submit as clickable button
const CompleteTestModal = ({ testType, testData, questions, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime] = useState(Date.now());

  // Safety checks - prevent undefined errors
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="test-modal modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>⚠️ No questions available</h3>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
          <div className="question-container">
            <p>Questions for {testType} test are not loaded properly.</p>
            <div className="modal-navigation">
              <button onClick={onClose} className="next-btn">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure currentQuestion is within bounds
  const safeCurrentQuestion = Math.max(0, Math.min(currentQuestion, questions.length - 1));
  const currentQ = questions[safeCurrentQuestion];

  if (!currentQ || !currentQ.options || !Array.isArray(currentQ.options)) {
    return (
      <div className="test-modal modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>⚠️ Question data error</h3>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
          <div className="question-container">
            <p>There's an issue with question {safeCurrentQuestion + 1} data.</p>
            <div className="modal-navigation">
              <button onClick={onClose} className="next-btn">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswer = (questionId, answerIndex) => {
    if (!currentQ || !currentQ.options || answerIndex >= currentQ.options.length) return;
    
    setAnswers({ 
      ...answers, 
      [questionId]: {
        questionId,
        selectedOption: answerIndex,
        selectedAnswer: currentQ.options[answerIndex]
      }
    });
  };

  const handlePrevious = () => {
    if (safeCurrentQuestion > 0) {
      setCurrentQuestion(safeCurrentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (safeCurrentQuestion < questions.length - 1) {
      setCurrentQuestion(safeCurrentQuestion + 1);
    } else {
      handleSubmitTest();
    }
  };

  const handleSubmitTest = () => {
    const answeredCount = Object.keys(answers).length;
    const minRequired = Math.min(8, Math.ceil(questions.length * 0.4)); // At least 8 or 40% of questions

    if (answeredCount < minRequired) {
      alert(`Please answer at least ${minRequired} questions before submitting the test. You have answered ${answeredCount} questions.`);
      return;
    }

    // Test completed
    const timeTaken = Math.round((Date.now() - startTime) / 60000);
    const results = {
      testType,
      responses: Object.values(answers),
      timeTaken,
      completionDate: new Date().toISOString(),
      totalQuestions: questions.length,
      answeredQuestions: answeredCount
    };
    
    console.log(`🎉 ${testType} Test submitted! Answered ${answeredCount}/${questions.length} questions`, results);
    onComplete(results);
  };

  const handleJumpToQuestion = (questionIndex) => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setCurrentQuestion(questionIndex);
    }
  };

  const isFirstQuestion = safeCurrentQuestion === 0;
  const isLastQuestion = safeCurrentQuestion === questions.length - 1;
  const isAnswered = answers[currentQ?.id] !== undefined;
  const answeredCount = Object.keys(answers).length;
  const minRequired = Math.min(8, Math.ceil(questions.length * 0.4));
  const canSubmit = answeredCount >= minRequired;

  return (
    <div className="test-modal modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{testData?.icon || '📝'} {testData?.title || testType}</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar-modal">
            <div 
              className="progress-fill-modal" 
              style={{ width: `${((safeCurrentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text-modal">
            Question {safeCurrentQuestion + 1} of {questions.length} ({Math.round(((safeCurrentQuestion + 1) / questions.length) * 100)}%)
          </div>
        </div>
        
        <div className="question-container">
          <div className="question-header">
            <span className="question-number">Question {safeCurrentQuestion + 1}</span>
            <span className="question-category">{testData?.category || testType}</span>
          </div>
          
          <h3 className="question-text">{currentQ.question}</h3>
          
          <div className="options-list">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${answers[currentQ.id] && answers[currentQ.id].selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQ.id, index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {answers[currentQ.id] && answers[currentQ.id].selectedOption === index && <span className="check-mark">✓</span>}
              </button>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div className="modal-navigation">
            <button 
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="prev-btn"
            >
              ← Previous
            </button>
            
            {/* Question Indicators */}
            <div className="question-indicators">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === safeCurrentQuestion ? 'current' : ''} ${answers[questions[index]?.id] ? 'answered' : ''}`}
                  onClick={() => handleJumpToQuestion(index)}
                  title={`Question ${index + 1}`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              disabled={!isAnswered}
              className="next-btn"
            >
              {isLastQuestion ? 'Submit Test ✓' : 'Next →'}
            </button>
          </div>

          {/* Answer Status - CLICKABLE Ready to Submit Button */}
          <div className="answer-status">
            <span>Answered: {answeredCount}/{questions.length} (Minimum {minRequired} required)</span>
            {/* CLICKABLE Ready to Submit Button with inline styles as fallback */}
            <button
              onClick={handleSubmitTest}
              disabled={!canSubmit}
              className={`ready-submit-btn ${canSubmit ? 'ready' : 'pending'}`}
              style={{
                // Inline styles as fallback
                background: canSubmit 
                  ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' 
                  : 'linear-gradient(135deg, #f87171 0%, #fca5a5 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: canSubmit 
                  ? '0 4px 12px rgba(16, 185, 129, 0.25), 0 2px 4px rgba(16, 185, 129, 0.1)' 
                  : '0 3px 10px rgba(248, 113, 113, 0.2), 0 1px 3px rgba(248, 113, 113, 0.1)',
                opacity: canSubmit ? '1' : '0.8'
              }}
              onMouseEnter={(e) => {
                if (canSubmit) {
                  e.target.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.35), 0 4px 8px rgba(16, 185, 129, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (canSubmit) {
                  e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
                  e.target.style.transform = 'translateY(0px) scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25), 0 2px 4px rgba(16, 185, 129, 0.1)';
                }
              }}
              onMouseDown={(e) => {
                if (canSubmit) {
                  e.target.style.transform = 'translateY(0px) scale(0.98)';
                }
              }}
              onMouseUp={(e) => {
                if (canSubmit) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                }
              }}
            >
              {canSubmit ? '✓ Ready to Submit' : `⏳ Need ${minRequired - answeredCount} more answers`}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TestCards;