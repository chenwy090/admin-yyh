<template>
  <div>
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="120" class="search-form">
          <Form-item label="审核状态" prop="logType1" :label-width="80">
            <Select v-model="searchForm.auditStatus" placeholder="请选择" style="width: 150px">
              <Option value>全部</Option>
              <Option value="PENDING_AUDIT">待审核</Option>
              <Option value="AUDIT_PASS">审核通过</Option>
              <Option value="AUDIT_REFUSE">审核驳回</Option>
              <!-- <Option value="RE_AUDIT_PASS">复审通过</Option>
              <Option value="RE_AUDIT_REFUSE">复审驳回</Option>-->
            </Select>
          </Form-item>
          <span v-if="drop">
            <Form-item label="申请记录开始时间" prop="startDate">
              <DatePicker
                type="date"
                placeholder="选择开始日期"
                style="width: 250px"
                format="yyyy-MM-dd"
                @on-change="time1"
                :value="searchForm.startDate"
              ></DatePicker>
            </Form-item>
            <Form-item label="申请记录结束时间" prop="endDate">
              <DatePicker
                type="date"
                placeholder="选择开始日期"
                style="width: 250px"
                format="yyyy-MM-dd"
                @on-change="time2"
                :value="searchForm.endDate"
              ></DatePicker>
            </Form-item>
            <Form-item label="手机号" :label-width="80">
              <InputNumber
                :max="999999999999"
                :min="0"
                type="text"
                v-model="searchForm.phoneNumber"
                clearable
                placeholder="请输入手机号"
                style="width: 200px"
              />
            </Form-item>
          </span>
          <!-- <Form-item style="margin-left:-90px;" class="br" prop> -->
          <Button type="primary" icon="ios-search" @click="search">搜索</Button>
          <Button icon="md-refresh" @click="resetForm('searchForm')" style="margin-left:5px">重置</Button>
          <a class="drop-down" @click="dropDown">
            {{dropDownContent}}
            <Icon :type="dropDownIcon"></Icon>
          </a>
          <!-- </Form-item> -->
        </Form>
      </Row>
    </Card>
    <Card>
      <!-- <Row class="operation">
          <Button type="primary" icon="md-add" @click="addTimed()">新增</Button>
      </Row>-->
      <Table :columns="columns1" :data="data1" :loading="TableLoading">
        <template slot-scope="{ row }" slot="action">
          <Button
            type="success"
            size="small"
            style="margin-right:5px;"
            @click="inputExamine(row)"
            v-if="row.audit_status == 'PENDING_AUDIT'"
          >审核</Button>
          <Button type="success" size="small" style="margin-right:5px;" v-else disabled>审核</Button>
          <Button
            type="success"
            size="small"
            style="margin-right:5px;"
            @click="inputCheck(row)"
            v-if="row.audit_status == 'AUDIT_PASS' || row.audit_status == 'AUDIT_REFUSE'"
          >查看详情</Button>
          <Button type="success" size="small" style="margin-right:5px;" v-else disabled>查看详情</Button>
        </template>
        <template slot-scope="{ row }" slot="audit_status">
          <span v-if="row.audit_status == 'PENDING_AUDIT'">待审核</span>
          <span v-else-if="row.audit_status == 'AUDIT_PASS'">审核通过</span>
          <span v-else-if="row.audit_status == 'AUDIT_REFUSE'">审核驳回</span>
          <!-- <span v-else-if="row.audit_status == 'RE_AUDIT_PASS'">复审通过</span>
          <span v-else-if="row.audit_status == 'RE_AUDIT_REFUSE'">复审驳回</span>-->
        </template>
      </Table>

      <Row type="flex" justify="end" class="page">
        <!-- 分页 -->
        <Page
          :total="totalSize"
          show-total
          show-elevator
          @on-change="changeCurrent"
          style="float: right"
          :current.sync="current"
        ></Page>
        <!-- 分页 -->
      </Row>
      <!-- 查看弹框 -->
      <Modal title="审核详情" v-model="checkDsplay" :mask-closable="false" footer-hide width="500">
        <div class="check">
          <div>
            <span>申请提现ID:</span>
            <span>{{checkData.applyCashId}}</span>
          </div>
          <div>
            <span>审核类型:</span>
            <span v-if="checkData.auditType == 'AUDIT'">审核</span>
            <span v-if="checkData.auditType == 'RE_AUDIT'">复审</span>
            <!-- <Select v-model="checkData.auditType" style="width: 150px" disabled>
            <Option value="AUDIT">审核</Option>
            <Option value="RE_AUDIT">复审</Option>
            </Select>-->
          </div>
          <div>
            <span>审核意见:</span>
            <span v-if="checkData.auditOpinion == 1">通过</span>
            <span v-if="checkData.auditOpinion == 0">驳回</span>
            <!-- <Select v-model="checkData.auditOpinion" style="width: 150px" disabled>
            <Option :value="1">通过</Option>
            <Option :value="0">驳回</Option>
            </Select>-->
          </div>
          <div>
            <span>审核人:</span>
            <span>{{checkData.auditor}}</span>
          </div>
          <div>
            <span>审核时间:</span>
            <span style="width: 350px">{{checkData.auditTime}}</span>
          </div>
          <div v-if="checkData.auditOpinion == 0">
            <span>驳回原因:</span>
            <span>{{checkData.refuseReason}}</span>
          </div>
          <div v-if="checkData.auditOpinion == 0">
            <span>备注:</span>
            <span>{{checkData.remark}}</span>
          </div>
        </div>
      </Modal>
      <!-- 查看弹框 -->
      <!-- 审核弹框 -->
      <Modal title="审核申请" v-model="examineDsplay" :mask-closable="false" footer-hide>
        <Form ref="formCustom" :model="formCustom" :label-width="80" style="margin-top:20px">
          <FormItem label="审核类型" required>
            <RadioGroup v-model="formCustom.auditType">
              <Radio label="AUDIT_PASS">审核通过</Radio>
              <Radio label="AUDIT_REFUSE">审核驳回</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="驳回理由" required>
            <Input
              type="textarea"
              :rows="2"
              v-model="formCustom.refuseReason"
              style="width:300px"
              v-if="formCustom.auditType == 'AUDIT_REFUSE'"
            ></Input>
            <Input type="textarea" :rows="2" style="width:300px" disabled v-else></Input>
          </FormItem>
          <FormItem label="备注" required>
            <Input
              type="textarea"
              :rows="2"
              v-model="formCustom.remark"
              style="width:300px"
              v-if="formCustom.auditType == 'AUDIT_REFUSE'"
            ></Input>
            <Input type="textarea" :rows="2" style="width:300px" disabled v-else></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="examineAndVerifyFn">确认</Button>
            <Button style="margin-left: 8px" @click="examineDsplay = false">关闭</Button>
          </FormItem>
        </Form>
      </Modal>
      <!-- 审核弹框 -->
    </Card>
  </div>
