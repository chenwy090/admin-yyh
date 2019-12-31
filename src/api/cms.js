// 统一请求路径前缀在libs/axios.js中修改
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest,
  uploadformData,
  downloadSteam,
} from '@/libs/axios'

// 获取有效城市
export function shopProvice() {
  return postRequest('/system/sys-shop-info/shop/provice')
}

// 获取有效城市下的市
export function shopCity(body) {
  return postRequest('/system/sys-shop-info/shop/city', body)
}

// 获取零售商
export function getVenderInfo() {
  return postRequest('/system/sys-shop-info/getVenderInfo')
}
