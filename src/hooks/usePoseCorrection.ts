import { useCallback, useEffect, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { exerciseStrategies } from '../lib/strategies';
import type { ExerciseId } from '../lib/types';

/**
 * WASM runtime is self-hosted from public/wasm (copied out of the npm package
 * at build time), so the only third-party fetch is the model itself.
 */
const WASM_ROOT = `${import.meta.env.BASE_URL}wasm`;
const MODEL_URL =
    'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

export type FeedStatus = 'idle' | 'loading' | 'running' | 'error';

interface UsePoseCorrectionResult {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    status: FeedStatus;
    message: string;
    /** Current guidance lines, rendered as DOM rather than drawn on the canvas. */
    guidance: string[];
    /** False while the feed is live but nobody is in frame. */
    poseDetected: boolean;
    start: () => Promise<void>;
    stop: () => void;
}

/**
 * Owns the camera stream, the pose landmarker and the render loop.
 * The loop deliberately lives outside React state: it runs at frame rate and
 * re-rendering per frame would be wasteful.
 */
export function usePoseCorrection(exerciseId: ExerciseId): UsePoseCorrectionResult {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const landmarkerRef = useRef<PoseLandmarker | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const rafRef = useRef<number | null>(null);
    const lastVideoTimeRef = useRef(-1);
    const runningRef = useRef(false);
    // Read inside the render loop so switching exercises does not restart it.
    const exerciseIdRef = useRef<ExerciseId>(exerciseId);
    // DrawingUtils is bound to a context, so it is built once rather than per frame.
    const drawingUtilsRef = useRef<DrawingUtils | null>(null);
    // Guidance only reaches React state when it actually changes, so a frame-rate
    // loop does not trigger a frame-rate render.
    const lastGuidanceRef = useRef<string>('');
    const lastPoseDetectedRef = useRef(false);

    const [status, setStatus] = useState<FeedStatus>('idle');
    const [guidance, setGuidance] = useState<string[]>([]);
    const [poseDetected, setPoseDetected] = useState(false);
    const [message, setMessage] = useState(
        'Press start and allow camera access. Video is processed on your device and never uploaded.'
    );

    useEffect(() => {
        exerciseIdRef.current = exerciseId;
    }, [exerciseId]);

    const publishPoseDetected = useCallback((detected: boolean) => {
        if (detected === lastPoseDetectedRef.current) {
            return;
        }
        lastPoseDetectedRef.current = detected;
        setPoseDetected(detected);
    }, []);

    const publishGuidance = useCallback((guide: string) => {
        if (guide === lastGuidanceRef.current) {
            return;
        }
        lastGuidanceRef.current = guide;
        setGuidance(guide.split('\n').filter(line => line.length > 0));
    }, []);

    const renderLoop = useCallback(() => {
        if (!runningRef.current) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const landmarker = landmarkerRef.current;

        if (video && canvas && landmarker && video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = video.currentTime;

            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }

            const ctx = canvas.getContext('2d');
            if (ctx) {
                const result = landmarker.detectForVideo(video, performance.now());
                // Left as MediaPipe's own type: DrawingUtils needs a mutable array,
                // while the strategies accept it as readonly PoseLandmarks.
                const landmarks = result.landmarks?.[0];

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                if (landmarks) {
                    drawingUtilsRef.current ??= new DrawingUtils(ctx);
                    drawingUtilsRef.current.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
                        color: 'rgba(255, 255, 255, 0.85)',
                        lineWidth: 3
                    });
                    drawingUtilsRef.current.drawLandmarks(landmarks, { color: '#38bdf8', radius: 3 });

                    publishPoseDetected(true);

                    const StrategyClass = exerciseStrategies[exerciseIdRef.current];
                    if (StrategyClass) {
                        publishGuidance(new StrategyClass(landmarks).correctForm());
                    }
                } else {
                    publishPoseDetected(false);
                    publishGuidance('');
                }
            }
        }

        rafRef.current = requestAnimationFrame(renderLoop);
    }, [publishGuidance, publishPoseDetected]);

    /** Releases hardware and cancels the loop without touching React state. */
    const teardown = useCallback(() => {
        runningRef.current = false;

        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        const canvas = canvasRef.current;
        canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        drawingUtilsRef.current = null;

        lastGuidanceRef.current = '';
        lastPoseDetectedRef.current = false;
    }, []);

    const stop = useCallback(() => {
        teardown();
        setStatus('idle');
        setGuidance([]);
        setPoseDetected(false);
        setMessage('Camera stopped.');
    }, [teardown]);

    const start = useCallback(async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error(
                    'This browser does not expose a camera API. Use a recent Chrome, Edge, Firefox or Safari over HTTPS.'
                );
            }

            setStatus('loading');

            if (!landmarkerRef.current) {
                setMessage('Loading pose model…');
                const fileset = await FilesetResolver.forVisionTasks(WASM_ROOT);
                landmarkerRef.current = await PoseLandmarker.createFromOptions(fileset, {
                    baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
                    runningMode: 'VIDEO',
                    numPoses: 1,
                    minPoseDetectionConfidence: 0.5,
                    minPosePresenceConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });
            }

            setMessage('Requesting camera access…');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
                audio: false
            });
            streamRef.current = stream;

            const video = videoRef.current;
            if (!video) {
                throw new Error('Video element is not mounted.');
            }
            video.srcObject = stream;
            await video.play();

            runningRef.current = true;
            lastVideoTimeRef.current = -1;
            setStatus('running');
            setMessage('Running locally in your browser — no video is uploaded.');
            renderLoop();
        } catch (err) {
            runningRef.current = false;
            streamRef.current?.getTracks().forEach(track => track.stop());
            streamRef.current = null;

            setStatus('error');
            setMessage(
                err instanceof DOMException && err.name === 'NotAllowedError'
                    ? 'Camera permission was denied. Allow it in your browser settings and try again.'
                    : err instanceof Error
                      ? err.message
                      : String(err)
            );
        }
    }, [renderLoop]);

    // Release the camera if the component unmounts while the feed is live.
    // Uses teardown rather than stop so it never writes state after unmount.
    useEffect(() => teardown, [teardown]);

    return { videoRef, canvasRef, status, message, guidance, poseDetected, start, stop };
}
