<template>
  <div>
    <Card>
      <div style="margin-top: 15px;">
        <Form ref="addData" :model="addData" :label-width="120">
          <FormItem label="活动名称:" required>
            <Input
                    type="text"
                    v-model="addData.name"
                    placeholder="请输入活动名称"
                    style="width:300px"
                    @on-change="buttonProhibitFn"
            />
          </FormItem>

          <FormItem label="签到周期天数:" required>
            <InputNumber
                    type="text"
                    v-model="addData.cycleDays"
                    placeholder="例如5天，达到签到周期给对应奖励"
                    style="width:300px"
                    :max="9999"
                    :min="1"
                    @on-change="buttonProhibitFn"
            />&nbsp;&nbsp;天
            <div style="color:red;height:24px">例如5天，达到签到周期给对应奖励</div>
          </FormItem>

          <FormItem label="连续签到奖励:" required>
            <div>
              第一天
              <InputNumber
                      type="text"
                      v-model="addData.signinRewardContent.cycle1"
                      placeholder="请输入正整数"
                      style="width:100px"
                      :max="9999"
                      :min="1"
                      @on-change="buttonProhibitFn"
              />&nbsp;&nbsp;U贝
            </div>
            <div>
              第二天
              <InputNumber
                      type="text"
                      v-model="addData.signinRewardContent.cycle2"
                      placeholder="请输入正整数"
                      style="width:100px"
                      :max="9999"
                      :min="1"
                      @on-change="buttonProhibitFn"
              />&nbsp;&nbsp;U贝
            </div>
            <div>
              第三天
              <InputNumber
                      type="text"
                      v-model="addData.signinRewardContent.cycle3"
                      placeholder="请输入正整数"
                      style="width:100px"
                      :max="9999"
                      :min="1"
                      @on-change="buttonProhibitFn"
              />&nbsp;&nbsp;U贝
            </div>
            <div>
              第四天
              <InputNumber
                      type="text"
                      v-model="addData.signinRewardContent.cycle4"
                      placeholder="请输入正整数"
                      style="width:100px"
                      :max="9999"
                      :min="1"
                      @on-change="buttonProhibitFn"
              />&nbsp;&nbsp;U贝
            </div>
            <div>
              第五天
              <InputNumber
                      type="text"
                      v-model="addData.signinRewardContent.cycle5"
                      placeholder="请输入正整数"
                      style="width:100px"
                      :max="9999"
                      :min="1"
                      @on-change="buttonProhibitFn"
              />&nbsp;&nbsp;U贝
            </div>
            <div style="color:red;height:24px">奖励U贝值仅能是正整数</div>
          </FormItem>


          <FormItem label="活动有效期类型:" required>
            <Select
                    v-model="addData.dateType"
                    style="width:300px"
                    @on-change="buttonProhibitFn"
                    disabled
            >
              <Option value="1">固定日期时间范围有效</Option>
              <Option value="2">永久有效</Option>
            </Select>
          </FormItem>

          <Form-item label="开始时间：" v-if="addData.dateType == 1" required>
            <DatePicker
                    type="date"
                    placeholder="选择开始日期"
                    style="width: 250px"
                    @on-change="time1"
                    format="yyyy-MM-dd"
                    :value="addData.startDate"
                    @on-clear="clearTime1"
            ></DatePicker>
          </Form-item>

          <Form-item label="结束时间：" v-if="addData.dateType == 1" required>
            <DatePicker
                    type="date"
                    placeholder="选择结束日期"
                    style="width: 250px"
                    @on-change="time2"
                    format="yyyy-MM-dd"
                    :value="addData.endDate"
                    @on-clear="clearTime2"
            ></DatePicker>
          </Form-item>

          <FormItem label="状态:" required>
            <Select v-model="addData.status" style="width:300px" @on-change="buttonProhibitFn">
              <Option value="0">创建</Option>
              <Option value="1">启用</Option>
            </Select>
          </FormItem>

          <FormItem label="备注:" required>
            <Input
                    v-model="addData.remark"
                    @on-change="buttonProhibitFn"
                    type="textarea"
                    :rows="10"
                    style="width:300px"
            ></Input>
          </FormItem>

          <FormItem style="{'margin-top':'54px'}">
            <Alert type="warning" show-icon style="width:300px" v-if="buttonProhibit">修改后才能保存</Alert>
            <Button
                    type="primary"
                    size="large"
                    :style="{width:'300px'}"
                    @click="addEditRebateRule"
                    :disabled="buttonProhibit"
            >保存</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>