</template>

<script>
  import {
    applyCashManagementList,
    getExamineAllData,
    examineAndVerify
  } from "@/api/sys";

  export default {
    name: "applyCash-manage",
    components: {},
    data() {
      return {
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",
        TableLoading: false,
        // 搜索
        searchForm: {
          auditStatus: "", // 审核状态，审核列表默认传PENDING_AUDIT
          endDate: "", // 申请记录结束时间
          startDate: "", // 申请记录开始时间
          phoneNumber: null // 手机号
        },
        //列表字段显示
        columns1: [
          {
            title: "操作",
            minWidth: 180,
            fixed: "left",
            slot: "action",
            align: "center"
          },
          {
            title: "id",
            key: "id",
            minWidth: 150,
            align: "center"
          },
          {
            title: "获得积分者",
            key: "openid",
            minWidth: 225,
            align: "center"
          },
          {
            title: "用户名",
            key: "nickName",
            minWidth: 100,
            align: "center"
          },
          {
            title: "手机号",
            key: "phoneNumber",
            minWidth: 100,
            align: "center"
          },
          {
            title: "申请金额",
            key: "apply_amount",
            minWidth: 100,
            align: "center"
          },
          {
            title: "申请时间",
            key: "apply_time",
            minWidth: 140,
            align: "center"
          },
          {
            title: "最终审核人",
            key: "auditor",
            minWidth: 100,
            align: "center"
          },
          {
            title: "最终审核时间",
            key: "audit_time",
            minWidth: 140,
            align: "center"
          },
          {
            title: "状态",
            key: "audit_status",
            minWidth: 100,
            align: "center",
            slot: "audit_status"
          }
          // {
          //   title: "状态",
          //   key: "audit_status",
          //   minWidth: 100,
          //   align: "center",
          //   slot: "audit_status"
          // },
        ],
        data1: [], // 列表数据
        current: 1, //当前页码
        totalSize: 0, //总条数
        searchType: "", // 1：页面初始化 2：搜索
        apiId: "", //接口id
        checkData: {}, //查看数据
        checkDsplay: false, // 查看对话框
        examineDsplay: false, // 查看对话框
        // 审核form
        formCustom: {
          auditType: "", // 审核类型，审核通过-AUDIT_PASS，审核驳回-AUDIT_REFUSE
          id: "",
          refuseReason: "", // 驳回理由
          remark: "" // 备注
        }
      };
    },

    created: function() {
      this.getList({});
      this.searchType = 1;
    },

    methods: {
      // 搜索
      search() {
        // console.log(this.searchForm);
        this.searchType = 2;
        this.current = 1;
        this.getList(this.searchForm);
      },

      // 渲染列表
      getList(obj) {
        // 加载动画
        this.TableLoading = true;
        applyCashManagementList(obj, this.current).then(res => {
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
        this.current = current;
        if (this.searchType == 1) {
          this.getList({});
        } else if (this.searchType == 2) {
          this.getList(this.searchForm);
        }
      },

      // 传值到查看对话框
      inputCheck(row) {
        getExamineAllData(row.id).then(res => {
          if (res.code == 200) {
            this.checkData = res.data[0];
            if (this.checkData) {
              this.checkDsplay = true;
            }
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 重置form表单
      resetForm(name) {
        // this.searchForm.logType2 = "";
        this.searchForm.auditStatus = ' '
        this.searchForm.endDate = ''
        this.searchForm.startDate = ''
        this.searchForm.phoneNumber = null
        if(name == 'searchForm') {
          this.getList({});
          this.searchType = 1;
        }
        // this.$refs[name].resetFields();
        // console.log(this.searchForm);
      },

      // 传值到审核对话框
      inputExamine(row) {
        this.formCustom.id = row.id;
        this.examineDsplay = true;
      },

      // 提交审核申请
      examineAndVerifyFn() {
        // console.log(this.formCustom);
        // return
        examineAndVerify(
          this.formCustom.auditType,
          this.formCustom.id,
          this.formCustom.refuseReason,
          this.formCustom.remark
        ).then(res => {
          if (res.code == 200) {
            this.msgOk("审核申请完成");
            this.examineDsplay = false;
            this.getList({});
            // 清空输入框
            this.formCustom.auditType = '',
            this.formCustom.id = '',
            this.formCustom.refuseReason = '',
            this.formCustom.remark = ''
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 时间处理
      time1(e) {
        // let time = e.slice(0,10) + ' ' + '00:00:00'
        this.searchForm.startDate = e;
      },
      time2(e) {
        //let time = e.slice(0,10) + ' ' + '23:59:59'
        this.searchForm.endDate = e;
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
      }
      // -------------------------------------------------
    },
    filters: {},
    mounted() {}
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
    div {
      margin-bottom: 10px;
      span:nth-child(1) {
        width: 100px;
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        text-align: right;
      }
      span:nth-child(2) {
        // width: 100px;
        display: inline-block;
        font-size: 16px;
        margin-left: 15px;
      }
    }
  }
</style>