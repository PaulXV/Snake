// handlling game start with tutorial
const tutorial = document.querySelector('.tutorial');
const startGame = document.querySelector('.start-game');
const tutorialControls = document.querySelector('.tut-content');

startGame.addEventListener('click', () => {
    tutorial.classList.add('hidden');
});

tutorialControls.addEventListener('click', () => {
    tutorial.classList.remove('hidden');
});


// handling game over
const overlay = document.querySelector('.overlay');
const restartGame = document.querySelector('.restart-game');
const finalScore = document.querySelector('.final-score');
const finalHighScore = document.querySelector('.final-high-score');

restartGame.addEventListener('click', () => {
    overlay.classList.add('hidden');
    gameOver = false;
    snakeX = 5;
    snakeY = 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    updateFoodPosition();
    score = 0;
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
    setIntervalId = setInterval(initGame, 100);
});

const handleGameOver = () => {
    localStorage.setItem("high-score", highScore);
    clearInterval(setIntervalId);
    finalScore.textContent = `${score}`;
    finalHighScore.textContent = `${highScore}`;
    overlay.classList.remove('hidden');
}


// handling game part
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    let foodPositionValid = false;

    // Continuare a generare la posizione finché non è valida
   do{
        foodX = Math.floor(Math.random() * 30) + 1;
        foodY = Math.floor(Math.random() * 30) + 1;

        // Verifica se la posizione generata è occupata dal corpo del serpente
        foodPositionValid = true;

        // Verifica se la posizione generata è occupata da una parte del corpo del serpente
        for (let i = 0; i < snakeBody.length; i++) {
            // snakeBody[i] contiene [Y, X], quindi confrontiamo con Y e X di food
            if (snakeBody[i][0] === foodX && snakeBody[i][1] === foodY) {
                foodPositionValid = false; // Se c'è una sovrapposizione, non è valida
                break;
            }
        }   
    } while (!foodPositionValid);
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));
const changeDirection = e => {
    if((e.key === "ArrowUp" || e.keyCode == 87) && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if((e.key === "ArrowDown" || e.keyCode == 83) && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if((e.key === "ArrowLeft" || e.keyCode == 65) && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if((e.key === "ArrowRight" || e.keyCode == 68) && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] == snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);