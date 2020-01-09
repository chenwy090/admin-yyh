<template>
  <!-- 领优惠---规则设置 -->
  <div class="search">
    <Card>
      <p slot="title">要优惠----拼团设置</p>

      <!-- <a href="#" slot="extra"  style="margin-right: 40px">
              <Button type="error"  @click="removeInfo()"  v-if="status =='edit'" >删除拼团设置</Button>
      </a>-->
      <a href="#" slot="extra">
        <Button type="dashed" icon="md-arrow-round-back" @click="goback">返回</Button>
      </a>

      <p>
        <Alert show-icon>
          活动ID:
          <span style="color:red"
            >{{ edit_info.campId }} &nbsp;&nbsp;提示：仅保留”每人每天开团次数“设置，其他功能暂不生效</span
          >
          <span slot="desc"></span>
        </Alert>

        <Form :label-width="240" ref="formValite" :model="edit_info" :rules="formValite">
          <Card>
            <FormItem label="每人每天开团次数" prop="dailyOpenTimes" :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }">
              <Tooltip trigger="focus" title="提醒" content="只能输入整数" placement="right">
                <InputNumber
                  :min="0"
                  v-model="edit_info.dailyOpenTimes"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
              </Tooltip>
              <span style="color:red">&nbsp;&nbsp;次</span>
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
            </FormItem>-->

            <FormItem label="成团人数" prop="groupCount" :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }">
              <Tooltip trigger="focus" title="提醒" content="只能输入整数" placement="right">
                <InputNumber
                  :min="0"
                  v-model="edit_info.groupCount"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                  disabled
                ></InputNumber>
                <span style="color:red">&nbsp;&nbsp;人</span>
              </Tooltip>
            </FormItem>

            <FormItem label="拼团限时(分钟)" prop="limitTime" :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }">
              <Tooltip
                trigger="focus"
                title="提醒"
                content="单位为(分钟),范围为(0~60)  (只能输入整数)"
                placement="right"
              >
                <InputNumber
                  :min="1"
                  :max="60"
                  v-model="edit_info.limitTime"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
                <span style="color:red">&nbsp;&nbsp;分钟</span>
              </Tooltip>
            </FormItem>

            <FormItem label="每人每天参团限制次数" prop="dailyJoinGroupTimes" :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }">
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
            </FormItem>-->

            <FormItem label="每人每天接受分享奖励限制次数" prop="dailyAcceptShareTimes" :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }">
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

            <FormItem label="助力得全场满减现金券面额下限百分比" prop="helpAwardLower" :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }">
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

            <FormItem label="助力得全场满减现金券面额上限百分比" prop="helpAwardUpper" :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }">
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
            </FormItem>-->

            <FormItem label="接受分享领用现金券金额比例" prop="acceptPercent" :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }">
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
        </Card>

        <Card style="margin-top:1vh;">
          <Alert>
            <h4>要优惠算法参数</h4>
          </Alert>
            <Form ref="formValite2" :label-width="100">
              <div v-for="(item, index) in levelRatio" :key="index" style="display: flex;justify-content: flex-start;">
                <FormItem prop="numberEnd" >
                  <span>{{ item.numberStart }}--</span>
                  <InputNumber
                    v-model="item.numberEnd"
                    placeholder="请输入"
                    style="width:120px"
                    :min="item.numberStart + 1"
                    :disabled="index !== levelRatio.length - 1"
                    @on-change="
                      statusCheckChange();
                      discountRatioChange(index);
                    "
                  ></InputNumber>
                  <span>次 </span>
                </FormItem>
                <FormItem
                  :label="'折扣比例百分比'"
                  :label-width="120"
                  prop="ratio"
                >
                  <InputNumber
                    :max="100"
                    :min="0"
                    :disabled="index !== levelRatio.length - 1"
                    v-model="item.ratio"
                    placeholder="请输入"
                    style="width:150px"
                    @on-change="statusCheckChange"
                  ></InputNumber>
                  <span style="color:red">&nbsp;&nbsp; %</span>
                </FormItem>
                <FormItem
                  :label="'倍数'"
                  :label-width="60"
                  prop="times"

                >
                  <InputNumber
                    :min="0"
                    :step="0.1"
                    :disabled="index !== levelRatio.length - 1"
                    v-model="item.times"
                    placeholder="请输入"
                    style="width:150px"
                    @on-change="statusCheckChange"
                  ></InputNumber>
                </FormItem>
                <div v-if="index === 0">
                  <Icon
                    @click="
                      discountRatioAdd();
                      statusCheckChange();
                    "
                    class="tag-add"
                    size="30"
                    color="#2d8cf0"
                    type="ios-add-circle-outline"
                  />
                </div>

                <div v-if="index === levelRatio.length - 1 && index !== 0">
                  <Icon
                    @click="
                      discountRatioRemove(index);
                      statusCheckChange();
                    "
                    class="tag-remove"
                    size="30"
                    color="#ffb08f"
                    type="ios-remove-circle-outline"
                  />
                </div>
              </div>
            </Form>


            <div style="display: flex;justify-content: flex-start;padding-top:10px;">
              <FormItem
                label="后续获得折扣比例百分比"
                prop="laterDiscountRatio"
                :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
              >
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
              <FormItem
                :label="'每隔'"
                :label-width="70"
                prop="laterDiscountSpace"
                :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
              >
                <InputNumber
                  :min="0"
                  v-model="edit_info.laterDiscountSpace"
                  placeholder="请输入"
                  style="width:150px"
                  @on-change="statusCheckChange"
                ></InputNumber>
              </FormItem>
              <FormItem
                :label="'次后倍数'"
                :label-width="100"
                prop="laterDiscountTimes"
                :rules="{ required: true, validator: checkIsPositiveIntegerEx02 }"
              >
                <InputNumber
                  :min="0"
                  :step="0.1"
                  v-model="edit_info.laterDiscountTimes"
                  placeholder="请输入"
                  style="width:150px"
                  @on-change="statusCheckChange"
                ></InputNumber>
              </FormItem>
            </div>
            <!--  -->

            <FormItem
              label="随机因子"
              prop="randomSeed"
              :rules="{ required: true, validator: checkIsPositiveIntegerEx02 }"
            >
              <Tooltip trigger="focus" title="提醒" content="范围在1±random_seed之间（0.1~0.5）" placement="right">
                <InputNumber
                  :max="0.5"
                  :min="0.1"
                  :step="0.1"
                  v-model="edit_info.randomSeed"
                  placeholder="请输入"
                  style="width:300px"
                  @on-change="statusCheckChange"
                ></InputNumber>
              </Tooltip>
            </FormItem>

            <FormItem
              label="最低优惠额"
              prop="lowerDiscountAmount"
              :rules="{ required: true, validator: checkIsPositiveIntegerEx02 }"
            >
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

            <FormItem
              label="最高优惠额"
              prop="upperDiscountAmount"
              :rules="{ required: true, validator: checkIsPositiveIntegerEx02 }"
            >
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

            <FormItem
              label="团长优惠金额放大倍数"
              prop="addMultiple"
              :rules="{ required: true, validator: checkIsPositiveIntegerEx02 }"
            >
              <InputNumber
                :min="0"
                v-model="edit_info.addMultiple"
                placeholder="请输入"
                style="width:300px"
                @on-change="statusCheckChange"
              ></InputNumber>
            </FormItem>

            <FormItem
              label="最终最大金额"
              prop="mostDiscount"
              :rules="{ required: true, validator: checkIsPositiveIntegerEx02 }"
            >
              <InputNumber
                :step="0.1"
                :min="0"
                v-model="edit_info.mostDiscount"
                placeholder="请输入"
                style="width:300px"
                @on-change="statusCheckChange"
              ></InputNumber>
              <span>&nbsp;&nbsp; 元</span>
              <span style="color:red">（最多不超过5元）</span>
            </FormItem>

            <FormItem :label-width="220">
              <Button
                type="primary"
                @click="editOk()"
                :loading="edit_loading"
                style="width:220px; margin-right:30px;"
                :disabled="isCheckDisabled"
                >保存</Button
              >
              <!-- <Button type="error"  @click="removeInfo()" style="width:180px; margin-right:30px;" v-if="status =='edit'" >删除规则</Button> -->
              <Button type="dashed" icon="md-arrow-round-back" @click="goback" style="width:220px; margin-right:30px;"
                >返回</Button
              >
            </FormItem>

          <row>
            特定barcode金额：
            <!-- 排序导入  排序导出 -->
            <Button type="success" class="marginLeft20" @click="download">{{ edit_info.fileName }}</Button>
            <Button type="success" class="marginLeft20" @click="upload">上传</Button>

            <!-- @refresh="queryTableData" -->
            <FileImport
              :campId="campId"
              v-if="showFileImport"
              :showFileImport.sync="showFileImport"
              @refresh="uploadFileName"
            ></FileImport>
          </row>
        </Card>
        </Form>


      </p>
    </Card>
  </div>
