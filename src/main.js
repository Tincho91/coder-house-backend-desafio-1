import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const productManager = new ProductManager("./products.json");

app.get("/products", async (req, res) => {
  let products = await productManager.getProducts();
  if (req.query.limit) {
    products = products.slice(0, req.query.limit);
  }
  res.send({ products });
});

app.get("/products/:pid", async (req, res) => {
  let product = await productManager.getProductById(req.params.pid);
  if (!product) {
    return res.status(404).send({ message: "Product not found" });
  }
  res.send({ product });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

// TESTING

/*
const addProduct = async () => {
  try {
    await productManager.addProduct({
      title: "Product 1",
      description: "This is a test product",
      price: 10,
      thumbnail: "thumbnail.jpg",
      code: "PRD1",
      stock: 100,
    });
    console.log("Product added successfully");
  } catch (error) {
    console.error(error);
  }
};

const getProducts = async () => {
  console.log(await productManager.getProducts());
};

const updateProduct = async () => {
  try {
    await productManager.updateProduct(
      1,
      "Updated Product 1",
      "This is an updated product",
      20,
      "updated-thumbnail.jpg",
      "UPD-PRD1",
      200
    );
    console.log("Product updated successfully");
  } catch (error) {
    console.error(error);
  }
};

const deleteProduct = async () => {
    productManager.deleteProduct(1);
};

const getProductById = async () => {
  console.log(await productManager.getProductById(4));
};

*/

//addProduct();
//getProducts();
//updateProduct();
//getProducts();
//deleteProduct();
//getProducts();
//getProductById();
