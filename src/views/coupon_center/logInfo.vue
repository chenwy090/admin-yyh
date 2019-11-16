<template>
  <Modal
    width="800"
    v-model="viewDialogVisible"
    title="操作日志"
    :closable="false"
    :mask-closable="false"
  >
    <div class="loginfovue">
      <div>
        <Row>
          <RadioGroup v-model="selectIndex" @on-change="selectBusiness()" style="width: 100%;">
            <Table
              ref="table"
              border
              sortable="custom"
              :loading="TableLoading"
              :columns="tableColumns"
              :data="listData"
            ></Table>
          </RadioGroup>
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
      </div>
    </div>
    <div slot="footer" style="text-align: center;">
      <Button type="primary" @click="contentClose">关闭</Button>
    </div>
  </Modal>
</template>

<script>
import { postRequest, getRequest, getSyncRequest } from "@/libs/axios";
export default {
  name: "logModal",
  props: {
    viewDialogVisible: { type: Boolean, default: false }
  },
  data() {
    return {
      listData: [],
      selectIndex: "",
      TableLoading: "",
      modalForm: {
        name: "",
        current: 1,
        provinceId: "",
        cityId: "",
        areaId: ""
      },
      totalSize: 0,
      current: 1,
      selectIndex: "",
      provincelist: [],
      citylist: [],
      arealist: [],

      tableColumns: [
        {
          title: "操作前",
          key: "beforeOperation",
          minWidth: 140
        },
        {
          title: "操作后",
          key: "afterOperation",
          minWidth: 140
        },
        {
          title: "操作类型",
          key: "operationType",
          minWidth: 140,
          align: "center",
          render: (h, params) => {
            let { operationType, tag } = params.row;

            if (tag === null) {
              tag = 0;
            }
            //  1 新增 2 编辑 3 下架 4 上架 5 追加库存
            let arr = ["", "新增", "编辑", "下架", "上架", "追加库存"];
            let name = arr[operationType];
            return <Tag color={tag == 1 ? "error" : "blue"}>{name}</Tag>;
          }
        },
        {
          title: "操作人",
          key: "name",
          align: "center",
          minWidth: 120,
          key: "operator" //新店
        },
        {
          title: "操作时间",
          key: "gmtCreate",
          align: "center",
          minWidth: 220
        }
      ]
    };
  },
  methods: {
    resetRow(id) {
      this.id = id;
      this.modalForm.current = 1;
      this.current = 1;
      this.loadTableData();
    },
    loadTableData(page) {
      this.modalForm.current = page || 1;
      var that = this;
      // this.selectDataList = [];
      this.totalSize = 0;
      this.TableLoading = true;
      let params = {
        pageNum: this.modalForm.current,
        pageSize: 10,
        templateId: this.id
      };
      postRequest(
        "/merchantCouponTemplate/merchantCouponOperationLogPage?pageNum=" +
          this.modalForm.current +
          "&pageSize=" +
          10,
        params
      ).then(res => {
        this.TableLoading = false;
        if (res.code === "200") {
          this.totalSize = res.data.total;
          this.listData = res.data.records || [];
        } else {
          this.$Message.error("获取数据失败");
        }
      });
    },
    changeCurrent(current) {
      if (this.modalForm.current != current) {
        this.modalForm.current = current;
        this.loadTableData(current);
      }
    },
    contentClose() {
      this.$emit("setViewDialogVisible", false);
    }
  },
  created() {}
};
</script>

<style scoped>
.ivu-table-wrapper {
  overflow: visible;
}
</style>

<style lang="less">
.loginfovue {
  .ivu-tag {
    cursor: default;
  }
}
</style> >

