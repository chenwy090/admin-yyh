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
          <RadioGroup v-model="form.aaa">
            <Radio label="1">个人用户</Radio>
            <Radio label="0" style="margin-left:100px">企业对公用户</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="商户类型: ">
          <RadioGroup v-model="form.bbb">
            <Radio label="1">本地商户（单店）</Radio>
            <Radio label="0" style="margin-left:20px">本地商户（多店）</Radio>
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
        <FormItem label="营业执照: ">
          <img :src="form.img" class="CertificatesImg" />
        </FormItem>
        <FormItem label="法人身份证: ">
          <span style="display:inline-block">
            <img :src="form.img" class="CertificatesImg" />
            <div style="text-align: center;">正面</div>
          </span>
          <span style="display:inline-block;margin-left:20px">
            <img :src="form.img" class="CertificatesImg" />
            <div style="text-align: center;">反面</div>
          </span>
        </FormItem>
        <!-- 证件信息 -->

        <!-- 联系人信息 -->
        <h3 style="margin-bottom:10px">联系人信息</h3>
        <FormItem label="联系人类型: ">
          <Select v-model="form.aaa" style="width:200px">
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
            ></Input>
          </FormItem>
          <FormItem label="联系人手机号: ">
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd"></Input>
          </FormItem>
          <FormItem label="证件类型: ">
            <Select v-model="form.aaa" style="width:200px">
              <Option value="1">身份证</Option>
            </Select>
          </FormItem>
          <FormItem label="证件号码: ">
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd"></Input>
          </FormItem>
          <FormItem label="证件号码: ">
            <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd"></Input>&nbsp;至&nbsp;
            <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd"></Input>
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
            ></Input>
          </FormItem>
          <FormItem label="联系人手机号: ">
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd"></Input>
          </FormItem>
          <FormItem label="证件类型: ">
            <Select v-model="form.aaa" style="width:200px">
              <Option value="1">身份证</Option>
            </Select>
          </FormItem>
          <FormItem label="证件号码: ">
            <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd"></Input>
          </FormItem>
          <FormItem label="证件有效期: ">
            <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd"></Input>&nbsp;至&nbsp;
            <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd"></Input>
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
            v-model="form.ccc"
            :maxlength="32"
          ></Input>
        </FormItem>
        <FormItem label="开户名: ">
          <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd"></Input>
        </FormItem>
        <FormItem label="银行预留手机: ">
          <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd"></Input>
        </FormItem>
        <FormItem label="证件号码: ">
          <Input type="text" style="width:200px" placeholder="请输入" v-model="form.ddd"></Input>
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
          ></Input>
        </FormItem>
        <FormItem label="公司名称: ">
          <Input
            type="text"
            style="width:200px"
            placeholder="请输入"
            v-model="form.ddd"
            :maxlength="32"
          ></Input>
        </FormItem>
        <FormItem label="法人手机号: ">
          <Input type="number" style="width:200px" placeholder="请输入" v-model="form.ddd"></Input>
        </FormItem>
        <FormItem label="证件号码: ">
          <Input type="text" style="width:200px" placeholder="请输入" v-model="form.ddd"></Input>
        </FormItem>
        <FormItem label="证件有效期: ">
          <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd"></Input>&nbsp;至&nbsp;
          <Input type="number" style="width:230px" placeholder="请输入" v-model="form.ddd"></Input>
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
        addMerchantList: [], //已选中商户列表
        form: {
          aaa: "1",
          bbb: "1",
          ccc: "",
          ddd: null,
          img: "http://image.52iuh.cn/wx_mini/jMGq1r0HaC.jpg"
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
          // {
          //   title: "操作",
          //   align: "center",
          //   minWidth: 140,
          //   key: "action",
          //   slot: "operate"
          // }
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
          // {
          //   title: "操作",
          //   align: "center",
          //   minWidth: 140,
          //   key: "action",
          //   slot: "operate"
          // }
        ]
      };
    },
    created: function() {
      this.getAllInfoFn()
    },
    mounted() {},
    methods: {
      // 查询列表
      getAllInfoFn() {
        getAllInfo(this.id).then(res => {
          if(res.code == 200){

          }else {
            this.msgErr(res.msg)
          }
        })
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
