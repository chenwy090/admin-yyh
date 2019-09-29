<template>
  <div class="supermarket-list-box">
    <Modal
      v-model="isShow"
      title="待提现审核用户明细"
      width="900"
      footer-hide
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
    >
      <div>
        <Table
          border
          ref="selection"
          size="small"
          :columns="tableColumns"
          :data="tableData"
          class="bussiness-list"
        ></Table>
      </div>

      <Row style="margin-left:350px; margin-top: 30px">
        <Button type="primary" @click="closeDialog">确定</Button>
      </Row>
    </Modal>
  </div>
</template>
<script>
import { getShopList } from "@/api/sys";
import { getRequest, postRequest } from "@/libs/axios";
export default {
  name: "super-market-list",
  props: {
    moneyData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isShow: true,
      tableColumns: [
        {
          title: "9.20后邀请好友数",
          key: "inviteAmount",
          minWidth: 150,
          align: "center"
        },
        {
          title: "9.20后邀请好友领券数",
          key: "couponAmount",
          minWidth: 150,
          align: "center"
        },
        {
          title: "9.20后邀请好友核销数",
          key: "verifyAmount",
          minWidth: 150,
          align: "center"
        },
        {
          title: "9.20后邀请好友获得u贝数",
          align: "center",
          minWidth: 150,
          key: "inviteAward"
        },
        {
          title: "9.20后总计赚取U贝数",
          align: "center",
          minWidth: 150,
          key: "totalAward"
        },
        {
          title: `9.20以后赚取U贝总计与邀请赚U贝差额

          说明：如差额不大即视为当前用户邀请赚U贝行为均已正常`,
          align: "center",
          width: 340,
          key: "awardDiff"
        },
        {
          title: `差额百分比
          说明：
          （1）一般邀请赚U贝为总体U贝赚取的90%以上，所以10%以内均正常；
          （2）此外，存在部分9.20之前邀请的用户于9.20之后再发生领券、核销带来奖励的情况，所以可能有少部分9.20未发生成功邀请但9.20后赚到了邀请的U贝`,
          align: "center",
          width: 340,
          key: "awardDiffPer"
        }
      ],
      tableData: []
    };
  },

  methods: {
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    closeDialog() {
      //关闭对话框清除表单数据 SuperMarket
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog showModelMoney");
      this.$emit(`update:showModelMoney`, false);
    }
  },
  mounted() {
    this.tableData = this.moneyData;
  }
};
</script>

<style scoped>
.form > div {
  display: inline-block;
}
</style>

<style lang="less">
.supermarket-list-box {
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
