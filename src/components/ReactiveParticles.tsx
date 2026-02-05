import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ReactiveParticlesProps {
  handPosition: { x: number; y: number; z: number; isDetected: boolean };
  pulseIntensity: number;
}

const ReactiveParticles = ({ handPosition, pulseIntensity }: ReactiveParticlesProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const { positions, velocities, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spawn particles in a sphere around the rock
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.5 + Math.random() * 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Molten orange to neural violet gradient
      const colorMix = Math.random();
      if (colorMix < 0.6) {
        // Molten orange
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.0;
      } else {
        // Neural violet
        colors[i * 3] = 0.5 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.2;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      }

      sizes[i] = 0.02 + Math.random() * 0.04;
    }

    return { positions, velocities, colors, sizes };
  }, []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        handX: { value: 0.5 },
        handY: { value: 0.5 },
        handDetected: { value: 0 },
        pulseIntensity: { value: 0.5 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        uniform float time;
        uniform float handX;
        uniform float handY;
        uniform float handDetected;
        uniform float pulseIntensity;
        
        void main() {
          vColor = customColor;
          
          vec3 pos = position;
          
          // Add swirling motion
          float angle = time * 0.5 + length(position.xy) * 2.0;
          float swirl = sin(angle) * 0.3 * handDetected;
          pos.x += swirl * cos(time + position.z);
          pos.y += swirl * sin(time + position.z);
          
          // React to hand position
          vec3 handPos = vec3((handX - 0.5) * 6.0, (0.5 - handY) * 4.0, 0.0);
          float distToHand = length(pos - handPos);
          float repulsion = handDetected * (1.0 / (distToHand + 0.5)) * 0.5;
          
          vec3 repelDir = normalize(pos - handPos);
          pos += repelDir * repulsion;
          
          // Floating motion
          pos.y += sin(time * 2.0 + position.x * 3.0) * 0.1;
          pos.x += cos(time * 1.5 + position.y * 2.0) * 0.05;
          
          // Pulse effect
          float pulse = 1.0 + sin(time * 3.0) * 0.2 * pulseIntensity;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * 300.0 * pulse * (1.0 + handDetected * 0.5) / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
          
          // Alpha based on distance and hand proximity
          vAlpha = 0.6 + handDetected * 0.4 - distToHand * 0.05;
          vAlpha = clamp(vAlpha, 0.2, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          // Create circular particle with glow
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Soft glow falloff
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= vAlpha;
          
          // Add inner glow
          vec3 glowColor = vColor * (1.0 + (1.0 - dist * 2.0) * 0.5);
          
          gl_FragColor = vec4(glowColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.elapsedTime;

    // Update uniforms
    shaderMaterial.uniforms.time.value = time;
    shaderMaterial.uniforms.handX.value = handPosition.x;
    shaderMaterial.uniforms.handY.value = handPosition.y;
    shaderMaterial.uniforms.handDetected.value = handPosition.isDetected ? 1.0 : 0.0;
    shaderMaterial.uniforms.pulseIntensity.value = pulseIntensity;

    // Rotate particle system slowly
    particlesRef.current.rotation.y = time * 0.05;
    particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <points ref={particlesRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-customColor"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
};

export default ReactiveParticles;
