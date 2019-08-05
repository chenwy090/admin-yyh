<template>
  <div>
    <div v-if="!qrCodePage">
      <Card>
        <i-form inline>
          <Form-item label="二维码类型：" :label-width="100">
            <i-select v-model="qrCode_req.qrcodeType" placeholder="请选择" style="width:200px">
              <!-- <i-option value>全部</i-option> -->
              <i-option value="1">邀请码</i-option>
              <i-option value="2">位置码</i-option>
            </i-select>
          </Form-item>
          <!-- 显示隐藏 -->
          <span v-if="drop">
            <Form-item label="服务类型" :label-width="100">
              <i-select v-model="qrCode_req.serviceType" placeholder="请选择" style="width:200px">
                <i-option value>全部</i-option>
                <i-option
                  v-for="(item, index) in serviceTypeList"
                  :value="item.dictValue"
                  :key="index"
                >{{item.dictLabel}}</i-option>
              </i-select>
            </Form-item>
            <Form-item label="小程序appid：" :label-width="100">
              <i-select v-model="qrCode_req.appid" placeholder="请选择" style="width:200px">
                <i-option value>全部</i-option>
                <i-option
                  v-for="item in appStoreList"
                  :value="item.appid"
                  :key="item.appid"
                >{{item.appName}}</i-option>
              </i-select>
            </Form-item>
            <Form-item label="二维码参数:" :label-width="85">
              <i-input
                style="width:200px"
                type="text"
                v-model="qrCode_req.scene"
                placeholder="请输入..."
              ></i-input>
            </Form-item>
            <Form-item label="门店号:" :label-width="85">
              <i-input
                style="width:200px"
                type="text"
                v-model="qrCode_req.shopId"
                placeholder="请输入..."
              ></i-input>
            </Form-item>
            <Form-item label="邀请人:" :label-width="85">
              <i-input
                style="width:200px"
                type="text"
                v-model="qrCode_req.uid"
                placeholder="请输入..."
              ></i-input>
            </Form-item>
          </span>
          <!-- 显示隐藏 -->
          <Form-item>
            <Button type="primary" icon="ios-search" @click="queryTableList">搜索</Button>
          </Form-item>
          <Form-item>
            <Button icon="md-refresh" @click="reset">重置</Button>
          </Form-item>
          <Form-item>
            <a class="drop-down" @click="dropDown">
              {{dropDownContent}}
              <Icon :type="dropDownIcon"></Icon>
            </a>
          </Form-item>
          <Form-item style="display:block;margin-bottom:0px">
            <Button type="primary" icon="md-add" @click="addWxQrCode" style="width: 120px;">添加二维码</Button>
          </Form-item>
        </i-form>
      </Card>
      <Modal v-model="bigImgDialog" title="查看大图" width="400" @on-cancel="bigImgCancel">
        <img style="width: 100%" :src.sync="big_Image_url">
      </Modal>
      <Card>
        <div style="margin-top: 30px;">
          <Alert type="warning" show-icon v-if="warningDisplay">请选择二维码类型搜索数据</Alert>
          <Table
            border
            width="100%"
            :columns.sync="searchType == '1' ? columns1 : searchType == '2' ? columns2 : columns"
            :data="qrCode_list"
            :loading="TableLoading"
          >
            <template slot-scope="{ row }" slot="action">
              <Button
                type="success"
                size="small"
                style="margin-right:5px;"
                @click="inputDetails(row)"
              >查看详情</Button>
              <!-- @click="abc(row)" -->
            </template>
            <!-- <template slot-scope="{ row }" slot="appid">
              <span v-if="row.appid == 'wx9bfca109c5551e3b'">超市惠服务号+</span>
              <span v-else-if="row.appid == 'wxbab3c1521a7f4d86'">要U惠</span>
              <span v-else>{{row.appid}}</span>
            </template>-->
            <template slot-scope="{ row }" slot="qrcodeType">
              <span v-if="row.qrcodeType == 1">邀请码</span>
              <span v-else-if="row.qrcodeType == 2">位置码</span>
            </template>
            <template slot-scope="{ row }" slot="serviceType">
              <span v-if="row.serviceType == 1">首页</span>
              <span v-else-if="row.serviceType == 2">跳转领优惠详情页</span>
              <span v-else-if="row.serviceType == 3">跳转附近领优惠券列表</span>
            </template>
            <template slot-scope="{ row }" slot="qrcodeUrl">
              <div class="img" @click="showBigImg(row)">
                <img :src="row.qrcodeUrl">
              </div>
            </template>
            <template slot-scope="{ row }" slot="width">
              <span>{{row.width}}px</span>
            </template>
            <template slot-scope="{ row }" slot="locationType">
              <span v-if="row.locationType == 1">店内</span>
              <span v-else-if="row.locationType == 2">公众号</span>
              <span v-else-if="row.locationType == 3">商品</span>
            </template>
          </Table>
        </div>
        <!-- 分页器 -->
        <Row type="flex" justify="end" class="page">
          <Page
            :total="totalSize"
            show-total
            show-elevator
            :current.sync="current"
            @on-change="changeCurrent"
          ></Page>
        </Row>
      </Card>
    </div>
    <div v-else>
      <addQrcode @changeStatus="showStatus" :qrcodeStatus="qrcodeStatus" :qrcodeItem="qrcodeItem"></addQrcode>
    </div>
    <!-- 查看详情对话框 -->
    <Modal title="查看详情" v-model="qrCodeDsplay" :mask-closable="false" footer-hide width="700">
      <!-- 查看详情对话框 -->
      <div class="box1">
        <div class="check">
          <div>
            <span>小程序appid:</span>
            <span>{{qrCodeDetailsData.appid}}</span>
          </div>
          <div>
            <span>id:</span>
            <span>{{qrCodeDetailsData.id}}</span>
          </div>
          <div>
            <span>二维码类型:</span>
            <!-- <span>{{qrCodeDetailsData.qrcodeType}}</span> -->
            <span v-if="qrCodeDetailsData.qrcodeType == 1">邀请码</span>
            <span v-else-if="qrCodeDetailsData.qrcodeType == 2">位置码</span>
          </div>
          <div>
            <span>服务类型:</span>
            <!-- <span>{{qrCodeDetailsData.serviceType}}</span> -->
            <span v-if="qrCodeDetailsData.serviceType == 1">首页</span>
            <span v-else-if="qrCodeDetailsData.serviceType == 2">跳转领优惠详情页</span>
            <span v-else-if="qrCodeDetailsData.serviceType == 3">跳转附近领优惠券列表</span>
          </div>
          <div>
            <span>二维码参数:</span>
            <span>{{qrCodeDetailsData.scene}}</span>
          </div>
          <div v-if="qrCodeDetailsData.qrcodeType == 2">
            <span>门店号:</span>
            <span>{{qrCodeDetailsData.shopId}}</span>
          </div>
          <div>
            <span>页面路径:</span>
            <span>{{qrCodeDetailsData.page}}</span>
          </div>
          <div style="display:block">
            <span style="float:left">二维码图片:</span>
            <div class="img">
              <img :src="qrCodeDetailsData.qrcodeUrl" alt>
            </div>
          </div>
          <div>
            <span>二维码宽度:</span>
            <span>{{qrCodeDetailsData.width}}</span>
          </div>
          <div>
            <span>二维码备注:</span>
            <span>{{qrCodeDetailsData.remark}}</span>
          </div>
          <div>
            <span>创建人:</span>
            <span>{{qrCodeDetailsData.createBy}}</span>
          </div>
          <div>
            <span>创建时间:</span>
            <span>{{qrCodeDetailsData.createTime}}</span>
          </div>
        </div>
        <div class="qrcodeServiceParams">
          <span>业务参数:</span>
          <div>
            <div v-for="(item, index) in qrCodeDetailsData.qrcodeServiceParams" :key="index">
              <div>参数{{index + 1}}名：{{item.param}}</div>
              <div>参数{{index + 1}}值：{{item.value}}</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    qrCodeManagementList,
    getMiniApp,
    getServiceType,
    getServiceParams
  } from "@/api/sys";
  import addQrcode from "./components/addQrcode";
  export default {
    name: "qrCode-management",
    components: {
      addQrcode
    },
    data() {
      return {
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",
        qrCodeDsplay: false, //查看详情
        TableLoading: false, //列表加载动画
        // 空
        columns: [],
        // 邀请码
        columns1: [
          {
            title: "操作",
            key: "operation",
            minWidth: 150,
            fixed: "left",
            slot: "action",
            align: "center"
          },
          {
            title: "小程序appid",
            key: "appid",
            minWidth: 100,
            align: "center",
            // slot: "appid"
            render: (h, params) => {
              let name = params.row.appid;
              for (let i = 0; i < this.appStoreList.length; i++) {
                if (this.appStoreList[i].appid == params.row.appid) {
                  name = this.appStoreList[i].appName;
                }
              }
              return h("div", name);
            }
          },
          {
            title: "二维码类型",
            key: "qrcodeType",
            minWidth: 100,
            align: "center",
            slot: "qrcodeType"
          },
          {
            title: "服务类型",
            key: "serviceType",
            minWidth: 100,
            align: "center",
            slot: "serviceType"
          },
          {
            title: "二维码参数",
            key: "scene",
            minWidth: 100,
            align: "center"
          },
          {
            title: "邀请人",
            key: "uid",
            minWidth: 100,
            align: "center"
          },
          // {
          //   title: "门店号1",
          //   key: "shopId",
          //   minWidth: 100,
          //   align: "center"
          // },
          {
            title: "二维码图片",
            align: "center",
            key: "qrcodeUrl",
            width: 110,
            slot: "qrcodeUrl"
          },
          {
            title: "备注",
            key: "remark",
            minWidth: 130,
            align: "center"
          },
          {
            title: "创建人",
            key: "createBy",
            minWidth: 80,
            align: "center"
          },
          {
            title: "创建时间",
            key: "createTime",
            minWidth: 130,
            align: "center"
          }
        ],
        // 位置码
        columns2: [
          {
            title: "操作",
            key: "operation",
            minWidth: 150,
            fixed: "left",
            slot: "action",
            align: "center"
          },
          {
            title: "小程序appid",
            key: "appid",
            minWidth: 100,
            align: "center",
            // slot: "appid"
            render: (h, params) => {
              let name = params.row.appid;
              for (let i = 0; i < this.appStoreList.length; i++) {
                if (this.appStoreList[i].appid == params.row.appid) {
                  name = this.appStoreList[i].appName;
                }
              }
              return h("div", name);
            }
          },
          {
            title: "二维码类型",
            key: "qrcodeType",
            minWidth: 100,
            align: "center",
            slot: "qrcodeType"
          },
          {
            title: "服务类型",
            key: "serviceType",
            minWidth: 100,
            align: "center",
            slot: "serviceType"
          },
          {
            title: "二维码参数",
            key: "scene",
            minWidth: 100,
            align: "center"
          },
          {
            title: "位置类型",
            key: "locationType",
            minWidth: 100,
            align: "center",
            slot: "locationType"
          },
          {
            title: "位置描述",
            key: "location",
            minWidth: 100,
            align: "center"
          },
          {
            title: "门店号",
            key: "shopId",
            minWidth: 100,
            align: "center"
          },
          {
            title: "二维码图片",
            align: "center",
            key: "qrcodeUrl",
            width: 110,
            slot: "qrcodeUrl"
          },
          {
            title: "备注",
            key: "remark",
            minWidth: 130,
            align: "center"
          },
          {
            title: "创建人",
            key: "createBy",
            minWidth: 80,
            align: "center"
          },
          {
            title: "创建时间",
            key: "createTime",
            minWidth: 130,
            align: "center"
          }
        ],
        qrCode_req: {
          appid: "", //小程序appid名称 必填
          scene: "", //二维码参数
          serviceType: "", // 服务列表
          qrcodeType: "", //二维码类型
          shopId: "", //门店id
          uid: "" // 邀请人
        },
        qrCode_list: [], //列表数据
        qrCodeDetailsData: {}, //查看详情数据
        searchType: "", // 1：邀请码 2：位置码
        current: 1,
        totalSize: 0, //总条数
        appStoreList: [], // 搜索appid列表
        serviceTypeList: [], // 搜索服务列表
        qrcodeTypeList: [], // 搜索二维码列表
        bigImgDialog: false, //显示大图
        big_Image_url: "",
        // mallTypeList: [{ "lable": "百货", "value": "M" },
        // { "lable": "超市", "value": "S" },
        // { "lable": "家电", "value": "A" },
        // { "lable": "便利店", "value": "C" }],  //门店业态
        // qrcodeTypeList: [{ "lable": "导购码", "value": "P" },
        // { "lable": "位置码", "value": "L" }],   //二维码类型
        qrcode_info: {}, //单条数据
        qrcodeStatus: 1,
        qrCodePage: false,
        qrcodeItem: {},
        warningDisplay: true // 请选择二维码类型提示 显示、隐藏
      };
    },
    created: function() {
      this.getWebankAppStore();
      this.getServiceParams();
      // this.getWebankQrCodePage({}, 1);
    },
    methods: {
      //子组件传参
      showStatus: function(e) {
        // console.log(e);
        this.qrCodePage = e.display;
        if (e.qrcodeType == null) {
          return;
        } else {
          this.qrCode_req.qrcodeType = e.qrcodeType.toString();
          this.queryTableList();
        }
      },
      // 获取小程序app
      getWebankAppStore: function() {
        getMiniApp().then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.appStoreList = res.data;
          } else {
            this.msgErr("小程序appId获取失败");
          }
        });
      },

      // 获取服务类型
      getServiceParams: function(obj) {
        getServiceType().then(res => {
          if (res.code == 200) {
            this.serviceTypeList = res.data;
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 搜索
      queryTableList: function() {
        // this.qrCode_req.start = 0;
        if (!this.qrCode_req.qrcodeType) {
          this.msgErr("请选择二维码类型");
          return;
        }
        if (this.qrCode_req.qrcodeType == "1") {
          this.searchType = "1";
        } else if (this.qrCode_req.qrcodeType == "2") {
          this.searchType = "2";
        }
        // 提示信息隐藏
        this.warningDisplay = false;
        this.getWebankQrCodePage(this.qrCode_req, 1);
      },

      // 查询列表
      getWebankQrCodePage: function(obj, num) {
        this.TableLoading = true;
        qrCodeManagementList(obj, num).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.qrCode_list = res.data.records;
            //分页
            this.current = res.data.current;
            this.totalSize = res.data.total;
            // 加载动画
            this.TableLoading = false;
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      //查看详情
      inputDetails(row) {
        this.qrCodeDetailsData = row;
        getServiceParams(row.id).then(res => {
          if (res.code == 200) {
            this.qrCodeDetailsData.qrcodeServiceParams = res.data;
            this.qrCodeDsplay = true;
          }
        });
      },
      // //更新已上报的信息
      // getWebankQrcodeInfo: function (req, flag) {  // 微众小程序appid
      //   zexApis.updateWebankQrcodeInfo(req).done((function (res) {

      //     if (res.code == 200) {
      //       this.qrcode_info = res.qrcodeInfo;
      //       if (1 == flag) {
      //         window.sessionStorage.setItem("editInfo", JSON.stringify(this.qrcode_info));
      //         window.location.href = 'editWeBankQrCode.jsp';
      //       } else if (2 == flag) {
      //         window.sessionStorage.setItem("detailsInfo", JSON.stringify(this.qrcode_info));
      //         window.location.href = 'viewWeBankQrCode.jsp';
      //       }

      //     } else {
      //       this.$Message.error(res.code + res.msg, 3);
      //     }
      //   }).bind(this));
      //新增
      addWxQrCode: function() {
        this.qrCodePage = true;
      },
      //编辑
      // postWebank: function (index) {
      //   this.qrCodePage = ture;
      //   this.qrCodeItem = this.qrCode_list[index];
      //   this.qrcodeStatus = 2;
      // },
      //viewDetail
      viewDetail: function(index) {
        this.qrCodePage = true;
        this.qrCodeItem = this.qrCode_list[index];
        this.qrcodeStatus = 2;
      },
      // 显示大图
      showBigImg: function(row) {
        // if (!this.qrCode_list[index].qrcode_url) {
        //   this.$Message.error("图片为空!", 3);
        // } else {
        // console.log(row);
        this.bigImgDialog = true;
        this.big_Image_url = row.qrcodeUrl;
        // }
      },
      bigImgCancel: function() {
        this.bigImgDialog = false;
      },
      // 分页
      // changePageSize: function(pageSize) {
      //   console.log(123);
      //   // var self = this;
      //   // self.qrCode_req.limit = pageSize;
      //   // self.getWebankQrCodePage();
      // },
      changeCurrent(current) {
        // console.log(current);
        this.current = current;
        this.getWebankQrCodePage(this.qrCode_req, current);
      },

      changeVender: function(v) {
        this.qrCode_req.appid = v.value;
      },

      // 重置
      reset() {
        this.qrCode_req.appid = "";
        this.qrCode_req.scene = "";
        this.qrCode_req.serviceType = "";
        this.qrCode_req.qrcodeType = "";
        this.qrCode_req.shopId = "";
        this.qrCode_req.uid = "";
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
      },

      // 搜索 显示隐藏问题
      dropDown() {
        if (this.drop) {
          this.dropDownContent = "展开";
          this.dropDownIcon = "ios-arrow-down";
        } else {
          this.dropDownContent = "收起";
          this.dropDownIcon = "ios-arrow-up";
        }
        this.drop = !this.drop;
      }
    }
  };
</script>

<style lang="less" scoped>
  .box1 {
    overflow: hidden;
    .check {
      width: 300px;
      float: left;
      margin-right: 15px;
      div {
        > span:nth-child(1) {
          width: 100px;
          display: inline-block;
          font-size: 16px;
          font-weight: 600;
          text-align: right;
        }
        > span:nth-child(2) {
          // width: 100px;
          display: inline-block;
          font-size: 16px;
          margin-left: 15px;
        }

        .img {
          display: inline-block;
          width: 100px;
          height: 100px;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          margin-left: 15px;
        }
        margin-bottom: 10px;
      }
    }
    .qrcodeServiceParams {
      float: left;
      width: 350px;
      > span {
        display: inline-block;
        font-weight: 600;
        text-align: right;
        font-size: 16px;
      }
      > div {
        margin-left: 30px;
        margin-bottom: 10px;
        > div {
          font-size: 16px;
          margin-top: 10px;
        }
      }
    }
  }

  .img {
    width: 50px;
    height: 50px;
    margin-left: 11px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
