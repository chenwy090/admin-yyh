<template>
  <div>
    <Card>
      <!-- <Button type="dashed" icon="md-arrow-round-back">返回列表</Button> -->
      <Divider orientation="left">
        <h3>查看详情</h3>
      </Divider>
      <Form :label-width="100" label-position="left" style="margin:10px 3%;">
        <h3 style="margin-bottom:10px">商户信息</h3>
        <!-- 商户信息 -->
        <FormItem>
          <RadioGroup v-model="form.basicResponse.type">
            <Radio label="customer" disabled>个人用户</Radio>
            <Radio label="business" style="margin-left:100px" disabled>企业对公用户</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="商户类型: ">
          <RadioGroup v-model="form.basicResponse.merchantType">
            <Radio :label="0" disabled>本地商户（单店）</Radio>
            <Radio :label="1" style="margin-left:20px" disabled>本地商户（多店）</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem>
          <Table
            border
            width="600"
            :columns="form.bbb == 1?columns1:columns2"
            :data="addMerchantList"
          >
            <template slot-scope="{ row }" slot="operate"></template>
          </Table>
        </FormItem>
        <!-- 商户信息 -->

        <!-- 证件信息 -->
        <h3 style="margin-bottom:10px">证件信息</h3>
        <FormItem label="营业执照: " v-if="form.basicResponse.type == 'business'">
          <img :src="bsUploadList1" class="CertificatesImg" />
        </FormItem>
        <FormItem :label="form.basicResponse.type== 'business'?'法人身份证: ':'证件图片: '">
          <span style="display:inline-block">
            <img :src="bsUploadList2" class="CertificatesImg" />
            <div style="text-align: center;">正面</div>
          </span>
          <span style="display:inline-block;margin-left:20px">
            <img :src="bsUploadList3" class="CertificatesImg" />
            <div style="text-align: center;">反面</div>
          </span>
        </FormItem>
        <!-- 证件信息 -->

        <!-- 关联结算账号 -->
        <h3 style="margin-bottom:10px">关联结算账号</h3>
        <FormItem label="银行账号: ">
          <Input
            type="text"
            style="width:200px"
            placeholder="请输入"
            v-model="form.settleResponse.account"
            :maxlength="32"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="开户名: ">
          <Input
            type="text"
            style="width:200px"
            placeholder="请输入"
            v-model="form.settleResponse.name"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="银行预留手机: ">
          <Input
            type="number"
            style="width:200px"
            placeholder="请输入"
            v-model="form.settleResponse.mobile"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="开户行名称: ">
          <Input
            type="text"
            style="width:200px"
            placeholder="请输入"
            v-model="form.settleResponse.openBank"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="转账类型: ">
          <RadioGroup v-model="form.settleResponse.type">
            <Radio label="b2c" disabled>个人账号</Radio>
            <Radio style="margin-left:20px" label="b2b" disabled>企业对公户</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="银行卡号类型: ">
          <!-- 个人 -->
          <RadioGroup>
            <Radio disabled :label="0">银行卡借记卡</Radio>
            <Radio disabled :label="2" style="margin-left:20px">信用卡</Radio>
            <Radio disabled :label="3" style="margin-left:20px">准贷记卡</Radio>
            <Radio disabled :label="5" style="margin-left:20px">虚拟卡</Radio>
          </RadioGroup>
          <!-- 企业 -->
          <RadioGroup v-model="form.settleResponse.cardType">
            <Radio disabled :label="6">基本户</Radio>
            <Radio disabled :label="7" style="margin-left:20px">一般户</Radio>
          </RadioGroup>
        </FormItem>
        <!-- 关联结算账号 -->

        <!-- 联系人信息 -->
        <div v-if="type2">
          <h3 style="margin-bottom:10px">{{form.basicResponse.type == 'business'?'联系人信息':'用户信息'}}</h3>
          <!-- 法人 -->
          <h5 v-if="form.basicResponse.type == 'business'">企业法人信息</h5>
          <div>
            <FormItem label="姓名: ">
              <Input
                type="text"
                style="width:200px"
                placeholder="请输入"
                v-model="type2.name"
                :maxlength="32"
                disabled
              ></Input>
            </FormItem>
            <FormItem label="联系人手机号: ">
              <Input
                type="number"
                style="width:200px"
                placeholder="请输入"
                v-model="type2.mobile"
                disabled
              ></Input>
            </FormItem>
            <FormItem label="证件类型: ">
              <Select v-model="type2.identityType" style="width:200px" disabled>
                <Option value="01">身份证</Option>
                <Option value="02">企业营业执照</Option>
              </Select>
            </FormItem>
            <FormItem label="证件号码: ">
              <Input
                type="text"
                style="width:200px"
                placeholder="请输入"
                v-model="type2.identityNumber"
                disabled
              ></Input>
            </FormItem>
            <FormItem label="证件有效期: ">
              <DatePicker
                type="date"
                placeholder="请选择"
                style="width: 200px"
                :value="type2.validFrom"
                format="yyyy-MM-dd"
                disabled
              ></DatePicker>&nbsp;至&nbsp;
              <DatePicker
                type="date"
                placeholder="请选择"
                style="width: 200px"
                :value="type2.validUntil"
                format="yyyy-MM-dd"
                disabled
              ></DatePicker>
            </FormItem>
          </div>
          <!-- 财务 -->
          <h5 v-if="form.basicResponse.type == 'business'">企业财务信息</h5>
          <div v-if="form.basicResponse.type == 'business'">
            <FormItem label="姓名: ">
              <Input
                type="text"
                style="width:200px"
                placeholder="请输入"
                v-model="type3.name"
                :maxlength="32"
                disabled
              ></Input>
            </FormItem>
            <FormItem label="联系人手机号: ">
              <Input
                type="number"
                style="width:200px"
                placeholder="请输入"
                v-model="type3.mobile"
                disabled
              ></Input>
            </FormItem>
            <FormItem label="证件类型: ">
              <Select v-model="type3.identityType" style="width:200px" disabled>
                <Option value="01">身份证</Option>
                <Option value="02">企业营业执照</Option>
              </Select>
            </FormItem>
            <FormItem label="证件号码: ">
              <Input
                type="text"
                style="width:200px"
                placeholder="请输入"
                v-model="type3.identityNumber"
                disabled
              ></Input>
            </FormItem>
            <FormItem label="证件有效期: ">
              <DatePicker
                type="date"
                placeholder="请选择"
                style="width: 200px"
                :value="type3.validFrom"
                format="yyyy-MM-dd"
                disabled
              ></DatePicker>&nbsp;至&nbsp;
              <DatePicker
                type="date"
                placeholder="请选择"
                style="width: 200px"
                :value="type3.validUntil"
                format="yyyy-MM-dd"
                disabled
              ></DatePicker>
            </FormItem>
          </div>
        </div>

        <!-- 联系人信息 -->

        <!-- 子商户应用 -->
        <div v-if="type4">
          <h3 style="margin-bottom:10px">子商户应用</h3>
          <FormItem label="姓名: ">
            <Input
              type="text"
              style="width:200px"
              placeholder="请输入"
              v-model="type4.name"
              :maxlength="32"
              disabled
            ></Input>
          </FormItem>
          <FormItem label="联系人手机号: ">
            <Input
              type="number"
              style="width:200px"
              placeholder="请输入"
              v-model="type4.mobile"
              disabled
            ></Input>
          </FormItem>
          <FormItem label="证件类型: ">
            <Select v-model="type4.identityType" style="width:200px" disabled>
              <Option value="01">身份证</Option>
              <Option value="02">企业营业执照</Option>
            </Select>
          </FormItem>
          <FormItem label="证件号码: ">
            <Input
              type="text"
              style="width:200px"
              placeholder="请输入"
              v-model="type4.identityNumber"
              disabled
            ></Input>
          </FormItem>
          <FormItem label="证件有效期: ">
            <DatePicker
              type="date"
              placeholder="请选择"
              style="width: 200px"
              :value="type4.validFrom"
              format="yyyy-MM-dd"
              disabled
            ></DatePicker>&nbsp;至&nbsp;
            <DatePicker
              type="date"
              placeholder="请选择"
              style="width: 200px"
              :value="type4.validUntil"
              format="yyyy-MM-dd"
              disabled
            ></DatePicker>
          </FormItem>
        </div>

        <!-- 子商户应用 -->
      </Form>
      <Divider></Divider>
      <Button type="dashed" icon="md-arrow-round-back" @click="goback">返回列表</Button>
    </Card>
  </div>
