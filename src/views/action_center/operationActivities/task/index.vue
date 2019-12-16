<template>
  <!--  新建/编辑 任务设置  -->
  <div class="edit">
    <Card :bordered="false" style="margin-bottom:2px">
      <Row type="flex" justify="start">
        prizepoolId:{{prizepoolId}}
        <Button type="primary" icon="md-add" class="marginLeft20" @click="addOrEdit('add')">添加任务</Button>
        <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
      </Row>
    </Card>
    <Card :bordered="false">
      <!-- 1: 已上架、2：已下架 -->
      <!-- <template slot-scope="{ row }" slot="action">
      -->
      <Table
        border
        size="small"
        :show-index="true"
        :loading="loading"
        :columns="columns"
        :data="tableData"
      >
        <template slot-scope="{ row }" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="addOrEdit('edit',row)"
          >编辑任务</Button>
          <Poptip
            :transfer="true"
            confirm
            placement="bottom-end"
            :title="`确认删除此任务吗?`"
            @on-ok="delItem(row)"
            @on-cancel="delCancel(row)"
            ok-text="确认"
            cancel-text="取消"
            word-wrap
          >
            <Button type="error" size="small">删除</Button>
          </Poptip>
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
          @on-change="changeCurrent"
        ></Page>
      </Row>
    </Card>

    <Edit :action="taskAction" @refresh="queryTableData"></Edit>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("egg");
import { getRequest, postRequest } from "@/libs/axios";
import columns from "./columns";

import Edit from "./Edit";

export default {
  name: "task",
  components: { Edit },
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          id: Math.random(),
          label: "任务设置",
          compName: "task",
          url: "/activity/assignment/rule/list"
        };
      }
    },
    action: {
      type: Object,
      default: () => ({
        _id: Math.random(),
        title: "编辑奖池",
        type: "edit", //add/edit/detail/audit
        data: {}
      })
    }
  },
  computed: {
    ...mapState(["prizepoolId"])
  },
  watch: {
    prizepoolId() {
      console.log("task watch prizepoolId:", this.prizepoolId);
      console.log("task watch tab:", { ...this.tab });
    },
    tab: {
      handler(val, oldVal) {
        this.queryTableData();
        console.log("watch task this.tab:", { ...this.tab });
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      activityId: "",
      taskAction: {
        _id: Math.random(),
        title: "添加任务",
        type: "add", //query/add/edit
        data: null
      },

      // 任务类型 1-领优惠券 2-邀请助力 3-浏览页面 4-分享页面 5-内容点赞 6-下载APP
      assignmentType: "",
      assignmentTypeOption: {
        1: "领优惠券",
        2: "邀请助力",
        3: "浏览页面",
        4: "分享页面",
        5: "内容点赞",
        6: "下载APP"
      },
      // 新增、修改 任务抽奖banner
      isShow: false,
      // title: "查看奖池",
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      loading: false,
      columns,
      tableData: []
    };
  },
  mounted() {
    console.log("task.vue mounted", this.tab);
  },
  methods: {
    editTask(row) {
      console.log("editTask");
    },
    async delItem(row) {
      this.msgOk("正在删除...");
      const url = "/activity/assignment/rule/delete";
      const { code, msg } = await postRequest(url, { id: row.id });
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
    addOrEdit(type, data) {
      console.log("addOrEdit1 taskAction", type, data);

      if (type == "edit" && data.assignmentType == 1) {
        data.couponId = data.assignmentObject;
      }
      this.taskAction = {
        id: Math.random(),
        type,
        data
      };
      console.log("addOrEdit2 taskAction", { ...this.taskAction });
    },
    // 刷新搜索
    refresh() {
      this.queryTableData(this.page.pageNum);
    },
    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.queryTableData(pageNum);
    },
    // 查询
    async queryTableData(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.loading = true;

      const url = "/activity/assignment/rule/list";
      console.log("queryTableData", this.tab.url);

      try {
        let {
          code,
          data: { records, current, total, size }
        } = await getRequest(this.tab.url, {
          prizepoolId: this.prizepoolId,
          ...this.page
        });

        if (code == 200) {
          this.tableData = records.map(item => {
            let { assignmentType } = item;

            item.assignmentTypeName = this.assignmentTypeOption[assignmentType];
            console.log({ ...item });

            return item;
          });
          this.page.pageNum = current; //分页查询起始记录
          this.page.total = total; //列表总数
          this.page.pageSize = size; //每页数据
        } else {
          this.msgErr(code + " 数据加载失败!");
        }
      } catch (err) {
        console.log("try catch", err);
      }
      this.loading = false;
    },
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.$emit(`update:showEditJackpot`, false);
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.$Message.success("数据验证成功!");

          let oForm = JSON.parse(JSON.stringify(this.formData));

          // // 提交的时候清理数据
          // const { withdrawUserId } = oForm;

          console.log("submit oForm", oForm);
          // 新增/编辑
          let url = "/trade/merchant/account/setting/save";
          if (oForm.id) {
            //编辑
            url = "/trade/merchant/account/setting/update";
          }

          let { code, msg } = await postRequest(url, oForm);

          if (code == 200) {
            this.msgOk("保存成功");
            // 关闭对话框
            this.closeDialog();
            //刷新列表数据
            this.$emit("refresh");
          } else {
            this.msgErr(msg);
          }
        } else {
          this.msgErr("数据验证失败！");
        }
      });
    },
    validateBusinessName(rule, value, callback) {
      value += "";
      value = value.trim();
      // 允许不填
      if (value == "") {
        // ("请选择${businessTypeLabel}");
        return callback(`请选择${this.businessTypePlaceholder}`);
      }
      callback();
    },
    //验证金额 validateMoney
    validatorWithdrawMin(rule, value, callback) {
      value += "";
      value = value.trim();
      // 允许不填
      if (value == "") {
        return callback("金额不能为空");
      }

      // 排除 "","0","0.0","0.00"格式
      if (!value || value == "0" || value == "0.0" || value == "0.00") {
        return callback(new Error("兑换的金额不能为0"));
      }

      // 验证是否是数字
      const n = Number(value);
      if (isNaN(n)) {
        return callback(new Error("请输入数字"));
      }

      if (n > 0 && n <= 99999.99) {
        const reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/;

        if (!reg.test(value)) {
          return callback(
            new Error("请输入大于等于0的金额，小数点最多包含两位小数")
          );
        }
      } else {
        return callback(new Error("请输入[0.01—99999.99]之间的数"));
      }

      callback();
    },
    validateAccountList(rule, value, callback) {
      console.log("validateAccountList", rule, value);
      // if (!value.length) {
      if (!this.withdrawUserTableData.length) {
        return callback("请选择商户账号");
      }
      callback();
    },
    validateSalesName(rule, value, callback) {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("签单销售不能为空"));
      } else if (value.length > 30) {
        callback(new Error("签单销售最多支持30个字"));
      } else {
        callback();
      }
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
.edit {
  padding-bottom: 50px;
}
.demo-drawer-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>