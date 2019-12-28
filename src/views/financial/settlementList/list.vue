<template>
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="结算单号" prop="billNo">
          <Input clearable v-model="searchForm.billNo" placeholder="请输入结算单号" style="width: 200px" />
        </Form-item>

        <FormItem label="结算周期" prop="settleTime">
          <DatePicker transfer type="daterange" placeholder="请选择结算周期" @on-change=" searchForm.settleTime = $event "
            v-model="searchForm.settleTime" style="width: 200px">
          </DatePicker>
        </FormItem>

        <Form-item label="品牌名称" prop="brandName">
          <Input clearable v-model="searchForm.brandName" placeholder="请输入品牌名称" style="width: 200px" />
        </Form-item>

        <Form-item label="商户名称" prop="merchantName">
          <Input clearable v-model="searchForm.merchantName" placeholder="请输入商户名称" style="width: 200px" />
        </Form-item>

        <Form-item label="状态" prop="status">
          <Select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 200px;">
            <Option :value="0">全部</Option>
            <Option :value="1">待处理</Option>
            <Option :value="2">被驳回</Option>
            <Option :value="3">待付款</Option>
            <Option :value="4">已付款</Option>
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
        <Button type="primary" icon="md-add" @click="addManualDisplayFn">手动创建</Button>
      </Row>

      <!-- 用户列表 -->
      <Table :loading="TableLoading" border :columns="tableColumns" :data="table_list" sortable="custom" ref="table">
        <template slot-scope="{ row }" slot="operate">
          <!-- generateStatus =1 只允许删除-->
          <div v-if="row.generateStatus === 1">
            <Button type="error" size="small" :disabled="!(row.billStatus == 1 || row.billStatus == 2)"
              @click="settleBillDelete(row)">删除</Button>
          </div>
          <div v-if="row.generateStatus !== 1">
            <ButtonGroup>
              <!-- 账单状态:1 待处理;2 被驳回;3 待付款 ;4 已付款 -->
              <!-- 只有状态为"待处理、被驳回"状态时，才会显示"申请付款"按钮。 -->
              <Button type="success" size="small" :disabled="!(row.billStatus == 1 || row.billStatus == 2)"
                @click="editLabelDisplayFn(row)">申请付款</Button>
              <!-- 只有状态为"被驳回"状态时，才会显示"重新生成"按钮。 -->
              <Button type="primary" size="small" :disabled="!(row.billStatus == 2)"
                @click="settleBillRegen(row)">重新生成</Button>
              <Button type="info" size="small" @click="settleBillDownloadFun(row)">下载</Button>
              <!-- 只有状态为"待处理、被驳回"状态时，才会显示"删除"按钮。 -->
              <Button type="error" size="small" :disabled="!(row.billStatus == 1 || row.billStatus == 2)"
                @click="settleBillDelete(row)">删除</Button>
            </ButtonGroup>
          </div>

        </template>
        <template slot-scope="{ row }" slot="status">
          <p v-if="!row.rejectReason">{{row.billStatusDesc}}</p>
          <!-- placement="left"  -->
          <Tooltip v-if="row.rejectReason" theme="light" transfer>
            <p style="color: #ed4014;cursor: help;">{{row.billStatusDesc}}</p>
            <div class="bohui-box" slot="content">
              <p style="color: #ed4014;">{{row.rejectReason}}</p>
              <p style="padding-left: 50px;margin-top: 5px;">{{row.rejectBy}} {{row.rejectTime}}</p>
            </div>
          </Tooltip>
        </template>
      </Table>
      <!-- 用户列表 -->
      <!-- 分页 -->
      <Row type="flex" justify="end" class="page">
        <Page :total="totalSize" show-total show-elevator @on-change="changeCurrent" style="float: right"
          :current.sync="current"></Page>
      </Row>
      <!-- 分页 -->
    </Card>

    <Modal v-model="modalAddShow" title="手动新增" :mask-closable="false" @on-cancel="modalAddShow = false">
      <Form :model="modalAddData" ref="modalAddForm2" :label-width="70" class="search-form" :rules="modalAddValidate">
        <Form-item label="结算商户" prop="merchantName">
          <Input style="width:80%" v-model="modalAddData.merchantName" :placeholder="`点击按钮选择结算商户`" disabled>
          <Button @click="handleChoose" slot="append">选择</Button>
          </Input>
        </Form-item>
        <Form-item label="结算周期">
          <Row>
            <Col span="12">
            <FormItem prop="settleTimeStart">
              <DatePicker transfer type="date" :options="options1"
                @on-change="(datetime) =>{ changeDateTime(datetime, 1)}" format="yyyy-MM-dd"
                v-model="modalAddData.settleTimeStart" placeholder="请选择结算周期" style="width: 150px">
              </DatePicker>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem prop="settleTimeEnd">
              <DatePicker transfer type="date" :options="options2"
                @on-change="(datetime) =>{ changeDateTime(datetime, 2)}" format="yyyy-MM-dd"
                v-model="modalAddData.settleTimeEnd" placeholder="请选择结算周期" style="width: 150px">
              </DatePicker>
            </FormItem>
            </Col>
          </Row>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalAddShow = false">取消</Button>
        <Button type="primary" :loading="modalAddBtnShow" @click="modalAddOk('modalAddForm2')">保存</Button>
      </div>
    </Modal>

    <Modal width="900" v-model="modalMerchantShow" title="选择商户" :mask-closable="false"
      @on-cancel="modalMerchantShow = false">
      <merchant v-if="modalMerchantShow" @on-row-select=" merchantData = $event"></merchant>
      <div slot="footer">
        <Button type="text" @click="modalMerchantShow = false">取消</Button>
        <Button type="primary" @click="modalMerchantOk()">保存</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import merchant from './merchant.vue';

  import {
    settleBillDownload,
    settleBillRegen,
    settleBillDelete,

    settleBillList,
    settleBillSave,
    settleBillApply,
  } from '@/api/financial';

  const columns = [{
      title: "操作",
      width: 245,
      align: "center",
      fixed: "left",
      slot: "operate"
    },
    {
      title: "结算单号",
      width: 140,
      align: "center",
      key: 'billNo'
    },
    {
      title: "结算周期",
      width: 190,
      align: "center",
      key: 'settlementCycle'
    },
    {
      title: "品牌名称",
      width: 190,
      align: "center",
      key: 'brandName'
    },
    {
      title: "商户名称",
      width: 190,
      align: "center",
      key: 'merchantName'
    },
    {
      title: "交易金额（元）",
      width: 140,
      align: "right",
      key: 'realPay'
    },
    {
      title: "支付通消费（元）",
      width: 140,
      align: "right",
      key: 'channelServiceCostFee'
    },
    {
      title: "平台分账含通消费（元）",
      width: 190,
      align: "right",
      key: 'platformProfitFee'
    },
    {
      title: "商户分账（元）",
      width: 140,
      align: "right",
      key: 'settleAmount'
    },
    {
      title: "状态",
      width: 100,
      align: "center",
      slot: "status",
      key: 'billStatusDesc'
    },
    {
      title: "生成方式",
      width: 100,
      align: "center",
      key: 'generateTypeDesc'
    },
    {
      title: "创建人",
      width: 100,
      align: "center",
      key: 'createBy'
    },
    {
      title: "创建时间",
      width: 150,
      align: "center",
      key: 'gmtCreate'
    },
  ]

  export default {
    components: {
      merchant
    },
    data() {
      return {
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          billNo: '',
          brandName: '',
          merchantName: '',
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
        modalAddData: {
          merchantName: '',
          settleTime: [],
        },
        modalAddValidate: {
          merchantName: {
            required: true,
            message: "商户不能为空",
            trigger: "change"
          },
          settleTimeStart: {
            required: true,
            message: "结算周期不能为空",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请选择结算日期"))
              } else {
                callback()
              }
            }
          },
          settleTimeEnd: {
            required: true,
            message: "结算周期不能为空",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请选择结算日期"))
              } else {
                callback()
              }
            }
          },
        },
        options1: {
          disabledDate(date) {
            return date && date.valueOf() >= Date.now() - 86400000;
          }
        },
        options2: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now();
          }
        },
        modalMerchantShow: false,
        merchantData: null,

      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      search() {
        this.searchForm.pageNum = 1;
        this.getList()
      },
      getList() {
        this.TableLoading = true;
        let body = {
          ...this.searchForm
        };
        delete body.daterange
        settleBillList(body).then(res => {
          this.TableLoading = false;
          if (res && res.code == 200) {
            if (res.data.records instanceof Array) {
              res.data.records.forEach(item => {
                item.realPay = this.division100(item.realPay || 0);
                item.channelServiceCostFee = this.division100(item.channelServiceCostFee || 0);
                item.platformProfitFee = this.division100(item.platformProfitFee || 0);
                item.settleAmount = this.division100(item.settleAmount || 0);
              })
            }
            this.table_list = res.data.records
            this.totalSize = res.data.total
          } else {
            this.$Message.error(res.msg);
          }
        })
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
      changeDateTime(datetime, index) {
        if (!datetime) {
          return;
        }
        switch (index) {
          case 1:
            this.modalAddData.settleTimeStart = datetime;
            this.options2 = {
              disabledDate(date) {
                let bo = date.valueOf() < new Date(datetime) - 1000 * 60 * 60 * 24;
                let bo2 = date.valueOf() > new Date() - 1000 * 60 * 60 * 24;
                return bo2 || bo;
              }
            };
            break;
          case 2:
            this.modalAddData.settleTimeEnd = datetime;
            break;
        }
      },
      //手动添加结算清单
      addManualDisplayFn() {
        this.$refs['modalAddForm2'].resetFields();
        this.modalAddShow = true;
      },
      modalAddOk(name) {
        this.$refs[name].validate(valid => {
          if (!valid) return;
          let body = JSON.parse(JSON.stringify(this.modalAddData))
          body.settleTime = [body.settleTimeStart, body.settleTimeEnd];
          delete body.merchantName
          this.modalAddBtnShow = true;
          settleBillSave(body).then(res => {
            this.modalAddShow = false;
            this.modalAddBtnShow = false;
            if (res && res.code == 200) {
              this.$Message.success('手动创建成功！');
              this.search()
            } else {
              this.$Message.error(res.msg);
            }
          })
        })
      },
      //选择商户
      handleChoose() {
        this.modalMerchantShow = true
      },
      modalMerchantOk() {
        if (!this.merchantData) {
          this.$Message.error({
            content: '请选择商户',
            duration: 3
          });
          return
        }
        this.modalMerchantShow = false;
        this.modalAddData.merchantName = this.merchantData.name;
        this.modalAddData.merchantId = this.merchantData.merchantId;

      },
      editLabelDisplayFn(item) {
        this.$Modal.confirm({
          title: '申请付款',
          content: '<p>您确认要提交申请付款吗？</p>',
          onOk: () => {
            settleBillApply({
              id: item.id,
              memo: ""
            }).then(res => {
              if (res && res.code == 200) {
                this.$Message.success('申请付款成功！');
                this.search()
              } else {
                this.$Message.error(res.msg);
              }
            })
          },
          onCancel: () => {
            console.info('onCancel')
          },
        })
      },
      // TODO
      settleBillDownloadFun(item) {
        settleBillDownload(item.billNo).then(res => {
          const content = res.data;
          let fileName = res.headers["filename"];
          const blob = new Blob([content], {
            type: "application/vnd.ms-excel"
          });
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = decodeURI(fileName);
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        })
      },
      settleBillRegen(item) {
        this.$Modal.confirm({
          title: '重新生成"',
          content: '<p>您确认要重新生成该结算单吗？</p>',
          onOk: () => {
            settleBillRegen(item.billNo).then(res => {
              if (res && res.code == 200) {
                this.$Message.success('重新生成成功！');
                this.search()
              } else {
                this.$Message.error(res.msg);
              }
            })
          },
          onCancel: () => {
            console.info('onCancel')
          },
        })
      },
      settleBillDelete(item) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除该结算单吗？</p>',
          onOk: () => {
            settleBillDelete(item.billNo).then(res => {
              if (res && res.code == 200) {
                this.$Message.success('删除成功！');
                this.search()
              } else {
                this.$Message.error(res.msg);
              }
            })
          },
          onCancel: () => {
            console.info('onCancel')
          },
        })
      },
      division100(n) {
        let num = String(n);
        let arr = num.split(/\./)
        if (arr.length == 2) {
          if (arr[1].length < 2) {
            arr[1] = arr[1].padEnd(2, '0')
          }
          return arr.join('.');
        } else {
          return `${num}.00`
        }
      }
    },
  }

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
