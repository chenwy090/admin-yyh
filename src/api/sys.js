// 统一请求路径前缀在libs/axios.js中修改
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest,
    uploadformData,
    downloadSteam
} from '@/libs/axios';



// ------------- 用户管理api -------------------

//获取树形部门
export const getTreeSection = (params) => {
    return postRequest('/system/sys-user/select', params)
}
// 获取部门用户列表
export const getTreeDeptList = (params, pageNum) => {
    let pNum = pageNum || 1
    return postRequest(`/system/sys-user/list?isAsc=1&orderByColumn=1&pageNum=${pNum}&pageSize=10`, params)
}

// 添加用户
export const addUser = (params) => {
    let obj = JSON.stringify(params)
    return postRequest('/system/sys-user/add', obj)
}

// 删除用户
export const delUser = (id) => {
    return postRequest(`/system/sys-user/delete?userId=${id}`)
}

// 重置密码
export const resetPwd = (params) => {
    let obj = JSON.stringify(params)
    return postRequest(`/system/sys-user/edit`, obj)
}

// 获取id用户信息
export const getUserData = (id) => {
    return postRequest(`/system/sys-user/select?userId=${id}`)
}

// 编辑用户
export const editUser = (params) => {
    let obj = JSON.stringify(params)
    return postRequest('/system/sys-user/edit', obj)
}

// ------------- 门店管理api -------------------

// 获取部门用户列表
export const getShopList = (params, pageNum) => {
    // let pNum = pageNum || 1
    return postRequest(`/system/sys-shop-info/list?isAsc=1&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, params)
}

// 添加门店
export const addShop = (params) => {
    let obj = JSON.stringify(params)
    return postRequest('/system/sys-shop-info/add', obj)
}

// 编辑门店
export const editShop = (params) => {
    let obj = JSON.stringify(params)
    return postRequest('/system/sys-shop-info/edit', obj)
}

// 删除用户
export const delShop = (id) => {
    return postRequest(`/system/sys-shop-info/delete?shopId=${id}`)
}

// 导出xls
export const getXls = (params) => {
    return getRequest(`/system/sys-shop-info/downloadShopInfoList?shopId=1155`)
}

// 上传文件
export const upXls = (data) => {
    return uploadFileRequest('/system/sys-shop-info/importShopInfo', data)
}

// -----------------------运营位管理---------------------------

// 获取小程序接口 
export const getMiniApp = () => {
    return getRequest(`/miniapp/miniapp-info/store`)
}

// 获取列表
export const getOperationList = (params, pageNum) => {
    // return postRequest(`/system/sys-shop-info/list?isAsc=1&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, params)
    return postRequest(`/operation/operation-info/list?isAsc=ASC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, params)
}

// 新增运营位
export const addOperation = (params) => {
    let obj = JSON.stringify(params)
    return postRequest('/operation/operation-info/add', obj)
}

//修改运营位状态
export const editOperationStatus = (operationId, status) => {
    return postRequest(`/operation/operation-info/editStatus?operationId=${operationId}&status=${status}`)
}

//删除运营位
export const delOperation = (operationId) => {
    return getRequest(`/operation/operation-info/delete?operationId=${operationId}`)
}

// 编辑运营位
export const editOperation = (params) => {
    let obj = JSON.stringify(params)
    return postRequest('/operation/operation-info/edit', obj)
}

// 查询字典运营位
export const getDictData = (dictCode) => {
    return postRequest(`/system/sys-dict-data/selectDictDataDictCode?dictCode=${dictCode}`)
}

// 新增运营位
export const addOperationTopic = (params) => {
    let obj = JSON.stringify(params)
    return postRequest('/operation/operation-info/addOperationTopic', obj)
}

// ----------------------------定时任务---------------------------------

// 获取列表
export const getTimedList = (pageNum) => {
    return getRequest(`/qrtz/job/queryjob?pageNum=${pageNum}&pageSize=10`)
}


// 新增定时任务
export const addTimed = (cronExpression, jobClassName, jobGroupName) => {
    return postRequest(`/qrtz/job/addjob?cronExpression=${cronExpression}&jobClassName=${jobClassName}&jobGroupName=${jobGroupName}`)
}

//删除定时任务
export const delTimed = (jobClassName, jobGroupName) => {
    return postRequest(`/qrtz/job/deletejob?jobClassName=${jobClassName}&jobGroupName=${jobGroupName}`)
}

//暂停定时任务
export const suspendTimed = (jobClassName, jobGroupName) => {
    return postRequest(`/qrtz/job/pausejob?jobClassName=${jobClassName}&jobGroupName=${jobGroupName}`)
}

//恢复定时任务
export const recoverTimed = (jobClassName, jobGroupName) => {
    return postRequest(`/qrtz/job/resumejob?jobClassName=${jobClassName}&jobGroupName=${jobGroupName}`)
}

// 编辑定时任务
export const editTimed = (cronExpression, jobClassName, jobGroupName) => {
    return postRequest(`/qrtz/job/updateJob?cronExpression=${cronExpression}&jobClassName=${jobClassName}&jobGroupName=${jobGroupName}`)
}


// -------------------------------帮助中心-------------------------------------------- 

// 获取列表
export const getHelpCenterList = () => {
    return getRequest(`/qa/QaInfo/selectQaInfoList`)
}

// 新增 & 编辑定时任务
export const addHelpCenterInfo = (data) => {
    let obj = JSON.stringify(data)
    console.log(obj);
    return postRequest(`/qa/QaInfo/edit`, obj)
}

// ------------------------------ 查询日志 ------------------------------------------- 

// 获取列表
export const getQueryLogList = (params, pageNum) => {
    return postRequest(`/system/sys-api-log/list?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, params)
}

