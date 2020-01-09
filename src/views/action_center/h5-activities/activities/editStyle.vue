<template>
	<div class="edit-style">
		<Tabs type="card" v-model="editStyleName">
			<TabPane label="版头设置" name="header">
				<Form :model="headerForm" :rules="ruleValidateHeader" ref="headerForm" class="form-wrap" :label-width="80" v-if="action.type == 'edit'">
					<FormItem prop="img" label=" ">
						<div style="display:inline-block;vertical-align:middle">
							<UploadImage
				                :fileUploadType="'img'"
				                :defaultList="headerForm.defaultImgList"
				                @remove="removeImg('headerForm')"
				                @uploadSuccess="ImgUploadSuccess('headerForm',$event)"
				            ></UploadImage>
						</div>
						<span style="margin-left:10px;">限JPG、PNG格式，2MB以内，宽度建议 750px</span>
					</FormItem>
					<FormItem class="form-btn">
						<Button @click="cancelTemplateStyle('headerForm')">取消</Button>
						<Button type="primary" class="save" @click="saveTemplateStyle('headerForm',1)">保存提交</Button>
					</FormItem>
				</Form>
				<ul class="query-style-wrap" v-if="action.type == 'query'">
					<li class="qs-item">
						<label class="label">版头图片：</label>
						<div class="value">
							<div class="img"><img :src="headerForm.img" /></div>
						</div>
					</li>
				</ul>
			</TabPane>
			<TabPane label="页尾设置" name="footer">
				<Form :model="footerForm" :rules="ruleValidateFooter" ref="footerForm" class="form-wrap" :label-width="80" v-if="action.type == 'edit'">
					<FormItem prop="img" label=" ">
						<div style="display:inline-block;vertical-align:middle">
							<UploadImage
				                :fileUploadType="'img'"
				                :defaultList="footerForm.defaultImgList"
				                @remove="removeImg('footerForm')"
				                @uploadSuccess="ImgUploadSuccess('footerForm',$event)"
				            ></UploadImage>
						</div>
						<span style="margin-left:10px;">限JPG、PNG格式，1MB以内，宽度建议 ？px</span>
					</FormItem>
					<FormItem class="form-btn">
						<Button @click="cancelTemplateStyle('footerForm')">取消</Button>
						<Button type="primary" class="save" @click="saveTemplateStyle('footerForm',2)">保存提交</Button>
					</FormItem>
				</Form>
				<ul class="query-style-wrap" v-if="action.type == 'query'">
					<li class="qs-item">
						<label class="label">页尾图片：</label>
						<div class="value">
							<div class="img"><img :src="footerForm.img" /></div>
						</div>
					</li>
				</ul>
			</TabPane>
			<TabPane label="背景设置" name="body">
				<Form :model="bodyForm" :rules="ruleValidateBody" ref="bodyForm" class="form-wrap" :label-width="80" v-if="action.type == 'edit'">
					<FormItem prop="type" label=" ">
						<RadioGroup v-model="bodyForm.type">
			                <Radio v-for="(item,index) in backgroundTypeOption" :label="item.value" :key="index">{{item.label}}</Radio>
			            </RadioGroup>
					</FormItem>
					<FormItem prop="img" label=" " v-if="bodyForm.type == 2">
						<div style="display:inline-block;vertical-align:middle">
							<UploadImage
				                :fileUploadType="'img'"
				                :defaultList="bodyForm.defaultImgList"
				                @remove="removeImg('bodyForm')"
				                @uploadSuccess="ImgUploadSuccess('bodyForm',$event)"
				            ></UploadImage>
						</div>
						<span style="margin-left:10px;">限JPG、PNG格式，1MB以内，宽度建议 ？px</span>
					</FormItem>
					<FormItem prop="rgb" label=" " v-if="bodyForm.type == 1">
						<Input v-model="bodyForm.rgb"></Input>
					</FormItem>
					<FormItem class="form-btn">
						<Button @click="cancelTemplateStyle('bodyForm')">取消</Button>
						<Button type="primary" class="save" @click="saveTemplateStyle('bodyForm',3)">保存提交</Button>
					</FormItem>
				</Form>
				<ul class="query-style-wrap" v-if="action.type == 'query'">
					<li class="qs-item">
						<label class="label">设置类型：</label>
						<div class="value">
							<RadioGroup v-model="bodyForm.type">
				                <Radio v-for="(item,index) in backgroundTypeOption" :label="item.value" :key="index">{{item.label}}</Radio>
				            </RadioGroup>
						</div>
					</li>
					<li class="qs-item" v-if="bodyForm.type == 1">
						<label class="label">背景颜色：</label>
						<div class="value">
							{{bodyForm.rgb}}
						</div>
					</li>
					<li class="qs-item"  v-if="bodyForm.type == 2">
						<label class="label">背景图片：</label>
						<div class="value">
							<div class="img"><img :src="bodyForm.img" /></div>
						</div>
					</li>
				</ul>
			</TabPane>
		</Tabs>
	</div>
