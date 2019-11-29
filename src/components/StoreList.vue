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
      <div style="min-height: 240px">
        <row v-if="true">
          <Form ref="searchItem" :model="searchData" inline :label-width="70" class="search-form">
            <FormItem label="商户编号">
              <Input
                type="text"
                v-model="searchData.shopId"
                clearable
                placeholder="请输入shopId"
                style="width: 150px"
              />
            </FormItem>
            <FormItem label="商户名称">
              <Input
                type="text"
                v-model="searchData.shopName"
                clearable
                placeholder="请输入商户名称shopName"
                style="width: 180px"
              />
            </FormItem>
            <!-- <FormItem style label="所在地区">
              <Select
                v-model="searchData.provinceCode"
                style="width:150px"
                clearable
                @on-change="getcitylist"
              >
                <Option
                  v-for="(item,index) in provincelist"
                  :key="index"
                  :value="item.provinceCode"
                >{{item.province}}</Option>
              </Select>
              <Select
                v-model="searchData.cityCode"
                style="width:150px"
                clearable
                @on-change="getarealist"
              >
                <Option
                  v-for="(item,index) in citylist"
                  :key="index"
                  :value="item.cityCode"
                >{{item.city}}</Option>
              </Select>
              <Select v-model="searchData.areaId" style="width:150px" clearable>
                <Option
                  v-for="(item,index) in arealist"
                  :key="index"
                  :value="item.areaCode"
                >{{item.areaName}}</Option>
              </Select>
            </FormItem> -->
            <FormItem style="margin-left:-35px;" class="br">
              <Button @click="doSearch" type="primary" icon="ios-search">搜索</Button>
              <Button @click="reset">重置</Button>
            </FormItem>
          </Form>
        </row>

        <!-- 商户列表 -->
        <Table
          border
          ref="refTable"
          size="small"
          :columns="tableColumns"
          :data="tableData"
          :loading="tableLoading"
          class="bussiness-list"
          @on-selection-change="handleSelectChange"
          @on-row-dblclick="handleOnRowDbclick"
        ></Table>
        <Row type="flex" justify="end" class="page">
          <Page
            show-total
            show-elevator
            :current="page.pageNum"
            :page-size="page.pageSize"
            :total="page.total"
            @on-change="changeCurrent"
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
/**
 * 选取门店（多选）
 * 数据量较少，采用前端分页、前端搜索
 * 该组件的使用方式：
 * <StoreList
      v-if="showStoreList"
      :showStoreList.sync="showStoreList"
      :checked="add_info.merchantList"
      @storeSelect="selectedTrCallBack"
    ></StoreList>
 */
import {
  getRequest,
  postRequest
} from "@/libs/axios";