// 查询api详情
export const getQueryLogAll = (id) => {
    return postRequest(`/system/sys-api-log/queryLogDetail?id=${id}`)
}

// ------------------------------ 返佣规则管理 ------------------------------------------- 

// 获取列表 /rule/rakeBackRule/selectRakeBackRuleList
export const getRebateRule = () => {
    return postRequest(`/rule/rakeBackRule/selectRakeBackRuleList`)
}

// 新增
export const addRebateRule = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/rule/rakeBackRule/insertRakeBackRule`, obj)
}

// 编辑
export const editRebateRule = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/rule/rakeBackRule/updateRakeBackRule`, obj)
}

// 删除
export const delRebateRule = (id) => {
    return postRequest(`/rule/rakeBackRule/deleteRakeBackRuleByID?id=${id}`)
}

// ------------------------------ 返佣提现管规则------------------------------------------- 

// 返佣提现规则查询
export const getWithdrawCashRuleList = () => {
    return postRequest(`/rule/withdrawCashRule/selectWithdrawCashRuleList`)
}

// 新增
export const addWithdrawCashRuleList = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/rule/withdrawCashRule/insertWithdrawCashRule`, obj)
}

// 编辑
export const editWithdrawCashRule = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/rule/withdrawCashRule/updateWithdrawCashRule`, obj)
}

// 删除
export const delWithdrawCashRule = (id) => {
    return postRequest(`/rule/withdrawCashRule/deleteWithdrawCashRuleByID?id=${id}`)
}

// ---------------------------------提现返佣审核--------------------------------------------

// 提现审核列表
export const applyCashManagementList = (params, pageNum) => {
    return postRequest(`/rakeback/applyCash/list?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, params)
}

// 提交审核申请
export const examineAndVerify = (auditType, id, refuseReason, remark) => {
    return postRequest(`/rakeback/applyCash/auditById?auditType=${auditType}&id=${id}&refuseReason=${refuseReason}&remark=${remark}`)
}

// 查询审核申请详情
export const getExamineAllData = (id) => {
    return getRequest(`/rakeback/applyCash/selectById?id=${id}`)
}

// ------------------------------------二维码管理---------------------------------------------

// 获取列表
export const qrCodeManagementList = (params, pageNum) => {
    return postRequest(`/qrcode/list?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, params)
}

// 新增
export const addQrCodeManagement = (params) => {
    return postRequest(`/qrcode/add`, params)
}

// 根据字典获取服务类型 
export const getServiceType = (params) => {
    return postRequest(`/system/sys-dict-data/selectDictDataDictCode?dictCode=service_type`)
}

// 根据id差参数
export const getServiceParams = (id) => {
    return postRequest(`/qrcode/getServiceParams?qrcodeId=${id}`)
}


// ------------------------------------商户员工---------------------------------------------

// 获取列表
export const getStaffList = (params, pageNum) => {
    let obj = JSON.stringify(params)
    return postRequest(`/merchant/merchantEmployee/list?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, obj)
}

// 获取商户信息
export const getMerchantList = () => {
    return postRequest(`/merchant/merchantInfo/list?isAsc=DESC&orderByColumn=1&pageNum=1&pageSize=99999`, {})
}

// 新增员工 
export const addStaff = (params) => {
    return postRequest(`/merchant/merchantEmployee/add`, params)
}

// 编辑员工 
export const editStaff = (params) => {
    return postRequest(`/merchant/merchantEmployee/edit`, params)
}

// 绑定/解绑
export const bind = (params) => {
    return postRequest(`/merchant/merchantEmployee/bind`, params)
}

// 删除
export const delStaff = (id) => {
    return postRequest(`/merchant/merchantEmployee/delete?id=${id}`)
}

// ------------------------------ 返佣规则管理 ------------------------------------------- 

// 获取列表 
export const getCheckInData = () => {
    return getRequest(`/score/SigninRule/selectSigninRule`)
}

// 新增
export const addCheckInData = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/score/SigninRule/add`, obj)
}

