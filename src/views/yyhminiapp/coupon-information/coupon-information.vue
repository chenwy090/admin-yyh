<template>
  <div>
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="95" class="search-form">
        <Form-item label="领取人手机" prop="phoneNumber">
          <Input type="text" v-model="searchForm.phoneNumber" placeholder="请输入领取人手机" style="width: 150px" />
        </Form-item>
        <Form-item label="使用状态" prop="status">
          <Select v-model="searchForm.status" placeholder="请选择使用状态" style="width: 120px">
            <Option :value="''">全部</Option>
            <Option :value="1">已使用</Option>
            <Option :value="2">未使用</Option>
            <Option :value="3">已过期</Option>
            <Option :value="4">已退款</Option>
          </Select>
        </Form-item>

        <Form-item label="优惠券码" prop="couponBarcode">
          <Input type="text" v-model="searchForm.couponBarcode" placeholder="请输入优惠券码" style="width: 150px" />
        </Form-item>

        <span v-if="drop">
          <!-- <Form-item label="领取终端" prop="terminal">
            <Select v-model="searchForm.terminal" placeholder="请选择领取终端" style="width: 120px">
              <Option :value="''">全部</Option>
              <Option :value="1">小程序</Option>
              <Option :value="2">IOS</Option>
              <Option :value="3">安卓</Option>
            </Select>
          </Form-item> -->

          <Form-item label="核销门店ID" prop="verifyShopId">
            <Input type="text" v-model="searchForm.verifyShopId" placeholder="请输入核销门店ID" style="width: 150px" />
          </Form-item>

          <Form-item label="领取时间段" prop="receiveTime">
            <DatePicker
              type="daterange"
              placeholder="请选择领取时间段"
              style="width: 180px"
              format="yyyy-MM-dd"
              @on-change="[searchForm.receiveStartTime, searchForm.receiveEndTime] = $event"
              v-model="searchForm.receiveTime"
            ></DatePicker>
          </Form-item>

          <Form-item label="核销时间段" prop="verifyTime">
            <DatePicker
              type="daterange"
              placeholder="请选择核销时间段"
              style="width: 180px"
              format="yyyy-MM-dd"
              @on-change="[searchForm.verifyStartTime, searchForm.verifyEndTime] = $event"
              v-model="searchForm.verifyTime"
            ></DatePicker>
          </Form-item>
        </span>

        <Form-item :label-width="0">
          <a class="drop-down" @click="dropDown">
            {{ dropDownContent }}
            <Icon :type="dropDownIcon"></Icon>
          </a>
        </Form-item>

        <div class="operation">
          <Button type="primary" icon="ios-search" @click="search">搜索</Button>
          <Button @click="resetForm()">重置</Button>
        </div>
      </Form>
    </Card>
    <Card style="margin-top:1vh">
      <Row class="operation">
        <Button icon="md-refresh" @click="refreshFun()">刷新</Button>
      </Row>
      <Table border :columns="columns1" :data="data1" :loading="TableLoading"> </Table>

      <Row type="flex" justify="end" class="page">
        <!-- 分页 -->
        <Page
          :total="totalSize"
          show-total
          show-elevator
          @on-change="changeCurrent"
          style="float: right"
          :current="current"
        ></Page>
        <!-- 分页 -->
      </Row>
      <!-- 查看弹框 -->
      <Modal v-model="checkDsplay" :mask-closable="false" class="check" footer-hide width="800"> </Modal>
      <!-- 查看弹框 -->
    </Card>
  </div>
</template>
<script>
// import { getCouponList, getQueryLogAll } from "@/api/sys";
// import { baseUrl } from "@/api/index";
import * as order from "@/api/order";

