//--------------------------------------------------------------------//
// 各種定義
//--------------------------------------------------------------------//
const {until} = require("selenium-webdriver");
const {checkText} = require("./utils");
const {resultPass} = require("./results");
const locators = require("./locators");
const products = require("./site/productlist");
const assert = require("assert");

async function runTC001(driver, testCase) {
    const testCaseId = testCase.id;
    console.log(testCaseId + "：" + testCase.description);
    const check = testCase.checks[0];
    await checkText(driver, check);
    await resultPass(driver, testCaseId);
}

async function runTC002(driver, testCase, productId) {
    const testCaseId = testCase.id;
    console.log(testCaseId + "：" + testCase.description);

    const productElement = await driver.findElement(locators.productContainer(productId));
    const pdName = await checkText(driver,testCase.checks[0],products[productId].name,productElement);
    const pdPrice = await checkText(driver,testCase.checks[1],products[productId].price + "円",productElement);
    await resultPass(driver, testCaseId);

    return {pdName,pdPrice};
}
async function runTC003(driver, testCase, pdName, pdPrice, productId) {
    const testCaseId = testCase.id;
    console.log(testCaseId + "：" + testCase.description);

    const productElement = await driver.findElement(locators.productContainer(productId));
    const detailLink = await productElement.findElement(locators.listProductDetailLink);
    await detailLink.click();
    await driver.wait(until.stalenessOf(detailLink), 2000);
    const detailPdName = await checkText(driver,testCase.checks[0],pdName);
    await checkText(driver,testCase.checks[1],pdPrice);
    await resultPass(driver, testCaseId);

    return detailPdName;
}
async function runTC004(driver, testCase) {
    const testCaseId = testCase.id;

    console.log(testCaseId + "：" + testCase.description);
    const quantityElement = await driver.findElement(locators.quantity);

    // 判定用に1になるまで巣量を減らす
    while (Number(await quantityElement.getText()) > 1) {

        const beforeQuantity = Number(await quantityElement.getText());
        await driver.findElement(locators.decreaseQuantity).click();
        const afterQuantity = Number(await quantityElement.getText());
        assert.strictEqual(afterQuantity, beforeQuantity - 1);
    }

    // −ボタン押下判定
    await driver.findElement(locators.decreaseQuantity).click();
    await checkText(driver, testCase.checks[0]);
    await resultPass(driver, testCaseId);
}
async function runTC005(driver, testCase) {
    const testCaseId = testCase.id;
    console.log(testCaseId + "：" + testCase.description);

    // 押下前の数量を取得
    const beforeQuantity = Number(await driver.findElement(locators.quantity).getText());

    // ＋ボタンを押して数量を増やす
    await driver.findElement(locators.increaseQuantity).click();
    const inputQuantity = await driver.findElement(locators.quantity).getText();
    await checkText(driver, testCase.checks[0], String(beforeQuantity + 1));
    await resultPass(driver, testCaseId);

    return inputQuantity;
}
async function runTC006(driver, testCase, detailPdName) {
    const testCaseId = testCase.id;
    console.log(testCaseId + "：" + testCase.description);

    await driver.findElement(locators.cartLink).click();
    await driver.wait(until.elementLocated(locators.cartProductName),5000);
    await checkText(driver,testCase.checks[0],detailPdName);
    await resultPass(driver, testCaseId);
}
async function runTC007(driver,testCase,inputQuantity,pdPrice) {
    const testCaseId = testCase.id;
    console.log(testCaseId + "：" + testCase.description);

    const cartQuantity = await checkText(driver,testCase.checks[0],inputQuantity);
    console.log("カート数量：" + cartQuantity);
    const cartPrice = await checkText(driver,testCase.checks[1],pdPrice.replace("円", ""));
    console.log("カート単価：" + cartPrice);
    const expectedTotal = Number(pdPrice.replace("円", "")) * Number(inputQuantity);
    const cartTotal = await checkText(driver,testCase.checks[2],String(expectedTotal));
    console.log("カート合計：" + cartTotal);

    await resultPass(driver, testCaseId);
}
async function runTC008(driver, testCase) {
    const testCaseId = testCase.id;
    console.log(testCaseId + "：" + testCase.description);
    const check = testCase.checks[0];
    await checkText(driver, check);
    await resultPass(driver, testCaseId);
}


module.exports = {
    runTC001,runTC002,runTC003,runTC004,runTC005,runTC006,runTC007,runTC008
}