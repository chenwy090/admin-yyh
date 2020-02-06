<template>
	 <Modal
      v-model="showModal"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      width="600"
    >
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <Form label-position="right" ref="form" :model="formData" :label-width="100">
        <FormItem
          label="二维码名称："
          prop="title"
          :rules="{required: true,  validator: validateEmpty('请输入二维码名称',15)}"
        >
        	<Input v-model="formData.title" placeholder="最多输入15个字符"></Input>
      	</FormItem>
      	<template v-if="action.type == 'add'">
	      	<FormItem
	          label="上传群码："
	          prop="addCode"
	          
	        >
	        	<div style="display:inline-block;vertical-align:middle">
							<Upload
				        multiple
				        :headers="userToken"
	        			:action="actionUrl"
	        			:show-upload-list="false"
	        			:before-upload="handleBeforeUpload"
	        			:on-success="handleUploadSuccess">
				        <Button type="primary" icon="md-add">上传群码</Button>
				    	</Upload>
						</div>
					</FormItem>
					<FormItem
	          label="已上传群码："
	          prop="file"
	          :rules="{required: true,  message:'上传群码图片'}"
	        >
	        	<div>
	              <ul class="file-list" v-for="(list,index) in formData.file" :key="index">
	                  <li>
	                  	<span style="font-size:14px;">{{ list.name }}</span> 
	                  	<Button type="text" style="float:right;color:#2d8cf0" @click="delFileList(index)">删除</Button>
	                  </li>
	              </ul>
	          </div>
	      	</FormItem>
	      </template>
	      <template v-if="action.type == 'edit'">
	      	<FormItem
	          label="已上传群码："
	          prop="logo"
	          :rules="{required: true,  message:'上传图片'}"
	        >
		      	<div style="display:inline-block;vertical-align:middle">
							<UploadImage
	                :fileUploadType="'logo'"
	                :defaultList="formData.defaultLogoList"
	                @remove="removeImg('logo')"
	                @uploadSuccess="ImgUploadSuccess('logo',$event)"
	            ></UploadImage>
						</div>
						<span style="margin-left:10px;">限JPG、PNG格式，1MB以内</span>
					</FormItem>
	      </template>
      	<FormItem
          label="切换频率："
          prop="frequency"
          :rules="{required: true,  validator: validateOrder}"
        >
        	<Input v-model="formData.frequency" placeholder="仅限正整数"></Input>
      	</FormItem>
      	<FormItem
          label="失效日期："
          prop="time"
          :rules="{required: true,  message:'选择失效时间'}"
        >
        	<DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"  v-model="formData.time"  @on-change="startTimeChange" style="width: 200px"></DatePicker>
      	</FormItem>
      </Form>
      <div slot="footer">
        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="handlerSubmit('form')">确认</Button>
      </div>
  </Modal>
