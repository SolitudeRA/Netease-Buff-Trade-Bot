/*#######################################################################################

    工具栏注入组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

/*========================================================================================

    修复网页样式

=========================================================================================*/

document.getElementsByClassName("market-header black").item(0).style = "padding-bottom: 20px";

/*========================================================================================

    初始化工具栏对象

=========================================================================================*/

//初始化工具栏容器
const goodsList              = document.getElementsByClassName("market-header black").item(0);
let toolBar_1                = document.createElement("div");
toolBar_1.className          = "container-fluid bg-dark script-toolbar";
let toolBar_2                = document.createElement("div");
toolBar_2.className          = "container-fluid bg-dark script-toolbar";
let toolBar_3                = document.createElement("div");
toolBar_3.className          = "container-fluid bg-dark script-toolbar";
let toolBarContainer_1       = document.createElement("div");
toolBarContainer_1.className = "row d-flex align-items-center justify-content-center";
let toolBarContainer_2       = document.createElement("div");
toolBarContainer_2.className = "row";
let toolBarContainer_3       = document.createElement("div");
toolBarContainer_3.className = "row justify-content-end";
let blank                    = document.createElement("div");
blank.className              = "blank20";
let blank_2                  = document.createElement("div");
blank_2.className            = "blank20";
let blank_3                  = document.createElement("div");
blank_3.className            = "blank20";
let toolbarTitle             = document.createElement("div");
toolbarTitle.textContent     = "自动求购";
toolbarTitle.id              = "scriptItemInformation";
toolbarTitle.className       = "col-1 navbar-brand script-toolbar-title";
mountItemDataToElement(toolbarTitle);

//检测并初始化款式选择栏
let unlockStyleContainer          = document.createElement("div");
unlockStyleContainer.className    = "col-3";
let unlockStyleContainerRow       = document.createElement("div");
unlockStyleContainerRow.className = "row d-flex align-items-center justify-content-center";
let unlockStyleTitle              = document.createElement("div");
unlockStyleTitle.className        = "col-auto script-toolbar-component-title text-center";
unlockStyleTitle.textContent      = "款式筛选";
let unlockStyleSelect             = document.createElement("div");
unlockStyleSelect.className       = "col-auto";
if (document.getElementsByClassName("w-Select-Multi w-Select-scroll black").item(0).getAttribute("data-title") === "款式筛选") {
    unlockStyleSelect.appendChild(document.createElement("select"));
    unlockStyleSelect.firstChild.className = "form-select";
    unlockStyleSelect.firstChild.id        = "scriptUnlockStyle";
    unlockStyleSelectExistNodes            = document.getElementsByClassName("w-Select-Multi w-Select-scroll black").item(0).childNodes.item(4).childNodes;
    unlockStyleSelectExistNodes.forEach(function(currentValue) {
        if (currentValue.nodeName === "LI") {
            let unlockStyleNodeCache         = document.createElement("option");
            unlockStyleNodeCache.textContent = currentValue.childNodes.item(1).textContent;
            unlockStyleNodeCache.value       = currentValue.childNodes.item(1).textContent;
            unlockStyleSelect.firstChild.appendChild(unlockStyleNodeCache);
        }
    });
}
unlockStyleContainerRow.appendChild(unlockStyleTitle);
unlockStyleContainerRow.appendChild(unlockStyleSelect);
unlockStyleContainer.appendChild(unlockStyleContainerRow);

