// scoreView.js
import {
    Renderer,
    Stave,
    StaveNote,
    ClefNote,
    Voice,
    Formatter,
    Accidental,
    StaveConnector,
    BarlineType,
} from "vexflow";

import SvgTools from "./svgtools";

let container;
let renderer;
let context;
let trebleStave;
let bassStave;
let width = 150;
let height = 202;
let left = 6;
let top = 0;

/**
 * Decodes MIDI note number into letter, octave, and accidental.
 * Assumes sharps for accidentals.
 * @param {number} pitch
 */
function decodePitch(pitch) {
    const letterArray = ["c","c","d","d","e","f","f","g","g","a","a","b"];
    const pc = pitch % 12;
    const letter = letterArray[pc];
    const sharp = [1,3,6,8,10].includes(pc);
    const octave = Math.floor(pitch / 12) - 1;
    return { letter, octave, sharp };
}


/**
 * Decide whether a pitch should be drawn on treble or bass staff.
 * Middle C (MIDI 60) is drawn on treble by default.
 */
function chooseStaff(pitch) {
    return pitch >= 60 ? "treble" : "bass";
}

/**
 * Create a stemless whole-note StaveNote for a given MIDI pitch.
 * @param {number} pitch
 * @param {string} clef "treble" or "bass"
 * @returns {StaveNote}
 */
function createNote(pitch, clef) {
    const key = decodePitch(pitch);
    const note = new StaveNote({
        clef,
        keys: [`${key.letter}/${key.octave}`],
        duration: "w",
    });
    if ( key.sharp )
        note.addModifier(new Accidental("#"), 0);
    return note;
}


/**
 * Initializes the score view inside the given div element.
 */
export function createScoreView(divElement) {
    container = divElement;

    // Clear container
    container.innerHTML = "";

    renderer = new Renderer(divElement, Renderer.Backends.SVG);
    renderer.resize(width, height);
    context = renderer.getContext();

    // Create staves
    trebleStave = new Stave(left, top, width - left)
        .addClef("treble")
        .setEndBarType(BarlineType.NONE);
    bassStave = new Stave(left, top + 80, width - left)
        .addClef("bass")
        .setEndBarType(BarlineType.NONE);
}

/**
 * Updates the score view with new pitches.
 * Each argument is a MIDI note number or null.
 */
export function updateScoreView(lowPitch, highPitch) {
    if (!context) return;

    // Clear previous notes by re-rendering staves
    context.clear();
    trebleStave.setContext(context).draw();
    bassStave.setContext(context).draw();

    new StaveConnector(trebleStave, bassStave)
        .setType(StaveConnector.type.BRACKET)
        .setContext(context)
        .draw();

    new StaveConnector(trebleStave, bassStave)
        .setType(StaveConnector.type.SINGLE_LEFT)
        .setContext(context)
        .draw();

    const drawNote = (pitch, offset) => {
        const staff = chooseStaff(pitch);
        const note = createNote(pitch, staff);
        const voice = new Voice({ num_beats: 1, beat_value: 1 })
            .addTickables([note]);
        new Formatter()
            .joinVoices([voice])
            .format([voice], width - left)
            .getTickContext(0)
            .setXOffset(offset);
        voice.draw(context, (staff === "treble") ? trebleStave : bassStave);
        return note;
    }

    const center = (width-left)/2 - 40;
    const lowNote = drawNote(lowPitch, center - 10 - (decodePitch(lowPitch).sharp ? 15 : 0));
    const highNote = drawNote(highPitch, center + 10 + (decodePitch(highPitch).sharp ? 0 : 15));

    /** @param {StaveNote} note @param {number} offset */
    const getNoteAbsolutePosition = (note, offset) => {
        const left = note.getNoteHeadBeginX();
        const right = note.getNoteHeadEndX();
        const x = (right-left) / 2 + left + (offset / 2);
        const y = note.getYs()[0] - offset;
        return [x, y];
    }

    const [x1,y1] = getNoteAbsolutePosition(lowNote, +10);
    const [x2,y2] = getNoteAbsolutePosition(highNote, -10);

    const svg = context.svg;
    const line = SvgTools.makeLine(x1,y1,x2,y2, { stroke: "#000", "stroke-width": 1.5 });

    svg.appendChild(line);

}
