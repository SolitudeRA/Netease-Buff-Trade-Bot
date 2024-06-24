/*#######################################################################################

    数据库组件 使用 Chrome Local Storage API 存储

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

/*========================================================================================

    交易信息管理 数据库组件

=========================================================================================*/

// 存储交易信息
async function saveTradeInformationDatabase(tradeInformation) {
    const storageKey = tradeInformation.itemId + STORAGE_KEY_TRADE_INFORMATION;
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            [storageKey]: convertTradeInformationToJSON(tradeInformation)
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [存储交易信息] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_INFO_DATABASE_UPDATE + " [交易信息]，键：" + storageKey + "\n值：" + JSON.stringify(tradeInformation, null, 4));
                resolve();
            }
        });
    });
}

// 查询交易信息
async function retrieveTradeInformationDatabase(itemID) {
    const storageKey = itemID + STORAGE_KEY_TRADE_INFORMATION;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询交易信息] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    console.info(LOG_STORAGE_RETRIEVED + " [交易信息]，键：" + storageKey + "，已返回查询值");
                    resolve(convertJSONToTradeInformation(result[storageKey]));
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [交易信息]，键：" + storageKey + "，返回默认值：0");
                    resolve(false);
                }
            }
        });
    });
}

// 更新交易信息
async function updateTradeInformationDatabase(tradeInformation) {
    const storageKey = tradeInformation.itemId + STORAGE_KEY_TRADE_INFORMATION;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            chrome.storage.local.set({
                [storageKey]: convertTradeInformationToJSON(tradeInformation)
            }, function () {
                if (chrome.runtime.lastError) {
                    console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [更新交易信息] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                    reject();
                } else {
                    console.info(LOG_STORAGE_UPDATED + " [交易信息]，键：" + storageKey + "\n更新后的值：" + JSON.stringify(tradeInformation, null, 4));
                    resolve();
                }
            });
        })
    });
}

// 销毁交易信息
async function deleteTradeInformationDatabase(itemID) {
    const storageKey = itemID + STORAGE_KEY_TRADE_INFORMATION;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁交易信息] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_DESTROYED + " [交易信息]，键：" + storageKey);
                resolve();
            }
        });
    });
}

/*========================================================================================

    监听状态管理 数据库组件

=========================================================================================*/

// 激活监听状态
async function activateMonitorStatusDatabase(itemID) {
    const storageKey = itemID + STORAGE_KEY_MONITOR_STATUS;
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            [storageKey]: true
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [激活监听状态] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info("已激活 [监听状态]，键：" + storageKey);
                resolve();
            }
        });
    });
}

// 暂停监听状态
async function pauseMonitorStatusDatabase(itemID) {
    const storageKey = itemID + STORAGE_KEY_MONITOR_STATUS;
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            [storageKey]: false
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [暂停监听状态] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info("已暂停 [监听状态]，键：" + storageKey);
                resolve();
            }
        });
    });
}

// 查询监听状态
async function retrieveMonitorStatusDatabase(itemID) {
    const storageKey = itemID + STORAGE_KEY_MONITOR_STATUS;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询监听状态] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    console.info(LOG_STORAGE_RETRIEVED + " [监听状态]，键：" + storageKey + "，已返回查询值");
                    resolve(result[storageKey]);
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [监听状态]，键：" + storageKey + "，返回默认值：0");
                    resolve(0);
                }
            }
        });
    });
}

// 销毁监听状态
async function deleteMonitorStatusDatabase(itemID) {
    const storageKey = itemID + STORAGE_KEY_MONITOR_STATUS;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁监听状态] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_DESTROYED + " [监听状态]，键：" + storageKey);
                resolve();
            }
        });
    });
}

/*========================================================================================

    标签页&窗口管理 数据库组件

=========================================================================================*/

/* ========================================== 窗口相关 ========================================== */

// 存储窗口ID
async function createWindowIDDatabase(windowID) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            [STORAGE_KEY_WINDOW]: windowID
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [存储窗口ID] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_INFO_DATABASE_UPDATE + " [窗口ID]，ID为；" + windowID);
                resolve();
            }
        });
    });
}

