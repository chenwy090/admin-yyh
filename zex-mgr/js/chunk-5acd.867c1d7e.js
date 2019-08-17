(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5acd"],{"4a8c":function(e,t,s){},"5a11":function(e,t,s){"use strict";var a=s("4a8c"),o=s.n(a);o.a},e76a:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"search"},[s("Row",[s("Col",[s("Card",[s("Row",[s("Form",{ref:"searchItem",staticClass:"search-form",attrs:{model:e.searchItem,inline:"","label-width":70}},[s("FormItem",{attrs:{label:"领取人手机号"}},[s("Input",{staticStyle:{width:"200px"},attrs:{type:"text",clearable:"",placeholder:"请输手机号码"},model:{value:e.searchItem.phoneNumber,callback:function(t){e.$set(e.searchItem,"phoneNumber",t)},expression:"searchItem.phoneNumber"}})],1),s("FormItem",{attrs:{label:"周边券模板ID"}},[s("Input",{staticStyle:{width:"200px"},attrs:{type:"text",clearable:"",placeholder:"请输模板ID"},model:{value:e.searchItem.templateId,callback:function(t){e.$set(e.searchItem,"templateId",t)},expression:"searchItem.templateId"}})],1),s("FormItem",{attrs:{label:"状态"}},[s("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择",clearable:""},model:{value:e.searchItem.status,callback:function(t){e.$set(e.searchItem,"status",t)},expression:"searchItem.status"}},[s("Option",{attrs:{value:""}},[e._v("全部")]),s("Option",{attrs:{value:"1"}},[e._v("未使用")]),s("Option",{attrs:{value:"2"}},[e._v("已使用")]),s("Option",{attrs:{value:"3"}},[e._v("已过期")])],1)],1),s("FormItem",{attrs:{label:"领取终端"}},[s("Input",{staticStyle:{width:"200px"},attrs:{type:"text",clearable:"",placeholder:"请输入终端"},model:{value:e.searchItem.receivedFrom,callback:function(t){e.$set(e.searchItem,"receivedFrom",t)},expression:"searchItem.receivedFrom"}})],1),e.drop?s("span",[s("FormItem",{attrs:{label:"领取时间"}},[s("DatePicker",{staticStyle:{width:"200px"},attrs:{type:"date",placeholder:"选择日期"},model:{value:e.searchItem.receiveStartTime,callback:function(t){e.$set(e.searchItem,"receiveStartTime",t)},expression:"searchItem.receiveStartTime"}})],1),s("FormItem",{attrs:{label:"至"}},[s("DatePicker",{staticStyle:{width:"200px"},attrs:{type:"date",placeholder:"选择日期"},model:{value:e.searchItem.receiveEndTime,callback:function(t){e.$set(e.searchItem,"receiveEndTime",t)},expression:"searchItem.receiveEndTime"}})],1)],1):e._e(),s("FormItem",{staticClass:"br",staticStyle:{"margin-left":"-35px"}},[s("Button",{attrs:{type:"primary",icon:"ios-search"},on:{click:e.queryTableList}},[e._v("搜索")]),s("Button",{on:{click:e.refresh}},[e._v("重置")]),s("a",{staticClass:"drop-down",on:{click:e.dropDown}},[e._v("\n                "+e._s(e.dropDownContent)+"\n                "),s("Icon",{attrs:{type:e.dropDownIcon}})],1)],1)],1)],1)],1),s("Card",[s("Row",{staticClass:"operation"},[s("Button",{attrs:{icon:"md-refresh"},on:{click:e.queryCountsList}},[e._v("刷新")]),e._v("\n          发放"),s("span",{staticStyle:{color:"red"}},[e._v(e._s(e.queryCount.stockCount))]),e._v("张\n          卖出"),s("span",{staticStyle:{color:"red"}},[e._v(e._s(e.queryCount.receiveCount))]),e._v("张\n          已使用"),s("span",{staticStyle:{color:"red"}},[e._v(e._s(e.queryCount.useCount))]),e._v("张\n          未使用"),s("span",{staticStyle:{color:"red"}},[e._v(e._s(e.queryCount.notUseCount))]),e._v("张\n          已过期"),s("span",{staticStyle:{color:"red"}},[e._v(e._s(e.queryCount.expiredCount))]),e._v("张\n          剩余"),s("span",{staticStyle:{color:"red"}},[e._v(e._s(e.queryCount.surplusCount))]),e._v("张\n        ")],1),s("Row",[s("Table",{ref:"table",attrs:{loading:e.TableLoading,border:"",columns:e.tableColumns,data:e.table_list,sortable:"custom"}})],1),s("Row",{staticClass:"page",attrs:{type:"flex",justify:"end"}},[s("Page",{staticStyle:{float:"right"},attrs:{total:e.totalSize,"show-total":"","show-elevator":"",current:e.current},on:{"on-change":e.changeCurrent,"update:current":function(t){e.current=t}}})],1)],1)],1)],1),s("Modal",{attrs:{width:"700",title:e.title,"mask-closable":!1},model:{value:e.edit_Modal_show,callback:function(t){e.edit_Modal_show=t},expression:"edit_Modal_show"}},[s("Form",{ref:"edit_info",attrs:{model:e.edit_info,"label-width":80,rules:e.ruleValidate}},[s("FormItem",{attrs:{label:"岗位名称",prop:"postName"}},[s("Input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.edit_info.postName,callback:function(t){e.$set(e.edit_info,"postName",t)},expression:"edit_info.postName"}})],1),s("FormItem",{attrs:{label:"岗位编码",prop:"postCode"}},[s("Input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.edit_info.postCode,callback:function(t){e.$set(e.edit_info,"postCode",t)},expression:"edit_info.postCode"}})],1),s("FormItem",{attrs:{label:"显示顺序",required:""}},[s("InputNumber",{staticStyle:{width:"100%"},attrs:{max:99999,min:0,placeholder:"请输入",clearable:""},model:{value:e.edit_info.postSort,callback:function(t){e.$set(e.edit_info,"postSort",t)},expression:"edit_info.postSort"}})],1),s("FormItem",{attrs:{label:"岗位状态",prop:"status"}},[s("Select",{model:{value:e.edit_info.status,callback:function(t){e.$set(e.edit_info,"status",t)},expression:"edit_info.status"}},[s("Option",{attrs:{value:"0"}},[e._v("正常")]),s("Option",{attrs:{value:"1"}},[e._v("停用")])],1)],1),s("FormItem",{attrs:{label:"备注"}},[s("Input",{attrs:{type:"textarea",autosize:{minRows:2,maxRows:5},placeholder:"请输入...",clearable:""},model:{value:e.edit_info.remark,callback:function(t){e.$set(e.edit_info,"remark",t)},expression:"edit_info.remark"}})],1)],1),s("div",{attrs:{slot:"footer"},slot:"footer"},[s("Button",{attrs:{type:"text"},on:{click:function(t){e.edit_Modal_show=!1}}},[e._v("取消")]),s("Button",{attrs:{type:"primary",loading:e.edit_loading},on:{click:function(t){e.editOk("edit_info")}}},[e._v("保存")])],1)],1)],1)},o=[],r=s("7f80"),i={name:"post-manage",components:{},data:function(){return{drop:!1,dropDownContent:"展开",dropDownIcon:"ios-arrow-down",queryCount:{stockCount:0,receiveCount:0,useCount:0,surplusCount:0,notUseCount:0,expiredCount:0,returnMoneyCount:0},templateId:"",searchItem:{phoneNumber:"",templateId:"",status:"",receivedFrom:"",receiveStartTime:"",receiveEndTime:""},current:1,totalSize:0,pageNum:1,limit:10,TableLoading:!1,table_list:[],self:this,tableColumns:[{title:"订单编号",key:"id",width:100,align:"center"},{title:"模板ID",key:"templateId",width:150,align:"center",sortable:!0},{title:"券码",key:"barcode",align:"center",width:150,render:function(e,t){var s=t.row,a="1"==s.status?"blue":2==s.status?"#2db7f5":"#ed4014",o=s.barcode,r=o.substr(0,2),i="*********",n=o.substr(-2,2),l="1"==s.status?r+i+n:s.barcode;return e("Tag",{props:{color:a}},l)}},{title:"领取人账号",key:"phoneNumber",width:150,align:"center"},{title:"领取终端",key:"receivedFrom",width:100,align:"center"},{title:"领取时间",key:"receiveTime",width:150,align:"center"},{title:"使用时间",key:"useTime",width:150,align:"center"},{title:"退款时间",key:"refundTime",width:150,align:"center"},{title:"过期时间",key:"endUseTime",width:150,align:"center"},{title:"使用状态",key:"status",align:"center",width:150,render:function(e,t){var s=t.row,a="1"==s.status?"blue":2==s.status?"#2db7f5":"#ed4014",o="1"==s.status?"未使用":"2"==s.status?"已使用":"已过期";return e("Tag",{props:{color:a}},o)}}],edit_Modal_show:!1,edit_info:{postId:"",postName:"",postCode:"",status:"",remark:"",postSort:null},edit_loading:!1,ruleValidate:{postName:[{required:!0,message:"岗位名称不能为空",trigger:"blur"}],postCode:[{required:!0,message:"岗位编码不能为空",trigger:"blur"}],postSort:[{required:!0,message:"显示顺序不能为空",trigger:"blur"}],status:[{required:!0,message:"请选择岗位状态",trigger:"change"}]},requestUrl:"",msg:"",title:""}},created:function(){},methods:{init:function(){this.updateTableList(),this.queryCountsList()},dropDown:function(){this.drop?(this.dropDownContent="展开",this.dropDownIcon="ios-arrow-down"):(this.dropDownContent="收起",this.dropDownIcon="ios-arrow-up"),this.drop=!this.drop},refresh:function(){this.searchItem.phoneNumber="",this.searchItem.templateId="",this.searchItem.status="",this.searchItem.receivedFrom="",this.searchItem.receiveStartTime="",this.searchItem.receiveEndTime="",this.updateTableList()},queryCountsList:function(){var e=this;if(this.templateId){var t={templateId:this.templateId};Object(r["c"])("/merchantCoupon/receiveInfo/selectByTemplateIdWithStatistics",t).then(function(t){e.TableLoading=!1,t.isSuccess?t.data&&(e.queryCount=t.data):e.$Message.error(t.msg)})}},queryTableList:function(){this.templateId=this.searchItem.templateId,this.pageNum=1,this.updateTableList(),this.queryCountsList()},changeCurrent:function(e){this.pageNum=e,this.updateTableList()},updateTableList:function(){var e=this;this.TableLoading=!0;var t={phoneNumber:this.searchItem.phoneNumber,templateId:this.searchItem.templateId,status:this.searchItem.status,receivedFrom:this.searchItem.receivedFrom,receiveStartTime:this.searchItem.receiveStartTime,receiveEndTime:this.searchItem.receiveEndTime};Object(r["f"])("/merchantCoupon/receiveInfo/selectReceiveInfosByParams?pageNum="+this.pageNum+"&pageSize="+this.limit,t).then(function(t){e.TableLoading=!1,t.isSuccess?(e.totalSize=t.data.total,e.table_list=t.data.records):e.$Message.error(t.msg)})},addInfo:function(){this.edit_info={postId:"",postName:"",postCode:"",status:"0",remark:"",postSort:null},this.edit_Modal_show=!0,this.title="岗位管理新增"},editInfo:function(e){this.edit_Modal_show=!0,this.edit_info=e,this.title="岗位管理编辑"},editOk:function(e){var t=this;this.$refs[e].validate(function(e){if(e){if(""==t.edit_info.postSort)return void t.$Message.error("显示顺序不能为空");t.edit_info.postId?(t.requestUrl="/system/sys-post/edit",t.msg="编辑成功"):(t.requestUrl="/system/sys-post/add",t.msg="新增成功"),t.edit_loading=!0;var s={postId:t.edit_info.postId,postName:t.edit_info.postName,postCode:t.edit_info.postCode,status:t.edit_info.status,remark:t.edit_info.remark,postSort:t.edit_info.postSort};Object(r["f"])(t.requestUrl,s).then(function(e){t.edit_loading=!1,200==e.code?(t.$Message.info(t.msg),setTimeout(function(){t.edit_Modal_show=!1,t.updateTableList()},1200)):t.$Message.error(e.msg)})}else t.$Message.error("表单验证失败!")})},removeInfo:function(e){var t=this;this.$Modal.confirm({title:"删除确认",content:"删除后不可恢复，是否继续删除？",onOk:function(){t.$Loading.start(),Object(r["f"])("/system/sys-post/delete?postId="+e.postId).then(function(e){t.loading=!1,"200"==e.code?(t.$Message.info("删除成功！"),setTimeout(function(){t.pageNum=1,t.updateTableList()},1200)):t.$Message.error(e.msg)})},onCancel:function(){t.$Message.info("点击了取消")}})}},mounted:function(){this.init()}},n=i,l=(s("5a11"),s("2877")),c=Object(l["a"])(n,a,o,!1,null,"137c0952",null);c.options.__file="merchantCouponReceive.vue";t["default"]=c.exports}}]);