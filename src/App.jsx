import { useEffect, useRef, useState } from 'react'
import './App.css'
import ImageViewer from './ImageViewer'
import nestmeetTechnicalDesign from './assets/nestmeet-technical-design.png'
import nestmeetMockup from './assets/nestmeet-mockup.png'
import spacioMockup from './assets/spacio-mockup.png'
import redscoutTechnicalDesign from './assets/redscout-technical-design.png'

/* Globe temporarily disabled — re-enable these imports + the LOCATIONS map + the
   LocationMap component + its usage in the See All view to bring the map back.
import { useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// Coordinates for every location used in the qualification cards — [lng, lat]
const LOCATIONS = {
  'Marina, CA': [-121.8022, 36.6844],
  'Watsonville, CA': [-121.7569, 36.9102],
  'Salinas, CA': [-121.6555, 36.6777],
  'San Diego, CA': [-117.1611, 32.7157],
  'Montpellier, France': [3.8767, 43.6108],
  'Milpitas, CA': [-121.8996, 37.4323],
  'New York, NY': [-74.006, 40.7128],
}
*/
import portrait from './assets/IMG_9909 (1).png'
import spacioBookingScreenshot from './assets/spacio-booking-screenshot.webp'
import spacioLoginStatic from './assets/spacio-login-static.png'
import spacioHomepageStatic from './assets/spacio-homepage-static.png'
import spacioBookedCalendar from './assets/spacio-booked-calendar.png'
// The Spaceio detail view uses `topImage: spacioDemoGif`, which takes precedence
// over `video`, so the mp4 is currently unreferenced. Kept here commented out:
// swap `topImage` for `video: spacioDemo` to play it with controls instead.
// import spacioDemo from './assets/spacio-demo.mp4'
import nestmeetScreenshot from './assets/nestmeet-screenshot.webp'
import nestmeetHomepageStatic from './assets/nestmeet-homepage-static.png'
/* Company logos are not currently rendered — the <Logo> component below is unused,
   so these imports are commented out to keep them out of the bundle. Re-enable these
   imports + the Logo component + a <Logo type={item.logo} /> in renderQualCard to
   show logos on the qualification cards.
import nestLogo from './assets/nest-logo.png'
import farmngLogo from './assets/farmng-logo.png'
import hartnellLogo from './assets/hartnell-logo.png'
import maniroLogo from './assets/maniro-logo.png'
import jobyLogo from './assets/joby-logo.png'
import usdaLogo from './assets/usda-logo.png'
*/
import artichokeMonitoring from './assets/Artichoke-monitoring.webp'
import redScoutDetectionsVideo from './assets/redscout-detections.mp4'
import redScoutModel from './assets/redscout-model.glb'
import redScoutAnimation from './assets/predict_animation-ezgif.com-cut.gif'
import microcontrollerTeleop from './assets/microcontroller-teleop.webp'
import nestmeetDemo from './assets/nestmeet-demo.mp4'
import nestmeetDemoGif from './assets/nestmeet-demo.gif'
import teleopDemoGif from './assets/microcontroller-teleop-demo.gif'
import microcontrollerPreviewVideo from './assets/IMG_7709-preview.mp4'
import microcontrollerFieldVideo from './assets/microcontroller-field-video.mp4'
import microcontrollerArchitecture from './assets/excali serial bridge.png'
import spacioDemoGif from './assets/spacio-demo.gif'

const SECTIONS = ['home', 'about', 'projects', 'qualifications', 'contact']

