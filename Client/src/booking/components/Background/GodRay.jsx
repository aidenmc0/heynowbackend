// src/components/Background/GodRay.jsx
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FogPlane() {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        state.clock.getElapsedTime() * 0.2; 
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(state.mouse.x, state.mouse.y),
        0.02
      );
    }
  });

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;

    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm (in vec2 st) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < 5; ++i) {
            v += a * noise(st);
            st = rot * st * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    void main() {
      vec2 st = vUv * 3.0;
      float n = fbm(st + uTime * 0.1);
      
      float rays = sin(vUv.y * 20.0 + uTime) * 0.5 + 0.5;
      rays = smoothstep(0.4, 0.6, rays);
      
      vec3 colorA = vec3(0.98, 0.96, 0.92); 
      vec3 colorB = vec3(0.95, 0.97, 0.95); 
      vec3 colorC = vec3(0.85, 0.85, 0.80); 

      vec3 finalColor = mix(colorA, colorB, n * 0.5);
      finalColor = mix(finalColor, colorC, (1.0 - vUv.y) * 0.3 * n); 
      finalColor += vec3(1.0, 0.98, 0.9) * rays * 0.1;

      float dist = distance(vUv, vec2(0.5));
      finalColor *= smoothstep(0.8, 0.2, dist);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <planeGeometry args={[12, 12]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
      />
    </mesh>
  );
}

export default function ShaderBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <FogPlane />
      </Canvas>
    </div>
  );
}