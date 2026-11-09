// All site copy. Verified facts only: keep this file the single source of truth.

const img = (file) => `${import.meta.env.BASE_URL}images/${file}`

export const person = {
  name: 'Srikar Mattegunta',
  first: 'Srikar',
  last: 'Mattegunta',
  eyebrow: 'Mechanical Engineering Technology · NJIT',
  headline: 'Curiosity into practical ideas.',
  lead: "I'm a freshman at NJIT exploring engineering and programming. I enjoy building projects that make people's work simpler.",
  email: 'sm3996@njit.edu',
  github: 'https://github.com/SriM90',
  linkedin: 'https://www.linkedin.com/in/srikar-mattegunta-814949378/',
}

export const resume = {
  href: `${import.meta.env.BASE_URL}Srikar-Mattegunta-Resume.pdf`,
  // Set at build time by vite.config.js: true only when the PDF is in public/.
  available: typeof __RESUME_AVAILABLE__ !== 'undefined' && __RESUME_AVAILABLE__,
}

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

// The statement that lights up word by word as you scroll.
export const statement =
  "Born in Nevada. Raised between Nevada, California and India. Now at NJIT, exploring how engineering systems work in the real world."

export const about = [
  {
    n: '01',
    title: 'Background',
    body: "I was born in Nevada and lived in both Nevada and California before moving to India in late middle school. Today, I'm studying at NJIT and exploring how engineering systems work in the real world.",
  },
  {
    n: '02',
    title: 'Education',
    body: "I'm a freshman studying Mechanical Engineering Technology at NJIT. Before that, I attended Oakridge International in India, completing four years of high school through the International Baccalaureate programme.",
  },
  {
    n: '03',
    title: 'Experience',
    body: 'In my senior year of high school, I completed two internships exploring biomedical technology at hospitals in Hyderabad, India, and managed two editions of a hackathon in Hyderabad.',
  },
  {
    n: '04',
    title: 'Outside the classroom',
    body: "I'm passionate about geopolitics and Model United Nations. I debated at conferences for over four years and earned multiple awards, building my public speaking. I also play basketball and swim, and have pursued both competitively.",
  },
]

export const stats = [
  { value: '4+', label: 'years debating at Model UN conferences' },
  { value: '2', label: 'biomedical technology internships at hospitals in Hyderabad' },
  { value: '2', label: 'hackathon editions managed' },
]

export const projects = [
  {
    id: 'interior-design',
    n: '01',
    title: 'Interior Design Analysis',
    tags: ['Python', 'Design'],
    body: 'A Python project that evaluates selected aspects of an interior design.',
    images: [
      { src: img('interior-design.png'), w: 1342, h: 470, alt: 'Sliding wardrobe drawings: external and internal elevations with dimensions' },
      { src: img('interior-design-2.png'), w: 640, h: 683, alt: 'Python code that reads measurements from the design drawing PDF' },
    ],
  },
  {
    id: 'weather-logger',
    n: '02',
    title: 'Weather Data Logger',
    tags: ['Programming', 'Weather API'],
    body: 'A program that captures weather data from selected cities using a weather API.',
    images: [
      { src: img('weather-logger.png'), w: 832, h: 404, alt: 'Terminal output: saved weather report for Newark, US with temperature, humidity and conditions' },
      { src: img('weather-logger-2.png'), w: 1366, h: 1444, alt: 'Python code that requests weather data from the OpenWeather API' },
    ],
  },
  {
    id: 'exchange-rate',
    n: '03',
    title: 'Currency Exchange Rate Tracker',
    tags: ['Programming', 'Currency API'],
    body: 'A project that uses an API to retrieve exchange rates and equivalent amounts in different currencies.',
    images: [
      { src: img('exchange-rate-2.png'), w: 1136, h: 302, alt: 'Terminal output: USD to EUR exchange rate retrieved and saved to a database' },
      { src: img('exchange-rate.png'), w: 1632, h: 1570, alt: 'Python code that retrieves exchange rates from an API' },
    ],
  },
]

export const cadParts = ['Scooter', 'Ring', 'Angled plate', 'Aluminium hanger', 'Pulley', 'Stop base']

export const skills = {
  cad: {
    title: 'CAD modeling',
    body: 'Digital models of mechanical parts, from individual components to a full scooter.',
  },
  programming: {
    title: 'Programming',
    items: [
      'Python project development',
      'Weather and currency data through APIs',
      'HTML and CSS',
      'Learning JavaScript',
    ],
  },
  leadership: {
    title: 'Leadership & teamwork',
    body: 'Managing hackathon events and coordinating with others.',
  },
  communication: {
    title: 'Communication',
    body: 'Model United Nations and public speaking.',
  },
  goal: 'My goal is to gain industry experience and eventually become an entrepreneur.',
}
