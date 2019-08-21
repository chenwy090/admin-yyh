<template>
  <div class="bannerway">
    <Card class="add-bannerway-row" :bordered="false" style="margin-bottom:2px">
      <Button type="primary" icon="md-add" @click="addOrEdit('add')">新增</Button>&nbsp;&nbsp;
      <Button type="dashed" icon="md-arrow-round-back" @click="goback">返回列表</Button>
    </Card>
    <Card :bordered="false">
      <Table border :loading="loading" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <!-- 1: 已上架、2：已下架 -->
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="addOrEdit('edit',row)"
          >编辑</Button>
          <Button
            type="success"
            size="small"
            v-if="row.status == 2"
            @click="updateOperationStatus(row)"
          >上架</Button>
          <Button
            type="warning"
            size="small"
            v-if="row.status == 1"
            @click="underUpdateOperationStatus(row)"
          >下架</Button>
        </template>

        <template slot-scope="{ row }" slot="createAndModifiedBy">
          <span>{{ row.modifiedBy || row.createBy }}</span>
        </template>
        <template slot-scope="{ row }" slot="gmtModifiedAndCreate">
          <span>{{ row.gmtModified || row.gmtCreate }}</span>
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
        <template slot-scope="{ row }" slot="idLinkUrl">
          <span>{{ row.id || row.linkUrl }}</span>
        </template>
        <template slot-scope="{ row }" slot="img">
          <!-- <img :src="row.imgUrl" style="width:74px;height:43px;" @click="showBigImg(row)" /> -->
          <Button type="success" size="small" @click="showBigImg(row)">查看</Button>
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

    <Modal v-model="bigImgDialog" width="600" @on-cancel="bigImgCancel" :footer-hide="true">
      <img style="width: 100%" :src="bigImageUrl" />
    </Modal>

    <bannerway-edit :action="action" @refresh="queryTableList"></bannerway-edit>

    <Modal v-model="undercarriage" :closable="true" :mask-closable="false" width="400">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>下架</span>
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
  </div>
</template>
<script>
import { updateBannerWayStatus, queryBannerWayList } from "@/api/sys";
import { bannerWayColumns } from "./columns";
import BannerwayEdit from "./BannerwayEdit";

export default {
  name: "bannerway",
  components: {
    [BannerwayEdit.name]: BannerwayEdit
  },
  data() {
    const validateReason = (rule, value, callback) => {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("下架原因不能为空"));
      } else if (value.length < 10) {
        callback(new Error("下架原因不得少于10个字"));
      } else {
        callback();
      }
    };
    return {
      // 新增、修改 任务抽奖banner
      modalAddModify: false,
      //新增 add、修改 edit
      action: {
        id: Math.random(),
        type: "add"
      },

      // 查看大图
      bigImgDialog: false,
      bigImageUrl: "",
      // ------------------下架
      id: "",
      undercarriage: false,
      formValidate: {
        reason: ""
      },
      ruleValidate: {
        reason: [
          {
            required: true,
            validator: validateReason,
            trigger: "blur"
          }
        ]
      },
      // ------------------表格数据
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      // columns,
      columns: bannerWayColumns,
      tableData: []
    };
  },
  created() {
    this.queryTableList();
  },
  methods: {
    goback() {
      this.$emit("changeComp", "draw-config");
    },
    // 显示大图
    showBigImg: function(row) {
      this.bigImgDialog = true;
      this.bigImageUrl = row.imgUrl;
    },
    bigImgCancel: function() {
      this.bigImgDialog = false;
    },
    cancelHandleReset(name) {
      this.undercarriage = false;
      this.$nextTick(() => {
        this.$refs[name].resetFields();
      });
    },
    // 下架
    putoff(name) {
      // 1: 已上架、2：已下架
      this.$refs[name].validate(valid => {
        if (valid) {
          updateBannerWayStatus({
            id: this.id,
            nextStatus: 2,
            reason: this.formValidate.reason
          }).then(res => {
            if (res.code == 200) {
              this.msgOk("下架成功");
              this.queryTableList();
            } else {
              this.msgErr(res.msg);
            }
            this.cancelHandleReset(name);
          });
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
          updateBannerWayStatus({ id: row.id, nextStatus: 1 }).then(res => {
            if (res.code == 200) {
              this.msgOk("上架成功");
              this.queryTableList();
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

    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.queryTableList(pageNum);
    },
    // 查询
    queryTableList(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.loading = true;
      queryBannerWayList({
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
    addOrEdit(type, data) {
      this.action = {
        id: Math.random(),
        type,
        data
      };
    },
    reset() {
      this.page = {
        pageNum: 1, //页码
        pageSize: 10 //每页数量
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
<style scoped>
</style>