<template>
  <!-- Withdrawal - switch -->
  <div style="margin-bottom: 20px;">
    <Row>
      <h3>商户免审提现金额</h3>
      <Button size="small" icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
      <!-- <Button type="primary" class="marginLeft20" @click="showDeduction=true">扣款</Button> -->
    </Row>

    <div>
      <Table border width="100%" :columns="columns" :data="tableData" :loading="tableLoading">
        <template slot-scope="{ row }" slot="action">
          <Button type="success" style="margin-right: 5px" size="small" @click="openModal(row)">修改</Button>
        </template>
        <template slot-scope="{ row }" slot="log">
          <Button type="success" style="margin-right: 5px" size="small" @click="viewLogShow(row)">查看日志</Button>
        </template>
      </Table>
    </div>

    <!--修改对话框-->
    <Modal v-model="modal.isopen" :title="modal.levelName" :mask-closable="false" footer-hide>
      <Form
        ref="form"
        label-position="right"
        :model="formData"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem
          label="金额:"
          prop="value"
          :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
        >
          <Input style="width:80%" v-model="formData.value" placeholder="请输入免审金额" clearable />
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

    <!-- 操作日志 -->
    <Modal v-model="modalViewShow" title="操作日志" :mask-closable="false" @on-cancel="modalViewShow = false" width="600">

      <Table :loading="TableLoadingRizhi" border :columns="tableColumnsRizhi" :data="table_list_rizhi" sortable="custom"
        ref="tableRizhi"></Table>

      <Row type="flex" justify="end" class="page" style="margin-top: 1vh;">
        <Page :total="totalSize2" show-total show-elevator @on-change="changeCurrent2" style="float: right"
          :current.sync="current2"></Page>
      </Row>

      <div slot="footer">
        <Button type="text" @click="modalViewShow = false">取消</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import { postRequest } from "@/libs/axios";
export default {
  name: "withdrawal-free-amount",
  data() {
    return {
      ruleValidate: {},
      tableLoading: false,
      modal: {
        levelName: "商户免审提现金额",
        isopen: false
      },
      formData: {
        id: "", //id
        name: "", //商户提现免审金额
        remarks: "", //商户提现免审金额（单位：分）
        key: "", //maxMoney
        value: ""
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
          title: "配置项",
          align: "center",
          minWidth: 160,
          key: "name"
        },
        {
          title: "配置值",
          align: "center",
          minWidth: 160,
          key: "value"
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
          key: "modifiedTime"
        },
        {
          title: "操作日志",
          align: "center",
          minWidth: 100,
          slot: 'log'
        }
      ],
      tableData: [],

      rizhiData:{
        limit:10,
        page:1,
      },
      totalSize2: 0,
      current2: 1,
      table_list_rizhi:[],
      modalViewShow: false,
      TableLoadingRizhi: false,
      tableColumnsRizhi:[
        {
          title: "操作前",
          align: "right",
          minWidth: 100,
          key: "after"
        },
        {
          title: "操作后",
          align: "right",
          minWidth: 100,
          key: "before"
        },
        {
          title: "操作人",
          align: "center",
          minWidth: 100,
          key: "createBy"
        },
        {
          title: "操作时间",
          align: "center",
          minWidth: 160,
          key: "gmtCreate"
        }
      ]
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
      const url = "/trade/sys/conf/list";
      const { code, msg, data } = await postRequest(url);

      if (code == 200) {
        this.tableData = data;
      } else {
        this.msgErr(msg);
      }
      this.tableLoading = false;
    },
    async saveChange() {
      const url = "/trade/sys/conf/save";
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
    //验证正整数
    checkIsPositiveIntegerEx0(rule, value, callback) {
      var reg = /^([0-9][0-9]*)$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于等于0的正整数"));
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
    },

    changeCurrent2(current){
      this.rizhiData.page = current;
    },
    viewLogShow(item){
      this.modalViewShow = true;
      this.rizhiData.key = item.key;
      this.viewLog()
    },
    // 查看日志
    viewLog(){
      this.TableLoadingRizhi = true;
      postRequest('/trade/sys/conf/record', this.rizhiData).then(res => {
        this.TableLoadingRizhi = false;
          if (res && res.code == 200) {
            this.table_list_rizhi = res.data.records
            this.totalSize = res.data.total
          } else {
            this.$Message.error(res.msg);
          }
      })
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


