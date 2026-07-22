// Port of PoseDetector.py — MediaPipe Tasks Vision running in the browser.
// The camera is the *visitor's* camera and every frame is processed locally;
// no video ever leaves the device.

import { PoseLandmarker, FilesetResolver } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';

const WASM_ROOT = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

export class PoseDetector {
    constructor() {
        this.landmarker = null;
        this.stream = null;
    }

    async init() {
        const fileset = await FilesetResolver.forVisionTasks(WASM_ROOT);
        this.landmarker = await PoseLandmarker.createFromOptions(fileset, {
            baseOptions: {
                modelAssetPath: MODEL_URL,
                delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numPoses: 1,
            minPoseDetectionConfidence: 0.5,
            minPosePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
    }

    async startCamera(videoEl) {
        this.stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            audio: false
        });
        videoEl.srcObject = this.stream;
        await videoEl.play();
        return this.stream;
    }

    // Returns the normalized landmark array for the first detected pose, or null.
    detectLandmarks(videoEl, timestampMs) {
        if (!this.landmarker) {
            return null;
        }
        const result = this.landmarker.detectForVideo(videoEl, timestampMs);
        if (result.landmarks && result.landmarks.length > 0) {
            return result.landmarks[0];
        }
        return null;
    }

    releaseCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}
