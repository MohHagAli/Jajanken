let express = require("express");
let app = express();

let server = require("http").createServer(app);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"));

console.log("Server started.");

const PLAYER_LIST = {}; // socket id: { name: string, score: number, move: <0 | 1 | 2> }
const SOCKET_LIST = {}; // socket id: socket object

let io = require("socket.io")(server);
io.sockets.on("connection", function (socket) {
  socket.emit("setPlayerId", socket.id);

  socket.on("Username", function (name) {
    // if we have a player with this socket id
    if (PLAYER_LIST[socket.id]) {
      PLAYER_LIST[socket.id].name = name || "Mu3awak";
    }
    // otherwise create an empty object
    else {
      SOCKET_LIST[socket.id] = socket;
      PLAYER_LIST[socket.id] = {
        name: name || "Mu3awak",
        score: 0,
        move: null,
      };
    }
  });

  socket.on("sendMsgToServer", function (data) {
    console.log("someone sent a message!");
    for (const socketId in PLAYER_LIST) {
      const msg = PLAYER_LIST[socket.id].name + ": " + data;
      console.log(msg);
      SOCKET_LIST[socketId].emit("addToChat", msg);
    }
  });

  socket.on("disconnect", function () {
    delete PLAYER_LIST[socket.id];
    delete SOCKET_LIST[socket.id];
  });

  //0 is selection, 1 is results
  let gameState = 0;
  //the ai's move selection
  let botSelection = 0;
  function selectMove() {
    //generate a random number 0, 1, or 2 to decide what move to make for the AI
    let botSelection = Math.floor(Math.random() * Math.floor(3));
    //game is in result state
    gameState = 1;
    //send the ai's move to all connected players
    for (const socketId in PLAYER_LIST) {
      //! FOR NOW, PLAYER MOVES ARE RANDOMIZED
      PLAYER_LIST[socketId].move = Math.floor(Math.random() * Math.floor(3));
      let playerWin = playerWinCheck(PLAYER_LIST[socketId].move);
      if (playerWin) {
        PLAYER_LIST[socketId].score += 1;
      }

      SOCKET_LIST[socketId].emit(
        "gameResultState",
        botSelection,
        playerWin,
        PLAYER_LIST
      );
    }
  }
  function playerWinCheck(move) {
    let playerWins = false;
    //player chose rock
    if (move == 0) {
      //rock beats scissors
      if (botSelection == 2) {
        playerWins = true;
      }
    }
    //player chose paper
    if (move == 1) {
      //paper beats rock
      if (botSelection == 0) {
        playerWins = true;
      }
    }
    //player chose scissors
    if (move == 2) {
      //scissors beats paper
      if (botSelection == 1) {
        playerWins = true;
      }
    }
    return playerWins;
  }
  setInterval(function () {
    //select a move every 3 seconds
    selectMove();
  }, 3000);

  socket.on('playerMove',function(data){
    Object.keys(SOCKET_LIST).forEach(function eachKey(key) {
      if(SOCKET_LIST[key] == socket){
        console.log('player selected: ' + data);
        var thisPlayer = players[key];
        thisPlayer.move = data;
      }
   });
});


server.listen(4141);
