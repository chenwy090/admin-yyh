<template>
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="结算单号" prop="labelName">
          <Input v-model="searchForm.labelName" placeholder="请输入结算单号" style="width: 200px" />
        </Form-item>

        <FormItem label="结算周期">
          <DatePicker type="daterange" placeholder="请选择结算周期" v-model="searchForm.date" style="width: 200px">
          </DatePicker>
        </FormItem>

        <Form-item label="品牌名称" prop="labelName">
          <Input v-model="searchForm.labelName" placeholder="请输入品牌名称" style="width: 200px" />
        </Form-item>

        <Form-item label="商户名称" prop="labelName">
          <Input v-model="searchForm.labelName" placeholder="请输入商户名称" style="width: 200px" />
        </Form-item>

        <Form-item label="状态" prop="status">
          <Select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 200px;">
            <Option value="">全部</Option>
            <Option value="1">已启用</Option>
            <Option value="0">已禁用</Option>
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
          <!-- 只有状态为"待处理、被驳回"状态时，才会显示"申请付款"按钮。 -->
          <Button type="text" size="small" style="color:#2db7f5" @click="editLabelDisplayFn(row)">申请付款</Button>
          <Button type="text" size="small" style="color:#21b6b8" @click="settleBillDownload(row)">下载</Button>
          <!-- 只有状态为"被驳回"状态时，才会显示"重新生成"按钮。 -->
          <Button type="text" size="small" style="color:#21b6b8" @click="settleBillRegen(row)">重新生成</Button>
          <!-- 只有状态为"待处理、被驳回"状态时，才会显示"删除"按钮。 -->
          <Button type="text" size="small" style="color:#ed4014" @click="settleBillDelete(row)">删除</Button>
        </template>
        <template slot-scope="{ row }" slot="status">
            <Tooltip placement="top">
              <p>被驳回</p>
              <div slot="content">
                  <p>Display multiple lines of information</p>
                  <p><i>Can customize the style</i></p>
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
        <Form-item label="结算商户" prop="name">
          <Input style="width:80%" v-model="modalAddData.name" :placeholder="`点击按钮选择结算商户`" disabled>
          <Button @click="handleChoose" slot="append">选择</Button>
          </Input>
        </Form-item>
        <Form-item label="结算周期" prop="date">
          <DatePicker type="daterange" placeholder="请选择结算周期" v-model="modalAddData.date" style="width: 200px;">
          </DatePicker>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalAddShow = false">取消</Button>
        <Button type="primary" @click="modalAddOk('modalAddForm2')">保存</Button>
      </div>
    </Modal>

    <Modal width="900" v-model="modalMerchantShow" title="选择商户" :mask-closable="false"
      @on-cancel="modalMerchantShow = false">
      <merchant @on-row-select=" merchantData = $event"></merchant>
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
  } from '@/api/financial';

  const columns = [{
      title: "操作",
      width: 250,
      align: "left",
      fixed: "left",
      slot: "operate"
    },
    {
      title: "结算单号",
      width: 190,
      align: "center",
    },
    {
      title: "结算周期",
      width: 190,
      align: "center",
    },
    {
      title: "品牌名称",
      width: 190,
      align: "center",
    },
    {
      title: "商户名称",
      width: 190,
      align: "center",
    },
    {
      title: "交易金额（元）",
      width: 190,
      align: "right",
    },
    {
      title: "支付通消费（元）",
      width: 190,
      align: "right",
    },
    {
      title: "平台分账含通消费（元）",
      width: 190,
      align: "right",
    },
    {
      title: "商户分账（元）",
      width: 190,
      align: "right",
    },
    {
      title: "状态",
      width: 190,
      align: "center",
      slot: "status"
    },
    {
      title: "生成方式",
      width: 190,
      align: "center",
    },
    {
      title: "创建人",
      width: 190,
      align: "center",
    },
    {
      title: "创建时间",
      width: 190,
      align: "center",
    },
  ]

  export default {
    components: {
      merchant
    },
    data() {
      return {
        searchForm: {},

        current: 1,
        totalSize: 1, //总条数
        // pageNum: 1, //开始条数
        TableLoading: false,
        table_list: [{}],
        tableColumns: columns,

        loading: false,
        modalAddShow: false,
        modalAddData: {
          name: '',
          date2: [],
        },
        modalAddValidate: {
          name: {
            required: true,
            message: "商户不能为空",
            trigger: "change"
          },
          date: {
            required: true,
            message: "结算周期不能为空",
            validator: (rule, value, callback) => {
              if (value.filter(v => v).length === 0) {
                callback(new Error("请选择结算日期"))
              } else {
                callback()
              }
            }
          }
        },
        modalMerchantShow: false,
        merchantData: null,
      }
    },
    methods: {
      // 刷新
      update() {
        this.search();
      },
      search() {

      },
      getList() {

      },
      changeCurrent(current) {

      },
      // 重置form表单
      resetForm(name) {
        this.$refs[name].resetFields();
        if (name == "searchForm") {

        }
      },
      addManualDisplayFn() {
        this.modalAddShow = true;
      },
      modalAddOk(name) {
        this.$refs[name].validate(valid => {
          console.info(valid)
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
        this.modalAddData.name = '1111';
      },
      editLabelDisplayFn(){
        this.$Modal.confirm({
          title: '申请付款',
          content: '<p>您确认要提交申请付款吗？</p>',
          onOk:()=> {
            console.info('onOk')
          },
          onCancel:()=> {
            console.info('onCancel')
          },
        })
      },
      settleBillDownload(){},
      settleBillRegen(){},
      settleBillDelete(){},
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
