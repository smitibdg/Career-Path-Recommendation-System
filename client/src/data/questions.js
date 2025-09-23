// Complete question bank from your DS2A_Assessment_Questions.csv
export const assessmentQuestions = {
  Personality: [
    {
      id: 'P001',
      question: 'I enjoy meeting new people and making conversation',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Extraversion',
      scoring: 'likert_scale'
    },
    {
      id: 'P002',
      question: 'I prefer working alone rather than in groups',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Extraversion',
      scoring: 'likert_reverse'
    },
    {
      id: 'P003',
      question: 'I feel energized after spending time with others',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Extraversion',
      scoring: 'likert_scale'
    },
    {
      id: 'P004',
      question: 'I often take charge in group situations',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Extraversion',
      scoring: 'likert_scale'
    },
    {
      id: 'P005',
      question: 'I enjoy being the center of attention',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Extraversion',
      scoring: 'likert_scale'
    },
    {
      id: 'P006',
      question: 'I am always prepared and organized',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Conscientiousness',
      scoring: 'likert_scale'
    },
    {
      id: 'P007',
      question: 'I pay attention to details',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Conscientiousness',
      scoring: 'likert_scale'
    },
    {
      id: 'P008',
      question: 'I get chores done right away',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Conscientiousness',
      scoring: 'likert_scale'
    },
    {
      id: 'P009',
      question: 'I follow a schedule',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Conscientiousness',
      scoring: 'likert_scale'
    },
    {
      id: 'P010',
      question: 'I am exacting in my work',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Conscientiousness',
      scoring: 'likert_scale'
    },
    {
      id: 'P011',
      question: 'I enjoy exploring new ideas and concepts',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Openness',
      scoring: 'likert_scale'
    },
    {
      id: 'P012',
      question: 'I am quick to understand things',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Openness',
      scoring: 'likert_scale'
    },
    {
      id: 'P013',
      question: 'I use difficult words',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Openness',
      scoring: 'likert_scale'
    },
    {
      id: 'P014',
      question: 'I am full of ideas',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Openness',
      scoring: 'likert_scale'
    },
    {
      id: 'P015',
      question: 'I handle tasks efficiently',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Openness',
      scoring: 'likert_scale'
    },
    {
      id: 'P016',
      question: 'I try to be helpful and considerate to others',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Agreeableness',
      scoring: 'likert_scale'
    },
    {
      id: 'P017',
      question: 'I have a soft heart',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Agreeableness',
      scoring: 'likert_scale'
    },
    {
      id: 'P018',
      question: 'I take time out for others',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Agreeableness',
      scoring: 'likert_scale'
    },
    {
      id: 'P019',
      question: 'I feel others\' emotions',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Agreeableness',
      scoring: 'likert_scale'
    },
    {
      id: 'P020',
      question: 'I make people feel at ease',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Agreeableness',
      scoring: 'likert_scale'
    },
    {
      id: 'P021',
      question: 'I often feel anxious or worried',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Neuroticism',
      scoring: 'likert_scale'
    },
    {
      id: 'P022',
      question: 'I get irritated easily',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Neuroticism',
      scoring: 'likert_scale'
    },
    {
      id: 'P023',
      question: 'I get stressed out easily',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Neuroticism',
      scoring: 'likert_scale'
    },
    {
      id: 'P024',
      question: 'I worry about things',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Neuroticism',
      scoring: 'likert_scale'
    },
    {
      id: 'P025',
      question: 'I get upset easily',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      trait: 'Neuroticism',
      scoring: 'likert_scale'
    }
  ],

  Cognitive: [
    {
      id: 'C001',
      question: 'What comes next in the sequence: 2, 6, 18, 54, ?',
      options: ['108', '162', '216', '324'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'C002',
      question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
      options: ['1 minute', '5 minutes', '20 minutes', '100 minutes'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'C003',
      question: 'A bat and ball cost ₹110 in total. The bat costs ₹100 more than the ball. How much does the ball cost?',
      options: ['₹5', '₹10', '₹15', '₹55'],
      correctAnswer: 0,
      scoring: 'binary'
    },
    {
      id: 'C004',
      question: 'What is the missing number: 3, 7, 13, 21, 31, ?',
      options: ['43', '45', '47', '49'],
      correctAnswer: 0,
      scoring: 'binary'
    },
    {
      id: 'C005',
      question: 'If all roses are flowers and some flowers are red, which statement is necessarily true?',
      options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Some flowers are roses'],
      correctAnswer: 3,
      scoring: 'binary'
    },
    {
      id: 'C006',
      question: 'Which number is different from the others: 121, 144, 169, 196, 225?',
      options: ['121', '144', '169', '196'],
      correctAnswer: 3,
      scoring: 'binary'
    },
    {
      id: 'C007',
      question: 'Complete the analogy: Book is to Reading as Fork is to ?',
      options: ['Writing', 'Eating', 'Cooking', 'Kitchen'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'C008',
      question: 'What is 15% of 240?',
      options: ['30', '36', '40', '45'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'C009',
      question: 'Which comes next in the pattern: A1, B4, C9, D16, ?',
      options: ['E20', 'E25', 'F25', 'E24'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'C010',
      question: 'If you rearrange the letters \'CIFAIPC\' you would get the name of a:',
      options: ['Ocean', 'Country', 'City', 'River'],
      correctAnswer: 0,
      scoring: 'binary'
    },
    {
      id: 'C011',
      question: 'What is the next number: 1, 4, 9, 16, 25, ?',
      options: ['30', '35', '36', '49'],
      correctAnswer: 2,
      scoring: 'binary'
    },
    {
      id: 'C012',
      question: 'Mary is 16. She is 4 times older than her brother. How old will Mary be when she is twice as old as her brother?',
      options: ['20', '24', '28', '32'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'C013',
      question: 'Which word does not belong: Dog, Cat, Bird, Car?',
      options: ['Dog', 'Cat', 'Bird', 'Car'],
      correctAnswer: 3,
      scoring: 'binary'
    },
    {
      id: 'C014',
      question: 'If 2 + 3 = 10, 6 + 5 = 66, 8 + 4 = 96, then 7 + 2 = ?',
      options: ['63', '72', '81', '90'],
      correctAnswer: 0,
      scoring: 'binary'
    },
    {
      id: 'C015',
      question: 'What comes next: Monday, Wednesday, Friday, ?',
      options: ['Saturday', 'Sunday', 'Tuesday', 'Thursday'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'C016',
      question: 'Complete: Fire is to Heat as Ice is to ?',
      options: ['Water', 'Winter', 'Cold', 'Frozen'],
      correctAnswer: 2,
      scoring: 'binary'
    },
    {
      id: 'C017',
      question: 'Which number should replace the question mark: 2, 6, 12, 20, 30, ?',
      options: ['40', '42', '44', '48'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'C018',
      question: 'If all birds can fly and penguins are birds, what can we conclude?',
      options: ['Penguins can fly', 'Some birds cannot fly', 'The premise is false', 'All of the above'],
      correctAnswer: 2,
      scoring: 'binary'
    },
    {
      id: 'C019',
      question: 'What is the odd one out: 8, 27, 64, 125, 216?',
      options: ['8', '27', '64', '125'],
      correctAnswer: 0,
      scoring: 'binary'
    },
    {
      id: 'C020',
      question: 'Complete the series: Z, Y, X, W, V, ?',
      options: ['U', 'T', 'S', 'R'],
      correctAnswer: 0,
      scoring: 'binary'
    }
  ],

  Skills: [
    {
      id: 'S001',
      question: 'What does HTML stand for?',
      options: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language', 'None of the above'],
      correctAnswer: 0,
      scoring: 'binary'
    },
    {
      id: 'S002',
      question: 'Which programming language is known as the \'language of the web\'?',
      options: ['Python', 'JavaScript', 'Java', 'C++'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S003',
      question: 'What does SQL stand for?',
      options: ['Structured Query Language', 'Simple Question Language', 'Standard Query Logic', 'System Query Language'],
      correctAnswer: 0,
      scoring: 'binary'
    },
    {
      id: 'S004',
      question: 'Which of the following is a NoSQL database?',
      options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'],
      correctAnswer: 2,
      scoring: 'binary'
    },
    {
      id: 'S005',
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S006',
      question: 'Which HTTP method is used to update data?',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      correctAnswer: 2,
      scoring: 'binary'
    },
    {
      id: 'S007',
      question: 'What does API stand for?',
      options: ['Application Programming Interface', 'Automated Program Instruction', 'Advanced Programming Integration', 'None of the above'],
      correctAnswer: 0,
      scoring: 'binary'
    },
    {
      id: 'S008',
      question: 'Which is NOT a principle of Object-Oriented Programming?',
      options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Compilation'],
      correctAnswer: 3,
      scoring: 'binary'
    },
    {
      id: 'S009',
      question: 'What is the correct way to declare a variable in Python?',
      options: ['var x = 5', 'int x = 5', 'x = 5', 'declare x = 5'],
      correctAnswer: 2,
      scoring: 'binary'
    },
    {
      id: 'S010',
      question: 'Which data structure follows LIFO principle?',
      options: ['Queue', 'Stack', 'Array', 'Tree'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S011',
      question: 'What is the most important element of effective communication?',
      options: ['Speaking loudly', 'Using complex words', 'Active listening', 'Fast talking'],
      correctAnswer: 2,
      scoring: 'binary'
    },
    {
      id: 'S012',
      question: 'Which is the best way to handle workplace conflict?',
      options: ['Avoid the person', 'Discuss the issue directly', 'Complain to others', 'Ignore the problem'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S013',
      question: 'What does \'emotional intelligence\' primarily involve?',
      options: ['High IQ', 'Managing emotions', 'Technical skills', 'Memory'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S014',
      question: 'Which is most important in teamwork?',
      options: ['Individual brilliance', 'Clear communication', 'Competition', 'Independence'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S015',
      question: 'What does ROI stand for in business?',
      options: ['Return on Investment', 'Rate of Interest', 'Range of Income', 'Risk of Investment'],
      correctAnswer: 0,
      scoring: 'binary'
    },
    {
      id: 'S016',
      question: 'Which is a key component of project management?',
      options: ['Only technical skills', 'Planning and execution', 'Working alone', 'Avoiding deadlines'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S017',
      question: 'What is market research primarily used for?',
      options: ['Increasing costs', 'Understanding customer needs', 'Reducing employees', 'Eliminating competition'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S018',
      question: 'In Excel, what function calculates the average?',
      options: ['SUM', 'AVERAGE', 'MEAN', 'CALC'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S019',
      question: 'Which is a version control system?',
      options: ['Microsoft Word', 'Git', 'Photoshop', 'Excel'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S020',
      question: 'What does UX stand for in design?',
      options: ['User Experience', 'User Extension', 'Universal Exchange', 'Unified Extension'],
      correctAnswer: 0,
      scoring: 'binary'
    },
    {
      id: 'S021',
      question: 'Which is most important in problem-solving?',
      options: ['Speed', 'Methodology', 'Guessing', 'Avoiding complexity'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S022',
      question: 'What is data visualization used for?',
      options: ['Hiding information', 'Making data understandable', 'Complicating analysis', 'Reducing data'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S023',
      question: 'Which best describes critical thinking?',
      options: ['Quick decisions', 'Careful analysis', 'Following others', 'Avoiding questions'],
      correctAnswer: 1,
      scoring: 'binary'
    },
    {
      id: 'S024',
      question: 'In statistics, what is the \'mean\'?',
      options: ['Most frequent value', 'Middle value', 'Average value', 'Highest value'],
      correctAnswer: 2,
      scoring: 'binary'
    },
    {
      id: 'S025',
      question: 'What is the primary purpose of A/B testing?',
      options: ['Confusing users', 'Comparing two versions', 'Reducing options', 'Eliminating features'],
      correctAnswer: 1,
      scoring: 'binary'
    }
  ],

  Situational: [
    {
      id: 'SJ001',
      question: 'You\'re assigned to a team project but one member isn\'t contributing. What do you do?',
      options: ['Report them to supervisor immediately', 'Do their work yourself', 'Talk to them privately first', 'Ignore the situation'],
      bestAnswer: 2,
      scoring: 'situational'
    },
    {
      id: 'SJ002',
      question: 'You discover a mistake in your completed work just before the deadline. You:',
      options: ['Submit it as is', 'Fix it even if it delays submission', 'Ask for extension', 'Blame external factors'],
      bestAnswer: 1,
      scoring: 'situational'
    },
    {
      id: 'SJ003',
      question: 'Your manager asks you to do something you believe is unethical. You:',
      options: ['Do it without question', 'Refuse immediately', 'Discuss your concerns', 'Quit your job'],
      bestAnswer: 2,
      scoring: 'situational'
    },
    {
      id: 'SJ004',
      question: 'You\'re overwhelmed with work and can\'t meet a deadline. You:',
      options: ['Work overnight to finish', 'Prioritize most important tasks', 'Ask for help', 'Submit incomplete work'],
      bestAnswer: 1,
      scoring: 'situational'
    },
    {
      id: 'SJ005',
      question: 'A customer is very angry about a service issue. Your first response:',
      options: ['Defend company policy', 'Listen to their concerns', 'Transfer to supervisor', 'Argue with them'],
      bestAnswer: 1,
      scoring: 'situational'
    },
    {
      id: 'SJ006',
      question: 'You disagree with your team\'s decision on a project approach. You:',
      options: ['Go along with majority', 'Present your alternative', 'Work independently', 'Complain privately'],
      bestAnswer: 1,
      scoring: 'situational'
    },
    {
      id: 'SJ007',
      question: 'You notice a colleague consistently arriving late. You:',
      options: ['Report them immediately', 'Mind your own business', 'Offer to help them', 'Talk to them about it'],
      bestAnswer: 1,
      scoring: 'situational'
    },
    {
      id: 'SJ008',
      question: 'You\'re asked to present to senior management tomorrow but feel unprepared. You:',
      options: ['Call in sick', 'Present anyway', 'Ask for more time', 'Delegate to someone else'],
      bestAnswer: 2,
      scoring: 'situational'
    },
    {
      id: 'SJ009',
      question: 'You receive harsh criticism on your work. You:',
      options: ['Get defensive', 'Listen and ask for specifics', 'Dismiss the feedback', 'Blame others'],
      bestAnswer: 1,
      scoring: 'situational'
    },
    {
      id: 'SJ010',
      question: 'A new team member is struggling with their tasks. You:',
      options: ['Let them figure it out', 'Complain to supervisor', 'Offer assistance', 'Do their work'],
      bestAnswer: 2,
      scoring: 'situational'
    },
    {
      id: 'SJ011',
      question: 'You have access to confidential information that could help a friend. You:',
      options: ['Share it discreetly', 'Keep it confidential', 'Hint at the information', 'Ask your supervisor'],
      bestAnswer: 1,
      scoring: 'situational'
    },
    {
      id: 'SJ012',
      question: 'You realize you don\'t have the skills needed for a new assignment. You:',
      options: ['Pretend you know how', 'Admit it and ask for training', 'Try to figure it out yourself', 'Delegate to others'],
      bestAnswer: 1,
      scoring: 'situational'
    },
    {
      id: 'SJ013',
      question: 'Two colleagues are in conflict affecting team productivity. You:',
      options: ['Take sides with one', 'Stay completely neutral', 'Facilitate communication', 'Report to management'],
      bestAnswer: 2,
      scoring: 'situational'
    },
    {
      id: 'SJ014',
      question: 'You\'re offered a promotion but it requires relocating. You:',
      options: ['Accept immediately', 'Decline immediately', 'Discuss with family first', 'Negotiate terms'],
      bestAnswer: 2,
      scoring: 'situational'
    },
    {
      id: 'SJ015',
      question: 'You discover your company is losing money due to inefficiency. You:',
      options: ['Ignore it', 'Document and report findings', 'Gossip about it', 'Look for new job'],
      bestAnswer: 1,
      scoring: 'situational'
    }
  ],

  Values: [
    {
      id: 'V001',
      question: 'What motivates you most in a career?',
      options: ['High salary and benefits', 'Personal growth and learning', 'Helping others and society', 'Recognition and status'],
      scoring: 'values'
    },
    {
      id: 'V002',
      question: 'Your ideal work environment is:',
      options: ['Highly competitive', 'Collaborative and supportive', 'Independent and flexible', 'Structured and stable'],
      scoring: 'values'
    },
    {
      id: 'V003',
      question: 'You value a job that offers:',
      options: ['Job security', 'Creative challenges', 'Leadership opportunities', 'Work-life balance'],
      scoring: 'values'
    },
    {
      id: 'V004',
      question: 'When choosing a job, you prioritize:',
      options: ['Work-life balance', 'Career advancement', 'Meaningful work', 'Job security'],
      scoring: 'values'
    },
    {
      id: 'V005',
      question: 'What type of recognition do you prefer?',
      options: ['Public acknowledgment', 'Private feedback', 'Monetary rewards', 'Increased responsibilities'],
      scoring: 'values'
    },
    {
      id: 'V006',
      question: 'Your ideal company culture emphasizes:',
      options: ['Innovation and risk-taking', 'Tradition and stability', 'Teamwork and collaboration', 'Individual achievement'],
      scoring: 'values'
    },
    {
      id: 'V007',
      question: 'In your career, you most want to:',
      options: ['Make a lot of money', 'Make a difference', 'Gain expertise', 'Build relationships'],
      scoring: 'values'
    },
    {
      id: 'V008',
      question: 'You prefer work that is:',
      options: ['Routine and predictable', 'Varied and challenging', 'People-focused', 'Results-oriented'],
      scoring: 'values'
    },
    {
      id: 'V009',
      question: 'What matters most in your role?',
      options: ['Autonomy and freedom', 'Clear structure and guidance', 'Opportunities to help others', 'Intellectual stimulation'],
      scoring: 'values'
    },
    {
      id: 'V010',
      question: 'You\'re most satisfied when:',
      options: ['Exceeding targets', 'Learning new skills', 'Helping team members', 'Solving complex problems'],
      scoring: 'values'
    },
    {
      id: 'V011',
      question: 'You define success as:',
      options: ['Financial achievements', 'Personal fulfillment', 'Recognition from others', 'Work-life harmony'],
      scoring: 'values'
    },
    {
      id: 'V012',
      question: 'Your ideal manager:',
      options: ['Gives clear directions', 'Provides mentorship', 'Offers independence', 'Sets challenging goals'],
      scoring: 'values'
    },
    {
      id: 'V013',
      question: 'You prefer feedback that is:',
      options: ['Immediate and direct', 'Detailed and constructive', 'Encouraging and supportive', 'Goal-oriented'],
      scoring: 'values'
    },
    {
      id: 'V014',
      question: 'What drives your career decisions?',
      options: ['Passion for the work', 'Financial considerations', 'Family priorities', 'Growth opportunities'],
      scoring: 'values'
    },
    {
      id: 'V015',
      question: 'In 5 years, you want to be:',
      options: ['In a leadership position', 'An expert in your field', 'Making a social impact', 'Maintaining work-life balance'],
      scoring: 'values'
    }
  ]
};

// Test metadata for the cards
export const testMetadata = {
  Personality: {
    id: 'Personality',
    name: 'Personality Assessment',
    description: 'Discover your Big Five personality traits and work style preferences',
    icon: '🧠',
    questions: 25,
    duration: '15-20 minutes',
    traits: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
  },
  Cognitive: {
    id: 'Cognitive',
    name: 'Cognitive Assessment',
    description: 'Test your logical reasoning, problem-solving, and mathematical abilities',
    icon: '🧮',
    questions: 20,
    duration: '20-25 minutes',
    traits: ['Logical Reasoning', 'Pattern Recognition', 'Mathematical Skills', 'Problem Solving']
  },
  Skills: {
    id: 'Skills',
    name: 'Skills Assessment',
    description: 'Evaluate your technical skills, communication, and professional competencies',
    icon: '⚡',
    questions: 25,
    duration: '20-25 minutes',
    traits: ['Technical Skills', 'Communication', 'Business Acumen', 'Problem Solving']
  },
  Situational: {
    id: 'Situational',
    name: 'Situational Judgment',
    description: 'Assess how you handle real workplace scenarios and decision-making',
    icon: '🎯',
    questions: 15,
    duration: '15-20 minutes',
    traits: ['Decision Making', 'Ethics', 'Leadership', 'Professionalism']
  },
  Values: {
    id: 'Values',
    name: 'Work Values',
    description: 'Understand your career motivations, priorities, and ideal work environment',
    icon: '💎',
    questions: 15,
    duration: '10-15 minutes',
    traits: ['Work Motivation', 'Career Priorities', 'Value Alignment', 'Culture Fit']
  }
};