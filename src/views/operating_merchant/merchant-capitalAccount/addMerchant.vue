<template>
  <div>
    <!-- 选择商户对话框 -->
    <Modal
      v-model="merchantDisplay"
      :title="form.merchantType == 0?'选择商户':'选择品牌'"
      width="850"
      :closable="false"
      :mask-closable="false"
      footer-hide
    >
      <Form inline :label-width="70">
        <FormItem :label="form.merchantType == 0?'商户名称: ':'品牌名称: '">
          <Input style="width:150px" type="text" v-model="searchData.name" placeholder="请输入商户名称"></Input>
        </FormItem>
        <FormItem label="市/省: " v-if="form.merchantType == 0">
          <Select v-model="searchData.provinceId" style="width:100px" @on-change="getcitylist()">
            <Option
              v-for="(item,index) in provinceList"
              :key="index"
              :value="item.provinceCode"
            >{{item.provinceName}}</Option>
          </Select>
          <Select v-model="searchData.cityId" style="width:100px;margin-left:10px">
            <Option
              v-for="(item,index) in cityList"
              :key="index"
              :value="item.cityCode"
            >{{item.cityName}}</Option>
          </Select>
        </FormItem>
        <FormItem :label-width="30">
          <Button type="primary" icon="ios-search" @click="search">搜索</Button>
          <Button icon="md-refresh" @click="reset" style="margin-left:10px">重置</Button>
        </FormItem>
      </Form>
      <div>
        <!-- 商户列表 -->
        <Table
          border
          highlight-row
          width="810"
          :columns="form.merchantType == 0?columns3:columns4"
          :data="merchantList"
          @on-current-change="changeData"
        >
          <!-- <template slot-scope="{ row }" slot="action">
              <Button type="text" size="small">查看</Button>
          </template>-->
        </Table>
        <!-- 商户列表 -->
      </div>
      <!-- 分页器 -->
      <Row type="flex" justify="end" style="margin-top: 20px;">
        <Page
          :total="totalSize"
          show-total
          show-elevator
          :current="current"
          @on-change="changeCurrent"
        ></Page>
      </Row>
      <!-- 分页器 -->
      <div style="margin-top: 20px;overflow: hidden;">
        <div style="float: right;" slot="footer">
          <Button style="margin-right: 20px" @click="cancel">取消</Button>
          <Button type="primary" @click="ok">确定</Button>
        </div>
      </div>
    </Modal>
    <!-- 选择商户对话框 -->
    <Card>
      <!-- <Button type="dashed" icon="md-arrow-round-back">返回列表</Button> -->
      <Divider orientation="left">
        <h3>商户信息</h3>
      </Divider>
      <Form style="margin:30px 3%;">
        <FormItem required>
          <RadioGroup v-model="form.type">
            <Radio label="customer">个人用户</Radio>
            <Radio label="business" style="margin-left:100px">企业对公用户</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="商户类型: " required>
          <RadioGroup v-model="form.merchantType" @on-change="changeRadio()">
            <Radio :label="0">本地商户（单店）</Radio>
            <Radio :label="1" style="margin-left:20px">本地商户（多店）</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="form.merchantType == 0?'选择商户: ':'选择品牌: '" required>
          <Button @click="openMerchantModal()">请选择</Button>
        </FormItem>
        <!-- 商户列表 -->
        <Table
          border
          width="810"
          :columns="form.merchantType == 0?columns1:columns2"
          :data="addMerchantList"
        >
          <template slot-scope="{ row }" slot="operate">
            <Button
              size="large"
              style="color:#2db7f5"
              icon="ios-trash-outline"
              @click="delList(row)"
            >移除</Button>
          </template>
        </Table>
        <!-- 商户列表 -->
        <div style="margin-top:20px">
          申请注册即表示同意
          <a @click="downloadDoc1()">《壹账通技术服务协议》</a>和
          <a @click="downloadDoc2()">《吉林亿联银行电子交易账簿管理协议》</a>
        </div>
        <FormItem style="margin-top:30px">
          <Button
            type="info"
            style="width:240px;margin-right: 20px; float: left;"
            @click="goback()"
          >取&nbsp;&nbsp;&nbsp;消</Button>
          <Button
            type="primary"
            style="width:240px; float: left;"
            @click="submit()"
          >保&nbsp;&nbsp;&nbsp;存</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
  import {
    addMerchantInfo,
    judgeMerchant,
    getMerchantInfo,
    editMerchantInfo
  } from "@/api/sys";
  import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
  } from "@/libs/axios";
  import { baseUrl } from "@/api/index";
  import { formatDate, checkImageWH, checkImage, uniqueArray } from "@/libs/date";

  export default {
    name: "addMerchant",
    props: {
      id: null,
      addEdit: null
    },
    data() {
      return {
        userInfo: {}, // 用户信息
        provinceList: [], //省份
        cityList: [], //省份
        // 搜索
        searchData: {
          name: "",
          cityId: "",
          provinceId: ""
        },
        // 分页
        totalSize: 10,
        current: 1,
        merchantDisplay: false, // 选择商户显示
        merchantList: [
          {
            a: 1,
            b: 2
          },
          {
            a: 3,
            b: 4
          }
        ], //要选择的商户列表
        merchantListTemp: [], //已选中临时商户
        addMerchantList: [], //已选中商户列表
        form: {
          type: "",
          merchantType: null
        },
        // 个人
        columns1: [
          {
            title: "商户名称",
            align: "center",
            minWidth: 200,
            key: "name"
          },
          {
            title: "商户编号",
            align: "center",
            minWidth: 200,
            key: "merchantId"
          },
          {
            title: "操作",
            align: "center",
            minWidth: 140,
            key: "action",
            slot: "operate"
          }
        ],
        // 企业
        columns2: [
          {
            title: "品牌名称",
            align: "center",
            minWidth: 200,
            key: "name"
          },
          {
            title: "关联店数",
            align: "center",
            minWidth: 200,
            key: "relationMerchantCount"
          },
          {
            title: "操作",
            align: "center",
            minWidth: 140,
            key: "action",
            slot: "operate"
          }
        ],
        // 选择商户
        columns3: [
          {
            title: "商户名称",
            align: "center",
            width: 404,
            key: "name"
          },
          {
            title: "商户编号",
            align: "center",
            width: 404,
            key: "merchantId"
          }
        ],
        // 选择品牌
        columns4: [
          {
            title: "品牌名称",
            align: "center",
            width: 404,
            key: "parentName"
          },
          {
            title: "关联店数",
            align: "center",
            width: 404,
            key: "relationMerchantCount"
          }
        ]
      };
    },
    created: function() {
      this.getprovincelist();
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (this.addEdit == 2) {
        this.getMerchantInfoFn();
      }
    },
    mounted() {},
    methods: {
      // 根据id获取信息
      getMerchantInfoFn() {
        getMerchantInfo(this.id).then(res => {
          if (res.code == 200) {
            this.form.id = res.data.id;
            this.form.type = res.data.type;
            this.form.merchantType = res.data.merchantType;
            if (res.data.merchantType == 0) {
              // 单店
              this.addMerchantList = [
                {
                  name: res.data.merchantName,
                  merchantId: res.data.merchantId
                }
              ];
            } else if (res.data.merchantType == 1) {
              // 多店
              this.addMerchantList = [
                {
                  name: res.data.merchantName,
                  id: res.data.brandId
                }
              ];
            }
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 改变商户类型状态
      changeRadio() {
        this.addMerchantList = [];
      },

      //获取省份信息数据
      getprovincelist() {
        postRequest("/system/area/province/list").then(res => {
          if (res.code == 200) {
            this.provinceList = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },
      //根据省份code获取城市信息数据
      getcitylist() {
        getRequest("/system/area/city/" + this.searchData.provinceId).then(
          res => {
            if (res.code == 200) {
              this.cityList = res.data;
              // this.searchItem.areaId = "";
            } else {
              this.$Message.error(res.msg);
            }
          }
        );
      },

      // 打开选择列表对话框
      openMerchantModal() {
        if(!this.form.merchantType) {
          this.msgErr('请选择商户类型')
          return
        }
        if (this.form.merchantType == 0) {
          this.getMerchantList();
        } else if (this.form.merchantType == 1) {
          this.getBrandList();
        }
        this.merchantDisplay = true;
      },
      // 商户列表
      getMerchantList() {
        const reqParams = this.searchData;
        postRequest(
          "/merchant/merchantInfo/list?pageNum=" + this.current + "&pageSize=10",
          reqParams
        ).then(res => {
          if (res.isSuccess) {
            this.totalSize = res.data.total;
            this.merchantList = res.data.records;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },
      // 品牌列表
      getBrandList() {
        const reqParams = {
          name: this.searchData.name
        };
        postRequest(
          "/merchant/brandMain/list?pageNum=" + this.current + "&pageSize=10",
          reqParams
        ).then(res => {
          if (res.isSuccess) {
            this.totalSize = res.data.total;
            this.merchantList = res.data.records;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      // 选中列表
      changeData(currentRow, oldCurrentRow) {
        this.msgOk("选择成功");
        this.merchantListTemp = [currentRow];
      },

      // 确认选择商户
      ok() {
        if (this.merchantListTemp.length == 0) {
          this.msgErr("未选择商户");
          return;
        }
        this.addMerchantList = this.merchantListTemp;
        this.merchantDisplay = false;
      },
      // 取消选择商户
      cancel() {
        this.merchantDisplay = false;
      },

      // 分页
      changeCurrent(current) {
        this.current = current;
        if (this.form.merchantType == 0) {
          this.getMerchantList();
        } else if (this.form.merchantType == 1) {
          this.getBrandList();
        }
      },

      // 搜索
      search() {
        this.current = 1;
        this.totalSize = 0; //总条数
        if (this.form.merchantType == 0) {
          this.getMerchantList();
        } else if (this.form.merchantType == 1) {
          this.getBrandList();
        }
      },

      // 重置
      reset() {
        (this.searchData.name = ""),
          (this.searchData.cityId = ""),
          (this.searchData.provinceId = "");
        this.current = 1;
        this.search();
      },

      // 移除
      delList() {
        this.addMerchantList = [];
      },

      // judge() {

      //   if (this.merchantListTemp) {
      //     let data = {};
      //     if (this.form.merchantType == 0) {
      //       data.type = 0;
      //       data.merchantId = this.addMerchantList[0].merchantId;
      //     } else {
      //       data.type = 1;
      //       data.brandId = this.addMerchantList[0].id;
      //     }

      //     judgeMerchant(data).then(res => {
      //       if (res.code == 200) {
      //         this.submit();
      //       } else if (res.code == 300) {
      //         this.$Modal.warning({
      //           title: "资金账号冲突提示",
      //           content: res.msg
      //         });
      //       } else {
      //         this.msgErr(res.msg);
      //       }
      //     });
      //   }else {
      //     this.submit();
      //   }
      // },

      submit() {
        // 验证
        if (!this.form.type) {
          this.msgErr("请选择 个人用 或 企业对公用户");
          return;
        }
        if (this.form.merchantType == null) {
          this.msgErr("请选择商户类型");
          return;
        }
        if (this.addMerchantList.length == 0) {
          let msg;
          if (this.form.merchantType == 0) {
            msg = "商户";
          } else {
            msg = "品牌";
          }
          this.msgErr("请选择" + msg);
          return;
        }

        if (this.addEdit == 1) {
          // 新增
          let data = this.form;
          if (this.form.merchantType == 0) {
            data.merchantId = this.addMerchantList[0].merchantId;
          } else {
            data.brandId = this.addMerchantList[0].parentId;
          }
          data.createBy = this.userInfo.username;
          data.modifiedBy = this.userInfo.username;
          // console.log(data);
          // return
          addMerchantInfo(data).then(res => {
            if (res.code == 200) {
              this.msgOk("新增成功");
              this.goback();
            } else {
              this.msgErr(res.msg);
            }
          });
        } else {
          let data = this.form;
          if (this.form.merchantType == 0) {
            data.merchantId = this.addMerchantList[0].merchantId;
          } else {
            data.brandId = this.addMerchantList[0].id;
          }
          data.modifiedBy = this.userInfo.username;
          // 编辑
          editMerchantInfo(data).then(res => {
            if (res.code == 200) {
              this.msgOk("编辑成功");
              this.goback();
            } else {
              this.msgErr(res.msg);
            }
          });
        }
      },

      // 返回
      goback() {
        this.$emit("changeStatus", false);
      },

      // 下载
      downloadDoc1() {
        // window.location.href = baseUrl+`/system/sys-shop-info/downloadTemplateShop`
        window.location.href =
          baseUrl + "/document/2019-4-8壹账通技术服务协议.docx";
      },
      downloadDoc2() {
        // window.location.href = baseUrl+`/system/sys-shop-info/downloadTemplateShop`
        window.location.href =
          baseUrl +
          "/document/《吉林亿联银行股份有限公司电子交易账簿管理协议》-用户协议.docx";
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
</style>
