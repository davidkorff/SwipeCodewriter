// Morse Code Dictionary
// Dot (.) = Swipe Up
// Dash (-) = Swipe Down

const MORSE_CODE = {
    // Letters
    '.-': 'A',
    '-...': 'B',
    '-.-.': 'C',
    '-..': 'D',
    '.': 'E',
    '..-.': 'F',
    '--.': 'G',
    '....': 'H',
    '..': 'I',
    '.---': 'J',
    '-.-': 'K',
    '.-..': 'L',
    '--': 'M',
    '-.': 'N',
    '---': 'O',
    '.--.': 'P',
    '--.-': 'Q',
    '.-.': 'R',
    '...': 'S',
    '-': 'T',
    '..-': 'U',
    '...-': 'V',
    '.--': 'W',
    '-..-': 'X',
    '-.--': 'Y',
    '--..': 'Z',

    // Numbers
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9',
    '-----': '0',

    // Punctuation
    '.-.-.-': '.',
    '--..--': ',',
    '..--..': '?',
    '.----.': "'",
    '-.-.--': '!',
    '-..-.': '/',
    '-.--.': '(',
    '-.--.-': ')',
    '.-...': '&',
    '---...': ':',
    '-.-.-.': ';',
    '-...-': '=',
    '.-.-.': '+',
    '-....-': '-',
    '..--.-': '_',
    '.-..-.': '"',
    '...-..-': '$',
    '.--.-.': '@'
};

// Reverse mapping (letter to morse)
const LETTER_TO_MORSE = {};
for (const [morse, letter] of Object.entries(MORSE_CODE)) {
    LETTER_TO_MORSE[letter] = morse;
}

// Find possible matches for current sequence
function findPossibleMatches(sequence) {
    const matches = [];
    for (const [morse, letter] of Object.entries(MORSE_CODE)) {
        if (morse.startsWith(sequence)) {
            matches.push({ morse, letter, remaining: morse.length - sequence.length });
        }
    }
    return matches;
}

// Get exact match for sequence
function getExactMatch(sequence) {
    return MORSE_CODE[sequence] || null;
}

// Check if sequence could lead to a valid letter
function isValidPrefix(sequence) {
    for (const morse of Object.keys(MORSE_CODE)) {
        if (morse.startsWith(sequence)) {
            return true;
        }
    }
    return false;
}
