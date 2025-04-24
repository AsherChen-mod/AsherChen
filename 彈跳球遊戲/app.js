const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 500;
let circle_y = 100;
let radius = 25;
let xSpeed = 15;
let ySpeed = 15;
let ground_x = 100;
let ground_y = 500;
let ground_height = 10;
let brickArray = [];
let count = 0;
//讓地板跟著滑鼠走
c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX - 100;
});
//求一個隨機範圍的數
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

//做磚塊
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.visible = true;
    brickArray.push(this);
  }
  drawBrick() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  hitBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}

//建磚塊
makeBricks();

function drawCircle() {
  //確認球是否撞牆
  hitWall();
  //確認球是否撞地板
  hitGround();
  //確認球是否撞到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.hitBall(circle_x, circle_y)) {
      count++;
      console.log(count);
      brick.visible = false;
      if (xSpeed > 0) {
        circle_x -= 20;
      } else if (xSpeed < 0) {
        circle_x += 20;
      }
      xSpeed *= -1;
      if (ySpeed > 0) {
        circle_y -= 20;
      } else if (ySpeed < 0) {
        circle_y += 20;
      }
      ySpeed *= -1;
      if (count == brickArray.length) {
        alert("VICTORY!!");
        clearInterval(game);
        location.reload();
      }
    }
  });

  //更動圓的位置
  circle_x += xSpeed;
  circle_y += ySpeed;
  //畫背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  //畫磚塊
  for (let i of brickArray) {
    if (i.visible) {
      i.drawBrick();
    }
  }
  //畫地板
  ctx.fillStyle = "white";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);
  //畫圓
  ctx.beginPath();
  //arc(x,y,radius,startAngle,endAngle)
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  //   ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "red";
  ctx.fill();
}

const game = setInterval(drawCircle, 25);
//做出10個磚塊
function makeBricks() {
  for (let i = 0; i < 15; i++) {
    let overLapping = false;
    let brick_x;
    let brick_y;
    function checkBrick(x, y) {
      for (let j = 0; j < brickArray.length; j++) {
        if (
          brick_x >= brickArray[j].x - 50 &&
          brick_x <= brickArray[j].x + 50 &&
          brick_y >= brickArray[j].y - 50 &&
          brick_y <= brickArray[j].y + 50
        ) {
          console.log("overlapping!!!");
          overLapping = true;
          break;
        } else {
          overLapping = false;
        }
      }
    }
    do {
      brick_x = getRandomArbitrary(0, 950);
      brick_y = getRandomArbitrary(0, 550);
      console.log("第" + (i + 1) + "個Brick想建在" + brick_x + " " + brick_y);
      checkBrick(brick_x, brick_y);
    } while (overLapping);
    console.log("這裡可以建一個brick");
    new Brick(brick_x, brick_y);
  }
}
//確認球有沒有撞到牆
function hitWall() {
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
    circle_x -= 10;
    console.log("撞右牆");
  } else if (circle_x <= radius) {
    xSpeed *= -1;
    circle_x += 10;
    console.log("撞左牆");
  }

  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
    circle_y -= 10;
    console.log("撞下牆");
  } else if (circle_y <= radius) {
    ySpeed *= -1;
    circle_y += 10;
    console.log("撞上牆");
  }
}

//確認球有沒有撞到地板
function hitGround() {
  if (
    circle_x + radius >= ground_x &&
    circle_x - radius <= ground_x + 200 &&
    circle_y + radius >= ground_y &&
    circle_y - radius <= ground_y + 10
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 25;
    }
    ySpeed *= -1;
  }
}
