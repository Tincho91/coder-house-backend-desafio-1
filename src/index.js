import express from "express";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/carts.js";
//import { engine } from "express-handlebars";
//import * as path from "path";

const app = express();
const port = 8080;


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//app.engine("handlebars", engine());
//app.set("view engine", "handlebars");
//app.set("views", path.resolve(__dirname, "/views"))


//Routes
app.use("/api/carts", cartRoutes);
app.use("/api/products", productRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});