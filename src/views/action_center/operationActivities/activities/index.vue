<template>
  <!-- 活动创建 -->
  <div class="xxx">
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <!-- 商户/品牌名称 -->
          <FormItem label="活动名称：" :label-width="80">
            <Input
              style="width:200px"
              type="text"
              v-model="searchData.name"
              placeholder="请输入活动名称关键字"
              clearable
            ></Input>
          </FormItem>

          <FormItem label="活动时间：" :label-width="80">
            <DatePicker
              type="daterange"
              placeholder="请选择日期"
              style="display:inline-block;width: 200px"
              :value="daterange"
              @on-change="changeStartDate"
            ></DatePicker>
          </FormItem>

          <FormItem label="活动状态：" :label-width="80">
            <Select v-model="searchData.status" style="width:100px" clearable>
              <Option v-for="(v,k) in statusOption" :value="k" :key="v">{{ v }}</Option>
            </Select>
          </FormItem>

          <FormItem :label-width="0">
            <Button type="primary" icon="ios-search" @click="queryTableData()">搜索</Button>
            <Button icon="md-refresh" class="marginLeft20" @click="reset">重置</Button>
          </FormItem>
        </Form>
        <Row type="flex" justify="start">
          <Button type="primary" icon="md-add" class="marginLeft20" @click="addOrEdit('add')">新增活动</Button>
          <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <!-- 1: 已上架、2：已下架 -->
      <!-- <template slot-scope="{ row }" slot="action">
      -->
      <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <!-- <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="query('edit',row)"
          >查看活动</Button>-->
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="addOrEdit('edit',row)"
          >编辑活动</Button>

          <Button
            type="warning"
            size="small"
            style="margin-right: 5px"
            @click="queryOrEditContent('query',row)"
          >查询内容</Button>
          <Button
            type="warning"
            size="small"
            style="margin-right: 5px"
            @click="queryOrEditContent('edit',row)"
          >编辑内容</Button>

          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="addOrEditJackpot('edit',row)"
          >编辑奖池</Button>
          <!-- v-if="row.status == 2" -->
          <Button
            type="success"
            size="small"
            style="margin-right: 5px"
            @click="updateStatus(row,2)"
          >上架</Button>
          <Button
            type="warning"
            size="small"
            style="margin-right: 5px"
            @click="updateStatus(row,3)"
          >下架</Button>
          <Button
            type="warning"
            size="small"
            style="margin-right: 5px"
            @click="queryOrEditWinnerNum('query',row)"
          >查询次数</Button>
          <Button
            type="warning"
            size="small"
            style="margin-right: 5px"
            @click="queryOrEditWinnerNum('edit',row)"
          >编辑次数</Button>
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

    <Edit :action="action" @refresh="queryTableData"></Edit>

    <!-- 活动内容 -->
    <ActivityContent
      v-if="showEditConent"
      :showEditConent.sync="showEditConent"
      :action="contentAction"
    ></ActivityContent>

    <!-- 奖池 -->
    <Drawer
      v-model="showEditJackpot"
      :closable="true"
      :mask-closable="false"
      width="900"
      :styles="styles"
    >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{jackpotAction.title}}</span>
      </p>
      <Jackpot
        v-if="showEditJackpot"
        :showEditJackpot.sync="showEditJackpot"
        :action="jackpotAction"
        @refresh="queryTableData"
      ></Jackpot>
    </Drawer>

    <ModalWinnerNum :action="winnerNumAction"></ModalWinnerNum>

    <!-- <exchange v-if="showExchange" :showExchange.sync="showExchange" @refresh="queryTableData"></exchange>
    <consume v-if="showConsume" :showConsume.sync="showConsume" @refresh="queryTableData"></consume>-->
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapGetters } = createNamespacedHelpers("egg");
import { getRequest, postRequest } from "@/libs/axios";
import { queryUbayMList } from "@/api/sys";
import columns from "./columns";

import Edit from "./Edit";

// 内容
import createContentFormData from "../content/createFormData";
import ActivityContent from "../content";

// 奖池
import Jackpot from "../jackpot";
// 编辑/查看 次数
import ModalWinnerNum from "./ModalWinnerNum";

