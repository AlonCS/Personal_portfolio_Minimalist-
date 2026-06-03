import { useEffect, useState } from 'react'
import './App.css'
import portrait from './assets/alonzo-portrait.png'
import spacioScreenshot from './assets/spacio-screenshot.png'
import nestmeetScreenshot from './assets/nestmeet-screenshot.png'
import nestLogo from './assets/nest-logo.png'
import farmngLogo from './assets/farmng-logo.png'
import hartnellLogo from './assets/hartnell-logo.png'
import maniroLogo from './assets/maniro-logo.png'
import jobyLogo from './assets/joby-logo.png'
import usdaLogo from './assets/usda-logo.png'
import artichokeMonitoring from './assets/Artichoke-monitoring.png'
import microcontrollerTeleop from './assets/microcontroller-teleop.gif'
import microcontrollerTeleopThumb from './assets/microcontroller-teleop-thumb.png'

const SECTIONS = ['home', 'about', 'projects', 'qualifications', 'contact']

const PROJECTS = [
  {
    id: 1,
    title: 'Spaceio',
    category: 'Web Development',
    description:
      'Deployed a React web app and Google calendar plugin to streamline office room scheduling, reducing double bookings and increasing reservation efficiency by 40%, addressing a previously complex process.',
    link: '#',
    featured: true,
    image: spacioScreenshot,
    detail: {
      github: '#', // TODO: replace with the real GitHub URL
      strategy: ['Organized', 'Easy to use', 'Quick'],
      institution: 'Digital Nest',
      techStack: ['React', 'Firebase', 'Google Calendar API'],
      summary: [
        'Spaceio integrates the Google Calendar API to streamline reserving, scheduling, and viewing office rooms directly on Google Calendar.',
        'When a user logs in with their company email, their subscribed calendar rooms are fetched from Google Calendar and displayed on the dashboard and side navbar for two-click booking.',
      ],
      sections: [
        {
          title: 'Problem',
          text: 'In the office, users faced challenges reserving rooms because of the clutter of existing reservations, which often led to conflicts in room bookings.',
          image: null, // TODO: add the calendar screenshot
        },
        {
          title: 'Solution',
          text: 'Spaceio pulls each room\u2019s live availability from Google Calendar into a single dashboard and side navbar, so users can book an open room in two clicks \u2014 eliminating the double-bookings caused by scattered reservations.',
          image: null, // TODO: add a screenshot of the solution in action
        },
      ],
      video: null, // TODO: add a demo video URL (mp4 or YouTube embed)
      gallery: [
        { src: spacioScreenshot, label: 'Homepage' },
        { src: null, label: 'Login Page' }, // TODO: add the login screenshot
        { src: null, label: 'Booking Page' }, // TODO: rename + add screenshot
        { src: null, label: 'Floor Map' }, // TODO: rename + add screenshot
      ],
    },
  },
  {
    id: 2,
    title: 'Randomized Scheduling Application',
    category: 'Web Development',
    description:
      'Built NEST Meet, a scheduling tool that randomly pairs interns across departments and locations for ice breaker sessions, with filtering, unique pairing logic, and exportable week schedules.',
    link: '#',
    featured: false,
    image: nestmeetScreenshot,
    detail: {
      github: '#', // TODO: real repo URL
      strategy: ['Fast', 'Fair', 'Repeatable'], // TODO: confirm/edit
      institution: 'Digital Nest',
      techStack: ['React', 'JavaScript', 'CSV Export'], // TODO: confirm/edit
      summary: [
        'NEST Meet is a scheduling tool that randomly pairs interns across departments and locations for ice-breaker sessions.',
        'It applies unique-pairing logic and filtering, then generates an exportable weekly schedule.',
      ],
      sections: [
        {
          title: 'Problem',
          text: 'Interns rarely connected across teams and sites, so cross-department relationships were slow to form.', // TODO: confirm/edit
          image: null,
        },
        {
          title: 'Solution',
          text: 'NEST Meet automatically generates fair, non-repeating pairings each week and exports a ready-to-share schedule.', // TODO: confirm/edit
          image: null,
        },
      ],
      video: null, // TODO: demo video URL
      gallery: [
        { src: nestmeetScreenshot, label: 'Week Schedule' },
        { src: null, label: '[Add screenshot]' },
      ],
    },
  },
  {
    id: 3,
    title: 'Artichoke Monitoring',
    category: 'Robotics',
    description:
      'TODO: short description of the artichoke monitoring project.', // edit me
    link: '#',
    featured: false,
    image: artichokeMonitoring,
    detail: {
      github: '#', // TODO: real repo URL
      strategy: ['[Add]', '[Add]', '[Add]'],
      institution: '[Add institution]',
      techStack: ['[Add]', '[Add]'],
      summary: [
        '[Add a 1\u20132 sentence summary of Artichoke Monitoring.]',
      ],
      sections: [
        { title: 'Problem', text: '[Describe the problem this project addresses.]', image: null },
        { title: 'Solution', text: '[Describe your solution.]', image: null },
      ],
      topImage: artichokeMonitoring,
      video: null,
      gallery: [
        { src: null, label: 'Screenshot' },
      ],
    },
  },
  {
    id: 4,
    title: 'Microcontroller Teleoperation',
    category: 'Robotics',
    description:
      'TODO: short description of the microcontroller teleoperation project.', // edit me
    link: '#',
    featured: false,
    image: microcontrollerTeleopThumb,
    detail: {
      github: '#', // TODO: real repo URL
      strategy: ['[Add]', '[Add]', '[Add]'],
      institution: '[Add institution]',
      techStack: ['[Add]', '[Add]'],
      summary: [
        '[Add a 1\u20132 sentence summary of Microcontroller Teleoperation.]',
      ],
      sections: [
        { title: 'Problem', text: '[Describe the problem this project addresses.]', image: null },
        { title: 'Solution', text: '[Describe your solution.]', image: null },
      ],
      topImage: microcontrollerTeleop,
      video: null,
      gallery: [
        { src: null, label: 'Design' },
      ],
    },
  },
]

