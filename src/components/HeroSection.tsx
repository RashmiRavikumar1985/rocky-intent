import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HandPosition {
  x: number;
  y: number;
  z: number;
  palmY: number;
  isDetected: boolean;
}

interface HeroSectionProps {
  isHandDetected: boolean;
  isTrackingActive: boolean;
  onToggleTracking: () => void;
}

const HeroSection = ({ isHandDetected, isTrackingActive, onToggleTracking }: HeroSectionProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 100,
          scale: 0.9,
          filter: 'blur(20px)'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power4.out',
          delay: 0.5
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 1.2
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Reactive animation when hand is detected - updated with neural cyan/violet glow
  useEffect(() => {
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        textShadow: isHandDetected
          ? '0 0 60px rgba(0, 242, 255, 0.6), 0 0 100px rgba(138, 43, 226, 0.4)'
          : '0 0 30px rgba(0, 242, 255, 0.3), 0 0 50px rgba(138, 43, 226, 0.2)',
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [isHandDetected]);

  // Deep parallax effect - text moves opposite to 3D core based on palm position
  // Deep parallax effect removed as per request to keep text stable
  // Text will perfectly centered and static while hand controls 3D core and scrolling

  return (
    <div
      ref={containerRef}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pointer-events-none"
    >
      {/* Background title - massive typography */}
      <h1
        ref={titleRef}
        className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-center text-gradient-molten select-none opacity-0 max-w-5xl mx-auto leading-none"
        style={{
          // Updated to Molten Orange glow to match the rock theme
          textShadow: '0 0 30px rgba(255, 77, 0, 0.3), 0 0 60px rgba(255, 77, 0, 0.2)'
        }}
      >
        Welcome to 2050
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="mt-8 text-lg md:text-xl text-gradient-ember tracking-widest uppercase opacity-0 font-medium"
      >
        The Ecosystem Experience
      </p>

      {/* Hand detection indicator */}
      <div
        onClick={onToggleTracking}
        className={`
        absolute bottom-20 left-1/2 -translate-x-1/2
        flex items-center gap-3 px-8 py-4
        glass-card backdrop-blur-xl bg-black/60 border border-molten/50 
        transition-all duration-500 cursor-pointer pointer-events-auto hover:scale-105 active:scale-95
        shadow-[0_0_30px_rgba(255,77,0,0.2)] hover:shadow-[0_0_50px_rgba(255,77,0,0.4)]
        ${isTrackingActive ? 'opacity-100 scale-100' : 'opacity-90 scale-95 hover:opacity-100'}
      `}>
        <div className={`
          w-3 h-3 rounded-full transition-colors duration-300
          ${isHandDetected ? 'bg-molten animate-pulse shadow-[0_0_10px_#ff4d00]' : isTrackingActive ? 'bg-neural animate-pulse' : 'bg-white/50'}
        `} />
        <span className="text-base font-medium tracking-wide text-white drop-shadow-md">
          {isHandDetected
            ? 'Palm UP ↑ Scroll UP • Palm DOWN ↓ Scroll DOWN'
            : isTrackingActive
              ? 'Scanning for Hand... 👋'
              : 'Click ✋ to Enable Neural Scroll'}
        </span>
      </div>
    </div>
  );
};

export default HeroSection;
