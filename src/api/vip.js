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
