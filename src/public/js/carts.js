document.addEventListener('DOMContentLoaded', () => {
    const cartTotalElements = document.querySelectorAll('.cart-total');
    let overallTotal = 0;
  
    for (const cartTotalElement of cartTotalElements) {
      const products = JSON.parse(cartTotalElement.dataset.products);
      let cartTotal = 0;
  
      for (const product of products) {
        cartTotal += product.productId.price * product.quantity;
      }
  
      cartTotalElement.textContent = '$' + cartTotal.toFixed(2);
      overallTotal += cartTotal;
    }
  
    const overallTotalElement = document.getElementById('overall-total');
    overallTotalElement.textContent = '$' + overallTotal.toFixed(2);
});