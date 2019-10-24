<template>
  <div class="xxx">
    <!-- 赏U列表 RewardUList   -->
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Row type="flex" justify="start">
          <Button type="primary" icon="md-add" @click="addOrEdit('add')">新增</Button>
          <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="sortOrder">
          <template v-if="row.status==0">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="sortOrder(row,1)"
            >上升</Button>
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="sortOrder(row,-1)"
            >下降</Button>
          </template>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="addOrEdit('edit',row)"
          >编辑</Button>
          <Poptip
            :transfer="true"
            confirm
            placement="bottom-end"
            :title="`确认${row.reverseStatusText}吗?`"
            @on-ok="enableItem(row)"
            @on-cancel="cancel(row)"
            ok-text="确认"
            cancel-text="取消"
            word-wrap
          >
            <Button type="warning" size="small">{{row.reverseStatusText}}</Button>
          </Poptip>
        </template>

        <template slot-scope="{ row }" slot="iconUrl">
          <img :src="row.iconUrl" style="width:74px;height:43px;" />
        </template>

        <template slot-scope="{ row }" slot="hotUrl">
          <img v-if="row.hotUrl" :src="row.hotUrl" style="width:74px;height:43px;" />
        </template>
      </Table>
      <!-- 分页器 -->
      <Row type="flex" justify="end" class="page">
        <!-- show-total 显示总数 共{{ total }}条 -->
        <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
        <Page
          show-total
          show-elevator
          :current="page.pageNum"
          :page-size="page.pageSize"
          :total="page.total"
          @on-change="changeCurrent"
        ></Page>
      </Row>
    </Card>

    <Drawer v-model="showEdit" :closable="true" width="820" :styles="styles">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{action.type=="add"?"新增":"编辑"}}</span>
      </p>
      <QuickEntryEdit
        v-if="showEdit"
        :showEdit.sync="showEdit"
        :action="action"
        @refresh="queryTableData"
      ></QuickEntryEdit>
    </Drawer>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
import columns from "./columns";
import QuickEntryEdit from "./QuickEntryEdit";

