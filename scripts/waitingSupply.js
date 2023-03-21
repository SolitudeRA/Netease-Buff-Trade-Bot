/*#######################################################################################

    求购列表组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

//取消求购订单
async function cancelOrder(itemId) {
    const observerConfig    = {
        childList: true, subtree: true, attributes: true, attributeOldValue: true
    };
    const bodyNode          = document.getElementsByTagName("body").item(0);
    const waitingSupplyList = document.getElementsByClassName("list_tb_csgo").item(0).childNodes;
    //取消求购确认监听器
    const confirmObserver   = new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
            if (mutation.target.className === "popup popup_common " && mutation.target.getElementsByClassName("popup-cont").item(0).getElementsByTagName("h2").item(0).textContent === "终止求购") {
                observer.disconnect();
                let cancelButton = mutation.target.getElementsByClassName("popup-btns").item(0).childNodes.item(3);
                cancelButton.click();
                return Promise.resolve();//Promise
            }
        }
    });

    const completeObserver = new MutationObserver((mutationList, observer) => {
        //TODO: 取消成功监听器
    });

    waitingSupplyList.forEach(function(currentValue) {
        if (currentValue.nodeName === "TR") {
            let name      = currentValue.childNodes.item(5).childNodes.item(1).childNodes.item(1);
            let currentId = name.href.slice(27);
            if (currentId === itemId.toString()) {
                confirmObserver.observe(bodyNode, observerConfig);
                currentValue.firstChild.parentElement.getElementsByClassName("cancel-buy-order f_14px").item(0).click();
            }
        }
    });
}