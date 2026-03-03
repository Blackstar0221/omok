class OmokGame {
    constructor() {
        this.board = this.initBoard();
        this.ai = new OmokAI('medium');
        this.gameOver = false;
        this.currentTurn = 'player';
        this.init();
    }

    init() {
        this.renderBoard();
        this.attachEventListeners();
        this.updateStatus('Your Turn (Black)');
    }

    initBoard() {
        return Array(15).fill(null).map(() => Array(15).fill(null));
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                if (this.board[row][col] === 'player') {
                    cell.textContent = '●';
                    cell.classList.add('player');
                } else if (this.board[row][col] === 'ai') {
                    cell.textContent = '○';
                    cell.classList.add('ai');
                }

                cell.addEventListener('click', () => this.playerMove(row, col));
                boardElement.appendChild(cell);
            }
        }
    }

    attachEventListeners() {
        document.getElementById('newGameBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.ai.setDifficulty(e.target.value);
        });
    }

    updateStatus(message) {
        document.getElementById('gameStatus').textContent = message;
    }

    playerMove(row, col) {
        if (this.gameOver || this.board[row][col] !== null || this.currentTurn !== 'player') {
            return;
        }

        this.board[row][col] = 'player';
        this.renderBoard();

        if (this.ai.checkWin(this.board, { row, col }, 'player')) {
            this.endGame('🎉 You Win! Congratulations!');
            return;
        }

        this.currentTurn = 'ai';
        this.updateStatus('AI is thinking...');
        
        setTimeout(() => this.aiMove(), 500);
    }

    aiMove() {
        const move = this.ai.getBestMove(this.board);

        if (!move) {
            this.endGame('Draw! Board is full.');
            return;
        }

        this.board[move.row][move.col] = 'ai';
        this.renderBoard();

        if (this.ai.checkWin(this.board, move, 'ai')) {
            this.endGame('💀 AI Wins! Better luck next time.');
            return;
        }

        this.currentTurn = 'player';
        this.updateStatus('Your Turn (Black)');
    }

    endGame(message) {
        this.gameOver = true;
        const resultElement = document.getElementById('gameResult');
        document.getElementById('resultText').textContent = message;
        resultElement.style.display = 'block';
    }

    resetGame() {
        this.board = this.initBoard();
        this.gameOver = false;
