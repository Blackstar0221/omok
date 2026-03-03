class OmokAI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    getBestMove(board) {
        const emptyMoves = this.getEmptyMoves(board);
        
        if (emptyMoves.length === 0) return null;

        if (this.difficulty === 'easy') {
            return this.getEasyMove(board, emptyMoves);
        }
        
        const scoredMoves = emptyMoves.map(move => ({
            move: move,
            score: this.evaluateMove(board, move)
        }));

        scoredMoves.sort((a, b) => b.score - a.score);

        if (this.difficulty === 'medium') {
            return scoredMoves[0].move;
        } else {
            return this.getHardMove(board, scoredMoves);
        }
    }

    getEasyMove(board, emptyMoves) {
        for (let move of emptyMoves) {
            if (this.checkWin(board, move, 'ai')) {
                return move;
            }
        }
        
        for (let move of emptyMoves) {
            if (this.checkWin(board, move, 'player')) {
                return move;
            }
        }
        
        return emptyMoves[Math.floor(Math.random() * emptyMoves.length)];
    }

    getHardMove(board, scoredMoves) {
        let bestMove = scoredMoves[0].move;
        let bestOutcome = -Infinity;

        for (let i = 0; i < Math.min(3, scoredMoves.length); i++) {
            const move = scoredMoves[i].move;
            const boardCopy = this.copyBoard(board);
            boardCopy[move.row][move.col] = 'ai';

            const playerWinMoves = this.getEmptyMoves(boardCopy).filter(m => 
                this.checkWin(boardCopy, m, 'player')
            );

            let outcome = scoredMoves[i].score;
            if (playerWinMoves.length > 0) {
                outcome -= 50;
            }

            if (outcome > bestOutcome) {
                bestOutcome = outcome;
                bestMove = move;
            }
        }

        return bestMove;
    }

    evaluateMove(board, move) {
        let score = 0;

        if (this.checkWin(board, move, 'ai')) {
            return 1000;
        }

        if (this.checkWin(board, move, 'player')) {
            score += 500;
        }

        score += this.countLine(board, move, 'ai', 2) * 50;
        score += this.countLine(board, move, 'ai', 3) * 200;
        score += this.countLine(board, move, 'ai', 4) * 500;

        score += this.countLine(board, move, 'player', 3) * 100;
        score += this.countLine(board, move, 'player', 4) * 300;

        return score;
    }

    checkWin(board, move, player) {
        const symbol = player === 'ai' ? 'ai' : 'player';
        const directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [1, -1]
        ];

        for (let [dx, dy] of directions) {
            let count = 1;

            for (let i = 1; i < 5; i++) {
                const newRow = move.row + dx * i;
                const newCol = move.col + dy * i;
                if (this.isValid(newRow, newCol) && board[newRow][newCol] === symbol) {
                    count++;
                } else {
                    break;
                }
            }

            for (let i = 1; i < 5; i++) {
                const newRow = move.row - dx * i;
                const newCol = move.col - dy * i;
                if (this.isValid(newRow, newCol) && board[newRow][newCol] === symbol) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) return true;
        }

        return false;
    }

    countLine(board, move, player, length) {
        const symbol = player === 'ai' ? 'ai' : 'player';
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        let count = 0;

        for (let [dx, dy] of directions) {
            let consecutive = 1;

            for (let i = 1; i < length; i++) {
                const newRow = move.row + dx * i;
                const newCol = move.col + dy * i;
                if (this.isValid(newRow, newCol) && board[newRow][newCol] === symbol) {
                    consecutive++;
                } else {
                    break;
                }
            }

            for (let i = 1; i < length; i++) {
                const newRow = move.row - dx * i;
                const newCol = move.col - dy * i;
                if (this.isValid(newRow, newCol) && board[newRow][newCol] === symbol) {
                    consecutive++;
                } else {
                    break;
                }
            }

            if (consecutive >= length) count++;
        }

        return count;
    }

    getEmptyMoves(board) {
        const moves = [];
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (board[row][col] === null) {
                    moves.push({ row, col });
                }
            }
        }
        return moves;
    }

    isValid(row, col) {
        return row >= 0 && row < 15 && col >= 0 && col < 15;
    }

    copyBoard(board) {
        return board.map(row => [...row]);
    }
}
