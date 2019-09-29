(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-743dd334"],{"05791":function(e,t,i){"use strict";i.r(t);var o=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("Row",[i("Col",{attrs:{span:"4"}},[i("FormItem",{attrs:{prop:"drawDailyShopList["+e.index+"].provinceCode",rules:{required:!0,message:"请选择省份"}}},[i("Select",{attrs:{placeholder:"选择省","label-in-value":!0},on:{"on-change":e.provinceChange},model:{value:e.provinceCode,callback:function(t){e.provinceCode=t},expression:"provinceCode"}},e._l(e.provinceList,function(t,o){return i("Option",{key:o,attrs:{value:t.provinceCode}},[e._v(e._s(t.provinceName))])}),1)],1)],1),i("Col",{attrs:{span:"4"}},[i("FormItem",{attrs:{prop:"drawDailyShopList["+e.index+"].cityCode",rules:{required:!0,message:"请选择市"}}},[i("Select",{attrs:{placeholder:"选择市","label-in-value":!0},on:{"on-change":e.cityChange},model:{value:e.cityCode,callback:function(t){e.cityCode=t},expression:"cityCode"}},e._l(e.cityList,function(t,o){return i("Option",{key:o,attrs:{value:t.cityCode}},[e._v(e._s(t.cityName))])}),1)],1)],1),i("Col",{attrs:{span:"4"}},[i("FormItem",{attrs:{prop:"drawDailyShopList["+e.index+"].countryCode",rules:{required:!0,message:"请选择区"}}},[i("Select",{attrs:{placeholder:"选择区","label-in-value":!0},on:{"on-change":e.areaChange},model:{value:e.countryCode,callback:function(t){e.countryCode=t},expression:"countryCode"}},e._l(e.areaList,function(t,o){return i("Option",{key:o,attrs:{value:t.areaCode}},[e._v(e._s(t.areaName))])}),1)],1)],1),i("Col",{attrs:{span:"4"}},[i("FormItem",{attrs:{prop:"drawDailyShopList["+e.index+"].shopId",rules:{required:!0,message:"请选择门店"}}},[i("Select",{attrs:{placeholder:"选择门店","label-in-value":!0},on:{"on-change":e.shopIdChange},model:{value:e.shopId,callback:function(t){e.shopId=t},expression:"shopId"}},e._l(e.shopList,function(t,o){return i("Option",{key:o,attrs:{value:t.shopId}},[e._v(e._s(t.shopName))])}),1)],1)],1),i("Col",{attrs:{span:"2"}},[i("Button",{attrs:{type:"dashed",long:"",icon:"ios-close"},on:{click:function(t){return e.handleRemove()}}})],1)],1)],1)},s=[],n=i("7f80"),r={props:{id:Number,index:Number,shop:{type:Object,default:function(){return{}}}},data:function(){return{isInit:0,provinceList:[],cityList:[],areaList:[],shopList:[],provinceCode:null,cityCode:null,countryCode:null,shopId:null,provinceName:null,cityName:null,districtName:null}},methods:{loadProvinceList:function(){var e=this;return Object(n["h"])("/system/area/province/list").then(function(t){200==t.code?(e.provinceList=t.data,["provinceCode","cityCode","countryCode","shopId"].forEach(function(t){e[t]=e.shop[t]})):e.$Message.error(t.msg)})},provinceChange:function(e,t){var i=this;this.cityList=[],this.areaList=[],this.shopList=[],this.cityCode=null,this.countryCode=null,this.shopId=null,this.cityName=null,this.districtName=null,this.provinceName=e.label,this.$emit("sendProvinceId",this.provinceCode,this.shop.id),Object(n["d"])("/system/area/city/"+this.provinceCode).then(function(e){200==e.code?i.cityList=e.data:i.$Message.error(e.msg)})},cityChange:function(e,t){var i=this;this.areaList=[],this.shopList=[],this.countryCode=null,this.shopId=null,this.districtName=null,this.cityName=e?e.label:null,this.$emit("sendCityId",this.cityCode,this.shop.id),Object(n["d"])("/system/area/district/"+this.cityCode).then(function(e){200==e.code?(i.areaList=e.data,t&&t()):i.$Message.error(e.msg)})},areaChange:function(e){this.shopList=[],this.shopId=null,this.districtName=e?e.label:null,this.$emit("sendAreaId",this.countryCode,this.shop.id),this.loadShops()},shopIdChange:function(e){e?this.$emit("sendShopId",this.shopId,e.label,this.shop.id):this.$emit("sendShopId",this.shopId,null,this.shop.id)},loadShops:function(){var e=this;return this.provinceName?this.cityName?this.districtName?void Object(n["g"])("/system/sys-shop-info/list?pageNum=1&pageSize=2000",{province:this.provinceName,city:this.cityName,district:this.districtName}).then(function(t){200==t.code?e.shopList=t.data.records:e.$Message.error(t.msg)}):this.$Message.error("请选择区域"):this.$Message.error("请选择区县"):this.$Message.error("请选择省份")},handleRemove:function(){this.$emit("handleRemove-event",this.shop.id)},init:function(){var e=this;Object(n["g"])("/system/area/province/list").then(function(t){return 200==t.code?e.provinceList=t.data:e.$Message.error(t.msg),t}).then(function(t){return e.shop.provinceCode&&(e.provinceCode=e.shop.provinceCode,e.provinceName=e.provinceList.find(function(t){return t.provinceCode==e.provinceCode}).provinceName),t}).then(function(t){Object(n["d"])("/system/area/city/"+e.provinceCode).then(function(t){return 200==t.code?(e.cityList=t.data,e.cityCode=e.shop.cityCode,e.countryCode=null,e.shop.cityCode&&(e.cityName=e.cityList.find(function(t){return t.cityCode==e.cityCode}).cityName)):e.$Message.error(t.msg),t}).then(function(t){e.shop.cityCode&&Object(n["d"])("/system/area/district/"+e.cityCode).then(function(t){200==t.code?(e.areaList=t.data,e.countryCode=e.shop.countryCode,e.shop.countryCode&&(e.districtName=e.areaList.find(function(t){return t.areaCode==e.countryCode}).areaName),e.shop.shopId&&(e.shopId="".concat(e.shop.shopId),e.loadShops())):e.$Message.error(t.msg)})})})}},mounted:function(){var e=this;this.$nextTick(function(){e.loadProvinceList(),e.shop.provinceCode&&e.init()})}},a=r,c=i("6691"),d=Object(c["a"])(a,o,s,!1,null,null,null);t["default"]=d.exports}}]);