export default {
  name: "store-list",
  props: {
    id: {
      type: [Number, String],
      default: ""
    },
    hasChecked: {
      type: Array,
      default: () => []
    },
    shopLists: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentShopList: [],
      isShow: true,
      //选中的数据
      choices: [
        /*{ id: "", name: "", row: {} } */
      ],
      provincelist: [],
      citylist: [],
      arealist: [],
          // address: "运河文化广场3号地下一楼"
          // categories: "购物,超市"
          // city: "杭州市"
          // createBy: "suncongying"
          // createTime: "2019-08-06T15:15:05"
          // district: "拱墅区"
          // enabled: 1
          // latitude: "30.31781"
          // longitude: "120.14138"
          // province: "浙江省"
          // shopId: "1155"
          // shopName: "世纪联华运河广场"
          // updateBy: "test"
          // updateTime: "2019-09-12T09:50:31"
          // venderId: "80"
          // venderName: "浙江世纪联华"
          // venderShopId: "2625"
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "商户编号",
          align: "center",
          minWidth: 130,
          key: "shopId"
        },
        {
          title: "商户名称",
          align: "center",
          width: 230,
          key: "shopName"
        },
        {
          title: "所属地区",
          align: "center",
          width: 340,
          key: "address",
          render: (h, params) => {
            let { shopName, province, city } = params.row;
            let address = `${province}${city}`;
            params.row.name = shopName;
            params.row.address = address;
            return <span>{address}</span>;
          }
        }
      ],
      searchData: {
        type: 0,
        shopId: "",
        shopName: "",
        provinceCode: "",
        cityCode: "",
        areaId: ""
      },
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      tableLoading: false,
      tableData: []
    };
  },

  methods: {
    handleChecked() {
      this.hasChecked.forEach(el=>{
        this.currentShopList.forEach((ell,ii)=>{
          if (el.shopId == ell.shopId) {
            this.currentShopList[ii]._checked = true;
          }
        });
      })
    },
    // //确定选择商户
    selectMerchant() {
      this.choices = this.currentShopList.filter(item => item._checked);
      let choices = [];
      this.choices.forEach((el,i) =>{
        delete el._checked;
        choices.push(el)
      })

      if (this.choices.length) {
        this.$emit("storeSelect", choices);
        if (Array.isArray(this.currentShopList)) {
          this.currentShopList.forEach((el, i) => {
            if (el._checked === true) {
              this.currentShopList[i]._checked = false
            }
          })
        }
        this.closeDialog();
      } else {
        this.msgErr("至少选一项");
      }
    },
    handleSelectChange(selection) {
      let cur = (this.page.pageNum - 1) * this.page.pageSize;
      this.tableData = this.tableData.map((item, index) => {
        item._checked = false;
        this.currentShopList[cur + index]._checked = false;
        for (let i = 0; i < selection.length; i++) {
          if (item.shopId == selection[i].shopId) {
            item._checked = true;
            this.currentShopList[cur + index]._checked = true;
          }
        }
        return item;
      });
    },
    handleOnRowDbclick(row, index) {
      // let { _checked } = row;

      // _checked = !_checked;
      // row._checked = _checked;
      // this.tableData.splice(index, 1, row);
      
      // let cur = (this.page.pageNum - 1) * this.page.pageSize;
      // this.currentShopList.splice(cur + index, 1, row);
    },

    //获取省份信息数据
    getprovincelist() {
      const url = "/system/area/province/list";
      postRequest(url).then(res => {
        if (res.code == 200) {
          this.provincelist = res.data;
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    //根据省份code获取城市信息数据
    getcitylist() {
      const url = "/system/area/city/" + this.searchData.provinceCode;
      getRequest(url).then(res => {
        if (res.code == 200) {
          this.citylist = res.data;
          this.searchData.areaId = "";
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    //根据城市code获取区县信息数据
    getarealist() {
      const url = "/system/area/district/" + this.searchData.cityCode;
      getRequest(url).then(res => {
        if (res.code == 200) {
          this.arealist = res.data;
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    doSearch(reset) {
      // 
      this.page.pageNum = 1;
      // 重置 currentShopList 全不选
      this.currentShopList = JSON.parse(JSON.stringify(this.shopLists));
      if (reset !== true) {
        this.handleChecked();
      }
      this.currentShopList = this.currentShopList.filter(el=>{
        if (
          (this.searchData.shopName? el.shopName.indexOf(this.searchData.shopName) !== -1: true) &&
          (this.searchData.shopId? el.shopId.indexOf(this.searchData.shopId) !== -1 : true)
        ) {
          return true
        } else {
          return false
        }
      })
      console.log(this.currentShopList, this.searchData);
      
      this.queryTableData();
    },
    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.page.pageNum = pageNum;
      this.queryTableData();
    },
    // 获取商户列表
    async queryTableData() {
      if (! Array.isArray(this.currentShopList)) {
        return;
      }
      let cur = (this.page.pageNum - 1) * this.page.pageSize;
      this.tableData = this.currentShopList.slice(cur, cur + this.page.pageSize);

      this.page.total = this.currentShopList.length; //列表总数
    },
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog showStoreList");
      this.$emit(`update:showStoreList`, false);
    },
    //重置搜索条件
    reset() {
      // 重置查询参数
      this.searchData = {
        type: 0,
        shopId: "",
        shopName: "",
        provinceCode: "",
        cityCode: "",
        areaId: ""
      };
      this.page = {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      };
      //重新查询一遍
      this.doSearch(true);
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
    this.currentShopList = JSON.parse(JSON.stringify(this.shopLists));
    this.queryTableData();
    this.getprovincelist();
    this.handleChecked();
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
