// Everything the profile says lives here. Edit, then run `npm run build` in /scripts.
export const player = {
  first: 'AKSHAT', last: 'PARASHAR', tag: '#AI26', level: 26,
  title: 'AI ENGINEER', company: 'FLO', city: 'JAIPUR, IN',
  roles: ['SOFTWARE', 'FULL-STACK', 'UI/UX', 'AI', 'LLM WORKFLOWS', 'AUTOMATION'],
  hype: 'LLMs, pixels and pipelines. Every project played to win.',
  stats: [['08', 'PROJECTS SHIPPED'], ['04', 'ROLES PLAYED'], ['8.6', 'B.TECH CGPA']],
};

export const links = {
  portfolio: 'https://akshatparashar.vercel.app/',
  linkedin: 'https://www.linkedin.com/in/akshat-parashar-13x',
  instagram: 'https://www.instagram.com/akshat_parashar.007/',
  email: 'mailto:akshatparashar4704@gmail.com',
  resume: 'https://drive.google.com/file/d/1BkL_vgbHshUp0XGoYss1QzYNgMiGI6hy/view?usp=sharing',
};

export const matches = [
  { result: 'LIVE', color: '#2ee6b6', abbr: 'FLO', org: 'FLO', role: 'AI Engineer', dates: 'MAY 2026 - NOW',
    line: 'Shipping LLM-powered tools and automated AI workflows in production.', stack: ['LLMs', 'Prompt Eng.', 'Automation', 'Gemini', 'Groq'] },
  { result: 'VICTORY', color: '#4cc3ff', abbr: 'CLB', org: 'Celebal Technologies', role: 'DevOps Intern', dates: 'JUN - AUG 2025',
    line: 'A 60-day DevOps program: CI/CD pipelines, containers and cloud.', stack: ['Linux', 'Docker', 'Jenkins', 'Kubernetes', 'AWS'] },
  { result: 'VICTORY', color: '#b18cff', abbr: 'GMN', org: 'GreyMoon', role: 'UI/UX Designer', dates: 'JUN - JUL 2024',
    line: 'Figma UX flows, then the responsive websites built from them.', stack: ['Figma', 'UI/UX', 'Frontend', 'Responsive'] },
  { result: 'VICTORY', color: '#ffb454', abbr: 'INP', org: 'InternPay', role: 'Web Designer', dates: 'JUN - AUG 2023',
    line: 'Responsive web apps across the front end and the back end.', stack: ['JavaScript', 'Node.js', 'Figma', 'AI tools'] },
  { result: 'GRADUATED', color: '#e8c56d', abbr: 'PCE', org: 'Poornima College of Engineering', role: 'B.Tech, Computer Science', dates: '2022 - 2026',
    line: 'Four years of CSE in Jaipur, finished with a CGPA of 8.6.', stack: ['CGPA 8.6', 'Class of 2026'] },
  { result: 'CLEARED', color: '#e8c56d', abbr: 'HPS', org: 'Happy Public Sr. Sec. School, Alwar', role: 'Class XII, PCM', dates: '2021 - 2022',
    line: 'Physics, Chemistry and Mathematics.', stack: ['93.4%'] },
];

export const roles = [
  { key: 'lang', role: 'DUELIST', name: 'LANGUAGES', color: '#ff5a5f', bg: ['#2a0d18', '#6d1730'],
    skills: [['JavaScript', 5], ['HTML', 5], ['CSS', 5], ['Python', 4], ['TypeScript', 3], ['C++', 3]] },
  { key: 'web', role: 'INITIATOR', name: 'WEB', color: '#35d0ba', bg: ['#061f26', '#0f4d57'],
    skills: [['React.js', 4], ['Node.js', 4], ['Express.js', 4], ['REST APIs', 4], ['MongoDB', 4], ['Postman', 4], ['SQL', 2]] },
  { key: 'ai', role: 'CONTROLLER', name: 'AI / ML', color: '#c77dff', bg: ['#170a33', '#4b1c9a'],
    skills: [['Prompt Eng.', 5], ['Gemini API', 4], ['Groq API', 4], ['LLM Workflows', 4], ['AI Studio', 4], ['OpenCV', 3]] },
  { key: 'devops', role: 'SENTINEL', name: 'DEVOPS', color: '#8be04e', bg: ['#0b1d10', '#1f5227'],
    skills: [['Vercel', 5], ['Git / GitHub', 4], ['Linux / Shell', 4], ['Docker', 3], ['Jenkins', 3], ['Kubernetes', 2], ['AWS', 2], ['Azure', 2]] },
  { key: 'design', role: 'VISIONARY', name: 'DESIGN', color: '#ffc857', bg: ['#241604', '#7a4a0c'],
    skills: [['Figma', 5], ['UI/UX Design', 5], ['Canva', 4], ['Framer Motion', 3]] },
];

