let canvas = document.getElementById("game");
let context = canvas.getContext("2d");
context.font = 'bold 30px sans-serif';

let current;
let gameState;
let score;
let lives;
let hoverSpeed;
let dropSpeed;
let changeInY;
let factorChange;

const YSPEED = 5;
const HEIGHT = 50;
const STACK_WIDTH = 200;
const STACK_HEIGHT = 200;

// Represents the boxes in the Stacking Game
let stack = []
stack[0] = {
    x: STACK_WIDTH,
    y: STACK_HEIGHT,
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
    gameState = 'waitingToDrop';
    current = 1;
    score = 0;
    lives = 3;
    hoverSpeed = 2;
    dropSpeed = 5;
    changeInY = 0;
    factorChange = 0;
    newBox();
}

/**
 * Creates new box for stack
 */
function newBox() {
    stack[current] = {
      x: 200,
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
        context.fillText('Score: ' + (current - 1).toString(), canvas.width-125, 50);
        context.fillText('Lives: ' + (lives).toString(), 5, 50);

        
        // process stack
        stack.forEach(box => {
            context.fillStyle = '#52006A';
            context.fillRect(box.x, canvas.height-box.y + changeInY, box.width, HEIGHT);
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
            stack[current].y = stack[current].y - 3;
            if (stack[current].y == stack[current - 1].y + HEIGHT) {
                gameState = 'waitingToDrop';
                let difference = stack[current].x - stack[current - 1].x;
                // Box is not stacked
                // Missed the stack
                if (Math.abs(difference) >= stack[current].width) {
                    lives--;
                }
                // Flip the direction while the box is hovering
                if (hoverSpeed > 0)  {
                    hoverSpeed++;
                } else { 
                    hoverSpeed--;
                }
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