import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment, Float } from '@react-three/drei';
import BasaltRock from './BasaltRock';
import ReactiveParticles from './ReactiveParticles';

interface Scene3DProps {
  handPosition: { x: number; y: number; z: number; isDetected: boolean };
  pulseIntensity: number;
}

const Scene3D = ({ handPosition, pulseIntensity }: Scene3DProps) => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.25} />
          
          {/* Main directional light */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.6}
            color="#ffffff"
          />
          
          {/* Orange accent light - brighter */}
          <pointLight
            position={[-3, 2, 3]}
            intensity={3}
            color="#ff4d00"
            distance={12}
          />
          
          {/* Secondary orange light */}
          <pointLight
            position={[2, -1, 4]}
            intensity={1.5}
            color="#ff6b00"
            distance={8}
          />
          
          {/* Violet accent light */}
          <pointLight
            position={[3, -2, 2]}
            intensity={1.5}
            color="#7c3aed"
            distance={10}
          />

          {/* Floating rock with enhanced float */}
          <Float
            speed={2}
            rotationIntensity={0.3}
            floatIntensity={0.5}
            floatingRange={[-0.2, 0.2]}
          >
            <BasaltRock
              handPosition={handPosition}
              pulseIntensity={pulseIntensity}
            />
          </Float>
          
          {/* Reactive particle system */}
          <ReactiveParticles
            handPosition={handPosition}
            pulseIntensity={pulseIntensity}
          />

          {/* Environment for reflections */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
