<template>
  <!-- 日志表格-->
  <Card :bordered="false">
    <Table
      border
      size="small"
      :show-index="true"
      :loading="tableLoading"
      :columns="tableColumns"
      :data="tableData"
    ></Table>
    <!-- 分页器 -->
    <Row type="flex" justify="end" class="page">
      <!-- show-total 显示总数 共{{ total }}条 -->
      <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
      <Page
        size="small"
        show-total
        show-elevator
        :current="page.pageNum"
        :page-size="page.pageSize"
        :total="page.total"
        @on-change="handleCurrentChange"
      ></Page>
    </Row>
  </Card>
</template>
<script>
import { postRequest } from "@/libs/axios";
import { tableMixin } from "@/mixins";
import tableColumns from "./columns";

export default {
  name: "log",
  mixins: [tableMixin()],
  props: {
    id: {
      type: [Number, Object],
      default: null,
    },
  },
  watch: {
    id: {
      handler() {
        // console.log("watch log id:", this.id);
      },
      immediate: true,
    },
  },
  data() {
    return {
      isShow: true,
      tableColumns,
    };
  },
  created() {
    this.queryTableData();
  },
  methods: {
    // 查询
    async queryTableData() {
      this.tableLoading = true;
      // 审核记录
      const url = "/merchant/assignment/audit/list";

      try {
        let {
          code,
          msg,
          data: { current, total, size, records },
        } = await postRequest(url, { id: this.id, status: 2, ...this.page });
        if (code == 200) {
          this.tableData = records;
          this.page.pageNum = current; //分页查询起始记录
          this.page.total = total; //列表总数
          this.page.pageSize = size; //每页数据
        } else {
          this.msgErr(code + " 数据加载失败!");
        }
      } catch (error) {
        this.msgErr("系统错误！");
      } finally {
        this.tableLoading = false;
      }
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3,
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3,
      });
    },
  },
};
</script>

<style scoped>
</style>

<style lang="less">
</style>
