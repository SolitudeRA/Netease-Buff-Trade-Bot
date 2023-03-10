//修复样式
document.getElementsByClassName("market-header black").item(0).style = "padding-bottom: 20px";

//初始化工具栏
const goodsList            = document.getElementsByClassName("market-header black").item(0);
let toolBar                = document.createElement("div");
toolBar.className          = "navbar navbar-expand-lg bg-body-tertiary bg-dark";
let toolBarContainer       = document.createElement("div");
toolBarContainer.className = "container-fluid";
let blank                  = document.createElement("div");
blank.className            = "blank20";
let toolbarTitle           = document.createElement("span");
toolbarTitle.textContent   = "自动求购";
toolbarTitle.className     = "navbar-brand bot-toolbar-components bot-toolbar-title";

//初始化工具栏容器
const navbarContainer     = document.createElement("div");
navbarContainer.className = "collapse navbar-collapse";

//初始化磨损度输入栏
const wearAmountInputTitle       = document.createElement("span");
wearAmountInputTitle.textContent = "磨损度";
wearAmountInputTitle.className   = "bot-toolbar-components";
let wearAmountMinInput           = document.createElement("span");
wearAmountMinInput.appendChild(document.createElement("input"));
wearAmountMinInput.className            = "bot-toolbar-components";
wearAmountMinInput.firstChild.className = "bot-toolbar-input";
wearAmountMinInput.firstChild.id        = "botWearAmountMin";
let wearAmountSpilt                     = document.createElement("span");
wearAmountSpilt.className               = "bot-toolbar-components";
wearAmountSpilt.textContent             = "~";
let wearAmountMaxInput                  = document.createElement("span");
wearAmountMaxInput.appendChild(document.createElement("input"));
wearAmountMaxInput.className            = "bot-toolbar-input bot-toolbar-components";
wearAmountMaxInput.firstChild.className = "bot-toolbar-input";
wearAmountMaxInput.firstChild.id        = "botWearAmountMax";

//初始化求购数量输入栏
const wantedAmountTitle       = document.createElement("span");
wantedAmountTitle.textContent = "求购数量";
wantedAmountTitle.className   = "bot-toolbar-components";
let wantedAmountInput         = document.createElement("span");
wantedAmountInput.appendChild(document.createElement("input"));
wantedAmountInput.className              = "bot-toolbar-components";
wantedAmountInput.firstChild.placeholder = 1;
wantedAmountInput.firstChild.className   = "bot-toolbar-input";
wantedAmountInput.firstChild.id          = "botWantedAmount";

//初始化预期最高价格输入栏
const priceMaxTitle       = document.createElement("span");
priceMaxTitle.textContent = "预期最高价";
priceMaxTitle.className   = "bot-toolbar-components";
let priceMaxInput         = document.createElement("span");
priceMaxInput.appendChild(document.createElement("input"));
priceMaxInput.className              = "bot-toolbar-components";
priceMaxInput.firstChild.placeholder = 0;
priceMaxInput.firstChild.className   = "bot-toolbar-input";
priceMaxInput.firstChild.id          = "botPriceMax";

