

export function freqToMidi(freq) {
    return Math.round(69 + 12 * Math.log2(freq / 440));
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
