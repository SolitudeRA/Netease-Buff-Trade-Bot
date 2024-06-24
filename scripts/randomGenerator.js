/*#######################################################################################

    随机数发生器组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

// 物品详情页面刷新延迟 5min ~ 13min
function randomGeneratorItemPageReload() {
    return Math.floor(Math.random() * RATE_ITEM_PAGE_RELOAD_RANGE + RATE_ITEM_PAGE_RELOAD_MIN);
}

// 我的求购页面刷新延迟 5min ~ 13min
function randomGeneratorWantedPageReload() {
    return Math.floor(Math.random() * RATE_WANTED_PAGE_RELOAD_RANGE + RATE_WANTED_PAGE_RELOAD_MIN);
}

// 取消求购延迟 3000 ~ 6000 3s ~ 6s
function randomGeneratorCancelWanted() {
    return Math.floor(Math.random() * RATE_CANCEL_WANTED_RANGE + RATE_CANCEL_WANTED_MIN);
}
