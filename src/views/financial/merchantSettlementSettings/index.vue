<template>
  <div class="xxx">
    <!-- <h2 class="header">财务中心 > 商户账务 > 商户预充值</h2> -->
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <!-- 商户/品牌名称 -->
          <FormItem label="商户/品牌名称：" :label-width="120">
            <Input
              style="width:200px"
              type="text"
              v-model="searchData.name"
              placeholder="请输入"
              clearable
            ></Input>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" icon="ios-search" @click="queryTableData()">搜索</Button>
            <Button icon="md-refresh" class="marginLeft20" @click="reset">重置</Button>
          </FormItem>
        </Form>
        <Row type="flex" justify="start">
          <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
          <Button type="primary" class="marginLeft20" @click="addOrEdit('add')">新增</Button>
          <!-- <Button type="primary" class="marginLeft20" @click="showAudit=true">审核</Button>
          <Button type="primary" class="marginLeft20" @click="showDetail=true">详情</Button>-->
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="detail(row.id)">查看</Button>
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="addOrEdit('edit',row.id)"
          >编辑</Button>

          <!-- 待审核才允许审核 auditStatus: 1 -->
          <Button
            v-if="row.auditStatus==1"
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="audit(row.id)"
          >审核</Button>
        </template>
        <template slot-scope="{ row }" slot="auditLog">
          <Button type="text" size="small" @click="queryAuditList(row.id)">查看日志</Button>
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

    <ModalAuditLogList :id="id" v-if="showAuditLogList" :showAuditLogList.sync="showAuditLogList"></ModalAuditLogList>

    <!-- @on-close="closeDialog" -->
    <Drawer v-model="showEdit" :closable="true" :mask-closable="false" width="820" :styles="styles">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{action.title}}</span>
      </p>
      <Edit v-if="showEdit" :showEdit.sync="showEdit" :action="action" @refresh="queryTableData"></Edit>
    </Drawer>

    <Drawer
      v-model="showDetail"
      :closable="true"
      :mask-closable="true"
      width="820"
      :styles="styles"
    >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{action.title}}</span>
      </p>
      <Detail
        v-if="showDetail"
        :showDetail.sync="showDetail"
        :action="action"
        :detailData="detailData"
        @refresh="queryTableData"
      ></Detail>
    </Drawer>
    <!-- <Drawer v-model="showAudit" :closable="true" :mask-closable="true" width="820" :styles="styles">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>审核</span>
      </p>
      <Audit v-if="showAudit" :showAudit.sync="showAudit" :id="id" :detailData="detailData"></Audit>
    </Drawer>-->
  </div>
</template>
<script>
import { getRequest, postRequest } from "@/libs/axios";
import columns from "./columns";

import Edit from "./Edit";
import Detail from "./Detail";
import Audit from "./Audit";
import ModalAuditLogList from "./ModalAuditLogList";

import createTypeDate from "./typeData";
const typeData = createTypeDate();

