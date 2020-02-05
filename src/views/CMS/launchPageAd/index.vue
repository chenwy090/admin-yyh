<template>
  <div style="height: 100%">
    <Card style="height: 100%" v-if="!ShowViewDialogVisible&&!AddViewDialogVisible">
      <div>
        <Card :bordered="false" style="margin-bottom:2px">
          <Form
            ref="searchForm"
            label-position="right"
            :label-width="80"
            :model="searchForm"
            inline
          >
            <FormItem label="投放终端" span="24" style="width:23%">
              <Select v-model="searchForm.clientType" style="width:100%">
                <Option
                  v-for="(item,index) in clientTypeList"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="当前状态" span="24" style="width:23%">
              <Select v-model="searchForm.status" style="width:100%">
                <Option value>全部</Option>
                <Option
                  v-for="(item,index) in statusList"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="广告标题" span="24" style="width:25%">
              <Input v-model="searchForm.title" placeholder="活动名称" />
            </FormItem>
            <FormItem label="投放时间" span="35" style="width:50%">
              <DatePicker
                :value="searchForm.startTime"
                type="date"
                placeholder
                style="width: 40%"
                :options="options1"
                @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
              ></DatePicker>-
              <DatePicker
                :value="searchForm.endTime"
                type="date"
                placeholder
                style="width: 40%"
                :options="options2"
                @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
              ></DatePicker>
            </FormItem>
            <FormItem span="24" :label-width="1" style="width:23%">
              <Button
                type="primary"
                class="submit"
                icon="ios-search"
                @click="search()"
                style="margin-right: 5px"
              >搜索</Button>
              <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
              <Button icon="md-refresh" @click="reset">重置</Button>
            </FormItem>
          </Form>
        </Card>
        <Card>
          <Row class="operation">
            <Button type="primary" icon="md-add" @click="addStaff">新增广告</Button>
          </Row>
          <Row>
            <Table
              :loading="TableLoading"
              border
              :columns="tableColumns"
              :data="listData"
              sortable="custom"
              ref="table"
              @on-selection-change="handleSelect"
            >
              <template slot-scope="{ row }" slot="action">
                <!--<Button v-if="row.status==='0'"-->
                <!--type="success"-->
                <!--style="margin-right: 5px"-->
                <!--size="small"-->
                <!--@click="edit(row)"-->
                <!--&gt;编辑</Button>-->
                <Button
                  type="info"
                  style="margin-right: 5px"
                  size="small"
                  @click="showDetail(row)"
                >查看详情</Button>
                <Button
                  v-if="row.status=='0'||row.status=='2'"
                  type="error"
                  style="margin-right: 5px"
                  size="small"
                  @click="edit(row)"
                >编辑</Button>
                <Button
                  v-if="row.status=='0'||row.status=='2'"
                  type="error"
                  style="margin-right: 5px"
                  size="small"
                  @click="del(row)"
                >删除</Button>
                <Button
                  v-if="row.status=='0'||row.status=='2'"
                  type="error"
                  style="margin-right: 5px"
                  size="small"
                  @click="upper(row)"
                >上架</Button>
                <Button
                  v-if="row.status=='1'"
                  type="error"
                  style="margin-right: 5px"
                  size="small"
                  @click="stop(row)"
                >下架</Button>
              </template>
              <template slot-scope="{ row }" slot="status">
                <div>{{['待上架','已上架', '已下架'][row.status]}}</div>
              </template>
              <template slot-scope="{ row }" slot="time">
                <div>{{row.startTime}}-{{row.endTime}}</div>
              </template>
            </Table>
          </Row>
          <!-- 分页 -->
          <Row type="flex" justify="end" class="page">
            <Page
              :total="totalSize"
              show-total
              show-elevator
              @on-change="changeCurrent"
              style="float: right"
              :current.sync="current"
            ></Page>
          </Row>
        </Card>
      </div>
    </Card>
    <AddOrEdit
      ref="AddOrEdit"
      :viewDialogVisible="AddViewDialogVisible"
      @setViewDialogVisible="closeTab"
      @search="search"
    ></AddOrEdit>
    <showDetail
      ref="showDetail"
      :viewDialogVisible="ShowViewDialogVisible"
      @setViewDialogVisible="closeTab"
    ></showDetail>
  </div>
</template>

