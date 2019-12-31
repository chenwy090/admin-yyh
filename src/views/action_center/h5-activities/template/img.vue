<template>
	<div class="img-wrap" v-if="isShow">
		<Modal
	      v-model="isShow"
	      :closable="true"
	      :mask-closable="false"
	      :styles="{top: '20px'}"
	      width="500"
	      title="增加图片"
	      @on-cancel="closeDialogImgWrap"
	    >
	    	<Form label-position="right"
	          ref="formWrap"
	          :model="formData"
	          :label-width="100">
	          	<FormItem label="商品图片：" prop="img">
					<UploadImage v-model="formData.img" style="display:inline-block;vertical-align:middle;margin-right:5px;"></UploadImage>
					<span>图片限JPG、PNG格式，1MB以内，建议比例1:1</span>
				</FormItem>
				<FormItem label="跳转类型：" prop="urlType">
		            <Select v-model="formData.urlType" placeholder="请选择">
		            	<Option v-for="item in urlTypeOptions" :value="item.value" :label="item.label" :key="item.value"></Option>
		            </Select>
		            <!--内链外链需要输入条状的链接地址-->
		            <Input placeholder="请输跳转链接地址" v-model="formData.url" v-if="formData.urlType == 1 || formData.urlType == 2" style="margin-top:5px;"></Input>
		            <div class="urltype-change-wrap" v-if="formData.urlType == 3 || formData.urlType == 4 || formData.urlType == 5">
		            	<RadioGroup v-model="formData.urlType1" v-if="formData.urlType == 5">
			                <Radio label="1">抽奖团</Radio>
			                <Radio label="2">抽奖广场</Radio>
			            </RadioGroup>
			            <div>
		            		<span class="change-title">选择内容</span><Button type="dashed" @click="addImgContent(formData.urlType)">请选择</Button>
		            	</div>
		            </div>
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
				<FormItem label="领/购时间：">
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
	        	<Button  style="margin-left: 8px" @click="closeDialogImgWrap">取消</Button>
				<Button type="error" size="large">保存提交</Button>
				
		    </div>
		</Modal>
		<Modal v-model="isShowImg" :closable="false"
	      :mask-closable="false"
	      :styles="{top: '20px'}"
	      width="800"
	      title="内容选择">
			<div class="search-wrap">
				<Form inline v-if="formData.urlType == 4">
					 <FormItem label="专题内容名称：" :label-width="100">
			            <Input
			              style="width:200px"
			              type="text"
			              v-model="searchData.name"
			              placeholder="请输入专题内容名称"
			              clearable
			            ></Input>
			        </FormItem>
			        <Button type="primary" icon="md-search" class="marginLeft20">搜索</Button>
					<Button icon="md-refresh" class="marginLeft20">重置</Button>
				</Form>
				<Form inline v-if="formData.urlType == 5">
					 <FormItem label="抽奖团名称：" :label-width="100">
			            <Input
			              style="width:200px"
			              type="text"
			              v-model="searchData.name1"
			              placeholder="请输入专题内容名称"
			              clearable
			            ></Input>
			        </FormItem>
			        <FormItem label="状态：" :label-width="100">
			            <Select
			              style="width:80px"
			              v-model="searchData.status"
			              placeholder="请选择"
			              clearable
			            >
			            	<Option v-for="(item,index) in statusOption" :label="item.label" :vaule="item.value" :key="index"></Option>
			            </Select>
			        </FormItem>
			        <Button type="primary" icon="md-search" class="marginLeft20">搜索</Button>
					<Button icon="md-refresh" class="marginLeft20">重置</Button>
					
				</Form>
			</div>
			<Table :columns="columns" :data="data" border :loading="loading"></Table>
			
			<div slot="footer">
				<Button type="error" size="large">保存</Button>
				<Button  style="margin-left: 8px" @click="closeDialogImg">关闭</Button>
		        
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
		        console.log("图片内容类型");

		          
		      },
		      deep: true
		    }
  		},
  		data(){
			return{
				isShow:false,
				formData:{
					img:'',
					urlType:'',
					url:'',
					urlType1:'' //1抽奖团还是2抽奖广场
				},
				urlTypeOptions:[{label:'内链',value:1},{label:'外链',value:2},{label:'优惠券',value:3},{label:'专题活动',value:4},{label:'抽奖团',value:5}],
				isShowImg:false,
				searchData:{
					name:'',
					name1:'',
					status:'',
					isYg:'',
					isYgValue:'',
					beginTime:'',
					endTime:''
				},
				columns:[],
				data:[],
				statusOption:[{label:'未开始',value:1}],
				daterange:[],
				yGOptions:[{label:'全程预告',value:1},{label:'提前24小时',value:2},{label:'提前12小时',value:3}],
				loading: false
			}
		},
		methods:{
			closeDialog(){

			},
			addImgContent(type){
				
				if(type == 4){
					this.isShowImg = true;
					let columns = [{
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
				        title: "专题ID",
				        key: "id",
				        align: "center"
				    },{
				    	title: "状态",
				        key: "status",
				        align: "center"
				    },{
				    	title:'专题内容名称',
				    	key:'name',
				    	align:"center"

				    }]
					this.columns = columns;
					let data = [{id:2019999,status:'已上架',name:'双蛋活动预热'}]
					this.data = data;
				}else if(type == 5){
					//抽奖团
					if(this.formData.urlType1 == ""){
						return false
					}
					this.isShowImg = true;
					let columns = [{
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
				        title: "抽奖团名称",
				        key: "title",
				        align: "center"
				    },{
				    	title:'广告主',
				    	key:'name',
				    	align:"center"

				    }]
					this.columns = columns;
					let data = [{title:2019999,name:'双蛋活动预热'}]
					this.data = data;
				}
			},
			closeDialogImg(){
				this.isShowImg = false
			},
			changeTime(arr) {
		      // yyyy-MM-dd HH:mm:ss
		      console.log(arr);
		      let [beginTime, endTime] = arr;
		      this.formData.beginTime = beginTime;
		      this.formData.endTime = endTime;
		    },
		    closeDialogImgWrap(){
		    	this.$refs['formWrap'].resetFields();
		    	this.isShow = false;
		    }
		}
 	};
</script>
<style scoped lang="less">
	.urltype-change-wrap{
		margin-top:5px;
		.change-title{
			margin-right:10px;
		}
	}
</style>