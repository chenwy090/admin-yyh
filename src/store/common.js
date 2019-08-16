// import Cookies from 'js-cookie';

const comm = {
    state: {
      singleModalData: []
    },
    mutations: {
      g_setData(iState, obj) {
        console.log(obj);
        for (let key in obj) {
          console.log(key);
          iState[key] = obj[key];
        }
      }
    }
};

export default comm;
