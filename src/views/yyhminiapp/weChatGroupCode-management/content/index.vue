<template>
	<div>
		<Card>
			<Form inline :label-width="100">
				<FormItem label="二维码名称：" >
	        <Input
	          style="width:200px"
	          type="text"
	          v-model="searchData.name"
	          placeholder="请输入二维码名称关键字"
	          clearable
	        ></Input>
	      </FormItem>
	      <FormItem label="二维码状态：">
	        <Select v-model="searchData.status" clearable style="width:100px;">
	        	<Option v-for="(item,index) in statusOptions" :label="item.label" :value="item.value" :key="index"></Option>
	        </Select>
	      </FormItem>
	      <FormItem :label-width="0">
	        <Button type="primary" icon="ios-search" @click="queryTableData()">搜索</Button>
	        <!-- <Button icon="md-refresh" class="marginLeft20" @click="reset">重置</Button> -->
	      </FormItem>
			</Form>
			<Row type="flex" justify="start">
	      <Button type="primary" icon="md-add" @click="addOrEdit('add')" v-if="page.total < 30">增加入群二维码</Button>
	    </Row>
		</Card>
		<Card>
	    <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
	      <template slot-scope="{ row }" slot="action">
	      	<Button type="primary" size="small" class="btn-wechat" @click="addOrEdit('edit',row)" v-if="row.surplusTimes >= row.switchTimes">编辑</Button>
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
	  <addOrEdit :action="actionContent" @refresh="queryTableData"></addOrEdit>
	  <Modal title="查看二维码大图" v-model="visibleImg">
	    	<div class="fl-image-modal"><img :src="imgUrlView" ></div>
	    <div slot="footer"></div>
		</Modal>
	</div>
</template>
<script>
	import addOrEdit from "./addOrEdit";
	export default{
		name: "edit",
		components:{
			addOrEdit
		},
		props: {
			showEditStyle: {
		      type: Boolean,
		      default: false
		    },
		    action: {
		      type: Object,
		      // 对象或数组默认值必须从一个工厂函数获取
		      default: () => ({ type: "edit" })
		    }
		},
		watch: {
		    action: {
		      handler(val, oldVal) {
		      	console.log('fffffffffff')
		        let { type, data } = this.action;
		        this.flexibleQrcodeId = data.id;
		        console.log(data)
		        this.queryTableData();
		      },
		      deep: true,
		      immediate: true
		    }
		},
		data(){
			return{
				flexibleQrcodeId:"",
				searchData:{
					name:"",
					status:""
				},
				columns:[{
		        title: "操作",
		        align: "center",
		        width: 150,
		        fixed: "right",
		        slot: "action"
		    },
		    {
		        title: "二维码标题",
		        key: "name",
		        align: "center",
		        width: 200
		    },
		    {
		        title: "二维码ID",
		        key: "id",
		        align: "center",
		        width: 100
		    },
		    // beginTime/endTime
		    {
		        title: "二维码图片",
		        key: "wechatQrcode",
		        align: "center",
		        minWidth: 100,
		        render:(h,params) =>{
		            return h('div', [
		                h('img', {
		                    attrs: {
		                        src: params.row.wechatQrcode
		                    },
		                    style: {
		                        "max-width": '40px',
		                        "max-height": '40px'
		                    },
		                    on:{
		                        click:(e) =>{
		                            let _this = this;
		                            _this.handleView(e.srcElement.currentSrc)
		                        }
		                    }
		                }),
		            ]);
		        }
		    },
		    {
		        title: "切换频率",
		        key: "switchTimes",
		        align: "center",
		        minWidth: 120
		    },
		    // status
		    {
		        title: "剩余次数",
		        key: "surplusTimes",
		        align: "center",
		        minWidth: 120
		    },
		    {
		        title: "过期时间",
		        key: "expiredTime",
		        align: "center",
		        minWidth: 150
		    },
		    {
		        title: "状态",
		        key: "status",
		        align: "center",
		        minWidth: 80,
		        render:(h,params) =>{
		            switch (params.row.status) {
		                case 1:
		                    return h('span', '可用');
		                    break;
		                case 0:
		                    return h('span', '不可用');
		                    break;
		            }
		        }
		    }],
				tableData:[],
				loading:false,
				page: {
	        pageNum: 1, //页码
	        pageSize: 10, //每页数量
	        total: 0 //数据总数
	      },
	      actionContent:{
					title: "新增群二维码",
        	type: "add", //query/edit
        	data: null
				},
				statusOptions:[{label:"可用",value:1},{label:"不可用",value:0}],
				visibleImg:false,
				imgUrlView:""
			}
		},
		methods:{
			handleView(url) {
				let _this = this
			    _this.imgUrlView = url;
			    _this.visibleImg = true;
			},
			changeCurrent(pageNum) {
	      this.queryTableData(pageNum);
	    },
			async queryTableData(pageNum){
				this.page.pageNum = pageNum || 1;
      	//this.loading = true;
      	console.log('关联群二维码 刷新')
      	this.loading = true;
      	const {searchData:{name,status}} = this;
      	let params = {
      		flexibleQrcodeId:this.flexibleQrcodeId,
      		pageNum:this.page.pageNum,
      		pageSize:this.page.pageSize,
      		name:name.trim(),
      		status:status
      	}
      	let {code,msg,data} = await this.postRequest('/flexible/wechatQrcode/list',params)
      	if(code == 200){
      		this.loading = false;
      		this.tableData = data.list;
      		this.page.pageNum = data.pageNum;
      		this.page.pageSize = data.pageSize;
      		this.page.total = data.total;
      	}else{
      		this.loading = false;
      		this.$Message.error(msg)
      	}
			},
			reset(){

			},
			addOrEdit(type,data){
				this.actionContent = {
        	type, //query/edit
        	data,
        	flexibleQrcodeId:this.flexibleQrcodeId,
        	total:this.page.total
				}
			},
			deleteList(row){
	    	this.$Modal.confirm({
            title: '删除',
            content: '<p>确认删除吗？</p>',
            onOk: () => {
            	let formdata = new FormData();
            	formdata.append("id",row.id);
          		this.postRequest('/flexible/wechatQrcode/delete',formdata).then(val =>{
          			if(val.code == 200){
          				this.$Message.success('删除成功');
        					this.queryTableData();
          			}else{
          				this.$Message.error(val.msg);
          			}
          		})     
            },
            onCancel: () => {
                
            }
        });
	    },
		}
	}
</script>
<style scoped lang="less">
	.fl-image-modal{
		width:300px;
		height:300px;
		margin:0 auto;
		text-align:center;
		img{
			max-width:100%;
			max-height:100%;
		}
	}
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
