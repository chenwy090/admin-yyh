import axios from 'axios';
import {
    getStore,
    setStore
} from './storage';
import {
    router
} from '../router/index';
import {
    Message
} from 'iview';
import Cookies from 'js-cookie';
import qs from 'qs';
import {
    baseUrl
} from "@/api/index";

// 超时设定
axios.defaults.timeout = 15000;

axios.interceptors.response.use(function (response) {

    if (response.headers.jwttoken) {
        window.localStorage.setItem("jwttoken", response.headers.jwttoken);


    }
    return response;
}, function (error) {
    Message.error('请求超时');
    return Promise.reject(error);
});



// http response 拦截器
axios.interceptors.response.use(response => {
    
    const data = response.data;
    // 根据返回的code值来做不同的处理(和后端约定)
    switch (data.code) {
        case '401':
            // 未登录 清除已登录状态
            Cookies.set('userInfo', '');
            setStore('jwttoken', '');
            router.push('/login');
            break;
        case '403':
            // 没有权限
            if (data.message !== null) {
                Message.error(data.message);
            } else {
                Message.error("未知错误");
            }
            break;
        default:
            let filename = response.headers["filename"];
            if(filename){
                return response;
            }
            return data;
    }
    return response;

}, (err) => {
    // 返回状态码不为200时候的错误处理
    Message.error(err.toString());
    return Promise.resolve(err);
});





export const loginRequest = (url, params) => {
    let jwttoken = getStore("jwttoken");
    return axios({
        method: 'post',
        url: baseUrl + `${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'jwttoken': jwttoken
        },




    });
};

export const getRequest = (url, params) => {
    let jwttoken = getStore('jwttoken');
    return axios({
        method: 'get',
        url: baseUrl + `${url}`,
        params: params,
        headers: {
            'jwttoken': jwttoken
        }
    });
};


export const getSyncRequest = async (url, params) => {
    let jwttoken = getStore('jwttoken');
    return await axios({
        method: 'get',
        url: baseUrl + `${url}`,
        params: params,
        headers: {
            'jwttoken': jwttoken
        }
    });
};

export const postSyncRequest = async (url, params) => {
    let jwttoken = getStore("jwttoken");
    return await axios({
        method: 'post',
        url: baseUrl + `${url}`,
        data: params,

        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'jwttoken': jwttoken
        },


    });
};
export const postRequest = (url, params) => {
    let jwttoken = getStore("jwttoken");
    return axios({
        method: 'post',
        url: baseUrl + `${url}`,
        data: params,

        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'jwttoken': jwttoken
        },


    });
};

/**
 * url 中要包含ip和端口
 * @param {*} url 
 * @param {*} params 
 */
export const postJson = (url, params) => {
  let jwttoken = getStore("jwttoken");
  return axios({
      method: 'post',
      url,
      data: params,

      headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'jwttoken': jwttoken
      },


  });
};

export const putRequest = (url, params) => {
    let jwttoken = getStore("jwttoken");
    return axios({
        method: 'put',
        url: baseUrl + `${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'jwttoken': jwttoken
        },

    });



};

export const deleteRequest = (url, params) => {
    let jwttoken = getStore('jwttoken');
    return axios({
        method: 'get',
        url: baseUrl + `${url}`,
        params: params,
        headers: {
            'jwttoken': jwttoken
        }
    });
};

export const uploadFileRequest = (url, params) => {
    let jwttoken = getStore('jwttoken');
    return axios({
        method: 'post',
        url: baseUrl + `${url}`,
        params: params,
        headers: {
            'Content-Type': 'multipart/form-data',
            'jwttoken': jwttoken
        }
    });
};





export const uploadformData = (url, params) => {
    let jwttoken = getStore('jwttoken');
    return axios({
        method: 'post',
        url: baseUrl + `${url}`,
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data',
            'jwttoken': jwttoken
        }
    });
}



export const downloadSteam = (url, params) => {
    let jwttoken = getStore('jwttoken');
    return axios({
        method: 'post',
        url: baseUrl + `${url}`,
        data: params,
        headers: {
            'Content-Type': 'application/json; application/octet-stream',
            'jwttoken': jwttoken
        },
        responseType: 'blob',
    });
}