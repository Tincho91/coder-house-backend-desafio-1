import express from "express";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/carts.js";
import { __dirname } from "./path.js";
import multer from "multer";
import { engine } from "express-handlebars";
import * as path from "path";

const app = express();
const port = 8080;

//Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`)
  }
});

const upload = multer ({storage: storage});

 
//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));


//Routes
app.use("/", express.static(__dirname + "/public"));
app.use("/api/carts", cartRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req,res) => {

  const user = {
    nombre: "Martin",
    email: "martin@martin.com",
    role: "admin"
  }

  const cursos = [
    {numComision: 456987, dias: "Lunes a Viernes", horario: "20 a 22"},
    {numComision: 123654, dias: "Martes y Jueves", horario: "18 a 20"}
  ]

  res.render("home" , {
    title: "MI SERVER",
    mensaje: "MUNDO!",
    isAdmin: user.role === "admin",
    user,
    cursos
  })
})

app.post ('/upload', upload.single('product'), (req, res) => {
  console.log(req.file)
  res.send("Imagen Cargada")
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});