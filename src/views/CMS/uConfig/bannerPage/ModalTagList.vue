<template>
  <!-- 标签列表 -->
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
      <Table border size="small" :columns="tableColumns" :data="tableData"></Table>

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
  data() {
    return {
      isShow: true,
      //选中的数据
      choice: {
        id: "",
        name: "",
        row: {},
      },
      tableColumns: [
        {
          title: "选择",
          key: "_id",
          width: 60,
          align: "center",
          render: (h, params) => {
            // params: {index, column, row;}
            const { id, name } = params.row;
            let flag = this.choice.id == id;
            return (
              <div>
                <Radio
                  value={flag}
                  onOn-change={checked => {
                    this.choice = {
                      id,
                      name,
                      row: params.row,
                    };
                  }}
                ></Radio>
              </div>
            );
          },
        },
        {
          title: "标签ID",
          align: "center",
          key: "id",
        },
        {
          title: "标签名称",
          align: "center",
          key: "name",
        },
      ],
      tableData: [],
    };
  },
  created() {
    this.getTagList();
  },
  methods: {
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
      if (this.choice.id) {
        this.$emit("seclectedTr-event", this.choice);
        this.closeDialog();
      } else {
        this.msgErr("至少选一个标签");
      }
    },
    async getTagList() {
      //标签查询
      const url = "/tag/list";
      const { code, msg, data } = await this.postRequest(url);
      if (code == 200) {
        // data:[{id,name,sort}]
        this.tableData = data;
      } else {
        this.msgErr(msg);
      }
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