<script>
    import { getCheckInData, addCheckInData, editCheckInData } from "@/api/sys";
    export default {
        components: {},
        name: "timed-task",
        data() {
            return {
                addData: {
                    cycleDays: null, // 签到周期天数，例如5天，达到签到周期给对应奖励，目前是奖励send_channel=3的优惠券
                    dateType: "2", // 活动有效期类型：1.固定日期时间范围有效；2.永久有效；目前固定选择2
                    endDate: "", // 结束时间，当dateType=1时填写
                    name: "", // 活动名称
                    remark: "", // 备注
                    // signinRuleId: 0, // 签到活动规则id --- (修改时才有)
                    startDate: "", // 开始时间，当dateType=1时填写；
                    status: "" ,// 0.创建；1.启用；
                    signinRewardContent:{"cycle1":null,"cycle2":null,"cycle3":null,"cycle4":null,"cycle5":null},
                },
                addEdit: "", // 新增或者编辑，1：新增，2：编辑
                delDisplay: false, // 删除对话框显示
                buttonProhibit: true, // 按键禁用
                signinRuleId: "" //签到活动规则id
            };
        },
        created: function() {
            this.getList();
        },
        methods: {
            // 渲染列表
            getList() {
                getCheckInData().then(res => {
                    //console.log(res);
                    if (res.code == 200) {
                        if (res.data) {
                            this.addData.cycleDays = res.data.cycleDays;
                            this.addData.dateType = res.data.dateType.toString();
                            this.addData.endDate = res.data.endDate;
                            this.addData.name = res.data.name;
                            this.addData.remark = res.data.remark;
                            this.addData.startDate = res.data.startDate;
                            this.addData.status = res.data.status.toString();
                            if(res.data.signinRewardContent){
                                this.addData.signinRewardContent = JSON.parse(res.data.signinRewardContent);
                            }
                            this.signinRuleId = res.data.signinRuleId;

                            this.addEdit = "2";
                            this.buttonProhibit = true;
                        } else {
                            this.addEdit = "1";
                            this.buttonProhibit = false;
                        }
                    } else {
                        this.msgErr(res.msg);
                    }
                });
            },

            // 添加\编辑
            addEditRebateRule() {
                // 验证
                if (this.addData.name == "") {
                    this.msgErr("活动名不能为空");
                    return;
                }
                if (this.addData.cycleDays == null) {
                    this.msgErr("签到周期天数不能为空");
                    return;
                }

                if(!this.addData.signinRewardContent.cycle1||!this.addData.signinRewardContent.cycle2||!this.addData.signinRewardContent.cycle3||!this.addData.signinRewardContent.cycle4||!this.addData.signinRewardContent.cycle5){
                    this.msgErr("连续签到奖励不能为空");
                    return;
                }

                if (this.addData.dateType == "") {
                    this.msgErr("活动有效期类型没有选择");
                    return;
                }

                if (this.addData.dateType == "1") {
                    if (this.addData.startDate == "") {
                        this.msgErr("开始时间没有选择");
                        return;
                    }
                    if (this.addData.endDate == "") {
                        this.msgErr("结束时间没有选择");
                        return;
                    }
                }

                if (this.addData.status == "") {
                    this.msgErr("状态没有选择");
                    return;
                }

                // console.log(this.addData);
                // return

                if (this.addEdit == 1) {
                    // 新增
                    addCheckInData(this.addData).then(res => {
                        if (res.code == 200) {
                            this.msgOk("保存成功");
                            this.addRebateRuleDisplay = false;
                            // this.resettingFrom();
                            this.getList();
                        } else {
                            this.msgErr(res.msg);
                        }
                    });
                } else {
                    // 编辑
                    // console.log('编辑');
                    let data = this.addData;
                    data.signinRuleId = this.signinRuleId;
                    editCheckInData(data).then(res => {
                        if (res.code == 200) {
                            this.msgOk("保存成功");
                            this.addRebateRuleDisplay = false;
                            // this.resettingFrom();
                            this.getList();
                        } else {
                            this.msgErr(res.msg);
                        }
                    });
                }
            },

            // 重置add表单
            resettingFrom() {
                this.addData.dailyHelpRakeBackLimit = "";
                this.addData.dailyRakeBackLimit = "";
                this.addData.rakeBackType = "1";
                this.addData.id = "";
                this.addData.rakeBakeDesc = "";
            },

            // 删除对话框
            delModal() {
                this.$Modal.confirm({
                    title: "提示",
                    content: "<p>确定要删除吗？</p>",
                    onOk: () => {
                        this.delData();
                    },
                    onCancel: () => {
                        this.msgOk("运营位删除已取消");
                    }
                });
            },

            // 删除
            delData() {
                delRebateRule(this.addData.id).then(res => {
                    // console.log(res);
                    if (res.code == 200) {
                        this.msgOk("删除成功");
                        this.resettingFrom();
                        this.getList();
                    } else {
                        this.msgErr(res.msg);
                    }
                });
            },

            //保存按钮显示隐藏
            buttonProhibitFn() {
                this.buttonProhibit = false;
            },

            // 时间过滤
            time1(e) {
                // console.log(e);
                if (e) {
                    let time = e.slice(0, 10) + " " + "00:00:00";
                    this.addData.startDate = time;
                }
            },
            clearTime1() {
                this.addData.startDate = "";
            },
            time2(e) {
                // console.log(e);
                if (e) {
                    let time = e.slice(0, 10) + " " + "23:59:59";
                    this.addData.endDate = time;
                }
            },
            clearTime2() {
                this.addData.endDate = "";
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

  .check {
    span {
      width: 100px;
      display: inline-block;
      font-size: 16px;
    }
  }
</style>
