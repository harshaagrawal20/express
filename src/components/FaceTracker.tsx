import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
// Set to true to use Python API for emotion detection
const USE_PYTHON_API = true; // Change to true to enable backend emotion detection
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { getRecommendedProducts } from '@/data/products';

interface FaceTrackerProps {
  currentProduct?: Product;
  onNavigate?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onEmotionRecommendation?: (products: Product[]) => void;
}

interface NavigationGrid {
  left: { x: number; y: number };
  right: { x: number; y: number };
  up: { x: number; y: number };
  down: { x: number; y: number };
  center: { x: number; y: number };
}

export function FaceTracker({ currentProduct, onNavigate, onEmotionRecommendation }: FaceTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [emotion, setEmotion] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [nosePosition, setNosePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  // For smoothing nose movement
  const noseHistoryRef = useRef<{ x: number; y: number }[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const lastNavigationRef = useRef<number>(0);
  const emotionHistoryRef = useRef<string[]>([]);
  const animationFrameRef = useRef<number>();
  const navZoneRef = useRef<string | null>(null);
  const navZoneFramesRef = useRef<number>(0);
  const navCooldownRef = useRef<number>(0); // ms timestamp until which navigation is on cooldown
  const streamRef = useRef<MediaStream>();

  // Initialize face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading face-api models:', error);
        // Fallback: continue without models
        setIsLoaded(true);
      }
    };

    loadModels();

    return () => {
      // Cleanup models when component unmounts
      // No unload method available for face-api.js models
    };
  }, []);

  // Start video stream
  const startVideo = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' 
        }
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            videoRef.current!.play().then(resolve).catch(console.error);
          };
        });
        setIsTracking(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsTracking(false);
    }
  }, []);

  // Face detection and tracking (smooth, gradual, always updating)
  const detectFaces = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isLoaded || !isTracking) {
      animationFrameRef.current = requestAnimationFrame(detectFaces);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    setErrorMsg('');

    // Skip if video isn't ready
    if (video.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(detectFaces);
      return;
    }

    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight
    };

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.5
        }))
        .withFaceLandmarks()
        .withFaceExpressions();

      faceapi.matchDimensions(canvas, displaySize);

      if (detections.length > 0) {
        const detection = detections[0];
        const landmarks = detection.landmarks;
        // Get nose position (landmark point 30 is the nose tip)
        const nose = landmarks.getNose()[3];
        // Smooth nose position using moving average
        const normalizedNose = {
          x: (nose.x / displaySize.width) * 100,
          y: (nose.y / displaySize.height) * 100
        };
        noseHistoryRef.current.push(normalizedNose);
        if (noseHistoryRef.current.length > 5) noseHistoryRef.current.shift();
        const avgNose = noseHistoryRef.current.reduce((acc, n) => ({ x: acc.x + n.x, y: acc.y + n.y }), { x: 0, y: 0 });
        avgNose.x /= noseHistoryRef.current.length;
        avgNose.y /= noseHistoryRef.current.length;
        setNosePosition(avgNose);

        // Gradual navigation: require nose to stay in a zone for more frames, and add cooldown
        const navZone = getNavZone(nose, displaySize);
        const now = Date.now();
        if (navZone) {
          if (navZoneRef.current === navZone) {
            navZoneFramesRef.current += 1;
          } else {
            navZoneRef.current = navZone;
            navZoneFramesRef.current = 1;
          }
          if (
            navZoneFramesRef.current === 20 && // was 10, now 20 for slower navigation
            (!navCooldownRef.current || now > navCooldownRef.current)
          ) {
            onNavigate?.(navZone as any);
            navCooldownRef.current = now + 1200; // 1.2s cooldown after navigation
          }
        } else {
          navZoneRef.current = null;
          navZoneFramesRef.current = 0;
        }

        let dominantEmotion = 'neutral';
        if (USE_PYTHON_API) {
          // Send frame to backend for emotion detection
          try {
            const emotionFromAPI = await getEmotionFromPythonAPI(video);
            if (emotionFromAPI) dominantEmotion = emotionFromAPI;
          } catch (err) {
            setErrorMsg('Emotion API error: ' + (err?.message || err));
          }
        } else {
          // Get dominant emotion with threshold from face-api.js
          const expressions = detection.expressions;
          const emotionThreshold = 0.6;
          for (const [emotion, probability] of Object.entries(expressions)) {
            if (probability > emotionThreshold && probability > expressions[dominantEmotion as keyof typeof expressions]) {
              dominantEmotion = emotion;
            }
          }
        }

        setEmotion(dominantEmotion);
        // Track emotion history for better accuracy
        emotionHistoryRef.current.push(dominantEmotion);
        if (emotionHistoryRef.current.length > 10) {
          emotionHistoryRef.current.shift();
        }

        // Check for negative emotions to trigger recommendations
        handleEmotionRecommendations(dominantEmotion);

        // Draw face landmarks (custom, more understandable)
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        // Custom: Draw each landmark point with color and label key points
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawNavigationGrid(ctx, displaySize);
          // Draw all landmarks as small blue dots
          ctx.save();
          ctx.fillStyle = '#2196f3';
          landmarks.positions.forEach((pt, idx) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.5, 0, 2 * Math.PI);
            ctx.fill();
          });
          // Label key points
          ctx.font = '12px Arial';
          ctx.fillStyle = '#FFC220';
          // Nose tip (landmark 30)
          const noseTip = landmarks.positions[30];
          ctx.beginPath();
          ctx.arc(noseTip.x, noseTip.y, 5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillText('Nose', noseTip.x + 8, noseTip.y);
          // Left eye center (landmark 36)
          const leftEye = landmarks.positions[36];
          ctx.beginPath();
          ctx.arc(leftEye.x, leftEye.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#4caf50';
          ctx.fill();
          ctx.fillStyle = '#FFC220';
          ctx.fillText('Left Eye', leftEye.x + 8, leftEye.y);
          // Right eye center (landmark 45)
          const rightEye = landmarks.positions[45];
          ctx.beginPath();
          ctx.arc(rightEye.x, rightEye.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#e91e63';
          ctx.fill();
          ctx.fillStyle = '#FFC220';
          ctx.fillText('Right Eye', rightEye.x + 8, rightEye.y);
          // Mouth center (landmark 62)
          const mouth = landmarks.positions[62];
          ctx.beginPath();
          ctx.arc(mouth.x, mouth.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#ff9800';
          ctx.fill();
          ctx.fillStyle = '#FFC220';
          ctx.fillText('Mouth', mouth.x + 8, mouth.y);
          ctx.restore();
        }
      } else {
        // Clear canvas when no faces detected
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        setEmotion('');
        navZoneRef.current = null;
        navZoneFramesRef.current = 0;
        noseHistoryRef.current = [];
      }
    } catch (error) {
      setErrorMsg('Face detection error: ' + (error?.message || error));
      console.error('Face detection error:', error);
    }
    animationFrameRef.current = requestAnimationFrame(detectFaces);
  }, [isLoaded, isTracking, currentProduct]);

  // Helper: Get which navigation zone the nose is in
  const getNavZone = (nose: { x: number; y: number }, displaySize: { width: number; height: number }): string | null => {
    const grid = getNavigationGrid(displaySize);
    const threshold = displaySize.width * 0.15;
    if (nose.x < grid.left.x + threshold && nose.x > grid.left.x - threshold && nose.y < grid.left.y + threshold && nose.y > grid.left.y - threshold) {
      return 'left';
    } else if (nose.x < grid.right.x + threshold && nose.x > grid.right.x - threshold && nose.y < grid.right.y + threshold && nose.y > grid.right.y - threshold) {
      return 'right';
    } else if (nose.y < grid.up.y + threshold && nose.y > grid.up.y - threshold) {
      return 'up';
    } else if (nose.y < grid.down.y + threshold && nose.y > grid.down.y - threshold) {
      return 'down';
    }
    return null;
  };

  // Helper: Send current video frame to Python API for emotion detection
  const getEmotionFromPythonAPI = async (video: HTMLVideoElement): Promise<string | null> => {
    // Draw current frame to a temp canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    // Convert to base64
    const dataUrl = tempCanvas.toDataURL('image/jpeg');
    // Send to backend
    const response = await fetch('/api/emotion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl })
    });
    if (!response.ok) throw new Error('API error: ' + response.statusText);
    const data = await response.json();
    return data.emotion || null;
  };

  // Handle navigation based on nose position
  const handleNavigation = useCallback((nose: { x: number; y: number }, displaySize: { width: number; height: number }) => {
    const now = Date.now();
    if (now - lastNavigationRef.current < 1000) return; // Debounce navigation

    const grid = getNavigationGrid(displaySize);
    const threshold = displaySize.width * 0.15; // Dynamic threshold based on screen size

    if (nose.x < grid.left.x + threshold && nose.x > grid.left.x - threshold && 
        nose.y < grid.left.y + threshold && nose.y > grid.left.y - threshold) {
      onNavigate?.('left');
      lastNavigationRef.current = now;
    } else if (nose.x < grid.right.x + threshold && nose.x > grid.right.x - threshold && 
               nose.y < grid.right.y + threshold && nose.y > grid.right.y - threshold) {
      onNavigate?.('right');
      lastNavigationRef.current = now;
    } else if (nose.y < grid.up.y + threshold && nose.y > grid.up.y - threshold) {
      onNavigate?.('up');
      lastNavigationRef.current = now;
    } else if (nose.y < grid.down.y + threshold && nose.y > grid.down.y - threshold) {
      onNavigate?.('down');
      lastNavigationRef.current = now;
    }
  }, [onNavigate]);

  // Get navigation grid positions
  const getNavigationGrid = (displaySize: { width: number; height: number }): NavigationGrid => {
    const { width, height } = displaySize;
    return {
      left: { x: width * 0.25, y: height * 0.5 },
      right: { x: width * 0.75, y: height * 0.5 },
      up: { x: width * 0.5, y: height * 0.25 },
      down: { x: width * 0.5, y: height * 0.75 },
      center: { x: width * 0.5, y: height * 0.5 },
    };
  };

  // Draw navigation grid overlay
  const drawNavigationGrid = (ctx: CanvasRenderingContext2D, displaySize: { width: number; height: number }) => {
    const grid = getNavigationGrid(displaySize);
    ctx.strokeStyle = '#FFC220';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Draw grid lines
    ctx.beginPath();
    ctx.moveTo(displaySize.width / 3, 0);
    ctx.lineTo(displaySize.width / 3, displaySize.height);
    ctx.moveTo((displaySize.width / 3) * 2, 0);
    ctx.lineTo((displaySize.width / 3) * 2, displaySize.height);
    ctx.moveTo(0, displaySize.height / 3);
    ctx.lineTo(displaySize.width, displaySize.height / 3);
    ctx.moveTo(0, (displaySize.height / 3) * 2);
    ctx.lineTo(displaySize.width, (displaySize.height / 3) * 2);
    ctx.stroke();

    // Draw navigation zones
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255, 194, 32, 0.2)';
    
    // Left zone
    ctx.fillRect(0, displaySize.height / 3, displaySize.width / 3, displaySize.height / 3);
    // Right zone
    ctx.fillRect((displaySize.width / 3) * 2, displaySize.height / 3, displaySize.width / 3, displaySize.height / 3);
    // Up zone
    ctx.fillRect(displaySize.width / 3, 0, displaySize.width / 3, displaySize.height / 3);
    // Down zone
    ctx.fillRect(displaySize.width / 3, (displaySize.height / 3) * 2, displaySize.width / 3, displaySize.height / 3);
  };

  // Handle emotion-based recommendations
  const handleEmotionRecommendations = useCallback((dominantEmotion: string) => {
    if (!currentProduct) return;

    const negativeEmotions = ['sad', 'angry', 'disgusted', 'fearful'];
    const recentEmotions = emotionHistoryRef.current.slice(-5);
    
    // Check if user has shown consistent negative emotions
    const negativeCount = recentEmotions.filter(e => negativeEmotions.includes(e)).length;
    
    if (negativeCount >= 3 && !showRecommendations) {
      // Get current product's price
      const minPrice = Math.min(...currentProduct.variants.map(v => v.price));
      
      if (minPrice > 5000) { // Only recommend for expensive products
        const alternatives = getRecommendedProducts(currentProduct, minPrice * 0.6);
        if (alternatives.length > 0) {
          setRecommendations(alternatives.slice(0, 3));
          setShowRecommendations(true);
          onEmotionRecommendation?.(alternatives);
          
          // Auto-hide after 10 seconds
          setTimeout(() => {
            setShowRecommendations(false);
          }, 10000);
        }
      }
    }
  }, [currentProduct, showRecommendations, onEmotionRecommendation]);

  // Start face detection loop (animation frame)
  useEffect(() => {
    if (isTracking && isLoaded) {
      animationFrameRef.current = requestAnimationFrame(detectFaces);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isTracking, isLoaded, detectFaces]);

  // Start video when component mounts
  useEffect(() => {
    if (isLoaded) {
      startVideo();
    }

    return () => {
      // Cleanup on unmount
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isLoaded, startVideo]);

  return (
    <div className="space-y-4">
      {/* Camera Feed */}
      <Card className="relative">
        <CardContent className="p-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full max-w-md mx-auto rounded-lg"
              style={{ transform: 'scaleX(-1)' }} // Mirror effect
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
          {/* Error Message */}
          {errorMsg && (
            <div className="mt-2 text-xs text-red-500">{errorMsg}</div>
          )}
          {/* Status Display */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isTracking ? 'Face Tracking Active' : 'Initializing...'}
              </span>
            </div>
            {emotion && (
              <Badge variant="outline" className="capitalize">
                {emotion}
              </Badge>
            )}
          </div>
          {/* Navigation Instructions */}
          <div className="mt-4 text-xs text-muted-foreground">
            <p>👃 Move your nose to navigate:</p>
            <div className="grid grid-cols-3 gap-1 mt-2 text-center">
              <div></div>
              <div>↑ Up</div>
              <div></div>
              <div>← Left</div>
              <div>Center</div>
              <div>Right →</div>
              <div></div>
              <div>↓ Down</div>
              <div></div>
            </div>
            {nosePosition && (
              <p className="mt-2">Nose position: X: {nosePosition.x.toFixed(1)}%, Y: {nosePosition.y.toFixed(1)}%</p>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Emotion-Based Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <Card className="border-walmart-yellow bg-walmart-yellow/10">
          <CardContent className="p-4">
            <div className="mb-3">
              <h3 className="font-semibold text-walmart-blue">
                💡 We noticed you might prefer more budget-friendly options
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on your reaction, here are some great alternatives:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendations.map(product => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Emotion Fetcher Component (for testing API) */}
      <EmotionFetcher onEmotion={(data) => console.log('Emotion data:', data)} />
    </div>
  );
}

// Emotion Fetcher Component (for testing API)
function EmotionFetcher({ onEmotion }) {
  const [emotion, setEmotion] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/emotion");
        const data = await res.json();
        setEmotion(data.emotion);
        setCategory(data.category);
        if (onEmotion) onEmotion(data);
      } catch (err) {
        setEmotion("error");
        setCategory("error");
      }
    }, 1000); // Poll every second

    return () => clearInterval(interval);
  }, [onEmotion]);

  return (
    <div>
      <span>Detected Emotion: {emotion}</span>
      <span>Category: {category}</span>
    </div>
  );
}