// 查询窗口ID
async function retrieveWindowIDDatabase() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(STORAGE_KEY_WINDOW, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询窗口ID] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(STORAGE_KEY_WINDOW)) {
                    console.info("已从数据库中查询 [窗口ID]，已返回查询值");
                    resolve(result.windowID);
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [窗口ID]，返回默认值：false")
                    resolve(false);
                }
            }
        });
    });
}

// 销毁窗口ID
async function deleteWindowIDDatabase() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(STORAGE_KEY_WINDOW, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁窗口ID] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_RETRIEVED + " [窗口ID]")
                resolve();
            }
        });
    });
}

/* ========================================== 标签页相关 ========================================== */

// 存储标签页ID
async function saveTabIDDatabase(itemID, tabID) {
    const storageKey = itemID + STORAGE_KEY_TAB;
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            [storageKey]: tabID
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [存储标签页ID] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_INFO_DATABASE_UPDATE + " [标签页ID]，键：" + storageKey + "，值：" + tabID);
                resolve(tabID);
            }
        });
    });
}

// 查询标签页ID
async function retrieveTabIDDatabase(itemID) {
    const storageKey = itemID + STORAGE_KEY_TAB;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询标签页ID] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    console.info("已从数据库中查询 [标签页ID]，键：" + storageKey + "，已返回查询值");
                    resolve(result[storageKey]);
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [标签页ID]，键：" + storageKey + "，返回默认值：false");
                    resolve(false);
                }
            }
        });
    });
}

// 销毁标签页ID
async function deleteTabIDDatabase(itemID) {
    const storageKey = itemID + STORAGE_KEY_TAB;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁标签页ID] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_RETRIEVED + " [标签页ID]，键：" + storageKey);
                resolve();
            }
        });
    });
}

// 存储/刷新我的求购标签页ID
async function updateWantedTabIDDatabase(tabID, page) {
    const storageKey = page + STORAGE_KEY_TAB_WANTED;
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            [storageKey]: tabID
        }, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseUpdating(COMPONENT_NAME_WANTED_TAB, LOG_KEYWORD_ID, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseUpdated(COMPONENT_NAME_WANTED_TAB, LOG_KEYWORD_ID, storageKey, tabID);
                resolve();
            }
        });
    });
}

// 查询我的求购标签页ID
async function retrieveWantedTabIDDatabase(page) {
    const storageKey = page + STORAGE_KEY_TAB_WANTED;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                errorDatabaseUpdating(COMPONENT_NAME_WANTED_TAB, LOG_KEYWORD_ID, chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    infoDatabaseRetrieved(COMPONENT_NAME_WANTED_TAB, LOG_KEYWORD_ID, storageKey, result[storageKey]);
                    resolve(result[storageKey]);
                } else {
                    infoDatabaseNotRetrieved(COMPONENT_NAME_WANTED_TAB, LOG_KEYWORD_ID);
                    resolve(-1);
                }
            }
        });
    });
}

// 销毁我的求购标签页ID
async function deleteWantedTabIDDatabase(page) {
    const storageKey = page + STORAGE_KEY_TAB_WANTED;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseDeleting(COMPONENT_NAME_WANTED_TAB, LOG_KEYWORD_ID, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseDeleted(COMPONENT_NAME_WANTED_TAB, LOG_KEYWORD_ID);
                resolve();
            }
        });
    });
}

/*========================================================================================

    计划任务管理 数据库组件

=========================================================================================*/

// 存储计划任务定时器ID
async function saveTaskScheduleID(itemID, taskScheduleID) {
    const storageKey = itemID + STORAGE_KEY_TASK_SCHEDULE_MAIN;
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            [storageKey]: taskScheduleID
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [存储定时器ID] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_INFO_DATABASE_UPDATE + " [计划任务ID]，键：" + storageKey + "，值：" + taskScheduleID);
                resolve();
            }
        });
    });
}

