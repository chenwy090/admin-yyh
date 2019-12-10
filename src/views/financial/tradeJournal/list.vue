<template>
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="订单号" prop="labelName">
          <Input v-model="searchForm.labelName" placeholder="请输入订单号" style="width: auto" />
        </Form-item>
        <Form-item label="微信单号" prop="labelName">
          <Input v-model="searchForm.labelName" placeholder="请输入微信单号" style="width: auto" />
        </Form-item>
        <Form-item label="优惠卷ID" prop="labelName">
          <Input v-model="searchForm.labelName" placeholder="请输入微信单号" style="width: auto" />
        </Form-item>
        <Form-item label="品牌名称" prop="labelName">
          <Input v-model="searchForm.labelName" placeholder="请输入品牌名称" style="width: auto" />
        </Form-item>
        <Form-item label="商户名称" prop="labelName">
          <Input v-model="searchForm.labelName" placeholder="请输入商户名称" style="width: auto" />
        </Form-item>

        <Form-item label="支付方式" prop="status">
          <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px;">
            <Option value="">全部</Option>
            <Option value="1">已启用</Option>
            <Option value="0">已禁用</Option>
          </Select>
        </Form-item>
        <Form-item label="交易类型" prop="type">
          <Select v-model="searchForm.type" placeholder="请选择" clearable style="width: 200px;">
            <Option value="1">会员标签</Option>
            <Option value="2">抽奖团标签</Option>
            <Option value="3">超市券标签</Option>
            <Option value="4">周边券标签</Option>
            <Option value="5">内容标签</Option>
            <Option value="6">赏U标签</Option>
          </Select>
        </Form-item>

        <FormItem label="交易时间">
          <DatePicker type="daterange" placeholder="请选择交易时间" v-model="searchForm.date"></DatePicker>
        </FormItem>

        <Form-item style="margin-left:-35px;" class="br">
          <Button @click="search" type="primary" icon="ios-search">搜索</Button>
          <Button @click="resetForm('searchForm')">重置</Button>
        </Form-item>
      </Form>
    </Card>
    <Card style="margin-top: 1vh;">
      <!-- 用户列表 -->
      <Table :loading="TableLoading" border :columns="tableColumns" :data="table_list" sortable="custom" ref="table">

      </Table>
      <!-- 用户列表 -->
      <!-- 分页 -->
      <Row type="flex" justify="end" class="page">
        <Page :total="totalSize" show-total show-elevator @on-change="changeCurrent" style="float: right"
          :current.sync="current"></Page>
      </Row>
      <!-- 分页 -->
    </Card>

  </div>
</template>
<script>

  const columns = [
          {
            title: "订单号",
            width: 190,
            align: "center",
          },
          {
            title: "微信单号",
            width: 190,
            align: "center",
          },
          {
            title: "优惠卷ID",
            width: 190,
            align: "center",
          },
          {
            title: "优惠卷名称",
            width: 190,
            align: "center",
          },
          {
            title: "数量",
            width: 190,
            align: "right",
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
            title: "支付方式",
            width: 190,
            align: "center",
          },
          {
            title: "交易类型",
            width: 190,
            align: "center",
          },
          {
            title: "交易时间",
            width: 190,
            align: "center",
          },
        ]

  export default {
    data() {
      return {
        searchForm: {},

        current: 1,
        totalSize: 1, //总条数
        // pageNum: 1, //开始条数
        TableLoading: false,
        table_list: [{}],
        tableColumns: columns,
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
