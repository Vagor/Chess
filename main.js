var chess = document.getElementById('chess');
var ctx = chess.getContext('2d');
var chessBoard = [];
var me = true;
var over = false; //游戏结束flag
var wins = []; //赢法数组
var myWin = []; //赢法的统计数组
var count = 0; //赢法种数
var computerWin = [];
//初始化棋盘
function initChessBoard() {
  for (var i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; j++) {
      chessBoard[i][j] = 0;
    }
  }
}
//初始化赢法数组
function initWinsArr() {
  for (var row = 0; row < 15; row++) {
    wins[row] = [];
    for (var col = 0; col < 15; col++) {
      wins[row][col] = [];
    }
  }
  //横向赢法
  for (var row = 0; row < 15; row++) {
    for (var col = 0; col < 11; col++) {
      /*********
      *   循环一遍后
      *   win[0][0][0] = true
      *   win[0][1][0] = true
      *   win[0][2][0] = true
      *   win[0][3][0] = true
      *   win[0][4][0] = true
      *   以上为第零种赢法
      *********/
      /*********
      *   循环两遍后
      *   win[0][1][1] = true
      *   win[0][2][1] = true
      *   win[0][3][1] = true
      *   win[0][4][1] = true
      *   win[0][5][1] = true
      *   以上为第一种赢法
      *********/
      for (var k = 0; k < 5; k++) {
        wins[row][col + k][count] = true;
      }
      count++;
    }
  }
  //纵向赢法
  for (var col = 0; col < 15; col++) {
    for (var row = 0; row < 11; row++) {
      /*********
      *   循环一遍后
      *   win[0][0][0] = true
      *   win[1][0][0] = true
      *   win[2][0][0] = true
      *   win[3][0][0] = true
      *   win[4][0][0] = true
      *   以上为第零种赢法
      *********/
      /*********
      *   循环两遍后
      *   win[1][0][1] = true
      *   win[2][0][1] = true
      *   win[3][0][1] = true
      *   win[4][0][1] = true
      *   win[5][0][1] = true
      *   以上为第一种赢法
      *********/
      for (var k = 0; k < 5; k++) {
        wins[row + k][col][count] = true;
      }
      count++;
    }
  }
  //斜向赢法
  for (var row = 0; row < 11; row++) {
    for (var col = 0; col < 11; col++) {
      /*********
      *   循环一遍后
      *   win[0][0][0] = true
      *   win[1][1][0] = true
      *   win[2][2][0] = true
      *   win[3][3][0] = true
      *   win[4][4][0] = true
      *   以上为第零种赢法
      *********/
      /*********
      *   循环两遍后
      *   win[1][1][1] = true
      *   win[2][2][1] = true
      *   win[3][3][1] = true
      *   win[4][4][1] = true
      *   win[5][5][1] = true
      *   以上为第一种赢法
      *********/
      for (var k = 0; k < 5; k++) {
        wins[row + k][col + k][count] = true;
      }
      count++;
    }
  }
  //反斜向赢法
  for (var row = 0; row < 11; row++) {
    for (var col = 14; col > 3; col--) {
      /*********
      *   循环一遍后
      *   win[0][14][0] = true
      *   win[1][13][0] = true
      *   win[2][12][0] = true
      *   win[3][11][0] = true
      *   win[4][10][0] = true
      *   以上为第零种赢法
      *********/
      /*********
      *   循环两遍后
      *   win[0][13][1] = true
      *   win[1][12][1] = true
      *   win[2][11][1] = true
      *   win[3][10][1] = true
      *   win[4][9][1] = true
      *   以上为第一种赢法
      *********/
      for (var k = 0; k < 5; k++) {
        wins[row + k][col - k][count] = true;
      }
      count++;
    }
  }
  console.log(count); //打印出赢法的种数
}
//初始化赢法统计数组
function initWinCount() {
  for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
  }
}
//初始化棋盘UI
function drawChessBoard() {
  for (var i = 0; i < 15; i++) {
    ctx.moveTo(15 + i * 30, 15);
    ctx.lineTo(15 + i * 30, 435);
    ctx.stroke();
    ctx.moveTo(15, 15 + i * 30);
    ctx.lineTo(435, 15 + i * 30);
    ctx.stroke();
  }
}
//落子函数
function oneStep(i, j, me) {
  ctx.beginPath();
  ctx.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
  ctx.closePath();
  var gradient = ctx.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
  if (me) {
    gradient.addColorStop(0, "#0a0a0a");
    gradient.addColorStop(1, "#636766");
  } else {
    gradient.addColorStop(0, "#d1d1d1");
    gradient.addColorStop(1, "#f9f9f9");
  }
  ctx.fillStyle = gradient;
  ctx.fill();
}
//计算机AI
function computerAI() {
  var myScore = [];
  var computerScore = [];
  var max = 0;
  var u = 0
  var v = 0;
  for (var i = 0; i < 15; i++) {
    myScore[i] = [];
    computerScore[i] = [];
    for (var j = 0; j < 15; j++) {
      myScore[i][j] = 0;
      computerScore[i][j] = 0;
    }
  }
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (chessBoard[i][j] == 0) {
        for (var k = 0; k < count; k++) {
          if (wins[i][j][k]) {
            if (myWin[k] == 1) {
              myScore[i][j] += 200;
            } else if (myWin[k] == 2) {
              myScore[i][j] += 400;
            } else if (myWin[k] == 3) {
              myScore[i][j] += 2000;
            } else if (myWin[k] == 4) {
              myScore[i][j] += 10000;
            }
            if (computerWin[k] == 1) {
              computerScore[i][j] += 220;
            } else if (computerWin[k] == 2) {
              computerScore[i][j] += 420;
            } else if (computerWin[k] == 3) {
              computerScore[i][j] += 2100;
            } else if (computerWin[k] == 4) {
              computerScore[i][j] += 20000;
            }
          }
        }
        if (myScore[i][j] > max) {
          max = myScore[i][j];
          u = i;
          v = j;
        } else if (myScore[i][j] == max) {
          if (computerScore[i][j] > computerScore[u][v]) {
            u = i;
            v = j;
          }
        }
        if (computerScore[i][j] > max) {
          max = computerScore[i][j];
          u = i;
          v = j;
        } else if (computerScore[i][j] == max) {
          if (myScore[i][j] > myScore[u][v]) {
            u = i;
            v = j;
          }
        }
      }
    }
  }
  oneStep(u, v, !me);
  chessBoard[u][v] = 2;
  for (var k = 0; k < count; k++) {
    if (wins[u][v][k]) {
      computerWin[k]++;
      myWin[k] = 6;
      if (computerWin[k] == 5) {
        window.alert("计算机赢啦");
        over = true;
      }
    }
  }
}
//初始化棋盘
function init() {
  initChessBoard();
  initWinsArr();
  initWinCount();
  ctx.strokeStyle = "#bfbfbf";
  window.onload = function() {
    drawChessBoard();
  }
}
init();

chess.onclick = function(e) {
  if (over) {
    return;
  }
  var x = e.offsetX;
  var y = e.offsetY;
  var i = Math.floor(x / 30);
  var j = Math.floor(y / 30);
  if (chessBoard[i][j] == 0) {
    oneStep(i, j, me);
    if (me) {
      chessBoard[i][j] = 1;
    } else {
      chessBoard[i][j] = 2;
    }
    me = !me;
    for (var k = 0; k < count; k++) {
      if (wins[i][j][k]) {
        myWin[k]++;
        computerWin[k] = 6;
        if (myWin[k] == 5) {
          window.alert("你赢啦");
          over = true;
        }
      }
    }
    if (!over) {
      me = !me;
      computerAI();
    }
  }
}