// 查询计划任务定时器ID
async function retrieveTaskScheduleID(itemID) {
    const storageKey = itemID + STORAGE_KEY_TASK_SCHEDULE_MAIN;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询定时器ID] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    console.info(LOG_STORAGE_RETRIEVED + " [计划任务ID]，键：" + storageKey + "，已返回查询值");
                    resolve(result[storageKey]);
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [计划任务ID]，键：" + storageKey + "，返回默认值：0");
                    resolve(false);
                }
            }
        });
    });
}

// 销毁计划任务定时器ID
async function deleteTaskScheduleID(itemID) {
    const storageKey = itemID + STORAGE_KEY_TASK_SCHEDULE_MAIN;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁定时器ID] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_RETRIEVED + " [计划任务ID]，键：" + storageKey);
                resolve();
            }
        });
    });
}

// 存储计划任务执行时间戳
async function saveTaskScheduleExecutedTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_TASK_SCHEDULE_MAIN_EXECUTED_TIMESTAMP;
    return new Promise((resolve, reject) => {
        let timeStamp = Date.now();
        chrome.storage.local.set({
            [storageKey]: timeStamp
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [存储计划任务执行时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_INFO_DATABASE_UPDATE + " [计划任务执行时间戳]，键：" + storageKey + "，值：" + timeStamp);
                resolve();
            }
        });
    });
}

//查询计划任务执行时间戳
async function retrieveTaskScheduleExecutedTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_TASK_SCHEDULE_MAIN_EXECUTED_TIMESTAMP;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询计划任务执行时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    console.info(LOG_STORAGE_RETRIEVED + " [计划任务执行时间戳]，键：" + storageKey + "，已返回查询值");
                    resolve(result[storageKey]);
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [计划任务执行时间戳]，键：" + storageKey + "，返回默认值：0");
                    resolve(0);
                }
            }
        });
    });
}

//销毁计划任务执行时间戳
async function deleteTaskScheduleExecutedTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_TASK_SCHEDULE_MAIN_EXECUTED_TIMESTAMP;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁计划任务执行时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_RETRIEVED + " [计划任务执行时间戳]，键：" + storageKey);
                resolve();
            }
        });
    });
}

async function updateTaskScheduleExecuteStatus(itemID){
    const storageKey = itemID + STORAGE_KEY_TASK_SCHEDULE_MAIN_EXECUTE_STATUS;
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            [storageKey]: true
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [存储计划任务执行状态] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_INFO_DATABASE_UPDATE + " [计划任务执行状态]，键：" + storageKey + "，值：" + true);
                resolve();
            }
        });
    });
}

async function retrieveTaskScheduleExecuteStatus(itemID){
    const storageKey = itemID + STORAGE_KEY_TASK_SCHEDULE_MAIN_EXECUTE_STATUS;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询计划任务执行状态] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    console.info(LOG_STORAGE_RETRIEVED + " [计划任务执行状态]，键：" + storageKey + "，已返回查询值");
                    resolve(result[storageKey]);
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [计划任务执行状态]，键：" + storageKey + "，返回默认值：0");
                    resolve(false);
                }
            }
        });
    });
}

async function deleteTaskScheduleExecuteStatus(itemID){
    const storageKey = itemID + STORAGE_KEY_TASK_SCHEDULE_MAIN_EXECUTE_STATUS;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁计划任务执行状态] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_RETRIEVED + " [计划任务执行状态]，键：" + storageKey);
                resolve();
            }
        });
    });
}

// 存储/刷新物品出价时间戳
async function savePostWantedTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_POST_WANTED_TIMESTAMP;
    return new Promise((resolve, reject) => {
        let timeStamp = Date.now();
        chrome.storage.local.set({
            [storageKey]: timeStamp
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [存储/刷新物品出价时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_INFO_DATABASE_UPDATE + " [物品出价时间戳]，键：" + storageKey + "，值：" + timeStamp);
                resolve();
            }
        });
    });
}

