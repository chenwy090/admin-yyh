<template>
  <div>
    <div v-if="!addStorePage">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline ref="store_data" :model="store_data">
          <FormItem label="门店店号:" :label-width="85" prop="shopId">
            <Input
              style="width:200px"
              type="text"
              v-model="store_data.shopId"
              placeholder="请输入门店店号"
              @on-change="changeData"
            ></Input>
          </FormItem>
          <span v-if="drop">
            <FormItem label="门店名称:" :label-width="85" prop="shopName">
              <Input
                style="width:200px"
                type="text"
                v-model="store_data.shopName"
                placeholder="请输入门店名称:"
                @on-change="changeData"
              ></Input>
            </FormItem>
            <FormItem label="零售商名称:" :label-width="85" prop="venderName">
              <Input
                style="width:200px"
                type="text"
                v-model="store_data.venderName"
                placeholder="请输入零售商名称:"
                @on-change="changeData"
              ></Input>
            </FormItem>
          </span>
          <FormItem style="margin-left:35px;" class="br">
            <Button type="primary" icon="md-search" @click="queryTableList">查询</Button>
            <Button icon="md-refresh" @click="handleReset('store_data');changeDisplay = true">重置</Button>
            <a class="drop-down" style="margin-left:10px" @click="dropDown">
              {{dropDownContent}}
              <Icon :type="dropDownIcon"></Icon>
            </a>
          </FormItem>
          <Row type="flex" justify="start">
            <Col span="24">
              <FormItem style="margin-bottom: 0;">
                <Button type="success" icon="md-add" @click="addStore" style="width: 120px;">新增门店</Button>
              </FormItem>
              <FormItem style="margin-bottom: 0;">
                <Button
                  type="primary"
                  icon="md-arrow-round-up"
                  @click="upShopXls"
                  style="width: 120px;"
                >导入门店信息</Button>
              </FormItem>
              <FormItem style="margin-bottom: 0;">
                <Button
                  type="warning"
                  icon="md-arrow-round-down"
                  style="width: 120px;"
                  @click="deriveFn"
                >导出门店信息</Button>
                <!-- :disabled="changeDisplay" deriveShopXls-->
              </FormItem>
              <!-- <Button @click="getShopListFn" icon="md-refresh">刷新</Button> -->
            </Col>
          </Row>
        </Form>
      </Card>
      <!-- 导入门店列表 -->
      <Modal v-model="uploadShopModal" width="700">
        <p slot="header" style="text-align:center">
          <span>导入门店列表</span>
        </p>
        <div style="text-align:left;padding: 30px 16px;" class="improt-store">
          <Form :label-width="180">
            <FormItem
              label="上传门店Excel："
              required
              class="upload-excel"
              enctype="multipart/form-data"
            >
              <Upload
                style="float: left;margin-right:30px"
                ref="uploadGoodsFileItem"
                :action="action_item"
                :format="['xlsx','xls']"
                :on-success="handleItemSuccess"
                :on-format-error="handleItemFormatError"
                :before-upload="handleBeforeItemUpload"
                :on-remove="handleItemRemove"
                :headers="uploadToken"
              >
                <i-button type="success" icon="ios-cloud-upload-outline">上传文件</i-button>
              </Upload>

              <!-- <a
                style="text-decoration: underline;font-size: 12px;padding-left: 10px;float:left;;"
                href="http://image.sweetmartmarketing.com/wx_mini/PW8PhlzUiW.xlsx"
              >下载模板</a>-->
              <Button type="text" style="color:#2d8cf0" @click="downloadTemplet">点击下载模板</Button>
              <!-- <Button icon="ios-cloud-upload-outline" @click="downloadTemplet">下载模板</Button> -->
            </FormItem>
          </Form>
        </div>
        <!-- <Upload action="//jsonplaceholder.typicode.com/posts/">
            <Button icon="ios-cloud-upload-outline">上传</Button>
        </Upload>-->
        <div slot="footer">
          <Button type="primary" size="large" long disabled v-if="!closeBtn">请上传文件</Button>
          <Button type="primary" size="large" long v-else @click="uploadShopModal = false">关闭对话框</Button>
        </div>
      </Modal>
      <!-- 导入门店列表 -->
      <Card :bordered="false">
        <!-- 列表 -->
        <div>
          <Table
            border
            width="100%"
            :columns="columns6"
            :data="store_data_list"
            :loading="TableLoading"
          >
            <template slot-scope="{ row, index }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="editStore(row)"
              >编辑</Button>
              <Button type="error" size="small" @click="inputDeleteStore(row.shopId)">删除</Button>
            </template>
            <template slot-scope="{ row }" slot="enabled">
              <span v-if="row.enabled == 0" style="color:#ed4014">禁用</span>
              <span v-else-if="row.enabled == 1" style="color:#19be6b">正常</span>
            </template>
            <template slot-scope="{ row }" slot="createTime">
              <span v-if="row.createTime">{{row.createTime | timeFilters}}</span>
              <span v-else style="color:#ddd">暂无</span>
            </template>
            <template slot-scope="{ row }" slot="updateTime">
              <span v-if="row.updateTime">{{row.updateTime | timeFilters}}</span>
              <span v-else style="color:#ddd">暂无</span>
            </template>
          </Table>
        </div>
        <!-- 列表 -->
        <!-- 分页器 -->
        <Row type="flex" justify="end" class="page">
          <Page
            :total="totalSize"
            show-total
            show-elevator
            :current="current"
            @on-change="changeCurrent"
          ></Page>
        </Row>
        <!-- 分页器 -->
      </Card>
    </div>
    <!-- 新增、编辑门店 -->
    <div v-if="addStorePage">
      <add-store @changeStatus="showStatus" :type="type" :storeItem="storeItem"></add-store>
    </div>

    <!-- 删除用户对话框 -->
    <Modal v-model="delShopDisplay" title="删除门店" @on-ok="deleteStore">
      <span style="color:red">确认删除该门店？</span>
    </Modal>
    <!-- 删除用户对话框 -->
    <!-- 导出门店对话框 -->
    <Modal v-model="deriveDisplay" title="导出门店">
      <Alert type="warning" show-icon>全部不输入为导出全部门店</Alert>
      <Form inline ref="deriveForm" :model="deriveForm">
        <FormItem label="门店店号:" :label-width="85" prop="shopId">
          <Input
            style="width:200px"
            type="text"
            v-model="deriveForm.shopId"
            placeholder="请输入门店店号"
            @on-change="changeData"
          ></Input>
        </FormItem>
        <FormItem label="门店名称:" :label-width="85" prop="shopName">
          <Input
            style="width:200px"
            type="text"
            v-model="deriveForm.shopName"
            placeholder="请输入门店名称:"
            @on-change="changeData"
          ></Input>
        </FormItem>
        <FormItem label="零售商名称:" :label-width="85" prop="venderName">
          <Input
            style="width:200px"
            type="text"
            v-model="deriveForm.venderName"
            placeholder="请输入零售商名称:"
            @on-change="changeData"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="deriveShopXls">导出门店</Button>
      </div>
    </Modal>
    <!-- 导出门店对话框 -->
  </div>
