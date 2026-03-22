// ─── Spelling Snake ───────────────────────────────────────────────────────────

class SpellingSnake {
    constructor() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 20;
        this.cols = this.canvas.width / this.cellSize;   // 20
        this.rows = this.canvas.height / this.cellSize;  // 20

        this.words = ['CAT', 'DOG', 'SUN', 'HAT', 'RUN', 'FUN', 'HOT', 'BIG', 'CUP', 'RED',
                      'PIG', 'BEE', 'ANT', 'FOX', 'OWL', 'COW', 'HEN', 'MAP', 'JAM', 'LOG'];
        this.wordIndex = 0;
        this.letterIndex = 0;
        this.score = 0;
        this.snake = [];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = null;
        this.gameActive = false;
        this.gameLoop = null;

        this.statusEl = document.getElementById('snake-status');
        this.targetWordEl = document.getElementById('target-word');
        this.progressEl = document.getElementById('spell-progress');
        this.startBtn = document.getElementById('snake-start');

        this.startBtn.addEventListener('click', () => this.start());

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
            this.handleKey(e.key);
        });

        // On-screen buttons
        document.getElementById('snake-up').addEventListener('click', () => this.handleKey('ArrowUp'));
        document.getElementById('snake-down').addEventListener('click', () => this.handleKey('ArrowDown'));
        document.getElementById('snake-left').addEventListener('click', () => this.handleKey('ArrowLeft'));
        document.getElementById('snake-right').addEventListener('click', () => this.handleKey('ArrowRight'));

        this.drawIdle();
    }

    start() {
        // Shuffle words
        for (let i = this.words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
        this.wordIndex = 0;
        this.letterIndex = 0;
        this.score = 0;
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.snake = [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }];
        this.gameActive = true;
        this.startBtn.style.display = 'none';
        this.updateWordDisplay();
        this.placeFood();
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.tick(), 250);
    }

    handleKey(key) {
        if (!this.gameActive) return;
        const dirs = {
            ArrowUp:    { x: 0,  y: -1 },
            ArrowDown:  { x: 0,  y:  1 },
            ArrowLeft:  { x: -1, y:  0 },
            ArrowRight: { x: 1,  y:  0 },
        };
        const d = dirs[key];
        if (d && !(d.x === -this.direction.x && d.y === -this.direction.y)) {
            this.nextDirection = d;
        }
    }

    placeFood() {
        const letter = this.words[this.wordIndex][this.letterIndex];
        let pos;
        do {
            pos = { x: Math.floor(Math.random() * this.cols), y: Math.floor(Math.random() * this.rows) };
        } while (this.snake.some(s => s.x === pos.x && s.y === pos.y));
        this.food = { ...pos, letter };
    }

    updateWordDisplay() {
        const word = this.words[this.wordIndex];
        this.targetWordEl.textContent = word;
        this.progressEl.textContent = word.slice(0, this.letterIndex) + '_ '.repeat(word.length - this.letterIndex).trim();
    }

    tick() {
        this.direction = this.nextDirection;
        const head = this.snake[0];
        const newHead = { x: head.x + this.direction.x, y: head.y + this.direction.y };

        if (newHead.x < 0 || newHead.x >= this.cols || newHead.y < 0 || newHead.y >= this.rows) {
            return this.gameOver();
        }
        if (this.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
            return this.gameOver();
        }

        this.snake.unshift(newHead);

        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.letterIndex++;
            const word = this.words[this.wordIndex];
            if (this.letterIndex === word.length) {
                this.score++;
                this.statusEl.textContent = `🎉 "${word}" spelt! Score: ${this.score}`;
                this.wordIndex = (this.wordIndex + 1) % this.words.length;
                this.letterIndex = 0;
                clearInterval(this.gameLoop);
                const speed = Math.max(150, 250 - this.score * 8);
                this.gameLoop = setInterval(() => this.tick(), speed);
            } else {
                this.statusEl.textContent = `Nice! Now find the next letter...`;
            }
            this.updateWordDisplay();
            this.placeFood();
            // snake grows — don't remove tail
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    gameOver() {
        this.gameActive = false;
        clearInterval(this.gameLoop);
        this.statusEl.textContent = `Game Over! You spelt ${this.score} word${this.score !== 1 ? 's' : ''}! 😢`;
        this.startBtn.textContent = 'Play Again';
        this.startBtn.style.display = 'inline-block';
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const cs = this.cellSize;

        // Background
        ctx.fillStyle = '#1a472a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid lines
        ctx.strokeStyle = '#155228';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.cols; i++) {
            ctx.beginPath(); ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, this.canvas.height); ctx.stroke();
        }
        for (let j = 0; j <= this.rows; j++) {
            ctx.beginPath(); ctx.moveTo(0, j * cs); ctx.lineTo(this.canvas.width, j * cs); ctx.stroke();
        }

        // Snake
        this.snake.forEach((seg, i) => {
            ctx.fillStyle = i === 0 ? '#ff8c00' : '#ffa500';
            ctx.beginPath();
            ctx.roundRect(seg.x * cs + 1, seg.y * cs + 1, cs - 2, cs - 2, 4);
            ctx.fill();
            if (i === 0) {
                // Eyes
                ctx.fillStyle = '#000';
                const ex = seg.x * cs + (this.direction.x >= 0 ? cs - 5 : 4);
                ctx.beginPath(); ctx.arc(ex, seg.y * cs + 5, 2, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(ex, seg.y * cs + cs - 5, 2, 0, Math.PI * 2); ctx.fill();
            }
        });

        // Food letter
        if (this.food) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.food.x * cs + cs / 2, this.food.y * cs + cs / 2, cs / 2 - 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#e65c00';
            ctx.font = `bold ${cs - 4}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.food.letter, this.food.x * cs + cs / 2, this.food.y * cs + cs / 2);
        }
    }

    drawIdle() {
        const ctx = this.ctx;
        ctx.fillStyle = '#1a472a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = '#ffa500';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐍 Press Start to Play!', this.canvas.width / 2, this.canvas.height / 2);
    }
}

// ─── Memory Match ─────────────────────────────────────────────────────────────

class MemoryGame {
    constructor() {
        // AI-designed cards: each pair has an emoji face + a label
        this.pairs = [
            { emoji: '🦁', label: 'Lion'    },
            { emoji: '🐯', label: 'Tiger'   },
            { emoji: '🐻', label: 'Bear'    },
            { emoji: '🐼', label: 'Panda'   },
            { emoji: '🦊', label: 'Fox'     },
            { emoji: '🐸', label: 'Frog'    },
            { emoji: '🐙', label: 'Octopus' },
            { emoji: '🦋', label: 'Butterfly'},
        ];

        this.flipped = [];
        this.matched = 0;
        this.moves = 0;
        this.locked = false;
        this.active = false;

        this.grid = document.getElementById('memory-grid');
        this.statusEl = document.getElementById('memory-status');
        this.scoreEl = document.getElementById('memory-score');
        this.startBtn = document.getElementById('memory-start');

        this.startBtn.addEventListener('click', () => this.start());
    }

    start() {
        this.matched = 0;
        this.moves = 0;
        this.flipped = [];
        this.locked = false;
        this.active = true;
        this.startBtn.style.display = 'none';
        this.statusEl.textContent = 'Find all the matching pairs!';
        this.updateScore();
        this.buildGrid();
    }

    buildGrid() {
        const deck = [...this.pairs, ...this.pairs];
        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        this.grid.innerHTML = '';
        deck.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.label = item.label;
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">
                        <span class="card-emoji">${item.emoji}</span>
                        <span class="card-label">${item.label}</span>
                    </div>
                </div>`;
            card.addEventListener('click', () => this.flip(card));
            this.grid.appendChild(card);
        });
    }

    flip(card) {
        if (this.locked || !this.active) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        card.classList.add('flipped');
        this.flipped.push(card);
        if (this.flipped.length === 2) {
            this.moves++;
            this.updateScore();
            this.check();
        }
    }

    check() {
        this.locked = true;
        const [a, b] = this.flipped;
        if (a.dataset.label === b.dataset.label) {
            a.classList.add('matched');
            b.classList.add('matched');
            this.matched++;
            this.flipped = [];
            this.locked = false;
            this.updateScore();
            if (this.matched === this.pairs.length) {
                this.statusEl.textContent = `🎉 You won in ${this.moves} moves! Amazing memory!`;
                this.startBtn.textContent = 'Play Again';
                this.startBtn.style.display = 'inline-block';
                this.active = false;
            }
        } else {
            setTimeout(() => {
                a.classList.remove('flipped');
                b.classList.remove('flipped');
                this.flipped = [];
                this.locked = false;
            }, 900);
        }
    }

    updateScore() {
        this.scoreEl.textContent = `Pairs: ${this.matched}/${this.pairs.length} | Moves: ${this.moves}`;
    }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    new SpellingSnake();
    new MemoryGame();
});
