//--------------------------------------------------------------------//
// 各種定義
//--------------------------------------------------------------------//
const {Builder} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {writeLog,saveScreenshot} = require("./results");
const { getTestCase } = require("./utils");
const {runTC001,runTC002,runTC003,runTC004,runTC005,runTC006,runTC007,runTC008} = require("./testFunctions");

async function runTest() {

    const options = new chrome.Options();
    options.addArguments("--headless=new");
    options.addArguments("--log-level=3");
    options.excludeSwitches("enable-logging");
    const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    const targetProductId = "B";
    let testCaseId = "";      // TC-テストケース番号

    try {
        await driver.get("http://127.0.0.1:5500/index.html");

        testCaseId = "TC-001";
        await runTC001(driver, getTestCase(testCaseId));

        testCaseId = "TC-002";
        const { pdName, pdPrice } = await runTC002(driver, getTestCase(testCaseId), targetProductId);

        testCaseId = "TC-003";
        const detailPdName = await runTC003(driver, getTestCase(testCaseId), pdName, pdPrice, targetProductId);

        // testCaseId = "TC-004";
        // await runTC004(driver, getTestCase(testCaseId));

        testCaseId = "TC-005";
        const inputQuantity = await runTC005(driver, getTestCase(testCaseId));
 
        testCaseId = "TC-006";
        await runTC006(driver, getTestCase(testCaseId), detailPdName);

        testCaseId = "TC-007";
        await runTC007(driver, getTestCase(testCaseId), inputQuantity, pdPrice);

        testCaseId = "TC-008";
        await runTC008(driver, getTestCase(testCaseId));

    } catch (error) {
        await saveScreenshot(driver, testCaseId+"_FAIL");
        writeLog(testCaseId+" 結果：FAIL\nエラー内容："+error.message);
        console.log("結果：FAIL\nエラー内容："+error.message);
        console.log(error.stack);
        console.log("-----------------");
        
        process.exitCode = 1;

    } finally {
        await driver.quit();

    }
}

runTest();