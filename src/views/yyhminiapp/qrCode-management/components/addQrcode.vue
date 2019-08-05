<template>
  <div>
    <Card id="container">
      <p slot="title">二维码新增</p>
      <a href="#" slot="extra">
        <Button type="dashed" icon="md-arrow-round-back" @click="returnActivityList">返回</Button>
      </a>
      <div style="max-width: 750px;">
        <i-form :label-width="250">
          <!-- <Form-item label="小程序：" required>
            <Radio-group v-model="base_info.appType" style="margin-left: 20px;">
              <Radio value="wxminiapp" style="font-weight: normal;">&nbsp;微信</Radio>
              <Radio value="alipayminiapp" style="font-weight: normal;">&nbsp;支付宝</Radio>
            </Radio-group>
          </Form-item>-->

          <Form-item label="小程序appid：" required>
            <i-select v-model="base_info.appid" placeholder="请选择" style="width:300px">
              <i-option
                v-for="(item,index) in appStoreList"
                :key="index"
                :value="item.appid"
              >{{item.appName}}</i-option>
            </i-select>
          </Form-item>

          <Form-item label="二维码类型：" required>
            <i-select
              v-model="base_info.qrcodeType"
              placeholder="请选择"
              style="width:300px"
              @on-change="qrcodeTypeChange"
            >
              <i-option :value="1">邀请码</i-option>
              <i-option :value="2">位置码</i-option>
            </i-select>
          </Form-item>

          <Form-item label="邀请人：" v-if="base_info.qrcodeType == '1'" required>
            <i-input type="text" placeholder="请输入邀请人" v-model="base_info.uid" style="width:300px"></i-input>
          </Form-item>

          <div v-if="base_info.qrcodeType == '2'">
            <Form-item label="位置类型：" required>
              <i-select v-model="base_info.locationType" placeholder="请选择" style="width:300px">
                <i-option value="1">店内</i-option>
                <i-option value="2">公众号</i-option>
              </i-select>
            </Form-item>

            <Form-item label="位置描述：" required>
              <i-input
                type="text"
                placeholder="请输入位置描述"
                v-model="base_info.location"
                style="width:300px"
              ></i-input>
            </Form-item>
          </div>

          <Form-item label="服务类型：" required>
            <i-select
              v-model="base_info.serviceType"
              placeholder="请选择"
              style="width:300px"
              @on-change="serviceTypeChange"
            >
              <i-option
                v-for="(item, index) in ServiceTypeList"
                :key="index"
                :value="item.dictValue"
                :disabled="base_info.qrcodeType != 1?false:base_info.qrcodeType == 1 && item.dictValue == 1?false:true"
              >{{item.dictLabel}}</i-option>
              <!-- <i-option value="2">跳转领优惠详情页</i-option>
              <i-option value="3">跳转附近领优惠券列表</i-option>
              <i-option value="4" @click="getServiceParams('4')">推送优惠券</i-option>-->
            </i-select>
          </Form-item>

          <Form-item v-if="base_info.serviceType == 2 || base_info.serviceType == 3">
            <Button @click="getMerchantCouponList">{{tempName}}</Button>
          </Form-item>

          <Form-item label="二维码参数：" required>
            <i-input
              type="text"
              placeholder="最大32个可见字符，只支持数字大小写英文以及部分特殊字符"
              v-model="base_info.scene"
              style="width:300px"
              :disabled="base_info.serviceType == 2 || base_info.serviceType == 3 ?true:false"
            ></i-input>
          </Form-item>

          <!-- <Form-item label="优惠券模板号：" v-if="base_info.serviceType ==2" required>
            <i-select
              placeholder="请输入优惠券模板号"
              style="width:300px"
              v-model="base_info.ticketTemplateId"
            >
              <i-option
                v-for="(item,index) in couponList"
                :key="index"
                :value="item.ticketTemplateId"
              >{{item.couponTitle}}</i-option>
            </i-select>
          </Form-item>-->

          <!-- <Form-item label="优惠券类别：" v-if="base_info.serviceType ==3" required>
            <i-select placeholder="请输入优惠券类别" style="width:200px" v-model="base_info.category">
              <i-option
                v-for="(item, index) in categoryList"
                :key="index"
                :value="item.category"
                v-model="base_info.category"
              >{{item.category}}</i-option>
            </i-select>
          </Form-item>-->

          <!-- <Form-item label="老用户推送优惠券：" v-if="base_info.serviceType ==4" required>
            <i-select
              placeholder="请选择老用户推送优惠券"
              style="width:200px"
              v-model="base_info.oldUserTicketTemplateId"
            >
              <i-option
                v-for="(item, index) in oldUerTicketList"
                :key="index"
                :value="item.ticketTemplateId"
                v-model="base_info.oldUserTicketTemplateId"
              >{{item.couponTitle}}</i-option>
            </i-select>
          </Form-item>-->

          <!-- <Form-item label="新用户推送优惠券：" v-if="base_info.serviceType ==4" required>
            <i-select
              placeholder="请选择新用户推送优惠券"
              style="width:200px"
              v-model="base_info.newUserTicketTemplateId"
            >
              <i-option
                v-for="(item, index) in newUerTicketList"
                :key="index"
                :value="item.ticketTemplateId"
                v-model="base_info.newUserTicketTemplateId"
              >{{item.couponTitle}}</i-option>
            </i-select>
          </Form-item>-->

          <Form-item label="指定门店号：">
            <i-input
              type="text"
              placeholder="请输入指定门店号"
              v-model="base_info.shopId"
              style="width:300px"
            ></i-input>
          </Form-item>

          <Form-item label="小程序页面路径：" required>
            <i-input
              type="text"
              placeholder="默认为loading页面"
              v-model="base_info.page"
              style="width:300px"
              disabled
            ></i-input>
          </Form-item>

          <!-- <div v-if="base_info.appType == 'wxminiapp'"> -->
          <Form-item label="二维码宽度：" required>
            <i-input
              type="text"
              placeholder="请输入正整数(宽度范围为280-1280px)"
              v-model="base_info.width"
              style="width:300px"
            ></i-input>
            <span style="color:red;font-size: 16px">&nbsp;&nbsp;px</span>
          </Form-item>

          <Form-item label="自动配置色条颜色：" required>
            <RadioGroup v-model="base_info.autoColor" style="margin-left: 20px;">
              <Radio :label="0" style="font-weight: normal;">&nbsp;是</Radio>
              <Radio :label="1" style="font-weight: normal;">&nbsp;否</Radio>
            </RadioGroup>
          </Form-item>

          <Form-item label="lineColor：" required v-show="base_info.autoColor == '1'">
            <i-input type="text" placeholder="填入r" v-model="lineColor_r" style="width:100px"></i-input>
            <i-input type="text" placeholder="填入g" v-model="lineColor_g" style="width:100px"></i-input>
            <i-input type="text" placeholder="填入b" v-model="lineColor_b" style="width:100px"></i-input>
            <div class="color_sample" :style="{ 'background-color': lineColor_show }"></div>
          </Form-item>

          <Form-item label="是否需要透明底色：" required>
            <RadioGroup v-model="base_info.is_hyaline" style="margin-left: 20px;">
              <Radio label="0" style="font-weight: normal;">&nbsp;不需要</Radio>
              <Radio label="1" style="font-weight: normal;">&nbsp;需要</Radio>
            </RadioGroup>
          </Form-item>
          <!-- </div> -->

          <Form-item label="备注" required>
            <i-input
              v-model="base_info.remark"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="请输入备注"
            ></i-input>
          </Form-item>

          <Form-item label="小程序码关联业务参数:">
            <div
              v-for="(item, index) in base_info.qrcodeServiceParams"
              :key="index"
              style="margin-top:5px"
            >
              参数{{index+1}}名：
              <Input v-model="item.param" placeholder="请输入" style="width: 150px" />
              参数{{index+1}}值：
              <Input v-model="item.value" placeholder="请输入" style="width: 150px" />
              <Button type="error" @click="handleRemove(index)" style="margin-left:10px">删除</Button>
            </div>
            <Button type="primary" icon="md-add" @click="handleAdd" style="margin-top:10px">添加一项</Button>
          </Form-item>

          <Form-item :style="{'margin-top':'34px'}">
            <i-button type="primary" @click="submitData" size="large">保存</i-button>
            <i-button @click="returnActivityList" size="large" style="margin-left:10px">返回</i-button>
          </Form-item>
        </i-form>
      </div>
    </Card>
    <!-- 选择周边券对话框 -->
    <Modal
      v-model="MerchantCouponDisplay"
      title="选择列表"
      width="885"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Form :label-width="70">
        <Table
          border
          highlight-row
          ref="selection"
          :columns="this.base_info.serviceType == 2?columns1:columns2"
          :data="merchantCouponList"
          @on-current-change="selectionCampagin"
        ></Table>
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
        <Row style="margin:10px 0 0 797px">
          <Button @click="MerchantCouponDisplay = false">关闭</Button>
          <!-- <Button type="primary" @click="addLuckyDrawFn()" :disabled="formValidate.templateId == ''? true : false">保存</Button> -->
        </Row>
      </Form>
    </Modal>
    <!-- 选择周边券对话框 -->
  </div>
