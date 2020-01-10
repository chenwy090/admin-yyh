<template>
  <!-- Withdrawal - switch -->
  <div style="margin-bottom: 20px;">
    <Row>
      <h3>微信配置</h3>
      <Button size="small" icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
    </Row>
    <div>
      <Table border width="100%" :loading="tableLoading" :columns="tableColumns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <Button
            type="success"
            style="margin-right: 5px"
            size="small"
            @click="addOrEdit('edit')"
          >修改</Button>
        </template>
      </Table>
    </div>

    <!--新增/修改 微信 对话框-->
    <!-- <Edit :action="action" @refresh="queryTableData"></Edit> -->
    <Edit v-if="showEdit" :showEdit.sync="showEdit" :action="action" @refresh="queryTableData"></Edit>
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/libs/axios";
import tableColumns from "./columns";
import Edit from "./Edit";

export default {
  name: "wx-config",
  components: { Edit },
  data() {
    return {
      showEdit: false,
      action: {
        title: "",
        _id: Math.random(),
        id: "",
        type: "", //add/edit/detail/audit
        data: {},
      },
      tableColumns,
      tableData: [],
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
    async addOrEdit(type) {
      // type //add/edit/detail/audit
      let _id = Math.random();
      let title = "添加微信号";
      let data = null;

      if (type == "edit") {
        title = "编辑微信号";
        data = await this.queryAllData();
      }
      this.action = { _id, type, title, data };
      this.showEdit = true;
    },
    async queryAllData() {
      // 查询所有客服
      const url = "/kefu/getAllKefuWechatGroup";
      let { code, data, msg } = await postRequest(url);
      if (code == 200) {
        data = data.map(item => {
          let { groupUrl } = item;
          let defaultGroupUrlList = [];
          if (groupUrl) {
            defaultGroupUrlList = [{ imgUrl: groupUrl }];
          }
          item.defaultGroupUrlList = defaultGroupUrlList;
          return item;
        });
        return data;
      } else {
        this.msgErr(msg);
      }
    },
    closeDialog() {
      this.modal.isopen = false;
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.msgOk("数据验证成功!");
          this.saveChange();
        } else {
          this.msgErr("数据验证失败,请检查表单!");
        }
      });
    },
    // tableLoading
    async queryTableData() {
      this.tableLoading = true;
      const url = "/kefu/getKefuWechatConfig";

      try {
        // postRequest
        const { code, data } = await postRequest(url);

        if (code == 200) {
          this.tableData = [data];
        } else {
          this.msgErr(code + " 数据加载失败!");
        }
      } catch (error) {
        this.msgErr("系统异常");
      } finally {
        this.tableLoading = false;
      }
    },
    async saveChange() {
      const url = "/kefu/saveAllKefuWechatGroup";
      const { code, msg } = await postRequest(url, this.formData);
      if (code == 200) {
        this.queryTableData();
        setTimeout(() => {
          this.modal.isopen = false;
        }, 500);
      } else {
        this.msgErr(msg);
      }
    },
    validateEmpty(msg, len = 20) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        if (value.length > len) {
          return callback(`最多只能输入${len}个汉字`);
        }
        callback();
      };
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


