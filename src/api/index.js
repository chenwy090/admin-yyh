// 统一请求路径前缀在libs/axios.js中修改
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest,
    loginRequest
} from "@/libs/axios";

//本地访问地址
//export const baseUrl = "http://127.0.0.1:8088/zex-mgr";
//测试环境
export const baseUrl = "http://47.103.117.70:8088/zex-mgr";
// export const baseUrl = "http://192.168.31.170:8088/zex-mgr";
// export const baseUrl = "http://192.168.31.175:8088/zex-mgr";
// export const downloadUrl = "http://47.103.117.70:8088/zex-mgr";
// export const baseUrl = "http://47.103.117.70:8088/zex-mgr";
// export const baseUrl = "http://192.168.31.170:8088/zex-mgr";
// export const baseUrl = "http://192.168.31.175:8088/zex-mgr";
export const downloadUrl = "http://47.103.117.70:8088/zex-mgr";


//  开发测试环境
// export const baseUrl = "http://pre-release.sweetmartmarketing.com:8088/zex-mgr";

// export const downloadUrl = "http://pre-release.sweetmartmarketing.com/zex-mgr";

// export const baseUrl = "http://192.168.31.205:8088/zex-mgr";
// export const baseUrl = "http://192.168.31.34:8088/zex-mgr";//明园
// export const baseUrl = "http://192.168.31.7:8088/zex-mgr";//杨伟涛
// export const downloadUrl = "http://47.103.117.70:8088/zex-mgr";

// export const baseUrl = "http://47.103.117.70:8088/zex-mgr";
// export const downloadUrl = "http://47.103.117.70:8088/zex-mgr";

// 正式环境 http://crm.52iuh.com:8088/zex-mgr

// export const baseUrl = "http://crm.52iuh.com:8088/zex-mgr";
// export const downloadUrl = "http://crm.52iuh.com:8088/zex-mgr";




//上传图片地址
export const uploadOperationImage2AliOssURl =
    baseUrl + "/operation/operation-info/uploadOperationImage2AliOss";

// 登陆
export const login = params => {
    return loginRequest("/login", params);
};

//解锁
export const unlock = params => {
    return loginRequest("/login", params);
};

// 获取菜单
export const getMenuList = params => {
    return postRequest("/system/sys-menu/leftTree", params);
};

// 个人中心编辑
export const userInfoEdit = params => {
    return postRequest("/user/edit", params);
};
// 个人中心修改密码
export const changePass = params => {
    return postRequest("/user/modifyPass", params);
};

//上传图片到阿里云图片服务器

export const uploadOperationImage2AliOss = params => {
    return postRequest(
        "/operation/operation-info/uploadOperationImage2AliOss",
        params
    );
};

export const importShopInfo = params => {
    return uploadFileRequest("/system/sys-shop-info/importShopInfo", params);
};
