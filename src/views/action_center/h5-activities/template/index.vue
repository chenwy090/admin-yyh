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
	        <span>编辑模板内容</span>
	        <Button type="dashed" style="float:right" @click="showTemplateDetail = false">返回上一级</Button>
	      </div>
	      <div>
	        <Form
	          label-position="right"
	          ref="form"
	          :model="formData"
	          :label-width="100"
	        >
	          <FormItem label="模板标题：" prop="title">
	            <UploadImage v-model="formData.title"></UploadImage>
	          </FormItem>
	          <FormItem label="内容类型：" prop="type">
	             <RadioGroup v-model="formData.type">
	                <Radio label="1">优惠券</Radio>
	                <Radio label="2">图片</Radio>
	            </RadioGroup>
	            <div class="type-tips">请选择内容的展示方式</div>
	          </FormItem>
	          <FormItem label="" prop="template" style="margin-top:-24px;">
	            <RadioGroup v-model="formData.template">
	              <div class="template-list">
	                <div class="template-item">
	                  <p>样式一</p>
	                  <div class="img-wrap"><img src="../../../../assets/bg.jpg" /></div>
	                  <Radio label="1">&nbsp;</Radio>
	                </div>
	                <div class="template-item">
	                  <p>样式二</p>
	                  <div class="img-wrap"><img src="../../../../assets/bg.jpg" /></div>
	                  <Radio label="2">&nbsp;</Radio>
	                </div>
	                <div class="template-item">
	                  <p>样式三</p>
	                  <div class="img-wrap"><img src="../../../../assets/bg.jpg" /></div>
	                  <Radio label="3">&nbsp;</Radio>
	                </div>
	                <div class="template-item">
	                  <p>样式四</p>
	                  <div class="img-wrap"><img src="../../../../assets/bg.jpg" /></div>
	                  <Radio label="4">&nbsp;</Radio>
	                </div>
	              </div>
	            </RadioGroup>
	          </FormItem>
	          <FormItem label="库存：" prop="total">
	             <RadioGroup v-model="formData.total">
	                <Radio label="1">是</Radio>
	                <Radio label="2">否</Radio>
	            </RadioGroup>
	          </FormItem>
	          <FormItem label="内容选择：" prop="type">
	            <Button type="primary" size="small" @click="addContetByType('add',formData.type)">添加</Button>
	          </FormItem>
	          <Table :columns="columns" :data="data" border>
	          	<template slot-scope="{ row }" slot="action">
	          		<Button
			            type="text"
			            size="small"
			            style="color:#2db7f5;margin-right: 5px">
			            编辑
			        </Button>
			        <Button
			            type="text"
			            size="small"
			            style="color:#2db7f5;margin-right: 5px">
			            查看
			        </Button>
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
	    <Yhq :action="actionYhq"></Yhq>
	    <!--图片-->
	    <Img :action="actionImg"></Img>
	</div>

</template>
<script>
	import UploadImage from "../components/UploadImage";
	import Yhq from "./yhq"
	import Img from "./img"
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
			        template:''
			    },
			    columns:[{
			        title: "操作",
			        align: "center",
			        width: 180,
			        fixed: "right",
			        slot: "action"
			    },{
			        title: "序号",
			        key: "order",
			        align: "center",
			        width: 140
			    },{
			        title: "主标题",
			        key: "maintTitle",
			        align: "center",
			        width: 140
			    },{
			        title: "副标题",
			        key: "subTitle",
			        align: "center",
			        width: 140
			    },{
			        title: "剩余库存",
			        key: "total",
			        align: "center",
			        width: 140
			    },{
			        title: "内容类型",
			        key: "type",
			        align: "center",
			        width: 140
			    },{
			        title: "是否预告",
			        key: "isYG",
			        align: "center",
			        width: 140
			    },{
			        title: "当前状态",
			        key: "status",
			        align: "center",
			        width: 140
			    },{
			        title: "预告时间",
			        key: "yGtime",
			        align: "center",
			        width: 140
			    },{
			        title: "领购时间",
			        key: "time",
			        align: "center",
			        width: 140
			    }],
			    data:[{order:1,maintTitle:'主标题',subTitle:'副标题',total:10,type:'优惠券',isYG:'是',status:'待预告',yGtime:'提前24小时',time:''}],
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
			    }
			}
		},
		watch: {
		    action: {
		      handler(val, oldVal) {
		        let { type, data } = this.action;
		        this.showTemplateDetail = true;
		        console.log("xxxx");
		      },
		      deep: true
		    }
		},
		methods:{
			changeCurrent(pageNum) {
		      //this.queryTableData(pageNum);
		    },
		    addContetByType(type,data){
		    	//根据内容类型区别弹窗--1、优惠券--2、图片
		    	console.log(type)
		    	if(data == ""){
		    		this.$Message.error("请选择内容类型！");
		    		return false
		    	}
		    	if(data == 1){
		    		this.actionYhq = {
				        id: Math.random(),
				        type,
				        data
				    };
		    	}else{
		    		this.actionImg = {
		    			_id: Math.random(),
				        type,
				        data
		    		}
		    	}
		    },
		    closeDialogYhq(){
		    	this.isYhq = false;
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