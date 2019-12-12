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

// 交易流水分页条件查询
export const billTransactionFlowList = (body) => {
  return postRequest(`/trade/merchant/bill/transaction/flow/list`, body)
}

// 删除结算单
export const settleBillDelete = (body) => {
  return postRequest(`/trade/merchant/settle/bill/delete`, body)
}

// 重新生成结算单
export const settleBillRegen = (body) => {
  return postRequest(`/trade/merchant/settle/bill/regen`, body)
}

// 结算单明细下载
export const settleBillDownload = (body) => {
  return postRequest(`/trade/merchant/settle/bill/download`, body)
}
