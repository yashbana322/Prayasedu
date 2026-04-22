import { useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import "./StackedPanels.css";

// ─────────────────────────────────────────────────────────
//  CONFIG — to add your own images, just replace the paths
//  below with your image filenames inside /public/
// ─────────────────────────────────────────────────────────
const PANEL_IMAGES = [
  "/gallery_cultural_fest.png",
  "/gallery_campus.png",
  "/gallery_science_lab.png",
  "/gallery_sports_day.png",
  "/gallery_awards.png",
  "/gallery_library.png",
  // ↑ Add more paths here, e.g. "/gallery_my_photo.jpg"
];

const PANEL_COUNT = PANEL_IMAGES.length * 3; // repeat to fill all 18+ panels
const WAVE_SPRING  = { stiffness: 160, damping: 22, mass: 0.6 };
const SCENE_SPRING = { stiffness: 80,  damping: 22, mass: 1   };
const Z_SPREAD     = 48;
const SIGMA        = 2.8;

const GRADIENT_OVERLAYS = [
  "linear-gradient(135deg, rgba(99,55,255,0.40) 0%, rgba(236,72,153,0.30) 100%)",
  "linear-gradient(135deg, rgba(6,182,212,0.40) 0%, rgba(59,130,246,0.30) 100%)",
  "linear-gradient(135deg, rgba(245,158,11,0.40) 0%, rgba(239,68,68,0.30) 100%)",
  "linear-gradient(135deg, rgba(16,185,129,0.30) 0%, rgba(6,182,212,0.40) 100%)",
  "linear-gradient(135deg, rgba(236,72,153,0.40) 0%, rgba(245,158,11,0.30) 100%)",
  "linear-gradient(135deg, rgba(59,130,246,0.40) 0%, rgba(99,55,255,0.30) 100%)",
];

// ── Single Panel ──────────────────────────────────────────
function Panel({ index, total, waveY, scaleY, imageUrl, onExpand }) {
  const t        = index / (total - 1);
  const baseZ    = (index - (total - 1)) * Z_SPREAD;

  // Bigger panels — front card is 420×300, back tapers to 220×160
  const w        = 220 + t * 200;
  const h        = 160 + t * 140;
  const opacity  = 0.28 + t * 0.72;
  const gradient = GRADIENT_OVERLAYS[index % GRADIENT_OVERLAYS.length];

  return (
    <motion.div
      style={{
        position:        "absolute",
        borderRadius:    18,
        overflow:        "hidden",
        width:           w,
        height:          h,
        marginLeft:      -w / 2,
        marginTop:       -h / 2,
        translateZ:      baseZ,
        y:               waveY,
        scaleY,
        transformOrigin: "bottom center",
        opacity,
        cursor:          "pointer",
      }}
      whileHover={{ scale: 1.05 }}
      onClick={() => onExpand(imageUrl)}
      role="button"
      tabIndex={0}
      aria-label={`View image ${index + 1}`}
      onKeyDown={(e) => e.key === "Enter" && onExpand(imageUrl)}
    >
      {/* Background image */}
      <div
        style={{
          position:           "absolute",
          inset:              0,
          backgroundImage:    `url(${imageUrl})`,
          backgroundSize:     "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Light gradient colour tint */}
      <div
        style={{
          position:     "absolute",
          inset:        0,
          background:   gradient,
          mixBlendMode: "multiply",
        }}
      />

      {/* Bottom vignette */}
      <div
        style={{
          position:   "absolute",
          inset:      0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.28) 100%)",
        }}
      />

      {/* Border glow */}
      <div
        style={{
          position:   "absolute",
          inset:      0,
          borderRadius: 18,
          border:     `1px solid rgba(255,255,255,${0.10 + t * 0.25})`,
          boxSizing:  "border-box",
        }}
      />

      {/* "Click to expand" badge on the front (largest) card only */}
      {index === total - 1 && (
        <div
          style={{
            position:       "absolute",
            bottom:         14,
            left:           "50%",
            transform:      "translateX(-50%)",
            display:        "flex",
            alignItems:     "center",
            gap:            6,
            background:     "rgba(0,0,0,0.50)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius:   999,
            padding:        "6px 16px",
            color:          "#fff",
            fontSize:       "0.72rem",
            letterSpacing:  "0.07em",
            fontWeight:     600,
            whiteSpace:     "nowrap",
            pointerEvents:  "none",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5"
               strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Click to expand
        </div>
      )}
    </motion.div>
  );
}

// ── Lightbox ──────────────────────────────────────────────
// Rendered via a Portal so position:fixed is always relative
// to the true viewport — not to any transformed ancestor.
function Lightbox({ src, onClose }) {
  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          key="lb-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position:  "fixed",
            inset:     0,
            zIndex:    9999,
            display:   "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.80)",
            cursor:    "zoom-out",
          }}
          aria-modal="true"
          role="dialog"
          aria-label="Expanded image view"
        >
          {/* Image — spring pop-in */}
          <motion.div
            key={src}
            initial={{ scale: 0.55, opacity: 0, y: 50 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.72, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.75 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position:     "relative",
              maxWidth:     "88vw",
              maxHeight:    "84vh",
              borderRadius: 22,
              overflow:     "hidden",
              boxShadow:    "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
              cursor:       "default",
              lineHeight:   0,
            }}
          >
            <img
              src={src}
              alt="Expanded gallery image"
              style={{
                display:   "block",
                width:     "auto",
                height:    "auto",
                maxWidth:  "88vw",
                maxHeight: "84vh",
                objectFit: "contain",
              }}
            />
          </motion.div>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{    opacity: 0, scale: 0.6 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 400, damping: 25 }}
            onClick={onClose}
            aria-label="Close image"
            style={{
              position:       "fixed",
              top:            20,
              right:          20,
              width:          44,
              height:         44,
              borderRadius:   "50%",
              border:         "1px solid rgba(255,255,255,0.18)",
              background:     "rgba(255,255,255,0.10)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color:          "#fff",
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       "1.1rem",
              fontWeight:     700,
              zIndex:         10000,
            }}
          >
            ✕
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ── Main component ────────────────────────────────────────
export default function StackedPanels() {
  const containerRef = useRef(null);
  const [expandedSrc, setExpandedSrc] = useState(null);

  // One spring per panel
  const waveYSprings  = Array.from({ length: PANEL_COUNT }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring(0, WAVE_SPRING)
  );
  const scaleYSprings = Array.from({ length: PANEL_COUNT }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring(1, WAVE_SPRING)
  );
  const rotY = useSpring(-42, SCENE_SPRING);
  const rotX = useSpring(18,  SCENE_SPRING);

  const handleMouseMove = useCallback(
    (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const cx = (e.clientX - rect.left)  / rect.width;
      const cy = (e.clientY - rect.top)   / rect.height;

      rotY.set(-42 + (cx - 0.5) * 16);
      rotX.set( 18 + (cy - 0.5) * -12);

      const pos = cx * (PANEL_COUNT - 1);
      waveYSprings.forEach((s, i) => {
        const d = Math.abs(i - pos);
        s.set(-Math.exp(-(d * d) / (2 * SIGMA * SIGMA)) * 80);
      });
      scaleYSprings.forEach((s, i) => {
        const d = Math.abs(i - pos);
        s.set(0.32 + Math.exp(-(d * d) / (2 * SIGMA * SIGMA)) * 0.68);
      });
    },
    [rotY, rotX, waveYSprings, scaleYSprings]
  );

  const handleMouseLeave = useCallback(() => {
    rotY.set(-42);
    rotX.set(18);
    waveYSprings.forEach((s) => s.set(0));
    scaleYSprings.forEach((s) => s.set(1));
  }, [rotY, rotX, waveYSprings, scaleYSprings]);

  return (
    <section
      className="stacked-panels-section"
      aria-label="Interactive 3D gallery"
    >
      {/* Header */}
      <header className="stacked-panels-header">
        <p className="stacked-panels-eyebrow">Interactive Canvas</p>
        <h2 className="stacked-panels-title">
          Explore in <span className="text-gradient">3D</span>
        </h2>
        <p className="stacked-panels-subtitle">
          Move your cursor over the panels — click any image to expand it.
        </p>
      </header>

      {/* 3D Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="stacked-panels-canvas"
        style={{ perspective: "900px" }}
      >
        <motion.div
          style={{
            rotateY:        rotY,
            rotateX:        rotX,
            transformStyle: "preserve-3d",
            position:       "relative",
            width:          0,
            height:         0,
          }}
        >
          {Array.from({ length: PANEL_COUNT }).map((_, i) => (
            <Panel
              key={i}
              index={i}
              total={PANEL_COUNT}
              waveY={waveYSprings[i]}
              scaleY={scaleYSprings[i]}
              imageUrl={PANEL_IMAGES[i % PANEL_IMAGES.length]}
              onExpand={setExpandedSrc}
            />
          ))}
        </motion.div>

        <p className="stacked-panels-hint" aria-hidden="true">
          Move cursor · Click to expand
        </p>
      </div>

      {/* Lightbox */}
      <Lightbox src={expandedSrc} onClose={() => setExpandedSrc(null)} />
    </section>
  );
}
