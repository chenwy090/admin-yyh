// import Cookies from 'js-cookie';

const comm = {
    state: {
      drawType:"",//add/edit add_cache 缓存
      groupType:2,
      multiFormData:{},
      singleFormData:{},
      drawData:{},
      singleModalData: []
    },
    mutations: {
      g_setData(iState, obj) {
        for (let key in obj) {
          iState[key] = obj[key];
        }
      }
    }
};

export default comm;
