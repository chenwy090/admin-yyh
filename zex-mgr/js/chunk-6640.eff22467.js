(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6640"],{"6bb6":function(e,t,a){},ac0e:function(e,t,a){"use strict";a.r(t);var l,o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("h3",[e._v("奖励配置")]),a("div",[a("Table",{attrs:{border:"",width:"100%",columns:e.columns1,data:e.list1,loading:e.TableLoading1},scopedSlots:e._u([{key:"action",fn:function(t){var l=t.row;return[a("Button",{staticStyle:{"margin-right":"5px"},attrs:{type:"success",size:"small"},on:{click:function(t){e.openModal1(l)}}},[e._v("修改")])]}},{key:"value",fn:function(t){var l=t.row;return[l.type&&"3"==l.type?a("div",[a("img",{staticClass:"table-img",attrs:{src:l.value,alt:""}})]):a("div",["7"==l.code?a("div",[e._v("\n                        "+e._s(l.value)+"个\n                    ")]):"8"==l.code||"15"==l.code||"16"==l.code||"18"==l.code||"19"==l.code||"21"==l.code?a("div",[e._v("\n                        "+e._s(l.value)+"元\n                    ")]):"9"==l.code?a("div",[e._v("\n                        "+e._s(l.value)+"U贝=1元\n                    ")]):"10"==l.code?a("div",[e._v("\n                        "+e._s(l.value)+"次\n                    ")]):"11"==l.code||"12"==l.code||"13"==l.code||"14"==l.code?a("div",[a("p",[e._v("第一名"+e._s(l.value.split(",")[0])+"U贝")]),a("p",[e._v("第二名"+e._s(l.value.split(",")[1])+"U贝")]),a("p",[e._v("第三名"+e._s(l.value.split(",")[2])+"U贝")])]):"15"==l.code?a("div",[e._v("\n                        "+e._s(l.value)+"天\n                    ")]):"20"==l.code?a("div",[e._v("\n                        "+e._s(l.value)+"%\n                    ")]):a("div",[e._v("\n                        "+e._s(l.value)+"U贝\n                    ")])])]}}])})],1),a("h3",[e._v("奖励配置")]),a("div",[a("Table",{attrs:{border:"",width:"100%","show-header":!1,columns:e.columns2,data:e.list2,loading:e.TableLoading2},scopedSlots:e._u([{key:"action",fn:function(t){var l=t.row;return[a("Button",{staticStyle:{"margin-right":"5px"},attrs:{type:"success",size:"small"},on:{click:function(t){e.openModal2(l)}}},[e._v("修改")])]}},{key:"verifyQuantityMin",fn:function(t){var l=t.row;return[a("span",[e._v(e._s("核销好友数"+l.verifyQuantityMin+"名"))])]}}])})],1),a("h3",[e._v("说明配置")]),a("div",[a("Table",{attrs:{border:"",width:"100%","show-header":!1,columns:e.columns3,data:e.list3,loading:e.TableLoading3},scopedSlots:e._u([{key:"action",fn:function(t){var l=t.row;return[a("Button",{staticStyle:{"margin-right":"5px"},attrs:{type:"success",size:"small"},on:{click:function(t){e.openModal3(l)}}},[e._v("修改")])]}},{key:"context",fn:function(t){var l=t.row;return[a("div",{staticClass:"over-hidden",attrs:{title:l.context}},[e._v(e._s(l.context))])]}}])})],1),a("Modal",{attrs:{title:e.modal1.name,"mask-closable":!1,"footer-hide":""},model:{value:e.modal1.isopen,callback:function(t){e.$set(e.modal1,"isopen",t)},expression:"modal1.isopen"}},[e.modal1.type&&"3"==e.modal1.type?a("Row",[a("img",{staticStyle:{width:"500px","text-align":"center"},attrs:{src:e.modal1.value}}),a("Upload",{ref:"upload",staticStyle:{display:"inline-block",width:"90px"},attrs:{defaultList:e.defaultList,type:"drag",format:["jpg","jpeg","png","bmp"],"on-success":e.handleSuccess,action:e.url,accept:"image","max-size":1024,"on-exceeded-size":e.handleMaxSize,"on-format-error":e.formatError,headers:e.userToken,"show-upload-list":!1}},[a("div",{staticStyle:{width:"90px",height:"90px","line-height":"90px"}},[a("Icon",{attrs:{type:"ios-camera",size:"20"}})],1)])],1):a("Form",{ref:"modalErf1",attrs:{model:e.modal1,"label-position":"right",rules:e.ruleValidate1,"label-width":80}},[a("Row"),"7"==e.modal1.code?a("Row",[a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"数量"}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.modal1.value,callback:function(t){e.$set(e.modal1,"value",t)},expression:"modal1.value"}})],1)],1),a("Col",{attrs:{span:"4",offset:"1"}},[a("span",{staticClass:"ivu-form-item-label"},[e._v("个")])])],1):"8"==e.modal1.code||"15"==e.modal1.code||"16"==e.modal1.code||"18"==e.modal1.code||"19"==e.modal1.code||"21"==e.modal1.code?a("Row",[a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"金额"}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.modal1.value,callback:function(t){e.$set(e.modal1,"value",t)},expression:"modal1.value"}})],1)],1),a("Col",{attrs:{span:"4",offset:"1"}},[a("span",{staticClass:"ivu-form-item-label"},[e._v("元")])])],1):"9"==e.modal1.code?a("Row",[a("Col",{attrs:{span:"18"}},[a("FormItem",[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.modal1.value,callback:function(t){e.$set(e.modal1,"value",t)},expression:"modal1.value"}})],1)],1),a("Col",{attrs:{span:"4",offset:"1"}},[a("span",{staticClass:"ivu-form-item-label"},[e._v("U贝=1元")])])],1):"10"==e.modal1.code?a("Row",[a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"次数"}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.modal1.value,callback:function(t){e.$set(e.modal1,"value",t)},expression:"modal1.value"}})],1)],1),a("Col",{attrs:{span:"4",offset:"1"}},[a("span",{staticClass:"ivu-form-item-label"},[e._v("次")])])],1):"11"==e.modal1.code||"12"==e.modal1.code||"13"==e.modal1.code||"14"==e.modal1.code?a("Row",[a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"第一名"}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.modal1.value1,callback:function(t){e.$set(e.modal1,"value1",t)},expression:"modal1.value1"}})],1)],1),a("Col",{attrs:{span:"4",offset:"1"}},[a("span",{staticClass:"ivu-form-item-label"},[e._v("U贝")])]),a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"第二名"}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.modal1.value2,callback:function(t){e.$set(e.modal1,"value2",t)},expression:"modal1.value2"}})],1)],1),a("Col",{attrs:{span:"4",offset:"1"}},[a("span",{staticClass:"ivu-form-item-label"},[e._v("U贝")])]),a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"第三名"}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.modal1.value3,callback:function(t){e.$set(e.modal1,"value3",t)},expression:"modal1.value3"}})],1)],1),a("Col",{attrs:{span:"4",offset:"1"}},[a("span",{staticClass:"ivu-form-item-label"},[e._v("U贝")])])],1):"15"==e.modal1.code?a("Row",[a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"有效期"}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.modal1.value,callback:function(t){e.$set(e.modal1,"value",t)},expression:"modal1.value"}})],1)],1),a("Col",{attrs:{span:"4",offset:"1"}},[a("span",{staticClass:"ivu-form-item-label"},[e._v("天")])])],1):"20"==e.modal1.code?a("Row",[a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"提现个税"}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,max:100,step:.1,type:"text",placeholder:"请输入"},model:{value:e.modal1.value,callback:function(t){e.$set(e.modal1,"value",t)},expression:"modal1.value"}})],1)],1),a("Col",{attrs:{span:"4",offset:"1"}},[a("span",{staticClass:"ivu-form-item-label"},[e._v("%")])])],1):a("Row",[a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"U贝"}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.modal1.value,callback:function(t){e.$set(e.modal1,"value",t)},expression:"modal1.value"}})],1)],1),a("Col",{attrs:{span:"4",offset:"1"}},[a("span",{staticClass:"ivu-form-item-label"},[e._v("个")])])],1)],1),a("row",[a("Button",{staticStyle:{float:"right","margin-left":"20px"},attrs:{type:"primary"},on:{click:function(t){e.ok1("modalErf1")}}},[e._v("确认")]),a("Button",{staticStyle:{"margin-left":"8px",float:"right"},on:{click:function(t){e.modal1.isopen=!1}}},[e._v("关闭")])],1)],1),a("Modal",{attrs:{title:e.modal2.levelName,"mask-closable":!1,"footer-hide":""},model:{value:e.modal2.isopen,callback:function(t){e.$set(e.modal2,"isopen",t)},expression:"modal2.isopen"}},[a("Form",{ref:"modalErf2",attrs:{model:e.modal2,"label-position":"right",rules:e.ruleValidate2,"label-width":120}},[a("Row",[a("Col",{attrs:{span:"18"}},[a("FormItem",{attrs:{label:"核销好友数"}},[a("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.modal2.verifyQuantityMin,callback:function(t){e.$set(e.modal2,"verifyQuantityMin",t)},expression:"modal2.verifyQuantityMin"}})],1)],1)],1),a("FormItem",[a("Button",{staticStyle:{float:"right","margin-left":"20px"},attrs:{type:"primary"},on:{click:function(t){e.ok2("modalErf2")}}},[e._v("确认")]),a("Button",{staticStyle:{"margin-left":"8px",float:"right"},on:{click:function(t){e.modal2.isopen=!1}}},[e._v("关闭")])],1)],1)],1),a("Modal",{attrs:{title:e.modal3.name,"mask-closable":!1,"footer-hide":""},model:{value:e.modal3.isopen,callback:function(t){e.$set(e.modal3,"isopen",t)},expression:"modal3.isopen"}},[a("Form",{ref:"modalErf3",attrs:{model:e.modal3,"label-position":"right",rules:e.ruleValidate3}},[a("Row",[a("Form-item",{attrs:{prop:"context"}},[a("i-input",{attrs:{type:"textarea",autosize:{minRows:2,maxRows:5},placeholder:"请输入..."},model:{value:e.modal3.context,callback:function(t){e.$set(e.modal3,"context",t)},expression:"modal3.context"}})],1)],1),a("FormItem",[a("Button",{staticStyle:{float:"right","margin-left":"20px"},attrs:{type:"primary"},on:{click:function(t){e.ok3("modalErf3")}}},[e._v("确认")]),a("Button",{staticStyle:{"margin-left":"8px",float:"right"},on:{click:function(t){e.modal3.isopen=!1}}},[e._v("关闭")])],1)],1)],1)],1)},i=[],s=a("a322"),n=a("7f80"),r=a("365c"),d={name:"reward_deploy",data:function(){return{userToken:{},url:r["g"],ruleValidate1:{value:[{required:!0,message:"请输入数量",trigger:"blur"}],value1:[{required:!0,message:"请输入数量",trigger:"blur"}],value2:[{required:!0,message:"请输入数量",trigger:"blur"}],value3:[{required:!0,message:"请输入数量",trigger:"blur"}]},ruleValidate2:{verifyQuantityMin:[{required:!0,message:"请输入数量",trigger:"blur"}]},ruleValidate3:{context:[{required:!0,message:"请输入",trigger:"blur"}]},loading:!0,defaultList:[],TableLoading1:!1,TableLoading2:!1,TableLoading3:!1,visible:!1,imgName:"",modal1:{name:"",id:"",code:"",type:"",isopen:!1,value:0,value1:0,value2:0,value3:0},modal2:{levelName:"",isopen:!1,level:"",verifyQuantityMin:0},modal3:{name:"",isopen:!1,context:""},columns1:[{title:"操作",align:"center",width:100,fixed:"left",slot:"action"},{title:"序号",type:"index",align:"center",minWidth:100},{title:"配置项",align:"center",minWidth:160,key:"name"},{title:"配置值",align:"center",minWidth:160,slot:"value"},{title:"修改人",align:"center",minWidth:160,key:"updateBy"},{title:"修改时间",align:"center",minWidth:160,key:"updateTime"}],columns2:[{title:"操作",align:"center",width:100,fixed:"left",slot:"action"},{title:"序号",type:"index",align:"center",minWidth:100},{title:"配置项",align:"center",minWidth:160,key:"levelName"},{title:"配置值",align:"center",minWidth:160,slot:"verifyQuantityMin"},{title:"修改人",align:"center",minWidth:160,key:"createBy"},{title:"修改时间",align:"center",minWidth:160,key:"gmtCreate"}],columns3:[{title:"操作",align:"center",width:100,fixed:"left",slot:"action"},{title:"序号",type:"index",align:"center",minWidth:100},{title:"配置项",align:"center",minWidth:160,key:"name"},{title:"配置值",align:"center",minWidth:160,slot:"context"},{title:"修改人",align:"center",minWidth:160,key:"updateBy"},{title:"修改时间",align:"center",minWidth:160,key:"updateTime"}],list1:[],list2:[],list3:[],list4:[]}},methods:(l={handleView:function(e){this.imgName=e,this.visible=!0},handleSuccess:function(e,t){this.model1.value=t.url,t.url="https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar",t.name="7eb99afb9d5f317c912f08b5212fd69a"}},Object(s["a"])(l,"handleSuccess",function(e,t){200==e.code?(this.modal1.value=e.image_url,this.msgOk("上传图片成功")):this.msgErr("上传图片失败，请重新上传")}),Object(s["a"])(l,"formatError",function(){this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传")}),Object(s["a"])(l,"handleMaxSize",function(e){this.$Notice.warning({title:"超出文件大小限制",desc:"文件 "+e.name+" 太大，不能超过 2M。"})}),Object(s["a"])(l,"handleBeforeUpload",function(){}),Object(s["a"])(l,"openModal1",function(e){this.defaultList=[],this.modal1.name=e.name,this.modal1.code=e.code,this.modal1.id=e.id,this.modal1.type=e.type,this.modal1.isopen=!0,"3"!=e.type?(this.modal1.value=Number(e.value)||0,"11"!=e.code&&"12"!=e.code&&"13"!=e.code&&"14"!=e.code||(this.modal1.value1=Number(e.value.split(",")[0])||0,this.modal1.value2=Number(e.value.split(",")[1])||0,this.modal1.value3=Number(e.value.split(",")[2])||0,this.modal1.value=0)):this.modal1.value=e.value}),Object(s["a"])(l,"openModal2",function(e){this.modal2.levelName=e.levelName,this.modal2.isopen=!0,this.modal2.level=e.level,this.modal2.verifyQuantityMin=Number(e.verifyQuantityMin)||0}),Object(s["a"])(l,"openModal3",function(e){this.modal3.name=e.name,this.modal3.code=e.code,this.modal3.isopen=!0,this.modal3.context=e.context}),Object(s["a"])(l,"ok1",function(e){this.modal1.type&&"3"==this.modal1.type?this.modal1.value&&(this.modal1.value?this.saveChange1():this.$Message.error("请上传图片")):this.modal1.value?this.saveChange1():this.$Message.error("请检查表单")}),Object(s["a"])(l,"cancel",function(){}),Object(s["a"])(l,"ok2",function(e){this.modal2.verifyQuantityMin||0===this.modal2.verifyQuantityMin?this.saveChange2():this.$Message.error("请检查表单")}),Object(s["a"])(l,"ok3",function(e){this.modal3.context?this.saveChange3():this.$Message.error("请检查表单")}),Object(s["a"])(l,"getData1",function(){var e=this;this.TableLoading1=!0,Object(n["c"])("/commonConfig/queryAllConfig").then(function(t){200==t.code?(e.TableLoading1=!1,t.data&&(e.list1=t.data.noOverallCommonConfigList||[])):(e.$Message.error(t.msg),e.TableLoading1=!1)})}),Object(s["a"])(l,"getData2",function(){var e=this;this.TableLoading2=!0,Object(n["f"])("/mini/userLevelRule/list",{}).then(function(t){200==t.code?(e.list2=t.data||[],e.TableLoading2=!1):(e.$Message.error(t.msg),e.TableLoading2=!1)})}),Object(s["a"])(l,"getData3",function(){var e=this;this.TableLoading3=!0,Object(n["c"])("/rewardNotice/queryNoticeAll").then(function(t){200==t.code?(e.list3=t.data||[],e.TableLoading3=!1):(e.$Message.error(t.msg),e.TableLoading3=!1)})}),Object(s["a"])(l,"saveChange1",function(){var e=this,t=this;"11"!=this.modal1.code&&"12"!=this.modal1.code&&"13"!=this.modal1.code&&"14"!=this.modal1.code||(this.modal1.value=this.modal1.value1+","+this.modal1.value2+","+this.modal1.value3),Object(n["f"])("/commonConfig/updateConfigById",{overallCommonConfig:{id:this.modal1.id,code:this.modal1.code,value:this.modal1.value}}).then(function(a){200==a.code?(e.getData1(),setTimeout(function(){t.modal1.isopen=!1},500)):e.$Message.error(a.msg)})}),Object(s["a"])(l,"saveChange2",function(){var e=this,t=this;Object(n["f"])("/mini/userLevelRule/add",{verifyQuantityMin:this.modal2.verifyQuantityMin,level:this.modal2.level}).then(function(a){200==a.code?(e.getData2(),setTimeout(function(){t.modal2.isopen=!1},500)):e.$Message.error(a.msg)})}),Object(s["a"])(l,"saveChange3",function(){var e=this,t=this;Object(n["f"])("/rewardNotice/updateNotice",{code:this.modal3.code,context:this.modal3.context}).then(function(a){200==a.code?(e.getData3(),setTimeout(function(){t.modal3.isopen=!1},500)):e.$Message.error(a.msg)})}),Object(s["a"])(l,"msgOk",function(e){this.$Message.info({content:e,duration:3})}),Object(s["a"])(l,"msgErr",function(e){this.$Message.error({content:e,duration:3})}),l),created:function(){this.getData1(),this.getData2(),this.getData3(),this.userToken={jwttoken:localStorage.getItem("jwttoken")}}},c=d,m=(a("e228"),a("2877")),u=Object(m["a"])(c,o,i,!1,null,"549ae34e",null);u.options.__file="reward_deploy.vue";t["default"]=u.exports},e228:function(e,t,a){"use strict";var l=a("6bb6"),o=a.n(l);o.a}}]);