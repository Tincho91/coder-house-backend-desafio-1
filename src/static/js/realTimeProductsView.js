const itemTableContent = document.getElementById("itemTableContent");
const socket = io();

socket.emit("message", "Conectado con el Cliente por Sockets");

socket.on("estado", (data) => {
  console.log(data);
});

const domLoad = (prod) => {
  itemTableContent.innerHTML += `

  <tr>
    <td>${prod.id}</td>
    <td class="itemLeft">${prod.title}</td>
    <td class="itemLeft">${prod.description}</td>
    <td>${prod.price}</td>
    <td class="imgConten">
      <img class="imgTable" src=${prod.thumbnail} alt=${prod.title}/>
    </td>
    <td>${prod.code}</td>
    <td>${prod.stock}</td>
    <td>
      <button class="btn btn-outline-primary edit-btn" data-id="${prod.id}" data-title="${prod.title}" data-description="${prod.description}" data-price="${prod.price}" data-thumbnail="${prod.thumbnail}" data-code="${prod.code}" data-stock="${prod.stock}">Edit</button>
      <button class="btn btn-outline-danger delete-btn" data-id="${prod.id}">Delete</button>
    </td>
  </tr>
  `;
};
// Edit Product
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    e.preventDefault();
    const id = e.target.getAttribute("data-id");
    const title = e.target.getAttribute("data-title");
    const description = e.target.getAttribute("data-description");
    const price = e.target.getAttribute("data-price");
    // Retrieve the input fields
    const editIdField = document.getElementById("editId");
    const editTitleField = document.getElementById("editTitle");
    const editDescriptionField = document.getElementById("editDescription");
    const editPriceField = document.getElementById("editPrice");
    const editThumbnailField = document.getElementById("editThumbnail");
    const editCodeField = document.getElementById("editCode");
    const editStockField = document.getElementById("editStock");

    // Populate the input fields with the data of the product to be edited
    editIdField.value = id;
    editTitleField.value = title;
    editDescriptionField.value = description;
    editPriceField.value = price;
    editThumbnailField.value = e.target.getAttribute("data-thumbnail");
    editCodeField.value = e.target.getAttribute("data-code");
    editStockField.value = e.target.getAttribute("data-stock");

    // Show the modal with the input fields
    const editModal = new bootstrap.Modal(
      document.getElementById("editModal"),
      {}
    );
    editModal.show();
  }
});

// Update Product
const updateProduct = (e) => {
  e.preventDefault();
  const id = editIdField.value;
  const title = editTitleField.value;
  const description = editDescriptionField.value;
  const price = editPriceField.value;
  const thumbnail = editThumbnailField.value;
  const code = editCodeField.value;
  const stock = editStockField.value;
  socket.emit("updateProduct", {
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  });
  editModal.hide();
};

// Delete Product
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    if (confirm("Are you sure you want to delete this product?")) {
      socket.emit("deleteProduct", id);
    }
  }
});

// Add Product
const addProductForm = document.getElementById("addProductForm");
addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  socket.emit("addProduct", {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  });
  addProductForm.reset();
});

// Receive product list
socket.on("productList", (products) => {
  itemTableContent.innerHTML = "";
  products.forEach((prod) => {
    domLoad(prod);
  });
});

// Receive product update
socket.on("productUpdate", (product) => {
  const itemToUpdate = document.querySelector(`[data-id="${product.id}"]`)
    .parentNode.parentNode;
  itemToUpdate.innerHTML = `
    
      <td>${product.id}</td>
      <td class="itemLeft">${product.title}</td>
      <td class="itemLeft">${product.description}</td>
      <td>${product.price}</td>
      <td class="imgConten">
        <img class="imgTable" src=${product.thumbnail} alt=${product.title}/>
      </td>
      <td>${product.code}</td>
      <td>${product.stock}</td>
      <td>
        <button class="btn btn-outline-primary edit-btn" data-id="${product.id}" data-title="${product.title}" data-description="${product.description}" data-price="${product.price}" data-thumbnail="${product.thumbnail}" data-code="${product.code}" data-stock="${product.stock}">Edit</button>
        <button class="btn btn-outline-danger delete-btn" data-id="${product.id}">Delete</button>
      </td>
    `;
});

// Receive product deletion
socket.on("productDeletion", (id) => {
  const itemToDelete = document.querySelector(`[data-id="${id}"]`).parentNode
    .parentNode;
  itemToDelete.remove();
});

// Update product
document.getElementById("updateForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("updateFormId").value;
  const title = document.getElementById("updateFormTitle").value;
  const description = document.getElementById("updateFormDescription").value;
  const price = document.getElementById("updateFormPrice").value;
  const thumbnail = document.getElementById("updateFormThumbnail").value;
  const code = document.getElementById("updateFormCode").value;
  const stock = document.getElementById("updateFormStock").value;

  const updatedProduct = {
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  };

  socket.emit("updateProduct", updatedProduct);

  // Clear form and close modal
  document.getElementById("updateForm").reset();
  const updateModal = document.getElementById("updateModal");
  const bsUpdateModal = new bootstrap.Modal(updateModal);
  bsUpdateModal.hide();
});

// Receive product update
socket.on("productUpdate", (updatedProduct) => {
  // Find and update product in table
  const items = document.querySelectorAll("#itemTableContent tr");
  for (let i = 0; i < items.length; i++) {
    if (items[i].querySelector("td").textContent === updatedProduct.id) {
      items[i].querySelectorAll("td")[1].textContent = updatedProduct.title;
      items[i].querySelectorAll("td")[2].textContent =
        updatedProduct.description;
      items[i].querySelectorAll("td")[3].textContent = updatedProduct.price;
      items[i]
        .querySelector("img")
        .setAttribute("src", updatedProduct.thumbnail);
      items[i].querySelector("img").setAttribute("alt", updatedProduct.title);
      items[i].querySelectorAll("td")[5].textContent = updatedProduct.code;
      items[i].querySelectorAll("td")[6].textContent = updatedProduct.stock;
      break;
    }
  }
});
