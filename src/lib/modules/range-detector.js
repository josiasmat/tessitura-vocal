import { get } from "svelte/store";
import { startPitchDetection, stopPitchDetection } from "./mic.js";
import { freqToMidi } from "./notes";

const CLARITY_TRESHOLD = 0.90;
const MIN_PITCH = 36; // C2
const MAX_PITCH = 88; // E6


// Public API

export const RangeDetector = {

    min_pitch: MIN_PITCH,
    max_pitch: MAX_PITCH,

    lastPitchCallback: null,
    lowPitchCallback: null,
    highPitchCallback: null,

    start() 
    {
        clearPitchTimeout.clear();
        // check stability with 10 samples and 0.5 semitone window
        let stablePitchChecker = new StablePitch(10, 0.5);

        startPitchDetection((result) => {
            const pitch = freqToMidi(result.freq);
            stablePitchChecker.setFreq(result.freq);
            if ( result.clarity >= CLARITY_TRESHOLD 
                    && pitch >= MIN_PITCH && pitch <= MAX_PITCH) {
                
                // Stable pitch detected
                const stablePitch = stablePitchChecker.getPitch();
                if ( stablePitch ) {
                    clearPitchTimeout.clear();
                    this.lastPitch = stablePitch;
                    this.lowPitch  = stablePitch;
                    this.highPitch = stablePitch;
                } else
                    clearPitchTimeout.set();

            } else {
				clearPitchTimeout.set();
            }
			
        }, { window: 1000/60 }); // 60 FPS
    },

    stop() 
    {
        stopPitchDetection();
        clearPitchTimeout.clear();
    },

    get lowPitch() {
        return pitches.low;
    },

    get highPitch() {
        return pitches.high;
    },

    get lastPitch() {
        return pitches.last;
    },

    set lowPitch(pitch) {
        if ( pitch >= this.min_pitch && pitch <= this.max_pitch
                && ( !pitches.low || pitch < pitches.low ) ) {
            pitches.low = pitch;
            this.lowPitchCallback?.(pitch);
        }
    },

    set highPitch(pitch) {
        if ( pitch >= this.min_pitch && pitch <= this.max_pitch
                && ( !pitches.high || pitch > pitches.high ) ) {
            pitches.high = pitch;
            this.highPitchCallback?.(pitch);
        }
    },

    set lastPitch(pitch) {
        pitches.last = pitch;
        this.lastPitchCallback?.(pitch);
    },

    resetLowPitch() {
        pitches.low = null;
        this.lowPitchCallback?.(null);
    },

    resetHighPitch() {
        pitches.high = null;
        this.highPitchCallback?.(null);
    },

    resetLastPitch() {
        pitches.last = null;
        this.lastPitchCallback?.(null);
    },

    resetPitches() {
        this.resetLastPitch();
        this.resetLowPitch();
        this.resetHighPitch();
    },

    resetMinMax() {
        this.min_pitch = MIN_PITCH;
        this.max_pitch = MAX_PITCH;
    },

    resetCallbacks() {
        this.lastPitchCallback = null;
        this.lowPitchCallback = null;
        this.highPitchCallback = null;
    },

    resetAll() {
        this.resetCallbacks();
        this.resetMinMax();
        this.resetPitches();
    }

}


export function evaluateRange(low, high, gender = null) 
{
    const detectedAvg = (low + high) / 2;
    let bestMatch = 'unknown';
    let smallestDiff = Infinity;

    for ( const [type, info] of Object.entries(vocalRanges) ) {
        if (info.gender !== gender) continue;
        const [typeLow, typeHigh] = info.range;
        const typeAvg = (typeLow + typeHigh) / 2;

        // weight more heavily pitches outside range than inside
        let lowDiff = low < typeLow ? (typeLow-low)*2 : (low-typeLow)/2;
        let highDiff = high > typeHigh ? (high-typeHigh)*2 : (typeHigh-high)/2;
        let centerDiff = Math.abs(detectedAvg - typeAvg);

        // Weighted difference
        let totalDiff = 1*lowDiff + 1*highDiff + 1*centerDiff;

        if ( totalDiff < smallestDiff && totalDiff < 10 ) {
            smallestDiff = totalDiff;
            bestMatch = type;
        }
    }

    return bestMatch;
}


export function getStandardRange(type) {
    return vocalRanges[type]?.range || null;
}



// Internal 

const pitches = {
    last: null,
    low: null,
    high: null
}

const clearPitchTimeout = {

    id: null,

    clear() {
        if ( this.id ) {
            clearTimeout(this.id);
			this.id = null;
        }
    },

    set(interval = 500) {
        if ( !this.id )
            this.id = setTimeout(() => {
                this.id = null;
                RangeDetector.resetLastPitch();
            }, interval);
    }

}

class StablePitch {
    /** @type {Array<number} */
    #freqs;
    /** @type {number} */
    #half_semitone;

    /**
     * @param {number} samples - number of samples to consider
     * @param {number} semitones - stability window in semitones
     */
    constructor(samples = 3, semitones = 1) {
        this.#freqs = new Array(samples).fill(null);
        this.#half_semitone = semitones / 2;
    }

    setFreq(freq) {
        for ( let i = this.#freqs.length-1; i > 0; i-- )
            this.#freqs[i] = this.#freqs[i-1];
        this.#freqs[0] = freq;
    }

    getPitch() {
        // Return null if array is not complete
        if ( this.#freqs.includes(null) )
            return null;
        // Compute average frequency
        const avg = this.#freqs.reduce((a,b) => a+b, 0) / this.#freqs.length;
        // Helper functions
        const freqToPitchFromA4 = (f) => 12 * Math.log2(f / 440);
        const pitchFromA4ToFreq = (p) => 440 * Math.pow(2, p / 12);
        // Compute microtone thresholds
        const lowerThreshold = pitchFromA4ToFreq(freqToPitchFromA4(avg) - this.#half_semitone);
        const upperThreshold = pitchFromA4ToFreq(freqToPitchFromA4(avg) + this.#half_semitone);
        // Check if all frequencies are within the same microtone
        const stable = this.#freqs.every(f => f >= lowerThreshold && f <= upperThreshold);
        // Return pitch if stable, else null
        if ( stable )
            return Math.round(freqToPitchFromA4(avg) + 69);
        return null;
    }
}


// Data

const vocalRanges = {
    'soprano': {
        range: [60, 81], // C4 - A5
        gender: 'female',
    },
    'mezzo': {
        range: [57, 81], // A3 - A5
        limit: [53, 84], // F3 - C6
        gender: 'female',
    },
    'alto': {
        range: [53, 74], // F3 - D5
        limit: [50, 77], // D3 - F5
        gender: 'female',
    },
    'tenor': {
        range: [47, 67], // B2 - G4
        limit: [45, 72], // A2 - C5
        gender: 'male',
    },
    'baritone': {
        range: [43, 64], // G2 - E4
        limit: [41, 65], // F2 - F4
        gender: 'male',
    },
    'bass': {
        range: [40, 60], // E2 - C4
        limit: [36, 67], // C2 - E4
        gender: 'male',
    }
};
