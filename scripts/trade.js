/*#######################################################################################

    交易相关组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/*========================================================================================

        函数Chrome Message API调用监听器

=========================================================================================*/
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.action === "updateWanted") {
        const tradeInformation = request.payload;
        postWanted(tradeInformation).then(() => {
            sendResponse({status: true});
        }).catch(throwError("Post Wanted Message API Error"));

    }
});

/*========================================================================================

        发布求购函数

=========================================================================================*/

function postWanted(tradeInformation) {
    //MutationObserver设置
    const observerConfig = {
        childList: true, subtree: true, attributes: true, attributeOldValue: true
    };
    const bodyNode       = document.getElementsByTagName("body").item(0);
    return new Promise((resolve) => {
        //初始化磨损输入栏监听器
        const setWearAmountObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.target.id === "loading-cover" && mutation.attributeName === "style" && mutation.oldValue === "display: block;") {
                    observer.disconnect();
                    document.getElementsByClassName("i_Btn i_Btn_main supply-buy-confirm-btn").item(0).click();
                }
            }
        });

        //初始化过高价格弹窗监听器
        const popupPriceTooHighObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                //确定监听目标发生变化_弹出出价过高确认框_未弹出则在发布成功时离线监听器
                if (mutation.target.className === "popup popup_common " && mutation.target.getElementsByClassName("popup-desc").item(0).firstChild.textContent.includes("你的求购价格高于在售价格")) {
                    mutation.target.getElementsByClassName("i_Btn i_Btn_main").item(0).click();
                    observer.disconnect();
                } else if (mutation.target.id === "j_w-Toast" && mutation.target.className === "w-Toast_success") {
                    if (mutation.target.style.getPropertyValue("display") === "block") {
                        observer.disconnect();
                    }
                }
            }
        });

        //初始化求购设置监听器
        const popupWantedOptionsObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                //确定监听目标发生变化_验证有无磨损度选择栏_验证有无款式选择栏
                if (mutation.target.id === "j_popup_supply" && mutation.target.style.getPropertyValue("display") === "block" && !document.getElementById("j_select-specific-paintwear")) {
                    observer.disconnect();
                    setTradePrice(tradeInformation.currentTradePrice);
                    setTradeAmount(tradeInformation.tradeAmount);
                    document.getElementsByClassName("i_Btn i_Btn_main supply-buy-confirm-btn").item(0).click();
                } else if (mutation.target.id === "j_select-specific-paintwear" && mutation.attributeName === "style" && tradeInformation.unlockStyle === "") {
                    observer.disconnect();
                    setWearAmountObserver.observe(bodyNode, observerConfig);
                    setTradePrice(tradeInformation.currentTradePrice);
                    setTradeAmount(tradeInformation.tradeAmount);
                    setWearAmount(tradeInformation.customWearAmountMin, tradeInformation.customWearAmountMax);
                } else if (mutation.target.id === "j_select-specific-paintwear" && mutation.attributeName === "style") {
                    observer.disconnect();
                    setWearAmountObserver.observe(bodyNode, observerConfig);
                    setUnlockStyle(tradeInformation.unlockStyle);
                    setTradePrice(tradeInformation.currentTradePrice);
                    setTradeAmount(tradeInformation.tradeAmount);
                    setWearAmount(tradeInformation.customWearAmountMin, tradeInformation.customWearAmountMax);
                }
            }
        });

        //初始化支付方式监听器
        const popupPaymentOptionsObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach(function(currentNode) {
                        //确定监听目标发生变化_弹出支付确认框
                        if (currentNode.id === "j_popup_epay") {
                            setPaymentMethod(tradeInformation.paymentMethod);
                            document.getElementsByClassName("i_Btn pay-btn").item(0).click();
                            observer.disconnect();
                        }
                    });
                }
            }
        });

        //初始化支付完成监听器
        const popUpPaymentCompleteObserver = new MutationObserver(async (mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.target.id === "j_w-Toast" && mutation.target.className === "w-Toast_success" && mutation.type === "attributes" && mutation.target.style.getPropertyValue("display") === "block") {
                    observer.disconnect();
                    //更新交易信息
                    tradeInformation.updatedFlag = tradeInformation.updatedFlag + 1;
                    chrome.runtime.sendMessage({action: "saveTradeInformation", tradeInformation: tradeInformation}, function(response) {
                        if (response.status === true) {
                            resolve();
                        } else {
                            throwError("SaveTradeInformation Error");
                        }
                    });
                }
            }
        });

        popupPriceTooHighObserver.observe(bodyNode, observerConfig);
        popupWantedOptionsObserver.observe(bodyNode, observerConfig);
        popupPaymentOptionsObserver.observe(bodyNode, observerConfig);
        popUpPaymentCompleteObserver.observe(bodyNode, observerConfig);
        document.getElementsByClassName("i_Btn i_Btn_mid i_Btn_D_red btn-supply-buy").item(0).click();
    });
}

