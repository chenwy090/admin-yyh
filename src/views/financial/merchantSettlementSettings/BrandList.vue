<template>
  <div class="brand-list-box">
    <Modal
      v-model="isShow"
      title="品牌列表"
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
            <FormItem label="品牌名称">
              <Input
                type="text"
                v-model="searchData.merchantName"
                clearable
                placeholder="请输入品牌名称"
                style="width: 150px"
              />
            </FormItem>
            <FormItem style="margin-left:-35px;" class="br">
              <Button @click="search" type="primary" icon="ios-search">搜索</Button>
              <Button @click="reset">重置</Button>
            </FormItem>
          </Form>
        </row>

        <!-- 商户列表 -->
        <Table
          border
          ref="refTable"
          size="small"
          :columns="tableColumns"
          :data="tableData"
          :loading="tableLoading"
          class="bussiness-list"
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
      choice: {
        id: "",
        name: "",
        row: {}
      },
      tableColumns: [
        {
          title: "选择",
          key: "brandId",
          width: 70,
          align: "center",
          render: (h, params) => {
            // params: {index, column, row;}
            const { brandId: id, merchantName: name } = params.row;
            params.row.id = id;
            params.row.name = name;
            let flag = false;
            if (this.choice.id == id) {
              flag = true;
            } else {
              flag = false;
            }
            let self = this;
            return (
              <div>
                <Radio
                  value={flag}
                  onOn-change={checked => {
                    this.choice = {
                      merchantType: 1,
                      id,
                      name,
                      row: params.row
                    };
                  }}
                ></Radio>
              </div>
            );
          }
        },
        {
          title: "品牌编号",
          align: "center",
          minWidth: 130,
          key: "brandId"
        },
        {
          title: "品牌名称",
          align: "center",
          width: 230,
          key: "merchantName"
        }
      ],
      searchData: {
        type: 1,
        merchantName: ""
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
    // 获取商户列表
    async queryTableData(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.tableLoading = true;
      // 获取成功开户的商户信息,type=0 商户;type = 1 品牌
      const url = "/trade/merchant/fund/account/basic/success";

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
      this.$emit(`update:showBrandList`, false);
    },
    //确定选择商户
    selectMerchant() {
      if (this.choice.id) {
        this.$emit("seclectedTr-event", this.choice);
        this.closeDialog();
      } else {
        this.msgErr("至少选一个品牌");
      }
    },
    reset() {
      // 重置查询参数
      this.searchData = {
        type: 1,
        merchantName: ""
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
.brand-list-box {
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
