class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            alert("All fields are required");
            console.error("All fields are required");
            return;
        }
        if (this.products.find(product => product.code === code)) {
            alert("Code already exists");
            console.error("Code already exists");
            return;
        }
        const id = Math.floor(Math.random() * 100000000);
        this.products.push({
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        });

        alert("Product saved");
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("price").value = "";
        document.getElementById("thumbnail").value = "";
        document.getElementById("code").value = "";
        document.getElementById("stock").value = "";
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
}

const productManager = new ProductManager();

const addProductButton = document.getElementById("add-product-button");
const showAllProductsButton = document.getElementById("show-all-products-button");
const showProductByIdButton = document.getElementById("show-product-by-id-button");
const productListContainer = document.getElementById("product-list");
const productIdInput = document.getElementById("product-id-input");

addProductButton.addEventListener("click", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;
    productManager.addProduct(title, description, price, thumbnail, code, stock);
});

showAllProductsButton.addEventListener("click", () => {
    productListContainer.innerHTML = "";
    const products = productManager.getProducts();
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const productDiv = document.createElement("div");
        productDiv.innerHTML = `<p>Title: ${product.title}</p>
                                <p>Id: ${product.id}</p>
                                <p>Description: ${product.description}</p>
                                <p>Price: ${product.price}</p>
                                <p>Thumbnail: ${product.thumbnail}</p>
                                <p>Code: ${product.code}</p>
                                <p>Stock: ${product.stock}</p>`;
                                
        productListContainer.appendChild(productDiv);
    }
});

showProductByIdButton.addEventListener("click", () => {
    productListContainer.innerHTML = "";
    const productId = parseInt(document.getElementById("product-id-input").value);
    const product = productManager.getProductById(productId);
    if (product) {
        const productDiv = document.createElement("div");
        productDiv.innerHTML = `<p>Title: ${product.title}</p>
                                <p>Id: ${product.id}</p>
                                <p>Description: ${product.description}</p>
                                <p>Price: ${product.price}</p>
                                <p>Thumbnail: ${product.thumbnail}</p>
                                <p>Code: ${product.code}</p>
                                <p>Stock: ${product.stock}</p>`;
        productListContainer.appendChild(productDiv);
    } else {
        const errorMessage = document.createElement("p");
        errorMessage.innerHTML = "Product not found.";
        productListContainer.appendChild(errorMessage);
    }
});