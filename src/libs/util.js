import axios from 'axios';
import {
    getMenuList
} from '@/api/index';
import lazyLoading from './lazyLoading.js';
import router from '@/router/index';
import Cookies from "js-cookie";

let util = {

};
const _methods = {
  g_isNotNull(el) {
      if (el || (typeof el === 'number' && ! isNaN(el)) || typeof el === 'boolean') {
          return true
      }
      return false
  },
  // 可以放在utils中
  filterNull: (json) => {
      let res = {}
      Object.keys(json).forEach(k => {
          if (_methods.g_isNotNull(json[k])) {
              res[k] = json[k]
          }
      })
      return res;
  }, // json to FormData()
  g_json2form: (json) => {
      let form = new FormData()
      if (typeof json !== 'object' || json === {}) {
          return form
      }
      Object.keys(json).forEach((k) => {
          form.append(k, json[k])
      })
      return form
  },
  // json to FormData()
  g_json2query: (json) => {
      let str = '';
      if (typeof json !== 'object' || json === {}) {
          return str
      }
      Object.keys(json).forEach((k, i) => {
          if (_methods.g_isNotNull(json[k])) {
              str += '&' + k + '=' + json[k]
          }
      })
      if (str[0] === '&') {
          str = '?' + str.slice(1);
      }
      return str
  }
}
Object.assign(util, _methods);
util.title = function(title) {
    title = title || '知而行管理系统';
    window.document.title = title;
};

util.inOf = function(arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function(ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.getRouterObjByName = function(routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function(vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function(vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [{
            title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
            path: '',
            name: 'home_index'
        }];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [{
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [{
                title: '首页',
                path: '',
                name: 'home_index'
            }];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [{
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [{
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function(vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function(routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function(vm) {
    vm.$store.commit('initCachepage');
};

util.initRouter = function(vm) {
    const constRoutes = [];
    const otherRoutes = [];

    // 404路由需要和动态路由一起注入
    const otherRouter = [{
        path: '/*',
        name: 'error-404',
        meta: {
            title: '404-页面不存在'
        },
        component: 'error-page/404'
    }];

    // 判断用户是否登录
    let userInfo = Cookies.get('userInfo')
    if (userInfo === null || userInfo === "" || userInfo === undefined) {
        // 未登录
        return;
    }
    // let jwttoken = window.localStorage.getItem('jwttoken')



    // 加载菜单
    getMenuList({

    }).then(res => {


        // res.data =[{"visible":"1","icon":"ios-cog","orderNum":1,"title":"测试管理","parentId":0,"url":"Main","path":"xxx","component":"Main","children":[{"path":"text","component":"text","visible":"1","icon":"#","name":"text","menuId":1239,"orderNum":1,"menuType":"C","perms":"","title":"测试2","parentId":1236,"url":"text","permTypes":["del"]},{"path":"sys/text","component":"xx","visible":"1","icon":"#","name":"sys/text","menuId":1237,"orderNum":1,"menuType":"C","perms":"xx","title":"测试菜单5","parentId":1236,"url":"xx"}],"name":"xxx","menuId":1236,"menuType":"M","perms":"","permTypes":["del","edit"]}]
        
        let menuData = res.data;
        console.log('这是个危险操作，快看看我在哪:');
        menuData.forEach((el,i) => {
          if (el.title === 'CMS') {
            menuData[i].children.push({
              component: "CMS/valueBurst/valueBurst",
              icon: "#",
              menuId: 1362,
              menuType: "C",
              name: "valueBurst",
              orderNum: 3,
              parentId: 1466,
              path: "valueBurst",
              perms: "",
              title: "超值爆抢券",
              url: "CMS/valueBurst",
              visible: "1"
            })
          }
        })

        if (menuData === null || menuData === "" || menuData === undefined) {
            return;
        }

        util.initRouterNode(constRoutes, menuData);
        util.initRouterNode(otherRoutes, otherRouter);
        // 添加主界面路由
        vm.$store.commit('updateAppRouter', constRoutes.filter(item => item.children != undefined));
        // 添加全局路由
        vm.$store.commit('updateDefaultRouter', otherRoutes);
        // 刷新界面菜单
        vm.$store.commit('updateMenulist', constRoutes.filter(item => item.children != undefined));

        let tagsList = [];
        vm.$store.state.app.routers.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        vm.$store.commit('setTagsList', tagsList);
    });
};

// 生成路由节点
util.initRouterNode = function(routers, data) {
    if (data) {
        for (var item of data) {
            let menu = Object.assign({}, item);
            // menu.component = import(`@/views/${menu.component}.vue`);
            menu.component = lazyLoading(menu.component);

            if (item.children && item.children.length > 0) {
                menu.children = [];
                util.initRouterNode(menu.children, item.children);
            }

            let meta = {};
            // 给页面添加权限、标题、第三方网页链接
            meta.permTypes = menu.permTypes ? menu.permTypes : null;
            meta.title = menu.title ? menu.title + " " : null;
            meta.url = menu.url ? menu.url : null;
            menu.meta = meta;

            routers.push(menu);
        }
    }
};

export default util;