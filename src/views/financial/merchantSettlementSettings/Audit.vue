<template>
  <div class="xxx">
    <!-- 审核 audit     -->
    <div class="audit">
      <Form
        label-position="right"
        ref="form"
        :model="formData"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem label="审核结果：" prop="status">
          <RadioGroup v-model="formData.status">
            <Radio v-for="(v,k) in examineStatusOption" :key="k" :label="k">{{ v }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="原因："
          prop="reason"
          :rules="{ required: formData.status == 2?true:false,validator:formData.status == 2?validateReason:null }"
        >
          <Row>
            <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="最多100个汉字" placement="right">
                <Input
                  v-model="formData.reason"
                  type="textarea"
                  style="width:300px"
                  :autosize="{minRows: 4,maxRows: 8}"
                  :placeholder="reasonPlaceholder"
                  :maxlength="100"
                />
              </Tooltip>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>
    <div>
      <Button type="error" size="large" @click="check('form')">确认</Button>
      <Button @click="cancelHandleReset('form')" style="margin-left: 8px">取消</Button>
    </div>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";

export default {
  name: "reward-u",
  components: {},
  watch: {
    ["formData.status"]() {
      const status = this.formData.status;
      const arr = ["", "请输入通过原因", "请输入100字以内未通过原因"];
      this.reasonPlaceholder = arr[status];
      //清空验证
      if (status == 1) {
        this.$refs.form.resetFields();
      }

      console.log("reasonPlaceholder", status, this.reasonPlaceholder);
    }
  },
  data() {
    return {
      //审核
      examineModal: false,
      // 审核状态 1-审核通过 2-审核不通过
      examineStatusOption: {
        "1": "通过",
        "2": "未通过"
      },
      // 请输入50字以内未通过原因
      reasonPlaceholder: "请输入通过原因",
      formData: {
        status: "1",
        reason: ""
      },
      ruleValidate: {},
      //审核 status examineType ： “待审核、已通过、未通过” 默认显示“请选择”。  审核状态status 0-待审核 1-审核通过 2-审核失败
      statusOption: {
        "0": "待审核",
        "1": "已通过",
        "2": "未通过"
      }
    };
  },
  created() {
    // console.log("okkk", this.msgOk);
  },
  methods: {
    formModalChange(flag) {
      if (!flag) {
        //清空form表单数据
        this.formData = {
          status: "1",
          reason: ""
        };
      }
    },
    validateReason(rule, value, callback) {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("审核原因不能为空"));
      } else if (value.length >= 50) {
        callback(new Error("请输入50字以内的字符"));
      } else {
        callback();
      }
    },

    examine(row) {
      this.examineModal = true;
      this.id = row.id;
      // 审核状态 1-审核通过 2-审核不通过
    },
    check(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          // 审核
          const url = "/trade/merchant/account/setting/audit";
          const { code, msg } = await postRequest(url, {
            id: this.id,
            ...this.formData
          });

          if (code == 200) {
            this.msgOk("审核成功");
            this.queryTableData();
            this.cancelHandleReset(name);
          } else {
            this.msgErr(msg);
          }
        }
      });
    },

    // 审核-------------------------------------
    cancelHandleReset(name) {
      this.examineModal = false;
      this.$nextTick(() => {
        this.$refs[name].resetFields();
      });
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
<style scoped>
.underline {
  text-decoration: underline;
}
.table-box {
  min-height: 100px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.marginLeft20 {
  margin-left: 20px;
}
</style>