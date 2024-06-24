/*#######################################################################################

    全局变量组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

/* ========================================== 交易信息 ========================================== */

const STORAGE_KEY_TRADE_INFORMATION = "_tradeInformation";

/* ========================================== 监听器相关 ========================================== */

const COMPONENT_NAME_MONITOR_INSTANCE = "监听器实例";
const COMPONENT_NAME_MONITOR_WANTED_STATUS = "监听求购状态";

const STORAGE_KEY_MONITOR_STATUS = "_monitorStatus";

/* ========================================== 标签页&窗口管理 ========================================== */

const COMPONENT_NAME_WANTED_TAB = "我的求购标签页";

const STORAGE_KEY_WINDOW = "windowID";
const STORAGE_KEY_TAB = "_tabID";
const STORAGE_KEY_TAB_WANTED = "_wantedTabID";

/* ========================================== 计划任务管理 ========================================== */

const COMPONENT_NAME_TASK_SCHEDULE_MAIN = "主计划任务";
const COMPONENT_NAME_TASK_SCHEDULE_WANTED_TAB_RELOAD = "我的求购页面刷新计划任务"

// 计划任务时钟速率 30s
const RATE_TASK_SCHEDULE_CLOCK = 10000;
// 执行器时钟速率 1s
const RATE_EXECUTOR_CLOCK = 1000;
// 计划任务执行速率 15min
const RATE_TASK_SCHEDULE_EXECUTE = 900000;
// 出价速率 21min
const RATE_POST_WANTED = 1260000;
// 物品详情页面刷新延迟 5min ~ 13min
const RATE_ITEM_PAGE_RELOAD_MIN = 300000;
const RATE_ITEM_PAGE_RELOAD_RANGE = 480001;
// 我的求购页面刷新延迟 5min ~ 13min
const RATE_WANTED_PAGE_RELOAD_MIN = 300000;
const RATE_WANTED_PAGE_RELOAD_RANGE = 480001;
// 取消求购延迟 3s ~ 6s
const RATE_CANCEL_WANTED_MIN = 3000;
const RATE_CANCEL_WANTED_RANGE = 3001;

const STORAGE_KEY_TASK_SCHEDULE_MAIN = "_taskScheduleMainID";
const STORAGE_KEY_TASK_SCHEDULE_MAIN_EXECUTE_STATUS = "_taskScheduleMainExecuteStatus";
const STORAGE_KEY_TASK_SCHEDULE_MAIN_EXECUTED_TIMESTAMP = "_taskScheduleMainExecutedTimeStamp";
const STORAGE_KEY_WANTED_TAB_RELOAD_TASK_ID = "_taskScheduleWantedTabReloadID";
const STORAGE_KEY_WANTED_TAB_RELOAD_TIMESTAMP = "_wantedTabReloadTimeStamp";
const STORAGE_KEY_WANTED_TAB_RELOAD_INTERVAL = "_wantedPageReloadInterval";
const STORAGE_KEY_POST_WANTED_TIMESTAMP = "_postWantedTimeStamp";
const STORAGE_KEY_ITEM_PAGE_RELOAD_TIMESTAMP = "_itemPageReloadTimeStamp";
const STORAGE_KEY_ITEM_PAGE_RELOAD_INTERVAL = "_itemPageReloadInterval";
const STORAGE_KEY_SUPPLY_ITEM_HANGUP_TIMESTAMP = "_supplyItemHangUpTimeStamp";

/* ========================================== 队列相关 ========================================== */

const COMPONENT_NAME_MONITOR = "监听器";
const COMPONENT_NAME_CANCELING_WANTED = "取消求购";

const COMPONENT_ACTION_ENQUEUE = "已入队";
const COMPONENT_ACTION_DEQUEUE = "已出队";

const STORAGE_KEY_ACTIVE_MONITOR_QUEUE = "activeMonitorQueue";
const STORAGE_KEY_CANCEL_WANTED_QUEUE = "cancelWantedQueue";
const STORAGE_KEY_CANCEL_WANTED_EXECUTOR = "cancelWantedExecutorID";
const STORAGE_KEY_CANCEL_WANTED_EXECUTION_INTERVAL = "cancelWantedExecutionInterval";
const STORAGE_KEY_CANCEL_WANTED_EXECUTION_TIMESTAMP = "cancelWantedExecutionTimeStamp";

/* ========================================== 日志相关 ========================================== */

const LOG_INFO_SEPARATOR = " - ";
const LOG_INFO_INITIALIZING = "初始化";
const LOG_INFO_INITIALIZED = "已初始化";
const LOG_INFO_EXECUTE = "执行";
const LOG_INFO_EXECUTED = "执行成功";
const LOG_INFO_DATABASE_UPDATE = "存储/刷新";
const LOG_INFO_DATABASE_RETRIEVE = "查询";
const LOG_INFO_DATABASE_DESTROY = "销毁";
const LOG_KEYWORD_ID = "ID"
const LOG_KEYWORD_QUEUE = "队列";
const LOG_KEYWORD_EXECUTOR = "执行器";
const LOG_KEYWORD_TIME_STAMP = "时间戳";
const LOG_KEYWORD_INTERVAL = "间隔";
const LOG_WARN_REEXECUTE = "重新执行";
const LOG_PREFIX_STORAGE = "数据库";
const LOG_STORAGE_RETRIEVED = "已查询";
const LOG_STORAGE_UPDATED = "已更新";
const LOG_STORAGE_DESTROYED = "已销毁";
const LOG_STORAGE_NOT_RETRIEVED = "未查询到";

/* ========================================== 异常处理相关 ========================================== */

const EXCEPTION_TRACE_FRONTEND = "前端";
const EXCEPTION_TRACE_BACKEND = "后台";

const EXCEPTION_PREFIX_CHROME_STORAGE = "Chrome Storage API";

const EXCEPTION_SUFFIX_COMPONENT = "组件错误";
const EXCEPTION_SUFFIX_INITIALIZE = "初始化失败"
const EXCEPTION_SUFFIX_RETRIEVE = " 查询失败";