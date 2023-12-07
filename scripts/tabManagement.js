/*#######################################################################################

    标签页/窗口管理组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/*========================================================================================

    窗口管理主函数

=========================================================================================*/

// 获取窗口ID
async function getWindowID() {
    return new Promise((resolve) => {
        retrieveWindowIDDatabase().then((windowID) => {
            resolve(windowID);
        });
    });
}

// 查询窗口是否存在
async function existWindowID(windowID) {
    return new Promise((resolve) => {
        chrome.windows.getAll(null, function (windows) {
            for (let window of windows) {
                if (window.id === windowID) {
                    resolve(true);
                }
            }
            resolve(false);
        });
    });
}

// 初始化窗口
async function initializeWindow() {
    return new Promise((resolve) => {
        chrome.windows.create({
            focused: false,
            url: "https://buff.163.com/market/buy_order/wait_supply?game=csgo"
        }, function (window) {
            saveWantedTabIDDatabase(window.tabs[0].id).then(() => {
                saveWindowIDDatabase(window.id).then(() => {
                    resolve(window.id);
                });
            });
        });
    });
}

// 移除窗口
async function removeWindow(windowID) {
    return new Promise((resolve) => {
        chrome.windows.remove(windowID, function () {
            destroyWindowIDDatabase().then(() => {
                resolve();
            });
        })
    });
}

/*========================================================================================

    标签页管理主函数

=========================================================================================*/

// 获取标签页
async function getTabID(itemID) {
    return new Promise((resolve) => {
        retrieveTabIDDatabase(itemID).then((tabID) => {
            resolve(tabID);
        });
    });
}

// 检测标签页是否存在
async function existTabInWindow(tabID, windowID) {
    return new Promise((resolve) => {
        chrome.tabs.query({
            windowId: windowID
        }, function (tabs) {
            for (let tab of tabs) {
                if (tab.id === tabID) {
                    resolve(true);
                }
            }
            resolve(false);
        });
    });
}

// 创建我的求购标签页
async function createWantedTabInWindow() {
    return new Promise((resolve) => {
        chrome.storage.local.get("windowID", function (result) {
            chrome.tabs.create({
                url: "https://buff.163.com/market/buy_order/wait_supply?game=csgo",
                windowId: result.windowID
            }, function (tab) {
                saveWantedTabIDDatabase(tab.id).then(() => {
                    resolve(tab.id);
                })
            });
        });
    });
}

// 获取我的求购标签页
async function getWantedTabID() {
    return new Promise((resolve) => {
        retrieveWantedTabIDDatabase().then((tabID) => {
            if (tabID !== 0){
                chrome.tabs.update(tabID,{
                    url: "https://buff.163.com/market/buy_order/wait_supply?game=csgo"
                },function (tab){
                   resolve(tabID);
                })
            }else {
                console.log("获取我的求购ID错误")
            }
        });
    });
}

// 创建新标签页
async function initializeTab(windowId, tradeInformation) {
    return new Promise((resolve) => {
        chrome.tabs.create({
            active: true,
            url: "https://buff.163.com/goods/" + tradeInformation.itemId + "#tab=buying",
            windowId: windowId
        }, function (tab) {
            saveTabIDDatabase(tradeInformation.itemId, tab.id).then(() => {
                resolve(tab.id);
            });
        });
    });
}

// 移除标签页
async function removeTab(tabId) {
    return new Promise((resolve) => {
        chrome.tabs.remove(tabId, function () {
            resolve();
        })
    });
}