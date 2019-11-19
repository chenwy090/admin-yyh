<template>
  <div class="xxx">
    <!-- 审核 audit     -->
    <div class="audit">
      <Form label-position="right" ref="form" :model="formData" :label-width="120">
        <FormItem label="审核结果：" prop="status">
          <RadioGroup v-model="formData.auditStatus">
            <Radio
              v-for="item in auditStatusOption"
              :key="item.value"
              :label="item.value"
            >{{ item.label }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="原因："
          prop="remarks"
          :rules="{ required: formData.auditStatus == 2?true:false,validator:formData.auditStatus == 2?validateReason:null }"
        >
          <Row>
            <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="最多50个汉字" placement="right">
                <Input
                  v-model="formData.remarks"
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
        <FormItem>
          <Button type="error" size="large" @click="check('form')">确认</Button>
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
      default: ""
    }
  },
  watch: {
    ["formData.auditStatus"]() {
      const { auditStatus } = this.formData;
      // console.log("auditStatus", auditStatus);

      //清空验证
      if (auditStatus == 3) {
        this.$refs.form.resetFields();
        this.reasonPlaceholder = "请输入通过原因";
      } else {
        this.reasonPlaceholder = "请输入50字以内未通过原因";
      }
    }
  },
  data() {
    return {
      // 审核状态 2-审核通过 3-审核不通过 审核结果2:通过、3：拒绝
      auditStatusOption: [
        { label: "通过", value: 3 },
        { label: "拒绝", value: 2 }
      ],
      // 请输入50字以内未通过原因
      reasonPlaceholder: "请输入通过原因",
      formData: {
        id: "",
        auditStatus: 3,
        remarks: ""
      }
    };
  },
  methods: {
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
    check(name) {
      // console.log(JSON.stringify({ ...this.formData, id: this.id }));

      this.$refs[name].validate(async valid => {
        if (valid) {
          // 审核
          const url = "/trade/merchant/withdraw/audit";
          const { code, msg } = await postRequest(url, {
            ...this.formData,
            id: this.id
          });

          if (code == 200) {
            this.msgOk("审核成功");
            this.cancelHandleReset(name);
            this.$emit("refresh");
          } else {
            this.msgErr(msg);
          }
        }
      });
    },

    // 审核-------------------------------------
    cancelHandleReset(name) {
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