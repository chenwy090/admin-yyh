<template>
	<div>
		<Card>
			<Form inline>
				<FormItem label="活码名称：" :label-width="80">
	        <Input
	          style="width:200px"
	          type="text"
	          v-model="searchData.name"
	          placeholder="请输入活码名称关键字"
	          clearable
	        ></Input>
	      </FormItem>
	      <FormItem label="活码备注：" :label-width="80">
	        <Input
	          style="width:200px"
	          type="text"
	          v-model="searchData.remark"
	          placeholder="请输入活码备注"
	          clearable
	        ></Input>
	      </FormItem>
	      <FormItem :label-width="0">
	        <Button type="primary" icon="ios-search" @click="queryTableData()">搜索</Button>
	        <!-- <Button icon="md-refresh" class="marginLeft20" @click="reset">重置</Button> -->
	      </FormItem>
			</Form>
			<Row type="flex" justify="start">
	      <Button type="primary" icon="md-add" @click="addOrEdit('add')">增加活码</Button>
	    </Row>
		</Card>
		<Card>
	      <!-- 1: 已上架、2：已下架 -->
	      <!-- <template slot-scope="{ row }" slot="action">
	      -->
	    <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
	      <template slot-scope="{ row }" slot="action">
	      	<Button type="primary" size="small" class="btn-wechat" @click="addOrEdit('edit',row)">编辑活码</Button>
	      	<Button type="primary" size="small" class="btn-wechat" @click="addOrEditContent('edit',row)" >编辑关联码</Button>
	      	<Button type="primary" size="small" class="btn-wechat" @click="downLoad('query',row)">下载活码</Button>
	      	<Button type="error" size="small" class="btn-wechat" @click="deleteList(row)">删除</Button>
	      </template>
	    </Table>
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
	  </Card>
	  <addOrEdit :action="action" @refresh="queryTableData"></addOrEdit>
	  <downLoad :action="actionDownLoad" @refresh="queryTableData"></downLoad>
	  <Drawer
      v-model="showEditJackpot"
      :closable="false"
      :mask-closable="false"
      width="1000"
      :styles="styles"
      @on-close="queryTableData"
    >
      <div slot="header" style="overflow:hidden;">
        <span style="line-height:32px;font-size:14px">活码关联群二维码管理 --- <em style="color:#2d8cf0;font-style:normal;">{{jackpotAction.title}}</em></span>
        <Button type="dashed" style="float:right" @click="back">返回上级</Button>
      </div>
      <template v-if="jackpotAction.type=='edit'">
        <Content
          v-if="showEditJackpot"
          :showEditJackpot.sync="showEditJackpot"
          :action="jackpotAction"
          @refresh="queryTableData"
        ></Content>
      </template>
    </Drawer>
	</div>
</template>
<script>
	import columns from "./columns";
	import addOrEdit from "./addOrEdit";
	import downLoad from "./downLoad";
	import Content from "../content";
	export default{
		components:{
			addOrEdit,
			downLoad,
			Content
		},
		data(){
			return{
				searchData:{
					name:"",
					remark:""
				},
				columns,
				tableData:[{name:'q',remark:"ss",num:1,todayNum:2,totalNum:4,residualNum:3}],
				loading:false,
				action:{
					title: "新增活码",
        	type: "add", //query/edit
        	data: null
				},
				actionDownLoad:{
					title:"下载活码",
					type:"query",
					data:null
				},
				jackpotAction: {
	        title: "",
	        type: "edit", //query/edit
	        data: null
	      },
	      styles: {
	        height: "calc(100% - 55px)",
	        overflow: "auto",
	        paddingBottom: "53px",
	        position: "static"
	      },
	      showEditJackpot: false,
	      page: {
	        pageNum: 1, //页码
	        pageSize: 10, //每页数量
	        total: 0 //数据总数
	      }
			}
		},
		created(){
			this.queryTableData()
		},
		methods:{
			changeCurrent(pageNum) {
	      this.queryTableData(pageNum);
	    },
			async queryTableData(pageNum){
				this.page.pageNum = pageNum || 1;
      	this.loading = true;
      	console.log('刷新');
      	const {searchData:{name,remark}} = this;
      	let params = {
      		pageNum:this.page.pageNum,
      		pageSize:this.page.pageSize,
      		remark:remark.trim(),
      		title:name.trim()
      	}
      	let {code,msg,data} = await this.postRequest('/flexible/qrcode/list',params);
      	if(code == 200){
      		this.loading = false;
      		this.tableData = data.records;
      		this.page.pageNum = data.current;
      		this.page.pageSize = data.size;
      		this.page.total = data.total;
      	}else{
      		this.loading = true;	
      	}
			},
			reset(){

			},
			addOrEdit(type,data){
				this.action = {
	        type,
	        data
	      };
			},
			downLoad(type,data){
				this.actionDownLoad = {
	        type,
	        data
	      };
			},
			addOrEditContent(type,data){
				this.showEditJackpot = true;
	      this.jackpotAction = {
	        title:data.title,
	        type,
	        data
	      };
			},
			back(){
				this.showEditJackpot = false;
				this.queryTableData()
			},
			deleteList(row){
	    	this.$Modal.confirm({
          title: '删除',
          content: '<p>确认删除吗？</p>',
          onOk: () => {
        		this.postRequest('/flexible/qrcode/delete',{id:row.id}).then(val =>{
        			if(val.code == 200){
        				this.$Message.success('删除成功');
        				this.queryTableData();
        			}else{
        				this.$Message.error(val.msg);
        			}
        		})     
          },
          onCancel: () => {}
      	})
	    }
		}
	}
</script>
<style scoped lang="less">
	.btn-wechat{
		margin:0 5px;
		&:first-child{
			margin-left:0
		}
		&:last-child{
			margin-right:0
		}
	}
</style>