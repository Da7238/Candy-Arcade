let canvas = document.getElementById("game");
let context = canvas.getContext("2d");
context.font = 'bold 30px sans-serif';

let current;
let gameState;
let score;
let lives;
let hoverSpeed;
let changeInY;
let factorChange;

const YSPEED = 5;
const HEIGHT = 50;
const STACK_WIDTH = 100;
const STACK_HEIGHT = 200;
const COLORS = ['#52006A', '#CD113B', '#FF7600', '52006A'];

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
    gameState = 'gameOver';
    context.fillText('Game over. Click to play again!', 60, canvas.height/2);
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
    changeInY = 0;
    factorChange = 0;
    newBox();
}

/**
 * Creates new box for stack
 */
function newBox(color) {
    stack[current] = {
      x: 0,
      y: (current+5)*HEIGHT,
      width: STACK_WIDTH,
      bColor: color
    };
  }

/**
 * Handles game rendering and logic based on game state
 */
function game() {
    if(gameState != 'gameOver') {
        // Set background + text
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillText('Score: ' + (current - 1).toString(), canvas.width-200, 50);
        context.fillText('Lives Left: ' + (lives).toString(), 5, 50);

        
        // process stack
        stack.forEach(box => {
            context.fillStyle = box.bColor;
            context.fillRect(box.x, canvas.height-box.y + changeInY, box.width, HEIGHT);
        })

        // box in the sky
        if (gameState == 'waitingToDrop') {
            stack[current].x = stack[current].x + hoverSpeed;
            // Flip the direction while the box is hovering
            if (hoverSpeed > 0 && stack[current].x + stack[current].width > canvas.width)
                hoverSpeed = -hoverSpeed;
            if (hoverSpeed < 0 && stack[current].x < 0)
                hoverSpeed = -hoverSpeed;
        }
        
        // box is being dropped
        if (gameState == 'dropping') {
            stack[current].y = stack[current].y - YSPEED;
            if (stack[current].y == stack[current - 1].y + HEIGHT) {
                gameState = 'waitingToDrop';
                let difference = stack[current].x - stack[current - 1].x;
                // Box is not stacked
                // Missed the stack
                missed = false;
                if (Math.abs(difference) >= stack[current].width) {
                    lives--;
                    if(lives < 0) {
                        gameOver();
                    }
                    else current--;
                } 
                if (hoverSpeed > 0)  {
                    hoverSpeed++;
                } else { 
                    hoverSpeed--;
                }
                current++;
                factorChange = HEIGHT;
                newBox(getRandomColor());
            }
            if (factorChange) {
                changeInY+=5;
                factorChange--;
              }
          }
          
    } 
    window.requestAnimationFrame(game);
}

function getRandomColor() {
    let min = 0;
    let max = COLORS.length;
    let index = Math.floor(Math.random() * (max - min)) + min;
    return COLORS[index];
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