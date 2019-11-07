<template>
  <div>
    <Card>
      <!-- <Button type="dashed" icon="md-arrow-round-back">返回列表</Button> -->
      <Divider orientation="left">
        <h3 v-if="smAndPv == 1">子商户应用</h3>
        <h3 v-else>打款验证</h3>
      </Divider>
      <Form :label-width="100" label-position="left" style="margin:10px 3%;">
        <!-- 子商户应用 -->
        <div v-if="smAndPv == 1">
          <FormItem label="子商户应用名称: ">
            <Input
              type="text"
              style="width:200px"
              placeholder="请输入"
              v-model="form1[0].displayName"
              :maxlength="32"
            ></Input>
          </FormItem>
          <FormItem label="公司名称: ">
            <Input type="text" style="width:200px" placeholder="请输入" v-model="form1[0].name"></Input>
          </FormItem>
          <FormItem label="法人手机号: ">
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form1[0].mobile"></Input>
          </FormItem>
          <FormItem label="证件号码: ">
            <Input
              type="text"
              style="width:200px"
              placeholder="请输入营业执照"
              v-model="form1[0].identityNumber"
            ></Input>
          </FormItem>
          <FormItem label="证件有效期: ">
            <DatePicker
              type="date"
              placeholder="请选择"
              style="width: 200px"
              :value="form1[0].validFrom"
              format="yyyy-MM-dd"
              @on-change="time1"
            ></DatePicker>&nbsp;至&nbsp;
            <DatePicker
              type="date"
              placeholder="请选择"
              style="width: 200px"
              :value="form1[0].validUntil"
              format="yyyy-MM-dd"
              @on-change="time2"
            ></DatePicker>如长期有效，请填上9999-12-31
          </FormItem>
        </div>
        <!-- 子商户应用 -->
        <!-- 打款验证 -->
        <div v-if="smAndPv == 2">
          <FormItem label="金额: ">
            <InputNumber style="width:200px" placeholder="请输入" v-model="form2.receiveAmount"></InputNumber>
          </FormItem>
        </div>
        <!-- 打款验证 -->
        <FormItem :label-width="0">
          <Button
            type="info"
            style="width:240px;margin-right: 20px; float: left;"
            @click="goback()"
          >取&nbsp;&nbsp;&nbsp;消</Button>
          <Button
            type="primary"
            style="width:240px; float: left;"
            @click="judge()"
          >保&nbsp;&nbsp;&nbsp;存</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
  import { getContactInformation, editContactInformation, editCheck } from "@/api/sys";
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
    name: "addSubordinateMerchants",
    props: {
      id: null,
      smAndPv: null
    },
    data() {
      return {
        userInfo: "",
        addEdit: null, // 1新增 2编辑
        bsUploadList: [],
        url: uploadOperationImage2AliOssURl,
        form1: [
          {
            basicId: null,
            type: "2",
            displayName: "",
            name: "",
            mobile: "",
            identityType: "02",
            identityNumber: "",
            validFrom: "",
            validUntil: ""
          }
        ],
        form2: {
            basicId: null,
            receiveAmount: null
          }
      };
    },
    created: function() {
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (this.smAndPv == 1) {
        this.getContactInformationFn();
      }
    },
    mounted() {},
    methods: {
      // 根据id获取信息
      getContactInformationFn() {
        let data = {
          basicId: this.id,
          type: 2
        };
        getContactInformation(data).then(res => {
          if (res.code == 200) {
            if (res.data != null) {
              this.addEdit = 2;
              if (res.data[0].type == 2) {
                // 子商户
                this.form1[0].name = res.data[0].name;
                this.form1[0].displayName = res.data[0].displayName;
                this.form1[0].mobile = res.data[0].mobile;
                this.form1[0].identityType = res.data[0].identityType;
                this.form1[0].identityNumber = res.data[0].identityNumber;
                this.form1[0].validFrom = res.data[0].validFrom;
                this.form1[0].validUntil = res.data[0].validUntil;
                this.form1[0].id = res.data[0].id;
              }
            } else {
              this.addEdit = 1;
            }
          }else {
            this.msgErr(res.msg)
          }
        });
      },

      judge() {
        if (this.smAndPv == 1) {
          this.editContactInformationFN();
        } else {
          this.editCheckFn()
        }
      },

      // 新增编辑子
      editContactInformationFN() {
        // console.log(this.addEdit);
        // return
        // 验证
        if (!this.ruleValidate1()) {
          return;
        }
        if (this.addEdit == 1) {
          this.form1[0].createBy = this.userInfo.username;
          this.form1[0].modifiedBy = this.userInfo.username;
        } else {
          this.form1[0].modifiedBy = this.userInfo.username;
          this.form1[0].operateType = "update";
        }
        this.form1[0].basicId = this.id;
        editContactInformation(this.form1).then(res => {
          if (res.code == 200) {
            this.msgOk("保存成功");
            this.goback();
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 打款验证
      editCheckFn() {
        if(!this.form2.receiveAmount) {
          this.msgErr("请输入金额!");
          return;
        }
        this.form2.basicId = this.id
        editCheck(this.form2).then(res => {
          if (res.code == 200) {
            this.msgOk("保存成功");
            this.goback();
          } else {
            this.msgErr(res.msg);
          }
        })
      },

      // 返回
      goback() {
        this.$emit("changeStatus", false);
      },

      // 验证
      ruleValidate1() {
        if (this.form1[0].displayName == "") {
          this.msgErr("请输入子商户应用名称!");
          return;
        }
        if (this.form1[0].name == "") {
          this.msgErr("请输入公司名!");
          return;
        }
        if (this.form1[0].mobile == "") {
          this.msgErr("请输入手机号!");
          return;
        }
        if (this.form1[0].identityNumber == "") {
          this.msgErr("请输入营业执照!");
          return;
        }
        if (this.form1[0].validFrom == "" || this.form1[0].validUntil == "") {
          this.msgErr("请选择证件有效期!");
          return;
        }
        return true;
      },

      // 时间
      time1(e) {
        this.form1[0].validFrom = e;
      },
      time2(e) {
        this.form1[0].validUntil = e;
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
