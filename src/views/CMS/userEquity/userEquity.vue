<template>
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="省/市">
          <Select
            v-model="searchForm.provinceCode"
            placeholder="请选择省"
            style="width:100px"
            @on-change="proviceChange($event)"
          >
            <Option v-for="item in proviceSelect" :value="item.provinceCode" :key="item.provinceCode">{{
              item.provinceName
            }}</Option>
          </Select>
          /
          <Select v-model="searchForm.cityCode" placeholder="请选择市" style="width:100px">
            <Option v-for="item in citySelect" :value="item.cityCode" :key="item.cityCode">{{ item.cityName }}</Option>
          </Select>
        </Form-item>

        <FormItem label="有效期">
          <DatePicker
            transfer
            type="daterange"
            placeholder="请选择有效期"
            @on-change="[searchForm.startTime, searchForm.endTime] = $event"
            v-model="searchForm.time"
            style="width: 200px"
          >
          </DatePicker>
        </FormItem>

        <Form-item label="状态" prop="status">
          <Select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px;">
            <Option :value="''">全部</Option>
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
            <Button size="small" @click="viewManualDisplayFn(row)">查看</Button>
            <!-- 只有为"待发布、进行中"的状态，才显示"编辑"按钮。 -->
            <Button
              :disabled="!(row.status == 1 || row.status == 2)"
              size="small"
              type="success"
              @click="editManualDisplayFn(row)"
              >编辑</Button
            >
            <!-- 只有为"进行中"的状态，才显示"终止"按钮。 -->
            <Button :disabled="row.status != 2" size="small" type="info" @click="stopVipFn(row)">终止</Button>
            <!-- 只有为"待发布"的状态，才显示"删除"按钮。 -->
            <Button :disabled="row.status != 1" size="small" type="error" @click="deleteVipFn(row)">删除</Button>
          </ButtonGroup>
        </template>
        <template slot-scope="{ row }" slot="province">
          <p>{{ row.provinceName }}/{{ row.cityName }}</p>
        </template>
        <template slot-scope="{ row }" slot="time">
          <p>{{ row.startTime }}--{{ row.endTime }}</p>
        </template>
        <template slot-scope="{ row }" slot="status">
          <p>{{ row.status | $status }}</p>
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

    <Modal v-model="modalAddShow" :mask-closable="false" @on-cancel="modalAddShow = false">
      <p slot="header">
        <span>特权券</span>
        <span style="padding-left:10px;font-weight: 400;color: red;"
          >商超券（限时抢购券）、周边券（体验券）不允许设为特权券</span
        >
      </p>

      <Form :model="modalAddData" ref="modalAddForm2" :label-width="70" class="search-form" :rules="modalAddValidate">
        <Form-item label="可领城市" required>
          <Select
            v-model="modalAddData.provinceCode"
            placeholder="请选择省"
            style="width:100px"
            @on-change="proviceChange($event)"
          >
            <Option v-for="item in proviceSelect" :value="item.provinceCode" :key="item.provinceCode">{{
              item.provinceName
            }}</Option>
          </Select>
          /
          <Select v-model="modalAddData.cityCode" placeholder="请选择市" style="width:100px">
            <Option v-for="item in citySelect" :value="item.cityCode" :key="item.cityCode">{{ item.cityName }}</Option>
          </Select>
        </Form-item>

        <Form-item label="有效期" prop="time">
          <DatePicker
            transfer
            type="daterange"
            placeholder="请选择有效期"
            @on-change="[modalAddData.startTime, modalAddData.endTime] = $event"
            v-model="modalAddData.time"
            style="width: 200px"
          >
          </DatePicker>
        </Form-item>
        <Form-item label="优惠券" required>
          <Row><Button :disabled="couponList.length === 3" @click="showCouponList = true">添加</Button></Row>
          <template v-for="(item, index) in couponList">
            <Tag closable @on-close="couponListRemove(index)">{{ item.couponTitle }}</Tag>
          </template>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalAddShow = false">取消</Button>
        <Button type="primary" :loading="modalAddBtnShow" @click="modalAddOk('modalAddForm2')">保存</Button>
      </div>
    </Modal>

    <Modal
      v-model="modalEditShow"
      title="查看特权券"
      :mask-closable="false"
      width="600"
      @on-cancel="modalEditShow = false"
    >
      <Form :label-width="80" class="search-form">
        <Form-item label="可领城市：">
          <p>{{ modalAddData.provinceName }} > {{ modalAddData.cityName }}</p>
        </Form-item>
        <Form-item label="有效期：">
          <p>{{ modalAddData.startTime }} -- {{ modalAddData.endTime }}</p>
        </Form-item>
        <Form-item label="优惠券：">
          <p v-for="(item, index) in couponList" :key="index">
            {{ item.couponTitle }}（ID：{{ item.couponId }} | 库存：{{ item.stock || 0 }}）
          </p>
        </Form-item>
        <Form-item label="状态：">
          <p>{{ modalAddData.status | $status }}</p>
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
    minWidth: 140,
    align: "center",
    slot: "province",
  },
  {
    title: "有效期",
    align: "center",
    width: 190,
    slot: "time",
  },
  {
    title: "状态",
    width: 190,
    align: "center",
    key: "status",
    slot: "status",
  },
  {
    title: "创建人",
    align: "center",
    width: 100,
    key: "createBy",
  },
  {
    title: "创建时间",
    align: "right",
    minWidth: 180,
    key: "gmtCreate",
  },
];

