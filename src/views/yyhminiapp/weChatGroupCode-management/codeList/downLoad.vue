<template>
	<Modal
      v-model="showModal"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      width="500"
    >
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div class="download-wrap">
      	<img :src="imgUrl" />
      </div>
      <div slot="footer" style="text-align:center;">
      	<!-- <a href="###" :download="imgUrl">
					下 载
				</a> -->
        <Button type="primary" @click="downLoad">下   载</Button>
      </div>
  </Modal>
</template>
<script>
	export default{
		name:"downLoad",
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
	        
	        console.log("下载");
	        this.showModal = true;
	        // 新增
	        if(type == "query") {
	        	this.title = "下载活码";
	        	console.log(data)
	        	this.id = data.id;
	        	this.url = "/flexible/qrcode/download";
	        	this.queryListById()
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
				id:"",
				imgUrl:""
			}
		},
		methods:{
			closeDialog(){
				this.showModal = false;
				this.$emit("refresh")
			},
			queryListById(){
				this.postRequest(this.url,{id:this.id}).then(val =>{
					if(val.code == 200){
						this.imgUrl = val.data;
					}else{
						this.$Message.error(msg);
					}	
				});
				
			},
			downloadIamge(imgsrc, name) {//下载图片地址和图片名
			  var image = new Image();
			  // 解决跨域 Canvas 污染问题
			  image.setAttribute("crossOrigin", "anonymous");
			  image.onload = function() {
			    var canvas = document.createElement("canvas");
			    canvas.width = image.width;
			    canvas.height = image.height;
			    var context = canvas.getContext("2d");
			    context.drawImage(image, 0, 0, image.width, image.height);
			    var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
			 
			    var a = document.createElement("a"); // 生成一个a元素
			    var event = new MouseEvent("click"); // 创建一个单击事件
			    a.download = name || "photo"; // 设置图片名称
			    a.href = url; // 将生成的URL设置为a.href属性
			    a.dispatchEvent(event); // 触发a的单击事件
			  };
			  image.src = imgsrc;
			},
			
			downLoad(){

				//this.downloadIamge(this.imgUrl, 'pic')
			}
		}
	}
</script>
<style scoped lang="less">
	.download-wrap{
		width:200px;
		height:200px;
		margin:0 auto;
		display:flex;
		align-items:center;
		img{
			max-width:100%;
			max-height:100%;
			text-align:center;
			margin:0 auto;
		}
	}
</style>