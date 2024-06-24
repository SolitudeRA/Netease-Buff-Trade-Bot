/*#######################################################################################

    日志组件

    Version: V0.8
    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

/* ========================================== 数据库 ========================================== */

// 存储/刷新成功
function infoDatabaseUpdated(componentName, object, key, value) {
    console.info(`${LOG_PREFIX_STORAGE} ${LOG_INFO_DATABASE_UPDATE} [${componentName}${object}]，键：${key}，值：${value}`);
}

// 初始化成功
function infoDatabaseInitialized(componentName, object) {
    console.info(`${LOG_PREFIX_STORAGE} ${componentName}${object} ${LOG_INFO_INITIALIZED}`);
}

// 查询成功
function infoDatabaseRetrieved(componentName, object, key, value) {
    console.info(`${LOG_PREFIX_STORAGE} ${LOG_INFO_DATABASE_RETRIEVE} [${componentName}${object}]，键：${key}，值：${value}`);
}

// 未查询到
function infoDatabaseNotRetrieved(componentName, object) {
    console.info(`${LOG_PREFIX_STORAGE} ${LOG_INFO_DATABASE_RETRIEVE} [${componentName}${object}]，无值`);
}

// 销毁成功
function infoDatabaseDeleted(componentName, object) {
    console.info(`${LOG_PREFIX_STORAGE} ${LOG_INFO_DATABASE_DESTROY} [${componentName}${object}] ${LOG_INFO_SEPARATOR} ${LOG_INFO_EXECUTED}`);
}

// 存储/刷新失败
function errorDatabaseUpdating(componentName, object, exception) {
    console.error(`${EXCEPTION_PREFIX_CHROME_STORAGE} [${LOG_INFO_DATABASE_UPDATE} ${componentName}${object}] ${EXCEPTION_SUFFIX_COMPONENT}，${exception}`);
}

// 初始化失败
function errorDatabaseInitializing(componentName, object, exception) {
    console.error(`${EXCEPTION_PREFIX_CHROME_STORAGE} [${LOG_INFO_INITIALIZING} ${componentName}${object}] ${EXCEPTION_SUFFIX_COMPONENT}，${exception}`);
}

// 查询失败
function errorDatabaseRetrieving(componentName, object, exception) {
    console.error(`${EXCEPTION_PREFIX_CHROME_STORAGE} [${LOG_INFO_DATABASE_RETRIEVE} ${componentName}${object}] ${EXCEPTION_SUFFIX_COMPONENT}，${exception}`);
}

// 销毁失败
function errorDatabaseDeleting(componentName, object, exception) {
    console.error(`${EXCEPTION_PREFIX_CHROME_STORAGE} [${LOG_INFO_DATABASE_DESTROY} ${componentName} ${object}] ${EXCEPTION_SUFFIX_COMPONENT}，${exception}`);
}

/* ========================================== 队列 ========================================== */

// 队列完成初始化
function infoQueueInitialized(queueName) {
    console.info(`${queueName}${LOG_KEYWORD_QUEUE} ${LOG_INFO_SEPARATOR} ${LOG_INFO_INITIALIZED}`);
}

// 已入队
function infoQueueEnqueued(queueName) {
    console.info(`${queueName}${LOG_KEYWORD_QUEUE} ${LOG_INFO_SEPARATOR} ${COMPONENT_ACTION_ENQUEUE}`);
}

// 已出队
function infoQueueDequeued(queueName) {
    console.info(`${queueName}${LOG_KEYWORD_QUEUE} ${LOG_INFO_SEPARATOR} ${COMPONENT_ACTION_DEQUEUE}`);
}

// 队列任务正在执行
function infoQueueExecuting(queueName) {
    console.info(`${queueName}${LOG_KEYWORD_QUEUE} 正在 ${LOG_INFO_EXECUTE}`);
}

// 队列任务执行完成
function infoQueueExecuted(queueName) {
    console.info(`${queueName}${LOG_KEYWORD_QUEUE} ${LOG_INFO_SEPARATOR} ${LOG_INFO_EXECUTED}`);
}

function infoQueueExecutorExist(queueName) {
    console.info(`${queueName}${LOG_KEYWORD_QUEUE} ${LOG_INFO_SEPARATOR} ${LOG_KEYWORD_EXECUTOR}${LOG_INFO_INITIALIZED}`);
}

function errorQueueDequeue(queueName) {
    console.error(`${queueName}${LOG_KEYWORD_QUEUE} ${LOG_INFO_SEPARATOR} ${EXCEPTION_SUFFIX_COMPONENT}`);
}

/* ========================================== 组件 ========================================== */

// 组件错误
function errorComponentFrontEnd(componentName, exception) {
    console.error(`${EXCEPTION_TRACE_FRONTEND} [${componentName}] ${EXCEPTION_SUFFIX_COMPONENT}，${exception}`);
}

function errorComponentBackEnd(componentName, exception) {
    console.error(`${EXCEPTION_TRACE_BACKEND} [${componentName}] ${EXCEPTION_SUFFIX_COMPONENT}，${exception}`);
}