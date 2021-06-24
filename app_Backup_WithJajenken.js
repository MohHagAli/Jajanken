//Use express module and choose the html file
let express = require('express');
const { PassThrough } = require('stream');
let app = express();
let server = require('http').createServer(app);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
console.log('Server started.');

//chatbox + jajenken code
const PLAYER_LIST = {}; // socket id: { id : number, name: string, score: number, move: <0 | 1 | 2> }
const SOCKET_LIST = {}; // socket id: socket object
let playernumber = 0;

let io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
    socket.emit('setPlayerId', socket.id);

    socket.on('Username', function (name) {
        // if we have a player with this socket id
        playernumber += 1;
        if (PLAYER_LIST[socket.id]) {
            // playernumber +=1 ;
            PLAYER_LIST[socket.id].name = name || 'Mu3awak';
            PLAYER_LIST[socket.id].id = playernumber;
        }
        // otherwise create an empty object
        else {
            SOCKET_LIST[socket.id] = socket;
            PLAYER_LIST[socket.id] = {
                id: playernumber,
                name: name || 'Mu3awak',
                score: 0,
                move: null,
            };
            console.log('TEST');
            console.log(
                PLAYER_LIST[socket.id].name + ': ' + PLAYER_LIST[socket.id].id
            );
        }
    });

    socket.on('sendMsgToServer', function (data) {
        console.log('someone sent a message!');
        for (const socketId in PLAYER_LIST) {
            const msg = PLAYER_LIST[socket.id].name + ': ' + data;
            console.log(msg);
            SOCKET_LIST[socketId].emit('addToChat', msg);
        }
    });
    //! No disconnect on HTML
    socket.on('disconnect', function () {
        console.log('DISCONNECTED');
        playernumber--;
        if (playernumber < 0) {
            playernumber = 0;
        }

        delete PLAYER_LIST[socket.id];
        delete SOCKET_LIST[socket.id];
    });
    //function to select the player move
    socket.on('playerMove', function (data) {
        Object.keys(SOCKET_LIST).forEach(function eachKey(key) {
            if (SOCKET_LIST[key] == socket) {
                console.log(PLAYER_LIST[key].name + ' selected: ' + data);
                let thisPlayer = PLAYER_LIST[key];
                thisPlayer.move = data;
            }
        });
    });
    // let gameState = 0;
    //the ai's move selection
    // let botSelection = 0;
    // function selectMove() {
    //     if (playernumber == 0) {
    //         return false;
    //     }
    //     if (playernumber >= 2) {
    //         PassThrough;
    //     } else {
    //         console.log('WAITING FOR PLAYER 2 ');
    //         console.log(PLAYER_LIST);
    //     }
    //     //game is in result state
    //     gameState = 1;
    //     //send the ai's move to all connected players
    //     for (const socketId in PLAYER_LIST) {
    //         //! FOR NOW, PLAYER MOVES ARE RANDOMIZED
    //         if (PLAYER_LIST[socketId].id == 2) {
    //             let botSelection = PLAYER_LIST[socketId].move;
    //         }

    //         let playerWin = playerWinCheck(PLAYER_LIST[socketId].move);
    //         if (playerWin) {
    //             PLAYER_LIST[socketId].score += 1;
    //         }
    //         socket.emit(
    //             'gameResultState',
    //             botSelection,
    //             playerWin,
    //             PLAYER_LIST
    //         );
    //         // SOCKET_LIST[socketId].emit(
    //         //   "gameResultState",
    //         //   botSelection,
    //         //   playerWin,
    //         //   PLAYER_LIST
    //         // );
    //     }
    // }
    // function to check what's the outcome
    // function playerWinCheck(move) {
    //     let playerWins = false;
    //     //player chose rock
    //     if (move == 0) {
    //         //rock beats scissors
    //         if (botSelection == 2) {
    //             playerWins = true;
    //         }
    //     }
    //     //player chose paper
    //     if (move == 1) {
    //         //paper beats rock
    //         if (botSelection == 0) {
    //             playerWins = true;
    //         }
    //     }
    //     //player chose scissors
    //     if (move == 2) {
    //         //scissors beats paper
    //         if (botSelection == 1) {
    //             playerWins = true;
    //         }
    //     }
    //     return playerWins;
    // }
    // setInterval(function () {
    //     //select a move every 3 seconds
    //     selectMove();
    // }, 3000);
});

server.listen(4141);
