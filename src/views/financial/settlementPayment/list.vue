<template>
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
        <Form-item label="结算单号" prop="billNo">
          <Input v-model="searchForm.billNo" placeholder="请输入结算单号" style="width: 200px" />
        </Form-item>
        <FormItem label="结算周期" prop="settleTime">
          <DatePicker type="daterange" placeholder="请选择结算周期" @on-change=" searchForm.settleTime = $event "
            v-model="searchForm.settleTime" style="width: 200px">
          </DatePicker>
        </FormItem>
        <Form-item label="品牌名称" prop="brandName">
          <Input v-model="searchForm.brandName" placeholder="请输入品牌名称" style="width: 200px" />
        </Form-item>
        <Form-item label="商户名称" prop="merchantName">
          <Input v-model="searchForm.merchantName" placeholder="请输入商户名称" style="width: 200px" />
        </Form-item>
        <FormItem label="结算付款时间" prop="payTime">
          <DatePicker type="daterange" placeholder="请选择结算付款时间" @on-change=" searchForm.payTime = $event "
            v-model="searchForm.payTime" style="width: 200px">
          </DatePicker>
        </FormItem>
        <Form-item label="状态" prop="status">
          <Select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 200px;">
            <Option :value="0">全部</Option>
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
        <Button type="primary" icon="md-add" @click="settleBillDownloadFun">下载结算单</Button>
      </Row>

      <!-- 用户列表 -->
      <Table :loading="TableLoading" border :columns="tableColumns" :data="table_list" sortable="custom" ref="table">
        <template slot-scope="{ row }" slot="operate">

          <ButtonGroup>
            <!-- 账单状态:1 待处理;2 被驳回;3 待付款 ;4 已付款 -->
            <!-- 只有状态为"待付款"时，才显示"确认付款"按钮。 -->
            <Button :disabled="!(row.billStatus == 3)" type="success" size="small"
              @click="settleBillCheckPayFn(row)">确认付款</Button>
            <!-- 只有状态为"待付款"时，才显示"驳回"按钮。 -->
            <Button :disabled="!(row.billStatus == 3)" type="primary" size="small"
              @click="modalDisplayShowFu(row)">驳回</Button>
            <Button type="info" size="small"  @click="downDisplayFun(row)">下载</Button>
          </ButtonGroup>

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

    <Modal v-model="modalDisplayShow" title="驳回理由" :mask-closable="false" @on-cancel="modalDisplayShow = false">
      <Form :model="displayData" ref="modalDisplayForm" :label-width="70" :rules="modalDisplayValidate"
        class="search-form">
        <Form-item label="驳回理由" prop="memo">
          <Input v-model.trim="displayData.memo" placeholder="请输入驳回理由" type="textarea" :rows="4" />
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalDisplayShow = false">取消</Button>
        <Button type="primary" @click="modalDisplayOk('modalDisplayForm')" :loading="loading">保存</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import {
    settleBillPayList,
    settleBillReject,
    settleBillCheckPay,
    postSettleBillDownload,
    settleBillDownload,
  } from '@/api/financial';

  const columns = [{
      title: "操作",
      width: 190,
      align: "left",
      fixed: "left",
      slot: "operate"
    }, {
      title: "结算单号",
      width: 140,
      align: "center",
      key: 'billNo'
    },
    {
      title: "结算周期",
      width: 180,
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
      key: 'brandName'
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
      key: 'billStatusDesc'
    },
    {
      title: "生成方式",
      width: 100,
      align: "center",
      key: 'generateTypeDesc'
    },
    {
      title: "结算单付款时间",
      width: 150,
      align: "center",
      key: 'payTime'
    },
    {
      title: "创建人",
      width: 100,
      align: "center",
      key: 'createBy'
    },
  ]

  export default {
    data() {
      return {
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          status: 0,
          billNo: '',
          brandName: '',
          merchantName: '',
          settleTime: [],
          payTime: [],
        },

        current: 1,
        totalSize: 0, //总条数
        TableLoading: false,
        table_list: [],
        tableColumns: columns,

        loading: false,
        displayData: {
          memo: ''
        },
        modalDisplayShow: false,
        modalDisplayValidate: {
          memo: [{
              required: true,
              message: "驳回理由不能为空",
              trigger: "change"
            },
            {
              max: 200,
              message: "驳回理由最多200个汉字",
              trigger: "change"
            },
          ],
        }
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
        settleBillPayList(this.searchForm).then(res => {
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
          this.getList()
        }
      },
      modalDisplayShowFu(item) {
        this.displayData.id = item.id
        this.modalDisplayShow = true
      },
      modalDisplayOk(name) {
        this.$refs[name].validate(valid => {
          if (!valid) return;

          settleBillReject(this.displayData).then(res => {
            if (res && res.code == 200) {
              this.$Message.success('驳回成功！');
              this.search();
            } else {
              this.$Message.error(res.msg);
            }
            this.modalDisplayShow = false;
          })
        })
      },
      settleBillCheckPayFn(item) {
        console.info(item)
        this.$Modal.confirm({
          title: '确认付款',
          content: `<p>您确认已完结算单核对且打款给该<span style="color:red;">【${item.brandName}】</span>吗？</p>`,
          onOk: () => {
            settleBillCheckPay({
              id: item.id,
              memo: ""
            }).then(res => {
              if (res && res.code == 200) {
                this.$Message.success('确认付款成功！');
                this.search()
              } else {
                this.$Message.error(res.msg);
              }
            })
          },
          onCancel: () => {},
        })
      },
      //结算付款单下载
      downDisplayFun(item) {
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
      //结算单下载
      settleBillDownloadFun() {
        let body = JSON.parse(JSON.stringify(this.searchForm))
        delete body.pageNum
        delete body.pageSize
        postSettleBillDownload(body).then(res => {
          if (res.status !== 200) {
            this.$Message.error('网络请求失败，请稍后！');
            return;
          }
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

  .page {
    margin-top: 2vh;
  }

</style>