</template>
<script>
	import { postRequest } from "@/libs/axios";
	import UploadImage from "../components/UploadImage";
	export default{
		name: "edit",
		components:{
		    UploadImage
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
		        let { type, data } = this.action;

		        data = JSON.parse(JSON.stringify(data));
		        //this.activityId = data.id;

		        //this.queryTableData();
		        

		        if (type == "query") {
		        	//查看活动样式
		        	this.activityId = data.id;
		        	this.url = '/browsing/templateInfo/design/get';
		        	this.queryStyle()
		        } else if (type == "edit") {
		        	//编辑模板样式
		        	this.activityId = data.id;
		        	this.url = '/browsing/templateInfo/design/get';
		        	this.queryStyle()
		        	

		        }
		      },
		      deep: true,
		      immediate: true
		    }
		},
		data(){
			return{
				designType:1,//1是版头设置 2页尾设置 3背景设置
				url:'',
				activityId:'',
				editStyleName:'header',
				headerForm:{
					img:'',
					defaultImgList:[]
				},
				ruleValidateHeader:{
					img:[{required: true,message:'限JPG、PNG格式，2MB以内，宽度建议 750px',trigger: 'blur'}]
				},
				footerForm:{
					img:'',
					defaultImgList:[]
				},
				ruleValidateFooter:{
					img:[{required: true,message:'限JPG、PNG格式，1MB以内，宽度建议 ？px',trigger: 'blur'}]
				},
				bodyForm:{
					type:'',
					img:'',
					rgb:'',
					defaultImgList:[]
				},
				ruleValidateBody:{
					type:[{required: true,message:'选择背景类型'}],
					rgb:[{required: true,message:'请输入rgb色值'}],
					img:[{required: true,message:'限JPG、PNG格式，1MB以内，宽度建议 ？px'}]
				},
				backgroundTypeOption:[{label:'填色值',value:1},{label:'传图片',value:2}]
			}
		},
		methods:{
			removeImg(name) {
				if(name == 'headerForm'){
			      	this.headerForm.img = "";
			      	this.headerForm.defaultImgList = [];
			    }else if(name == 'footerForm'){
			    	this.footerForm.img = "";
			    	this.footerForm.defaultImgList = [];
			    }else if(name == 'bodyForm'){
			    	this.bodyForm.img = "";
			    	this.bodyForm.defaultImgList = [];
			    }
		    },
		    ImgUploadSuccess(name,{ imgUrl }) {
		    	if(name == 'headerForm'){
		      		this.headerForm.img = imgUrl;
		      		this.headerForm.defaultImgList = [{ imgUrl }];
		      	}else if(name == 'footerForm'){
		      		this.footerForm.img = imgUrl;
		      		this.footerForm.defaultImgList = [{imgUrl}];
		      	}else if(name == 'bodyForm'){
		      		this.bodyForm.img = imgUrl;
		      		this.bodyForm.defaultImgList = [{imgUrl}];
		      	}
		    },
			saveTemplateStyle(name,designType){
				this.$refs[name].validate(async valid => {
        			if (valid) {
        				let _params = {}
        				if(this.editStyleName == 'header'){
        					_params.headerImg = this.headerForm.img;
        					_params.id = this.activityId;
        					_params.designType = designType
        				}else if(this.editStyleName == 'footer'){
        					_params.footerImg = this.footerForm.img;
        					_params.id = this.activityId;
        					_params.designType = designType
        				}else if(this.editStyleName == 'body'){
        					if(this.bodyForm.type == 1){
        						_params.backgroundType = 1;
        						_params.backgroundColor = this.bodyForm.rgb;
        						_params.id = this.activityId;
        						_params.designType = designType
        					}else{
        						_params.backgroundType = 2;
        						_params.backgroundImg = this.bodyForm.img;
        						_params.id = this.activityId;
        						_params.designType = designType
        					}	
        				}
        				let { code,msg } = await postRequest('/browsing/templateInfo/design/edit', _params);
        				if(code == 200){
        					this.msgOk("保存成功");
        					this.queryStyle()
        				}else{
        					this.msgErr(msg);
        				}
        			}else{
        				this.$Message.error("数据验证失败！");
        			}
        		})
			},
			cancelTemplateStyle(name){
				this.$refs[name].resetFields();
				this.$emit("update:showEditStyle", false);
	            //刷新列表数据
	            this.$emit("refresh");
			},
			async queryStyle(){
				let { code,msg,data } = await postRequest(this.url, {id:this.activityId});
				if(code == 200){
					let _data = JSON.parse(data);
					const {backgroundColor,backgroundImg,footerImg,backgroundType,headerImg} = _data;
					this.headerForm = {
						img:headerImg == undefined ? '' : headerImg,
						defaultImgList:headerImg == undefined ? [] : [{imgUrl:headerImg}]
					}
					this.footerForm = {
						img:footerImg == undefined ? '' : footerImg,
						defaultImgList:footerImg == undefined ? [] :[{imgUrl:footerImg}]
					}
					this.bodyForm = {
						type:backgroundType == undefined ? '' : backgroundType,
						rgb:backgroundColor == undefined ? '' : backgroundColor,
						img:backgroundImg == undefined ? '' : backgroundImg,
						defaultImgList:backgroundImg == undefined ? [] : [{imgUrl:backgroundImg}]
					}

				}else{
					this.msgErr(msg);
				}
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
	.form-wrap{
		width:500px;
		.form-btn{
			
			text-align:right;
		}
		.save{
			margin-left:20px;
		}
	}
	.query-style-wrap{
		.qs-item{
			display:flex;
			padding:10px 0;
			align-items:center;
		}
		.label{
			width:80px;
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