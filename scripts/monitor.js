/*#######################################################################################

    插件后台监听器主组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

//通信处理
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //持久化交易信息
    if (request.action === "saveTradeInformation") {
        const tradeInformation = request.tradeInformation;
        saveToLocalStorage(tradeInformation.itemId + "_tradeInformation", tradeInformation).then(() => {
            sendResponse({status: true});
        });
    }

    //查询交易信息
    if (request.action === "getTradeInformation") {
        let tradeInformation;
        const settingsObject = getFromLocalStorage(request.itemId + "_tradeInformation");
        settingsObject.then((payload) => {
            if (JSON.stringify(payload) !== "{}") {
                tradeInformation = payload[request.itemId + "_tradeInformation"];
                sendResponse({status: true, tradeInformation: tradeInformation});
            } else {
                sendResponse({status: false});
            }
        });
    }

    //查询监听状态
    if (request.action === "queryMonitorStatus") {
        const monitorStatus = queryMonitorStatus(request.itemId);
        monitorStatus.then((result) => {
            sendResponse({monitorStatus: result});
        });
    }

    return true;
});


async function initializeMonitor(goodsId) {
    const alarmCreateInfo = {delayInMinutes: 20, periodInMinutes: 20};
    const windowId        = await windowExist();
    chrome.alarms.create();
}

async function monitorTask(goodsId) {
    let windowId         = await windowExist();
    let tab              = await tabExist(goodsId, windowId);
    let tradeInformation = await getFromLocalStorage(goodsId + "_tradeSettings");
    tradeInformation     = JSON.parse(tradeInformation.toString());
    let currentHighestPrice;
    chrome.tabs.sendMessage(tab.id, {
        action : "getCurrentHighestPrice",
        payload: tradeInformation
    }, async function(response) {
        currentHighestPrice = await response;
    });
    if (currentHighestPrice >= tradeInformation.currentTradePrice && tradeInformation.currentTradePrice + getUpPrice(tradeInformation.currentTradePrice) <= tradeInformation.tradePriceMax) {
        tradeInformation.currentTradePrice = tradeInformation.currentTradePrice + getUpPrice(tradeInformation.currentTradePrice);

    } else if (currentHighestPrice >= tradeInformation.currentTradePrice && currentHighestPrice > tradeInformation.tradePriceMax) {

    }
}