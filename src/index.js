import "dotenv/config"
import express from "express";
import session from "express-session";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import realTimeProductsRoutes from "./routes/realTimeProductsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
//import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import sessionRoutes from "./routes/sessionRoutes.js";
import bodyParser from "body-parser";

const app = express();

//const fileStorage = FileStore(session)


// Middlewares ///////////////////////

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.engine("handlebars", engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    cartTotal: function (products) {
      return products.reduce((sum, product) => sum + product.quantity * product.productId.price, 0);
    },
    overallTotal: function (carts) {
      return carts.reduce((sum, cart) => sum + cart.products.reduce((cartSum, product) => cartSum + product.quantity * product.productId.price, 0), 0);
    }
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "views"));
app.use(session({
  //store: new fileStorage({path: './sessions', ttl: 30000, retries: 1}),
  store: MongoStore.create ({
    mongoUrl: process.env.MONGODBURL,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 300,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true, 
  saveUninitialized: true,
}));
// Para analizar solicitudes con contenido JSON
app.use(bodyParser.json());

// Para analizar solicitudes con datos de formularios URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////////////////


// CONFIG /////////////////////////////

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  const address = `http://localhost:${server.address().port}`;
  console.log(`Express por Local host ${address}`);
});

export const io = new Server(server);

///////////////////////////////////////


// ROUTES /////////////////////////////
app.use("/static", express.static(path.resolve(__dirname, "public")));
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/static/chat", chatRoutes(io));
app.use("/static/realtimeproducts", realTimeProductsRoutes);
app.use("/api/session", sessionRoutes);
//app.use("/users", userRoutes)

// Cookies
app.get("/setCookie", (req, res) => {
  res.cookie('CookieCookie', 'Esto es una cookie', { maxAge: 30000, signed: true }.signed('Cookie'))
})

app.get("/getCookie", (req, res) => {
  res.send(req.signedCookies)
})

// Session
app.get("/session", (req, res) => {
  if(req.session.counter) {
    req.sessionID.counter ++
    req.send(`Has entrado ${req.session.counter} de veces`)
  } else {
    req.session.counter = 1
    res.send("Hola!")
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(()=> {
    res.send("Deslogeaste")
  })
});

app.get("/login", (req, res) => {
  const {email, password} = res.body;
  if(email == "asd@asd.com" && password == "1234") {
    req.session.email= email
    req.session.password= password
    return res.send("Login")
  }
  return res.send("Login Fallido")
});

///////////////////////////////////////