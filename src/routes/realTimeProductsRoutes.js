import { Router } from "express";
import ProductManager from "../controller/ProductManager.js";
import { io } from "../index.js";

const realTimeProductsRoutes = Router();
const productManager = new ProductManager("src/data/products.json");

realTimeProductsRoutes.get("/", async (req, res) => {
  //Websockets
  //Recibimos peticion de coneccion Cliente
  io.on("connection", (socket) => {
    socket.on("messaje", (data) => {
      console.log(data);
      //Mensaje del Servidor
      io.sockets.emit("estado", "Conectado con el Servidor por Sockets");
    });

    //Recivimos peticion de Consultar producto del cliente
    socket.on("getProduct", async (data) => {
      let byIdProducts = await productManager.getProductById(data);
      if (data === "") {
        io.sockets.emit("getProduct", {
          messaje: "Se consultaron todos los Productos",
          products: await productManager.getProducts(),
        });
      } else if (byIdProducts === "Producto no Encontrado") {
        io.sockets.emit("getProduct", {
          messaje: byIdProducts,
          products: [],
        });
      } else {
        io.sockets.emit("getProduct", {
          messaje: "Consulta Exitosa",
          products: [byIdProducts],
        });
      }
    });

    //Recivimos peticion de Agergar producto del cliente
    socket.on("addProduct", async (data) => {
      let addProduct = await productManager.addProduct(JSON.parse(data));
      io.sockets.emit("addProduct", {
        messaje: addProduct,
        products: await productManager.getProducts(),
      });
    });

    //Recibimos peticion de Actualizar producto
    socket.on("putProduct", async (data) => {
      let updateProduct = await productManager.updateProduct(
        data.id,
        JSON.parse(data.info)
      );
      io.sockets.emit("putProduct", {
        messaje: updateProduct,
        products: await productManager.getProducts(),
      });
    });

    //Recibimos peticion de Eliminar producto
    socket.on("deleteProduct", async (data) => {
      let deleteProduct = await productManager.deleteProduct(data);
      io.sockets.emit("deleteProduct", {
        messaje: deleteProduct,
        products: await productManager.getProducts(),
      });
    });
  });

  //Render por defecto
  let products = await productManager.getProducts();
  res.render("realTimeProducts", {
    title: "Handlebars & Websockets",
    products,
  });
});

export default realTimeProductsRoutes;