</template>

<script>
import addStore from "./components/addStore";
import { getShopList, delShop, getXls, upXls } from "@/api/sys";
import { baseUrl } from "@/api/index";
export default {
  name: "store-management",
  components: {
    addStore
  },
  data() {
    return {
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      TableLoading: false, // 加载动画
      columns6: [
        //门店列表
        {
          title: "操作",
          key: "operation",
          minWidth: 145,
          align: "center",
          slot: "action",
          fixed: "left"
        },
        {
          title: "知而行店号",
          key: "shopId",
          minWidth: 80,
          align: "center"
        },
        {
          title: "门店名称",
          key: "shopName",
          minWidth: 145,
          align: "center"
        },
        {
          title: "门店类型",
          key: "categories",
          minWidth: 145,
          align: "center"
        },
        {
          title: "所在省份",
          key: "province",
          minWidth: 145,
          align: "center"
        },
        {
          title: "所在城市",
          key: "city",
          minWidth: 145,
          align: "center"
        },
        {
          title: "详细地址",
          key: "address",
          minWidth: 205,
          align: "center"
        },
        {
          title: "经度",
          key: "longitude",
          minWidth: 105,
          align: "center"
        },
        {
          title: "纬度",
          key: "latitude",
          minWidth: 105,
          align: "center"
        },
        {
          title: "状态",
          key: "enabled",
          minWidth: 80,
          align: "center",
          slot: "enabled"
        },
        {
          title: "零售商编号",
          key: "venderId",
          minWidth: 130,
          align: "center"
        },
        {
          title: "零售商名称",
          key: "venderName",
          minWidth: 130,
          align: "center"
        },
        {
          title: "零售商自有店号",
          key: "venderShopId",
          minWidth: 80,
          align: "center"
        },
        {
          title: "创建人",
          key: "createBy",
          minWidth: 145,
          align: "center"
        },
        {
          title: "创建时间",
          key: "createTime",
          minWidth: 165,
          align: "center",
          slot: "createTime"
        },
        {
          title: "修改人",
          key: "updateBy",
          minWidth: 145,
          align: "center"
        },
        {
          title: "修改时间",
          key: "updateTime",
          minWidth: 165,
          align: "center",
          slot: "updateTime"
        }
      ],
      store_data: {
        shopId: "", //知而行门店号
        shopName: "", //门店名称
        venderName: "" //零售商名称
      },
      store_data_list: [], //列表数据
      current: 1, //当前页面
      totalSize: 0, //总条数
      uploadShopModal: false, //上传门店模态框
      importStoreInfo: {
        appid: "",
        filePath: ""
      }, //上传门店
      addStorePage: false,
      type: 1, //1--表示新增、2--表示编辑
      storeItem: {}, //单条门店信息
      delShopDisplay: false, //删除确认显示
      delShopId: "", //需要删除的门店id
      listStatus: 1, // 列表状态， 1：获取列表 2：搜索
      uploadToken: {}, // 上传门店时需要的token
      // -----------------
      action_item: baseUrl + "/system/sys-shop-info/importShopInfo",
      add_item_data: [],

      closeBtn: false, // 关闭门店按钮显示
      changeDisplay: true, // 搜索改变数据后显示导出
      deriveDisplay: false, // 导出门店对话框
      deriveForm: {
        shopId: "",
        venderName: "",
        shopName: ""
      }
    };
  },
  created: function() {
    this.getShopListFn();
  },
  methods: {
    //子组件传参
    showStatus: function(e) {
      this.addStorePage = e;
      this.getShopListFn();
    },
    // 搜索
    queryTableList: function() {
      this.listStatus = 2;
      this.current = 1;
      this.getWebankMallPage(this.store_data);
    },
    // 获取列表
    getShopListFn() {
      this.listStatus = 1;
      this.current = 1;
      this.getWebankMallPage({});
    },

    //封装获取列表
    getWebankMallPage: function(data) {
      // 加载动画
      this.TableLoading = true;

      getShopList(data, this.current).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.store_data_list = res.data.records;
          // 分页
          this.totalSize = res.data.total;
          this.current = res.data.current;

          // 加载动画
          this.TableLoading = false;

          //重置搜索框
          // this.handleReset("store_data");
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 新增门店
    addStore: function() {
      this.addStorePage = true;
      this.type = 1;
    },

    // 传值到编辑门店
    editStore: function(row) {
      this.addStorePage = true;
      this.type = 2;
      // this.storeItem = this.store_data_list[row];
      // let obj = {}
      // obj = row
      this.storeItem = row;
    },

    // 传值到删除
    inputDeleteStore(id) {
      this.delShopId = id;
      this.delShopDisplay = true;
    },

    // 删除
    deleteStore: function() {
      delShop(this.delShopId).then(res => {
        if (res.code == 200) {
          this.msgOk("删除成功");
          this.getWebankMallPage({});
          this.delShopId = "";
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    //重置
    handleReset: function(name) {
      this.$refs[name].resetFields();
      if (name == "store_data") {
        this.getShopListFn();
      }
    },
    // 小程序appid名称列表
    setVender: function(v) {
      this.store_data.appid = v.value;
    },

    // 导入门店
    // importStore: function() {
    //   var self = this;
    //   // if (!self.store_data.appid || self.store_data.appid == undefined) {
    //   //   self.$Message.error("请选择小程序appid!", 3);
    //   //   return;
    //   // }
    //   // if (
    //   //   self.importStoreInfo.filePath == null ||
    //   //   self.importStoreInfo.filePath == ""
    //   // ) {
    //   //   alert("请选择将要上传的门店文件!");
    //   //   return;
    //   // }

    //   var file_typename = this.file.name.split(".")[1];
    //   if (file_typename != "xlsx" && file_typename != "xls") {
    //     alert("文件格式不对，请下载模板按照模板格式上传 ！");
    //     return;
    //   }
    //   console.log(this.file);
    //   // return
    //   // self.importStoreInfo.appid = self.store_data.appid;
    //   var reqObj = new FormData();
    //   //reqObj.append("appid", self.importStoreInfo.appid);
    //   reqObj.append("file", this.file);
    //   //console.log(reqObj);
    //   let obj = {
    //     "file":reqObj
    //   }
    //   console.log(obj);
    //   upXls(obj).then(res => {
    //     console.log(res);
    //   });

    //   // zexApis.importShopInfo(reqObj).done(function(res) {
    //   //   if (res.code == 200) {
    //   //     self.$Message.success("门店导入成功!", 3);
    //   //     self.uploadShopModal = false;
    //   //     self.getWebankMallPage();
    //   //   } else {
    //   //     self.$Message.error(res.code + "," + res.msg, 3);
    //   //   }
    //   // });
    // },

    // 分页
    changeCurrent: function(current) {
      this.current = current;
      if (this.listStatus == 1) {
        this.getWebankMallPage({});
      } else if (this.listStatus == 2) {
        this.getWebankMallPage(this.store_data);
      }
    },

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
    },

    // 导出门店弹框
    deriveFn() {
      this.deriveForm.shopId = "";
      this.deriveForm.venderName = "";
      this.deriveForm.shopName = "";
      this.deriveDisplay = true;
    },

    //导出门店
    deriveShopXls() {
      window.location.href =
        baseUrl +
        `/system/sys-shop-info/downloadShopInfoList?` +
        "&shopId=" +
        this.deriveForm.shopId +
        "&venderName=" +
        this.deriveForm.venderName +
        "&shopName=" +
        this.deriveForm.shopName;
      // getXls().then(res => {
      //   console.log(res);
      // })
      this.deriveDisplay = false;
      this.deriveForm.shopId = "";
      this.deriveForm.venderName = "";
      this.deriveForm.shopName = "";
    },

    // 阻止默认上传
    // handleUpload(file) {
    //   this.file = file;
    //   return false;
    // },

    // =-------------------------------------------------

    //传值到导入门店弹框
    upShopXls() {
      this.uploadShopModal = true;
      this.closeBtn = false;
      this.uploadToken = {
        jwttoken: localStorage.getItem("jwttoken")
      };
    },

    // 导入门店
    handleItemRemove(file) {
      this.add_item_data = [];
    },
    handleItemSuccess(res, file) {
      // console.log(res);

      if (res.code == 200) {
        this.closeBtn = true;
        this.msgOk("上传成功");
        this.getShopListFn();
      } else {
        this.msgErr(res.msg);
      }
      // if (res.code != 200) {
      //   this.$Message.error(res.msg);
      //   return;
      // }
      // this.add_item_data = res.itemList;
      // // 因为上传过程为实例，这里模拟添加 url
      // this.$Message.info("新增成功！");
    },
    handleItemFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc:
          "文件 " + file.name + " 格式不正确，请上传 xlsx 或 xls 格式的表格。"
      });
    },
    handleBeforeItemUpload() {
      //console.log(this.$refs.uploadGoodsFileItem);
      this.$refs.uploadGoodsFileItem.clearFiles();
    },

    // 下载模板
    downloadTemplet() {
      // window.location.href = baseUrl+`/system/sys-shop-info/downloadTemplateShop`
      window.location.href = baseUrl + "/document/shop_import.xlsx";
    },

    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "ios-arrow-down";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "ios-arrow-up";
      }
      this.drop = !this.drop;
    },

    changeData() {
      this.changeDisplay = false;
    }

    // 导出门店对话框状态改变触发函数
    // changeUpload(status) {
    //   // console.log(status);
    //   if(status == false) {
    //     this.getShopListFn()
    //   }
    // }
  },
  filters: {
    timeFilters: function(value) {
      if (value) {
        var date = value.slice(0, 10);
        var time = value.slice(11, 19);
        return date + " " + time;
      }
    }
  }
};
</script>

<style>
.page {
  margin-top: 2vh;
}
</style>