<script>
import { postRequest, getRequest, getSyncRequest } from "@/libs/axios";
import AddOrEdit from "./addOrEditModal";
import showDetail from "./showDetailModal";
export default {
  name: "launchPageAd",
  components: { AddOrEdit, showDetail },
  data() {
    return {
      clientTypeList: [
        { value: "", label: "全部" },
        { value: "1", label: "小程序" },
        { value: "2", label: "android" },
        { value: 3, label: "ios" },
      ],
      statusList: [
        { value: 0, label: "待上架" },
        { value: 1, label: "已上架" },
        { value: 2, label: "已下架" },
      ],
      TableLoading: false,
      auditing: 0,
      totalSize: 0,
      current: 1,
      listData: [],
      selectDataList: [],
      confirmValue: "",
      tableColumns: [
        {
          title: "操作",
          width: 250,
          align: "center",
          slot: "action",
          fixed: "left",
        },
        {
          title: "标题",
          width: 200,
          align: "center",
          key: "title",
          // render: (h, params) => {
          //     return h('div', [
          //         h('Tooltip', {
          //             props: { placement: 'top' }
          //         }, [
          //             h('span', {
          //                 style: {
          //                     display: 'inline-block',
          //                     width: params.column._width*0.85+'px',
          //                     overflow: 'hidden',
          //                     textOverflow: 'ellipsis',
          //                     whiteSpace: 'nowrap',
          //                 },
          //             }, params.row.title),
          //             h('span', {
          //                 slot: 'content',
          //                 style: { whiteSpace: 'normal', wordBreak: 'break-all' }
          //             },params.row.title)
          //         ])
          //     ])
          // }
        },
        {
          title: "ID",
          width: 150,
          align: "center",
          key: "id",
        },
        {
          title: "状态",
          width: 100,
          align: "center",
          slot: "status",
        },
        {
          title: "投放时间",
          width: 300,
          align: "center",
          slot: "time",
        },
        {
          title: "投放终端",
          minWidth: 150,
          align: "center",
          key: "clientStr",
        },
        {
          title: "跳转类型",
          minWidth: 200,
          align: "center",
          key: "contentTypeStr",
        },
        {
          title: "修改人",
          minWidth: 100,
          align: "center",
          key: "modifiedBy",
        },
        {
          title: "修改时间",
          minWidth: 200,
          align: "center",
          key: "gmtModified",
        },
      ],
      searchForm: {
        clientType: "",
        title: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
        status: null,
      },
      AddViewDialogVisible: false,
      ShowViewDialogVisible: false,
      options1: {},
      options2: {},
    };
  },
  created() {
    console.log(2);
    this.loadTableData();
  },
  activated() {
    console.log(1);
    this.loadTableData();
  },
  methods: {
    changeDateTime(datetime, index) {
      if (!datetime) {
        return;
      }
      switch (index) {
        case 1:
          this.searchForm.startTime = datetime ? datetime + " 00:00:00" : "";
          this.options2 = {
            disabledDate(date) {
              return date.valueOf() < new Date(datetime) - 1000 * 60 * 60 * 24;
            },
          };
          break;
        case 2:
          this.searchForm.endTime = datetime ? datetime + " 23:59:59" : "";
          this.options1 = {
            disabledDate(date) {
              return date.valueOf() < Date.now() - 1000 * 60 * 60 * 24 || date.valueOf() > new Date(datetime);
            },
          };
          break;
      }
    },
    search() {
      this.searchForm.pageNum = 1;
      this.current = 1;
      this.loadTableData();
    },
    reset() {
      this.searchForm.title = "";
      this.searchForm.startTime = "";
      this.searchForm.endTime = "";
      this.searchForm.status = "";
      this.searchForm.clientType = "";
      this.searchForm.pageNum = 1;
      this.current = 1;
      this.loadTableData();
    },
    loadTableData(page) {
      this.searchForm.pageNum = page || 1;
      this.totalSize = 0;
      this.listData = [];
      this.TableLoading = true;
      postRequest(`/page/ad/list?pageNum=${this.searchForm.pageNum}&pageSize=10`, this.searchForm).then(res => {
        this.TableLoading = false;
        if (res.code === "200") {
          this.totalSize = res.data.total;
          this.listData = res.data.records;
        } else {
          this.$Message.error("获取数据失败");
        }
      });
    },
    addStaff() {
      this.AddViewDialogVisible = true;
      this.$emit("closeTab", true);
      this.$nextTick(() => {
        this.$refs["AddOrEdit"].resetRow(null, "add");
      });
    },
    edit(row) {
      this.AddViewDialogVisible = true;
      this.$emit("closeTab", true);
      this.$nextTick(() => {
        this.$refs["AddOrEdit"].resetRow(row, "edit");
      });
    },
    showDetail(row) {
      this.ShowViewDialogVisible = true;

      this.$nextTick(() => {
        this.$refs["showDetail"].resetRow(row);
      });
    },
    del(row) {
      this.$Modal.confirm({
        title: "确认删除",
        onOk: () => {
          postRequest(`/page/ad/del`, { id: row.id }).then(res => {
            this.TableLoading = false;
            if (res.code === "200") {
              this.search();
            } else {
              this.$Message.error(res.msg);
            }
          });
        },
        onCancel: () => {},
      });
    },
    upper(row) {
      this.$Modal.confirm({
        title: "确认上架",
        onOk: () => {
          postRequest(`/page/ad/obtained`, { id: row.id }).then(res => {
            this.TableLoading = false;
            if (res.code === "200") {
              this.search();
            } else {
              this.$Message.error(res.msg);
            }
          });
        },
        onCancel: () => {},
      });
    },
    stop(row) {
      this.$Modal.confirm({
        title: "确认下架",
        onOk: () => {
          postRequest(`/page/ad/shelf`, { id: row.id }).then(res => {
            this.TableLoading = false;
            if (res.code === "200") {
              this.search();
            } else {
              this.$Message.error(res.msg);
            }
          });
        },
        onCancel: () => {},
      });
    },
    handleSelect(selection, index) {
      this.selectDataList = selection;
    },
    batchAudit() {},
    changeCurrent(current) {
      if (this.searchForm.pageNum != current) {
        this.searchForm.pageNum = current;
        this.loadTableData(current);
      }
    },
    closeTab(e) {
      this.AddViewDialogVisible = false;
      this.ShowViewDialogVisible = false;
    },
    close() {
      this.$emit("close", false);
      this.linkTo("cms");
    },
  },
};
</script>

<style scoped>
.operation {
  margin-bottom: 2vh;
}
.confirm-textarea {
  width: 100%;
  height: 100px;
  padding: 5px;
  outline: none;
}
</style>
