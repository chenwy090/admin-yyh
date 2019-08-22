<template>
  <div>
    <Alert type="warning">请点击选择优惠券类型，按搜索，选择需要的优惠券</Alert>
    <Form ref="searchForm" :model="searchForm" :label-width="100">
      <FormItem label="优惠券类型：" style="display:inline-block">
        <!-- <Input style="width:200px" v-model="couponSearchData.couponType" placeholder="请输入" clearable /> -->
        <!-- 优惠券类型1：周边券、2：商超券 -->
        <Select v-model="searchForm.couponType" style="width:200px" @on-change="optionChange">
          <!-- <Option value="2">超市券</Option>
          <Option value="1">周边券</Option>-->

          <Option
            v-for="item in couponTypeList"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="优惠券名称：" style="display:inline-block">
        <Input style="width:200px" v-model="searchForm.name" placeholder="请输入" clearable />
      </FormItem>
      <FormItem class="br" :label-width="10">
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
        <!-- <Button icon="md-refresh" @click="reset1">重置</Button> -->
      </FormItem>
    </Form>

    <Table
      border
      ref="selection"
      :columns="tableColumns"
      :data="tableData"
      :highlight-row="true"
      :loading="loading"
    ></Table>
    <!-- @on-current-change="selectedTr" -->
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <Page
        show-total
        show-elevator
        :total="page.total"
        :current="page.pageNum"
        :page-size="page.pageSize"
        @on-change="changeCurrent"
      ></Page>
    </Row>

    <Row style="margin-left:350px; margin-top: 30px">
      <Button style="margin-right: 20px" @click="cancel">取消</Button>
      <Button type="primary" @click="selectMerchant">确定</Button>
    </Row>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/libs/axios";
import { getCampaginListData } from "@/api/sys";
export default {
  props: {
    prizeType: {
      type: String,
      default: ""
    },
    couponType: {
      type: [String, Number],
      default: 2
    }
  },
  computed: {
    tableColumns() {
      return this.searchForm.couponType == 1 ? this.columns1 : this.columns2;
    }
  },
  watch:{
    prizeType(){
      // console.log("prizeTypeprizeType",this.prizeType);
    }
  },
  data() {
    return {
      // 优惠券搜索
      searchForm: {
        couponType: 2, //优惠券类型1：周边券、2：商超券
        name: ""
      },
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      tableData: [],
      choice: {
        id: "",
        name: ""
      },
      //优惠券类型1：周边券、2：商超券/ 超市券 //优惠券类型 1：超市券 2：周边券
      // couponType
      couponTypeList: [
        {
          value: 2,
          label: "超市券"
        },
        {
          value: 1,
          label: "周边券"
        }
      ],
      // 优惠券类型1：周边券、2：商超券  超市券
      columns1: [
        {
          title: "选择",
          key: "chooseTemplateId",
          width: 70,
          align: "center",
          render: (h, params) => {
            let id = params.row.templateId;
            let name = params.row.title;
            let flag = false;
            if (this.choice.id == id) {
              flag = true;
            } else {
              flag = false;
            }
            let self = this;
            return h("div", [
              h("Radio", {
                props: {
                  value: flag
                },
                on: {
                  "on-change": () => {
                    self.choice.id = id;
                    self.choice.name = name;
                  }
                }
              })
            ]);
          }
        },
        {
          title: "优惠券ID",
          align: "center",
          minWidth: 140,
          key: "templateId"
        },
        {
          title: "优惠券名称",
          align: "center",
          minWidth: 140,
          key: "title"
        },
        {
          title: "所属商户",
          align: "center",
          minWidth: 140,
          key: "merchantName"
        }
      ],
      // 超市券2
      columns2: [
        {
          title: "选择",
          key: "chooseCampId",
          width: 70,
          align: "center",
          render: (h, params) => {
            let id = params.row.campId;
            let name = params.row.name;
            let flag = false;
            if (this.choice.id == id) {
              flag = true;
            } else {
              flag = false;
            }
            let self = this;
            return h("div", [
              h("Radio", {
                props: {
                  value: flag
                },
                on: {
                  "on-change": () => {
                    self.choice.id = id;
                    self.choice.name = name;
                  }
                }
              })
            ]);
          }
        },
        {
          title: "优惠券ID",
          align: "center",
          minWidth: 140,
          key: "campId"
        },
        {
          title: "优惠券名称",
          align: "center",
          minWidth: 140,
          key: "name"
        }
      ]
    };
  },
  methods: {
    // 分页（点击第几页）
    changeCurrent(current) {
      // var self = this;
      // self.banner_page_req.start = current * self.banner_page_req.limit - self.banner_page_req.limit;
      this.page.pageNum = current;
      this.search();
    },
    optionChange() {
      this.tableData = [];
      this.searchForm.name = "";
      this.page.pageNum = 1;
      this.choice.couponType = this.searchForm.couponType;
      this.search();
    },
    search() {
      if (!this.searchForm.couponType) {
        return this.msgErr("请选择优惠券类型");
      }

      let url = "";
      let data = {};

      // 优惠券类型1：周边券、2：商超券
      if (this.searchForm.couponType == 2) {
        url = "/campagin/list";
        data = {
          isEffective: 1,
          campType: 57,
          status: 1,
          sendChannel: 1,
          name: this.searchForm.name
        };
      } else {
        url = "/merchantCouponTemplate/backList";
        data = {
          isActivityCoupon:1,
          templateStatus: "进行中",
          title: this.searchForm.name
        };
      }
      this.loading = true;
      getCampaginListData(url, data, this.page.pageNum).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          // this.banner_page_req.start = res.data.current; //分页查询起始记录
          this.page.pageNum = res.data.current; //分页查询起始记录
          this.page.total = res.data.total; //列表总数
          this.page.pageSize = res.data.size; //每页数据
        } else {
          this.$Message.error(res.code + " 数据加载失败!", 3);
        }
        this.loading = false;
      });
    },

    selectedTr() {
      //couponType id,name
      this.$emit("seclectedTr-event", {
        prizeType: this.prizeType,
        couponType: this.couponType,
        id: this.id,
        name: this.name
      });
    },
    changeCurren(current) {
      if (this.searchForm.pageNum != current) {
        this.searchForm.pageNum = current;
        this.search();
      }
    },
    //确定选择商户
    selectMerchant() {
      if (this.choice.id) {
        this.merchantTabDisplay = false;
        this.choice.prizeType = this.prizeType;
        this.choice.couponType = this.searchForm.couponType;
        this.$emit("seclectedTr-event", this.choice);
      } else {
        this.msgErr("至少选一个商户");
      }
    },
    // 关闭商户选择框
    cancel() {
      this.choice = {
        id: "",
        name: ""
      };
      this.$emit("seclectedTr-event", false);
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
  },
  mounted() {
    this.search();
  }
};
</script>

