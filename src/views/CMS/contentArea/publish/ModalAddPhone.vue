<template>
  <!-- 优惠券 footer-hide-->
  <div class="add-phone-number-box">
    <Modal
      v-model="isShow"
      title="添加发布账号"
      width="400"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
    >
      <div>
        <Form
          label-position="left"
          ref="form"
          :model="formData"
          :rules="ruleValidate"
          :label-width="100"
        >
          <FormItem
            label="手机号码："
            prop="phoneNumber"
            :rules="{ required: true, validator: validatePhone('手机号码不能为空') }"
          >
            <Input v-model="formData.phoneNumber" type="text" clearable></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button style="margin-right: 20px" @click="cancel">取消</Button>
        <Button type="primary" @click="save('form')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
export default {
  name: "add-phone-number-box",
  inject: ["msgOk", "msgErr"],
  data() {
    return {
      isShow: true,
      formData: {
        phoneNumber: ""
      },
      ruleValidate: {}
    };
  },
  created() {
    console.log("created");
  },
  methods: {
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    closeDialog() {
      //关闭对话框清除表单数据
      this.$emit(`update:showAddPhone`, false);
    },

    save(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.$Message.success("数据验证成功!");
          let oForm = JSON.parse(JSON.stringify(this.formData));
          const url = "/content/userlist";
          const { code, msg, data } = await postRequest(url, oForm);
          if (code == 200) {
            // data:[{id,name,sort}]
            //刷新列表数据
            this.$emit("refreshUserList");
            // 关闭对话框
            this.closeDialog();
          } else {
            this.msgErr(msg);
          }
        } else {
          this.$Message.error("数据验证失败！");
        }
      });
    },

    validatePhone(msg) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        } else {
          if (!/^1[3456789]\d{9}$/.test(value)) {
            return callback("手机号码有误，请重填!");
          }
        }
        callback();
      };
    },
    validateEmpty(msg) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        callback();
      };
    }
  }
};
</script>

<style scoped>
</style>

<style lang="less">
</style>
