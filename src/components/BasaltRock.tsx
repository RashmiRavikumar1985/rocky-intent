import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BasaltRockProps {
  handPosition: { x: number; y: number; z: number; isDetected: boolean };
  pulseIntensity: number;
}

const BasaltRock = ({ handPosition, pulseIntensity }: BasaltRockProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Create custom shader material for lava veins
  const lavaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pulseIntensity: { value: pulseIntensity },
        handProximity: { value: 0 },
        baseColor: { value: new THREE.Color('#1a1a1a') },
        veinColor: { value: new THREE.Color('#ff4d00') },
        glowColor: { value: new THREE.Color('#ff6b00') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float pulseIntensity;
        uniform float handProximity;
        uniform vec3 baseColor;
        uniform vec3 veinColor;
        uniform vec3 glowColor;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          
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
          
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          // Create more dynamic vein pattern with faster response
          float veinNoise = snoise(vPosition * 2.5 + time * 0.3);
          float veinNoise2 = snoise(vPosition * 5.0 - time * 0.4);
          float veinNoise3 = snoise(vPosition * 1.5 + time * 0.2);
          float veinPattern = smoothstep(0.2, 0.45, abs(veinNoise * veinNoise2 * 0.7 + veinNoise3 * 0.3));
          
          // Enhanced pulse effect - faster and more reactive
          float basePulse = sin(time * 4.0 + vPosition.y * 4.0) * 0.5 + 0.5;
          float handPulse = sin(time * 8.0 + vPosition.x * 3.0) * handProximity;
          float pulse = (basePulse + handPulse * 0.5) * pulseIntensity * (1.0 + handProximity * 3.0);
          
          // More intense vein glow with hand reactivity
          float veinGlow = (1.0 - veinPattern) * (0.7 + pulse * 0.5);
          veinGlow *= (0.9 + handProximity * 1.2);
          veinGlow = pow(veinGlow, 0.8); // Boost glow intensity
          
          // Mix colors with more vibrant transitions
          vec3 rockColor = baseColor * (1.0 + handProximity * 0.1);
          vec3 hotColor = vec3(1.0, 0.6, 0.1); // Hotter orange-yellow
          vec3 finalVeinColor = mix(veinColor, hotColor, pulse * handProximity);
          finalVeinColor = mix(finalVeinColor, glowColor, pulse * 0.5);
          
          vec3 finalColor = mix(rockColor, finalVeinColor, veinGlow);
          
          // Enhanced rim lighting with color shift
          float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
          rim = pow(rim, 2.5);
          vec3 rimColor = mix(glowColor, hotColor, handProximity);
          finalColor += rimColor * rim * 0.5 * (1.0 + handProximity * 2.0);
          
          // Stronger emissive glow based on hand proximity
          float emissive = veinGlow * (0.7 + handProximity * 2.5);
          
          // Add core glow that intensifies with hand proximity
          float coreGlow = smoothstep(1.5, 0.0, length(vPosition)) * handProximity * 0.3;
          
          gl_FragColor = vec4(finalColor + finalVeinColor * emissive * 0.5 + hotColor * coreGlow, 1.0);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Update shader uniforms
    lavaMaterial.uniforms.time.value = time;
    lavaMaterial.uniforms.pulseIntensity.value = pulseIntensity;
    lavaMaterial.uniforms.handProximity.value = handPosition.isDetected ? 1.0 - Math.abs(handPosition.z) : 0;

    // Smooth rotation based on hand position - DRAMATIC TILT for 2050 feel
    if (handPosition.isDetected) {
      // Strong rotation multipliers - rock follows palm like a magnetic compass
      targetRotation.current.x = (handPosition.y - 0.5) * 1.5; // 3x stronger Y rotation
      targetRotation.current.y = (handPosition.x - 0.5) * 2.0; // 2.5x stronger X rotation
    } else {
      // Gentle auto-rotation when no hand detected
      targetRotation.current.x = Math.sin(time * 0.3) * 0.15;
      targetRotation.current.y = time * 0.15;
    }

    // Enhanced LERP for responsive yet smooth movement (0.12 = faster response)
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.12;
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.12;

    // Enhanced floating motion - more dramatic
    const floatY = Math.sin(time * 0.6) * 0.25 + Math.sin(time * 1.2) * 0.1;
    const floatX = Math.cos(time * 0.4) * 0.08;
    const floatZ = Math.sin(time * 0.3) * 0.05;

    meshRef.current.position.y = floatY;
    meshRef.current.position.x = floatX;
    meshRef.current.position.z = floatZ;

    // Update glow mesh with slight delay for trailing effect
    if (glowRef.current) {
      glowRef.current.rotation.x += (meshRef.current.rotation.x - glowRef.current.rotation.x) * 0.03;
      glowRef.current.rotation.y += (meshRef.current.rotation.y - glowRef.current.rotation.y) * 0.03;
      glowRef.current.position.lerp(meshRef.current.position, 0.1);
    }
  });

  return (
    <group>
      {/* Main rock mesh */}
      <mesh ref={meshRef} material={lavaMaterial}>
        <dodecahedronGeometry args={[2, 2]} />
      </mesh>

      {/* Outer glow - enhanced */}
      <mesh ref={glowRef} scale={1.2}>
        <dodecahedronGeometry args={[2, 1]} />
        <meshBasicMaterial
          color="#ff6b00"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner glow layer */}
      <mesh scale={1.08}>
        <dodecahedronGeometry args={[2, 2]} />
        <meshBasicMaterial
          color="#ff4d00"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default BasaltRock;
