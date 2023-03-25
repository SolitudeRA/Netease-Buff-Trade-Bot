/*#######################################################################################

    插件后台监听器工具组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/*========================================================================================

    监听状态相关

=========================================================================================*/

//激活监听状态
function activateMonitorStatus(itemId) {
    return new Promise((resolve) => {
        saveToLocalStorage(itemId + "_monitorStatus" + true).then(() => {
            resolve();
        });
    });
}

//去除监听状态
function deactivateMonitorStatus(itemId) {
    return new Promise((resolve) => {
        saveToLocalStorage(itemId + "_monitorStatus" + false).then(() => {
            resolve();
        });
    });
}

//查询监听状态
function queryMonitorStatus(itemId) {
    return new Promise((resolve) => {
        getFromLocalStorage(itemId + "_monitorStatus").then((result) => {
            if (result[itemId + "_monitorStatus"] === true) {
                resolve(true);
            } else if (result[itemId + "_monitorStatus"] === false || JSON.stringify(object) === "{}") {
                resolve(false);
            } else {
                return Promise.reject(new Error("Query monitor status error"));
            }
        });
    });
}

/*========================================================================================

    计划任务相关

=========================================================================================*/

//注册计划任务
async function registerTaskSchedule(tradeInformation, taskSchedule) {
    return new Promise((resolve) => {
        chrome.alarms.create("taskSchedule_" + tradeInformation.itemId, taskSchedule);
        resolve();
    });
}

//更新计划任务
async function updateTaskSchedule(tradeInformation, taskSchedule) {
    chrome.alarms.clear("taskSchedule_" + tradeInformation.itemId, function(alarm) {
        return new Promise((resolve) => {
            chrome.alarms.create("taskSchedule_" + tradeInformation.itemId, taskSchedule);
            resolve();
        });
    });
}

//注销计划任务
async function cancelTaskSchedule(tradeInformation) {
    chrome.alarms.clear("taskSchedule_" + tradeInformation.itemId).then(() => {
        return Promise.resolve();
    });
}

//注销所有计划任务
async function cancelAllTaskSchedule() {
    chrome.alarms.clearAll().then(() => {
        return Promise.resolve();
    });
}

/*========================================================================================

    数据持久化相关

=========================================================================================*/

//将数据持久化至LocalStorage
async function saveToLocalStorage(key, value) {
    let payload  = {};
    payload[key] = value;
    return new Promise((resolve) => {
        chrome.storage.local.set(payload, function() {
            console.log("Persisted data" + JSON.stringify(payload));
            resolve();
        });
    });
}

//将数据从LocalStorage取出
async function getFromLocalStorage(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (object) => {
            resolve(object);
        });
    });
}

/*========================================================================================

    Window / Tab 管理相关

=========================================================================================*/

//创建新窗口
async function createWindow() {
    return new Promise((resolve) => {
        chrome.windows.create({focused: false}, async function(window) {
            await saveToLocalStorage("window_id", window.id);
            resolve(window.id);
        });
    });
}

//获取WindowId
async function getWindowId() {
    return new Promise((resolve) => {
        chrome.storage.local.get("window_id", function(windowId) {
            resolve(windowId.window_id);
        });
    });
}

//验证窗口是否存在
async function windowExist() {
    const windowId = await getWindowId();
    return new Promise((resolve) => {
        chrome.windows.getAll(function(windows) {
            for (let window of windows) {
                if (window.id === windowId) {
                    resolve(true);
                }
            }
            resolve(false);
        });
    });
}

//创建Tab
async function createTab(itemId, windowId) {
    return new Promise((resolve) => {
        chrome.tabs.create({
                               active  : false,
                               windowId: windowId,
                               url     : "https://buff.163.com/goods/" + itemId
                           }).then((tab) => {
            saveToLocalStorage(itemId + "_tabId", tab.id).then(() => {
                resolve(tab.id);
            });
        });
    });
}

//获取TabID
async function getTabId(itemId) {
    return new Promise((resolve) => {
        getFromLocalStorage(itemId + "_tabId").then((tabIdObject) => {
            if (JSON.stringify(tabIdObject) === "{}") {
                resolve({status: false});
            } else {
                resolve({status: true, payload: tabIdObject[itemId + "_tabId"]});
            }
        });
    });
}

//销毁Tab
async function destroyTab(itemId) {
    return new Promise((resolve) => {
        getFromLocalStorage(itemId + "_tabId").then((tabIdObject) => {
            chrome.tabs.remove(tabIdObject[itemId + "_tabId"]);
        }).then(() => {
            return Promise.resolve();
        });
    });
}

//创建求购列表tab
async function createWaitingSupplyTab(windowId) {
    return new Promise((resolve) => {
        chrome.tabs.create({
                               active  : false,
                               windowId: windowId,
                               url     : "https://buff.163.com/market/buy_order/wait_supply?game=csgo"
                           }, async function(tab) {
            await saveToLocalStorage("waitingSupplyTabId", tab.id);
            resolve(tab.id);
        });
    });
}

async function getWaitingSupplyTab(windowId) {
    return new Promise((resolve) => {
        chrome.storage.local.get("waitingSupplyTabId", function(payload) {
            resolve(payload.waitingSupplyTabId);
        });
    });
}

//生成新popup监控列表项
function createPopupMonitorOption(goodsId) {

}

//计算加价幅度
function getUpPrice(price) {
    if (price < 1000 && price >= 50) {
        price = 1;
    } else if (price < 50) {
        price = 0.1;
    } else {
        price = 10;
    }
    return price;
}
