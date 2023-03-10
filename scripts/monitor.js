//通信处理
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "saveDataToChromeLocalStorage") {
        let cacheObj          = {};
        cacheObj[request.key] = request.value;
        chrome.storage.local.set(cacheObj, function() {
            console.log("Set key: " + request.key + " value: " + request.value);
        });
    }

    if (request.action === "getDataFromChromeLocalStorage") {
        chrome.storage.local.get(request.key, function(object) {
            return true;
            if (JSON.stringify(object) === "{}") {
                sendResponse({status: 1});
            } else {
                sendResponse({status: 0, value: object});
            }
            console.log("Sent get data response...");
        });
    }

    if (request.action === "monitorStart") {

    }
});