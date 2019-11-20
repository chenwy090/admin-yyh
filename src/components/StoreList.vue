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
        <row v-if="false">
          <Form ref="searchItem" :model="searchData" inline :label-width="70" class="search-form">
            <FormItem label="商户编号">
              <Input
                type="text"
                v-model="searchData.shopId"
                clearable
                placeholder="请输入商户编号"
                style="width: 150px"
              />
            </FormItem>
            <FormItem label="商户名称">
              <Input
                type="text"
                v-model="searchData.shopName"
                clearable
                placeholder="请输入商户名称"
                style="width: 150px"
              />
            </FormItem>
            <FormItem style label="所在地区">
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
            </FormItem>
            <FormItem style="margin-left:-35px;" class="br">
              <Button @click="search" type="primary" icon="ios-search">搜索</Button>
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
    checked: {
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
    // //确定选择商户
    selectMerchant() {
      this.choices = this.shopLists.filter(item => item._checked);
      let choices = [];
      this.choices.forEach((el,i) =>{
        delete el._checked;
        choices.push(el)
      })

      if (this.choices.length) {
        this.$emit("storeSelect", choices);
        if (Array.isArray(this.shopLists)) {
          this.shopLists.forEach((el, i) => {
            if (el._checked === true) {
              this.shopLists[i]._checked = false
            }
          })
        }
        this.closeDialog();
      } else {
        this.msgErr("至少选一项");
      }
    },
    handleSelectChange(selection) {
      console.log(this.shopLists);
      let cur = (this.page.pageNum - 1) * this.page.pageSize;
      this.tableData = this.tableData.map((item, index) => {
        item._checked = false;
        this.shopLists[cur + index]._checked = false;
        for (let i = 0; i < selection.length; i++) {
          if (item.shopId == selection[i].shopId) {
            item._checked = true;
            this.shopLists[cur + index]._checked = true;
          }
        }
        return item;
      });
    },
    handleOnRowDbclick(row, index) {
      let { _checked } = row;

      _checked = !_checked;
      row._checked = _checked;
      this.tableData.splice(index, 1, row);
      
      let cur = (this.page.pageNum - 1) * this.page.pageSize;
      this.shopLists.splice(cur, 1, row);
      console.log(
        this.tableData.map(item =>
          JSON.stringify({
            shopId: item.shopId,
            _checked: item._checked
          })
        )
      );
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
    search() {
      this.queryTableData();
    },
    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.queryTableData(pageNum);
    },
    // 获取商户列表
    async queryTableData(pageNum) {
      console.log('shopIds', this.shopLists);
      if (! Array.isArray(this.shopLists)) {
        return;
      }
      if (typeof pageNum === 'number') {
        this.page.pageNum = pageNum;
      }
      let cur = (this.page.pageNum - 1) * this.page.pageSize;
      this.tableData = this.shopLists.slice(cur, cur + this.page.pageSize);

      this.page.total = this.shopLists.length; //列表总数
      return;
      console.log(this.checked)
      this.page.pageNum = pageNum || 1;
      this.tableLoading = true;

      // 获取成功开户的商户信息,type=0 商户;type = 1 品牌
      const url = "/trade/merchant/fund/account/basic/success";

      let {
        code,
        data: { records, current, total, size }
      } = await postRequest(url, {
        ...this.searchData,
        ...this.page
      });
      if (code == 200) {
        this.tableData = records.map(item => {
          let { shopName, province, city } = item;
          let address = `${province}${city}`;
          item.name = shopName;
          item.address = address;
          item._checked = false;
          for (let i = 0; i < this.checked.length; i++) {
            let r = item.shopId == this.checked[i].shopId;
            if (r) {
              item._checked = true;
            }
          }
          return item;
        });
        this.page.pageNum = current; //分页查询起始记录
        this.page.total = total; //列表总数
        this.page.pageSize = size; //每页数据
      } else {
        this.msgErr(res.msg);
      }
      this.tableLoading = false;
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