export default {
  name: "quick-entry-list",
  inject: ["typeOption", "msgOk", "msgErr"],
  components: { QuickEntryEdit },
  watch: {
    ["formValidate.status"]() {
      const status = this.formValidate.status;
      const arr = ["", "请输入通过原因", "请输入50字以内未通过原因"];
      this.reasonPlaceholder = arr[status];
      //清空验证
      if (status == 1) {
        this.$refs.formValidate.resetFields();
      }
      console.log("reasonPlaceholder", status, this.reasonPlaceholder);
    }
  },
  data() {
    return {
      showEdit: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      id: "",
      // 请输入50字以内未通过原因
      reasonPlaceholder: "请输入通过原因",
      formValidate: {
        status: "1",
        reason: ""
      },
      action: {
        id: Math.random(),
        type: "add",
        data: {
          title: "",
          iconUrl: "",
          defaultIconUrlList: [],
          hotUrl: "",
          defaultHotUrlList: []
        }
      },
      ruleValidate: {},

      // 状态 status 显示“未开始、进行中、已结束、已终止”选项。	默认显示“请选择”。
      // isStop 是否终止 1-中止，0-正常
      // isStop "0": "未开始", "1": "进行中", "2": "已结束", "3": "已终止"
      isStopOption: {
        "0": "未开始",
        "1": "进行中",
        "2": "已结束",
        "3": "已终止"
      },
      // merchantTypeOption: { 0: "本地商户（单店）", 1: "本地商户（多店）" },
      // 查询参数
      searchData: {
        name: "", //任务名称
        status: "", // 审核类型
        isStop: "" //状态
      },
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      columns,
      tableData: [],
      detailData: {} //查看详情
    };
  },
  created() {
    // console.log("okkk", this.msgOk);
    this.queryTableData();
  },
  methods: {
    formModalChange(flag) {
      if (!flag) {
        //清空form表单数据
        this.formValidate = {
          status: "1",
          reason: ""
        };
      }
    },
    validateReason(rule, value, callback) {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("审核原因不能为空"));
      } else if (value.length >= 50) {
        callback(new Error("请输入50字以内的字符"));
      } else {
        callback();
      }
    },
    async ok({ id }) {
      this.$Message.info("正在删除");
      // console.log("del", id);
      // const { code, msg } = await delMerchant(id);
      // if (code == 200) {
      //   this.msgOk("删除成功");
      //   //查询table
      //   this.queryTableData();
      // } else {
      //   this.msgErr(msg);
      // }
    },
    async sortOrder(item, stepNum) {
      // 只有启用才能排序
      const { id, status } = item;
      // stepNum步长，正数提高排名 1 & 负数下降排名-1
      // 快捷入口排序
      const url = "/page/module/layout/sortOrder";

      if (status == 1) {
        return this.msgErr("非法状态");
      }
      const { code, msg } = await postRequest(url, { id, stepNum });

      const text = stepNum > 0 ? "升序" : "降序";
      if (code == 200) {
        this.msgOk(`${text}成功`);
        //查询table
        this.queryTableData();
      } else {
        this.msgErr(msg);
      }
    },
    async enableItem({ id, status, reverseStatusText }) {
      this.msgOk(`正在${reverseStatusText}`);
      // 快捷入口启用或禁用
      const url = "/page/module/layout/enableItem";
      // status: 状态，0-开启 & 1-禁用
      status = status == 0 ? 1 : 0;

      const { code, msg } = await postRequest(url, { id, status });
      if (code == 200) {
        this.msgOk(`${reverseStatusText}成功`);
        //查询table
        this.queryTableData();
      } else {
        this.msgErr(msg);
      }
    },
    cancel({ reverseStatusText }) {
      this.msgOk(`${reverseStatusText}已取消`);
    },
    async addOrEdit(type, row) {
      this.showEdit = true;
      const id = Math.random();
      // 默认新增
      let data = {
        title: "",
        iconUrl: "",
        defaultIconUrlList: [],
        hotUrl: "",
        defaultHotUrlList: []
      };
      // 新增/编辑
      if (type == "edit") {
        data = row;
      }
      this.action = { id, type, data };

      console.log("this.action:",this.action);
      
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

      // /page/module/layout/listQuickItem  快捷入口列表获取
      const url = "/page/module/layout/listQuickItem";
      const res = await postRequest(url, { ...this.page });
      const {
        code,
        data: { current, total, size, records }
      } = res;

      if (code == 200) {
        this.tableData = records.map(item => {
          const { type, status, iconUrl, hotUrl } = item;

          item.typeText = this.typeOption[type];

          if (status == 1) {
            item.reverseStatusText = "启用";
          } else {
            item.reverseStatusText = "禁用";
          }

          item.defaultIconUrlList = [];
          if (iconUrl) {
            item.defaultIconUrlList = [{ imgUrl: iconUrl }];
          }
          item.defaultHotUrlList = [];
          if (hotUrl) {
            item.defaultHotUrlList = [{ imgUrl: hotUrl }];
          }
          return item;
        });

        this.page.pageNum = current; //分页查询起始记录
        this.page.total = total; //列表总数
        this.page.pageSize = size; //每页数据
      } else {
        this.msgErr(`${code}数据加载失败!`);
      }
      this.loading = false;
    },
    reset() {
      // 重置查询参数
      this.searchData = {
        name: "", //任务名称
        status: "", // 审核类型
        isStop: "" //状态
      };

      this.page = {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      };

      //重新查询一遍
      this.queryTableData();
    },
    
  }
};
</script>
<style scoped>
.underline {
  text-decoration: underline;
}
.table-box {
  min-height: 100px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.marginLeft20 {
  margin-left: 20px;
}
</style>