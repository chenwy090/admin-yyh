<template>
  <!-- Withdrawal - switch -->
  <div style="margin-bottom: 20px;">
    <Row>
      <h3>提现-开关</h3>
      <Button size="small" icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
    </Row>
    <div>
      <Table border width="100%" :columns="columns" :data="tableData" :loading="tableLoading">
        <template slot-scope="{ row }" slot="action">
          <Button type="success" style="margin-right: 5px" size="small" @click="openModal(row)">修改</Button>
        </template>
      </Table>
    </div>

    <!--修改 提现-开关 对话框-->
    <Modal v-model="modal.isopen" :title="modal.levelName" :mask-closable="false" footer-hide>
      <Form
        ref="form"
        label-position="right"
        :model="formData"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem
          label="标题:"
          prop="title"
          :rules="{required: true,  validator: validateEmpty('请输入标题')}"
        >
          <Input style="width:80%" v-model="formData.title" placeholder="请输入标题" clearable />
        </FormItem>

        <FormItem
          label="内容:"
          prop="contentInfo"
          :rules="{required: true,  validator: validateEmpty('请输入内容',50)}"
        >
          <Input style="width:80%" v-model="formData.contentInfo" placeholder="请输入内容" clearable />
        </FormItem>
        <FormItem label="开关状态:">
          <i-switch
            v-model="formData.switchStatus"
            false-color="#ff4949"
            @on-change="switchStatusChange"
          >
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </FormItem>
        <FormItem>
          <Button
            style="float: right;margin-left: 20px"
            type="primary"
            @click="handleSubmit('form')"
          >确认</Button>
          <Button style="margin-left: 8px;float: right;" @click="closeDialog">关闭</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { postRequest } from "@/libs/axios";
export default {
  name: "withdrawal-switch",
  data() {
    return {
      ruleValidate: {},
      tableLoading: false,
      modal: {
        levelName: "提现-开关",
        isopen: false
      },
      formData: {
        id: "", //id
        title: "", //标题
        contentInfo: "", //内容
        status: "", //状态 status=>0:开 true 1:关 false
        switchStatus: false
      },
      columns: [
        {
          title: "操作",
          align: "center",
          width: 100,
          fixed: "left",
          slot: "action"
        },
        {
          title: "序号",
          type: "index",
          align: "center",
          minWidth: 100
        },
        {
          title: "标题",
          align: "center",
          minWidth: 160,
          key: "title"
        },
        {
          title: "内容",
          align: "center",
          minWidth: 160,
          key: "contentInfo"
        },
        // status=>0:开 1:关
        {
          title: "状态",
          align: "center",
          minWidth: 160,
          key: "statusText"
        },
        {
          title: "修改人",
          align: "center",
          minWidth: 160,
          key: "modifiedBy"
        },
        {
          title: "修改时间",
          align: "center",
          minWidth: 160,
          key: "gmtModified"
        }
      ],
      tableData: []
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
    switchStatusChange(status) {
      // console.log("开关状态：" + status);
      this.formData.status = status ? 0 : 1;
      // console.log("开关状态status：" + this.formData.status);
    },
    openModal(item) {
      this.modal.isopen = true;
      this.formData = JSON.parse(JSON.stringify(item));
      // console.log("this.formData:", this.formData);
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
    async queryTableData() {
      this.tableLoading = true;
      const url = "/drawconfig/list";
      const { code, msg, data } = await postRequest(url);

      if (code == 200) {
        this.tableLoading = false;
        this.tableData = data.map(item => {
          const { status } = item; // 0:开 1:关
          item.switchStatus = !status;
          item.statusText = status == 0 ? "开" : "关";
          return item;
        });
      } else {
        this.msgErr(msg);
      }
      this.tableLoading = false;
    },
    async saveChange() {
      const url = "/drawconfig/edit";
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
        duration: 3
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3
      });
    }
  }
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


