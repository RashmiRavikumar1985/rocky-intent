import { useEffect, useRef, useState, useCallback } from 'react';

interface HandPosition {
  x: number;
  y: number;
  z: number;
  palmY: number;
  isDetected: boolean;
}

export const useHandTracking = () => {
  const [handPosition, setHandPosition] = useState<HandPosition>({
    x: 0.5,
    y: 0.5,
    z: 0,
    palmY: 0.5,
    isDetected: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  const initializeTracking = useCallback(async () => {
    try {
      // Dynamically import MediaPipe
      const { Hands } = await import('@mediapipe/hands');
      const { Camera } = await import('@mediapipe/camera_utils');

      // Create video element
      const video = document.createElement('video');
      video.style.display = 'none';
      video.playsInline = true;
      document.body.appendChild(video);
      videoRef.current = video;

      // Create canvas for processing
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      canvasRef.current = canvas;

      // Initialize MediaPipe Hands
      const hands = new Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0, // Fastest model
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: any) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          
          // Get palm center (landmark 0 is wrist, 9 is middle finger base)
          const wrist = landmarks[0];
          const middleBase = landmarks[9];
          
          const palmX = (wrist.x + middleBase.x) / 2;
          const palmY = (wrist.y + middleBase.y) / 2;
          const palmZ = (wrist.z + middleBase.z) / 2;

          setHandPosition({
            x: 1 - palmX, // Mirror for natural feel
            y: palmY,
            z: palmZ,
            palmY: 1 - palmY, // Inverted for scroll direction
            isDetected: true,
          });
        } else {
          setHandPosition(prev => ({ ...prev, isDetected: false }));
        }
      });

      handsRef.current = hands;

      // Initialize camera
      const camera = new Camera(video, {
        onFrame: async () => {
          if (handsRef.current) {
            await handsRef.current.send({ image: video });
          }
        },
        width: 640,
        height: 480,
      });

      cameraRef.current = camera;
      await camera.start();
      
      setIsLoading(false);
    } catch (err) {
      console.error('Hand tracking initialization failed:', err);
      setError('Camera access denied or not available');
      setIsLoading(false);
    }
  }, []);

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (videoRef.current) {
      videoRef.current.remove();
    }
    if (handsRef.current) {
      handsRef.current.close();
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    handPosition,
    isLoading,
    error,
    initializeTracking,
    cleanup,
  };
};
