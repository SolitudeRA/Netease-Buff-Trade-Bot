/*#######################################################################################

    前端UI注入组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

/*========================================================================================

    修复网页样式

=========================================================================================*/

document.getElementsByClassName("market-header black").item(0).style = "padding-bottom: 20px";

/*========================================================================================

    初始化UI对象

=========================================================================================*/

// 后台交易信息加载标志
let tradeInformationLoadFlag = false;

/* ========================================== 初始化UI容器 ========================================== */
const itemList = document.getElementsByClassName("market-header black").item(0);
let toolbarTitleContainer = document.createElement("div");
toolbarTitleContainer.className = "col-2";
let toolbarTitle = document.createElement("h1");
toolbarTitle.className = "h3 text-white text-center";
toolbarTitle.textContent = "自动求购";
toolbarTitle.id = "scriptItemInformation";
mountItemDataToElement(toolbarTitle);
mountUserDataToElement(toolbarTitle);
toolbarTitleContainer.appendChild(toolbarTitle);

let toolBars = [...Array(3)].map(() => {
    let element = document.createElement("div");
    element.className = "container-fluid bg-dark script-toolbar";

    return element;
});
let toolBarsRows = [...Array(3)].map((value, index) => {
    let element = document.createElement("div");
    if (index === 2) {
        element.className = "row justify-content-between";
    } else {
        element.className = "row";
    }
    toolBars[index].appendChild(element);

    return element;
})
let blanks = [...Array(3)].map(() => {
    let element = document.createElement("div");
    element.className = "blank20";

    return element;
});

/* ========================================== 检测并初始化款式选择栏 ========================================== */
// 初始化组件容器
let unlockStyleContainer = document.createElement("div");
unlockStyleContainer.className = "col-3";
// 初始化组件
let unlockStyleSelectInput = document.createElement("select");
unlockStyleSelectInput.className = "form-select form-color-fix";
unlockStyleSelectInput.id = "scriptUnlockStyle";

/* ========================================== 检测并初始化磨损度范围输入栏 ========================================== */
// 初始化组件容器
let floatRangeInputContainer = document.createElement("div");
floatRangeInputContainer.className = "col-5";
// 初始化组件
let floatRangeSelect = document.createElement("select");
floatRangeSelect.className = "form-select text-center form-color-fix float-range-select-fix";
floatRangeSelect.id = "scriptFloatRangeSelect";
let floatRangeMinInput = document.createElement("input");
floatRangeMinInput.className = "form-control text-center form-color-fix";
floatRangeMinInput.id = "scriptWearAmountMin";
let floatRangeMaxInput = document.createElement("input");
floatRangeMaxInput.className = "form-control text-center form-color-fix";
floatRangeMaxInput.id = "scriptWearAmountMax";

/* ========================================== 初始化求购数量输入栏 ========================================== */
// 初始化组件容器
let tradingAmountInputContainer = document.createElement("div");
tradingAmountInputContainer.className = "col-2";
let tradingAmountInputGroup = document.createElement("div");
tradingAmountInputGroup.className = "input-group";
// 初始化组件
let tradingAmountInputTitle = document.createElement("span");
tradingAmountInputTitle.className = "input-group-text form-label-color-fix";
tradingAmountInputTitle.textContent = "求购数量";
let tradingAmountInput = document.createElement("input");
tradingAmountInput.className = "form-control text-center form-color-fix";
tradingAmountInput.value = "1";
tradingAmountInput.id = "scriptTradeAmount";
// 初始化求购数量输入栏内容
tradingAmountInputGroup.appendChild(tradingAmountInputTitle);
tradingAmountInputGroup.appendChild(tradingAmountInput);
tradingAmountInputContainer.appendChild(tradingAmountInputGroup);

