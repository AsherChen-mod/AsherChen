const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext 會回傳一個canvas 的 drawing context
//drawing context可以用來在canvas畫圖
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

//遊戲初始設定
let snake = []; //array中的每個元素都是一個物件，紀錄身體的x和y的座標
let d = "Right"; //蛇的行走方向
//遊戲分數
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
let highest;
getHighest();
document.getElementById("myScore2").innerHTML = "最高紀錄：" + highest;

//做初始蛇
function makeSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}
makeSnake();
window.addEventListener("keydown", changeDirection);
function changeDirection(e) {
  if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  }
  removeEventListener("keydown", changeDirection);
}

//隨機做果實
class fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickAlocation() {
    let new_x;
    let new_y;
    let overlapping = false;

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == new_x && snake[i].y == new_y) {
          overlapping = true;
          break;
        } else {
          overlapping = false;
        }
      }
    } while (overlapping);
    this.x = new_x;
    this.y = new_y;
  }
}
let myFruit = new fruit();

function myGame() {
  //每次畫蛇之前確認蛇有沒有咬到自己
  let gameOver = false;
  function snakeDieOrNot() {
    let headx = snake[0].x;
    let heady = snake[0].y;
    for (let i = 1; i < snake.length; i++) {
      if (headx == snake[i].x && heady == snake[i].y) {
        clearInterval(gameRun);
        gameOver = true;
        alert("GAME OVER!!");
      }
    }
  }
  snakeDieOrNot();
  if (gameOver) {
    return;
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 320, 320);
  myFruit.drawFruit();
  //畫蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "yellow";
    } else {
      ctx.fillStyle = "lightblue";
    }

    // 如果蛇撞牆了
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    } else if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }
    //x,y,width,height
    ctx.strokeStyle = "white";
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //做新蛇頭
  let myX = snake[0].x;
  let myY = snake[0].y;

  if (d == "Right") {
    myX += unit;
  } else if (d == "Down") {
    myY += unit;
  } else if (d == "Left") {
    myX -= unit;
  } else if (d == "Up") {
    myY -= unit;
  }

  let newHead = { x: myX, y: myY };

  //確認是否有吃到果實;
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //如果吃到果實
    //加分
    score++;
    document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
    setHighest();
    //製作新果實
    let overlapping = false;
    do {
      myFruit = new fruit();
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == myFruit.x && snake[i].y == myFruit.y) {
          console.log("overlapping!!");
          overlapping = true;
          break;
        } else {
          overlapping = false;
        }
      }
    } while (overlapping);
    // myFruit.pickAlocation();
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  addEventListener("keydown", changeDirection);
}
const gameRun = setInterval(myGame, 100);

function getHighest() {
  if (localStorage.getItem("highest") == null) {
    highest = 0;
  } else {
    highest = Number(localStorage.getItem("highest"));
  }
}

function setHighest() {
  if (score > highest) {
    highest = score;
    localStorage.setItem("highest", highest);
    document.getElementById("myScore2").innerHTML =
      "最高紀錄：" + Number(highest);
  }
}
