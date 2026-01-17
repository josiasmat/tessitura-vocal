import { PitchDetector } from "pitchy";

/** @type {boolean} */
var mic_access = false;
/** @type {number|null} */
var interval_id = null;
/** @type {AudioContext|null} */
var audioContext = null;

/**
 * @param {function(string):void} callback - Function to call with the permission state
 * @returns {Promise<string>} 'granted', 'denied', or 'prompt'
 */
export async function queryMicAccess(callback) {
    const access = await navigator.permissions.query({ name: "microphone" });
    callback?.(access.state);
    return access.state;
}

/** @returns {boolean} */
export function isMicAccessGranted() {
    return mic_access;
}

export async function requestMicAccess() {
    try {
        // This will trigger the browser's microphone permission dialog
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream for now (we'll use it later in the listening screen)
        stream.getTracks().forEach((track) => track.stop());
        return mic_access = true;
    } catch (error) {
        console.error('Microphone access denied:', error);
        return mic_access = false;
    }
}


/**
 * @param {function({pitch: number, clarity: number}): void} callback 
 * @returns {void}
 */
export function startPitchDetection(callback) 
{
    const MILLISECONDS = 100;

    if (!audioContext)
        audioContext = new window.AudioContext();
    
    const analyserNode = audioContext.createAnalyser();

    const maxSamples = Math.floor(audioContext.sampleRate * MILLISECONDS / 1000);
    let fftSize = 32;
    while ( (fftSize * 2 <= maxSamples) && (fftSize * 2 <= 32768) )
        fftSize *= 2;
    analyserNode.fftSize = fftSize;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        audioContext.createMediaStreamSource(stream).connect(analyserNode);
        const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
        detector.minVolumeDecibels = -20;
        const input = new Float32Array(detector.inputLength);
        
        if ( interval_id )
            clearInterval(interval_id);
        
        interval_id = setInterval(() => {
            callback(updatePitch(analyserNode, detector, input, audioContext.sampleRate));
        }, MILLISECONDS);
    });
}


/** @returns {void} */
export function stopPitchDetection()
{
    if ( interval_id )
        clearInterval(interval_id);
    interval_id = null;
}


/**
 * @param {AnalyserNode} analyserNode 
 * @param {PitchDetector} detector 
 * @param {Float32Array<ArrayBuffer>} input 
 * @param {number} sampleRate 
 * @returns {{pitch: number, clarity: number}}
 */
function updatePitch(analyserNode, detector, input, sampleRate) 
{
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);
    return { pitch, clarity };
}
