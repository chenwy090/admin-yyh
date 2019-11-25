<template>
  <div class="publish-list">
    <ModalDetail v-if="showDetail" :showDetail.sync="showDetail" :data="row"></ModalDetail>

    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="创建人ID：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.creatBy" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="搜索标题：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.title" placeholder="请输入"></Input>
          </FormItem>
          <!-- <FormItem label="发布内容：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.content" placeholder="请输入"></Input>
          </FormItem>-->

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
          <Button type="primary" class="marginLeft20" icon="md-add" @click="addOrEdit('add')">新增</Button>
          <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
        <!-- action -->
        <!--
           "1": "待审核",  //不能操作
           "2": "审核成功", //编辑
           "3": "已下架"    //编辑
        -->
        <template slot-scope="{ row }" slot="action">
          <template v-if="row.status==2||row.status==3">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="addOrEdit('edit',row)"
            >编辑</Button>
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
  </div>
</template>
<script>
import { getRequest, postRequest } from "@/libs/axios";

import columns from "../columns";

import ModalDetail from "../ModalDetail";

export default {
  name: "publish-list",
  inject: ["linkTo", "msgOk", "msgErr"],
  props: {
    action: {
      type: Object,
      default: function() {
        return {
          id: Math.random(),
          compName: "publish-list",
          type: "list", // list/add/edit
          data: {}
        };
      }
    }
  },
  components: { ModalDetail },
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
      daterange: [],
      //审核 status 0-创建，1-待审核(创建完成），2-审核成功（上架），3-审核失败（下架）',
      statusOption: {
        "0": "创建",
        "1": "待审核", //不能操作
        "2": "审核成功", //编辑
        "3": "已下架" //编辑
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
      // 状态 status 显示“未开始、进行中、已结束、已终止”选项。	默认显示“请选择”。
      // isStop 是否终止 1-中止，0-正常
      // isStop "0": "未开始", "1": "进行中", "2": "已结束", "3": "已终止"
      isStopOption: {
        "0": "未开始",
        "1": "进行中",
        "2": "已结束",
        "3": "已终止"
      },
      // 查询参数
      searchData: {
        status: "", // 审核状态
        creatBy: "", // 创建人
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
    this.queryTableData();
  },
  methods: {
    queryDetail(row) {
      this.showDetail = true;
      this.row = row;
    },
    addOrEdit(type, data) {
      const id = Math.random();
      let compName = `publish-${type == "list" ? "list" : "edit"}`;
      // 新增/编辑
      this.action.type = type;
      if (type == "edit") {
        this.action.data = data;
      }
      this.action.compName = compName;
    },
    upload() {
      this.showFileImport = true;
    },
    async download() {
      const url = "/content/exportContentSort";

      // const res = await downloadSteam(url);
      const res = await getRequest(url);

      console.log(111111111111111111, res);

      const content = res.data;

      //   const content = res;
      const { filename } = res.headers;

      //  const filename = "xxxx.xlsx";
      // console.log(111111111111111111, res);
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
      if (this.searchData.creatBy) {
        var r = /^\+?[1-9][0-9]*$/; //正整数
        var flag = r.test(this.searchData.creatBy);
        if (!flag) {
          this.$Message.error("请输入正确格式的创建人ID");
          return;
        }
      }
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
            // console.log(item.tags, item.citys, item.coupons);

            let { status, userStatus, sourceType, tags, citys, coupons } = item;
            tags = tags || [];
            citys = citys || [];
            coupons = coupons || [];

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
