<template>
  <Row>
    <Form ref="searchForm" :label-width="80" :model="searchForm" inline>
      <FormItem>
        <RadioGroup v-model="searchForm.auditStep" @on-change="auditStepChange">
          <Radio label="1">
            <span>待审核</span>
          </Radio>
          <Radio label="3,5">
            <span>审核成功</span>
          </Radio>
          <Radio label="2">
            <span>审核失败</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <br />
      <FormItem label="手机号码">
        <Input v-model="searchForm.phone" placeholder="手机号码" />
      </FormItem>
      <FormItem label="提现时间">
        <DatePicker
          type="date"
          placeholder
          style="width: 160px"
          @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
        ></DatePicker>--
        <DatePicker
          type="date"
          placeholder
          style="width: 160px"
          @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
        ></DatePicker>
      </FormItem>

      <FormItem label="提现金额">
        <InputNumber v-model="searchForm.applyAmountRangeOpen"></InputNumber>--
        <InputNumber v-model="searchForm.applyAmountRangeClose"></InputNumber>
      </FormItem>
      <FormItem>
        <ButtonGroup>
          <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')">搜索</Button>
          <Button type="primary" @click="excelExport()">导出</Button>
        </ButtonGroup>
      </FormItem>
    </Form>
    <Row>
      <Table
        :loading="TableLoading"
        border
        :columns="tableColumns"
        :data="listData"
        sortable="custom"
        ref="table"
        @on-selection-change="handleSelect"
      ></Table>
      <Button type="primary" v-show="batchAuditBtnShow" @click="batchAudit()">审核</Button>
    </Row>
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
    <Row>
      <Modal
        v-model="batchAuditModalShow"
        title="提现审核"
        :loading="batchAuditModalLoading"
        :footer-hide="true"
        @on-visible-change="auditFormModalChange"
      >
        <Form ref="auditForm" :label-width="80" :model="auditForm" :rules="auditFormRule">
          <FormItem prop="result">
            <RadioGroup v-model="auditForm.result">
              <Radio label="1">
                <span>通过</span>
              </Radio>
              <Radio label="2">
                <span>不通过</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="备注" prop="remarks">
            <Input v-model="auditForm.remarks" type="textarea" :rows="4" placeholder="填写备注" />
          </FormItem>
          <FormItem>
            <ButtonGroup>
              <Button type="text" size="large" @click="cancel()">取消</Button>
              <Button type="primary" size="large" @click="batchAuditOk('auditForm')">确定</Button>
            </ButtonGroup>
          </FormItem>
        </Form>
      </Modal>
      <Modal v-model="auditRecordModal" title="审核日志" width="800">
        <Table border :columns="tableAuditRecordColumns" :data="listAuditRecordData"></Table>
      </Modal>
    </Row>
  </Row>
