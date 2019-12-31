<template>
	<div v-if="isShow">
		<Modal
	      v-model="isShow"
	      :closable="true"
	      :mask-closable="false"
	      :styles="{top: '20px'}"
	      width="900"
	      title="优惠券列表"
	      @on-cancel="closeDialog"
	    >
	    	<Tabs type="card" @on-click="setTab">
	    		<TabPane label="超市券" name="yhqM">
	    			<div class="query-row">
				      	<Card :bordered="false" style="margin-bottom:2px">
					        <Form inline>
					          <!-- 商户/品牌名称 -->
						        <FormItem label="优惠券名称：" :label-width="100">
						            <Input
						              style="width:200px"
						              type="text"
						              v-model="searchData.name"
						              placeholder="请输入优惠券名称"
						              clearable
						            ></Input>
						        </FormItem>
						        <FormItem label="优惠券Id：" :label-width="80">
						            <Input
						              style="width:200px"
						              type="text"
						              v-model="searchData.id"
						              placeholder="请输入优惠券Id"
						              clearable
						            ></Input>
						        </FormItem>
						        <Button type="primary" icon="md-search" class="marginLeft20">搜索</Button>
					          	<Button icon="md-refresh" class="marginLeft20">重置</Button>
					        </Form>
				      	</Card>
				    </div>
				    <Card :bordered="false" style="margin-bottom:2px">
				    	<Table :columns="columnsYhq" :data="dataYhq" border>
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

	    		</TabPane>
	    		<TabPane label="周边券" name="yhqZ"></TabPane>
	    	</Tabs>
	    	<div slot="footer">
		        <Button type="error" size="large" @click="handleSubmit">确认</Button>
		        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
		      </div>
		</Modal>
		<!--优惠券的详细信息-->
		<Modal v-model="yhqDetail" :closable="true" :mask-closable="false" :styles="{top: '20px'}" width="500"  title="添加优惠券">
			<Form label-position="right"
	          ref="form"
	          :model="formData"
	          :label-width="100">
				<FormItem label="选择优惠券：" prop="name">
					<Input style="width:200px;margin-right:5px;display:inline-table;vertical-align:middle">
						<Button slot="append" @click="backToYhq">选择</Button>

					</Input>
					<span style="color:#ff5200">券当前剩余库存：1000</span>
				</FormItem>
				<FormItem label="主标题：" prop="mainTitle">
					<Input></Input>
				</FormItem>
				<FormItem label="副标题：" prop="subTitle">
					<Input></Input>
				</FormItem>
				<FormItem label="券图片：" prop="img">
					<UploadImage v-model="formData.img" style="display:inline-block;vertical-align:middle;margin-right:5px;"></UploadImage>
					<span>图片限JPG、PNG格式，1MB以内，建议比例1:1</span>
				</FormItem>
				<FormItem label="是否预告：" prop="isYg">
					<RadioGroup v-model="formData.isYg">
		                <Radio label="1">是</Radio>
		                <Radio label="2">否</Radio>
		            </RadioGroup>
		            <Select v-model="formData.isYgValue" v-if="formData.isYg == 1">
		            	<Option v-for="(item,index) in yGOptions" :value="item.value" :label="item.label" :key="index"></Option>
		            </Select>
				</FormItem>
				<FormItem label="领/购时间：" prop="subTitle">
					<DatePicker
		              type="datetimerange"
		              placeholder="请选时间"
		              format="yyyy-MM-dd HH:mm:ss"
		              style="display:inline-block;width: 300px"
		              :value="daterange"
		              @on-change="changeTime"
		            ></DatePicker>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button  style="margin-left: 8px">取消</Button>
		        <Button type="error" size="large">保存提交</Button>
		    </div>
		</Modal>
	</div>
</template>
<script>
	import UploadImage from "../components/UploadImage";
	export default{
		components:{
		    UploadImage
		},
		props: {
		    action: {
		      type: Object,
		      // 对象或数组默认值必须从一个工厂函数获取
		      default: () => ({ type: "add" })
		    }
		},
		watch: {
		    action: {
		      handler(val, oldVal) {
		        let { type, data } = this.action;
		        this.isShow = true;
		        console.log("xxxx");

		          
		      },
		      deep: true
		    }
  		},
		data(){
			return{
				searchData:{
					name:'',
					id:''
				},
				currentChoose:'',
				columnsYhq:[{
			        title: "选择",
			        align: "center",
			        width: 100,
			        render:(h,params) =>{
			        	let id = params.row.id;
			            let flag = false;
			            if (this.currentChoose === id) {
			                flag = true
			            } else {
			                flag = false
			            }
			            let self = this
			            return h('div', [
			                h('Radio', {
			                  props: {
			                    value: flag
			                  },
			                  on: {
			                    'on-change': () => {
			                      self.currentChoose = id;
			                    }
			                  }
			                })
			            ])
			        }   
			    },{
			        title: "优惠券Id",
			        key: "id",
			        align: "center",
			        width: 140
			    },{
			    	title:'优惠券名称',
			    	key:'name',
			    	align:"center"

			    }],
			    dataYhq:[{id:20191111,name:'超市券1'},{id:201911113,name:'超市券2'}],
			    page: {
			        pageNum: 1, //页码
			        pageSize: 10, //每页数量
			        total: 0 //数据总数
			    },
			    isShow:false,
			    yhqDetail:false,
			    formData:{
			    	beginTime:'',
			    	endTime:'',
			    	isYg:'',
			    	isYgValue:'',
			    	img:''
			    },
			    daterange: [],
			    yGOptions:[{label:'全程预告',value:1},{label:'提前24小时',value:2},{label:'提前12小时',value:3}]
			}
		},
		methods:{
			changeCurrent(pageNum) {

			},
			closeDialog(){
				this.isShow = false;
			},
			handleSubmit(){
				//显示优惠券的信息
				this.yhqDetail = true;
			},
			setTab(value){
				console.log(value)
			},
			changeTime(arr) {
		      // yyyy-MM-dd HH:mm:ss
		      console.log(arr);
		      let [beginTime, endTime] = arr;
		      this.formData.beginTime = beginTime;
		      this.formData.endTime = endTime;
		    },
		    backToYhq(){
		    	this.yhqDetail = false
		    }
		}
	}
</script>