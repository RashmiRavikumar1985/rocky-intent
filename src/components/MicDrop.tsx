import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MicDropProps {
  onComplete: () => void;
}

const MicDrop = ({ onComplete }: MicDropProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal animation
      gsap.fromTo(
        textRef.current,
        {
          opacity: 0,
          scale: 0.5,
          filter: 'blur(30px)',
        },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        subtextRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.5,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Loop trigger
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'bottom 20%',
        onEnter: () => {
          // Smooth scroll to top after a delay
          setTimeout(() => {
            onComplete();
          }, 1000);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <section
      ref={containerRef}
      className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4"
    >
      {/* Main statement */}
      <h2
        ref={textRef}
        className="text-5xl md:text-8xl lg:text-9xl font-bold text-center leading-tight"
        style={{
          background: 'linear-gradient(135deg, hsl(18, 100%, 50%) 0%, hsl(263, 70%, 50%) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 100px hsl(18, 100%, 50%, 0.3)',
        }}
      >
        They are
        <br />
        entered
      </h2>

      {/* Subtext */}
      <p
        ref={subtextRef}
        className="mt-12 text-muted-foreground text-lg md:text-xl tracking-widest uppercase"
      >
        The loop continues
      </p>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
        <span className="text-xs tracking-widest uppercase text-muted-foreground">
          Scroll to restart
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-molten to-transparent" />
      </div>
    </section>
  );
};

export default MicDrop;
