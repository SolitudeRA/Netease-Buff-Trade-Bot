//求购数据构造器
function WantedData() {
    this.customWearAmountMin = -1;
    this.customWearAmountMax = -1;
    this.wantedPrice         = -1;
    this.wantedAmount        = 0;
    this.paymentMethod       = 0;
    this.unlockStyle         = "";
}

function WantedData(customWearAmountMin, customWearAmountMax, wantedPrice, wantedAmount, paymentMethod, unlockStyle) {
    this.customWearAmountMin = customWearAmountMin;
    this.customWearAmountMax = customWearAmountMax;
    this.wantedPrice         = wantedPrice;
    this.wantedAmount        = wantedAmount;
    this.paymentMethod       = paymentMethod;
    this.unlockStyle         = unlockStyle;
}

//获取当前物品ID
function getGoodsID() {
    return window.location.href.slice(27).replace(/[^0-9]+/, "");
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

//调用Chrome.API将数据持久化至LocalStorage
function callSaveDataToChromeLocalStorage(key, value) {
    chrome.runtime.sendMessage({action: "saveDataToChromeLocalStorage", key: key, value: value}, function() {
        console.log("Sent save data request...");
    });
}

//调用Chrome.API将数据从LocalStorage中取出
function callGetDataFromChromeLocalStorage(key) {
    chrome.runtime.sendMessage({action: "getDataFromChromeLocalStorage", key: key}, function(response) {
        if (response.status === 0) {
            console.log("Loading data from extension...");
            return response.value;
        } else if (response.status === 1) {
            return false;
        } else {
            console.log("CallGetDataFromChromeLocalStorage Unknown Error");
        }
    });
}
