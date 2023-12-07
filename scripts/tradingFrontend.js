/*#######################################################################################

    交易相关组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/*========================================================================================

        交易后台Chrome Message API调用监听器

=========================================================================================*/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getCurrentHighestPrice") {
        getCurrentHighestPrice().then((currentHighestPrice) => {
            getCurrentHighestPriceUserID().then((currentHighestPriceUserID) => {
                console.log("Get highest price " + currentHighestPrice + " with user ID: " + currentHighestPriceUserID);
                sendResponse({
                    status: true,
                    userID: currentHighestPriceUserID,
                    currentHighestPrice: currentHighestPrice
                });
            })
        });
    }

    if (request.action === "postWanted") {
        postWanted(request.tradeInformation).then(() => {
            sendResponse({status: true});
        });
    }

    return true;
});

/*========================================================================================

        发布求购函数

=========================================================================================*/

// 发布求购主函数，包括所有流程控制监听器
// TODO:权宜之计
async function postWanted(tradeInformation) {
    const existUnlockStyle = (document.getElementsByName("unlock_style").length !== 0);
    const existFloatRange = (document.getElementsByName("float_range").length !== 0);
    // 封装函数体
    return new Promise((resolve, reject) => {
        // MutationObserver设置
        const observerConfig = {
            subtree: true, childList: true, characterData: true, attributes: true, attributeOldValue: true
        };
        // 求购发布成功监听器
        const confirmPostWantedSuccessObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.type === "childList" && mutation.target.id === "j_w-Toast" && (mutation.removedNodes.length > 0)) {
                    observer.disconnect();
                    console.log("post wanted success with " + tradeInformation.toString());
                    resolve();
                }
            }
        });
        // 支付方式选择监听器
        const popupPaymentMethodObserver = new MutationObserver(async (mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.type === "childList" && mutation.target.className === "i_Btn pay-btn" && mutation.addedNodes.length > 0) {
                    if (document.getElementById("j_popup_epay").style.display === "block") {
                        observer.disconnect();
                        await setPaymentMethod(tradeInformation.paymentMethod);
                        confirmPostWantedSuccessObserver.observe(document.getElementsByTagName("body").item(0), observerConfig);
                        document.getElementsByClassName("i_Btn pay-btn").item(0).click();
                        break;
                    }
                }
            }//
        });
        // 发布求购信息栏弹出监听器
        const popupTradeInformationObserver = new MutationObserver(async (mutationList, observer) => {
            for (let mutation of mutationList) {
                if (document.getElementById("j_select-specific-paintwear") !== null) {
                    if (window.getComputedStyle(document.getElementById("j_select-specific-paintwear")).visibility === "visible") {
                        observer.disconnect();
                        if (existUnlockStyle) {
                            await setUnlockStyle(tradeInformation.unlockStyle);
                        }
                        await setTradePrice(tradeInformation.tradePriceCurrent);
                        await setTradeAmount(tradeInformation.tradeAmount);
                        if (existFloatRange) {
                            await setFloatRange(tradeInformation.floatRangeMin, tradeInformation.floatRangeMax);
                        }
                        popupPaymentMethodObserver.observe(document.getElementsByTagName("body").item(0), observerConfig);
                        document.getElementsByClassName("i_Btn i_Btn_main supply-buy-confirm-btn").item(0).click();
                        break;
                    }
                }
            }
        });

        popupTradeInformationObserver.observe(document.getElementsByTagName("body").item(0), observerConfig);
        document.getElementsByClassName("i_Btn i_Btn_mid i_Btn_D_red btn-supply-buy").item(0).click();
    });
}

/*========================================================================================

        工具函数

=========================================================================================*/

// 发布求购流程中设置款式
async function setUnlockStyle(unlockStyle) {
    // 声明款式选择对象
    const unlockStyleList = document.getElementById("j_select-unlock_style").getElementsByTagName("li");
    // 封装函数体
    return new Promise((resolve) => {
        for (let currentNode of unlockStyleList) {
            if (currentNode.textContent === unlockStyle) {
                currentNode.click();
                resolve();
            }
        }
    })
}

// 发布求购流程中设置求购磨损
async function setFloatRange(floatRangeMin, floatRangeMax) {
    // MutationObserver设置
    const observerConfig = {
        subtree: true, childList: true, characterData: true, attributes: true, attributeOldValue: true
    };
    const inputEvent = new Event("input");
    // 声明款式磨损选择列表
    const floatRangeSelectList = document.getElementById("j_select-specific-paintwear").getElementsByTagName("li");
    // 封装函数体
    return new Promise((resolve) => {
        if (floatRangeMin === -1 && floatRangeMax === -1) {
            for (let floatRangeSelectNode of floatRangeSelectList) {
                if (floatRangeSelectNode.innerText.includes("不限磨损")) {
                    floatRangeSelectNode.click();
                    resolve();
                    break;
                }
            }
        }
        for (let floatRangeSelectNode of floatRangeSelectList) {
            if (floatRangeSelectNode.innerText === "自定义") {
                // 自定义磨损输入完成监听器
                const customFloatRangeInputCompleteObserver = new MutationObserver((mutationList, observer) => {
                    for (let mutation of mutationList) {
                        if (window.getComputedStyle(document.getElementById("custom-paintwear-container")).display === "none") {
                            observer.disconnect();
                            resolve();
                            break;
                        }
                    }
                });
                // 自定义磨损输入监听器
                const customFloatRangeInputObserver = new MutationObserver((mutationList, observer) => {
                    for (let mutation of mutationList) {
                        if (mutation.type === "attributes" && mutation.target.id === "custom-paintwear-container" && mutation.target.style.display === "block") {
                            observer.disconnect();
                            document.getElementsByName("custom_min").item(0).value = floatRangeMin;
                            document.getElementsByName("custom_min").item(0).dispatchEvent(inputEvent);
                            document.getElementsByName("custom_max").item(0).value = floatRangeMax;
                            document.getElementsByName("custom_max").item(0).dispatchEvent(inputEvent);
                            document.getElementById("custom_paintwear_confirm").click();
                            break;
                        }
                    }
                });
                customFloatRangeInputCompleteObserver.observe(document.getElementById("popup-container"), observerConfig);
                customFloatRangeInputObserver.observe(document.getElementById("popup-container"), observerConfig);
                floatRangeSelectNode.click();
                break;
            }
        }
    });
}

