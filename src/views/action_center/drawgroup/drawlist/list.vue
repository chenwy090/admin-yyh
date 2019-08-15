<template>
  <div class="xxx">
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="团类型" :label-width="60">
            <Select v-model="searchData.groupType" style="width:100px">
              <Option
                v-for="item in groupTypeList"
                :value="item.value"
                :key="item.value"
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
          <FormItem label="抽奖开始时间：" :label-width="100">
            <DatePicker
              type="datetime"
              placeholder="请选择抽奖日期"
              format="yyyy-MM-dd HH:mm"
              style="display:inline-block;width: 200px"
              :value="searchData.startTime"
              @on-change="changeStartDate"
            ></DatePicker>
          </FormItem>
          <FormItem style="margin-left:35px;" class="br">
            <Button type="primary" icon="ios-search" @click="queryTableList()">搜索</Button>
            <Button icon="md-refresh" @click="reset">重置</Button>
          </FormItem>
        </Form>
        <Row type="flex" justify="start">
          <Col>
            <Button type="primary" icon="md-add" @click="add">新增</Button>
          </Col>
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
              @click="updateBanner(row)"
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
  </div>
</template>
<script>
import { queryLuckDrawList } from "@/api/sys";

export default {
  name: "",
  data() {
    return {
      groupTypeList: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "单人团"
        },
        {
          value: "2",
          label: "多人团"
        }
      ],
      statusList: [
        {
          value: "",
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
      searchData: {
        // 查询参数
        groupType: "0",
        name: "",
        status: "",
        operationType: "",
        startTime: ""
        //分页参数
      },
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      columns: [
        {
          title: "操作",
          align: "center",
          width: 240,
          fixed: "left",
          slot: "action"
        },
        {
          key: "id",
          title: "ID",
          align: "center",
          width: 120
        },

        {
          title: "状态",
          key: "statusName",
          align: "center",
          width: 120
        },
        {
          title: "团类型",
          key: "groupType",
          align: "center",
          minWidth: 100
        },
        {
          key: "name",
          title: "抽奖名称",
          align: "center",
          minWidth: 140
        },
        {
          title: "大奖",
          key: "bigPrizeName",
          align: "center",
          minWidth: 140
        },
        {
          title: "阳光普照奖",
          key: "normalPrizeName",
          align: "center",
          minWidth: 140
        },
        {
          title: "抽奖开始时间",
          key: "startTime",
          align: "center",
          width: 170
        },
        {
          title: "抽奖开奖时间",
          key: "openDrawTime",
          align: "center",
          width: 170
        },
        {
          title: "广告主",
          key: "advertName",
          align: "center",
          minWidth: 80
        },
        {
          title: "最近修改人",
          key: "address",
          align: "center",
          minWidth: 105
        },
        {
          title: "最近修改时间",
          key: "address",
          align: "center",
          width: 170
        },
        {
          title: "报名成功用户",
          key: "totalPlayer",
          align: "center",
          minWidth: 100
        },
        {
          title: "排列五数字",
          key: "address",
          align: "center",
          minWidth: 140
        },
        {
          title: "抽奖券",
          key: "totalTicket",
          align: "center",
          minWidth: 140
        },
        {
          title: "开奖结果",
          key: "winningRefValue",
          align: "center",
          minWidth: 140
        }
      ],
      tableData: []
    };
  },
  methods: {
    updateBanner(row) {},
    updateOperationStatus(row) {},
    underUpdateOperationStatus(row) {},
    changeStartDate(time) {
      this.searchData.startTime = time;
    },
    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.queryTableList(pageNum);
    },
    // 查询
    queryTableList(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.loading = true;
      queryLuckDrawList({
        ...this.searchData,
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
      // 重置查询参数
      this.searchData = {
        groupType: "0",
        name: "",
        status: "",
        operationType: "",
        startTime: ""
      };

      this.page = {
        pageNum: 1, //页码
        pageSize: 10 //每页数量
      };
    }
  }
};
</script>
<style scoped>
</style>