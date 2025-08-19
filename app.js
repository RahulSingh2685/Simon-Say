let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];
let started = false;
let level = 0;
let highScore = localStorage.getItem("simonHighScore") || 0;
let h2 = document.querySelector("h2");
let startBtn = document.querySelector("#start-btn");
const highScoreElement = document.querySelector("#high-score");
highScoreElement.textContent = highScore;



startBtn.addEventListener("click", function () {
    if (!started) {
        started = true;
        levelUp();
        startBtn.classList.remove("pulse");
    }
});

document.addEventListener("keydown", function (event) {
    if (!started && event.key === "Enter") {
        started = true;
        levelUp();
        startBtn.classList.remove("pulse");
    }
});

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(() => btn.classList.remove("flash"), 300);
    
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(() => btn.classList.remove("userflash"), 300);
    
}

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;
    
    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    
    setTimeout(() => gameFlash(randBtn), Math.max(500 - (level * 25), 100));
    
    document.querySelectorAll(".btn").forEach(btn => {
        btn.classList.add("victory");
        setTimeout(() => btn.classList.remove("victory"), 1000);
    });
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000 - Math.min(level * 20, 500));
        }
    } else {
        h2.innerHTML = `Game Over! Score: <b>${level}</b> | High Score: ${highScore} <br> Press Start or Enter to play again.`;
        document.body.classList.add("game-over");
        sounds.wrong.play();
        setTimeout(() => document.body.classList.remove("game-over"), 200);
        if(level > highScore) {
            highScore = level;
            localStorage.setItem("simonHighScore", highScore);
            highScoreElement.textContent = highScore;
        }
        reset();
    }
}

function btnPress() {
    let btn = this;
    userFlash(btn);
    userSeq.push(btn.id);
    updateProgress();
    checkAns(userSeq.length - 1);
}

function updateProgress() {
    const progress = (userSeq.length / gameSeq.length) * 100;
    document.querySelector(".progress-bar").style.width = `${progress}%`;
}

let allBtns = document.querySelectorAll(".btn");
allBtns.forEach(btn => {
    btn.addEventListener("click", btnPress);
    btn.addEventListener("touchstart", function(e) {
        e.preventDefault();
        btnPress.call(this);
    });
});

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    document.querySelector(".progress-bar").style.width = "0%";
    startBtn.classList.add("pulse");
}