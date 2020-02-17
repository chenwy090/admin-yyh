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
// 双蛋活动
import egg from './modules/egg';
// 活动模板
import template from './modules/template';
// bigc 赏u
import bigc from './modules/bigc';

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
        missionCenter,
        egg,
        template,
        bigc
    }
});

export default store;