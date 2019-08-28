
<template>
  <div class="search">
    <Card v-if="!basicSetPage && !grabInfoSetPage  ">
      <Tabs @on-click="changeTab" v-model="tab_model" value="57">
        <TabPane v-for="(item,index) in tabs" :label="item.lable" :name="item.value" :key="index"></TabPane>
      </Tabs>

      <div v-if=" tab_model=='57'">
        <Row>
          <!-- 搜索 -->
          <Form ref="search" :model="search" inline :label-width="120" style="display:inline-block;">
            <Form-item label="活动ID" :label-width="100">
              <Input
                type="text"
                v-model="search.campId"
                clearable
                placeholder="请输入活动ID"
                style="width: 200px"
              />
            </Form-item>
            <span v-if="drop">
              <Form-item label="优惠券模板ID" :label-width="100">
                <Input-number
                  type="text"
                  v-model="search.ticketTemplateId"
                  placeholder="请输入优惠券模板ID"
                  style="width: 200px"
                />
              </Form-item>
              <Form-item label="活动名称" :label-width="100">
                <Input
                  type="text"
                  v-model="search.name"
                  clearable
                  placeholder="请输入活动名称"
                  style="width: 200px"
                />
              </Form-item>
              <!-- <Form-item label="活动标签" :label-width="100">

                <Select v-model="search.label" placeholder="请选择" style="width: 200px">
                  <Option v-for="(item, index) in templatelist" :key="index" :value="item.dictValue">{{item.dictLabel}}</Option>
                </Select>
              </Form-item> -->
              <Form-item label="是否限抢券" :label-width="100">
                <Select v-model="search.isLimitGrap" placeholder="请选择" style="width: 200px">
                  <Option value="0">否</Option>
                  <Option value="1">是</Option>
                </Select>
              </Form-item>
              <Form-item label="优惠券类型" :label-width="100">
                <Select v-model="search.couponType" placeholder="请选择" style="width: 200px">
                  <Option value="1">换购券</Option>
                  <Option value="2">商品券</Option>
                  <Option value="3">折扣券</Option>
                  <Option value="4">全场券</Option>
                  <Option value="5">赠品券</Option>
                </Select>
              </Form-item>
              <Form-item label="状态" :label-width="100">
                <Select v-model="search.status" placeholder="请选择" style="width: 200px">
                  <Option :value="0">创建</Option>
                  <Option :value="1">上架</Option>
                  <Option :value="-1">下架</Option>
                </Select>
              </Form-item>


            <Form-item label="投放渠道" :label-width="100">
                <Select v-model="search.sendChannel" placeholder="请选择" style="width: 200px">
               <Option v-for="item in res_list" :value="item.dictValue" :key="item.id">{{ item.dictLabel }}</Option>
                </Select>
              </Form-item>


            </span>
            <Button type="primary" icon="ios-search" @click="queryTableList">搜索</Button>
            <Button icon="md-refresh" style="margin-left:5px" @click="resetting">重置</Button>
            <a class="drop-down" @click="dropDown">
              {{dropDownContent}}
              <Icon :type="dropDownIcon"></Icon>
            </a>
          </Form>
          <!-- 搜索 -->
        </Row>
        <Row class="operation">
          <Button type="primary" icon="md-add" @click="addInfo()">新增</Button>
          <Button @click="refresh" icon="md-refresh">刷新</Button>
        </Row>

        <Row>
          <Table  :loading="TableLoading"     border   :columns="tableColumns"   :data="table_list"  sortable="custom"  ref="table"  >


         <template slot-scope="{ row }" slot="couponImg">
              <img :src="row.couponImg" style="width:74px;height:43px;" >
            </template>

            <template slot-scope="{ row }" slot="ChangeStart">
            <span v-if="row.changeDateType ==0"> {{row.changeStartDate}}</span>
              <span  v-if="row.changeDateType ==1"> 发券后+{{row.changeStart}}天开始兑换</span>
            </template>


            <template slot-scope="{ row }" slot="ChangeEnd">
               <span  v-if="row.changeDateType ==0"> {{row.changeEndDate}}</span>
              <span v-if="row.changeDateType ==1"> 发券后+{{row.changeEnd}}天结束兑换</span>
            </template>



            <template slot-scope="{ row }" slot="imgUrl">
               <Tooltip content="点击可查看大图 " placement="right">
              <img :src="row.imgUrl" style="width:74px;height:43px;" @click="showBigImg(row)">
               </Tooltip>
            </template>


           <template slot-scope="{ row }" slot="getrules">
            <span style="width: 150px;display: block;white-space:nowrap;overflow: hidden;text-overflow:ellipsis;">{{row.rules}}</span>


            </template>

             <template slot-scope="{ row }" slot="getcouponValueDesc">
            <span style="width: 150px;display: block;white-space:nowrap;overflow: hidden;text-overflow:ellipsis;">{{row.couponValueDesc}}</span>
            </template>

           <template slot-scope="{ row }" slot="getdoorsillDesc">
             <span style="width: 150px;display: block;white-space:nowrap;overflow: hidden;text-overflow:ellipsis;">{{row.doorsillDesc}}</span>
            </template>


          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page
            :total="totalSize"
            show-total
            show-elevator
            @on-change="changeCurrent"
            style="float: right"
            :current="pageNum"
          ></Page>
        </Row>
      </div>

      <div style="margin-top: 15px;" v-if=" tab_model!='57'">
        <Form :model="add_info" ref="add_info" :label-width="180">
          <FormItem label="appid" required>
            <Select
              v-model="add_info.appid"
              style="width:300px"
              placeholder="请输入选择appid"
              @on-change="statusCheckChange"
            >
              <Option
                v-for="item in appId_info"
                :value="item.appid"
                :key="item.appid"
              >{{ item.appName }}</Option>
            </Select>
          </FormItem>

          <FormItem label="活动类型" required>
            <Select v-model="add_info.campType" style="width:300px" disabled>
              <Option value="57">领优惠</Option>
              <Option value="62">要优惠</Option>
              <!-- <Option value="63">领优惠分享奖励</Option> -->
              <Option value="64">要优惠参与奖励（接受分享/参团）</Option>
            </Select>
          </FormItem>

          <FormItem label="优惠券类型" required>
            <Select
              v-model="add_info.couponType"
              style="width:300px"
              placeholder="请输入选择优惠券类型"
              @on-change="statusCheckChange"
              disabled
            >
              <Option value="1">换购券</Option>
              <Option value="2">商品券</Option>
              <Option value="3">折扣券</Option>
              <Option value="4">全场券</Option>
              <Option value="5">赠品券</Option>
            </Select>
          </FormItem>

          <FormItem label="活动标题" required>
            <Input
              type="text"
              v-model="add_info.name"
              style="width:300px"
              placeholder="请输入活动标题"
              @on-change="statusCheckChange"
            />
          </FormItem>

          <FormItem label="使用门槛描述" required>
            <Input
              type="textarea"
              v-model="add_info.doorsillDesc"
              style="width:300px"
              @on-change="statusCheckChange"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="请填写使用门槛描述"
            />
          </FormItem>

          <FormItem label="有效期类型" required>
            <Select
              v-model="add_info.dateType"
              style="width:300px"
              placeholder="请选择有效期类型"
              @on-change="statusCheckChange"
              disabled
            >
              <Option value="2">永久有效</Option>
            </Select>
          </FormItem>

          <FormItem label="优惠券缩略图" required>
        <!-- <FormItem label="优惠券详情图"> -->
            <div
              style=" float: left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
              v-for="(item, index) in uploadList1"
              :key="index"
            >
              <img :src="item.url" style="width:100%">
            </div>
            <div style="display: inline-block;">
              <Upload
                ref="upload"
                :defaultList="uploadList1"
                type="drag"
                :format="['jpg','jpeg','png','bmp']"
                :on-success="handleSuccess1"
                :action="url"
                accept="image"
                :max-size="1024"
                :headers="userToken"
                style="display: inline-block;width:90px;"
                @on-change="statusCheckChange"
              >
                <div style="width: 90px;height:90px;line-height: 90px;">
                  <Icon type="ios-camera" size="20"/>
                </div>
              </Upload>
              <p>选择优惠券缩略图 (不大于1M, JPG/PNG/JPEG/BMP）</p>
            </div>
          </FormItem>

          <FormItem label="优惠券详情图" required>
        <!-- <FormItem label="优惠券详情图"> -->
            <div
              style=" float: left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
              v-for="(item, index) in uploadList"
              :key="index"
            >
              <img :src="item.url" style="width:100%">
            </div>
            <div style="display: inline-block;">
              <Upload
                ref="upload"
                :defaultList="uploadList"
                type="drag"
                :format="['jpg','jpeg','png','bmp']"
                :on-success="handleSuccess"
                :action="url"
                accept="image"
                :max-size="1024"
                :headers="userToken"
                style="display: inline-block;width:90px;"
                @on-change="statusCheckChange"
              >
                <div style="width: 90px;height:90px;line-height: 90px;">
                  <Icon type="ios-camera" size="20"/>
                </div>
              </Upload>
              <p>选择优惠券详情图 (不大于1M, JPG/PNG/JPEG/BMP）</p>
            </div>
          </FormItem>

          <FormItem label="优惠券模板" required>
            <Button
              type="dashed"
              @click="resInfo"
              :style="{width:'150px'}"
              @on-change="statusCheckChange"
            >选择模版</Button>

            <Tag
              checkable
              color="error"
              v-if="add_info.ticketTemplateId"
              style="margin-left: 3%"
            >已选择</Tag>
          </FormItem>

          <FormItem v-if="add_info.ticketName">
            <Alert style="width:500px">
              <Row>模版ID：{{add_info.ticketTemplateId}}</Row>
              <Row>模版名称：{{add_info.ticketName}}</Row>
            </Alert>
          </FormItem>

          <FormItem label="活动/领券规则" required>
            <Input
              type="textarea"
              v-model="add_info.rules"
              style="width:300px"
              @on-change="statusCheckChange"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="请填写活动/领券规则"
            />
          </FormItem>

          <FormItem label="券使用说明">
            <Input
              type="textarea"
              v-model="add_info.useDesc"
              style="width:300px"
              :autosize="{minRows: 2,maxRows: 5}"
              @on-change="statusCheckChange"
            />
          </FormItem>

          <FormItem label="状态" required placeholder="请选择状态">
            <Select v-model="add_info.status" style="width:300px" @on-change="statusCheckChange">
              <Option value="0">创建</Option>
              <Option value="1">上架</Option>
              <Option value="-1">下架</Option>
            </Select>
          </FormItem>

          <FormItem label="拼团设置" required v-if="add_info.campType ==62 && add_info.campId">
            <Button
              type="dashed"
              @click="groupInfo(add_info.campId)"
              :style="{width:'150px'}"
              @on-change="statusCheckChange"
            >拼团设置</Button>
          </FormItem>

          <FormItem style="{'margin-top':'54px'}">
            <Button
              type="primary"
              @click="campagin_add()"
              :loading="add_loading"
              style="width:150px;"
              :disabled="isCheckDisabled"
            >保存</Button>
          </FormItem>
        </Form>
        <!--分享奖励配置-->
        <Form v-if="formShareModal.shareData.length&&tab_model!=64" ref="shareModal" :model="formShareModal" :label-width="180" style="margin-top:20px">
          <FormItem v-for="item in formShareModal.shareData" :key="item.id" :label="item.name" required>
            <span v-if="item.name!= '倍数'&&item.name!= '上限'">&nbsp;优惠面额  X</span>
            <InputNumber
                    :disabled="item.name=='分享奖励'"
                    :min="item.name== '倍数'?1:0"
                    :step="1"
                    type="text"
                    v-model="item.value"
                    placeholder="请输入"
                    style="width:320px"
            ></InputNumber>
            <span v-if="item.name== '上限'">&nbsp;&nbsp;U贝</span>
            <span v-if="item.name== '倍数'">&nbsp;倍</span>
            <span v-if="item.name!= '倍数'&&item.name!= '上限'">&nbsp;&nbsp;%</span>
          </FormItem>
          <FormItem>
            <Button style="float: left;" type="primary" @click="shareSave('shareModal')">保存</Button>

          </FormItem>
        </Form>

      </div>
    </Card>

    <Modal v-model="res_Modal_show" width="700" title="选择模版">
      <Form :model="res_info" ref="res_info" :label-width="100" :styles="{top: '10px'}">
        <Table
          border
          ref="selection"
          :columns="res_columns"
          :data="res_list"
          size="small"
          height="300"
        ></Table>
      </Form>

      <div slot="footer">
        <Button type="text" @click="res_Modal_show=false">取消</Button>
        <Button type="primary" @click="resOk" :loading="res_loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="bigImgDialog" title="查看大图" width="600" @on-cancel="bigImgCancel">
      <img style="width: 100%" :src="big_Image_url">
    </Modal>

    <!-- 领优惠基础设置 -->
    <div v-if="basicSetPage">
      <basicSet @changeStatus="showbasicSetStatus" :camp_Info="camp_Info"></basicSet>
    </div>

    <!-- 要优惠拼团设置 -->
    <div v-if="grabInfoSetPage">
      <grabInfoSet :campId="campId" @changeStatus="showGgrabInfoSet"></grabInfoSet>
    </div>

    <!-- 查看详情对话框 -->
    <Modal v-model="detailsDisplay" title="查看详情" width="960">
      <div v-if="detailsDisplay">
        <detailsView @changeStatus="showdetailsView" :camp_Info="camp_Info3"></detailsView>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看详情对话框 -->
  </div>
</template>

<script>
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from "@/libs/axios";

import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";

import { formatDate } from "@/libs/date";

import basicSet from "./BasicSet";

import grabInfoSet from "./grabInfoSet";

import detailsView from "./detailsView";

export default {
  name: "campagin",
  components: {
    basicSet,
    grabInfoSet,
    detailsView
  },
  data() {
    return {
        formShareModal:{
            shareData:[]
        },
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      // 搜索form
      search: {
        campId: "", // 活动ID
        ticketTemplateId: null, // 订单模板ID
        name: "", // 活动名称
        label: "", // 活动标签
        isLimitGrap: "", // 是否限抢券：0.否；1.是
        couponType: "", //优惠券类型：1.全场满减现金券；2.单品立减；3.组合立减；4.商品满减券；5.折扣券；6.赠品券；7.换购券；
        status: "", // 状态
        campType: "",
        // startDate: "", // 开始时间
        // endDate: "" // 结束时间
        sendChannel: ""
      },
      res_list: [],
      templatelist: [], // 活动标签列表 （搜索用）
      searchType: "1", // 分页状态 1：初始化列表，2：搜索列表
      tab_model: "57",
      basicSetPage: false,
      grabInfoSetPage: false,
      campaginGrabInfoPage: false,
      campId: "",
      camp_Info: {},
      camp_Info3: {},

      // searchItem: {
      //   name: "",
      //   type: "",
      //   status: "",
      //   startDate: "",
      //   endDate: ""
      // },
      bigImgDialog: false,
      big_Image_url: "",
      current: 1,
      totalSize: 0, //总条数
      pageNum: 1, //开始条数
      limit: 10, //每页记录数
      TableLoading: false,
      table_list: [],
      self: this,

      editCampaginPage: false,
      campaginEdit_info: {},

      tableColumns: [
        {
          title: "appid",
          key: "appid",
          width: 200,
          align: "center"
        },
        {
          title: "活动ID",
          key: "campId",
          width: 200,
          align: "center"
        },

        {
          title: "活动名称",
          key: "name",
          width: 200,
          align: "center"
        },

        {
          title: "优惠券模板ID",
          key: "ticketTemplateId",
          width: 200,
          align: "center"
        },

        {
          title: "活动类型",
          key: "campType",
          width: 200,
          align: "center",

          render: (h, params) => {
            const row = params.row;
            const color =
              row.campType === 57
                ? "red"
                : row.campType === 62
                  ? "volcano"
                  : row.campType === 63 ? "green" : "blue";
            const text =
              row.campType === 57
                ? "领优惠"
                : row.campType === 62
                  ? "要优惠"
                  : row.campType === 63
                    ? "领优惠分享奖励"
                    : "要优惠参与奖励（接受分享/参团）";
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "优惠券类型",
          key: "couponType",
          width: 200,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.couponType === 1
                ? "red"
                : row.couponType === 2
                  ? "cyan"
                  : row.couponType === 3
                    ? "green"
                    : row.couponType === 4 ? "blue" : "purple";
            const text =
              row.couponType === 1
                ? "换购券"
                : row.couponType === 2
                  ? "商品券"
                  : row.couponType === 3
                    ? "折扣券"
                    : row.couponType === 4 ? "全场券" : "赠品券";

            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },

        {
          title: "活动时间类型",
          key: "dateType",
          width: 200,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color = row.dateType === 0 ? "red" : "red";
            const text =
              row.dateType === 0
                ? "固定日期时间范围有效"
                : "固定日期时间范围有效";

            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },

        {
          title: "投放渠道",
          key: "sendChannel",
          width: 200,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.sendChannel === 1
                ? "red"
                : row.sendChannel === 2
                  ? "cyan"
                  : row.sendChannel === 3
                    ? "green"
                    : row.sendChannel === 4
                      ? "blue"
                      : row.sendChannel === 5 ? "yellow" : "purple";
            const text =
              row.sendChannel === 1
                ? "领优惠列表"
                : row.sendChannel === 2
                  ? "拉新奖励"
                  : row.sendChannel === 3
                    ? "签到奖励"
                    : row.sendChannel === 4
                      ? "领优惠分享领用奖励"
                      : row.sendChannel === 5
                        ? "要优惠领优惠领券抽奖奖励"
                        : "新人奖励";

            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },

        {
          title: "开始时间",
          key: "startDate",
          width: 200,
          align: "center"
        },
        {
          title: "结束时间",
          key: "endDate",
          width: 200,
          align: "center"
        },
        {
          title: "兑换类型",
          key: "ChangeDateType",
          width: 200,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color = row.changeDateType === 0 ? "red" : "blue";
            const text =
              row.changeDateType === 0
                ? "固定时间兑换"
                : "发券后+X天后开始兑换";

            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },

        {
          title: "兑换开始时间",
          key: "ChangeStart",
          width: 200,
          align: "center",
          slot: "ChangeStart"
        },

        {
          title: "兑换结束时间",
          key: "ChangeEnd",
          width: 200,
          align: "center",
          slot: "ChangeEnd"
        },
        {
          title: "优惠券缩略图",
          width: 200,
          align: "center",
          key: "couponImg",
          slot: "couponImg"
        },
        {
          title: "优惠券详情图",
          width: 200,
          align: "center",
          key: "imgUrl",
          slot: "imgUrl"
        },

        {
          title: "状态",
          key: "status",
          width: 200,

          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.status === 0 ? "green" : row.status === 1 ? "blue" : "red";
            const text =
              row.status === 0 ? "创建" : row.status === 1 ? "上架" : "下架";

            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },

        {
          title: "活动/领券规则",
          key: "rules",
          width: 200,
          align: "center",
          slot: "getrules"
        },
        {
          title: "优惠面额描述",
          key: "couponValueDesc",
          width: 200,
          align: "center",
          slot: "getcouponValueDesc"
        },

        {
          title: "使用门槛描述",
          key: "doorsillDesc",
          width: 200,
          align: "center",
          slot: "getcouponValueDesc"
        },

        // {
        //   title: "券使用说明",
        //   key: "useDesc",
        //   width: 200,
        //   align: "center"
        // },

        {
          title: "操作",
          key: "action",
          fixed: "left",
          align: "center",
          width: 230,
          render: (h, params) => {
            //  cyan purple
            const row = params.row;
            var color = "";
            var text = "";
            if (row.status == 0) {
              color = "#19be6b";
              text = "上架";
            } else if (row.status == 1) {
              color = "red";
              text = "下架";
            } else if (row.status == -1) {
              color = "#19be6b";
              text = "上架";
            }
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    display: params.row.status == 1 ? "none" : "inline-block",
                    color: "#5cadff"
                  },
                  on: {
                    click: () => {
                      this.editInfo(params.row);
                    }
                  }
                },
                "编辑"
              ),

              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: color
                  },
                  on: {
                    click: () => {
                      this.changeStatus(params.row);
                    }
                  }
                },
                text
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    display: params.row.status == 1 ? "none" : "inline-block",
                    color: "#ff3300"
                  },
                  on: {
                    click: () => {
                      this.removeInfo(params.row);
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#2db7f5"
                  },
                  on: {
                    click: () => {
                      this.detailsDisplayFn(params.row);
                    }
                  }
                },
                "查看详情"
              )
            ]);
          }
        }
      ],

      tabs: [
        {
          lable: "领优惠",
          value: "57"
        },
        {
          lable: "要优惠",
          value: "62"
        },
        // {
        //   lable: "领优惠分享奖励",
        //   value: "63"
        // },
        {
          lable: "要优惠参与奖励",
          value: "64"
        }
      ],

      changeTabValue: "",
      add_info: {
        appid: "",
        campId: "",
        campType: "57",
        couponType: "",
        couponValueDesc: "",
        dateType: "2",
        doorsillDesc: "",
        endDate: "",
        imgUrl: "",
        couponImg: "", // 缩略图
        name: "",
        rules: "",
        startDate: "",
        status: "0",
        ticketTemplateId: "",
        useDesc: ""
      },

      imgUrl: "",
      url: uploadOperationImage2AliOssURl,
      uploadList: [],
      uploadList1: [],
      userToken: "",
      pageStatus: "",

      add_loading: false,
      getUrl: "",
      msg: "",
      appId_info: [],
      codeList: [],

      res_Modal_show: false,
      res_loading: false,
      res_list: [],
      res_info: {},

      chooseResArray: [],
      isCheckDisabled: true,
      currentChooseID: "",
      currentChooseName: "",
      res_columns: [
        {
          title: "选择",
          key: "ticketTemplateID",
          width: 70,
          align: "center",
          render: (h, params) => {
            let ticketTemplateID = params.row.ticketTemplateID;
            let ticketName = params.row.ticketName;
            let flag = false;
            if (this.currentChooseID === ticketTemplateID) {
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
                    self.currentChooseID = ticketTemplateID;
                    self.currentChooseName = ticketName;
                    self.chooseResArray = params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: "sheetID",
          key: "sheetID",
          align: "center"
        },
        {
          title: "模版ID",
          key: "ticketTemplateID",
          align: "center"
        },
        {
          title: "模版名称",
          key: "ticketName",
          align: "center"
        },
        {
          title: "ticketKind",
          key: "ticketKind",
          align: "center"
        }
      ],

      grabInfoSetStatus: false,
      // couponTypeDisabled: false
      detailsDisplay: false // 查看详情对话框
    };
  },

  created: function() {
    this.userToken = { jwttoken: localStorage.getItem("jwttoken") };
  },
  methods: {
    init() {
      this.searchType = 1;
      this.updateTableList();
      this.getAppId();
      this.getActivity();
      this.getchannel();
    },
      share(code){
          console.log(111);
          if(!code){
            return;
        }
          this.formShareModal.shareData = [];
          postRequest('/commonConfig/queryConfigByCode',{
                  code:code
              }
          ).then(res => {
              if (res.code == 200) {
                  if(res.data||res.data.noOverallCommonConfigList){
                      this.formShareModal.shareData = res.data.noOverallCommonConfigList||[];
                      this.formShareModal.shareData.forEach(function(v){
                          v.value = Number(v.value)||0;
                          if(v.name=='分享奖励'){
                              v.value=0;
                          }
                      })
                      this.shareDisplay = true;
                  }else{
                      this.$Message.error('未查询到数据');
                  }
              } else {
                  this.$Message.error(res.msg);
              }
          });
      },
      shareSave(name){
          let canSave = true;
          let msg = ''
          this.formShareModal.shareData.forEach(function(v){
              v.createTime = null;
              v.updateTime = null;
              v.updateBy = null;
              if(!v.value&&v.value!==0){
                  canSave = false
                  msg='请输入完整表单'
              }
              if(v.name=='倍数'&&v.value<1){
                  canSave = false
                  msg='请输入大于等于1的倍数'
              }
          })
          if(!canSave){
              this.$Message.error('请输入完整表单');
              return;
          }
          postRequest(
              "/commonConfig/updateConfigBatch",
              {"noOverallCommonConfigList":this.formShareModal.shareData}
          ).then(res => {
              if (res.code == 200) {
                  //this.formCustom.remark='';
                  this.$Message.success('保存成功')
              } else {
                  this.$Message.error(res.msg);
              }
          });
      },

    //获取投放渠道
    getchannel() {
      const reqParams = {
        dictCode: "send_channel"
      };

      postRequest(
        "/system/sys-dict-data/list?pageNum=" +
          this.pageNum +
          "&pageSize=" +
          this.limit,
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.res_list = res.data.records;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    // 切换tab
    changeTab(obj) {
      console.log(obj);
      this.tab_model = obj;

      this.Status = "";
      this.chooseResArray = [];
      this.grabInfoSetStatus = false;
      console.log(this.add_info.campType);
      switch (obj) {
        case "57":
          this.add_info.campType = "57";
          this.add_info.couponType = "";

          // this.couponTypeDisabled = false;

          break;
        case "62":
          this.add_info.campType = "62";
          this.add_info.couponType = "2";

          this.add_info.dateType = "2";
          // this.share();
          // this.couponTypeDisabled = true;
          break;
        case "63":
          this.add_info.campType = "63";
          this.add_info.couponType = "4";

          this.add_info.dateType = "2";
          // this.couponTypeDisabled = true;
          break;
        case "64":
          this.add_info.campType = "64";
          this.add_info.couponType = "4";

          this.add_info.dateType = "2";
          // this.couponTypeDisabled = true;
          break;
      }

      this.updateTableList();
    },

    //获取活动标签(搜索用)
    getActivity() {
      const reqParams = {
        dictCode: "campLabel"
      };

      postRequest(
        "/system/sys-dict-data/list?pageNum=1&pageSize=10",
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.templatelist = res.data.records;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    //	刷新页面
    refresh() {
      this.searchType = 1;
      this.updateTableList();
    },

    //搜索
    queryTableList() {
        this.pageNum = 1;
      // console.log(this.search);
      this.searchType = 2;
      this.updateTableList(this.search);
    },

    // 重置
    resetting() {
      this.search.campId = "";
      this.search.ticketTemplateId = null;
      this.search.name = "";
      this.search.label = "";
      this.search.isLimitGrap = "";
      this.search.couponType = "";
      this.search.status = "";
      this.search.sendChannel = "";
      this.updateTableList();
    },

    //分页
    changeCurrent(current) {
      this.pageNum = current;
      this.updateTableList();
    },

    updateTableList() {
      this.TableLoading = true;

      const reqParams = {
        campId: this.search.campId,
        ticketTemplateId: this.search.ticketTemplateId,
        name: this.search.name,
        label: this.search.label,
        isLimitGrap: this.search.isLimitGrap,
        couponType: this.search.couponType,
        status: this.search.status,
        campType: this.add_info.campType,
        sendChannel: this.search.sendChannel
      };

      postRequest(
        "/campagin/list?pageNum=" + this.pageNum + "&pageSize=" + this.limit,
        reqParams
      ).then(res => {
          console.log(111);
          this.TableLoading = false;
        if (res.isSuccess) {
            if(this.add_info.campType == 62){
                this.share(res.data.records[0].campId)
            }
          if (this.add_info.campType == 57) {
            this.totalSize = res.data.total;
            this.table_list = res.data.records;
            this.pageStatus = "edit";
          } else if (
            this.add_info.campType != 57 &&
            res.data.records.length != 0
          ) {
            this.uploadList = [{ url: res.data.records[0].imgUrl }];
            this.uploadList1 = [{ url: res.data.records[0].couponImg }];
            this.add_info.appid = res.data.records[0].appid;
            this.add_info.campId = res.data.records[0].campId;
            this.add_info.name = res.data.records[0].name;
            this.add_info.rules = res.data.records[0].rules.replace(
              /\\n/g,
              "\n"
            );

            this.add_info.doorsillDesc = res.data.records[0].doorsillDesc.replace(
              /\\n/g,
              "\n"
            );

            this.add_info.imgUrl = res.data.records[0].imgUrl;
            this.add_info.couponImg = res.data.records[0].couponImg;

            this.add_info.campType =
              res.data.records[0].campType == 57
                ? "57"
                : res.data.records[0].campType == 62
                  ? "62"
                  : res.data.records[0].campType == 63 ? "63" : "64";

            this.add_info.couponType =
              res.data.records[0].couponType == 1
                ? "1"
                : res.data.records[0].couponType == 2
                  ? "2"
                  : res.data.records[0].couponType == 3
                    ? "3"
                    : res.data.records[0].couponType == 4 ? "4" : "5";

            this.add_info.status =
              res.data.records[0].status == 0
                ? "0"
                : res.data.records[0].status == 1 ? "1" : "-1";

            this.add_info.dateType =
              res.data.records[0].dateType == 2 ? "2" : "2";
            this.add_info.startDate = res.data.records[0].startDate || "";
            this.add_info.endDate = res.data.records[0].endDate || "";

            this.add_info.useDesc = res.data.records[0].useDesc.replace(
              /\\n/g,
              "\n"
            );
            this.add_info.ticketName = res.data.records[0].ticketName;
            this.add_info.ticketTemplateId =
              res.data.records[0].ticketTemplateId;
            // this.add_info.couponValueDesc = res.data.records[0].couponValueDesc
            //   .replace("￥", "")
            //   .replace("券", "");
            this.add_info.couponValueDesc = "";

            if (this.grabInfoSetStatus == true) {
              this.groupInfo(this.add_info.campId);
            }
            this.pageStatus = "edit";
          } else {
            this.add_info = {
              appid: "",
              campId: "",
              couponValueDesc: "",
              doorsillDesc: "",
              imgUrl: "",
              couponImg: "", // 缩略图
              name: "",
              rules: "",
              status: "0",
              ticketTemplateId: "",
              dateType: "2",
              endDate: "",
              startDate: "",
              useDesc: ""
            };
            this.uploadList = [];
            this.pageStatus = "add";
            switch (reqParams.campType) {
              case "57":
                this.add_info.campType = "57";
                this.add_info.couponType = "";

                break;
              case "62":
                this.add_info.campType = "62";
                this.add_info.couponType = "2";

                this.add_info.dateType = "2";

                break;
              case "63":
                this.add_info.campType = "63";
                this.add_info.couponType = "4";

                this.add_info.dateType = "2";

                break;
              case "64":
                this.add_info.campType = "64";
                this.add_info.couponType = "4";

                this.add_info.dateType = "2";

                break;
            }
          }
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    //删除

    removeInfo(item) {
      const self = this;

      this.$Modal.confirm({
        title: "删除确认",
        content: `删除后不可恢复，是否继续删除？`,
        onOk: function() {
          const reqParams = {
            campId: item.campId
          };

          postRequest("/campagin/delete?campId=" + item.campId, reqParams).then(
            res => {
              self.loading = false;

              if (res.code == "200") {
                self.$Message.info("删除成功！");

                setTimeout(() => {
                  self.pageNum = 1;
                  self.updateTableList();
                }, 1200);
              } else {
                self.$Message.error(res.msg);
              }
            }
          );
        },
        onCancel: () => {
          self.$Message.info("点击了取消");
        }
      });
    },

    addInfo() {
      this.setStore("camp_pageStatus", "add");
      this.basicSetPage = true;
    },

    editInfo(item) {
      this.setStore("camp_pageStatus", "edit");

      this.camp_Info = item;
      this.basicSetPage = true;
    },

    showbasicSetStatus(e) {
      this.basicSetPage = e;
      this.updateTableList();
    },

    //更改列表上下架
    changeStatus(item) {
      const self = this;

      let new_status = "";

      // console.log(item);
      // return

      switch (item.status) {
        case 0:
          new_status = "1";
          break;
        case 1:
          new_status = "-1";
          break;
        case -1:
          new_status = "1";
          break;
        case "0":
          new_status = "1";
          break;
        case "1":
          new_status = "-1";
          break;
        case "-1":
          new_status = "1";
          break;
      }

      this.$Modal.confirm({
        title: "更改状态",
        content: `是否继续更改状态？`,

        onOk: function() {
          const reqParams = {
            campId: item.campId,
            status: new_status
          };

          postRequest(
            "/campagin/updStatus/?campId=" +
              item.campId +
              "&status=" +
              new_status,
            reqParams
          ).then(res => {
            self.loading = false;

            if (res.code == "200") {
              self.$Message.info("更改状态成功！");

              setTimeout(() => {
                self.pageNum = 1;
                self.updateTableList();
              }, 1200);
            } else {
              self.$Message.error(res.msg);
            }
          });
        },
        onCancel: () => {
          self.$Message.info("点击了取消");
        }
      });
    },

    showBigImg(row) {
      this.bigImgDialog = true;
      this.big_Image_url = row.imgUrl;
    },
    bigImgCancel() {
      this.bigImgDialog = false;
    },

    statusCheckChange() {
      this.isCheckDisabled = false;
    },

    //保存
    campagin_add() {
      if (this.add_info.name == "") {
        this.$Message.error("请填写活动标题");
        return;
      }
      if (this.add_info.appid == "") {
        this.$Message.error("请选择appid");
        return;
      }

      if (this.add_info.rules == "") {
        this.$Message.error("请填写活动/领券规则");
        return;
      }
      if (this.add_info.doorsillDesc == "") {
        this.$Message.error("请填写使用门槛描述");
        return;
      }

      if (this.add_info.couponImg == "") {
        this.$Message.error("请上传优惠券缩略图");
        return;
      }
      if (this.add_info.imgUrl == "") {
        this.$Message.error("请上传优惠券详情图");
        return;
      }
      if (this.add_info.ticketTemplateId == "") {
        this.$Message.error("请选择优惠券模板");
        return;
      }

      if (this.pageStatus === "add") {
        this.getUrl = "/campagin/add";
        this.add_info.campId = "";
        this.msg = "新增成功";
      } else {
        this.getUrl = "/campagin/edit/" + this.add_info.campId;
        this.msg = "编辑成功";
      }
      // const reqParams = this.add_info;
      const reqParams = {
        appid: this.add_info.appid,
        campId: this.add_info.campId,
        campType: this.add_info.campType,
        couponType: this.add_info.couponType,
        couponValueDesc: this.add_info.couponValueDesc,
        dateType: this.add_info.dateType,
        doorsillDesc: this.add_info.doorsillDesc
          .replace(/\t/g, "")
          .replace(/\n/g, "\\n"),
        endDate: this.add_info.endDate,
        imgUrl: this.add_info.imgUrl,
        couponImg: this.add_info.couponImg, // 缩略图
        name: this.add_info.name,
        rules: this.add_info.rules.replace(/\t/g, "").replace(/\n/g, "\\n"),
        startDate: this.add_info.startDate,
        status: this.add_info.status,
        ticketName: this.add_info.ticketName,
        ticketTemplateId: this.add_info.ticketTemplateId,
        useDesc: this.add_info.useDesc.replace(/\t/g, "").replace(/\n/g, "\\n")
      };
      //this.add_info;

      // reqParams.useDesc = reqParams.useDesc.replace(/\n/g, "\n");

      // console.log(reqParams);
      // return

      this.add_loading = true;
      postRequest(this.getUrl, reqParams).then(res => {
        this.add_loading = false;
        this.isCheckDisabled = true;
        if (res.code == 200) {
          this.$Message.info(this.msg);
          if (this.add_info.campType == "62") {
            this.grabInfoSetStatus = true;
          }
          setTimeout(() => {
            this.updateTableList();
          }, 1200);
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    //拼团设置start--------------------------------
    groupInfo(item) {
      this.$Modal.confirm({
        title: "设置拼团",
        content: "<p>是否设置要优惠拼团</p>",
        onOk: () => {
          this.campId = item;
          this.basicSetPage = false;
          this.grabInfoSetPage = true;

          this.campaginGrabInfoPage = false;
        },
        onCancel: () => {}
      });
    },
    showGgrabInfoSet(e) {
      this.grabInfoSetPage = e;
    },
    // 拼团设置end--------------------------------

    //上传图片
    handleSuccess(res, file) {
      if (res.code == 200) {
        this.add_info.imgUrl = res.image_url;

        if (this.uploadList.length == 0) {
          let obj = {
            url: res.image_url
          };
          this.uploadList.push(obj);
        } else {
          this.uploadList[0].url = res.image_url;
        }

        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
      this.statusCheckChange();
    },

    handleSuccess1(res, file) {
      if (res.code == 200) {
        this.add_info.couponImg = res.image_url;

        if (this.uploadList1.length == 0) {
          let obj = {
            url: res.image_url
          };
          this.uploadList1.push(obj);
        } else {
          this.uploadList1[0].url = res.image_url;
        }

        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
      this.statusCheckChange();
    },

    //获取APPid
    getAppId() {
      getRequest("/miniapp/miniapp-info/store").then(res => {
        if (res.code == 200) {
          this.appId_info = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    // 选择模版start--------------------------------
    resInfo() {
      this.res_Modal_show = true;
      this.res_info.ticketTemplateIDs = this.add_info.ticketTemplateId;

      this.getTicketTemplate(this.add_info.campType);
      this.statusCheckChange();
    },
    //获取模版ID
    getTicketTemplate(obj) {
      postRequest("/campagin/selectSweetprojectitemBySheetID?type=" + obj).then(
        res => {
          if (res.code == 200) {
            this.res_list = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        }
      );
    },

    resOk() {
      this.res_info.ticketTemplateIDs = this.currentChooseID;
      this.add_info.ticketTemplateId = this.currentChooseID;
      this.add_info.ticketName = this.currentChooseName;
      //查询适用门店
      getShopList();
      this.res_Modal_show = false;
    },

    // 选择模版end--------------------------------

    goback() {
      this.Status = "";
    },

    // 查看详情对话框
    detailsDisplayFn(row) {
      const rowData = {
        appid: row.appid,
        campId: row.campId,
        campType: row.campType,
        couponType: row.couponType,
        couponValueDesc: row.couponValueDesc,
        createBy: row.createBy,
        createTime: row.createTime,
        dateType: row.dateType,
        doorsillDesc: row.doorsillDesc,
        endDate: row.endDate,
        imgUrl: row.imgUrl,
        isLimitGrap: row.isLimitGrap,
        label: row.label,
        name: row.name,
        params: row.params,
        rules: row.rules,
        startDate: row.startDate,
        status: row.status,
        ticketName: row.ticketName,
        ticketTemplateId: row.ticketTemplateId,
        updateBy: row.updateBy,
        updateTime: row.updateTime,
        useDesc: row.useDesc,
        couponImg: row.couponImg,
        ChangeDateType: row.changeDateType,
        ChangeStartDate: row.changeStartDate,
        ChangeEndDate: row.changeEndDate,
        ChangeStart: row.changeStart,
        ChangeEnd: row.changeEnd
      };
      this.camp_Info3 = rowData;
      this.detailsDisplay = true;
    },

    // 查看详情组件
    showdetailsView(e) {
      // this.basicSetPage = e;
      // this.updateTableList();
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

    // 时间处理
    time1(e) {
      let time = e.slice(0, 10) + " " + "00:00:00";
      this.search.startDate = time;
    },
    time2(e) {
      let time = e.slice(0, 10) + " " + "00:00:00";
      this.search.endDate = time;
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
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
