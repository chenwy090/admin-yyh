(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-fa1eaba8","chunk-2d0cf4a3","chunk-2d0cf4a3"],{"10b3":function(e,t,i){},"1e28":function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("span",{staticClass:"label"},[e._v(e._s(e.label))]),e._l(e.uploadList,function(t){return i("div",{key:t.uid,staticClass:"demo-upload-list"},[i("img",{attrs:{src:t.imgUrl}}),i("div",{staticClass:"demo-upload-list-cover"},[i("Icon",{attrs:{type:"ios-eye-outline"},nativeOn:{click:function(i){return e.handleView(t.imgUrl)}}}),i("Icon",{attrs:{type:"ios-trash-outline"},nativeOn:{click:function(i){return e.handleRemove(t)}}})],1)])}),i("div",{staticStyle:{display:"inline"}},[i("Upload",{ref:"upload",style:e.uploadStyle,attrs:{headers:e.userToken,type:e.dragType,format:["jpg","jpeg","png","bmp"],"show-upload-list":!1,"before-upload":e.handleBeforeUpload,"on-success":e.handleUploadSuccess,action:e.url,accept:"image","max-size":1024,"on-exceeded-size":e.handleMaxSize,"on-format-error":e.handleFormatError}},[0==e.uploadList.length?[i("div",{staticStyle:{width:"90px",height:"90px","line-height":"90px"}},[i("Icon",{attrs:{type:"ios-camera",size:"20"}})],1)]:[i("Button",{attrs:{size:"small",icon:"ios-cloud-upload-outline"}},[e._v("更改")])]],2)],1),i("Modal",{attrs:{"footer-hide":!0},model:{value:e.visible,callback:function(t){e.visible=t},expression:"visible"}},[e.visible?i("img",{staticStyle:{width:"100%"},attrs:{src:e.imgUrl}}):e._e()])],2)},a=[],r=i("365c"),s=i("62a2"),o={name:"upload-image",props:{label:{type:String,default:""},defaultList:{type:Array,default:function(){return[]}},fileUploadType:{type:[String,Number],default:""}},watch:{defaultList:{handler:function(){this.uploadList=[];for(var e=0;e<this.defaultList.length;e++){var t=this.defaultList[e];this.uploadList.push(t)}},immediate:!0}},computed:{uploadStyle:function(){return 0==this.uploadList.length?"display: inline-block;width:90px;":"float:'left';padding-top:60px;"},dragType:function(){return this.uploadList.length?"select":"drag"}},data:function(){return{userToken:{},url:r["g"],uploadList:[],imgUrl:"",visible:!1}},created:function(){this.userToken={jwttoken:localStorage.getItem("jwttoken")}},mounted:function(){this.defaultList.length&&(this.uploadList=this.defaultList)},methods:{handleView:function(e){this.imgUrl=e,this.visible=!0},handleRemove:function(e){this.uploadList=[]},handleUploadSuccess:function(e,t,i){if(200==e.code){this.uploadList=[];var n=e.image_url;t.imgUrl=n,this.$emit("uploadSuccess",{fileUploadType:this.fileUploadType,imgUrl:n}),this.uploadList.push(t),this.$Message.info("上传图片成功")}else this.$Message.error("上传图片失败，请重新上传")},handleMaxSize:function(e){this.$Message.error("图片不大于1M")},handleFormatError:function(){this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传")},handleBeforeUpload:function(e){return Object(s["a"])(e)},msgOk:function(e){this.$Message.info({content:e,duration:3})},msgErr:function(e){this.$Message.error({content:e,duration:3})}}},l=o,u=(i("6b61"),i("6691")),d=Object(u["a"])(l,n,a,!1,null,"79811e88",null);t["default"]=d.exports},"62a2":function(e,t,i){"use strict";i.d(t,"c",function(){return a}),i.d(t,"b",function(){return r}),i.d(t,"a",function(){return s}),i.d(t,"d",function(){return o});var n=i("2864");function a(e,t){var i={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),S:e.getMilliseconds()};for(var n in/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length))),i)new RegExp("("+n+")").test(t)&&(t=t.replace(RegExp.$1,1===RegExp.$1.length?i[n]:("00"+i[n]).substr((""+i[n]).length)));return t}function r(e,t,i,a){return new Promise(function(a,r){"image/png"!=e.type&&"image/jpeg"!=e.type&&"image/jpg"!=e.type&&"image/bmp"!=e.type&&(n["Message"].error("图片格式只能选择png/jpeg/jpg/bmp"),r());var s=new FileReader;s.onload=function(e){var s=e.target.result,o=new Image;o.onload=function(){t&&this.width!=t?(n["Message"].error("请上传宽为"+t+"的图片"),r()):i&&this.height!=i?(n["Message"].error("请上传高为"+i+"的图片"),r()):a()},o.onerror=r,o.src=s},s.readAsDataURL(e)})}function s(e,t){return new Promise(function(t,i){"image/png"!=e.type&&"image/jpeg"!=e.type&&"image/jpg"!=e.type&&"image/bmp"!=e.type&&(n["Message"].error("图片格式只能选择png/jpeg/jpg/bmp"),i());var a=new FileReader;a.onload=function(e){var n=e.target.result,a=new Image;t(),a.onerror=i,a.src=n},a.readAsDataURL(e)})}function o(e,t){for(var i=[e[0]],n=1;n<e.length;n++){for(var a=e[n],r=!1,s=0;s<i.length;s++)if(a[t]==i[s][t]){r=!0;break}r||i.push(a)}return i}},"6b61":function(e,t,i){"use strict";var n=i("10b3"),a=i.n(n);a.a}}]);