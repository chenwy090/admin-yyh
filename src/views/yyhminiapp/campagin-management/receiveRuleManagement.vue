<template>
  <div class="search">
    <div v-if="!campaginGrabInfoPage && !campaginManagementPage">
      <div
        style="width: 100%;background: #fff;box-shadow:0 6px 6px -4px rgba(0,0,0,.2);z-index: 1;position:fixed; padding:14px"
      >
        <Steps :current="1">
          <Step title="基础设置" content="已经完成"></Step>
          <Step title="规则设置" content="进行中"></Step>
          <Step title="整点抢设置" content="等进行" v-if="edit_info.isLimitGrap == '1'"></Step>
        </Steps>
      </div>
      <div style="padding-top: 80px">
        <Card>
          <p slot="title">领优惠---规则设置</p>
          <a href="#" slot="extra">
            <Button type="dashed" icon="md-arrow-round-back" @click="goback">返回上一层</Button>
          </a>

          <Alert show-icon>
            活动ID :
            <span style="color:red">{{ campId }}</span>
            <span style="margin-left: 10%">
              设置总天数 :
              <span style="color:red">{{ daySum }}</span>
            </span>
            <span slot="desc"></span>
          </Alert>
          <Form v-if="!isNext" :model="edit_info" ref="edit_info" :label-width="220">
            <!-- <FormItem label="每人免费限领数" required>
              <InputNumber
                :min="0"
                type="text"
                v-model="edit_info.freeTimes"
                placeholder="请输入"
                style="width:400px"
                @on-change="statusCheckChange"
              ></InputNumber>
            </FormItem>-->

            <FormItem label="每人限领总数" required>
              <InputNumber
                :min="0"
                :step="1"
                type="text"
                v-model="edit_info.totalGetLimit"
                placeholder="请输入"
                style="width:400px"
                @on-change="statusCheckChange"
              ></InputNumber>
              <span style="color:red">&nbsp;&nbsp;张</span>
            </FormItem>

            <FormItem label="投放渠道" required>
              <Select v-model="edit_info.sendChannel" style="width:400px" @on-change="statusCheckChange">
                <Option v-for="item in res_list" :value="item.dictValue" :key="item.id">{{ item.dictLabel }}</Option>
              </Select>
            </FormItem>

            <FormItem label="是否在领优惠列表显示" required v-if="edit_info.sendChannel == 1">
              <Select v-model="edit_info.displayStatus" style="width:400px" @on-change="statusCheckChange">
                <Option value="1">显示</Option>
                <Option value="0">不显示</Option>
              </Select>
            </FormItem>

            <FormItem label="邀请人数" required v-if="edit_info.sendChannel == 1">
              <InputNumber
                :min="0"
                type="text"
                :step="1"
                v-model="edit_info.shareInvitedCount"
                placeholder="请输入"
                style="width:400px"
                @on-change="statusCheckChange"
              ></InputNumber>
              <span style="color:red">&nbsp;&nbsp;人</span>
            </FormItem>

            <FormItem label="是否限抢券" required>
              <Select v-model="edit_info.isLimitGrap" style="width:400px" @on-change="statusCheckChange">
                <Option value="0">否</Option>
                <Option value="1">是</Option>
              </Select>
            </FormItem>

            <FormItem label="排序" required>
              <InputNumber
                :min="0"
                type="text"
                :step="1"
                v-model="edit_info.orderBy"
                placeholder="请输入"
                style="width:400px"
                @on-change="statusCheckChange"
              ></InputNumber>
            </FormItem>

            <FormItem label="是否限制库存数量" required>
              <Select v-model="isStockCount" style="width:400px" @on-change="statusCheckChange">
                <Option value="0">否</Option>
                <Option value="1">是</Option>
              </Select>
            </FormItem>

            <FormItem label="库存数量" required v-if="isStockCount == '1'">
              <InputNumber
                :min="0"
                :step="1"
                type="text"
                v-model="edit_info.stockCount"
                placeholder="请输入"
                style="width:400px"
                @on-change="statusCheckChange"
              ></InputNumber>
              <span style="color:red">&nbsp;&nbsp;张</span>
            </FormItem>
            <FormItem label=" 默认推荐排除" required>
              <div style="display:flex">
                <Select v-model="edit_info.isBlack" style="width:200px" @on-change="statusCheckChange">
                  <Option value="0">否</Option>
                  <Option value="1">是</Option>
                </Select>
                <p style="padding-left: 10px;color: #999;">是：暗券，否：不是暗券</p>
              </div>
            </FormItem>

            <FormItem :label-width="220">
              <Alert type="warning" show-icon v-if="isCheckDisabled == true" style="width:500px">修改后才能保存</Alert>
              <Button
                type="primary"
                @click="editOk()"
                :loading="edit_loading"
                style="width:220px; margin-right:30px;"
                :disabled="isCheckDisabled"
                >保存</Button
              >
              <Button
                type="dashed"
                @click="nextInfo()"
                style="width:150px;margin-left: 5%"
                v-if="status == 'edit' || (status != 'edit' && edit_info.isLimitGrap == '1')"
                >下一步</Button
              >
            </FormItem>
          </Form>

          <!--分享奖励配置-->
          <Form
            ref="shareModal"
            v-if="formShareModal.shareData.length && camp_pageStatus === 'edit' && isNext"
            :model="formShareModal"
            :label-width="220"
            style="margin-top:20px"
          >
            <FormItem v-for="item in formShareModal.shareData" :key="item.id" :label="item.name" required>
              <InputNumber
                :min="item.name == '倍数' ? 1 : 0"
                :step="1"
                type="text"
                v-model="item.value"
                placeholder="请输入"
                style="width:320px"
              ></InputNumber>
              <span v-if="item.name != '倍数'">&nbsp;&nbsp;U贝</span>
              <span v-if="item.name == '倍数'">&nbsp;&nbsp;倍</span>
            </FormItem>
            <FormItem>
              <Button style="float: left;" type="primary" @click="shareSave()">保存</Button>
              <Button
                type="dashed"
                @click="nextInfo2()"
                style="width:150px;margin-left: 5%"
                v-if="edit_info.isLimitGrap == '1'"
                >下一步</Button
              >
            </FormItem>
          </Form>
        </Card>
      </div>
    </div>

    <div v-if="campaginGrabInfoPage">
      <campaginGrabInfoSet @changeStatus="showcampaginGrabInfo"></campaginGrabInfoSet>
    </div>

    <div v-if="campaginManagementPage">
      <campaginManagement @changeStatus="showcampaginManagement"></campaginManagement>
    </div>

    <Modal v-model="next_modal" width="360" title="设置成功" @on-cancel="closeModal">
      <p>即将跳转领优惠列表...</p>

      <div slot="footer">
        <Button type="success" size="large" long @click="closeModal">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest } from "@/libs/axios";