</template>
<script>
	import util from "@/libs/util";
	import { uploadOperationImage2AliOssURl } from "@/api/index";
	import UploadImage from "../components/UploadImage";
	export default {
	  name: "add",
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
	      	let { type, data,flexibleQrcodeId,total } = this.action;
	      	this.flexibleQrcodeId = flexibleQrcodeId;
	        console.log(flexibleQrcodeId)
	        console.log("新增群二维码");
	        this.showModal = true;
	        this.formData.file = [];
	        // 新增
	        this.isButton = true;
	        if(type == "add") {
	        	this.countNum = total;
	        	this.title = "新增群二维码";
	        	this.postUrl = "/flexible/wechatQrcode/add";
	        }else if(type == "edit"){
	        	this.title = "编辑群二维码";
	        	this.postUrl = "/flexible/wechatQrcode/edit";
	        	this.formData.id = data.id;
	        	//回显弹窗信息
	        	this.queryWechatQrcodeSelectById(data);
	        }
	      },
	      deep: true
	    }
	  },
	  data(){
	  	return{
	  		showModal:false,
	  		title:"",
	  		postUrl:"",
	  		formData:{
	  			id:"",
	  			title:"",
	  			remark:"",
	  			codeImg:"",
	  			defaultCodeImgList:[],
	  			account:"",
	  			logo:"",
	  			defaultLogoList:[],
	  			file:[],
	  			addCode:"",
	  			defaultAddCodeList:[]
	  		},
	  		userToken: {}, //用户token
	      	// 文件上传
	      	actionUrl:uploadOperationImage2AliOssURl,
	      	expiredTime:"",
	      	isButton:true,
	      	countNum:'',
	      	imgData:{
	          accept: 'image/png, image/jpg,image/jpeg',
	      	}
	  	}
	  },
	  created() {
	    this.userToken = {
	      jwttoken: localStorage.getItem("jwttoken")
	    };
	  },
	  methods:{
	  	startTimeChange: function(e) { //设置开始时间
	  		if(e == ""){
	  			this.expiredTime = "";
	  			this.formData.time = "";
	  			return false
	  		}
	  		this.expiredTime = e.slice(0, 10) + " " + "23:59:59";
        this.formData.time = e.slice(0, 10) + " " + "23:59:59";
      },
	  	closeDialog(){
	  		this.showModal = false;
	  		this.$refs['form'].resetFields();
	  		this.$emit("refresh")
	  	},
	  	removeImg(type) {
	  		if(type == "logo"){
	  			this.formData.logo = "";
	        this.formData.defaultLogoList = [];
	  		}else{
	  			this.formData.codeImg = "";
	        this.formData.defaultCodeImgList = [];
	  		}
	    },
	    ImgUploadSuccess(type,{ imgUrl ,imgName}) {
	    	if(type == "logo"){
	    		this.formData.logo = imgUrl;
	        this.formData.defaultLogoList = [{ imgUrl }];
	    	}else if(type == "codeImg"){
	    		this.formData.codeImg = imgUrl;
	        this.formData.defaultCodeImgList = [{ imgUrl }];
	    	}else if(type == "addCode"){
	    		console.log('批量上传')
	    		this.formData.file.push({name:imgName,imgUrl:imgUrl});
	    	}    
	    },
	  	validateEmpty(msg, len = 20) {
	      return function(rule, value, callback) {
	        value += "";
	        value = value.trim();
	        if (value == "") {
	          return callback(msg);
	        }
	        let length = value.length;
	        if (length > 15) {
	          return callback(`最多只能输入15个字符`);
	        }
	        callback();
	      };
	    },
	    validateOrder(rule, value, callback){
	      // value += "";
	      // value = value.trim();
	      // // 允许不填
	      let reg = /^[1-9]*[1-9][0-9]*$/;
	      if (reg.test(value)) {
	        callback();
	      } else {
	        callback('仅输入正整数');
	      }  
    	},
    	async queryWechatQrcodeSelectById(data){
    		console.log(data)
  			this.expiredTime = data.expiredTime;
  			this.formData = {
  				id:data.id,
  				title:data.name,
  				logo:data.wechatQrcode,
  				defaultLogoList:[{imgUrl:data.wechatQrcode}],
  				frequency:data.switchTimes,
  				time:data.expiredTime
  			}
    	},
	    handlerSubmit(formName){
	    	this.$refs[formName].validate(valid => {
	    		if(valid){
	    			const {formData:{title,remark,file,frequency,time,id,logo},flexibleQrcodeId,expiredTime} = this;
	    			let params = "";
	    			//let __file = [];
	    			if(this.action.type == "add"){
	    				console.log(file)
	    				//判断图片的格式和大小是否符合要求
	    				for(let i = 0; i < file.length; i++){
	    					let type = file[i].type;//文件的类型，判断是否是图片
	    					console.log(type)  
					      	let size = file[i].size/1024;//文件的大小，判断图片的大小
					      	let name = file[i].name;
					      	if(this.imgData.accept.indexOf(type) === -1){
					        	this.$Message.error('只支持png,jpg格式图片！');
					        	return false;
					      	}
					      	if(size > 1024){
					        	this.$Message.error(`请选择1M以内的图片！`);
					        	return false;
					      	}
	    				}
	    				
	    				//判断还能上传几个文件
	    				let superNum = 30 - this.countNum;
	    				if(file.length > superNum){
	    					this.$Message.error(`还能上传${superNum}个群码图片`);
	    					return false
	    				}
	    				let formData = new FormData();  
	    				for (let i = 0; i < file.length; i++) {
						     formData.append("file", file[i]); // 文件对象
						  }
	    				//先执行批量上传接口获取图片地址，然后再新增数据
	    				this.postRequest('/operation/operation-info/batchUploadOperationImage2AliOss',formData).then(val =>{
	    					if(val.code == 200){
	    						//__file = val.image_url;
	    						params = {
				    				expiredTime:expiredTime,
				    				flexibleQrcodeId:flexibleQrcodeId,
				    				name:title,
				    				switchTimes:frequency,
				    				wechatQrcodeList:val.image_url
				    			}
				    			//this.disabled = true;
				    			this.handlerSubmitSend(params);
	    					}else{
	    						this.$Message.error(val.msg);
	    					}
	    				})
		    		}else if(this.action.type == "edit"){
		    			params = {
		    				expiredTime:expiredTime,
		    				id:id,
		    				name:title,
		    				switchTimes:frequency,
		    				wechatQrcode:logo
		    			}
		    			//this.disabled = true;
		    			this.handlerSubmitSend(params);
		    		}
	    		}else{
	    			return false;
	    		}
	    	})
	    },
	    async handlerSubmitSend(params){
	    	console.log(params)
	    	let {code,msg} = await this.postRequest(this.postUrl,params);
  			if(code == 200){
  				//this.disabled = false;
  				this.$Message.success("操作成功");
  				this.showModal = false;
					this.$refs['form'].resetFields();
					this.$emit("refresh")
  			}else{
  				//this.disabled = false;
  				this.$Message.error(msg);
  			}
	    },
	    handleBeforeUpload(file){
	    	console.log(file)
	    	
	      	
	    	let that = this;
	        if(that.formData.file.length >= 10){
	          this.$Message.info("最多只能上传10个文件");
	          return false;
	        }
	        that.formData.file.push(file);
	        
        	return false
	    },
	    handleUploadSuccess(res, file, fileList) {
	    	this.formData.file = [];
	      if (res.code == 200) {
	        
	       


	        this.formData.file.push(file.name);
	        //console.log(this.formData.file)
	        this.$Message.info("上传图片成功");
	      } else {
	        this.$Message.error("上传图片失败，请重新上传");
	      }
	    },
	    delFileList(index){
          let that = this;
          that.formData.file.splice(index, 1);
      }
	  }
	}
</script>
<style scoped lang="less">
	.file-list{
		list-style:none;
	}
</style>