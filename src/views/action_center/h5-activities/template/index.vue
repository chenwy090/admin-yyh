<template>
	<div v-if="showTemplateDetail">
		<Drawer
	      v-model="showTemplateDetail"
	      :closable="false"
	      :mask-closable="false"
	      width="1000"
	      :styles="styles"
	    >
	      <div slot="header" style="overflow:hidden;">
	        <span>{{templateTitle}}</span>
	        <Button type="dashed" style="float:right"  @click="backToMoudle">返回上一级</Button>
	      </div>
	      <div>
	        <Form
	          label-position="right"
	          ref="form"
	          :model="formData"
	          :label-width="100"
	        >
	          <FormItem label="内容选择：" prop="type" v-if="action.type != 'query'">
	            <Button type="primary" size="small" @click="addContetByType('add')">添加</Button>
	          </FormItem>
	          <Table :columns="columnsYhq" :data="data" border :loading="loading" v-if="formData.type == 1">
	          	<template slot-scope="{ row }" slot="action">
	          		<template v-if="action.type == 'query'">
	          			<Button
				            type="text"
				            size="small"
				            style="color:#2db7f5;margin-right: 5px" @click="addContetByType('query',row)">
				            查看
				        </Button>
	          		</template>
	          		<template v-else>
		          		<Button
				            type="text"
				            size="small"
				            style="color:#2db7f5;margin-right: 5px" @click="addContetByType('edit',row)" v-if="row.heraldStatus == '未开始'">
				            编辑
				        </Button>
				        <Button
				            type="text"
				            size="small"
				            style="color:#2db7f5;margin-right: 5px" @click="deleteList(row)">
				            删除
				        </Button>
				        <Button
				            type="text"
				            size="small"
				            style="color:#2db7f5;margin-right: 5px" @click="addContetByType('query',row)">
				            查看
				        </Button>
				    </template>
	          	</template>
	          </Table>
	          <Table :columns="columnsImg" :data="data" border :loading="loading" v-if="formData.type == 2">
	          	<template slot-scope="{ row }" slot="action">
	          		<template v-if="action.type == 'query'">
	          			<Button
				            type="text"
				            size="small"
				            style="color:#2db7f5;margin-right: 5px" @click="addContetByType('query',row)">
				            查看
				        </Button>
	          		</template>
	          		<template v-else>
		          		<Button
				            type="text"
				            size="small"
				            style="color:#2db7f5;margin-right: 5px" @click="addContetByType('edit',row)" v-if="row.heraldStatus == '未开始'">
				            编辑
				        </Button>
				        <Button
				            type="text"
				            size="small"
				            style="color:#2db7f5;margin-right: 5px" @click="deleteList(row)">
				            删除
				        </Button>
				        <Button
				            type="text"
				            size="small"
				            style="color:#2db7f5;margin-right: 5px" @click="addContetByType('query',row)">
				            查看
				        </Button>
				    </template>
	          	</template>
	          </Table>
	          	<!-- 分页器 -->
		      	<Row type="flex" justify="end" class="page">
			        <!-- show-total 显示总数 共{{ total }}条 -->
			        <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
			        <Page
			          show-total
			          show-elevator
			          :current="page.pageNum"
			          :page-size="page.pageSize"
			          :total="page.total"
			          @on-change="changeCurrent"
			        ></Page>
		      	</Row>
	        </Form>
	      </div>
	    </Drawer>
	    <!--优惠券弹窗-->
	    <Yhq :action="actionYhq"  @refresh="selectModuleContent"></Yhq>
	    <!--图片-->
	    <Img :action="actionImg" @refresh="selectModuleContent"></Img>
	</div>

