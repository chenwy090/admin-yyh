(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cb918cd2"],{1521:function(t,e,a){"use strict";var n=a("70c9"),s=a.n(n);s.a},4974:function(t,e,a){"use strict";a.r(e);var n,s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"brand-list-box"},[a("Modal",{attrs:{title:"品牌列表",width:"900","footer-hide":"",closable:!0,"mask-closable":!1,styles:{top:"20px"}},on:{"on-cancel":t.closeDialog},model:{value:t.isShow,callback:function(e){t.isShow=e},expression:"isShow"}},[a("div",[a("row",[a("Form",{ref:"searchItem",staticClass:"search-form",attrs:{model:t.searchItem,inline:"","label-width":70}},[a("FormItem",{attrs:{label:"品牌名称"}},[a("Input",{staticStyle:{width:"150px"},attrs:{type:"text",clearable:"",placeholder:"请输入品牌名称"},model:{value:t.searchItem.name,callback:function(e){t.$set(t.searchItem,"name",e)},expression:"searchItem.name"}})],1),a("FormItem",{staticClass:"br",staticStyle:{"margin-left":"-35px"}},[a("Button",{attrs:{type:"primary",icon:"ios-search"},on:{click:t.search}},[t._v("搜索")]),a("Button",{on:{click:t.reset}},[t._v("重置")])],1)],1)],1),a("Table",{ref:"selection",staticClass:"bussiness-list",attrs:{border:"",size:"small",columns:t.tableColumns,data:t.tableData,loading:t.tableLoading}}),a("Row",{staticClass:"page",attrs:{type:"flex",justify:"end"}},[a("Page",{staticStyle:{float:"right"},attrs:{"show-total":"","show-elevator":"",current:t.page.pageNum,"page-size":t.page.pageSize,total:t.page.total},on:{"on-change":t.changeCurrent}})],1)],1),a("Row",{staticStyle:{"margin-left":"350px","margin-top":"30px"}},[a("Button",{staticStyle:{"margin-right":"20px"},on:{click:t.cancel}},[t._v("取消")]),a("Button",{attrs:{type:"primary"},on:{click:t.selectMerchant}},[t._v("确定")])],1)],1)],1)},r=[],i=a("3add"),o=a.n(i),c=(a("6797"),a("7f80"));function l(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),a.push.apply(a,n)}return a}function u(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?l(a,!0).forEach(function(e){m(t,e,a[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):l(a).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))})}return t}function m(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function h(t,e,a,n,s,r,i){try{var o=t[r](i),c=o.value}catch(l){return void a(l)}o.done?e(c):Promise.resolve(c).then(n,s)}function d(t){return function(){var e=this,a=arguments;return new Promise(function(n,s){var r=t.apply(e,a);function i(t){h(r,n,s,i,o,"next",t)}function o(t){h(r,n,s,i,o,"throw",t)}i(void 0)})}}var f={name:"brand-list",data:function(){var t=this;return{isShow:!0,searchItem:{name:""},choice:{id:"",name:""},tableColumns:[{title:"序号",type:"index",width:80,align:"center"},{title:"选择",key:"brandId",width:70,align:"center",render:function(e,a){var n=a.row.id,s=a.row.name,r=!1;r=t.choice.id==n;var i=t;return e("div",[e("Radio",{props:{value:r},on:{"on-change":function(){console.log("change",a.row),i.choice.merchantType=1,i.choice.id=n,i.choice.name=s,i.choice.row=a.row}}})])}},{title:"品牌编号",align:"center",minWidth:130,key:"id"},{title:"品牌名称",align:"center",width:230,key:"name"},{title:"关联店铺数",align:"center",minWidth:120,key:"relationMerchantCount"}],page:{pageNum:1,pageSize:10,total:0},tableLoading:!1,tableData:[]}},methods:(n={cancel:function(){this.closeDialog()},search:function(){this.page={pageNum:1,pageSize:10,total:0},this.queryTableData()},changeCurrent:function(t){this.queryTableData(t)},queryTableData:function(){var t=d(o.a.mark(function t(e){var a,n,s,r,i,l,m,h,d;return o.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.page.pageNum=e||1,this.tableLoading=!0,a="/merchant/brandMain/selectByBrandName",t.next=5,Object(c["g"])(a,u({},this.searchItem,{},this.page));case 5:n=t.sent,s=n.code,r=n.data,i=r.current,l=r.total,m=r.size,h=r.records,d=n.msg,200==s?(this.tableData=h,this.page.pageNum=i,this.page.total=l,this.page.pageSize=m):this.msgErr(d),this.tableLoading=!1;case 15:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),closeDialog:function(){this.$emit("update:showBrandList",!1)},selectMerchant:function(){this.choice.id?(this.$emit("seclectedTr-event",this.choice),this.closeDialog()):this.msgErr("至少选一个品牌")},reset:function(){this.searchItem.name="",this.page={pageNum:1,pageSize:10},this.queryTableData()}},m(n,"changeCurrent",function(t){this.pageNum=t,this.queryTableData()}),m(n,"msgOk",function(t){this.$Message.info({content:t,duration:3})}),m(n,"msgErr",function(t){this.$Message.error({content:t,duration:3})}),n),mounted:function(){this.queryTableData()}},p=f,b=(a("1521"),a("96c9"),a("6691")),g=Object(b["a"])(p,s,r,!1,null,"843c4c9c",null);e["default"]=g.exports},"70c9":function(t,e,a){},"96c9":function(t,e,a){"use strict";var n=a("af74"),s=a.n(n);s.a},af74:function(t,e,a){},b6ed:function(t,e,a){"use strict";a.r(e);var n,s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"consume-edit"},[a("Modal",{attrs:{closable:!0,"mask-closable":!1,styles:{top:"20px"}},on:{"on-cancel":t.closeDialog},model:{value:t.isShow,callback:function(e){t.isShow=e},expression:"isShow"}},[a("p",{staticStyle:{color:"#f60","text-align":"center"},attrs:{slot:"header"},slot:"header"},[a("Icon",{attrs:{type:"ios-information-circle"}}),a("span",[t._v(t._s(t.title))])],1),a("div",[a("Form",{ref:"form",attrs:{"label-position":"right",model:t.formData,rules:t.ruleValidate,"label-width":100}},[a("FormItem",{attrs:{label:"商户类型：",prop:"merchantType"}},[a("RadioGroup",{model:{value:t.formData.merchantType,callback:function(e){t.$set(t.formData,"merchantType",e)},expression:"formData.merchantType"}},t._l(t.merchantTypeOption,function(e){return a("Radio",{key:e.value,attrs:{label:e.value}},[a("span",[t._v(t._s(e.label))])])}),1)],1),a("FormItem",{attrs:{label:"商户名称：",prop:"businessName",rules:{required:!0,validator:t.validateBusinessName}}},[a("Row",[a("Col",{attrs:{span:"16"}},[a("Input",{attrs:{placeholder:"点击按钮选择"+t.businessTypeLabel,disabled:""},model:{value:t.formData.businessName,callback:function(e){t.$set(t.formData,"businessName",e)},expression:"formData.businessName"}},[a("Button",{attrs:{slot:"append"},on:{click:t.handleChoose},slot:"append"},[t._v("选择")])],1)],1)],1)],1),a("Row",{staticClass:"box",staticStyle:{"margin-bottom":"20px"}},[a("Table",{attrs:{size:"small",border:"",width:"600px",columns:t.dynamicColumns,data:t.dynamicTableData},scopedSlots:t._u([{key:"operate",fn:function(e){var n=e.row;return[a("Button",{staticStyle:{color:"#2db7f5"},attrs:{size:"small",icon:"ios-trash-outline"},on:{click:function(e){return t.remove(n)}}},[t._v("移除")])]}}])})],1),a("FormItem",{attrs:{label:"消耗U贝：",prop:"reduceUbay",rules:{required:!0,validator:t.validateUbay}}},[a("Row",[a("Col",{attrs:{span:"16"}},[a("Input",{staticStyle:{width:"80%"},attrs:{placeholder:"请输入需要消耗U贝的数量",clearable:""},model:{value:t.formData.reduceUbay,callback:function(e){t.$set(t.formData,"reduceUbay",e)},expression:"formData.reduceUbay"}})],1)],1)],1),a("FormItem",{attrs:{label:"备注：",prop:"remark"}},[a("Row",[a("Col",{attrs:{span:"10"}},[a("Tooltip",{attrs:{trigger:"focus",title:"提醒",content:"最多200个汉字",placement:"right"}},[a("Input",{staticStyle:{width:"300px"},attrs:{type:"textarea",autosize:{minRows:4,maxRows:8},placeholder:"请输入200个字符以内备注",maxlength:200},model:{value:t.formData.remark,callback:function(e){t.$set(t.formData,"remark",e)},expression:"formData.remark"}})],1)],1)],1)],1)],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"error",size:"large"},on:{click:function(e){return t.handleSubmit("form")}}},[t._v("确认")]),a("Button",{staticStyle:{"margin-left":"8px"},on:{click:t.closeDialog}},[t._v("取消")])],1)]),t.showBusinessList?a("BusinessList",{attrs:{showBusinessList:t.showBusinessList},on:{"update:showBusinessList":function(e){t.showBusinessList=e},"update:show-business-list":function(e){t.showBusinessList=e},"seclectedTr-event":t.selectedTrCallBack}}):t._e(),t.showBrandList?a("BrandList",{attrs:{showBrandList:t.showBrandList},on:{"update:showBrandList":function(e){t.showBrandList=e},"update:show-brand-list":function(e){t.showBrandList=e},"seclectedTr-event":t.selectedTrCallBack}}):t._e()],1)},r=[],i=a("3add"),o=a.n(i),c=a("d6d6"),l=a("4974"),u=a("6797");function m(t,e,a,n,s,r,i){try{var o=t[r](i),c=o.value}catch(l){return void a(l)}o.done?e(c):Promise.resolve(c).then(n,s)}function h(t){return function(){var e=this,a=arguments;return new Promise(function(n,s){var r=t.apply(e,a);function i(t){m(r,n,s,i,o,"next",t)}function o(t){m(r,n,s,i,o,"throw",t)}i(void 0)})}}function d(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var f={name:"consume-edit",components:{BusinessList:c["default"],BrandList:l["default"]},props:{showConsume:{type:Boolean,default:!0}},computed:{dynamicColumns:function(){return 0==this.formData.merchantType?this.columns1:this.columns2},dynamicTableData:function(){return 0==this.formData.merchantType?this.tableData1:this.tableData2}},watch:(n={},d(n,"formData.merchantType",function(){var t=this,e=this.formData.merchantType;this.merchantTypeOption.some(function(a){var n=a.value==e;return n&&(t.businessTypeLabel=a.label),n}),0==e?(this.formData.brandId=this.formData.businessId,this.formData.brandName=this.formData.businessName,this.formData.businessId=this.formData.merchantId,this.formData.businessName=this.formData.merchantName):(this.formData.merchantId=this.formData.businessId,this.formData.merchantName=this.formData.businessName,this.formData.businessId=this.formData.brandId,this.formData.businessName=this.formData.brandName),this.$refs.form.validateField("businessName")}),d(n,"formData.money",function(){var t=this;this.$refs.form.validateField("money",function(e){e.length?t.formData.ubay=0:t.formData.ubay=1e3*t.formData.money})}),n),data:function(){var t=function(t,e,a){e+="",e=e.trim(),""==e?a(new Error("备注不能为空")):e.length<6?a(new Error("备注不得少于6个字")):a()};return{isShow:!0,title:"U贝消耗",data:{},businessTypeLabel:"商户",merchantTypeOption:[{value:0,label:"本地商户（单店）"},{value:1,label:"本地商户（多店）"}],formData:{changeType:1,merchantType:0,businessId:"",businessName:"",merchantId:"",merchantName:"",brandId:"",brandName:"",anticipatedDeduction:"",actualDeduction:"",remark:""},ruleValidate:{remark:[{validator:t,trigger:"blur"}]},showBusinessList:!1,showBrandList:!1,tableData1:[],tableData2:[],columns1:[{title:"商户编号",align:"center",width:200,key:"merchantId"},{title:"商户名称",align:"center",width:200,key:"name"},{title:"操作",align:"center",width:140,key:"action",slot:"operate"}],columns2:[{title:"品牌名称",align:"center",width:200,key:"name"},{title:"关联店铺数",align:"center",width:200,key:"relationMerchantCount"},{title:"操作",align:"center",width:140,key:"action",slot:"operate"}]}},methods:{selectedTrCallBack:function(t){console.log("selectedTrCallBack----",t);var e=t.merchantType,a=t.id,n=t.name,s=t.row;this.formData.businessId=a,this.formData.businessName=n,0==e?this.tableData1=[s]:this.tableData2=[s]},handleChoose:function(){0==this.formData.merchantType?this.showBusinessList=!0:this.showBrandList=!0},validateBusinessName:function(t,e,a){if(e+="",e=e.trim(),""==e)return a("请选择".concat(this.businessTypeLabel));a()},validateUbay:function(t,e,a){var n=/^([1-9][0-9]*)$/;n.test(e)?a():a(new Error("请输入大于0的正整数"))},remove:function(){var t=this.formData.merchantType;this.formData.businessId="",this.formData.businessName="",0==t?(this.formData.merchantId="",this.formData.merchantName="",this.tableData1=[]):(this.formData.brandId="",this.formData.brandName="",this.tableData2=[])},changeDrawType:function(t){console.log(t)},closeDialog:function(){console.log("closeDialog"),this.$emit("update:showConsume",!1)},handleSubmit:function(t){var e=this;this.$refs[t].validate(function(){var t=h(o.a.mark(function t(a){var n,s,r,i,c;return o.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(!a){t.next=13;break}return e.$Message.success("数据验证成功!"),n=JSON.parse(JSON.stringify(e.formData)),s=n.merchantType,0==s?(n.merchantId=n.businessId,n.merchantName=n.businessName):(n.brandId=n.businessId,n.brandName=n.businessName),t.next=7,Object(u["bb"])(n);case 7:r=t.sent,i=r.code,c=r.msg,200==i?(e.msgOk("保存成功"),e.closeDialog(),e.$emit("refresh")):e.msgErr(c),t.next=14;break;case 13:e.$Message.error("数据验证失败！");case 14:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}())},msgOk:function(t){this.$Message.info({content:t,duration:3})},msgErr:function(t){this.$Message.error({content:t,duration:3})}}},p=f,b=a("6691"),g=Object(b["a"])(p,s,r,!1,null,"33a5fa1b",null);e["default"]=g.exports}}]);