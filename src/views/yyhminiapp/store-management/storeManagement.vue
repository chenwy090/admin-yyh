<template>
  <div>
    <div v-if="!addStorePage">
      <Form inline>
        <Row type="flex" justify="start">
          <Col>
          <FormItem label="知而行店号:" :label-width="85">
            <Input style="width:200px" type="text" :value="store_data.shopId" placeholder="请输入知而行店号"></Input>
          </FormItem>
          </Col>
          <Col>
          <FormItem label="门店名称:" :label-width="85">
            <Input style="width:200px" type="text" :value="store_data.shopName" placeholder="请输入门店名称:"></Input>
          </FormItem>
          </Col>
          <Col>
          <FormItem>
            <Button type="primary" icon="md-search" @click="queryTableList">查询</Button>
          </FormItem>
          <FormItem>
            <Button icon="md-refresh" @click="handleReset()">重置</Button>
          </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="8">
          <FormItem>
            <Button type="primary" icon="md-add" @click="addStore" style="margin-bottom: 10px;width: 120px;">新增门店</Button>
          </FormItem>
          <FormItem>
            <Button type="primary" icon="ios-cloud-upload-outline" @click="uploadShopModal=true" style="margin-bottom: 10px;width: 120px;">导入门店信息</Button>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <!-- 导入门店列表 -->
      <Modal :visible.sync="uploadShopModal" width="700">
        <p slot="header" style="text-align:center">
          <span>导入门店列表</span>
        </p>
        <!-- <div style="text-align:left;padding: 30px 16px;" class="improt-store">
                    <Form :label-width="180">
                        <FormItem label="小程序appid:" required>
                            <Select v-model="importStoreInfo.appid" v-ref:vender style="width:200px" :label-in-value="true" @on-change="setVender" :clearable="true">
                              <Option value="">请选择</Option>
                              <Option v-for="item in wxMiniAppList" :value="item.appid" v-if="item.venderName">{{item.venderName}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="上传门店Excel：" required class="upload-excel">
                            <vue-upload-file :file.sync="importStoreInfo.filePath" :style="{width:'230px'}"></vue-upload-file>
                            <a download="shop_import.xlsx"
                              style="text-decoration: underline;font-size: 12px;padding-left: 10px;"
                              href="shop_import.xlsx">下载模板</a>
                        </FormItem>
                    </Form>
              </div> -->
        <div slot="footer">
          <Button type="primary" size="large" long @click="importStore">确认</Button>
        </div>
      </Modal>
      <div>
        <Table border width="100%" :columns="columns6" :data="store_data_list">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="editStore(index)">编辑</Button>
            <Button type="error" size="small" @click="deleteStore(index)">删除</Button>
          </template>
        </Table>
      </div>
      <!-- 分页器 -->
      <Row type="flex" justify="end" class="page">
        <Page :total="totalSize " show-total show-elevator show-sizer :current="current" @on-change="changeCurrent" @on-page-size-change="changePageSize"></Page>
      </Row>
    </div>
    <!-- 新增、编辑门店 -->
    <div v-if="addStorePage">
      <add-store @changeStatus="showStatus" :type="type" :storeItem = "storeItem"></add-store>
    </div>
  </div>
</template>

<script>
import addStore from './components/addStore'
export default {
  name: "store-management",
  components: {
    addStore
  },
  data() {
    return {
      columns6: [{
        title: '知而行店号',
        key: 'shopId',
        align: 'center'
      },
      {
        title: '门店名称',
        key: 'shopName',
        align: 'center'
      },
      {
        title: '经度',
        key: 'longitude',
        sortable: true,
        align: 'center'
      },
      {
        title: '纬度',
        key: 'latitude',
        sortable: true,
        align: 'center'
      },
      {
        title: '地址',
        key: 'detailAddress',
        sortable: true,
        align: 'center'
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        slot: 'action'
      }],
      store_data: {
        shopId: '', //知而行门店号
        status: '', //微众门店状态
        appid: '', //小程序appid 必填
        shopName: '', //门店名称
        start: 0, //分页页数    必填
        limit: 10, //分页每页数量 必填
      },
      store_data_list: [], //列表数据
      current: 1,
      totalSize: 0, //总条数
      uploadShopModal: false, //上传门店模态框
      importStoreInfo: {
        appid: '',
        filePath: ''
      }, //上传门店
      addStorePage: false,
      type: 1, //1--表示新增、2--表示编辑
      storeItem: {}, //单条门店信息
    }
  },
  created: function () {
    // this.getWebankAppStore();
  },
  methods: {
    //子组件传参
    showStatus: function(e){
      this.addStorePage = e;
    },
    queryTableList: function () {
      this.store_data.start = 0;
      this.getWebankMallPage();
    },
    // 列表
    getWebankMallPage: function () {
      var self = this;
      zexApis.getWebankMallPage(self.store_data).done((function (res) {
        self.store_data_list = res.resultList.resultList;
        self.store_data.start = res.resultList.start; //分页查询起始记录
        self.totalSize = res.resultList.totalSize; //列表总数
        self.store_data.limit = res.resultList.pageSize;
        self.current = res.resultList.curPageNum;
        if (res.code == 499) {
          self.$Message.error(res.code + " 数据加载失败!", 3);
        }
      }))
    },
    // 新增门店
    addStore: function () {
      this.addStorePage = true;
    },
    // 编辑门店
    editStore: function (index) {
      this.addStorePage = true;
      this.type = 2;
      this.storeItem =  this.store_data_list[index];
    },
    // 删除
    deleteStore: function (index) {
      var self = this;
      var req = {
        appid: self.store_data_list[index].appid,
        shopId: self.store_data_list[index].shopId,
      };
      self.$Modal.confirm({
        title: '提示',
        content: '<p>确定要删除此条数据吗？</p>',
        onOk: function () {
          zexApis.deleteShopInfo(req).done((function (res) {
            console.log(res);
            if (res.code == 200) {
              self.$Message.success("门店删除成功!", 3);
              self.getWebankMallPage();

            } else {
              self.$Message.error(res.code + res.msg, 3);
            }
          }))
        },
        onCancel: function () {
          self.$Message.warning('门店删除已取消', 3);
        }
      });
    },
    //重置
    handleReset: function () {
      var self = this;
      this.$nextTick(function () {
        Vue.set(self.store_data, 'shopId', null);
        Vue.set(self.store_data, 'shopName', null);
        //清空状态
        // self.$refs.status.clearSingleSelect();
        // 清空小程序appid名称
        // self.$refs.vender.clearSingleSelect();
      });
    },
    // 小程序appid名称列表
    setVender: function (v) {
      this.store_data.appid = v.value;
    },
    // 导入门店
    importStore: function () {
      var self = this;
      if (!self.store_data.appid || self.store_data.appid == undefined) {
        self.$Message.error("请选择小程序appid!", 3);
        return;
      }
      if (self.importStoreInfo.filePath == null || self.importStoreInfo.filePath == "") {
        alert('请选择将要上传的门店文件!');
        return;
      }
      var file_typename = self.importStoreInfo.filePath.name.split('.')[1];
      if (file_typename != 'xlsx' && file_typename != 'xls') {
        alert("文件格式不对，请下载模板按照模板格式上传 ！");
        return;
      }
      self.importStoreInfo.appid = self.store_data.appid;
      var reqObj = new FormData();
      reqObj.append("appid", self.importStoreInfo.appid);
      reqObj.append("filePath", self.importStoreInfo.filePath);
      zexApis.importShopInfo(reqObj).done((function (res) {
        if (res.code == 200) {
          self.$Message.success("门店导入成功!", 3);
          self.uploadShopModal = false;
          self.getWebankMallPage();
        } else {
          self.$Message.error(res.code + ',' + res.msg, 3);
        }
      }))
    },
    // 分页
    changePageSize: function (pageSize) {
      var self = this;
      self.store_data.limit = pageSize;
      self.getWebankMallPage();
    },
    changeCurrent: function (current) {
      var self = this;
      self.store_data.start = current * self.store_data.limit - self.store_data.limit;
      self.current = current;
      self.getWebankMallPage();
    },
  }
}
</script>

<style>
.page {
  margin-top: 2vh;
}
</style>
