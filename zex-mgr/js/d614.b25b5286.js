(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["d614"],{d614:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"message-con",on:{click:e.showMessage}},[s("Tooltip",{attrs:{content:e.value>0?"有"+e.value+"条未读消息":"无未读消息",placement:"bottom"}},[s("Badge",{attrs:{count:e.value,dot:""}},[s("Icon",{attrs:{type:"md-notifications",size:22}})],1)],1)],1)},n=[],o=s("c276"),i={name:"messageTip",props:{value:{type:Number,default:0}},methods:{showMessage:function(){o["a"].openNewPage(this,"message_index"),this.$router.push({name:"message_index"})}}},u=i,c=s("2877"),l=Object(c["a"])(u,a,n,!1,null,null,null);l.options.__file="message-tip.vue";t["default"]=l.exports}}]);