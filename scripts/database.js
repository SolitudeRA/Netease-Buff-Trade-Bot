/*#######################################################################################

    数据库组件 使用Chrome Local存储

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/*========================================================================================

    交易信息管理

=========================================================================================*/

// 存储交易信息
async function saveTradeInformationDatabase(tradeInformation) {
    const key = tradeInformation.itemId + "_tradeInformation";
    return new Promise((resolve) => {
        chrome.storage.local.set({
            [key]: convertTradeInformationToJSON(tradeInformation)
        }, function () {
            console.log("已保存交易信息，键：" + key + "\n值：" + JSON.stringify(tradeInformation, null, 4));
            resolve();
        });
    });
}

// 查询交易信息
async function retrieveTradeInformationDatabase(itemID) {
    const key = itemID + "_tradeInformation";
    return new Promise((resolve) => {
        chrome.storage.local.get(key, function (result) {
            if (result.hasOwnProperty(key)) {
                console.log("已查询交易信息，键：" + key);
                resolve(convertJSONToTradeInformation(result[key]));
            } else {
                resolve(0);
            }
        });
    });
}

// 更新交易信息
async function updateTradeInformationDatabase(tradeInformation) {
    const key = tradeInformation.itemId + "_tradeInformation";
    return new Promise((resolve) => {
        chrome.storage.local.remove(key, function () {
            chrome.storage.local.set({
                [key]: convertTradeInformationToJSON(tradeInformation)
            }, function () {
                console.log("已更新交易信息，键：" + key + "\n更新后的值：" + JSON.stringify(tradeInformation, null, 4));
                resolve();
            });
        })
    });
}

// 销毁交易信息
async function destroyTradeInformationDatabase(itemID) {
    const key = itemID + "_tradeInformation";
    return new Promise((resolve) => {
        chrome.storage.local.remove(key, function () {
            console.log("已销毁交易信息，键：" + key);
            resolve();
        });
    });
}

/*========================================================================================

    监听状态管理

=========================================================================================*/

// 激活监听状态
async function activateMonitorStatusDatabase(itemID) {
    const key = itemID + "_monitorStatus";
    return new Promise((resolve) => {
        chrome.storage.local.set({
            [key]: true
        }, function () {
            console.log("已激活监听状态，键：" + key);
            resolve();
        })
    });
}

// 查询监听状态
async function retrieveMonitorStatusDatabase(itemID) {
    const key = itemID + "_monitorStatus";
    return new Promise((resolve) => {
        chrome.storage.local.get(key, function (result) {
            if (result.hasOwnProperty(key)) {
                console.log("已查询监听状态，键：" + key);
                resolve(result[key]);
            } else {
                resolve(0);
            }
        });
    });
}

// 销毁监听状态
async function destroyMonitorStatusDatabase(itemID) {
    const key = itemID + "_monitorStatus";
    return new Promise((resolve) => {
        chrome.storage.local.remove(key, function () {
            console.log("已销毁监听状态，键：" + key);
            resolve();
        });
    });
}

/*========================================================================================

    标签页&窗口管理

=========================================================================================*/

// 存储窗口ID
async function saveWindowIDDatabase(windowID) {
    return new Promise((resolve) => {
        chrome.storage.local.set({
            windowID: windowID
        }, function () {
            console.log("已保存窗口ID，ID为；" + windowID);
            resolve();
        });
    });
}

// 查询窗口ID
async function retrieveWindowIDDatabase() {
    return new Promise((resolve) => {
        chrome.storage.local.get("windowID", function (result) {
            if (result.hasOwnProperty("windowID")) {
                console.log("已查询窗口ID");
                resolve(result.windowID);
            } else {
                resolve(0);
            }
        });
    });
}

// 销毁窗口ID
async function destroyWindowIDDatabase() {
    return new Promise((resolve) => {
        chrome.storage.local.remove("windowID", function () {
            console.log("已销毁窗口ID")
            resolve();
        });
    });
}

// 存储标签页ID
async function saveTabIDDatabase(itemID, tabID) {
    const key = itemID + "_tabID";
    return new Promise((resolve) => {
        chrome.storage.local.set({
            [key]: tabID
        }, function () {
            console.log("已保存标签页ID，键：" + key + "，值：" + tabID);
            resolve();
        });
    });
}

// 查询标签页ID
async function retrieveTabIDDatabase(itemID) {
    const key = itemID + "_tabID";
    return new Promise((resolve) => {
        chrome.storage.local.get(key, function (result) {
            if (result.hasOwnProperty(key)) {
                console.log("已查询标签页ID，键：" + key);
                resolve(result[key]);
            } else {
                resolve(0);
            }
        });
    });
}

// 销毁标签页ID
async function destroyTabIDDatabase(itemID) {
    const key = itemID + "_tabID";
    return new Promise((resolve) => {
        chrome.storage.local.remove(key, function () {
            console.log("已销毁标签页ID，键：" + key);
            resolve();
        });
    });
}

// 存储我的求购标签页ID
async function saveWantedTabIDDatabase(tabID) {
    return new Promise((resolve) => {
        chrome.storage.local.set({
            wantedTabID: tabID
        }, function () {
            console.log("已保存我的求购标签页ID，值：" + tabID);
            resolve();
        });
    });
}

// 查询我的求购标签页ID
async function retrieveWantedTabIDDatabase() {
    return new Promise((resolve) => {
        chrome.storage.local.get("wantedTabID", function (result) {
            if (result.hasOwnProperty("wantedTabID")) {
                console.log("已查询我的求购标签页ID");
                resolve(result.wantedTabID);
            } else {
                resolve(0);
            }
        });
    });
}

// 销毁我的求购标签页ID
async function destroyWantedTabIDDatabase() {
    const key = "wantedTabID";
    return new Promise((resolve) => {
        chrome.storage.local.remove(key, function () {
            console.log("已销毁我的求购标签页ID");
            resolve();
        });
    });
}

/*========================================================================================

    定时任务管理

=========================================================================================*/

// 存储定时器ID
async function saveTaskScheduleID(itemID, taskScheduleID) {
    const key = itemID + "_taskScheduleID";
    return new Promise((resolve) => {
        chrome.storage.local.set({
            [key]: taskScheduleID
        }, function () {
            console.log("已保存计划任务ID，键：" + key + "，值：" + taskScheduleID);
            resolve();
        });
    });
}

// 查询定时器ID
async function retrieveTaskScheduleID(itemID) {
    const key = itemID + "_taskScheduleID";
    return new Promise((resolve) => {
        chrome.storage.local.get(key, function (result) {
            if (result.hasOwnProperty(key)) {
                console.log("已查询计划任务ID，键：" + key);
                resolve(result[key]);
            } else {
                resolve(0);
            }
        });
    });
}

// 销毁定时器ID
async function destroyTaskScheduleID(itemID) {
    const key = itemID + "_taskScheduleID";
    return new Promise((resolve) => {
        chrome.storage.local.remove(key, function () {
            console.log("已销毁计划任务ID，键：" + key);
            resolve();
        });
    });
}

/*========================================================================================

    工具函数

=========================================================================================*/

function convertTradeInformationToJSON(tradeInformation) {
    return JSON.stringify(tradeInformation);
}

function convertJSONToTradeInformation(tradeInformationJSONString) {
    return JSON.parse(tradeInformationJSONString);
}