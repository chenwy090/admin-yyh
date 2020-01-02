<template>
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="省/市" prop="status">
          <Select
            v-model="searchForm.provice"
            placeholder="请选择省"
            style="width:100px"
            @on-change="proviceChange($event)"
          >
            <Option v-for="item in proviceSelect" :value="item" :key="item">{{ item }}</Option>
          </Select>
          /
          <Select v-model="searchForm.city" placeholder="请选择市" style="width:100px">
            <Option v-for="item in citySelect" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </Form-item>

        <FormItem label="有效期" prop="settleTime">
          <DatePicker
            transfer
            type="daterange"
            placeholder="请选择有效期"
            @on-change="searchForm.settleTime = $event"
            v-model="searchForm.settleTime"
            style="width: 200px"
          >
          </DatePicker>
        </FormItem>

        <Form-item label="状态" prop="status">
          <Select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px;">
            <Option :value="0">全部</Option>
            <Option :value="1">待发布</Option>
            <Option :value="2">进行中</Option>
            <Option :value="3">已终止</Option>
            <Option :value="4">已结束</Option>
          </Select>
        </Form-item>

        <Form-item class="br">
          <Button @click="search" type="primary" icon="ios-search">搜索</Button>
          <Button @click="resetForm('searchForm')">重置</Button>
        </Form-item>
      </Form>
    </Card>
    <Card style="margin-top: 1vh;">
      <Row class="operation">
        <Button type="primary" icon="md-add" @click="addManualDisplayFn">新增</Button>
      </Row>

      <!-- 用户列表 -->
      <Table :loading="TableLoading" border :columns="tableColumns" :data="table_list" sortable="custom" ref="table">
        <template slot-scope="{ row }" slot="operate">
          <ButtonGroup>
            <Button size="small" @click="modalEditShow = true">查看</Button>
            <!-- 只有为"待发布、进行中"的状态，才显示"编辑"按钮。 -->
            <Button size="small" type="success">编辑</Button>
            <!-- 只有为"进行中"的状态，才显示"终止"按钮。 -->
            <Button size="small" type="info">终止</Button>
            <!-- 只有为"待发布"的状态，才显示"删除"按钮。 -->
            <Button size="small" type="error">删除</Button>
          </ButtonGroup>
        </template>
      </Table>
      <!-- 用户列表 -->
      <!-- 分页 -->
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
      <!-- 分页 -->
    </Card>

    <Modal v-model="modalAddShow" title="推荐券" :mask-closable="false" @on-cancel="modalAddShow = false">
      <Form :model="modalAddData" ref="modalAddForm2" :label-width="70" class="search-form" :rules="modalAddValidate">
        <Form-item label="可领城市" prop="code">
          <Select
            v-model="modalAddData.provinceCode"
            placeholder="请选择省"
            style="width:100px"
            @on-change="proviceChange($event)"
          >
            <Option v-for="item in proviceSelect" :value="item" :key="item">{{ item }}</Option>
          </Select>
          /
          <Select v-model="modalAddData.cityCode" placeholder="请选择市" style="width:100px">
            <Option v-for="item in citySelect" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </Form-item>

        <Form-item label="有效期" prop="time">
          <DatePicker
            transfer
            type="daterange"
            placeholder="请选择有效期"
            @on-change="[modalAddData.beginTime, modalAddData.endTime] = $event"
            v-model="modalAddData.time"
            style="width: 200px"
          >
          </DatePicker>
        </Form-item>
        <Form-item label="优惠券">
          <Row
            ><Button @click="showCouponList = true">添加</Button>
            <span style="color:#999;margin-left:1vh;">拖动调整顺序</span></Row
          >
          <CompSortDrag :list="couponList">
            <template v-for="(item, index) in couponList">
              <Row :key="index"
                ><Tag closable @on-close="couponListRemove(index)">{{ item.name }}</Tag></Row
              >
            </template>
          </CompSortDrag>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalAddShow = false">取消</Button>
        <Button type="primary" :loading="modalAddBtnShow" @click="modalAddOk('modalAddForm2')">保存</Button>
      </div>
    </Modal>

    <Modal v-model="modalEditShow" title="查看优惠券" :mask-closable="false" @on-cancel="modalEditShow = false">
      <Form :label-width="80" class="search-form">
        <Form-item label="可领城市：">
          <p>浙江 > 杭州</p>
        </Form-item>
        <Form-item label="有效期：">
          <p>2019-1-1-- 2019-6-6</p>
        </Form-item>
        <Form-item label="优惠券：">
          <p>我的优惠券（ID：123123123|库存：300）</p>
          <p>我的优惠券（ID：123123123|库存：300）</p>
          <p>我的优惠券（ID：123123123|库存：300）</p>
        </Form-item>
        <Form-item label="状态：">
          <p>进行中</p>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalEditShow = false">取消</Button>
      </div>
    </Modal>

    <CouponList
      v-if="showCouponList"
      :showCouponList.sync="showCouponList"
      @seclectedTr-event="selectedCouponItem"
    ></CouponList>
  </div>
