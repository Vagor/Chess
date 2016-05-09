// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var players = [];
var opponentName = [];



server.listen(port, function() {
  console.log('Server listening at port %d', port);
});

//五子棋
var chessBoard = [];
var me = true;
var over = false; //游戏结束flag
var wins = []; //赢法数组 三维数组
var playerWin = []; //赢法的统计数组 二维数组
var player = 1;
var count = 0; //赢法种数





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
  for (var i = 0; i < 2; i++) {
    playerWin[i] = [];
    for (var j = 0; j < count; j++) {
      playerWin[i][j] = 0;
    }
  }
}
// 初始化函数
function init() {
  initWinCount();
  initWinsArr();
  initChessBoard();
}
init();
// 函数——判断字符串是否在数组中
function inArray(str, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (str == arr[i]) {
      return true;
    }
  }
  return false;
}

// Routing
app.use(express.static(__dirname + '/app'));

io.on('connection', function(socket) {
  socket.on('login', function(data) {
    console.log('*********************a user login*********************');
    players.push(data.playerName);
    console.log('opponentName:' + data.opponentName);
    console.log('opponentName in players:' + inArray(data.opponentName, players));
    if (inArray(data.opponentName, players)) {
      opponentName[data.opponentName] = data.playerName;
      opponentName[data.playerName] = data.opponentName;
      //触发先后手
      socket.emit(data.playerName + 'Start', {
        nameFirst: data.playerName,
        nameSecond: data.opponentName
      })
      socket.emit(data.opponentName + 'Start', {
        nameFirst: data.playerName,
        nameSecond: data.opponentName
      })
    } else {
      console.log('playerName:' + data.playerName);
      console.log('players:' + players);
      socket.emit(data.playerName + 'LoginSuccess', '对手未上线');
    }
  });
  socket.on('moveFinish', function(data) {
    var x = data.i;
    var y = data.j;
    if (chessBoard[x][y] == 0) {
      socket.broadcast.emit('paint', {
        x,
        y,
        me
      })
      socket.emit('paint', {
        x,
        y,
        me
      })
      if (me) {
        chessBoard[x][y] = 1;
        player = 1;
      } else {
        chessBoard[x][y] = 2;
        player = 0;
      }
      for (var k = 0; k < count; k++) {
        if (wins[x][y][k]) {
          playerWin[player][k]++;
          if (playerWin[player][k] == 5) {
            if (player) {
              socket.emit(data.playerName + 'End', '黑棋赢啦');
              socket.emit(opponentName[data.playerName] + 'End', '黑棋赢啦');
            } else {
              socket.emit(data.playerName + 'End', '白棋赢啦');
              socket.emit(opponentName[data.playerName] + 'End', '白棋赢啦');
            }
            over = true;
          }
        }
      }
      me = !me;
      console.log(opponentName[data.playerName] );
      socket.emit(opponentName[data.playerName] + 'Move', {})
    }
  });
});
