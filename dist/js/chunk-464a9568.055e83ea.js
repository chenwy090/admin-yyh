(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-464a9568"],{6571:function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"yyh-modal"},[s("Modal",{staticClass:"yyh-modal",attrs:{title:"详情"+(t.dataList.groupType>0?" - "+t.types[t.dataList.groupType-1]:""),width:"800",styles:{top:"20px"}},model:{value:t.modalShow,callback:function(a){t.modalShow=a},expression:"modalShow"}},[-1!==t.dataList.groupType?s("div",[t._l(t.descConfig[Number(t.dataList.groupType-1)],function(a,e){return s("div",{key:"modal_detail"+e,staticClass:"yyh-modal-item"},[s("span",{staticClass:"title",staticStyle:{width:"8em"}},[t._v(t._s(a[1])+":")]),"投放门店"===a[1]?["0"===String(t.dataList.storeType)?s("span",[t._v("全国")]):[t._l(t.dataList[a[0]],function(a,e){return[s("span",{key:"L9a"+e,staticStyle:{flex:"1"}},[t._v(t._s(t.handleAddress(a)))]),s("br",{key:"L9b"+e})]})]]:"活动大奖"===a[1]||"阳光普照奖"===a[1]?s("span",{staticClass:"modal-content",staticStyle:{flex:"1"}},[s("div",{staticStyle:{display:"flex"}},["1"==t.dataList[a[0]].type&&t.dataList[a[0]].giftImg?s("img",{staticClass:"mgr-1 banner-img",attrs:{src:t.dataList[a[0]].giftImg,alt:"奖品图"}}):t._e(),s("span",{staticClass:"mgr-1 flex-1"},[t._v("奖品名称：\n              "),s("span",{directives:[{name:"show",rawName:"v-show",value:"3"==t.dataList[a[0]].type,expression:"dataList[el[0]].type == '3'"}]},[t._v(t._s(t.dataList[a[0]].prizeNum))]),t._v(t._s("3"==t.dataList[a[0]].type?t.dataList[a[0]].prizeName+"U贝":t.dataList[a[0]].prizeName)+"\n            ")])])]):"活动开奖时间"===a[1]?s("span",{staticClass:"modal-content",staticStyle:{flex:"1"}},[t._v(t._s(t.dataList[a[0]]?t.dataList[a[0]]:"")+"    "+t._s(2==t.dataList.openDrawTimeType?" 满"+t.dataList.openDrawTimeNeedPlayers+"人开奖":""))]):"参与对象"===a[1]?s("span",{staticClass:"modal-content",staticStyle:{flex:"1"}},[t._v(t._s(t.dataList[a[0]]?t.dataList[a[0]]:0==t.dataList.joinUserLevel?"全部":""))]):"抽奖规则"===a[1]?s("span",{staticClass:"modal-content",staticStyle:{flex:"1"}},[t._v("\n          "+t._s(t.dataList[a[0]])+"\n        ")]):s("span",{staticClass:"modal-content",staticStyle:{flex:"1"}},[t._v(t._s(void 0!==t.dataList[a[0]]?t.dataList[a[0]]:"")+t._s("开团有效时间"===a[1]?" 分钟":""))])],2)}),s("div",{staticClass:"par"},[t._v("\n        广告主信息:\n      ")]),s("div",{staticClass:"par mgl-2 yyh-modal-item"},[s("span",{staticClass:"title",staticStyle:{width:"3em"}},[t._v("名称：")]),s("span",{staticClass:"flex-1 modal-content"},[t._v(t._s("string"===typeof t.dataList.advertName?t.dataList.advertName:""))])]),s("div",{staticClass:"par mgl-2 yyh-modal-item"},[s("span",{staticClass:"title",staticStyle:{width:"3em"}},[t._v("简介：")]),s("span",{staticClass:"flex-1 modal-content",domProps:{innerHTML:t._s("string"===typeof t.dataList.advertIntro?t.dataList.advertIntro:"")}})]),s("div",{staticClass:"par mgl-2 yyh-modal-item"},[s("span",{staticClass:"flex",staticStyle:{width:"280px"}},[s("span",{staticClass:"title width-5"},[t._v("列表banner")]),s("img",{staticClass:"mgr-1 banner-img",attrs:{src:t.dataList.drawActiveUrl,alt:"banner"}})]),s("span",{staticClass:"flex",staticStyle:{width:"280px"}},[s("span",{staticClass:"title width-5"},[t._v("详情banner")]),s("img",{staticClass:"mgr-1 banner-img",attrs:{src:t.dataList.advertBannerImgUrl,alt:"banner"}})]),s("span",{staticClass:"flex",staticStyle:{width:"280px"}},[s("span",{staticClass:"title width-5"},[t._v("logo图")]),s("img",{staticClass:"mgr-1 banner-img",attrs:{src:t.dataList.advertLogoImgUrl,alt:"logo"}})])])],2):t._e(),s("div",{attrs:{slot:"footer"},slot:"footer"})])],1)},i=[],n=s("3add"),r=s.n(n),o=s("7f80"),l=s("365c");function d(t,a,s,e,i,n,r){try{var o=t[n](r),l=o.value}catch(d){return void s(d)}o.done?a(l):Promise.resolve(l).then(e,i)}function c(t){return function(){var a=this,s=arguments;return new Promise(function(e,i){var n=t.apply(a,s);function r(t){d(n,e,i,r,o,"next",t)}function o(t){d(n,e,i,r,o,"throw",t)}r(void 0)})}}var p={name:"ModalDetail",data:function(){return{types:["单人团","多人团"],dataList:{groupType:-1},modalShow:!1,descConfig:[]}},created:function(){this.descConfig[0]=[["name","活动名称"],["startTime","活动开始时间"],["openDrawTime","活动开奖时间"],["drawDailyShopList","投放门店"],["bigPrize","活动大奖"],["normalPrize","阳光普照奖"],["winningRemarks","领奖说明"],["joinUserLevelName","参与对象"],["couponName","参加用券"],["drawRuleRemarks","抽奖规则"]],this.descConfig[1]=[["name","活动名称"],["startTime","活动开始时间"],["openDrawTime","活动开奖时间"],["drawDailyShopList","投放门店"],["bigPrize","活动大奖"],["normalPrize","阳光普照奖"],["winningRemarks","领奖说明"],["joinUserLevelName","参与对象"],["maxOpenGroupCount","开团总次数"],["groupPlayerCount","成团人数"],["userOpenGroupCount","开团次数"],["openGroupMinutes","开团有效时间"],["openGroupFee","开团消耗U贝"],["userOpenGroupCount","参团次数"],["joinGroupFee","参团消耗U贝"],["isFailureBackFee","团失败u贝返还"],["drawRuleRemarks","抽奖规则"]]},methods:{handleNone:function(t){return""===t||"string"!==typeof t?"":"- ".concat(t)},handleAddress:function(t){if(!t)return"";var a=t,s="";return"string"===typeof a.shopName&&(s=" "+a.shopName),a.provinceName+" "+this.handleNone(a.cityName)+" "+this.handleNone(a.countryName)+s},show:function(){var t=c(r.a.mark(function t(a){var s,e,i=this;return r.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return s=a.id,e=l["a"],this.$Spin.show(),setTimeout(function(t){i.$Spin.hide()},1e4),t.next=6,Object(o["f"])(e+"/drawDaily/activity/selectById",{id:s}).then(function(t){if(console.log(t),200==t.code){var a=t.data;1==a.isFailureBackFee?a.isFailureBackFee="是":a.isFailureBackFee="否",i.dataList=a}}).catch(function(t){console.log(t,"modal_detail")});case 6:this.$Spin.hide(),this.modalShow=!0;case 8:case"end":return t.stop()}},t,this)}));function a(a){return t.apply(this,arguments)}return a}()}},m=p,u=(s("cc79"),s("6691")),v=Object(u["a"])(m,e,i,!1,null,"0849aec6",null);a["default"]=v.exports},"6bb4":function(t,a,s){},cc79:function(t,a,s){"use strict";var e=s("6bb4"),i=s.n(e);i.a}}]);