</template>

<script>
import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest, downloadSteam } from "@/libs/axios";

import { formatDate } from "@/libs/date";
import FileImport from "./FileImport";

export default {
  name: "grabInfoSet",
  components: { FileImport },
  props: {
    campId: String,
  },
  data() {
    return {
      showFileImport: false,
      edit_info: {
        campId: "",

        // addOpenRequiredScore: 0,
        dailyAcceptShareTimes: 0,
        // dailyFreeOpenTimes: 0,
        dailyJoinGroupTimes: 0,
        dailyOpenTimes: 0,

        groupCount: 3,
        helpAwardLower: 0,
        helpAwardUpper: 0,
        limitTime: 0,
        // shareUseRakeBackPercent: 0,
        acceptPercent: 0,
        fileName: "",

        addMultiple: 0,
        upperDiscountAmount: 0,
        lowerDiscountAmount: 0,
        randomSeed: 0.1,
        laterDiscountRatio: 0,
        // discountRatio: 0,
        // receiveCount: 0,
      },
      levelRatio: [
        {
          numberStart: 1,
          numberEnd: 1,
          ratio: 0,
          times: 1,
        },
      ],
      edit_loading: false,
      status: "",
      getUrl: "",
      msg: "",
      isCheckDisabled: true,
      formValite: {},
    };
  },

  created() {
    this.init();
  },
  methods: {
    checkIsPositiveIntegerEx0(rule, value, callback) {
      var reg = /^([0-9][0-9]*)$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于等于0的正整数"));
      }
    },
    checkIsPositiveIntegerEx02(rule, value, callback) {
      if (value > 0) {
        callback();
      } else {
        callback(new Error("请输入大于0的数"));
      }
    },
    uploadFileName(filename) {
      this.edit_info.fileName = filename;
    },
    upload() {
      this.showFileImport = true;
      console.log(this.campId);
    },
    async download() {
      const url = "/campaginGrabInfoSet/download/barcodeToMoney";

      const res = await downloadSteam(url, { campId: this.campId });
      const content = res.data;
      const { filename } = res.headers;

      const blob = new Blob([content], { type: "application/vnd.ms-excel" });
      const oA = document.createElement("a");
      if ("download" in oA) {
        // 非IE下载
        oA.download = decodeURI(filename);
        oA.style.display = "none";
        oA.href = URL.createObjectURL(blob);
        document.body.appendChild(oA);
        oA.click();
        URL.revokeObjectURL(oA.href); // 释放URL 对象
        document.body.removeChild(oA);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, filename);
      }
    },
    init() {
      this.updateTableList();
    },

    updateTableList() {
      const reqParams = {
        campId: this.campId,
      };
      const url = `/campaginGrabInfoSet/selectCampaginGrabInfoByCampId?campId=${this.campId}`;

      postRequest(url, reqParams).then(res => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            this.edit_info = res.data[0];

            this.edit_info.acceptPercent = this.edit_info.acceptPercent * 100;

            this.edit_info.helpAwardLower = this.edit_info.helpAwardLower * 100;
            this.edit_info.helpAwardUpper = this.edit_info.helpAwardUpper * 100;
            this.edit_info.discountRatio = parseInt(this.edit_info.discountRatio * 100);
            this.edit_info.laterDiscountRatio = this.edit_info.laterDiscountRatio * 100;
            this.edit_info.limitTime = this.edit_info.limitTime / 60;

            // TODO
            let levelRatio = JSON.parse(this.edit_info.levelRatio);
            if (levelRatio) {
              let count = 0;
              let numberStart = 1;
              this.levelRatio = levelRatio.map(item => {
                count = item.receiveCount;
                let obj = {
                  numberStart: numberStart,
                  numberEnd: count,
                  ratio: item.ratio * 100,
                  times: item.times,
                };
                numberStart = count + 1;
                return obj;
              });
            }
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
              receiveCount: 0,
              laterDiscountRatio: 0,
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
      if (!this.edit_info.dailyOpenTimes && this.edit_info.dailyOpenTimes != 0) {
        this.$Message.error("每人每天开团次数不能为空");
        return;
      }
      if (!this.edit_info.acceptPercent && this.edit_info.acceptPercent != 0) {
        this.$Message.error("受邀人助力者用券后给分享者返佣比例不能为空");
        return;
      } else if (this.edit_info.acceptPercent > 100) {
        this.$Message.error("受邀人助力者用券后给分享者返佣比例范围为（0～100）");
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

      if (!this.edit_info.dailyAcceptShareTimes && this.edit_info.dailyAcceptShareTimes != 0) {
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

      if (!this.edit_info.helpAwardLower && this.edit_info.helpAwardLower != 0) {
        this.$Message.error("助力得全场满减现金券面额下限百分比不能为空");
        return;
      } else if (this.edit_info.helpAwardLower > 100) {
        this.$Message.error("助力得全场满减现金券面额下限百分比范围为（0～100）");
        return;
      }

      if (!this.edit_info.helpAwardUpper && this.edit_info.helpAwardUpper != 0) {
        this.$Message.error("助力得全场满减现金券面额上限百分比不能为空");
        return;
      } else if (this.edit_info.helpAwardUpper > 100) {
        this.$Message.error("助力得全场满减现金券面额上限百分比范围为（0～100）");
        return;
      }

      if (this.edit_info.helpAwardLower > this.edit_info.helpAwardUpper) {
        this.$Message.error("'助力得全场满减现金券面额下限百分比'不能大于'助力得全场满减现金券面额下限百分比'");
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

      if (this.edit_info.mostDiscount > 5) {
        this.$Message.error("最终最大金额不能大于5元");
        return;
      }

      let validate = [
        {
          bo: true,
          msg: '阶梯次数不能为小于0'
        },
        {
          bo: true,
          msg: '阶梯折扣比例百分比范围只能0~100的整数'
        },
        {
          bo: true,
          msg: '阶梯倍数不能为小于0'
        },
      ]
      this.levelRatio.forEach(item => {
        if(item.numberEnd <= 0) validate[0].bo = false;
        if(item.ratio <= 0) validate[1].bo = false;
        if(item.times <= 0) validate[2].bo = false;
      })

      for (let index = 0; index < validate.length; index++) {
        const item = validate[index];
        if(!item.bo){
          this.$Message.error(item.msg);
          return
        }
      }

      this.$refs["formValite"].validate(valid => {
        if (!valid) return;

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

        let levelRatio = this.levelRatio.map(item => {
          return {
            receiveCount: item.numberEnd,
            ratio: item.ratio / 100,
            times: item.times,
          };
        });
        const reqParams = {
          campId: this.edit_info.campId,
          addMultiple: this.edit_info.addMultiple,
          // addOpenRequiredScore: this.edit_info.addOpenRequiredScore,
          dailyAcceptShareTimes: this.edit_info.dailyAcceptShareTimes,
          // dailyFreeOpenTimes: this.edit_info.dailyFreeOpenTimes,
          dailyJoinGroupTimes: this.edit_info.dailyJoinGroupTimes,
          dailyOpenTimes: this.edit_info.dailyOpenTimes,

          groupCount: this.edit_info.groupCount,
          helpAwardLower: this.edit_info.helpAwardLower / 100,
          helpAwardUpper: this.edit_info.helpAwardUpper / 100,
          limitTime: this.edit_info.limitTime * 60,
          lowerDiscountAmount: this.edit_info.lowerDiscountAmount,
          randomSeed: this.edit_info.randomSeed,
          // shareUseRakeBackPercent: this.edit_info.shareUseRakeBackPercent / 100,
          upperDiscountAmount: this.edit_info.upperDiscountAmount,
          acceptPercent: this.edit_info.acceptPercent / 100,
          receiveCount: this.edit_info.receiveCount,
          // discountRatio: this.edit_info.discountRatio / 100,
          discountRatio: this.edit_info.laterDiscountRatio / 100,
          laterDiscountRatio: this.edit_info.laterDiscountRatio / 100,

          laterDiscountSpace: this.edit_info.laterDiscountSpace,
          laterDiscountTimes: this.edit_info.laterDiscountTimes,
          mostDiscount: this.edit_info.mostDiscount,

          levelRatio: JSON.stringify(levelRatio), //阶段折扣
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
      });
    },

    removeInfo() {
      const self = this;
      this.$Modal.confirm({
        title: "删除确认",
        content: `删除后不可恢复，是否继续删除？`,
        onOk: function() {
          const reqParams = {
            campId: self.edit_info.campId,
          };

          postRequest("/campaginGrabInfoSet/delete?campId=" + self.edit_info.campId, reqParams).then(res => {
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
        },
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
        this.edit_info.discountRatio.toString(),
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
    },
    // 要优惠算法参数 相关方法
    discountRatioAdd() {
      if (this.levelRatio.length >= 10) {
        this.$Message.info("多阶段奖励最多设置十档");
        return;
      }
      this.levelRatio.push({
        numberStart: 0,
        numberEnd: 0,
        ratio: 0,
        times: 1,
      });
      this.discountRatioChange();
    },
    discountRatioRemove(index) {
      this.levelRatio.splice(index, 1);
      this.discountRatioChange(index);
    },
    discountRatioChange(index = 0) {
      let len = this.levelRatio.length;
      for (let i = index; i < len; i++) {
        let item = this.levelRatio[i];
        if (i + 1 < len) {
          let item2 = this.levelRatio[i + 1];
          item2.numberStart = item.numberEnd + 1;
          if (item2.numberEnd === 0) item2.numberEnd = item2.numberStart + 1;
        }
      }
    },
    blurChangeNumber(item, key, min = 0) {
      if (item) {
        item[key] < min ? (item[key] = min) : item[key];
      }
    },
  },
  mounted() {},
};
</script>

<style>
.form {
  width: 800px;
}
.form > div {
  display: inline-block;
}
.tag-add,
.tag-remove {
  cursor: pointer;
}
</style>
