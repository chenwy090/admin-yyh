<template>
  <div class="xxx">
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="提现单号：" :label-width="80">
            <Input
              style="width:200px"
              type="text"
              v-model="searchData.orderNo"
              placeholder="请填写提现单号"
              clearable
            ></Input>
          </FormItem>
          <FormItem label="商户名称：" :label-width="80">
            <Input
              style="width: 200px"
              type="text"
              v-model="searchData.merchantName"
              clearable
              placeholder="请填写商户名称"
            />
          </FormItem>
          <FormItem style label="所在地区：" :label-width="80">
            <Select
              v-model="searchData.provinceCode"
              style="width:120px"
              clearable
              @on-change="getcitylist"
            >
              <Option
                v-for="(item,index) in provincelist"
                :key="index"
                :value="item.provinceCode"
              >{{item.provinceName}}</Option>
            </Select>
            <Select v-model="searchData.cityCode" style="width:120px" clearable>
              <Option
                v-for="(item,index) in citylist"
                :key="index"
                :value="item.cityCode"
              >{{item.cityName}}</Option>
            </Select>
          </FormItem>

          <FormItem label="提现人姓名：" :label-width="100">
            <Input
              style="width: 200px"
              type="text"
              v-model="searchData.userName"
              clearable
              placeholder="请填写提现人姓名"
            />
          </FormItem>

          <FormItem label="提现人手机：" :label-width="100">
            <Input
              style="width: 200px"
              type="text"
              v-model="searchData.userPhone"
              clearable
              placeholder="请填写提现人手机"
            />
          </FormItem>
          <FormItem label="提现时间：" :label-width="80">
            <DatePicker
              type="daterange"
              placeholder="请选择日期"
              style="width: 200px"
              :value="daterange"
              @on-change="changeStartDate"
            ></DatePicker>
          </FormItem>
          <FormItem label="审核状态：" :label-width="80">
            <Select v-model="searchData.auditStatus" style="width:100px" clearable>
              <Option v-for="(v,k) in statusOption" :value="k" :key="v">{{ v }}</Option>
            </Select>
          </FormItem>

          <!-- 开票： -->
          <FormItem label="开票：" :label-width="80">
            <Select v-model="searchData.invoiceStatus" style="width:100px" clearable>
              <Option v-for="(v,k) in invoiceStatusOption" :value="k" :key="v">{{ v }}</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" icon="ios-search" @click="queryTableData()">搜索</Button>
            <Button icon="md-refresh" class="marginLeft20" @click="reset">重置</Button>
          </FormItem>
        </Form>
        <Row type="flex" justify="start">
          <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="detail(row.id)">查看</Button>

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

    <!-- <ModalAuditLogList :id="id" v-if="showAuditLogList" :showAuditLogList.sync="showAuditLogList"></ModalAuditLogList> -->

    <!-- @on-close="closeDialog" -->
    <!-- <Drawer v-model="showEdit" :closable="true" :mask-closable="false" width="820" :styles="styles">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{action.title}}</span>
      </p>
      <Edit v-if="showEdit" :showEdit.sync="showEdit" :action="action" @refresh="queryTableData"></Edit>
    </Drawer>-->

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
  </div>
</template>
<script>
import { getRequest, postRequest } from "@/libs/axios";
import createColumns from "./columns";

const columns = createColumns();

console.log("columns,", columns);

// import Edit from "./Edit";
import Detail from "./Detail";
// import Audit from "./Audit";
// import ModalAuditLogList from "./ModalAuditLogList";

export default {
  name: "single-store",
  inject: ["download", "msgOk", "msgErr"],
  components: {
    // ModalAuditLogList,
    // Edit,
    Detail
    // Audit
  },

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
        "2": "通过",
        "3": "拒绝"
      },
      // 开票状态
      invoiceStatus: "",
      invoiceStatusOption: {
        "1": "未开票",
        "2": "已开票"
      },
      // 查询参数
      id: 4,
      daterange: [],
      searchData: {
        merchantType: 0, //0单商户 1品牌
        orderNo: "", //提现单号
        merchantName: "", //商户名称
        provinceCode: "", //提现单号
        cityCode: "", //省
        orderNo: "", //市
        userName: "", //提现人姓名：
        userPhone: "", //提现人手机
        withdrawTime: [], //提现时间
        auditStatus: "", //审核状态
        invoiceStatus: "" //开票状态
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
      detailData: {}, //查看详情
      provincelist: [],
      citylist: []
    };
  },
  mounted() {
    this.queryTableData();
    this.getprovincelist();
  },
  methods: {
    //获取省份信息数据
    getprovincelist() {
      const url = "/system/area/province/list";
      postRequest(url).then(res => {
        if (res.code == 200) {
          this.provincelist = res.data;
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    //根据省份code获取城市信息数据
    getcitylist() {
      const url = "/system/area/city/" + this.searchData.provinceCode;
      getRequest(url).then(res => {
        if (res.code == 200) {
          this.citylist = res.data;
          this.searchData.areaId = "";
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    changeStartDate(arr) {
      // yyyy-MM-dd HH:mm:ss
      console.log(arr);
      let [startTime, endTime] = arr;
      if (startTime) {
        startTime = `${arr[0]} 00:00:00`;
        endTime = `${arr[1]} 23:59:59`;
      }
      this.searchData.withdrawTime = [startTime, endTime];
    },
    queryAuditList(id) {
      console.log("queryAuditList", id);
      this.id = id;
      this.$nextTick(_ => {
        this.showAuditLogList = true;
      });
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
    async queryDataById(id) {
      // 查询详情
      const url = `/trade/merchant/withdraw/detail/${id}`;
      // const { code, data, msg } = await getRequest(url, { id });
      const { code, data, msg } = await getRequest(url);
      if (code == 200) {
        return data;
      } else {
        this.msgErr(msg);
      }
    },

    // 获取用户数据
    async queryAccountList(id) {
      const url = "/merchant/merchantEmployee/merchant";
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
      // 提现列表
      const url = "/trade/merchant/withdraw/page";

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
      this.daterange = []; // 时间
      this.searchData = {
        merchantType: 0, //0单商户 1品牌
        orderNo: "", //提现单号
        merchantName: "", //商户名称
        provinceCode: "", //提现单号
        cityCode: "", //省
        orderNo: "", //市
        userName: "", //提现人姓名：
        userPhone: "", //提现人手机
        withdrawTime: [], //提现时间
        auditStatus: "", //审核状态
        invoiceStatus: "" //开票
      };
      this.page = {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      };

      //重新查询一遍
      this.queryTableData();
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