(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d21e6eb"],{d614:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"message-con",on:{click:e.showMessage}},[s("Tooltip",{attrs:{content:e.value>0?"有"+e.value+"条未读消息":"无未读消息",placement:"bottom"}},[s("Badge",{attrs:{count:e.value,dot:""}},[s("Icon",{attrs:{type:"md-notifications",size:22}})],1)],1)],1)},n=[],o=s("c276"),c={name:"messageTip",props:{value:{type:Number,default:0}},methods:{showMessage:function(){o["a"].openNewPage(this,"message_index"),this.$router.push({name:"message_index"})}}},i=c,u=s("6691"),l=Object(u["a"])(i,a,n,!1,null,null,null);t["default"]=l.exports}}]);