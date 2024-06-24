/*#######################################################################################

    交易后台组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

/*========================================================================================

    通信监听

=========================================================================================*/

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getTradeInformation") {
        retrieveTradeInformationDatabase(request.itemId).then((tradeInformation) => {
            if (tradeInformation) {
                sendResponse({
                    status: true,
                    tradeInformation: tradeInformation
                })
            } else {
                sendResponse({
                    status: false,
                    tradeInformation: null
                })
            }
        });
    }

    return true;
});

/*========================================================================================

    获取当前最高价

=========================================================================================*/

async function getCurrentHighestPriceBackend(tabID) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabID, {
            action: "getCurrentHighestPrice"
        }, null, function (response) {
            resolve(response);
        })
    });
}

/*========================================================================================

    在标签页发起新求购

=========================================================================================*/

async function postWantedBackend(tabID, tradeInformation) {
    return new Promise((resolve) => {
        chrome.tabs.update(tabID, {
            active: true,
            autoDiscardable: false
        }, function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: "postWanted",
                tradeInformation: tradeInformation
            }, null, function (response) {
                resolve(response);
            });
        });
    });
}