// Right-hand section rail: one numbered waypoint per section
const RAIL = [
  { id: 'home', label: 'Top' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'qualifications', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

// Order the qualification filter tabs auto-advance through
const QUAL_CYCLE = ['work', 'education', 'research', 'volunteer', 'competition', 'projects']

// How long the spotlight rests on each qualification card. The tab countdown is
// sized to this × the number of cards in the tab, so the two bars finish together.
const CARD_MS = 1700
const PROJECT_PREVIEW_MS = 3250
// Split of that rest: the edge line opens from the card's middle out to top and
// bottom and holds, then a quick hop bridges the gap to the next card. The bridge
// only spans the gap, so it gets a short slice — most of the time is the dwell.
const BRIDGE_MS = 400
const GROW_MS = CARD_MS - BRIDGE_MS

// Every qualification card carrying a given skill, in tab order. Clicking a skill
// narrows the spotlight tour to just these, hopping tabs as needed.
const cardsWithSkill = (skill) =>
  QUAL_CYCLE.flatMap((group) =>
    QUALIFICATIONS[group]
      .map((item, idx) => ({ group, idx, org: item.org, tags: item.tags }))
      .filter((m) => m.tags?.includes(skill))
  )

// Playback speeds for the qualification spotlight. Durations are divided by this,
// so 2 runs twice as fast and 0.5 takes twice as long. Zero pauses playback.
const SPEEDS = [0, 0.5, 1, 2]
const PROJECT_SECTION_AUTO_MS = 5000

const PROJECTS = [
  {
    id: 1,
    title: 'Spaceio',
    category: 'Web Development',
    description:
      'Built a responsive React room-booking application integrated with Google Workspace to help teams check room availability and manage reservations.',
    link: '#',
    featured: true,
    image: spacioDemoGif,
    tags: ['JavaScript', 'HTML', 'CSS', 'Git'],
    detail: {
      github: 'https://github.com/BizzNEST/spacio',
      figma: 'https://www.figma.com/design/ZQUKBeJpxB7DaU6XRqkNiY/OfficeFlow--Copy-?node-id=0-1&p=f&t=zIsHRutZBEnC116b-0',
      strategy: ['Organized', 'Easy to use', 'Quick'],
      purpose: 'Simplify room booking',
      techStack: ['React', 'JavaScript', 'Firebase', 'Google Calendar API', 'Google OAuth'],
      summary: [
        'Spaceio combines React, Google Calendar API, Apps Script, and Firebase authentication to make office room scheduling faster and more reliable.',
        'The app fetches a user’s subscribed rooms, shows live availability in one dashboard, and supports two-click reservations with responsive layouts across screen sizes.',
      ],
      sections: [
        {
          title: 'Problem',
          text: 'Room availability was scattered across calendars, making reservations difficult to scan and creating avoidable double bookings.',
          image: spacioBookedCalendar,
        },
        {
          title: 'Solution',
          text: 'Spaceio pulls live room availability into a single responsive dashboard and lets authenticated users reserve an open room in two clicks through Google Calendar.',
          image: null, // TODO: add a screenshot of the solution in action
        },
      ],
      liveDemo: `${import.meta.env.BASE_URL}spacio-demo/index.html`,
      video: null,
      gallery: [
        { src: spacioLoginStatic, label: 'Login Page' },
        { src: spacioHomepageStatic, label: 'Homepage' },
        { src: spacioBookingScreenshot, label: 'Booking Page' },
        {
          src: spacioMockup,
          label: 'Prototype (UI)',
          type: 'pan-image',
        },
        { src: `${import.meta.env.BASE_URL}spacio-demo/index.html`, label: 'Live Demo', type: 'iframe', hint: 'Click to try the live demo' },
        { src: null, label: 'Floor Map' }, // TODO: rename + add screenshot
      ],
    },
  },
  {
    id: 2,
    title: 'NEST Meet',
    category: 'Web Development',
    description:
      'Built NEST Meet, a frontend scheduling application that automates intern pairings across departments and locations using configurable rules and exportable weekly schedules.',
    link: '#',
    featured: false,
    image: nestmeetDemoGif,
    tags: ['JavaScript', 'HTML', 'CSS', 'Git'],
    detail: {
      liveDemo: `${import.meta.env.BASE_URL}rsa-demo/index.html`,
      github: 'https://github.com/BizzNEST/salinas-bizznest-scheduler',
      strategy: ['Fast', 'Fair', 'Repeatable'], // TODO: confirm/edit
      purpose: 'Connect interns across teams',
      techStack: ['JavaScript', 'HTML', 'CSS', 'Web Storage API'],
      summary: [
        'NEST Meet automates the intern-pairing workflow Digital NEST used to coordinate cross-team ice-breaker sessions.',
        'Users can filter participants, apply location and department rules, generate non-repeating pairings, adjust results manually, and export a weekly schedule.',
      ],
      sections: [
        {
          title: 'Problem',
          text: 'Creating fair cross-team pairings by hand was time-consuming, especially when location, department, and availability rules had to be balanced.', // TODO: confirm/edit
          image: null,
        },
        {
          title: 'Solution',
          text: 'NEST Meet applies configurable filters and unique-pairing logic in the browser, then produces an editable, exportable weekly schedule.', // TODO: confirm/edit
          image: null,
        },
      ],
      video: nestmeetDemo,
      gallery: [
        { src: nestmeetHomepageStatic, label: 'Homepage' },
        { src: nestmeetScreenshot, label: 'Paired Interns' },
        {
          src: nestmeetTechnicalDesign,
          label: 'System Architecture',
          type: 'pan-image',
        },
        {
          src: nestmeetMockup,
          label: 'Prototype (UI)',
          type: 'pan-image',
        },
        {
          src: `${import.meta.env.BASE_URL}rsa-demo/index.html`,
          label: 'Live Demo',
          type: 'iframe',
          hint: 'Click to try the live demo',
        },
      ],
    },
  },
  {
    id: 3,
    title: 'Red Scout',
    category: 'Robotics',
    description:
      'Built a field computer-vision pipeline that detects, localizes, and counts artichokes from a robot-mounted camera for automated crop monitoring.',
    link: '#',
    featured: false,
    image: redScoutAnimation,
    tags: ['Python', 'Vision Language Models', 'NVIDIA Jetson', 'Docker', 'Linux'],
    detail: {
      repoInquiry: 'alonzocabrera48@gmail.com',
      award: { label: 'Western Growers Specialty Crops Award', event: '2026 Farm Robotics Challenge · Division II', url: 'https://www.farmroboticschallenge.ai/2026results/v/hartnell-college' },
      strategy: ['Real-time', 'Field-tested', 'Automated'],
      purpose: 'Automate crop monitoring',
      techStack: ['Python', 'PyTorch', 'OpenCV', 'ROS 2', 'NVIDIA Jetson', 'Docker'],
      summary: [
        'Red Scout turns an agricultural robot’s camera feed into structured crop data by detecting and counting artichokes in real time.',
        'The edge pipeline runs on an NVIDIA Jetson with Python, PyTorch, and OpenCV, supporting repeatable field data collection without manual scouting.',
      ],
      sections: [
        {
          title: 'Problem',
          text: 'Manual field scouting makes crop counts slow and inconsistent, limiting how much useful data can be collected across a row or field.',
          image: null,
        },
        {
          title: 'Solution',
          text: 'A trained object-detection model processes the robot\u2019s live feed on-device, localizes each artichoke, and aggregates counts into crop-monitoring data.',
          image: null,
        },
      ],
      topImage: artichokeMonitoring,
      video: null,
      gallery: [
        { src: redScoutDetectionsVideo, label: 'Detections', type: 'video' },
        { src: redscoutTechnicalDesign, label: 'System Architecture', type: 'pan-image' },
        { src: redScoutModel, label: 'Prototype (3D CAD)', type: 'model' },
      ],
    },
  },
  {
    id: 4,
    title: 'MCU Teleop',
    category: 'Robotics',
    description:
      'Built a low-latency teleoperation system that drives a microcontroller-based robot from a game controller with serial communication and PID-stabilized motor control.',
    link: '#',
    featured: false,
    image: teleopDemoGif,
    cardVideo: microcontrollerFieldVideo,
    tags: ['Arduino', 'PID Control', 'Python', 'Raspberry Pi', 'Linux'],
    detail: {
      repoInquiry: 'alonzocabrera48@gmail.com',
      strategy: ['Low-latency', 'Responsive', 'Intuitive'],
      purpose: 'Enable reliable manual robot control',
      techStack: ['Arduino', 'Python', 'Raspberry Pi', 'PID Control'],
      summary: [
        'MCU Teleop provides a reliable manual-control layer for bringing up and testing a robot platform before autonomy is available.',
        'A Raspberry Pi reads game-controller input and sends velocity commands over serial to an Arduino, where PID loops keep motor response smooth and predictable.',
      ],
      sections: [
        {
          title: 'Problem',
          text: 'Robot bring-up and field testing need dependable manual control before autonomous behaviors are ready.',
          image: null,
        },
        {
          title: 'Solution',
          text: 'The controller feeds a Raspberry Pi, which streams setpoints to an Arduino over serial; on-board PID control turns those commands into stable wheel motion with minimal lag.',
          image: null,
        },
      ],
      topImage: microcontrollerTeleop,
      previewVideo: microcontrollerPreviewVideo,
      video: null,
      gallery: [
        { src: microcontrollerFieldVideo, label: 'Controller Test', type: 'video' },
        { src: microcontrollerArchitecture, label: 'System Architecture', type: 'pan-image' },
        { src: microcontrollerPreviewVideo, label: 'Live Demo', type: 'video' },
      ],
    },
  },
]

const FILTERS = ['Highlights', 'Web Development', 'Robotics']

const SKILLS = [
  { category: 'Languages & Frameworks', items: ['Python', 'R', 'HTML', 'CSS', 'JavaScript', 'React', 'PHP'] },
  { category: 'AI, Vision & Robotics', items: ['LLaMA', 'Vision Language Models', 'ROS 2', 'MoveIt 2', 'OpenCV', 'ResNet-18', 'CNN', 'PID Control'] },
  { category: 'Simulation & Hardware', items: ['Gazebo', 'Isaac Sim', 'NVIDIA Jetson', 'Fanuc CRX25i', 'Raspberry Pi', 'Arduino', 'CAN Bus'] },
  { category: 'Engineering & Design', items: ['CATIA', 'SolidWorks', 'HMI Systems'] },
  { category: 'Tools & DevOps', items: ['Docker', 'Git', 'Linux', 'VS Code', 'RStudio'] },
  { category: 'Soft Skills', items: ['Mentoring', 'Problem Solving', 'Team Collaboration', 'Technical Documentation'] },
]

const QUALIFICATIONS = {
  // `desc` is a short one-liner shown on each card — edit these freely.
  work: [
    {
      period: 'Spring 2026',
      role: 'Automation Technician',
      org: 'Joby',
      logo: 'joby',
      location: 'Marina, CA',
      tags: ['Python', 'ROS 2', 'MoveIt 2', 'Fanuc CRX25i', 'CATIA', 'SolidWorks', 'HMI Systems', 'Technical Documentation', 'VS Code'],
      desc: 'Developed FANUC robot telemetry, automated thermocouple analysis with Python, and designed autoclave control-panel wiring schematics.',
    },
    {
      period: 'Spring 2025 – Present',
      role: 'Robotics Engineer Intern',
      org: 'Maniro AI',
      logo: 'maniro',
      location: 'Watsonville, CA',
      tags: ['Python', 'ROS 2', 'MoveIt 2', 'CAN Bus', 'NVIDIA Jetson', 'Arduino', 'Docker', 'Git', 'Linux', 'Technical Documentation'],
      desc: 'Developing robotics software and hardware integration for autonomous systems.',
    },
    {
      period: 'Fall 2024 – Spring 2025',
      role: 'Web Development Intern',
      org: 'Digital Nest',
      logo: 'nest',
      location: 'Salinas, CA',
      tags: ['JavaScript', 'HTML', 'CSS', 'React', 'PHP', 'Git', 'VS Code', 'Team Collaboration'],
      desc: 'Built internal web tools, including the Spaceio and NEST Meet apps.',
    },
    {
      period: 'Summer 2024 – Fall 2025',
      role: 'Sales and Education Intern',
      org: 'Farm-ng',
      logo: 'farmng',
      location: 'Watsonville, CA',
      tags: ['Python', 'NVIDIA Jetson', 'VS Code', 'CAN Bus', 'Mentoring', 'Team Collaboration', 'Technical Documentation'],
      desc: 'Co-developed an Amiga robotics curriculum used across 40 high schools.',
    },
  ],
  education: [
    {
      period: 'Fall 2026 – 2028',
      role: 'Computer Science',
      org: 'UC San Diego',
      logo: 'ucsd',
      location: 'San Diego, CA',
      tags: ['Problem Solving', 'Team Collaboration'],
    },
    {
      period: 'Fall 2024 – Spring 2026',
      role: 'Math & Computer Science',
      org: 'Hartnell College',
      logo: 'hartnell',
      location: 'Salinas, CA',
      tags: ['Problem Solving', 'Team Collaboration'],
    },
  ],
  research: [
    {
      period: 'Summer 2026',
      role: 'Research Intern',
      org: 'USDA ARS EBCL',
      logo: 'usda',
      location: 'Montpellier, France',
      tags: ['Problem Solving', 'R', 'RStudio'],
      desc: 'Designing an augmentorium to improve biological control of the black scale.',
    },
  ],
  volunteer: [
    {
      period: 'Fall 2025',
      role: 'Robotics Mentor',
      org: 'X Academy Mate ROV',
      location: 'Watsonville, CA',
      tags: ['Python', 'OpenCV', 'Raspberry Pi', 'Mentoring', 'Git', 'VS Code'],
      desc: 'Mentoring high school teams building underwater ROVs for the MATE competition.',
    },
    {
      period: 'Summer 2024, Summer 2025',
      role: 'Robotics Co-Instructor',
      org: 'X Academy Farm Robotics',
      location: 'Watsonville, CA',
      tags: ['Docker', 'Git', 'VS Code', 'Python', 'CAN Bus', 'Mentoring'],
      desc: 'Teaching high school students Amiga assembly, electrical troubleshooting, and autonomous farm robotics.',
      evidence: { label: 'Read program coverage', url: 'https://www.santacruzworks.org/news/sccoexacademyfarmng' },
    },
  ],
  competition: [
    {
      period: 'Fall 2023, Spring 2024',
      role: 'Team Lead',
      org: 'VEX Robotics',
      location: 'Milpitas, CA',
      desc: 'Led a VEX Robotics Competition team through robot design, build, and tournament play.',
      tags: ['Mentoring', 'Problem Solving', 'Team Collaboration', 'Technical Documentation', 'Python'],
    },
    {
      period: 'Fall 2025, Spring 2025',
      role: 'Team Lead',
      org: 'Farm Robotics Challenge',
      location: 'Salinas, CA',
      desc: 'Led Red Scout to the 2026 Western Growers specialty crops award (Division II).',
      evidence: { label: 'View award results', url: 'https://ucanr.edu/blog/anr-news-releases/article/frc-winners-2026' },
      tags: ['Team Collaboration', 'Problem Solving', 'Python', 'Mentoring', 'SolidWorks', 'OpenCV', 'ResNet-18', 'CNN', 'Isaac Sim'],
    },
    {
      period: 'Spring 2024',
      role: 'Student Competitor',
      org: 'Bio Design Challenge',
      location: 'New York, NY',
      desc: 'Competed in the Biodesign Challenge, developing a biology-driven design concept.',
      tags: ['SolidWorks', 'Problem Solving', 'Team Collaboration'],
    },
  ],
  projects: PROJECTS.map((project) => ({
    period: 'Portfolio project',
    role: project.category,
    org: project.title,
    projectId: project.id,
    tags: project.tags,
    desc: project.description,
  })),
}

const QUAL_HIGHLIGHTS = [
  QUALIFICATIONS.projects.find((item) => item.projectId === 3),
  QUALIFICATIONS.work[0],
  QUALIFICATIONS.competition[1],
  QUALIFICATIONS.projects.find((item) => item.projectId === 1),
].filter(Boolean)

/* Unused — see the commented-out logo imports above to re-enable.
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
*/

// Interactive 3D globe: a pin for every location, flies to the active one
/* Globe temporarily disabled
const LocationMap = ({ active }) => {
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})

  useEffect(() => {
    if (!elRef.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: elRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-30, 20],
      zoom: 0.2,
      attributionControl: false,
    })
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
    map.scrollZoom.disable()

    map.on('style.load', () => {
      map.setProjection({ type: 'globe' })
      // Dark blue ocean
      if (map.getLayer('background')) {
        map.setPaintProperty('background', 'background-color', '#0a2342')
      }
      // Land a touch lighter so it reads against the dark ocean
      if (map.getLayer('countries-fill')) {
        map.setPaintProperty('countries-fill', 'fill-color', '#1b3a5b')
      }
    })

    Object.entries(LOCATIONS).forEach(([name, lngLat]) => {
      const popup = new maplibregl.Popup({ offset: 26, closeButton: false }).setText(name)
      markersRef.current[name] = new maplibregl.Marker({ color: '#4a7c59' })
        .setLngLat(lngLat)
        .setPopup(popup)
        .addTo(map)
    })

    mapRef.current = map
    setTimeout(() => map.resize(), 200)

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = {}
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    // close any open popups
    Object.values(markersRef.current).forEach((m) => {
      if (m.getPopup()?.isOpen()) m.togglePopup()
    })
    if (active && LOCATIONS[active]) {
      map.flyTo({ center: LOCATIONS[active], zoom: 4.2, speed: 0.8, curve: 1.5 })
      const m = markersRef.current[active]
      if (m && !m.getPopup().isOpen()) m.togglePopup()
    } else {
      map.flyTo({ center: [-30, 20], zoom: 0.2, speed: 0.6 })
    }
  }, [active])

  return <div ref={elRef} className="qual-map" />
}
*/


// Cursor-following rover — disabled for now. To bring it back: uncomment the
// component below, uncomment <HeroRover /> in the hero, and re-enable the
// .hero-rover rules in App.css.
// Line comments rather than a /* */ block: the SVG contains JSX comments, whose
// */ would close a block comment early.
// // A small rover that drives along the hero following the cursor's horizontal
// // position — the site is about ground robots in fields, so it stays on the deck
// // rather than flying. Off for reduced-motion and for devices without a pointer.
// const HeroRover = () => {
//   const ref = useRef(null)
//
//   useEffect(() => {
//     const el = ref.current
//     const hero = document.getElementById('home')
//     if (!el || !hero) return
//     if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
//     if (!window.matchMedia('(hover: hover)').matches) return
//
//     const wheels = el.querySelectorAll('.rover-wheel')
//     let targetX = null
//     let x = null
//     let spin = 0
//     let facing = 1
//     let raf = 0
//
//     const onMove = (e) => {
//       targetX = e.clientX - hero.getBoundingClientRect().left
//     }
//
//     const tick = () => {
//       if (targetX !== null) {
//         const width = hero.clientWidth
//         const w = el.offsetWidth
//         // keep the whole rover on screen
//         const goal = Math.max(w / 2, Math.min(width - w / 2, targetX))
//         if (x === null) x = goal
//         const prev = x
//         // ease toward the cursor rather than snapping to it
//         x += (goal - x) * 0.055
//         const dx = x - prev
//         if (Math.abs(dx) > 0.06) {
//           // wheels turn with distance covered, and it faces where it's heading
//           spin += dx * 3.4
//           facing = dx > 0 ? 1 : -1
//         }
//         el.style.transform = `translate3d(${x - w / 2}px, 0, 0) scaleX(${facing})`
//         el.style.opacity = '1'
//         wheels.forEach((wheel) => {
//           wheel.style.transform = `rotate(${spin}deg)`
//         })
//       }
//       raf = requestAnimationFrame(tick)
//     }
//
//     hero.addEventListener('pointermove', onMove)
//     raf = requestAnimationFrame(tick)
//     return () => {
//       hero.removeEventListener('pointermove', onMove)
//       cancelAnimationFrame(raf)
//     }
//   }, [])
//
//   return (
//     <div className="hero-rover" ref={ref} aria-hidden="true">
//       <svg viewBox="0 0 72 44" width="72" height="44" fill="none">
//         {/* mast and camera head */}
//         <path className="rover-accent" d="M46 19V10" strokeWidth="1.6" strokeLinecap="round" />
//         <rect className="rover-accent" x="40" y="3.5" width="14" height="7" rx="2.2" strokeWidth="1.6" />
//         <circle className="rover-lens" cx="50.5" cy="7" r="1.7" />
//         {/* solar deck */}
//         <rect className="rover-body" x="9" y="13" width="46" height="4.4" rx="2.2" strokeWidth="1.6" />
//         {/* chassis */}
//         <rect className="rover-body" x="14" y="17.4" width="36" height="11" rx="3.4" strokeWidth="1.6" />
//         {/* wheels */}
//         <g className="rover-wheel rover-body">
//           <circle cx="21" cy="33" r="6.6" strokeWidth="1.6" />
//           <path d="M21 26.4v13.2M14.4 33h13.2" strokeWidth="1.3" />
//         </g>
//         <g className="rover-wheel rover-body">
//           <circle cx="43" cy="33" r="6.6" strokeWidth="1.6" />
//           <path d="M43 26.4v13.2M36.4 33h13.2" strokeWidth="1.3" />
//         </g>
//       </svg>
//     </div>
//   )
// }

// Decorative foliage cue, sampled from the displayed photo rather than a detector.
function HeroReticle() {
  const ref = useRef(null)
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches ||
        matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    const hero = el.closest('.hero')
    const label = el.querySelector('.reticle-label')
    let pixels
    let imageWidth = 0
    let imageHeight = 0
    const width = 640
    let height = 0
    const photo = new Image()
    photo.onload = () => {
      imageWidth = photo.naturalWidth
      imageHeight = photo.naturalHeight
      height = Math.round(width * imageHeight / imageWidth)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(photo, 0, 0, width, height)
      try { pixels = ctx.getImageData(0, 0, width, height).data } catch { pixels = null }
    }
    photo.src = getComputedStyle(hero, '::before').backgroundImage.match(/url\(["']?(.+?)["']?\)/)?.[1] || ''
    let point = null
    let frame = 0
    let shownScore = 0
    let followX = null
    let followY = null
    const tick = (time = 0) => {
      if (!point) return
      const bounds = hero.getBoundingClientRect()
      if (point.x < bounds.left || point.x > bounds.right || point.y < bounds.top || point.y > bounds.bottom) {
        leave()
        return
      }
      const w = hero.clientWidth
      const h = hero.clientHeight
      const x = (point.x - bounds.left) * w / bounds.width
      const y = (point.y - bounds.top) * h / bounds.height
      followX = followX === null ? x : followX + (x - followX) * 0.35
      followY = followY === null ? y : followY + (y - followY) * 0.35
      el.style.transform = `translate3d(${followX}px, ${followY}px, 0)`
      // Keep a small, gently changing baseline so weak detections still feel
      // like an uncertain live estimate instead of a hard zero.
      let score = 0.035 + (Math.sin(time / 1100) + 1) * 0.055
      if (pixels) {
        const style = getComputedStyle(hero, '::before')
        const [originX, originY] = style.transformOrigin.split(' ')
        const ox = originX.endsWith('%') ? (parseFloat(originX) / 100) * w : parseFloat(originX)
        const oy = originY.endsWith('%') ? (parseFloat(originY) / 100) * h : parseFloat(originY)
        const local = new DOMMatrixReadOnly(style.transform).inverse()
          .transformPoint(new DOMPoint(followX - ox, followY - oy))
        const cover = Math.max(w / imageWidth, h / imageHeight)
        const dw = imageWidth * cover
        const dh = imageHeight * cover
        const nx = (local.x + ox - (w - dw) * parseFloat(style.backgroundPositionX) / 100) / dw
        const ny = (local.y + oy - (h - dh) * parseFloat(style.backgroundPositionY) / 100) / dh
        const cx = Math.round(nx * (width - 1))
        const cy = Math.round(ny * (height - 1))
        let green = 0
        let count = 0
        let centerGreen = 0
        let centerCount = 0
        // Don't clamp off-photo positions onto an edge pixel; that can make a
        // plant at the edge appear under a pointer that's over empty space.
        if (nx < 0 || nx > 1 || ny < 0 || ny > 1) {
          score = 0
        } else for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const px = cx + dx
            const py = cy + dy
            if (px < 0 || px >= width || py < 0 || py >= height) continue
            const i = (py * width + px) * 4
            const [r, g, b] = pixels.subarray(i, i + 3)
            // Yellow-green leaves in this photo often have more red than green.
            // Normalized excess green separates them from its tan dirt and metal.
            const excessGreen = (2 * g - r - b) / (r + g + b || 1)
            const saturation = (Math.max(r, g, b) - Math.min(r, g, b)) /
              (Math.max(r, g, b) || 1)
            const leafScore = Math.max(0, Math.min(1, (excessGreen - 0.055) / 0.09)) *
              Math.min(1, saturation / 0.18)
            green += leafScore
            if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
              centerCount++
              centerGreen += leafScore
            }
            count++
          }
        }
        // Require foliage at the crosshair itself, not just nearby leaves.
        if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
          // Only call the foreground crop rows a strawberry bush; green at the
          // distant horizon or on the subject should stay low confidence.
          const foliageScore = count > 0 && centerCount > 0 && ny >= 0.62
            ? Math.min(green / count, centerGreen / centerCount) * 0.97
            : 0
          score = Math.max(score, foliageScore)
        }
        // This fixed photo contains green clothing. Exclude the person's region
        // in source-image coordinates so the exclusion follows crop and zoom.
        if (nx >= 0.74 && nx <= 0.9 && ny >= 0.22 && ny <= 0.85) {
          score = 0.035 + (Math.sin(time / 1100) + 1) * 0.055
        }
      }
      // Drop quickly when leaving foliage instead of carrying a high score onto dirt.
      shownScore += (score - shownScore) * (score < shownScore ? 0.85 : 0.45)
      const boxWidth = 80 - 24 * shownScore
      const boxHeight = 58 - 18 * shownScore
      el.style.width = `${boxWidth}px`
      el.style.height = `${boxHeight}px`
      el.style.marginLeft = `${-boxWidth / 2}px`
      el.style.marginTop = `${-boxHeight / 2}px`
      label.textContent = `Berry confidence · ${Math.round(shownScore * 100)}%`
      el.style.opacity = '1' 
      frame = requestAnimationFrame(tick)
    }
    const move = (event) => {
      const starting = point === null
      point = { x: event.clientX, y: event.clientY }
      if (starting) frame = requestAnimationFrame(tick)
    }
    const leave = () => {
      point = null
      followX = null
      followY = null
      shownScore = 0
      cancelAnimationFrame(frame)
      el.style.opacity = '0'
    }
    hero.addEventListener('pointermove', move)
    hero.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    return () => {
      leave()
      photo.onload = null
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave)
    }
  }, [])
  return (
    <div className="hero-reticle" ref={ref} aria-hidden="true">
      <span className="reticle-label">Berry confidence · 6%</span>
      <span className="reticle-corner" /><span className="reticle-corner" />
      <span className="reticle-corner" /><span className="reticle-corner" />
    </div>
  )
}

