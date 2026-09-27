//--------------------------------------------------------------------//
// 各種定義
//--------------------------------------------------------------------//
const {Builder} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const testCases = require("./testCases.json");
const {createTestCaseId} = require("./utils");
const {writeLog,saveScreenshot} = require("./results");
const {runTC001,runTC002,runTC003,runTC004,runTC005,runTC006,runTC007,runTC008} = require("./testFunctions");

async function runTest() {

    const options = new chrome.Options();
    options.addArguments("--log-level=3");
    options.excludeSwitches("enable-logging");
    const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

    let tcNumber = 1;       // テストケース番号
    let tcString = "";      // TC-テストケース番号

    try {
        await driver.get("http://127.0.0.1:5500/index.html");

        tcString = createTestCaseId(tcNumber++);
        await runTC001(driver,testCases[0],tcString);

        tcString = createTestCaseId(tcNumber++);
        const { pdName, pdPrice } = await runTC002(driver,testCases[1],tcString);

        tcString = createTestCaseId(tcNumber++);
        const detailPdName = await runTC003(driver,testCases[2],tcString,pdName,pdPrice);

        tcString = createTestCaseId(tcNumber++);
        await runTC004(driver,testCases[3],tcString);

        tcString = createTestCaseId(tcNumber++);
        const inputQuantity = await runTC005(driver,testCases[4],tcString);

        tcString = createTestCaseId(tcNumber++);
        await runTC006(driver,testCases[5],tcString,detailPdName);

        tcString = createTestCaseId(tcNumber++);
        await runTC007(driver,testCases[6],tcString,inputQuantity,pdPrice);

        tcString = createTestCaseId(tcNumber++);
        await runTC008(driver,testCases[7],tcString);

    } catch (error) {
        await saveScreenshot(driver, tcString+"_FAIL");
        writeLog(tcString+" 結果：FAIL\nエラー内容："+error.message);
        console.log("結果：FAIL\nエラー内容："+error.message);
        console.log(error.stack);
        console.log("-----------------");
    } finally {
        await driver.quit();
    }
}

runTest();