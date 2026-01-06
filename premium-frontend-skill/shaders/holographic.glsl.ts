/**
 * Holographic Shader
 * 
 * Creates a hologram interference pattern effect with
 * rainbow iridescence and scan lines.
 * 
 * Perfect for futuristic UI elements and sci-fi aesthetics.
 */

// ============================================
// UNIFORMS
// ============================================
export const uniforms = {
  uTime: { value: 0 },
  uResolution: { value: [1, 1] },
  uBaseColor: { value: [0.0, 0.8, 1.0] },    // Cyan base
  uScanlineCount: { value: 100.0 },
  uScanlineSpeed: { value: 2.0 },
  uIridescence: { value: 0.5 },
  uFlickerIntensity: { value: 0.1 },
  uOpacity: { value: 0.8 },
};

// ============================================
// VERTEX SHADER
// ============================================
export const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  
  gl_Position = projectionMatrix * mvPosition;
}
`;

// ============================================
// FRAGMENT SHADER
// ============================================
export const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uBaseColor;
uniform float uScanlineCount;
uniform float uScanlineSpeed;
uniform float uIridescence;
uniform float uFlickerIntensity;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

// Hash for noise
float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

// Simple noise
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  return mix(hash(i), hash(i + 1.0), smoothstep(0.0, 1.0, f));
}

// HSV to RGB conversion
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = vUv;
  float time = uTime;
  
  // Fresnel effect for edge glow
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
  
  // Scanlines
  float scanline = sin(uv.y * uScanlineCount + time * uScanlineSpeed) * 0.5 + 0.5;
  scanline = pow(scanline, 0.5);
  
  // Moving scan beam
  float scanBeam = smoothstep(0.0, 0.1, abs(uv.y - fract(time * 0.2)));
  scanBeam = 1.0 - (1.0 - scanBeam) * 0.5;
  
  // Iridescence (rainbow shift based on view angle and UV)
  float hue = uv.x * 0.3 + uv.y * 0.2 + fresnel * 0.5 + time * 0.1;
  vec3 iridescent = hsv2rgb(vec3(hue, 0.6, 1.0));
  
  // Mix base color with iridescence
  vec3 color = mix(uBaseColor, iridescent, uIridescence);
  
  // Apply scanlines
  color *= scanline * 0.5 + 0.5;
  color *= scanBeam;
  
  // Add fresnel glow
  color += uBaseColor * fresnel * 0.5;
  
  // Flicker effect
  float flicker = 1.0 - noise(time * 10.0) * uFlickerIntensity;
  color *= flicker;
  
  // Glitch lines (occasional horizontal displacement)
  float glitch = step(0.99, noise(time * 5.0 + uv.y * 100.0));
  color += vec3(glitch) * 0.3;
  
  // Alpha with fresnel edge
  float alpha = uOpacity * (0.8 + fresnel * 0.2) * scanBeam;
  
  gl_FragColor = vec4(color, alpha);
}
`;

// ============================================
// ALTERNATIVE: Simple 2D Holographic
// ============================================
export const fragmentShader2D = `
uniform float uTime;
uniform vec3 uBaseColor;
uniform float uScanlineCount;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Scanlines
  float scanline = sin(uv.y * uScanlineCount) * 0.5 + 0.5;
  scanline = pow(scanline, 0.3);
  
  // Horizontal interference
  float interference = sin(uv.x * 50.0 + uTime * 5.0) * 0.1;
  
  // Color shift
  vec3 color = uBaseColor;
  color.r += sin(uv.y * 20.0 + uTime) * 0.1;
  color.b += cos(uv.y * 20.0 + uTime) * 0.1;
  
  // Apply effects
  color *= scanline + 0.3;
  color += interference;
  
  gl_FragColor = vec4(color, uOpacity * scanline);
}
`;

// ============================================
// REACT THREE FIBER USAGE
// ============================================
/*
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { uniforms, vertexShader, fragmentShader } from './holographic.glsl';

// For 3D meshes with holographic material
const HolographicMesh = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
*/

export const HolographicMaterial = {
  uniforms,
  vertexShader,
  fragmentShader,
  fragmentShader2D,
};

export default HolographicMaterial;
