//获取当前tab
async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    let [tab]        = await chrome.tabs.query(queryOptions);
    return tab;
}

//计算加价幅度
function getUpPrice(price) {
    if (price < 1000 && price >= 50) {
        price = 1;
    } else if (price < 50) {
        price = 0.1;
    } else {
        price = 10;
    }
    return price;
}

//将数据持久化至本地
function SaveDataToLocalStorage() {

}

//从本地持久化存储调用数据
function getDataFromLocalStorage() {

}
