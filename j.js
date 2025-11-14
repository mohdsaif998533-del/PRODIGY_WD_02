// Get all the necessary DOM elements
const cells = document.querySelectorAll('[data-cell]');
const gameStatus = document.getElementById('gameStatus');
const restartButton = document.getElementById('restartButton');


// Define player classes
const X_CLASS = 'x';
const O_CLASS = 'o';


// All possible winning combinations (indexes of the 9 cells)
const WINNING_COMBINATIONS = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal left-to-right
    [2, 4, 6]  // Diagonal right-to-left
];

let isOTurn = false; // Flag to track whose turn it is
let gameActive = true; // Flag to track if the game is over

// Start the game
startGame();

function startGame() {
    isOTurn = false; // X starts
    gameActive = true;
    
    // Reset all cells
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS); // Remove X marks
        cell.classList.remove(O_CLASS); // Remove O marks
        cell.textContent = ''; // Clear text
        // Remove old event listeners before adding new ones
        cell.removeEventListener('click', handleClick); 
        // Add a 'click' listener, but only once
        cell.addEventListener('click', handleClick, { once: true }); 
    });
    
    // Set the status message
    setGameStatus("Player X's turn");
}

// Add event listener for the restart button
restartButton.addEventListener('click', startGame);

// Function to handle a cell being clicked
function handleClick(e) {
    if (!gameActive) return; // If the game is over, do nothing

    const cell = e.target;
    const currentClass = isOTurn ? O_CLASS : X_CLASS;
    
    // 1. Place the mark (X or O)
    placeMark(cell, currentClass);

    // 2. Check for a Win
    if (checkWin(currentClass)) {
        endGame(false); // false means it's not a draw
    } 
    // 3. Check for a Draw
    else if (isDraw()) {
        endGame(true); // true means it is a draw
    } 
    // 4. Switch Turns
    else {
        swapTurns();
        setGameStatus(`Player ${isOTurn ? "O" : "X"}'s turn`);
    }
}

// Places the X or O on the board
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass === X_CLASS ? 'X' : 'O';
}

// Switches the turn
function swapTurns() {
    isOTurn = !isOTurn;
}

// Updates the status message
function setGameStatus(message) {
    gameStatus.textContent = message;
}

// Checks if the current player has won
function checkWin(currentClass) {
    // 'some' checks if any of the combinations are met
    return WINNING_COMBINATIONS.some(combination => {
        // 'every' checks if all cells in that combination have the player's mark
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

// Checks if the game is a draw (all cells filled, no winner)
function isDraw() {
    // 'every' checks if every single cell
    return [...cells].every(cell => {
        // is filled with either an X or an O
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

// Ends the game and displays the result
function endGame(isDraw) {
    gameActive = false; // Stop the game
    if (isDraw) {
        setGameStatus("It's a Draw!");
    } else {
        setGameStatus(`Player ${isOTurn ? "O" : "X"} Wins!`);
    }
}
