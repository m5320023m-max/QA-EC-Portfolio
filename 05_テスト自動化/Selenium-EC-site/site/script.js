/* 商品識別用に入力された商品名＆価格を取得 */
const productId = new URLSearchParams(window.location.search).get("id");
const previousProductId = localStorage.getItem("cartProductId");
if (previousProductId !== productId) {
    localStorage.setItem("cartQuantity", 1);
}
localStorage.setItem("cartProductId", productId);
const savedQuantity = localStorage.getItem("cartQuantity");
if (savedQuantity !== null) {
    document.getElementById("quantity").textContent = Math.max(1, Number(savedQuantity));
}

async function loadProduct() {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);

    if (!response.ok) {
        throw new Error(`商品情報の取得に失敗しました: ${response.status}`);
    }

    const product = await response.json();

    localStorage.setItem("cartProductName", product.name);
    localStorage.setItem("cartPrice", product.price);
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-price").textContent = product.price + "円";
}

loadProduct().catch(console.error);

/* 商品増減 */
const increaseButton = document.getElementById("increase-quantity");
const decreaseButton = document.getElementById("decrease-quantity");

increaseButton.addEventListener("click", () => {
    const quantityElement = document.getElementById("quantity");
    const quantity = Number(quantityElement.textContent);

    quantityElement.textContent = quantity + 1;
    localStorage.setItem("cartQuantity", quantity + 1);
});
decreaseButton.addEventListener("click", () => {
    const quantityElement = document.getElementById("quantity");
    const quantity = Number(quantityElement.textContent);

    if (quantity <= 1) {
        return;
    }

    quantityElement.textContent = quantity - 1;
    localStorage.setItem("cartQuantity", quantity - 1);
});