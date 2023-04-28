import "dotenv/config"
import express from "express";
import session from "express-session";
import passport from "passport";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import router from "./routes/routes.js";
import initializePassport from "./config/passport.js";

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
  store: MongoStore.create ({
    mongoUrl: process.env.MONGODBURL,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 300,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false, 
  saveUninitialized: false,
}));
// Para analizar solicitudes con contenido JSON
app.use(bodyParser.json());

// Para analizar solicitudes con datos de formularios URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

// Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

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

app.use('/', router);

///////////////////////////////////////