<template>
  <div class="examine">
    <ModalDetail v-if="showDetail" :showDetail.sync="showDetail" :data="row"></ModalDetail>
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="审核状态：" :label-width="80" clearable>
            <Select v-model="searchData.status" style="width:120px" clearable>
              <Option v-for="(v,k) in statusOption" :value="k" :key="k">{{ v }}</Option>
              <!-- <Option v-for="(item,k) in statusOption" :value="item.value" :key="k">{{ item.label }}</Option> -->
            </Select>
          </FormItem>
          <FormItem label="创建人：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.creatBy" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="搜索标题：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.title" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="发布时间：" :label-width="100">
            <DatePicker
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              placeholder="请选择时间"
              style="display:inline-block;width: 280px"
              :value="daterange"
              @on-change="changeStartDate"
            ></DatePicker>
          </FormItem>

          <FormItem label="审核人：" :label-width="70">
            <Select v-model="searchData.auditBy" style="width:120px" clearable>
              <Option
                v-for="item in auditList"
                :value="item.userId"
                :key="item.userId"
              >{{ item.userName }}</Option>
            </Select>
          </FormItem>

          <FormItem label="类型：" :label-width="60">
            <Select v-model="searchData.sourceType" style="width:120px" clearable>
              <Option v-for="(v,k) in sourceTypeOption" :value="k" :key="k">{{ v }}</Option>
            </Select>
          </FormItem>

          <FormItem :label-width="0">
            <Button type="primary" icon="ios-search" @click="queryTableData()">搜索</Button>
            <Button icon="md-refresh" class="marginLeft20" @click="reset">重置</Button>
          </FormItem>
        </Form>
        <Row type="flex" justify="start">
          <Button
            type="dashed"
            class="marginLeft20"
            icon="md-arrow-round-back"
            @click="goback()"
          >返回上一层</Button>
          <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>

          <!-- 排序导入  排序导出 -->
          <Button type="success" class="marginLeft20" @click="upload">排序导入</Button>
          <Button type="success" class="marginLeft20" @click="download">排序导出</Button>
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
        <!-- action -->
        <!-- @click="addOrEdit('edit',row)" 
         //审核 status 0-创建，1-待审核(创建完成），2-审核成功（上架），3-审核失败（下架）',
          "1": "待审核",     审核 下架
          "2": "审核成功"    下架
          "3": "已下架"      审核
        -->
        <template slot-scope="{ row }" slot="action">
          <template v-if="row.status == 1||row.status == 3">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="examine(row.id, 1)"
            >审核</Button>
          </template>
          <template v-if="row.status == 1||row.status == 2">
            <Button type="warning" size="small" @click="examine(row.id, 0)">下架</Button>
          </template>
          <Button type="primary" size="small" style="margin: 5px" @click="queryDetail(row)">详情</Button>
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

    <FileImport
      v-if="showFileImport"
      :showFileImport.sync="showFileImport"
      @refresh="queryTableData"
    ></FileImport>
  </div>
</template>
<script>
import { getRequest, postRequest, downloadSteam } from "@/libs/axios";

import columns from "../columns";

import FileImport from "./FileImport";
import ModalDetail from "../ModalDetail";

