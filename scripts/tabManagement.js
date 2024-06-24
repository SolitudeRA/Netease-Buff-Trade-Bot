/*#######################################################################################

    标签页/窗口管理组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

/*========================================================================================

    窗口管理主函数

=========================================================================================*/

// 获取窗口ID
async function getWindowID() {
    let windowID = await retrieveWindowIDDatabase();
    if (windowID) {
        if (await existWindow(windowID)) {
            return windowID;
        } else {
            return await createWindow();
        }
    } else {
        return await createWindow();
    }

}

// 初始化窗口
async function createWindow() {
    return new Promise((resolve) => {
        chrome.windows.create({
            focused: false,
        }, function (window) {
            createWindowIDDatabase(window.id).then(() => {
                resolve(window.id);
            });
        });
    });
}

// 查询窗口是否存在
async function existWindow(windowID) {
    return new Promise((resolve) => {
        chrome.windows.getAll(null, function (windows) {
            for (let window of windows) {
                if (window.id === windowID) {
                    resolve(true);
                }
            }
            resolve(false);
        });
    });
}

// 移除窗口
async function removeWindow() {
    const windowID = await retrieveWindowIDDatabase();
    if (await existWindow(windowID)) {
        return new Promise((resolve) => {
            chrome.windows.remove(windowID, function () {
                deleteWindowIDDatabase().then(() => {
                    resolve();
                });
            })
        });
    } else {
        await deleteWindowIDDatabase();
    }

}

/*========================================================================================

    标签页管理主函数

=========================================================================================*/

// 获取标签页
async function getTabID(itemID) {
    let tabID = await retrieveTabIDDatabase(itemID);
    if (!tabID || !(await existTab(tabID))) {
        return await createTab(itemID);
    }else {
        return tabID;
    }
}

// 创建新标签页
async function createTab(itemID) {
    const windowID = Number(await getWindowID());
    const tab = await new Promise(resolve => {
        chrome.tabs.create({
            active: true,
            url: `https://buff.163.com/goods/${itemID}#tab=buying`,
            windowId: windowID
        }, resolve);
    });

    return await saveTabIDDatabase(itemID, tab.id);
}

// 检测标签页是否存在
async function existTab(tabID) {
    const windowID = Number(await getWindowID());
    const tabs = await new Promise(resolve => chrome.tabs.query({windowId: windowID}, resolve));
    return tabs.some(tab => tab.id === tabID);
}

// 移除标签页
async function deleteTab(tabId) {
    await new Promise(resolve => chrome.tabs.remove(tabId, resolve));
}

// 获取我的求购标签页
async function getWantedTab(page) {
    let wantedTabID = await retrieveWantedTabIDDatabase(page);
    if (wantedTabID === -1 || !await existTab(wantedTabID)) {
        wantedTabID = await createWantedTab(page)
    }
    return wantedTabID;
}

// 创建我的求购标签页
async function createWantedTab(page) {
    const windowID = Number(await getWindowID());
    const wantedTab = await new Promise(resolve => {
        chrome.tabs.create({
            active: true,
            url: `https://buff.163.com/market/buy_order/wait_supply?game=csgo&page_num=${page}`,
            windowId: windowID
        }, resolve);
    });

    await updateWantedTabIDDatabase(wantedTab.id, page);

    return wantedTab.id;
}

// 移除我的求购标签页
async function deleteWantedTab(wantedTabPage) {
    const wantedTabID = Number(await retrieveWantedTabIDDatabase(wantedTabPage));
    await deleteWantedTabIDDatabase(wantedTabPage);
    await new Promise(resolve => chrome.tabs.remove(wantedTabID, resolve));
}





