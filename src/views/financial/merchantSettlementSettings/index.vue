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
          <Button type="primary" size="small" style="margin-right: 5px" @click="audit(row.id)">审核</Button>
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
        <span>新增/编辑</span>
      </p>
      <Edit v-if="showEdit" :showEdit.sync="showEdit" @refresh="queryTableData"></Edit>
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
  watch: {},
  data() {
    return {
      showAuditLogList: false,
      showEdit: false,
      showDetail: false,
      showAudit: false,
      action: {
        title: "",
        _id: Math.random(),
        id: "",
        type: "", //add/edit/detail/audit
        data: null
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
  },
  methods: {
    addOrEdit() {
      this.showEdit = true;
    },
    queryAuditList(id) {
      console.log("queryAuditList", id);
      this.id = id;
      this.$nextTick(_ => {
        this.showAuditLogList = true;
      });
    },
    audit(id) {
      this.action = {
        title: "审核",
        _id: Math.random(),
        id,
        type: "audit", //add/edit/detail/audit
        data: null
      };
      this.showDetail = true;
    },
    async detail(id) {
      this.action = {
        title: "详情",
        _id: Math.random(),
        id,
        type: "detail", //add/edit/detail/audit
        data: null
      };
      this.showDetail = true;
    },
    async queryDataById(id) {
      // 查询单个详情
      const url = "/trade/merchant/account/setting";
      const { code, data, msg } = await getRequest(url, { id });
      if (code == 200) {
        const {
          merchantType: type, //0/1/2/3
          merchantName,
          brandName,
          changeType,
          // 充值
          receivables,
          merchantMoneyChargesRecords: arr,
          // 扣款
          anticipatedDeduction,
          actualDeduction
        } = data;

        let { label, desc } = typeData[`type${type}`];
        data.businessTypeLabel = label;
        data.merchantTypeName = desc;
        if (type == 0) {
          data.businessName = merchantName;
        } else {
          data.businessName = brandName;
        }

        this.detailData = data;
        this.showDetail = true;
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