// 查询物品出价时间戳
async function retrievePostWantedTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_POST_WANTED_TIMESTAMP;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询物品出价时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    console.info(LOG_STORAGE_RETRIEVED + " [物品出价时间戳]，键：" + storageKey + "，已返回查询值");
                    resolve(result[storageKey]);
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [物品出价时间戳]，键：" + storageKey + "，返回默认值：0");
                    resolve(0);
                }
            }
        });
    });
}

// 销毁物品出价时间戳
async function deletePostWantedTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_POST_WANTED_TIMESTAMP;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁物品出价时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_RETRIEVED + " [物品出价时间戳]，键：" + storageKey);
                resolve();
            }
        });
    });
}

// 存储物品详情页面刷新时间戳
async function saveItemTabReloadTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_ITEM_PAGE_RELOAD_TIMESTAMP;
    return new Promise((resolve, reject) => {
        let timeStamp = Date.now();
        chrome.storage.local.set({
            [storageKey]: timeStamp
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [存储页面刷新时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_INFO_DATABASE_UPDATE + " [页面自动刷新时间戳]，键：" + storageKey + "值：" + timeStamp);
                resolve();
            }
        });
    });
}

// 查询物品详情页面刷新时间戳
async function retrieveItemTabReloadTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_ITEM_PAGE_RELOAD_TIMESTAMP;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询页面刷新时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    console.info(LOG_STORAGE_RETRIEVED + " [页面刷新时间戳]，键：" + storageKey + "，已返回查询值");
                    resolve(result[storageKey]);
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [页面刷新时间戳]，键：" + storageKey + "，返回默认值：0");
                    resolve(0);
                }
            }
        });
    });
}

// 销毁物品详情页面刷新时间戳
async function deleteItemTabReloadTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_ITEM_PAGE_RELOAD_TIMESTAMP;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁页面刷新时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_RETRIEVED + " [页面刷新时间戳]，键：" + storageKey);
                resolve();
            }
        });
    });
}

// 存储物品详情页面刷新间隔
async function saveItemTabReloadInterval(itemID) {
    const storageKey = itemID + STORAGE_KEY_ITEM_PAGE_RELOAD_INTERVAL;
    return new Promise((resolve, reject) => {
        let reloadInterval = randomGeneratorItemPageReload();
        chrome.storage.local.set({
            [storageKey]: reloadInterval
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [存储页面刷新间隔] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_INFO_DATABASE_UPDATE + " [页面自动刷新间隔]，键：" + storageKey + "值：" + reloadInterval);
                resolve();
            }
        });
    });
}

// 查询物品详情页面刷新间隔
async function retrieveItemTabReloadInterval(itemID) {
    const storageKey = itemID + STORAGE_KEY_ITEM_PAGE_RELOAD_INTERVAL;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询页面刷新间隔] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    console.info(LOG_STORAGE_RETRIEVED + " [页面刷新间隔]，键：" + storageKey + "，已返回查询值");
                    resolve(result[storageKey]);
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [页面刷新间隔]，键：" + storageKey + "，返回默认值：0");
                    resolve(0);
                }
            }
        });
    });
}

// 销毁物品详情页面刷新间隔
async function deleteItemTabReloadInterval(itemID) {
    const storageKey = itemID + STORAGE_KEY_ITEM_PAGE_RELOAD_INTERVAL;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁页面刷新间隔] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_RETRIEVED + " [页面刷新间隔]，键：" + storageKey);
                resolve();
            }
        });
    });
}

// 存储/刷新我的求购页面刷新时间戳
async function updateWantedTabReloadTimeStamp(page) {
    const storageKey = page + STORAGE_KEY_WANTED_TAB_RELOAD_TIMESTAMP;
    return new Promise((resolve, reject) => {
        let timeStamp = Date.now();
        chrome.storage.local.set({
            [storageKey]: timeStamp
        }, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseUpdating(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_TIME_STAMP, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseUpdated(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_TIME_STAMP, storageKey, timeStamp);
                resolve();
            }
        })
    });
}

