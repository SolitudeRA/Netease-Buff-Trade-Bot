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
        saveToLocalStorage(itemId + "_monitorStatus" + true);
        resolve();
    });
}

//去除监听状态
function deactivateMonitorStatus(itemId) {
    return new Promise((resolve) => {
        saveToLocalStorage(itemId + "_monitorStatus" + false);
        resolve();
    });
}

//查询监听状态
function queryMonitorStatus(itemId) {
    const object = getFromLocalStorage(itemId + "_monitorStatus");
    return new Promise((resolve) => {
        object.then((result) => {
            console.log(result[itemId + "_monitorStatus"]);
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

    数据持久化相关

=========================================================================================*/

//将数据持久化至LocalStorage
function saveToLocalStorage(key, value) {
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
function getFromLocalStorage(key) {
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

//验证Window是否存在
async function windowExist() {
    const windowId = await getWindowId();
    return new Promise((resolve) => {
        chrome.windows.getAll(async function(windows) {
            for (let window of windows) {
                if (window.id === windowId) {
                    resolve(true);
                }
            }
            const newWindowId = await createWindow();
            resolve(newWindowId);
        });
    });
}

async function createTab(goodsId, windowId) {
    return new Promise((resolve) => {
        chrome.tabs.create({
                               active  : false,
                               windowId: windowId,
                               url     : "https://buff.163.com/goods/" + goodsId
                           }, async function(tab) {
            await saveToLocalStorage(goodsId + "_tabId", tab.id);
            resolve(tab.id);
        });
    });
}


async function tabExist(goodsId, windowId) {
    return new Promise((resolve) => {

    });
}

async function destroyTab(goodsId) {

}

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
