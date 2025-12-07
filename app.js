// SwipeCode - Morse Code Gesture Input App
// Swipe Up = Dot (.)
// Swipe Down = Dash (-)

class SwipeCodeApp {
    constructor() {
        // State
        this.currentSequence = '';  // Current morse sequence being built
        this.message = '';          // Full message
        this.isGesturing = false;
        this.startY = 0;
        this.startX = 0;
        this.lastGestureTime = 0;

        // Timing settings (ms)
        this.letterTimeout = 1500;   // Time to auto-commit a letter
        this.letterTimer = null;

        // Gesture settings
        this.minSwipeDistance = 50;  // Minimum pixels to register a swipe

        // DOM elements
        this.gestureArea = document.getElementById('gestureArea');
        this.swipeIndicator = document.getElementById('swipeIndicator');
        this.morseSequenceEl = document.getElementById('morseSequence');
        this.currentLetterEl = document.getElementById('currentLetter');
        this.messageEl = document.getElementById('message');

        // Buttons
        this.spaceBtn = document.getElementById('spaceBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.init();
    }

    init() {
        // Touch events
        this.gestureArea.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        this.gestureArea.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        this.gestureArea.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });

        // Mouse events (for desktop testing)
        this.gestureArea.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.gestureArea.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.gestureArea.addEventListener('mouseup', (e) => this.onMouseUp(e));

        // Button events
        this.spaceBtn.addEventListener('click', () => this.addSpace());
        this.spaceBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.addSpace(); });

        this.deleteBtn.addEventListener('click', () => this.deleteLast());
        this.deleteBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.deleteLast(); });

        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.clearBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.clearAll(); });

        // Keyboard support (for testing)
        document.addEventListener('keydown', (e) => this.onKeyDown(e));

        this.updateDisplay();
        console.log('SwipeCode initialized! Swipe up for dot, down for dash.');
    }

    // Touch handlers
    onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.startGesture(touch.clientX, touch.clientY);
    }

    onTouchMove(e) {
        e.preventDefault();
        if (!this.isGesturing) return;
        const touch = e.touches[0];
        this.updateGesture(touch.clientX, touch.clientY);
    }

    onTouchEnd(e) {
        e.preventDefault();
        if (!this.isGesturing) return;
        const touch = e.changedTouches[0];
        this.endGesture(touch.clientX, touch.clientY);
    }

    // Mouse handlers
    onMouseDown(e) {
        this.startGesture(e.clientX, e.clientY);
    }

    onMouseMove(e) {
        if (!this.isGesturing) return;
        this.updateGesture(e.clientX, e.clientY);
    }

    onMouseUp(e) {
        if (!this.isGesturing) return;
        this.endGesture(e.clientX, e.clientY);
    }

    // Keyboard handler (for testing)
    onKeyDown(e) {
        if (e.key === 'ArrowUp' || e.key === 'w') {
            this.addDot();
        } else if (e.key === 'ArrowDown' || e.key === 's') {
            this.addDash();
        } else if (e.key === ' ') {
            e.preventDefault();
            this.addSpace();
        } else if (e.key === 'Backspace') {
            this.deleteLast();
        } else if (e.key === 'Enter') {
            this.commitLetter();
        } else if (e.key === 'Escape') {
            this.clearSequence();
        }
    }

    // Gesture handling
    startGesture(x, y) {
        this.isGesturing = true;
        this.startX = x;
        this.startY = y;
        this.clearLetterTimer();
    }

    updateGesture(x, y) {
        // Could add visual trail here
    }

    endGesture(x, y) {
        this.isGesturing = false;
        const deltaY = y - this.startY;
        const deltaX = x - this.startX;

        // Check if vertical movement is dominant
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) >= this.minSwipeDistance) {
            if (deltaY < 0) {
                // Swipe UP = DOT
                this.addDot();
            } else {
                // Swipe DOWN = DASH
                this.addDash();
            }
        }
    }

    // Morse input
    addDot() {
        this.currentSequence += '.';
        this.showIndicator('dot');
        this.updateDisplay();
        this.startLetterTimer();
        this.lastGestureTime = Date.now();
    }

    addDash() {
        this.currentSequence += '-';
        this.showIndicator('dash');
        this.updateDisplay();
        this.startLetterTimer();
        this.lastGestureTime = Date.now();
    }

    // Letter timing
    startLetterTimer() {
        this.clearLetterTimer();
        this.letterTimer = setTimeout(() => {
            if (this.currentSequence) {
                this.commitLetter();
            }
        }, this.letterTimeout);
    }

    clearLetterTimer() {
        if (this.letterTimer) {
            clearTimeout(this.letterTimer);
            this.letterTimer = null;
        }
    }

    // Commit current sequence as a letter
    commitLetter() {
        this.clearLetterTimer();
        if (!this.currentSequence) return;

        const letter = getExactMatch(this.currentSequence);
        if (letter) {
            this.message += letter;
            this.currentLetterEl.classList.add('letter-committed');
            setTimeout(() => this.currentLetterEl.classList.remove('letter-committed'), 300);
        } else {
            // Invalid sequence - show error feedback
            this.showError();
        }

        this.currentSequence = '';
        this.updateDisplay();
    }

    // Actions
    addSpace() {
        if (this.currentSequence) {
            this.commitLetter();
        }
        this.message += ' ';
        this.updateDisplay();
    }

    deleteLast() {
        if (this.currentSequence) {
            this.currentSequence = this.currentSequence.slice(0, -1);
        } else if (this.message) {
            this.message = this.message.slice(0, -1);
        }
        this.updateDisplay();
    }

    clearSequence() {
        this.currentSequence = '';
        this.clearLetterTimer();
        this.updateDisplay();
    }

    clearAll() {
        this.currentSequence = '';
        this.message = '';
        this.clearLetterTimer();
        this.updateDisplay();
    }

    // Visual feedback
    showIndicator(type) {
        this.swipeIndicator.className = 'swipe-indicator ' + type;
        setTimeout(() => {
            this.swipeIndicator.className = 'swipe-indicator';
        }, 300);
    }

    showError() {
        this.currentLetterEl.style.color = 'rgba(239, 68, 68, 0.8)';
        setTimeout(() => {
            this.currentLetterEl.style.color = '';
        }, 300);
    }

    // Update display
    updateDisplay() {
        // Update morse sequence display
        const displaySequence = this.currentSequence
            .replace(/\./g, '•')
            .replace(/-/g, '―');
        this.morseSequenceEl.textContent = displaySequence;

        // Update current letter preview
        const exactMatch = getExactMatch(this.currentSequence);
        const possibleMatches = findPossibleMatches(this.currentSequence);

        if (exactMatch) {
            this.currentLetterEl.textContent = exactMatch;
            this.currentLetterEl.classList.add('matched');
        } else if (possibleMatches.length > 0) {
            // Show first possible match as hint
            this.currentLetterEl.textContent = possibleMatches[0].letter;
            this.currentLetterEl.classList.remove('matched');
        } else if (this.currentSequence) {
            this.currentLetterEl.textContent = '?';
            this.currentLetterEl.classList.remove('matched');
        } else {
            this.currentLetterEl.textContent = '_';
            this.currentLetterEl.classList.remove('matched');
        }

        // Update message display
        this.messageEl.textContent = this.message || 'Start swiping...';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SwipeCodeApp();
});
