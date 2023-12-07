/*#######################################################################################

    前端通用工具函数组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/* ========================================== tradeInformation构造器 ========================================== */
function TradeInformation(userId, itemId, itemName, unlockStyle, floatRangeMin, floatRangeMax, tradeAmount, tradePriceCurrent, priceUpStep, tradePriceMax, paymentMethod, updatedFlag) {
    // 用户ID
    this.userId = userId;
    // 物品ID
    this.itemId = itemId;
    // 物品名称
    this.itemName = itemName;
    // 皮肤款式
    this.unlockStyle = unlockStyle;
    // 磨损最小值
    this.floatRangeMin = floatRangeMin;
    // 磨损最大值
    this.floatRangeMax = floatRangeMax;
    // 求购数量
    this.tradeAmount = tradeAmount;
    // 当前求购价格
    this.tradePriceCurrent = tradePriceCurrent;
    // 竞价幅度
    this.priceUpStep = priceUpStep;
    // 最高求购价格
    this.tradePriceMax = tradePriceMax;
    // 支付方式
    this.paymentMethod = paymentMethod;
    // 更新次数标记
    this.updatedFlag = updatedFlag;
}

/* ========================================== 从详情页构建TradeInformation对象 ========================================== */
async function buildTradeInformation() {
    // 用户ID
    const userId = document.getElementById("scriptItemInformation").getAttribute("data-userId");
    // 物品ID
    const itemId = document.getElementById("scriptItemInformation").getAttribute("data-itemId");
    // 物品名称
    const itemName = document.getElementById("scriptItemInformation").getAttribute("data-itemName");
    // 求购数量
    const tradeAmount = parseInt(document.getElementById("scriptTradeAmount").value);
    // 当前求购价格
    const tradePriceCurrent = parseFloat(document.getElementById("scriptTradePriceCurrent").value);
    // 竞价幅度
    const priceUpStep = parseFloat(document.getElementById("scriptPriceUpStep").value);
    // 最高求购价格
    const tradePriceMax = parseFloat(document.getElementById("scriptTradePriceMax").value);
    // 支付方式
    const paymentMethod = document.getElementById("scriptPaymentMethod").value;
    // 更新次数标记
    const updatedFlag = parseInt(document.getElementById("scriptUpdatedFlag").textContent);
    // 皮肤款式
    let unlockStyle = null;
    // 磨损最小值与最大值
    let floatRangeMin = null;
    let floatRangeMax = null;

    if (document.getElementById("scriptUnlockStyle")) {
        if (document.getElementById("scriptUnlockStyle").value === "不限") {
            unlockStyle = "不限款式";
        } else {
            unlockStyle = document.getElementById("scriptUnlockStyle").value;
        }
    }
    if (document.getElementById("scriptWearAmountMin") && document.getElementById("scriptWearAmountMax")) {
        if (document.getElementById("scriptFloatRangeSelect").value === "不限") {
            floatRangeMin = -1;
            floatRangeMax = -1;
        } else {
            floatRangeMin = parseFloat(document.getElementById("scriptWearAmountMin").value);
            floatRangeMax = parseFloat(document.getElementById("scriptWearAmountMax").value);
        }
    }


    return new TradeInformation(userId, itemId, itemName, unlockStyle, floatRangeMin, floatRangeMax, tradeAmount, tradePriceCurrent, priceUpStep, tradePriceMax, paymentMethod, updatedFlag)
}

/* ========================================== 更新款式Filter ========================================== */
async function updateUnlockStyleFilter(unlockStyle) {
    const unlockStyleSelectorList = document.getElementsByName("unlock_style").values();
    // 将整个更新函数封装至Promise以解决函数同步问题
    return new Promise((resolve) => {
        for (let unlockStyleSelector of unlockStyleSelectorList) {
            if (unlockStyleSelector.style.visibility === "visible") {
                // 检验是否已经选择此款式
                if (document.getElementsByName("unlock_style").item(0).childNodes.item(1).textContent === unlockStyle) {
                    resolve();
                } else {
                    for (let unlockStyleButton of unlockStyleSelector.getElementsByTagName("h6")) {
                        if (unlockStyleButton.innerText === unlockStyle) {
                            const itemListContainer = document.getElementsByClassName('detail-tab-cont').item(0);
                            // 监听器设置
                            const observerConfig = {
                                subtree: true, childList: true, attributes: true, attributeOldValue: true
                            };
                            // 回调监听器
                            const callbackObserver = new MutationObserver((mutationList, observer) => {
                                for (let mutation of mutationList) {
                                    if (mutation.type === "childList") {
                                        for (let removedNode of mutation.removedNodes) {
                                            if (removedNode.className === "spinner showLoading") {
                                                observer.disconnect();
                                                resolve();
                                            }
                                        }
                                    }
                                }
                            });
                            callbackObserver.observe(itemListContainer, observerConfig);
                            unlockStyleButton.click();
                        }
                    }
                }
            }
        }
    });
}

