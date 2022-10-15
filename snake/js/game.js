const COLORS = ['#FFA900', '#CD113B', '#FF7600', '#52006A'];
let
	canvas             = document.getElementById('canvas'),
	ctx                = canvas.getContext('2d'),
	scoreBlock         = document.getElementById('score'),
	scoreCount         = 0,
	bestScoreBlock     = document.getElementById('best-score'),
	dir                = '', // snake direction
	diff               = 'Easy', // difficulty
	diffBlock          = document.getElementById('difficulty'),
	btnChange          = document.getElementById('changeDif');

const config = { // General setting
	sizeCell: 24,
	sizeFood: 24,
	step: 0,
	stepMax: 7,
}

const snake = { // Snake settings
	x: config.sizeCell,
	y: config.sizeCell,
	dirX: 0, // direction X
	dirY: 0, // direction Y
	body: [],
	maxBodySize: 1,
}
const snakeSkins = [ // array snake skins
	'./img/snake/randy.png',
	'./img/naked_randy.png',
];
const snakeImages = [
	imgHead = new Image(),
	imgBody = new Image(),
];
for ( let i = 0; i < snakeImages.length; i++ ) {
	snakeImages[i].src = snakeSkins[i];
}

const food = { // food settings
	x: randomInt(0, canvas.width / config.sizeCell) * config.sizeCell,
	y: randomInt(0, canvas.height / config.sizeCell) * config.sizeCell,
}
const images = [ // array with images path
	'./img/food/pink_candy.png',
	'./img/food/orange_candy.png',
	'./img/food/pink_yellow_candy.png',
	'./img/food/red_candy.png',
];
let img = new Image();
img.src = images[0]; // the default will be the first image


// аудио
const audio = [ // array with audio
	'./audio/eat.mp3',
	'./audio/turn.mp3',
	'./audio/dead.mp3',
	'./audio/hit.mp3',
];
const audioNames = [
	audioEat = new Audio(),
	audioTurn = new Audio(),
	audioDead = new Audio(),
	audioHit = new Audio(),
];
for ( let i = 0; i < audio.length; i++ ) {
	audioNames[i].src = audio[i];
}

// canvas settings
window.addEventListener('load', (e) => {
	if ( window.innerWidth <= 650 ) {
		canvas.width = 300;
		canvas.height = 300;
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		config.sizeCell = 15;
		config.sizeFood = 15;
		canvas.style = 'background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJibGFjayIvPgo8Y2lyY2xlIGN4PSI3LjUiIGN5PSI3LjUiIHI9IjIuNSIgZmlsbD0iIzUxNDk0OSIvPgo8L3N2Zz4K");';
		restart();
	}
	else if ( window.innerWidth > 650 ) {
		canvas.width = 600;
		canvas.height = 480;
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		config.sizeCell = 24;
		config.sizeFood = 24;
		canvas.style = 'background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjNTE0OTQ5Ii8+Cjwvc3ZnPgo=");';
		restart();
	}
});
// adaptive
window.addEventListener('resize', (e) => {
	if ( window.innerWidth <= 650 ) {
		canvas.width = 300;
		canvas.height = 300;
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		config.sizeCell = 15;
		config.sizeFood = 15;
		canvas.style = 'background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJibGFjayIvPgo8Y2lyY2xlIGN4PSI3LjUiIGN5PSI3LjUiIHI9IjIuNSIgZmlsbD0iIzUxNDk0OSIvPgo8L3N2Zz4K");';
	}
	else if ( window.innerWidth > 650 ) {
		canvas.width = 600;
		canvas.height = 480;
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		config.sizeCell = 24;
		config.sizeFood = 24;
		canvas.style = 'background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjNTE0OTQ5Ii8+Cjwvc3ZnPgo=");';
	}
});

// score
function score() {
	scoreCount++;
	bestScore();
	if ( scoreCount > 15 ) config.stepMax = 5;
	else if ( scoreCount <= 15 ) config.stepMax = 6;
	drawScore();
}
function drawScore() {
	scoreBlock.innerHTML = scoreCount;
}
function bestScore() {
	if ( !localStorage.getItem('best score') ) {
		localStorage.setItem('best score', 0);
	}
	if ( scoreCount > localStorage.getItem('best score') ) {
		localStorage.setItem('best score', scoreCount);
	}
	bestScoreBlock.innerHTML = localStorage.getItem('best score');
}


// game
function gameLoop() {

	requestAnimationFrame(gameLoop);
	if ( ++config.step < config.stepMax ) return;
	config.step = 0;

	ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas
	drawFood();
	drawSnake();
}
gameLoop();

