(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cbc1a068"],{"5a9f":function(t,e,a){"use strict";var i=a("d880"),r=a.n(i);r.a},"885e":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t.merchantStaffAddPage?t._e():a("div",[a("Card",{staticStyle:{"margin-bottom":"2px"},attrs:{bordered:!1}},[a("Form",{attrs:{inline:""}},[a("FormItem",{attrs:{label:"员工手机号：","label-width":85}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{placeholder:"请输入员工手机号",clearable:"",max:99999999999,min:0},nativeOn:{keyup:function(e){return t.changeNumber1(e)}},model:{value:t.searchData.mobile,callback:function(e){t.$set(t.searchData,"mobile",e)},expression:"searchData.mobile"}})],1),a("FormItem",{attrs:{label:"商户名称：","label-width":85}},[a("Input",{staticStyle:{width:"200px"},attrs:{type:"text",placeholder:"请输入商户名称"},model:{value:t.searchData.merchantName,callback:function(e){t.$set(t.searchData,"merchantName",e)},expression:"searchData.merchantName"}})],1),a("FormItem",{attrs:{label:"状态：","label-width":85}},[a("Select",{staticStyle:{width:"150px"},attrs:{placeholder:"请选择状态"},model:{value:t.searchData.status,callback:function(e){t.$set(t.searchData,"status",e)},expression:"searchData.status"}},[a("Option",{attrs:{value:"-1"}},[t._v("全部")]),a("Option",{attrs:{value:"0"}},[t._v("正常")]),a("Option",{attrs:{value:"1"}},[t._v("已禁用")])],1)],1),a("FormItem",{staticClass:"br",staticStyle:{"margin-left":"35px"}},[a("Button",{attrs:{type:"primary",icon:"ios-search"},on:{click:t.search}},[t._v("搜索")]),a("Button",{attrs:{icon:"md-refresh"},on:{click:t.reset}},[t._v("重置")])],1)],1)],1),a("Card",{attrs:{bordered:!1}},[a("Row",{staticClass:"operation"},[a("Button",{attrs:{type:"primary",icon:"md-add"},on:{click:t.addInfo}},[t._v("新增")]),a("Button",{attrs:{icon:"md-refresh"},on:{click:t.search}},[t._v("刷新")])],1),a("div",[a("Table",{attrs:{border:"",width:"100%",columns:t.columns8,data:t.staffList,loading:t.TableLoading},scopedSlots:t._u([{key:"wxQrcode",fn:function(e){var i=e.row;return[""!=i.wxQrcode?a("img",{staticStyle:{width:"40px"},attrs:{src:i.wxQrcode},on:{click:function(e){return t.wxQrcodeLook(i.wxQrcode)}}}):t._e()]}},{key:"action",fn:function(e){var i=e.row;return["0"==i.status?a("Button",{staticStyle:{color:"#f39913"},attrs:{type:"text",size:"small"},on:{click:function(e){return t.inputUnbinding(i)}}},[t._v("禁用")]):t._e(),"1"==i.status?a("Button",{staticStyle:{color:"#368029"},attrs:{type:"text",size:"small"},on:{click:function(e){return t.inputUnbinding(i)}}},[t._v("解禁")]):t._e(),a("Button",{staticStyle:{color:"#2db7f5"},attrs:{type:"text",size:"small"},on:{click:function(e){return t.editInfo(i)}}},[t._v("编辑")])]}}],null,!1,234777226)})],1),a("Row",{staticClass:"page",attrs:{type:"flex",justify:"end"}},[a("Page",{attrs:{total:t.totalSize,"show-total":"","show-elevator":"",current:t.current},on:{"on-change":t.changeCurrent}})],1)],1)],1),a("Modal",{attrs:{title:"禁用/解禁原因",width:"600","footer-hide":"",closable:!1,"mask-closable":!1},model:{value:t.unbindDisplay,callback:function(e){t.unbindDisplay=e},expression:"unbindDisplay"}},[a("Divider",{staticStyle:{"margin-top":"-10px"}},[t._v("员工编号："+t._s(t.banRemark.employeeId))]),a("Row",[a("Input",{staticStyle:{width:"100%"},attrs:{type:"textarea",placeholder:"200个字符以内原因",clearable:"",rows:2},model:{value:t.banRemark.remark,callback:function(e){t.$set(t.banRemark,"remark",e)},expression:"banRemark.remark"}})],1),a("Row",{staticStyle:{margin:"10px 0 0 456px"}},[a("Button",{attrs:{type:"text"},on:{click:function(e){t.unbindDisplay=!1}}},[t._v("取消")]),a("Button",{attrs:{type:"primary"},on:{click:t.ban}},[t._v(t._s(t.banRemark.title))])],1),a("div",[a("Divider",[t._v("操作日志")])],1),a("Table",{attrs:{height:"350",columns:t.columns1,data:t.data1}})],1),a("Modal",{attrs:{title:"查看二维码",width:"350","footer-hide":""},model:{value:t.wxQrcodeDisplay,callback:function(e){t.wxQrcodeDisplay=e},expression:"wxQrcodeDisplay"}},[a("img",{staticStyle:{width:"100%"},attrs:{src:t.wxQrcode_url}})]),1==t.merchantStaffAddPage?a("div",[a("merchantStaffAdd",{attrs:{employeeId:t.employeeId},on:{changeStatus:t.showMerchantStaffAddStatus}})],1):t._e()],1)},r=[],n=a("6797"),s=a("7f80"),o=a("365c"),l=a("4bbb");function c(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var d={name:"merchant-staff",components:{merchantStaffAdd:l["default"]},data:function(){var t;return{employeeId:"",merchantStaffAddPage:!1,drop:!1,dropDownIcon:"ios-arrow-down",columns1:[{title:"操作者",key:"operater"},{title:"操作类型",key:"operateType"},{title:"原因",key:"remark"},{title:"操作时间",key:"time"}],data1:[],columns8:[{title:"操作",align:"center",width:180,fixed:"left",slot:"action"},{title:"编号",align:"center",width:140,key:"employeeId"},(t={title:"关联商户",align:"center",minWidth:200,ellipsis:!0},c(t,"align","left"),c(t,"key","merchantNames"),c(t,"render",function(t,e){return t("div",[t("Tooltip",{props:{placement:"top"}},[t("span",{style:{display:"inline-block",width:.85*e.column._width+"px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},e.row.merchantNames),t("span",{slot:"content",style:{whiteSpace:"normal",wordBreak:"break-all"}},e.row.merchantNames)])])}),t),{title:"名称",align:"center",minWidth:120,key:"realName"},{title:"手机号",align:"center",minWidth:120,key:"mobile"},{title:"角色类型",ellipsis:!0,align:"left",minWidth:200,key:"roles",render:function(t,e){return t("div",[t("Tooltip",{props:{placement:"top"}},[t("span",{style:{display:"inline-block",width:.85*e.column._width+"px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},e.row.roles),t("span",{slot:"content",style:{whiteSpace:"normal",wordBreak:"break-all"}},e.row.roles)])])}},{title:"状态",align:"center",minWidth:120,key:"statusName"},{title:"来源",align:"center",minWidth:120,key:"status"},{title:"员工岗位描述",align:"center",minWidth:120,key:"postDesc"},{title:"员工微信号",align:"center",minWidth:120,key:"wxAccount"},{title:"微信号二维码",align:"center",minWidth:120,key:"wxQrcode",slot:"wxQrcode"}],staffList:[],searchData:{status:"",merchantName:"",mobile:null},current:1,totalSize:0,TableLoading:!1,merchantList:[],addStaffDisplay:!1,formValidate:{merchantId:"",mobile:null,postDesc:"",profile:"",realName:"",serviceContent:"",wxAccount:"",wxQrcode:""},uploadList1:[],url:o["g"],userToken:{},editStaffDisplay:!1,editEmployeeId:"",banRemark:{employeeId:"",remark:"",type:"",title:"禁用"},unbindDisplay:!1,wxQrcodeDisplay:!1,wxQrcode_url:""}},created:function(){this.searchData.merchantId=this.merchantId,this.formValidate.merchantId=this.merchantId,this.getMerchantListFn(),this.search(),this.userToken={jwttoken:localStorage.getItem("jwttoken")}},methods:{showMerchantStaffAddStatus:function(t){this.merchantStaffAddPage=t,this.search()},addInfo:function(){this.setStore("pageStatus","add"),this.merchantStaffAddPage=!0},editInfo:function(t){this.setStore("pageStatus","edit"),this.employeeId=t.employeeId,this.merchantStaffAddPage=!0},init:function(){},search:function(){this.current=1,this.totalSize=0,this.getStaffListFn(this.searchData)},reset:function(){this.searchData.realName="",this.searchData.mobile=null,this.pagingType="1",this.search()},getMerchantListFn:function(){var t=this;Object(n["Ab"])().then(function(e){200==e.code?t.merchantList=e.data.records:t.msgErr(e.msg)})},getStaffListFn:function(t){var e=this;this.TableLoading=!0;var a=t.status;"-1"==a&&(a=null);var i={status:a,merchantName:t.merchantName,mobile:t.mobile};Object(n["Pb"])(i,this.current).then(function(t){200==t.code?(e.staffList=t.data.records,e.current=t.data.current,e.totalSize=t.data.total,e.TableLoading=!1):(e.TableLoading=!1,e.msgErr(t.msg))})},handleSuccess2:function(t,e){if(200==t.code){this.formValidate.wxQrcode=t.image_url;var a=[{url:t.image_url}];this.uploadList1=a,this.msgOk("上传图片成功")}else this.msgErr("上传图片失败，请重新上传")},handleMaxSize:function(){this.msgErr("上传图片不能超过1MB,请重新上传")},formatError:function(){this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传")},addStaffFn:function(){var t=this;this.ruleValidate()&&Object(n["r"])(this.formValidate).then(function(e){200==e.code?(t.msgOk("新增成功"),t.search(),t.cancel()):t.msgErr(e.msg)})},cancel:function(){this.editEmployeeId="",this.formValidate.mobile=null,this.formValidate.postDesc="",this.formValidate.profile="",this.formValidate.realName="",this.formValidate.serviceContent="",this.formValidate.wxAccount="",this.formValidate.wxQrcode="",this.addStaffDisplay=!1,this.editStaffDisplay=!1},inputUnbinding:function(t){this.banRemark.employeeId=t.employeeId,this.banRemark.remark="",this.banRemark.status=t.status,t.remark?this.data1=JSON.parse(t.remark):this.data1=[],"0"==this.banRemark.status?this.banRemark.title="禁用":"1"==this.banRemark.status&&(this.banRemark.title="解禁"),this.unbindDisplay=!0},ban:function(){var t=this;console.info(this.banRemark);var e="";if("0"==this.banRemark.status?e="禁用":"1"==this.banRemark.status&&(e="解禁"),""!=this.banRemark.remark.trim()){var a={employeeId:this.banRemark.employeeId,remark:this.banRemark.remark.trim(),status:this.banRemark.status};Object(s["g"])("/merchant/merchantEmployee/ban",a).then(function(a){200==a.code?(t.msgOk(e+"成功"),t.unbindDisplay=!1,t.search()):t.msgErr(a.msg)})}else this.msgErr(e+"原因不能为空")},delStaffFn:function(t){var e=this;this.$Modal.confirm({title:"删除确认",content:"<p>确认删除当前员工吗？</p>",onOk:function(){Object(n["F"])(t).then(function(t){200==t.code?(e.msgOk("删除成功"),e.search()):e.msgErr(t.msg)})},onCancel:function(){}})},changeCurrent:function(t){this.current=t,this.getStaffListFn(this.searchData)},wxQrcodeLook:function(t){this.wxQrcode_url=t,this.wxQrcodeDisplay=!0},changeNumber:function(){var t=""+this.formValidate.mobile;if(-1!=t.indexOf(".")){var e=t.split("");e.splice(e.length-1);var a=e.join("");this.formValidate.mobile=+a,this.msgErr("只能输入整数")}},changeNumber1:function(){var t=""+this.searchData.mobile;if(-1!=t.indexOf(".")){var e=t.split("");e.splice(e.length-1);var a=e.join("");this.searchData.mobile=+a,this.msgErr("只能输入整数")}},changeNumber2:function(){var t=""+this.bindData.mobile;if(-1!=t.indexOf(".")){var e=t.split("");e.splice(e.length-1);var a=e.join("");this.bindData.mobile=+a,this.msgErr("只能输入整数")}},ruleValidate:function(){if(""!=this.formValidate.realName)if(null!=this.formValidate.mobile){var t=/^[1][3,4,5,7,8][0-9]{9}$/;if(t.test(this.formValidate.mobile))if(""!=this.formValidate.wxAccount)if(""!=this.formValidate.wxQrcode)if(""!=this.formValidate.postDesc)if(""!=this.formValidate.profile){if(""!=this.formValidate.serviceContent)return!0;this.msgErr("员工服务内容不能为空")}else this.msgErr("员工一句话描述不能为空");else this.msgErr("员工岗位不能为空");else this.msgErr("员工微信号二维码没有上传");else this.msgErr("员工微信号不能为空");else this.msgErr("请输入常规手机号")}else this.msgErr("员工电话不能为空");else this.msgErr("员工名称不能为空")},msgOk:function(t){this.$Message.info({content:t,duration:3})},msgErr:function(t){this.$Message.error({content:t,duration:3})},dropDown:function(){this.drop?(this.dropDownContent="展开",this.dropDownIcon="ios-arrow-down"):(this.dropDownContent="收起",this.dropDownIcon="ios-arrow-up"),this.drop=!this.drop},back:function(){this.$emit("changeStatus",!1)}},mounted:function(){this.init()}},h=d,m=(a("5a9f"),a("6691")),u=Object(m["a"])(h,i,r,!1,null,"2e65a20e",null);e["default"]=u.exports},d880:function(t,e,a){}}]);