export default {
  name: "Edit-management",
  components: {
    ModalAuditLogList,
    Edit,
    Detail,
    Audit
  },
  provide() {
    return {
      foo: this.foo,
      // foo: this.fonnB.a,
      info: this.info
      // 提示：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。
    };
  },
  data() {
    return {
      // fonnB: "old word",
      // fonnB: { a: "old word" },
      foo: {
        obj: { corporateWithdrawFee: { total: 0, bank: 0, platform: 0 } }
      },

      info: {
        obj: {
          corporateWithdrawFee: { total: 0, bank: 0, platform: 0 },
          individualWithdrawFee: { total: 0, bank: 0 },
          payPipelineFeeRate: { wx: 0, aliPay: 0 },
          shareProfitRate: { merchant: 0, platform: 0 }
        }
      },
      showAuditLogList: false,
      showEdit: false,
      showDetail: false,
      showAudit: false,
      action: {
        title: "",
        _id: Math.random(),
        id: "",
        type: "", //add/edit/detail/audit
        data: {}
      },
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      // 状态： 全部 、 待审核 、 已通过 、 审核失败 ；默认全部
      // '审核状态 0-待审核 1-审核通过 2-审核失败',
      statusOption: {
        "": "全部",
        "0": "待审核",
        "1": "已通过",
        "2": "审核失败"
      },
      daterange: [],
      // 查询参数
      id: 4,
      searchData: {
        name: "" //商户名称
      },
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      columns,
      tableData: [],
      detailTitle: "充值信息", //充值信息 扣款信息
      detailData: {} //查看详情
    };
  },
  created() {
    this.queryTableData();
    this.getInfo();
    // setInterval(() => {
    //   // this.fonnB.a = Math.random(); // 这里更新新，仅仅foonB变化了，foo没有变化
    //   // this.fonnB.a = { total: Math.random() }; // 这里更新新，仅仅foonB变化了，foo没有变化

    //   this.foo.obj = {
    //     corporateWithdrawFee: { total: Math.random(), bank: 0, platform: 0 }
    //   };
    //   this.info.obj.corporateWithdrawFee = { total: Math.random(), bank: 0, platform: 0 }
    //   // this.info.obj = { corporateWithdrawFee: { total: Math.random(), bank: 0, platform: 0 } }
    //   // this._provided.foo = "new words";
    //   // this._provided.foo = this.fonnB;
    //   //这里更新foo变化了，但子组件获得的foo 依旧是old words
    //   // console.log(JSON.stringify(this._provided), this.fonnB);
    //   console.log(JSON.stringify(this.foo));
    // }, 1000);
  },
  methods: {
    async addOrEdit(type, id) {
      let data = {};
      let title = "新增";
      // 新增/编辑
      if (type == "edit") {
        title = "编辑";
        data = await this.queryDataById(id, type);
      }

      this.action = {
        title,
        _id: Math.random(),
        id,
        type, //add/edit/detail/audit
        data
      };

      this.showEdit = true;
    },
    queryAuditList(id) {
      console.log("queryAuditList", id);
      this.id = id;
      this.$nextTick(_ => {
        this.showAuditLogList = true;
      });
    },
    async getInfo() {
      // 查询提现配置
      const url = "/trade/merchant/account/setting/withdraw/config";
      const { code, msg, data } = await getRequest(url);
      // let a = {
      //   corporateWithdrawFee: { total: 10, bank: 8, platform: 2 },
      //   individualWithdrawFee: { total: 1, bank: 1 },
      //   payPipelineFeeRate: { wx: 0.6, aliPay: 0.6 },
      //   shareProfitRate: { merchant: 97, platform: 3 }
      // };
      if (code == 200) {
        // this.obj = data;
        this.info.obj = data;
        console.log("this.obj", this.obj);
      } else {
        this.msgErr(msg);
      }
    },
    async audit(id) {
      const data = await this.queryDataById(id);
      const type = "audit"; //add/edit/detail/audit
      this.action = {
        title: "审核",
        _id: Math.random(),
        id,
        type,
        data
      };
      this.showDetail = true;
    },
    async detail(id) {
      const data = await this.queryDataById(id);
      const type = "detail"; //add/edit/detail/audit
      this.action = {
        title: "详情",
        _id: Math.random(),
        id,
        type,
        data
      };
      this.showDetail = true;
    },
    async queryDataById(id, actionType) {
      // 查询单个详情
      const url = "/trade/merchant/account/setting";
      const { code, data, msg } = await getRequest(url, { id });
      if (code == 200) {
        let {
          merchantType: type, //0/1/2/3
          merchantId, //商户
          brandId, //品牌
          merchantName,
          withdrawMin,
          withdrawUserId
        } = data;

        let { label, desc } = typeData[`type${type}`];
        data.businessTypeLabel = label;
        data.merchantTypeName = desc;

        console.log("merchantTypeName:", data.merchantTypeName);

        let tableData = [];
        if (type == 0) {
          data.businessId = merchantId;
          tableData.push({ merchantId, merchantName });
        } else {
          data.businessId = brandId;
          tableData.push({ brandId, merchantName });
        }

        data.businessName = merchantName;
        data.tableData = tableData;

        if (actionType == "edit") {
          withdrawMin = withdrawMin || "";
        } else {
          withdrawMin = withdrawMin || "不限制";
        }
        data.withdrawMin = `${withdrawMin}`;
        let accountList = await this.queryAccountList(data.businessId, type);
        let withdrawUserTableData = [];
        if (accountList) {
          withdrawUserTableData = accountList.filter(item => {
            for (let i = 0; i < withdrawUserId.length; i++) {
              if (item.userId == withdrawUserId[i]) {
                return true;
              }
            }
          });
        }
        // data.withdrawUserId = choices;
        data.withdrawUserTableData = withdrawUserTableData;
        this.detailData = data;
        return data;
      } else {
        this.msgErr(msg);
      }
    },

    // 获取用户数据
    async queryAccountList(id, type) {
      let url = "/merchant/merchantEmployee/merchant";
      if (type == 1) {
        url = "/merchant/merchantEmployee/brand";
      }
      console.log("queryTableData", this.id);
      const { code, data, msg } = await getRequest(url, { id });
      if (code == 200) {
        return data;
      } else {
        this.msgErr(msg);
      }
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

      const url = "/trade/merchant/account/setting/list";

      let {
        code,
        data: { records, current, total, size }
      } = await postRequest(url, {
        ...this.searchData,
        ...this.page
      });
      if (code == 200) {
        this.tableData = records;
        this.page.pageNum = current; //分页查询起始记录
        this.page.total = total; //列表总数
        this.page.pageSize = size; //每页数据
      } else {
        this.msgErr(code + " 数据加载失败!");
      }
      this.loading = false;
    },
    reset() {
      // 重置查询参数
      this.searchData = {
        name: "" //商户名称
      };
      this.page = {
        pageNum: 1, //页码
        pageSize: 10 //每页数量
      };
      //重新查询一遍
      this.queryTableData();
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