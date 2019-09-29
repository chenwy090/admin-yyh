(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-05d8b6f2"],{"0966":function(t,e,i){"use strict";var n=i("febe"),a=i.n(n);a.a},1752:function(t,e,i){},"4e8e":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=this,i=e.$createElement,n=e._self._c||i;return n("div",[n("Card",[n("Form",[n("FormItem",{attrs:{label:"单图上传"}},[n("uploadImg",{ref:"upload",attrs:{uploadImg:e.image_url,width:200,height:160},on:{handleSuccess:function(e){return t.image_url=e}}}),n("p",[e._v("选择单图上传图 (不大于1M,尺寸为200*160, JPG/PNG/JPEG/BMP）")])],1),n("FormItem",{attrs:{label:"多图上传"}},[n("uploadImgMore",{attrs:{uploadList:e.ulrList,width:200,height:160},on:{handleSuccess:function(e){return t.ulrList=e}}}),n("p",[e._v("选择多图上传图 (不大于1M,尺寸为200*160, JPG/PNG/JPEG/BMP）")])],1),n("FormItem",{attrs:{label:"图片裁剪"}},[e.imgSrc?n("div",{staticClass:"imgSrc_box"},[n("img",{staticStyle:{width:"100%"},attrs:{src:e.imgSrc}})]):e._e(),n("ImgCutter",{attrs:{label:"选择图片",boxWidth:400,boxHeight:500,rate:1.2},on:{click:e.cutDown}},[n("span",{staticClass:"ivu-btn",staticStyle:{width:"100px"},attrs:{slot:"openImgCutter"},slot:"openImgCutter"},[e._v("上传图片")])]),n("p",{staticStyle:{color:"red"}},[e._v(" boxWidth为裁剪框宽度 boxHeight为裁剪框高度  rate为宽高比")])],1),n("Alert",[e._v("\r\n      可编辑表格\r\n        "),n("template",{slot:"desc"},[e._v("\r\n      参考模版 ：   components/editTable.vue\r\n\r\n           ")])],2),n("Alert",{attrs:{type:"success"}},[e._v("\r\n      树形表格\r\n        "),n("template",{slot:"desc"},[e._v("\r\n      参考模版  ：   sys/menu-manage/menuManage.vue\r\n\r\n           ")])],2),n("Alert",[e._v("\r\n       时间戳转为年月日时分秒\r\n        "),n("template",{slot:"desc"},[e._v('\r\n             import { formatDate } from "@/libs/dataUtil";\r\n           '),n("br"),e._v('\r\n           formatDate( new Date(JSON.parse(this.add_time)), "yyyy-MM-dd hh:mm:ss" )\r\n\r\n           ')])],2),n("Alert",{attrs:{type:"success"}},[e._v("\r\n       去重复\r\n        "),n("template",{slot:"desc"},[e._v('\r\n           import { uniqueArray } from "@/libs/dataUtil";\r\n           '),n("br"),e._v('\r\n        var afterArr = uniqueArray(this.checkUserList, "id");\r\n\r\n           ')])],2),n("Alert",[e._v("\r\n       时间戳+日期\r\n        "),n("template",{slot:"desc"},[e._v('\r\n           import { addDate } from "@/libs/dataUtil";\r\n           '),n("br"),e._v('\r\n     var validity_end =\r\n                addDate(\r\n                  formatDate(\r\n                    new Date(JSON.parse(this.add_time)),\r\n                    "yyyy-MM-dd"\r\n                  ),\r\n                11\r\n                ) ;\r\n\r\n           ')])],2),n("Button",{on:{click:e.saveInfo}},[e._v("保存")])],1)],1)],1)},a=[],r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[t.uploadImg?i("div",{staticClass:"demo-upload-list"},[[i("img",{attrs:{src:t.uploadImg}}),i("div",{staticClass:"demo-upload-list-cover"},[i("Icon",{attrs:{type:"ios-eye-outline"},nativeOn:{click:function(e){return t.handleView()}}}),i("Icon",{attrs:{type:"ios-trash-outline"},nativeOn:{click:function(e){return t.handleRemove()}}})],1)]],2):t._e(),i("Upload",{ref:"upload",staticStyle:{display:"inline-block",width:"78px"},attrs:{defaultList:t.uploadImg,accept:"image","show-upload-list":!1,"on-success":t.handleSuccess,format:["jpg","jpeg","png"],"max-size":1048,"on-format-error":t.handleFormatError,"on-exceeded-size":t.handleMaxSize,type:"drag",headers:t.userToken,action:t.actionUrl,"before-upload":t.handleBeforeUpload}},[i("div",{staticStyle:{width:"78px",height:"78px","line-height":"58px"}},[i("Icon",{staticStyle:{"margin-top":"24px"},attrs:{type:"ios-camera",size:"36"}})],1)]),i("Modal",{attrs:{title:"查看图片"},model:{value:t.visible,callback:function(e){t.visible=e},expression:"visible"}},[t.visible?i("img",{staticStyle:{width:"100%"},attrs:{src:t.imgName}}):t._e()])],1)},s=[],o=i("7f80"),l=i("365c"),c=i("9472"),u={props:["uploadImg","width","height"],data:function(){return{defaultList:[],imgName:"",visible:!1,uptoken:{},actionUrl:l["g"],fileList:[],userToken:""}},created:function(){this.userToken={jwttoken:localStorage.getItem("jwttoken")}},methods:{handleView:function(t){this.imgName=this.uploadImg,this.visible=!0},handleRemove:function(){this.uploadImg="",this.$emit("handleSuccess","")},handleSuccess:function(t,e){this.$emit("handleSuccess",t.image_url)},handleFormatError:function(t){this.$Notice.warning({title:"上传的格式不正确",desc:"文件'"+t.name+"'不合法, 请重新选择jpg or png.的格式"})},handleMaxSize:function(t){this.$Notice.warning({title:"文件大小超出限制",desc:"文件'"+t.name+"'大小超出"+this.maxSize/1024+"M限制"})},handleBeforeUpload:function(t){return Object(c["a"])(t,this.width,this.height)}},mounted:function(){}},d=u,m=(i("ccab"),i("6691")),p=Object(m["a"])(d,r,s,!1,null,null,null),h=p.exports,g=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[t._l(t.uploadList,function(e,n){return i("div",{key:n,staticClass:"demo-upload-list"},[[i("img",{attrs:{src:e.img_url}}),i("div",{staticClass:"demo-upload-list-cover"},[i("Icon",{attrs:{type:"ios-eye-outline"},nativeOn:{click:function(i){return t.handleView(e)}}}),i("Icon",{attrs:{type:"ios-trash-outline"},nativeOn:{click:function(e){return t.handleRemove(n)}}})],1)]],2)}),i("Upload",{ref:"upload",staticStyle:{display:"inline-block",width:"78px"},attrs:{defaultList:t.uploadList,accept:"image","show-upload-list":!1,"on-success":t.handleSuccess,format:["jpg","jpeg","png"],"max-size":1024,"on-format-error":t.handleFormatError,"on-exceeded-size":t.handleMaxSize,type:"drag",headers:t.userToken,action:t.actionUrl,"before-upload":t.handleBeforeUpload}},[i("div",{staticStyle:{width:"78px",height:"78px","line-height":"58px"}},[i("Icon",{staticStyle:{"margin-top":"24px"},attrs:{type:"ios-camera",size:"36"}})],1)]),i("Modal",{attrs:{title:"查看图片"},model:{value:t.visible,callback:function(e){t.visible=e},expression:"visible"}},[t.visible?i("img",{staticStyle:{width:"100%"},attrs:{src:t.imgName}}):t._e()])],2)},f=[];function v(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}var b={props:["uploadList","width","height"],data:function(){return{defaultList:[],imgName:"",visible:!1,uptoken:{},actionUrl:l["g"],fileList:[],userToken:""}},created:function(){this.userToken={jwttoken:localStorage.getItem("jwttoken")}},methods:v({handleView:function(t){this.imgName=t.img_url,this.visible=!0},handleRemove:function(t){this.uploadList.splice(t,1)},handleSuccess:function(t,e){var i={img_url:t.image_url};this.uploadList.push(i),this.$emit("handleSuccess",this.uploadList)},handleFormatError:function(t){this.$Notice.warning({title:"上传的格式不正确",desc:"文件'"+t.name+"'不合法, 请重新选择jpg or png.的格式"})},handleMaxSize:function(t){this.$Notice.warning({title:"文件大小超出限制",desc:"文件'"+t.name+"'大小超出"+this.maxSize/1024+"M限制"})},handleBeforeUpload:function(){var t=this.uploadList.length<5;return t||this.$Notice.warning({title:"最多只能上传五张图片"}),t}},"handleBeforeUpload",function(t){return Object(c["a"])(t,this.width,this.height)}),mounted:function(){}},w=b,_=(i("0966"),Object(m["a"])(w,g,f,!1,null,null,null)),y=_.exports,S=i("9cd5"),x={components:{uploadImg:h,uploadImgMore:y,ImgCutter:S["a"]},data:function(){return{image_url:"http://pic17.nipic.com/20111102/8732394_164338399113_2.jpg",ulrList:[{img_url:"http://www.ghost64.com/qqtupian/zixunImg/local/2019/03/15/15525976683034.jpeg"},{img_url:"https://ku.90sjimg.com/element_origin_min_pic/17/06/17/8b91e3acb380d9cd4de59796f6c035cb.jpg"}],imgSrc:null}},methods:{saveInfo:function(){console.log(this.image_url),console.log(this.ulrList)},cutDown:function(t){var e=this;console.log(t),this.imgSrc=t.dataURL;var i={imgStr:t.dataURL.substr(22)};Object(o["j"])("/operation/operation-info/uploadBase64Image2AliOss",i).then(function(t){200==t.code?e.imgSrc=t.image_url:e.$Message.error(t.msg)})}},mounted:function(){}},I=x,k=(i("dd7f"),Object(m["a"])(I,n,a,!1,null,null,null));e["default"]=k.exports},9472:function(t,e,i){"use strict";i.d(e,"b",function(){return a}),i.d(e,"a",function(){return r});var n=i("2864");function a(t,e){var i={"M+":t.getMonth()+1,"d+":t.getDate(),"h+":t.getHours(),"m+":t.getMinutes(),"s+":t.getSeconds(),S:t.getMilliseconds()};for(var n in/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(t.getFullYear()+"").substr(4-RegExp.$1.length))),i)new RegExp("("+n+")").test(e)&&(e=e.replace(RegExp.$1,1===RegExp.$1.length?i[n]:("00"+i[n]).substr((""+i[n]).length)));return e}function r(t,e,i,a){return new Promise(function(a,r){"image/png"!=t.type&&"image/jpeg"!=t.type&&"image/jpg"!=t.type&&"image/bmp"!=t.type&&(n["Message"].error("图片格式只能选择png/jpeg/jpg/bmp"),r());var s=new FileReader;s.onload=function(t){var s=t.target.result,o=new Image;o.onload=function(){e&&this.width!=e?(n["Notice"].warning({title:"文件尺寸超出限制",desc:"请上传宽为"+e+"的图片"}),r()):i&&this.height!=i?(n["Notice"].warning({title:"文件尺寸超出限制",desc:"请上传高为"+i+"的图片"}),r()):a()},o.onerror=r,o.src=s},s.readAsDataURL(t)})}},ccab:function(t,e,i){"use strict";var n=i("1752"),a=i.n(n);a.a},cd70:function(t,e,i){},dd7f:function(t,e,i){"use strict";var n=i("cd70"),a=i.n(n);a.a},febe:function(t,e,i){}}]);