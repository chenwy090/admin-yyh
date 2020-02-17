<template>
  <!-- 进店群U贝奖励值 -->
  <div style="margin-bottom: 20px;">
    <!--修改对话框-->
    <Modal v-model="modal.isopen" :title="modal.name" :mask-closable="false" footer-hide>
      <Form ref="form" label-position="right" :model="formData" :label-width="120">
        <FormItem label="U贝:" prop="value" :rules="{ required: true, validator: validateUbay }">
          <Input style="width:80%" v-model="formData.value" placeholder="请输入1-100的正整数" clearable />
        </FormItem>

        <FormItem>
          <Button
            style="float: right;margin-left: 20px"
            type="primary"
            @click="handleSubmit('form')"
          >确认</Button>
          <Button style="margin-left: 8px;float: right;" @click="closeDialog">关闭</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { postRequest } from "@/libs/axios";
export default {
  name: "modal39",
  props: {
    modal: {
      type: Object,
      default: function() {
        return {
          isopen: false,
          name: "进店群U贝奖励值",
          id: "",
          code: "39",
          value: "",
        };
      },
    },
  },
  watch: {
    "modal.isopen": {
      handler: function() {
        const { id, code, value } = this.modal;
        this.formData = {
          ...this.formData,
          id,
          code,
          value,
        };
      },
    },
  },
  data() {
    return {
      formData: {
        id: "",
        code: "",
        value: "",
      },
    };
  },
  created() {},
  methods: {
    // 刷新列表数据
    refresh() {
      this.$emit("refresh");
    },
    closeDialog() {
      this.modal.isopen = false;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.msgOk("数据验证成功!");
          this.saveChange();
        } else {
          this.msgErr("数据验证失败,请检查表单!");
        }
      });
    },
    async saveChange() {
      const url = "/commonConfig/updateConfigById";
      const { code, msg } = await postRequest(url, {
        overallCommonConfig: {
          // id/code/value
          ...this.formData,
        },
      });
      if (code == 200) {
        this.modal.isopen = false;
        this.refresh();
      } else {
        this.msgErr(msg);
      }
    },
    //验证正整数 0＜填写值≤100  要是正整数
    validateUbay(rule, value, callback) {
      var re = /^([1-9]|[1-9]\d|100)$/;
      if (re.test(value)) {
        callback();
      } else {
        callback(new Error("请输入1-100的正整数"));
      }
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



