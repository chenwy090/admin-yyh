(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0f0f57"],{"9f1e":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("Form",{ref:"searchForm",attrs:{"label-width":80,model:t.searchForm,inline:""}},[a("FormItem",{attrs:{label:"券名称"}},[a("Input",{attrs:{placeholder:"券名称"},model:{value:t.searchForm.name,callback:function(e){t.$set(t.searchForm,"name",e)},expression:"searchForm.name"}})],1),a("FormItem",[a("ButtonGroup",[a("Button",{staticClass:"submit",attrs:{type:"primary",icon:"ios-search"},on:{click:function(e){return t.search("searchForm")}}},[t._v("搜索")])],1)],1)],1),a("Table",{ref:"table",attrs:{border:"",columns:t.tableColumns,data:t.listData,sortable:"custom","highlight-row":!0},on:{"on-current-change":t.selectedTr}}),a("Row",{staticClass:"page",attrs:{type:"flex",justify:"end"}},[a("Page",{staticStyle:{float:"right"},attrs:{total:t.totalSize,"show-total":"","show-elevator":"",current:t.pageNum},on:{"on-change":t.changeCurrent,"update:current":function(e){t.pageNum=e}}})],1)],1)},r=[],s=a("7f80"),o={data:function(){return{TableLoading:!1,totalSize:0,pageNum:1,pageSize:10,listData:[],searchForm:{name:null,status:"1"},tableColumns:[{title:"券名称",key:"name"},{title:"活动开始时间",key:"startDate"},{title:"活动结束时间",key:"endDate"},{title:"兑换开始时间",key:"ChangeStartDate"},{title:"兑换结束时间",key:"ChangeEndDate"}]}},methods:{search:function(){this.TableLoading=!0,this.pageNum=1,this.loadData()},loadData:function(){var t=this;Object(s["g"])("/campagin/list?pageNum="+this.pageNum+"&pageSize="+this.pageSize,this.searchForm).then(function(e){t.TableLoading=!1,200==e.code?(t.totalSize=e.data.total,t.listData=e.data.records):t.msgErr(e.msg)})},selectedTr:function(t,e){this.$emit("seclectedTr-event",t.campId,t.name)},changeCurrent:function(t){this.searchForm.pageNum!=t&&(this.searchForm.pageNum=t,this.loadData())},init:function(){this.search()}},mounted:function(){this.init()}},i=o,l=a("6691"),c=Object(l["a"])(i,n,r,!1,null,null,null);e["default"]=c.exports}}]);