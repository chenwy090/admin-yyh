<template>
  <div class="bussiness-list-box">
    <Modal
      v-model="isShow"
      title="专题活动列表"
      width="900"
      footer-hide
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
    >
      <div>
        <row>
          <Form ref="searchItem" :model="searchItem" inline :label-width="100" class="search-form">
            <FormItem label="专题内容名称">
              <Input
                type="text"
                v-model="searchItem.name"
                clearable
                placeholder="专题内容名称"
                style="width: 150px"
              />
            </FormItem>
            <FormItem style="margin-left:-35px;" class="br">
              <Button @click="search" type="primary" icon="ios-search">搜索</Button>
              <Button @click="refresh">重置</Button>
            </FormItem>
          </Form>
        </row>

        <!-- 专题活动列表 -->
        <Table
          border
          ref="selection"
          size="small"
          :columns="tableColumns"
          :data="tableData"
          :loading="tableLoading"
          class="bussiness-list"
        >
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status==0">创建</span>
            <span v-else-if="row.status==1">上架</span>
            <span v-else-if="row.status==-1">下架</span>
          </template>
        </Table>
        <Row type="flex" justify="end" class="page">
          <Page
            :total="totalSize"
            show-total
            show-elevator
            @on-change="changeCurrent"
            style="float: right"
            :current.sync="current"
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
  name: "thematic-activities",
  data() {
    return {
      isShow: true,
      choice: {
        id: "",
        name: "",
        row: {}
      },
      tableColumns: [
        {
          title: "选择",
          key: "id",
          width: 70,
          align: "center",
          render: (h, params) => {
            const { id, name } = params.row;
            let flag = false;
            if (this.choice.id == id) {
              flag = true;
            } else {
              flag = false;
            }
            let self = this;
            return h("div", [
              h("Radio", {
                props: {
                  value: flag
                },
                on: {
                  "on-change": () => {
                    console.log("change", params.row);
                    self.choice.id = id;
                    self.choice.name = name;
                    self.choice.row = params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: "专题ID",
          minWidth: 200,
          key: "id",
          align: "center"
        },
        {
          title: "状态",
          minWidth: 300,
          slot: "status",
          align: "center"
        },
        {
          title: "专题内容名称",
          minWidth: 200,
          key: "name",
          align: "center"
        }
      ],
      tableData: [],
      current: 1,
      totalSize: 0, //总条数
      pageNum: 1, //开始条数
      tableLoading: false,
      searchItem: {
        name: ""
      }
    };
  },

  methods: {
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    search() {
      this.current = 1;
      this.totalSize = 0; //总条数
      this.pageNum = 1; //开始条数
      this.queryTableData();
    },
    // 获取商户列表
    queryTableData() {
      this.tableLoading = false;
      const url = `/specialTopic/list?isAsc=DESC&orderByColumn=1&pageNum=${this.pageNum}&pageSize=10`;
      postRequest(url, this.searchItem).then(res => {
        if (res.code == 200) {
          this.totalSize = res.data.total;
          this.tableData = res.data.records;
        } else {
          this.msgErr(res.msg);
        }
        this.tableLoading = false;
      });
    },

    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.$emit(`update:showThematicActivities`, false);
    },
    //确定选择商户
    selectMerchant() {
      if (this.choice.id) {
        this.$emit("seclectedTr-event", this.choice);
        this.closeDialog();
      } else {
        this.msgErr("至少选择一项");
      }
    },
    //重置商户搜索条件
    refresh() {
      // this.updateTableList(this.params);
      this.searchItem.name = "";
      this.queryTableData();
    },

    //分页
    changeCurrent(current) {
      this.pageNum = current;
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
