class SlidePuzzle {
    constructor() {
        this.rows = 3;
        this.cols = 3;
        this.tiles = [];
        this.emptyIndex = 8; // Last tile is empty
        this.moves = 0;
        this.timer = null;
        this.startTime = 0;
        this.isPaused = false;

        this.board = document.getElementById("puzzle-board");
        this.movesDisplay = document.getElementById("moves");
        this.timerDisplay = document.getElementById("timer");

        // Background music and tile swap sound
        this.bgMusic = document.getElementById("bgMusic");
        this.swapSound = document.getElementById("swapSound");

        // Start playing the background music
        this.bgMusic.play();

        document.getElementById("btnShuffle").addEventListener("click", () => this.shuffle());
        document.getElementById("btnPause").addEventListener("click", () => this.pauseOrResume());

        this.initialize();
    }

    initialize() {
        this.tiles = ["1", "2", "null", "4", "5", "6", "7", "8", "9"];
        this.renderBoard();
        this.shuffle();
    }

    renderBoard() {
        this.board.innerHTML = "";
        this.tiles.forEach((tile, index) => {
            let div = document.createElement("div");
            div.classList.add("tile");
            div.dataset.index = index;

            if (tile !== "null") {
                div.style.backgroundImage = `url(${tile}.jpg)`;
                div.addEventListener("click", () => this.moveTile(index));
            } else {
                div.classList.add("empty");
            }

            this.board.appendChild(div);
        });
    }

    shuffle() {
        do {
            this.tiles.sort(() => Math.random() - 0.5);
        } while (!this.isSolvable() || this.checkWin());

        this.emptyIndex = this.tiles.indexOf("null");
        this.moves = 0;
        this.movesDisplay.innerText = "Moves Made: 0";
        this.resetTimer();
        this.renderBoard();
    }

    moveTile(index) {
        if (this.isPaused) return;

        let [r, c] = this.getCoords(index);
        let [er, ec] = this.getCoords(this.emptyIndex);

        if (Math.abs(r - er) + Math.abs(c - ec) === 1) {
            this.tiles[this.emptyIndex] = this.tiles[index];
            this.tiles[index] = "null";
            this.emptyIndex = index;

            this.moves++;
            this.movesDisplay.innerText = `Moves Made: ${this.moves}`;

            // Play tile swap sound
            this.swapSound.play();

            if (this.moves === 1) this.startTimer();
            this.renderBoard();

            if (this.checkWin()) this.showWinMessage();
        }
    }

    checkWin() {
        return this.tiles.join() === ["1", "2", "null", "4", "5", "6", "7", "8", "9"].join();
    }

    showWinMessage() {
        clearInterval(this.timer);
        alert(`Congratulations! 🎉\nTime Elapsed: ${this.getElapsedTime()}\nTotal Moves: ${this.moves}`);
        this.shuffle();
    }

    getCoords(index) {
        return [Math.floor(index / this.cols), index % this.cols];
    }

    isSolvable() {
        let inversions = 0;
        let arr = this.tiles.filter(t => t !== "null");

        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] > arr[j]) inversions++;
            }
        }

        return inversions % 2 === 0;
    }

    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        this.timerDisplay.innerText = `Time Elapsed: ${this.getElapsedTime()}`;
    }

    getElapsedTime() {
        let elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        let minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
        let seconds = String(elapsed % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    resetTimer() {
        clearInterval(this.timer);
        this.timerDisplay.innerText = "Time Elapsed: 00:00";
    }

    pauseOrResume() {
        if (!this.timer) return;

        this.isPaused = !this.isPaused;
        document.getElementById("btnPause").innerText = this.isPaused ? "Resume" : "Pause";

        if (this.isPaused) {
            clearInterval(this.timer);
        } else {
            this.startTime = Date.now() - this.getElapsedTime() * 1000;
            this.timer = setInterval(() => this.updateTimer(), 1000);
        }
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0; // Reset to the start of the song
    }
}

document.addEventListener("DOMContentLoaded", () => new SlidePuzzle());
