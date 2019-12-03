<template>
  <div class="xxx">
    <!-- 审核 audit     -->
    <div class="audit">
      <Form label-position="right" ref="form" :model="formData" :label-width="120">
        <FormItem label="审核结果：" prop="status">
          <RadioGroup v-model="formData.auditResult">
            <Radio v-for="(v,k) in examineStatusOption" :key="k" :label="k">{{ v }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="原因："
          prop="auditDesc"
          :rules="{ required: formData.auditResult == 3?true:false,validator:formData.auditResult == 3?validateReason:null }"
        >
          <Row>
            <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="最多100个汉字" placement="right">
                <Input
                  v-model="formData.auditDesc"
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
    ["formData.auditResult"]() {
      const { auditResult } = this.formData;
      console.log("auditResult", auditResult);

      //清空验证
      if (auditResult == 2) {
        this.$refs.form.resetFields();
        this.reasonPlaceholder = "请输入通过原因";
      } else {
        this.reasonPlaceholder = "请输入100字以内未通过原因";
      }
    }
  },
  data() {
    return {
      // 审核状态 2-审核通过 3-审核不通过 审核结果2:通过、3：拒绝
      examineStatusOption: {
        "2": "通过",
        "3": "拒绝"
      },
      // 请输入50字以内未通过原因
      reasonPlaceholder: "请输入通过原因",
      formData: {
        id: "",
        auditResult: "2",
        auditDesc: ""
      }
    };
  },
  methods: {
    validateReason(rule, value, callback) {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("审核原因不能为空"));
      } else if (value.length >= 100) {
        callback(new Error("请输入100字以内的字符"));
      } else {
        callback();
      }
    },
    check(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          // 审核
          const url = "/trade/merchant/account/setting/audit";
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