</template>
<script>
import {
  settleBillDownload,
  settleBillRegen,
  settleBillDelete,
  settleBillList,
  settleBillSave,
  settleBillApply,
} from "@/api/financial";

import * as cms from "@/api/cms";

import CouponList from "@/views/CMS/contentArea/publish/CouponList";
import CompSortDrag from "@/components/CompSortDrag";

const columns = [
  {
    title: "操作",
    width: 245,
    align: "center",
    fixed: "left",
    slot: "operate",
  },
  {
    title: "可领省/市",
    width: 140,
    align: "center",
    key: "billNo",
  },
  {
    title: "有效期",
    align: "center",
    key: "settlementCycle",
  },
  {
    title: "状态",
    width: 190,
    align: "center",
    key: "brandName",
  },
  {
    title: "创建人",
    width: 190,
    align: "center",
    key: "merchantName",
  },
  {
    title: "创建时间",
    align: "right",
    key: "realPay",
  },
];

export default {
  components: { CouponList, CompSortDrag },
  data() {
    return {
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        billNo: "",
        brandName: "",
        merchantName: "",
        status: 0,
        settleTime: [],
      },

      current: 1,
      totalSize: 1, //总条数
      // pageNum: 1, //开始条数
      TableLoading: false,
      table_list: [],
      tableColumns: columns,

      loading: false,
      modalAddShow: false,
      modalAddBtnShow: false,
      modalAddData: {},
      modalAddValidate: {},
      merchantData: null,

      proviceSelect: [],
      citySelect: [],
      showCouponList: false,
      couponList: [],

      modalEditShow: false,
    };
  },
  mounted() {
    this.getList();
    cms.shopProvice().then(res => {
      if (res.isSuccess) {
        this.proviceSelect = res.data;
      }
    });
  },
  methods: {
    search() {
      this.searchForm.pageNum = 1;
      this.getList();
    },
    getList() {
      this.TableLoading = true;
      let body = {
        ...this.searchForm,
      };
      delete body.daterange;
      settleBillList(body).then(res => {
        this.TableLoading = false;
        if (res && res.code == 200) {
          this.table_list = res.data.records;
          this.totalSize = res.data.total;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    changeCurrent(current) {
      this.searchForm.pageNum = current;
      this.getList();
    },
    // 重置form表单
    resetForm(name) {
      this.$refs[name].resetFields();
      if (name == "searchForm") {
        this.search();
      }
    },
    //手动添加结算清单
    addManualDisplayFn() {
      this.$refs["modalAddForm2"].resetFields();
      this.modalAddShow = true;
    },
    modalAddOk(name) {
      this.$refs[name].validate(valid => {
        if (!valid) return;
        this.modalAddBtnShow = true;
        // this.modalAddShow = false;
      });
    },
    // editLabelDisplayFn(item) {
    //   this.$Modal.confirm({
    //     title: '申请付款',
    //     content: '<p>您确认要提交申请付款吗？</p>',
    //     onOk: () => {
    //       settleBillApply({
    //         id: item.id,
    //         memo: '',
    //       }).then(res => {
    //         if (res && res.code == 200) {
    //           this.$Message.success('申请付款成功！')
    //           this.search()
    //         } else {
    //           this.$Message.error(res.msg)
    //         }
    //       })
    //     },
    //     onCancel: () => {
    //       console.info('onCancel')
    //     },
    //   })
    // },
    proviceChange(provinceName) {
      this.searchForm.city = "";
      cms.shopCity({ province: provinceName }).then(res => {
        if (res.isSuccess) {
          this.citySelect = res.data;
        }
      });
    },
    selectedCouponItem(data) {
      if (this.couponList.filter(item => item.id == data.id).length > 0) {
        this.$Message.error("优惠券有重复，请重新选择");
        return;
      }
      this.couponList.push(data);
    },
    couponListRemove(index) {
      this.couponList.splice(index, 1);
    },
  },
};
</script>
<style lang="less" scoped>
.operation {
  margin-bottom: 2vh;
}

.operation button {
  margin-right: 0;
}

.page {
  margin-top: 2vh;
}

.bohui-box {
  padding: 5px;
  font-size: 14px;
  white-space: normal;
  word-break: break-all;
}

.disabled {
  cursor: no-drop;
  color: #ccc;
}

.ivu-btn-primary[disabled] {
  border-color: #dcdee2 !important;
}
</style>