// 查询我的求购页面刷新时间戳
async function retrieveWantedTabReloadTimeStamp(page) {
    const storageKey = page + STORAGE_KEY_WANTED_TAB_RELOAD_TIMESTAMP;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                errorDatabaseRetrieving(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_TIME_STAMP, chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    infoDatabaseRetrieved(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_TIME_STAMP, storageKey, result[storageKey]);
                    resolve(result[storageKey]);
                } else {
                    infoDatabaseNotRetrieved(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_TIME_STAMP);
                    resolve(0);
                }
            }
        });
    });
}

// 销毁我的求购页面刷新时间戳
async function deleteWantedTabReloadTimeStamp(page) {
    const storageKey = page + STORAGE_KEY_WANTED_TAB_RELOAD_TIMESTAMP;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁我的求购页面刷新时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                errorDatabaseDeleting(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_TIME_STAMP, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseDeleted(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_TIME_STAMP);
                resolve();
            }
        });
    });
}

// 存储/刷新我的求购页面刷新间隔
async function updateWantedTabReloadInterval(page) {
    const storageKey = page + STORAGE_KEY_WANTED_TAB_RELOAD_INTERVAL;
    return new Promise((resolve, reject) => {
        let reloadInterval = randomGeneratorWantedPageReload();
        chrome.storage.local.set({
            [storageKey]: reloadInterval
        }, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseUpdating(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_INTERVAL, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseUpdated(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_INTERVAL, storageKey, reloadInterval);
                resolve();
            }
        })
    });
}

// 查询我的求购页面刷新间隔
async function retrieveWantedTabReloadInterval(page) {
    const storageKey = page + STORAGE_KEY_WANTED_TAB_RELOAD_INTERVAL;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                errorDatabaseRetrieving(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_INTERVAL, chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    infoDatabaseRetrieved(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_INTERVAL, storageKey, result[storageKey]);
                    resolve(result[storageKey]);
                } else {
                    infoDatabaseNotRetrieved(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_INTERVAL);
                    resolve(0);
                }
            }
        });
    });
}

// 销毁我的求购页面刷新间隔
async function deleteWantedTabReloadInterval(page) {
    const storageKey = page + STORAGE_KEY_WANTED_TAB_RELOAD_INTERVAL;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseDeleting(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_INTERVAL, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseDeleted(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_INTERVAL);
                resolve();
            }
        });
    });
}

// 存储/刷新交易暂挂时间戳
async function saveSupplyItemHangedUpTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_SUPPLY_ITEM_HANGUP_TIMESTAMP;
    return new Promise((resolve, reject) => {
        let timeStamp = Date.now();
        chrome.storage.local.set({
            [storageKey]: timeStamp
        }, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [存储/刷新交易暂挂时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_INFO_DATABASE_UPDATE + " [交易暂挂时间戳]，键：" + storageKey + "值：" + timeStamp);
                resolve();
            }
        });
    });
}

// 查询交易暂挂时间戳
async function retrieveSupplyItemHangedUpTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_SUPPLY_ITEM_HANGUP_TIMESTAMP;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [查询交易暂挂时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    console.info(LOG_STORAGE_RETRIEVED + " [交易暂挂时间戳]，键：" + storageKey + "，已返回查询值");
                    resolve(result[storageKey]);
                } else {
                    console.info(LOG_STORAGE_NOT_RETRIEVED + " [交易暂挂时间戳]，键：" + storageKey + "，返回默认值：-1");
                    resolve(-1);
                }
            }
        });
    });
}

// 销毁交易暂挂时间戳
async function deleteSupplyItemHangedUpTimeStamp(itemID) {
    const storageKey = itemID + STORAGE_KEY_SUPPLY_ITEM_HANGUP_TIMESTAMP;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                console.error(EXCEPTION_PREFIX_CHROME_STORAGE + " [销毁交易暂挂时间戳] " + EXCEPTION_SUFFIX_COMPONENT + chrome.runtime.lastError);
                reject();
            } else {
                console.info(LOG_STORAGE_RETRIEVED + " [交易暂挂时间戳]，键：" + storageKey);
                resolve();
            }
        });
    });
}

