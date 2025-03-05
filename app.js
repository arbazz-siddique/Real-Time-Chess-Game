const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path");
const { title } = require("process");
const { log } = require("console");


const app = express();

const server =http.createServer(app);

const io = socket(server);

const chess = new Chess();

let player={};
let currentPlayers= "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req,res)=>{
    res.render("index", {title:"chess game"})
})

io.on("connection", function(socket){
    console.log("connected")
  
    if(!player.white){
        player.white= socket.id;
        socket.emit("playerRole", "w")
    }
    else if(!player.black){
        player.black = socket.id;
        socket.emit("playerRole", "b");
    }
    else{
        socket.emit("spectatorRole");
    }

    socket.on("disconnect", function(){
        if(socket.id === player.white){
            delete player.white;
        }
        else if(socket.id === player.black){
            delete player.black;
        }
    })

    socket.on("move", (move)=>{
        try{
            if(chess.turn() === "w" && socket.id !== player.white) return;
            if(chess.turn() === "b" && socket.id !== player.black) return;

            const result = chess.move(move);
            if(result){
                currentPlayers=chess.turn();
                io.emit("move", move)
                io.emit("boardState", chess.fen());
            }else{
                console.log("Invalid Moves ", move)
                socket.emit("invalid moves ", move)
            }
        }
        catch(err){
            console.log(err)
            socket.emit("Invlaid move ", move);
        }
    })
    
})

server.listen(3000, function(){
    console.log("Listening on prot 3000");    
})