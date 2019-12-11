<template>
  <div class="label_manage">
    <Card style="margin-top: 1vh;" dis-hover>
      <Row class="operation">
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">

          <Form-item label="品牌名称" prop="labelName">
            <Input v-model="searchForm.labelName" placeholder="请输入品牌名称" style="width: auto" />
          </Form-item>

          <Form-item label="商户名称" prop="labelName">
            <Input v-model="searchForm.labelName" placeholder="请输入商户名称" style="width: auto" />
          </Form-item>

          <Form-item style="margin-left:-35px;" class="br">
            <Button @click="search" type="primary" icon="ios-search">搜索</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </Form-item>
        </Form>
      </Row>

      <!-- 用户列表 -->
      <Table :loading="TableLoading" border :columns="tableColumns" :data="table_list" sortable="custom"
        @on-row-click="selectRow" highlight-row ref="table">
        <template slot-scope="{ row }" slot="operate">
          <Button type="text" size="small" style="color:#2db7f5" @click="editLabelDisplayFn(row)">申请付款</Button>
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

  </div>
</template>
<script>
  const columns = [{
      title: "操作",
      width: 100,
      align: "left",
      slot: "operate"
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
      title: "商户地址",
      align: "center",
    },
  ]

  export default {
    name: 'merchant',
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
      selectRow(item) {
        this.$emit('on-row-select', item)
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
