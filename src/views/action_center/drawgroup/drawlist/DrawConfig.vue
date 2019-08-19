<template>
  <div class="xxx">
    <component ref="modalDetail" :is="'ModalDetail'"></component>
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="团类型" :label-width="60">
            <Select v-model="searchData.groupType" style="width:100px">
              <Option
                v-for="item in groupTypeList"
                :value="item.value"
                :key="item.value+item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态" :label-width="60">
            <Select v-model="searchData.status" style="width:100px">
              <Option
                v-for="item in statusList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="抽奖名称：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="抽奖时间：" :label-width="100">
            <DatePicker
              type="daterange"
              placeholder="请选择抽奖日期"
              style="display:inline-block;width: 200px"
              :value="daterange"
              @on-change="changeStartDate"
            ></DatePicker>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" icon="ios-search" @click="queryTableList()">搜索</Button>
            <Button icon="md-refresh" @click="reset">重置</Button>
          </FormItem>
        </Form>
        <Row type="flex" justify="start">
          <Button type="primary" icon="md-add" @click="addOrEdit('add')">新增</Button>
          <Button type="primary" class="marginLeft20" @click="changeComp('schedule-daily')">每日排期</Button>
          <Button type="primary" class="marginLeft20" @click="changeComp('bannerway')">抽奖团banner位</Button>
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <Table :show-index="true" :loading="loading" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <!--0：未上架 1:未开始 2:进行中 3:开奖中 4:已开奖 5:已下架  -->
          <template v-if="row.status == 4 || row.status == 5">
            <Button
              type="success"
              size="small"
              style="margin-right: 5px"
              @click="checkDetailsFn(row)"
            >查看</Button>
          </template>
          <template v-else>
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="addOrEdit('edit',row)"
            >编辑</Button>
            <Button
              type="success"
              size="small"
              v-if="row.status == 0"
              @click="updateOperationStatus(row)"
            >上架</Button>
            <Button
              type="warning"
              size="small"
              v-if="row.status == 1 || row.status == 2|| row.status == 3"
              @click="underUpdateOperationStatus(row)"
            >下架</Button>
          </template>
        </template>

        <template slot-scope="{ row }" slot="totalPlayer">
          <a
            @click="showTotalPlayer(row.id)"
            class="underline"
            href="javascript:;"
          >{{ row.totalPlayer }}</a>
        </template>
        <template slot-scope="{ row }" slot="totalTicket">
          <a
            @click="showTotalTicket(row.id)"
            class="underline"
            href="javascript:;"
          >{{ row.totalTicket }}</a>
        </template>
        <template slot-scope="{ row }" slot="result">
          <Button type="success" size="small" @click="queryResult(row)">查看</Button>
        </template>
      </Table>
      <!-- 分页器 -->
      <Row type="flex" justify="end" class="page">
        <!-- show-total 显示总数 共{{ total }}条 -->
        <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
        <Page
          show-total
          show-elevator
          :total="page.total"
          :current="page.pageNum"
          :page-size="page.pageSize"
          @on-change="changeCurrent"
        ></Page>
      </Row>
      <!-- 分页器 -->
    </Card>
    <Modal v-model="modalTotalPlayer" :closable="true">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>报名成功用户</span>
      </p>
      <div class="table-box">
        <Table :show-index="true" :columns="totalPlayerColumns" :data="totalPlayerTableData"></Table>
      </div>
    </Modal>
    <!-- 抽奖券 -->
    <Modal v-model="modalTotalTicket" :closable="true">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>抽奖券</span>
      </p>
      <div class="table-box">
        <Table :show-index="true" :columns="totalTicketColumns" :data="totalTicketTableData"></Table>
      </div>
    </Modal>
    <!-- 下架抽奖活动 -->
    <Modal v-model="undercarriage" :closable="true" width="400">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>下架抽奖活动</span>
      </p>
      <div>
        <Form label-position="top" ref="formValidate" :model="formValidate" :rules="ruleValidate">
          <FormItem label="填写原因：" prop="reason">
            <Input
              v-model="formValidate.reason"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="填写下架原因..."
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="putoff('formValidate')">确认</Button>
        <Button @click="cancelHandleReset('formValidate')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <draw-edit :id="id" :action="action" @refresh="queryTableList"></draw-edit>
    <!-- 查看 开奖结果 -->
    <winning-list :modalWinningList="modalWinningList" :id="id"></winning-list>
  </div>
