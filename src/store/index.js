import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import comm from './common';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // 状态
        ...comm.state
    },
    mutations: {
        // 改变方法
        ...comm.mutations
    },
    actions: {

    },
    modules: {
        app,
        user,
        comm
    }
});

export default store;
