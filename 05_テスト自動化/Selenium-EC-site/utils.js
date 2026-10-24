//--------------------------------------------------------------------//
// 各種定義
//--------------------------------------------------------------------//
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const locators = require("./locators");
const testCases = require("./testCases.json");

/* testCase.jsonからケース検索 */
function getTestCase(id) {
    const testCase = testCases.find(testCase => testCase.id === id);

    if (!testCase) {
        throw new Error(`テストケースが見つかりません: ${id}`);
    }

    return testCase;
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
    if (check.target) {
        return locators[check.target];
    }
}

/* checkを受け取る→対象要素を探す→実際の文字を取得→
expectedと比較→取得した文字をreturnする */
async function checkText(driver, check, expected = check.expected, searchRoot = driver) {
    const actual = await searchRoot.findElement(createLocator(check)).getText();
    assert.strictEqual(actual, expected);

    return actual;
}

module.exports = {getTestCase,getLogTimestamp,createRunFolder,createLocator,checkText};