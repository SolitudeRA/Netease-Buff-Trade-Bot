/*#######################################################################################

    当前求购后台相关组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

// 取消求购订单
async function cancelWantedBackend(wantedTabID, itemID) {
    return new Promise((resolve, reject) => {
        chrome.tabs.update(wantedTabID, {
            active: true,
            autoDiscardable: false
        }, function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: "cancelWanted",
                itemId: itemID
            }, null, function (response) {
                if (!chrome.runtime.lastError) {
                    resolve(response);
                } else {
                    console.error("后台取消求购组件错误，" + chrome.runtime.lastError);
                    reject();
                }
            });
        });
    });
}

// 监听求购状态
async function retrievePostingWantedStatusBackend(wantedTabID, itemID) {
    return new Promise((resolve, reject) => {
        chrome.tabs.update(wantedTabID, {
            active: true,
            autoDiscardable: false
        }, function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: "retrievePostingWantedStatus",
                itemId: itemID
            }, null, function (response) {
                if (!chrome.runtime.lastError) {
                    resolve(response);
                } else {
                    errorComponentBackEnd(COMPONENT_NAME_MONITOR_WANTED_STATUS, chrome.runtime.lastError.message);
                    reject();
                }
            })
        });
    });
}