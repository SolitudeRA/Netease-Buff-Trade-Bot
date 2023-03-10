//发布求购
function postWanted(goodsID, customWearAmountMin, customWearAmountMax, wantedPrice, wantedAmount, paymentMethod, unlockStyle) {
    const observerConfig = {
        childList: true, subtree: true, attributes: true, attributeOldValue: true
    };
    const bodyNode       = document.getElementsByTagName("body").item(0);

    //初始化磨损输入栏监听器
    const setWearAmountObserver = new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
            if (mutation.target.id === "loading-cover" && mutation.attributeName === "style" && mutation.oldValue === "display: block;") {
                observer.disconnect();
                document.getElementsByClassName("i_Btn i_Btn_main supply-buy-confirm-btn").item(0).click();
            }
        }
    });

    //初始化求购设置监听器
    const popupWantedOptionsObserver = new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
            //确定监听目标发生变化_验证有无磨损度选择栏_验证有无款式选择栏
            if (mutation.target.id === "j_popup_supply" && mutation.target.style.getPropertyValue("display") === "block" && !document.getElementById("j_select-specific-paintwear")) {
                observer.disconnect();
                setWantedPrice(wantedPrice);
                setWantedAmount(wantedAmount);
                document.getElementsByClassName("i_Btn i_Btn_main supply-buy-confirm-btn").item(0).click();
            } else if (mutation.target.id === "j_select-specific-paintwear" && mutation.attributeName === "style" && unlockStyle === "") {
                observer.disconnect();
                setWearAmountObserver.observe(bodyNode, observerConfig);
                setWantedPrice(wantedPrice);
                setWantedAmount(wantedAmount);
                setWearAmount(customWearAmountMin, customWearAmountMax);
            } else if (mutation.target.id === "j_select-specific-paintwear" && mutation.attributeName === "style") {
                observer.disconnect();
                setWearAmountObserver.observe(bodyNode, observerConfig);
                setStyle(unlockStyle);
                setWantedPrice(wantedPrice);
                setWantedAmount(wantedAmount);
                setWearAmount(customWearAmountMin, customWearAmountMax);
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

    //初始化支付方式监听器
    const popupPaymentOptionsObserver = new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(function(currentValue, currentIndex, listObj) {
                    //确定监听目标发生变化_弹出支付确认框
                    if (currentValue.id === "j_popup_epay") {
                        setPaymentMethod(paymentMethod);
                        document.getElementsByClassName("i_Btn pay-btn").item(0).click();
                        observer.disconnect();
                    }
                });
            }
        }
    });

    //初始化支付完成监听器
    const popUpPaymentCompleteObserver = new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
            if (mutation.target.id === "j_w-Toast" && mutation.target.className === "w-Toast_success" && mutation.type === "attributes" && mutation.target.style.getPropertyValue("display") === "block") {
                observer.disconnect();
                //持久化求购数据
                const wantedData = new WantedData(customWearAmountMin, customWearAmountMax, wantedPrice, wantedAmount, paymentMethod, unlockStyle);
                callSaveDataToChromeLocalStorage(goodsID, JSON.stringify(wantedData));
            }
        }
    });

    popupPriceTooHighObserver.observe(bodyNode, observerConfig);
    popupWantedOptionsObserver.observe(bodyNode, observerConfig);
    popupPaymentOptionsObserver.observe(bodyNode, observerConfig);
    popUpPaymentCompleteObserver.observe(bodyNode, observerConfig);
    document.getElementsByClassName("i_Btn i_Btn_mid i_Btn_D_red btn-supply-buy").item(0).click();
}

//设置款式
function setStyle(unlockStyle) {
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
function setWantedPrice(wantedPrice) {
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
function setWantedAmount(wantedAmount) {
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