// 发布求购流程中设置求购单价
async function setTradePrice(tradePrice) {
    // 初始化input事件
    const inputEvent = new Event('input', {
        bubbles: true, cancelable: true
    });
    const tradePriceInput = document.getElementsByName("price").item(0);
    // 设置单价
    tradePriceInput.value = tradePrice;
    // 触发input事件
    tradePriceInput.dispatchEvent(inputEvent);
}

// 发布求购流程中设置求购数量
async function setTradeAmount(tradeAmount) {
    // 初始化input事件
    const inputEvent = new Event('input', {
        bubbles: true, cancelable: true
    });
    const tradeAmountInput = document.getElementsByName("num").item(0);
    // 设置求购数量
    tradeAmountInput.value = tradeAmount;
    // 触发input事件
    tradeAmountInput.dispatchEvent(inputEvent);
}

// 发布求购流程中选择支付方式
// TODO: 余额不足验证
async function setPaymentMethod(paymentMethod) {
    const paymentMethodNodeList = document.getElementsByClassName("pay-method-list").item(0).getElementsByTagName("li");
    for (let paymentMethodNode of paymentMethodNodeList) {
        if (paymentMethodNode.getAttribute("data-method").includes(paymentMethod)) {
            paymentMethodNode.click();
        }
    }
}

/* ========================================== 获取当前最高价 ========================================== */
async function getCurrentHighestPrice() {
    return new Promise((resolve) => {
        let heightPriceHeads = Array.from(document.getElementsByClassName("list_tb_csgo").item(0).getElementsByTagName("tr").item(0).getElementsByTagName("th"));
        let heightPriceCellNumber = 0;
        heightPriceHeads.forEach((heightPriceHead, index) => {
            if (heightPriceHead.textContent === "求购单价") {
                heightPriceCellNumber = index;
            }
        });
        let heightPriceCells = Array.from(document.getElementsByClassName("list_tb_csgo").item(0).getElementsByTagName("tr").item(1).getElementsByTagName("td"));

        resolve(parseFloat(heightPriceCells[heightPriceCellNumber].getElementsByTagName("strong").item(0).innerText.slice(1)));
    });
}

/* ========================================== 获取当前最高出价用户ID ========================================== */
async function getCurrentHighestPriceUserID() {
    return new Promise((resolve) => {
        let heightPriceHeads = Array.from(document.getElementsByClassName("list_tb_csgo").item(0).getElementsByTagName("tr").item(0).getElementsByTagName("th"));
        let heightPriceUserIDCellNumber = 0;
        heightPriceHeads.forEach((heightPriceHead, index) => {
            if (heightPriceHead.textContent === "买家") {
                heightPriceUserIDCellNumber = index;
            }
        });
        let heightPriceCells = Array.from(document.getElementsByClassName("list_tb_csgo").item(0).getElementsByTagName("tr").item(1).getElementsByTagName("td"));

        resolve(heightPriceCells[heightPriceUserIDCellNumber].getElementsByTagName("span").item(0).innerText)
    });
}

/* ========================================== 加载交易信息 ========================================== */
async function retrievePersistedTradeInformation(itemID) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            action: "getTradeInformation",
            itemId: itemID
        }, function (response) {
            if (response) {
                resolve(response);
            } else {
                console.log("Frontend retrieving trade information error");
            }
        });
    });
}

// 前端信息验证
async function checkInputValue() {
    const existUnlockStyle = (document.getElementById("scriptUnlockStyle") !== null);
    const existFloatRange = (document.getElementById("scriptFloatRangeSelect") !== null);
    return new Promise((resolve, reject) => {
        // 消除错误提示
        if (existUnlockStyle) {
            if (document.getElementById("scriptUnlockStyle").classList.contains("is-invalid")) {
                document.getElementById("scriptUnlockStyle").classList.remove("is-invalid");
            }
        }
        if (existFloatRange) {
            if (document.getElementById("scriptFloatRangeSelect").classList.contains("is-invalid")) {
                document.getElementById("scriptFloatRangeSelect").classList.remove("is-invalid");
            }
        }
        // 输入信息验证
        if (existUnlockStyle) {
            if (document.getElementById("scriptUnlockStyle").value === "全部") {
                document.getElementById("scriptUnlockStyle").classList.add("is-invalid");
                reject()
            }
        }
        if (existFloatRange) {
            if (document.getElementById("scriptFloatRangeSelect").value === "全部") {
                document.getElementById("scriptFloatRangeSelect").classList.add("is-invalid");
                reject()
            }
        }
        resolve();
    });
}