/* ========================================== 初始化本次出价输入栏 ========================================== */
// 初始化组件容器
let priceCurrentInputContainer = document.createElement("div");
priceCurrentInputContainer.className = "col";
let priceCurrentInputGroup = document.createElement("div");
priceCurrentInputGroup.className = "input-group";
// 初始化组件
let priceCurrentInputTitle = document.createElement("span");
priceCurrentInputTitle.className = "input-group-text form-label-color-fix";
priceCurrentInputTitle.textContent = "本次出价";
let priceCurrentInput = document.createElement("input");
priceCurrentInput.className = "form-control text-center form-color-fix";
priceCurrentInput.placeholder = "0";
priceCurrentInput.id = "scriptTradePriceCurrent";
// 初始化本次出价输入栏内容
priceCurrentInputGroup.appendChild(priceCurrentInputTitle);
priceCurrentInputGroup.appendChild(priceCurrentInput);
priceCurrentInputContainer.appendChild(priceCurrentInputGroup);

/* ========================================== 初始化竞价幅度输入栏 ========================================== */
// 初始化组件容器
let priceUpStepInputContainer = document.createElement("div");
priceUpStepInputContainer.className = "col";
let priceUpStepInputGroup = document.createElement("div");
priceUpStepInputGroup.className = "input-group";
// 初始化组件
let priceUpStepInputTitle = document.createElement("span");
priceUpStepInputTitle.className = "input-group-text form-label-color-fix";
priceUpStepInputTitle.textContent = "竞价幅度";
let priceUpStepInput = document.createElement("input");
priceUpStepInput.className = "form-control text-center form-color-fix";
priceUpStepInput.placeholder = "0";
priceUpStepInput.id = "scriptPriceUpStep";
// 初始化竞价幅度输入栏内容
priceUpStepInputGroup.appendChild(priceUpStepInputTitle);
priceUpStepInputGroup.appendChild(priceUpStepInput);
priceUpStepInputContainer.appendChild(priceUpStepInputGroup);

/* ========================================== 初始化预期最高价输入栏 ========================================== */
// 初始化组件容器
let priceMaxInputContainer = document.createElement("div");
priceMaxInputContainer.className = "col";
let priceMaxInputGroup = document.createElement("div");
priceMaxInputGroup.className = "input-group";
// 初始化组件
let priceMaxInputTitle = document.createElement("span");
priceMaxInputTitle.className = "input-group-text form-label-color-fix";
priceMaxInputTitle.textContent = "最高价";
let priceMaxInput = document.createElement("input");
priceMaxInput.className = "form-control text-center form-color-fix";
priceMaxInput.placeholder = "0";
priceMaxInput.id = "scriptTradePriceMax";
// 初始化预期最高价输入栏内容
priceMaxInputGroup.appendChild(priceMaxInputTitle);
priceMaxInputGroup.appendChild(priceMaxInput);
priceMaxInputContainer.appendChild(priceMaxInputGroup);

/* ========================================== 初始化支付方式选择栏 ========================================== */
// 初始化组件容器
let paymentMethodSelectContainer = document.createElement("div");
paymentMethodSelectContainer.className = "col-4";
let paymentMethodSelectInputGroup = document.createElement("div");
paymentMethodSelectInputGroup.className = "input-group";
// 初始化组件
let paymentMethodSelectTitle = document.createElement("span");
paymentMethodSelectTitle.className = "input-group-text form-label-color-fix";
paymentMethodSelectTitle.textContent = "支付方式";
let paymentMethodSelect = document.createElement("select");
paymentMethodSelect.className = "form-select form-color-fix";
paymentMethodSelect.id = "scriptPaymentMethod";
let paymentMethodOptions = [...Array(5)].map(() => document.createElement("option"));
paymentMethodOptions[0].value = "先求后付";
paymentMethodOptions[0].textContent = "BUFF余额-先求后付";
paymentMethodOptions[1].value = "支付宝";
paymentMethodOptions[1].textContent = "BUFF余额-支付宝";
paymentMethodOptions[2].value = "微信支付";
paymentMethodOptions[2].textContent = "微信支付";
paymentMethodOptions[3].value = "银行卡";
paymentMethodOptions[3].textContent = "BUFF余额-银行卡";
paymentMethodOptions[4].value = "网易支付";
paymentMethodOptions[4].textContent = "网易支付";
paymentMethodSelect.appendChild(paymentMethodOptions[0]);
paymentMethodSelect.appendChild(paymentMethodOptions[1]);
paymentMethodSelect.appendChild(paymentMethodOptions[2]);
paymentMethodSelect.appendChild(paymentMethodOptions[3]);
paymentMethodSelect.appendChild(paymentMethodOptions[4]);
// 初始化支付方式选择栏内容
paymentMethodSelectInputGroup.appendChild(paymentMethodSelectTitle);
paymentMethodSelectInputGroup.appendChild(paymentMethodSelect);
paymentMethodSelectContainer.appendChild(paymentMethodSelectInputGroup);

