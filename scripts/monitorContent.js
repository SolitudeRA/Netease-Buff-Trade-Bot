/*#######################################################################################

    监听器注入脚本组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.action === "getCurrentHighestPrice") {
        let currentHighestPrice = await getCurrentHighestPrice(request.payload);
        sendResponse(currentHighestPrice);
    }
});

//请求初始化监听器
function callInitializeMonitor() {
    chrome.runtime.sendMessage({action: "initializeMonitor"}, function(response) {

    });
}
