const A4_FREQ = 440;
const A4_MIDI = 69;


export function freqToMidi(freq) {
    return Math.round(A4_MIDI + 12 * Math.log2(freq / A4_FREQ));
}


export function midiToFreq(n) {
    return A4_FREQ * Math.pow(2, (n - A4_MIDI) / 12);
}


export function midiToNoteName(n) {
    const noteNames = ['Dó', 'Dó♯', 'Ré', 'Ré♯', 'Mi', 'Fá', 'Fá♯', 'Sol', 'Sol♯', 'Lá', 'Lá♯', 'Si'];
    let octave = Math.floor(n / 12) - 2;
    if ( octave <= 0 ) octave -= 1;
    const noteIndex = n % 12;
    return `${noteNames[noteIndex]}${octave}`;
}


export function freqToNoteName(freq) {
    const midiNumber = freqToMidi(freq);
    return midiToNoteName(midiNumber);
}
