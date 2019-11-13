<template>
  <div>
    <Card>
      <!-- <Button type="dashed" icon="md-arrow-round-back">返回列表</Button> -->
      <Divider orientation="left">
        <h3>结算账号</h3>
      </Divider>
      <Form :label-width="100" label-position="left" style="margin:10px 3%;">
        <!-- 关联结算账号 -->
        <FormItem label="银行账号: " required>
          <Input type="number" style="width:200px" placeholder="请输入" v-model="form.account"></Input>
        </FormItem>
        <FormItem label="开户名: " required>
          <Input type="text" style="width:200px" placeholder="请输入" v-model="form.name"></Input>
        </FormItem>
        <FormItem label="银行预留手机: " required>
          <Input type="number" style="width:200px" placeholder="请输入" v-model="form.mobile"></Input>
        </FormItem>
        <FormItem label="开户行名称: " required>
          <Input type="text" style="width:200px" placeholder="请输入" v-model="form.openBank"></Input>
        </FormItem>
        <FormItem label="转账类型: " required>
          <RadioGroup v-model="form.type">
            <Radio v-if="businessCustomer == 'customer'" label="b2c">个人账号</Radio>
            <Radio v-else style="margin-left:20px" label="b2b">企业对公户</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="银行卡号类型: " required>
          <!-- 个人 -->
          <RadioGroup v-if="businessCustomer == 'customer'" v-model="form.cardType">
            <Radio :label="0">银行卡借记卡</Radio>
            <Radio :label="2" style="margin-left:20px">信用卡</Radio>
            <Radio :label="3" style="margin-left:20px">准贷记卡</Radio>
            <Radio :label="5" style="margin-left:20px">虚拟卡</Radio>
          </RadioGroup>
          <!-- 企业 -->
          <RadioGroup v-else v-model="form.cardType">
            <Radio :label="6">基本户</Radio>
            <Radio :label="7" style="margin-left:20px">一般户</Radio>
          </RadioGroup>
        </FormItem>
        <!-- 关联结算账号 -->
        <FormItem :label-width="0">
          <Button
            type="info"
            style="width:240px;margin-right: 20px; float: left;"
            @click="goback()"
          >取&nbsp;&nbsp;&nbsp;消</Button>
          <Button
            type="primary"
            style="width:240px; float: left;"
            @click="editSettlementAccountFn()"
          >保&nbsp;&nbsp;&nbsp;存</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import { getSettlementAccount, editSettlementAccount } from "@/api/sys";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from "@/libs/axios";
import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
import { formatDate, checkImageWH, checkImage, uniqueArray } from "@/libs/date";

export default {
  name: "addSettlementAccount",
  props: {
    id: null,
    businessCustomer: null
  },
  data() {
    return {
      userInfo: "",
      addEdit: null, // 1新增 2编辑
      bsUploadList: [],
      url: uploadOperationImage2AliOssURl,
      form: {
        basicId: "",
        account: "",
        name: "",
        type: "",
        mobile: "",
        openBank: "",
        cardType: null
      }
    };
  },
  created: function() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.getSettlementAccountFn();
    if (this.businessCustomer == "customer") {
      this.form.type = "b2c";
    } else {
      this.form.type = "b2b";
    }
  },
  mounted() {},
  methods: {
    // 根据id获取信息
    getSettlementAccountFn() {
      getSettlementAccount(this.id).then(res => {
        if (res.code == 200) {
          if (res.data != null) {
            this.addEdit = 2;
            this.form = res.data;
          } else {
            this.addEdit = 1;
          }
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 新增编辑
    editSettlementAccountFn() {
      // 验证
      if (!this.ruleValidate()) {
        return;
      }

      if (this.addEdit == 1) {
        this.form.createBy = this.userInfo.username;
        this.form.modifiedBy = this.userInfo.username;
      } else {
        this.form.modifiedBy = this.userInfo.username;
        this.form.operateType = "update";
      }
      this.form.basicId = this.id;
      editSettlementAccount(this.form).then(res => {
        if (res.code == 200) {
          this.msgOk("保存成功");
          this.goback();
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 验证
    ruleValidate() {
      if (!this.form.account) {
        this.msgErr("请输入银行账号");
        return;
      }
      if (!this.form.name) {
        this.msgErr("请输入开户名");
        return;
      }
      if (!this.form.mobile) {
        this.msgErr("请输入手机号");
        return;
      }
      if (!this.form.openBank) {
        this.msgErr("请输入开户行名称");
        return;
      }
      if (!this.form.type) {
        this.msgErr("请输入转账类型");
        return;
      }

      const cardTypes = [0, 2, 3, 5, 6, 7];
      if (!cardTypes.includes(this.form.cardType)) {
        this.msgErr("请输入银行卡号类型");
        return;
      }
      return true;
    },

    // 返回
    goback() {
      this.$emit("changeStatus", false);
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

<style>
.box {
  margin-bottom: 20px;
}

.CertificatesImg {
  display: inline-block;
  width: 130px;
  height: 80px;
}
</style>
