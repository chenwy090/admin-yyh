<template>
  <!-- 优惠券 -->
  <div class="detail-box">
    <Modal
      v-model="isShow"
      title="查看详情"
      width="500"
      :closable="true"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
    >
      <div>
        <Form label-position="top">
          <FormItem label="标题：">
            <h3>{{data.title}}</h3>
          </FormItem>
          <FormItem label="内容介绍：">
            <div v-html="data.content"></div>
          </FormItem>

          <FormItem label="图片：">
            <template v-if="data.images.length">
              <img v-for="(item,index) in data.images" width="100" :key="index" :src="item.imgUrl" />
            </template>
            <template v-else>
              <span>暂无图片</span>
            </template>
          </FormItem>
        </Form>
      </div>

      <div slot="footer">
        <Button style="margin-right: 20px" @click="cancel">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
// import EditorBar from "@/components/EditorBar";

export default {
  name: "detail",
  // components: { EditorBar },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isShow: true
    };
  },
  created() {
    console.log("created:", this.data);
  },
  methods: {
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    closeDialog() {
      //关闭对话框清除表单数据
      this.$emit(`update:showDetail`, false);
    }
  }
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
