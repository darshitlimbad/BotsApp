const express = require('express');
const app = express();

const { createServer } = require('http');
const { Server } =  require('socket.io');

const mysql = require('mysql');

const cors = require('cors');

const server = createServer(app);
const PORT = 5000;

const DOMAIN = "localhost";

const io = new Server(server , {
    cors:{
        origin:"http://localhost",
        methods:["GET" , "POST"] ,
        credentials:true,
    },
});

class Mysql{
    constructor() {
        mysql.createConnection({
            host : "localhost" , 
            user : "root",
            password : "",
            database : "botsapp",
        });      
        console.log("hello maniak");  
    }

    getChatList = (userID) => {
        // weite fucking code for the list you idiot
    };
}

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('disconnect', (reason)=> {
        console.log('synack');
    })

    io.send("hello");
});


server.listen(PORT ,(err) => {
    if(err)
        console.error(err);
    else
        console.log("syn")
})