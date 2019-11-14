<template>
  <div>
    <Form ref="searchForm" :label-width="80" :model="searchForm" inline>
      <FormItem label="券名称">
        <Input v-model="searchForm.name" placeholder="券名称" />
      </FormItem>
      <FormItem>
        <ButtonGroup>
          <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')">搜索</Button>
        </ButtonGroup>
      </FormItem>
    </Form>
    <Table
      border
      :columns="tableColumns"
      :data="listData"
      sortable="custom"
      ref="table"
      :highlight-row="true"
      @on-current-change="selectedTr"
    ></Table>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <Page
        :total="totalSize"
        show-total
        show-elevator
        @on-change="changeCurrent"
        style="float: right"
        :current.sync="pageNum"
      ></Page>
    </Row>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/libs/axios";
export default {
  data() {
    return {
      TableLoading: false,
      totalSize: 0,
      pageNum: 1,
      pageSize: 10,
      listData: [],
      searchForm: {
        name: null,
        status:"1"
      },
      tableColumns: [
        {
          title: "券名称",
          key: "name"
        },
        {
          title: "活动开始时间",
          key: "startDate"
        },
        {
          title: "活动结束时间",
          key: "endDate"
        },
        {
          title: "兑换开始时间",
          key: "ChangeStartDate"
        },
        {
          title: "兑换结束时间",
          key: "ChangeEndDate"
        }
      ]
    };
  },
  methods: {
      resetRow(){
          this.handleClearCurrentRow();
      },
    search: function() {
      this.TableLoading = true;
      this.pageNum = 1;
      this.loadData();
    },
      handleClearCurrentRow () {
          this.$refs.table.clearCurrentRow();
      },
    loadData: function() {
      postRequest(
        "/campagin/list?pageNum=" + this.pageNum + "&pageSize=" + this.pageSize,
        this.searchForm
      ).then(res => {
        this.TableLoading = false;
        if (res.code == 200) {
          this.totalSize = res.data.total;
          this.listData = res.data.records;
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    selectedTr: function(currentRow, oldCurrentRow) {
        if(currentRow){
            this.$emit("seclectedTr-event", currentRow.campId, currentRow.name);
        }
    },
    changeCurrent: function(current) {
      if (this.searchForm.pageNum != current) {
        this.searchForm.pageNum = current;
        this.loadData();
      }
    },
    init: function() {
      this.search();
    }
  },
  mounted: function() {
    this.init();
  }
};
</script>

