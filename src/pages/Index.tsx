import { useState, useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Scene3D from '@/components/Scene3D';
import HeroSection from '@/components/HeroSection';
import DataCards from '@/components/DataCards';
import MicDrop from '@/components/MicDrop';
import CustomCursor from '@/components/CustomCursor';
import HandTrackingToggle from '@/components/HandTrackingToggle';
import { useHandTracking } from '@/hooks/useHandTracking';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Index = () => {
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetVelocityRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const animationFrameRef = useRef<number>();

  const {
    handPosition,
    isLoading,
    error,
    initializeTracking,
    cleanup
  } = useHandTracking();

  // Toggle hand tracking
  const handleToggleTracking = useCallback(async () => {
    if (isTrackingActive) {
      cleanup();
      setIsTrackingActive(false);
    } else {
      await initializeTracking();
      setIsTrackingActive(true);
    }
  }, [isTrackingActive, initializeTracking, cleanup]);

  // Anti-gravity scroll physics loop (LERP-based continuous scroll)
  useEffect(() => {
    if (!isTrackingActive) {
      // Stop the animation when tracking is disabled
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scrollVelocityRef.current = 0;
      targetVelocityRef.current = 0;
      return;
    }

    const updateScroll = () => {
      // LERP: Gradually approach target velocity (factor 0.05 for floaty feel)
      scrollVelocityRef.current += (targetVelocityRef.current - scrollVelocityRef.current) * 0.05;

      // Apply scroll if velocity is above threshold
      if (Math.abs(scrollVelocityRef.current) > 0.1) {
        window.scrollBy(0, scrollVelocityRef.current);
      }

      // Continue the physics loop
      animationFrameRef.current = requestAnimationFrame(updateScroll);
    };

    // Start the physics loop
    animationFrameRef.current = requestAnimationFrame(updateScroll);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isTrackingActive]);

  // Update target velocity based on palm position
  useEffect(() => {
    if (!isTrackingActive) return;

    if (handPosition.isDetected) {
      // CALIBRATION FIX: Shift Center Low
      const NEUTRAL_POINT = 0.3; // Center is now at 70% physical height (lower)
      const DEADZONE = 0.15;

      const distanceFromCenter = handPosition.palmY - NEUTRAL_POINT;

      if (Math.abs(distanceFromCenter) > DEADZONE) {
        // Negative multiplier ensures Palm UP = Scroll UP (-), Palm DOWN = Scroll DOWN (+)
        targetVelocityRef.current = distanceFromCenter * -60;
      } else {
        targetVelocityRef.current = 0;
      }

      // Update pulse intensity based on hand proximity
      setPulseIntensity(0.5 + (1 - Math.abs(handPosition.z)) * 0.5);
    } else {
      // No hand detected - gradually stop
      targetVelocityRef.current = 0;
    }
  }, [handPosition, isTrackingActive]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loop back to top
  const handleLoopComplete = useCallback(() => {
    gsap.to(window, {
      scrollTo: 0,
      duration: 2,
      ease: 'power3.inOut',
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-background overflow-x-hidden scrollbar-hide"
    >
      {/* Background gradient overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, hsl(18, 100%, 50%, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, hsl(263, 70%, 50%, 0.05) 0%, transparent 40%),
            linear-gradient(180deg, hsl(240, 10%, 4%) 0%, hsl(240, 15%, 6%) 100%)
          `,
        }}
      />

      {/* 3D Scene */}
      <div className="fixed inset-0 z-0">
        <Scene3D
          handPosition={handPosition}
          pulseIntensity={pulseIntensity}
        />
      </div>

      {/* Custom cursor */}
      <CustomCursor handPosition={handPosition} />

      {/* Hand tracking toggle */}
      <HandTrackingToggle
        isActive={isTrackingActive}
        isLoading={isLoading}
        error={error}
        onToggle={handleToggleTracking}
      />

      {/* Content sections */}
      <main className="relative z-10">
        {/* Hero section */}
        <HeroSection
          isHandDetected={handPosition.isDetected && isTrackingActive}
          isTrackingActive={isTrackingActive}
          onToggleTracking={handleToggleTracking}
        />

        {/* Data cards section */}
        <DataCards scrollProgress={scrollProgress} />

        {/* Mic drop section */}
        <MicDrop onComplete={handleLoopComplete} />
      </main>

      {/* Progress indicator */}
      <div
        className="fixed bottom-0 left-0 h-1 bg-gradient-to-r from-molten via-neural to-molten z-50"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </div>
  );
};

export default Index;