/* ========================================== 初始化出价次数指示器 ========================================== */
// 初始化组件容器
let updatedFlagContainer = document.createElement("div");
updatedFlagContainer.className = "col-3";
// 初始化组件
let updatedFlagButton = document.createElement("button");
updatedFlagButton.className = "btn btn-secondary btn-lg";
updatedFlagButton.textContent = "已出价次数 ";
let updatedFlag = document.createElement("span");
updatedFlag.className = "badge text-bg-warning";
updatedFlag.textContent = "0";
updatedFlag.id = "scriptUpdatedFlag";
updatedFlagButton.appendChild(updatedFlag);
// 初始化出价次数指示器内容
updatedFlagContainer.appendChild(updatedFlagButton);

/* ========================================== 初始化监听控制按钮栏 ========================================== */
// 初始化组件容器
let idleMonitorButtonContainer = document.createElement("div");
idleMonitorButtonContainer.className = "col-2";
let idleMonitorButtonContainerRow = document.createElement("div");
idleMonitorButtonContainerRow.className = "row justify-content-end form-row-margin-fix";
let inProgressButtonContainer = document.createElement("div");
inProgressButtonContainer.className = "col-4";
let inProgressButtonContainerRow = document.createElement("div");
inProgressButtonContainerRow.className = "row justify-content-end form-row-margin-fix";
let inProgressButtonGroup = document.createElement("div");
inProgressButtonGroup.className = "col-auto form-row-padding-fix"
// 初始化组件
// 开始监听按钮
let startMonitorButton = document.createElement("button");
startMonitorButton.className = "btn btn-primary btn-lg";
startMonitorButton.textContent = "开始监听";
startMonitorButton.onclick = async function () {
    const tradeInformation = await buildTradeInformation();
    await checkInputValue();
    await postWanted(tradeInformation);
    const response = await initializeMonitorFrontEnd(tradeInformation);
    if (response === true) {
        console.log("成功初始化监视器，交易信息：" + JSON.stringify(tradeInformation, null, 4));
    } else {
        console.log("初始化监视器失败");
    }
};
idleMonitorButtonContainer.appendChild(startMonitorButton);
// 更新监听参数按钮
let updateMonitorButton = document.createElement("button");
updateMonitorButton.className = "btn btn-success btn-lg";
updateMonitorButton.textContent = "更新监听参数";
updateMonitorButton.onclick = async function () {
    await updateMonitorFrontEnd();
};
idleMonitorButtonContainerRow.appendChild(startMonitorButton);
idleMonitorButtonContainer.appendChild(idleMonitorButtonContainerRow);
// 停止监听按钮
let stopMonitorButton = document.createElement("button");
stopMonitorButton.className = "btn btn-danger btn-lg form-button-margin-fix";
stopMonitorButton.textContent = "停止监听";
stopMonitorButton.onclick = async function () {
    const tradeInformation = await buildTradeInformation();
    const response = await destroyMonitorFrontEnd(tradeInformation);
    if (response === true) {
        console.log("Stopped monitor with trade information: " + JSON.stringify(tradeInformation, null, 4));
        reloadTabFrontend();
    } else {
        console.log("Stopping monitor failed");
    }
};
inProgressButtonGroup.appendChild(updateMonitorButton);
inProgressButtonGroup.appendChild(stopMonitorButton);
inProgressButtonContainerRow.appendChild(inProgressButtonGroup);
inProgressButtonContainer.appendChild(inProgressButtonContainerRow);

