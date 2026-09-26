import { useEffect, useRef, useState } from 'react'

export default function ImageViewer({ src, title }) {
  const viewer = useRef(null)
  const viewport = useRef(null)
  const drag = useRef(null)
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 })
  const { zoom } = view
  const [dragging, setDragging] = useState(false)
  const [activated, setActivated] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  function changeZoom(factor) {
    setActivated(true)
    setView((previous) => {
      const zoom = Math.max(1, Math.min(6, previous.zoom * factor))
      const ratio = zoom / previous.zoom
      return zoom === 1 ? { zoom, x: 0, y: 0 } : {
        zoom, x: previous.x * ratio, y: previous.y * ratio,
      }
    })
  }

  async function toggleFullscreen() {
    setActivated(true)
    if (expanded) {
      setExpanded(false)
    } else if (document.fullscreenElement === viewer.current) {
      await document.exitFullscreen()
    } else {
      try {
        await viewer.current.requestFullscreen()
      } catch {
        setExpanded(true)
      }
    }
  }

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === viewer.current)
    const escape = (event) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('fullscreenchange', syncFullscreen)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen)
      document.removeEventListener('keydown', escape)
    }
  }, [])

  useEffect(() => {
    const el = viewport.current
    function wheel(event) {
      event.preventDefault()
      const rect = el.getBoundingClientRect()
      const x = event.clientX - rect.left - rect.width / 2
      const y = event.clientY - rect.top - rect.height / 2
      setView((previous) => {
        const zoom = Math.max(1, Math.min(6, previous.zoom * Math.exp(-event.deltaY * 0.002)))
        const ratio = zoom / previous.zoom
        return zoom === 1 ? { zoom: 1, x: 0, y: 0 } : {
          zoom, x: x - (x - previous.x) * ratio, y: y - (y - previous.y) * ratio,
        }
      })
    }
    el.addEventListener('wheel', wheel, { passive: false })
    return () => el.removeEventListener('wheel', wheel)
  }, [])

  function stopDrag() {
    drag.current = null
    setDragging(false)
  }

  return (
    <div ref={viewer} className={`image-viewer detail-video-el${expanded ? ' image-viewer-expanded' : ''}`}>
      <div
        ref={viewport}
        className={`image-viewer-viewport${dragging ? ' is-dragging' : ''}`}
        tabIndex={activated ? 0 : -1}
        role="region"
        aria-label={`${title}. Scroll to zoom. Drag or use arrow keys to pan.`}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          const el = event.currentTarget
          el.focus({ preventScroll: true })
          el.setPointerCapture(event.pointerId)
          event.preventDefault()
          drag.current = { x: event.clientX, y: event.clientY }
          setDragging(true)
        }}
        onPointerMove={(event) => {
          if (!drag.current) return
          const dx = event.clientX - drag.current.x
          const dy = event.clientY - drag.current.y
          drag.current = { x: event.clientX, y: event.clientY }
          setView((previous) => ({ ...previous, x: previous.x + dx, y: previous.y + dy }))
        }}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onLostPointerCapture={stopDrag}
        onKeyDown={(event) => {
          const moves = { ArrowLeft: [-50, 0], ArrowRight: [50, 0], ArrowUp: [0, -50], ArrowDown: [0, 50] }
          if (moves[event.key]) {
            event.preventDefault()
            const [dx, dy] = moves[event.key]
            setView((previous) => ({ ...previous, x: previous.x - dx, y: previous.y - dy }))
          }
        }}
      >
        <div className="image-viewer-canvas" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${zoom})` }}>
          <img src={src} alt={title} draggable={false} />
        </div>
      </div>
      {!activated && (
        <button
          type="button"
          className="detail-figma-hint"
          onClick={() => {
            setActivated(true)
            viewport.current.focus({ preventScroll: true })
          }}
        >
          Click to explore — scroll to zoom
        </button>
      )}
      <div className="image-viewer-controls" role="group" aria-label="Image controls">
        <button type="button" onClick={() => changeZoom(1.5)} disabled={zoom >= 6} aria-label="Zoom in" title="Zoom in">+</button>
        <button type="button" onClick={() => changeZoom(1 / 1.5)} disabled={zoom <= 1} aria-label="Zoom out" title="Zoom out">−</button>
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