// 编辑
export const editCheckInData = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/score/SigninRule/edit`, obj)
}


// ------------------------------ 抽奖活动管理 ------------------------------------------- 

// 获取抽奖活动列表
export const getLuckyDrawList = (params, pageNum) => {
    let obj = JSON.stringify(params)
    return postRequest(`/draw/activity/list?pageNum=${pageNum}&pageSize=10`, obj)
}
// 获取优惠活动列表
export const getCampaginList = () => {
    let obj = {
        campType: "57",
        sendChannel: "5",
    }
    return postRequest(`/campagin/list?pageNum=1&pageSize=99999999`, obj)
}

// 新增
export const addLuckyDraw = (data) => {
    return uploadformData(`/draw/activity/add`, data)
}

// 根据id查询抽奖活动数据
export const geiActivity = (id) => {
    return uploadformData(`/draw/activity/getByActId?actId=${id}`)
}

// 编辑
export const editLuckyDraw = (data,id) => {
    return uploadformData(`/draw/activity/edit/${id}`, data)
}

// 删除
export const delLuckyDraw = (id) => {
    return uploadformData(`/draw/activity/delete?actId=${id}`)
}

// ------------------------------ 配置新人礼包 ------------------------------------------- 

// 获取列表
export const getPersonGiftList = (params, pageNum) => {
    let obj = JSON.stringify(params)
    return postRequest(`/cashCouponDrawSet/list?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, obj)
}

// 获取优惠活动列表
export const getCampagin_6List = () => {
    let obj = {
        sendChannel: "6",
    }
    return postRequest(`/cashCouponDrawSet/selectCampPage?isAsc=DESC&orderByColumn=1&pageNum=1&pageSize=999999`, obj)
}

// 新增
export const addPersonGift = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/cashCouponDrawSet/add`, obj)
}

// 根据id查询数据
export const geiPersonGiftData = (id) => {
    return uploadformData(`/cashCouponDrawSet/selectByCampId?campId=${id}`)
}

// 编辑
export const editPersonGift = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/cashCouponDrawSet/edit`, obj)
}

// 删除
export const delPersonGift = (id) => {
    return uploadformData(`/cashCouponDrawSet/delete?campId=${id}`)
}

// ------------------------------ 优惠券领取信息表 ------------------------------------------- 

// 获取列表
export const getCouponList = (params, pageNum) => {
    let obj = JSON.stringify(params)
    return postRequest(`/coupon/receiveInfo/couponReport?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, obj)
}

// 获取详情
export const getCouponInformation = (campId,pageNum) => {
    return getRequest(`/coupon/receiveInfo/selectByCampId?campId=${campId}&pageNum=${pageNum}&pageSize=10`)
}


// ------------------------------ 商户优惠券领取信息表 ------------------------------------------- 

// 获取列表
export const getMerchantCouponList = (params, pageNum) => {
    let obj = JSON.stringify(params)
    return postRequest(`/merchantCoupon/receiveInfo/merchantCouponReport?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, obj)
}

// 获取详情
export const getMerchantCouponformation = (templateId,pageNum) => {
    return getRequest(`/merchantCoupon/receiveInfo/selectByTemplateId?templateId=${templateId}&pageNum=${pageNum}&pageSize=10`)
}

// ------------------------------ 奖励金设置 -------------------------------------------

// 获取列表 
export const getRakeBackRule = () => {
    return postRequest(`/rule/rakeBackRule/selectRakeBackRule`)
}

// 新增
export const addRakeBackRule = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/rule/rakeBackRule/insertRakeBackRule`, obj)
}

// 编辑
export const editRakeBackRule = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/rule/rakeBackRule/updateRakeBackRule`, obj)
}

// 查看日志
export const logDetailsApi = (field,pageNum) => {
    return postRequest(`/rule/rakeBackRule/selectByField?field=${field}&pageNum=${pageNum}&pageSize=10`)
}

// ------------------------------ 专题活动 -------------------------------------------

// 获取列表
export const getSpecialTopicList = (params, pageNum) => {
    let obj = JSON.stringify(params)
    return postRequest(`/specialTopic/list?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, obj)
}

//获取超市券/周边券
export const getCampaginListData = (url,params, pageNum) => {
    let obj = JSON.stringify(params)
    return postRequest(`${url}?pageNum=${pageNum}&pageSize=10`, obj)
}

// 新增
export const addSpecialTopic = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/specialTopic/add`, obj)
}

// 根据id获取数据
export const editSpecialTopic = (id) => {
    return postRequest(`/specialTopic/selectById?id=${id}`)
}

