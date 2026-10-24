const { By } = require("selenium-webdriver");

const locators = {
    productName: By.id("product-name"),
    productPrice: By.id("product-price"),
    cartProductName: By.id("cart-product-name"),
    cartQuantity: By.id("cart-quantity"),
    cartPrice: By.id("cart-price"),
    cartTotal: By.id("cart-total"),
    quantity: By.id("quantity"),
    increaseQuantity: By.id("increase-quantity"),
    decreaseQuantity: By.id("decrease-quantity"),
    cartLink: By.id("cart-link"),
    pageTitle: By.css("h1"),
    productContainer: (productId) => By.css(`[data-product-id="${productId}"]`),
    listProductName: By.css("h2"),
    listProductPrice: By.css("p"),
    listProductDetailLink: By.css("a"),
};

module.exports = locators;