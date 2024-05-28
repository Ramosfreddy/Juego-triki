// script.js
document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('[data-cell]');
    const gameBoard = document.getElementById('game-board');
    const statusDisplay = document.getElementById('game-status');
    const restartButton = document.getElementById('restart-btn');
    const playerVsPlayerButton = document.getElementById('player-vs-player');
    const playerVsAiButton = document.getElementById('player-vs-ai');
    const mostWinsDisplay = document.getElementById('most-wins');
    const mostLossesDisplay = document.getElementById('most-losses');
    const closedGamesDisplay = document.getElementById('closed-games');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let isVsAI = false;
    
    const players = {
        X: { wins: 0, losses: 0 },
        O: { wins: 0, losses: 0 },
    };
    let closedGames = 0;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerText = `Jugador ${currentPlayer} gana!`;
            isGameActive = false;
            updateScores(currentPlayer);
            return;
        }

        if (!board.includes('')) {
            statusDisplay.innerText = 'Empate!';
            closedGames++;
            updateClosedGamesDisplay();
            isGameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

        if (board[clickedCellIndex] !== '' || !isGameActive) {
            return;
        }

        board[clickedCellIndex] = currentPlayer;
        clickedCell.innerText = currentPlayer;
        handleResultValidation();

        if (isVsAI && currentPlayer === 'X' && isGameActive) {
            handleAIMove();
        }
    }

    function handleAIMove() {
        let availableCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        board[randomIndex] = currentPlayer;
        cells[randomIndex].innerText = currentPlayer;
        handleResultValidation();
    }

    function updateScores(winner) {
        players[winner].wins++;
        players[winner === 'X' ? 'O' : 'X'].losses++;
        updateScoreDisplays();
    }

    function updateScoreDisplays() {
        mostWinsDisplay.innerText = `Jugador con más victorias: ${players.X.wins >= players.O.wins ? 'Daniel' : 'Camilo'}`;
        mostLossesDisplay.innerText = `Jugador con más derrotas: ${players.X.losses >= players.O.losses ? 'Daniel' : 'Camilo'}`;
    }

    function updateClosedGamesDisplay() {
        closedGamesDisplay.innerText = `Juegos empatados: ${closedGames}`;
    }

    function handleRestartGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        statusDisplay.innerText = '';
        cells.forEach(cell => cell.innerText = '');
        currentPlayer = 'X';
    }

    function startPlayerVsPlayer() {
        isVsAI = false;
        handleRestartGame();
    }

    function startPlayerVsAI() {
        isVsAI = true;
        handleRestartGame();
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', handleRestartGame);
    playerVsPlayerButton.addEventListener('click', startPlayerVsPlayer);
    playerVsAiButton.addEventListener('click', startPlayerVsAI);
});