//初始化磨损度输入栏
let wearAmountInputContainer          = document.createElement("div");
wearAmountInputContainer.className    = "col-5";
let wearAmountInputContainerRow       = document.createElement("div");
wearAmountInputContainerRow.className = "row d-flex align-items-center justify-content-center";
let wearAmountInputTitle              = document.createElement("div");
wearAmountInputTitle.className        = "col-2 script-toolbar-component-title text-center";
wearAmountInputTitle.textContent      = "磨损度";
let wearAmountMinInput                = document.createElement("div");
wearAmountMinInput.className          = "col-4";
wearAmountMinInput.appendChild(document.createElement("input"));
wearAmountMinInput.firstChild.className = "form-control";
wearAmountMinInput.firstChild.id        = "scriptWearAmountMin";
let wearAmountSpilt                     = document.createElement("div");
wearAmountSpilt.className               = "col-2 script-toolbar-component-title text-center";
wearAmountSpilt.textContent             = "~";
let wearAmountMaxInput                  = document.createElement("div");
wearAmountMaxInput.className            = "col-4";
wearAmountMaxInput.appendChild(document.createElement("input"));
wearAmountMaxInput.firstChild.className = "form-control";
wearAmountMaxInput.firstChild.id        = "scriptWearAmountMax";
wearAmountInputContainerRow.appendChild(wearAmountInputTitle);
wearAmountInputContainerRow.appendChild(wearAmountMinInput);
wearAmountInputContainerRow.appendChild(wearAmountSpilt);
wearAmountInputContainerRow.appendChild(wearAmountMaxInput);
wearAmountInputContainer.appendChild(wearAmountInputContainerRow);

//初始化求购数量输入栏
let tradeAmountInputContainer          = document.createElement("div");
tradeAmountInputContainer.className    = "col-3";
let tradeAmountInputContainerRow       = document.createElement("div");
tradeAmountInputContainerRow.className = "row d-flex align-items-center justify-content-center";
let tradeAmountTitle                   = document.createElement("div");
tradeAmountTitle.className             = "col-4 script-toolbar-component-title text-center";
tradeAmountTitle.textContent           = "求购数量";
let tradeAmountInput                   = document.createElement("div");
tradeAmountInput.className             = "col-8";
tradeAmountInput.appendChild(document.createElement("input"));
tradeAmountInput.firstChild.className = "form-control";
tradeAmountInput.firstChild.id        = "scriptTradeAmount";
tradeAmountInputContainerRow.appendChild(tradeAmountTitle);
tradeAmountInputContainerRow.appendChild(tradeAmountInput);
tradeAmountInputContainer.appendChild(tradeAmountInputContainerRow);

//初始化本次出价输入栏
let priceCurrentInputContainer          = document.createElement("div");
priceCurrentInputContainer.className    = "col";
let priceCurrentInputContainerRow       = document.createElement("div");
priceCurrentInputContainerRow.className = "row d-flex align-items-center justify-content-center";
let priceCurrentInputTitle              = document.createElement("div");
priceCurrentInputTitle.className        = "col-4 script-toolbar-component-title text-center";
priceCurrentInputTitle.textContent      = "本次出价";
let priceCurrentInput                   = document.createElement("div");
priceCurrentInput.className             = "col-8";
priceCurrentInput.appendChild(document.createElement("input"));
priceCurrentInput.firstChild.placeholder = 0;
priceCurrentInput.firstChild.className   = "form-control";
priceCurrentInput.firstChild.id          = "scriptTradePriceCurrent";
priceCurrentInputContainerRow.appendChild(priceCurrentInputTitle);
priceCurrentInputContainerRow.appendChild(priceCurrentInput);
priceCurrentInputContainer.appendChild(priceCurrentInputContainerRow);

//初始化加价幅度输入栏
let priceUpStepInputContainer          = document.createElement("div");
priceUpStepInputContainer.className    = "col";
let priceUpStepInputContainerRow       = document.createElement("div");
priceUpStepInputContainerRow.className = "row d-flex align-items-center justify-content-center";
let priceUpStepInputTitle              = document.createElement("div");
priceUpStepInputTitle.className        = "col-4 script-toolbar-component-title text-center";
priceUpStepInputTitle.textContent      = "加价幅度";
let priceUpStepInput                   = document.createElement("div");
priceUpStepInput.className             = "col-8";
priceUpStepInput.appendChild(document.createElement("input"));
priceUpStepInput.firstChild.placeholder = 0;
priceUpStepInput.firstChild.className   = "form-control";
priceUpStepInput.firstChild.id          = "scriptPriceUpStep";
priceUpStepInputContainerRow.appendChild(priceUpStepInputTitle);
priceUpStepInputContainerRow.appendChild(priceUpStepInput);
priceUpStepInputContainer.appendChild(priceUpStepInputContainerRow);

