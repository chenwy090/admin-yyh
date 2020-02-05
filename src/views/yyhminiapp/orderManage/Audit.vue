<template>
  <div class="xxx">
    <!-- 审核 audit     -->
    <div class="audit">
      <Form label-position="right" ref="form" :model="formData" :label-width="120">
        <FormItem label="审核结果：" prop="status">
          <RadioGroup v-model="formData.auditStatus">
            <Radio v-for="(v, k) in auditStatusOption" :key="k" :label="k">{{ v }}</Radio>
          </RadioGroup>
          <div>
            <p style="color:red;">退款申请过后，退款将原路退回用户账户，请谨慎操作！</p>
          </div>
        </FormItem>
        <!-- :rules="{ required: formData.auditStatus == 3?true:false,validator:formData.auditStatus == 3?validateReason:null }" -->
        <FormItem label="备注：" prop="remark" :rules="{ required: true, validator: validateReason }">
          <Row>
            <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="最多100个汉字" placement="right">
                <Input
                  v-model="formData.remark"
                  type="textarea"
                  style="width:300px"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  :placeholder="reasonPlaceholder"
                  :maxlength="100"
                />
              </Tooltip>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="error" @click="check('form')" :loading="auditLoading">确认</Button>
          <Button @click="cancelHandleReset('form')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";

export default {
  name: "audit",
  props: {
    id: {
      type: [String, Number],
      default: "",
    },
  },
  watch: {
    ["formData.auditStatus"]() {
      const { auditStatus } = this.formData;
      console.log("auditStatus", auditStatus);

      //清空验证
      if (auditStatus == 2) {
        this.$refs.form.resetFields();
        this.reasonPlaceholder = "请输入通过原因";
      } else {
        this.reasonPlaceholder = "请输入100字以内未通过原因";
      }
    },
  },
  data() {
    return {
      auditLoading: false,
      // 审核状态 2-审核通过 3-审核不通过 审核结果2:通过、3：拒绝
      auditStatusOption: {
        "2": "通过",
        "3": "拒绝",
      },
      // 请输入50字以内未通过原因
      reasonPlaceholder: "请输入通过原因",
      formData: {
        orderRefundId: "",
        auditStatus: "2",
        remark: "",
      },
    };
  },
  methods: {
    validateReason(rule, value, callback) {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("审核内容不能为空"));
      } else if (value.length >= 100) {
        callback(new Error("请输入100字以内的字符"));
      } else {
        callback();
      }
    },
    check(name) {
      this.$refs[name].validate(async valid => {
        if (!valid) return;
        this.auditLoading = true;
        // 审核
        const url = "/trade/fund/account/order/leafletRefundAudit";
        const { code, msg } = await postRequest(url, {
          ...this.formData,
          orderRefundId: this.id,
        });
        this.auditLoading = false;
        if (code == 200) {
          this.msgOk("审核成功");
          this.cancelHandleReset(name);
          this.$emit("refresh");
        } else {
          this.msgErr(msg);
        }
      });
    },

    // 审核-------------------------------------
    cancelHandleReset(name) {
      this.$nextTick(() => {
        this.$refs[name].resetFields();
        this.$emit("close");
      });
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3,
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3,
      });
    },
  },
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
