<template>
  <!-- <Card> -->
    <div style="margin-top: 15px;">
      <Form :model="add_info" ref="add_info" :label-width="180">
        <FormItem label="提现规则说明：" required>
          <Input type="text" v-model="add_info.cashDesc" @on-change="buttonProhibitFn" style="width:300px"/>
        </FormItem>

        <FormItem label="提现最低金额：" required>
          <InputNumber v-model="add_info.cashMin" @on-change="buttonProhibitFn" style="width:300px" :min="0"></InputNumber>&nbsp;&nbsp;元
        </FormItem>

        <FormItem label="提现阶梯：" required>
          <InputNumber v-model="add_info.cashStep" @on-change="buttonProhibitFn" style="width:300px" :min="0" disabled></InputNumber>&nbsp;&nbsp;元
        </FormItem>

        <FormItem label="每人每天最多申请提现次数：" required>
          <InputNumber v-model="add_info.dailyMaxCount" @on-change="buttonProhibitFn" style="width:300px" :min="0"></InputNumber>
        </FormItem>

        <FormItem style="{'margin-top':'54px'}">
          <Button
            type="primary"
            size="large"
            @click="saveRule"
            
            :style="{width:'230px'}"
            :disabled="buttonProhibit"
          >保存</Button>
          <!--             		<Button size="large" @click="delRule" :loading="add_loading" style="width:230px; margin-left:20px" :disabled="ruleStatus == 'add'">删除</Button >-->
        </FormItem>
      </Form>
    </div>
  <!-- </Card> -->
</template>

<script>
  import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
  } from "@/libs/axios";

  export default {
    name: "withdraw-manage",
    components: {},
    data() {
      return {
        add_info: {
          id: "",
          cashDesc: "", // 提现规则说明
          cashMin: 0, // 提现最低金额
          cashStep: 1, // 提现阶梯
          dailyMaxCount: 0 // 每人每天最多申请提现次数
        },
        ruleStatus: "add", // 编辑状态
        ruleUrl: "",
        ruleMsg: "",
        buttonProhibit: true, // 按键禁用
        // add_loading: false
      };
    },

    created: function() {
      this.getWithdrawCashRuleList();
    },

    methods: {
      // 返佣提现规则查询
      getWithdrawCashRuleList() {
        postRequest("/rule/withdrawCashRule/selectWithdrawCashRuleList").then(
          res => {
            if (res.code == 200) {
              // if (JSON.stringify(res.data) == "{}") {
              if (!res.data) {
                this.ruleStatus = "add";
                this.add_info = {
                  id: "",
                  cashDesc: "",
                  cashMin: 0,
                  cashStep: 1,
                  dailyMaxCount: 0
                };
                this.buttonProhibit = false;
              } else {
                this.ruleStatus = "edit";
                this.add_info = res.data;
                this.buttonProhibit = true;
              }
            } else {
              this.$Message.error(res.msg);
            }
          }
        );
      },

      // 返佣提现规则保存
      saveRule() {
        if (!this.ruleValidate()) {
          return;
        }

        // this.add_loading = true;
        const reqParams = {
          id: this.add_info.id,
          cashDesc: this.add_info.cashDesc,
          cashMin: this.add_info.cashMin,
          cashStep: this.add_info.cashStep,
          dailyMaxCount: this.add_info.dailyMaxCount
        };

        if (this.ruleStatus == "add") {
          this.ScoreRuleurl = "/rule/withdrawCashRule/insertWithdrawCashRule";
          this.ScoreRuleMsg = "新增成功";
          reqParams.id = 0;
        } else {
          this.ScoreRuleurl = "/rule/withdrawCashRule/updateWithdrawCashRule";
          this.ScoreRuleMsg = "编辑成功";
        }

        postRequest(this.ScoreRuleurl, reqParams).then(res => {
          // this.add_loading = false;
          if (res.code == 200) {
            this.$Message.info(this.ScoreRuleMsg);
            this.getWithdrawCashRuleList();
            //        this.isAddDisabled = true;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      //	delRule() {
      //		var _this = this;
      //    this.$Modal.confirm({
      //      title: '提示',
      //      content: '<p>确定要删除吗？</p>',
      //      onOk: ()=> {
      //
      //       	 postRequest("/rule/withdrawCashRule/deleteWithdrawCashRuleByID?id="+ this.add_info.id).then(res => {
      //            if(res.code == 200) {
      //              this.$Message.info('删除成功')
      //       		this.getWithdrawCashRuleList();
      //            } else {
      //              this.$Message.error(res.msg)
      //            }
      //        })
      //
      //      },
      //      onCancel:  ()=> {
      //         this.$Message.info('删除已取消')
      //      }
      //    });
      //	},

      ruleValidate() {
        if (!this.add_info.cashDesc) {
          this.$Message.error("提现规则说明不能为空！");
          return false;
        }

        if (!this.add_info.cashMin) {
          this.$Message.error("提现最低金额不能为空！");
          return false;
        }

        if (!this.add_info.cashStep) {
          this.$Message.error("提现阶梯不能为空！");
          return false;
        }

        if (!this.add_info.dailyMaxCount) {
          this.$Message.error("每人每天最多申请提现次数不能为空！");
          return false;
        }
        return true;
      },

      //保存按钮显示隐藏
      buttonProhibitFn() {
        this.buttonProhibit = false;
      },

      init() {}
    },
    mounted() {
      this.init();
    }
  };
</script>
