### 项目简介
- 项目基于 Vue-Cli 3.0正式版创建
- 组件库iView3.0
- 动态加载权限菜单 
- 多语言切换

### 主要所用技术
- Vue 2.5.x
- Vue Cli 3.x
- Vue Router
- Vuex
- vue-i18n
- iView
- ES6
- webpack
- axios
- cookie

### 本地开发构建运行
- 在项目根文件夹下先后执行命令 `npm install` (若有报错请使用[cnpm](https://npm.taobao.org/))、 `npm run dev`
- 项目浏览:http://127.0.0.1:9999

###  封装ajax多种提交方式 
可调用方法:getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest 
例如：
        export const XXX = (params) => {
            return postRequest('URL', params)
        }


### 业务开发参考     views/sys/user-manage 

