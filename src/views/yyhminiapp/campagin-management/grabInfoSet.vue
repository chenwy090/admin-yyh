
<template>
  <div class="search">
    <Card>
      <p slot="title">要优惠----拼团设置</p>

      <!-- <a href="#" slot="extra"  style="margin-right: 40px">
              <Button type="error"  @click="removeInfo()"  v-if="status =='edit'" >删除拼团设置</Button>
      </a>-->
      <a href="#" slot="extra">
        <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回</Button>
      </a>

      <p>
        <Alert show-icon>
          活动ID:
          <span style="color:red">{{edit_info.campId}}</span>
          <span slot="desc"></span>
        </Alert>

        <Card>
          <Form :label-width="240">
            <FormItem label="每人每天开团次数" required>
               <Tooltip trigger="focus" title="提醒" content="只能输入整数" placement="right">
              <InputNumber
                :min="0"
                v-model="edit_info.dailyOpenTimes"
                placeholder="请输入"
                style="width:300px"
                @on-change="statusCheckChange"
              ></InputNumber>
               </Tooltip>
               <span style="color:red"> &nbsp;&nbsp;次</span>
            </FormItem>

            <!-- <FormItem label="每人每天免费开团次数" required>
              <InputNumber
                :min="0"
                v-model="edit_info.dailyFreeOpenTimes"
                placeholder="请输入"
                style="width:300px"
                @on-change="statusCheckChange"
              ></InputNumber>
              <span>（只能输入整数）</span>
            </FormItem> -->

            <FormItem label="成团人数" required>
                 <Tooltip trigger="focus" title="提醒" content="只能输入整数" placement="right">
              <InputNumber
                :min="0"
                v-model="edit_info.groupCount"
                placeholder="请输入"
                style="width:300px"
                @on-change="statusCheckChange"
                disabled
              ></InputNumber>
                   <span style="color:red"> &nbsp;&nbsp;人</span>
                 </Tooltip>

            </FormItem>

            <FormItem label="拼团限时(分钟)" required>
              <Tooltip trigger="focus" title="提醒" content="单位为(分钟),范围为(0~60)  (只能输入整数)" placement="right">
                <InputNumber
                  :min="1"
                  :max="60"
                  v-model="edit_info.limitTime"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
                   <span style="color:red"> &nbsp;&nbsp;分钟</span>
              </Tooltip>


            </FormItem>

            <FormItem label="每人每天参团限制次数" required>
                <Tooltip trigger="focus" title="提醒" content="只能输入整数" placement="right">
              <InputNumber
                :min="0"
                v-model="edit_info.dailyJoinGroupTimes"
                placeholder="请输入 "
                style="width:300px"
                @on-change="statusCheckChange"
              ></InputNumber>
                    <span style="color:red">&nbsp;&nbsp;次</span>
                </Tooltip>

            </FormItem>

            <!-- <FormItem label="兑换要优惠一次所需积分" required>
              <InputNumber
                :min="0"
                v-model="edit_info.addOpenRequiredScore"
                placeholder="请输入"
                style="width:300px"
                @on-change="statusCheckChange"
              ></InputNumber>
              <span>（只能输入整数）</span>
            </FormItem> -->

            <FormItem label="每人每天接受分享奖励限制次数" required>
                 <Tooltip trigger="focus" title="提醒" content="只能输入整数" placement="right">
              <InputNumber
                :min="0"
                v-model="edit_info.dailyAcceptShareTimes"
                placeholder="请输入"
                style="width:300px"
                @on-change="statusCheckChange"
              ></InputNumber>
                 </Tooltip>
                  <span style="color:red">&nbsp;&nbsp;次</span>
            </FormItem>

            <FormItem label="助力得全场满减现金券面额下限百分比" required>
              <Tooltip trigger="focus" title="提醒" content="范围为(0~100)  (只能输入整数)" placement="right">
                <InputNumber
                  :max="100"
                  :min="0"
                  v-model="edit_info.helpAwardLower"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
                  <span style="color:red">&nbsp;&nbsp; %</span>
              </Tooltip>

            </FormItem>

            <FormItem label="助力得全场满减现金券面额上限百分比" required>
              <Tooltip trigger="focus" title="提醒" content="范围为(0~100)  (只能输入整数)" placement="right">
                <InputNumber
                  :max="100"
                  :min="0"
                  v-model="edit_info.helpAwardUpper"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
                 <span style="color:red">&nbsp;&nbsp; %</span>
              </Tooltip>

            </FormItem>

            <!-- <FormItem label="助力者用券后给分享者返佣百分比" required>
              <Tooltip trigger="focus" title="提醒" content="范围为(0~100)" placement="right">
                <InputNumber
                  :min="0"
                  v-model="edit_info.shareUseRakeBackPercent"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
                <span>（只能输入整数）</span>
              </Tooltip>
            </FormItem> -->

            <FormItem label="接受分享领用现金券金额比例" required>
              <Tooltip trigger="focus" title="提醒" content="范围为(0~100)  (只能输入整数)" placement="right">
                <InputNumber
                  :max="100"
                  :min="0"
                  v-model="edit_info.acceptPercent"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
                 <span style="color:red">&nbsp;&nbsp; %</span>
              </Tooltip>

            </FormItem>
          </Form>
        </Card>

        <Card>
          <Alert>
            <h4>要优惠算法参数</h4>
          </Alert>
          <Form :label-width="240" inline>
             <FormItem label="前" required>
                 <Tooltip trigger="focus" title="提醒" content="只能输入整数" placement="right">
              <InputNumber
                :min="0"
                v-model="edit_info.receiveCount"
                placeholder="请输入"
                style="width:100px"
                @on-change="statusCheckChange"
              ></InputNumber>
               <span style="color:red">&nbsp;&nbsp;次</span>
                 </Tooltip>
            </FormItem>
            <FormItem label="折扣比例百分比" required>
              <Tooltip trigger="focus" title="提醒" content="范围在(0~100)  (只能输入整数)" placement="right">
                <InputNumber
                  :max="100"
                  :min="0"
                  v-model="edit_info.discountRatio"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
                   <span style="color:red">&nbsp;&nbsp; %</span>
              </Tooltip>
            </FormItem>
            <FormItem label="后续获得折扣比例百分比" required>
              <Tooltip trigger="focus" title="提醒" content="范围在(0~100)  (只能输入整数)" placement="right">
                <InputNumber
                  :max="100"
                  :min="0"
                  v-model="edit_info.laterDiscountRatio"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
                   <span style="color:red">&nbsp;&nbsp; %</span>
              </Tooltip>
            </FormItem>
            <FormItem label="随机因子" required>
              <Tooltip
                trigger="focus"
                title="提醒"
                content="范围在1±random_seed之间（0.1~0.5）"
                placement="right"
              >
                <InputNumber
                  :max="0.5"
                  :min="0.1"
                  v-model="edit_info.randomSeed"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
              </Tooltip>
            </FormItem>

            <FormItem label="最低优惠额" required>
              <Tooltip trigger="focus" title="提醒" content="单位元" placement="right">
                <InputNumber
                  :min="0"
                  v-model="edit_info.lowerDiscountAmount"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
                   <span style="color:red">&nbsp;&nbsp; 元</span>
              </Tooltip>
            </FormItem>

            <FormItem label="最高优惠额" required>
              <Tooltip trigger="focus" title="提醒" content="单位元" placement="right">
                <InputNumber
                  :min="0"
                  v-model="edit_info.upperDiscountAmount"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
                    <span style="color:red">&nbsp;&nbsp; 元</span>
              </Tooltip>
            </FormItem>

            <FormItem label="团长优惠金额放大倍数" required>
              <InputNumber
                :min="0"
                v-model="edit_info.addMultiple"
                placeholder="请输入"
                style="width:300px"
                @on-change="statusCheckChange"
              ></InputNumber>
            </FormItem>

            <FormItem :label-width="220">
              <Button
                type="primary"
                @click="editOk()"
                :loading="edit_loading"
                style="width:220px; margin-right:30px;"
                :disabled="isCheckDisabled"
              >保存</Button>
              <!-- <Button type="error"  @click="removeInfo()" style="width:180px; margin-right:30px;" v-if="status =='edit'" >删除规则</Button> -->
              <Button
                type="dashed"
                icon="md-arrow-round-back"
                @click="goback()"
                style="width:220px; margin-right:30px;"
              >返回</Button>
            </FormItem>
          </Form>
        </Card>
      </p>
    </Card>
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