//初始化预期最高价输入栏
let priceMaxInputContainer          = document.createElement("div");
priceMaxInputContainer.className    = "col";
let priceMaxInputContainerRow       = document.createElement("div");
priceMaxInputContainerRow.className = "row d-flex align-items-center justify-content-center";
let priceMaxInputTitle              = document.createElement("div");
priceMaxInputTitle.className        = "col-4 script-toolbar-component-title text-center";
priceMaxInputTitle.textContent      = "最高价";
let priceMaxInput                   = document.createElement("div");
priceMaxInput.className             = "col-8";
priceMaxInput.appendChild(document.createElement("input"));
priceMaxInput.firstChild.placeholder = 0;
priceMaxInput.firstChild.className   = "form-control";
priceMaxInput.firstChild.id          = "scriptTradePriceMax";
priceMaxInputContainerRow.appendChild(priceMaxInputTitle);
priceMaxInputContainerRow.appendChild(priceMaxInput);
priceMaxInputContainer.appendChild(priceMaxInputContainerRow);

//初始化支付方式选择栏
let payMethodSelectContainer          = document.createElement("div");
payMethodSelectContainer.className    = "col-4";
let payMethodSelectContainerRow       = document.createElement("div");
payMethodSelectContainerRow.className = "row d-flex align-items-center justify-content-center";
const payMethodSelectTitle            = document.createElement("div");
payMethodSelectTitle.className        = "col-4 script-toolbar-component-title text-center";
payMethodSelectTitle.textContent      = "支付方式";
let paymentMethodSelect               = document.createElement("div");
paymentMethodSelect.className         = "col-8";
paymentMethodSelect.appendChild(document.createElement("select"));
paymentMethodSelect.firstChild.className = "form-select";
paymentMethodSelect.firstChild.id        = "scriptPaymentMethod";
let paymentMethodOption_1                = document.createElement("option");
let paymentMethodOption_2                = document.createElement("option");
let paymentMethodOption_3                = document.createElement("option");
let paymentMethodOption_4                = document.createElement("option");
paymentMethodOption_1.value              = "0";
paymentMethodOption_1.textContent        = "BUFF余额-支付宝";
paymentMethodOption_2.value              = "1";
paymentMethodOption_2.textContent        = "BUFF余额-银行卡";
paymentMethodOption_3.value              = "2";
paymentMethodOption_3.textContent        = "BUFF余额-先求后付";
paymentMethodOption_4.value              = "3";
paymentMethodOption_4.textContent        = "微信支付";
paymentMethodSelect.firstChild.appendChild(paymentMethodOption_1);
paymentMethodSelect.firstChild.appendChild(paymentMethodOption_2);
paymentMethodSelect.firstChild.appendChild(paymentMethodOption_3);
paymentMethodSelect.firstChild.appendChild(paymentMethodOption_4);
payMethodSelectContainerRow.appendChild(payMethodSelectTitle);
payMethodSelectContainerRow.appendChild(paymentMethodSelect);
payMethodSelectContainer.appendChild(payMethodSelectContainerRow);

//初始化开始监听按钮
let startMonitorButtonContainer          = document.createElement("div");
startMonitorButtonContainer.className    = "col-2";
let startMonitorButtonContainerRow       = document.createElement("div");
startMonitorButtonContainerRow.className = "row";
let startMonitorButton                   = document.createElement("div");
startMonitorButton.className             = "col-12 text-center";
startMonitorButton.appendChild(document.createElement("button"));
startMonitorButton.firstChild.className   = "btn btn-primary script-toolbar-button align-middle";
startMonitorButton.firstChild.textContent = "开始监听";
startMonitorButton.firstChild.onclick     = async function() {await doPostWanted();};
startMonitorButtonContainerRow.appendChild(startMonitorButton);
startMonitorButtonContainer.appendChild(startMonitorButtonContainerRow);

