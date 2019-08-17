(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1b84"],{"18ae":function(t,e,a){},"6fee":function(t,e,a){"use strict";var o=a("18ae"),n=a.n(o);n.a},"95f7":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"search"},[t.couponEditPage?t._e():a("Row",[a("div",{},[a("Card",[a("Row",[a("Form",{ref:"searchItem",staticClass:"search-form",attrs:{model:t.searchItem,inline:"","label-width":70}},[a("FormItem",{attrs:{label:"标题"}},[a("Input",{staticStyle:{width:"200px"},attrs:{type:"text",clearable:"",placeholder:"请输入标题"},model:{value:t.searchItem.title,callback:function(e){t.$set(t.searchItem,"title",e)},expression:"searchItem.title"}})],1),t.drop?a("span",[a("FormItem",{attrs:{label:"适用商户"}},[a("Input",{staticStyle:{width:"200px"},attrs:{type:"text",clearable:"",placeholder:"请输入商户"},model:{value:t.searchItem.merchantNames,callback:function(e){t.$set(t.searchItem,"merchantNames",e)},expression:"searchItem.merchantNames"}})],1),a("FormItem",{attrs:{label:"优惠类型"}},[a("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择",clearable:""},model:{value:t.searchItem.couponType,callback:function(e){t.$set(t.searchItem,"couponType",e)},expression:"searchItem.couponType"}},[a("Option",{attrs:{value:""}},[t._v("所有")]),a("Option",{attrs:{value:"1"}},[t._v("立减券")]),a("Option",{attrs:{value:"2"}},[t._v("折扣券")]),a("Option",{attrs:{value:"3"}},[t._v("满减券")]),a("Option",{attrs:{value:"4"}},[t._v("体验券")]),a("Option",{attrs:{value:"5"}},[t._v("换购券")]),a("Option",{attrs:{value:"6"}},[t._v("赠品券")])],1)],1),a("FormItem",{attrs:{label:"卡券状态"}},[a("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择",clearable:""},model:{value:t.searchItem.templateStatus,callback:function(e){t.$set(t.searchItem,"templateStatus",e)},expression:"searchItem.templateStatus"}},[a("Option",{attrs:{value:""}},[t._v("所有")]),a("Option",{attrs:{value:"待发布"}},[t._v("待发布")]),a("Option",{attrs:{value:"进行中"}},[t._v("进行中")]),a("Option",{attrs:{value:"已结束"}},[t._v("已结束")])],1)],1),a("FormItem",{attrs:{label:"发布开始时间"}},[a("DatePicker",{staticStyle:{width:"200px"},attrs:{type:"datetime",placeholder:"选择日期"},model:{value:t.searchItem.startDate,callback:function(e){t.$set(t.searchItem,"startDate",e)},expression:"searchItem.startDate"}})],1),a("FormItem",{attrs:{label:"发布结束时间"}},[a("DatePicker",{staticStyle:{width:"200px"},attrs:{type:"datetime",placeholder:"选择日期"},model:{value:t.searchItem.endDate,callback:function(e){t.$set(t.searchItem,"endDate",e)},expression:"searchItem.endDate"}})],1)],1):t._e(),a("FormItem",{staticClass:"br",staticStyle:{"margin-left":"-35px"}},[a("Button",{attrs:{type:"primary",icon:"ios-search"},on:{click:t.queryTableList}},[t._v("搜索")]),a("Button",{on:{click:t.refresh}},[t._v("重置")]),a("a",{staticClass:"drop-down",on:{click:t.dropDown}},[t._v("\n                  "+t._s(t.dropDownContent)+"\n                  "),a("Icon",{attrs:{type:t.dropDownIcon}})],1)],1)],1)],1)],1),a("Card",[a("Row",{staticClass:"operation"},[a("Button",{attrs:{type:"dashed",icon:"md-arrow-round-back"},on:{click:function(e){t.goback()}}},[t._v("返回")]),a("Button",{attrs:{type:"primary",icon:"md-add"},on:{click:function(e){t.addInfo()}}},[t._v("新增")]),a("Button",{attrs:{icon:"md-refresh"},on:{click:t.updateTableList}},[t._v("刷新")])],1),a("Row",[a("Table",{ref:"table",attrs:{loading:t.TableLoading,border:"",columns:t.tableColumns,data:t.table_list,sortable:"custom"},scopedSlots:t._u([{key:"couponBigImg",fn:function(e){var o=e.row;return[a("Tooltip",{attrs:{content:"点击可查看大图 ",placement:"right"}},[a("img",{staticStyle:{width:"74px",height:"43px"},attrs:{src:o.couponBigImg},on:{click:function(e){t.showBigImg(o)}}})])]}},{key:"ticketMoney",fn:function(e){var o=e.row;return[1==o.couponType?a("span",[t._v(t._s(o.ticketMoney/100)+" 元")]):t._e(),2==o.couponType?a("span",[t._v(t._s(o.ticketDiscount/10)+" 折")]):t._e()]}},{key:"ChangeStart",fn:function(e){var o=e.row;return[1==o.useDateType?a("span",[t._v(" "+t._s(o.useStartDate))]):t._e(),2==o.useDateType?a("span",[t._v(" 加"+t._s(o.addDaysUseStart)+"天开始生效")]):t._e()]}},{key:"ChangeEnd",fn:function(e){var o=e.row;return[1==o.useDateType?a("span",[t._v(" "+t._s(o.useEndDate))]):t._e(),2==o.useDateType?a("span",[t._v(" 加"+t._s(o.addDaysUseEnd)+"天结束用券")]):t._e()]}},{key:"price",fn:function(e){var o=e.row;return[2==o.couponKind?a("span",[t._v(t._s(o.price/100)+" 元 ")]):a("span",[t._v("免费")])]}},{key:"operate",fn:function(e){var o=e.row;return["待发布"==o.templateStatus?a("Button",{staticStyle:{color:"#2db7f5"},attrs:{type:"text",size:"small"},on:{click:function(e){t.editInfo(o)}}},[t._v("编辑")]):t._e(),"进行中"==o.templateStatus?a("Button",{staticStyle:{color:"red"},attrs:{type:"text",size:"small"},on:{click:function(e){t.inputUpdateAccountStatus(o)}}},[t._v("下架")]):t._e(),a("Button",{staticStyle:{color:"red"},attrs:{type:"text",size:"small"},on:{click:function(e){t.share(o)}}},[t._v("分享奖励")])]}}])})],1),a("Row",{staticClass:"page",attrs:{type:"flex",justify:"end"}},[a("Page",{staticStyle:{float:"right"},attrs:{total:t.totalSize,"show-total":"","show-elevator":"",current:t.current},on:{"on-change":t.changeCurrent,"update:current":function(e){t.current=e}}})],1)],1)],1)]),t.couponEditPage?a("div",[a("couponEdit",{attrs:{couponEdit_info:t.couponEdit_info},on:{changeStatus:t.showbasicSetStatus}})],1):t._e(),a("Modal",{attrs:{title:"查看大图",width:"600"},on:{"on-cancel":t.bigImgCancel},model:{value:t.bigImgDialog,callback:function(e){t.bigImgDialog=e},expression:"bigImgDialog"}},[a("img",{staticStyle:{width:"100%"},attrs:{src:t.big_Image_url}})]),a("Modal",{attrs:{title:"上架/下架","mask-closable":!1,"footer-hide":""},model:{value:t.updateTemplateStatusDisplay,callback:function(e){t.updateTemplateStatusDisplay=e},expression:"updateTemplateStatusDisplay"}},[a("Form",{ref:"formCustom",staticStyle:{"margin-top":"20px"},attrs:{model:t.formCustom,"label-width":80}},[a("span",[t._v("提示：已售卖或领用的卡券仍可有效使用。")]),a("FormItem",{attrs:{label:"填写原因",required:""}},[a("Input",{staticStyle:{width:"300px"},attrs:{type:"textarea",rows:2,placeholder:"提示:200字符",maxlength:200},model:{value:t.formCustom.remark,callback:function(e){t.$set(t.formCustom,"remark",e)},expression:"formCustom.remark"}})],1),a("FormItem",[a("Button",{attrs:{type:"primary"},on:{click:t.updateTemplateStatusFn}},[t._v("确认")]),a("Button",{staticStyle:{"margin-left":"8px"},on:{click:function(e){t.updateTemplateStatusDisplay=!1}}},[t._v("取消")])],1)],1)],1),a("Modal",{attrs:{title:"追加","mask-closable":!1,"footer-hide":""},model:{value:t.appendStockCountDisplay,callback:function(e){t.appendStockCountDisplay=e},expression:"appendStockCountDisplay"}},[a("Form",{ref:"formCustom",staticStyle:{"margin-top":"20px"},attrs:{model:t.formCustom,"label-width":80}},[a("FormItem",{attrs:{label:"已发布"}},[a("Input",{staticStyle:{width:"200px"},attrs:{type:"text",clearable:"",placeholder:"请输入..."},model:{value:t.formCustom.stockCount,callback:function(e){t.$set(t.formCustom,"stockCount",e)},expression:"formCustom.stockCount"}}),a("span",[t._v("张")])],1),a("FormItem",{attrs:{label:"剩余库存"}},[a("Input",{staticStyle:{width:"200px"},attrs:{type:"text",clearable:"",placeholder:"请输入..."},model:{value:t.formCustom.surplusCount,callback:function(e){t.$set(t.formCustom,"surplusCount",e)},expression:"formCustom.surplusCount"}}),a("span",[t._v("张")])],1),a("FormItem",{attrs:{label:"追加",required:""}},[a("Input",{staticStyle:{width:"300px"},attrs:{type:"textarea",rows:2},model:{value:t.formCustom.appendCount,callback:function(e){t.$set(t.formCustom,"appendCount",e)},expression:"formCustom.appendCount"}}),a("span",[t._v("张")])],1),a("FormItem",[a("Button",{attrs:{type:"primary"},on:{click:t.updateTemplateAppendCountFn}},[t._v("确认")]),a("Button",{staticStyle:{"margin-left":"8px"},on:{click:function(e){t.appendStockCountDisplay=!1}}},[t._v("关闭")])],1)],1)],1),a("Modal",{attrs:{title:"分享奖励","mask-closable":!1,"footer-hide":""},model:{value:t.shareDisplay,callback:function(e){t.shareDisplay=e},expression:"shareDisplay"}},[a("Form",{ref:"shareModal",staticStyle:{"margin-top":"20px"},attrs:{model:t.formShareModal,"label-width":100}},[t._l(t.formShareModal.shareData,function(e){return a("FormItem",{key:e.id,attrs:{label:e.name,required:""}},[a("InputNumber",{staticStyle:{width:"320px"},attrs:{min:"倍数"==e.name?1:0,step:1,type:"text",placeholder:"请输入"},model:{value:e.value,callback:function(a){t.$set(e,"value",a)},expression:"item.value"}}),"倍数"!=e.name?a("span",[t._v("  U贝")]):t._e(),"倍数"==e.name?a("span",[t._v("  倍")]):t._e()],1)}),a("FormItem",[a("Button",{staticStyle:{"margin-left":"20px",float:"right"},on:{click:function(e){t.shareDisplay=!1}}},[t._v("关闭")]),a("Button",{staticStyle:{float:"right"},attrs:{type:"primary"},on:{click:function(e){t.shareSave("shareModal")}}},[t._v("确认")])],1)],2)],1)],1)},n=[],s=a("7f80"),i=(a("62a2"),a("704b")),r={name:"merchant-information",components:{couponEdit:i["default"]},props:{merchantId:String},data:function(){return{formShareModal:{shareData:[]},couponEditPage:!1,updateTemplateStatusDisplay:!1,appendStockCountDisplay:!1,shareDisplay:!1,drop:!1,dropDownContent:"展开",dropDownIcon:"ios-arrow-down",searchItem:{title:"",merchantNames:"",couponType:"",templateStatus:"",startDate:"",endDate:""},formCustom:{type:"",id:"",templateId:"",status:"",operation:"",appendCount:0,stockCount:0,getLimit:0,surplusCount:0,remark:""},couponEdit_info:{},current:1,totalSize:0,pageNum:1,limit:10,TableLoading:!1,table_list:[],self:this,bigImgDialog:!1,big_Image_url:"",tableColumns:[{title:"卡券ID",key:"templateId",align:"center",width:150},{title:"卡券标题",key:"title",align:"center",width:150},{title:"适用商户",key:"merchantNames",align:"center",width:150},{title:"来源",key:"source",align:"center",width:150},{title:"优惠券类型",key:"couponType",align:"center",width:200,render:function(t,e){var a=e.row,o="blue",n="1"==a.couponType?"立减券":"2"==a.couponType?"折扣券":"3"==a.couponType?"满减券":"4"==a.couponType?"体验券":"5"==a.couponType?"换购券":"6"==a.couponType?"赠品券":"未知类型";return t("Tag",{props:{color:o}},n)}},{title:"发放总量",key:"stockCount",align:"center",width:150},{title:"剩余库存",key:"surplusCount",align:"center",width:150},{title:"创建人",key:"createBy",align:"center",width:150},{title:"创建时间",key:"createTime",align:"center",width:150},{title:"操作人",key:"updateBy",align:"center",width:150},{title:"操作时间",key:"updateTime",align:"center",width:150},{title:"状态",key:"templateStatus",align:"center",width:150},{title:"操作",key:"action",fixed:"left",align:"center",slot:"operate",width:280}]}},created:function(){},methods:{init:function(){this.updateTableList()},dropDown:function(){this.drop?(this.dropDownContent="展开",this.dropDownIcon="ios-arrow-down"):(this.dropDownContent="收起",this.dropDownIcon="ios-arrow-up"),this.drop=!this.drop},refresh:function(){this.searchItem.title="",this.searchItem.merchantNames="",this.searchItem.couponType="",this.searchItem.templateStatus="",this.searchItem.startDate="",this.searchItem.endDate="",this.queryTableList()},queryTableList:function(){this.pageNum=1,this.totalSize=0,this.updateTableList()},changeCurrent:function(t){this.pageNum=t,this.updateTableList()},updateTableList:function(){var t=this;this.TableLoading=!0;var e={title:this.searchItem.title,merchantNames:this.searchItem.merchantNames,couponType:this.searchItem.couponType,templateStatus:this.searchItem.templateStatus,startDate:this.searchItem.startDate,endDate:this.searchItem.endDate};Object(s["f"])("/merchantCouponTemplate/backList?pageNum="+this.pageNum+"&pageSize="+this.limit,e).then(function(e){t.TableLoading=!1,t.totalSize=e.data.total,t.table_list=e.data.records})},inputAppendStockCountStatus:function(t){this.formCustom.templateId=t.templateId,this.formCustom.type="优惠券管理",this.formCustom.stockCount=t.stockCount,this.formCustom.surplusCount=t.surplusCount,this.appendStockCountDisplay=!0},share:function(t){var e=this;this.formShareModal.shareData=[],Object(s["f"])("/commonConfig/queryConfigByCode",{code:t.templateId}).then(function(t){200==t.code?t.data||t.data.noOverallCommonConfigList?(e.formShareModal.shareData=t.data.noOverallCommonConfigList||[],e.formShareModal.shareData.forEach(function(t){t.value=Number(t.value)||0}),e.shareDisplay=!0):e.msgErr("未查询到数据"):e.msgErr(t.msg)})},shareSave:function(t){var e=this,a=!0;this.formShareModal.shareData.forEach(function(t){t.createTime=null,t.updateTime=null,t.updateBy=null,t.value||0===t.value||(a=!1,"请输入完整表单"),"倍数"==t.name&&t.value<1&&(a=!1,"请输入大于等于1的倍数")}),a?Object(s["f"])("/commonConfig/updateConfigBatch",{noOverallCommonConfigList:this.formShareModal.shareData}).then(function(t){200==t.code?e.shareDisplay=!1:e.msgErr(t.msg)}):this.msgErr("请输入完整表单")},updateTemplateAppendCountFn:function(){var t=this,e={templateId:this.formCustom.templateId,appendCount:this.formCustom.appendCount,type:this.formCustom.type};Object(s["f"])("/merchantCouponTemplate/appendStockCount?templateId="+this.formCustom.templateId,e).then(function(e){200==e.code?(t.msgOk("追加成功"),t.appendStockCountDisplay=!1,t.formCustom.templateId="",t.formCustom.type="",t.formCustom.appendCount=0,t.updateTableList()):t.msgErr(e.msg)})},inputUpdateAccountStatus:function(t){this.formCustom.templateId=t.templateId,this.formCustom.type="优惠券管理",this.formCustom.status="-1",this.updateTemplateStatusDisplay=!0},updateTemplateStatusFn:function(t){var e=this,a={templateId:this.formCustom.templateId,status:this.formCustom.status,remark:this.formCustom.remark,type:this.formCustom.type};Object(s["f"])("/merchantCouponTemplate/updStatus/?templateId="+this.formCustom.templateId+"&status=-1",a).then(function(t){200==t.code?(e.msgOk("更新成功"),e.updateTemplateStatusDisplay=!1,e.formCustom.templateId="",e.formCustom.type="",e.formCustom.status="",e.formCustom.remark="",e.updateTableList()):e.msgErr(t.msg)})},addInfo:function(){this.setStore("camp_pageStatus","add"),this.couponEdit_info.merchantId=this.merchantId,this.couponEditPage=!0},editInfo:function(t){this.setStore("camp_pageStatus","edit"),this.couponEdit_info=t,this.couponEditPage=!0},showbasicSetStatus:function(t){this.couponEditPage=t,this.updateTableList()},showBigImg:function(t){this.bigImgDialog=!0,this.big_Image_url=t.couponBigImg},bigImgCancel:function(){this.bigImgDialog=!1},changeStatus:function(t){var e=this,a="-1";console.log(this.pageNum),this.$Modal.confirm({title:"下架操作",content:"提示：已售卖或领用的卡券仍可有效使用。",onOk:function(){var o={templateId:t.templateId,status:a};Object(s["f"])("/merchantCouponTemplate/updStatus/?templateId="+t.templateId+"&status="+a,o).then(function(t){e.loading=!1,"200"==t.code?(e.$Message.info("更改状态成功！"),setTimeout(function(){e.updateTableList()},1200)):e.$Message.error(t.msg)})},onCancel:function(){e.$Message.info("点击了取消")}})},goback:function(){this.$emit("changeStatus",!1)},msgOk:function(t){this.$Message.info({content:t,duration:3})},msgErr:function(t){this.$Message.error({content:t,duration:3})},removeInfo:function(t){var e=this;this.$Modal.confirm({title:"删除确认",content:"删除后不可恢复，是否继续删除？",onOk:function(){e.$Loading.start(),Object(s["c"])("/merchantCouponTemplate/edit/"+t.templateId).then(function(t){e.loading=!1,"200"==t.code?(e.$Message.info("删除成功！"),setTimeout(function(){e.pageNum=1,e.updateTableList()},1200)):e.$Message.error(t.msg)})},onCancel:function(){e.$Message.info("点击了取消")}})}},mounted:function(){this.init()}},l=r,c=(a("6fee"),a("2877")),u=Object(c["a"])(l,o,n,!1,null,"645b614e",null);u.options.__file="merchantCoupon.vue";e["default"]=u.exports}}]);