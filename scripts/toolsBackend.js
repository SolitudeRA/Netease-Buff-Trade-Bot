/*#######################################################################################

    后台通用工具函数组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

/*========================================================================================

    窗口/标签页管理函数

=========================================================================================*/

/* ========================================== 刷新标签页 ========================================== */

async function reloadTabBackend(tabID) {
    return new Promise((resolve, reject) => {
        chrome.tabs.reload(tabID, {}, function () {
            if (chrome.runtime.lastError) {
                console.log("通用工具后台 [刷新标签页] 组件错误，" + chrome.runtime.lastError);
                reject();
            } else {
                resolve();
            }
        });
    });
}

/* ========================================== 监测标签页加载状态 ========================================== */
async function monitorTabStatus(tabID) {
    return new Promise((resolve, reject) => {
        function monitorTabStatusListenerCallback(updatedTabID, changeInfo, tab) {
            if (chrome.runtime.lastError) {
                console.log("通用工具后台 [监测标签页加载状态] 组件错误，" + chrome.runtime.lastError);
                chrome.tabs.onUpdated.removeListener(this);
                reject();
            } else {
                if (tabID === updatedTabID && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(this);
                    resolve(tab);
                }
            }
        }

        chrome.tabs.onUpdated.addListener(monitorTabStatusListenerCallback);
    });
}

/* ========================================== 关闭标签页 ========================================== */
async function removeTab(tabID) {
    return new Promise((resolve) => {
        chrome.tabs.remove(tabID, function () {
            resolve();
        });
    });
}

/* ========================================== 销毁任务 ========================================== */
async function destroyEntireTask(itemID) {
    if (await retrieveTradeInformationDatabase(itemID)) {
        await deleteTradeInformationDatabase(itemID);
    }
    if (await retrieveMonitorStatusDatabase(itemID)){
        await deleteMonitorStatusDatabase(itemID);
    }
    if (await retrieveTabIDDatabase(itemID)){
        await deleteTabIDDatabase(itemID);
    }
    if (await retrieveTaskScheduleID(itemID)){
        await deleteTaskScheduleID(itemID);
    }
    if (await retrieveTaskScheduleExecutedTimeStamp(itemID)){
        await deleteTaskScheduleExecutedTimeStamp(itemID);
    }
    if (await retrievePostWantedTimeStamp(itemID)){
        await deletePostWantedTimeStamp(itemID);
    }
    if (await retrieveItemTabReloadTimeStamp(itemID)){
        await deleteItemTabReloadTimeStamp(itemID);
    }
    if (await retrieveItemTabReloadInterval(itemID)){
        await deleteItemTabReloadInterval(itemID);
    }
    if (await retrieveSupplyItemHangedUpTimeStamp(itemID)){
        await deleteSupplyItemHangedUpTimeStamp(itemID);
    }
}