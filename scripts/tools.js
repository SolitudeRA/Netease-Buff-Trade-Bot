/*#######################################################################################

    通用工具函数组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

//tradeInformation构造器
function TradeInformation(itemId, itemName, unlockStyle, customWearAmountMin, customWearAmountMax, tradeAmount, tradePriceCurrent, priceUpStep, tradePriceMax, paymentMethod, updatedFlag = 0) {
    this.itemId              = itemId;
    this.itemName            = itemName;
    this.unlockStyle         = unlockStyle;
    this.customWearAmountMin = customWearAmountMin;
    this.customWearAmountMax = customWearAmountMax;
    this.tradeAmount         = tradeAmount;
    this.tradePriceCurrent   = tradePriceCurrent;
    this.priceUpStep         = priceUpStep;
    this.tradePriceMax       = tradePriceMax;
    this.paymentMethod       = paymentMethod;
    this.updatedFlag         = updatedFlag;
}

function buildTradeInformation() {
    const itemId   = document.getElementById("scriptItemInformation").getAttribute("data-itemId");
    const itemName = document.getElementById("scriptItemInformation").getAttribute("data-itemName");

    let unlockStyle = null;
    if (document.getElementById("scriptUnlockStyle")) {
        unlockStyle = document.getElementById("scriptUnlockStyle").value;
    }

    let customWearAmountMin = null;
    let customWearAmountMax = null;
    if (document.getElementById("scriptWearAmountMin") && document.getElementById("scriptWearAmountMax")) {
        customWearAmountMin = document.getElementById("scriptWearAmountMin").value;
        customWearAmountMax = document.getElementById("scriptWearAmountMax").value;
    }

    const tradeAmount       = document.getElementById("scriptTradeAmount").value;
    const tradePriceCurrent = document.getElementById("scriptTradePriceCurrent").value;
    const priceUpStep       = document.getElementById("scriptPriceUpStep").value;
    const tradePriceMax     = document.getElementById("scriptTradePriceMax").value;
    const paymentMethod     = document.getElementById("scriptPaymentMethod").value;
    const updatedFlag       = parseInt(document.getElementById("scriptUpdatedFlag").textContent);

    return new Promise((resolve) => {
        const tradeInformation = new TradeInformation(
            itemId,
            itemName,
            unlockStyle,
            customWearAmountMin,
            customWearAmountMax,
            tradeAmount,
            tradePriceCurrent,
            priceUpStep,
            tradePriceMax,
            paymentMethod,
            updatedFlag
        );
        resolve(tradeInformation);
    });

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
    const itemNameContainer = document.getElementsByClassName("detail-cont").item(0).getElementsByTagName("h1").item(0);
    return itemNameContainer.textContent;
}

//获取当前最高价
function getCurrentHighestPrice(unlockStyle, customWearAmountMin, customWearAmountMax) {
    //Mutation observer 配置
    const observerConfig = {
        childList: true, subtree: true, attributes: true, attributeOldValue: true
    };

    //Filter容器
    let filterElementList = null;
    if (document.getElementById("asset_tag-filter-buyOrder")) {
        filterElementList = document.getElementById("asset_tag-filter-buyOrder").getElementsByClassName("l_Left").item(0).getElementsByTagName("div");
    } else if (document.getElementById("asset_tag-filter").style.getPropertyValue("display") !== "none") {
        filterElementList = document.getElementById("asset_tag-filter").getElementsByClassName("l_Left").item(0).getElementsByTagName("div");
    }

    //当前求购Filter标签
    let wantedTabContainer = document.getElementsByClassName("cont-tab").item(0).getElementsByClassName("buying").item(0);
    let wantedTab          = document.getElementsByClassName("cont-tab").item(0).getElementsByClassName("buying").item(0).firstChild;

    //磨损Filter
    let customWearAmountElement = null;
    if (document.getElementById("asset_tag-filter").style.getPropertyValue("display") !== "none") {
        customWearAmountElement = document.getElementById("custom-float-range");
    }

    //款式Filter
    let unlockStyleContainer = null;
    let unlockStyleList      = null;
    if (filterElementList != null) {
        for (let element of filterElementList) {
            if (element.name === "unlock_style") {
                unlockStyleContainer = document.getElementById("asset_tag-filter-buyOrder").childNodes.item(1).childNodes.item(1);
                unlockStyleList      = unlockStyleContainer.getElementsByTagName("ul").item(0).childNodes;
            }
        }
    }

    const bodyNode = document.getElementsByTagName("body").item(0);

    return new Promise((resolve) => {
        //应用磨损Filter完成监听器
        const wearAmountFilterCompleteObserver  = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.type === "childList" && mutation.target.className === "pager list-pager light-theme simple-pagination") {
                    observer.disconnect();
                    let highestPriceRow = document.getElementsByClassName("list_tb_csgo").item(0).childNodes.item(3);
                    let priceString     = highestPriceRow.childNodes.item(11).childNodes.item(1).childNodes.item(1).textContent;
                    resolve(parseFloat(priceString.slice(2)));
                } else if (mutation.type === "attributes" && mutation.target.id === "custom_paintwear_val") {
                    observer.disconnect();
                    let highestPriceRow = document.getElementsByClassName("list_tb_csgo").item(0).childNodes.item(3);
                    let priceString     = highestPriceRow.childNodes.item(11).childNodes.item(1).childNodes.item(1).textContent;
                    resolve(parseFloat(priceString.slice(2)));
                }
            }
        });
        //应用磨损Filter监听器
        const wearAmountFilterObserver          = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.target.id === "custom-paintwear-container" && mutation.target.style.getPropertyValue("display") === "block") {
                    observer.disconnect();
                    document.getElementsByName("custom_min").item(0).value = customWearAmountMin;
                    document.getElementsByName("custom_max").item(0).value = customWearAmountMax;
                    wearAmountFilterCompleteObserver.observe(bodyNode, observerConfig);
                    document.getElementById("custom_paintwear_confirm").click();
                }
            }
        });
        //应用款式Filter完成监听器
        const unlockStyleFilterCompleteObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.type === "childList") {
                    for (let node of mutation.addedNodes) {
                        if (node.className === "pager list-pager" || node.className === "pager list-pager light-theme simple-pagination") {
                            observer.disconnect();
                            if (customWearAmountElement == null) {
                                let highestPriceRow = document.getElementsByClassName("list_tb_csgo").item(0).childNodes.item(3);
                                let priceString     = highestPriceRow.childNodes.item(11).childNodes.item(1).childNodes.item(1).textContent;
                                resolve(parseFloat(priceString.slice(2)));
                            } else {
                                wearAmountFilterObserver.observe(bodyNode, observerConfig);
                                customWearAmountElement.click();
                            }
                        }
                    }
                }
            }
        });

        const tabSwitchCompleteObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.type === "childList") {
                    for (let node of mutation.addedNodes) {
                        if (node.className === "pager list-pager" || node.className === "pager list-pager light-theme simple-pagination") {
                            observer.disconnect();
                            if (filterElementList == null) {
                                let highestPriceRow = document.getElementsByClassName("list_tb_csgo").item(0).childNodes.item(3);
                                let priceString     = highestPriceRow.childNodes.item(11).childNodes.item(1).childNodes.item(1).textContent;
                                resolve(parseFloat(priceString.slice(2)));
                            } else if (unlockStyleList == null) {
                                wearAmountFilterObserver.observe(bodyNode, observerConfig);
                                customWearAmountElement.click();
                            } else {
                                unlockStyleFilterCompleteObserver.observe(bodyNode, observerConfig);
                                unlockStyleList.forEach(function(currentNode) {
                                    if (currentNode.nodeName === "LI") {
                                        let item = currentNode.childNodes.item(1);
                                        if (item.textContent === unlockStyle) {
                                            item.click();
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });

        //验证是否在当前求购页面
        if (wantedTabContainer.className.includes("on")) {
            if (filterElementList === null) {
                let highestPriceRow = document.getElementsByClassName("list_tb_csgo").item(0).childNodes.item(3);
                let priceString     = highestPriceRow.childNodes.item(11).childNodes.item(1).childNodes.item(1).textContent;
                resolve(parseFloat(priceString.slice(2)));
            } else if (unlockStyleList == null) {
                if (customWearAmountElement == null) {
                    let highestPriceRow = document.getElementsByClassName("list_tb_csgo").item(0).childNodes.item(3);
                    let priceString     = highestPriceRow.childNodes.item(11).childNodes.item(1).childNodes.item(1).textContent;
                    resolve(parseFloat(priceString.slice(2)));
                } else {
                    wearAmountFilterObserver.observe(bodyNode, observerConfig);
                    customWearAmountElement.click();
                }
            } else {
                unlockStyleFilterCompleteObserver.observe(bodyNode, observerConfig);
                unlockStyleList.forEach(function(currentNode) {
                    if (currentNode.nodeName === "LI") {
                        let item = currentNode.childNodes.item(1);
                        if (item.textContent === unlockStyle) {
                            item.click();
                        }
                    }
                });
            }
        } else {
            tabSwitchCompleteObserver.observe(bodyNode, observerConfig);
            wantedTab.click();
        }
    });
}

//Chrome Message API获取当前最高价
chrome.runtime.onMessage()

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