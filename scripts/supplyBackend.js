/*#######################################################################################

    当前求购后台相关组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

// 取消求购订单
async function cancelWantedBackend(wantedTabID, itemId) {
    return new Promise((resolve) => {
        chrome.tabs.update(wantedTabID, {
            active: true,
            autoDiscardable: false
        }, function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: "cancelWanted",
                itemId: itemId
            }, null, function (response) {
                resolve(response);
            });
        });
    });
}