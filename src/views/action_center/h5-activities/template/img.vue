<template>
	<div class="img-wrap" v-if="isShow">
		<Modal
	      v-model="isShow"
	      :closable="true"
	      :mask-closable="false"
	      :styles="{top: '20px'}"
	      width="500"
	      :title="imgTitle"
	      @on-cancel="closeDialogImgWrap"
	    >
	    	<template v-if="action.type == 'query'">
	    		<ul class="query-style-wrap">
			        <li class="qs-item">
			          <label class="label">商品图片：</label>
			          <div class="value">
			            <div class="img"><img :src="formData.img" /></div>
			          </div>
			        </li>
			        <li class="qs-item">
			          <label class="label">跳转类型：</label>
			          <div class="value">
			          	<template v-if="formData.urlType == 1">内链</template>
		            	<template v-if="formData.urlType == 2">外链</template>
		            	<template v-if="formData.urlType == 3">优惠券</template>
		            	<template v-if="formData.urlType == 4">专题活动</template>
		            	<template v-if="formData.urlType == 5">抽奖团</template>
			          </div>
			        </li>
			        <li class="qs-item" v-if="formData.urlType == 1 || formData.urlType == 2">
			          <label class="label">链接地址：</label>
			          <div class="value">
			          	{{formData.urlType1}}
			          </div>
			        </li>
			        <li class="qs-item" v-if="formData.urlType == 3 || formData.urlType == 4 ||  formData.urlType == 5">
			          <label class="label">
			          	<template v-if="formData.urlType == 3">优惠券Id：</template>
			          	<template v-if="formData.urlType == 4">专题Id：</template>
			          	<template v-if="formData.urlType == 5">抽奖团Id：</template>
			      	  </label>
			          <div class="value">
			          	{{formData.checkContentId}}
			          </div>
			        </li>
			        <li class="qs-item">
			          <label class="label">是否预告：</label>
			          <div class="value">
			          	<template v-if="formData.isYg == 0">否</template>
			          	 <!-- yGOptions:[{label:'全程预告',value:1},{label:'提前24小时',value:2},{label:'提前12小时',value:3}], -->
			            <template v-if="formData.isYg == 1">是&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			            	<template v-if="formData.isYgValue == 1">全程预告</template>
			            	<template v-if="formData.isYgValue == 2">提前24小时</template>
			            	<template v-if="formData.isYgValue == 3">提前12小时</template>
			            </template>
			          </div>
			        </li>
			        <li class="qs-item">
			          <label class="label">领/购时间：</label>
			          <div class="value">
			            {{formData.beginTime}} - {{formData.endTime}}
			          </div>
			        </li>
			    </ul>
	    	</template>
	    	<template v-else>
		    	<Form label-position="right"
		          ref="formWrap"
		          :model="formData"
		          :label-width="100">
		          	<FormItem label="商品图片：" prop="img" :rules="{required: true,message:'输入图片'}">
						<div style="display:inline-block;vertical-align:middle">
				            <UploadImage
				                  :fileUploadType="'img'"
				                  :defaultList="formData.defaultImgList"
				                  @remove="removeImg"
				                  @uploadSuccess="ImgUploadSuccess"
				            ></UploadImage>
				        </div>
						<span style="margin-left:10px;">图片限JPG、PNG格式，1MB以内，建议比例1:1</span>
					</FormItem>
					<FormItem label="跳转类型：" prop="urlType" :rules="{required: true,message:'跳转类型'}">
			            <Select v-model="formData.urlType" placeholder="请选择">
			            	<Option v-for="item in urlTypeOptions" :value="item.value" :label="item.label" :key="item.value"></Option>
			            </Select>
			            <!--内链外链需要输入条状的链接地址-->
			            <Input placeholder="请输跳转链接地址" v-model="formData.url" v-if="formData.urlType == 1 || formData.urlType == 2" style="margin-top:5px;"></Input>
			            <div class="urltype-change-wrap" v-if="formData.urlType == 3 || formData.urlType == 4 || formData.urlType == 5">
			            	<RadioGroup v-model="formData.urlType1" v-if="formData.urlType == 5">
				                <Radio v-for="(item,index) in groupTypeOption" :label="item.value" :key="index">{{item.label}}</Radio>
				            </RadioGroup>
				            <div>
			            		<span class="change-title">选择内容</span>&nbsp;&nbsp; {{formData.checkContentId}} &nbsp;&nbsp;<Button type="dashed" @click="addImgContent(formData.urlType)">请选择</Button>
			            	</div>
			            </div>
					</FormItem>
					<FormItem label="是否预告：" prop="isYg" :rules="{required: true,message:'是否预告'}">
						<RadioGroup v-model="formData.isYg">
			                <Radio v-for="(item,index) in isYgOption" :label="item.value" :key="index">{{item.label}}</Radio>
			            </RadioGroup>
			            <Select v-model="formData.isYgValue" v-if="formData.isYg == 1">
			            	<Option v-for="(item,index) in yGOptions" :value="item.value" :label="item.label" :key="index"></Option>
			            </Select>
					</FormItem>
					<FormItem label="领/购时间：" prop="beginTime" :rules="{required: true,  validator: validateTime}">
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
		    </template>
	        <div slot="footer">
	        	<Button  style="margin-left: 8px" @click="closeDialogImgWrap">取消</Button>
				<Button type="error"  @click="handleSubmit('formWrap')" v-if="action.type != 'query'">保存提交</Button>
				
		    </div>
		</Modal>
		<Modal v-model="isShowImg" :closable="false"
	      :mask-closable="false"
	      :styles="{top: '20px'}"
	      width="800"
	      title="内容选择">
	      	<div class="search-wrap" v-if="formData.urlType == 3">
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
						              v-model="searchDataYhq.name"
						              placeholder="请输入优惠券名称"
						              clearable
						            ></Input>
						        </FormItem>
						        <FormItem label="优惠券Id：" :label-width="80">
						            <Input
						              style="width:200px"
						              type="text"
						              v-model="searchDataYhq.id"
						              placeholder="请输入优惠券Id"
						              clearable
						            ></Input>
						        </FormItem>
						        <Button type="primary" icon="md-search" class="marginLeft20" @click="queryCouponList()">搜索</Button>
					          	<Button icon="md-refresh" class="marginLeft20" click="reset" @click="reset('yhq')">重置</Button>
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
	    		<TabPane label="周边券" name="yhqZ">
	    			<div class="query-row">
					      	<Card :bordered="false" style="margin-bottom:2px">
						        <Form inline>
						          <!-- 商户/品牌名称 -->
							        <FormItem label="优惠券名称：" :label-width="100">
							            <Input
							              style="width:200px"
							              type="text"
							              v-model="searchDataYhq.name"
							              placeholder="请输入优惠券名称"
							              clearable
							            ></Input>
							        </FormItem>
							        <FormItem label="优惠券Id：" :label-width="80">
							            <Input
							              style="width:200px"
							              type="text"
							              v-model="searchDataYhq.id"
							              placeholder="请输入优惠券Id"
							              clearable
							            ></Input>
							        </FormItem>
							        <Button type="primary" icon="md-search" class="marginLeft20" @click="queryCouponList()">搜索</Button>
						          	<Button icon="md-refresh" class="marginLeft20" click="reset"  @click="reset('yhq')">重置</Button>
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
	    	</Tabs>	
	      	</div>
			<div class="search-wrap" v-else>
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
			        <Button type="primary" icon="md-search" class="marginLeft20" @click="operationInfoList">搜索</Button>
					<Button icon="md-refresh" class="marginLeft20"  @click="reset('ddd')">重置</Button>
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
			            	<Option v-for="(item,index) in statusOption" :label="item.label" :value="item.value" :key="index"></Option>
			            </Select>
			        </FormItem>
			        <Button type="primary" icon="md-search" class="marginLeft20" @click="drawDailyGroupList">搜索</Button>
					<Button icon="md-refresh" class="marginLeft20"  @click="reset('ddd')">重置</Button>
					
				</Form>
				<Table :columns="columns" :data="data" border :loading="loading"></Table>
				<Row type="flex" justify="end" class="page">
			        <!-- show-total 显示总数 共{{ total }}条 -->
			        <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
			        <Page
			          show-total
			          show-elevator
			          :current="page.pageNum"
			          :page-size="page.pageSize"
			          :total="page.total"
			          @on-change="changeCurrent1"
			        ></Page>
		      	</Row>
			</div>
			
			
			<div slot="footer">
				<Button type="error" size="large" @click="saveModalByUrlType(formData.urlType)">保存</Button>
				<Button  style="margin-left: 8px" @click="closeDialogImg">关闭</Button>
		        
		    </div>
		</Modal>
		<!-- <Yhq></Yhq> -->
	</div>