</template>
<script>
	import UploadImage from "../components/UploadImage";
	import Yhq from "./yhq"
	import Img from "./img"
	import { postRequest } from "@/libs/axios";
	export default{
		components:{UploadImage,Yhq,Img},
		props: {
		    action: {
		      type: Object,
		      // 对象或数组默认值必须从一个工厂函数获取
		      default: () => ({ type: "add" })
		    }
		},
		data(){
			return{
				templateTitle:'',
				showTemplateDetail:false,
			    styles: {
			        height: "calc(100% - 55px)",
			        overflow: "auto",
			        paddingBottom: "53px",
			        position: "static"
			    },
			    formData:{
			        title:'',
			        type:'',
			        total:'',
			        template:'',
			        moduleId:'',
			        browsingId:''
			    },
			    columnsYhq:[{
			        title: "操作",
			        align: "center",
			        width: 180,
			        fixed: "right",
			        slot: "action"
			    },{
			        title: "主标题",
			        key: "mainTitle",
			        align: "center",
			        width: 140
			    },{
			        title: "副标题",
			        key: "subTitle",
			        align: "center",
			        width: 140
			    },{
			        title: "剩余库存",
			        key: "surplusCount",
			        align: "center",
			        width: 140
			    },{
			        title: "内容类型",
			        key: "contentType",
			        align: "center",
			        width: 140,
			        render:(h,params) =>{
			            switch (params.row.contentType) {
			                case 1:
			                    return h('span', '优惠券');
			                    break;
			                case 2:
			                    return h('span', '图片');
			                    break;
			            }
			        }
			    },{
			        title: "是否预告",
			        key: "isHerald",
			        align: "center",
			        width: 140,
			        render:(h,params) =>{
			            switch (params.row.isHerald) {
			                case 0:
			                    return h('span', '否');
			                    break;
			                case 1:
			                    return h('span', '是');
			                    break;
			            }
			        }
			    },{
			        title: "当前状态",
			        key: "heraldStatus",
			        align: "center",
			        width: 140
			    },{
			        title: "预告时间",
			        key: "heraldType",
			        align: "center",
			        width: 140,
			        //yGOptions:[{label:'全程预告',value:1},{label:'提前24小时',value:2},{label:'提前12小时',value:3}],
			        render:(h,params) =>{
			            switch (params.row.heraldType) {
			                case 1:
			                    return h('span', '全程预告');
			                    break;
			                case 2:
			                    return h('span', '提前24小时');
			                    break;
			                case 3:
			                    return h('span', '提前12小时');
			                    break;
			            }
			        }
			    },{
			        title: "领购时间",
			        key: "time",
			        align: "center",
			        width: 140,
			        render:(h,params) =>{
			            return h('span', params.row.startTime+'至'+params.row.endTime);
			        }
			    }],
			    columnsImg:[{
			        title: "操作",
			        align: "center",
			        width: 180,
			        fixed: "right",
			        slot: "action"
			    },{
			        title: "商品图片",
			        key: "imgUrl",
			        align: "center",
			        width: 140,
			        render:(h,params) =>{
			            return h('div', [
			                h('img', {
			                    attrs: {
			                        src: params.row.imgUrl
			                    },
			                    style: {
			                        width: '40px',
			                        height: '40px'
			                    }
			                }),
			            ]);
			        }
			    },{
			        title: "跳转类型",
			        key: "jumpType",
			        align: "center",
			        width: 140,
			        // urlTypeOptions:[{label:'内链',value:1},{label:'外链',value:2},{label:'优惠券',value:3},{label:'专题活动',value:4},{label:'抽奖团',value:5}],
			        render:(h,params) =>{
			            switch (params.row.jumpType) {
			                case 1:
			                    return h('span', '内链');
			                    break;
			                case 2:
			                    return h('span', '外链');
			                    break;
			                case 3:
			                    return h('span', '优惠券');
			                    break;
			                case 4:
			                    return h('span', '专题活动');
			                    break;
			                case 5:
			                    return h('span', '抽奖团');
			                    break;
			            }
			        }
			    },{
			        title: "是否预告",
			        key: "isHerald",
			        align: "center",
			        width: 140,
			        render:(h,params) =>{
			            switch (params.row.isHerald) {
			                case 0:
			                    return h('span', '否');
			                    break;
			                case 1:
			                    return h('span', '是');
			                    break;
			            }
			        }
			    },{
			        title: "当前状态",
			        key: "heraldStatus",
			        align: "center",
			        width: 140
			    },{
			        title: "预告时间",
			        key: "heraldType",
			        align: "center",
			        width: 140,
			        //yGOptions:[{label:'全程预告',value:1},{label:'提前24小时',value:2},{label:'提前12小时',value:3}],
			        render:(h,params) =>{
			            switch (params.row.heraldType) {
			                case 1:
			                    return h('span', '全程预告');
			                    break;
			                case 2:
			                    return h('span', '提前24小时');
			                    break;
			                case 3:
			                    return h('span', '提前12小时');
			                    break;
			            }
			        }
			    },{
			        title: "领购时间",
			        key: "time",
			        align: "center",
			        width: 140,
			        render:(h,params) =>{
			            return h('span', params.row.startTime+'至'+params.row.endTime);
			        }
			    }],
			    data:[],
			    page: {
			        pageNum: 1, //页码
			        pageSize: 10, //每页数量
			        total: 0 //数据总数
			    },
			    actionYhq:{
			    	_id: Math.random(),
			        type: "add",
			        data: null
			    },
			    actionImg:{
			    	_id: Math.random(),
			        type: "add",
			        data: null
			    },
			    page: {
			        pageNum: 1, //页码
			        pageSize: 10, //每页数量
			        total: 0 //数据总数
			    },
			    loading: false
			}
		},
		watch: {
		    action: {
		      handler(val, oldVal) {
		        let { type, data } = this.action;
		        this.showTemplateDetail = true;
		        this.formData.type = data.moduleType;
		        this.formData.moduleId = data.id;
		        this.formData.browsingId = data.browsingId;
		        if(type == 'query'){
		        	this.templateTitle = '查看模块内容'
		        }else{
		        	this.templateTitle = '编辑模块内容'
		        }
		        console.log("模块内容------");
		        console.log(data)
		        console.log("模块内容");
		        this.selectModuleContent()
		      },
		      deep: true
		    }
		},
		methods:{
			changeCurrent(pageNum) {
		      //this.queryTableData(pageNum);
		    },
		    async selectModuleContent(){
		    	//this.page.pageNum = pageNum || 1;
		    	this.loading = true;
		    	let {code ,msg,data } = await postRequest('/browsing/templateCoupon/selectModuleContent',{id:this.formData.moduleId,type:this.formData.type})
		    	if(code == 200){
		    		this.loading = false;
		    		this.data = data;
		    	}else{
		    		this.loading = false
		    		this.msgErr(code + " 数据加载失败!");
		    	}
		    },
		    addContetByType(type,data){
		    	//根据内容类型区别弹窗--1、优惠券--2、图片
		    	console.log(type)
		    	if(this.formData.type == ""){
		    		this.$Message.error("请选择内容类型！");
		    		return false
		    	}
		    	if(this.formData.type == 1){
		    		this.actionYhq = {
				        id: Math.random(),
				        type,
				        data:{
				        	type:this.formData.type,
				        	moduleId:this.formData.moduleId,//模板id
				        	browsingId:this.formData.browsingId ,//活动Id
				        	data:data
				        }
				    };
		    	}else{
		    		this.actionImg = {
		    			_id: Math.random(),
				        type,
				        data:{
				        	type:this.formData.type,
				        	moduleId:this.formData.moduleId,//模板id
				        	browsingId:this.formData.browsingId, //活动Id
				        	data:data
				        }
		    		}
		    	}
		    },
		    closeDialogYhq(){
		    	this.isYhq = false;
		    },
		    deleteList(row){
		    	this.$Modal.confirm({
                    title: '删除',
                    content: '<p>确认删除吗？</p>',
                    onOk: () => {
                  		postRequest('/browsing/templateCoupon/delete',{id:row.id,type:this.formData.type}).then(val =>{
                  			if(val.code == 200){
                  				this.msgOk('删除成功');
                  				this.selectModuleContent();
                  			}else{
                  				this.msgErr(msg)
                  			}
                  		})     
                    },
                    onCancel: () => {
                        
                    }
                });
		    },
		    backToMoudle(){
		    	this.showTemplateDetail = false;
		    	this.$emit('refresh')
		    },
		    // 全局提示
		    msgOk(txt) {
		      this.$Message.info({
		        content: txt,
		        duration: 3
		      });
		    },
		    msgErr(txt) {
		      this.$Message.error({
		        content: txt,
		        duration: 3
		      });
		    }
		}
	}
</script>
<style scoped lang="less">
.template-list{
  display: flex;
  align-items:center;
  .template-item{
    width: 100px; 
    text-align:center;
    margin-right:50px;
  }
  .img-wrap{
    height: 100px;
    border:1px #ddd solid; 
    img{
      max-width:100%;
      max-height:100%;
    }
  }
}
</style>