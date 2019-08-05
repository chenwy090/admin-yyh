<template>
  <div>
    <div v-if="!addOperationPage">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="运营位类型" :label-width="85">
            <Select v-model="searchData.operationType" style="width:150px" @on-change="optionChange">
              <!-- <Option value="banner">banner广告</Option> -->
              <Option value="hp_window">首页弹窗</Option>
              <Option value="yf_zt">专题活动</Option>
            </Select>
          </FormItem>
          <span v-if="drop">
            <FormItem label="标题：" :label-width="85">
              <Input style="width:200px" type="text" v-model="searchData.name" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="开始日期：" :label-width="85">
              <DatePicker
                type="date"
                placeholder="请选择开始日期"
                style="display:inline-block;width: 200px"
                @on-change="changeStartDate"
                :value="searchData.startDate"
                :editable="false"
                :clearable="false"
              ></DatePicker>
            </FormItem>
            <FormItem label="结束日期：" :label-width="85">
              <DatePicker
                type="date"
                placeholder="请选择结束日期"
                style="display:inline-block;width: 200px"
                @on-change="changeEndDate"
                :value="searchData.endDate"
                :editable="false"
                :clearable="false"
              ></DatePicker>
            </FormItem>
          </span>
          <FormItem style="margin-left:35px;" class="br">
            <Button type="primary" icon="ios-search" @click="queryTableList">搜索</Button>
            <Button icon="md-refresh" @click="reset">重置</Button>
            <a class="drop-down" style="margin-left:10px" @click="dropDown">
              {{dropDownContent}}
              <Icon :type="dropDownIcon"></Icon>
            </a>
          </FormItem>
        </Form>
        <Row type="flex" justify="start">
          <Col>
            <Button type="primary" icon="md-add" @click="addOperationFun">新增运营位</Button>
          </Col>
        </Row>
      </Card>
      <!-- 查看门店列表 -->
      <!-- <Modal :visible="viewShopListDialog" title="门店列表" width="600" @on-cancel="viewShopListCancel">
        <Table border width="100%" :columns="shopColumns" :data="shop_list"></Table>
      </Modal>-->
      <!-- 看大图 -->
      <Modal v-model="bigImgDialog" title="查看大图" width="600" @on-cancel="bigImgCancel">
        <img style="width: 100%" :src="big_Image_url">
      </Modal>
      <!-- 看大图 -->
      <Card :bordered="false">
        <div>
          <Alert type="warning" show-icon v-show="warningDisplay">请选择运营位类型搜索数据</Alert>
          <!-- 用户列表 -->
          <Table
            border
            width="100%"
            :columns="searchData.operationType == 'yf_zt'? columns9:columns8"
            :data="banner_list"
            :loading="TableLoading"
          >
            <!-- <template slot-scope="{ row }" slot="appid">
              <span v-if="row.appid == 'wx9bfca109c5551e3b'">超市惠服务号+</span>
              <span v-else-if="row.appid == 'wxbab3c1521a7f4d86_bak'">要U惠</span>
              <span v-else>{{row.appid}}</span>
            </template>-->

            <template slot-scope="{ row }" slot="operationType">
              <span v-if="row.operationType == 'banner'">banner广告</span>
              <span v-else-if="row.operationType == 'hp_window'">首页弹窗</span>
              <span v-else-if="row.operationType == 'yf_zt'">专题活动</span>
              <span v-else>{{row.operationType}}</span>
            </template>

            <template slot-scope="{ row }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                v-if="row.status != 1"
                @click="updateBanner(row)"
              >编辑</Button>
              <Button type="primary" size="small" style="margin-right: 5px" v-else disabled>编辑</Button>
              <Button type="success" size="small" style="margin-right: 5px" @click="checkDetailsFn(row)">查看详情</Button>
              <Button type="error" size="small" style="margin-right: 5px" @click="deleteOperation(row)" v-if="row.status != 1">删除</Button>
              <Button type="error" size="small" style="margin-right: 5px" disabled v-else>删除</Button>
              <Button
                type="success"
                size="small"
                v-if="row.status == 0 || row.status == -1"
                @click="updateOperationStatus(row)"
              >上架</Button>
              <Button
                type="warning"
                size="small"
                v-if="row.status == 1"
                @click="underUpdateOperationStatus(row)"
              >下架</Button>
            </template>

            <template slot-scope="{ row }" slot="showType">
              <span v-if="row.showType == 1">广告</span>
              <span v-else-if="row.showType == 2">跳转内部页</span>
              <span v-else-if="row.showType == 3">跳转外部小程序</span>
              <span v-else-if="row.showType == 5">新人奖励</span>
            </template>

            <template slot-scope="{ row }" slot="status">
              <span v-if="row.status == 0" style="color:#2d8cf0">创建</span>
              <span v-else-if="row.status == 1" style="color:#19be6b">上架</span>
              <span v-else-if="row.status == -1" style="color:#ff9900">下架</span>
            </template>

            <template slot-scope="{ row }" slot="imgUrl">
              <img :src="row.imgUrl" style="width:74px;height:43px;" @click="showBigImg(row)">
            </template>
          </Table>
          <!-- 用户列表 -->
        </div>
        <!-- 分页器 -->
        <Row type="flex" justify="end" class="page">
          <Page
            :total="totalSize "
            show-total
            show-elevator
            :current="current"
            @on-change="changeCurrent"
          ></Page>
        </Row>
        <!-- 分页器 -->
      </Card>
    </div>
    <!-- 新增、编辑 -->
    <div v-if="addOperationPage">
      <add-operation
        @changeStatus="showStatus"
        :operationStatus="operationStatus"
        :operationItem="operationItem"
      ></add-operation>
    </div>
  </div>
