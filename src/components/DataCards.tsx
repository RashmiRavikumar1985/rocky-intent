import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const dataPoints = [
  {
    id: 1,
    metric: '65K',
    unit: 'TPS',
    label: 'Transactions Per Second',
    description: 'Solana-grade throughput for instant consensus',
  },
  {
    id: 2,
    metric: '$0.00025',
    unit: 'AVG',
    label: 'Transaction Cost',
    description: 'Near-zero fees for frictionless operations',
  },
  {
    id: 3,
    metric: '400ms',
    unit: 'BLOCK',
    label: 'Block Time',
    description: 'Sub-second finality for real-time applications',
  },
  {
    id: 4,
    metric: '2000+',
    unit: 'NODES',
    label: 'Validator Network',
    description: 'Decentralized security at global scale',
  },
];

interface DataCardsProps {
  scrollProgress: number;
}

const DataCards = ({ scrollProgress }: DataCardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            scale: 0.9,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-20 min-h-screen py-32 px-4 md:px-8"
    >
      {/* Section header */}
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold text-gradient-molten mb-4">
          Decentralized Velocity
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Infrastructure that thinks at the speed of intent
        </p>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {dataPoints.map((point, index) => (
          <div
            key={point.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="relative glass-card p-8 md:p-10 group hover:border-molten/50 transition-all duration-500 float-smooth"
            style={{
              transform: `translateY(${scrollProgress * (index % 2 === 0 ? -20 : 20)}px)`,
              boxShadow: `
                0 0 30px hsl(18, 100%, 50%, 0.15),
                0 0 60px hsl(18, 100%, 50%, 0.08),
                inset 0 0 30px hsl(18, 100%, 50%, 0.03)
              `,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            {/* Glow overlay */}
            <div 
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, hsl(18, 100%, 50%, 0.1) 0%, transparent 70%)',
              }}
            />
            
            {/* Corner glow accents */}
            <div className="absolute -top-px -left-px w-20 h-20 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-molten/80 to-transparent" />
              <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-molten/80 to-transparent" />
            </div>
            <div className="absolute -bottom-px -right-px w-20 h-20 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-neural/80 to-transparent" />
              <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-neural/80 to-transparent" />
            </div>

            {/* Metric */}
            <div className="flex items-baseline gap-2 mb-4 relative z-10">
              <span 
                className="text-5xl md:text-6xl font-bold text-molten group-hover:text-molten-400 transition-colors"
                style={{
                  textShadow: '0 0 30px hsl(18, 100%, 50%, 0.5), 0 0 60px hsl(18, 100%, 50%, 0.3)',
                }}
              >
                {point.metric}
              </span>
              <span className="text-sm text-neural tracking-wider drop-shadow-[0_0_10px_hsl(263,70%,50%,0.5)]">
                {point.unit}
              </span>
            </div>

            {/* Label */}
            <h3 className="text-xl font-semibold text-foreground mb-2 relative z-10">
              {point.label}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
              {point.description}
            </p>

            {/* Decorative line with glow */}
            <div 
              className="mt-6 h-px bg-gradient-to-r from-molten/60 via-neural/40 to-transparent relative z-10"
              style={{
                boxShadow: '0 0 10px hsl(18, 100%, 50%, 0.4)',
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DataCards;
