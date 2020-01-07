<template>
	<Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="500"
    >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{title}}</span>
      </p>
      	<ul class="query-style-wrap" v-if="action.type == 'query'">
	        <li class="qs-item">
	          <label class="label">分享图片：</label>
	          <div class="value">
	            <div class="img"><img :src="shareForm.img" /></div>
	          </div>
	        </li>
	        <li class="qs-item">
	          <label class="label">分享内容：</label>
	          <div class="value">
	          	{{shareForm.content}}
	          </div>
	        </li>
	    </ul>
	    <template v-else>
	      	<Form :model="shareForm" :rules="ruleValidate" ref="shareForm" class="form-wrap" :label-width="80">
				<FormItem prop="img" label="分享图片">
					<div style="display:inline-block;vertical-align:middle">
						<UploadImage
		                  :fileUploadType="'img'"
		                  :defaultList="shareForm.defaultImgList"
		                  @remove="removeImg"
		                  @uploadSuccess="ImgUploadSuccess"
		              ></UploadImage>
					</div>
					<span style="margin-left:10px;">限JPG、PNG格式，1MB以内</span>
				</FormItem>
				<FormItem prop="content" label="分享文案">
					<Input type="textarea" v-model="shareForm.content"></Input>
				</FormItem>
			</Form>
		   
		</template>
		<div slot="footer">
	        <Button type="primary" size="large" @click="saveSubmit('shareForm')" v-if="action.type !='query'">保存提交</Button>
	    </div>
    </Modal>
</template>
<script>
	import UploadImage from "../components/UploadImage";
	import { postRequest } from "@/libs/axios";
	export default {
	  	name: "edit",
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
		        console.log("分享内容");
		        console.log(data)
		        this.activityId = data.id;
		        if(type == 'edit'){
		        	this.title = '编辑分享内容';
		        	///browsing/templateInfo/selectById 回显内容
		        	this.selectById();
		        }else{
		        	this.title = '查看分享内容';
		        	this.selectById();
		        }
		        
		      },
		      deep: true
	    	}
	  	},
	  	data(){
	  		return{
	  			isShow:false,
	  			title:'',
	  			activityId:'',
	  			shareForm:{
	  				img:'',
	  				content:'',
	  				defaultImgList:[]
	  			},
	  			ruleValidate:{
	  				img:[{required: true,message:'限JPG、PNG格式，1MB以内',trigger: 'blur'}],
	  				content:[{required: true,message:'仅限30个字符',trigger: 'blur'}]
	  			}
	  		}
	  	},
	  	methods:{
	  		removeImg() {
		        this.shareForm.img = "";
		        this.shareForm.defaultImgList = [];
		    },
		    ImgUploadSuccess({ imgUrl }) {
		        this.shareForm.img = imgUrl;
		        this.shareForm.defaultImgList = [{ imgUrl }];
		    },
	  		closeDialog(){
	  			if(this.$refs.shareForm){
	  				this.$refs['shareForm'].resetFields();
	  			}
	  			this.isShow = false;
	  			this.$emit('refresh');
	  		},
	  		async selectById(){
	  			let { code, msg ,data} =  await postRequest('/browsing/templateInfo/selectById', {id:this.activityId});
	  			if(code == 200){
		  			this.shareForm = {
		  				img:data.shareImgUrl,
		  				content:data.shareText,
		  				defaultImgList:[{imgUrl:data.shareImgUrl}]
		  			}
		  		}else{
		  			this.msgErr(msg);
		  		}
	  		},
	  		saveSubmit(name){
	  			this.$refs[name].validate(async valid => {
        
        			if (valid) {
        				///browsing/templateInfo/editShare
        				const {shareForm:{img,content,defaultImgList},activityId} = this;
        				let params = {
        					id : activityId,
        					shareImgUrl:img,
        					shareText:content
        				}
        				let {code,msg} = await postRequest('/browsing/templateInfo/editShare',params);
        				if (code == 200) {
				            this.msgOk("保存成功");
				            // 关闭对话框
				            this.closeDialog();
				            //刷新列表数据
				            this.$emit("refresh");
				          } else {
				            this.msgErr(msg);
				        }
        			}else{
        				this.$Message.error("数据验证失败！");
        			}
        		})
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