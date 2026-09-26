import { CareerPreset } from '../types';

export const CAREER_PRESETS: CareerPreset[] = [
  {
    title: 'Frontend Developer',
    category: 'Software Engineering',
    popularSkills: ['HTML/CSS', 'JavaScript (ES6+)', 'React', 'Tailwind CSS', 'TypeScript', 'Git & GitHub', 'REST APIs'],
    description: 'Build responsive, interactive web interfaces and client-side applications for modern browsers.'
  },
  {
    title: 'Full Stack Developer',
    category: 'Software Engineering',
    popularSkills: ['JavaScript/TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL / MongoDB', 'Git', 'REST APIs'],
    description: 'Work across frontend interfaces and backend server logic, databases, and API integrations.'
  },
  {
    title: 'Backend Developer',
    category: 'Software Engineering',
    popularSkills: ['Python / Java / Node.js', 'SQL & Databases', 'RESTful APIs', 'Data Structures', 'Docker Basics', 'Git'],
    description: 'Architect server endpoints, database schemas, authentication, and core business algorithms.'
  },
  {
    title: 'Data Analyst',
    category: 'Data & Analytics',
    popularSkills: ['Python (Pandas, NumPy)', 'SQL', 'Data Visualization (Power BI / Tableau)', 'Excel / Google Sheets', 'Statistics'],
    description: 'Clean data, analyze business patterns, and create dashboards to help organizations make data-driven decisions.'
  },
  {
    title: 'Machine Learning Engineer',
    category: 'Data & AI',
    popularSkills: ['Python', 'Scikit-Learn', 'PyTorch / TensorFlow', 'Pandas', 'Linear Algebra', 'Model Evaluation'],
    description: 'Develop predictive models, fine-tune neural architectures, and integrate AI capabilities into products.'
  },
  {
    title: 'Cloud & DevOps Engineer',
    category: 'Infrastructure',
    popularSkills: ['Linux CLI', 'Git', 'Docker', 'AWS / GCP / Azure basics', 'CI/CD Pipelines', 'Bash Scripting'],
    description: 'Deploy, automate, and monitor scalable cloud applications with modern continuous integration.'
  },
  {
    title: 'UI/UX Designer',
    category: 'Product & Design',
    popularSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing'],
    description: 'Craft intuitive user journeys, wireframes, and high-fidelity prototypes centered around user needs.'
  },
  {
    title: 'Cybersecurity Analyst',
    category: 'Security',
    popularSkills: ['Networking Basics (TCP/IP)', 'Linux', 'Security Fundamentals', 'Vulnerability Assessment', 'Python Scripting'],
    description: 'Monitor networks, identify security threats, and safeguard digital assets and user data.'
  },
  {
    title: 'Mobile App Developer',
    category: 'Mobile',
    popularSkills: ['Flutter / React Native', 'Dart / JavaScript', 'State Management', 'Mobile UI Design', 'REST API Integration'],
    description: 'Build native or cross-platform mobile apps for iOS and Android with smooth user experiences.'
  },
  {
    title: 'QA / Automation Engineer',
    category: 'Quality Assurance',
    popularSkills: ['Manual Testing', 'Test Case Design', 'Selenium / Cypress', 'JavaScript / Python', 'Bug Reporting', 'Postman'],
    description: 'Ensure software quality, test edge cases, and automate user test suites before production release.'
  }
];

export const SAMPLE_RESUMES = [
  {
    name: 'Alex Rivera (CS Junior - Aspiring Frontend)',
    targetRole: 'Frontend Developer',
    skills: ['HTML', 'CSS', 'JavaScript', 'React (Basics)', 'Git', 'C++'],
    text: `ALEX RIVERA
alex.rivera@university.edu | (555) 234-5678 | github.com/alexrivera-dev | Boston, MA

EDUCATION
Bachelor of Science in Computer Science | Expected May 2026
State University, Boston, MA | GPA: 3.5 / 4.0
Relevant Coursework: Data Structures, Web Development, Algorithms, Database Systems, Object-Oriented Programming

TECHNICAL SKILLS
Languages: JavaScript, HTML5, CSS3, C++, Python (Basic)
Frameworks & Libraries: React, Bootstrap, Tailwind CSS
Tools: Git, GitHub, VS Code, npm, Figma (Basic)

PROJECTS
Campus Study Buddy Web App (Personal Project) | Oct 2025 – Present
- Built a web application using React and CSS where students can post study group requests
- Created reusable components for group cards, search bar, and filter buttons
- Stored mock data in local state and practiced responsive design for mobile devices

E-Commerce Product Catalog Page (Coursework Project) | March 2025
- Designed a 3-page responsive product catalog utilizing HTML, CSS Flexbox, and JavaScript
- Implemented client-side filtering by category and price sorting
- Handled shopping cart additions and stored cart items using browser localStorage

Weather Forecast Dashboard | Nov 2024
- Created a weather app calling a free OpenWeatherMap API using JavaScript Fetch API
- Displayed 5-day weather forecasts with dynamic weather condition icons
- Deployed website on GitHub Pages with clean UI

CAMPUS & EXTRACURRICULAR
Webmaster & Member | University Coding Club | Fall 2024 – Present
- Maintained student club announcement page and assisted freshers with Git basics workshops
- Participated in 24-hour Hackathon: built a campus event finder prototype`
  },
  {
    name: 'Priya Sharma (Recent Grad - Aspiring Data Analyst)',
    targetRole: 'Data Analyst',
    skills: ['Python', 'SQL', 'Excel', 'Pandas', 'Data Cleaning', 'Matplotlib'],
    text: `PRIYA SHARMA
priya.sharma@email.com | (555) 876-5432 | linkedin.com/in/priyasharma-analyst | Chicago, IL

EDUCATION
B.S. in Information Systems & Analytics | Graduated Dec 2025
University of Illinois | GPA: 3.6 / 4.0
Coursework: Applied Business Statistics, Relational Databases, Business Intelligence, Python for Data Analytics

TECHNICAL SKILLS
Data & Programming: SQL (PostgreSQL, MySQL), Python (Pandas, NumPy, Matplotlib, Seaborn), Excel (VLOOKUP, Pivot Tables)
BI & Visualization: Tableau Desktop (Foundational), Power BI
Other: Git, Jupyter Notebook, Google Sheets

PROJECTS
Retail Sales Performance Dashboard | Sep 2025 – Nov 2025
- Analyzed 50,000+ rows of synthetic e-commerce transaction data using Python Pandas
- Cleaned missing values, removed duplicates, and transformed date columns for seasonal trend analysis
- Created an interactive Tableau dashboard showcasing monthly revenue growth and top product categories
- Uncovered that 20% of customer segments generated 65% of Q4 holiday sales

University Dining Hall Food Waste Analysis | Spring 2025
- Partnered with university sustainability committee to analyze weekly food waste records
- Wrote SQL queries with JOINs, GROUP BY, and window functions to identify high-waste dining stations
- Presented findings and recommendations in an executive slide deck to campus dining administration

ACADEMIC EXPERIENCE
Peer Tutor – Relational Databases & SQL | Fall 2024 – Fall 2025
- Conducted weekly office hours for 35+ undergraduate students learning SQL queries, normalization, and ER diagrams
- Graded lab assignments and guided students through debugging syntax errors`
  }
];
