// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import App from './App'
import { router } from './router/index'
import store from './store'
import '@/locale'
import 'iview/dist/styles/iview.css'//
import VueI18n from 'vue-i18n';
import Icon from 'vue-awesome/components/Icon'

import '@/styles/index.less'

import hasRole from '@/libs/hasRole'
import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest } from '@/libs/axios'
import { setStore, getStore, removeStore } from '@/libs/storage'
import util from '@/libs/util';
import hasPermission from '@/libs/hasPermission';
import TreeTable from 'tree-table-vue'
import '@babel/polyfill'

import './directive/num-formatter'


Vue.config.productionTip = false
Vue.use(iView);
Vue.use(VueI18n);
Vue.use(TreeTable);
Vue.component('icon', Icon);
Vue.use(hasPermission);
Vue.use(hasRole);

// 挂载全局使用的方法
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;





/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted() {
        // 初始化菜单
        util.initRouter(this);
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
    }
})
