(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4bb73818"],{3511:function(t,e,a){"use strict";var n=a("403d"),r=a.n(n);r.a},"403d":function(t,e,a){},"7ab5":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"reward-u-edit"},[a("div",[a("Form",{ref:"form",attrs:{"label-position":"right",model:t.formData,"label-width":100}},[a("row",{staticClass:"task-info"},[a("h3",[t._v("任务信息")]),a("FormItem",{attrs:{label:"任务名称："}},[t._v(t._s(t.formData.name))]),a("FormItem",{attrs:{label:"任务时间："}},[t._v(t._s(t.formData.daterange.join("--")))]),a("FormItem",{attrs:{label:"审核："}},[t._v(t._s(t.formData.statusName))]),a("FormItem",{attrs:{label:"状态："}},[t._v(t._s(t.formData.isStopName))]),a("FormItem",{attrs:{label:"任务规则："}},[a("Row",[a("Col",{attrs:{span:"10"}},[t._v(t._s(t.formData.ruleDescribe))])],1)],1)],1),a("row",{staticClass:"task-reward-Rules"},[a("h3",[t._v("奖励规则")]),t._l(t.formData.ruleInfoList,function(t,e){return a("RewardRulesItemDetail",{key:e,attrs:{item:t}})})],2)],1)],1),a("div",{staticClass:"demo-drawer-footer"},[a("Button",{staticStyle:{"margin-right":"8px"},on:{click:t.closeDialog}},[t._v("关闭")])],1)])},r=[],i=a("ae1d"),s={name:"reward-u-edit",components:{RewardRulesItemDetail:i["default"]},props:{showDetail:{type:Boolean,default:!0},detailData:{type:Object,default:function(){return{}}}},data:function(){return{statusOption:{0:"待审核",1:"已通过",2:"未通过"},isStopOption:{0:"未开始",1:"进行中",2:"已结束",3:"已终止"},merchantTypeOption:{0:"本地商户（单店）",1:"本地商户（多店）"},formData:{id:"",name:"",startTime:"",endTime:"",daterange:[],ruleDescribe:"",ruleInfoList:[{merchantType:0,merchantId:"",merhcantName:"",brandId:"",brandName:"",anticipatedUbay:"",templateId:"",templateName:"",endTime:"",receivedNum:"",receiveAwardUbay:"",useAwardUbay:"",shareReceiveAwardUbay:"",shareUseAwardUbay:""}]}}},mounted:function(){var t=JSON.parse(JSON.stringify(this.detailData));this.formData=t,console.log("mounte detail",this.formData)},beforeDestroy:function(){this.$store.state.missionCenter.data={}},methods:{closeDialog:function(){console.log("closeDialog"),this.$emit("update:showDetail",!1)}}},o=s,l=(a("3511"),a("6691")),c=Object(l["a"])(o,n,r,!1,null,"59531f1d",null);e["default"]=c.exports},"7aea":function(t,e,a){"use strict";var n=a("be93"),r=a.n(n);r.a},"98b7":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"xxx"},[a("div",{staticClass:"query-row"},[a("Card",{staticStyle:{"margin-bottom":"2px"},attrs:{bordered:!1}},[a("Form",{attrs:{inline:""}},[a("FormItem",{attrs:{label:"任务名称：","label-width":85}},[a("Input",{staticStyle:{width:"200px"},attrs:{type:"text",placeholder:"请输入"},model:{value:t.searchData.name,callback:function(e){t.$set(t.searchData,"name",e)},expression:"searchData.name"}})],1),a("FormItem",{attrs:{label:"审核：","label-width":60}},[a("Select",{staticStyle:{width:"120px"},attrs:{clearable:""},model:{value:t.searchData.status,callback:function(e){t.$set(t.searchData,"status",e)},expression:"searchData.status"}},t._l(t.statusOption,function(e,n){return a("Option",{key:n,attrs:{value:n}},[t._v(t._s(e))])}),1)],1),a("FormItem",{attrs:{label:"状态：","label-width":60}},[a("Select",{staticStyle:{width:"120px"},attrs:{clearable:""},model:{value:t.searchData.isStop,callback:function(e){t.$set(t.searchData,"isStop",e)},expression:"searchData.isStop"}},t._l(t.isStopOption,function(e,n){return a("Option",{key:n,attrs:{value:n}},[t._v(t._s(e))])}),1)],1),a("FormItem",{attrs:{"label-width":0}},[a("Button",{attrs:{type:"primary",icon:"ios-search"},on:{click:function(e){return t.queryTableData()}}},[t._v("搜索")]),a("Button",{staticClass:"marginLeft20",attrs:{icon:"md-refresh"},on:{click:t.reset}},[t._v("重置")])],1)],1),a("Row",{attrs:{type:"flex",justify:"start"}},[a("Button",{attrs:{type:"primary",icon:"md-add"},on:{click:function(e){return t.addOrEdit("add")}}},[t._v("新增")]),a("Button",{staticClass:"marginLeft20",attrs:{icon:"md-refresh"},on:{click:t.refresh}},[t._v("刷新")])],1)],1)],1),a("Card",{attrs:{bordered:!1}},[a("Table",{attrs:{border:"","show-index":!0,loading:t.loading,columns:t.columns,data:t.tableData},scopedSlots:t._u([{key:"action",fn:function(e){var n=e.row;return[a("Button",{staticStyle:{"margin-right":"5px"},attrs:{type:"success",size:"small"},on:{click:function(e){return t.toDetail(n)}}},[t._v("查看")]),a("Button",{staticStyle:{"margin-right":"5px"},attrs:{type:"success",size:"small"},on:{click:function(e){return t.toData(n)}}},[t._v("数据")]),a("Button",{staticStyle:{"margin-right":"5px"},attrs:{type:"primary",size:"small"},on:{click:function(e){return t.addOrEdit("edit",n)}}},[t._v("编辑")]),a("Button",{attrs:{type:"success",size:"small"},on:{click:function(e){return t.examine(n)}}},[t._v("审核")]),a("Button",{attrs:{type:"warning",size:"small"},on:{click:function(e){return t.dowm(n)}}},[t._v("下架")]),a("Poptip",{attrs:{transfer:!0,confirm:"",placement:"bottom-end",title:"确认删除此任务吗?","ok-text":"确认","cancel-text":"取消","word-wrap":""},on:{"on-ok":t.ok,"on-cancel":t.cancel}},[a("Button",{staticStyle:{"margin-left":"5px"},attrs:{type:"error",size:"small"},on:{click:function(e){return t.del(n)}}},[t._v("删除")])],1)]}}])}),a("Row",{staticClass:"page",attrs:{type:"flex",justify:"end"}},[a("Page",{attrs:{"show-total":"","show-elevator":"",current:t.page.pageNum,"page-size":t.page.pageSize,total:t.page.total},on:{"on-change":t.changeCurrent}})],1)],1),a("Drawer",{attrs:{closable:!0,"mask-closable":!1,width:"820",styles:t.styles},model:{value:t.showDetail,callback:function(e){t.showDetail=e},expression:"showDetail"}},[a("p",{staticStyle:{color:"#f60","text-align":"center"},attrs:{slot:"header"},slot:"header"},[a("Icon",{attrs:{type:"ios-information-circle"}}),a("span",[t._v("任务详情")])],1),t.showDetail?a("RewardUDetail",{attrs:{showDetail:t.showDetail,detailData:t.detailData},on:{"update:showDetail":function(e){t.showDetail=e},"update:show-detail":function(e){t.showDetail=e}}}):t._e()],1),a("Modal",{attrs:{closable:!0,width:"300"},model:{value:t.examineModal,callback:function(e){t.examineModal=e},expression:"examineModal"}},[a("p",{staticStyle:{color:"#f60","text-align":"center"},attrs:{slot:"header"},slot:"header"},[a("Icon",{attrs:{type:"ios-information-circle"}}),a("span",[t._v("审核")])],1),a("div",[a("Form",{ref:"formValidate",attrs:{"label-position":"left",model:t.formValidate,rules:t.ruleValidate}},[a("FormItem",{attrs:{label:"审核结果：",prop:"status"}},[a("RadioGroup",{model:{value:t.formValidate.status,callback:function(e){t.$set(t.formValidate,"status",e)},expression:"formValidate.status"}},t._l(t.examineStatusOption,function(e,n){return a("Radio",{key:n,attrs:{label:n}},[t._v(t._s(e))])}),1)],1),a("FormItem",{attrs:{label:"填写原因：",prop:"reason"}},[a("Row",[a("Col",{attrs:{span:"16"}},[a("Input",{attrs:{type:"textarea",autosize:{minRows:3,maxRows:6},placeholder:t.reasonPlaceholder},model:{value:t.formValidate.reason,callback:function(e){t.$set(t.formValidate,"reason",e)},expression:"formValidate.reason"}})],1)],1)],1)],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"error",size:"large"},on:{click:function(e){return t.check("formValidate")}}},[t._v("确认")]),a("Button",{staticStyle:{"margin-left":"8px"},on:{click:function(e){return t.cancelHandleReset("formValidate")}}},[t._v("取消")])],1)])],1)},r=[],i=a("3add"),s=a.n(i),o=a("6797"),l=a("d7f8"),c=a("7ab5");function u(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),a.push.apply(a,n)}return a}function d(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?u(a,!0).forEach(function(e){h(t,e,a[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):u(a).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))})}return t}function m(t,e,a,n,r,i,s){try{var o=t[i](s),l=o.value}catch(c){return void a(c)}o.done?e(l):Promise.resolve(l).then(n,r)}function p(t){return function(){var e=this,a=arguments;return new Promise(function(n,r){var i=t.apply(e,a);function s(t){m(i,n,r,s,o,"next",t)}function o(t){m(i,n,r,s,o,"throw",t)}s(void 0)})}}function h(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var f={name:"reward-u",components:{RewardUDetail:c["default"]},watch:h({},"formValidate.status",function(){var t=this.formValidate.status,e=["","请输入通过原因","请输入50字以内未通过原因"];this.reasonPlaceholder=e[t],console.log("reasonPlaceholder",t,this.reasonPlaceholder)}),data:function(){var t=function(t,e,a){e+="",e=e.trim(),""==e?a(new Error("审核原因不能为空")):e.length>=50?a(new Error("请输入50字以内的字符")):a()};return{showDetail:!1,styles:{height:"calc(100% - 55px)",overflow:"auto",paddingBottom:"53px",position:"static"},id:"",examineModal:!1,examineStatusOption:{1:"通过",2:"不通过"},reasonPlaceholder:"请输入通过原因",formValidate:{status:"1",reason:""},ruleValidate:{reason:[{required:!0,validator:t,trigger:"blur"}]},statusOption:{0:"待审核",1:"已通过",2:"未通过"},isStopOption:{0:"未开始",1:"进行中",2:"已结束",3:"已终止"},merchantTypeOption:{0:"本地商户（单店）",1:"本地商户（多店）"},searchData:{name:"",status:"",isStop:""},loading:!1,page:{pageNum:1,pageSize:10,total:0},columns:l["a"],tableData:[],detailData:{}}},created:function(){this.queryTableData()},methods:{queryRowById:function(){var t=p(s.a.mark(function t(e){var a,n,r,i,l,c,u,d,m=this;return s.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,Object(o["bc"])(e);case 2:if(a=t.sent,n=a.code,r=a.data,200!=n){t.next=14;break}return i=r.isStop,l=r.status,c=r.startTime,u=r.endTime,d=r.ruleInfoList,r.statusName=this.statusOption[l],r.isStopName=this.isStopOption[i],r.daterange=[c,u],r.ruleInfoList=(d||[]).map(function(t){var e=t.merchantType,a=t.id,n=t.name,r=null;return t.merchantTypeName=m.merchantTypeOption[e],0==e?(t.merchantId=a,t.merhcantName=n,t.brandId="",t.brandName="",r={merchantId:t.id,name:t.name}):(t.brandId=a,t.brandName=n,t.merchantId="",t.merhcantName="",r={id:t.id,name:t.name}),t.tableData=[r],t}),t.abrupt("return",r);case 14:return t.abrupt("return",this.msgErr("数据查询失败！"));case 15:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),toDetail:function(){var t=p(s.a.mark(function t(e){var a;return s.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.queryRowById(e.id);case 2:a=t.sent,a&&(this.showDetail=!0,this.detailData=a);case 4:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),toData:function(){var t=p(s.a.mark(function t(e){var a,n;return s.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return a=e.id,t.next=3,Object(o["ec"])(a);case 3:n=t.sent,n.code,this.linkTo("reward-u-data",{id:a});case 6:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),examine:function(t){this.examineModal=!0,this.id=t.id},check:function(t){var e=this;this.$refs[t].validate(function(){var a=p(s.a.mark(function a(n){var r,i,l;return s.a.wrap(function(a){while(1)switch(a.prev=a.next){case 0:if(!n){a.next=7;break}return a.next=3,Object(o["w"])(d({id:e.id},e.formValidate));case 3:r=a.sent,i=r.code,l=r.msg,200==i?(e.msgOk("审核成功"),e.queryTableData(),e.cancelHandleReset(t)):e.msgErr(l);case 7:case"end":return a.stop()}},a)}));return function(t){return a.apply(this,arguments)}}())},dowm:function(t){var e=t.id;Object(o["I"])(e),this.refresh()},del:function(t){var e=t.id;console.log("del"),Object(o["z"])(e)},ok:function(){this.$Message.info("正在删除")},cancel:function(){this.$Message.info("已取消删除")},addOrEdit:function(){var t=p(s.a.mark(function t(e,a){var n,r,i;return s.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(n=null,"add"==e&&(n={type:e}),"edit"!=e){t.next=7;break}return t.next=5,this.queryRowById(a.id);case 5:r=t.sent,n={type:e,id:a.id,name:a.name,data:r};case 7:i="reward-u-edit",this.linkTo(i,n);case 9:case"end":return t.stop()}},t,this)}));function e(e,a){return t.apply(this,arguments)}return e}(),linkTo:function(t,e){this.$store.dispatch("missionCenter/changeView",d({compName:t},e))},refresh:function(){this.queryTableData(this.page.pageNum)},changeCurrent:function(t){this.queryTableData(t)},queryTableData:function(t){var e=this;this.page.pageNum=t||1,this.loading=!0,Object(o["gc"])(d({},this.searchData,{},this.page)).then(function(t){var a=t.code,n=t.data,r=n.current,i=n.total,s=n.size,o=n.records;200==a?(e.tableData=o.map(function(t){return t.startTimeAndEndTime="".concat(t.startTime,"-").concat(t.endTime),t.statusName=e.statusOption[t.status],t.isStopName=e.isStopOption[t.isStop],t}),e.page.pageNum=r,e.page.total=i,e.page.pageSize=s):e.$Message.error(t.code+" 数据加载失败!",3),e.loading=!1})},reset:function(){this.searchData={name:"",status:"",isStop:""},this.page={pageNum:1,pageSize:10,total:0},this.queryTableData()},msgOk:function(t){this.$Message.info({content:t,duration:3})},msgErr:function(t){this.$Message.error({content:t,duration:3})},cancelHandleReset:function(t){var e=this;this.examineModal=!1,this.$nextTick(function(){e.$refs[t].resetFields()})}}},y=f,g=(a("7aea"),a("6691")),b=Object(g["a"])(y,n,r,!1,null,"0b945ba0",null);e["default"]=b.exports},be93:function(t,e,a){},d7f8:function(t,e,a){"use strict";a.d(e,"b",function(){return n}),e["a"]=[{title:"操作",align:"center",width:200,fixed:"left",slot:"action"},{title:"序号",type:"index",width:80,align:"center"},{title:"任务名称",key:"name",align:"center",width:120},{title:"预计消耗U贝",key:"anticipatedUbay",align:"center",width:120},{title:"有效期",key:"startTimeAndEndTime",align:"center",minWidth:170},{title:"审核",key:"statusName",align:"center",minWidth:140},{title:"状态",key:"isStopName",align:"center",minWidth:140},{title:"创建时间",key:"gmtCreate",align:"center",minWidth:150},{title:"操作人",key:"createBy",align:"center",minWidth:140}];var n=[{title:"序号",type:"index",width:60,align:"center"},{title:"用户ID",key:"userId",align:"center",width:120},{title:"用户昵称",key:"nickName",align:"center",width:120},{title:"手机",key:"telphone",align:"center",width:120},{title:"优惠券名称",key:"couponTitle",align:"center",minWidth:100},{title:"商户类型",key:"merchantTypeName",align:"center",minWidth:140},{title:"名称",key:"merchantNameText",align:"center",minWidth:140},{title:"奖励类型",key:"awardTypeName",align:"center",minWidth:140},{title:"获得U贝",key:"awardUbay",align:"center",minWidth:140},{title:"创建时间",key:"gmtCreate",align:"center",minWidth:140}]}}]);