// Valorant edition tiers
export const tiers = {
  select: { name: 'SELECT EDITION', color: '#5a9fe2' },
  deluxe: { name: 'DELUXE EDITION', color: '#009587' },
  premium: { name: 'PREMIUM EDITION', color: '#d1548d' },
  exclusive: { name: 'EXCLUSIVE EDITION', color: '#f5955b' },
  ultra: { name: 'ULTRA EDITION', color: '#fad663' },
};

export const projects = [
  { id: 'resume', slot: 'RIFLE', sub: 'AI PRODUCT', weapon: 'VANDAL', tier: 'ultra', name: 'AI Resume Analyzer', img: 'resume-bolt.webp',
    desc: 'ATS scoring, job matching and career recommendations from a real-time resume read by an LLM.',
    stack: ['Node.js', 'MongoDB', 'Groq AI', 'JavaScript'], live: 'https://resume-bolt.vercel.app/', code: 'https://github.com/akshatparashar/resume-frontend' },
  { id: 'dsa', slot: 'RIFLE', sub: 'AI PRODUCT', weapon: 'PHANTOM', tier: 'premium', name: 'DSA Mentor AI', img: 'dsa-teacher.webp',
    desc: 'Gemini explains your code and its complexity, with visualisations, roadmaps and an in-browser IDE.',
    stack: ['Node.js', 'MongoDB', 'Gemini API', 'JavaScript'], live: 'https://dsa-teacher.vercel.app/', code: 'https://github.com/akshatparashar/DSA_TEACHER' },
  { id: 'vishvora', slot: 'SNIPER', sub: 'PRODUCTION SITE', weapon: 'OPERATOR', tier: 'exclusive', name: 'Vishvora.com', img: 'vishvora.webp',
    desc: 'A live travel platform: destination discovery, curated international packages and inquiry flows.',
    stack: ['Responsive UI', 'Inquiry flows', 'Deployment'], live: 'https://www.vishvora.com/' },
  { id: 'tunes', slot: 'SNIPER', sub: 'PRODUCTION SITE', weapon: 'MARSHAL', tier: 'exclusive', name: 'TunesofDunes.com', img: 'tunesofdunes.webp',
    desc: 'Rajasthan tourism in production: tours, hotels and taxis, booking flows and WhatsApp built in.',
    stack: ['Booking flows', 'WhatsApp API', 'Responsive UI'], live: 'https://tunesofdunes.com/' },
  { id: 'a54', slot: 'SIDEARM', sub: 'EXPERIMENT', weapon: 'SHERIFF', tier: 'deluxe', name: 'A54 Pocket Server', art: 'phone',
    desc: 'An Oppo A54 turned into a self-hosted web server: networking, remote access, near-zero cost.',
    stack: ['Linux', 'Networking', 'Self-hosting', 'Shell'], code: 'https://github.com/akshatparashar/A54-PocketLab' },
  { id: 'gesture', slot: 'SIDEARM', sub: 'EXPERIMENT', weapon: 'GHOST', tier: 'premium', name: 'Hand Gesture Recognition', img: 'hand-gesture.webp',
    desc: 'Computer vision that reads hand gestures in real time with classical machine learning.',
    stack: ['Python', 'OpenCV', 'ML', 'Computer Vision'], code: 'https://github.com/akshatparashar/HAND_GESTURE' },
  { id: 'animated', slot: 'SIDEARM', sub: 'BUILD', weapon: 'CLASSIC', tier: 'select', name: 'Animated Product Site', img: 'animated-site.webp',
    desc: 'A product website built around motion that walks people through the product as they scroll.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Motion'], live: 'https://animated-website-dun.vercel.app/', code: 'https://github.com/akshatparashar/animated_website' },
  { id: 'portfolio', slot: 'MELEE', sub: 'CLOSE RANGE', weapon: 'KNIFE', tier: 'ultra', name: 'The Portfolio Client', img: 'portfolio.webp',
    desc: 'A game-client portfolio: synthesised UI sounds, a crosshair cursor and a matchmaking queue for recruiters.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Web Audio', 'Canvas'], live: 'https://akshatparashar.vercel.app/' },
];

export const nightMarket = [
  { off: 31, title: 'POCKET SERVER', fact: 'Turned an Oppo A54 into a self-hosted web server.' },
  { off: 43, title: 'CLASS XII', fact: 'Scored 93.4% in Physics, Chemistry and Maths.' },
  { off: 45, title: 'MAIN GAME', fact: 'Plays VALORANT. You probably guessed.' },
  { off: 41, title: 'HOME BASE', fact: 'Builds out of Jaipur, the Pink City.' },
  { off: 50, title: 'CURRENT ROLE', fact: 'AI Engineer at FLO since May 2026.' },
  { off: 38, title: 'BILINGUAL', fact: 'Speaks English and Hindi.' },
];