export default {
  name: "examine",
  inject: ["linkTo", "msgOk", "msgErr"],
  components: { FileImport, ModalDetail },
  computed: {
    tab() {
      return this.tabs[this.compName];
    }
  },
  watch: {
    compName() {
      console.log("watch:compName", this.compName);
    }
  },
  data() {
    return {
      showDetail: false,
      row: {},
      showFileImport: false,
      daterange: [],
      //审核 status 0-创建，1-待审核(创建完成），2-审核成功（上架），3-审核失败（下架）',
      statusOption: {
        // "0": "创建",
        "1": "待审核",
        "2": "审核成功",
        "3": "已下架"
      },
      // "userStatus": 0,//0-正常 1-封禁
      userStatusOption: {
        "0": "正常",
        "1": "封禁"
      },
      // 类型 sourceType 1-官方 2-PGC 3-UGC
      sourceTypeOption: {
        "1": "官方",
        "2": "PGC",
        "3": "UGC"
      },
      auditList: [], //审核列表 [{userId,userName},...]
      // 查询参数
      searchData: {
        status: "", // 审核状态
        creatBy: "", // 创建人
        // userId: "", //  用户id
        title: "", //搜索标题
        //发布时间
        startTime: "", //起始时间 时间格式为（yyyy-MM-dd HH:mm:ss）
        endTime: "", //结束时间
        auditBy: "", // 审核人
        sourceType: "" // 类型
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
    this.getAuditList("content:list");
    this.queryTableData();
  },
  methods: {
    queryDetail(row) {
      this.showDetail = true;
      this.row = row;
    },
    upload() {
      this.showFileImport = true;
    },
    async download() {
      const url = "/content/exportContentSort";

      const res = await downloadSteam(url);
      // const res = await getRequest(url);
      console.log(111111111111111111, res);

      const content = res.data;

      const { filename } = res.headers;

      const blob = new Blob([content], { type: "application/vnd.ms-excel" });
      const oA = document.createElement("a");
      if ("download" in oA) {
        // 非IE下载
        oA.download = decodeURI(filename);
        oA.style.display = "none";
        oA.href = URL.createObjectURL(blob);
        document.body.appendChild(oA);
        oA.click();
        URL.revokeObjectURL(oA.href); // 释放URL 对象
        document.body.removeChild(oA);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, filename);
      }
    },

    changeStartDate(arr) {
      // yyyy-MM-dd HH:mm:ss
      console.log(arr);
      let [startTime, endTime] = arr;
      if (startTime) {
        startTime = `${arr[0]}:00`;
        endTime = `${arr[1]}:00`;
      }
      console.log(startTime, endTime);
      this.searchData.startTime = startTime;
      this.searchData.endTime = endTime;
    },
    goback() {
      this.linkTo("cms");
    },
    // 刷新搜索
    refresh() {
      this.queryTableData(this.page.pageNum);
    },
    async getAuditList(role) {
      //发布用户查询
      const url = "/system/sys-user/auditList";
      const { code, msg, data } = await postRequest(url, { role });
      if (code == 200) {
        // data:[{id,name,sort}]
        this.auditList = data;
      } else {
        this.msgErr(msg);
      }
    },
    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.queryTableData(pageNum);
    },

    async examine(id, type) {
      //审核
      const url = "/content/audit";
      const { code, msg, data } = await postRequest(url, { id, type });

      if (code == 200) {
        // data:[{id,name,sort}]
        console.log("examine", data);
        this.queryTableData(this.page.pageNum);
      } else {
        this.msgErr(msg);
      }
    },

    // 查询
    queryTableData(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.loading = true;
      const url = "/content/list";
      postRequest(url, {
        ...this.searchData,
        ...this.page
      }).then(res => {
        // console.log(res);
        const {
          code,
          data: { current, total, size, records }
        } = res;

        if (code == 200) {
          this.tableData = records.map(item => {
            // "userStatus": 0,//0-正常 1-封禁

            const {
              status,
              userStatus,
              sourceType,
              tags = [],
              citys = [],
              coupons = []
            } = item;
            // 用户状态:userStatusName  类型:sourceTypeName  城市:cityNames 标签:tagNames 优惠券:couponNames

            // 审核状态 status
            item.statusName = this.statusOption[status];
            // 用户状态 userStatus
            item.userStatusName = this.userStatusOption[userStatus];
            // 类型 sourceType
            item.sourceTypeName = this.sourceTypeOption[sourceType];

            item.cityNames = citys.map(({ cityName }) => cityName).join(",");
            item.tagNames = tags.map(({ name }) => name).join(",");
            item.couponNames = coupons
              .map(({ couponName }) => couponName)
              .join(",");
            return item;
          });

          this.page.pageNum = current; //分页查询起始记录
          this.page.total = total; //列表总数
          this.page.pageSize = size; //每页数据
        } else {
          this.$Message.error(res.code + " 数据加载失败!", 3);
        }
        this.loading = false;
      });
    },
    reset() {
      // 重置查询参数
      this.daterange = [];
      this.searchData = {
        status: "", // 审核状态
        creatBy: "", // 创建人
        // userId: "", //  用户id
        title: "", //搜索标题
        //发布时间
        startTime: "", //起始时间 时间格式为（yyyy-MM-dd HH:mm:ss）
        endTime: "", //结束时间
        auditBy: "", // 审核人
        sourceType: "" // 类型
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
<style lang="less" scoped>
.marginLeft20 {
  margin-left: 20px;
}
</style>


<style scoped>
</style>