/* ========================================== 更新自定义磨损度Filter(10,10为全部 && 11,11为不限) ========================================== */
async function updateFloatRangeFilter(floatRangeMin, floatRangeMax) {
    const floatRangeSelectorList = document.getElementsByName("float_range").values();
    // 将整个更新函数封装至Promise以解决函数同步问题
    return new Promise((resolve) => {
        for (let floatRangeSelector of floatRangeSelectorList) {
            if (floatRangeSelector.style.visibility === "visible") {
                const selectedFloatRange = document.getElementById("custom_paintwear_show").textContent.split("-")
                // 检验是否已经选择此磨损度
                if (selectedFloatRange.includes(floatRangeMin) && selectedFloatRange.includes(floatRangeMax)) {
                    return resolve();
                } else if (floatRangeMin === 10 && floatRangeMax === 10) {
                    for (let floatRangeButton of floatRangeSelector.getElementsByTagName("h6")) {
                        if (floatRangeButton.innerText === "全部") {
                            floatRangeButton.click();
                            return resolve();
                        }
                    }
                } else if (floatRangeMin === 11 && floatRangeMax === 11) {
                    for (let floatRangeButton of floatRangeSelector.getElementsByTagName("h6")) {
                        if (floatRangeButton.innerText === "不限") {
                            floatRangeButton.click();
                            return resolve();
                        }
                    }
                } else {
                    for (let floatRangeButton of floatRangeSelector.getElementsByTagName("h6")) {
                        if (floatRangeButton.innerText === "自定义") {
                            const popupContainerNode = document.getElementById("popup-container");
                            const itemListContainer = document.getElementsByClassName('detail-tab-cont').item(0);
                            // 监听器设置
                            const observerConfig = {
                                subtree: true, childList: true, attributes: true, attributeOldValue: true
                            };
                            // 回调监听器
                            const callbackObserver = new MutationObserver((mutationList, observer) => {
                                for (let mutation of mutationList) {
                                    if (mutation.type === "childList") {
                                        for (let removedNode of mutation.removedNodes) {
                                            if (removedNode.className === "spinner showLoading") {
                                                observer.disconnect();
                                                return resolve();
                                            }
                                        }
                                    }
                                }
                            });
                            const popupCustomPaintWearContainerObserver = new MutationObserver((mutationList, observer) => {
                                for (let mutation of mutationList) {
                                    if (mutation.target.id === "custom-paintwear-container" && mutation.target.style.getPropertyValue("display") === "block") {
                                        observer.disconnect();
                                        document.getElementsByName("custom_min").item(0).value = floatRangeMin;
                                        document.getElementsByName("custom_max").item(0).value = floatRangeMax;
                                        callbackObserver.observe(itemListContainer, observerConfig);
                                        document.getElementById("custom_paintwear_confirm").click();
                                        break;
                                    }
                                }
                            });
                            popupCustomPaintWearContainerObserver.observe(popupContainerNode, observerConfig);
                            floatRangeButton.click();
                        }
                    }
                }
            }
        }
    });
}

/* ========================================== 获取当前物品ID ========================================== */
function getItemId() {
    return window.location.pathname.slice(7);
}

/* ========================================== 获取当前物品名称 ========================================== */
function getItemName() {
    const itemNameContainer = document.getElementsByClassName("detail-cont").item(0).getElementsByTagName("h1").item(0);
    return itemNameContainer.innerText;
}

/* ========================================== 获取当前用户名称 ========================================== */
function getUserID() {
    const userID = document.getElementById("navbar-user-name");

    return userID.innerText;
}

// 错误抛出函数
function throwError(message) {
    throw new Error(message);
}

/* ========================================== 计算加价幅度 ========================================== */
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

/* ========================================== 刷新当前页面 ========================================== */
function reloadTabFrontend() {
    chrome.tabs.getCurrent(function (tab) {
        chrome.tabs.reload(tab.id, null, function () {
            console.log("Reloaded tab");
        });
    });
}