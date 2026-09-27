//--------------------------------------------------------------------//
// 各種定義
//--------------------------------------------------------------------//
const {By, until} = require("selenium-webdriver");
const {checkText} = require("./utils");
const {resultPass} = require("./results");

async function runTC001(driver, testCase, testCaseId) {
    console.log(testCaseId + "：" + testCase.description);
    const check = testCase.checks[0];
    await checkText(driver, check);
    await resultPass(driver, testCaseId);
}

async function runTC002(driver, testCase, testCaseId) {
    console.log(testCaseId + "：" + testCase.description);

    const pdName = await checkText(driver,testCase.checks[0]);
    const pdPrice = await checkText(driver,testCase.checks[1]);
    await resultPass(driver, testCaseId);

    return {pdName,pdPrice};
}
async function runTC003(driver, testCase, testCaseId, pdName, pdPrice) {
    console.log(testCaseId + "：" + testCase.description);

    const detailLink = await driver.findElement(By.id("product-detail-link"));
    await detailLink.click();
    await driver.wait(until.stalenessOf(detailLink), 2000);
    const detailPdName = await checkText(driver,testCase.checks[0],pdName);
    await checkText(driver,testCase.checks[1],pdPrice);
    await resultPass(driver, testCaseId);

    return detailPdName;
}
async function runTC004(driver, testCase, testCaseId) {

    console.log(testCaseId + "：" + testCase.description);

    // 変更前のカート数量を取得
    const beforeCartCount = await driver.findElement(By.id("cart-count")).getText();

    // 不正値「0」を入力
    const quantityInput = await driver.findElement(By.id("quantity"));
    await quantityInput.clear();
    await quantityInput.sendKeys(testCase.inputValue);

    // カート追加
    await driver.findElement(By.id("add-cart")).click();


    // カート数量が変更前と同じことを確認
    await checkText(driver,testCase.checks[0],beforeCartCount);
    await resultPass(driver, testCaseId);
}
async function runTC005(driver, testCase, testCaseId) {
    console.log(testCaseId + "：" + testCase.description);

    // 「2」を入力
    const quantityInput = await driver.findElement(By.id("quantity"));
    await quantityInput.clear();
    await quantityInput.sendKeys(testCase.inputValue);
    const inputQuantity = await quantityInput.getAttribute("value");

    // カート追加
    await driver.findElement(By.id("add-cart")).click();
    await checkText(driver,testCase.checks[0],inputQuantity);
    await resultPass(driver, testCaseId);

    await driver.sleep(2000);

    return inputQuantity;
}
async function runTC006(driver, testCase, testCaseId, detailPdName) {
    console.log(testCaseId + "：" + testCase.description);

    await driver.findElement(By.id("cart-link")).click();
    await driver.wait(until.elementLocated(By.id("cart-product-name")),5000);
    await checkText(driver,testCase.checks[0],detailPdName);
    await resultPass(driver, testCaseId);
}
async function runTC007(driver,testCase,testCaseId,inputQuantity,pdPrice) {
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
async function runTC008(driver, testCase, testCaseId) {
    console.log(testCaseId + "：" + testCase.description);
    const check = testCase.checks[0];
    await checkText(driver, check);
    await resultPass(driver, testCaseId);
}


module.exports = {
    runTC001,runTC002,runTC003,runTC004,runTC005,runTC006,runTC007,runTC008
}