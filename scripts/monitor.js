/*#######################################################################################

    插件后台监听器主组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/*========================================================================================

    通信监听

=========================================================================================*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //持久化交易信息
    if (request.action === "saveTradeInformation") {
        saveToLocalStorage(request.tradeInformation.itemId + "_tradeInformation", request.tradeInformation).then(() => {
            sendResponse({status: true});
        });
    }

    //查询交易信息
    if (request.action === "getTradeInformation") {
        getFromLocalStorage(request.itemId + "_tradeInformation").then((payload) => {
            if (JSON.stringify(payload) !== "{}") {
                sendResponse({status: true, tradeInformation: payload[request.itemId + "_tradeInformation"]});
            } else {
                sendResponse({status: false});
            }
        });
    }

    //激活监听状态
    if (request.action === "activateMonitor") {
        queryMonitorStatus(request.tradeInformation.itemId).then((result) => {
            if (result === false) {
                initializeMonitor(request.tradeInformation).then(() => {
                    activateMonitorStatus(request.tradeInformation.itemId).then(() => {
                        sendResponse(true);
                    });
                });
            } else {
                sendResponse(false);
            }
        });
    }

    //更新监听状态
    if (request.action === "updateMonitor") {

    }

    //注销监听状态
    if (request.action === "deactivateMonitor") {

    }

    //查询监听状态
    if (request.action === "queryMonitorStatus") {
        queryMonitorStatus(request.itemId).then((result) => {
            sendResponse({monitorStatus: result});
        });
    }

    return true;
});

/*========================================================================================

    计划任务监听

=========================================================================================*/

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name.includes("taskSchedule_")) {
        monitorTask(alarm.name.slice(13)).then(() => {
            console.log("Executed " + alarm.name);
        });
    }
});

/*========================================================================================

    主工具函数

=========================================================================================*/

async function initializeMonitor(tradeInformation) {
    const taskSchedule = {periodInMinutes: 20};
    registerTaskSchedule(tradeInformation, taskSchedule).then(() => {
        monitorTask(tradeInformation.itemId);
    }).then(() => {
        return Promise.resolve();
    });
}

async function monitorTask(itemId) {
    windowExist().then((result) => {
        if (result === true) {
            getWindowId();
        } else if (result === false) {
            createWindow();
        } else {
            throwError("Window exist check error");
        }
    }).then((windowId) => {
        getTabId(itemId).then((result) => {
            if (result.status === true) {
                return parseInt(result.payload);
            } else if (result.status === false) {
                createTab(itemId, windowId).then((tabId) => {
                    return parseInt(tabId);
                });
            } else {
                throwError("Getting tab id error");
            }
        });
    }).then((tabId) => {
        chrome.tabs.sendMessage(tabId, {action: "getCurrentHighestPrice"}).then((currentHighestPrice) => {
            getFromLocalStorage(itemId + "_tradeInformation").then(())
        });
    });
}