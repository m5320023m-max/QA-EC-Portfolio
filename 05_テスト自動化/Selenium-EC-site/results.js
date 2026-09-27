//--------------------------------------------------------------------//
// 各種定義
//--------------------------------------------------------------------//
const fs = require("fs");
const path = require("path");
const {createRunFolder,getLogTimestamp} = require("./utils");
const runFolder = createRunFolder();
const logFilePath = path.join(runFolder, "test.log");

function writeLog(message) {
    fs.appendFileSync(logFilePath,`[${getLogTimestamp()}] ${message}\n`);
}
/* スクリーンショット用 */
async function saveScreenshot(driver, testCaseId) {

    const image = await driver.takeScreenshot();
    const filePath = path.join(runFolder,`${testCaseId}.png`);
    fs.writeFileSync(filePath,image,"base64");
}
async function resultPass(driver, testCaseId) {
    writeLog(testCaseId + " 結果：PASS");
    console.log("結果：PASS");
    console.log("--------------------");
    await saveScreenshot(driver, testCaseId + "_PASS");
}

module.exports = {writeLog,saveScreenshot,resultPass};