//获取当前tab
function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    chrome.tabs.query(queryOptions, ([tab]) => {
        return tab.url;
    });
}

//获取当前tabID
function getCurrentTabID(tab) {
    return tab.id;
}