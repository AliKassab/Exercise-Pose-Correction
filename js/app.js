// Browser entry point — replaces the Flask MJPEG loop in main.py.

import { PoseLandmarker, DrawingUtils } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
import { PoseDetector } from './poseDetector.js';
import { SquatStrategy } from './strategies/squatStrategy.js';
import { LeftBicepCurlStrategy } from './strategies/leftBicepCurlStrategy.js';
import { RightBicepCurlStrategy } from './strategies/rightBicepCurlStrategy.js';
import { PushUpStrategy } from './strategies/pushUpStrategy.js';

const exerciseStrategies = {
    1: SquatStrategy,
    2: LeftBicepCurlStrategy,
    3: RightBicepCurlStrategy,
    4: PushUpStrategy
};

const video = document.getElementById('video');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const exerciseSelect = document.getElementById('exerciseSelect');
const statusEl = document.getElementById('status');
const stage = document.getElementById('stage');

const detector = new PoseDetector();
const drawingUtils = new DrawingUtils(ctx);

let running = false;
let modelReady = false;
let lastVideoTime = -1;
let rafId = null;

function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.classList.toggle('error', isError);
}

function drawGuide(guide) {
    // Mirrors the cv2.putText overlay from main.py.
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = '#00ff00';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = 4;
    ctx.textBaseline = 'top';

    let y = 18;
    for (const line of guide.split('\n')) {
        if (line.length === 0) {
            continue;
        }
        ctx.strokeText(line, 18, y);
        ctx.fillText(line, 18, y);
        y += 34;
    }
}

function renderLoop() {
    if (!running) {
        return;
    }

    if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        const landmarks = detector.detectLandmarks(video, performance.now());

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (landmarks) {
            drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS,
                { color: '#ffffff', lineWidth: 2 });
            drawingUtils.drawLandmarks(landmarks, { color: '#61dafb', radius: 3 });

            const exerciseId = Number(exerciseSelect.value);
            const StrategyClass = exerciseStrategies[exerciseId];
            if (StrategyClass) {
                const guide = new StrategyClass(landmarks).correctForm();
                drawGuide(guide);
            }
        }
    }

    rafId = requestAnimationFrame(renderLoop);
}

async function start() {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('This browser does not expose a camera API. Use a recent Chrome, Edge, Firefox or Safari over HTTPS.');
        }

        if (!modelReady) {
            startButton.disabled = true;
            setStatus('Loading pose model…');
            await detector.init();
            modelReady = true;
        }

        setStatus('Requesting camera access…');
        await detector.startCamera(video);

        running = true;
        lastVideoTime = -1;
        stage.classList.add('live');
        startButton.disabled = false;
        startButton.textContent = 'Stop Video Feed';
        exerciseSelect.style.display = 'block';
        setStatus('Running locally in your browser — no video is uploaded.');
        renderLoop();
    } catch (err) {
        running = false;
        startButton.disabled = false;
        startButton.textContent = 'Start Video Feed';
        const reason = err && err.name === 'NotAllowedError'
            ? 'Camera permission was denied. Allow it in your browser settings and try again.'
            : (err && err.message) || String(err);
        setStatus(reason, true);
    }
}

function stop() {
    running = false;
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    detector.releaseCamera();
    video.srcObject = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stage.classList.remove('live');
    startButton.textContent = 'Start Video Feed';
    exerciseSelect.style.display = 'none';
    setStatus('Stopped.');
}

startButton.addEventListener('click', () => {
    if (running) {
        stop();
    } else {
        start();
    }
});

window.addEventListener('pagehide', stop);
