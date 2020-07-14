var express = require('express');
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http)
var port = 3000;

app.use(express.static('./public'))

http.listen(port,function(){
  console.log('Server started at port '+ port + '. Nodemon is running.')
})

var allUsers = []; 

io.on('connection',(socket)=>{
  var clientId = socket.id;

  socket.on('new-user',(data)=>{
    var userExists = false; 
    if(!userExists){ 
      console.log('A new user joined - ' + data.name);
      allUsers.push({
        name: data.name,
        status: data.status,
        id: clientId,
        avatar: data.avatar
      }) 
     io.emit('new-user-online', allUsers)
    }
    socket.on('disconnect',(socket)=>{
      console.log('Someone has disconnected', socket)
      for(var i = 0; i < allUsers.length; i++){
        if(allUsers[i].id == clientId){ 
          allUsers.splice(i,1) 
          io.emit('new-user-online', allUsers)
        }
      }
    })
  })
})


