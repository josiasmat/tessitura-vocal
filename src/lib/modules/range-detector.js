import { get } from "svelte/store";
import { startPitchDetection, stopPitchDetection } from "./mic.js";
import { freqToMidi } from "./notes";

const CLARITY_TRESHOLD = 0.95;
const MIN_PITCH = 36; // C2
const MAX_PITCH = 88; // E6


// Public API

export const RangeDetector = {

    min_pitch: MIN_PITCH,
    max_pitch: MAX_PITCH,

    currentPitchCallback: null,
    lowPitchCallback: null,
    highPitchCallback: null,

    start() 
    {
        clearCurrentPitchTimeout.clear();
        let previousPitch = null;

        startPitchDetection((result) => {
            const pitch = freqToMidi(result.freq);
            if ( result.clarity >= CLARITY_TRESHOLD 
                    && pitch >= MIN_PITCH && pitch <= MAX_PITCH) {
                
                // Stable pitch detected
                if ( pitch === previousPitch ) {
                    clearCurrentPitchTimeout.clear();
                    this.currentPitch = pitch;;
                    this.lowPitch = pitch;
                    this.highPitch = pitch;
                }
                previousPitch = pitch;

            } else {
				clearCurrentPitchTimeout.set();
			}
        });
    },

    stop() 
    {
        stopPitchDetection();
        clearCurrentPitchTimeout.clear();
    },

    get lowPitch() {
        return pitches.low;
    },

    get highPitch() {
        return pitches.high;
    },

    get currentPitch() {
        return pitches.current;
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

    set currentPitch(pitch) {
        pitches.current = pitch;
        this.currentPitchCallback?.(pitch);
    },

    resetLowPitch() {
        pitches.low = null;
        this.lowPitchCallback?.(null);
    },

    resetHighPitch() {
        pitches.high = null;
        this.highPitchCallback?.(null);
    },

    resetCurrentPitch() {
        pitches.current = null;
        this.currentPitchCallback?.(null);
    },

    resetPitches() {
        this.resetCurrentPitch();
        this.resetLowPitch();
        this.resetHighPitch();
    },

    resetMinMax() {
        this.min_pitch = MIN_PITCH;
        this.max_pitch = MAX_PITCH;
    },

}


// Internal 

const pitches = {
    current: null,
    low: null,
    high: null
}

const clearCurrentPitchTimeout = {

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
                RangeDetector.resetCurrentPitch();
            }, interval);
    }

}
