import { Router } from "express";
import { io } from "../index.js";

const chatRoutes = Router();

chatRoutes.get("/", (req,res) => {
    io.on('connection', (socket) => {
        console.log('A user connected');
      
        // Listen for chat messages
        socket.on('chat message', (msg) => {
          console.log('message: ' + msg);
      
          // Broadcast the message to all connected sockets
          io.emit('chat message', msg);
        });
      
        // Listen for disconnections
        socket.on('disconnect', () => {
          console.log('A user disconnected');
        });
    });
    res.render("chat", {})
});

export default chatRoutes;