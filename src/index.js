import "dotenv/config"
import express from "express";
import productRoutes from "./routes/productRoutes.js";
import realTimeProductsRoutes from "./routes/realTimeProductsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import path from "path";
import { Server } from "socket.io";


const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));


//Config
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  const address = `http://localhost:${server.address().port}`;
  console.log(`Express por Local host ${address}`);
});

export const io = new Server(server);


// Routes
app.use("/static", express.static(__dirname + "/public"));
app.use("/api/products", productRoutes);
//app.use("/api/carts", cartRoutes);
app.use("/static/chat", chatRoutes(io));
app.use("/static/realtimeproducts", realTimeProductsRoutes);
//app.use("/users", userRoutes)


