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
    tags: {
      type: Array,
      default: () => []
    },
    tagList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isShow: true,
      selection: [],
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "标签ID",
          align: "center",
          key: "id"
        },
        {
          title: "标签名称",
          align: "center",
          key: "name"
        }
      ]
    };
  },
  created() {
    console.log("created");
    let tableData = JSON.parse(JSON.stringify(this.tagList));
    tableData.forEach(tag => {
      tag._checked = false;
      for (let i = 0; i < this.tags.length; i++) {
        let r = tag.id == this.tags[i].id;
        if (r) {
          tag._checked = true;
        }
      }
      //初始化的时候 保存已经选中的
      if (tag._checked) {
        this.selection.push(tag);
      }
    });
    this.tableData = tableData;
  },
  methods: {
    handleSelectionChange(selection) {
      this.selection = selection;
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
      let data = JSON.parse(JSON.stringify(this.selection));
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