/*========================================================================================

        工具函数

=========================================================================================*/

//设置款式
function setUnlockStyle(unlockStyle) {
    const unlockStyleList = document.getElementById("j_select-unlock_style").childNodes.item(5).childNodes;
    unlockStyleList.forEach(function(currentValue, currentIndex, listObj) {
        if (currentValue.nodeName === "LI" && currentValue.textContent === unlockStyle) {
            currentValue.click();
        }
    });
}

//设置求购磨损
function setWearAmount(customWearAmountMin, customWearAmountMax) {
    const observerConfig            = {
        childList: true, subtree: true, attributes: true, attributeFilter: ["display"]
    };
    const popupContainer            = document.getElementById("popup-container");
    const wearAmountConfirmObserver = new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
            //TODO:解决多次判定问题
            if (document.getElementById("custom-paintwear-container") && document.getElementById("custom-paintwear-container").style.getPropertyValue("display") === "block") {
                document.getElementById("custom_paintwear_confirm").click();
                observer.disconnect();
            }
        }
    });
    const wearAmount                = document.getElementsByClassName("w-Select specific-paintwear w-Select-scroll float_range");
    const wearAmountList            = wearAmount.item(0).getElementsByTagName("li");
    wearAmountConfirmObserver.observe(popupContainer, observerConfig);
    //选择自定义磨损
    wearAmountList.item(wearAmountList.length - 1).click();
    document.getElementsByName("custom_min").item(0).value = customWearAmountMin;
    document.getElementsByName("custom_max").item(0).value = customWearAmountMax;
}

//设置求购单价
function setTradePrice(wantedPrice) {
    //初始化input事件
    const inputEvent = new Event('input', {
        bubbles: true, cancelable: true
    });
    const price      = document.getElementsByClassName("i_Text j_filter buyPrice").item(0);
    //设置单价
    price.value      = wantedPrice;
    //触发input事件
    price.dispatchEvent(inputEvent);
}

//设置求购数量
function setTradeAmount(wantedAmount) {
    const inputEvent = new Event('input', {
        bubbles: true, cancelable: true
    });
    const amount     = document.getElementsByTagName("input").namedItem("num");
    amount.value     = wantedAmount;
    amount.dispatchEvent(inputEvent);
}

//选择支付方式
function setPaymentMethod(paymentMethod) {
    if (paymentMethod === 0) {
        document.getElementsByClassName("pay-method-list").item(0).getElementsByTagName("li").item(0).click();
    } else if (paymentMethod === 1) {
        document.getElementsByClassName("pay-method-list").item(0).getElementsByTagName("li").item(1).click();
    } else if (paymentMethod === 2) {
        document.getElementsByClassName("pay-method-list").item(0).getElementsByTagName("li").item(2).click();
    } else if (paymentMethod === 3) {
        document.getElementsByClassName("pay-method-list").item(0).getElementsByTagName("li").item(3).click();
    } else {
        window.alert("SetPaymentMethod Error");
    }
}