//
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection' , (socket) => {
    console.log('user connected!!');

    socket.on('disconnect' , () => {
    console.log("user disconnected!!");
    });
}); 
app.get('/' , (req,res) => {
    res.send('index.php');
});

http.listen(5000 , (e) => {

});