</template>
<script>
import multiFormData from "./multiGroupFromData";
import singleFormData from "./multiGroupFromData";
// import singleFormData from "./singleGroupFromData";
import { postRequest } from "@/libs/axios";
import {
  putup,
  putoff,
  queryLuckDrawList,
  queryTotalPlayerList,
  queryTotalTicketList
} from "@/api/sys";
import columns, { totalPlayerColumns, totalTicketColumns } from "./columns";

import DrawEdit from "./DrawEdit";
import WinningList from "./WinningList";
import ModalDetail from "../Modal_detail";

export default {
  name: "draw-config",
  components: {
    ModalDetail: ModalDetail,
    [DrawEdit.name]: DrawEdit,
    [WinningList.name]: WinningList
  },

  data() {
    return {
      //------新增修改单人团/多人团--------------------
      //新增 add、修改 edit
      action: {
        id: Math.random(),
        type: "add"
      },
      //--------------------------
      id: "",
      modalTotalPlayer: false,
      modalTotalTicket: false,
      modalWinningList: false, // 查看
      undercarriage: false,
      formValidate: {
        reason: ""
      },
      ruleValidate: {
        reason: [
          {
            required: true,
            message: "下架原因不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            min: 10,
            message: "原因不得少于10个字",
            trigger: "blur"
          }
        ]
      },
      groupTypeList: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "单人团"
        },
        {
          value: 2,
          label: "多人团"
        }
      ],
      statusList: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: "0",
          label: "未上架"
        },
        {
          value: "1",
          label: "未开始"
        },
        {
          value: "2",
          label: "进行中"
        },
        {
          value: "3",
          label: "开奖中"
        },
        {
          value: "4",
          label: "已开奖"
        },
        {
          value: "5",
          label: "已下架"
        }
      ],
      daterange: [],
      searchData: {
        // 查询参数
        groupType: 0,
        name: "",
        status: "all", //提交后台过滤为 ""空字符串
        operationType: "",
        startTime: "",
        endTime: ""
        //分页参数
      },
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      columns,
      totalPlayerColumns,
      totalTicketColumns,
      tableData: [],
      totalPlayerTableData: [], //报名成功用户列表
      totalTicketTableData: [] //抽奖券列表
    };
  },
  created() {
    this.queryTableList();
  },
  methods: {
    // getData() {
    //   const url = "/drawDaily/activity/selectById";
    //   postRequest(url, { id: this.id }).then(res => {
    //     console.log("修改", res);
    //     if (res.code == 200) {
    //       this.$emit("closeFormModal-event");
    //     } else {
    //       return this.$Message.error(res.msg);
    //     }
    //   });
    // },
    async addOrEdit(type, row) {
      let data = null;
      let groupType = 2;
      if (type == "add") {
        this.$store.commit("g_setData", {
          drawType: "add",
          groupType,
          // 新增多人团和单人团数据初始化
          multiFormData: JSON.parse(JSON.stringify(multiFormData)),
          singleFormData: JSON.parse(JSON.stringify(singleFormData))
        });
      } else if (type == "edit") {
        const url = "/drawDaily/activity/selectById";
        let res = await postRequest(url, { id: row.id });
        if (res.code == 200) {
          data = res.data;
          data.defaultBannerList = [];
          data.defaultLogoList = [];
          data.defaultShowList = [];
          if (data.advertBannerImgUrl) {
            data.defaultBannerList = [{ imgUrl: data.advertBannerImgUrl }];
          }
          if (data.advertLogoImgUrl) {
            data.defaultLogoList = [{ imgUrl: data.advertLogoImgUrl }];
          }

          if (data.advertListUrl) {
            data.defaultShowList = [{ imgUrl: data.advertListUrl }];
          }

          groupType = data.groupType;
          this.$store.commit("g_setData", {
            drawType: "edit",
            groupType,
            // 修改将数据放入进去即可
            drawData: JSON.parse(JSON.stringify(data))
          });
        } else {
          return this.$Message.error(res.msg);
        }
      }
      this.action = {
        id: Math.random(),
        type,
        groupType,
        data
      };
    },
    // 查看详情
    checkDetailsFn(row) {
      this.$refs.modalDetail.show(row);
    },
    changeComp(compName) {
      this.$emit("changeComp", compName);
    },
    queryResult(row) {
      this.modalWinningList = Math.random();
      this.id = row.id;
    },
    showTotalPlayer(id) {
      this.modalTotalPlayer = true;
      this.id = id;
      this.queryTotalPlayerTableList();
    },
    queryTotalPlayerTableList() {
      queryTotalPlayerList({
        drawId: this.id
      }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.totalPlayerTableData = res.data;
        } else {
          this.$Message.error(res.code + " 数据加载失败!", 3);
        }
      });
    },
    showTotalTicket(id) {
      this.modalTotalTicket = true;
      this.id = id;
      this.queryTotalTicketTableList();
    },
    queryTotalTicketTableList() {
      queryTotalTicketList({
        drawId: this.id
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.totalTicketTableData = res.data;
        } else {
          this.$Message.error(res.code + " 数据加载失败!", 3);
        }
      });
    },
    cancelHandleReset(name) {
      this.undercarriage = false;
      this.$nextTick(() => {
        this.$refs[name].resetFields();
      });
    },
    putoff(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          putoff({ drawId: this.id, reason: this.formValidate.reason }).then(
            res => {
              if (res.code == 200) {
                this.msgOk("下架成功");
              } else {
                this.msgErr(res.msg);
              }
              this.cancelHandleReset(name);
            }
          );
          //   this.$Message.success("Success!");
        }
      });
    },
    updateBanner(row) {},
    // 上架
    updateOperationStatus(row) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确定要上架吗？</p>",
        onOk: () => {
          putup({ drawId: row.id }).then(res => {
            if (res.code == 200) {
              this.msgOk("上架成功");
            } else {
              this.msgErr(res.msg);
            }
          });
        },
        onCancel: () => {
          this.msgOk("上架已取消");
        }
      });
    },
    underUpdateOperationStatus(row) {
      this.undercarriage = true;
      this.id = row.id;
    },
    changeStartDate(arr) {
      // yyyy-MM-dd
      this.searchData.startTime = arr[0];
      this.searchData.endTime = arr[1];
    },
    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.queryTableList(pageNum);
    },
    // 查询
    queryTableList(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.loading = true;
      let status = this.searchData.status;
      if (status == "all") {
        status = "";
      }
      queryLuckDrawList({
        ...this.searchData,
        status,
        ...this.page
      }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.tableData = res.data.records;
          // this.banner_page_req.start = res.data.current; //分页查询起始记录
          this.page.pageNum = res.data.current; //分页查询起始记录
          this.page.total = res.data.total; //列表总数
          this.page.pageSize = res.data.size; //每页数据
          this.loading = false;
        } else {
          this.$Message.error(res.code + " 数据加载失败!", 3);
          this.loading = false;
        }
      });
    },
    add() {},
    reset() {
      this.daterange = [];
      // 重置查询参数
      this.searchData = {
        groupType: 0,
        name: "",
        status: "all",
        operationType: "",
        startTime: "",
        endTime: ""
      };

      this.page = {
        pageNum: 1, //页码
        pageSize: 10 //每页数量
      };

      //重新查询一遍
      this.queryTableList();
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