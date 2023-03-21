/*#######################################################################################

    通用工具函数组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

//求购数据构造器
function TradeInformation(itemId, itemName, customWearAmountMin, customWearAmountMax, tradeAmount, tradePriceCurrent, priceUpStep, tradePriceMax, paymentMethod, unlockStyle, updatedFlag = 0) {
    this.itemId              = itemId;
    this.itemName            = itemName;
    this.customWearAmountMin = customWearAmountMin;
    this.customWearAmountMax = customWearAmountMax;
    this.tradeAmount         = tradeAmount;
    this.tradePriceCurrent   = tradePriceCurrent;
    this.priceUpStep         = priceUpStep;
    this.tradePriceMax       = tradePriceMax;
    this.paymentMethod       = paymentMethod;
    this.unlockStyle         = unlockStyle;
    this.updatedFlag         = updatedFlag;
}

//错误抛出函数
function throwError(message) {
    throw new Error(message);
}

//获取当前物品ID
function getItemId() {
    return window.location.href.slice(27).replace(/[^0-9]+/, "");
}

//获取当前物品名称
function getItemName() {
    return document.getElementById("j_fav").nextSibling.nextSibling.textContent;
}

//获取当前最高价
function getCurrentHighestPrice(unlockStyle, customWearAmountMin, customWearAmountMax) {
    const observerConfig        = {
        childList: true, subtree: true, attributes: true, attributeOldValue: true
    };
    let wantedTabContainer      = document.getElementsByClassName("cont-tab").item(0).getElementsByClassName("buying").item(0);
    let wantedTab               = document.getElementsByClassName("cont-tab").item(0).getElementsByClassName("buying").item(0).firstChild;
    let unlockStyleContainer    = document.getElementById("asset_tag-filter-buyOrder").childNodes.item(1).childNodes.item(1);
    let unlockStyleList         = unlockStyleContainer.getElementsByTagName("ul").item(0).childNodes;
    let customWearAmountElement = document.getElementById("custom-float-range");
    const bodyNode              = document.getElementsByTagName("body").item(0);
    return new Promise((resolve) => {
        //应用磨损Filter完成监听器
        const wearAmountObserver      = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.type === "childList" && mutation.target.className === "pager list-pager light-theme simple-pagination") {
                    observer.disconnect();
                    let highestPriceRow = document.getElementsByClassName("list_tb_csgo").item(0).childNodes.item(3);
                    let priceString     = highestPriceRow.childNodes.item(11).childNodes.item(1).childNodes.item(1).textContent;
                    resolve(parseFloat(priceString.slice(2)));
                }else if (mutation.type === "attributes" && mutation.target.id === "custom_paintwear_val"){
                    observer.disconnect();
                    let highestPriceRow = document.getElementsByClassName("list_tb_csgo").item(0).childNodes.item(3);
                    let priceString     = highestPriceRow.childNodes.item(11).childNodes.item(1).childNodes.item(1).textContent;
                    resolve(parseFloat(priceString.slice(2)));
                }
            }
        });
        const wearAmountInputObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.target.id === "custom-paintwear-container" && mutation.target.style.getPropertyValue("display") === "block") {
                    observer.disconnect();
                    document.getElementsByName("custom_min").item(0).value = customWearAmountMin;
                    document.getElementsByName("custom_max").item(0).value = customWearAmountMax;
                    wearAmountObserver.observe(bodyNode, observerConfig);
                    document.getElementById("custom_paintwear_confirm").click();
                }
            }
        });
        //应用款式Filter完成监听器
        const unlockStyleObserver     = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.type === "childList" && mutation.target.className === "pager list-pager light-theme simple-pagination") {
                    observer.disconnect();
                    wearAmountInputObserver.observe(bodyNode, observerConfig);
                    customWearAmountElement.click();
                }
            }
        });
        const wantedTabObserver       = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.type === "childList" && mutation.target.className === "pager list-pager light-theme simple-pagination") {
                    observer.disconnect();
                    unlockStyleList.forEach(function(currentNode) {
                        if (currentNode.nodeName === "LI") {
                            let item = currentNode.childNodes.item(1);
                            if (item.textContent === unlockStyle) {
                                unlockStyleObserver.observe(bodyNode, observerConfig);
                                item.click();
                            }
                        }
                    });
                }
            }
        });
        //验证是否在当前求购页面
        if (wantedTabContainer.className.includes("on")) {
            unlockStyleObserver.observe(bodyNode, observerConfig);
            unlockStyleList.forEach(function(currentNode) {
                if (currentNode.nodeName === "LI") {
                    let item = currentNode.childNodes.item(1);
                    if (item.textContent === unlockStyle) {
                        item.click();
                    }
                }
            });
        } else {
            wantedTabObserver.observe(bodyNode, observerConfig);
            wantedTab.click();
        }
    });
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

//调用Chrome.API请求将交易信息持久化至LocalStorage
async function callSetPersistedSettingsToLocalStorage(tradeInformation) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
                                       action: "setPersistedSettingsToLocalStorage",
                                       key   : tradeInformation.itemId,
                                       value : JSON.stringify(tradeInformation)
                                   }, function() {
            console.log("Sent setting persisted settings request...");
            resolve();
        });
    });
}


