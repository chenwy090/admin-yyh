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
          label="活码标题："
          prop="title"
          :rules="{required: true,  validator: validateEmpty('请输入活码标题',20)}"
        >
        	<Input v-model="formData.title" placeholder="最多输入20个字符"></Input>
      	</FormItem>
      	<FormItem
          label="活码备注："
          prop="remark"
          :rules="{required: true,  validator: validateEmpty('请输入活码备注',20)}"
        >
        	<Input v-model="formData.remark" placeholder="最多输入20个字符"></Input>
      	</FormItem>
      	<FormItem prop="codeImg" label="备用二维码" :rules="{required: true, message:'仅限JPG、PNG格式，小于1MB'}">
					<div style="display:inline-block;vertical-align:middle">
						<UploadImage	
                :fileUploadType="'codeImg'"
                :defaultList="formData.defaultCodeImgList"
                @remove="removeImg('codeImg')"
                @uploadSuccess="ImgUploadSuccess('codeImg',$event)"
            ></UploadImage>
					</div>
					<span style="margin-left:10px;">仅限JPG、PNG格式，小于1MB，尺寸为1:1比例</span>
				</FormItem>
      	<FormItem
          label="关联账号："
          prop="account"
          :rules="{required: true, message:'请输入关联账号'}"
        >
        	<Input v-model="formData.account" placeholder="请输入账号的登录手机号码"></Input>
      	</FormItem>
      	<FormItem prop="logo" label="二维码logo" :rules="{required: false, message:'限JPG、PNG格式，1MB以内，尺寸75*75'}">
					<div style="display:inline-block;vertical-align:middle">
						<UploadImage
                :fileUploadType="'logo'"
                :defaultList="formData.defaultLogoList"
                @remove="removeImg('logo')"
                @uploadSuccess="ImgUploadSuccess('logo',$event)"
            ></UploadImage>
					</div>
					<span style="margin-left:10px;">限JPG、PNG格式，1MB以内，尺寸75*75</span>
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
	      	let { type, data } = this.action;

	        console.log("xxxx");
	        this.showModal = true;
	        // 新增
	        if(type == "add") {
	        	this.title = "新增活码";
	        	this.formData.defaultCodeImgList = [];
	        	this.formData.codeImg = "";
	        	this.formData.defaultLogoList = [];
	        	this.formData.logo = "";
	        	this.url = "/flexible/qrcode/add"
	        }else{
	        	this.title = "编辑活码";
	        	this.url = "/flexible/qrcode/edit";
	        	this.queryFormData(data)
	        }
	      },
	      deep: true
	    }
	  },
	  data(){
	  	return{
	  		showModal:false,
	  		title:"",
	  		url:"",
	  		formData:{
	  			id:"",
	  			title:"",
	  			remark:"",
	  			codeImg:"",
	  			defaultCodeImgList:[],
	  			account:"",
	  			logo:"",
	  			defaultLogoList:[]
	  		},
	  		isLogoFlag:true
	  	}
	  },
	  methods:{
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
	    ImgUploadSuccess(type,{ imgUrl,coverImgWidth,coverImgHeight }) {
	    	if(type == "logo"){
	    		if(coverImgWidth == 75 && coverImgHeight == 75){
	    			this.isLogoFlag = true;	
	    		}else{
	    			this.isLogoFlag = false;
	    		}
	    		this.formData.logo = imgUrl;
	        this.formData.defaultLogoList = [{ imgUrl }];
	    	}else{
	    		this.formData.codeImg = imgUrl;
	        this.formData.defaultCodeImgList = [{ imgUrl }];
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
	        if (length > 20) {
	          return callback(`最多只能输入20个字符`);
	        }
	        callback();
	      };
	    },
	    handlerSubmit(formName){
	    	this.$refs[formName].validate(async valid => {
	    		if(valid){
	    			const {formData:{id,title,remark,codeImg,account,logo}} = this;
	    			let params = {
	    				backupQrcode:codeImg,
	    				id:id,
	    				mobile:account,
	    				qrcodeLogo:logo,
	    				remark:remark,
	    				title:title
	    			}
	    			if(!this.isLogoFlag){
	    				this.$Message.error("二维码logo尺寸必须是75*75");
	    				return false;
	    			}
	    			let {code,msg} = await this.postRequest(this.url,params);
	    			if(code == 200){
	    				this.$Message.success("操作成功");
	    				this.showModal = false;
				  		this.$refs['form'].resetFields();
				  		this.$emit("refresh")
	    			}else{
	    				this.$Message.error(msg);
	    			}
	    		}else{
	    			return false;
	    		}
	    	})
	    },
	    queryFormData(data){
	    	this.formData = {
	    		id:data.id,
	    		title:data.title,
	    		remark:data.remark,
	    		codeImg:data.backupQrcode,
	    		defaultCodeImgList:[{imgUrl:data.backupQrcode}],
	    		account:data.mobile,
	    		logo:data.qrcodeLogo,
	    		defaultLogoList:[{imgUrl:data.qrcodeLogo}]
	    	}
	    }
	  }
	}
</script>