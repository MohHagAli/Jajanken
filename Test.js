var express = require('express')
const path = require('path');
var app = express()
const port = process.env.PORT || 8080;
// respond with "hello world" when a GET request is made to the homepage
// app.get('/', function (req, res) {
//   res.send('hello worldss')
// })

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});
app.listen(port);
console.log('Server started at http://localhost:' + port);


// SOCKET_LIST = {};
// var io = require('socket.io')(server);
// io.sockets.on('connection', function(socket){
              
//         console.log('new user!');
//         var socketId = Math.random();
//         SOCKET_LIST[socketId] = socket;
              
//         socket.on('sendMsgToServer',function(data){
        
//             console.log('someone sent a message!');
//             for(var i in SOCKET_LIST){
//             SOCKET_LIST[i].emit('addToChat', data);
          
//             }
          
//         });
	
//         socket.on('disconnect',function(){
                  
//             delete SOCKET_LIST[socket.id];
		
// 	});
	
// });

// server.listen(4141);