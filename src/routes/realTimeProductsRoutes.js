import { Router } from "express";
import { ProductManagerMongoDB } from "../dao/MongoDB/Controllers/ProductManager.js";

const realTimeProductsRoutes = Router();
const productManager = new ProductManagerMongoDB();

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
      try {
        let addProduct = await productManager.addProduct(data);
        io.sockets.emit("addProduct", {
          message: "Product added successfully",
          product: addProduct,
          products: await productManager.getProducts(),
        });
      } catch (error) {
        io.sockets.emit("addProduct", {
          message: error.message,
          products: await productManager.getProducts(),
        });
      }
    });

    //Recibimos peticion de Actualizar producto
    socket.on("addProduct", async (data) => {
      let addProduct = await productManager.addProduct(JSON.parse(data));
      io.sockets.emit("addProduct", {
        messaje: addProduct,
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