/* ========================================== 构造工具栏 ========================================== */
// 插件标题
toolBarsRows[0].appendChild(toolbarTitleContainer);
// 款式选择栏
if (document.getElementsByName("unlock_style")) {
    for (let unlockStyleBlock of document.getElementsByName("unlock_style")) {
        if (unlockStyleBlock.style.visibility === "visible") {
            toolBarsRows[0].appendChild(unlockStyleContainer);
        }
    }
}
// 磨损度范围输入栏
if (document.getElementsByName("float_range")) {
    for (let floatRangeBlock of document.getElementsByName("float_range")) {
        if (floatRangeBlock.style.visibility === "visible") {
            toolBarsRows[0].appendChild(floatRangeInputContainer);
        }
    }
}
// 求购数量输入栏
toolBarsRows[0].appendChild(tradingAmountInputContainer);
// 本次出价输入栏
toolBarsRows[1].appendChild(priceCurrentInputContainer);
// 竞价幅度输入栏
toolBarsRows[1].appendChild(priceUpStepInputContainer);
// 预期最高价输入栏
toolBarsRows[1].appendChild(priceMaxInputContainer);
// 支付方式选择栏
toolBarsRows[1].appendChild(paymentMethodSelectContainer);
// 已出价次数
toolBarsRows[2].appendChild(updatedFlagContainer);

/*========================================================================================

    页面元素监听器

=========================================================================================*/
// 监听对象物品列表容器
const itemListContainer = document.getElementsByClassName('detail-tab-cont').item(0);
// 监听器配置(监听子树, 监听子节点, 监听attribute, 监听attribute旧值)
const observerConfig = {
    subtree: true, childList: true, characterData: true, attributes: true, attributeOldValue: true
};
/* ========================================== 工具栏初始化监听器 ========================================== */
const itemListInitializedObserver = new MutationObserver(async (mutationList, observer) => {
    for (let mutation of mutationList) {
        if (mutation.type === "childList" && document.getElementsByClassName("list_tb_csgo").item(0)) {
            for (let removedNode of mutation.removedNodes) {
                if (removedNode.className === "spinner showLoading") {
                    observer.disconnect();
                    // 初始化交易信息
                    await initializeToolbarInformation();

                    // 注入控制按钮
                    injectButtonToElement(toolBarsRows[2]);
                    break;
                }
            }
        }
    }
});

/*========================================================================================

    注入工具栏

=========================================================================================*/

