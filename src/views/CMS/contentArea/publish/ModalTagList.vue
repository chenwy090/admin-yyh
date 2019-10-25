<template>
  <!-- 优惠券 -->
  <div class="coupon-list-box">
    <Modal
      v-model="isShow"
      title="标签列表"
      width="500"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
    >
      <Table
        border
        :columns="tableColumns"
        :data="tableData"
        @on-selection-change="handleSelectionChange"
      ></Table>

      <div slot="footer">
        <Button style="margin-right: 20px" @click="cancel">取消</Button>
        <Button type="primary" @click="selectedTrCallBack">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "tag-list",
  props: {
    tagList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isShow: true,
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "标签ID",
          align: "center",
          key: "tagId"
        },
        {
          title: "标签名称",
          align: "center",
          key: "tagName"
        }
      ]
    };
  },
  created() {
    console.log("created");
    this.tableData = JSON.parse(JSON.stringify(this.tagList));
  },
  methods: {
    handleSelectionChange(selection) {
      this.tableData.forEach(tag => {
        tag._checked = false;
        for (let i = 0; i < selection.length; i++) {
          let r = tag.tagId == selection[i].tagId;
          if (r) {
            tag._checked = true;
          }
        }
      });
      // console.log(JSON.stringify(this.tableData));
    },
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    closeDialog() {
      //关闭对话框清除表单数据
      this.$emit(`update:showTagList`, false);
    },
    //确定选择商户
    selectedTrCallBack() {
      let data = JSON.parse(JSON.stringify(this.tableData));
      this.$emit("seclectedTr-event", data);
      this.closeDialog();
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
