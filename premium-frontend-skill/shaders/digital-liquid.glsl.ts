/**
 * Digital Liquid Shader
 * 
 * Creates a flowing, organic noise effect perfect for
 * bio-luminescent or cyber backgrounds.
 * 
 * Usage with React Three Fiber:
 * 
 * const material = useRef<THREE.ShaderMaterial>(null);
 * 
 * useFrame((state) => {
 *   if (material.current) {
 *     material.current.uniforms.uTime.value = state.clock.elapsedTime;
 *   }
 * });
 * 
 * <mesh>
 *   <planeGeometry args={[10, 10]} />
 *   <shaderMaterial
 *     ref={material}
 *     vertexShader={vertexShader}
 *     fragmentShader={fragmentShader}
 *     uniforms={uniforms}
 *     transparent
 *   />
 * </mesh>
 */

// ============================================
// UNIFORMS
// ============================================
export const uniforms = {
  uTime: { value: 0 },
  uResolution: { value: [1, 1] },
  uColorA: { value: [0.0, 0.1, 0.0] },      // Deep green
  uColorB: { value: [0.8, 1.0, 0.0] },      // Neon lime
  uOpacity: { value: 0.4 },
  uSpeed: { value: 0.3 },
  uScale: { value: 3.0 },
};

// ============================================
// VERTEX SHADER
// ============================================
export const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ============================================
// FRAGMENT SHADER
// ============================================
export const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
uniform float uSpeed;
uniform float uScale;

varying vec2 vUv;

// Simplex 3D Noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  
  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  
  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  
  // Permutations
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
  // Gradients
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  
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
  
  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  
  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec2 uv = vUv;
  float time = uTime * uSpeed;
  
  // Layer 1: Base flowing noise
  float noise1 = snoise(vec3(uv * uScale, time));
  
  // Layer 2: Vertical flow
  float noise2 = snoise(vec3(uv.x * 2.0, uv.y * 4.0 - time * 1.5, 0.0)) * 0.5;
  
  // Layer 3: Fine detail
  float noise3 = snoise(vec3(uv * uScale * 2.0, time * 0.5)) * 0.25;
  
  // Combine
  float noise = noise1 + noise2 + noise3;
  noise = noise * 0.5 + 0.5; // Normalize to 0-1
  
  // Color mapping
  vec3 color = mix(uColorA, uColorB, noise);
  
  // Vertical gradient fade (optional, for edge softness)
  float vignette = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);
  color *= vignette;
  
  gl_FragColor = vec4(color, uOpacity);
}
`;

// ============================================
// REACT THREE FIBER HELPER
// ============================================
export const DigitalLiquidMaterial = {
  uniforms,
  vertexShader,
  fragmentShader,
};

export default DigitalLiquidMaterial;
