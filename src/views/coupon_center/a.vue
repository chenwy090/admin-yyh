<template>
  <Form label-position="right" ref="form" :model="formData" :rules="ruleValidate" :label-width="0">
    <Form-item label prop="fontSize" :rules="{ required: single, validator: onlyNumber }">
      <Checkbox v-model="single">Checkbox</Checkbox>
      <Input :disabled="!single" v-model="formData.fontSize" placeholder="请输入" style="width:200px"></Input>
    </Form-item>

    <Row type="flex" justify="start">
      <Col>
        <Checkbox v-model="checked1">Checkbox</Checkbox>
      </Col>
      <Col>
        <FormItem
          label="抽奖时间："
          prop="startTime"
          :label-width="100"
          :rules="{ required: true, message: '请选择活动开始时间' }"
        >
          <DatePicker
            :disabled="!checked1"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            placeholder="请选择抽奖日期"
            style="display:inline-block;width: 300px"
            :value="daterange"
            @on-change="changeStartDate"
          ></DatePicker>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
export default {
  watch: {
    single() {
      // this.
      console.log(this.single);
      if (this.single) {
        this.$refs.form.validateField("fontSize");
      } else {
        // this.$refs.form.resetFields();
        this.$refs.form.fields.some(function(e) {
          let r = e.prop == "fontSize";
          r && e.resetField();
          return r;
        });
      }
    },
    checked1() {
      // this.
      console.log(this.checked1);
      console.log(this.$refs.form.fields);

      if (this.checked1) {
        this.$refs.form.validateField("startTime");
      } else {
        // this.$refs.form.resetFields();
        this.$refs.form.fields.some(function(e) {
          let r = e.prop == "startTime";
          r && e.resetField();
          return r;
        });
      }
    }
  },
  methods: {
    onlyNumber(rule, val, callback) {
      console.log(rule);
      console.log(val);
      callback(new Error("onlyNumber"));
    },
    changeStartDate(arr) {
      // yyyy-MM-dd
      console.log(arr);
      this.formData.startTime = arr[0];
      this.formData.endTime = arr[1];
    }
  },
  data() {
    return {
      single: false,
      checked1: false,
      daterange: [],
      formData: {
        fontSize: "",
        startTime: "",
        endTime: ""
      },
      ruleValidate: {}
    };
  }
};
</script>