import { AnalysisResult } from '../src/types';

// Curated technical skills and expectations for standard college career roles
const ROLE_DEFINITIONS: Record<string, {
  roleSkills: string[];
  foundation: Array<{ title: string; description: string; estimatedTime: string; keyTopics: string[] }>;
  intermediate: Array<{ title: string; description: string; estimatedTime: string; keyTopics: string[] }>;
  projects: Array<{ title: string; description: string; techStack: string[]; difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; resumeTip: string }>;
}> = {
  'Frontend Developer': {
    roleSkills: ['HTML5 & Semantic Elements', 'Modern CSS & Flexbox/Grid', 'JavaScript (ES6+)', 'React or Vue.js', 'Tailwind CSS', 'Responsive UI Design', 'REST API Integration', 'Git & GitHub Version Control', 'Browser DevTools & Debugging'],
    foundation: [
      {
        title: 'Master Modern JavaScript (ES6+) & DOM',
        description: 'Focus on arrow functions, array methods (map, filter, reduce), destructuring, async/await, and DOM manipulation.',
        estimatedTime: '2-3 weeks',
        keyTopics: ['Promises & Fetch API', 'Event Loop & Scope', 'Array & Object Utilities', 'DOM Event Handling'],
      },
      {
        title: 'React Fundamentals & Component Thinking',
        description: 'Learn component architecture, state/props lifecycle, hooks (useState, useEffect), and conditional rendering.',
        estimatedTime: '3-4 weeks',
        keyTopics: ['Functional Components', 'Custom Hooks', 'Forms & Controlled Inputs', 'Component Modularity'],
      },
    ],
    intermediate: [
      {
        title: 'State Management & API Communication',
        description: 'Connect your frontends to real backends with error handling, loading spinners, and global state (Zustand or Context).',
        estimatedTime: '2-3 weeks',
        keyTopics: ['Axios / Fetch', 'Context API & Zustand', 'Error Boundaries', 'Local Storage Persistence'],
      },
    ],
    projects: [
      {
        title: 'Interactive University Event & Club Portal',
        description: 'A responsive portal allowing students to browse clubs, filter events by date/category, and RSVP with local persistence.',
        techStack: ['React', 'Tailwind CSS', 'Lucide Icons', 'Vite'],
        difficulty: 'Intermediate',
        resumeTip: 'Architected responsive event discovery dashboard with real-time filtering, reducing event search latency by 40%.',
      },
      {
        title: 'Student Study Tracker & Pomodoro Kanban Board',
        description: 'A productivity dashboard featuring drag-and-drop task management, countdown timer, and local progress charts.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS'],
        difficulty: 'Beginner',
        resumeTip: 'Engineered modular study management web app with drag-and-drop state, utilized by 50+ college peers.',
      },
    ],
  },
  'Backend Developer': {
    roleSkills: ['Node.js / Express', 'RESTful API Architecture', 'SQL & Relational Databases (PostgreSQL/MySQL)', 'NoSQL (MongoDB)', 'Authentication & JWT', 'Data Validation & Security', 'Git Version Control', 'API Testing (Postman/Jest)'],
    foundation: [
      {
        title: 'Server-Side Fundamentals with Node.js & Express',
        description: 'Learn how HTTP requests work, routing, middleware chaining, and status codes.',
        estimatedTime: '2-3 weeks',
        keyTopics: ['Express Middleware', 'HTTP Status Codes', 'Request/Response Lifecycle', 'JSON Body Parsing'],
      },
      {
        title: 'Relational Database Schema Design (SQL)',
        description: 'Master table relationships (1-to-many, many-to-many), foreign keys, indexing, and SQL queries.',
        estimatedTime: '3 weeks',
        keyTopics: ['PostgreSQL / MySQL', 'Normalization', 'Joins & Aggregations', 'Indexes & Query Optimization'],
      },
    ],
    intermediate: [
      {
        title: 'Authentication, Security & Testing',
        description: 'Implement secure JWT authentication, password hashing (bcrypt), and automated API route tests with Jest/Supertest.',
        estimatedTime: '2-3 weeks',
        keyTopics: ['JWT & Refresh Tokens', 'Bcrypt Hashing', 'Rate Limiting & CORS', 'Jest Integration Tests'],
      },
    ],
    projects: [
      {
        title: 'Campus Food Ordering REST API',
        description: 'Production-ready backend API with role-based access for students and vendors, order state machines, and relational schemas.',
        techStack: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'Jest'],
        difficulty: 'Intermediate',
        resumeTip: 'Designed RESTful backend supporting 15+ endpoints, role-based authorization, and ACID-compliant transactional order workflows.',
      },
      {
        title: 'Secure File Storage & Sharing Microservice',
        description: 'Microservice supporting multi-part file uploads, metadata extraction, signed URLs, and rate-limiting.',
        techStack: ['Node.js', 'Express', 'Multer', 'PostgreSQL'],
        difficulty: 'Intermediate',
        resumeTip: 'Developed robust file upload service with payload validation, MIME verification, and sub-100ms response latencies.',
      },
    ],
  },
  'Full Stack Developer': {
    roleSkills: ['Frontend (React/Vue)', 'Backend (Node.js/Express/Python)', 'REST & GraphQL APIs', 'Database Design (SQL/NoSQL)', 'TypeScript', 'Authentication (JWT/OAuth)', 'Git & Deployment (Vercel/Render)', 'State Management'],
    foundation: [
      {
        title: 'Full-Stack Data Flow & End-to-End Integration',
        description: 'Understand client-server architecture, JSON serialization, and connecting frontend forms to backend databases.',
        estimatedTime: '3-4 weeks',
        keyTopics: ['Client-Server Protocol', 'CORS & Proxying', 'Unified TypeScript Types', 'Async Data Fetching'],
      },
      {
        title: 'Database CRUD Operations & Persistence',
        description: 'Design schemas, seed test databases, and write robust create-read-update-delete routes.',
        estimatedTime: '2-3 weeks',
        keyTopics: ['PostgreSQL or MongoDB', 'ORM / Query Builders', 'Data Validation (Zod)', 'Error Handling'],
      },
    ],
    intermediate: [
      {
        title: 'Production Deployment & Monorepo Best Practices',
        description: 'Deploy full-stack applications with environment variable separation, CI/CD, and database connection pooling.',
        estimatedTime: '2 weeks',
        keyTopics: ['Cloud Hosting (Render / Vercel)', 'Production Builds', 'Security Headers', 'Monitoring & Logs'],
      },
    ],
    projects: [
      {
        title: 'Campus Peer Tutoring & Mentorship Marketplace',
        description: 'Full-stack platform connecting students with senior tutors, featuring session booking, chat, and review ratings.',
        techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
        difficulty: 'Advanced',
        resumeTip: 'Built end-to-end peer mentoring web platform with JWT auth and relational booking schedules, serving 120+ active mock bookings.',
      },
      {
        title: 'Developer Project Showcase & Feedback Board',
        description: 'Community platform where student developers publish side projects, receive peer code reviews, and upvote repositories.',
        techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind'],
        difficulty: 'Intermediate',
        resumeTip: 'Implemented full-stack community dashboard with authenticated feedback threads and responsive card grids.',
      },
    ],
  },
  'Data Analyst': {
    roleSkills: ['SQL (Queries, Joins, Aggregations)', 'Python / R (Pandas, NumPy)', 'Data Visualization (Tableau, PowerBI, Matplotlib)', 'Excel (VLOOKUP, Pivot Tables)', 'Statistical Analysis', 'Data Cleaning & Wrangling', 'Business Storytelling'],
    foundation: [
      {
        title: 'Advanced SQL for Analytics',
        description: 'Master window functions (ROW_NUMBER, RANK), CTEs (Common Table Expressions), and grouping operations.',
        estimatedTime: '3 weeks',
        keyTopics: ['Window Functions', 'CTEs & Subqueries', 'Date/Time Aggregations', 'CASE WHEN Logic'],
      },
      {
        title: 'Python for Data Cleaning & Exploration',
        description: 'Use Pandas and NumPy to clean messy real-world datasets, handle null values, and parse formats.',
        estimatedTime: '3-4 weeks',
        keyTopics: ['Pandas DataFrames', 'Handling Missing Values', 'Outlier Detection', 'Exploratory Data Analysis (EDA)'],
      },
    ],
    intermediate: [
      {
        title: 'Dashboard Storytelling with Tableau or PowerBI',
        description: 'Convert analytical findings into intuitive interactive executive dashboards with KPIs and filters.',
        estimatedTime: '2-3 weeks',
        keyTopics: ['KPI Card Design', 'Interactive Drill-downs', 'Color Theory in Viz', 'Stakeholder Reporting'],
      },
    ],
    projects: [
      {
        title: 'College Admissions & Placement Trends Dashboard',
        description: 'End-to-end data analysis analyzing student placement rates across majors, GPA brackets, and internship history.',
        techStack: ['Python (Pandas)', 'SQL', 'Tableau / PowerBI', 'Excel'],
        difficulty: 'Intermediate',
        resumeTip: 'Analyzed 5,000+ student placement records using Python & SQL; built interactive Tableau dashboard uncovering 28% higher placement correlation with early internships.',
      },
      {
        title: 'Retail E-Commerce Cohort & Retention Analysis',
        description: 'Cleaned transaction data to identify customer lifetime value (LTV), repeat purchase rates, and churn patterns.',
        techStack: ['SQL', 'Python (Seaborn)', 'Excel'],
        difficulty: 'Beginner',
        resumeTip: 'Cleaned and queried 50K+ transactional records in SQL, delivering actionable cohort retention insights presented via executive slide deck.',
      },
    ],
  },
};

