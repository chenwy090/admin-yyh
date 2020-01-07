<template>
  <!--  新建/编辑 模块 -->
  <div class="edit">
    <Card :bordered="false" style="margin-bottom:2px">
      <Row type="flex" justify="start">
        <Button type="primary" icon="md-add" class="marginLeft20" @click="addOrEdit('add')" v-if="action.type != 'query'">新增模块</Button>
        <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
      </Row>
    </Card>
    <Card :bordered="false">
      <Table
        border
        size="small"
        :show-index="true"
        :loading="loading"
        :columns="columns"
        :data="tableData"
      >
        <template slot-scope="{ row }" slot="action">
          <template v-if="action.type == 'query'">
            <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px" @click="addOrEditContent('query',row)">
                查看模块内容   
            </Button>
            <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px" @click="addOrEdit('query',row)">
                查看模块   
            </Button>
          </template>
          <template v-else>
            <template v-if="row.timeStatus == 1">
              <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px" @click="addOrEdit('edit',row)">
                编辑模块   
              </Button>
              <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px" @click="addOrEditContent('add',row)">
                编辑模块内容   
              </Button>
              <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px" @click="delItem(row)">
                删除   
              </Button>
            </template>
            <template v-else-if="row.timeStatus == 2">
              <!-- <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px"  @click="addOrEdit('query',row)">
                查看模块   
              </Button> -->
              <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px" @click="addOrEdit('edit',row)">
                编辑模块   
              </Button>
              <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px" @click="addOrEditContent('query',row)">
                查看模块内容   
              </Button>
              <Button  type="text" size="small" style="color:red;margin-right: 5px" @click="stopModule(row.id)">
                结束模块   
              </Button>
            </template>
            <template v-else>
              <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px" @click="addOrEdit('query',row)">
                查看模块   
              </Button>
              <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px" @click="addOrEditContent('query',row)">
                查看模块内容   
              </Button>
            </template>
          </template>
         


        </template>
      </Table>
      <!-- 分页器 -->
      <Row type="flex" justify="end" class="page">
        <!-- show-total 显示总数 共{{ total }}条 -->
        <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
        <Page
          size="small"
          show-total
          show-elevator
          :current="page.pageNum"
          :page-size="page.pageSize"
          :total="page.total"
          @on-change="changeCurrent"
        ></Page>
      </Row>
    </Card>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="closeDialog">关闭</Button>
    </div>
    <Edit :action="jackpotAction" @refresh="queryTableData"></Edit>
    <!--新增模块内容-->
    <EditTemplate :action="templateAction" @refresh="queryTableData"></EditTemplate>


  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapGetters } = createNamespacedHelpers("template");
import { postRequest } from "@/libs/axios";
import columns from "./columns";
import Edit from "./Edit";

import EditTemplate from "../template";

export default {
  name: "edit",
  components: { Edit ,EditTemplate},
  props: {
    showEditJackpot: {
      type: Boolean,
      default: false
    },
    action: {
      type: Object,
      default: () => ({
        _id: Math.random(),
        title: "编辑活动模板",
        type: "edit", //add/edit/detail/audit
        data: {}
      })
    }
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;

        data = JSON.parse(JSON.stringify(data));
        this.activityId = data.id;
        this.setActivityId(data.id);   
        this.queryTableData();
        console.log("watch jackpotAction data3333:", data);

        if (type == "add") {
        } else if (type == "edit") {

        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      activityId: "",
      jackpotAction: {
        _id: Math.random(),
        title: "编辑活动模板",
        type: "add", //query/add/edit
        data: null
      },
      isShow: false,
      jackpotName: "",
      actionType: "query", //query/edit
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      loading: false,
      columns,
      //0已结束1未开始2进行中
      tableData: [],
      templateAction:{
        _id: Math.random(),
        title:'编辑模块',
        type:'add',
        data:null
      }
    };
  },
  mounted() {
    console.log("showEditJackpot mounted");
  },
  methods: {
    ...mapMutations(["setActivityId"]),
    selectedTrCallBack() {
      console.log("selectedTrCallBack");
      // this.$emit("seclectedTr-event", choice);
    },
    
    async delItem(row) {
      const url = "/browsing/templateModule/delete";
      const { code, msg } = await postRequest(url, { id: row.id });
      if (code == 200) {
        this.msgOk("删除成功");
        //查询table
        this.queryTableData();
      } else {
        this.msgErr(msg);
      }
    },
    delCancel() {
      this.msgOk("已取消删除");
    },
    addOrEdit(type, data) {
      console.log("addOrEdit1 jackpotAction", type, data);
      this.jackpotAction = {
        id: Math.random(),
        type,
        data
      };
      console.log("addOrEdit2 jackpotAction", { ...this.jackpotAction });
    },
    //结束模块
    async stopModule(id){
      const url = "/browsing/templateModule/stop";
      const { code, msg } = await postRequest(url, { id: id });
      if (code == 200) {
        this.msgOk("操作成功");
        //查询table
        this.queryTableData();
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

      const url = "/browsing/templateModule/list";
      try {
        let {
          code,
          data: { records, current, total, size }
        } = await postRequest(url, {
          browsingId: this.activityId,
          ...this.page
        });

        if (code == 200) {
          this.tableData = records.map(item => {
            let {startTime, endTime } = item; 
            item.time = `${startTime}-${endTime}`;
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
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.$emit("update:showEditJackpot", false);
    },
    addOrEditContent(type,data){
      console.log("addOrEdit1 templateAction", type, data);
      this.templateAction = {
        id: Math.random(),
        type,
        data
      };
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
<style scoped lang="less">
.edit {
  padding-bottom: 50px;
}
.demo-drawer-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.template-list{
  display: flex;
  align-items:center;
  .template-item{
    width: 100px; 
    text-align:center;
    margin-right:50px;
  }
  .img-wrap{
    height: 100px;
    border:1px #ddd solid; 
    img{
      max-width:100%;
      max-height:100%;
    }
  }
}
</style>