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

/// ------------为你推荐---------------------

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

/// --------------筛选项---------------------

// 筛选项信息
export function filterList(body = {}) {
  return postRequest("/filter/list", body);
}

// 筛选项信息
export function filterDetails(body) {
  return postRequest("/filter/details", body);
}

// 筛选项 一级分类
export function filterIndustryMain(body = {}) {
  return postRequest("/filter/industryMain", body);
}

// 筛选项  查询商超券省份
export function filterProvince(body = {}) {
  return postRequest("/system/area/province/businessList", body);
}
// 筛选项 根据省份code查询商超券城市
export function filterCityByProvince(provinceCode) {
  return getRequest(`/system/area/businessCity/${provinceCode}`);
}

/// ----------------------特权券------------------------------

// 特权券 详情
export function vipRightsDetail(id) {
  return postRequest(`/vip/rights/detail/${id}`);
}

// 特权券 特权删除
export function vipRightsDelete(id) {
  return postRequest(`/vip/rights/delete/${id}`);
}

// 特权券 特权终止
export function vipRightsStop(id) {
  return postRequest(`/vip/rights/stop/${id}`);
}

// 特权券 特权列表
export function vipRightsList(body) {
  return postRequest(`/vip/rights/page/list`, body);
}

// 特权券 配置vip特权券（新增
export function vipRightsConfig(body) {
  return postRequest(`/vip/rights/config`, body);
}

// 特权券 配置vip特权券（修改）
export function vipRightsConfigEdit(body) {
  return postRequest(`/vip/rights/configedit`, body);
}
