/*#######################################################################################

    计划任务相关组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

// 获取计划任务ID
async function getTaskScheduleID(itemID) {
    let taskScheduleID = await retrieveTaskScheduleID(itemID);
    if (!taskScheduleID) {
        console.warn(LOG_STORAGE_NOT_RETRIEVED + LOG_INFO_SEPARATOR + COMPONENT_NAME_TASK_SCHEDULE_MAIN);
        console.warn(LOG_WARN_REEXECUTE + COMPONENT_NAME_TASK_SCHEDULE_MAIN + LOG_INFO_INITIALIZING);
        taskScheduleID = await taskScheduleInitialize(itemID);
    }

    return taskScheduleID;
}

// 初始化主计划任务
async function taskScheduleInitialize(itemID) {

    console.group(LOG_INFO_INITIALIZING + LOG_INFO_SEPARATOR + COMPONENT_NAME_TASK_SCHEDULE_MAIN);

    // 初始化出价时间戳
    await savePostWantedTimeStamp(itemID);
    // 初始化计划任务执行时间戳
    await saveTaskScheduleExecutedTimeStamp(itemID);

    // 初始化计划任务主体
    const taskScheduleID = setInterval(async () => {
        let wantedTabPage = await activeMonitorGetPage(itemID);

        // 物品详情页刷新 5min ~ 13min
        if (Date.now() - await retrieveItemTabReloadTimeStamp(itemID) >= await retrieveItemTabReloadInterval(itemID)) {
            console.groupCollapsed("执行物品详情页刷新，物品ID：" + itemID);
            // 获取窗口&标签页信息
            let windowID = await retrieveWindowIDDatabase();
            let tabID = await retrieveTabIDDatabase(itemID);

            // 检测窗口是否打开
            if (!await existWindow(windowID)) {
                windowID = await createWindow();
            }

            // 检测物品详情标签页是否打开
            if (!await existTab(tabID, windowID)) {
                tabID = await createTab(itemID)
            }

            await reloadTabBackend(tabID);
            await saveItemTabReloadTimeStamp(itemID);
            console.info("已自动刷新物品详情页面，物品ID：" + itemID + "\n");
            await saveItemTabReloadInterval(itemID);
            console.info("已更新物品详情页面自动刷新间隔，物品ID：" + itemID + "\n");

            console.groupEnd();
        }

        // 请求刷新我的求购页面计划任务
        await requestReloadWantedTabTask(wantedTabPage);

        // 执行计划任务
        if ((Date.now() - await retrieveTaskScheduleExecutedTimeStamp(itemID)) >= RATE_TASK_SCHEDULE_EXECUTE && !await retrieveTaskScheduleExecuteStatus(itemID)) {
            await updateTaskScheduleExecuteStatus(itemID);
            await monitorTask(itemID, wantedTabPage);
            await saveTaskScheduleExecutedTimeStamp(itemID);
            await deleteTaskScheduleExecuteStatus(itemID);
        }
    }, RATE_TASK_SCHEDULE_CLOCK);

    console.groupEnd();

    return taskScheduleID;
}

// 计划任务函数
async function monitorTask(itemID, wantedTabPage) {
    console.group(`${LOG_INFO_EXECUTE}${COMPONENT_NAME_TASK_SCHEDULE_MAIN} ${LOG_INFO_SEPARATOR} ${LOG_KEYWORD_ID}： ${itemID}`);
    const tradeInformation = await retrieveTradeInformationDatabase(itemID);
    const taskScheduleID = await retrieveTaskScheduleID(itemID);

    console.groupCollapsed("执行窗口&标签页检查流程...")
    // 获取 窗口 & 物品详情标签页 & 我的求购标签页 信息
    let windowID = await retrieveWindowIDDatabase();
    let detailsTabID = await retrieveTabIDDatabase(itemID);
    let wantedTabID = await retrieveWantedTabIDDatabase(wantedTabPage);

    // 检测窗口是否打开
    if (!await existWindow(windowID)) {
        windowID = await createWindow();
    }
    // 检测物品详情标签页是否打开
    if (!await existTab(detailsTabID, windowID)) {
        detailsTabID = await createTab(itemID)
    }
    // 检测我的求购标签页是否打开
    if (wantedTabID === -1 || !await existTab(wantedTabID, windowID)) {
        wantedTabID = await createWantedTab(wantedTabPage);
    }
    console.groupEnd();

    // 查询求购状态
    let postingWantedStatus = await retrievePostingWantedStatusBackend(wantedTabID, itemID);

    console.info("test" + postingWantedStatus);

    if (postingWantedStatus.status === true) {
        console.info("求购信息在我的求购列表中，开始竞价流程...")
        // 获取当前最高价与出价者ID
        const currentHighestPriceResponse = await getCurrentHighestPriceBackend(detailsTabID);
        const currentHighestPriceUserID = currentHighestPriceResponse.userID;
        const currentHighestPrice = currentHighestPriceResponse.currentHighestPrice;

        console.info("\n");
        console.info("已查询当前最高价，物品ID：" + itemID + "，价格: " + currentHighestPrice + "，出价者ID：" + currentHighestPriceUserID);
        console.info("你的当前出价是：" + tradeInformation.tradePriceCurrent + "，你的ID：" + tradeInformation.userId + "\n");

        // 检测是否为当前出价最高用户
        if (tradeInformation.userId === currentHighestPriceUserID) {
            console.info("你是当前最高出价者\n")
        } else {
            if ((currentHighestPrice + tradeInformation.priceUpStep) <= tradeInformation.tradePriceMax) {
                // 出价速率 1260000 21min
                if (Date.now() - await retrievePostWantedTimeStamp(itemID) < RATE_POST_WANTED) {
                    console.info("未达到速率要求，跳过本次压价动作");
                } else {
                    if (await cancelWantedInQueue(tradeInformation)) {
                        console.info("取消求购操作已在队列中...");
                    } else {
                        tradeInformation.tradePriceCurrent = (currentHighestPrice + tradeInformation.priceUpStep);
                        await cancelWantedBackend(wantedTabID, itemID);
                        await postWantedBackend(detailsTabID, tradeInformation);
                        await activeMonitorDequeue(tradeInformation.itemId);
                        await activeMonitorEnqueue(tradeInformation);
                        tradeInformation.updatedFlag = tradeInformation.updatedFlag + 1;
                        console.info("\n已重新出价,当前出价：" + tradeInformation.tradePriceCurrent + "，当前竞价幅度：" + tradeInformation.priceUpStep + "，已出价次数：" + tradeInformation.updatedFlag + "\n")
                        await updateTradeInformationDatabase(tradeInformation);
                        await savePostWantedTimeStamp(itemID);
                        await reloadTabBackend(wantedTabID);
                        await reloadTabBackend(detailsTabID);
                    }
                }
            } else {
                console.info(tradeInformation.itemName + "，下次竞价价格超出最高预期价格");
                console.groupCollapsed("执行销毁交易数据流程")
                await destroyMonitorBackend(tradeInformation);
                await activeMonitorDequeue(tradeInformation.itemId);
                await reloadTabBackend(detailsTabID);
                console.warn(tradeInformation.itemName + "，下次竞价价格超出最高预期价格")
                console.groupEnd();
            }
        }
    } else if (postingWantedStatus.status === false) {
        let supplyItemHangedUpTimeStamp = await retrieveSupplyItemHangedUpTimeStamp(itemID);
        if (supplyItemHangedUpTimeStamp === -1) {
            console.warn("未在我的求购页面检测到交易物品，初始化交易暂挂时间时间戳");
            await saveSupplyItemHangedUpTimeStamp(itemID);
        } else if (Date.now() - supplyItemHangedUpTimeStamp <= 1920000) {
            console.warn("未检测到交易结果，物品：" + tradeInformation.itemName + " 暂挂中...");
        } else {
            console.warn("32分钟内持续未在我的求购页面检测到交易物品，执行销毁流程");
            await destroyMonitorBackend(tradeInformation);
            await activeMonitorDequeue(tradeInformation.itemId);
            await reloadTabBackend(detailsTabID);
            console.warn("持续未在我的求购页面检测到交易物品，交易可能已经完成，请检查求购记录")
        }
    } else {
        await destroyMonitorBackend(tradeInformation);
        await reloadTabBackend(detailsTabID);
        window.alert("定时任务错误，求购任务终止，请检查我的求购页面：" + tradeInformation.itemName);
    }

    console.groupEnd();
}

function taskScheduleDeactivate(taskScheduleId) {
    clearInterval(taskScheduleId);
}

/*========================================================================================

        我的求购页面刷新计划任务

=========================================================================================*/

