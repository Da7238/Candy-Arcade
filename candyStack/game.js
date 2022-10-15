let canvas = document.getElementById("game");
let context = canvas.getContext("2d");
context.font = 'bold 30px sans-serif';

let current = 1;
let gameState = "waitingToDrop"
let score = 0;
let lives = 3;
let hoverSpeed = 2;
let changeInY = 0;
let factorChange = 0;


const YSPEED = 5;
const HEIGHT = 50;
const STACK_WIDTH = 200;
const STACK_HEIGHT = 200;

// Represents the boxes in the Stacking Game
let stack = []
stack[0] = {
    x: 0,
    y: (current + 10) * HEIGHT,
    width: STACK_WIDTH
};

/**
 * Sets the mode of the game to game over and notifies player
 */
function gameOver() {
    mode = 'gameOver';
    context.fillText('Game over. Click to play again!', canvas.width/2, canvas.height/2);
  }

/**
 * Initializes game logic at start of the game
 * Adds base block to start with
 */
function initialize() {
    stack.splice(1, stack.length - 1);
    current = 1;
    gameState = 'waitingToDrop';
    score = 0;
    lives = 3;
    hoverSpeed = 2;
    changeInY = 0;
    factorChange = 0;
    newBox();
}

/**
 * Creates new box for stack
 */
function newBox() {
    stack[current] = {
      x: 0,
      y: 300,
      width: 200
    };
  }

/**
 * 
 */
function game() {
    if(gameState != 'gameOver') {
        // Set background + text
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillText('Score: ' + (current - 1).toString(), 100, 200);
        
        // process stack
        stack.forEach(box => {
            context.fillStyle = '#52006A';
            context.fillRect(box.x, canvas.height - box.y + changeInY, box.width, HEIGHT);
        })

        // box in the sky
        if (gameState == 'waitingToDrop') {
            stack[current].x = stack[current].x + hoverSpeed;
            if (hoverSpeed > 0 && stack[current].x + stack[current].width > canvas.width)
                hoverSpeed = -hoverSpeed;
            if (hoverSpeed < 0 && stack[current].x < 0)
                hoverSpeed = -hoverSpeed;
        }
        // box is being dropped
        if (gameState == 'dropping') {
            stack[current].y = stack[current].y - ySpeed;
            if (stack[current].y == stack[current - 1].y + height) {
                mode = 'waitingToDrop';
                let difference = stack[current].x - stack[current - 1].x;
                // Box is not stacked
                if (Math.abs(difference) >= stack[current].width) {
                    lives--;
                }
                if (hoverSpeed > 0) hoverSpeed++;
                else hoverSpeed--;
                current++;
                scrollCounter = height;
                newBox();
            }
          }
          if (factorChange) {
            changeInY++;
            factorChange--;
          }
    } 
    window.requestAnimationFrame(game);
}

/**
 * Onclick event, initializes game if in gameOver state,
 * otherwise, sets mode to dropping which handles block dropping logic
 */
canvas.onpointerdown = function() {
    if (gameState == 'gameOver')
      initialize();
    else {
      if (gameState == 'waitingToDrop')
      gameState = 'dropping';
    }
  };

initialize();
game();