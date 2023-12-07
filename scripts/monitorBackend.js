/*#######################################################################################

    监听器后台组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/*========================================================================================

    通信监听

=========================================================================================*/

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // 初始化监听器
    if (request.action === "initializeMonitor") {
        initializeMonitorBackend(request.tradeInformation).then(() => {
            sendResponse({status: true});
        });
    }

    // 查询监听器状态
    if (request.action === "queryMonitorStatus") {
        retrieveMonitorStatusDatabase(request.itemId).then((monitorStatus) => {
            if (monitorStatus === 0) {
                sendResponse({
                    status: true,
                    monitorStatus: false
                })
            } else if (monitorStatus === true) {
                sendResponse({
                    status: true,
                    monitorStatus: true
                })
            } else {
                sendResponse({
                    status: true,
                    monitorStatus: false
                });
            }
        });
    }

    // 更新监听器
    if (request.action === "updateMonitor") {

    }

    // 销毁监听器
    if (request.action === "destroyMonitor") {
        destroyMonitorBackend(request.tradeInformation).then(() => {
            sendResponse({
                status: true
            });
        });
    }

    return true;
});

/*========================================================================================

    主工具函数

=========================================================================================*/

// 初始化监听器
async function initializeMonitorBackend(tradeInformation) {
    await saveTradeInformationDatabase(tradeInformation);
    await activateMonitorStatusDatabase(tradeInformation.itemId);

    const windowID = await getWindowIDTool();
    const tabID = await getTabIDTool(windowID, tradeInformation);
    const taskScheduleID = await getTaskScheduleIDTool(tradeInformation);
    const wantedTabID = await getWantedTabID();

    console.log("\n");
    console.log("成功初始化监视器，信息如下:");
    console.log("窗口ID: " + windowID);
    console.log("标签页ID: " + tabID);
    console.log("计划任务ID: " + taskScheduleID);
    console.log("\n");
}

// 销毁监听器
async function destroyMonitorBackend(tradeInformation) {
    const taskScheduleID = await getTaskScheduleIDTool(tradeInformation);

    clearInterval(taskScheduleID);
    await destroyTaskScheduleID(tradeInformation.itemId);
    await destroyMonitorStatusDatabase(tradeInformation.itemId);
    await destroyTradeInformationDatabase(tradeInformation.itemId);
    await destroyTabIDDatabase(tradeInformation.itemId);
}