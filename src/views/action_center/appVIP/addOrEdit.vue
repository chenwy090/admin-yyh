<template>
  <div>
    <!-- 选择商户对话框 -->
    <Modal
      v-model="merchantDisplay"
      title="选择优惠券"
      width="850"
      :closable="false"
      :mask-closable="false"
      footer-hide
    >
      <Form inline :label-width="70">
        <FormItem label="优惠券名称">
          <Input style="width:150px" type="text" v-model="searchData.name" placeholder="请输入商户名称"></Input>
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
          :columns="columns1"
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
      <Form style="margin:30px 3%;">
        <FormItem label="投放门店: " required>
          <RadioGroup v-model="form.putShop" @on-change="changeRadio()">
            <Radio :label="0">全国</Radio>
            <Radio :label="1" style="margin-left:20px">零售商</Radio>
            <Radio :label="2" style="margin-left:20px">城市</Radio>
            <Radio :label="3" style="margin-left:20px">自定义门店</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="选择零售商: " v-if="form.putShop == 1" required>
          <Select v-model="model10" multiple style="width:260px">
            <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="选择城市: " v-if="form.putShop == 2" required>
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
        <FormItem label="上传门店excel: " v-if="form.putShop == 3" required>
          <Button type="primary">上传文件</Button>
          <Button type="text" style="color:#169bd5">下载模板</Button>
        </FormItem>
        <!-- 选择优惠券 -->
        <Button type="primary" style="margin-bottom:20px" @click="openMerchantModal()">选择优惠券</Button>
        <div v-for="(item,index) in form.coupons" :key="index">
          <FormItem label="优惠券名称: " style="margin-bottom: 0px;">
            {{item.name}}
          </FormItem>
          <FormItem label="优惠券详情副标题: " style="display:inline-block;width: 300px;">
            <Input style="width:150px" type="text" v-model="item.subTitle" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="优惠券详情大图: " style="display:inline-block;width: 350px;">
            <div
              style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
            >
              <img :src="item.couponUrl" style="width:100%" />
            </div>
            <div style="display: inline-block;">
              <Upload
                ref="upload"
                type="drag"
                :format="['jpg','jpeg','png','bmp']"
                :on-success="bsHandleSuccess"
                :action="url"
                accept="image"
                :max-size="1024"
                :on-exceeded-size="handleMaxSize"
                :on-format-error="formatError"
                :defaultList="bsUploadList"
                :headers="userToken"
                :show-upload-list="false"
                style="display: inline-block;width:90px;"
              >
                <div style="width: 90px;height:90px;line-height: 90px;">
                  <Icon type="ios-camera" size="20" @click="makeIndex(index)" />
                </div>
              </Upload>
              <!-- <p style="font-size:12px">选择微信二维码 (不大于1M,JPG/PNG/JPEG/BMP）</p> -->
            </div>
          </FormItem>
          <Button shape="circle" icon="md-close" @click="delList(index)">删除</Button>
        </div>
        <!-- 选择优惠券 -->
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
  import { formatDate, checkImageWH, checkImage, uniqueArray } from "@/libs/date";
  import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";

  export default {
    name: "addMerchant",
    props: {
      id: null,
      addOrEdit: null
    },
    data() {
      return {
        // 图片
        userToken:{},
        imgIndex:null,
        bsUploadList: [],
        url: uploadOperationImage2AliOssURl,
        model10: [], // 临时
        cityList1: [
          // 零售商
          {
            value: "New York",
            label: "New York"
          },
          {
            value: "London",
            label: "London"
          }
        ],
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
          coupons: [{couponType:"",couponId:"",subTitle:"",couponUrl:"",name:'123'},],
          putShop: null,
          shopSets: null
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
      };
    },
    created: function() {
      this.userToken = {
            jwttoken: localStorage.getItem("jwttoken")
        };
      this.getprovincelist();
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (this.addOrEdit == 2) {
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
        // this.getMerchantList();
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
      delList(index) {
        this.form.coupons.splice(index)
      },

      // 上传图片index传值
      makeIndex(index) {
        this.imgIndex = index
      },

      //上传微信二维码
      bsHandleSuccess(res, file) {
        if (res.code == 200) {
          this.form.coupons[this.imgIndex].couponUrl = res.image_url;
          this.$Message.info("上传图片成功");
        } else {
          this.$Message.error(res.msg);
        }
      },

      handleMaxSize(file) {
        this.$Message.error("图片不大于1M");
      },

      formatError() {
        this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传");
      },

      handleBeforeUpload(file) {
        return checkImage(file);
      },

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

        if (this.addOrEdit == 1) {
          // 新增
          let data = this.form;
          if (this.form.merchantType == 0) {
            data.merchantId = this.addMerchantList[0].merchantId;
          } else {
            data.brandId = this.addMerchantList[0].id;
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
        window.location.href = "/document/2019-4-8壹账通技术服务协议.docx";
      },
      downloadDoc2() {
        // window.location.href = baseUrl+`/system/sys-shop-info/downloadTemplateShop`
        window.location.href =
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
