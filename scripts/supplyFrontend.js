/*#######################################################################################

    当前求购前端相关组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

/*========================================================================================

        当前求购后台Chrome Message API调用监听器

=========================================================================================*/

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "cancelWanted") {
        cancelWantedFrontend(request.itemId).then(() => {
            sendResponse({status: true});
        });
    }

    if (request.action === "retrievePostingWantedStatus") {
        retrievePostingWantedStatusFrontend(request.itemId).then((result) => {
            if (result === true) {
                sendResponse({status: true});
            } else {
                sendResponse({status: false});
            }
        })
    }

    return true;
});

/*========================================================================================

        工具函数

=========================================================================================*/

async function cancelWantedFrontend(itemID) {
    return new Promise((resolve) => {
        // MutationObserver设置
        const observerConfig = {
            subtree: true, childList: true, characterData: true, attributes: true, attributeOldValue: true
        };
        // 终止求购成功监听器
        const cancelWantedSucceededObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.type === "attributes" && mutation.target.className === "w-Toast_success") {
                    cancelWantedSecondConfirmObserver.disconnect();
                    observer.disconnect();
                    resolve();
                    break;
                }
            }
        });
        // 终止求购速率提醒监听器
        const cancelWantedSecondConfirmObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.target.className === "popup popup_common " && mutation.target.style.display === "block") {
                    observer.disconnect();
                    mutation.target.getElementsByClassName("i_Btn i_Btn_main").item(0).click();
                    break;
                }
            }
        });
        // 终止求购确认弹出监听器
        const cancelWantedConfirmPopupObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation of mutationList) {
                if (mutation.target.className === "popup popup_common " && mutation.target.style.display === "block") {
                    observer.disconnect();
                    cancelWantedSecondConfirmObserver.observe(document.getElementsByTagName("body").item(0), observerConfig);
                    cancelWantedSucceededObserver.observe(document.getElementsByTagName("body").item(0), observerConfig);
                    mutation.target.getElementsByClassName("i_Btn i_Btn_main").item(0).click();
                    break;
                }
            }
        });

        // 获取终止求购按钮
        let itemList = document.getElementsByClassName("list_tb_csgo").item(0).getElementsByTagName("tr");
        for (let itemRow of itemList) {
            if (itemRow.getElementsByTagName("td").item(2).getElementsByTagName("a").item(0).href.slice(27) === itemID) {
                let elementList = itemRow.getElementsByTagName("td").item(7).getElementsByTagName("a");
                for (let element of elementList) {
                    if (element.innerText === "终止求购") {
                        cancelWantedConfirmPopupObserver.observe(document.getElementsByTagName("body").item(0), observerConfig);
                        element.click();
                    }
                }
                break;
            }
        }
    });
}

// 查询求购状态
async function retrievePostingWantedStatusFrontend(itemID) {
    let itemList = document.getElementsByClassName("list_tb_csgo").item(0).getElementsByTagName("tr");

    return new Promise((resolve) => {
        for (let itemRow of itemList) {
            if (itemRow.getElementsByTagName("td").item(2) !== null) {
                if (itemRow.getElementsByTagName("td").item(2).getElementsByTagName("a").item(0).href.slice(27) === itemID) {
                    resolve(true);
                    break;
                }
            }
        }
        resolve(false);
    });
}