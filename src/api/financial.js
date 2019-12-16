// 统一请求路径前缀在libs/axios.js中修改
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest,
  uploadformData,
  downloadSteam,
  postJson
} from '@/libs/axios';

import qs from 'qs';
import { baseUrl } from "@/api/index";

//——————————————————交易流水——————————————————————

// 交易流水分页条件查询
export const billTransactionFlowList = (body) => {
  return postRequest(`/trade/merchant/bill/transaction/flow/list`, body)
}

//——————————————————结算清单——————————————————————


// 结算清单分页条件查询
export const settleBillList = (body) => {
  return postRequest(`/trade/settle/bill/list`, body)
}

// 手动创建结算单
export const settleBillSave = (body) => {
  return postRequest(`/trade/settle/bill/save`, body)
}

// 手动创建结算单
export const settleBillApply = (body) => {
  return postRequest(`/trade/settle/bill/apply`, body)
}

// 结算单明细下载
export const settleBillDownload = (id) => {
  return downloadSteam(`/trade/settle/bill/download/${id}`)
}


// 删除结算单
export const settleBillDelete = (id) => {
  return postRequest(`/trade/settle/bill/delete/${id}`)
}

// 重新生成结算单
export const settleBillRegen = (id) => {
  return postRequest(`/trade/settle/bill/regen/${id}`)
}

//——————————————————结算付款——————————————————————

// 结算清单分页条件查询
export const settleBillPayList = (body) => {
  return postRequest(`/trade/settle/bill/payList`, body)
}

// 驳回
export const settleBillReject = (body) => {
  return postRequest(`/trade/settle/bill/reject`, body)
}

// 确认付款
export const settleBillCheckPay = (body) => {
  return postRequest(`/trade/settle/bill/checkPay`, body)
}



// // 删除结算单
// export const settleBillDelete = (body) => {
//   return postRequest(`/trade/merchant/settle/bill/delete`, body)
// }

// // 重新生成结算单
// export const settleBillRegen = (body) => {
//   return postRequest(`/trade/merchant/settle/bill/regen`, body)
// }

// 下载结算单
export const postSettleBillDownload = (body) => {
  return downloadSteam(`/trade/settle/bill/download`, body)
}

// 获取商户信息
export const getMerchantInfoList = (body) => {
  return postRequest(`/merchant/merchantInfo/list?${qs.stringify(body)}`, body)
}
