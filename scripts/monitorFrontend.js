/*#######################################################################################

    监听器前端组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/*========================================================================================

    监听器管理函数

=========================================================================================*/

/* ========================================== 初始化监听器 ========================================== */
function initializeMonitorFrontEnd(tradeInformation) {
    return new Promise((resolve) => {
        // 向后台发送初始化监视器指令
        chrome.runtime.sendMessage({
            action: "initializeMonitor",
            tradeInformation: tradeInformation
        }, (response) => {
            if (response.status) {
                resolve(response.status);
            } else {
                console.log("Frontend initializing monitor error")
            }
        });
    });
}

/* ========================================== 查询监听器状态 ========================================== */

function retrieveMonitorStatusFrontEnd(itemId) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            action: "queryMonitorStatus",
            itemId: itemId
        }, function (response) {
            if (response.status) {
                resolve(response.monitorStatus);
            } else {
                console.log("Frontend retrieving monitor error");
            }
        });
    });
}

/* ========================================== 更新监听器 ========================================== */
async function updateMonitorFrontEnd(tradeInformation) {
    return new Promise((resolve, reject) => {
        // 向后台发送更新监视器指令
        chrome.runtime.sendMessage({
            action: "updateMonitor",
            tradeInformation: tradeInformation
        }, (response) => {
            if (response.status) {
                resolve(response.status);
            } else {
                console.log("Frontend updating monitor error");
            }
        });
    });
}

/* ========================================== 销毁监听器 ========================================== */
async function destroyMonitorFrontEnd(tradeInformation) {
    return new Promise((resolve, reject) => {
        // 向后台发送销毁监视器指令
        chrome.runtime.sendMessage({
            action: "destroyMonitor",
            tradeInformation: tradeInformation
        }, (response) => {
            if (response.status) {
                resolve(response.status);
            } else {
                console.log("Frontend destroying monitor error");
            }
        });
    });
}


/*========================================================================================

    监听器后台回调函数

=========================================================================================*/

window.addEventListener('load', (event) => {
    chrome.runtime.sendMessage({action: "tabLoadComplete"}, (response) => {
    });
});