const FILTERS = ['All', 'Web Development', 'Robotics']

const SKILLS = [
  { category: 'Programming Languages', items: ['Python', 'HTML', 'CSS', 'JavaScript'] },
  { category: 'AI, Vision & Robotics', items: ['LLaMA', 'Vision Language Models', 'PID Control'] },
  { category: 'Simulation & Hardware', items: ['Gazebo', 'Isaac Sim', 'NVIDIA Jetson', 'Raspberry Pi', 'Arduino'] },
  { category: 'Tools & DevOps', items: ['Docker', 'Git', 'Linux', 'VS Code'] },
  { category: 'Soft Skills', items: ['Mentoring', 'Problem Solving', 'Team Collaboration', 'Communication'] },
]

const QUALIFICATIONS = {
  // `desc` is a short one-liner shown on each card — edit these freely.
  work: [
    {
      period: 'February 2026 - June 2026',
      role: 'Automation Technician',
      org: 'Joby',
      logo: 'joby',
      desc: 'Built and maintained automation tooling for the aircraft manufacturing line.',
    },
    {
      period: 'May 2025 - Present',
      role: 'Robotics Engineer Intern',
      org: 'Maniro AI',
      logo: 'maniro',
      desc: 'Developing robotics software and hardware integration for autonomous systems.',
    },
    {
      period: 'August 2024 - May 2025',
      role: 'Web Development Intern',
      org: 'Digital Nest',
      logo: 'nest',
      desc: 'Built internal web tools, including the Spaceio and NEST Meet apps.',
    },
    {
      period: 'June 2024 - September 2025',
      role: 'Sales and Education Intern',
      org: 'Farm-ng',
      logo: 'farmng',
      desc: 'Supported sales and educational outreach for agricultural robots.',
    },
  ],
  education: [
    {
      period: '2026 - 2028',
      role: 'Computer Science',
      org: 'UC San Diego',
      logo: 'ucsd',
      desc: 'Studying computer science.',
    },
    {
      period: 'August 2024 - Present',
      role: 'Math and Computer Science',
      org: 'Hartnell College',
      logo: 'hartnell',
      desc: 'Coursework in mathematics and computer science.',
    },
  ],
  research: [
    {
      period: 'June 2026 - August 2026',
      role: 'Research Intern',
      org: 'Desurmont Lab, USDA-ARS EBCL',
      logo: 'usda',
      desc: 'Designing an augmentorium to improve biological control of the black scale.',
    },
  ],
  volunteer: [
    {
      period: 'September 2025 - Present',
      role: 'Robotics Mentor',
      org: 'X Academy Robotics Program',
      location: 'Watsonville, CA',
      desc: 'Mentoring high school teams building underwater ROVs for the MATE competition.',
    },
    {
      period: 'July 2024 - August 2024, July 2025 - August 2025',
      role: 'Co-Instructor',
      org: 'Santa Cruz COE & X Academy Robotics Program',
      location: 'Watsonville, CA',
      desc: 'Co-teaching high school students an agricultural robotics and automation training program.',
    },
  ],
}

