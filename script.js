let productCartHTML = document.querySelector(".product-cart");
let productCartArray = [];
let productCart = [];
let listProductCart = document.querySelector("#cart-list");
let totalPriceElement = document.querySelector("#total-price");
let cartEmptyMessage = document.querySelector("#cartempty");
let cartImage = document.querySelector(".cart img");
let cartCountElement = document.querySelector("#cart-count"); 
let cartApi = "./data.json";

fetch(cartApi)
  .then((response) => response.json())
  .then((data) => {
    productCartArray = data;
    showProductData();

    if (localStorage.getItem("cart")) {
      productCart = JSON.parse(localStorage.getItem("cart"));
      showCartToHTML();
    } else {
      updateCartCount(); // To initialize the cart count to 0 if no items in local storage
      updateTotalPrice(); 
    }
  });

// To show product cart data
function showProductData() {
  productCartHTML.innerHTML = "";
  if (productCartArray.length > 0) {
    productCartArray.forEach((i) => {
      let card = document.createElement("div");
      card.classList.add("item");
      card.dataset.id = i.id;
      card.innerHTML = `
        <div class="products" id="${i.id}">
          <img src="${i.image.desktop}" alt="" id="productImgs">
          <div class="inc_dec_btns">
            <button class="addToCart">Add to Cart</button>
          </div>
          <p id="category">${i.category}</p>
          <p id="name"><b>${i.name}</b></p>
          <p id="price"><b>$${i.price.toFixed(2)}</b></p>
        </div>`;
      productCartHTML.appendChild(card);
    });
  } else {
    productCartHTML.innerHTML = `<p>No products found</p>`;
  }
}

// This Event listener adds to Cart button
productCartHTML.addEventListener("click", (event) => {
  let cartPosition = event.target;
  if (cartPosition.classList.contains("addToCart")) {
    let productId = cartPosition.closest(".item").dataset.id;
    addToCart(parseInt(productId));
  }
});

// This is the function to add product to cart
function addToCart(productId) {
  let productCartPosition = productCart.findIndex(
    (value) => value.product == productId
  );

  if (productCartPosition < 0) {
    productCart.push({
      product: productId,
      quantity: 1,
    });
  } else {
    productCart[productCartPosition].quantity++;
  }

  showCartToHTML();
  addCartToLocalStorage();
  updateCartCount(); // The cart count is updated when an item is added
  updateTotalPrice(); // The total price is updated when an item is added 
}

// This function displays items in the cart
function showCartToHTML() {
  listProductCart.innerHTML = "";
  let totalQuantity = 0;
  let totalProduct = 0;

  if (productCart.length > 0) {
    // This hides empty cart message and image
    cartEmptyMessage.style.display = "none";
    cartImage.style.display = "none";

    productCart.forEach((cartItem) => {
      totalQuantity += cartItem.quantity;

      let productPosition = productCartArray.findIndex(
        (value) => value.id == cartItem.product
      );
      let productInformation = productCartArray[productPosition];

      totalProduct += productInformation.price * cartItem.quantity;

      let cartCard = document.createElement("li");
      cartCard.dataset.id = cartItem.product;

      cartCard.innerHTML = `
        <img src="${productInformation.image.desktop}" alt="" id="productImgs" width="50px"/>
        <button class="minus"> - </button>
        <p>${cartItem.quantity}</p>
        <button class="plus"> + </button>
        <p id="category">${productInformation.category}</p>
        <p id="price"><b>$${productInformation.price.toFixed(2)}</b></p>
        <hr>`;
      listProductCart.appendChild(cartCard);
    });

    totalPriceElement.innerText = `Total: $${totalProduct.toFixed(2)}`;
  } else {
    // This function shows empty cart message and image if there are no items in cart
    cartEmptyMessage.style.display = "block";
    cartImage.style.display = "block";
  }
}

// Save cart data to local storage
function addCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(productCart));
}

// This adds the click button to  + and - button in the cart
listProductCart.addEventListener("click", (event) => {
  let positionClick = event.target;
  let product = positionClick.closest("li").dataset.id;

  if (positionClick.classList.contains("minus") || positionClick.classList.contains("plus")) {
    let type = positionClick.classList.contains("plus") ? "plus" : "minus";
    changeCartQuantity(product, type);
  }
});

// This is the function to change cart item quantity
function changeCartQuantity(product, type) {
  let productCartPosition = productCart.findIndex(
    (value) => value.product == product
  );

  if (type === "plus") {
    productCart[productCartPosition].quantity++;
  } else {
    let newQuantity = productCart[productCartPosition].quantity - 1;
    if (newQuantity > 0) {
      productCart[productCartPosition].quantity = newQuantity;
    } else {
      productCart.splice(productCartPosition, 1);
    }
  }

  showCartToHTML();
  addCartToLocalStorage();
  updateCartCount(); // This is used to update the cart count after quantity change
  updateTotalPrice(); // This is used to update total price after quantity change
}

// This function is used to update cart item count
function updateCartCount() {
  let totalItems = productCart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.innerText = totalItems;
}

// This function is used to update total price
function updateTotalPrice() {
  if (productCart.length === 0) {
    totalPriceElement.innerText = "Total: $0.00"; // This will reset total to 0 if no items are added to the cart
  } else {
    let totalProduct = productCart.reduce((sum, cartItem) => {
      let product = productCartArray.find((p) => p.id == cartItem.product);
      return sum + product.price * cartItem.quantity;
    }, 0);

    totalPriceElement.innerText = `Total: $${totalProduct.toFixed(2)}`;
  }
}

