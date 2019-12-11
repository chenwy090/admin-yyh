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

//查询所有的module模块
export const commonTagGetModuleInfo = () => {
  return getRequest(`/commonTag/getModuleInfo?page=1&size=2`)
}

//新增标签/编辑标签
export const commonTagAddAndUpdateCommonTag = (body) => {
  return postRequest(`/commonTag/addAndUpdateCommonTag`, body)
}

//通过id查询标签的信息
export const commonTagGetCommonTagInfo = (body) => {
  return postRequest(`/commonTag/getCommonTagInfo`, body)
}

//查询标签列表信息
export const commonTagGetCommonTagPageInfo = (body) => {
  return postRequest(`/commonTag/getCommonTagPageInfo`, body)
}

// 操作日志列表
export const commonTagGetOperatorPageInfo = (body) => {
  return postRequest(`/commonTag/getOperatorPageInfo`, body)
}

//标签启用/禁用
export const commonTagOpenAndCloseCommonTag = (body) => {
  return postRequest(`/commonTag/openAndCloseCommonTag`, body)
}


//查询周边券跳转标签
export const commonTagMerchantCouponTages = () => {
  return getRequest(`/commonTag/merchantCouponTages`)
}