</template>

<script>
  import addOperation from "./components/addOperation";
  import { postRequest, uploadFileRequest } from "@/libs/axios";
  import {
    getOperationList,
    editOperationStatus,
    delOperation,
    getMiniApp
  } from "@/api/sys";
  export default {
    components: {
      addOperation
    },
    name: "operation-management",
    data() {
      return {
        
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",
        columns8: [
          {
            title: "操作",
            align: "center",
            width: 240,
            fixed: "left",
            slot: "action"
          },
          {
            title: "appid",
            align: "center",
            width: 120,
            key: "appid",
            render: (h, params) => {
              let name = params.row.appid
              for (let i = 0; i < this.appIdData.length; i++) {
                if(this.appIdData[i].appid == params.row.appid) {
                  name = this.appIdData[i].appName
                }
              }
              return h("div",name);
            }
          },
          
          {
            title: "运营位类型",
            align: "center",
            minWidth: 100,
            key: "operationType",
            slot: "operationType"
            
          },
          {
            title: "标题",
            align: "center",
            minWidth: 140,
            key: "name"
          },
          {
            title: "运营图片",
            align: "center",
            width: 120,
            key: "imgUrl",
            slot: "imgUrl"
            
          },
          {
            title: "广告类型",
            align: "center",
            width: 140,
            key: "showType",
            slot: "showType"
            
          },
          {
            title: "运营状态",
            align: "center",
            width: 90,
            key: "status",
            slot: "status"
            
          },
          {
            title: "开始时间",
            align: "center",
            width: 170,
            key: "startDate"
          },
          {
            title: "结束时间",
            width: 165,
            align: "center",
            key: "endDate"
          },
          {
            title: "创建人",
            align: "center",
            minWidth: 80,
            key: "createBy"
          },
          {
            title: "创建时间",
            align: "center",
            minWidth: 105,
            key: "createTime"
          }
          
        ],
        columns9: [
          {
            title: "专题操作",
            align: "center",
            width: 240,
            fixed: "left",
            slot: "action"
          },
          // {
          //   title: "appid",
          //   align: "center",
          //   width: 120,
          //   key: "appid",
          //   render: (h, params) => {
          //     let name = params.row.appid
          //     for (let i = 0; i < this.appIdData.length; i++) {
          //       if(this.appIdData[i].appid == params.row.appid) {
          //         name = this.appIdData[i].appName
          //       }
          //     }
          //     return h("div",name);
          //   }
          // },
          {
            title: "标题",
            align: "center",
            minWidth: 100,
            key: "name",
          },
          {
            title: "内容ID",
            align: "center",
            minWidth: 80,
            key: "operationId",
          },
          {
            title: "终端",
            align: "center",
            minWidth: 80,
            key: "sourceName",
          },
          {
            title: "运营位类型",
            align: "center",
            minWidth: 100,
            key: "operationType",
            slot: "operationType"
            
          },
          {
            title: "已选专题",
            align: "center",
            minWidth: 100,
            key: "topicName"
          },
          {
            title: "运营位置",
            align: "center",
            minWidth: 140,
            key: "sortName"
          },
          {
            title: "运营图片",
            align: "center",
            width: 120,
            key: "imgUrl",
            slot: "imgUrl"
            
          },
          {
            title: "运营状态",
            align: "center",
            width: 90,
            key: "status",
            slot: "status"
            
          },
          {
            title: "开始时间",
            align: "center",
            width: 170,
            key: "startDate"
          },
          {
            title: "结束时间",
            width: 165,
            align: "center",
            key: "endDate"
          },
          {
            title: "创建人",
            align: "center",
            minWidth: 80,
            key: "createBy"
          },
          {
            title: "创建时间",
            align: "center",
            minWidth: 105,
            key: "createTime"
          }
          
        ],
        banner_list: [],
        shop_list: [],
        viewShopListDialog: false,
        bannerStatus: [
          {
            label: "创建",
            value: "0"
          },
          {
            label: "上架",
            value: "1"
          },
          {
            label: "下架",
            value: "-1"
          }
        ],
        

        searchData: {
          // 查询参数
          endDate: "",
          name: "",
          operationType: "",
          startDate: ""
        },
        current: 1,
        totalSize: 0, //总条数
        file: null,
        imgUrlHttp: "http://image/sweetmartmarketing.com/",
        big_Image_url: "",
        bigCamp_status: "",
        image_url: "",
        camp_status: "",
        bigImgDialog: false, //显示大图
        addOperationPage: false, //新增、编辑运营位
        operationStatus: 1, //1--新增、2--编辑
        operationItem: {}, //单条运营位
        // listStatus: 1, // 列表状态， 1：获取列表 2：搜索
        TableLoading: false, //列表加载动画
        appIdData: [], // appId数据
        warningDisplay:true,
      };
    },
    created: function() {
      // this.listStatus = 1;
      // this.getWebankOperationPage({});
      this.getMiniAppFn();
    },
    methods: {
      //子组件传参
      showStatus: function(e) {
        // console.log(e);
        this.searchData.operationType = e.operationType
        this.addOperationPage = e.type;
        // this.listStatus = 1;
        // this.getWebankOperationPage({});
        if(e.operationType != "") {
          this.queryTableList()
        }
      },

      // 获取小程序app
      getMiniAppFn() {
        getMiniApp().then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.appIdData = res.data;
            // console.log(this.appIdData);
          } else {
            this.msgErr("小程序appId获取失败");
          }
        });
      },

      // 查询
      queryTableList: function() {
        // this.banner_page_req.start = 0;
        // this.listStatus = 2;
        if(!this.searchData.operationType){
          this.msgErr('请选择运营位类型')
          return
        }
        this.current = 1;
        this.getWebankOperationPage(this.searchData);
        this.warningDisplay = false
      },
      //获取列表
      getWebankOperationPage: function(form) {
        this.TableLoading = true;
        getOperationList(form, this.current).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.banner_list = res.data.records;
            // this.banner_page_req.start = res.data.current; //分页查询起始记录
            this.totalSize = res.data.total; //列表总数
            // this.banner_page_req.limit = res.resultList.size;
            this.current = res.data.current; //分页查询起始记录

            this.TableLoading = false;
          } else {
            this.$Message.error(res.code + " 数据加载失败!", 3);
            this.TableLoading = false;
          }
        });
      },
      // 修改广告状态接口--上架
      updateOperationStatus(row) {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>确定要上架此条运营位吗？</p>",
          onOk: () => {
            editOperationStatus(row.operationId, 1).then(res => {
              if (res.code == 200) {
                this.msgOk("运营位上架成功");
                this.getWebankOperationPage(this.searchData);;
              } else {
                this.msgErr(res.msg);
              }
            });
            // this.postRequest('/operation/operation-info/editStatus', req).then((res)=> {
            //   if (res.code == "200") {
            //     this.$Message.success("运营位上架成功!", 3);
            //     this.getWebankOperationPage();
            //   } else if (res.code == "4010") {
            //     this.$Message.error(res.code + res.msg, 3);
            //   } else {
            //     this.$Message.error(res.code + res.msg, 3);
            //   }
            // })
          },
          onCancel: () => {
            this.msgOk("运营位上架已取消");
          }
        });
      },

      // 修改广告状态接口--下架
      underUpdateOperationStatus(row) {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>确定要下架此条运营位吗？</p>",
          onOk: () => {
            editOperationStatus(row.operationId, -1).then(res => {
              if (res.code == 200) {
                this.msgOk("运营位下架成功");
                this.getWebankOperationPage(this.searchData);;
              } else {
                this.msgErr(res.msg);
              }
            });
            // this.postRequest('/operation/operation-info/editStatus', req).then( (res)=> {
            //   if (res.code == "200") {
            //     this.$Message.success("运营位下架成功!", 3);
            //     this.getWebankOperationPage({});
            //   } else {
            //     this.$Message.error(res.code + res.msg, 3);
            //   }
            // })
          },
          onCancel: () => {
            this.msgOk("运营位下架已取消");
          }
        });
      },

      // 删除
      deleteOperation(row) {
        if (row.status == 1) {
          this.msgErr("请先下架运营位才能删除！");
          return;
        }
        this.$Modal.confirm({
          title: "提示",
          content: "<p>确定要删除此条运营位吗？</p>",
          onOk: () => {
            delOperation(row.operationId).then(res => {
              if (res.code == 200) {
                this.msgOk("删除成功");
                this.getWebankOperationPage(this.searchData);;
              } else {
                this.msgErr(res.msg);
              }
            });
            // this.postRequest('/operation/operation-info/delete', req).then( (res)=> {
            //   if (res.code == 200) {
            //     this.$Message.success("运营位删除成功!", 3);
            //     this.getWebankOperationPage();
            //   } else {
            //     this.$Message.error(res.code + res.msg, 3);
            //   }
            // })
          },
          onCancel: () => {
            this.msgOk("运营位删除已取消");
          }
        });
      },

      //新增广告
      addOperationFun: function() {
        this.addOperationPage = true;
        this.operationStatus = 1;
      },

      // 编辑广告
      updateBanner: function(row) {
        if (row.status == 1) {
          this.msgErr("请先下架运营位才能编辑！");
          return;
        }
        // let obj = {
        //   operationId: row.operationId
        // }
        // getOperationList(obj,this.current).then(res=> {
        //   if(res.code == 200) {
        this.addOperationPage = true;
        this.operationStatus = 2;
        this.operationItem = row
        // }else{
        //   this.msgErr(res.msg)
        // }
        // })
      },
      //广告类型
      changeBannerType: function(v) {
        this.add_banner.bannerType = v.value;
      },

      // 显示大图
      showBigImg: function(row) {
        // if (!this.banner_list[index].bigImgUrl) {
        //   if (this.banner_list[index].status === 1) {
        //     this.$Message.error("跳转小程序内部页!", 3);
        //   } else if (this.banner_list[index].status === 2) {
        //     this.$Message.error("跳转外部小程序!", 3);
        //   }
        // } else {
        //   this.bigImgDialog = true;
        //   this.big_Image_url = this.banner_list[index].bigImgUrl;
        // }
        if (row.operationType == "hp_window" || row.operationType == "yf_zt") {
          return;
        }
        this.bigImgDialog = true;
        this.big_Image_url = row.bigImgUrl;
      },
      bigImgCancel: function() {
        this.bigImgDialog = false;
      },

      //查询选择开始日期
      changeStartDate: function(v) {
        let time = v.slice(0, 10) + " " + "00:00:00";
        this.searchData.startDate = time;
        if (this.searchData.endDate) {
          if (
            Date.parse(this.searchData.startDate) >
            Date.parse(this.searchData.endDate)
          ) {
            this.msgErr("开始时间不可大于结束时间！");
            return;
          }
        }
      },
      // 查询选择结束日期
      changeEndDate: function(v) {
        let time = v.slice(0, 10) + " " + "23:59:59";
        this.searchData.endDate = time;
        if (this.searchData.startDate) {
          if (
            Date.parse(this.searchData.startDate) >
            Date.parse(this.searchData.endDate)
          ) {
            this.msgErr("结束时间不可小于开始时间！");
            return;
          }
        }
      },

      // 重置
      reset: function() {
        this.searchData.name = "";
        this.searchData.startDate = "";
        this.searchData.endDate = "";
        this.searchData.operationType = '';
        this.listStatus = 1;
      },
      // 分页
      // changePageSize: function (pageSize) {
      //   var self = this;
      //   self.banner_page_req.limit = pageSize;
      //   self.getWebankOperationPage();
      // },

      // 分页（点击第几页）
      changeCurrent: function(current) {
        // var self = this;
        // self.banner_page_req.start = current * self.banner_page_req.limit - self.banner_page_req.limit;
        this.current = current;
        // if (this.listStatus == 1) {
        //   this.getWebankOperationPage({});
        // } else if (this.listStatus == 2) {
        this.getWebankOperationPage(this.searchData);
        // }
      },
      viewShoplist: function(index) {
        var self = this;
        var list = self.banner_list[index].shop_list;
        self.shop_list = list;
        this.viewShopListDialog = true;
      },
      viewShopListCancel: function() {
        this.viewShopListDialog = false;
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
      // 下拉框清空数据
      optionChange() {
        this.banner_list = []
      },
      // 查看详情
      checkDetailsFn(row) {
        // this.detailsData = row
        // this.checkDetailsDisplay = true
        this.addOperationPage = true;
        this.operationStatus = 3;
        this.operationItem = row
      },
    }
  };
</script>

<style>
  .operation {
    margin-bottom: 2vh;
  }
  .select-count {
    font-size: 13px;
    font-weight: 600;
    color: #40a9ff;
  }
  .select-clear {
    margin-left: 10px;
  }
  .page {
    margin-top: 2vh;
  }
  .drop-down {
    font-size: 13px;
    margin-left: 5px;
  }
</style>