//初始化更新监听按钮
let updateMonitorButtonContainer          = document.createElement("div");
updateMonitorButtonContainer.className    = "col-2";
let updateMonitorButtonContainerRow       = document.createElement("div");
updateMonitorButtonContainerRow.className = "row";
let updateMonitorButton                   = document.createElement("div");
updateMonitorButton.className             = "col-12 text-center";
updateMonitorButton.appendChild(document.createElement("button"));
updateMonitorButton.firstChild.className   = "btn btn-info script-toolbar-button align-middle";
updateMonitorButton.firstChild.type        = "button";
updateMonitorButton.firstChild.textContent = "更新监听";
updateMonitorButton.firstChild.onclick     = async function() {await doPostWanted();};
updateMonitorButtonContainerRow.appendChild(updateMonitorButton);
updateMonitorButtonContainer.appendChild(updateMonitorButtonContainerRow);

//初始化停止监听按钮
let stopMonitorButtonContainer          = document.createElement("div");
stopMonitorButtonContainer.className    = "col-2";
let stopMonitorButtonContainerRow       = document.createElement("div");
stopMonitorButtonContainerRow.className = "row";
let stopMonitorButton                   = document.createElement("div");
stopMonitorButton.className             = "col-12 text-center";
stopMonitorButton.appendChild(document.createElement("button"));
stopMonitorButton.firstChild.className   = "btn btn-danger script-toolbar-button align-middle";
stopMonitorButton.firstChild.textContent = "停止监听";
stopMonitorButton.firstChild.onclick     = async function() {await doPostWanted();};
stopMonitorButtonContainerRow.appendChild(stopMonitorButton);
stopMonitorButtonContainer.appendChild(stopMonitorButtonContainerRow);

//构造工具栏容器
toolBarContainer_1.appendChild(toolbarTitle);
if (document.getElementsByClassName("w-Select-Multi w-Select-scroll black").item(0).getAttribute("data-title") === "款式筛选") {
    toolBarContainer_1.appendChild(unlockStyleContainer);
}
toolBarContainer_1.appendChild(wearAmountInputContainer);
toolBarContainer_1.appendChild(tradeAmountInputContainer);
toolBarContainer_2.appendChild(priceCurrentInputContainer);
toolBarContainer_2.appendChild(priceUpStepInputContainer);
toolBarContainer_2.appendChild(priceMaxInputContainer);
toolBarContainer_2.appendChild(payMethodSelectContainer);
toolBar_1.appendChild(toolBarContainer_1);
toolBar_2.appendChild(toolBarContainer_2);
injectButtonToElement(toolBarContainer_3);
toolBar_3.appendChild(toolBarContainer_3);

/*========================================================================================

    初始化监听器

=========================================================================================*/

//物品列表渲染监听器（加载交易信息）
const bodyNode         = document.getElementsByTagName("body").item(0);
const observerConfig   = {
    childList: true, subtree: true, attributes: true, attributeOldValue: true
};
const itemListObserver = new MutationObserver((mutationList, observer) => {
    for (let mutation of mutationList) {
        if (mutation.type === "childList") {
            for (let node of mutation.addedNodes) {
                if (node.className === "pager list-pager light-theme simple-pagination") {
                    observer.disconnect();
                    //加载交易信息
                    existPersistedTradeInformation();
                }
            }
        }
    }
});

/*========================================================================================

    注入工具栏

=========================================================================================*/

