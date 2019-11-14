// 统一请求路径前缀在libs/axios.js中修改
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest,
    loginRequest
} from "@/libs/axios";

// 本地访问地址

// export const baseUrl = "http://192.168.0.19:8088//zex-mgr";
// export const baseUrl = "http://192.168.34.109:8088//zex-mgr";
// export const baseUrl = "http://192.168.0.25:8088/zex-mgr";

// export const baseUrl = "http://192.168.0.47:8088/zex-mgr";

// export const baseUrl = "http://192.168.31.102:8088/zex-mgr"; //姚军
// export const baseUrl = "http://192.168.0.25:8088/zex-mgr"; //mingyuan
// export const baseUrl = "http://192.168.34.109:8088/zex-mgr"; //建斌
// export const baseUrl = "http://192.168.31.225:8088/zex-mgr"; //yz
// export const baseUrl = "http://192.168.34.115:8088/zex-mgr"; //lubin
// export const baseUrl = "http://192.168.34.119:8088/zex-mgr"; //张磊




// export const baseUrl = "http://192.168.31.206:8088/zex-mgr"; //内容审核


// 老测试环境
// export const baseUrl = "http://47.103.117.70:8088/zex-mgr";
// export const downloadUrl = "http://47.103.117.70:8088/zex-mgr";


// 新测试环境
// export const baseUrl = "http://192.168.31.134:8088/zex-mgr";
// export const downloadUrl = "http://192.168.31.134:8088/zex-mgr";

// 开发环境 http://192.168.31.114:8088/
// export const baseUrl = "http://192.168.31.114:8088/zex-mgr";

// dev开发环境 http://47.102.126.157:8088/zex-mgr/
// http://crmdev.52iuh.cn:8088/zex-mgr
// export const baseUrl = "http://192.168.31.206:8088/zex-mgr";
// export const downloadUrl = "http://192.168.31.206:8088/zex-mgr";

// 预发环境地址
// export const baseUrl = "http://review.52iuh.com:8088/zex-mgr";
// export const downloadUrl = "http://review.52iuh.com:8088/zex-mgr";

// 正式环境 http://crm.52iuh.com:8088/zex-mgr
// export const baseUrl = "http://crm.52iuh.com:8088/zex-mgr";
// export const downloadUrl = "http://crm.52iuh.com:8088/zex-mgr";


// dev1.5.5
// export const baseUrl = "http://192.168.31.114:8088/zex-mgr";
// export const downloadUrl = "http://192.168.31.114:8088/zex-mgr";


export const baseUrl = process.env.VUE_APP_API;

console.log(baseUrl, 'baseUrl');

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
