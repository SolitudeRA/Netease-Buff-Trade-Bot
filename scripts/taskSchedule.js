/*#######################################################################################

    计划任务Web worker

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: solitudera@outlook.com

#########################################################################################*/

async function taskScheduleActivate(itemID) {
    // 注册时间戳
    let timeStampCache = Date.now();
    let reloadTimeStampCache = Date.now();

    // 1200000 300000
    const taskScheduleID = setInterval(async () => {
        if ((Date.now() - timeStampCache) >= 1500000) {
            await monitorTask(itemID, taskScheduleID);
            timeStampCache = Date.now();
            reloadTimeStampCache = Date.now();
        }
        if ((Date.now() - reloadTimeStampCache) >= 1200000) {
            // 获取窗口&标签页信息
            let windowID = await retrieveWindowIDDatabase();
            let wantedTabID = await retrieveWantedTabIDDatabase();
            let tabID = await retrieveTabIDDatabase(itemID);

            // 检测窗口&标签页是否打开
            if (!(await existWindowID(windowID))) {
                await destroyWindowIDDatabase();
                await destroyWantedTabIDDatabase();
                windowID = await initializeWindow();
            }
            if (!(await existTabInWindow(wantedTabID, windowID))) {
                await createWantedTabInWindow();
            }
            if (!(await existTabInWindow(tabID, windowID))) {
                tabID = await initializeTab(windowID, {itemId: itemID})
            }

            await reloadTabBackend(tabID);
            reloadTimeStampCache = Date.now();
        }
    }, 30000);

    await saveTaskScheduleID(itemID, taskScheduleID);

    return taskScheduleID;
}

function taskScheduleDeactivate(taskScheduleId) {
    clearInterval(taskScheduleId);
}

// 价格监听计划任务
async function monitorTask(itemID, taskScheduleID) {
    const tradeInformation = await retrieveTradeInformationDatabase(itemID);

    // 获取窗口&标签页信息
    let windowID = await retrieveWindowIDDatabase();
    let wantedTabID = await retrieveWantedTabIDDatabase();
    let tabID = await retrieveTabIDDatabase(itemID);

    // 检测窗口&标签页是否打开
    if (!(await existWindowID(windowID))) {
        await destroyWindowIDDatabase();
        await destroyWantedTabIDDatabase();
        windowID = await initializeWindow();
    }
    if (!(await existTabInWindow(wantedTabID, windowID))) {
        wantedTabID = await createWantedTabInWindow();
    }
    if (!(await existTabInWindow(tabID, windowID))) {
        tabID = await initializeTab(windowID, tradeInformation)
    }

    // 获取当前最高价与出价者ID
    const currentHighestPriceResponse = await getCurrentHighestPriceBackend(tabID);
    const currentHighestPriceUserID = currentHighestPriceResponse.userID;
    const currentHighestPrice = currentHighestPriceResponse.currentHighestPrice;

    console.log("\n");
    console.log("已查询当前最高价，物品ID：" + itemID + "，价格: " + currentHighestPrice + "，出价者ID：" + currentHighestPriceUserID);
    console.log("你的当前出价是：" + tradeInformation.tradePriceCurrent + "，你的ID：" + tradeInformation.userId + "\n");

    // 检测是否为当前出价最高用户
    if (tradeInformation.userId === currentHighestPriceUserID) {
        console.log("你是当前最高出价者\n")
    } else {
        if ((currentHighestPrice + tradeInformation.priceUpStep) <= tradeInformation.tradePriceMax) {
            await cancelWantedBackend(wantedTabID, tradeInformation.itemId);
            tradeInformation.tradePriceCurrent = (currentHighestPrice + tradeInformation.priceUpStep);
            await postWantedBackend(tabID, tradeInformation);
            tradeInformation.updatedFlag = tradeInformation.updatedFlag + 1;
            console.log("\n已重新出价,当前出价：" + tradeInformation.tradePriceCurrent + "，当前竞价幅度：" + tradeInformation.priceUpStep + "，已出价次数：" + tradeInformation.updatedFlag + "\n")
            await updateTradeInformationDatabase(tradeInformation);
            await reloadTabBackend(wantedTabID);
        } else {
            clearInterval(taskScheduleID);
            window.alert(tradeInformation.itemName + "，下次竞价价格超出最高预期价格")
        }
    }
}