import { formatDate } from "@/libs/date";

import campaginGrabInfoSet from "./campaginGrabInfo";
import campaginManagement from "./campaginManagement";

export default {
  name: "receiveRuleManagement",
  components: {
    campaginGrabInfoSet,
    campaginManagement,
  },
  props: {
    camp_pageStatus: String,
  },

  data() {
    return {
      formShareModal: {
        shareData: [],
      },
      next_modal: false,
      isNext: false,
      campaginGrabInfoPage: false,
      campaginManagementPage: false,
      edit_info: {
        // addRequiredScore: 0,
        // freeTimes: 0,

        // 是否在领优惠列表显示  edit_info.displayStatus  1 0
        displayStatus: "", //【必选】
        // isLimitGrap: "0",
        isLimitGrap: "", //是否限抢券 0 1 【必选】
        // isBlack: "0",
        isBlack: "", //默认推荐排除 0 1  【必选】
        sendChannel: "1", //投放渠道
        label: "",
        shareInvitedAwardAmount: 0,
        shareInvitedCount: 0, //邀请人数
        // shareUseRakeBackPercent: 0,
        orderBy: 9999,
        // stockCount: 0,
        stockCount: "", //库存数量  【必填】
        totalGetLimit: 0, //每人限领总数
        // displayStatus: "0"
        displayStatus: "", //是否在领优惠列表显示  1 0  【必选】
      },
      // isStockCount: "0",
      isStockCount: "", //是否限制库存数量 默认不选择  0 1 【必选】
      edit_loading: false,
      campId: "",
      status: "",
      getUrl: "",
      msg: "",

      daySum: "",
      isCheckDisabled: true,
      current: 1,
      totalSize: 0, //总条数
      pageNum: 1, //开始条数
      limit: 10, //每页记录数
      TableLoading: false,
      table_list: [],
      res_list: [],
      chooseResArray: [],
      currentid: "", // 点击单选框得到的id（临时）
      res_columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
        {
          title: "选择",
          // key: 'chose',
          width: 60,
          align: "center",
          render: (h, params) => {
            // console.log(params.row);
            let value = params.row.dictValue;
            let flag = false;
            if (this.currentid == value) {
              flag = true;
            } else {
              flag = false;
            }
            return h("div", [
              h("Radio", {
                props: {
                  value: flag,
                },
                on: {
                  "on-change": () => {
                    this.currentid = value;
                    // this.id_jishi = params.row.id
                  },
                },
              }),
            ]);
          },
        },
        {
          title: "字典类型",
          key: "dictCode",
          width: 150,
          align: "center",
        },
        {
          title: "字典标签",
          key: "dictLabel",
          width: 100,
          align: "center",
        },
        {
          title: "字典键值",
          key: "dictValue",
          width: 150,
          sortable: true,
          align: "center",
        },
        {
          title: "字典排序",
          key: "dictSort",
          width: 150,
          sortable: true,
          align: "center",
        },

        {
          title: "状态",
          key: "status",
          width: 100,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color = row.status === "1" ? "red" : "blue";
            const text = row.status === "1" ? "停用" : "正常";

            return h(
              "Tag",
              {
                props: {
                  color: color,
                },
              },
              text
            );
          },
        },
      ],
    };
  },

  created: function() {},
  methods: {
    init() {
      this.campId = this.getStore("campId");
      this.daySum = this.getStore("daySum");
      this.share(this.campId);
      this.updateTableList();
      this.getTicketTemplate();
    },
    share(campId) {
      this.formShareModal.shareData = [];
      postRequest("/commonConfig/queryConfigByCode", {
        code: campId,
      }).then(res => {
        if (res.code == 200) {
          if (res.data || res.data.noOverallCommonConfigList) {
            this.formShareModal.shareData = res.data.noOverallCommonConfigList || [];
            this.formShareModal.shareData.forEach(function(v) {
              v.value = Number(v.value) || 0;
            });
            this.shareDisplay = true;
          } else {
            this.$Message.error("未查询到数据");
          }
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    shareSave(name) {
      let canSave = true;
      let msg = "";
      this.formShareModal.shareData.forEach(function(v) {
        v.createTime = null;
        v.updateTime = null;
        v.updateBy = null;
        if (!v.value && v.value !== 0) {
          canSave = false;
          msg = "请输入完整表单";
        }
        if (v.name == "倍数" && v.value < 1) {
          canSave = false;
          msg = "请输入大于等于1的倍数";
        }
      });
      if (!canSave) {
        this.$Message.error(msg);
        return;
      }
      postRequest("/commonConfig/updateConfigBatch", { noOverallCommonConfigList: this.formShareModal.shareData }).then(
        res => {
          if (res.code == 200) {
            //this.formCustom.remark='';
            this.$Message.success("保存成功");
            // if(name){
            //     if (this.edit_info.isLimitGrap == "1") {
            //         setTimeout(() => {
            //             this.campaginGrabInfoPage = true;
            //             this.campaginManagementPage = false;
            //         }, 1200);
            //     } else {
            //         this.next_modal = true;
            //     }
            // }
            if (this.edit_info.isLimitGrap == "1") {
              setTimeout(() => {
                this.campaginGrabInfoPage = true;
                this.campaginManagementPage = false;
              }, 1200);
            } else {
              this.next_modal = true;
            }
          } else {
            this.$Message.error(res.msg);
          }
        }
      );
    },

    updateTableList() {
      this.TableLoading = true;

      const reqParams = {
        campId: this.campId,
      };

      postRequest("/campaignReceiveRule/queryRule?campId=" + this.campId, reqParams).then(res => {
        if (res.isSuccess) {
          if (res.data) {
            this.edit_info = res.data;
            this.campId = res.data.campId;
            this.edit_info.isLimitGrap = res.data.isLimitGrap.toString(); // = 0 ? "0" : "1";
            this.edit_info.sendChannel = res.data.sendChannel.toString();
            if (this.edit_info.isBlack || this.edit_info.isBlack === 0) {
              this.edit_info.isBlack = res.data.isBlack.toString();
            } else {
              this.edit_info.isBlack = "";
            }
            this.status = "edit";
            this.currentid = res.data.label;
            this.edit_info.displayStatus = res.data.displayStatus.toString();
            if (this.edit_info.stockCount == "999999999") {
              this.isStockCount = "0";
            } else {
              this.isStockCount = "1";
            }
          } else {
            this.edit_info = {
              // addRequiredScore: 0,
              // freeTimes: 0,
              // isLimitGrap: "0",
              // isBlack: "0",
              displayStatus: "", //是否在领优惠列表显示
              isLimitGrap: "", //是否限抢券
              isBlack: "", //默认推荐排除
              sendChannel: "1",
              label: "",
              shareInvitedAwardAmount: 0,
              shareInvitedCount: 0,
              // shareUseRakeBackPercent: 0,
              orderBy: 9999,
              // stockCount: 0,//库存数量
              stockCount: "", //库存数量
              totalGetLimit: 0,
            };
            this.status = "add";
          }
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    //获取活动标签ID
    getTicketTemplate() {
      const reqParams = {
        dictCode: "send_channel",
      };

      postRequest("/system/sys-dict-data/list?pageNum=" + this.pageNum + "&pageSize=" + this.limit, reqParams).then(
        res => {
          if (res.code == 200) {
            this.res_list = res.data.records;
          } else {
            this.$Message.error(res.msg);
          }
        }
      );
    },

    editOk() {
      if (this.isCheckDisabled) {
        this.nextInfo();
        return;
      }
      if (!this.edit_info.sendChannel) {
        return this.$Message.error("投放渠道不能为空");
      }
      // 是否在领优惠列表显示  edit_info.displayStatus  1 0
      if (this.edit_info.displayStatus === "") {
        return this.$Message.error("请选择是否在领优惠列表显示");
      }
      if (this.edit_info.sendChannel == 1) {
        if (!this.edit_info.shareInvitedCount && this.edit_info.shareInvitedCount != 0) {
          return this.$Message.error("邀请人数不能为空");
        }
      }
      // 是否限抢券   edit_info.isLimitGrap  0 1
      if (this.edit_info.isLimitGrap === "") {
        return this.$Message.error("请选择是否限抢券");
      }
      if (!this.edit_info.orderBy && this.edit_info.orderBy != 0) {
        return this.$Message.error("排序不能为空");
      }
      // 是否限制库存数量  isStockCount    0 否 1 是
      if (this.isStockCount === "") {
        return this.$Message.error("请选择是否限制库存数量");
      } else {
        if (this.isStockCount == 0) {
          this.edit_info.stockCount = "999999999";
        }
        if (this.isStockCount == 1) {
          if (!this.edit_info.stockCount) {
            return this.$Message.error("库存数量不能为空");
          }
        }
      }

      if (this.edit_info.isLimitGrap == 1) {
        if (this.daySum > this.edit_info.stockCount) {
          return this.$Message.error("设置总天数不能大于库存数量");
        }
      }
      //默认推荐排除  edit_info.isBlack  0 1
      if (this.edit_info.isBlack === "") {
        return this.$Message.error("请选择默认推荐排除");
      }
      this.edit_loading = true;
      const reqParams = {
        campId: this.campId,
        // addRequiredScore: this.edit_info.addRequiredScore,
        // freeTimes: this.edit_info.freeTimes,
        isLimitGrap: Number(this.edit_info.isLimitGrap),
        sendChannel: Number(this.edit_info.sendChannel),
        isBlack: Number(this.edit_info.isBlack),

        label: this.edit_info.dictId,
        shareInvitedAwardAmount: this.edit_info.shareInvitedAwardAmount,
        shareInvitedCount: this.edit_info.shareInvitedCount,
        // shareUseRakeBackPercent: this.edit_info.shareUseRakeBackPercent / 100,
        orderBy: this.edit_info.orderBy,
        stockCount: this.edit_info.stockCount,
        totalGetLimit: this.edit_info.totalGetLimit,
        displayStatus: this.edit_info.displayStatus,
      };

      if (this.status == "add") {
        this.getUrl = "/campaignReceiveRule/add";
        this.msg = "新增成功";
      } else {
        this.getUrl = "/campaignReceiveRule/edit";
        this.msg = "编辑成功";
      }

      postRequest(this.getUrl, reqParams).then(res => {
        this.edit_loading = false;
        if (res.code == 200) {
          this.isCheckDisabled = true;
          this.status = "edit";
          // if (this.edit_info.isLimitGrap == "1") {
          //
          // } else {
          //   this.next_modal = true;
          // }
          setTimeout(() => {
            this.nextInfo();
          }, 1200);
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    // 跳转列表

    closeModal() {
      this.next_modal = false;
      setTimeout(() => {
        this.setStore("campId", "");
        this.setStore("daySum", "");
        // this.campaginManagementPage = true;
        this.$emit("changeStatus", { Return: false, type: 1 });
      }, 1200);
    },

    dataProcessing() {
      if (!this.edit_info.stockCount && this.edit_info.stockCount != 0) {
        this.$Message.error("库存数量不能为空");
        return;
      } else if (this.daySum > this.edit_info.stockCount) {
        this.$Message.error("设置总天数不能大于库存数量");
        return;
      }

      this.setStore("stockCount", this.edit_info.stockCount);
    },

    nextInfo() {
      this.dataProcessing();
      this.isNext = true;
      if (this.camp_pageStatus == "add" && this.edit_info.isLimitGrap == "1") {
        this.campaginGrabInfoPage = true;
        this.campaginManagementPage = false;
      } else if (this.camp_pageStatus == "add" && this.edit_info.isLimitGrap != "1") {
        this.next_modal = true;
      }
    },
    nextInfo2() {
      this.isNext = true;
      this.campaginGrabInfoPage = true;
      this.campaginManagementPage = false;
      if (this.edit_info.isLimitGrap != "1") {
        this.next_modal = true;
      }
    },

    showcampaginGrabInfo(e) {
      if (e.type == 1) {
        this.$emit("changeStatus", { Return: false, type: 1 });
      }
      this.campaginGrabInfoPage = e.Return;
      if (this.camp_pageStatus === "edit") {
        this.isNext = e.isNext;
      }
    },

    showcampaginManagement(e) {
      this.campaginManagementPage = e;
    },

    goback() {
      if (this.isNext) {
        this.isNext = false;
      } else {
        this.$emit("changeStatus", { Return: false });
      }
    },

    statusCheckChange() {
      this.isCheckDisabled = false;
    },

    // 选择模版start--------------------------------
    resInfo() {
      this.res_Modal_show = true;
      this.statusCheckChange();
    },

    change(obj) {
      const dictId = [];
      for (let i of obj) {
        dictId.push(i.id);
      }

      this.res_info.dictIds = dictId.toString();
    },

    resOk() {
      this.edit_info.dictId = this.currentid;
      this.res_Modal_show = false;
    },

    // 选择模版end------------------------------
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
.form {
  width: 900px;
}
.form > div {
  display: inline-block;
}
</style>
