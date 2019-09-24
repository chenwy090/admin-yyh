import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import comm from './common';
// 首页CMS
import cms from './modules/cms';
// 财务中心
import financial from './modules/financial';
// 任务中心
import missionCenter from './modules/mission-center';

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
        comm,
        cms,
        financial,
        missionCenter
    }
});

export default store;