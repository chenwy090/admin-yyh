<template>
  <div>
    <Card>
      <Tabs value="name1" :animated="false">
        <!-- 返佣规则管理 -->
        <TabPane label="返佣规则" name="name1">
          <div style="margin-top: 15px;">
            <Form ref="addData" :model="addData" :label-width="180">
              <FormItem label="每人每天帮助返佣次数:" required>
                <Input
                  type="text"
                  v-model="addData.dailyHelpRakeBackLimit"
                  placeholder="0表示不限制"
                  style="width:300px"
                  @on-change="buttonProhibitFn"
                />
              </FormItem>

              <FormItem label="每人每天获得返佣次数:" required>
                <Input
                  v-model="addData.dailyRakeBackLimit"
                  placeholder="0表示不限制"
                  style="width:300px"
                  @on-change="buttonProhibitFn"
                ></Input>
              </FormItem>

              <FormItem label="返佣行为类型:" required>
                <Select
                  v-model="addData.rakeBackType"
                  style="width:300px"
                  @on-change="buttonProhibitFn"
                  clearable
                >
                  <Option value="1">核销返佣</Option>
                </Select>
              </FormItem>

              <FormItem label="返佣说明:" required>
                <Input
                  v-model="addData.rakeBakeDesc"
                  @on-change="buttonProhibitFn"
                  type="textarea"
                  :rows="10"
                  style="width:300px"
                ></Input>
              </FormItem>

              <FormItem style="{'margin-top':'54px'}">
                <Button
                  type="primary"
                  size="large"
                  :style="{width:'300px'}"
                  @click="addEditRebateRule"
                  :disabled="buttonProhibit"
                >保存</Button>
                <!-- <Button
              type="error"
              size="large"
              style="width:135px;margin-left:30px"
              @click="delModal"
              v-if="addEdit == 2"
                >删除</Button>-->
                <!-- <Button
              type="error"
              size="large"
              style="width:135px;margin-left:30px"
              disabled
              v-else-if="addEdit == 1"
                >删除</Button>-->
              </FormItem>
            </Form>
          </div>
        </TabPane>
        <!-- 返佣规则管理 -->
        <!-- 提现规则 -->
        <TabPane label="返佣提现" name="name2">
          <withdraw-management></withdraw-management>
        </TabPane>
        <!-- 提现规则 -->
      </Tabs>
    </Card>
  </div>
</template>
<script>
  import {
    getRebateRule,
    addRebateRule,
    editRebateRule,
    delRebateRule
  } from "@/api/sys";
  import withdrawManagement from "./withdraw-management/withdrawManagement";
  export default {
    components: {
      withdrawManagement
    },
    name: "timed-task",
    data() {
      return {
        addData: {
          dailyHelpRakeBackLimit: "", // 每人每天帮助返佣M次，0表示不限制
          dailyRakeBackLimit: "", // 每人每天获得返佣次数N次，0表示不限制
          rakeBackType: "1", // 返佣行为类型：1.核销返佣；以后其他返佣待补充
          id: "",
          rakeBakeDesc: "" // 返佣说明：描述如何获取佣金
        },
        addEdit: "", // 新增或者编辑，1：新增，2：编辑
        delDisplay: false, // 删除对话框显示
        buttonProhibit: true // 按键禁用
      };
    },
    created: function() {
      this.getList();
    },
    methods: {
      // 渲染列表
      getList() {
        getRebateRule().then(res => {
          //console.log(res);
          if (res.code == 200) {
            if (res.data) {
              this.addData.dailyHelpRakeBackLimit = res.data.dailyHelpRakeBackLimit;
              this.addData.dailyRakeBackLimit = res.data.dailyRakeBackLimit.toString();
              this.addData.rakeBackType = res.data.rakeBackType.toString();
              this.addData.rakeBakeDesc = res.data.rakeBakeDesc.toString();
              this.addData.id = res.data.id;
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
        if (
          !this.addData.dailyHelpRakeBackLimit ||
          this.addData.dailyHelpRakeBackLimit.length > 10
        ) {
          this.msgErr("帮助返佣次数不能为空，并且小于11个");
          return;
        }
        if (
          !this.addData.dailyRakeBackLimit ||
          this.addData.dailyRakeBackLimit.length > 10
        ) {
          this.msgErr("获得返佣次数不能为空，并且小于11个");
          return;
        }

        if (this.addEdit == 1) {
          // 新增
          this.addData.id = 1;
          addRebateRule(this.addData).then(res => {
            if (res.code == 200) {
              this.msgOk("新增成功");
              this.addRebateRuleDisplay = false;
              // this.resettingFrom();
              this.getList();
            } else {
              this.msgErr(res.msg);
            }
          });
        } else {
          // 编辑
          editRebateRule(this.addData).then(res => {
            if (res.code == 200) {
              this.msgOk("编辑成功");
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