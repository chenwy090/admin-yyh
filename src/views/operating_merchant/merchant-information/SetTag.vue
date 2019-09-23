<template>
  <!--  打标签  -->
  <div class="set-tag">
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="425"
    >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{title}}</span>
      </p>
      <div>
        <Form
          label-position="right"
          ref="form"
          :model="formData"
          :rules="ruleValidate"
          :label-width="100"
        >
          <Row type="flex" justify="start">
            <Col style="padding-top:8px;">
              <Checkbox v-model="formData.isNew">新店</Checkbox>
            </Col>
            <Col>
              <FormItem
                label="时间："
                prop="startTime"
                :label-width="60"
                :rules="{ required: formData.isNew, message: '请选择新店有效时间' }"
              >
                <DatePicker
                  :disabled="!formData.isNew"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="请设置时间"
                  style="display:inline-block;width:260px"
                  :value="daterange"
                  @on-change="changeStartDate"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeDialog">取消</Button>
        <Button type="error" @click="handleSubmit" style="margin-left: 8px">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
export default {
  name: "set-tag",
  props: {
    id: {
      type: String,
      default: ""
    },
    showTag: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    ["formData.isNew"]() {
      console.log(this.formData.isNew);
      if (this.formData.isNew) {
        this.$refs.form.validateField("startTime");
      } else {
        //清空时间
        this.daterange = [];
        // this.$refs.form.resetFields();
        this.$refs.form.fields.some(function(e) {
          let r = e.prop == "startTime";
          r && e.resetField();
          return r;
        });
      }
    }
  },
  data() {
    return {
      isShow: true,
      title: "请勾选以下标签",
      daterange: [],
      formData: {
        isNew: false, // 是否是新店
        startTime: "",
        endTime: ""
      },
      ruleValidate: {}
    };
  },
  methods: {
    changeStartDate(arr) {
      // yyyy-MM-dd
      console.log(arr);
      this.formData.startTime = `${arr[0]}:00`;
      this.formData.endTime = `${arr[1]}:00`;
    },
    closeDialog() {
      //关闭对话框清除表单数据
      console.log("closeDialog");
      this.$emit(`update:showTag`, false);
    },
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.$Message.success("数据验证成功!");

          let oForm = JSON.parse(JSON.stringify(this.formData));
          console.log(oForm);

          const { isNew, startTime, endTime } = oForm;

          let params = { merchantId: this.id, merchantTags: [] };
          if (isNew) {
            params.merchantTags.push({
              merchantId: this.id,
              tagId: "1",
              startTime,
              endTime
            });
          }

          // let { code = 200, msg = "" } = {};

          const url = "/merchant/tag/rel/add";

          let { code, msg } = await postRequest(url, params);

          if (code == 200) {
            this.msgOk("保存成功");
            // 关闭对话框
            this.closeDialog();
            //刷新列表数据
            this.$emit("refresh");
          } else {
            this.msgErr(msg);
          }
        } else {
          this.$Message.error("数据验证失败！");
        }
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
</style>