function ProjectLaptopDemo({ src, title }) {
  const screenRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const screen = screenRef.current
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / 1280)
    })
    observer.observe(screen)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="laptop-screen" ref={screenRef}>
      <iframe
        src={src}
        title={`${title} interactive demo`}
        className="laptop-demo"
        loading="lazy"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  )
}

function ModelEmbed({ src, alt, className, style }) {
  const ref = useRef(null)
  const viewer = useRef(null)
  const [copyStatus, setCopyStatus] = useState('')
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('alonzocabrera48@gmail.com')
      setCopyStatus('Copied!')
    } catch {
      setCopyStatus('Couldn’t copy. Please select and copy the email manually.')
    }
  }
  const [fullscreen, setFullscreen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function toggleFullscreen() {
    if (expanded) setExpanded(false)
    else if (document.fullscreenElement === viewer.current) await document.exitFullscreen()
    else {
      try { await viewer.current.requestFullscreen() }
      catch { setExpanded(true) }
    }
  }

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement === viewer.current)
    const escape = (event) => { if (event.key === 'Escape') setExpanded(false) }
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('keydown', escape)
    }
  }, [])

  useEffect(() => {
    // model-viewer is a custom element; setting `src` as a React prop can race
    // its registration and silently no-op. Setting the attribute imperatively
    // always triggers its load logic regardless of upgrade timing.
    ref.current?.setAttribute('src', src)
  }, [src])

  return (
    <div ref={viewer} className={`model-viewer-panel${expanded ? ' model-viewer-expanded' : ''}`}>
      <div className="model-inquiry">
        <span>STEP file inquiries:</span>
        <button type="button" onClick={copyEmail} title="Click to copy email">alonzocabrera48@gmail.com</button>
        <span role="status">{copyStatus}</span>
      </div>
    <model-viewer
      ref={ref}
      alt={alt}
      loading="eager"
      reveal="auto"
      camera-controls="true"
      auto-rotate="true"
      shadow-intensity="1"
      exposure="1"
      className={className}
      style={style}
    />
      <div className="image-viewer-controls" role="group" aria-label="3D model controls">
        <button type="button" onClick={() => ref.current?.zoom(3)} aria-label="Zoom in" title="Zoom in">+</button>
        <button type="button" onClick={() => ref.current?.zoom(-3)} aria-label="Zoom out" title="Zoom out">−</button>
      </div>
      <div className="image-viewer-fullscreen-control">
        <button type="button" onClick={toggleFullscreen} aria-label={fullscreen || expanded ? 'Exit fullscreen' : 'Enter fullscreen'} title={fullscreen || expanded ? 'Exit fullscreen' : 'Enter fullscreen'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d={fullscreen || expanded ? 'M4 9h5V4m6 0v5h5M4 15h5v5m6 0v-5h5' : 'M9 4H4v5m11-5h5v5M4 15v5h5m6 0h5v-5'} />
          </svg>
        </button>
      </div>
    </div>
  )
}

