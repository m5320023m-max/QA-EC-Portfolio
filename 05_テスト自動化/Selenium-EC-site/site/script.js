const savedQuantity = localStorage.getItem("cartQuantity");

if (savedQuantity !== null) {
    document.getElementById("cart-count").textContent = savedQuantity;
}

const addCartButton = document.getElementById("add-cart");

addCartButton.addEventListener("click", () => {
    const quantity = document.getElementById("quantity").value;

    if (Number(quantity) < 1) {
        return;
    }

    const productName = document.getElementById("product-name").textContent;
    const productPrice = document.getElementById("product-price").textContent.replace("円", "");

    localStorage.setItem("cartQuantity", quantity);
    localStorage.setItem("cartProductName", productName);
    localStorage.setItem("cartPrice", productPrice);

    document.getElementById("cart-count").textContent = quantity;
});