const columns = [
  // {
  //   title: "订单编号",
  //   key: "orderNo",
  //   minWidth: 150,
  //   align: "center",
  // },
  {
    title: "优惠券标题",
    key: "couponTitle",
    minWidth: 150,
    align: "center",
  },
  {
    title: "优惠券活动ID",
    key: "campId",
    minWidth: 150,
    align: "center",
  },
  {
    title: "优惠券模板ID",
    key: "ticketTemplateId",
    minWidth: 150,
    align: "center",
  },
  {
    title: "面额",
    key: "couponMoney",
    minWidth: 150,
    align: "center",
  },
  {
    title: "券码",
    key: "barcode",
    minWidth: 150,
    align: "center",
  },
  {
    title: "领取人手机号",
    key: "mobile",
    minWidth: 150,
    align: "center",
  },
  {
    title: "一键核销码",
    key: "userVerifyCode",
    minWidth: 150,
    align: "center",
  },
  // {
  //   title: "领取终端",
  //   key: "receivedFrom",
  //   minWidth: 150,
  //   align: "center",
  // },
  {
    title: "领取时间",
    key: "receiveTime",
    minWidth: 150,
    align: "center",
  },
  {
    title: "核销时间",
    key: "verifyTime",
    minWidth: 150,
    align: "center",
  },
  {
    title: "核销门店",
    key: "shopName",
    minWidth: 150,
    align: "center",
  },
  {
    title: "核销收银台编号",
    key: "posNo",
    minWidth: 150,
    align: "center",
  },
  {
    title: "核销流水号",
    key: "listNo",
    minWidth: 150,
    align: "center",
  },
  {
    title: "退款时间",
    key: "refundedTime",
    minWidth: 150,
    align: "center",
  },
  {
    title: "过期时间",
    key: "lastUseTime",
    minWidth: 150,
    align: "center",
  },
  {
    title: "使用状态",
    key: "useStatusDesc",
    minWidth: 150,
    align: "center",
  },
];

export default {
  name: "timed-task",
  data() {
    return {
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      TableLoading: false,
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        phoneNumber: "", //手机号
        status: "", //使用状态
        couponBarcode: "", //券码
        // terminal: "", //终端
        verifyShopId: "", //核销门店
        verifyStartTime: "", //核销时间(start)
        verifyEndTime: "", //核销时间(end)
        receiveStartTime: "", //领取时间(start)
        receiveEndTime: "", //领取时间(end)
        verifyTime: [],
        receiveTime: [],
      },
      //列表字段显示
      columns1: columns,
      data1: [], // 列表数据
      current: 1, //当前页码
      totalSize: 0, //总条数
      checkDsplay: false, // 查看对话框
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 搜索
    search() {
      this.current = 1;
      this.searchForm.pageNum = 1;
      this.totalSize = 0;
      this.getList();
    },
    refreshFun() {
      this.getList();
    },
    // 渲染列表
    getList() {
      // 加载动画
      this.TableLoading = true;
      order.receiveInfoPage(this.searchForm).then(res => {
        //console.log(res);
        if (res.code == 200) {
          this.data1 = res.data.records;
          // 分页
          this.current = res.data.current;
          this.totalSize = res.data.total;
          // 加载动画
          this.TableLoading = false;
        } else {
          this.msgErr(res.msg);
          // 加载动画
          this.TableLoading = false;
        }
      });
    },
    // 分页
    changeCurrent(current) {
      this.searchForm.pageNum = current;
      this.current = current;
      this.getList();
    },
    // 重置form表单
    resetForm() {
      this.totalSize = 0;
      this.current = 1;
      this.searchForm.pageNum = 1;
      this.searchForm.receiveTime = [];
      this.searchForm.verifyTime = [];
      this.$refs.searchForm.resetFields();
      this.getList();
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
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "ios-arrow-down";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "ios-arrow-up";
      }
      this.drop = !this.drop;
    },
  },
};
</script>

<style lang="less" scoped>
.operation {
  margin-bottom: 2vh;
}
.select-count {
  font-size: 13px;
  font-weight: 600;
  color: #40a9ff;
}
.select-clear {
  margin-left: 10px;
}
.page {
  margin-top: 2vh;
}
.drop-down {
  font-size: 13px;
  margin-left: 5px;
}

.check {
  span {
    width: 100px;
    display: inline-block;
    font-size: 16px;
  }
}
</style>
