(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3fd4455e","chunk-2d0bd5e8","chunk-2d0c4fc7"],{"2c67":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Modal",{attrs:{width:"800",title:"品牌选择",closable:!1,"mask-closable":!1,"footer-hide":""},model:{value:e.viewDialogVisible,callback:function(t){e.viewDialogVisible=t},expression:"viewDialogVisible"}},[a("div",[a("div",[a("Card",{staticStyle:{"margin-bottom":"2px"},attrs:{bordered:!1}},[a("Form",{ref:"brandForm",attrs:{"label-position":"right","label-width":80,model:e.brandForm,inline:""}},[a("FormItem",{staticStyle:{width:"25%"},attrs:{label:"品牌名称",span:"24"}},[a("Input",{attrs:{placeholder:" 请填写品牌名称",maxlength:20},model:{value:e.brandForm.name,callback:function(t){e.$set(e.brandForm,"name",t)},expression:"brandForm.name"}})],1),a("FormItem",{staticStyle:{float:"right"},attrs:{span:"24","label-width":1}},[a("Button",{staticClass:"submit",staticStyle:{"margin-right":"5px"},attrs:{type:"primary",icon:"ios-search"},on:{click:function(t){return e.search("searchForm")}}},[e._v("搜索")]),a("Button",{attrs:{icon:"md-refresh"},on:{click:e.reset}},[e._v("重置")])],1)],1)],1),a("Row",[a("RadioGroup",{staticStyle:{width:"100%"},on:{"on-change":e.selectBusiness},model:{value:e.selectIndex,callback:function(t){e.selectIndex=t},expression:"selectIndex"}},[a("Table",{ref:"table",attrs:{loading:e.TableLoading,border:"",columns:e.tableColumns,data:e.listData,sortable:"custom"},on:{"on-selection-change":e.handleSelect},scopedSlots:e._u([{key:"action",fn:function(e){e.row;var t=e.index;return[a("Radio",{attrs:{label:t}},[a("span")])]}},{key:"activeTime",fn:function(t){var s=t.row;return[a("div",[e._v(e._s(s.activeTime))])]}}])})],1)],1),a("Row",{staticClass:"page",attrs:{type:"flex",justify:"end"}},[a("Page",{staticStyle:{float:"right"},attrs:{total:e.totalSize,"show-total":"","show-elevator":"",current:e.current},on:{"on-change":e.changeCurrent,"update:current":function(t){e.current=t}}})],1)],1)]),a("div",{staticStyle:{"text-align":"center",margin:"10px"}},[a("Button",{staticStyle:{"margin-left":"8px"},attrs:{type:"primary"},on:{click:e.brandSave}},[e._v("保存")]),a("Button",{staticStyle:{"margin-left":"8px"},on:{click:e.brandClose}},[e._v("关闭")])],1)])},n=[],i=a("7f80"),l={name:"brandModal",props:{viewDialogVisible:{type:Boolean,default:!1}},data:function(){return{TableLoading:"",brandForm:{name:"",current:1},totalSize:0,current:1,selectIndex:"",selectRow:{},tableColumns:[{title:"操作",width:200,align:"center",slot:"action",fixed:"left"},{title:"品牌名称",key:"name",align:"center"}],listData:[],selectDataList:[]}},methods:{resetRow:function(e){this.selectRow=e,this.loadTableData()},search:function(){this.loadTableData()},reset:function(){this.brandForm.current=1,this.brandForm.name=""},handleSelect:function(e,t){this.selectDataList=e},changeCurrent:function(e){this.brandForm.current!=e&&(this.brandForm.current=e,this.loadTableData())},selectBusiness:function(){console.log(this.selectIndex),this.selectRow=this.listData[this.selectIndex]},brandClose:function(){this.$emit("setViewDialogVisible",this.selectRow)},brandSave:function(){this.selectIndex||0===this.selectIndex?this.$emit("setViewDialogVisible",this.selectRow):this.$Message.error("请选择品牌")},loadTableData:function(){var e=this,t=this;this.TableLoading=!0,this.selectIndex="",Object(i["g"])("/merchant/brandMain/list?pageNum=".concat(this.brandForm.current,"&pageSize=10"),{name:this.brandForm.name,pageNum:this.current,pageSize:10}).then(function(a){e.TableLoading=!1,"200"===a.code?(e.totalSize=a.data.total,e.listData=a.data.records,e.selectRow.id&&a.data.records.forEach(function(e,a){console.log(111),e.id===t.selectRow.id&&(t.selectIndex=a)})):e.$Message.error("获取数据失败")})}},created:function(){}},o=l,r=a("6691"),c=Object(r["a"])(o,s,n,!1,null,"46034ace",null);t["default"]=c.exports},"3cbc":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Modal",{attrs:{width:"800",title:"商户选择",closable:!1,"mask-closable":!1,"footer-hide":""},model:{value:e.viewDialogVisible,callback:function(t){e.viewDialogVisible=t},expression:"viewDialogVisible"}},[a("div",[a("div",[a("Card",{staticStyle:{"margin-bottom":"2px"},attrs:{bordered:!1}},[a("Form",{ref:"businessModal",attrs:{"label-position":"right","label-width":80,model:e.businessModal,inline:""}},[a("FormItem",{staticStyle:{width:"25%"},attrs:{label:"商户名称",span:"24"}},[a("Input",{attrs:{placeholder:" 请填写商户名称",maxlength:20},model:{value:e.businessModal.name,callback:function(t){e.$set(e.businessModal,"name",t)},expression:"businessModal.name"}})],1),a("FormItem",{staticStyle:{width:"40%"},attrs:{label:"省/市",span:"24"}},[a("Cascader",{attrs:{data:e.addressData,"load-data":e.addressLoad},model:{value:e.addressValue,callback:function(t){e.addressValue=t},expression:"addressValue"}})],1),a("FormItem",{staticStyle:{float:"right"},attrs:{span:"24","label-width":1}},[a("Button",{staticClass:"submit",staticStyle:{"margin-right":"5px"},attrs:{type:"primary",icon:"ios-search"},on:{click:function(t){return e.search("searchForm")}}},[e._v("搜索")]),a("Button",{attrs:{icon:"md-refresh"},on:{click:e.reset}},[e._v("重置")])],1)],1)],1),a("Row",[a("RadioGroup",{staticStyle:{width:"100%"},on:{"on-change":e.selectBusiness},model:{value:e.selectIndex,callback:function(t){e.selectIndex=t},expression:"selectIndex"}},[a("Table",{ref:"table",attrs:{loading:e.TableLoading,border:"",columns:e.tableColumns,data:e.listData,sortable:"custom"},on:{"on-selection-change":e.handleSelect},scopedSlots:e._u([{key:"action",fn:function(e){e.row;var t=e.index;return[a("Radio",{attrs:{label:t}},[a("span")])]}},{key:"address",fn:function(t){var s=t.row;return[a("div",[e._v(e._s(s.province+"/"+s.city))])]}}])})],1)],1),a("Row",{staticClass:"page",attrs:{type:"flex",justify:"end"}},[a("Page",{staticStyle:{float:"right"},attrs:{total:e.totalSize,"show-total":"","show-elevator":"",current:e.current},on:{"on-change":e.changeCurrent,"update:current":function(t){e.current=t}}})],1)],1)]),a("div",{staticStyle:{"text-align":"center",margin:"10px"}},[a("Button",{staticStyle:{"margin-left":"8px"},attrs:{type:"primary"},on:{click:e.businessSave}},[e._v("保存")]),a("Button",{staticStyle:{"margin-left":"8px"},on:{click:e.businessClose}},[e._v("关闭")])],1)])},n=[],i=a("7f80"),l={name:"businessModal",props:{viewDialogVisible:{type:Boolean,default:!1}},data:function(){return{TableLoading:"",businessModal:{name:"",current:1},addressValue:[],selectRow:"",selectIndex:"",addressData:[],totalSize:0,current:1,tableColumns:[{title:"操作",width:80,align:"center",slot:"action",fixed:"left"},{title:"商户名称",minWidth:200,key:"name",align:"center"},{title:"省/市",minWidth:250,slot:"address",align:"center"}],listData:[],selectDataList:[]}},methods:{resetRow:function(e){this.selectRow=e,this.businessModal.name="",this.addressData=[],this.getProvinceList(),this.loadTableData()},getProvinceList:function(){var e=this;Object(i["g"])("/system/area/province/list",{}).then(function(t){"200"===t.code?(e.addressData=t.data||[],e.addressData.length&&e.addressData.forEach(function(e){e.value=e.provinceCode,e.label=e.shortName,e.children=[],e.loading=!1})):e.$Message.error("获取数据失败")})},addressLoad:function(e,t){var a=this;e.loading=!0,Object(i["d"])("/system/area/city/"+e.provinceCode).then(function(s){"200"===s.code?(e.children=s.data||[],e.loading=!1,e.children.length&&e.children.forEach(function(e){e.label=e.shortName,e.value=e.cityCode}),t()):(a.$Message.error("获取数据失败"),e.loading=!1,t())})},search:function(){this.TableLoading=!1,this.loadTableData()},reset:function(){},loadTableData:function(){var e=this,t=this;this.totalSize=0,this.listData=[],this.TableLoading=!0,this.selectIndex="",Object(i["g"])("/merchant/merchantInfo/list?pageNum=".concat(this.businessModal.current,"&pageSize=10"),{cityCode:this.addressValue[1]||"",provinceCode:this.addressValue[0]||"",name:this.businessModal.name||""}).then(function(a){e.TableLoading=!1,"200"===a.code?(e.totalSize=a.data.total,e.listData=a.data.records,e.selectRow.merchantId&&a.data.records.forEach(function(e,a){e.merchantId===t.selectRow.merchantId&&(t.selectIndex=a)})):e.$Message.error("获取数据失败")})},handleSelect:function(e,t){this.selectDataList=e},changeCurrent:function(e){this.businessModal.current!=e&&(this.businessModal.current=e,this.loadTableData())},selectBusiness:function(){this.selectRow=this.listData[this.selectIndex]},businessClose:function(){this.$emit("setViewDialogVisible",this.selectRow)},businessSave:function(){this.selectIndex||0===this.selectIndex?this.$emit("setViewDialogVisible",this.selectRow):this.$Message.error("请选择商户")}},created:function(){}},o=l,r=a("6691"),c=Object(r["a"])(o,s,n,!1,null,"6ca7b579",null);t["default"]=c.exports},"86b5":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.viewDialogVisible?a("div",{staticClass:"modal",on:{click:function(e){e.stopPropagation()}}},[a("Card",[a("p",{attrs:{slot:"title"},slot:"title"},[e._v("下载")]),a("a",{attrs:{slot:"extra",href:"#"},slot:"extra"},[a("Button",{attrs:{type:"dashed",icon:"md-arrow-round-back"},on:{click:function(t){return e.close()}}},[e._v("返回上一层")])],1),a("Form",{ref:"addOrEditModal",attrs:{model:e.modal,rules:e.ruleValidate,"label-width":80,"label-position":"left"}},[a("Row",{staticClass:"padding-left-12"},[a("Col",{attrs:{span:"24"}},[a("FormItem",{attrs:{label:"商户名称："}},[a("Select",{staticStyle:{width:"150px"},attrs:{placeholder:"请选择商户类型"},model:{value:e.modal.expandType,callback:function(t){e.$set(e.modal,"expandType",t)},expression:"modal.expandType"}},e._l(e.typeList,function(t){return a("Option",{key:t.value,attrs:{value:t.value}},[e._v(e._s(t.label))])}),1),a("div",{staticStyle:{width:"2%",display:"inline-block"}}),1==e.modal.expandType?a("Button",{staticStyle:{"min-width":"150px"},attrs:{type:"dashed",disabled:!e.modal.expandType},on:{click:e.openBusiness}},[e.selectBusinessObj.name?e._e():a("span",[e._v("请选择商户名称")]),e.selectBusinessObj.name?a("span",[e._v(e._s(e.selectBusinessObj.name))]):e._e()]):e._e(),2==e.modal.expandType?a("Button",{staticStyle:{"min-width":"150px"},attrs:{type:"dashed",disabled:!e.modal.expandType},on:{click:e.openBrand}},[e.selectBrandObj.name?e._e():a("span",[e._v("请选择品牌名称")]),e.selectBrandObj.name?a("span",[e._v(e._s(e.selectBrandObj.name))]):e._e()]):e._e()],1)],1)],1),2==e.modal.expandType&&e.brandList.length?a("Row",[a("Col",{attrs:{span:"24"}},[a("FormItem",{attrs:{label:""}},e._l(e.brandList,function(t){return a("div",[e._v(e._s(t.name))])}),0)],1)],1):e._e(),a("Row",{staticClass:"padding-left-12"},[a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"套餐：",span:"24"}},[a("Select",{staticStyle:{width:"150px"},model:{value:e.modal.merchantType,callback:function(t){e.$set(e.modal,"merchantType",t)},expression:"modal.merchantType"}},e._l(e.packageList,function(t){return a("Option",{key:t.value,attrs:{value:t.value}},[e._v(e._s(t.label))])}),1)],1)],1)],1),a("Row",{staticClass:"padding-left-12"},[a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"拓客时间："}},[a("DatePicker",{staticStyle:{width:"150px"},attrs:{value:e.modal.expandTimeStart,type:"date",options:e.options1},on:{"on-change":function(t){e.changeDateTime(t,1)}}}),a("div",{staticStyle:{width:"2%",display:"inline-block"}}),a("DatePicker",{staticStyle:{width:"150px"},attrs:{value:e.modal.expandTimeEnd,type:"date",options:e.options2},on:{"on-change":function(t){e.changeDateTime(t,2)}}})],1)],1)],1),a("FormItem",[a("Button",{attrs:{type:"primary"},on:{click:e.downLoad}},[e._v("下载")]),a("Button",{staticStyle:{"margin-left":"8px"},on:{click:e.close}},[e._v("关闭")])],1)],1)],1),a("brandModal",{ref:"brandModal",attrs:{viewDialogVisible:e.brandVolumeModal},on:{setViewDialogVisible:e.selectBrand}}),a("businessModal",{ref:"businessModal",attrs:{viewDialogVisible:e.businessVolumeModal},on:{setViewDialogVisible:e.selectBusiness}})],1):e._e()},n=[],i=a("7f80"),l=a("2c67"),o=a("3cbc"),r={name:"downLoadModal",components:{brandModal:l["default"],businessModal:o["default"]},props:{viewDialogVisible:{type:Boolean,default:!1}},data:function(){return{brandVolumeModal:!1,businessVolumeModal:!1,timeList1:24,timeList2:60,typeList:[{value:"1",label:"本地商户(单店)"},{value:"2",label:"本地商户(多店)"}],statusList:[{value:"1",label:"未生效"},{value:2,label:"已生效"},{value:3,label:"已完成"}],packageList:[{value:"",label:"全部"},{value:1,label:"精准拓客"},{value:2,label:"平台拓客"}],modal:{expandType:"1",expandTimeStart:"",expandTimeEnd:"",static:""},brandList:[],options1:{},options2:{},selectBusinessObj:{},selectBrandObj:{},ruleValidate:{requiredType:[{required:!0,message:"",trigger:"blur"}]}}},methods:{changeDateTime:function(e,t){switch(t){case 1:this.modal.expandTimeStart=e,this.options2={disabledDate:function(t){return t.valueOf()<new Date(e)-864e5}};break;case 2:this.modal.expandTimeEnd=e,this.options1={disabledDate:function(t){return t.valueOf()>new Date(e)}};break}},resetRow:function(){this.expandType="1",this.expandTimeStart="",this.expandTimeEnd="",this.static="",this.brandList=[],this.selectBusinessObj={},this.selectBrandObj={}},getPackageData:function(e,t){var a=this;Object(i["g"])("/merchant/merchantBrand/list/merchant",{brandId:e,brandLevel:1}).then(function(e){"200"===e.code?a.brandList=e.data||[]:(a.$Message.error(e.msg),a.brandList=[])})},openBusiness:function(e){var t=this;this.businessVolumeModal=!0,this.$nextTick(function(){t.$refs["businessModal"].resetRow(t.selectBusinessObj)})},selectBusiness:function(e){this.selectBusinessObj=e,this.businessVolumeModal=!1,e&&e.merchantId},openBrand:function(e){var t=this;this.brandVolumeModal=!0,this.$nextTick(function(){t.$refs["brandModal"].resetRow(t.selectBrandObj)})},selectBrand:function(e){this.selectBrandObj=e,this.brandVolumeModal=!1,e&&e.id&&this.getPackageData(e.id,2)},downLoad:function(){if(this.modal.expandType)if("1"!=this.modal.expandType||this.selectBusinessObj.name)if("2"!=this.modal.expandType||this.selectBrandObj.name){var e={expandTimeEnd:this.modal.expandTimeEnd,expandTimeStart:this.modal.expandTimeStart,expandType:this.modal.expandType,merchantName:this.modal.merchantName,merchantType:this.modal.merchantType,status:this.modal.status,merchantIds:[]};"1"==this.modal.expandType?(e.merchantName=this.selectBusinessObj.name,e.merchantIds.push(this.selectBusinessObj.merchantId)):"2"==this.modal.expandType&&(e.merchantName=this.selectBrandObj.name,this.brandList.forEach(function(t,a){e.merchantIds.push(t.merchantId)})),Object(i["b"])("/merchant/platform/expand/download",e).then(function(e){var t=e.data,a=e.headers["filename"],s=new Blob([t],{type:"application/vnd.ms-excel"});if("download"in document.createElement("a")){var n=document.createElement("a");n.download=decodeURI(a),n.style.display="none",n.href=URL.createObjectURL(s),document.body.appendChild(n),n.click(),URL.revokeObjectURL(n.href),document.body.removeChild(n)}else navigator.msSaveBlob(s,a)})}else this.$Message.error("请选择品牌名称");else this.$Message.error("请选择商户名称");else this.$Message.error("请选择商户类型")},close:function(){this.$emit("setViewDialogVisible",!1)}}},c=r,d=(a("9fc4"),a("6691")),u=Object(d["a"])(c,s,n,!1,null,"62fc2b5c",null);t["default"]=u.exports},"9fc4":function(e,t,a){"use strict";var s=a("f7a5"),n=a.n(s);n.a},f7a5:function(e,t,a){}}]);