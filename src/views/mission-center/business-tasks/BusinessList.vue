<template>
  <div class="bussiness-list-box">
    <Modal
      v-model="isShow"
      title="商户列表"
      width="900"
      footer-hide
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
    >
      <div>
        <row>
          <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
            <FormItem label="商户编号">
              <Input
                type="text"
                v-model="searchItem.merchantId"
                clearable
                placeholder="请输入商户编号"
                style="width: 150px"
              />
            </FormItem>
            <FormItem label="商户名称">
              <Input
                type="text"
                v-model="searchItem.name"
                clearable
                placeholder="请输入商户名称"
                style="width: 150px"
              />
            </FormItem>
            <FormItem style label="所在地区">
              <Select
                v-model="searchItem.provinceId"
                style="width:150px"
                clearable
                @on-change="getcitylist"
              >
                <Option
                  v-for="(item,index) in provincelist"
                  :key="index"
                  :value="item.provinceCode"
                >{{item.provinceName}}</Option>
              </Select>
              <Select
                v-model="searchItem.cityId"
                style="width:150px"
                clearable
                @on-change="getarealist"
              >
                <Option
                  v-for="(item,index) in citylist"
                  :key="index"
                  :value="item.cityCode"
                >{{item.cityName}}</Option>
              </Select>
              <Select v-model="searchItem.areaId" style="width:150px" clearable>
                <Option
                  v-for="(item,index) in arealist"
                  :key="index"
                  :value="item.areaCode"
                >{{item.areaName}}</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-left:-35px;" class="br">
              <Button @click="search" type="primary" icon="ios-search">搜索</Button>
              <Button @click="refresh">重置</Button>
            </FormItem>
          </Form>
        </row>

        <!-- 商户列表 -->
        <Table
          border
          ref="selection"
          size="small"
          :columns="tableColumns"
          :data="tableData"
          :loading="tableLoading"
          class="bussiness-list"
        ></Table>
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

      <Row style="margin-left:350px; margin-top: 30px">
        <Button style="margin-right: 20px" @click="cancel">取消</Button>
        <Button type="primary" @click="selectMerchant">确定</Button>
      </Row>
    </Modal>
  </div>
</template>
<script>
import { getRequest, postRequest } from "@/libs/axios";

export default {
  name: "business-list",
  data() {
    return {
      isShow: true,
      choice: {
        id: "",
        name: ""
      },
      edit_loading: false,
      isCheckDisabled: false,
      checkResult: 0,
      tableColumns: [
        // {
        //   title: "序号",
        //   type: "index",
        //   width: 80,
        //   align: "center"
        // },
        {
          title: "选择",
          key: "merchantId",
          width: 70,
          align: "center",
          render: (h, params) => {
            let id = params.row.merchantId;
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
                    console.log("change", params.row);
                    self.choice.merchantType = 0;
                    self.choice.id = id;
                    self.choice.name = name;
                    self.choice.row = params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: "商户编号",
          align: "center",
          minWidth: 130,
          key: "merchantId"
        },
        {
          title: "商户名称",
          align: "center",
          width: 230,
          key: "name"
        },
        {
          title: "所属地区",
          align: "center",
          width: 340,
          key: "address",
          render: (h, params) => {
            let address =
              params.row.province +
              params.row.city +
              params.row.district +
              params.row.address;
            return h("span", address);
          }
        }
      ],
      tableData: [],
      current: 1,
      totalSize: 0, //总条数
      pageNum: 1, //开始条数
      tableLoading: false,
      searchItem: {
        merchantId: "",
        name: "",
        provinceId: "",
        cityId: "",
        areaId: ""
      },
      provincelist: [],
      citylist: [],
      arealist: [],
      selectedMerchantList: [], //选中的商户列表
      removeAlert: false
    };
  },

  methods: {
    //获取省份信息数据
    getprovincelist() {
      postRequest("/system/area/province/list").then(res => {
        if (res.code == 200) {
          this.provincelist = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //根据省份code获取城市信息数据
    getcitylist() {
      getRequest("/system/area/city/" + this.searchItem.provinceId).then(
        res => {
          if (res.code == 200) {
            this.citylist = res.data;
            this.searchItem.areaId = "";
          } else {
            this.$Message.error(res.msg);
          }
        }
      );
    },
    //根据城市code获取区县信息数据
    getarealist() {
      getRequest("/system/area/district/" + this.searchItem.cityId).then(
        res => {
          if (res.code == 200) {
            this.arealist = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        }
      );
    },
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    search() {
      this.current = 1;
      this.totalSize = 0; //总条数
      this.pageNum = 1; //开始条数
      this.queryTableData();
    },
    // 获取商户列表
    queryTableData() {
      this.tableLoading = false;
      const reqParams = {
        merchantId: this.searchItem.merchantId,
        name: this.searchItem.name,
        provinceCode: this.searchItem.provinceId,
        cityCode: this.searchItem.cityId,
        areaCode: this.searchItem.areaId
      };
      postRequest(
        "/merchant/merchantInfo/list?isAsc=DESC&orderByColumn=1&pageNum=" +
          this.pageNum +
          "&pageSize=10",
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.totalSize = res.data.total;
          this.tableData = res.data.records;
        } else {
          this.msgErr(res.msg);
        }
        this.tableLoading = false;
      });
    },

    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog showBusinessList");
      this.$emit(`update:showBusinessList`, false);
    },
    //确定选择商户
    selectMerchant() {
      if (this.choice.id) {
        this.$emit("seclectedTr-event", this.choice);
        this.closeDialog();
      } else {
        this.msgErr("至少选一个商户");
      }
    },
    //重置商户搜索条件
    refresh() {
      // this.updateTableList(this.params);
      this.searchItem.merchantId = "";
      this.searchItem.name = "";
      this.searchItem.provinceId = "";
      this.searchItem.cityId = "";
      this.searchItem.areaId = "";
      this.queryTableData();
    },

    //分页
    changeCurrent(current) {
      this.pageNum = current;
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
  },
  mounted() {
    this.queryTableData();
    this.getprovincelist();
  }
};
</script>

<style scoped>
.form > div {
  display: inline-block;
}
</style>

<style lang="less">
.bussiness-list-box {
  /*调整table cell间隔和行高*/
  .ivu-table-cell {
    padding-left: 1px;
    padding-right: 1px;
  }
  .ivu-table-small td {
    height: 30px;
  }
}
</style>
