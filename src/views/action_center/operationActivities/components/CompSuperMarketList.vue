<template>
  <!-- 优惠券 商超  couponType: 1 -->
  <div class="coupon-list-box">
    <row>
      <Form ref="searchItem" :model="searchItem" inline :label-width="100" class="search-form">
        <FormItem label="优惠券名称：">
          <Input
            type="text"
            v-model="searchItem.title"
            clearable
            placeholder="请输入优惠券名称"
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
      ref="selection"
      size="small"
      :columns="tableColumns"
      :data="tableData"
      :loading="tableLoading"
      class="bussiness-list"
    ></Table>
    <Row type="flex" justify="end" class="page">
      <!-- show-total 显示总数 共{{ total }}条 -->
      <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
      <Page
        show-total
        show-elevator
        :current="page.pageNum"
        :page-size="page.pageSize"
        :total="page.total"
        @on-change="changeCurrent"
      ></Page>
    </Row>

    <Row style="margin-left:350px; margin-top: 30px">
      <Button style="margin-right: 20px" @click="cancel">取消</Button>
      <Button type="primary" @click="selectMerchant">确定</Button>
    </Row>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";

export default {
  name: "coupon-list",

  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          name: "superMarket",
          couponType: 1,
          label: "周边券",
          compName: "CompSuperMarketList",
          url: "/merchantCouponTemplate/activitylist"
        };
      }
    }
  },
  data() {
    return {
      isShow: true,
      choice: {
        _id: "",
        id: "",
        name: ""
      },
      edit_loading: false,
      isCheckDisabled: false,
      checkResult: 0,
      tableColumns: [
        {
          title: "选择",
          key: "_id",
          width: 70,
          align: "center",
          render: (h, params) => {
            const { templateId: id, title: name } = params.row;
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
                    self.choice.id = id;
                    self.choice.name = name;
                    self.choice.row = params.row;
                    // console.log("change", JSON.stringify(self.choice));
                  }
                }
              })
            ]);
          }
        },
        {
          title: "优惠券ID",
          align: "center",
          width: 230,
          key: "templateId"
        },
        {
          title: "优惠券名称",
          align: "center",
          width: 230,
          key: "title"
        },
        {
          title: "有效期",
          align: "center",
          width: 180,
          key: "time",
          render: (h, params) => {
            let { dateType, startDate, endDate } = params.row;
            let str = "-";

            if (dateType == 2) {
              str = "永久有效";
            } else {
              if (startDate && endDate) {
                str = `${startDate}-${endDate}`;
              }
            }

            return h("span", str);
          }
        },
        // 商超  isActivityCoupon  0: 是活动券  1: 不是活动券
        {
          title: "活动券",
          align: "center",
          width: 100,
          key: "isActivityCoupon",
          render(h, params) {
            let { isActivityCoupon } = params.row;
            const arr = ["是", "否"];
            return h("span", arr[isActivityCoupon]);
          }
        }
      ],
      tableData: [],
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      tableLoading: false,
      searchItem: {
        title: ""
      }
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
    // 获取商户列表
    queryTableData(page) {
      this.page.pageNum = page || 1;
      this.tableLoading = false;
      const reqParams = {
        ...this.searchItem,
        ...this.page
      };
      postRequest(this.tab.url, reqParams).then(res => {
        const {
          code,
          data: { current, total, size, records },
          msg
        } = res;

        if (code == 200) {
          this.tableData = records.map(item => {
            item._id = Math.random();
            return item;
          });
          this.page.pageNum = current; //分页查询起始记录
          this.page.pageSize = size; //每页数据
          this.page.total = total; //列表总数
        } else {
          this.msgErr(msg);
        }
        this.tableLoading = false;
      });
    },

    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      this.$emit(`closeDialog`);
    },
    //确定选择商户
    selectMerchant() {
      if (this.choice.id) {
        this.$emit("seclectedTr-event", this.choice);
        this.closeDialog();
      } else {
        this.msgErr("至少选一个优惠券");
      }
    },
    reset() {
      // 重置查询参数
      this.searchItem = {
        shopName: "",
        couponName: ""
      };

      this.page = {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      };

      this.queryTableData();
    },
    // 分页（点击第几页）
    changeCurrent(page) {
      this.queryTableData(page);
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