// difficulty, restart
function checkBorder() { // A function that checks for going beyond the border
	// x
	if ( snake.x < 0 ) {
		snake.x = canvas.width - config.sizeCell;
	} else if ( snake.x >= canvas.width ) {
		snake.x = 0;
	}
	// y
	if ( snake.y < 0 ) {
		snake.y = canvas.height - config.sizeCell;
	} else if ( snake.y >= canvas.height ) {
		snake.y = 0;
	}
}

function restart() { // A function restart game
	document.body.style.backgroundColor = getRandomColor();
	config.stepMax = 6;
	scoreCount = 0;
	drawScore();

	snake.x = config.sizeCell;
	snake.y = config.sizeCell;
	snake.body = [];
	snake.maxBodySize = 1;
	snake.dirX = 0;
	snake.dirY = 0;
	dir = '';

	randomPosFood();
}


// draw snake
function drawSnake() {
	snake.x += snake.dirX;
	snake.y += snake.dirY;

	checkBorder();

	// work with snake length
	snake.body.unshift({x: snake.x, y: snake.y});
	if ( snake.body.length > snake.maxBodySize ) {
		snake.body.pop();
	}

	snake.body.forEach((e, index) => {

		snakeStyles(e, index); // snake styles

		if ( e.x == food.x && e.y == food.y ) { // If snake ate food
			audioPlay('eat');
			score();
			randomPosFood();
			snake.maxBodySize++;
		}

		// Checking if the snake has touched the tail
		for ( let i = index + 1; i < snake.body.length; i++ ) {
			if ( e.x === snake.body[i].x && e.y === snake.body[i].y ) {
				audioPlay('dead');
				restart();
			}
		}
	});
}

// snake styles
function snakeStyles(e, index) {
	if ( index === 0 ) { // for the first snake element(head)
		ctx.drawImage(snakeImages[0], e.x, e.y, config.sizeCell, config.sizeCell);
	}
	else { // other elements of the snake
		ctx.drawImage(snakeImages[1], e.x, e.y, config.sizeCell - 1, config.sizeCell - 1);
	}
}

// draw food
function drawFood() {
	ctx.drawImage(img, food.x, food.y, config.sizeFood, config.sizeFood);
}

// Load the best score
document.addEventListener('load', bestScore());

// constrols
function turnUp() {
	if ( dir != 'down' ) {
		audioPlay('turn');
		dir = 'up';
		snake.dirY = -config.sizeCell;
		snake.dirX = 0;
	}
}
function turnLeft() {
	if ( dir != 'right' ) {
		audioPlay('turn');
		dir = 'left';
		snake.dirX = -config.sizeCell;
		snake.dirY = 0;
	}
}
function turnDown() {
	if ( dir != 'up' ) {
		audioPlay('turn');
		dir = 'down';
		snake.dirY = config.sizeCell;
		snake.dirX = 0;
	}
}
function turnRight() {
	if ( dir != 'left' ) {
		audioPlay('turn');
		dir = 'right';
		snake.dirX = config.sizeCell;
		snake.dirY = 0;
	}
}

document.addEventListener('keydown', (e) => {
	if ( e.keyCode == 87 || e.keyCode == 38 ) { // W (up) or arrow up
		turnUp();
	}
	else if ( e.keyCode == 65 || e.keyCode == 37 ) { // A (left) or arrow left
		turnLeft();
	}
	else if ( e.keyCode == 83 || e.keyCode == 40 ) { // S (down) or arrow down
		turnDown();
	}
	else if ( e.keyCode == 68 || e.keyCode == 39 ) { // D (right) or arrow right
		turnRight();
	}
});


// Additional functions
// get random color in our color scheme
function getRandomColor() {
    let min = 0;
    let max = COLORS.length;
    let index = Math.floor(Math.random() * (max - min)) + min;
    return COLORS[index];
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
function randomImg() { // random img ( for food )
	let imgCount = randomInt(0, images.length);
	let imgPath = images[imgCount];
	img.src = imgPath;
	return img;
}

function randomPosFood() { // random food position
	ctx.drawImage(randomImg(), food.x, food.y, config.sizeFood, config.sizeFood);
	food.x = randomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
	food.y = randomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
	drawFood();
}

function audioPlay(name) { // play audio
	if ( name === 'eat' ) {
		audioNames[0].play();
	}
	if ( name === 'turn' ) {
		audioNames[1].play();
	}
	if ( name === 'dead' ) {
		audioNames[2].play();
	}
	if ( name === 'hit' ) {
		audioNames[3].play();
	}
}