</template>
<script>
  import { getAllInfo } from "@/api/sys";
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
    name: "view-details",
    props: {
      id: null
    },
    data() {
      return {
        type2: "",
        type3: "",
        type4: "",
        bsUploadList1: "",
        bsUploadList2: "",
        bsUploadList3: "",
        addMerchantList: [], //已选中商户列表
        form: {
          basicResponse: {
            merchantName: "",
            openAccountStatus: null,
            failureReason: null,
            progress: null,
            bankCardStatus: null,
            type: "",
            merchantType: null,
            merchantId: "",
            brandId: null,
            modifiedBy: "",
            gmtModified: ""
          },
          settleResponse: {
            account: "",
            name: "",
            type: "",
            mobile: "",
            openBank: "",
            cardType: null,
            bankCardStatus: ""
          }
        },
        // 个人
        columns1: [
          {
            title: "商户名称",
            align: "center",
            minWidth: 200,
            key: "merchantId"
          },
          {
            title: "商户编号",
            align: "center",
            minWidth: 200,
            key: "name"
          }
        ],
        // 企业
        columns2: [
          {
            title: "品牌名称",
            align: "center",
            minWidth: 200,
            key: "merchantId"
          },
          {
            title: "关联店数",
            align: "center",
            minWidth: 200,
            key: "name"
          }
        ]
      };
    },
    created: function() {
      this.getAllInfoFn();
    },
    mounted() {},
    methods: {
      // 查询列表
      getAllInfoFn() {
        getAllInfo(this.id).then(res => {
          if (res.code == 200) {
            this.form = res.data;

            // 基本信息商户列表
            if (res.data.basicResponse.merchantType == 0) {
              // 单店
              this.addMerchantList = [
                {
                  name: res.data.basicResponse.merchantName,
                  merchantId: res.data.basicResponse.merchantId
                }
              ];
            } else if (res.data.basicResponse.merchantType == 1) {
              // 多店
              this.addMerchantList = [
                {
                  name: res.data.basicResponse.merchantName,
                  id: res.data.basicResponse.brandId
                }
              ];
            }

            if (res.data.basicResponse.type == "business") {
              // 证件信息
              if (res.data.picListResponse) {
                let list = res.data.picListResponse;
                for (let i = 0; i < list.length; i++) {
                  if (list[i].picType == "201") {
                    this.bsUploadList1 = list[i].picUrl;
                  }
                  if (list[i].picType == "202") {
                    this.bsUploadList2 = list[i].picUrl;
                  }
                  if (list[i].picType == "203") {
                    this.bsUploadList3 = list[i].picUrl;
                  }
                }
              }
              if (res.data.userListResponse) {
                // 联系人、子商户
                let list1 = res.data.userListResponse;
                for (let j = 0; j < list1.length; j++) {
                  if (list1[j].type == 3) {
                    this.type2 = list1[j];
                  }
                  if (list1[j].type == 4) {
                    this.type3 = list1[j];
                  }
                  if (list1[j].type == 2) {
                    this.type4 = list1[j];
                  }
                }
              }
            } else {
              // 证件信息
              if (res.data.picListResponse) {
                let list = res.data.picListResponse;
                for (let i = 0; i < list.length; i++) {
                  if (list[i].picType == "101") {
                    this.bsUploadList2 = list[i].picUrl;
                  }
                  if (list[i].picType == "102") {
                    this.bsUploadList3 = list[i].picUrl;
                  }
                }
              }
              if (res.data.userListResponse) {
                // 用户信息
                let list1 = res.data.userListResponse;
                for (let j = 0; j < list1.length; j++) {
                  if (list1[j].type == 1) {
                    this.type2 = list1[j];
                  }
                }
              }
            }
          } else {
            this.msgErr(res.msg);
          }
        });
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
