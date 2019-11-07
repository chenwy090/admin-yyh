<template>
  <div>
    <Card>
      <!-- <Button type="dashed" icon="md-arrow-round-back">返回列表</Button> -->
      <Divider orientation="left">
        <h3>{{businessCustomer == 'business'?'联系人信息':'用户信息'}}</h3>
      </Divider>
      <Form :label-width="100" label-position="left" style="margin:10px 3%;">
        <h3 v-if="businessCustomer == 'business'">企业法人信息</h3>
        <div style="margin-top:10px">
          <FormItem label="姓名: " required>
            <Input
              type="text"
              style="width:200px"
              placeholder="请输入"
              v-model="form[0].name"
              :maxlength="32"
            ></Input>
          </FormItem>
          <FormItem label="联系人手机号: " required>
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form[0].mobile"></Input>
          </FormItem>
          <FormItem label="证件类型: " required>
            <Select v-model="form[0].identityType" style="width:200px">
              <Option value="01">身份证</Option>
              <Option value="02">企业营业执照</Option>
            </Select>
          </FormItem>
          <FormItem label="证件号码: " required>
            <Input
              type="text"
              style="width:200px"
              placeholder="请输入"
              v-model="form[0].identityNumber"
            ></Input>
          </FormItem>
          <FormItem label="证件有效期: " required>
            <DatePicker
              type="date"
              placeholder="请选择"
              style="width: 200px"
              :value="form[0].validFrom"
              format="yyyy-MM-dd"
              @on-change="time1"
            ></DatePicker>&nbsp;至&nbsp;
            <DatePicker
              type="date"
              placeholder="请选择"
              style="width: 200px"
              :value="form[0].validUntil"
              format="yyyy-MM-dd"
              @on-change="time2"
            ></DatePicker>
            如长期有效，请填上9999-12-31
          </FormItem>
        </div>
        <h3 v-if="businessCustomer == 'business'">企业财务信息</h3>
        <div style="margin-top:10px" v-if="businessCustomer == 'business'">
          <FormItem label="姓名: " required>
            <Input
              type="text"
              style="width:200px"
              placeholder="请输入"
              v-model="form[1].name"
              :maxlength="32"
            ></Input>
          </FormItem>
          <FormItem label="联系人手机号: " required>
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form[1].mobile"></Input>
          </FormItem>
          <FormItem label="证件类型: " required>
            <Select v-model="form[1].identityType" style="width:200px">
              <Option value="01">身份证</Option>
              <Option value="02">企业营业执照</Option>
            </Select>
          </FormItem>
          <FormItem label="证件号码: " required>
            <Input
              type="text"
              style="width:200px"
              placeholder="请输入"
              v-model="form[1].identityNumber"
            ></Input>
          </FormItem>
          <FormItem label="证件有效期: " required>
            <DatePicker
              type="date"
              placeholder="请选择"
              style="width: 200px"
              :value="form[1].validFrom"
              format="yyyy-MM-dd"
              @on-change="time3"
            ></DatePicker>&nbsp;至&nbsp;
            <DatePicker
              type="date"
              placeholder="请选择"
              style="width: 200px"
              :value="form[1].validUntil"
              format="yyyy-MM-dd"
              @on-change="time4"
            ></DatePicker>
            如长期有效，请填上9999-12-31
          </FormItem>
        </div>
        <!-- 联系人信息 -->
        <FormItem :label-width="0">
          <Button
            type="info"
            style="width:240px;margin-right: 20px; float: left;"
            @click="goback()"
          >取&nbsp;&nbsp;&nbsp;消</Button>
          <Button
            type="primary"
            style="width:240px; float: left;"
            @click="editContactInformationFN()"
          >保&nbsp;&nbsp;&nbsp;存</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
  import { getContactInformation, editContactInformation } from "@/api/sys";
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
    name: "addContactInformation",
    props: {
      id: null,
      businessCustomer: String
    },
    data() {
      return {
        userInfo: "",
        addEdit: null, // 1新增 2编辑
        bsUploadList: [],
        url: uploadOperationImage2AliOssURl,
        form: [
          {
            basicId: null,
            type: "3",
            name: "",
            mobile: "",
            identityType: "",
            identityNumber: "",
            validFrom: "",
            validUntil: ""
          },
          {
            basicId: null,
            type: "4",
            name: "",
            mobile: "",
            identityType: "",
            identityNumber: "",
            validFrom: "",
            validUntil: ""
          }
        ]
      };
    },
    created: function() {
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.judge();
    },
    mounted() {},
    methods: {
      // 判断对公还是私
      judge() {
        let data = {};
        data.basicId = this.id;
        if (this.businessCustomer == "business") {
          // 对公
          data.type = 3;
          this.getContactInformationFn(data);
          data.type = 4;
          this.getContactInformationFn(data);
        } else {
          //对私
          data.type = 1;
          this.getContactInformationFn(data);
        }
      },
      // 根据id获取信息
      getContactInformationFn(data) {
        getContactInformation(data).then(res => {
          if (res.code == 200) {
            if (res.data != null) {
              this.addEdit = 2;
              if (res.data[0].type == 3) {
                // 法人
                this.form[0].name = res.data[0].name;
                this.form[0].mobile = res.data[0].mobile;
                this.form[0].identityType = res.data[0].identityType;
                this.form[0].identityNumber = res.data[0].identityNumber;
                this.form[0].validFrom = res.data[0].validFrom;
                this.form[0].validUntil = res.data[0].validUntil;
                this.form[0].id = res.data[0].id;
              } else if (res.data[0].type == 4) {
                // 财务
                this.form[1].name = res.data[0].name;
                this.form[1].mobile = res.data[0].mobile;
                this.form[1].identityType = res.data[0].identityType;
                this.form[1].identityNumber = res.data[0].identityNumber;
                this.form[1].validFrom = res.data[0].validFrom;
                this.form[1].validUntil = res.data[0].validUntil;
                this.form[1].id = res.data[0].id;
              } else if (res.data[0].type == 1) {
                // 个人
                this.form[0].name = res.data[0].name;
                this.form[0].mobile = res.data[0].mobile;
                this.form[0].identityType = res.data[0].identityType;
                this.form[0].identityNumber = res.data[0].identityNumber;
                this.form[0].validFrom = res.data[0].validFrom;
                this.form[0].validUntil = res.data[0].validUntil;
                this.form[0].id = res.data[0].id;
              }
            } else {
              this.addEdit = 1;
            }
          }else {
            this.msgErr(res.msg)
          }
        });
      },

      // 新增编辑
      editContactInformationFN() {
        // console.log(this.addEdit);
        // return
        // 验证
        if (!this.ruleValidate()) {
          return;
        }
        let data;
        if (this.businessCustomer != "business") {
          // 个人
          data = [
            {
              basicId: this.id,
              type: 1,
              name: this.form[0].name,
              mobile: this.form[0].mobile,
              identityType: this.form[0].identityType,
              identityNumber: this.form[0].identityNumber,
              validFrom: this.form[0].validFrom,
              validUntil: this.form[0].validUntil,
              id: this.form[0].id,
            }
          ];
          if (this.addEdit == 1) {
            // 新增
            data[0].createBy = this.userInfo.username;
            data[0].modifiedBy = this.userInfo.username;
          } else {
            data[0].modifiedBy = this.userInfo.username;
            data[0].operateType = "update";
          }
        } else {
          // 企业
          data = this.form;
          data[0].basicId = this.id;
          data[1].basicId = this.id;
          if (this.addEdit == 1) {
            // 新增
            data[0].createBy = this.userInfo.username;
            data[0].modifiedBy = this.userInfo.username;
            data[1].createBy = this.userInfo.username;
            data[1].modifiedBy = this.userInfo.username;
          } else {
            data[0].modifiedBy = this.userInfo.username;
            data[1].modifiedBy = this.userInfo.username;
            data[0].operateType = "update";
            data[1].operateType = "update";
          }
        }
        editContactInformation(data).then(res => {
          if (res.code == 200) {
            this.msgOk("保存成功");
            this.goback();
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 返回
      goback() {
        this.$emit("changeStatus", false);
      },

      // 验证
      ruleValidate() {
        let msg = "";
        if (this.businessCustomer == "business") {
          msg = "法人的";
        }
        if (this.form[0].name == "") {
          this.msgErr("请输入" + msg + "姓名!");
          return;
        }
        if (this.form[0].mobile == "") {
          this.msgErr("请输入" + msg + "手机号!");
          return;
        }
        if (this.form[0].identityType == "") {
          this.msgErr("请选择" + msg + "证件类型!");
          return;
        }
        if (this.form[0].identityNumber == "") {
          this.msgErr("请输入" + msg + "证件号!");
          return;
        }
        if (this.form[0].validFrom == "" || this.form[0].validUntil == "") {
          this.msgErr("请选择" + msg + "证件有效期!");
          return;
        }

        if (this.businessCustomer == "business") {
          if (this.form[1].name == "") {
            this.msgErr("请输入财务的姓名!");
            return;
          }
          if (this.form[1].mobile == "") {
            this.msgErr("请输入财务的手机号!");
            return;
          }
          if (this.form[1].identityType == "") {
            this.msgErr("请选择财务的证件类型!");
            return;
          }
          if (this.form[1].identityNumber == "") {
            this.msgErr("请输入财务的证件号!");
            return;
          }
          if (this.form[1].validFrom == "" || this.form[0].validUntil == "") {
            this.msgErr("请选择财务的证件有效期!");
            return;
          }
        }
        return true;
      },

      // 时间
      time1(e) {
        this.form[0].validFrom = e;
      },
      time2(e) {
        this.form[0].validUntil = e;
      },
      time3(e) {
        this.form[1].validFrom = e;
      },
      time4(e) {
        this.form[1].validUntil = e;
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