// 切换到当前求购Tab
switchToWantedTab().then(() => {
    /* ========================================== 检测详情页是否存在该filter并填充组件容器 ========================================== */
    if (document.getElementsByName("unlock_style")) {
        for (let unlockStyleBlock of document.getElementsByName("unlock_style")) {
            if (unlockStyleBlock.style.visibility === "visible") {
                // 填充组件容器
                let unlockStyleInputGroup = document.createElement("div");
                unlockStyleInputGroup.className = "input-group";
                let unlockStyleTitle = document.createElement("span");
                unlockStyleTitle.className = "input-group-text form-label-color-fix";
                unlockStyleTitle.textContent = "款式选择";
                // 复制款式筛选栏选项至款式选择组件
                let unlockStyleSelectNodes = unlockStyleBlock.getElementsByTagName("ul").item(0).childNodes;
                unlockStyleSelectNodes.forEach(function (currentNode) {
                    if (currentNode.nodeName === "LI") {
                        let unlockStyleNodeCache = document.createElement("option");
                        unlockStyleNodeCache.textContent = currentNode.childNodes.item(1).textContent;
                        unlockStyleNodeCache.value = currentNode.childNodes.item(1).textContent;
                        unlockStyleSelectInput.appendChild(unlockStyleNodeCache);
                    }
                });
                unlockStyleSelectInput.addEventListener("change", async () => {
                    // 工具栏款式选择触发下方款式筛选并重新读取价格列表
                    await updateUnlockStyleFilter(unlockStyleSelectInput.value);
                    await updateToolbarPriceInformation();
                })
                unlockStyleInputGroup.appendChild(unlockStyleTitle);
                unlockStyleInputGroup.appendChild(unlockStyleSelectInput);
                unlockStyleContainer.appendChild(unlockStyleInputGroup);
            }
        }
    }
    /* ========================================== 检测并初始化磨损工具栏信息 ========================================== */
    if (document.getElementsByName("float_range")) {
        for (let floatRangeBlock of document.getElementsByName("float_range")) {
            if (floatRangeBlock.style.visibility === "visible") {
                // 初始化组件内容容器
                let floatRangeInputGroup = document.createElement("div");
                floatRangeInputGroup.className = "input-group";
                let floatRangeInputTitle = document.createElement("span");
                floatRangeInputTitle.className = "input-group-text form-label-color-fix";
                floatRangeInputTitle.textContent = "磨损度范围";
                floatRangeSelect.appendChild(document.createElement("option"));
                floatRangeSelect.firstChild.value = "全部";
                floatRangeSelect.firstChild.textContent = "全部";
                // 同步款式选择栏内容
                for (let floatRangeNode of document.getElementById("paintwear_list").getElementsByTagName("li")) {
                    let floatRangeSelectOptionCache = document.createElement("option");
                    floatRangeSelectOptionCache.value = floatRangeNode.getElementsByTagName("h6").item(0).textContent
                    floatRangeSelectOptionCache.textContent = floatRangeNode.getElementsByTagName("h6").item(0).textContent;
                    floatRangeSelect.appendChild(floatRangeSelectOptionCache);
                }
                let floatRangeSpilt = document.createElement("span");
                floatRangeSpilt.className = "input-group-text form-label-color-fix";
                floatRangeSpilt.textContent = "~";
                floatRangeMinInput.value = floatRangeSelect.childNodes.item(2).textContent.split("-")[0];
                floatRangeMaxInput.value = floatRangeSelect.lastChild.previousSibling.textContent.split("-")[1];
                floatRangeMinInput.setAttribute("disabled", "true");
                floatRangeMaxInput.setAttribute("disabled", "true");
                // 初始化磨损度范围输入栏
                floatRangeInputGroup.appendChild(floatRangeInputTitle);
                floatRangeInputGroup.appendChild(floatRangeSelect);
                floatRangeInputGroup.appendChild(floatRangeMinInput);
                floatRangeInputGroup.appendChild(floatRangeSpilt);
                floatRangeInputGroup.appendChild(floatRangeMaxInput);
                floatRangeInputContainer.appendChild(floatRangeInputGroup);
                // 挂载选择栏监听函数
                floatRangeSelect.addEventListener("change", async () => {
                    if (floatRangeSelect.value === "不限") {
                        floatRangeMinInput.value = "";
                        floatRangeMaxInput.value = "";
                        floatRangeMinInput.setAttribute("disabled", "true");
                        floatRangeMaxInput.setAttribute("disabled", "true");
                        await updateFloatRangeFilter(11, 11);
                        await updateToolbarPriceInformation();
                    } else if (floatRangeSelect.value === "全部") {
                        floatRangeMinInput.setAttribute("disabled", "true");
                        floatRangeMaxInput.setAttribute("disabled", "true");
                        floatRangeMinInput.value = floatRangeSelect.childNodes.item(2).textContent.split("-")[0];
                        floatRangeMaxInput.value = floatRangeSelect.lastChild.previousSibling.textContent.split("-")[1];
                        await updateFloatRangeFilter(10, 10);
                        await updateToolbarPriceInformation();
                    } else if (floatRangeSelect.value === "自定义") {
                        floatRangeMinInput.value = "";
                        floatRangeMaxInput.value = "";
                        floatRangeMinInput.removeAttribute("disabled");
                        floatRangeMaxInput.removeAttribute("disabled");
                    } else {
                        floatRangeMinInput.setAttribute("disabled", "true");
                        floatRangeMaxInput.setAttribute("disabled", "true");
                        floatRangeMinInput.value = floatRangeSelect.value.split("-")[0];
                        floatRangeMaxInput.value = floatRangeSelect.value.split("-")[1];
                        await updateFloatRangeFilter(floatRangeMinInput.value, floatRangeMaxInput.value);
                        await updateToolbarPriceInformation();
                    }
                });
                // 挂载输入栏监听函数
                floatRangeMinInput.addEventListener("change", async () => {
                    if (floatRangeMinInput.value < floatRangeMaxInput.value) {
                        if (floatRangeMinInput.classList.contains("is-invalid")) {
                            floatRangeMinInput.classList.remove("is-invalid");
                        }
                        await updateFloatRangeFilter(floatRangeMinInput.value, floatRangeMaxInput.value);
                        await updateToolbarPriceInformation();
                    } else {
                        floatRangeMinInput.classList.add("is-invalid");
                    }
                });
                floatRangeMaxInput.addEventListener("change", async () => {
                    if (floatRangeMinInput.value < floatRangeMaxInput.value) {
                        if (floatRangeMinInput.classList.contains("is-invalid")) {
                            floatRangeMinInput.classList.remove("is-invalid");
                        }
                        await updateFloatRangeFilter(floatRangeMinInput.value, floatRangeMaxInput.value);
                        await updateToolbarPriceInformation();
                    } else {
                        floatRangeMinInput.classList.add("is-invalid");
                    }
                });
                // TODO: 逆向绑定触发工具栏修改
            }
        }
    }

    // 注入工具栏内容
    itemList.parentNode.insertBefore(toolBars[0], itemList);
    itemList.parentNode.insertBefore(blanks[0], itemList);
    itemList.parentNode.insertBefore(toolBars[1], itemList);
    itemList.parentNode.insertBefore(blanks[1], itemList);
    itemList.parentNode.insertBefore(toolBars[2], itemList);
    itemList.parentNode.insertBefore(blanks[2], itemList);

    // 初始化工具栏信息
    itemListInitializedObserver.observe(itemListContainer, observerConfig)
});

