<template>
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
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
        <FormItem label="结算付款时间">
          <DatePicker type="daterange" placeholder="请选择结算付款时间" v-model="searchForm.date" style="width: 200px">
          </DatePicker>
        </FormItem>
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
      <!-- 用户列表 -->
      <Table :loading="TableLoading" border :columns="tableColumns" :data="table_list" sortable="custom" ref="table">
        <template slot-scope="{ row }" slot="operate">
          <Button type="text" size="small" style="color:#2db7f5" @click="editLabelDisplayFn(row)">确认付款</Button>
          <Button type="text" size="small" style="color:#ed4014" @click="modalDisplayShowFu(row)">驳回</Button>
          <Button type="text" size="small" style="color:#21b6b8" @click="statusLabelDisplayFn(row)">下载</Button>
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
        <Form-item label="驳回理由" prop="remark">
          <Input v-model="displayData.remark" placeholder="请输入驳回理由" type="textarea" :rows="4" />
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
  const columns = [{
      title: "操作",
      width: 250,
      align: "left",
      fixed: "left",
      slot: "operate"
    }, {
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
    },
    {
      title: "生成方式",
      width: 190,
      align: "center",
    },
    {
      title: "结算付款单时间",
      width: 190,
      align: "center",
    },
    {
      title: "创建人",
      width: 190,
      align: "center",
    },
  ]

  export default {
    data() {
      return {
        searchForm: {

        },

        current: 1,
        totalSize: 1, //总条数
        TableLoading: false,
        table_list: [{}],
        tableColumns: columns,

        loading:false,
        displayData:{
          remark:''
        },
        modalDisplayShow:false,
        modalDisplayValidate:{
          remark: [{
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
          this.getList()
        }
      },
      modalDisplayShowFu(item){
        // this.displayData.id = item.id
        this.modalDisplayShow = true
      },
      modalDisplayOk(name){
        this.$refs[name].validate( valid => {
          console.info(valid)
        } )
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