import { formatDate } from "@/libs/date";

export default {
  name: "grabInfoSet",
  components: {},
  props: {
    campId: String
  },
  data() {
    return {
      edit_info: {
        campId: "",
        addMultiple: 0,
        // addOpenRequiredScore: 0,
        dailyAcceptShareTimes: 0,
        // dailyFreeOpenTimes: 0,
        dailyJoinGroupTimes: 0,
        dailyOpenTimes: 0,
        discountRatio: 0,
        groupCount: 3,
        helpAwardLower: 0,
        helpAwardUpper: 0,
        limitTime: 0,
        lowerDiscountAmount: 0,
        randomSeed: 0.1,
        // shareUseRakeBackPercent: 0,
        upperDiscountAmount: 0,
        acceptPercent: 0,
        receiveCount:0,
        laterDiscountRatio:0,
      },
      edit_loading: false,
      status: "",
      getUrl: "",
      msg: "",
      isCheckDisabled: true
    };
  },

  created: function() {
      this.init();
  },
  methods: {
    init() {
      this.updateTableList();
    },

    updateTableList() {
      const reqParams = {
        campId: this.campId
      };

      postRequest(
        "/campaginGrabInfoSet/selectCampaginGrabInfoByCampId?campId=" +
          this.campId,
        reqParams
      ).then(res => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            this.edit_info = res.data[0];

            this.edit_info.acceptPercent = this.edit_info.acceptPercent * 100;

            this.edit_info.helpAwardLower = this.edit_info.helpAwardLower * 100;
            this.edit_info.helpAwardUpper = this.edit_info.helpAwardUpper * 100;
            this.edit_info.discountRatio = parseInt(this.edit_info.discountRatio * 100);
             this.edit_info.laterDiscountRatio = this.edit_info.laterDiscountRatio * 100;
            this.edit_info.limitTime = this.edit_info.limitTime / 60;

            this.status = "edit";
          } else {
            this.edit_info = {
              campId: this.campId,
              addMultiple: 0,
              // addOpenRequiredScore: 0,
              dailyAcceptShareTimes: 0,
              // dailyFreeOpenTimes: 0,
              dailyJoinGroupTimes: 0,
              dailyOpenTimes: 0,
              discountRatio: 0,
              groupCount: 3,
              helpAwardLower: 0,
              helpAwardUpper: 0,
              limitTime: 0,
              lowerDiscountAmount: 0,
              randomSeed: 0.1,
              // shareUseRakeBackPercent: 0,
              upperDiscountAmount: 0,
              acceptPercent: 0,
              receiveCount:0,
              laterDiscountRatio:0,
            };
            this.status = "add";
          }
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    statusCheckChange() {
      this.isCheckDisabled = false;
    },

    editOk() {
      if (
        !this.edit_info.dailyOpenTimes &&
        this.edit_info.dailyOpenTimes != 0
      ) {
        this.$Message.error("每人每天开团次数不能为空");
        return;
      }
      if (!this.edit_info.acceptPercent && this.edit_info.acceptPercent != 0) {
        this.$Message.error("受邀人助力者用券后给分享者返佣比例不能为空");
        return;
      } else if (this.edit_info.acceptPercent > 100) {
        this.$Message.error(
          "受邀人助力者用券后给分享者返佣比例范围为（0～100）"
        );
        return;
      }

      if (!this.edit_info.addMultiple && this.edit_info.addMultiple != 0) {
        this.$Message.error("团长优惠金额放大倍数不能为空");
        return;
      }

      // if (
      //   !this.edit_info.addOpenRequiredScore &&
      //   this.edit_info.addOpenRequiredScore != 0
      // ) {
      //   this.$Message.error("兑换要优惠一次所需积分不能为空");
      //   return;
      // }

      if (
        !this.edit_info.dailyAcceptShareTimes &&
        this.edit_info.dailyAcceptShareTimes != 0
      ) {
        this.$Message.error("每人每天接受分享奖励限制次数不能为空");
        return;
      }

      // if (
      //   !this.edit_info.dailyFreeOpenTimes &&
      //   this.edit_info.dailyFreeOpenTimes != 0
      // ) {
      //   this.$Message.error("每人每天免费开团次数不能为空");
      //   return;
      // }

      if (!this.edit_info.discountRatio && this.edit_info.discountRatio != 0) {
        this.$Message.error("折扣比例不能为空");
        return;
      } else if (this.edit_info.discountRatio > 100) {
        this.$Message.error("折扣比例范围为（0～100）");
        return;
      }

      if (!this.edit_info.laterDiscountRatio && this.edit_info.laterDiscountRatio != 0) {
        this.$Message.error("后续折扣比例不能为空");
        return;
      } else if (this.edit_info.laterDiscountRatio > 100) {
        this.$Message.error("后续折扣比例范围为（0～100）");
        return;
      }

       if (!this.edit_info.receiveCount && this.edit_info.receiveCount != 0) {
         this.$Message.error("领取次数不能为空");
         return;
       }

      if (!this.edit_info.limitTime && this.edit_info.limitTime != 0) {
        this.$Message.error("拼团限时不能为空");
        return;
      }

      if (
        !this.edit_info.helpAwardLower &&
        this.edit_info.helpAwardLower != 0
      ) {
        this.$Message.error("助力得全场满减现金券面额下限百分比不能为空");
        return;
      } else if (this.edit_info.helpAwardLower > 100) {
        this.$Message.error(
          "助力得全场满减现金券面额下限百分比范围为（0～100）"
        );
        return;
      }

      if (
        !this.edit_info.helpAwardUpper &&
        this.edit_info.helpAwardUpper != 0
      ) {
        this.$Message.error("助力得全场满减现金券面额上限百分比不能为空");
        return;
      } else if (this.edit_info.helpAwardUpper > 100) {
        this.$Message.error(
          "助力得全场满减现金券面额上限百分比范围为（0～100）"
        );
        return;
      }

      if (this.edit_info.helpAwardLower > this.edit_info.helpAwardUpper) {
        this.$Message.error(
          "'助力得全场满减现金券面额下限百分比'不能大于'助力得全场满减现金券面额下限百分比'"
        );
        return;
      }

      // if (
      //   !this.edit_info.shareUseRakeBackPercent &&
      //   this.edit_info.shareUseRakeBackPercent != 0
      // ) {
      //   this.$Message.error("助力者用券后给分享者返佣百分比不能为空");
      //   return;
      // } else if (this.edit_info.shareUseRakeBackPercent > 100) {
      //   this.$Message.error("助力者用券后给分享者返佣百分比范围为（0～100）");
      //   return;
      // }

      if (
        !this.edit_info.lowerDiscountAmount &&
        this.edit_info.lowerDiscountAmount != 0
      ) {
        this.$Message.error("最低优惠额不能为空");
        return;
      }

      if (
        !this.edit_info.upperDiscountAmount &&
        this.edit_info.upperDiscountAmount != 0
      ) {
        this.$Message.error("最高优惠额不能为空");
        return;
      }

      if (
        this.edit_info.lowerDiscountAmount > this.edit_info.upperDiscountAmount
      ) {
        this.$Message.error("'最低优惠额'不能大于'最高优惠额'");
        return;
      }

      if (!this.edit_info.randomSeed) {
        this.$Message.error("随机因子不能为空");
        return;
      }

      if (this.status == "add") {
        this.getUrl = "/campaginGrabInfoSet/add";
        this.msg = "新增成功";
      } else {
        this.getUrl = "/campaginGrabInfoSet/edit";
        this.msg = "编辑成功";
      }

      if (!this.ruleValidate()) {
        return;
      }

      this.edit_loading = true;
      const reqParams = {
        campId: this.edit_info.campId,
        addMultiple: this.edit_info.addMultiple,
        // addOpenRequiredScore: this.edit_info.addOpenRequiredScore,
        dailyAcceptShareTimes: this.edit_info.dailyAcceptShareTimes,
        // dailyFreeOpenTimes: this.edit_info.dailyFreeOpenTimes,
        dailyJoinGroupTimes: this.edit_info.dailyJoinGroupTimes,
        dailyOpenTimes: this.edit_info.dailyOpenTimes,
        discountRatio: this.edit_info.discountRatio / 100,
        groupCount: this.edit_info.groupCount,
        helpAwardLower: this.edit_info.helpAwardLower / 100,
        helpAwardUpper: this.edit_info.helpAwardUpper / 100,
        limitTime: this.edit_info.limitTime * 60,
        lowerDiscountAmount: this.edit_info.lowerDiscountAmount,
        randomSeed: this.edit_info.randomSeed,
        // shareUseRakeBackPercent: this.edit_info.shareUseRakeBackPercent / 100,
        upperDiscountAmount: this.edit_info.upperDiscountAmount,
        acceptPercent: this.edit_info.acceptPercent / 100,
        receiveCount:  this.edit_info.receiveCount,
        laterDiscountRatio:  this.edit_info.laterDiscountRatio / 100,
      };

      postRequest(this.getUrl, reqParams).then(res => {
        this.edit_loading = false;
        if (res.code == 200) {
          this.$Message.info(this.msg);
          this.isCheckDisabled = true;
          setTimeout(() => {
            this.goback();
          }, 1200);
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    removeInfo() {
      const self = this;
      this.$Modal.confirm({
        title: "删除确认",
        content: `删除后不可恢复，是否继续删除？`,
        onOk: function() {
          const reqParams = {
            campId: self.edit_info.campId
          };

          postRequest(
            "/campaginGrabInfoSet/delete?campId=" + self.edit_info.campId,
            reqParams
          ).then(res => {
            self.loading = false;
            if (res.code == "200") {
              self.$Message.info("删除成功！");
              setTimeout(() => {
                self.goback();
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
    // 跳转列表

    goback() {
      this.$emit("changeStatus", false);
    },

    // 遍历输入框是否有小数点
    ruleValidate() {
      const edit_info1 = [
        this.edit_info.dailyOpenTimes.toString(),
        // this.edit_info.dailyFreeOpenTimes.toString(),
        this.edit_info.groupCount.toString(),
        this.edit_info.limitTime.toString(),
        this.edit_info.dailyJoinGroupTimes.toString(),
        // this.edit_info.addOpenRequiredScore.toString(),
        this.edit_info.dailyAcceptShareTimes.toString(),
        this.edit_info.helpAwardLower.toString(),
        this.edit_info.helpAwardUpper.toString(),
        // this.edit_info.shareUseRakeBackPercent.toString(),
        // this.edit_info.acceptPercent.toString(),
        this.edit_info.discountRatio.toString()
      ];
      // console.log(edit_info1);
      // return
      // let str = "" + this.edit_info.dailyOpenTimes;
      for (let i = 0; i < edit_info1.length; i++) {
        if (edit_info1[i].indexOf(".") != -1) {
          this.$Message.error("只能输入整数");
          return false;
        }
      }
      return true;
    }
  },
  mounted() {
  }
};
</script>


<style>
.form {
  width: 800px;
}
.form > div {
  display: inline-block;
}
</style>
