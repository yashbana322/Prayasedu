import React, { useRef, useEffect } from 'react';

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    vUv.y = 1.0 - vUv.y; // Flip Y for standard texture coords
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;

  // Simple GLSL Perlin Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Approximate distance to the SVG blue line
  float distanceToLine(vec2 uv) {
    // The SVG path is roughly an S-curve across the screen
    // viewBox="0 0 1000 600". M -100 400 C 200 100...
    float expectedY = 0.5 + 0.35 * sin(uv.x * 6.0 + 1.0);
    return abs(uv.y - expectedY);
  }

    void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = vUv;
    vec2 mouse = uMouse / uResolution;
    mouse.y = 1.0 - mouse.y; // Correct WebGL Y inversion
    
    // Correct aspect for noise calculations
    vec2 noiseUv = uv;
    noiseUv.x *= aspect;
    vec2 mouseUv = mouse;
    mouseUv.x *= aspect;

    // Perlin noise for displacement
    float noise = snoise(noiseUv * 3.0 + uTime * 0.2);
    
    // Calculate Refraction gradient (derivative of noise)
    vec2 eps = vec2(0.01, 0.0);
    float dx = snoise((noiseUv + eps.xy) * 3.0 + uTime * 0.2) - noise;
    float dy = snoise((noiseUv + eps.yx) * 3.0 + uTime * 0.2) - noise;
    vec2 gradient = vec2(dx, dy);

    // Calculate intensity of ripple near the blue line OR mouse
    float lineDist = distanceToLine(uv);
    float mouseDist = distance(noiseUv, mouseUv);
    
    float lineIntensity = smoothstep(0.4, 0.0, lineDist);
    float mouseIntensity = smoothstep(0.3, 0.0, mouseDist); // radius of mouse interaction
    
    float rippleIntensity = clamp(lineIntensity + mouseIntensity * 1.5, 0.0, 1.0);

    // Refraction shifting
    vec2 uvRefracted = uv + gradient * rippleIntensity * 0.05;

    // Standard texture sampling without Chromatic Aberration (RGB split removed)
    vec4 texColor = texture2D(uTexture, uvRefracted);

    // Output the distorted texture
    // Increase alpha to make sure we see it clearly over white
    gl_FragColor = vec4(texColor.rgb, 0.95);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader parsing error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function WebGLBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1
    ]), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const textureLocation = gl.getUniformLocation(program, "uTexture");
    const mouseLocation = gl.getUniformLocation(program, "uMouse");

    let isMounted = true;

    // Load Background Texture
    const texture = gl.createTexture();
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = "https://images.unsplash.com/photo-1594312915251-48db9280c8f1?q=80&w=2070&auto=format&fit=crop";
    image.onload = () => {
      if (!isMounted) return;
      gl.useProgram(program); // CRITICAL: we must use the program before updating its uniforms!
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(textureLocation, 0);
    };

    let animationFrameId;
    const startTime = Date.now();
    let mouseX = 0;
    let mouseY = 0;
    let lastFrameTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30 FPS cap

    const resize = () => {
      // Use 1x pixel ratio for performance (no HiDPI overdraw)
      canvas.width = Math.floor(window.innerWidth);
      canvas.height = Math.floor(window.innerHeight);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = (timestamp) => {
      if (!isMounted) return;
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;
      const elapsed = timestamp - lastFrameTime;
      if (elapsed < FRAME_INTERVAL) return; // 30fps cap
      lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    render(0);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      
      // Free GPU resources
      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteTexture(texture);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, 
        pointerEvents: 'none'
      }} 
    />
  );
}
