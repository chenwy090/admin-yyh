<template>
  <!-- Withdrawal - switch -->
  <div style="margin-bottom: 20px;">
    <Row>
      <h3>开通城市</h3>
      <Button size="small" icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
    </Row>
    <div>
      <Table border width="100%" :loading="tableLoading" :columns="tableColumns" :data="tableData">
      </Table>
    </div>
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/libs/axios";
import { tableMixin } from "@/mixins";
import tableColumns from "./columns";
import changeOpendStatus from "./opend";
import TableExpand from "./TableExpand.vue";

export default {
  name: "open-city",
  mixins: [tableMixin()],
  components: { TableExpand },
  data() {
    return {
      showEdit: false,
      tableColumns,
    };
  },
  created() {
    this.queryTableData();
  },
  methods: {
    // 刷新搜索
    refresh() {
      this.queryTableData();
    },
    // tableLoading
    async queryTableData() {
      this.tableLoading = true;
      const url = "/system/city/list/data";

      try {
        // postRequest
        const { code, data } = await postRequest(url);

        if (code == 200) {
          this.tableData = data.map(item => {
            item.openCityList = item.openCityList.map(it => {
              let { opened } = it;
              let obj = changeOpendStatus(opened);

              //  /system/city/close  关闭城市
              // /system/city/open 开通城市
              // if (opened) {
              //   // 开通 ---> 进行关闭操作 -->未开通
              //   obj = {
              //     url: "/system/city/close",
              //     loading: "正在关闭...",
              //     loadingSuccess: "关闭成功",
              //     openTitle: "确认要关闭此城市吗?",
              //     openType: "error",
              //     openText: "关闭",
              //   };
              // } else {
              //   // 未开通 ---> 进行开通操作
              //   obj = {
              //     url: "/system/city/open",
              //     loading: "正在开通...",
              //     loadingSuccess: "开通成功",
              //     openTitle: "确认要开通此城市吗?",
              //     openType: "success",
              //     openText: "开通",
              //   };
              // }
              return { ...it, ...obj };
            });
            return item;
          });
        } else {
          this.msgErr(code + " 数据加载失败!");
        }
      } catch (error) {
        this.msgErr("系统异常");
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
h3 {
  display: inline-block;
  border: 1px solid #d8d3d3;
  padding: 5px 10px;
  margin: 10px 0;
}
</style>