// Generic default fallback for any role not explicitly listed
const DEFAULT_ROLE_DEF = {
  roleSkills: ['Core Programming Language', 'Git & Version Control', 'Problem Solving & Algorithms', 'System Architecture Basics', 'Documentation & Clean Code', 'Testing & Debugging', 'Communication & Teamwork'],
  foundation: [
    {
      title: 'Strengthen Core Technical Fundamentals',
      description: 'Solidify understanding of object-oriented principles, data structures, and standard libraries.',
      estimatedTime: '3 weeks',
      keyTopics: ['Data Structures', 'Algorithmic Complexity', 'Standard Library Patterns', 'Clean Code'],
    },
    {
      title: 'Version Control & Industry Tooling',
      description: 'Master Git branching, pull request workflows, code reviews, and debugging tools.',
      estimatedTime: '2 weeks',
      keyTopics: ['Git Branching & Merging', 'Pull Request Etiquette', 'CLI Proficiency', 'Issue Tracking'],
    },
  ],
  intermediate: [
    {
      title: 'Practical Project Building & Testing',
      description: 'Build portfolio projects that demonstrate real-world utility, modular design, and test coverage.',
      estimatedTime: '3 weeks',
      keyTopics: ['Modular Architecture', 'Automated Testing', 'API Integration', 'Documentation'],
    },
  ],
  projects: [
    {
      title: 'Industry Portfolio Capstone Application',
      description: 'A complete, well-documented project demonstrating end-to-end competence in your chosen domain.',
      techStack: ['TypeScript / Python', 'Modern Framework', 'Git', 'CI Workflow'],
      difficulty: 'Intermediate' as const,
      resumeTip: 'Engineered scalable capstone application with comprehensive test suites, active CI/CD, and detailed README documentation.',
    },
    {
      title: 'Open Source Contribution or Utility Tool',
      description: 'A developer productivity CLI tool or community open-source contribution with clear commit history.',
      techStack: ['Git', 'Command Line', 'Core Language'],
      difficulty: 'Beginner' as const,
      resumeTip: 'Authored modular CLI utility addressing student workflow bottlenecks, generating 20+ stars and community usage.',
    },
  ],
};

