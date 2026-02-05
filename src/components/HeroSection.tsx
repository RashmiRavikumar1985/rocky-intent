import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroSectionProps {
  isHandDetected: boolean;
}

const HeroSection = ({ isHandDetected }: HeroSectionProps) => {
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

  // Reactive animation when hand is detected
  useEffect(() => {
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        textShadow: isHandDetected 
          ? '0 0 80px hsl(18, 100%, 50%, 0.8), 0 0 120px hsl(263, 70%, 50%, 0.4)'
          : '0 0 40px hsl(18, 100%, 50%, 0.4), 0 0 60px hsl(263, 70%, 50%, 0.2)',
        scale: isHandDetected ? 1.02 : 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [isHandDetected]);

  return (
    <div 
      ref={containerRef}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pointer-events-none"
    >
      {/* Background title - massive typography */}
      <h1
        ref={titleRef}
        className="hero-title text-gradient-molten select-none opacity-0"
        style={{
          textShadow: '0 0 40px hsl(18, 100%, 50%, 0.4), 0 0 60px hsl(263, 70%, 50%, 0.2)'
        }}
      >
        ROCKY
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="mt-8 text-lg md:text-xl text-muted-foreground tracking-widest uppercase opacity-0"
      >
        The Ecosystem Experience
      </p>

      {/* Hand detection indicator */}
      <div className={`
        absolute bottom-32 left-1/2 -translate-x-1/2
        flex items-center gap-3 px-6 py-3
        glass-card transition-all duration-500
        ${isHandDetected ? 'opacity-100 scale-100' : 'opacity-60 scale-95'}
      `}>
        <div className={`
          w-3 h-3 rounded-full transition-colors duration-300
          ${isHandDetected ? 'bg-molten animate-pulse' : 'bg-muted-foreground'}
        `} />
        <span className="text-sm tracking-wide">
          {isHandDetected ? 'Neural Link Active' : 'Awaiting Presence'}
        </span>
      </div>
    </div>
  );
};

export default HeroSection;