goodsList.parentNode.insertBefore(toolBar_1, goodsList);
goodsList.parentNode.insertBefore(blank, goodsList);
goodsList.parentNode.insertBefore(toolBar_2, goodsList);
goodsList.parentNode.insertBefore(blank_2, goodsList);
goodsList.parentNode.insertBefore(toolBar_3, goodsList);
goodsList.parentNode.insertBefore(blank_3, goodsList);

//激活渲染监听器
itemListObserver.observe(bodyNode, observerConfig);

/*========================================================================================

    调用发布求购工具函数

=========================================================================================*/

async function doPostWanted() {

}

/*========================================================================================

    专用工具函数

=========================================================================================*/

//搜集并挂载物品数据到工具栏
function mountItemDataToElement(element) {
    const itemId   = getItemId();
    const itemName = getItemName();
    element.setAttribute("data-itemId", itemId);
    element.setAttribute("data-itemName", itemName);
}

//注入按钮到工具栏
function injectButtonToElement(element) {
    chrome.runtime.sendMessage({action: "queryMonitorStatus", itemId: getItemId()}, function(response) {
        if (response.monitorStatus === false) {
            element.appendChild(startMonitorButtonContainer);
        } else {
            element.appendChild(updateMonitorButtonContainer);
            element.appendChild(stopMonitorButtonContainer);
        }
    });
}

//加载交易信息
function existPersistedTradeInformation() {
    chrome.runtime.sendMessage({action: "getTradeInformation", itemId: getItemId()}, function(response) {
        if (response.status === true) {
            const tradeInformation = JSON.parse(response.tradeInformation);
            if (tradeInformation.unlockStyle !== "") {
                for (let childNode of unlockStyleSelect.firstChild.childNodes) {
                    if (childNode.value === tradeInformation.unlockStyle) {
                        childNode.selected = true;
                    }
                }
            }
            wearAmountMinInput.firstChild.placeholder = tradeInformation.customWearAmountMin;
            wearAmountMaxInput.firstChild.placeholder = tradeInformation.customWearAmountMax;
            tradeAmountInput.firstChild.placeholder   = tradeInformation.tradeAmount;
            priceCurrentInput.firstChild.placeholder  = tradeInformation.tradePriceCurrent + tradeInformation.priceUpStep;
            priceUpStepInput.firstChild.placeholder   = tradeInformation.priceUpStep;
            priceMaxInput.firstChild.placeholder      = tradeInformation.tradePriceMax;
            for (let childNode of paymentMethodSelect.firstChild.childNodes) {
                if (childNode.value === tradeInformation.paymentMethod) {
                    childNode.selected = true;
                }
            }
        } else if (response.status === false) {
            const wearAmountList         = document.getElementById("paintwear_list").childNodes;
            let wearAmountMin            = parseFloat(wearAmountList.item(3).childNodes.item(1).textContent.split("-")[0]);
            let wearAmountMax            = parseFloat(wearAmountList.item(wearAmountList.length - 4).childNodes.item(1).textContent.split("-")[1]);
            let unlockStyle              = "";
            let unlockStyleSelectElement = unlockStyleSelect.firstChild;
            if (document.getElementsByClassName("w-Select-Multi w-Select-scroll black").item(0).getAttribute("data-title") === "款式筛选") {
                unlockStyle = unlockStyleSelectElement.value;
            }
            wearAmountMinInput.firstChild.placeholder = wearAmountMin;
            wearAmountMaxInput.firstChild.placeholder = wearAmountMax;
            tradeAmountInput.firstChild.placeholder   = 1;
            getCurrentHighestPrice(unlockStyle, wearAmountMin, wearAmountMax).then((highestPrice) => {
                priceCurrentInput.firstChild.placeholder = highestPrice + getUpPrice(highestPrice);
                priceUpStepInput.firstChild.placeholder  = getUpPrice(highestPrice);
                priceMaxInput.firstChild.placeholder     = highestPrice + getUpPrice(highestPrice) * 2;
            });
        } else {
            throwError("existPersistedTradeInformation error");
        }
    });
}
