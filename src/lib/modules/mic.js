import { PitchDetector } from "pitchy";

/** @type {number|null} */
var interval_id = null;
/** @type {AudioContext|null} */
var audioContext = null;
/** @type {MediaStream|null} */
var micStream = null;

/**
 * @returns {Promise<string>} 'granted', 'denied', or 'prompt'
 */
export async function queryMicAccess() {
    const access = await navigator.permissions.query({ name: "microphone" });
    return access.state;
}


/** @returns {Promise<boolean>} */
export async function startMicrophoneStream() {
    try {
        if (!audioContext)
            audioContext = new window.AudioContext();
        if ( !micStream )
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access granted.');
        return true;
    } catch (error) {
        console.error('Microphone access denied:', error);
        return false;
    }
}


/**
 * @param {function({pitch: number, clarity: number}): void} callback 
 * @returns {void}
 */
export function startPitchDetection(callback) 
{
    const MILLISECONDS = 100;
    
    const analyserNode = audioContext.createAnalyser();

    const maxSamples = Math.floor(audioContext.sampleRate * MILLISECONDS / 1000);
    let fftSize = 32;
    while ( (fftSize * 2 <= maxSamples) && (fftSize * 2 <= 32768) )
        fftSize *= 2;
    analyserNode.fftSize = fftSize;

    audioContext.createMediaStreamSource(micStream).connect(analyserNode);
    const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
    detector.minVolumeDecibels = -20;
    const input = new Float32Array(detector.inputLength);
    
    if ( interval_id )
        clearInterval(interval_id);
    
    interval_id = setInterval(() => {
        callback(updatePitch(analyserNode, detector, input, audioContext.sampleRate));
    }, MILLISECONDS);
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
