(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7f47937e","chunk-5ad50840","chunk-1da28688","chunk-6ee7a254","chunk-2d21024a","chunk-2d0e60e2"],{1422:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("p",{class:t.className,style:{textAlign:"center",color:t.color,fontSize:t.countSize,fontWeight:t.countWeight}},[a("span",{attrs:{id:t.idName}},[t._v(t._s(t.startVal))]),a("span",[t._v(t._s(t.unit))])]),t._t("intro")],2)},i=[],r=a("3ccc"),o=a.n(r);function s(t){var e=0,a="";return t<1e3?e=t:t>=1e3&&t<1e6?(e=parseInt(t/1e3),a="K+"):t>=1e6&&t<1e10?(e=parseInt(t/1e6),a="M+"):(e=parseInt(t/1e9),a="B+"),{val:e,unit:a}}var l={data:function(){return{unit:"",demo:{}}},name:"countUp",props:{idName:String,className:String,startVal:{type:Number,default:0},endVal:{type:Number,required:!0},decimals:{type:Number,default:0},duration:{type:Number,default:2},delay:{type:Number,default:500},options:{type:Object,default:function(){return{useEasing:!0,useGrouping:!0,separator:",",decimal:"."}}},color:String,countSize:{type:String,default:"30px"},countWeight:{type:Number,default:700},introText:[String,Number]},mounted:function(){var t=this;this.$nextTick(function(){setTimeout(function(){var e=s(t.endVal),a=e.val;t.unit=e.unit;var n={};t.demo=n=new o.a(t.idName,t.startVal,a,t.decimals,t.duration,t.options),n.error||n.start()},t.delay)})},watch:{endVal:function(t){var e=s(t),a=e.val;this.unit=e.unit,this.demo.update(a)}}},c=l,u=a("6691"),m=Object(u["a"])(c,n,i,!1,null,null,null);e["default"]=m.exports},1663:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("Card",{attrs:{padding:0}},[a("div",{staticClass:"infor-card-con"},[a("Col",{staticClass:"infor-card-icon-con",style:{backgroundColor:t.color,color:"white"},attrs:{span:"8"}},[a("Row",{staticClass:"height-100",attrs:{type:"flex",align:"middle",justify:"center"}},[a("Icon",{attrs:{type:t.iconType,size:t.iconSize}})],1)],1),a("Col",{staticClass:"height-100",attrs:{span:"16"}},[a("Row",{staticClass:"height-100",attrs:{type:"flex",align:"middle",justify:"center"}},[a("count-up",{staticClass:"infor-card-count user-created-count",attrs:{"id-name":t.idName,"end-val":t.endVal,color:t.color,countSize:t.countSize,countWeight:t.countWeight}},[a("p",{staticClass:"infor-intro-text",attrs:{slot:"intro"},slot:"intro"},[t._v(t._s(t.introText))])])],1)],1)],1)])},i=[],r=a("1422"),o={name:"inforCard",components:{countUp:r["default"]},props:{idName:String,endVal:Number,color:String,iconType:String,introText:String,countSize:{type:String,default:"30px"},countWeight:{type:Number,default:700},iconSize:{type:Number,default:40}}},s=o,l=(a("ca84"),a("6691")),c=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=c.exports},"1fcd":function(t,e,a){},"3a19":function(t,e,a){t.exports=a.p+"img/profile.4696ef34.jpg"},"3ccc":function(t,e,a){var n,i;!function(r,o){n=o,i="function"===typeof n?n.call(e,a,e,t):n,void 0===i||(t.exports=i)}(0,function(t,e,a){var n=function(t,e,a,n,i,r){for(var o=0,s=["webkit","moz","ms","o"],l=0;l<s.length&&!window.requestAnimationFrame;++l)window.requestAnimationFrame=window[s[l]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[s[l]+"CancelAnimationFrame"]||window[s[l]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t,e){var a=(new Date).getTime(),n=Math.max(0,16-(a-o)),i=window.setTimeout(function(){t(a+n)},n);return o=a+n,i}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)});var c=this;for(var u in c.options={useEasing:!0,useGrouping:!0,separator:",",decimal:".",easingFn:null,formattingFn:null},r)r.hasOwnProperty(u)&&(c.options[u]=r[u]);""===c.options.separator&&(c.options.useGrouping=!1),c.options.prefix||(c.options.prefix=""),c.options.suffix||(c.options.suffix=""),c.d="string"==typeof t?document.getElementById(t):t,c.startVal=Number(e),c.endVal=Number(a),c.countDown=c.startVal>c.endVal,c.frameVal=c.startVal,c.decimals=Math.max(0,n||0),c.dec=Math.pow(10,c.decimals),c.duration=1e3*Number(i)||2e3,c.formatNumber=function(t){var e,a,n,i;if(t=t.toFixed(c.decimals),t+="",e=t.split("."),a=e[0],n=e.length>1?c.options.decimal+e[1]:"",i=/(\d+)(\d{3})/,c.options.useGrouping)for(;i.test(a);)a=a.replace(i,"$1"+c.options.separator+"$2");return c.options.prefix+a+n+c.options.suffix},c.easeOutExpo=function(t,e,a,n){return a*(1-Math.pow(2,-10*t/n))*1024/1023+e},c.easingFn=c.options.easingFn?c.options.easingFn:c.easeOutExpo,c.formattingFn=c.options.formattingFn?c.options.formattingFn:c.formatNumber,c.version=function(){return"1.7.1"},c.printValue=function(t){var e=c.formattingFn(t);"INPUT"===c.d.tagName?this.d.value=e:"text"===c.d.tagName||"tspan"===c.d.tagName?this.d.textContent=e:this.d.innerHTML=e},c.count=function(t){c.startTime||(c.startTime=t),c.timestamp=t;var e=t-c.startTime;c.remaining=c.duration-e,c.options.useEasing?c.countDown?c.frameVal=c.startVal-c.easingFn(e,0,c.startVal-c.endVal,c.duration):c.frameVal=c.easingFn(e,c.startVal,c.endVal-c.startVal,c.duration):c.countDown?c.frameVal=c.startVal-(c.startVal-c.endVal)*(e/c.duration):c.frameVal=c.startVal+(c.endVal-c.startVal)*(e/c.duration),c.countDown?c.frameVal=c.frameVal<c.endVal?c.endVal:c.frameVal:c.frameVal=c.frameVal>c.endVal?c.endVal:c.frameVal,c.frameVal=Math.round(c.frameVal*c.dec)/c.dec,c.printValue(c.frameVal),e<c.duration?c.rAF=requestAnimationFrame(c.count):c.callback&&c.callback()},c.start=function(t){return c.callback=t,c.rAF=requestAnimationFrame(c.count),!1},c.pauseResume=function(){c.paused?(c.paused=!1,delete c.startTime,c.duration=c.remaining,c.startVal=c.frameVal,requestAnimationFrame(c.count)):(c.paused=!0,cancelAnimationFrame(c.rAF))},c.reset=function(){c.paused=!1,delete c.startTime,c.startVal=e,cancelAnimationFrame(c.rAF),c.printValue(c.startVal)},c.update=function(t){cancelAnimationFrame(c.rAF),c.paused=!1,delete c.startTime,c.startVal=c.frameVal,c.endVal=Number(t),c.countDown=c.startVal>c.endVal,c.rAF=requestAnimationFrame(c.count)},c.printValue(c.startVal)};return n})},"45f3":function(t,e,a){},"670b":function(t,e,a){"use strict";var n=a("1fcd"),i=a.n(n);i.a},"77b8":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"home-main"},[n("Row",{attrs:{gutter:10}},[n("Col",{attrs:{md:24,lg:8}},[n("Row",{attrs:{"class-name":"home-page-row1",gutter:10}},[n("Col",{style:{marginBottom:"10px"},attrs:{md:12,lg:24}},[n("Card",[n("Row",{staticClass:"user-infor",attrs:{type:"flex"}},[n("Col",{attrs:{span:"8"}},[n("Row",{attrs:{"class-name":"made-child-con-middle",type:"flex",align:"middle"}},[n("img",{staticClass:"avator-img",attrs:{src:a("3a19")}})])],1),n("Col",{staticStyle:{"padding-left":"6px"},attrs:{span:"16"}},[n("Row",{attrs:{"class-name":"made-child-con-middle",type:"flex",align:"middle"}},[n("div",[n("b",{staticClass:"card-user-infor-name"},[t._v(t._s(t.userInfo.username))]),n("p",[t._v("欢迎您的使用")])])])],1)],1),n("div",{staticClass:"line-gray"}),n("Row",{staticClass:"margin-top-8",attrs:{justify:"end"}},[n("Col",{attrs:{span:"8"}},[n("p",{staticClass:"notwrap"},[t._v("所属部门:")])]),n("Col",{staticClass:"padding-left-8",staticStyle:{color:"red"},attrs:{span:"16"}},[t._v(t._s(t.userInfo.deptName))])],1)],1)],1),n("Col",{staticStyle:{"margin-bottom":"10px"},attrs:{md:12,lg:24}},[n("Card",[n("p",{staticClass:"card-title",attrs:{slot:"title"},slot:"title"},[n("Icon",{staticStyle:{"margin-bottom":"3px"},attrs:{size:"20"}}),n("a",{attrs:{target:"_blank"}},[t._v(" 当前版本：v1.0  ")])],1),n("div",{staticClass:"to-do-list-con"},[n("Timeline",[n("TimelineItem",{attrs:{color:"green"}},[n("Icon",{attrs:{slot:"dot",type:"ios-trophy"},slot:"dot"}),n("p",{staticClass:"time"},[t._v("2019年")]),n("p",{staticClass:"content"},[t._v("发布v1.0版本")])],1),n("TimelineItem",{attrs:{color:"green"}},[n("p",{staticClass:"time"},[t._v("2019年")]),n("p",{staticClass:"content"},[t._v("开发v1.0版本")])]),n("TimelineItem",{attrs:{color:"yellow"}},[n("p",{staticClass:"time"},[t._v("2019年")]),n("p",{staticClass:"content"},[t._v("开发v1.0版本")])]),n("TimelineItem",{attrs:{color:"blue"}},[n("p",{staticClass:"time"},[t._v("2019年")]),n("p",{staticClass:"content"},[t._v("开发v1.0版本")])]),n("TimelineItem",{attrs:{color:"red"}},[n("p",{staticClass:"time"},[t._v("2019年")]),n("p",{staticClass:"content"},[t._v("开发v1.0版本")])])],1)],1)])],1)],1)],1),n("Col",{attrs:{md:24,lg:16}},[n("Row",{attrs:{gutter:5}},[n("Col",{style:{marginBottom:"10px"},attrs:{xs:24,sm:12,md:6}},[n("infor-card",{attrs:{"id-name":"user_created_count","end-val":t.count.createUser,iconType:"md-person-add",color:"#2d8cf0","intro-text":"今日新增用户"}})],1),n("Col",{style:{marginBottom:"10px"},attrs:{xs:24,sm:12,md:6}},[n("infor-card",{attrs:{"id-name":"visit_count","end-val":t.count.visit,iconType:"ios-eye",color:"#64d572",iconSize:50,"intro-text":"今日浏览量"}})],1),n("Col",{style:{marginBottom:"10px"},attrs:{xs:24,sm:12,md:6}},[n("infor-card",{attrs:{"id-name":"collection_count","end-val":t.count.collection,iconType:"md-cloud-upload",color:"#ffd572","intro-text":"今日数据采集量"}})],1),n("Col",{style:{marginBottom:"10px"},attrs:{xs:24,sm:12,md:6}},[n("infor-card",{attrs:{"id-name":"transfer_count","end-val":t.count.transfer,iconType:"md-shuffle",color:"#f25e43","intro-text":"今日服务调用量"}})],1)],1),n("Row",[n("Col",{staticStyle:{"margin-top":"18px"},attrs:{md:24,lg:24}},[n("Card",{attrs:{padding:0}},[n("p",{staticClass:"card-title",attrs:{slot:"title"},slot:"title"},[n("Icon",{attrs:{type:"md-locate"}}),t._v("\n                    今日服务调用地理分布\n                ")],1),n("div",{staticClass:"map-con"},[n("Col",{attrs:{span:"10"}},[n("map-data-table",{attrs:{cityData:t.cityData,height:"281","style-obj":{margin:"12px 0 0 11px"}}})],1),n("Col",{staticClass:"map-incon",attrs:{span:"14"}},[n("Row",{attrs:{type:"flex",justify:"center",align:"middle"}},[n("home-map",{attrs:{"city-data":t.cityData}})],1)],1)],1)])],1)],1)],1)],1),n("Row",{attrs:{gutter:10}},[n("Col",{style:{marginBottom:"10px"},attrs:{md:24,lg:24}},[n("Card",[n("p",{staticClass:"card-title",attrs:{slot:"title"},slot:"title"},[n("Icon",{attrs:{type:"md-map"}}),t._v("\n                每日来访量统计\n            ")],1),n("div",{staticClass:"data-source-row"},[n("visite-volume")],1)])],1)],1)],1)},i=[],r=(a("365c"),[{name:"海门",value:45},{name:"鄂尔多斯",value:34},{name:"招远",value:47},{name:"舟山",value:22},{name:"齐齐哈尔",value:74},{name:"广州",value:138},{name:"盐城",value:15},{name:"北京",value:250},{name:"深圳",value:141},{name:"赤峰",value:16},{name:"青岛",value:89},{name:"乳山",value:18},{name:"金昌",value:34},{name:"泉州",value:21},{name:"莱西",value:66},{name:"日照",value:45},{name:"胶南",value:23},{name:"南通",value:54},{name:"拉萨",value:22},{name:"云浮",value:78},{name:"梅州",value:23},{name:"文登",value:78},{name:"上海",value:218}]),o=a("57c6"),s=a("8ea8"),l=a("96b1"),c=a("1422"),u=a("1663"),m=a("b743"),d={name:"home",components:{homeMap:o["default"],visiteVolume:s["default"],userFlow:l["default"],countUp:c["default"],inforCard:u["default"],mapDataTable:m["default"]},data:function(){return{showVideo:!1,count:{createUser:496,visit:3264,collection:24389305,transfer:39503498},cityData:r,newToDoItemValue:"",city:"",userInfo:""}},computed:{avatarPath:function(){return localStorage.avatorImgPath}},methods:{init:function(){this.userInfo=JSON.parse(this.getStore("userInfo"))}},mounted:function(){this.init()}},p=d,f=(a("e897"),a("6691")),v=Object(f["a"])(p,n,i,!1,null,null,null);e["default"]=v.exports},"8ea8":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"visit"},[a("div",{staticClass:"date"},[a("Select",{staticStyle:{width:"120px"},model:{value:t.date,callback:function(e){t.date=e},expression:"date"}},[a("Option",{attrs:{value:"1"}},[t._v("本周")]),a("Option",{attrs:{value:"2"}},[t._v("上周")])],1),a("DatePicker",{staticStyle:{width:"180px"},attrs:{type:"daterange",placeholder:"选择日期范围"}})],1),a("div",{staticStyle:{width:"100%",height:"200px"},attrs:{id:"visite_volume_con"}})])},i=[],r=a("24ce"),o=a.n(r),s={name:"visiteVolume",data:function(){return{date:"1"}},mounted:function(){this.$nextTick(function(){for(var t=o.a.init(document.getElementById("visite_volume_con")),e=[],a=[],n=[],i=0;i<20;i++)e.push("类目"+i),a.push(5*(Math.sin(i/5)*(i/5-10)+i/6)),n.push(5*(Math.cos(i/5)*(i/5-10)+i/6));var r={tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{top:0,left:"2%",right:"4%",bottom:"3%",containLabel:!0},xAxis:{type:"value",boundaryGap:[0,.01]},yAxis:{type:"category",data:["Mon","Tues","Wed","Thur","Fri","Sat","Sun"],nameTextStyle:{color:"#c3c3c3"}},series:[{name:"访问量",type:"bar",data:[{value:453682,name:"Mon",itemStyle:{normal:{color:"#2d8cf0"}}},{value:879545,name:"Tues",itemStyle:{normal:{color:"#2d8cf0"}}},{value:2354678,name:"Wed",itemStyle:{normal:{color:"#2d8cf0"}}},{value:1598403,name:"Thur",itemStyle:{normal:{color:"#2d8cf0"}}},{value:543250,name:"Fri",itemStyle:{normal:{color:"#2d8cf0"}}},{value:1305923,name:"Sat",itemStyle:{normal:{color:"#2d8cf0"}}},{value:1103456,name:"Sun",itemStyle:{normal:{color:"#2d8cf0"}}}]}]};t.setOption(r),window.addEventListener("resize",function(){t.resize()})})}},l=s,c=(a("670b"),a("6691")),u=Object(c["a"])(l,n,i,!1,null,null,null);e["default"]=u.exports},"96b1":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"user_flow"}})},i=[],r=a("24ce"),o=a.n(r),s={tooltip:{formatter:"{a} <br/>{b} : {c}%"},series:[{name:"入流量",type:"gauge",min:0,max:1e3,detail:{formatter:"{value}Mb+",fontSize:18,offsetCenter:[0,"50px"]},data:[{value:50,name:"当前入流量"}],center:["25%","50%"],radius:"80%",title:{offsetCenter:[0,"80px"]},axisLine:{lineStyle:{width:20}},splitLine:{length:20}},{name:"出流量",type:"gauge",min:0,max:1e3,detail:{formatter:"{value}Mb+",fontSize:18,offsetCenter:[0,"50px"]},data:[{value:50,name:"当前出流量"}],center:["75%","50%"],radius:"80%",title:{offsetCenter:[0,"80px"]},axisLine:{lineStyle:{width:20}},splitLine:{length:20}}]},l={name:"userFlow",mounted:function(){var t=o.a.init(document.getElementById("user_flow"));s.series[0].data[0].value=(1e3*Math.random()).toFixed(2)-0,s.series[1].data[0].value=(1e3*Math.random()).toFixed(2)-0,t.setOption(s),window.addEventListener("resize",function(){t.resize()})}},c=l,u=a("6691"),m=Object(u["a"])(c,n,i,!1,null,null,null);e["default"]=m.exports},b743:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{style:t.styleObj},[a("Table",{attrs:{height:t.height,columns:t.columns,data:t.cityData}})],1)},i=[],r={name:"mapDataTable",data:function(){return{columns:[{title:"城市",key:"name"},{title:"流量(k)",key:"value",sortable:!0}]}},props:{cityData:Array,styleObj:Object,height:String}},o=r,s=a("6691"),l=Object(s["a"])(o,n,i,!1,null,null,null);e["default"]=l.exports},ca84:function(t,e,a){"use strict";var n=a("f080"),i=a.n(n);i.a},e897:function(t,e,a){"use strict";var n=a("45f3"),i=a.n(n);i.a},f080:function(t,e,a){}}]);