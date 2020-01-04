<template>
  <!-- 日志表格-->
  <div>
    <Card :bordered="false">
      <Row type="flex" justify="start">
        <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
      </Row>
      <Table
        border
        size="small"
        :show-index="true"
        :loading="tableLoading"
        :columns="tableColumns"
        :data="tableData"
      >
        <template slot-scope="{ row }" slot="action">
          <Poptip
            :transfer="true"
            confirm
            placement="bottom-end"
            title="确认删除此条数据吗?"
            @on-ok="delItem(row)"
            @on-cancel="delCancel(row)"
            ok-text="确认"
            cancel-text="取消"
            word-wrap
          >
            <Button type="error" size="small">删除</Button>
          </Poptip>
        </template>
        <template slot-scope="{ row }" slot="url">
          <img :src="row.url" style="width:74px;height:43px;" @click="showBigImg(row)" />
        </template>
      </Table>
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

    <Modal v-model="bigImgDialog" title="查看大图" width="600" @on-cancel="bigImgCancel">
      <img style="width: 100%" :src="big_Image_url" />
    </Modal>
  </div>
</template>
<script>
import { getRequest, postRequest } from "@/libs/axios";
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
      bigImgDialog: false, //显示大图
      big_Image_url: "",
      tableColumns,
    };
  },
  created() {
    this.queryTableData();
  },
  methods: {
    // 显示大图
    showBigImg(row) {
      this.bigImgDialog = true;
      this.big_Image_url = row.url;
    },
    bigImgCancel() {
      this.bigImgDialog = false;
    },
    async add(params) {
      // params: {title,url}
      const url = "/store/resource/image/add";
      const { code, msg } = await postRequest(url, params);
      if (code == 200) {
        //查询table
        this.queryTableData();
      } else {
        this.msgErr(msg);
      }
    },
    async delItem(row) {
      this.msgOk("正在删除...");
      const url = "/store/resource/image/delete";
      const { code, msg } = await getRequest(url, { id: row.id });
      if (code == 200) {
        this.msgOk("删除成功");
        //查询table
        this.queryTableData();
      } else {
        this.msgErr(msg);
      }
    },
    delCancel() {
      this.msgOk("已取消删除");
    },
    // 查询
    async queryTableData() {
      this.tableLoading = true;
      // 列表
      const url = "/store/resource/image/list";

      try {
        let {
          code,
          msg,
          data: { current, total, size, records },
        } = await getRequest(url, { ...this.page });
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
