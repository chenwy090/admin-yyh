// 统一请求路径前缀在libs/axios.js中修改
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest,
  uploadformData,
  downloadSteam,
} from "@/libs/axios";

// 申请退款
export function orderRefundApply(body) {
  return postRequest("/trade/fund/account/order/refund/apply", body);
}

// 批量审核信息
export function orderBatchAudit(body) {
  return postRequest("/trade/fund/account/order/batchAudit", body);
}

// 导出
export function orderDownload(body) {
  delete body.pageNum;
  delete body.pageSize;
  return downloadSteam("/trade/fund/account/order/download", body);
}

// ----------  明细 ---------------------//

// 列表
export function receiveInfoPage(body) {
  return postRequest("/coupon/receiveInfo/page", body);
}
