import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import "./scroll-morph-hero.css";

/* ─── Constants ─────────────────────────────────────────────── */
const IMG_WIDTH    = 62;
const IMG_HEIGHT   = 88;
const TOTAL_IMAGES = 20;
const MAX_SCROLL   = 3000;

/* Local images (cycled across 20 cards) */
const BASE_IMAGES = [
  "/images/gallery/gallery-1.jpg",
  "/images/gallery/gallery-2.jpg",
  "/images/gallery/gallery-3.jpg",
  "/images/gallery/gallery-4.jpg",
  "/images/gallery/gallery-5.jpg",
  "/images/gallery/gallery-6.jpg",
  "/images/gallery/gallery-7.jpg",
  "/images/gallery/gallery-8.jpg",
];

/* Cycle 8 images across 20 cards */
const IMAGES = Array.from({ length: TOTAL_IMAGES }, (_, i) => BASE_IMAGES[i % BASE_IMAGES.length]);

const lerp = (a, b, t) => a * (1 - t) + b * t;

/* ─── Lightbox ───────────────────────────────────────────────── */
function Lightbox({ src, onClose }) {
  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="smh-lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="smh-lightbox-frame"
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1,   opacity: 1, y: 0  }}
            exit={{    scale: 0.7, opacity: 0, y: 40  }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={src} alt="Campus moment" className="smh-lightbox-img" />
            <button className="smh-lightbox-close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── FlipCard ───────────────────────────────────────────────── */
function FlipCard({ src, index, target, onOpen }) {
  return (
    <motion.div
      animate={{
        x:       target.x,
        y:       target.y,
        rotate:  target.rotation,
        scale:   target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position:       "absolute",
        width:          IMG_WIDTH,
        height:         IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective:    "1000px",
        cursor:         "pointer",
        zIndex:         5,
      }}
      onClick={() => onOpen(src)}
    >
      <motion.div
        style={{
          transformStyle: "preserve-3d",
          width:    "100%",
          height:   "100%",
          position: "relative",
        }}
        transition={{ duration: 0.55, type: "spring", stiffness: 260, damping: 22 }}
        whileHover={{ rotateY: 180, scale: 1.08 }}
      >
        {/* Front face */}
        <div className="smh-face smh-face--front">
          <img
            src={src}
            alt={`campus-moment-${index + 1}`}
            className="smh-face__img"
            loading="lazy"
          />
          <div className="smh-face__shine" />
        </div>

        {/* Back face */}
        <div className="smh-face smh-face--back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="smh-face__back-icon">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
          <span className="smh-face__back-label">View</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function IntroAnimation() {
  const [introPhase,     setIntroPhase]     = useState("scatter");
  const [containerSize,  setContainerSize]  = useState({ width: 0, height: 0 });
  const [lightboxSrc,    setLightboxSrc]    = useState(null);
  const containerRef = useRef(null);

  /* ── ResizeObserver ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    );
    ro.observe(el);
    setContainerSize({ width: el.offsetWidth, height: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  /* ── Virtual scroll ─────────────────────────────────────────
     KEY FIX: only preventDefault when the scroll WILL be consumed
     by this component; otherwise let the page scroll normally.
  ─────────────────────────────────────────────────────────── */
  const virtualScroll = useMotionValue(0);
  const scrollRef     = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      const atMin = scrollRef.current <= 0;
      const atMax = scrollRef.current >= MAX_SCROLL;

      /* If wheel would move within our virtual range, capture it */
      if ((e.deltaY > 0 && !atMax) || (e.deltaY < 0 && !atMin)) {
        e.preventDefault();
        const next = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
        scrollRef.current = next;
        virtualScroll.set(next);
      }
      /* else: fall through — browser handles page scroll */
    };

    let touchY0 = 0;
    const onTouchStart = (e) => { touchY0 = e.touches[0].clientY; };
    const onTouchMove  = (e) => {
      const dy   = touchY0 - e.touches[0].clientY;
      touchY0    = e.touches[0].clientY;
      const atMin = scrollRef.current <= 0;
      const atMax = scrollRef.current >= MAX_SCROLL;
      if ((dy > 0 && !atMax) || (dy < 0 && !atMin)) {
        e.preventDefault();
        const next = Math.min(Math.max(scrollRef.current + dy, 0), MAX_SCROLL);
        scrollRef.current = next;
        virtualScroll.set(next);
      }
    };

    el.addEventListener("wheel",      onWheel,      { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });
    return () => {
      el.removeEventListener("wheel",      onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
    };
  }, [virtualScroll]);

  /* ── Spring motion values ── */
  const morphProgress      = useTransform(virtualScroll, [0, 600],    [0, 1]);
  const smoothMorph        = useSpring(morphProgress,    { stiffness: 40, damping: 20 });
  const scrollRotate       = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate,     { stiffness: 40, damping: 20 });

  /* ── Mouse parallax ── */
  const mouseX       = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect       = el.getBoundingClientRect();
      const normalized = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseX.set(normalized * 80);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mouseX]);

  /* ── Intro sequence ── */
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"),   500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* ── Stable random scatter ── */
  const scatterPositions = useMemo(() =>
    IMAGES.map(() => ({
      x:        (Math.random() - 0.5) * 1600,
      y:        (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
      scale:    0.5,
      opacity:  0,
    }))
  , []);

  /* ── Reactive derived state ── */
  const [morphValue,    setMorphValue]    = useState(0);
  const [rotateValue,   setRotateValue]   = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change",        setMorphValue);
    const u2 = smoothScrollRotate.on("change", setRotateValue);
    const u3 = smoothMouseX.on("change",       setParallaxValue);
    return () => { u1(); u2(); u3(); };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  /* ── Arc-phase content opacity ── */
  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY       = useTransform(smoothMorph, [0.8, 1], [24, 0]);

  /* ── Lightbox handlers ── */
  const openLightbox  = useCallback((src) => setLightboxSrc(src), []);
  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  /* ─────────────────────────────────────────── */
  return (
    <section
      ref={containerRef}
      className="smh-root"
      aria-label="Interactive gallery animation"
    >
      {/* Ambient glow orbs */}
      <div className="smh-orb smh-orb--a" aria-hidden="true" />
      <div className="smh-orb smh-orb--b" aria-hidden="true" />

      {/* ── Intro title ── */}
      <div className="smh-intro-text">
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
          animate={
            introPhase === "circle" && morphValue < 0.5
              ? { opacity: 1 - morphValue * 2, y: 0,  filter: "blur(0px)"  }
              : { opacity: 0,                  y: 0,  filter: "blur(12px)" }
          }
          transition={{ duration: 1 }}
          className="smh-intro-title"
        >
          The Future Of Your Child<br />
          <span className="smh-intro-highlight">Is In Our Hands</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={
            introPhase === "circle" && morphValue < 0.5
              ? { opacity: Math.max(0, 0.6 - morphValue * 2) }
              : { opacity: 0 }
          }
          transition={{ duration: 1, delay: 0.2 }}
          className="smh-scroll-hint"
          aria-hidden="true"
        >
          ↓ &nbsp; SCROLL TO EXPLORE
        </motion.p>
      </div>

      {/* ── Arc-phase content ── */}
      <motion.div
        initial={{ opacity: 0 }}
        style={{ opacity: contentOpacity, y: contentY }}
        className="smh-arc-content"
      >
        <p className="smh-arc-eyebrow">Prayas Public School</p>
        <h2 className="smh-arc-title">Campus Moments</h2>
        <p className="smh-arc-desc">
          A glimpse into the life, laughter, and learning<br className="smh-br" />
          that make every Praysian's journey unforgettable.
        </p>
        <p className="smh-arc-hint">Click any photo to view it</p>
      </motion.div>

      {/* ── Cards stage ── */}
      <div className="smh-stage">
        {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
          let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

          if (introPhase === "scatter") {
            target = scatterPositions[i];
          } else if (introPhase === "line") {
            const spacing = 72;
            const totalW  = TOTAL_IMAGES * spacing;
            target = { x: i * spacing - totalW / 2, y: 0, rotation: 0, scale: 1, opacity: 1 };
          } else {
            const isMobile = containerSize.width < 768;
            const minDim   = Math.min(containerSize.width, containerSize.height);

            /* Circle */
            const circleRadius = Math.min(minDim * 0.42, 420);
            const cAngle       = (i / TOTAL_IMAGES) * 360;
            const cRad         = (cAngle * Math.PI) / 180;
            const circlePos    = {
              x:        Math.cos(cRad) * circleRadius,
              y:        Math.sin(cRad) * circleRadius,
              rotation: cAngle + 90,
            };

            /* Arc */
            const baseR      = Math.min(containerSize.width, containerSize.height * 1.5);
            const arcR       = baseR * (isMobile ? 1.4 : 1.1);
            const apexY      = containerSize.height * (isMobile ? 0.35 : 0.25);
            const arcCenterY = apexY + arcR;
            const spread     = isMobile ? 100 : 132;
            const startA     = -90 - spread / 2;
            const step       = spread / (TOTAL_IMAGES - 1);

            const scrollProg  = Math.min(Math.max(rotateValue / 360, 0), 1);
            const boundedRot  = -scrollProg * (spread * 0.8);
            const curArcAngle = startA + i * step + boundedRot;
            const aRad        = (curArcAngle * Math.PI) / 180;

            const arcPos = {
              x:        Math.cos(aRad) * arcR + parallaxValue,
              y:        Math.sin(aRad) * arcR + arcCenterY,
              rotation: curArcAngle + 90,
              scale:    isMobile ? 1.4 : 1.85,
            };

            target = {
              x:        lerp(circlePos.x,        arcPos.x,        morphValue),
              y:        lerp(circlePos.y,        arcPos.y,        morphValue),
              rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
              scale:    lerp(1,                  arcPos.scale,    morphValue),
              opacity:  1,
            };
          }

          return (
            <FlipCard
              key={i}
              src={src}
              index={i}
              target={target}
              onOpen={openLightbox}
            />
          );
        })}
      </div>

      {/* ── Lightbox ── */}
      <Lightbox src={lightboxSrc} onClose={closeLightbox} />
    </section>
  );
}