function ScrollingTechStack({ items }) {
  const listRef = useRef(null)
  const contentRef = useRef(null)
  const copyRef = useRef(null)

  useEffect(() => {
    const list = listRef.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame
    let lastTime = 0
    let position = 0
    let resumeAt = performance.now() + 1800
    let hovered = false
    let focused = false
    let cycleHeight = 0
    let lastWrittenScrollTop = null
    const writePosition = () => {
      list.scrollTop = position
      // Browsers round scrollTop; compare against the actual stored value.
      lastWrittenScrollTop = list.scrollTop
    }
    const measure = () => {
      cycleHeight = contentRef.current.getBoundingClientRect().height
      copyRef.current.hidden = motion.matches || cycleHeight <= list.clientHeight + 1
      list.classList.toggle('detail-meta-loop', !copyRef.current.hidden)
      position = cycleHeight ? list.scrollTop % cycleHeight : 0
      writePosition()
    }
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    observer.observe(contentRef.current)
    motion.addEventListener('change', measure)
    measure()

    const tick = (time) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 50) : 0
      lastTime = time
      if (!copyRef.current.hidden && !document.hidden && !hovered && !focused && time >= resumeAt) {
        // Both copies look identical at the boundary, so wrapping is seamless.
        position = (position + elapsed * 0.016) % cycleHeight
        writePosition()
      }
      frame = requestAnimationFrame(tick)
    }
    const pauseHover = () => { hovered = true }
    const resume = () => {
      position = list.scrollTop
      resumeAt = performance.now() + 1800
    }
    const leave = () => {
      hovered = false
      position = list.scrollTop
      resumeAt = 0
      lastTime = performance.now()
    }
    const focus = () => { focused = true }
    const blur = () => { focused = false; resume() }
    const manualScroll = () => { resume() }
    const wrapScroll = () => {
      if (copyRef.current.hidden || !cycleHeight) return
      const current = list.scrollTop
      if (current === lastWrittenScrollTop) return
      if (current >= cycleHeight) {
        position = Math.max(1, current % cycleHeight)
        writePosition()
      } else if (current <= 0) {
        position = cycleHeight - 1
        writePosition()
      } else if (Math.abs(current - position) > 1) {
        position = current
      }
    }
    const wheel = (event) => {
      if (copyRef.current.hidden) return
      event.preventDefault()
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? list.clientHeight : 1
      position = ((list.scrollTop + event.deltaY * unit) % cycleHeight + cycleHeight) % cycleHeight
      writePosition()
      resumeAt = performance.now() + 1800
    }
    list.addEventListener('pointerenter', pauseHover)
    list.addEventListener('pointerleave', leave)
    list.addEventListener('focusin', focus)
    list.addEventListener('focusout', blur)
    list.addEventListener('scroll', wrapScroll, { passive: true })
    list.addEventListener('wheel', wheel, { passive: false })
    list.addEventListener('touchmove', manualScroll, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      motion.removeEventListener('change', measure)
      list.removeEventListener('pointerenter', pauseHover)
      list.removeEventListener('pointerleave', leave)
      list.removeEventListener('focusin', focus)
      list.removeEventListener('focusout', blur)
      list.removeEventListener('scroll', wrapScroll)
      list.removeEventListener('wheel', wheel)
      list.removeEventListener('touchmove', manualScroll)
    }
  }, [items])

  return (
    <div ref={listRef} className="detail-meta-scroll" tabIndex={0} role="region" aria-label="Tech Stack">
      <div ref={contentRef} className="detail-tech-cycle">
        {items.map((item) => <p key={item}>{item}</p>)}
      </div>
      <div ref={copyRef} className="detail-tech-cycle" aria-hidden="true" hidden>
        {items.map((item) => <p key={item}>{item}</p>)}
      </div>
    </div>
  )
}

function HomepagePreview({ src, title, previewWidth = 1800 }) {
  const frameRef = useRef(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / previewWidth)
    })
    observer.observe(frameRef.current)
    return () => observer.disconnect()
  }, [previewWidth])

  return (
    <div className="homepage-preview" ref={frameRef} role="img" aria-label={title}>
      <iframe
        src={src}
        title={title}
        tabIndex={-1}
        aria-hidden="true"
        inert
        style={{ width: previewWidth, height: previewWidth * 947 / 1800, transform: `scale(${scale})` }}
      />
    </div>
  )
}

function InteractiveEmbed({ src, title, className, style, hint = 'Click to explore — scroll to zoom' }) {
  const [activated, setActivated] = useState(false)

  return (
    <div className={`detail-figma-wrap ${className}`} style={style}>
      <iframe src={src} title={title} className="detail-figma-iframe" allowFullScreen />
      {!activated && (
        <button
          type="button"
          className="detail-figma-hint"
          onClick={() => setActivated(true)}
        >
          {hint}
        </button>
      )}
    </div>
  )
}

function ProjectVideoPreview({ src, title, start = 0, end }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined
    const begin = () => {
      video.currentTime = start
      video.play().catch(() => {})
    }
    const loopRange = () => {
      if (end !== undefined && video.currentTime >= end) {
        video.currentTime = start
        video.play().catch(() => {})
      }
    }
    video.addEventListener('loadedmetadata', begin)
    video.addEventListener('timeupdate', loopRange)
    if (video.readyState >= 1) begin()
    return () => {
      video.removeEventListener('loadedmetadata', begin)
      video.removeEventListener('timeupdate', loopRange)
    }
  }, [start, end])

  return (
    <div className="laptop-screen">
      <video
        ref={videoRef}
        className="laptop-preview-video"
        src={src}
        title={`${title} demo`}
        muted
        autoPlay
        playsInline
        preload="metadata"
      />
    </div>
  )
}

