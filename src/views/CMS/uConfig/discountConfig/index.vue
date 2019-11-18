<template>
  <div class="discountConfig">
    <Card :bordered="false" :dis-hover="true">
      <p slot="title">领优惠标题配置</p>
      <a href="#" slot="extra">
        <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回上一层</Button>
      </a>
      <Form
        label-position="right"
        ref="form"
        :model="formData"
        :label-width="130"
        style="min-width:1100px;"
      >
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="8" v-for="({type,label}) in dataStructure" :key="type">
            {{`formData.${type}.subTitle`}}----label:{{label}}
            <Card>
              <p slot="title">{{label}}</p>
              <FormItem
                label="主标题："
                :prop="`${type}.mainTitle`"
                :rules="{required: true,  validator: validateEmpty('请输入主标题',6)}"
              >
                <Tooltip trigger="focus" title="提醒" content="最多6个汉字" placement="right">
                  <Input
                    style="width:200px"
                    v-model.trim="formData[type].mainTitle"
                    :maxlength="20"
                    placeholder="请输入主标题"
                    clearable
                  />
                </Tooltip>
              </FormItem>
              <!-- :rules="{ required: formData.subTitle.length, message: '请输入副标题' }" -->
              <FormItem label="副标题：" :prop="`${type}.subTitle`" :rules="subTitleRules">
                <Tooltip trigger="focus" title="提醒" content="最多12个汉字" placement="right">
                  <Input
                    style="width:200px"
                    v-model.trim="formData[type].subTitle"
                    :maxlength="20"
                    placeholder="请输入副标题"
                    clearable
                    @on-clear="clearValidateMsg(`${type}.subTitle`)"
                  />
                </Tooltip>
              </FormItem>
            </Card>
          </Col>
        </Row>

        <div style="margin-top:20px;">
          <FormItem label>
            <Button type="primary" :disabled="submitDisabled" @click="handleSubmit('form')">保存</Button>
          </FormItem>
        </div>
      </Form>
    </Card>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";

export default {
  name: "discountConfig",
  inject: ["linkTo", "msgOk", "msgErr"],
  computed: {
    subTitleRules(type) {
      let obj = null;
      // if (this.formData[type].subTitle.length) {
      if (0) {
        obj = {
          required: true,
          validator: this.validateEmpty("请输入副标题", 12)
        };
      } else {
        obj = { required: false };
      }
      console.log(11111, obj);

      return obj;
    }
  },
  watch: {
    ["formData.supermarket.subTitle"]() {
      this.validateSubTitle("supermarket");
    },
    ["formData.coupon.subTitle"]() {
      this.validateSubTitle("coupon");
    },
    ["formData.merchant.subTitle"]() {
      this.validateSubTitle("merchant");
    }
  },
  data() {
    return {
      submitDisabled: false,
      dataStructure: [
        { type: "supermarket", label: "超市券模块" },
        { type: "coupon", label: "周边券模块" },
        { type: "merchant", label: "商户模块" }
      ],
      formData: {
        id: "",
        //超市券模块
        supermarket: {
          mainTitle: "超市优惠", //主标题：超市优惠 必填，最多填写10个字节；
          subTitle: "subTitle" //副标题：大家都在领  最多填写30个字节；
        },
        //周边券模块
        coupon: {
          mainTitle: "周边福利", //主标题：周边福利
          subTitle: "" //副标题：大家都在领
        },
        //商户模块
        merchant: {
          mainTitle: "精选商户", //主标题：精选商户
          subTitle: "" //副标题：
        }
      }
    };
  },
  created() {
    // this.getData();
  },
  methods: {
    validateSubTitle(type) {
      // this.formData.subTitle = this.formData.subTitle.trim();
      // console.log(this.formData.subTitle);
      let props = `${type}.subTitle`;

      console.log("xxxxx",type,props);
      
      if (this.formData[type].subTitle.length) {
        this.$refs.form.validateField(props);
      } else {
        //清空校验
        this.clearValidateMsg(props);
      }
    },
    goback() {
      this.linkTo("cms");
    },
    async getData() {
      const url = "/page/module/layout/getCommonSetting";
      //  平台分红：4
      const { type, site } = this.tab;
      //  site 页面位置，1：首页、2：首页-平台分红
      let { code, msg, data } = await postRequest(url, { type, site });
      if (code == 200) {
        // this.formData = data;
      } else {
        this.msgErr(msg);
      }
    },

    validateEmpty(msg, len = 20) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        if (value.length > len) {
          return callback(`最多只能输入${len}个汉字`);
        }
        callback();
      };
    },
    //清空校验
    clearValidateMsg(name) {
      this.$refs.form.fields.some(function(comp) {
        console.log("clear::", comp);
        //supermarket.mainTitle
        let r = comp.prop == name;
        r && comp.resetField();
        return r;
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        console.log("valid", valid);
        if (!valid) {
          this.msgErr("数据验证失败！");
          return;
        }

        // 核销扫码首页配置
        const url = "/page/module/layout/saveCommonSetting";

        //清洗数据
        let formData = JSON.parse(JSON.stringify(this.formData));

        const { type, site } = this.tab;
        formData.type = type;
        formData.site = site;
        postRequest(url, formData).then(res => {
          if (res.code == 200) {
            this.msgOk("保存成功");
          } else {
            this.msgErr(res.msg);
          }
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>