// 存储/刷新我的求购页面刷新计划任务ID
async function updateWantedTabReloadTaskID(wantedTabPage, taskScheduleID) {
    const storageKey = wantedTabPage + STORAGE_KEY_WANTED_TAB_RELOAD_TASK_ID;
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            [storageKey]: taskScheduleID
        }, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseUpdating(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_ID, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseUpdated(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_ID, storageKey, taskScheduleID);
                resolve();
            }
        });
    });
}

// 查询我的求购页面刷新计划任务ID
async function retrieveWantedTabReloadTaskID(wantedTabPage) {
    const storageKey = wantedTabPage + STORAGE_KEY_WANTED_TAB_RELOAD_TASK_ID;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, function (result) {
            if (chrome.runtime.lastError) {
                errorDatabaseRetrieving(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_ID, chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(storageKey)) {
                    infoDatabaseRetrieved(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_ID, storageKey, result[storageKey]);
                    resolve(result[storageKey]);
                } else {
                    infoDatabaseNotRetrieved(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_ID, storageKey);
                    resolve(-1);
                }
            }
        });
    });
}

// 销毁我的求购页面刷新计划任务ID
async function deleteWantedTabReloadTaskID(wantedTabPage) {
    const storageKey = wantedTabPage + STORAGE_KEY_WANTED_TAB_RELOAD_TASK_ID;
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(storageKey, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseDeleting(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_ID, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseDeleted(COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD, LOG_KEYWORD_ID, storageKey);
                resolve();
            }
        });
    });
}

/*========================================================================================

    队列管理 数据库组件

=========================================================================================*/

/* ========================================== 监听任务队列 ========================================== */
async function createActiveMonitorQueue(tradeInformation) {
    return new Promise((resolve, reject) => {
        let activeMonitorQueue = [tradeInformation];
        chrome.storage.local.set({[STORAGE_KEY_ACTIVE_MONITOR_QUEUE]: activeMonitorQueue}, () => {
            if (chrome.runtime.lastError) {
                errorDatabaseInitializing(COMPONENT_NAME_MONITOR, LOG_KEYWORD_QUEUE, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseInitialized(COMPONENT_NAME_MONITOR, LOG_KEYWORD_QUEUE);
                resolve(activeMonitorQueue);
            }
        })
    });
}

async function retrieveActiveMonitorQueue() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(STORAGE_KEY_ACTIVE_MONITOR_QUEUE, (result) => {
            if (chrome.runtime.lastError) {
                errorDatabaseRetrieving(COMPONENT_NAME_MONITOR, LOG_KEYWORD_QUEUE, chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(STORAGE_KEY_ACTIVE_MONITOR_QUEUE)) {
                    infoDatabaseRetrieved(COMPONENT_NAME_MONITOR, LOG_KEYWORD_QUEUE, STORAGE_KEY_ACTIVE_MONITOR_QUEUE, result[STORAGE_KEY_ACTIVE_MONITOR_QUEUE]);
                    resolve(result[STORAGE_KEY_ACTIVE_MONITOR_QUEUE]);
                } else {
                    infoDatabaseNotRetrieved(COMPONENT_NAME_MONITOR, LOG_KEYWORD_QUEUE);
                    resolve(false);
                }
            }
        });
    });
}

async function updateActiveMonitorQueue(activeMonitorQueue) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({[STORAGE_KEY_ACTIVE_MONITOR_QUEUE]: activeMonitorQueue}, () => {
            if (chrome.runtime.lastError) {
                errorDatabaseUpdating(COMPONENT_NAME_MONITOR, LOG_KEYWORD_QUEUE, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseUpdated(COMPONENT_NAME_MONITOR, LOG_KEYWORD_QUEUE, STORAGE_KEY_ACTIVE_MONITOR_QUEUE, activeMonitorQueue);
                resolve();
            }
        })
    });
}

