/*#######################################################################################

    监听器后台组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

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

    console.group(COMPONENT_NAME_MONITOR_INSTANCE + LOG_INFO_SEPARATOR + LOG_INFO_INITIALIZING);

    // 存储交易信息至数据库
    await saveTradeInformationDatabase(tradeInformation);
    // 初始化监听器状态至数据库
    await activateMonitorStatusDatabase(tradeInformation.itemId);
    // 推送至监听任务队列
    await activeMonitorEnqueue(tradeInformation);

    // 创建/获取窗口ID
    const windowID = await getWindowID();
    // 创建并获取标签页ID
    const tabID = await getTabID(tradeInformation.itemId);
    // 创建并获取求购标签页ID
    const wantTabID = await getWantedTab(await activeMonitorGetPage(tradeInformation.itemId));
    // 创建并获取计划任务ID
    const taskScheduleID = await taskScheduleInitialize(tradeInformation.itemId);
    await saveTaskScheduleID(tradeInformation.itemId, taskScheduleID);


    console.info("\n");
    console.groupCollapsed(COMPONENT_NAME_MONITOR_INSTANCE + LOG_INFO_SEPARATOR + LOG_INFO_INITIALIZED);
    console.info("物品ID：" + tradeInformation.itemId);
    console.info("窗口ID: " + windowID);
    console.info("标签页ID: " + tabID);
    console.info("求购标签页ID：" + wantTabID);
    console.info("计划任务ID: " + taskScheduleID);
    console.groupEnd();
    console.info("\n");

    console.groupEnd();
}

// 销毁监听器
async function destroyMonitorBackend(tradeInformation) {
    return new Promise((resolve, reject) => {
        console.groupCollapsed("销毁监听器,物品ID；" + tradeInformation.itemId);
        retrieveTaskScheduleID(tradeInformation.itemId)
            .then((taskScheduleID) => {
                if (taskScheduleID === 0) {
                    console.warn("未查询到计划任务定时器ID");
                } else {
                    deleteTaskScheduleID(tradeInformation.itemId).then(() => {
                        clearInterval(taskScheduleID);
                        console.info("已销毁计划任务定时器，定时器ID：" + taskScheduleID);
                    });
                }
            })
            .catch(() => {
                console.error("[销毁监听器] [获取定时任务ID] 错误");
                reject();
            })
            .finally(async () => {
                await deleteTaskScheduleExecutedTimeStamp(tradeInformation.itemId);
                await deleteItemTabReloadTimeStamp(tradeInformation.itemId);
                await deleteItemTabReloadInterval(tradeInformation.itemId);
                await deletePostWantedTimeStamp(tradeInformation.itemId);
                await deleteMonitorStatusDatabase(tradeInformation.itemId);
                await deleteTradeInformationDatabase(tradeInformation.itemId);
                await deleteTabIDDatabase(tradeInformation.itemId);
                console.info("已销毁监听器，物品ID：" + tradeInformation.itemId + "，名称：" + tradeInformation.itemName);
                console.groupEnd();
                resolve();
            });
    });
}