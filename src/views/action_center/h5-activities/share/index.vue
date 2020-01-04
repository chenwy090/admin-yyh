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
      	<Form v-model="shareForm" :rules="ruleValidate" ref="shareForm" class="form-wrap" :label-width="80">
			<FormItem prop="img" label="分享图片">
				<div style="display:inline-block;vertical-align:middle">
					<UploadImage v-model="shareForm.img"></UploadImage>
				</div>
				<span style="margin-left:10px;">限JPG、PNG格式，1MB以内</span>
			</FormItem>
			<FormItem prop="content" label="分享文案">
				<Input type="textarea" v-model="shareForm.content"></Input>
			</FormItem>
		</Form>
      <div slot="footer">
        <Button type="primary" size="large">保存提交</Button>
      </div>
    </Modal>
</template>
<script>
	import UploadImage from "../components/UploadImage";
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
		        if(type == 'edit'){
		        	this.title = '编辑分享内容'
		        }else{
		        	this.title = '查看分享内容'
		        }
		        
		      },
		      deep: true
	    	}
	  	},
	  	data(){
	  		return{
	  			isShow:false,
	  			title:'',
	  			shareForm:{
	  				img:'',
	  				content:''
	  			},
	  			ruleValidate:{
	  				img:[{required: true,message:'限JPG、PNG格式，1MB以内',trigger: 'blur'}],
	  				content:[{required: true,message:'仅限30个字符',trigger: 'blur'}]
	  			}
	  		}
	  	},
	  	methods:{
	  		closeDialog(){
	  			this.isShow = false;
	  		}
	  	}
	}
</script>