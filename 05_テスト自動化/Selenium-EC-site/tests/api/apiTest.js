const assert = require("node:assert/strict");

async function testGetProduct(productId, expectedName, expectedPrice) {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);

    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.name, expectedName);
    assert.equal(data.price, expectedPrice);
    console.log(`PASS [正常系] GET /api/products/${productId}`);
}

async function runTests() {
    try {
        await testGetProduct("A", "テスト商品A", 1000);
        await testGetProduct("B", "テスト商品B", 2000);
        await testGetProductNotFound();

        await testPostCalculate();
        await testPostCalculateNotFound();
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
}

runTests();

async function testGetProductNotFound() {
    const response = await fetch("http://localhost:3000/api/products/C");

    assert.equal(response.status, 404);

    const data = await response.text();
    assert.equal(data, "Not Found");

    console.log("PASS [異常系] GET /api/products/C：存在しない商品の404とNot Foundを確認");
}

async function testPostCalculate() {
    const response = await fetch("http://localhost:3000/api/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId: "A",
            quantity: 3
        })
    });

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.equal(data.productId, "A");
    assert.equal(data.quantity, 3);
    assert.equal(data.unitPrice, 1000);
    assert.equal(data.total, 3000);

    console.log("PASS [正常系] POST：商品Aを3個指定し、合計3000円になることを確認");
}

async function testPostCalculateNotFound() {
    const response = await fetch("http://localhost:3000/api/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId: "C",
            quantity: 3
        })
    });

    assert.equal(response.status, 404);

    const data = await response.text();
    assert.equal(data, "Not Found");

    console.log("PASS [異常系] POST：存在しない商品Cに対して404とNot Foundを確認");
}