function projectHash(project) {
  return `#projects/${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function projectFromHash(hash) {
  return PROJECTS.find((project) => project.detail && projectHash(project) === hash)?.id ?? null
}

function TypedAvailability() {
  const text = 'Seeking robotics internships and research opportunities in scaling up data collection.'
  const ref = useRef(null)
  const [length, setLength] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? text.length : 0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let timer
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer)
      if (!entry.isIntersecting) return
      let count = 0
      setLength(0)
      timer = window.setInterval(() => {
        count += 1
        setLength(count)
        if (count >= text.length) window.clearInterval(timer)
      }, 32)
    }, { threshold: 0.55 })
    observer.observe(ref.current.closest('#home'))
    return () => {
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [text])
  return (
    <span ref={ref} className="hero-typed" aria-label={text}>
      <span className="hero-typed-space" aria-hidden="true">{text}</span>
      <span className="hero-typed-visible" aria-hidden="true">{text.slice(0, length)}<span className={`hero-type-caret${length >= text.length ? ' hero-type-idle' : ''}`}>|</span></span>
    </span>
  )
}

function AwardHighlight() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.25)
    }, { threshold: [0, 0.25] })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <a ref={ref} className={`about-award${visible ? ' award-visible' : ''}`}
      href="https://www.farmroboticschallenge.ai/2026results/v/hartnell-college?categoryId=6a0cce3c15857b36c0af1c56"
      target="_blank" rel="noopener noreferrer">
      <span className="about-award-content">
        <svg className="about-award-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
          <path d="M7 6H4v2a3 3 0 0 0 3 3m10-5h3v2a3 3 0 0 1-3 3" />
        </svg>
        <span className="about-award-copy">
          <strong className="about-award-title">Western Growers Specialty Crops Award</strong>
          <span className="about-award-meta">Farm Robotics Challenge 2026 · Division II</span>
        </span>
        <span className="about-award-link">View award <span aria-hidden="true">↗</span></span>
      </span>
    </a>
  )
}

function repoInquiryHref(email, projectTitle) {
  const subject = `${projectTitle} repository access request`
  const body = `Hi Alonzo,

I'd like to request access to the ${projectTitle} GitHub repository.

My GitHub username is:

Thank you!`
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function experienceFromHash(hash) {
  const match = /^#qualifications\/(highlights|work|projects|competition|volunteer|education|research)$/.exec(hash)
  return match?.[1] ?? null
}

function App() {
  const [copyStatus, setCopyStatus] = useState('')
  const copyTimer = useRef(null)
  useEffect(() => () => window.clearTimeout(copyTimer.current), [])
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('alonzocabrera48@gmail.com')
      window.clearTimeout(copyTimer.current)
      setCopyStatus('Copied!')
      copyTimer.current = window.setTimeout(() => setCopyStatus(''), 2000)
    } catch {
      window.clearTimeout(copyTimer.current)
      setCopyStatus('Couldn’t copy. Please select and copy the email manually.')
    }
  }

  const [active, setActive] = useState(() => {
    const section = window.location.hash.slice(1)
    if (projectFromHash(window.location.hash) !== null) return 'projects'
    if (experienceFromHash(window.location.hash)) return 'qualifications'
    return SECTIONS.includes(section) ? section : 'home'
  })
  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  // At the very top of the page the nav is transparent and blends into the hero
  // photo (like the reference site); once you scroll it regains its blurred bar.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const [filter, setFilter] = useState('Highlights')
  const [openProject, setOpenProject] = useState(() => projectFromHash(window.location.hash))
  const [showAllQuals, setShowAllQuals] = useState(false)
  const pendingScroll = useRef(experienceFromHash(window.location.hash) ? 'qualifications' : SECTIONS.includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : null)
  const [qualFilter, setQualFilter] = useState(() => experienceFromHash(window.location.hash) || 'highlights')
  const [selectedShotIdx, setBigIdx] = useState(0)
  const [bigDir, setBigDir] = useState(1)
  const [sectionIdx, setSectionIdx] = useState(0)
  const [activeSkill, setActiveSkill] = useState(null)
  const [activeCardTags, setActiveCardTags] = useState(null)
  const [qualPaused, setQualPaused] = useState(false)
  const [projPaused, setProjPaused] = useState(false)
  const [projectSelection, setProjectSelection] = useState({ filter: 'Highlights', id: 3 })
  // Which filter row a click has parked, if any: 'proj' | 'qual' | null. Clicking a
  // tab holds its countdown regardless of the pointer; clicking anywhere off the
  // tabs releases it and the countdown starts over.
  // Bumped on every filter click so the countdown elements remount and the tour
  // restarts — needed because re-clicking the tab you're already on changes no
  // other state, and a running CSS animation won't restart on its own.
  // One restart token per section. They must stay separate: while a skill is
  // selected the Projects bar loops by bumping its token, and a shared one would
  // remount the Experience bar mid-count, so it could never finish and move on.
  const [projRunId, setProjRunId] = useState(0)
  const [projectSpeed, setProjectSpeed] = useState(1)
  const [projectVisited, setProjectVisited] = useState(() => new Set())
  const [qualRunId, setQualRunId] = useState(0)

  useEffect(() => {
    if (openProject === null) return undefined
    const project = PROJECTS.find((item) => item.id === openProject)
    const sectionCount = project?.detail?.sections?.length || 0
    if (sectionCount < 2) return undefined
    const timer = window.setTimeout(
      () => setSectionIdx((current) => (current + 1) % sectionCount),
      PROJECT_SECTION_AUTO_MS
    )
    return () => window.clearTimeout(timer)
  }, [openProject, sectionIdx])


  // Keep skill selection while navigating matching filters/cards. Clear it when
  // clicking outside those matches; skill buttons manage their own selection.
  useEffect(() => {
    const clearSelection = (e) => {
      if (!(e.target instanceof Element)) return
      if (e.target.closest('.skill-item, .cross-note, .filter-match, .card-hl')) return
      setActiveSkill(null)
      setActiveCardTags(null)
    }
    document.addEventListener('click', clearSelection)
    return () => document.removeEventListener('click', clearSelection)
  }, [])

  // Cycle cards within the selected Experience filter.
  // Store the tab with the index so manual tab changes reset the spotlight.
  const [speed, setSpeed] = useState(1)
  const [lastRunningSpeed, setLastRunningSpeed] = useState(1)
  const playbackSpeed = speed || lastRunningSpeed
  const spotlightPaused = qualPaused || speed === 0
  const [spot, setSpot] = useState({ tab: qualFilter, idx: 0 })
  useEffect(() => {
    const restoreExperienceFilter = () => {
      const next = experienceFromHash(window.location.hash)
      if (!next) return
      setQualFilter(next)
      setSpot({ tab: next, idx: 0 })
      setQualRunId((n) => n + 1)
      setActiveSkill((current) => {
        const cards = next === 'highlights' ? QUAL_HIGHLIGHTS : QUALIFICATIONS[next]
        return current && cards.some((item) => item.tags?.includes(current)) ? current : null
      })
      setActiveCardTags(null)
      setOpenProject(null)
      setShowAllQuals(false)
      pendingScroll.current = 'qualifications'
      requestAnimationFrame(() => {
        document.getElementById('qualifications')?.scrollIntoView({ behavior: 'instant' })
      })
    }
    window.addEventListener('hashchange', restoreExperienceFilter)
    window.addEventListener('popstate', restoreExperienceFilter)
    return () => {
      window.removeEventListener('hashchange', restoreExperienceFilter)
      window.removeEventListener('popstate', restoreExperienceFilter)
    }
  }, [])
  const qualCards = qualFilter === 'highlights' ? QUAL_HIGHLIGHTS : QUALIFICATIONS[qualFilter]
  const spotPos =
    spot.tab === qualFilter ? Math.min(spot.idx, qualCards.length - 1) : 0

  // With a skill selected the tour visits only the cards tagged with it; otherwise
  // it loops through the cards in the current tab.
  const skillMatches = activeSkill ? cardsWithSkill(activeSkill) : []

  // Tabs holding at least one match, in tab order
  const skillTabs = [...new Set(skillMatches.map((m) => m.group))]

  const advanceSpotlight = () => {
    if (spotlightPaused) return
    const matches = skillMatches.filter((match) => match.group === qualFilter)
    const at = matches.findIndex((match) => match.idx === spotPos)
    const nextIdx = matches.length
      ? matches[(at + 1) % matches.length].idx
      : (spotPos + 1) % qualCards.length
    setSpot({ tab: qualFilter, idx: nextIdx })
    if (nextIdx <= spotPos) setQualRunId((n) => n + 1)
  }

  // Clicking a skill or a card's "View skills" takes over the highlighting; the
  // spotlight keeps walking underneath but stops driving what's lit.
  const manualHighlight = Boolean(activeSkill || activeCardTags)
  const spotCard = qualCards[spotPos]
  // Education/Research/Volunteer entries carry no tags — spotlight the card, but
  // leave the skills grid alone rather than dimming every item in it.
  const spotTags = !manualHighlight && spotCard?.tags?.length ? spotCard.tags : null

  // How many cards are lit right now in each section. Shown as a badge in the other
  // section, so whichever one you're scrolled to tells you what's waiting elsewhere.
  // Whichever of the two sections you're reading, this reports the other one's count
  // and jumps you there. It sits on the side that section lies on: Experience is
  // below Projects, so from Projects the badge drops to the foot of the screen.
  const renderCrossNote = () => {
    // Disabled for now: Experience now includes project cards, so the jump badge
    // is no longer needed to move between sections.
    return null
    /*
    const onProjects = active === 'projects'
    if (!activeSkill || (!onProjects && active !== 'qualifications')) return null
    const count = onProjects ? qualHlCount : visibleSkillCount
    const target = onProjects ? 'qualifications' : 'projects'
    const label = onProjects ? 'Experience' : 'Projects'
    return (
      <button
        type="button"
        className={`cross-note${onProjects ? ' cross-note-bottom' : ''}`}
        title={`${count} in ${label}`}
        aria-label={`${count} matching card${count === 1 ? '' : 's'} in ${label} — go there`}
        onClick={() =>
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
        }
      >
        {count}
      </button>
    )
    */
  }

  // Forward: click a skill → highlight matching cards
  const selectSkill = (skill) => {
    setActiveCardTags(null)
    const next = activeSkill === skill ? null : skill
    setActiveSkill(next)
    // Cut straight to the first card tagged with it so the tour starts where it matters
    const first = next ? cardsWithSkill(next)[0] : null
    if (first) {
      setQualFilter(first.group)
      setSpot({ tab: first.group, idx: first.idx })
    }
    setQualRunId((n) => n + 1)
  }

  // A clicked card wins, then the spotlight's card, then a clicked skill.
  const litTags = activeCardTags ? activeCardTags.tags : spotTags
  const skillHighlighted = (it) => (litTags ? litTags.includes(it) : activeSkill === it)
  const skillDimmed = (it) => Boolean(litTags) && !litTags.includes(it)

  const openProjectView = (id) => {
    const project = PROJECTS.find((item) => item.id === id)
    if (!project?.detail) return
    window.history.replaceState(window.history.state, '', projectHash(project))
    setActive('projects')
    setShowAllQuals(false)
    setOpenProject(id)
    setSectionIdx(0)
    setBigIdx(0)
    setBigDir(1)
    window.scrollTo(0, 0)
  }

  const closeToSection = (id) => {
    window.location.assign(`#${id}`)
    pendingScroll.current = id
    setOpenProject(null)
    setShowAllQuals(false)
  }
  useEffect(() => {
    if (openProject !== null || showAllQuals) return

    const rememberSection = (id) => {
      setActive(id)
      const hash = id === 'qualifications' ? `#qualifications/${qualFilter}` : `#${id}`
      if (window.location.hash !== hash) {
        window.history.replaceState(window.history.state, '', hash)
      }
    }

    // Resolve the active section from scroll position rather than an
    // IntersectionObserver band: a band only reports when a section crosses it, so
    // whenever none is inside it the highlight sticks on a stale section — which is
    // what kept Contact from lighting up at the foot of the page.
    const pickActive = () => {
      const els = SECTIONS.map((id) => [id, document.getElementById(id)]).filter(
        ([, el]) => el
      )
      if (!els.length) return

      // The foot of the page always belongs to the final section, which may be too
      // short to reach the probe line on a tall viewport.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        rememberSection(els[els.length - 1][0])
        return
      }

      // Otherwise it's the last section whose top has passed the probe line.
      const probe = window.innerHeight * 0.45
      let current = els[0][0]
      for (const [id, el] of els) {
        if (el.getBoundingClientRect().top <= probe) current = id
      }
      rememberSection(current)
    }

    if (pendingScroll.current) {
      const el = document.getElementById(pendingScroll.current)
      if (el) el.scrollIntoView({ behavior: 'instant' })
      pendingScroll.current = null
    }
    pickActive()
    window.addEventListener('scroll', pickActive, { passive: true })
    window.addEventListener('resize', pickActive)

    return () => {
      window.removeEventListener('scroll', pickActive)
      window.removeEventListener('resize', pickActive)
    }
  }, [openProject, showAllQuals, qualFilter])

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
    <nav
      className={`nav${
        !scrolled && openProject === null && !showAllQuals ? ' nav-top' : ''
      }`}
    >
      <div className="nav-inner">
        <a
          href="#home"
          className="nav-brand"
          onClick={(event) => {
            if (openProject !== null || showAllQuals) {
              event.preventDefault()
              closeToSection('home')
            }
          }}
        >
          <span className="nav-brand-mark">AC</span>
          <span className="nav-logo">Alonzo&nbsp;Cabrera</span>
        </a>
        <ul className="nav-links">
          {navLink('about', 'About')}
          {navLink('projects', 'Projects')}
          {navLink('qualifications', 'Experience')}
          {navLink('contact', 'Contact')}
        </ul>
        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="12" cy="12" r="4.2" />
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
                <line x1="4.5" y1="4.5" x2="6.6" y2="6.6" />
                <line x1="17.4" y1="17.4" x2="19.5" y2="19.5" />
                <line x1="4.5" y1="19.5" x2="6.6" y2="17.4" />
                <line x1="17.4" y1="6.6" x2="19.5" y2="4.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  )

  // Rail waypoints. The solid "travelled" line grows to the active dot: each step is
  // one dot (10px) plus the gap (18px), and --rail-step keeps CSS and JS in sync.
  const renderRail = () => {
    const activeIdx = Math.max(0, RAIL.findIndex((s) => s.id === active))
    return (
      <nav
        className={`rail${active === 'home' ? ' rail-top' : ''}`}
        aria-label="Section progress"
        style={{ '--flown': `${activeIdx * 28}px` }}
      >
        {RAIL.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`rail-dot${i === activeIdx ? ' rail-active' : ''}${
              i < activeIdx ? ' rail-visited' : ''
            }`}
            aria-label={s.label}
            aria-current={i === activeIdx ? 'true' : undefined}
          >
            <span className="rail-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="rail-mark" />
            <span className="rail-label">{s.label}</span>
          </a>
        ))}
      </nav>
    )
  }

  const filtered = filter === 'Highlights' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)
  // With a skill selected, the projects carrying it float to the front of the grid.
  // sort() is stable, so everything keeps its relative order within each group.
  const shownProjects = [...filtered].sort(
    (a, b) => Number(b.category === 'Robotics') - Number(a.category === 'Robotics')
  )
  const featured = shownProjects.find((project) =>
    projectSelection.filter === filter && project.id === projectSelection.id
  ) || shownProjects[0]
  const projectTourPaused = projPaused || active !== 'projects'
  const projectPlaybackSpeed = projectSpeed || 1
  const selectProjectPreview = (id, resetVisited = true) => {
    if (resetVisited) {
      // Every click recomputes from scratch, purely off the clicked card's
      // position — not off wherever the tour previously was. That's what makes
      // it safe to click over and over (or double-click) without the trail
      // getting mixed up: there's no history to stomp, just "everything before
      // this card is passed," fully determined by the one id we were given.
      if (id === featured.id) return
      const toIdx = shownProjects.findIndex((project) => project.id === id)
      setProjectVisited(new Set(shownProjects.slice(0, toIdx).map((project) => project.id)))
    }
    setProjectSelection({ filter, id })
    setProjRunId((n) => n + 1)
  }
  const advanceProjectPreview = () => {
    if (projectTourPaused) return
    const index = shownProjects.findIndex((project) => project.id === featured.id)
    const wrapping = index + 1 >= shownProjects.length
    setProjectVisited((visited) => (wrapping ? new Set() : new Set(visited).add(featured.id)))
    selectProjectPreview(shownProjects[(index + 1) % shownProjects.length].id, false)
  }
  const QUAL_GROUPS = [
    { key: 'work', label: 'Work' },
    { key: 'projects', label: 'Projects' },
    { key: 'competition', label: 'Competition' },
    { key: 'volunteer', label: 'Volunteer' },
    { key: 'education', label: 'Education' },
    { key: 'research', label: 'Research' },
  ]

  const renderSkillCard = (cat) => (
    <div className="skill-card" key={cat.category}>
      <h4 className="skill-cat">
        <span className="skill-dot" />
        {cat.category}
      </h4>
      <div className="skill-items">
        {cat.items.map((it) => (
          <button
            type="button"
            className={`skill-item${skillHighlighted(it) ? ' skill-item-active' : ''}${
              skillDimmed(it) ? ' skill-item-dim' : ''
            }`}
            key={it}
            onClick={() => selectSkill(it)}
            aria-pressed={activeSkill === it}
          >
            {it}
          </button>
        ))}
      </div>
    </div>
  )

  // showSkillBtn / groupKey are kept for the commented-out "View skills" button below.
  // `spot` is null in the See All view, where the spotlight doesn't run; otherwise
  // 'current' (drawing now), 'visited' (already drawn, held until the tab changes)
  // or 'upcoming' (not reached yet).
  // eslint-disable-next-line no-unused-vars
  const renderQualCard = (item, i, showSkillBtn = false, groupKey = null, spot = null) => {
    const highlightCategory = groupKey === 'highlights'
      ? QUAL_GROUPS.find((group) => QUALIFICATIONS[group.key].includes(item))?.label
      : null
    const drawn = spot === 'current' || spot === 'visited'
    const state = activeSkill
      ? // Skill mode: every tagged card wears the full highlight, like a pinned
        // project card. No outline travels, so nothing doubles up on the border.
        item.tags?.includes(activeSkill)
        ? ' card-hl'
        : ' card-dim'
      : spot === null || manualHighlight
        ? ''
        : // No card-hl on a lit card — the edge line is the spotlight's highlight and
          // the accent border would double up on top of it. Only what the spotlight
          // hasn't reached yet stays dimmed; everything it has passed holds.
          spot === 'upcoming'
          ? ' card-dim'
          : ''
    const held = spot === 'visited' ? 'true' : undefined
    const frozen = spotlightPaused ? 'true' : undefined
    // Cards are seekable: clicking one cuts the spotlight to that card, replays its
    // outline from the start and carries on from there. Cards before it read as
    // already-passed, same as if the tour had walked there. Not in the See All view,
    // where the spotlight doesn't run.
    const seekable = spot !== null
    const seek = () => {
      setSpot({ tab: qualFilter, idx: i })
      setQualRunId((n) => n + 1)
    }
    // Six segments trace the whole card: both halves of the left edge open from the
    // middle, the top and bottom edges run across, and the right-edge halves close
    // back to the middle — where the bridge picks up. Timings are proportional to
    // each segment's length (20/60/20) so the outline draws at one speed.
    const seg = (name) => (
      <span
        key={`${qualFilter}-${i}-${name}-${playbackSpeed}-${qualRunId}`}
        className={`qual-spot-seg seg-${name}`}
        data-done={held}
        data-paused={frozen}
        aria-hidden="true"
      />
    )
    return (
    <div
      className={`qual-card${state}${seekable ? ' qual-card-seek' : ''}`}
      key={i}
      style={
        drawn
          ? {
              '--grow': `${GROW_MS / playbackSpeed}ms`,
              '--bridge': `${BRIDGE_MS / playbackSpeed}ms`,
            }
          : undefined
      }
      role={seekable ? 'button' : undefined}
      tabIndex={seekable ? 0 : undefined}
      aria-label={seekable ? `Play the spotlight from ${item.org}` : undefined}
      onClick={(e) => {
        if (activeSkill && item.tags?.includes(activeSkill)) e.stopPropagation()
        if (seekable && !e.target.closest('a, button')) seek()
      }}
      onKeyDown={
        seekable
          ? (e) => {
              if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                seek()
              }
            }
          : undefined
      }
    >
      {drawn && (
        <>
          {seg('lu')}
          {seg('ld')}
          {seg('t')}
          {seg('b')}
          {seg('ru')}
          {seg('rd')}
          <span
            key={`${qualFilter}-${i}-bridge-${playbackSpeed}-${qualRunId}`}
            className="qual-spot-bridge"
            data-done={held}
            data-paused={frozen}
            onAnimationEnd={spot === 'current' ? advanceSpotlight : undefined}
            aria-hidden="true"
          />
        </>
      )}
      {highlightCategory && <span className="qual-category">{highlightCategory}</span>}
      <h3 className="qual-org">{item.org}</h3>
      <p className="qual-role">{item.role}</p>
      {/* <p className="qual-period">{item.period}</p> */}
      {item.location && (
        <p className="qual-loc">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {item.location}
        </p>
      )}
      {item.bullets ? (
        <ul className="qual-bullets">
          {item.bullets.map((b, j) => (
            <li key={j}>{b}</li>
          ))}
        </ul>
      ) : (
        item.desc && <p className="qual-desc">{item.desc}</p>
      )}
      {item.projectId != null && (
        <button type="button" className="qual-evidence-link" onClick={() => openProjectView(item.projectId)}>
          View project <span aria-hidden="true">↗</span>
        </button>
      )}
      {item.evidence && (
        <a className="qual-evidence-link" href={item.evidence.url} target="_blank" rel="noopener noreferrer">
          {item.evidence.label} <span aria-hidden="true">↗</span>
        </a>
      )}
      {/* {showSkillBtn && item.tags?.length > 0 && (
        <button
          type="button"
          className={`card-skill-btn${activeCardTags?.id === `q-${item.org}` ? ' card-skill-btn-active' : ''}`}
          onClick={(e) => showCardSkills(e, `q-${item.org}`, item.tags, { groupKey })}
        >
          View skills
        </button>
      )} */}
    </div>
    )
  }

  const renderQualGroup = (group) => (
    <div className="qual-group" key={group.key}>
      <h3 className="qual-group-head">{group.label}</h3>
      <div className="qual-list">
        {QUALIFICATIONS[group.key].map((item, i) => renderQualCard(item, i, true, group.key))}
      </div>
    </div>
  )

  const renderSkills = () => (
    <div className="qual-skills" id="skills-toolkit">
      <div className="qual-skills-head">
        <h3 className="qual-skills-title">Skills &amp; Toolkit</h3>
        {(activeSkill || activeCardTags) && (
          <button
            type="button"
            className="skills-clear-btn"
            onClick={() => {
              setActiveSkill(null)
              setActiveCardTags(null)
            }}
          >
            Clear all
          </button>
        )}
      </div>
      <p className="skills-context" aria-live={activeSkill || activeCardTags ? 'polite' : 'off'}>
        {activeSkill
          ? `Showing experience connected to ${activeSkill}. Click the skill again to clear.`
          : litTags?.length
            ? `Green highlights show skills used in ${activeCardTags?.org || spotCard?.org || 'the selected experience'}. Click a skill to find related work.`
            : 'Click a skill to highlight related experience. Green highlights follow the card spotlight.'}
      </p>
      <div className="skills-grid">
        {SKILLS.map(renderSkillCard)}
      </div>
    </div>
  )

  // ── All qualifications view ──
  if (showAllQuals) {
    return (
      <>
        {renderNav()}
        <main className="qual-all">
          <div className="qual-all-inner">
            <div className="qual-all-cards">
              <p className="detail-breadcrumb">
                <button className="detail-crumb-link" onClick={() => closeToSection('qualifications')}>
                  Experience
                </button>
                <span className="detail-crumb-sep"> › </span>
                <span className="detail-crumb-current">All experience</span>
                <span className="qual-overview-hint">Hover over a card to view more</span>
              </p>
              <div className="qual-all-cards-scroll">
                <div className="qual-scroll-fade qual-scroll-fade-top" aria-hidden="true" />
                {QUAL_GROUPS.filter((group) => ['work', 'projects'].includes(group.key)).map(renderQualGroup)}
                {renderQualGroup(QUAL_GROUPS.find((group) => group.key === 'competition'))}
                {['volunteer', 'education', 'research'].map((key) => renderQualGroup(QUAL_GROUPS.find((group) => group.key === key)))}
                <div className="qual-scroll-fade qual-scroll-fade-bottom" aria-hidden="true" />
              </div>
              <button className="qual-goback" onClick={() => closeToSection('qualifications')}>
                (go back)
              </button>
            </div>
            {/* Globe temporarily disabled — re-enable to bring the map back
            <div className="qual-all-map">
              <LocationMap active={mapLocation} />
              <p className="qual-map-hint">Click a card to fly the globe to its location</p>
            </div>
            */}
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
    const shots = (d?.gallery || []).filter((s) => s.src)
    const bigIdx = Math.min(selectedShotIdx, Math.max(0, shots.length - 1))
    const sections = d?.sections || []
    const sec = sections[sectionIdx] || {}
    const bigImageSrc = shots[bigIdx]?.src || d?.topImage
    const bigIsIframe = shots[bigIdx]?.type === 'iframe'
    const bigIsVideo = shots[bigIdx]?.type === 'video'
    const bigIsModel = shots[bigIdx]?.type === 'model'
    const goToShot = (nextIdx, dir) => {
      setBigDir(dir)
      setBigIdx((nextIdx + shots.length) % shots.length)
    }
    return (
      <>
        {renderNav()}
        <main className="detail">
          <div className="detail-inner">
            <div className="detail-grid">
              {/* LEFT */}
              <div className="detail-left">
                <div className="detail-headrow">
                  {p.id === 4 ? (
                    <h1 className="detail-title detail-title-teleop">{p.title}</h1>
                  ) : (
                    <h1 className="detail-title">{p.title}</h1>
                  )}

                  <div className="detail-meta">
                  <div className="detail-meta-col">
                    <h4>Tech Stack</h4>
                    <ScrollingTechStack key={p.id} items={d.techStack} />
                  </div>
                  <div className="detail-meta-col">
                    <h4>Key Traits</h4>
                    <div className="detail-meta-scroll" tabIndex={0} role="region" aria-label="Key Traits">
                      {d.strategy.map((s) => (
                        <p key={s}>{s}</p>
                      ))}
                    </div>
                  </div>
                  <div className="detail-meta-col">
                    <h4>Purpose</h4>
                    <p>{d.purpose}</p>
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

                {/* Top media (video or gif/image) — only when present */}
                {(bigImageSrc || d.video) && (
                  <div className="detail-video" style={{ '--gallery-aspect': d?.galleryAspect || 1.9 }}>
                    {bigImageSrc && shots.length > 1 && (
                      <button
                        className="detail-arrow detail-video-arrow"
                        aria-label="Previous demo screen"
                        onClick={() => goToShot(bigIdx - 1, -1)}
                      >
                        ←
                      </button>
                    )}
                    {shots[bigIdx]?.type === 'homepage-preview' ? (
                      <HomepagePreview key={bigIdx} src={bigImageSrc} previewWidth={shots[bigIdx].previewWidth} title={`${p.title} homepage preview`} />
                    ) : bigIsModel ? (
                      <ModelEmbed
                        key={bigIdx}
                        src={bigImageSrc}
                        alt={`${p.title} 3D model`}
                        className="detail-video-el detail-video-model detail-media-transition"
                        style={{ '--slide-dir': bigDir }}
                      />
                    ) : bigIsVideo ? (
                      <video
                        key={bigIdx}
                        src={bigImageSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`detail-video-el detail-media-transition${p.id === 4 && shots[bigIdx]?.label === 'Live Demo' ? ' detail-video-fill' : ''}`}
                        style={{ '--slide-dir': bigDir }}
                      />
                    ) : shots[bigIdx]?.type === 'pan-image' ? (
                      <ImageViewer key={bigImageSrc} src={bigImageSrc} title={`${p.title} ${shots[bigIdx].label}`} />
                    ) : bigIsIframe ? (
                      <InteractiveEmbed
                        key={bigIdx}
                        src={bigImageSrc}
                        title={`${p.title} ${shots[bigIdx].label}`}
                        hint={shots[bigIdx].hint}
                        className={`detail-video-el detail-video-iframe detail-media-transition${['Live View', 'Live Demo'].includes(shots[bigIdx].label) ? ' detail-live-view-embed' : ''}`}
                        style={{ '--slide-dir': bigDir }}
                      />
                    ) : bigImageSrc ? (
                      <img
                        key={bigIdx}
                        src={bigImageSrc}
                        alt={`${p.title} demo`}
                        className="detail-video-el detail-media-transition"
                        style={{ '--slide-dir': bigDir }}
                      />
                    ) : (
                      <video
                        src={d.video}
                        controls
                        playsInline
                        preload="metadata"
                        className="detail-video-el"
                      />
                    )}
                    {bigImageSrc && shots.length > 1 && (
                      <button
                        className="detail-arrow detail-video-arrow detail-video-arrow-next"
                        aria-label="Next demo screen"
                        onClick={() => goToShot(bigIdx + 1, 1)}
                      >
                        →
                      </button>
                    )}
                  </div>
                )}

                {/* Gallery */}
                {shots.length > 0 && (
                  <div className="detail-gallery" style={{ '--gallery-aspect': d?.galleryAspect || 1.9 }}>
                    {shots.map((s, i) => (
                      <figure className="detail-gallery-item" key={i}>
                        <button
                          type="button"
                          className={`detail-gallery-frame${i === bigIdx ? ' detail-gallery-frame-active' : ''}`}
                          onClick={() => goToShot(i, i >= bigIdx ? 1 : -1)}
                          aria-label={`Show ${s.label} in the big screen`}
                        >
                          {s.type === 'homepage-preview' ? (
                            <HomepagePreview src={s.src} previewWidth={s.previewWidth} title={`${p.title} homepage preview`} />
                          ) : s.label === 'System Architecture' ? (
                            <span className="detail-gallery-technical-thumb" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="1.6" strokeLinejoin="round">
                                <rect x="8" y="2" width="8" height="6" rx="1.5" />
                                <path d="M12 8v5M5 16v-3h14v3" />
                                <rect x="1" y="16" width="8" height="6" rx="1.5" />
                                <rect x="15" y="16" width="8" height="6" rx="1.5" />
                              </svg>
                            </span>
                          ) : ['Live View', 'Live Demo'].includes(s.label) ? (
                            <span className="detail-gallery-live-thumb" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="1.6" strokeLinejoin="round">
                                <rect x="2.5" y="3.5" width="19" height="14" rx="2" />
                                <path d="M8 21h8m-4-3.5V21M6 7h12M6 10h7" />
                              </svg>
                            </span>
                          ) : s.type === 'iframe' || s.type === 'pan-image' ? (
                            <span className="detail-gallery-prototype-thumb" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
                                <rect x="3" y="3" width="13" height="13" rx="3" fill="white" fillOpacity="0.92" />
                                <rect x="8" y="8" width="13" height="13" rx="3" fill="white" fillOpacity="0.55" />
                              </svg>
                            </span>
                          ) : s.type === 'video' ? (
                            <video src={s.src} muted playsInline preload="metadata" />
                          ) : s.type === 'model' ? (
                            <span className="detail-gallery-prototype-thumb" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="1.5">
                                <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
                                <path d="M12 2v10M3 7l9 5 9-5M12 12v10" />
                              </svg>
                            </span>
                          ) : (
                            <img src={s.src} alt={s.label} />
                          )}
                        </button>
                        <figcaption className="detail-gallery-label">{s.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="detail-right">
                <div className="detail-block">
                  <div className="detail-block-head">
                    <h3 className="detail-h">Summary</h3>
                    {d.repoInquiry && (
                      <a className="detail-github" href={repoInquiryHref(d.repoInquiry, p.title)} target="_blank" rel="noopener noreferrer" title={d.repoInquiry}>GitHub inquiries <span aria-hidden="true">→</span></a>
                    )}
                    {d?.github && d.github !== '#' && (
                      <a
                        className="detail-github"
                        href={d.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Github <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>

                  {d.summary.map((para, i) => (
                    <p key={i} className="detail-body">{para}</p>
                  ))}

                </div>

                <div className="detail-block">
                  <div className="detail-block-head">
                    <div className="detail-section-title-wrap">
                      <h3 className="detail-h">{sec.title}</h3>
                      {sections.length > 1 && (
                        <div className="detail-section-countdown" aria-label={`Switching from ${sec.title}`}>
                          <span
                            key={`section-countdown-${openProject}-${sectionIdx}`}
                            className="detail-section-countdown-fill"
                            style={{ '--section-auto-ms': `${PROJECT_SECTION_AUTO_MS}ms` }}
                          />
                        </div>
                      )}
                    </div>
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
                  <div className="detail-section-stack">
                    {sections.map((s, i) => (
                      <div
                        key={i}
                        className={`detail-section-pane${i === sectionIdx ? ' detail-section-pane-active' : ''}`}
                        aria-hidden={i !== sectionIdx}
                      >
                        <p className="detail-body">{s.text}</p>

                        {s.image && (
                          <div className="detail-problem-img">
                            <img src={s.image} alt={`${s.title} illustration`} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {d.award && (
                  <div className="detail-block">
                    <a className="detail-award" href={d.award.url} target="_blank" rel="noopener noreferrer">
                      <span className="detail-award-label">Award winner</span>
                      <strong>{d.award.label} <span aria-hidden="true">↗</span></strong>
                      <span>{d.award.event}</span>
                    </a>
                  </div>
                )}

                {next && next.id !== p.id && (
                  <nav className="detail-project-nav" aria-label="Project navigation">
                    {[
                      { project: prev, label: 'Previous', arrow: '←', dir: 'prev' },
                      { project: next, label: 'Next', arrow: '→', dir: 'next' },
                    ].map(({ project, label, arrow, dir }) => (
                      <button
                        type="button"
                        className={`detail-project-link detail-project-link-${dir}`}
                        key={label}
                        onClick={() =>
                          project.detail ? openProjectView(project.id) : closeToSection('projects')
                        }
                      >
                        <span className="detail-project-thumb">
                          <img src={project.image} alt="" />
                        </span>
                        <span className="detail-project-text">
                          <span className="detail-next-head">
                            {dir === 'prev' && <span aria-hidden="true">{arrow}</span>}
                            <span>{label} Project</span>
                            {dir === 'next' && <span aria-hidden="true">{arrow}</span>}
                          </span>
                          <span className="detail-next-title">{project.title}</span>
                          <span className="detail-next-cat">{project.category}</span>
                        </span>
                      </button>
                    ))}
                  </nav>
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
      {renderRail()}
      {renderCrossNote()}

      {/* ── Hero ── */}
      <section id="home" className="hero">
        <HeroReticle />
        {/* <HeroRover /> */}
        <div className="hero-inner">
          <p className="hero-status">
            <span className="hero-pulse" aria-hidden="true" />
            <TypedAvailability />
          </p>

          <h1 className="hero-title">
            <span className="hero-title-line">AI&#8209;enabled robotics</span>
            <span className="hero-title-line">on working farms.</span>
          </h1>
  
          <p className="hero-lede">
            I’m <strong>Alonzo</strong>, a computer science student at UC San Diego building
            perception and control systems for agricultural robots.
          </p>
  
          <div className="hero-cta">
            <a
              href="#projects"
              className="hero-btn hero-btn-solid"
            >
              View my projects
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href={`${import.meta.env.BASE_URL}Alonzo-Cabrera-Resume.pdf`} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn-ghost">
              Résumé ↗
            </a>
          </div>
  
          <div className="hero-meta">
            <a href="https://github.com/AlonCS" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <span aria-hidden="true">/</span>
            <a href="https://www.linkedin.com/in/alonzo-cabrera/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="about">
        <div className="section-head">
          <span className="section-index">01</span>
          <h2 className="section-label">About</h2>
        </div>
        <div className="about-inner">
          <div className="about-photo">
            <img src={portrait} alt="Alonzo Cabrera outside Intel’s Robert N. Noyce Building" />
          </div>
          <div className="about-text">
            <div className="about-introduction">
              <p className="about-greeting">Nice to meet you all, I’m</p>
              <h3 className="about-title">Alonzo Cabrera Sanchez</h3>
              <p className="about-nickname">Lonzo, for short.</p>
            </div>
            <p className="about-experience">
              My experience spans software development and robotics, from building front-end applications to developing ROS 2 interfaces and perception pipelines for real-world robotic systems. I’ve worked on agricultural robot integration, field data collection, and manufacturing automation, connecting software with the hardware it controls.
            </p>
            <p className="about-latino">
              As a first-generation Latino studying computer science at UC San Diego, I want to contribute to the future of farming through robotics. I’m especially interested in robot learning and vision-based control.
            </p>
            <p className="about-latino">
              In my free time, I like sharing what I’ve learned about robotics and would enjoy mentoring through programs with X Academy and the Santa Cruz County Office of Education (Santa Cruz COE).
            </p>
            <AwardHighlight />
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="projects">
        <div className="projects-inner">

          <div className="projects-hero">

            {/* LEFT: title + description */}
            <div className="projects-hero-left">
              <span className="section-index">02</span>
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
                <p className="featured-label-name" title={featured?.title}>{featured?.title}</p>
                <button
                  type="button"
                  className="view-project-btn"
                  onClick={() => featured?.detail && openProjectView(featured.id)}
                  onMouseEnter={() => setProjPaused(true)}
                  onMouseLeave={() => setProjPaused(false)}
                >
                  <span className="view-project-btn-label">View Project</span><span aria-hidden="true">→</span>
                </button>
              </div>

              {/* Laptop mockup */}
              <div
                className="laptop-wrap"
                onMouseEnter={() => setProjPaused(true)}
                onMouseLeave={() => setProjPaused(false)}
              >
                <div className="laptop-lid">
                  {featured.detail?.liveDemo ? (
                    <ProjectLaptopDemo key={`${featured.id}-${projRunId}`} src={featured.detail.liveDemo} title={featured.title} />
                  ) : featured.detail?.previewVideo ? (
                    <ProjectVideoPreview key={`${featured.id}-${projRunId}`} src={featured.detail.previewVideo} title={featured.title} start={6} end={19.26} />
                  ) : (
                    <div className="laptop-screen">
                      <img key={`${featured.id}-${projRunId}`} className="laptop-preview-gif" src={featured.image} alt={`${featured.title} demo`} />
                    </div>
                  )}
                </div>
                <div className="laptop-base" aria-hidden="true">
                  <div className="laptop-notch"/>
                </div>
                {featured.detail?.liveDemo && (
                  <p className="laptop-demo-note">
                    Interactive live demo · click and explore {featured.title}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Filter bar */}
          <div
            className="projects-filter-row"
            onMouseEnter={() => setProjPaused(true)}
            onMouseLeave={() => setProjPaused(false)}
          >
            <div className="projects-filter">
              <span className="filter-prefix">Filter by </span>
              {FILTERS.map((f, i) => (
                <span key={f}>
                  <button
                    className={`filter-btn${filter === f ? ' filter-active' : ''}`}
                    onClick={() => {
                      setFilter(f)
                      setProjectVisited(new Set())
                      setProjRunId((n) => n + 1)
                    }}
                    aria-pressed={filter === f}
                  >
                    {f}

                  </button>
                  {i < FILTERS.length - 1 && <span className="filter-sep"> | </span>}
                </span>
              ))}
            </div>
            <div className="qual-row-actions project-row-actions">
              <div className="speed-group" role="group" aria-label="Project preview speed">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`speed-btn${projectSpeed === s ? ' speed-active' : ''}`}
                    onClick={() => {
                      setProjectSpeed(s)
                      setProjRunId((n) => n + 1)
                    }}
                    aria-label={s === 0 ? 'Pause project previews' : `Project preview speed ${s}×`}
                    aria-pressed={projectSpeed === s}
                  >
                    {s}&times;
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div
            className="projects-grid"
            onMouseEnter={() => setProjPaused(true)}
            onMouseLeave={() => setProjPaused(false)}
          >
            {shownProjects.map((project) => (
              <article
                key={project.id}
                onClick={(event) => {
                  if (!event.target.closest('a,button')) selectProjectPreview(project.id)
                }}
                className={`project-card${project.id === featured.id ? ' project-preview-active' : projectVisited.has(project.id) ? ' project-preview-passed' : ' project-preview-dim'}${project.detail ? '' : ' project-card-static'}`}
              >
                {(project.id === featured.id || projectVisited.has(project.id)) && ['lu', 'ld', 't', 'b', 'ru', 'rd'].map((edge) => (
                  <span
                    key={`${filter}-${project.id}-${projRunId}-${projectPlaybackSpeed}-${edge}`}
                    className={`qual-spot-seg project-spot-seg seg-${edge}`}
                    style={{ '--grow': `${PROJECT_PREVIEW_MS / projectPlaybackSpeed}ms`, '--bridge': `${BRIDGE_MS / projectPlaybackSpeed}ms` }}
                    data-paused={projectTourPaused || projectSpeed === 0 ? 'true' : undefined}
                    data-done={projectVisited.has(project.id) ? 'true' : undefined}
                    aria-hidden="true"
                  />
                ))}
                {(project.id === featured.id || projectVisited.has(project.id)) && <span
                  key={`${filter}-${project.id}-${projRunId}-${projectPlaybackSpeed}-bridge`}
                  className="qual-spot-bridge project-spot-bridge"
                  style={{ '--grow': `${PROJECT_PREVIEW_MS / projectPlaybackSpeed}ms`, '--bridge': `${BRIDGE_MS / projectPlaybackSpeed}ms` }}
                  data-paused={projectTourPaused || projectSpeed === 0 ? 'true' : undefined}
                  data-done={projectVisited.has(project.id) ? 'true' : undefined}
                  onAnimationEnd={project.id === featured.id ? advanceProjectPreview : undefined}
                  aria-hidden="true"
                />}
                <button type="button" className="project-card-img" onClick={() => selectProjectPreview(project.id)} aria-pressed={project.id === featured.id} aria-label={`Preview ${project.title} in the laptop`}>
                  {project.cardVideo
                    ? <video src={project.cardVideo} muted autoPlay loop playsInline preload="metadata" aria-label={`${project.title} Controller Test`} />
                    : project.image
                    ? <img src={project.image} alt={project.title} />
                    : <div className="project-card-placeholder" />
                  }
                </button>
                <div className="project-card-info">
                  <button type="button" className="project-card-title project-preview-title" onClick={() => selectProjectPreview(project.id)} aria-pressed={project.id === featured.id}>{project.title}</button>
                  <p className="project-card-category">{project.category}</p>
                  <div className="project-card-actions">
                    {project.detail?.repoInquiry ? (
                      <a href={repoInquiryHref(project.detail.repoInquiry, project.title)} target="_blank" rel="noopener noreferrer" title={project.detail.repoInquiry} aria-label={`Request ${project.title} repository access by email`}>Request repo access ↗</a>
                    ) : project.detail?.github && project.detail.github !== '#' ? (
                      <a href={project.detail.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`}>View GitHub ↗</a>
                    ) : (
                      <button type="button" disabled title="Repository link not yet added">View GitHub ↗</button>
                    )}
                    <button type="button" onClick={() => openProjectView(project.id)}>View more ↗</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ── Experience ── */}
      <section id="qualifications" className="qualifications">
        <div className="qual-inner">
          <span className="section-index">03</span>
          <h2 className="qual-title">Experience</h2>

          <div
            className="projects-filter-row qual-filter-row"
            onMouseEnter={() => setQualPaused(true)}
            onMouseLeave={() => setQualPaused(false)}
          >
            <div className="projects-filter">
              <span className="filter-prefix">Filter by </span>
              {[{ key: 'highlights', label: 'Highlights' }, ...QUAL_GROUPS].map((g, i) => {
                // Cards in this tab carrying the selected skill — sizes the countdown
                const hits = activeSkill
                  ? skillMatches.filter((m) => m.group === g.key)
                  : []
                return (
                <span key={g.key}>
                  <a
                    className={`filter-btn${qualFilter === g.key ? ' filter-active' : ''}${
                      activeSkill && skillTabs.includes(g.key) ? ' filter-match' : ''
                    }`}
                    href={`#qualifications/${g.key}`}
                    onClick={(e) => {
                      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
                      e.preventDefault()
                      if (activeSkill && skillTabs.includes(g.key)) e.stopPropagation()
                      const hash = `#qualifications/${g.key}`
                      if (window.location.hash !== hash) window.history.pushState(window.history.state, '', hash)
                      // Any tab click restarts that tab's tour from the first card,
                      // clearing the trail of held outlines behind it.
                      setQualFilter(g.key)
                      setSpot({ tab: g.key, idx: 0 })
                      setQualRunId((n) => n + 1)
                    }}
                    aria-current={qualFilter === g.key ? 'true' : undefined}
                  >
                    {g.label}
                    {qualFilter === g.key && !activeSkill && (
                      <span
                        key={`${g.key}-${playbackSpeed}-${qualRunId}`}
                        className="filter-progress"
                        /* Normally one card-rest per card, with the cards driving
                           the tab. In skill mode the cards don't walk, so this bar
                           is the clock and times only the matching cards. */
                        style={{
                          animationDuration: `${
                            ((activeSkill ? hits.length : (g.key === 'highlights' ? QUAL_HIGHLIGHTS.length : QUALIFICATIONS[g.key].length)) *
                              CARD_MS) /
                            playbackSpeed
                          }ms`,
                        }}
                        data-paused={spotlightPaused ? 'true' : undefined}
                        aria-hidden="true"
                      />
                    )}
                  </a>
                  {i < QUAL_GROUPS.length && <span className="filter-sep"> | </span>}
                </span>
                )
              })}
            </div>
            <div className="qual-row-actions">
              <div className="speed-group" role="group" aria-label="Spotlight speed">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`speed-btn${speed === s ? ' speed-active' : ''}`}
                    onClick={() => {
                      setSpeed(s)
                      if (s > 0) setLastRunningSpeed(s)
                    }}
                    aria-label={s === 0 ? 'Pause spotlight' : `Spotlight speed ${s}×`}
                    aria-pressed={speed === s}
                  >
                    {s}&times;
                  </button>
                ))}
              </div>
              <button
                className="see-all-btn"
                onClick={() => {
                  setShowAllQuals(true)
                  window.scrollTo(0, 0)
                }}
              >
                View all experience
              </button>
            </div>
          </div>

          <div
            className="qual-list"
            onMouseEnter={() => setQualPaused(true)}
            onMouseLeave={() => setQualPaused(false)}
          >
            {qualCards.map((item, i) =>
              renderQualCard(
                item,
                i,
                true,
                qualFilter,
                activeSkill
                  ? null
                  : i < spotPos
                    ? 'visited'
                    : i === spotPos
                      ? 'current'
                      : 'upcoming'
              )
            )}
          </div>

          {renderSkills()}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="contact" aria-labelledby="contact-title">
        <div className="contact-inner">
          <div className="contact-content">
            <div className="contact-message">
              <span className="section-index">04 · Contact</span>
              <h2 id="contact-title" className="contact-title">Let’s build<br /><span>something useful.</span></h2>
              <p className="contact-intro">Open to robotics research internships and conversations about robot learning and agricultural robotics.</p>
            </div>
            <div className="contact-actions">
              <div className="contact-email-row">
                <a className="contact-email" href={`https://mail.google.com/mail/?view=cm&fs=1&to=alonzocabrera48%40gmail.com&su=${encodeURIComponent("Let’s connect")}&body=${encodeURIComponent("Hi Alonzo,\n\nI came across your portfolio and would like to connect about…\n\nBest,\n[Your name]")}`} target="_blank" rel="noopener noreferrer">alonzocabrera48@gmail.com</a>
                <button type="button" className="contact-copy" onClick={copyEmail} aria-label="Copy alonzocabrera48@gmail.com to clipboard" aria-describedby="email-copy-status" title="Copy email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" /></svg>
                </button>
              </div>
              <p className="contact-email-hint">Click email to open a draft</p>
              <p id="email-copy-status" className="contact-copy-status" role="status">{copyStatus}</p>
              <nav className="contact-links" aria-label="Contact and profiles">
                <a href="https://github.com/AlonCS" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
                <a href="https://www.linkedin.com/in/alonzo-cabrera/" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
                <a href={`${import.meta.env.BASE_URL}Alonzo-Cabrera-Resume.pdf`} target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a>
              </nav>
            </div>
          </div>
          <footer className="contact-footer">
            <p>© {new Date().getFullYear()} Alonzo Cabrera Sanchez</p>
            <p>Central Coast, California</p>
            <a href="#home">Back to top <span aria-hidden="true">↑</span></a>
          </footer>
        </div>
      </section>

    </>
  )
}

export default App
