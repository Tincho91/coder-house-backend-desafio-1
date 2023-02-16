const socket = io();

socket.emit("mensaje", "Hola, me estoy conectando");

socket.on("evento-admin", (datos) => {
  console.log(datos);
});

socket.on("evento-general", (datos) => {
  console.log(datos);
});

socket.emit("productos");

socket.on("productos", function (productos) {
    const tableBody = document.querySelector("#table-body");
    let tableRows = "";
  
    productos.forEach((product) => {
      const row = `
        <tr>
          <td>${product.title}</td>
          <td>${product.id}</td>
          <td>${product.price}</td>
          <td>${product.stock}</td>
          <td>
            <img src="${product.thumbnail}" alt="Product thumbnail" />
          </td>
        </tr>
      `;
      tableRows += row;
    });
  
    tableBody.innerHTML = tableRows;
});

socket.on("product-added", product => {
    const tableBody = document.querySelector("tbody");
  
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    const tdTitle = document.createElement("td");
    const tdPrice = document.createElement("td");
    const tdThumbnail = document.createElement("td");
    const imgThumbnail = document.createElement("img");
  
    tdId.textContent = product.id;
    tdTitle.textContent = product.title;
    tdPrice.textContent = product.price;
    imgThumbnail.setAttribute("src", product.thumbnail);
    imgThumbnail.setAttribute("alt", "Product thumbnail");
    tdThumbnail.appendChild(imgThumbnail);
  
    tr.appendChild(tdId);
    tr.appendChild(tdTitle);
    tr.appendChild(tdPrice);
    tr.appendChild(tdThumbnail);
  
    tableBody.appendChild(tr);
});
