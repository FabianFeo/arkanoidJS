const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const $sprite = document.querySelector("#sprite");
const $bricks = document.querySelector("#bricks");
canvas.width = 448;
canvas.height = 400;

let counter = 0;


const ballRadius = 7;

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 4;
let dy = -4;

const PADDLE_SENSITIVITY = 8;

const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeight = 16;
const brickPadding = 0;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = [];

const brickStatus = {
  active: 1,
  destroyed: 0,
};

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = r * (brickWidth + brickPadding) + brickOffsetLeft;

    const random = Math.floor(Math.random() * 8);

    bricks[c][r] = { x: brickX, y: brickY, status: 1, color: random };
  }
}

const paddle_sensitivity = 7;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.drawImage(
    $sprite,
    29,
    174,
    paddleWidth,
    paddleHeight,
    paddleX,
    paddleY,
    paddleWidth,
    paddleHeight
  );
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === brickStatus.destroyed) 
        continue;

        const clipX = currentBrick.color * 32;

        ctx.drawImage(
          $bricks,
          clipX,
          0,
          brickWidth, 
          brickHeight,
          currentBrick.x,
          currentBrick.y,
          brickWidth,
          brickHeight
        );
      
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === brickStatus.destroyed) continue;

      const isBallTouchingBrick =
        x > currentBrick.x &&
        x < currentBrick.x + brickWidth &&
        y > currentBrick.y &&
        y < currentBrick.y + brickHeight;

      if (isBallTouchingBrick) {
        dy = -dy;
        currentBrick.status = brickStatus.destroyed;
      }
    }
  }
}

function ballmovement() {
  x += dx;
  y += dy;

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  }

  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;
  const isBallTouchingPaddle =
    y + dy > canvas.height - ballRadius - paddleHeight;
  if (isBallTouchingPaddle && isBallSameXAsPaddle) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      document.location.reload();
    }
  }
}

function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddle_sensitivity;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddle_sensitivity;
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }
}

function draw() {
  cleanCanvas();
  drawBall();
  drawPaddle();
  drawBricks();

  collisionDetection();
  ballmovement();
  paddleMovement();

  counter++;
  window.requestAnimationFrame(draw);
}

draw();
initEvents();
