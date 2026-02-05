import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CustomCursorProps {
  handPosition: { x: number; y: number; isDetected: boolean };
}

const CustomCursor = ({ handPosition }: CustomCursorProps) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (cursorRef.current && trailRef.current) {
      // If hand is detected, use hand position, otherwise use mouse
      const x = handPosition.isDetected 
        ? handPosition.x * window.innerWidth 
        : mousePos.x;
      const y = handPosition.isDetected 
        ? handPosition.y * window.innerHeight 
        : mousePos.y;

      gsap.to(cursorRef.current, {
        x,
        y,
        duration: 0.1,
        ease: 'power2.out',
      });

      gsap.to(trailRef.current, {
        x,
        y,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [mousePos, handPosition]);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div
          className={`
            w-4 h-4 rounded-full transition-all duration-300
            ${handPosition.isDetected 
              ? 'bg-molten scale-150 shadow-lg shadow-molten/50' 
              : 'bg-foreground scale-100'}
          `}
        />
      </div>

      {/* Trail cursor */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-40"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div
          className={`
            w-10 h-10 rounded-full border transition-all duration-300
            ${handPosition.isDetected 
              ? 'border-molten/60 scale-150' 
              : 'border-foreground/30 scale-100'}
          `}
        />
      </div>
    </>
  );
};

export default CustomCursor;