</template>
<script>
import {
  financialWithdrawApplyPreAuditList,
  financialWithdrawApplyAudit,
  financialWithdrawApplyAuditRecordList,
  financialWithdrawApplyDownload
} from "@/api/sys";
export default {
  data() {
    const auditFormRemarks = (rule, value, callback) => {
      if (value.length > 100) {
        callback(new Error("不能超过100个字"));
        return;
      }
      if (this.auditForm.result === "2" && value === "") {
        callback(new Error("必须输入备注信息"));
        return;
      }
      callback();
    };
    return {
      TableLoading: false,
      auditing: 0,
      totalSize: 0,
      current: 1,
      listData: [],
      selectDataList: [],
      auditData:{},
      auditFlag: 0,
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "序号",
          type: "index",
          width: 70
        },
        {
          title: "操作",
          key: "audit",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                      display:(params.row.auditStep !='1')?"none":"inline-block",
                  },
                  on: {
                    click: () => {
                      this.audit(params.row);
                    }
                  }
                },
                "审核"
              )
            ]);
          }
        },
        {
          title: "提现用户",
          key: "realName"
        },
        {
          title: "OpenId",
          key: "openId"
        },
        {
          title: "手机号码",
          key: "phone"
        },
        {
          title: "提现时间",
          key: "applyDate"
        },
        {
          title: "可提现余额",
          key: "accountBalance"
        },
        {
          title: "申请提现金额",
          key: "amount"
        },
        {
          title: "个税",
          key: "amountFee"
        },
        {
          title: "提现单号",
          key: "orderNo"
        },
        {
          title: "审核日志",
          key: "operate",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.showAuditList(params.row.id);
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      searchForm: {
        applyDateRangeOpen: null,
        applyDateRangeClose: null,
        phone: null,
        applyAmountRangeOpen: null,
        applyAmountRangeClose: null,
        auditStep: "1",
        status: "0",
        current: "1",
        pageSize: "10"
      },
      auditForm: {
        applyIds: [],
        result: null,
        remarks: ""
      },
      auditFormRule: {
        result: [
          { required: true, message: "必须选择审核结果", trigger: "blur" }
        ],
        remarks: [{ validator: auditFormRemarks, trigger: "blur" }]
      },
      batchAuditModalShow: false,
      batchAuditModalLoading: false,
      listAuditRecordData: [],
      auditRecordModal: false,
      batchAuditBtnShow: true,
      tableAuditRecordColumns: [
        {
          title: "时间",
          key: "auditDate"
        },
        {
          title: "审核人",
          key: "auditor"
        },
        {
          title: "审核结果",
          key: "result"
        },
        {
          title: "审核备注",
          key: "remarks"
        }
      ]
    };
  },
  methods: {
    loadTableData(formData) {
      this.totalSize = 0;
      this.listData = [];
      this.TableLoading = true;
      financialWithdrawApplyPreAuditList(formData).then(res => {
        this.TableLoading = false;
        if (res.code === "200") {
          this.totalSize = res.data.total;
          this.listData = res.data.records;
        } else {
          this.msgErr("获取数据失败");
        }
      });
    },
    search() {
      this.searchForm.current = 1;
      this.loadTableData(this.searchForm);
    },
    showAuditList(id) {
      financialWithdrawApplyAuditRecordList(id).then(res => {
        if (res.code === "200") {
          this.auditRecordModal = true;
          this.listAuditRecordData = res.records;
        } else {
          this.msgErr("查询审核日志失败");
        }
      });
    },
    changeCurrent(current) {
      if (this.searchForm.current != current) {
        this.searchForm.current = current;
        this.loadTableData(this.searchForm);
      }
    },
    changeDateTime(datetime, index) {
      switch (index) {
        case 1:
          this.searchForm.applyDateRangeOpen = datetime;
          break;
        case 2:
          this.searchForm.applyDateRangeClose = datetime;
          break;
      }
    },
    handleSelect(selection, index) {
      this.selectDataList = selection;
    },
    audit(raw) {
      this.auditData = raw;
      this.auditFlag = '1';
      this.batchAuditModalShow = true;
    },
    batchAudit() {
      if (this.selectDataList.length == 0) {
        this.msgErr("请选择需要审核的数据");
        return;
      }
      this.batchAuditModalShow = true;
      this.auditFlag = '2';
    },
    batchAuditOk(form) {
      this.batchAuditModalLoading = true;
      this.$refs[form].validate(valid => {
        if (valid) {
           switch(this.auditFlag){
            case '1':
              this.auditForm.applyIds.push(this.auditData.id);
              break;
            case '2':
              for (var i in this.selectDataList) {
                this.auditForm.applyIds.push(this.selectDataList[i].id);
              }
              break;  
          }
          
          if(this.auditing != 0){
            his.msgErr("请勿重复提交审核");
            return;
          }
          if(this.auditing == 0){
            this.auditing = 1;
          }
          financialWithdrawApplyAudit(this.auditForm).then(res => {
            if (res.code === "200") {
              this.batchAuditModalShow = false;
              this.search(this.searchForm);
            } else {
              this.msgErr("审核失败");
            }
          });
        }
        this.batchAuditModalLoading = false;
      });
    },
    excelExport() {
      financialWithdrawApplyDownload(this.searchForm).then(res => {
        const content = res.data;
        let fileName = res.headers["filename"];
        const blob = new Blob([content], { type: "application/vnd.ms-excel" });
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
      });
    },
    cancel() {
      this.batchAuditModalShow = false;
      this.auditFormModalChange();
    },
    auditFormModalChange(sta) {
     this.auditForm.applyIds=[];
     this.auditForm.result="";
     this.auditForm.remarks="";
     this.auditing=0;
    },
    auditStepChange(val) {
      this.searchForm.status = null;
      switch (val) {
        case "1":
           this.searchForm.status = '0';
          this.batchAuditBtnShow=true;
          break;
        default:
          if(val === '2'){
            this.searchForm.status = '5';
          }
          this.batchAuditBtnShow = false;
          break;
      }
      this.search();
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3
      });
    }
  }
};
</script>