</template>
<script>
	import { createNamespacedHelpers } from "vuex";
	const { mapMutations, mapGetters } = createNamespacedHelpers("template");
	import UploadImage from "../components/UploadImage";
	import Yhq from "./yhq"
	import { postRequest } from "@/libs/axios";
	export default{
		components:{
		    UploadImage,
		    Yhq
		},
		computed: {
		    ...mapGetters({
		      // 映射 `this.activityId` 为 `store.getters.getActivityId`
		      activityId: "getActivityId"
		    })
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
		        this.moduleId = data.moduleId;
		        this.browsingId = data.browsingId;
		        if(type == 'add'){
		        	this.imgTitle = '增加图片';
		        	this.daterange = [];
		        	this.url = "/browsing/templateImg/add";
		        }else if(type == 'edit'){
		        	this.imgTitle = '编辑图片';
		        	this.setFormDataValue(data.data)
		        	this.url = "/browsing/templateImg/edit";
		        }else if(type == 'query'){
		        	this.imgTitle = '查看图片';
		        	this.setFormDataValue(data.data)
		        }
		       
		        console.log("图片内容类型");
		        console.log(data.data)
		       
		          
		      },
		      deep: true
		    }
  		},
  		data(){
			return{
				url:'',
				imgTitle:'',
				browsingId:'',
				moduleId:'',
				isShow:false,
				formData:{
					id:'',
					img:'',
					urlType:'',
					url:'',
					urlType1:'', //1抽奖团还是2抽奖广场
					defaultImgList:[],
					beginTime:'',
					endTime:'',
					isYg:'',
					checkContentId:'',
					isYgValue:''
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
				statusOption:[{label:'未开始',value:1},{label:'进行中',value:2},{label:'已开奖',value:3},{label:'已结束',value:4}],
				daterange:[],
				yGOptions:[{label:'全程预告',value:1},{label:'提前24小时',value:2},{label:'提前12小时',value:3}],
				loading: false,
				isYgOption:[{label:'不预告',value:0},{label:'预告',value:1}],
				groupTypeOption:[{label:'抽奖团',value:1},{label:'抽奖广场',value:2}],
				searchDataYhq:{
					name:'',
					id:'',
					type:1
				},
				columnsYhq:[{
			        title: "选择",
			        align: "center",
			        width: 100,
			        render:(h,params) =>{
			        	let id = params.row.templateId;
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
			                      self.currentTableRow = params.row;
			                    }
			                  }
			                })
			            ])
			        }   
			    },{
			        title: "优惠券Id",
			        key: "templateId",
			        align: "center",
			        width: 140
			    },{
			    	title:'优惠券名称',
			    	key:'couponName',
			    	align:"center"

			    }],
			    dataYhq:[],
			    page: {
			        pageNum: 1, //页码
			        pageSize: 10, //每页数量
			        total: 0 //数据总数
			    },
			    page1: {
			        pageNum: 1, //页码
			        pageSize: 10, //每页数量
			        total: 0 //数据总数
			    },
			}
		},
		methods:{
			changeCurrent(pageNum) {
				this.queryCouponList(pageNum)
			},
			changeCurrent1(pageNum){
				this.operationInfoList(pageNum)
			},
			closeDialog(){

			},
			removeImg() {
		        this.formData.img = "";
		        this.formData.defaultImgList = [];
			},
			ImgUploadSuccess({ imgUrl }) {
			    this.formData.img = imgUrl;
			    this.formData.defaultImgList = [{ imgUrl }];
			},
			addImgContent(type){
				
				if(type == 4){
					this.isShowImg = true;
					let columns = [{
				        title: "选择",
				        align: "center",
				        width: 100,
				        render:(h,params) =>{
				        	let id = params.row.operationId;
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
				        key: "operationId",
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
				    ///browsing/templateInfo/operationInfo/list
				    this.columns = columns;
				   	this.operationInfoList();
				   	this.currentChoose = "";
					
					
					
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
				        key: "name",
				        align: "center"
				    },{
				    	title:'广告主',
				    	key:'advertName',
				    	align:"center"

				    }]
					this.columns = columns;
					///browsing/templateInfo/drawDailyGroup/list
					this.drawDailyGroupList();
				   	this.currentChoose = "";
				}else if(type == 3){
					//优惠券
					this.isShowImg = true;
					this.currentChoose = "";
					this.queryCouponList()
				}
			},
			saveModalByUrlType(type){
				console.log(type)
				console.log(this.currentChoose);
				this.formData.checkContentId = this.currentChoose;
				this.isShowImg = false;
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
		    	if(this.$refs.formWrap){
		    		this.$refs['formWrap'].resetFields();
		    	}
		    	this.isShow = false;
		    	this.$emit('refresh');
		    },
		    setFormDataValue(data){
		    	//回显
		    	const {id,templateId,mainTitle,subTitle,surplusCount,contentType,isHerald,heraldStatus,heraldType,startTime,endTime,jumpType,imgUrl,operationId,groupId,groupType,linkUrl} = data;
		    	let __id = "";
		    	if(jumpType == 3){
		    		__id = templateId
		    	}else if(jumpType == 4){
		    		__id = operationId;
		    	}else if(jumpType == 5){
		    		__id = groupId;
		    	}
		    	this.formData = {
					id:id,
					img:imgUrl,
					urlType:jumpType,
					url:linkUrl,
					urlType1:groupType, //1抽奖团还是2抽奖广场
					defaultImgList:[{imgUrl:imgUrl}],
					beginTime:startTime,
					endTime:endTime,
					isYg:isHerald,
					isYgValue:heraldType,
					checkContentId:__id
				};
				this.daterange = [startTime,endTime]
		    },
		    handleSubmit(name){
      			this.$refs[name].validate(async valid => {
        			if (valid) {
        				const {formData:{img,urlType,url,urlType1,beginTime,endTime,id,isYg,isYgValue},browsingId} = this;
        				let params = {
        					browsingId:this.browsingId,
        					id:id,
        					imgUrl:img,
        					isHerald:isYg,
        					jumpType:urlType,
        					linkUrl:url,
        					moduleId:this.moduleId,
        					startTime:beginTime,
        					heraldType:isYg == 0 ? '' : isYgValue,
        					endTime:endTime,
        					isDelete:0
        				};
        				if(urlType == 3){
        					if(this.formData.checkContentId == ""){
        						this.msgErr('请选择跳转的优惠券')
        						return false
        					}
        					params.couponType = this.searchDataYhq.type;
        					params.couponId = this.formData.checkContentId;
        				}else if(urlType == 4){
        					if(this.formData.checkContentId == ""){
        						this.msgErr('请选择跳转的专题')
        						return false
        					}
        					params.operationId = this.formData.checkContentId;
        				}else if(urlType == 5){
        					if(this.formData.checkContentId == ""){
        						this.msgErr('请选择跳转的抽奖团')
        						return false
        					}
        					params.groupType = this.formData.urlType1;
        					params.groupId = this.formData.checkContentId;
        				}else{
        					if(url == ""){
        						this.msgErr('请输入跳转地址')
        						return false
        					}
        				}
        				console.log(params)
        				let { code, msg } = await postRequest(this.url, params);
        				if(code == 200){
        					this.msgOk("保存成功");
		    				this.$refs['formWrap'].resetFields();
		    				this.isShow = false;
		    				this.formData.checkContentId = "";
		    				this.$emit("refresh");
        				}else{
        					this.msgErr(msg);
        				}
        			}else{
        				this.$Message.error("数据验证失败！");
        			}
        		})
       		},
       		async operationInfoList(pageNum){
    //    			console.log(pageNum)
				// this.page1.pageNum = pageNum || 1;
				// this.page1 = {
			 //        pageNum: pageNum || 1, //页码
			 //        pageSize: 10, //每页数量
			 //        total: 0 //数据总数
			 //    }
			 	console.log('搜索专题')
			  
      			this.loading = true;
				const {searchData:{name}} = this;
				let params = {
					name:name,
					pageNum:this.page.pageNum,
					pageSize:this.page.pageSize
				}

				//return false
				let {code,msg,data,current,total,size} = await postRequest('/browsing/templateInfo/operationInfo/list',params);
				if(code == 200){
					this.loading = false;
					this.data = data.records;
					this.page.pageNum = data.current; //分页查询起始记录
          			this.page.total = data.total; //列表总数
          			this.page.pageSize = data.size; //每页数据
				}else{
					this.loading = false;
					this.data = [];
					this.msgErr(code + " 数据加载失败!");
				}
			},
			async drawDailyGroupList(pageNum){
				this.page.pageNum = pageNum || 1;
      			this.loading = true;
				const {searchData:{name1,status}} = this;
				let params = {
					name:name1,
					pageNum:this.page1.pageNum,
					pageSize:this.page1.pageSize,
					status:status
				}
				console.log(params)
				let {code,msg,data,current,total,size} = await postRequest('/browsing/templateInfo/drawDailyGroup/list',params);
				if(code == 200){
					this.loading = false;
					this.data = data.records;
					this.page.pageNum = data.current; //分页查询起始记录
          			this.page.total = data.total; //列表总数
          			this.page.pageSize = data.size; //每页数据
				}else{
					this.loading = false;
					this.data = [];
					this.msgErr(code + " 数据加载失败!");
				}
			},
       		async queryCouponList(pageNum){
				this.page.pageNum = pageNum || 1;
      			this.loading = true;
				const {searchDataYhq:{name,id,type}} = this;
				let params = {
					couponName:name.trim(),
					templateId:id.trim(),
					couponType:type,
					pageNum:this.page.pageNum,
					pageSize:this.page.pageSize
				}
				let {code,msg,data,current,total,size} = await postRequest('/browsing/templateCoupon/list',params);
				if(code == 200){
					if(data.dataList == null){
						this.dataYhq = [];
						this.page = {
					        pageNum: 1, //页码
					        pageSize: 10, //每页数量
					        total: 0 //数据总数
					    };
						return false
					}
					this.dataYhq = data.dataList;
					this.page.pageNum = data.pageNum; //分页查询起始记录
          			this.page.total = data.totalCount; //列表总数
          			this.page.pageSize = data.pageSize; //每页数据
				}else{
					this.dataYhq = [];
					this.msgErr(code + " 数据加载失败!");
				}
			},
       		setTab(value){
				this.currentChoose = '';
				if(value == 'yhqM'){
					this.searchDataYhq.type = 1;
					this.searchDataYhq.name = "";
					this.searchDataYhq.id = "";
					this.page.pageSize = 10;
					this.columnsYhq.pop();
					this.queryCouponList();
				}else{
					this.searchDataYhq.type = 2;
					this.searchDataYhq.name = "";
					this.searchDataYhq.id = "";
					this.page.pageSize = 10;
					this.columnsYhq.push({title:'有效期',
			    	key:'useEndDate',
			    	align:"center"})
			    	this.queryCouponList();
				}
			},
			reset(type) {
		      this.daterange = [];
		      // 重置查询参数
		      if(type == 'yhq'){
		      	this.searchDataYhq = {
					name:'',
					id:'',
					type:1
				};
		      	this.page = {
			        pageNum: 1, //页码
			        pageSize: 10, //每页数量
			        total: 0 //数据总数
			    };
			    this.queryCouponList();
		      }else if(type == 'ddd'){
		      	this.searchData = {
					name:'',
					name1:'',
					status:'',
					isYg:'',
					isYgValue:'',
					beginTime:'',
					endTime:''
				};
				this.page = {
			        pageNum: 1, //页码
			        pageSize: 10, //每页数量
			        total: 0 //数据总数
			    };
		      	this.page1 = {
			        pageNum: 1, //页码
			        pageSize: 10, //每页数量
			        total: 0 //数据总数
			    };
			    if(this.formData.urlType == 4){
			    	this.operationInfoList()
			    }else if(this.formData.urlType == 5){
			    	this.drawDailyGroupList();
			    }
		      }
		      
		      

		      //重新查询一遍
		      //this.queryTableData();
		    },
		    validateTime(rule, value, callback) {
		        this.$nextTick(_=>{
		            let beginTime = this.formData.beginTime;
		            let endTime = this.formData.endTime;
		            if (beginTime == "" || endTime == "") {
		                return callback('时间不能为空');
		            }
		            beginTime = new Date(beginTime);
		            endTime = new Date(endTime);
		            // if (beginTime < new Date()) {
		            //     return callback(`开始时间不能小于当前时间`);
		            // }
		            if (endTime < new Date()) {
		                return callback(`开始时间不能小于当前时间`);
		            }
		            if (beginTime >= endTime) {
		                return callback(`结束时间必须大于开始时间`);
		            }
		            callback();
		        });

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
 	};
</script>
<style scoped lang="less">
	.urltype-change-wrap{
		margin-top:5px;
		.change-title{
			margin-right:10px;
		}
	}
	.query-style-wrap{
	    .qs-item{
	      display:flex;
	      padding:10px 0;
	      align-items:center;
	    }
	    .label{
	      width:100px;
	    }
	    .value{
	      flex:1;
	      .img{
	        width:100px;
	        height:100px;
	        border:1px #ddd solid;
	        line-height:100px;
	      }
	      img{
	        width:100%;
	        vertical-align:middle;
	      }
	    }
	}
</style>