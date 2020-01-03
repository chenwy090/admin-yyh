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

// 获取有效城市
export function shopProvice() {
  return postRequest("/system/sys-shop-info/shop/provice");
}

// 获取有效城市下的市
export function shopCity(body) {
  return postRequest("/system/sys-shop-info/shop/city", body);
}

// 获取有效城市
export function provinceList() {
  return postRequest("/system/area/province/list");
}

// 获取有效城市下的市
export function cityByProvinceCode(code) {
  return getRequest(`/system/area/city/${code}`);
}

// 获取零售商
export function getVenderInfo() {
  return getRequest("/banner/getRetailInfo");
}

// 为你推荐 新增修改
export function recommendCouponSave(body = {}) {
  return postRequest("/share/recommend/coupon/save", body);
}

// 为你推荐 列表
export function recommendCouponList(body = {}) {
  return postRequest("/share/recommend/coupon/list/recommend", body);
}

// 为你推荐 终止
export function recommendCouponStop(body) {
  return postRequest("/share/recommend/coupon/stop", body);
}

// 为你推荐 删除
export function recommendCouponDel(body) {
  return postRequest("/share/recommend/coupon/del", body);
}

// 为你推荐 查看
export function recommendCouponDetail(body) {
  return postRequest("/share/recommend/coupon/detail", body);
}
