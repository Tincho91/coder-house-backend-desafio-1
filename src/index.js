import express from "express";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/carts.js";
import realTimeProductsRoutes from "./routes/realTimeProductsRoutes.js";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import * as path from "path";
import { Server } from "socket.io";
import ProductManager from "./controller/ProductManager.js";


const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));


//Config
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>
  console.log(`Express por Local host ${server.address().port}`)
);

export const io = new Server(server);


// Routes
app.use("/static", express.static(__dirname + "/public"));
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/static/realtimeproducts", realTimeProductsRoutes);


const productManager = new ProductManager("src/data/products.json");
app.get("/static", async (req,res) => {
  let products = await productManager.getProducts();

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

