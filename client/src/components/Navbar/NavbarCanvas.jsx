import { useEffect, useRef } from 'react';

export default function NavbarCanvas() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const cx = cv.getContext('2d');
    const hdr = containerRef.current;
    
    // Setup Cursor Canvas
    const cursorCanvas = cursorRef.current;
    const cxCur = cursorCanvas.getContext('2d');
    cursorCanvas.width = 60; 
    cursorCanvas.height = 60;
    
    let W, H, T = 0;
    let MX = 0.5, MY = 0.5;
    let MXs = 0.5, MYs = 0.5;
    let isOnHeader = false;
    let animationFrameId;
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30 FPS cap

    const resize = () => {
      W = cv.width = hdr.offsetWidth;
      H = cv.height = hdr.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onGlobalMouseMove = (e) => {
      const cursorX = e.clientX;
      const cursorY = e.clientY;
      cursorCanvas.style.transform = `translate(${cursorX - 30}px, ${cursorY - 30}px)`;
    };
    document.addEventListener('mousemove', onGlobalMouseMove);

    const onHeaderMouseMove = (e) => {
      const r = hdr.getBoundingClientRect();
      MX = (e.clientX - r.left) / W;
      MY = (e.clientY - r.top) / H;
      isOnHeader = true;
    };
    const onHeaderMouseLeave = () => { isOnHeader = false; };
    hdr.addEventListener('mousemove', onHeaderMouseMove);
    hdr.addEventListener('mouseleave', onHeaderMouseLeave);

    // Reduced particles for performance
    const PARTICLES = Array.from({ length: 55 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.4,
      tw: Math.random() * Math.PI * 2,
      spd: 0.3 + Math.random() * 1.0
    }));

    function drawCursorCanvas() {
      cxCur.clearRect(0, 0, 60, 60);
      if (!isOnHeader) return;
      const cx2 = 30, cy2 = 30;
      cxCur.beginPath();
      cxCur.arc(cx2, cy2, 3, 0, Math.PI * 2);
      cxCur.fillStyle = 'rgba(37,99,235,0.8)';
      cxCur.fill();
      cxCur.beginPath();
      cxCur.arc(cx2, cy2, 12, 0, Math.PI * 2);
      cxCur.strokeStyle = 'rgba(37,99,235,0.3)';
      cxCur.lineWidth = 1;
      cxCur.stroke();
      cxCur.beginPath();
      cxCur.arc(cx2, cy2, 24, 0, Math.PI * 2);
      cxCur.strokeStyle = 'rgba(37,99,235,0.12)';
      cxCur.lineWidth = 0.8;
      cxCur.stroke();
    }

    function drawBase() {
      cx.fillStyle = '#ffffff';
      cx.fillRect(0, 0, W, H);
    }

    function drawNebula() {
      const clouds = [
        { x: 0.12, y: 0.5, r: 0.28, h: 210, s: 65, l: 75, a: 0.07 },
        { x: 0.82, y: 0.5, r: 0.24, h: 230, s: 70, l: 80, a: 0.06 },
        { x: 0.50, y: 0.3, r: 0.34, h: 195, s: 60, l: 85, a: 0.05 },
        { x: 0.65, y: 0.7, r: 0.20, h: 45,  s: 80, l: 80, a: 0.04 },
      ];
      clouds.forEach(cl => {
        const g = cx.createRadialGradient(cl.x * W, cl.y * H, 0, cl.x * W, cl.y * H, cl.r * W);
        g.addColorStop(0, `hsla(${cl.h},${cl.s}%,${cl.l}%,${cl.a})`);
        g.addColorStop(1, `hsla(${cl.h},${cl.s}%,${cl.l}%,0)`);
        cx.fillStyle = g;
        cx.fillRect(0, 0, W, H);
      });
    }

    function drawParticles() {
      PARTICLES.forEach(s => {
        s.tw += 0.014 * s.spd;
        const a = 0.04 + 0.18 * (0.5 + 0.5 * Math.sin(s.tw));
        cx.beginPath();
        cx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(37,99,235,${a})`;
        cx.fill();
      });
    }

    function drawLightArc(offsetT, colorR, colorG, colorB, arcY, arcCurve, width, alpha) {
      const sweep = Math.sin(offsetT) * 0.5 + 0.5;
      const cx0 = -W * 0.3 + sweep * W * 1.6;
      const cpx = cx0 + W * 0.5;
      const cpy = arcY * H - arcCurve * H * 1.2;
      const ex  = cx0 + W;
      const ey  = arcY * H + arcCurve * H * 0.3;
      const cy0 = arcY * H + arcCurve * H * 0.8;
      const widths = [width * 4, width * 2, width, width * 0.4];
      const alphas = [0.02, 0.05, 0.12, 0.3];
      widths.forEach((lw, li) => {
        cx.save();
        cx.beginPath();
        cx.moveTo(cx0 - W * 0.1, cy0);
        cx.quadraticCurveTo(cpx, cpy, ex + W * 0.1, ey);
        cx.strokeStyle = `rgba(${colorR},${colorG},${colorB},${alpha * alphas[li]})`;
        cx.lineWidth = lw;
        cx.lineCap = 'round';
        cx.stroke();
        cx.restore();
      });
    }

    function drawAtmosphericArcs() {
      drawLightArc(T * 0.38,         37, 99, 235,  1.05, 0.6, 6, 1.0);
      drawLightArc(T * 0.38 + 0.18, 212,175,  55,  1.18, 0.72, 4, 0.85);
      drawLightArc(T * 0.38 - 0.12,  14,165, 233,  0.95, 0.5, 3.5, 0.7);
    }

    function drawMouseGlow() {
      MXs += (MX - MXs) * 0.05;
      MYs += (MY - MYs) * 0.05;
      if (!isOnHeader) return;
      const g = cx.createRadialGradient(MXs * W, MYs * H, 0, MXs * W, MYs * H, W * 0.28);
      g.addColorStop(0, 'rgba(37,99,235,0.05)');
      g.addColorStop(0.5, 'rgba(37,99,235,0.02)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, W, H);
    }

    function loop(timestamp) {
      animationFrameId = requestAnimationFrame(loop);
      const elapsed = timestamp - lastTime;
      if (elapsed < FRAME_INTERVAL) return;
      lastTime = timestamp - (elapsed % FRAME_INTERVAL);
      T += 0.008;
      drawBase();
      drawNebula();
      drawParticles();
      drawAtmosphericArcs();
      drawMouseGlow();
      drawCursorCanvas();
    }
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onGlobalMouseMove);
      hdr.removeEventListener('mousemove', onHeaderMouseMove);
      hdr.removeEventListener('mouseleave', onHeaderMouseLeave);
    };
  }, []);

  return (
    <>
      <div 
        ref={containerRef} 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>
      <canvas 
        ref={cursorRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'multiply',
        }}
      />
    </>
  );
}