export default {
  components: { CouponList },
  data() {
    return {
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        status: "",
        startTime: "",
        endTime: "",
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
      modalAddValidate: {
        time: {
          required: true,
          message: "有效期不能为空",
          validator: (rule, value, callback) => {
            if (value) {
              callback();
            } else {
              callback(new Error("请选择有效期"));
            }
          },
        },
      },
      merchantData: null,

      proviceSelect: [],
      citySelect: [],
      showCouponList: false,
      couponList: [],

      modalEditShow: false,
    };
  },
  filters: {
    $status: function(val) {
      return ["待发布", "进行中", "已终止", "已结束"][+val - 1] || "";
    },
  },
  mounted() {
    this.getList();
    cms.filterProvince().then(res => {
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
      cms.vipRightsList(body).then(res => {
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
      this.searchForm.time = [];
      this.searchForm.startTime = "";
      this.searchForm.endTime = "";
      this.searchForm.provinceCode = "";
      this.searchForm.cityCode = "";
      if (name == "searchForm") {
        this.search();
      }
    },
    addManualDisplayFn() {
      // this.$refs["modalAddForm2"].resetFields();
      this.modalAddShow = true;
      this.modalAddData = {};
      this.couponList = [];
    },
    editManualDisplayFn(item) {
      cms.vipRightsDetail(item.id).then(res => {
        if (res.isSuccess) {
          this.modalAddData = res.data;
          this.modalAddData.time = [this.modalAddData.startTime, this.modalAddData.endTime];
          this.couponList = JSON.parse(res.data.couponList);

          this.proviceChange(this.modalAddData.provinceCode);

          this.modalAddShow = true;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    viewManualDisplayFn(item) {
      cms.vipRightsDetail(item.id).then(res => {
        if (res.isSuccess) {
          this.modalAddData = res.data;
          this.couponList = JSON.parse(res.data.couponList);
          this.modalEditShow = true;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    modalAddOk(name) {
      this.$refs[name].validate(valid => {
        if (!valid) return;

        let body = {
          provinceCode: this.modalAddData.provinceCode,
          cityCode: this.modalAddData.cityCode,
          startTime: this.modalAddData.startTime,
          endTime: this.modalAddData.endTime,
          couponItemList: this.couponList.map((item, index, list) => {
            return {
              couponType: item.couponType,
              couponId: item.couponId,
              sortIndex: list.length - index,
            };
          }),
        };

        if (!body.provinceCode || !body.cityCode) {
          this.$Message.error("请选择可领城市");
          return;
        }

        if (!(body.couponItemList instanceof Array && body.couponItemList.length > 0)) {
          this.$Message.error("请选择优惠券");
          return;
        }

        this.modalAddBtnShow = true;

        if (this.modalAddData.id) {
          body.id = this.modalAddData.id;
          cms.vipRightsConfigEdit(body).then(res => {
            this.modalAddBtnShow = false;
            if (res && res.code == 200) {
              this.$Message.success("修改成功！");
              this.search();
              this.modalAddShow = false;
            } else {
              this.$Message.error(res.msg);
            }
          });
        } else {
          cms.vipRightsConfig(body).then(res => {
            this.modalAddBtnShow = false;
            if (res && res.code == 200) {
              this.$Message.success("创建成功！");
              this.search();
              this.modalAddShow = false;
            } else {
              this.$Message.error(res.msg);
            }
          });
        }
      });
    },

    deleteVipFn(item) {
      this.$Modal.confirm({
        title: "删除",
        content: "<p>您确定要删除该记录吗？</p>",
        onOk: () => {
          cms.vipRightsDelete(item.id).then(res => {
            if (res.isSuccess) {
              this.$Message.success("删除成功！");
              this.search();
            } else {
              this.$Message.error(res.msg);
            }
          });
        },
        onCancel: () => {
          console.info("onCancel");
        },
      });
    },
    stopVipFn(item) {
      this.$Modal.confirm({
        title: "终止",
        content: "<p>您确定要终止该记录吗？</p>",
        onOk: () => {
          cms.vipRightsStop(item.id).then(res => {
            if (res.isSuccess) {
              this.$Message.success("终止成功！");
              this.search();
            } else {
              this.$Message.error(res.msg);
            }
          });
        },
        onCancel: () => {
          console.info("onCancel");
        },
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
    proviceChange(provinceCode) {
      if (!provinceCode) return;
      this.searchForm.city = "";
      cms.filterCityByProvince(provinceCode).then(res => {
        if (res.isSuccess) {
          this.citySelect = res.data;
        }
      });
    },
    selectedCouponItem(data) {
      let _data = {
        couponType: data.couponType,
        couponId: data.id,
        couponTitle: data.name,
      };
      if (this.couponList.filter(item => item.id == _data.couponId).length > 0) {
        this.$Message.error("优惠券有重复，请重新选择");
        return;
      }
      this.couponList.push(_data);
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
  /* max-height: 200px;
    overflow: auto; */
}

.disabled {
  cursor: no-drop;
  color: #ccc;
}

.ivu-btn-primary[disabled] {
  border-color: #dcdee2 !important;
}
</style>