export function generateIntelligentFallbackAnalysis(params: {
  resumeText: string;
  targetRole: string;
  additionalSkills?: string[];
}): AnalysisResult {
  const { resumeText = '', targetRole, additionalSkills = [] } = params;
  const lowerText = (resumeText + ' ' + additionalSkills.join(' ')).toLowerCase();

  // Find best matching role template
  const matchedRoleKey = Object.keys(ROLE_DEFINITIONS).find((key) =>
    targetRole.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(targetRole.toLowerCase())
  );
  const roleConfig = matchedRoleKey ? ROLE_DEFINITIONS[matchedRoleKey] : DEFAULT_ROLE_DEF;

  // Extract common tech skills from resume text
  const COMMON_SKILLS = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'React', 'Vue', 'Angular',
    'HTML', 'CSS', 'Tailwind', 'Node.js', 'Express', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Git', 'GitHub', 'REST API', 'GraphQL', 'Docker', 'AWS', 'Firebase', 'Linux',
    'Tableau', 'PowerBI', 'Pandas', 'NumPy', 'Machine Learning', 'Figma', 'Jest'
  ];

  const identifiedSkills: string[] = [];
  COMMON_SKILLS.forEach((skill) => {
    const reg = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (reg.test(lowerText)) {
      identifiedSkills.push(skill);
    }
  });

  // Include user entered skills
  additionalSkills.forEach((s) => {
    if (s && !identifiedSkills.includes(s)) {
      identifiedSkills.push(s);
    }
  });

  if (identifiedSkills.length === 0) {
    identifiedSkills.push('Problem Solving', 'Coursework Projects', 'Git & GitHub Basics');
  }

  // Determine skills to develop
  const developSkills: string[] = [];
  roleConfig.roleSkills.forEach((expectedSkill) => {
    const hasIt = identifiedSkills.some((s) =>
      expectedSkill.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(expectedSkill.toLowerCase())
    );
    if (!hasIt) {
      developSkills.push(expectedSkill);
    }
  });

  if (developSkills.length === 0) {
    developSkills.push('System Design Basics', 'Automated Testing (Unit & Integration)', 'CI/CD Pipelines');
  }

  // Calculate score dynamically based on matching
  const totalExpected = roleConfig.roleSkills.length;
  const matchCount = totalExpected - developSkills.length;
  let calculatedScore = Math.round(55 + (matchCount / totalExpected) * 35);
  calculatedScore = Math.min(Math.max(calculatedScore, 58), 88);

  let scoreLevel = 'Good Potential';
  if (calculatedScore >= 80) scoreLevel = 'Strong Foundation';
  else if (calculatedScore >= 70) scoreLevel = 'Good Potential';
  else scoreLevel = 'Early Stage';

  // Extract or formulate candidate name
  const nameMatch = resumeText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
  const profileName = nameMatch ? nameMatch[1] : 'Student Candidate';

  // Generate weak bullet rewrites from detected text lines or standard student bullets
  const lines = resumeText
    .split('\n')
    .map((l) => l.trim().replace(/^[-*•]\s*/, ''))
    .filter((l) => l.length > 20 && l.length < 160);

  const candidateWeakBullets = lines.filter((l) =>
    /help|worked on|created|built a|made|responsible for|participated/i.test(l)
  );

  const wordingImprovements = [
    {
      section: 'Project Bullet',
      original: candidateWeakBullets[0] || 'Worked on a website for our college class project using HTML and JavaScript.',
      improved: `Architected responsive web application utilizing ${identifiedSkills[0] || 'JavaScript'} and modular components, reducing page load latency and supporting 100+ simulated active user sessions.`,
      reason: 'Replaces passive phrasing ("worked on") with an assertive verb ("Architected") and attaches quantifiable impact.',
    },
    {
      section: 'Experience / Teamwork',
      original: candidateWeakBullets[1] || 'Helped teammates fix bugs and participated in weekly group meetings.',
      improved: 'Collaborated in an Agile 4-person team, resolving 15+ repository issues via Git pull requests and maintaining clean version control documentation.',
      reason: 'Frames routine team communication as industry-standard Agile collaboration with specific issue counts.',
    },
    {
      section: 'Technical Coursework',
      original: candidateWeakBullets[2] || 'Created a database project to store user information and book details.',
      improved: `Engineered normalized relational database schema with indexed queries, accelerating search retrieval times by 35% for 1,000+ catalog records.`,
      reason: 'Demonstrates theoretical database principles applied to measurable performance improvement.',
    },
  ];

  return {
    matchScore: calculatedScore,
    scoreLevel,
    scoreSummary: `Your resume demonstrates good academic and project groundwork for an entry-level ${targetRole}. By addressing key gaps in ${developSkills.slice(0, 2).join(' and ')}, your profile will become significantly more competitive for campus and junior hiring pipelines.`,
    summary: `${profileName} demonstrates solid core competencies with ${identifiedSkills.slice(0, 3).join(', ')}. Key technical fundamentals are in place, but projects need stronger quantification and industry-aligned toolchains to stand out to technical recruiters.`,
    strengths: [
      `Demonstrated foundational knowledge in ${identifiedSkills.slice(0, 3).join(', ')}`,
      'Active pursuit of projects and academic coursework',
      'Clear baseline understanding of software development workflows',
      'Solid potential for rapid ramp-up in entry-level engineering roles',
    ],
    weaknesses: [
      `Need more practical hands-on experience in ${developSkills.slice(0, 2).join(' and ')}`,
      'Bullet points lean towards passive task descriptions rather than measurable business/technical outcomes',
      'Portfolio lacks a signature, complex end-to-end project deployed publicly',
    ],
    suggestions: [
      'Quantify your project bullets: State how many users, data points, or performance percentage gains your code achieved.',
      `Build one signature portfolio project specifically highlighting ${developSkills[0] || 'advanced frameworks'}.`,
      'Include live demo links and clean GitHub README documentation for all featured projects.',
      'Group your skills into clear categories (Languages, Frameworks, Developer Tools, Databases) on your resume.',
    ],
    skillGap: {
      have: identifiedSkills.slice(0, 8),
      develop: developSkills.slice(0, 6),
      roleSkills: roleConfig.roleSkills,
    },
    roadmap: {
      learnFirst: roleConfig.foundation,
      learnNext: roleConfig.intermediate,
      projects: roleConfig.projects,
    },
    wordingImprovements,
    extractedProfileName: profileName,
    isRateLimitedFallback: true,
    note: 'Evaluated with the built-in Career Coaching Engine while AI rate limits calibrate.',
  };
}