//初始化支付方式选择栏
const payMethodTitle       = document.createElement("span");
payMethodTitle.textContent = "支付方式";
payMethodTitle.className   = "bot-toolbar-components";
let paymentMethodSelect    = document.createElement("span");
paymentMethodSelect.appendChild(document.createElement("select"));
paymentMethodSelect.className            = "bot-toolbar-components";
paymentMethodSelect.firstChild.className = "form-select";
paymentMethodSelect.firstChild.id        = "botPaymentMethod";
//读取历史设置
if (callGetDataFromChromeLocalStorage(getGoodsID())) {
    let paymentMethodOption   = document.createElement("option");
    paymentMethodOption.value = JSON.parse(callGetDataFromChromeLocalStorage(getGoodsID())).paymentMethod;
    switch (JSON.parse(callGetDataFromChromeLocalStorage(getGoodsID())).paymentMethod) {
        case 0:
            paymentMethodOption.textContent = "BUFF余额-支付宝";
            break;
        case 1:
            paymentMethodOption.textContent = "BUFF余额-银行卡";
            break;
        case 2:
            paymentMethodOption.textContent = "BUFF余额-先求后付";
            break;
        case 3:
            paymentMethodOption.textContent = "微信支付";
            break;
    }
    paymentMethodSelect.firstChild.appendChild(paymentMethodOption);
}
let paymentMethodOption_1         = document.createElement("option");
let paymentMethodOption_2         = document.createElement("option");
let paymentMethodOption_3         = document.createElement("option");
let paymentMethodOption_4         = document.createElement("option");
paymentMethodOption_1.value       = "0";
paymentMethodOption_1.textContent = "BUFF余额-支付宝";
paymentMethodOption_2.value       = "1";
paymentMethodOption_2.textContent = "BUFF余额-银行卡";
paymentMethodOption_3.value       = "2";
paymentMethodOption_3.textContent = "BUFF余额-先求后付";
paymentMethodOption_4.value       = "3";
paymentMethodOption_4.textContent = "微信支付";
paymentMethodSelect.firstChild.appendChild(paymentMethodOption_1);
paymentMethodSelect.firstChild.appendChild(paymentMethodOption_2);
paymentMethodSelect.firstChild.appendChild(paymentMethodOption_3);
paymentMethodSelect.firstChild.appendChild(paymentMethodOption_4);

//初始化发布求购按钮
let postButton         = document.createElement("button");
postButton.className   = "i_Btn i_Btn_trans_bule";
postButton.textContent = "开始监听";
postButton.onclick     = function() {doPostWanted();};

//检测并初始化款式选择栏
let unlockStyleTitle         = document.createElement("span");
unlockStyleTitle.textContent = "款式筛选";
unlockStyleTitle.className   = "bot-toolbar-components";
let unlockStyleSelect        = document.createElement("span");
if (document.getElementsByClassName("w-Select-Multi w-Select-scroll black").item(0).getAttribute("data-title") === "款式筛选") {
    unlockStyleSelect.appendChild(document.createElement("select"));
    unlockStyleSelect.className            = "bot-toolbar-components";
    unlockStyleSelect.firstChild.className = "form-select";
    unlockStyleSelect.firstChild.id        = "botUnlockStyle";
    //读取历史设置
    if (callGetDataFromChromeLocalStorage(getGoodsID())) {
        let unlockStyleOption         = document.createElement("option");
        unlockStyleOption.value       = JSON.parse(callGetDataFromChromeLocalStorage(getGoodsID())).unlockStyle;
        unlockStyleOption.textContent = JSON.parse(callGetDataFromChromeLocalStorage(getGoodsID())).unlockStyle;
        unlockStyleSelect.firstChild.appendChild(unlockStyleOption);
    }
    unlockStyleSelectExistNodes = document.getElementsByClassName("w-Select-Multi w-Select-scroll black").item(0).childNodes.item(4).childNodes;
    unlockStyleSelectExistNodes.forEach(function(currentValue, currentIndex, listObj) {
        if (currentValue.nodeName === "LI") {
            let unlockStyleNodeCache         = document.createElement("option");
            let unlockStyleNodeContent       = currentValue.childNodes.item(1).textContent;
            unlockStyleNodeCache.textContent = unlockStyleNodeContent;
            unlockStyleNodeCache.value       = unlockStyleNodeContent;
            unlockStyleSelect.firstChild.appendChild(unlockStyleNodeCache);
        }
    });
}

const goodsID = getGoodsID();
//构造工具栏
toolBarContainer.appendChild(toolbarTitle);
if (document.getElementsByClassName("w-Select-Multi w-Select-scroll black").item(0).getAttribute("data-title") === "款式筛选") {
    toolBarContainer.appendChild(unlockStyleTitle);
    toolBarContainer.appendChild(unlockStyleSelect);
}
toolBarContainer.appendChild(wearAmountInputTitle);
toolBarContainer.appendChild(wearAmountMinInput);
toolBarContainer.appendChild(wearAmountSpilt);
toolBarContainer.appendChild(wearAmountMaxInput);
toolBarContainer.appendChild(wantedAmountTitle);
toolBarContainer.appendChild(wantedAmountInput);
toolBarContainer.appendChild(priceMaxTitle);
toolBarContainer.appendChild(priceMaxInput);
toolBarContainer.appendChild(payMethodTitle);
toolBarContainer.appendChild(paymentMethodSelect);
toolBarContainer.appendChild(postButton);
toolBar.appendChild(toolBarContainer);

