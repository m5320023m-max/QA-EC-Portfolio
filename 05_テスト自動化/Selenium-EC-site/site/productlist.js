const products = {
    A: {
        name: "テスト商品A",
        price: 1000
    },
    B: {
        name: "テスト商品B",
        price: 2000
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = products;
}