</template>

<script>
  import {
    getMiniApp,
    getServiceType,
    addQrCodeManagement,
    getCampaginListData
  } from "@/api/sys";
  export default {
    props: {
      qrcodeStatus: Number,
      qrcodeItem: Object
    },
    data() {
      return {
        base_info: {
          // appType: "wxminiapp",
          // ticketTemplateId: "",
          // category: "",
          qrcodeType: null, // 二维码类型-
          serviceType: null, // 服务类型-
          shopId: "", // 门店id -
          remark: "", // 备注 -
          uid: "", // 邀请人 -
          locationType: "", // 位置类型 -
          location: "", // 位置描述 -
          appid: "", // 微信小程序appid -
          scene: "", // 二维码参数值 -
          page: "pages/loading/loading", // 小程序页面值 -
          width: 430, // 二维码的宽度 -
          autoColor: 0, // 自动配置线条颜色
          lineColor: "", // 使用 rgb 设置颜色 -
          is_hyaline: "0", // is_hyaline 为true时，生成透明底色的小程序码 -
          qrcodeServiceParams: [
            {
              param: "",
              value: ""
            }
          ]
          // oldUserTicketTemplateId: "",
          // newUserTicketTemplateId: ""
        },
        lineColor_r: "", // 使用 r 设置颜色 -
        lineColor_g: "", // 使用 g 设置颜色 -
        lineColor_b: "", // 使用 b 设置颜色 -
        lineColor_show: "",
        appStoreList: [], // 小程序appid

        venderName: "",

        ServiceTypeList: [], // 服务类型 （根据字典查询）
        couponList: [],
        oldUerTicketList: [],
        newUerTicketList: [],
        // 周边券详情页 / 列表
        totalSize: 0,
        current: 1,
        tempName: "请选择列表",
        MerchantCouponDisplay: false,
        merchantCouponList: [],
        // 周边券
        columns1: [
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
        // 商户列表
        columns2: [
          {
            title: "商户ID",
            align: "center",
            minWidth: 140,
            key: "merchantId"
          },
          {
            title: "商户名称",
            align: "center",
            minWidth: 140,
            key: "name"
          }
          // {
          //   title: "所属商户",
          //   align: "center",
          //   minWidth: 140,
          //   key: "merchantName"
          // }
        ]
      };
    },
    computed: {
      getLineColorR() {
        return this.lineColor_r;
      },
      getLineColorG() {
        return this.lineColor_g;
      },
      getLineColorB() {
        return this.lineColor_b;
      }
    },
    watch: {
      getLineColorR(newValue, oldValue) {
        this.lineColor_show =
          "rgb(" +
          newValue +
          "," +
          this.lineColor_g +
          "," +
          this.lineColor_b +
          ")";
      },
      getLineColorG(newValue, oldValue) {
        this.lineColor_show =
          "rgb(" +
          this.lineColor_r +
          "," +
          newValue +
          "," +
          this.lineColor_b +
          ")";
      },
      getLineColorB(newValue, oldValue) {
        this.lineColor_show =
          "rgb(" +
          this.lineColor_r +
          "," +
          this.lineColor_g +
          "," +
          newValue +
          ")";
      }
      // "base_info.appType"(val) {
      //   console.log(val);
      //   this.base_info.appType = val;
      //   this.getWebankAppStore(val);
      // },

      // "base_info.serviceType"(val) {
      //   if (!this.base_info.appid) {
      //     this.$Message.error("请选择小程序appid！", 3);
      //     this.base_info.serviceType = "";
      //     return;
      //   }
      // }
    },
    created: function() {
      this.getWebankAppStore();
      this.getServiceParams();
    },
    methods: {
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
            this.ServiceTypeList = res.data;
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      //提交
      submitData: function() {
        // 提交新增/编辑
        // console.log(this.base_info);

        if (!this.formCheck()) {
          return;
        }

        var color = {
          r: this.lineColor_r,
          g: this.lineColor_g,
          b: this.lineColor_b
        };

        var color1 = JSON.stringify(color);

        const data = {
          appid: this.base_info.appid,
          autoColor: this.base_info.autoColor == 0 ? true : false,
          isHyaline: this.base_info.is_hyaline == 0 ? false : true,
          lineColor: this.base_info.autoColor == 0 ? "" : color1,
          location: this.base_info.location,
          locationType: this.base_info.locationType,
          page: this.base_info.page,
          qrcodeServiceParams: JSON.stringify(this.base_info.qrcodeServiceParams),
          qrcodeType: this.base_info.qrcodeType,
          remark: this.base_info.remark,
          scene: this.base_info.scene,
          serviceType: Number(this.base_info.serviceType),
          shopId: this.base_info.shopId,
          uid: this.base_info.uid,
          width: this.base_info.width
        };

        // console.log(data);
        // return;

        addQrCodeManagement(data).then(res => {
          console.log(res);
          if (res.code == 200) {
            this.msgOk("保存成功");
            this.returnActivityList();
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      //返回列表
      returnActivityList: function() {
        // window.location.href = "qrCodeManagement.jsp";
        console.log(this.base_info);
        this.$emit("changeStatus", {
          display: false,
          qrcodeType: this.base_info.qrcodeType
        });
      },

      // 获取周边券详情
      getMerchantCouponList() {
        let url, data;
        if (this.base_info.serviceType == 2) {
          // 跳转周边券详情页
          data = {
            isEffective: 1,
            templateStatus: "进行中",
            requestFrom: "qrcode"
          };
          url = "/merchantCouponTemplate/backList";
        } else {
          // 跳转周边券列表
          data = {
            operatingStatus: "0",
            requestFrom: "qrcode"
          };
          url = "/merchant/merchantInfo/list";
        }
        getCampaginListData(url, data, this.current).then(res => {
          if (res.code == 200) {
            this.merchantCouponList = res.data.records;
            this.current = res.data.current;
            this.totalSize = res.data.total;
            this.MerchantCouponDisplay = true;
          }
        });
      },

      // 分页
      changeCurrent: function(current) {
        this.current = current;
        this.getMerchantCouponList();
      },

      // 选中优惠活动
      selectionCampagin(row, oldCurrentRow) {
        if (this.base_info.serviceType == 2) {
          this.tempName = "已选择" + row.title;
          this.base_info.scene = row.templateId;
        } else {
          this.tempName = "已选择" + row.name;
          this.base_info.scene = row.merchantId;
        }
        // this.operation_data.pagePath = row.id
        // this.specialTopic = '已选择' + row.name
        this.msgOk("选择成功");
      },

      //二维码类型触发
      qrcodeTypeChange() {
        this.base_info.serviceType = "";
      },

      //服务类型触发
      serviceTypeChange() {
        this.tempName = "请选择";
        this.base_info.scene = "";
      },

      // 验证
      formCheck: function() {
        if (!this.base_info.appid) {
          this.$Message.error("请选择小程序appid！", 3);
          return;
        }

        if (!this.base_info.qrcodeType) {
          this.$Message.error("请选择二维码类型！", 3);
          return;
        }

        if (this.base_info.qrcodeType == "1") {
          if (!this.base_info.uid) {
            this.$Message.error("请输入邀请人！", 3);
            return;
          }
        }

        if (this.base_info.qrcodeType == "2") {
          if (!this.base_info.locationType) {
            this.$Message.error("请选择位置类型！", 3);
            return;
          }

          if (!this.base_info.location) {
            this.$Message.error("请输入位置描述！", 3);
            return;
          }
        }

        if (!this.base_info.serviceType) {
          this.$Message.error("请选择服务类型！", 3);
          return;
        }
        if (this.base_info.serviceType == 1 && !this.base_info.scene) {
          this.$Message.error("请输入二维码参数！", 3);
          return;
        }

        if (this.base_info.serviceType != 1 && !this.base_info.scene) {
          this.$Message.error("二维码参数为空，请点击选择列表！", 4);
          return;
        }

        //                if(!this.base_info.shopId){
        //                    this.$Message.error('请输入指定门店号！', 3);
        //                    return;
        //                }

        // if (this.base_info.serviceType == 2 && !this.base_info.ticketTemplateId) {
        //   console.log(this.base_info.ticketTemplateId);
        //   this.$Message.error("请选择优惠券模板号！", 3);
        //   return;
        // }

        // if (this.base_info.serviceType == 3 && !this.base_info.category) {
        //   this.$Message.error("请选择优惠券类别！", 3);
        //   return;
        // }

        // if (this.base_info.serviceType == 4 && !this.base_info.category) {
        //   if (!this.base_info.oldUserTicketTemplateId) {
        //     this.$Message.error("请选择老用户推送优惠券！", 3);
        //     return;
        //   }
        //   if (!this.base_info.newUserTicketTemplateId) {
        //     this.$Message.error("请选择新用户推送优惠券！", 3);
        //     return;
        //   }
        // }

        // if (this.base_info.appType == "wxminiapp") {
        if (!this.base_info.width) {
          this.$Message.error("请输二维码宽度！", 3);
          return;
        } else {
          // if (!zexUtil.isNumber(this.base_info.width)) {
          //   this.$Message.error("二维码宽度必须要为数字！", 3);
          //   return;
          // }
        }

        if (this.base_info.width < 280 || this.base_info.width > 1280) {
          this.$Message.error("二维码宽度为280-1280px之间！", 3);
          return;
        }

        if (this.base_info.autoColor == 1) {
          if (!this.lineColor_r || !this.lineColor_g || !this.lineColor_b) {
            this.$Message.error("需要配置的颜色！", 3);
            return;
          }
        }

        if (!this.base_info.remark) {
          this.$Message.error("请输入备注！", 3);
          return;
        }
        // }

        // for (var i = 0; i < this.base_info.qrcodeServiceParams.length; i++) {
        //   var resultIndex = i + 1;
        //   if (
        //     this.base_info.qrcodeServiceParams[i].param == "" ||
        //     this.base_info.qrcodeServiceParams[i].param == " "
        //   ) {
        //     this.$Message.error("第 " + resultIndex + "条参数名为空！");
        //     console.log(this.base_info.qrcodeServiceParams[i].param);
        //     return;
        //   }
        //   if (
        //     this.base_info.qrcodeServiceParams[i].value == "" ||
        //     this.base_info.qrcodeServiceParams[i].value == " "
        //   ) {
        //     this.$Message.error("第 " + resultIndex + "条参数值为空！");
        //     console.log(this.base_info.qrcodeServiceParams[i].value);
        //     return;
        //   }
        // }

        return true;
      },

      // 添加问题
      handleAdd() {
        if (this.base_info.qrcodeServiceParams.length >= 10) {
          this.msgErr("不能超过10个");
          return;
        } else {
          this.base_info.qrcodeServiceParams.push({ param: "", value: "" });
        }
      },

      // 删除
      handleRemove(index) {
        if (this.base_info.qrcodeServiceParams.length == 1) {
          this.msgErr("不能小于1个");
          return;
        }
        this.base_info.qrcodeServiceParams.splice(index, 1);
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
      // --------------------------------------------------
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