//注入工具栏
goodsList.parentNode.insertBefore(toolBar, goodsList);
goodsList.parentNode.insertBefore(blank, goodsList);
setDefaultWearAmount();
setDefaultPrice();

function doPostWanted() {
    let botWearAmountMin, botWearAmountMax, botPriceMax, botWantedAmount, botPaymentMethod = 0;
    let botUnlockStyle                                                                     = "";
    if (document.getElementById("botUnlockStyle")) {
        botUnlockStyle = document.getElementById("botUnlockStyle").value;
    }
    if (document.getElementById("botWearAmountMin").value !== "") {
        botWearAmountMin = document.getElementById("botWearAmountMin").value;
    } else {
        botWearAmountMin = document.getElementById("botWearAmountMin").placeholder;
    }
    if (document.getElementById("botWearAmountMax").value !== "") {
        botWearAmountMax = document.getElementById("botWearAmountMax").value;
    } else {
        botWearAmountMax = document.getElementById("botWearAmountMax").placeholder;
    }
    if (document.getElementById("botPriceMax").value !== "") {
        botPriceMax = document.getElementById("botPriceMax").value;
    } else {
        botPriceMax = document.getElementById("botPriceMax").placeholder;
    }
    if (document.getElementById("botWantedAmount").value !== "") {
        botWantedAmount = document.getElementById("botWantedAmount").value;
    } else {
        botWantedAmount = document.getElementById("botWantedAmount").placeholder;
    }
    botPaymentMethod = parseInt(document.getElementById("botPaymentMethod").value);

    postWanted(goodsID, botWearAmountMin, botWearAmountMax, botPriceMax, botWantedAmount, botPaymentMethod, botUnlockStyle);
}

//设置默认磨损度
function setDefaultWearAmount() {
    const wearAmountList = document.getElementById("paintwear_list").childNodes;
    if (callGetDataFromChromeLocalStorage(getGoodsID())) {
        document.getElementById("botWearAmountMin").placeholder = JSON.parse(callGetDataFromChromeLocalStorage(getGoodsID())).customWearAmountMin;
        document.getElementById("botWearAmountMax").placeholder = JSON.parse(callGetDataFromChromeLocalStorage(getGoodsID())).customWearAmountMax;
    } else {
        document.getElementById("botWearAmountMin").placeholder = parseFloat(wearAmountList.item(3).childNodes.item(1).textContent.split("-")[0]);
        document.getElementById("botWearAmountMax").placeholder = parseFloat(wearAmountList.item(wearAmountList.length - 4).childNodes.item(1).textContent.split("-")[1]);
    }
}

//设置默认价格
function setDefaultPrice() {
    const observerConfig           = {
        childList : true,
        subtree   : true,
        attributes: true
    };
    const buyingTab                = document.getElementsByClassName("buying").item(0).firstChild;
    const buyingTabContent         = document.getElementsByClassName("detail-tab-cont").item(0);
    const buyingTabContentObserver = new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
            if (mutation.type === "childList" && document.getElementsByClassName("list_tb_csgo").item(0).hasChildNodes()) {
                let priceList   = document.getElementsByClassName("list_tb_csgo").item(0);
                let priceString = priceList.getElementsByTagName("tr").item(1).getElementsByClassName("t_Left").item(3);
                priceString     = priceString.getElementsByClassName("f_Strong").item(0).textContent;
                priceString     = priceString.substring(2);
                observer.disconnect();

                document.getElementById("botPriceMax").value = parseFloat(priceString) + getUpPrice(parseFloat(priceString));
            }
        }
    });
    buyingTabContentObserver.observe(buyingTabContent, observerConfig);
    buyingTab.click();
}