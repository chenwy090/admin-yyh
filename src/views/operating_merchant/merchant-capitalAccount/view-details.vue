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

        <!-- 联系人信息 -->
        <h3 style="margin-bottom:10px">联系人信息</h3>
        <FormItem label="联系人类型: ">
          <Select v-model="form.aaa" style="width:200px" disabled>
            <Option value="1">财务</Option>
            <Option value="2">法人</Option>
          </Select>
        </FormItem>
        <!-- 财务 -->
        <div v-if="form.aaa == 1">
          <FormItem label="姓名: ">
            <Input
              type="text"
              style="width:200px"
              placeholder="请输入"
              v-model="form.ccc"
              :maxlength="32"
              disabled
            ></Input>
          </FormItem>
          <FormItem label="联系人手机号: ">
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd" disabled></Input>
          </FormItem>
          <FormItem label="证件类型: ">
            <Select v-model="form.aaa" style="width:200px" disabled>
              <Option value="1">身份证</Option>
            </Select>
          </FormItem>
          <FormItem label="证件号码: ">
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd" disabled></Input>
          </FormItem>
          <FormItem label="证件号码: ">
            <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd" disabled></Input>&nbsp;至&nbsp;
            <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd" disabled></Input>
          </FormItem>
        </div>
        <!-- 法人 -->
        <div v-else>
          <FormItem label="姓名: ">
            <Input
              type="text"
              style="width:200px"
              placeholder="请输入"
              v-model="form.ccc"
              :maxlength="32"
              disabled
            ></Input>
          </FormItem>
          <FormItem label="联系人手机号: ">
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd" disabled></Input>
          </FormItem>
          <FormItem label="证件类型: ">
            <Select v-model="form.aaa" style="width:200px" disabled>
              <Option value="1">身份证</Option>
            </Select>
          </FormItem>
          <FormItem label="证件号码: ">
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd" disabled></Input>
          </FormItem>
          <FormItem label="证件有效期: ">
            <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd" disabled></Input>&nbsp;至&nbsp;
            <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd" disabled></Input>
          </FormItem>
        </div>
        <!-- 联系人信息 -->

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
        <FormItem label="转账类型: " required>
          <RadioGroup v-model="form.settleResponse.type">
            <Radio label="b2c" disabled>个人账号</Radio>
            <Radio style="margin-left:20px" label="b2b" disabled>企业对公户</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="银行卡号类型: " required>
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

        <!-- 子商户应用 -->
        <h3 style="margin-bottom:10px">子商户应用</h3>
        <FormItem label="子商户应用名称: ">
          <Input
            type="text"
            style="width:200px"
            placeholder="请输入"
            v-model="form.ccc"
            :maxlength="50"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="公司名称: ">
          <Input
            type="text"
            style="width:200px"
            placeholder="请输入"
            v-model="form.ddd"
            :maxlength="32"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="法人手机号: ">
          <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd" disabled></Input>
        </FormItem>
        <FormItem label="证件号码: ">
          <Input type="text" style="width:200px" placeholder="请输入" v-model="form.ddd" disabled></Input>
        </FormItem>
        <FormItem label="证件有效期: ">
          <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd" disabled></Input>&nbsp;至&nbsp;
          <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd" disabled></Input>
        </FormItem>
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
        bsUploadList1: "",
        bsUploadList2: "",
        bsUploadList3: "",
        addMerchantList: [], //已选中商户列表
        form: {
          basicResponse: {
            merchantName: "英孚教育-武林中心",
            openAccountStatus: null,
            failureReason: null,
            progress: null,
            bankCardStatus: null,
            id: 1,
            type: "customer",
            merchantType: 0,
            merchantId: "2019061342261",
            brandId: 0,
            modifiedBy: "",
            gmtModified: "2019-11-07T16:24:55.000+0000"
          },
          picListResponse: [
            {
              id: 2,
              basicId: 1,
              picUrl: "www.12345.com111",
              picType: "101"
            },
            {
              id: 3,
              basicId: 1,
              picUrl: "www.12345.com1111",
              picType: "102"
            }
          ],
          userListResponse: [
            {
              id: 1,
              basicId: 1,
              type: 1,
              name: "李东帅11111",
              displayName: null,
              description: null,
              mobile: "18068295311",
              identityType: "01",
              identityNumber: "34122419930616051X",
              validFrom: "2019-12-12",
              validUntil: "2020-12-12",
              openAccountStatus: "submitted"
            }
          ],
          settleResponse: {
            id: 10,
            basicId: 1,
            account: "4732947238946234",
            name: "xxx科技有限公司",
            type: "b2b",
            mobile: "18068295311",
            openBank: "中国银行",
            cardType: 6,
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
                  merchantId: res.basicResponse.data.merchantId
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

            // 证件信息
            if (res.data.basicResponse.type == "business") {
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
            } else {
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
