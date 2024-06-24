/*#######################################################################################

    操作队列组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

/*========================================================================================

        监听任务队列

=========================================================================================*/
async function activeMonitorEnqueue(tradeInformation) {
    let activeMonitorQueue = await retrieveActiveMonitorQueue();
    if (activeMonitorQueue) {
        activeMonitorQueue.unshift(tradeInformation);
        await updateActiveMonitorQueue(activeMonitorQueue);
        infoQueueEnqueued(COMPONENT_NAME_MONITOR);
    } else {
        await createActiveMonitorQueue(tradeInformation);
        infoQueueInitialized(COMPONENT_NAME_MONITOR);
    }
}

async function activeMonitorDequeue(itemID) {
    let activeMonitorQueue = await retrieveActiveMonitorQueue();
    if (activeMonitorQueue) {
        await updateActiveMonitorQueue(activeMonitorQueue.filter(
            (element) => element.itemId !== itemID
        ));
        infoQueueDequeued(COMPONENT_NAME_MONITOR);
    } else {
        errorQueueDequeue(COMPONENT_NAME_MONITOR);
    }
}

async function activeMonitorIncludes(itemID) {
    let activeMonitorQueue = await retrieveActiveMonitorQueue();
    if (activeMonitorQueue) {
        return activeMonitorQueue.some((element) => element.itemId === itemID);
    } else {
        errorQueueDequeue(COMPONENT_NAME_MONITOR);
    }
}

async function activeMonitorGetPage(itemID) {
    const activeMonitorQueue = await retrieveActiveMonitorQueue();
    if (activeMonitorQueue) {
        const numberInQueue = activeMonitorQueue.findIndex(
            (element) => element.itemId === itemID
        );
        return Math.floor(numberInQueue / 10) + 1;
    } else {
        console.error(`${COMPONENT_NAME_MONITOR}${LOG_KEYWORD_QUEUE} ${LOG_INFO_SEPARATOR} ${EXCEPTION_SUFFIX_RETRIEVE}`);
    }
}

/*========================================================================================

        取消求购操作队列

=========================================================================================*/
let cancelWantedExecutorFlag = false;

async function cancelWantedEnqueue(tradeInformation) {
    let cancelWantedQueue = await retrieveCancelWantedQueue();
    if (cancelWantedQueue === -1) {
        await createCancelWantedQueue(tradeInformation);
        infoQueueInitialized(COMPONENT_NAME_CANCELING_WANTED);
    } else {
        cancelWantedQueue.push(tradeInformation);
        await updateCancelWantedQueue(cancelWantedQueue);
        infoQueueEnqueued(COMPONENT_NAME_CANCELING_WANTED);
    }
    await cancelWantedExecute();

    return new Promise((resolve) => {
        const intervalID = setInterval(async () => {
            if (!await cancelWantedInQueue(tradeInformation)) {
                clearInterval(intervalID);
                resolve();
            }
        }, 1000);
    });
}

async function cancelWantedGetTask(){
    let cancelWantedQueue = await retrieveCancelWantedQueue();

    return cancelWantedQueue[0];
}

async function cancelWantedDequeue() {
    let cancelWantedQueue = await retrieveCancelWantedQueue();
    if (cancelWantedQueue !== -1) {
        const tradeInformation = cancelWantedQueue.shift();
        await updateCancelWantedQueue(cancelWantedQueue);
        infoQueueDequeued(COMPONENT_NAME_CANCELING_WANTED);
        return tradeInformation;
    } else {
        errorQueueDequeue(COMPONENT_NAME_CANCELING_WANTED);
    }
}

async function cancelWantedInQueue(tradeInformation) {
    let cancelWantedQueue = await retrieveCancelWantedQueue();
    if (cancelWantedQueue === -1) {
        return false;
    } else {
        return cancelWantedQueue.includes(tradeInformation);
    }
}

async function cancelWantedQueueLength() {
    let cancelWantedQueue = await retrieveCancelWantedQueue();
    return cancelWantedQueue.length;
}

async function cancelWantedExecute() {
    // 检测执行器是否已初始化
    if (await retrieveCancelWantedExecuteTaskID()) {
        // 初始化执行器
        await updateCancelWantedExecuteTaskID(setInterval(async () => {
            // 检测执行器是否在执行任务
            if (!cancelWantedExecutorFlag) {
                // 如未在执行任务，检测时间间隔是否达到执行速率
                if (Date.now() - await retrieveCancelWantedExecuteTimeStamp() >= await retrieveCancelWantedExecutionInterval()) {
                    //执行取消求购任务
                    cancelWantedExecutorFlag = true;
                    const tradeInformation = await cancelWantedGetTask();
                    const wantedTabID = await getWantedTab(await activeMonitorGetPage(tradeInformation.itemId));

                    await cancelWantedBackend(wantedTabID, tradeInformation.itemId);
                    await cancelWantedDequeue();

                    await updateCancelWantedExecuteTimeStamp();
                    await updateCancelWantedExecutionInterval();
                    infoQueueExecuted(COMPONENT_NAME_CANCELING_WANTED);
                    // 检测队列任务是否全部执行完成
                    if (await cancelWantedQueueLength() === 0) {
                        clearInterval(Number(await retrieveCancelWantedExecuteTaskID()));
                        await deleteCancelWantedExecuteTaskID();
                        await deleteCancelWantedExecuteTimeStamp();
                        await deleteCancelWantedExecutionInterval();
                    }
                    cancelWantedExecutorFlag = false;
                }
            } else {
                infoQueueExecuting(COMPONENT_NAME_CANCELING_WANTED);
            }
        }, RATE_EXECUTOR_CLOCK));
    } else {
        infoQueueExecutorExist(COMPONENT_NAME_CANCELING_WANTED);
    }
}