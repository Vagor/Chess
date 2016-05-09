(function() {
  var FADE_TIME = 150; // ms

  // Initialize variables
  var $playerInput = $('.player-name');
  var $opponentInput = $('.opponent-name');
  var $loginPage = $('.login.page');
  var $gamePage = $('.game.page');
  var $window = $(window);
  var socket = io();
  var playerName, opponentName;

  // 五子棋过程
  var chess = document.getElementById('chess');
  var ctx = chess.getContext('2d');
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
  //初始化棋盘
  function init() {
    ctx.strokeStyle = "#bfbfbf";
    window.onload = function() {
      drawChessBoard();
    }
  }
  init();


  // 注册页面
  $window.keydown(function(event) {
    if (event.which === 13) {
      if ($playerInput.val() && $opponentInput.val()) {
        $loginPage.fadeOut(FADE_TIME);
        $gamePage.fadeIn(FADE_TIME);
        playerName = $playerInput.val();
        opponentName = $opponentInput.val()
        socket.emit('login', {
          playerName,
          opponentName
        });
        //给棋局加游戏人名
        $('.opponent-name-box').text(opponentName);
        $('.player-name-box').text(playerName);
      } else if ($playerInput.val() && !$opponentInput.val()) {
        $opponentInput.focus();
      } else if (!$playerInput.val()) {
        $playerInput.focus();
      }
    }


    // 游戏过程
    socket.on(playerName + 'LoginSuccess', function(msg) {
      console.log(msg);
    })
    socket.on(playerName + 'Start', function(data) {
      if (playerName == data.nameFirst) {
        chess.onclick = function(e) {
          var x = e.offsetX;
          var y = e.offsetY;
          var i = Math.floor(x / 30);
          var j = Math.floor(y / 30);
          socket.emit('moveFinish', {
            i,
            j,
            playerName
          });
        }
      }
    })
    socket.on('paint', function(data) {
      oneStep(data.x, data.y, data.me);
      // chess.onclick = null;
    })
    socket.on(playerName + 'Move', function() {
      chess.onclick = function(e) {
        if (over) {
          return;
        }
        var x = e.offsetX;
        var y = e.offsetY;
        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);
        io.emit('moveFinish', {
          i,
          j,
          playerName
        });
      }
    })
    socket.on(playerName + 'End', function(msg) {
      console.log(msg);
    })

  });

})()
