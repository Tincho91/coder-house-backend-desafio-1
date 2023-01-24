const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.idCounter = 0;

        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, "[]");
        }
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            throw new Error("All fields are required");
        }
        let products = await this.getProducts();
        if (products.find(p => p.code === product.code)) {
            throw new Error("Code already exists");
        }
        product.id = ++this.idCounter;
        products.push(product);
        await this.saveProducts(products);
    }

    async getProducts() {
        let products = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        return products;
    }

    async getProductById(id) {
        let products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async updateProduct(id, updatedProduct) {
        let products = await this.getProducts();
        let productIndex = products.findIndex(product => product.id === id);
        products[productIndex] = updatedProduct;
        await this.saveProducts(products);
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        products = products.filter(product => product.id !== id);
        await this.saveProducts(products);
    }

    async saveProducts(products) {
        let productsJson = JSON.stringify(products);
        fs.writeFileSync(this.path, productsJson);
    }
}

const path = './products.json';
const productManager = new ProductManager(path);


/*
////TESTING////
let product = {
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 19.99,
    thumbnail: "ruta/de/imagen.jpg",
    code: "P02",
    stock: 10
};

productManager.addProduct(product)
    .then(() => console.log("Producto agregado"))
    .catch(err => console.log(err));


productManager.getProducts()
    .then(products => console.log(products))
    .catch(err => console.log(err));

// Obtener un producto por su id
let productId = 1;
productManager.getProductById(productId)
    .then(product => console.log(product))
    .catch(err => console.log(err));


// Actualizar un producto
let updatedProduct = {
id: 1,
title: "Producto 1 actualizado",
description: "Descripción actualizada",
price: 21.99,
thumbnail: "ruta/de/imagen.jpg",
code: "P01",
stock: 12
};


productManager.updateProduct(productId, updatedProduct)
    .then(() => console.log("Producto actualizado"))
    .catch(err => console.log(err));


    // Eliminar un producto

productManager.deleteProduct(productId)
    .then(() => console.log("Producto eliminado"))
    .catch(err => console.log(err));
*/
