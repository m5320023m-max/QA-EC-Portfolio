//--------------------------------------------------------------------//
// 各種定義
//--------------------------------------------------------------------//
const fs = require("fs");
const path = require("path");
const { By } = require("selenium-webdriver");
const assert = require("assert");

/* テストケースID作成 */
function createTestCaseId(number) {
    return `TC-${String(number).padStart(3, "0")}`;
}

/* 現在時刻取得 */
function getTimeDates() {
    const now = new Date();

    return {
        year: now.getFullYear(),
        month: String(now.getMonth() + 1).padStart(2, "0"),
        day: String(now.getDate()).padStart(2, "0"),
        hour: String(now.getHours()).padStart(2, "0"),
        minute: String(now.getMinutes()).padStart(2, "0"),
        second: String(now.getSeconds()).padStart(2, "0"),
        millisecond: String(now.getMilliseconds()).padStart(3, "0")
    };
}

/* ログ用現在時刻取得 */
function getLogTimestamp() {
    const { hour, minute, second, millisecond } = getTimeDates();

    return `${hour}:${minute}:${second}.${millisecond}`;
}

/* フォルダ作成 */
function createRunFolder() {
    const { year, month, day, hour, minute, second } = getTimeDates();

    const folderName =
        `${year}${month}${day}_${hour}${minute}${second}`;

    const folderPath =
        path.join(__dirname, "selenium-results", folderName);

    fs.mkdirSync(folderPath, { recursive: true });

    return folderPath;
}

function createLocator(check) {
    if (check.locatorType === "css") {
        return By.css(check.locator);
    }

    if (check.locatorType === "id") {
        return By.id(check.locator);
    }
}

/* checkを受け取る→対象要素を探す→実際の文字を取得→
expectedと比較→取得した文字をreturnする */
async function checkText(driver, check, expected = check.expected) {
    const actual = await driver.findElement(createLocator(check)).getText();
    assert.strictEqual(actual, expected);

    return actual;
}

module.exports = {createTestCaseId,getLogTimestamp,createRunFolder,createLocator,checkText};