// 编辑 
export const editSpecialTopicData = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/specialTopic/edit`, obj)
}

// 删除
export const delSpecialTopic = (id) => {
    return postRequest(`/specialTopic/delete?id=${id}`)
}

// 上下架
export const upSpecialTopic = (id,status) => {
    return postRequest(`/specialTopic/updateStatus?id=${id}&status=${status}`)
}

// ------------------------------ 超值爆抢 -------------------------------------------

// 获取列表
export const getHotCouponList = (pageNum,shopId) => {
    return postRequest(`/hotCoupon/list?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10&shopId=${shopId}`)
}

// 新增
export const addHotCoupon = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/hotCoupon/add`, obj)
}

// 上升/下降
export const editHotCoupon = (event,id) => {
    return postRequest(`/hotCoupon/edit?event=${event}&id=${id}`)
}

// 删除
export const delHotCoupon = (id) => {
    return postRequest(`/hotCoupon/delete?id=${id}`)
}

// ------------------------------ 红包冠名 -------------------------------------------

// 获取列表
export const getRedEnvelopmentList = (params, pageNum) => {
    let obj = JSON.stringify(params)
    return postRequest(`/nameing/list?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, obj)
}

// 新增
export const addRedEnvelopment = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/nameing/add`, obj)
}

// 根据ActivityId获取数据
export const selectByActivityId = (activityId) => {
    return postRequest(`/nameing/selectByActivityId?activityId=${activityId}`)
}

// 编辑 
export const editRedEnvelopmentData = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/nameing/edit`, obj)
}


// 根据id获取数据
export const selectByid = (id) => {
    return postRequest(`/nameing/selectById?id=${id}`)
}


// 上下架
export const upStatus = (id,status) => {
    return postRequest(`/nameing/updateStatus?id=${id}&status=${status}`)
}
// 根据ActivityId获取链路素材数据
export const selectmaterialByActivityId = (activityId) => {
    return postRequest(`/material/selectByActivityId?activityId=${activityId}`)
}

// 新增链路素材
export const addMateria = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/material/add`, obj)
}
// 根据id获取数据
export const selectmateriaById = (id) => {
    return postRequest(`/material/selectById?id=${id}`)
}
// 编辑链路素材
export const editMateria = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/material/edit`, obj)
}


// ------------------------------ 维权补偿 -------------------------------------------

// 获取列表
export const getCompensateList = (params, pageNum) => {
    let obj = JSON.stringify(params)
    return postRequest(`/compensate/list?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, obj)
}
// 新增
export const addCompensate = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/compensate/add`, obj)
}

// ------------------------------ 优惠券推荐 -------------------------------------------

// 获取列表
export const getRecomondList = (params, pageNum) => {
    let obj = JSON.stringify(params)
    return postRequest(`/couponrecommend/list?isAsc=DESC&orderByColumn=1&pageNum=${pageNum}&pageSize=10`, obj)
}

// 上下架
export const eidtStatus = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/couponrecommend/updateStatus/`,obj)
}

//查看门店信息
export const queryShopInfo = (data) => {
    let obj = JSON.stringify(data)
    return postRequest(`/couponrecommend/shopRelation/listShop`,obj)
}

export const backCodeDownload = (id) => {
    return getRequest(`/couponrecommend/barcodeRelation/list/${id}`)
}



//--------------------------------------财务中心--------------------------
//业务审核列表
export const financialWithdrawApplyPreAuditList = (obj) => {
    return postRequest(`/withdraw/apply/pre/audit/list-data`, obj)
}
//财务审核列表
export const financialWithdrawApplyAuditList = (obj) => {
    return postRequest(`/withdraw/apply/financial/audit/list-data`, obj)
}
//打款成功列表
export const financialWithdrawApplyPaidList = (obj) => {
    return postRequest(`/withdraw/apply/paid/list-data`, obj)
}
//打款失败列表
export const financialWithdrawApplyPayFailureList = (obj) => {
    return postRequest(`/withdraw/apply/pay/failure/list-data`, obj)
}
//提现审核
export const financialWithdrawApplyAudit = (obj) => {
    return postRequest(`/withdraw/apply/audit`, obj)
}
//审核日志
export const financialWithdrawApplyAuditRecordList = (applyId) => {
    return postRequest(`/withdraw/apply/audit/record/list-data`,applyId)
}
//提现申请记录excel导出
export const financialWithdrawApplyDownload = (obj) => {
    return downloadSteam(`/withdraw/apply/excel/download`,obj)
}
//奖励金充值excel导出
export const financialWithdrawApplyAwardRechargeDownload = (obj) => {
    return downloadSteam(`/withdraw/apply/award-recharge/excel/download`,obj)
}
