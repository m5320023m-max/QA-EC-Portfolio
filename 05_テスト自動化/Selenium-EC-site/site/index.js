const productList = document.getElementById("product-list");
Object.entries(products).forEach(([productId, product]) => {

    const productElement = document.createElement("div");
    productElement.dataset.productId = productId;

    /* 商品名 */
    const nameElement = document.createElement("h2");
    nameElement.textContent = product.name;
    productElement.appendChild(nameElement);

    /* 単価 */
    const priceElement = document.createElement("p");
    priceElement.textContent = product.price + "円";
    productElement.appendChild(priceElement);

    /* 商品詳細リンク */
    const detailLink = document.createElement("a");
    detailLink.href = `product.html?id=${productId}`;
    detailLink.textContent = "商品詳細を見る";
    productElement.appendChild(detailLink);

    productList.appendChild(productElement);
});