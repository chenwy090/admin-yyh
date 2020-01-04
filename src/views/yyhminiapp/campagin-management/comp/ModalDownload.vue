<template>
  <!-- 下载对话框 -->
  <div class="coupon-list-box">
    <Modal
      v-model="isShow"
      width="500"
      :closable="true"
      :mask-closable="true"
      footer-hide
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
    >
      <div slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{title}}</span>
      </div>
      <Row>
        <Col :span="24/downLoadList.length" v-for="item in downLoadList" :key="item.type">
          <a href="javascript:;" @click="download(item.url)">{{item.label}}</a>
        </Col>
      </Row>
    </Modal>
  </div>
</template>
<script>
import { getRequest, downloadSteam } from "@/libs/axios";
export default {
  name: "tag-list",
  props: {
    params: {
      type: Object,
      default: () => ({
        campId: "",
        templateId: "",
      }),
    },
  },
  data() {
    return {
      isShow: true,
      title: "下载",
      downLoadList: [
        { label: "下载条码", type: "goodscode", url: "/campagin/goodscode/download" },
        { label: "下载类目/品牌", type: "category", url: "/campagin/category/download" },
        { label: "下载错误条码", type: "errorcode", url: "/campagin/errorcode/download" },
      ],
    };
  },
  methods: {
    async download(url) {
      console.log(this.params);

      // const res = await downloadSteam(url, this.params);
      const res = await getRequest(url, this.params);
      
      // const res = await getRequest(url);
      console.log(111111111111111111, res);

      const content = res.data;

      const { filename } = res.headers;

      const blob = new Blob([content], { type: "application/vnd.ms-excel" });
      const oA = document.createElement("a");
      if ("download" in oA) {
        // 非IE下载
        oA.download = decodeURI(filename);
        oA.style.display = "none";
        oA.href = URL.createObjectURL(blob);
        document.body.appendChild(oA);
        oA.click();
        URL.revokeObjectURL(oA.href); // 释放URL 对象
        document.body.removeChild(oA);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, filename);
      }
    },
    // 关闭
    cancel() {
      this.closeDialog();
    },
    closeDialog() {
      //关闭对话框
      console.log("closeDialog");
      this.isShow = false;
      // showModalDownload
      this.$emit(`update:showModalDownload`, false);
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3,
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3,
      });
    },
  },
};
</script>

<style scoped>
.form > div {
  display: inline-block;
}
</style>

<style lang="less">
.bussiness-list-box {
  /*调整table cell间隔和行高*/
  .ivu-table-cell {
    padding-left: 1px;
    padding-right: 1px;
  }
  .ivu-table-small td {
    height: 30px;
  }
}
</style>
