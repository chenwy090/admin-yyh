<template>
  <!-- MerchantAccountList 商户账号 -->
  <div class="merchant-account-list-box">
    <Modal
      v-model="isShow"
      title="关联提现商户"
      width="900"
      footer-hide
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
    >
      <div>
        <!-- 列表 -->
        <Table
          border
          ref="refTable"
          size="small"
          :columns="tableColumns"
          :data="tableData"
          :loading="tableLoading"
          class="bussiness-list"
          @on-selection-change="handleSelectChange"
          @on-row-dblclick="handleOnRowDbclick"
        ></Table>
      </div>

      <Row style="margin-left:350px; margin-top: 30px">
        <Button style="margin-right: 20px" @click="cancel">取消</Button>
        <Button type="primary" @click="selectMerchant">确定</Button>
      </Row>
    </Modal>
  </div>
</template>
<script>
import { getRequest, postRequest } from "@/libs/axios";

export default {
  name: "brand-list",
  props: {
    id: {
      type: [Number, String],
      default: ""
    },
    type: {
      type: [Number, String],
      default: "0"
    },
    checked: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isShow: true,
      //选中的数据
      choices: [
        /*{ id: "", name: "", row: {} } */
      ],
      created() {
        console.log("created this.id:", this.id);
      },
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "用户ID",
          align: "center",
          minWidth: 130,
          key: "userId"
        },
        {
          title: "手机号",
          align: "center",
          width: 230,
          key: "phone"
        },
        {
          title: "微信昵称",
          align: "center",
          minWidth: 120,
          key: "nickName"
        },
        {
          title: "头像",
          align: "center",
          minWidth: 120,
          key: "avatarUrl",
          render: (h, params) => {
            let { avatarUrl } = params.row;
            return (
              <div>
                <img width="50" src={avatarUrl} />
              </div>
            );
          }
        },
        {
          title: "商户角色",
          align: "center",
          minWidth: 120,
          key: "merchantRoleName"
        }
      ],
      tableLoading: false,
      tableData: []
    };
  },
  mounted() {
    this.queryTableData();
  },
  methods: {
    // 确定选择商户
    selectMerchant() {
      this.choices = this.tableData.filter(item => item._checked);

      console.log(
        this.choices.map(item =>
          JSON.stringify({ userId: item.userId, _checked: item._checked })
        )
      );

      if (this.choices.length) {
        this.$emit("seclectedTr-event", this.choices);
        this.closeDialog();
      } else {
        this.msgErr("至少选一项");
      }
    },
    handleSelectChange(selection) {
      this.tableData = this.tableData.map(item => {
        item._checked = false;
        for (let i = 0; i < selection.length; i++) {
          if (item.userId == selection[i].userId) {
            item._checked = true;
          }
        }
        return item;
      });
      console.log(
        this.tableData.map(item =>
          JSON.stringify({ userId: item.userId, _checked: item._checked })
        )
      );
    },
    handleOnRowDbclick(row, index) {
      let { userId, _checked } = row;

      _checked = !_checked;
      row._checked = _checked;
      this.tableData.splice(index, 1, row);
      console.log(
        this.tableData.map(item =>
          JSON.stringify({ userId: item.userId, _checked: item._checked })
        )
      );
    },

    // 获取列表数据
    async queryTableData() {
      this.tableLoading = true;

      let url = "/merchant/merchantEmployee/merchant";
      if (this.type == 1) {
        url = "/merchant/merchantEmployee/brand";
      }
      console.log("queryTableData", url, this.id);
      const { code, data, msg } = await getRequest(url, { id: this.id });
      if (code == 200) {
        this.tableData = data.map(item => {
          item._checked = false;
          for (let i = 0; i < this.checked.length; i++) {
            let r = item.userId == this.checked[i];
            if (r) {
              item._checked = true;
            }
          }
          return item;
        });

        console.log(
          this.tableData.map(item =>
            JSON.stringify({ userId: item.userId, _checked: item._checked })
          )
        );
      } else {
        this.msgErr(msg);
      }
      this.tableLoading = false;
    },
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      this.$emit("update:showMerchantAccountList", false);
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

<style scoped>
.form > div {
  display: inline-block;
}
</style>

<style lang="less">
.merchant-account-list-box {
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