export default {
  name: "ubay-management",
  components: {
    Edit,
    ActivityContent,
    Jackpot,
    ModalWinnerNum
  },
  watch: {},
  data() {
    return {
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      showEditConent: false, //内容
      showEditJackpot: false, //奖池
      //新增 add、修改 edit
      action: {
        id: Math.random(),
        type: "add",
        data: null
      },
      contentAction: {
        _id: Math.random(),
        title: "编辑内容",
        type: "edit", //query/edit
        data: null
      },
      jackpotAction: {
        _id: Math.random(),
        title: "编辑奖池",
        type: "edit", //query/edit
        data: null
      },
      //编辑/查看 次数
      winnerNumAction: {
        _id: Math.random(),
        type: "query", //query/edit
        data: null
      },
      showExchange: false,
      showConsume: false,
      // status 活动状态, 1-待上架 2-已上架 3已下架
      statusOption: {
        "1": "待上架",
        "2": "已上架",
        "3": "已下架"
      },
      activityTypeOption: [
        // {
        //   id: 0,
        //   name: "扭蛋机抽奖"
        // }
      ],
      daterange: [],
      // 查询参数
      searchData: {
        activityType: "",
        name: "", //活动名称
        status: "", //状态
        beginTime: "", //开始时间
        endTime: "" //结束时间
      },
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      columns,
      tableData: []
    };
  },
  async created() {
    await this.queryActivityTypeList();
    this.queryTableData();
  },
  methods: {
    ...mapMutations(["setActivityId", "setActivityTypeOption"]),

    addOrEdit(type, data) {
      if (type == "edit") {
        this.setActivityId(data.id); //设置活动id
      }

      console.log("addOrEdit1", type, data);
      this.action = {
        id: Math.random(),
        type,
        data
      };
      console.log("addOrEdit2", { ...this.action });
    },
    addOrEditJackpot(type, data) {
      this.setActivityId(data.activityId); //设置活动id
      console.log("addOrEditJackpot", type, data);
      this.showEditJackpot = true;
      let title = "";
      if (type == "query") {
        title = "查看奖池";
      } else if (type == "edit") {
        title = "编辑奖池";
      }
      this.jackpotAction = {
        _id: Math.random(),
        title,
        type,
        data
      };
      console.log("addOrEditJackpot", { ...this.jackpotAction });
    },

    async queryOrEditContent(type, row) {
      this.showEditConent = true;
      this.setActivityId(row.activityId); //设置活动id
      let data = await this.queryContent(row);
      if (type !== "query") {
        type == data._type;
      }
      this.contentAction = {
        _id: Math.random(),
        type,
        data
      };
    },
    async queryOrEditWinnerNum(type, row) {
      this.setActivityId(row.activityId); //设置活动id
      let data = await this.selectWinner(row);
      this.winnerNumAction = {
        _id: Math.random(),
        type,
        data
      };
    },
    changeStartDate(arr) {
      // yyyy-MM-dd HH:mm:ss
      console.log(arr);
      let [beginTime, endTime] = arr;
      if (beginTime) {
        beginTime += ` 00:00:00`;
        endTime += ` 23:59:59`;
      }
      console.log(beginTime, endTime);
      this.searchData.beginTime = beginTime;
      this.searchData.endTime = endTime;
    },

    // 活动上下架
    async updateStatus(row, status) {
      // 点上架传2 下架传3
      // 活动类型列表
      const url = "/activityInfo/updateStatus";
      // status 活动状态, 1-待上架 2-已上架 3已下架
      let { id } = row;
      // if (status == 1) {
      //   status = 2;
      // } else if (status == 2) {
      //   status = 3;
      // } else if (status == 3) {
      //   status = 2;
      // }
      let { code, data } = await postRequest(url, { id, status });

      if (code == 200) {
        this.queryTableData(this.page.pageNum);
      } else {
        this.msgErr(code + " 数据加载失败!");
      }
    },
    // 查看活动的图片文案
    async queryContent({ activityId }) {
      // 活动类型列表
      const url = "/activityPic/text/selectByActivityId";

      let { code, data } = await getRequest(url, { activityId });

      let formData = createContentFormData();
      let _type = ""; //add/edit

      if (code == 200) {
        if (data.length == 0) {
          data = formData;
          data._type = "add";
          data.activityId = activityId;
        } else {
          data.sort((obj1, obj2) => {
            return obj1.type - obj2.type;
          });
          let { activityPicTextList: arr } = formData;
          let activityPicTextList = data.map(item => {
            let { type, picUrl } = item;
            let _item = arr.find(obj => obj.type == type);

            item = { ..._item, ...item };

            let defaultPicUrlList = [];
            if (picUrl) {
              defaultPicUrlList = [{ imgUrl: picUrl }];
            }
            item.defaultPicUrlList = defaultPicUrlList;

            return item;
          });
          data = { _type: "edit", activityId, activityPicTextList };
        }
        return data;
      } else {
        this.msgErr(code + " 数据加载失败!");
        return { activityId: "", activityPicTextList: [] };
      }
    },
    // 查询次数
    async selectWinner({ id }) {
      // 活动类型列表
      const url = "/activityInfo/selectWinner";
      // status id活动状态, 1-待上架 2-已上架 3已下架

      let { code, data } = await getRequest(url, { id });

      if (code == 200) {
        // 实际中奖次数 realWinnerNum: 0  显示中奖次数 viewWinnerNum: 0
        data.id = id;
        data.oldViewWinnerNum = data.viewWinnerNum;
        return data;
      } else {
        this.msgErr(code + " 数据加载失败!");
        return { id };
      }
    },
    async queryActivityTypeList() {
      // 活动类型列表
      const url = "/activityInfo/selectActivityTypeList";
      let { code, data } = await getRequest(url);

      if (code == 200) {
        let _data = JSON.parse(JSON.stringify(data[0]));
        _data.id = Math.random();
        _data.name = _data.name + Math.random();
        data.push(_data);
        this.activityTypeOption = data;
        this.setActivityTypeOption({ activityTypeOption: data });
      } else {
        this.msgErr(code + " 数据加载失败!");
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

      const url = "/activityInfo/list";

      try {
        let {
          code,
          data: { records, current, total, size }
        } = await postRequest(url, {
          ...this.searchData,
          ...this.page
        });

        if (code == 200) {
          this.tableData = records.map(item => {
            let { activityType, status, beginTime, endTime } = item;
            item.statusName = this.statusOption[status];

            console.log("statusName:", status, item.statusName);

            let activityTypeName = "";
            this.activityTypeOption.some(item => {
              let r = item.id == activityType;
              if (r) {
                activityTypeName = item.name;
              }
              return r;
            });

            item.activityTypeName = activityTypeName;
            item.time = `${beginTime}-${endTime}`;
            // console.log(JSON.stringify(this.activityTypeOption));
            // console.log({ ...item });

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
    reset() {
      this.daterange = [];
      // 重置查询参数
      this.searchData = {
        activityType: "",
        name: "", //活动名称
        status: "", //状态
        beginTime: "", //开始时间
        endTime: "" //结束时间
      };
      this.page = {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
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