const Logo = ({ type }) => {
  if (type === 'maniro')
    return <img src={maniroLogo} alt="Maniro AI" className="qual-logo-img qual-logo-maniro-img" />
  if (type === 'joby')
    return <img src={jobyLogo} alt="Joby" className="qual-logo-img" />
  if (type === 'nest')
    return <img src={nestLogo} alt="Digital Nest" className="qual-logo-img" />
  if (type === 'hartnell')
    return <img src={hartnellLogo} alt="Hartnell College" className="qual-logo-img" />
  if (type === 'usda')
    return <img src={usdaLogo} alt="USDA" className="qual-logo-img" />
  if (type === 'ucsd')
    return null
  return <img src={farmngLogo} alt="Farm-ng" className="qual-logo-img qual-logo-farmng-img" />
}


function App() {
  const [active, setActive] = useState('home')
  const [filter, setFilter] = useState('All')
  const [openProject, setOpenProject] = useState(null)
  const [showAllQuals, setShowAllQuals] = useState(false)
  const [qualFilter, setQualFilter] = useState('work')
  const [pendingScroll, setPendingScroll] = useState(null)
  const [galleryPage, setGalleryPage] = useState(0)
  const [sectionIdx, setSectionIdx] = useState(0)

  const openProjectView = (id) => {
    setOpenProject(id)
    setGalleryPage(0)
    setSectionIdx(0)
    window.scrollTo(0, 0)
  }

  const closeToSection = (id) => {
    setPendingScroll(id)
    setOpenProject(null)
    setShowAllQuals(false)
  }
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const updateForm = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleContactSubmit = (e) => {
    e.preventDefault()
    const subject = form.subject || `Message from ${form.name || 'your site'}`
    const body = `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ''}`
    window.location.href = `mailto:alonzocabrera48@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  useEffect(() => {
    if (openProject !== null || showAllQuals) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    if (pendingScroll) {
      const el = document.getElementById(pendingScroll)
      if (el) el.scrollIntoView()
      setPendingScroll(null)
    }
    return () => observer.disconnect()
  }, [openProject, showAllQuals])

  const navLink = (id, label) => (
    <li key={id}>
      <a
        href={`#${id}`}
        className={`nav-link${active === id ? ' active' : ''}`}
        onClick={(e) => {
          if (openProject !== null || showAllQuals) {
            e.preventDefault()
            closeToSection(id)
          }
        }}
      >
        {label}
      </a>
    </li>
  )

  const renderNav = () => (
    <nav className="nav">
      <div className="nav-inner">
        <span className="nav-logo">Alonzo Cabrera</span>
        <ul className="nav-links">
          {navLink('home', 'Home')}
          {navLink('about', 'About')}
          {navLink('projects', 'Projects')}
          {navLink('qualifications', 'Qualifications')}
          {navLink('contact', 'Contact')}
        </ul>
      </div>
    </nav>
  )

  const featured = PROJECTS.find((p) => p.featured)
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)

  const QUAL_ICONS = {
    work: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
      </svg>
    ),
    education: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10 12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" />
      </svg>
    ),
    research: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6" />
        <path d="M10 3v6.5L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9.5V3" />
        <path d="M7 14h10" />
      </svg>
    ),
    volunteer: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
      </svg>
    ),
  }
  const QUAL_GROUPS = [
    { key: 'work', label: 'Work' },
    { key: 'education', label: 'Education' },
    { key: 'research', label: 'Research' },
    { key: 'volunteer', label: 'Volunteer' },
  ]

  const renderSkillCard = (cat) => (
    <div className="skill-card" key={cat.category}>
      <h4 className="skill-cat">{cat.category}</h4>
      <ul className="skill-items">
        {cat.items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  )

  const renderQualCard = (item, i) => (
    <div className="qual-card" key={i}>
      <h3 className="qual-org">{item.org}</h3>
      <p className="qual-role">{item.role}</p>
      <p className="qual-period">
        {item.period}
        {item.location && ` · ${item.location}`}
      </p>
      {item.bullets ? (
        <ul className="qual-bullets">
          {item.bullets.map((b, j) => (
            <li key={j}>{b}</li>
          ))}
        </ul>
      ) : (
        item.desc && <p className="qual-desc">{item.desc}</p>
      )}
    </div>
  )

  // ── All qualifications view ──
  if (showAllQuals) {
    return (
      <>
        {renderNav()}
        <main className="qual-all">
          <div className="qual-inner">
            <p className="detail-breadcrumb">
              <button className="detail-crumb-link" onClick={() => closeToSection('qualifications')}>
                Qualifications
              </button>
              <span className="detail-crumb-sep"> › </span>
              <span className="detail-crumb-current">All</span>
            </p>
            {QUAL_GROUPS.map((group) => (
              <div className="qual-group" key={group.key}>
                <h3 className="qual-group-head">
                  {QUAL_ICONS[group.key]}
                  {group.label}
                </h3>
                <div className="qual-list">
                  {QUALIFICATIONS[group.key].map(renderQualCard)}
                </div>
              </div>
            ))}
            <button className="qual-goback" onClick={() => closeToSection('qualifications')}>
              (go back)
            </button>
          </div>
        </main>
      </>
    )
  }

  // ── Project detail view ──
  if (openProject !== null) {
    const p = PROJECTS.find((x) => x.id === openProject)
    const d = p?.detail
    const idx = PROJECTS.findIndex((x) => x.id === openProject)
    const next = PROJECTS[(idx + 1) % PROJECTS.length]
    const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length]
    const shots = d?.gallery || []
    const pageCount = Math.ceil(shots.length / 2)
    const pageShots = shots.slice(galleryPage * 2, galleryPage * 2 + 2)
    const sections = d?.sections || []
    const sec = sections[sectionIdx] || {}
    return (
      <>
        {renderNav()}
        <main className="detail">
          <div className="detail-inner">
            <div className="detail-grid">
              {/* LEFT */}
              <div className="detail-left">
                <div className="detail-headrow">
                  <h1 className="detail-title">{p.title}</h1>

                  <div className="detail-meta">
                  <div className="detail-meta-col">
                    <h4>Strategy</h4>
                    {d.strategy.map((s) => (
                      <p key={s}>{s}</p>
                    ))}
                  </div>
                  <div className="detail-meta-col">
                    <h4>Institution</h4>
                    <p>{d.institution}</p>
                  </div>
                  <div className="detail-meta-col">
                    <h4>Tech Stack</h4>
                    {d.techStack.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </div>
                </div>
                </div>

                <p className="detail-breadcrumb">
                  <button className="detail-crumb-link" onClick={() => closeToSection('projects')}>
                    Projects
                  </button>
                  <span className="detail-crumb-sep"> › </span>
                  <span className="detail-crumb-current">{p.title}</span>
                </p>

                {/* Top media (video or gif/image) */}
                <div className="detail-video">
                  {d.topImage ? (
                    <img src={d.topImage} alt={`${p.title} demo`} className="detail-video-el" />
                  ) : d.video ? (
                    <video src={d.video} controls className="detail-video-el" />
                  ) : (
                    <div className="detail-placeholder detail-video-ph">
                      <span className="detail-play">▶</span>
                      <span className="detail-ph-text">Add demo video</span>
                    </div>
                  )}
                </div>

                {/* Gallery */}
                {shots.length > 0 && (
                  <div className="detail-gallery">
                    {pageCount > 1 && (
                      <button
                        className="detail-arrow"
                        aria-label="Previous screenshots"
                        onClick={() => setGalleryPage((p) => (p - 1 + pageCount) % pageCount)}
                      >
                        ←
                      </button>
                    )}
                    <div className={`detail-gallery-pair${shots.length === 1 ? ' detail-gallery-single' : ''}`}>
                      {pageShots.map((s, i) => (
                        <figure className="detail-gallery-item" key={i}>
                          <div className="detail-gallery-frame">
                            {s.src ? (
                              <img src={s.src} alt={s.label} />
                            ) : (
                              <div className="detail-placeholder">
                                <span className="detail-ph-text">Add {s.label} screenshot</span>
                              </div>
                            )}
                          </div>
                          <figcaption className="detail-gallery-label">{s.label}</figcaption>
                        </figure>
                      ))}
                    </div>
                    {pageCount > 1 && (
                      <button
                        className="detail-arrow"
                        aria-label="Next screenshots"
                        onClick={() => setGalleryPage((p) => (p + 1) % pageCount)}
                      >
                        →
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="detail-right">
                <div className="detail-block">
                  <div className="detail-block-head">
                    <h3 className="detail-h">Summary</h3>
                    <a
                      className="detail-github"
                      href={d?.github || '#'}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Github <span aria-hidden="true">→</span>
                    </a>
                  </div>
                  {d.summary.map((para, i) => (
                    <p key={i} className="detail-body">{para}</p>
                  ))}
                </div>

                <div className="detail-block">
                  <div className="detail-block-head">
                    <h3 className="detail-h">{sec.title}</h3>
                    {sections.length > 1 && (
                      <span className="detail-section-arrows">
                        <button
                          aria-label="Previous section"
                          onClick={() =>
                            setSectionIdx((s) => (s - 1 + sections.length) % sections.length)
                          }
                        >
                          ←
                        </button>
                        <button
                          aria-label="Next section"
                          onClick={() => setSectionIdx((s) => (s + 1) % sections.length)}
                        >
                          →
                        </button>
                      </span>
                    )}
                  </div>
                  <p className="detail-body">{sec.text}</p>
                  <div className="detail-problem-img">
                    {sec.image ? (
                      <img src={sec.image} alt={`${sec.title} illustration`} />
                    ) : (
                      <div className="detail-placeholder">
                        <span className="detail-ph-text">Add {sec.title} screenshot</span>
                      </div>
                    )}
                  </div>
                </div>

                {next && next.id !== p.id && (
                  <div className="detail-next">
                    <div className="detail-next-head">
                      <span>Next Project</span>
                      <span className="detail-next-arrows">
                        <button
                          aria-label="Previous project"
                          onClick={() =>
                            prev.detail ? openProjectView(prev.id) : closeToSection('projects')
                          }
                        >
                          ←
                        </button>
                        <button
                          aria-label="Next project"
                          onClick={() =>
                            next.detail ? openProjectView(next.id) : closeToSection('projects')
                          }
                        >
                          →
                        </button>
                      </span>
                    </div>
                    <button
                      className="detail-next-title"
                      onClick={() =>
                        next.detail ? openProjectView(next.id) : closeToSection('projects')
                      }
                    >
                      {next.title}
                    </button>
                    <p className="detail-next-cat">{next.category}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      {renderNav()}

      {/* ── Hero ── */}
      <section id="home" className="hero">
        <h1 className="hero-title">
          <span className="hero-howdy">Howdy</span>, I'm<br />
          Alonzo.
        </h1>
        <p className="hero-sub">
          A Software Engineer with a passion<br />
          in agriculture and Robotics
        </p>
        <div className="hero-icons">
          <a href="https://github.com/AlonCS" target="_blank" rel="noopener noreferrer" className="icon-link" aria-label="GitHub">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/alonzo-cabrera/" target="_blank" rel="noopener noreferrer" className="icon-link" aria-label="LinkedIn">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
        <a href="https://drive.google.com/file/d/1GP7CynAufVtqHkGRvk0K6C8GbQ6czlbs/view" target="_blank" rel="noopener noreferrer" className="resume-btn">
          Get Resume
        </a>
      </section>

      {/* ── About ── */}
      <section id="about" className="about">
        <div className="about-inner">
          <img className="about-photo" src={portrait} alt="Alonzo Cabrera" />
          <div className="about-text">
            <h2 className="about-title">Nice to meet you all</h2>
            <p>Whether it's thinking, creating, or planning, I do it everyday.</p>
            <p>
              My work spans full-stack web apps and robotics integration from React scheduling tools to ROS2 drivers running on farm robots.
              I'm especially drawn to robot learning and vision language models, and the challenge of collecting data at the scale foundation models need.
            </p>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="projects">
        <div className="projects-inner">

          <div className="projects-hero">

            {/* LEFT: title + description */}
            <div className="projects-hero-left">
              <h2 className="projects-title">Projects</h2>
              {featured && (
                <p className="projects-featured-desc">{featured.description}</p>
              )}
            </div>

            {/* RIGHT: meta column (arrow, label, button) + laptop */}
            <div className="projects-hero-right">
              <div className="featured-meta">
                {/* Hand-drawn curved arrow sweeping up-right toward laptop */}
                <svg className="featured-arrow" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 122 C18 70, 45 28, 100 10" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
                  <path d="M78 6 L102 9 L92 31" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="featured-label-sub">Featured Project</p>
                <p className="featured-label-name">{featured?.title} App</p>
                <button
                  type="button"
                  className="view-project-btn"
                  onClick={() => featured?.detail && openProjectView(featured.id)}
                >
                  View Project
                </button>
              </div>

              {/* Laptop mockup */}
              <div className="laptop-wrap">
                <div className="laptop-lid">
                  <img src={spacioScreenshot} alt="Spacio App" className="laptop-screen-img"/>
                </div>
                <div className="laptop-base">
                  <div className="laptop-notch"/>
                  <span className="laptop-brand">MacBook</span>
                </div>
              </div>
            </div>

          </div>

          {/* Filter bar */}
          <div className="projects-filter-row">
            <div className="projects-filter">
              <span className="filter-prefix">Filter by </span>
              {FILTERS.map((f, i) => (
                <span key={f}>
                  <button
                    className={`filter-btn${filter === f ? ' filter-active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                  {i < FILTERS.length - 1 && <span className="filter-sep"> | </span>}
                </span>
              ))}
            </div>
            <button className="see-all-btn" onClick={() => setFilter('All')}>See All</button>
          </div>

          {/* Cards grid */}
          <div className="projects-grid">
            {filtered.map((project) => (
              <button
                type="button"
                key={project.id}
                className={`project-card${project.detail ? '' : ' project-card-static'}`}
                onClick={() => project.detail && openProjectView(project.id)}
              >
                <div className="project-card-img">
                  {project.image
                    ? <img src={project.image} alt={project.title} />
                    : <div className="project-card-placeholder" />
                  }
                </div>
                <div className="project-card-info">
                  <p className="project-card-title">{project.title}</p>
                  <p className="project-card-category">{project.category}</p>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ── Qualifications ── */}
      <section id="qualifications" className="qualifications">
        <div className="qual-inner">
          <h2 className="qual-title">Qualifications</h2>

          <div className="projects-filter-row qual-filter-row">
            <div className="projects-filter">
              <span className="filter-prefix">Filter by </span>
              {QUAL_GROUPS.map((g, i) => (
                <span key={g.key}>
                  <button
                    className={`filter-btn${qualFilter === g.key ? ' filter-active' : ''}`}
                    onClick={() => setQualFilter(g.key)}
                  >
                    {g.label}
                  </button>
                  {i < QUAL_GROUPS.length - 1 && <span className="filter-sep"> | </span>}
                </span>
              ))}
            </div>
            <button
              className="see-all-btn"
              onClick={() => {
                setShowAllQuals(true)
                window.scrollTo(0, 0)
              }}
            >
              See All
            </button>
          </div>

          <div className="qual-list">
            {QUALIFICATIONS[qualFilter].map(renderQualCard)}
          </div>

          <div className="qual-skills">
            <h3 className="qual-skills-title">Skills</h3>
            <div className="skills-grid">
              {SKILLS.slice(0, 3).map(renderSkillCard)}
            </div>
            <div className="skills-grid-wide">
              {SKILLS.slice(3).map(renderSkillCard)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="contact">
        <div className="contact-inner">
          <header className="contact-head">
            <h2 className="contact-title">Contact</h2>
            <p className="contact-intro">
              Have a question, a project, or just want to say howdy? Drop me a line.
            </p>
          </header>

          <div className="contact-body">
            {/* Form */}
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="contact-row">
                <div className="field">
                  <label htmlFor="cf-name">Full Name</label>
                  <input
                    id="cf-name"
                    type="text"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={updateForm('name')}
                  />
                </div>
                <div className="field">
                  <label htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    type="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={updateForm('email')}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="cf-subject">Subject</label>
                <input
                  id="cf-subject"
                  type="text"
                  placeholder="Enter a subject line"
                  value={form.subject}
                  onChange={updateForm('subject')}
                />
              </div>

              <div className="field">
                <label htmlFor="cf-message">Message</label>
                <textarea
                  id="cf-message"
                  rows={4}
                  placeholder="Enter your message"
                  value={form.message}
                  onChange={updateForm('message')}
                />
              </div>

              <button type="submit" className="contact-submit">
                Send Message
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
            </form>

            {/* Info */}
            <aside className="contact-info">
              <div className="contact-info-item">
                <span className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m2 7 10 6 10-6"/>
                  </svg>
                </span>
                <div className="contact-info-text">
                  <p className="contact-info-label">Email</p>
                  <a href="mailto:alonzocabrera48@gmail.com" className="contact-info-value">
                    alonzocabrera48@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <div className="contact-info-text">
                  <p className="contact-info-label">Location</p>
                  <p className="contact-info-value">Central Coast, California</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

export default App