async function deleteActiveMonitorQueue() {
    return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove(STORAGE_KEY_ACTIVE_MONITOR_QUEUE, function () {
                if (chrome.runtime.lastError) {
                    errorDatabaseDeleting(COMPONENT_NAME_MONITOR, LOG_KEYWORD_QUEUE, chrome.runtime.lastError);
                    reject();
                } else {
                    infoDatabaseDeleted(COMPONENT_NAME_MONITOR, LOG_KEYWORD_QUEUE);
                    resolve();
                }
            });
        });
    });
}

/* ========================================== 取消求购队列 ========================================== */
async function createCancelWantedQueue(tradeInformation) {
    return new Promise((resolve, reject) => {
        let cancelWantedQueue = [tradeInformation];
        chrome.storage.local.set({[STORAGE_KEY_CANCEL_WANTED_QUEUE]: cancelWantedQueue}, () => {
            if (chrome.runtime.lastError) {
                errorDatabaseInitializing(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_QUEUE, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseInitialized(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_QUEUE);
                resolve(cancelWantedQueue);
            }
        });
    });
}

async function retrieveCancelWantedQueue() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(STORAGE_KEY_CANCEL_WANTED_QUEUE, (result) => {
            if (chrome.runtime.lastError) {
                errorDatabaseRetrieving(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_QUEUE, chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(STORAGE_KEY_CANCEL_WANTED_QUEUE)) {
                    infoDatabaseRetrieved(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_QUEUE, STORAGE_KEY_CANCEL_WANTED_QUEUE, result[STORAGE_KEY_CANCEL_WANTED_QUEUE]);
                    resolve(result[STORAGE_KEY_CANCEL_WANTED_QUEUE]);
                } else {
                    infoDatabaseNotRetrieved(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_QUEUE);
                    resolve(-1);
                }
            }
        });
    });
}

async function updateCancelWantedQueue(cancelWantedQueue) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({[STORAGE_KEY_CANCEL_WANTED_QUEUE]: cancelWantedQueue}, () => {
            if (chrome.runtime.lastError) {
                errorDatabaseUpdating(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_QUEUE, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseUpdated(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_QUEUE, STORAGE_KEY_CANCEL_WANTED_QUEUE, cancelWantedQueue);
                resolve();
            }
        })
    });
}

async function deleteCancelWantedQueue() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(STORAGE_KEY_CANCEL_WANTED_QUEUE, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseDeleting(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_QUEUE, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseDeleted(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_QUEUE);
                resolve();
            }
        });
    });
}

async function updateCancelWantedExecuteTaskID(taskID) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({[STORAGE_KEY_CANCEL_WANTED_EXECUTOR]: taskID}, () => {
            if (chrome.runtime.lastError) {
                errorDatabaseInitializing(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_EXECUTOR, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseInitialized(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_EXECUTOR);
                resolve(taskID);
            }
        });
    });
}

async function retrieveCancelWantedExecuteTaskID() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(STORAGE_KEY_CANCEL_WANTED_EXECUTOR, (result) => {
            if (chrome.runtime.lastError) {
                errorDatabaseRetrieving(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_EXECUTOR, chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(STORAGE_KEY_CANCEL_WANTED_QUEUE)) {
                    infoDatabaseRetrieved(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_EXECUTOR, STORAGE_KEY_CANCEL_WANTED_EXECUTOR, result[STORAGE_KEY_CANCEL_WANTED_EXECUTOR]);
                    resolve(result[STORAGE_KEY_CANCEL_WANTED_EXECUTOR]);
                } else {
                    infoDatabaseNotRetrieved(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_EXECUTOR);
                    resolve(false);
                }
            }
        });
    });
}

async function deleteCancelWantedExecuteTaskID() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(STORAGE_KEY_CANCEL_WANTED_EXECUTOR, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseDeleting(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_EXECUTOR, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseDeleted(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_EXECUTOR);
                resolve();
            }
        });
    });
}

