<template>
  <!-- 优惠券 -->
  <div class="coupon-list-box">
    <Modal
      v-model="isShow"
      title="优惠券列表"
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
            <FormItem label="商户名称：">
              <Input
                type="text"
                v-model="searchItem.merchantName"
                clearable
                placeholder="请输入商户名称："
                style="width: 150px"
              />
            </FormItem>
            <FormItem label="优惠券名称：">
              <Input
                type="text"
                v-model="searchItem.couponName"
                clearable
                placeholder="请输入优惠券名称"
                style="width: 150px"
              />
            </FormItem>
            <FormItem style label="所在地区">
              <Select
                v-model="searchItem.provinceId"
                style="width:150px"
                clearable
                @on-change="getcitylist"
              >
                <Option
                  v-for="(item,index) in provincelist"
                  :key="index"
                  :value="item.provinceCode"
                >{{item.provinceName}}</Option>
              </Select>
              <Select v-model="searchItem.cityId" style="width:150px" clearable>
                <Option
                  v-for="(item,index) in citylist"
                  :key="index"
                  :value="item.cityCode"
                >{{item.cityName}}</Option>
              </Select>
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
        <!-- <Row type="flex" justify="end" class="page">
          <Page
            :total="totalSize"
            show-total
            show-elevator
            @on-change="changeCurrent"
            style="float: right"
            :current.sync="current"
          ></Page>
        </Row>-->

        <Row type="flex" justify="end" class="page">
          <!-- show-total 显示总数 共{{ total }}条 -->
          <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
          <Page
            show-total
            show-elevator
            :current="page.page"
            :page-size="page.size"
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
import { getRequest, postRequest } from "@/libs/axios";

export default {
  name: "coupon-list",
  data() {
    return {
      isShow: true,
      choice: {
        _id:"",
        id: "",
        name: ""
      },
      edit_loading: false,
      isCheckDisabled: false,
      checkResult: 0,
      tableColumns: [
        {
          title: "序号",
          type: "index",
          width: 70,
          align: "center"
        },
        {
          title: "选择",
          key: "_id",
          width: 70,
          align: "center",
          render: (h, params) => {
            const { _id, templateId: id, title: name } = params.row;
            let flag = false;
            if (this.choice._id == _id) {
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
                    self.choice._id = _id;
                    self.choice.id = id;
                    self.choice.name = name;
                    self.choice.row = params.row;
                  }
                }
              })
            ]);
          }
        },
        // 商户名称 省/市 优惠券名称 有效期
        {
          title: "商户名称",
          align: "center",
          minWidth: 130,
          key: "merchantName"
        },
        {
          title: "省/市",
          align: "center",
          width: 150,
          key: "address",
          render: (h, params) => {
            let { province, city } = params.row;
            let str = `${province}/${city}`;
            return h("span", str);
          }
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
            let { useStartTime, useEndTime } = params.row;
            let str = "-";
            if (useStartTime && useEndTime) {
              str = `${useStartTime}-${useEndTime}`;
            }
            return h("span", str);
          }
        }
      ],
      tableData: [],
      page: {
        page: 1, //页码
        size: 10, //每页数量
        total: 0 //数据总数
      },
      tableLoading: false,
      searchItem: {
        merchantName: "",
        couponName: "",
        provinceId: "",
        cityId: ""
      },
      provincelist: [],
      citylist: [],
      selectedMerchantList: [] //选中的商户列表
    };
  },

  methods: {
    //获取省份信息数据
    getprovincelist() {
      postRequest("/system/area/province/list").then(res => {
        if (res.code == 200) {
          this.provincelist = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //根据省份code获取城市信息数据
    getcitylist() {
      getRequest("/system/area/city/" + this.searchItem.provinceId).then(
        res => {
          if (res.code == 200) {
            this.citylist = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        }
      );
    },
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    search() {
      this.queryTableData();
    },
    // 获取商户列表
    queryTableData(page) {
      this.page.page = page || 1;
      this.tableLoading = false;
      const reqParams = {
        couponName: this.searchItem.couponName,
        merchantName: this.searchItem.merchantName,
        provinceCode: this.searchItem.provinceId,
        cityCode: this.searchItem.cityId,
        ...this.page
      };
      postRequest("/coupon/merchant/list", reqParams).then(res => {
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
          this.page.page = current; //分页查询起始记录
          this.page.total = total; //列表总数
          this.page.size = size; //每页数据
        } else {
          this.msgErr(msg);
        }
        this.tableLoading = false;
      });
    },

    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      this.$emit(`update:showCouponList`, false);
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
        merchantName: "",
        couponName: "",
        provinceId: "",
        cityId: ""
      };

      this.page = {
        page: 1, //页码
        size: 10, //每页数量
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
    this.getprovincelist();
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