/*========================================================================================

    专用工具函数

=========================================================================================*/

// 搜集并挂载物品数据到工具栏
function mountItemDataToElement(element) {
    const itemId = getItemId();
    const itemName = getItemName();
    element.setAttribute("data-itemId", itemId);
    element.setAttribute("data-itemName", itemName);
}

// 挂载用户信息到工具栏
function mountUserDataToElement(element) {
    const userID = getUserID();
    element.setAttribute("data-userId", userID);
}

// 注入按钮到工具栏
function injectButtonToElement(element) {
    retrieveMonitorStatusFrontEnd(getItemId()).then((monitorStatus) => {
        if (monitorStatus === true) {
            element.appendChild(inProgressButtonContainer);
        } else {
            element.appendChild(idleMonitorButtonContainer);
        }
    });
}

// 切换至当前求购列表
async function switchToWantedTab() {
    return new Promise((resolve) => {
        getCurrentURL().then((currentURL) => {
            // 如果当前URL参数包含当前求购列表，则跳过
            if (currentURL.includes("#tab=buying")) {
                resolve();
            } else {
                updateTabToBuying().then(() => {
                    resolve();
                });
            }
        })
    });
}

// 初始化工具栏信息
async function initializeToolbarInformation() {
    console.log("\n尝试加载已保存的交易信息...");
    const changeEvent = new Event("change");
    const response = await retrievePersistedTradeInformation(getItemId());
    return new Promise((resolve, reject) => {
        if (response.status === true) {
            console.log("已查询到已保存的交易信息，加载交易信息至工具栏...");
            tradeInformationLoadFlag = true;
            const tradeInformation = response.tradeInformation;
            if (document.getElementById("scriptUnlockStyle")) {
                document.getElementById("scriptUnlockStyle").value = tradeInformation.unlockStyle;
                document.getElementById("scriptUnlockStyle").dispatchEvent(changeEvent);
            }
            if (document.getElementById("scriptWearAmountMin") && document.getElementById("scriptWearAmountMax")) {
                if (tradeInformation.floatRangeMin === -1 && tradeInformation.floatRangeMax === -1) {
                    floatRangeSelect.value = "不限";
                    floatRangeSelect.dispatchEvent(changeEvent);
                }
                for (let floatRangeOption of floatRangeSelect.childNodes) {
                    let floatRangeOptionValues = floatRangeOption.value.split("-");
                    if (floatRangeOptionValues.includes(tradeInformation.floatRangeMin.toString()) && floatRangeOptionValues.includes(tradeInformation.floatRangeMax.toString())) {
                        floatRangeSelect.value = floatRangeOption.value;
                        floatRangeSelect.dispatchEvent(changeEvent);
                    }
                }
                floatRangeSelect.value = "自定义";
                floatRangeSelect.dispatchEvent(changeEvent);
                document.getElementById("scriptWearAmountMin").value = tradeInformation.floatRangeMin;
                document.getElementById("scriptWearAmountMax").value = tradeInformation.floatRangeMax;
                document.getElementById("scriptWearAmountMax").dispatchEvent(changeEvent);
            }
            document.getElementById("scriptTradeAmount").value = tradeInformation.tradeAmount;
            document.getElementById("scriptTradePriceCurrent").value = tradeInformation.tradePriceCurrent;
            document.getElementById("scriptPriceUpStep").value = tradeInformation.priceUpStep;
            document.getElementById("scriptTradePriceMax").value = tradeInformation.tradePriceMax;
            document.getElementById("scriptPaymentMethod").value = tradeInformation.paymentMethod;
            document.getElementById("scriptUpdatedFlag").value = tradeInformation.updatedFlag;
            document.getElementById("scriptUpdatedFlag").textContent = tradeInformation.updatedFlag;
            console.log("已成功加载交易信息至工具栏\n");
            resolve();
        } else {
            console.log("未查询到已保存的交易信息，执行默认设定...");
            tradeInformationLoadFlag = false;
            document.getElementById("scriptTradeAmount").value = 1;
            updateToolbarPriceInformation().then(() => {
                document.getElementById("scriptUpdatedFlag").textContent = "0";
                console.log("默认设定已加载至工具栏\n");
                resolve();
            });
        }
    })
}

// 更新工具栏出价信息
async function updateToolbarPriceInformation() {
    return new Promise((resolve) => {
        if (!tradeInformationLoadFlag) {
            getCurrentHighestPrice().then((currentHighestPrice) => {
                document.getElementById("scriptPriceUpStep").value = getUpPrice(currentHighestPrice);
                document.getElementById("scriptTradePriceCurrent").value = currentHighestPrice + parseFloat(document.getElementById("scriptPriceUpStep").value);
                document.getElementById("scriptTradePriceMax").value = currentHighestPrice + parseFloat(document.getElementById("scriptPriceUpStep").value) * 2
                resolve();
            });
        } else {
            resolve();
        }
    })
}

// 获取当前URL
async function getCurrentURL() {
    return new Promise((resolve) => {
        resolve(window.location.href);
    });
}

// 切换到当前求购
async function updateTabToBuying() {
    return new Promise((resolve, reject) => {
        window.location.href = "https://buff.163.com/goods/" + getItemId() + "#tab=buying";
        resolve();
    });
}
