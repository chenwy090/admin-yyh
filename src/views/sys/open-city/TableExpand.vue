
<template>
  <!-- table-expand.vue -->
  <div>
    <Row class="expand-row">
      <Table
        border
        size="small"
        :show-index="true"
        :loading="tableLoading"
        :columns="tableColumns"
        :data="row.openCityList"
      >
        <template slot-scope="{ row }" slot="action">
          <Poptip
            :transfer="true"
            confirm
            placement="bottom-end"
            :title="row.openTitle"
            ok-text="确认"
            @on-ok="openOrCloseCity(row)"
            @on-cancel="cancel"
            cancel-text="取消"
            word-wrap
          >
            <Button :type="row.openType" size="small">{{row.openText}}</Button>
          </Poptip>
        </template>
      </Table>
    </Row>
  </div>
</template>
<script>
import { getRequest, postRequest } from "@/libs/axios";
import { tableMixin } from "@/mixins";
import { citycolumns as tableColumns } from "./columns";
import changeOpendStatus from "./opend";

export default {
  name: "table-expand",
  mixins: [tableMixin()],
  props: {
    row: {
      type: Object,
      default: _ => ({}),
    },
  },
  data() {
    return {
      tableColumns,
    };
  },
  created() {
    console.log("row:", this.row);
  },
  methods: {
    async openOrCloseCity(row) {
      //   cityCode
      //  /system/city/close  关闭城市
      // /system/city/open 开通城市

      const { opened } = row;

      this.msgOk(row.loading);
      const { code, msg, provinceOpened } = await postRequest(row.url, { cityCode: row.cityCode });
      if (code == 200) {
        this.msgOk(row.loadingSuccess);
        //查询table
        // this.queryTableData();

        let currentOpened = ~~!opened;
        let obj = changeOpendStatus(currentOpened);
        Object.assign(row, obj);
        row.opened = currentOpened;

        if (!!currentOpened) {
          this.row.opened = currentOpened;
        } else {
          this.row.opened = provinceOpened;
        }

        // console.log(provinceOpened, "----", JSON.stringify(row));
      } else {
        this.msgErr(msg);
      }
    },
    cancel() {
      this.msgOk("已取消");
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
.expand-row {
  margin-bottom: 16px;
}
</style>