async function updateCancelWantedExecuteTimeStamp() {
    return new Promise((resolve, reject) => {
        let timeStamp = Date.now();
        chrome.storage.local.set({[STORAGE_KEY_CANCEL_WANTED_EXECUTION_TIMESTAMP]: timeStamp}, () => {
            if (chrome.runtime.lastError) {
                errorDatabaseInitializing(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_TIME_STAMP, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseInitialized(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_TIME_STAMP);
                resolve(timeStamp);
            }
        });
    });
}

async function retrieveCancelWantedExecuteTimeStamp() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(STORAGE_KEY_CANCEL_WANTED_EXECUTION_TIMESTAMP, (result) => {
            if (chrome.runtime.lastError) {
                errorDatabaseRetrieving(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_TIME_STAMP, chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(STORAGE_KEY_CANCEL_WANTED_EXECUTION_TIMESTAMP)) {
                    infoDatabaseRetrieved(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_TIME_STAMP, STORAGE_KEY_CANCEL_WANTED_EXECUTION_TIMESTAMP, result[STORAGE_KEY_CANCEL_WANTED_EXECUTION_TIMESTAMP]);
                    resolve(result[STORAGE_KEY_CANCEL_WANTED_EXECUTION_TIMESTAMP]);
                } else {
                    infoDatabaseNotRetrieved(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_TIME_STAMP);
                    resolve(0);
                }
            }
        });
    });
}

async function deleteCancelWantedExecuteTimeStamp() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(STORAGE_KEY_CANCEL_WANTED_EXECUTION_TIMESTAMP, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseDeleting(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_TIME_STAMP, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseDeleted(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_TIME_STAMP);
                resolve();
            }
        });
    });
}

async function updateCancelWantedExecutionInterval(){
    return new Promise((resolve, reject) => {
        let executionInterval = randomGeneratorCancelWanted();
        chrome.storage.local.set({[STORAGE_KEY_CANCEL_WANTED_EXECUTION_INTERVAL]: executionInterval}, () => {
            if (chrome.runtime.lastError) {
                errorDatabaseInitializing(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_INTERVAL, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseInitialized(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_INTERVAL);
                resolve(executionInterval);
            }
        });
    });
}

async function retrieveCancelWantedExecutionInterval(){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(STORAGE_KEY_CANCEL_WANTED_EXECUTION_INTERVAL, (result) => {
            if (chrome.runtime.lastError) {
                errorDatabaseRetrieving(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_INTERVAL, chrome.runtime.lastError);
                reject();
            } else {
                if (result.hasOwnProperty(STORAGE_KEY_CANCEL_WANTED_EXECUTION_INTERVAL)) {
                    infoDatabaseRetrieved(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_INTERVAL, STORAGE_KEY_CANCEL_WANTED_EXECUTION_INTERVAL, result[STORAGE_KEY_CANCEL_WANTED_EXECUTION_INTERVAL]);
                    resolve(result[STORAGE_KEY_CANCEL_WANTED_EXECUTION_INTERVAL]);
                } else {
                    infoDatabaseNotRetrieved(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_INTERVAL);
                    resolve(0);
                }
            }
        });
    });
}

async function deleteCancelWantedExecutionInterval(){
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(STORAGE_KEY_CANCEL_WANTED_EXECUTION_INTERVAL, function () {
            if (chrome.runtime.lastError) {
                errorDatabaseDeleting(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_INTERVAL, chrome.runtime.lastError);
                reject();
            } else {
                infoDatabaseDeleted(COMPONENT_NAME_CANCELING_WANTED, LOG_KEYWORD_INTERVAL);
                resolve();
            }
        });
    });
}

/*========================================================================================

    交易策略管理 数据库组件

=========================================================================================*/

// 初始化交易策略
async function saveTradingStrategyDatabase(itemID, tradingStrategy) {

}

// 查询交易策略
async function retrieveTradingStrategyDatabase(itemID) {

}

// 销毁交易策略
async function destroyTradingStrategyDatabase(itemID) {

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