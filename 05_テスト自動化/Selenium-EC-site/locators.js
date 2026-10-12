const { By } = require("selenium-webdriver");

const locators = {
    productName: By.id("product-name"),
    productPrice: By.id("product-price"),
    cartCount: By.id("cart-count"),
    cartProductName: By.id("cart-product-name"),
    cartQuantity: By.id("cart-quantity"),
    cartPrice: By.id("cart-price"),
    cartTotal: By.id("cart-total"),
    productDetailLink: By.id("product-detail-link"),
    quantity: By.id("quantity"),
    addCart: By.id("add-cart"),
    cartLink: By.id("cart-link"),
    pageTitle: By.css("h1")
};

module.exports = locators;