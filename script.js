// Data structure for words and hints
const wordList = [
    { word: "JAVASCRIPT", hint: "A scripting language for web pages" },
    { word: "PROGRAMMING", hint: "The process of writing computer code" },
    { word: "WEBSITE", hint: "A collection of related web pages" },
    { word: "DEVELOPER", hint: "A person who builds applications" },
    { word: "ALGORITHM", hint: "A set of rules to be followed in calculations" }
];

// Game State Variables
let currentWord = '';
let currentHint = '';
let guessedLetters = [];
let maxIncorrectGuesses = 6;
let incorrectGuesses = 0;

// DOM Elements
const wordDisplay = document.getElementById('word-display');
const hintSpan = document.getElementById('hint');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const messageElement = document.getElementById('message');
const guessesLeftSpan = document.getElementById('guesses-left');
const guessedLettersSpan = document.getElementById('guessed-letters');
const resetButton = document.getElementById('reset-button');

/**
 * Initializes or resets the game state.
 */
function initGame() {
    // 1. Reset state
    guessedLetters = [];
    incorrectGuesses = 0;
    messageElement.textContent = '';
    messageElement.className = 'message';
    resetButton.style.display = 'none';
    guessInput.disabled = false;
    guessButton.disabled = false;
    guessInput.value = '';
    guessInput.focus();

    // 2. Select a random word and its hint
    const randomIndex = Math.floor(Math.random() * wordList.length);
    currentWord = wordList[randomIndex].word;
    currentHint = wordList[randomIndex].hint;

    // 3. Update initial display
    hintSpan.textContent = currentHint;
    updateDisplay();
}

/**
 * Updates the word display, guessed letters list, and guesses left count.
 */
function updateDisplay() {
    let displayWord = '';
    let wordGuessed = true;

    // Create the masked word display
    for (const letter of currentWord) {
        if (guessedLetters.includes(letter)) {
            displayWord += letter;
        } else {
            displayWord += '_';
            wordGuessed = false;
        }
    }
    wordDisplay.textContent = displayWord.split('').join(' ');

    // Update stats
    guessesLeftSpan.textContent = maxIncorrectGuesses - incorrectGuesses;
    guessedLettersSpan.textContent = guessedLetters.filter(
        letter => !currentWord.includes(letter)
    ).join(', ');

    // Check for win/loss conditions
    if (wordGuessed) {
        endGame(true);
    } else if (incorrectGuesses >= maxIncorrectGuesses) {
        endGame(false);
    }
}

/**
 * Handles a player's letter guess.
 */
function handleGuess() {
    const guess = guessInput.value.toUpperCase();
    guessInput.value = ''; // Clear input field

    // Validation
    if (!/^[A-Z]$/.test(guess)) {
        showMessage("Please enter a single valid letter (A-Z).", 'warning');
        return;
    }

    if (guessedLetters.includes(guess)) {
        showMessage(`You already guessed the letter "${guess}".`, 'warning');
        return;
    }

    // Add the guess to the tracked list
    guessedLetters.push(guess);

    if (currentWord.includes(guess)) {
        showMessage(`Correct guess! The letter "${guess}" is in the word.`, 'correct');
    } else {
        incorrectGuesses++;
        showMessage(`Incorrect guess. The letter "${guess}" is not in the word.`, 'incorrect');
    }

    updateDisplay();
}

/**
 * Displays an interactive message to the user.
 * @param {string} text - The message text.
 * @param {string} type - The message type ('correct', 'incorrect', 'warning').
 */
function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
}

/**
 * Ends the game and displays the final result.
 * @param {boolean} won - True if the player won, false otherwise.
 */
function endGame(won) {
    guessInput.disabled = true;
    guessButton.disabled = true;
    resetButton.style.display = 'block';

    if (won) {
        showMessage("🎉 Congratulations! You guessed the word!", 'correct');
    } else {
        wordDisplay.textContent = currentWord.split('').join(' '); // Reveal word
        showMessage(`😔 Game Over! The word was "${currentWord}".`, 'incorrect');
    }
}

// --- Event Listeners ---

// Handle guess on button click
guessButton.addEventListener('click', handleGuess);

// Handle guess on 'Enter' key press in the input field
guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleGuess();
    }
});

// Reset button handler
resetButton.addEventListener('click', initGame);

// Start the game when the script loads
initGame();