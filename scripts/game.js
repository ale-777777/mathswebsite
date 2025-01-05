class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('game-status');
        this.startButton = document.getElementById('start-game');
        this.playAgainButton = document.getElementById('play-again');
        this.playerXName = 'Player X';
        this.playerOName = 'Player O';
        
        this.setupPlayerNames();
        this.setupPlayAgain();
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        this.initializeGame();
    }

    setupPlayerNames() {
        const playerXInput = document.getElementById('playerX');
        const playerOInput = document.getElementById('playerO');
        const gameBoard = document.getElementById('board');
        const playerForm = document.getElementById('player-form');

        this.startButton.addEventListener('click', () => {
            if (this.startButton.textContent === 'Start Game') {
                this.playerXName = playerXInput.value.trim() || 'Player X';
                this.playerOName = playerOInput.value.trim() || 'Player O';
                
                playerForm.style.display = 'none';
                gameBoard.style.display = 'grid';
                this.statusDisplay.textContent = `${this.playerXName}'s turn`;
                this.startButton.textContent = 'New Game';
            } else {
                this.resetGame();
            }
        });
    }

    setupPlayAgain() {
        this.playAgainButton.addEventListener('click', () => {
            this.playAgainButton.style.display = 'none';
            this.startNewRound();
        });
    }

    startNewRound() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.cells.forEach(cell => {
            cell.textContent = '';
        });
        this.statusDisplay.textContent = `${this.playerXName}'s turn`;
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');

        if (this.board[index] === '' && this.gameActive) {
            this.board[index] = this.currentPlayer;
            cell.textContent = this.currentPlayer;
            cell.style.color = this.currentPlayer === 'X' ? '#1e7bff' : '#ff6b6b';

            if (this.checkWin()) {
                const winner = this.currentPlayer === 'X' ? this.playerXName : this.playerOName;
                this.statusDisplay.textContent = `${winner} wins! 🎉`;
                this.gameActive = false;
                this.playAgainButton.style.display = 'block';
                return;
            }

            if (this.checkDraw()) {
                this.statusDisplay.textContent = "It's a draw! 🤝";
                this.gameActive = false;
                this.playAgainButton.style.display = 'block';
                return;
            }

            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            const currentPlayerName = this.currentPlayer === 'X' ? this.playerXName : this.playerOName;
            this.statusDisplay.textContent = `${currentPlayerName}'s turn`;
        }
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Reset the game board
        this.cells.forEach(cell => {
            cell.textContent = '';
        });
        
        // Show the player form again
        document.getElementById('player-form').style.display = 'block';
        document.getElementById('board').style.display = 'none';
        document.getElementById('playerX').value = '';
        document.getElementById('playerO').value = '';
        this.statusDisplay.textContent = 'Enter player names to start!';
        this.startButton.textContent = 'Start Game';
        this.playAgainButton.style.display = 'none';
    }

    checkWin() {
        return this.winningConditions.some(condition => {
            return condition.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
}); 