<template>
  <div class="label_manage">
    <Card style="margin-top: 1vh;" dis-hover>
      <Row class="operation">
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">

          <Form-item label="商户名称" prop="name">
            <Input v-model="searchForm.name" placeholder="请输入商户名称" style="width: auto" />
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
  import {
    getMerchantInfoList,
  } from '@/api/financial';

  const columns = [{
      title: "商户编号",
      align: "center",
      width: 150,
      key: "merchantId"
    },
    {
      title: "商户名称",
      align: "center",
      width: 230,
      key: "name"
    },
    {
      title: "地址",
      align: "center",
      key: "address",
      render: (h, params) => {
        let address =
          params.row.province +
          params.row.city +
          params.row.district +
          params.row.address;
        return h("span", address);
      }
    }
  ]

  export default {
    name: 'merchant',
    data() {
      return {
        searchForm: {
          pageNum: 1,
          pageSize: 10,
        },

        current: 1,
        totalSize: 1, //总条数
        // pageNum: 1, //开始条数
        TableLoading: false,
        table_list: [{}],
        tableColumns: columns,
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
        this.$emit('on-row-select', null)
        getMerchantInfoList(this.searchForm).then(res => {
          this.TableLoading = false;
          if (res && res.code == 200) {
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
          this.search()
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
