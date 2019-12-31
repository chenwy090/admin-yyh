<template>
	<div class="edit-style">
		<Tabs type="card" v-model="editStyleName">
			<TabPane label="版头设置" name="header">
				<Form v-model="headerForm" :rules="ruleValidateHeader" ref="headerForm" class="form-wrap" :label-width="80">
					<FormItem prop="img" label=" ">
						<div style="display:inline-block;vertical-align:middle">
							<UploadImage v-model="headerForm.img"></UploadImage>
						</div>
						<span style="margin-left:10px;">限JPG、PNG格式，2MB以内，宽度建议 750px</span>
					</FormItem>
					<FormItem class="form-btn">
						<Button>取消</Button>
						<Button type="primary" class="save">保存提交</Button>
					</FormItem>
				</Form>
			</TabPane>
			<TabPane label="页尾设置" name="footer">
				<Form v-model="footerForm" :rules="ruleValidateFooter" ref="footerForm" class="form-wrap" :label-width="80">
					<FormItem prop="img" label=" ">
						<div style="display:inline-block;vertical-align:middle">
							<UploadImage v-model="footerForm.img"></UploadImage>
						</div>
						<span style="margin-left:10px;">限JPG、PNG格式，1MB以内，宽度建议 ？px</span>
					</FormItem>
					<FormItem class="form-btn">
						<Button>取消</Button>
						<Button type="primary" class="save">保存提交</Button>
					</FormItem>
				</Form>
			</TabPane>
			<TabPane label="背景设置" name="body">
				<Form v-model="bodyForm" :rules="ruleValidateBody" ref="bodyForm" class="form-wrap" :label-width="80">
					<FormItem prop="type" label=" ">
						<RadioGroup v-model="bodyForm.type">
			                <Radio label="1">填色值</Radio>
			                <Radio label="2">传图片</Radio>
			            </RadioGroup>
					</FormItem>
					<FormItem prop="img" label=" " v-if="bodyForm.type == 2">
						<div style="display:inline-block;vertical-align:middle">
							<UploadImage v-model="bodyForm.img"></UploadImage>
						</div>
						<span style="margin-left:10px;">限JPG、PNG格式，1MB以内，宽度建议 ？px</span>
					</FormItem>
					<FormItem prop="rgb" label=" " v-if="bodyForm.type == 1">
						<Input v-model="bodyForm.rgb"></Input>
					</FormItem>
					<FormItem class="form-btn">
						<Button>取消</Button>
						<Button type="primary" class="save">保存提交</Button>
					</FormItem>
				</Form>
			</TabPane>
		</Tabs>
	</div>
</template>
<script>
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
		      default: () => ({ type: "add" })
		    }
		},
		watch: {
		    action: {
		      handler(val, oldVal) {
		        let { type, data } = this.action;

		        data = JSON.parse(JSON.stringify(data));
		        this.activityId = data.id;

		        //this.queryTableData();
		        console.log("watch editStyleAction data:", data);

		        if (type == "add") {
		        } else if (type == "edit") {
		        }
		      },
		      deep: true,
		      immediate: true
		    }
		},
		data(){
			return{
				editStyleName:'header',
				headerForm:{
					img:''
				},
				ruleValidateHeader:{
					img:[{required: true,message:'限JPG、PNG格式，2MB以内，宽度建议 750px',trigger: 'blur'}]
				},
				footerForm:{
					img:''
				},
				ruleValidateFooter:{
					img:[{required: true,message:'限JPG、PNG格式，1MB以内，宽度建议 ？px',trigger: 'blur'}]
				},
				bodyForm:{
					type:'',
					img:'',
					rgb:''
				},
				ruleValidateBody:{
					type:[{required: true,trigger: 'blur'}],
					rgb:[{required: true,trigger: 'blur'}],
					img:[{required: true,message:'限JPG、PNG格式，1MB以内，宽度建议 ？px',trigger: 'blur'}]
				}
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
	
</style>