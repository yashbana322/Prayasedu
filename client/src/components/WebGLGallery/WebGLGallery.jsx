import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── VERTEX SHADER ─────────────────────────────────────────────
const vertexShader = /* glsl */`
  uniform float uWarp;
  uniform float uTime;
  uniform float uDirection;
  varying vec2 vUv;

  vec3 mod289v3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289v4(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 vpermute(vec4 x) { return mod289v4(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289v3(i);
    vec4 p = vpermute(vpermute(vpermute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x  = x_ * ns.x + ns.yyyy;
    vec4 y  = y_ * ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float n  = snoise(vec3(pos.xy * 1.2, uTime * 0.4));
    float nX = snoise(vec3(pos.xy * 0.8 + 5.3, uTime * 0.35));
    float nY = snoise(vec3(pos.xy * 0.9 + 11.7, uTime * 0.3));

    pos.z  += n  * 1.2 * uWarp;
    pos.x  += nX * 0.7 * uWarp;
    pos.y  += nY * 0.7 * uWarp;

    float scale = mix(1.0, 0.5, uWarp);
    pos.xy *= scale;

    // Slide in/out from the correct side
    pos.x += uDirection * 8.0 * uWarp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// ─── FRAGMENT SHADER ───────────────────────────────────────────
const fragmentShader = /* glsl */`
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uWarp;
  varying vec2 vUv;

  void main() {
    vec4 col     = texture2D(uTexture, vUv);
    float grey   = dot(col.rgb, vec3(0.299, 0.587, 0.114));
    vec3  desatu = mix(col.rgb, vec3(grey), uWarp * 0.5);
    desatu       = mix(desatu, desatu * 0.65, uWarp * 0.4);
    gl_FragColor = vec4(desatu, 1.0);
  }
`

// Frame-rate-independent Expo-Out lerp
const dampExp = (cur, tar, lambda, dt) =>
  THREE.MathUtils.lerp(cur, tar, 1 - Math.exp(-lambda * dt))

// ─── SINGLE IMAGE PLANE ────────────────────────────────────────
function ImagePlane({ texture, index, activeIndex }) {
  const meshRef = useRef()
  const matRef  = useRef()

  const isActive  = index === activeIndex
  const direction = index < activeIndex ? -1.0 : 1.0

  // Build uniforms once — key on texture identity so they don't rebuild
  const uniforms = useRef({
    uTexture:   { value: texture },
    uWarp:      { value: 1.0 },
    uTime:      { value: 0.0 },
    uDirection: { value: direction },
  }).current

  // Keep texture reference up to date without rebuilding uniforms
  useEffect(() => {
    uniforms.uTexture.value = texture
  }, [texture, uniforms])

  useFrame((_, delta) => {
    if (!matRef.current) return
    const u = matRef.current.uniforms
    u.uTime.value      += delta
    u.uWarp.value       = dampExp(u.uWarp.value,      isActive ? 0.0 : 1.0, 5.5, delta)
    u.uDirection.value  = dampExp(u.uDirection.value, direction,             6.0, delta)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 3.4, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ─── TEXTURE LOADER SCENE ─────────────────────────────────────
function Scene({ images, activeIndex }) {
  const [textures, setTextures] = useState([])

  useEffect(() => {
    // Load via an offscreen canvas to avoid CORS WebGL texture issues
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'

    Promise.all(
      images.map(
        src =>
          new Promise(resolve => {
            loader.load(
              src,
              tex => { tex.colorSpace = THREE.SRGBColorSpace; resolve(tex) },
              undefined,
              () => {
                // Fallback: create a plain blue gradient texture on failure
                const canvas = document.createElement('canvas')
                canvas.width = 512; canvas.height = 360
                const ctx = canvas.getContext('2d')
                const g = ctx.createLinearGradient(0, 0, 512, 360)
                g.addColorStop(0, '#2563EB')
                g.addColorStop(1, '#60A5FA')
                ctx.fillStyle = g
                ctx.fillRect(0, 0, 512, 360)
                resolve(new THREE.CanvasTexture(canvas))
              }
            )
          })
      )
    ).then(setTextures)
  }, [images])

  if (textures.length !== images.length) return null

  return (
    <>
      <ambientLight intensity={1} />
      {textures.map((tex, i) => (
        <ImagePlane
          key={i}
          texture={tex}
          index={i}
          activeIndex={activeIndex}
        />
      ))}
    </>
  )
}

// ─── PUBLIC EXPORT ─────────────────────────────────────────────
export default function WebGLGallery({ images, activeIndex }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: '100%', height: '100%', display: 'block' }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0xffffff, 0)
      }}
    >
      <Scene images={images} activeIndex={activeIndex} />
    </Canvas>
  )
}