// 请求刷新我的求购页面
async function requestReloadWantedTabTask(wantedTabPage) {
    let wantedTabReloadingTaskID = await retrieveWantedTabReloadTaskID(wantedTabPage);
    if (wantedTabReloadingTaskID === -1) {
        wantedTabReloadingTaskID = setInterval(async () => {
            // 我的求购页刷新 速率 5min ~ 13min
            if (Date.now() - await retrieveWantedTabReloadTimeStamp(wantedTabPage) >= await retrieveWantedTabReloadInterval(wantedTabPage)) {
                console.groupCollapsed(`执行${COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD}，页数：${wantedTabPage}`);
                await reloadTabBackend(await getWantedTab(wantedTabPage));
                await updateWantedTabReloadTimeStamp(wantedTabPage);
                await updateWantedTabReloadInterval(wantedTabPage);
                console.info(`已刷新我的求购页面，页数：${wantedTabPage}\n`);
                console.groupEnd();
            }
        }, RATE_TASK_SCHEDULE_CLOCK);

        await updateWantedTabReloadTaskID(wantedTabPage, wantedTabReloadingTaskID);
    } else {
        console.info(`${COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD}已在执行，跳过请求`);
    }
}

// 请求停止刷新我的求购页面
async function cancelReloadingWantedTabTask(wantedTabPage) {
    console.groupCollapsed(`停止${COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD}`);
    clearInterval(Number(await retrieveWantedTabReloadTaskID(wantedTabPage)));
    await deleteWantedTab(wantedTabPage);
    console.groupEnd();
}