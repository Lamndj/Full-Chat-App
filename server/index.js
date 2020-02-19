const express = require("express")
const socketio = require("socket.io")
const http = require("http")
const cors = require("cors")
var router = require("./router");

const PORT = process.env.PORT || 4000;

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(router);
app.use(cors);

const {AddUser,RemoveUser,GetUser,GetUserInRoom} = require("./Users")

io.on("connection", (socket) => {
    console.log("User has connected!");
    
    socket.on("join", ({name,room}, callback) => {
        const {error,user} = AddUser({id: socket.id,name,room})
        if(error){
            return callback(error)
        }

        socket.join(user.room);

        socket.emit("message", {user:"admin",text:`Hey ${user.name}, welcome to room ${user.room}`})
        socket.broadcast.to(user.room).emit("message", {user:"admin",text:`${user.name} has joined the chat!`})
        
        io.to(user.room).emit('roomData', { room: user.room, users: GetUserInRoom(user.room) });

        callback();
    })

    socket.on("sendMessage", (message,callback) => {
        const user = GetUser(socket.id)
        io.to(user.room).emit("message",{user:user.name,text:message})
        callback();
    })

    socket.on("disconnect", () => {
        const user = RemoveUser(socket.id);
        if(user){
            io.to(user.room).emit("message",{user:"admin",text:`${user.name} has left the chat.`})
            io.to(user.room).emit('roomData', { room: user.room, users: GetUserInRoom(user.room)});
        }
    })
})

server.listen(PORT, () => {console.log(`Server is running at port ${PORT}`)})