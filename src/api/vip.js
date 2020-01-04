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

/// -----------------App专享----------------

// App专享 列表
export function exclusiveList(body) {
  return postRequest("/exclusive/list", body);
}

// App专享 新增
export function exclusiveAdd(body) {
  return postRequest("/exclusive/add", body);
}

// App专享 修改
export function exclusiveEdit(body) {
  return postRequest("/exclusive/edit", body);
}

// App专享 查看活动详情
export function exclusiveSelectById(id) {
  return postRequest(`/exclusive/selectById?id=${id}`);
}

// App专享 删除
export function exclusiveDelete(id) {
  return postRequest(`/exclusive/delete?id=${id}`);
}

// 查询优惠券详情
export function exclusiveSelectCouponById(id) {
  return postRequest(`/exclusive/selectCouponById?id=${id}`);
}
