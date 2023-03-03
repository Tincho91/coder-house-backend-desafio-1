import { Router } from "express";

const chatRoutes = (io) => {
  const data = {
    userId: null,
    message: null,
  };

  const router = Router();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Listen for setUserId events from clients
    socket.on("setUserId", (userId) => {
      console.log(`User ${userId} with socket id ${socket.id} logged in`);
    });

    // Listen for chat message events from clients
    socket.on("chat message", (data) => {
      console.log(`Message from ${data.userId}: ${data.message}`);

      // Emit the chat message to all clients except the sender
      socket.broadcast.emit("chat message", data);
    });

    // Listen for disconnect events from clients
    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });  
  });

  router.get("/", (req, res) => {    
    res.render("chat", {});  
  });

  return router;  
};


export default chatRoutes;