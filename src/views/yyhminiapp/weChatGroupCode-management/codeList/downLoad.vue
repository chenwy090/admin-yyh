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
      <Spin v-if="loading" style="text-align:center;margin:0 auto;"></Spin>
      <img :src="imgUrl" v-else/>
    </div>
    <div slot="footer" style="text-align:center;">
      <!-- <a :href="imgUrl" download="imgUrl">下 载</a> -->
      <Button type="primary" @click="downLoad">下&nbsp;&nbsp;载</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  name: "downLoad",
  props: {
    action: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => ({ type: "add" }),
    },
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;

        console.log("下载");
        this.showModal = true;
        // 查询
        if (type == "query") {
          this.title = "下载活码";
          console.log(data);
          this.id = data.id;
          this.url = "/flexible/qrcode/download";
          this.queryListById();
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      showModal: false,
      title: "",
      url: "",
      id: "",
      imgUrl: "",
      loading:false
    };
  },
  methods: {
    closeDialog() {
      this.showModal = false;
      this.$emit("refresh");
    },
    queryListById() {
      this.imgUrl = "";
      this.loading = true;
      this.postRequest(this.url, { id: this.id }).then(val => {
        this.loading = false;
        if (val.code == 200) {
          this.imgUrl = val.data;
        } else {
          this.$Message.error(msg);
        }
      });
    },
    downloadIamge(imgsrc, name) {
      //下载图片地址和图片名
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

    async downLoad() {
      // https://image.52ash.cn/activecode/YWN0X2NvZGVfNTQ2NTg=.jpg
      const url = "/system/img/urlToBase64";
      const { code, msg, data } = await this.postRequest(url, { url: this.imgUrl });

      if (code == 200) {
        const base64 = `data:image/png;base64,${data.base64}`;
        //创建原生a标签实现动态Img地址及下载触发
        let oA = document.createElement("a");
        oA.href = base64;
        oA.download = "图片";
        oA.click();
      } else {
        this.$Message.error(msg);
      }

      //   this.downloadIamge(this.imgUrl, "pic");
    },
  },
};
</script>
<style scoped lang="less">
.download-wrap {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  img {
    max-width: 100%;
    max-height: 100%;
    text-align: center;
    margin: 0 auto;
  }
}
</style>