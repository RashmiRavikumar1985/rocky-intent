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
            className="glass-card p-8 md:p-10 group hover:border-molten/40 transition-all duration-500"
            style={{
              transform: `translateY(${scrollProgress * (index % 2 === 0 ? -10 : 10)}px)`,
            }}
          >
            {/* Metric */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl md:text-6xl font-bold text-molten group-hover:text-molten-400 transition-colors">
                {point.metric}
              </span>
              <span className="text-sm text-neural tracking-wider">
                {point.unit}
              </span>
            </div>

            {/* Label */}
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {point.label}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {point.description}
            </p>

            {/* Decorative line */}
            <div className="mt-6 h-px bg-gradient-to-r from-molten/50 via-neural/30 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DataCards;
