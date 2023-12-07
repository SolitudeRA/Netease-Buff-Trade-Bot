/*#######################################################################################

    插件后台监听器工具组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/*========================================================================================

    标签页/窗口相关

=========================================================================================*/

// 获取窗口ID
async function getWindowIDTool() {
    const windowID = await getWindowID();
    if (windowID === 0) {
        return await initializeWindow()
    } else {
        return windowID;
    }
}

// 获取标签页ID
async function getTabIDTool(windowID, tradeInformation) {
    const tabID = await getTabID(tradeInformation.itemId);
    if (tabID === 0) {
        return await initializeTab(windowID, tradeInformation);
    } else {
        return tabID;
    }
}

/*========================================================================================

    计划任务相关

=========================================================================================*/

// 注册计划任务
async function getTaskScheduleIDTool(tradeInformation) {
    const taskScheduleID = await retrieveTaskScheduleID(tradeInformation.itemId);
    if (taskScheduleID === 0) {
        return await taskScheduleActivate(tradeInformation.itemId);
    } else {
        return taskScheduleID;
    }
}

// 更新计划任务
function updateTaskSchedule(tradeInformation, taskSchedule) {

}

// 注销计划任务
function cancelTaskSchedule(taskScheduleId) {
    return new Promise((resolve) => {
        taskScheduleDeactivate(taskScheduleId);
        resolve();
    })
}

// 注销所有计划任务
function cancelAllTaskSchedule() {

}
