/**
 * Data Grid Shader
 * 
 * Creates a matrix-style scanning grid effect with
 * animated scan lines and pulsing grid cells.
 * 
 * Perfect for cyberpunk/tech backgrounds.
 */

// ============================================
// UNIFORMS
// ============================================
export const uniforms = {
  uTime: { value: 0 },
  uResolution: { value: [1, 1] },
  uGridColor: { value: [1.0, 0.3, 0.0] },  // Neon orange
  uGridSize: { value: 20.0 },
  uLineWidth: { value: 0.02 },
  uScanSpeed: { value: 0.1 },
  uPulseSpeed: { value: 2.0 },
  uOpacity: { value: 0.3 },
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
uniform vec3 uGridColor;
uniform float uGridSize;
uniform float uLineWidth;
uniform float uScanSpeed;
uniform float uPulseSpeed;
uniform float uOpacity;

varying vec2 vUv;

// Hash function for pseudo-random values
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  
  // Grid coordinates
  vec2 grid = fract(uv * uGridSize);
  vec2 gridId = floor(uv * uGridSize);
  
  // Grid lines
  float lineH = step(1.0 - uLineWidth, grid.x);
  float lineV = step(1.0 - uLineWidth, grid.y);
  float lines = max(lineH, lineV);
  
  // Scanning line (horizontal)
  float scanY = fract(uTime * uScanSpeed);
  float scanLine = smoothstep(0.0, 0.1, abs(uv.y - scanY));
  scanLine = 1.0 - scanLine * 0.5;
  
  // Cell pulse effect
  float cellRandom = hash(gridId);
  float pulse = sin(uTime * uPulseSpeed + cellRandom * 6.28) * 0.5 + 0.5;
  
  // Combine effects
  float intensity = lines * scanLine;
  
  // Add random cell highlights
  float highlight = step(0.95, cellRandom * pulse);
  intensity += highlight * 0.5;
  
  // Apply color
  vec3 color = uGridColor * intensity;
  
  // Fade at edges
  float fadeX = smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x);
  float fadeY = smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);
  float fade = fadeX * fadeY;
  
  gl_FragColor = vec4(color, intensity * uOpacity * fade);
}
`;

// ============================================
// REACT THREE FIBER COMPONENT EXAMPLE
// ============================================
/*
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { uniforms, vertexShader, fragmentShader } from './data-grid.glsl';

const DataGridBackground = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
};
*/

export const DataGridMaterial = {
  uniforms,
  vertexShader,
  fragmentShader,
};

export default DataGridMaterial;
