import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment, Float } from '@react-three/drei';
import BasaltRock from './BasaltRock';

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
          <ambientLight intensity={0.2} />
          
          {/* Main directional light */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.5}
            color="#ffffff"
          />
          
          {/* Orange accent light */}
          <pointLight
            position={[-3, 2, 3]}
            intensity={2}
            color="#ff4d00"
            distance={10}
          />
          
          {/* Violet accent light */}
          <pointLight
            position={[3, -2, 2]}
            intensity={1}
            color="#7c3aed"
            distance={8}
          />

          {/* Floating rock */}
          <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.3}
            floatingRange={[-0.1, 0.1]}
          >
            <BasaltRock
              handPosition={handPosition}
              pulseIntensity={pulseIntensity}
            />
          </Float>

          {/* Environment for reflections */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
