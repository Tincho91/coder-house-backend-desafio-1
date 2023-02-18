import express from "express";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/carts.js";
import { __dirname } from "./path.js";
import multer from "multer";
import { engine } from "express-handlebars";
import * as path from "path";
import { Server } from "socket.io";
import fs from "fs";
//import realTimeApp from "./routes/realTimeProducts.js";

const app = express();
const port = 8080;

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const io = new Server(server);

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`)
  }
});

const upload = multer ({storage: storage});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

// Socket.io
io.on("connection", (socket) => {
  console.log("Connection with socket established");

  socket.on("mensaje", info => { //Captura de info de cliente
    console.log(info);
  });

  socket.broadcast.emit("evento-admin", "Hola desde server, sos el admin");

  socket.emit("evento-general", "Hola a todos/as los/las usuarios/as");
});

// Routes
app.use("/", express.static(__dirname + "/public"));
app.use("/api/carts", cartRoutes);
app.use("/api/products", productRoutes);
//app.use("/realtimeproducts", realTimeApp);

// Home view
app.get("/", (req,res) => {
  const jsonContent = fs.readFileSync("src/data/products.json");
  const products = JSON.parse(jsonContent);

  res.render("index", {
    title: "My Server",
    mensaje: "Bienvenido",
    isAdmin: true,
    user: {
      nombre: "Martin",
      email: "martin@example.com",
      role: "admin"
    },
    products
  });
});