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
        <row>
          <Form ref="searchItem" :model="searchData" inline :label-width="70" class="search-form">
            <FormItem label="用户ID:">
              <Input
                type="text"
                v-model="searchData.id"
                clearable
                placeholder="请输入用户id"
                style="width: 150px"
              />
            </FormItem>
            <FormItem style="margin-left:-35px;" class="br">
              <Button @click="search" type="primary" icon="ios-search">搜索</Button>
              <Button @click="reset">重置</Button>
            </FormItem>
          </Form>
        </row>

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
        <Row type="flex" justify="end" class="page">
          <Page
            show-total
            show-elevator
            :current="page.pageNum"
            :page-size="page.pageSize"
            :total="page.total"
            @on-change="changeCurrent"
          ></Page>
        </Row>
      </div>

      <Row style="margin-left:350px; margin-top: 30px">
        <Button style="margin-right: 20px" @click="cancel">取消</Button>
        <Button type="primary" @click="selectMerchant">确定</Button>
      </Row>
    </Modal>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";

export default {
  name: "brand-list",
  data() {
    return {
      isShow: true,
      //选中的数据
      choices: [
        /*{ id: "", name: "", row: {} } */
      ],
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
      searchData: {
        id: 1
      },
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      tableLoading: false,
      tableData: []
    };
  },
  methods: {
    handleSelectChange(selection) {
      // console.log("handleSelectChange:", this.$refs.refTable.$refs.tbody);
      let { objData } = this.$refs.refTable.$refs.tbody;
      var choices = [];
      for (let index in objData) {
        let item = objData[index];
        if (item._isChecked) {
          choices.push(item);
        }
      }
      console.log(1, JSON.stringify(choices));

      var choices = this.tableData.filter(item => {
        for (let i = 0; i < selection.length; i++) {
          if (item.id == selection[i].id) {
            item._checked = true;
            return true;
          }
        }
      });
      console.log(2, JSON.stringify(choices));

      // this.choices = choices;
    },
    handleOnRowDbclick(row, index) {
      // let { _isChecked } = this.$refs.refTable.$refs.tbody.objData[index];
      // this.$refs.refTable.$refs.tbody.objData[index]._isChecked = !_isChecked;

      let { id, _checked } = row;

      _checked = !_checked;
      row._checked = _checked;
      this.tableData.splice(index, 1, row);

      console.log(this.$refs.refTable.$refs.tbody.objData[index]._isChecked);
    },
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    search() {
      this.queryTableData();
    },
    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.queryTableData(pageNum);
    },
    // 获取列表数据
    async queryTableData(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.tableLoading = true;
      const url = "/merchant/brandMain/selectByBrandName";

      const {
        code,
        data: { current, total, size, records },
        msg
      } = await postRequest(url, {
        ...this.searchData,
        ...this.page
      });
      if (code == 200) {
        this.tableData = records;
        this.page.pageNum = current; //分页查询起始记录
        this.page.total = total; //列表总数
        this.page.pageSize = size; //每页数据
      } else {
        this.msgErr(msg);
      }

      this.tableLoading = false;
    },

    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      this.$emit(`update:showMerchantAccountList`, false);
    },
    //确定选择商户
    selectMerchant() {
      if (this.choices.length) {
        this.$emit("seclectedTr-event", this.choices);
        this.closeDialog();
      } else {
        this.msgErr("至少选一个品牌");
      }
    },
    reset() {
      // 重置查询参数
      this.searchData = {
        id: 1
      };
      this.page = {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      };
      //重新查询一遍
      this.queryTableData();
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
  },
  mounted() {
    this.queryTableData();
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
