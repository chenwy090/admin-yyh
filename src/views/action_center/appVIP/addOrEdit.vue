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
      <Form :label-width="70">
        <FormItem :label-width="22">
          <RadioGroup v-model="searchData.type" type="button" size="large">
            <Radio label="1">超市券</Radio>
            <Radio label="2">周边券</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="券名称" style="display:inline-block">
          <Input style="width:150px" type="text" v-model="searchData.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem :label-width="22" style="display:inline-block">
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
          @on-select="selectionCampagin"
          @on-select-cancel="cancelCampagin"
          @on-select-all="allCampagin"
          @on-select-all-cancel="cancelAllCampagin"
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
          <Select v-model="retailer" multiple style="width:260px">
            <Option
              v-for="item in retailerList"
              :value="item.venderId"
              :key="item.value"
            >{{ item.venderName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="选择城市: " v-if="form.putShop == 2" required>
          <Select v-model="provinceId" style="width:100px" @on-change="getcitylist()">
            <Option
              v-for="(item,index) in provinceList"
              :key="index"
              :value="item.provinceCode"
            >{{item.provinceName}}</Option>
          </Select>
          <Select v-model="cityId" style="width:100px;margin-left:10px">
            <Option
              v-for="(item,index) in cityList"
              :key="index"
              :value="item.cityCode"
            >{{item.cityName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="上传门店excel: " v-if="form.putShop == 3" required>
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            :before-upload="handleUpload"
            style="display:inline-block"
          >
            <Button icon="ios-cloud-upload-outline">请上传文件</Button>
          </Upload>
          <Button type="text" style="color:#169bd5" @click="downloadDoc()">下载模板</Button>
        </FormItem>
        <!-- 选择优惠券 -->
        <Button type="primary" style="margin-bottom:20px" @click="openMerchantModal()">选择优惠券</Button>
        <div v-for="(item,index) in form.coupons" :key="index">
          <FormItem label="优惠券名称: " style="margin-bottom: 0px;">{{item.couponName}}</FormItem>
          <FormItem label="优惠券详情副标题: " style="display:inline-block;width: 300px;">
            <Input style="width:150px" type="text" v-model="item.subTitle" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="优惠券详情大图: " style="display:inline-block;width: 350px;">
            <div
              style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
              v-if="item.couponUrl"
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
                <div style="width: 90px;height:90px;line-height: 90px;" @click="makeIndex(index)">
                  <Icon type="ios-camera" size="20"/>
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
    addAppVip,
    getMerchantInfo,
    editMerchantInfo,
    getCoupon,
    getRetailerInfoList
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
        // 上传文件
        file: null,
        tempList: null, // 临时
        provinceId: "", // 省
        cityId: "", //市
        // 图片
        userToken: {},
        imgIndex: null,
        bsUploadList: [],
        url: uploadOperationImage2AliOssURl,
        retailer: "", // 选中零售商
        retailerList: [], // 零售商
        userInfo: {}, // 用户信息
        provinceList: [], //省份
        cityList: [], //省份
        // 搜索
        searchData: {
          type: "",
          name: ""
        },
        // 分页
        totalSize: 10,
        current: 1,
        merchantDisplay: false, // 选择商户显示
        merchantList: [], //要选择的商户列表
        merchantListTemp: [], //已选中临时商户
        addMerchantList: [], //已选中商户列表
        form: {
          coupons: [
            // {
            //   couponType: "",
            //   couponId: "",
            //   subTitle: "",
            //   couponUrl: "",
            //   name: "123"
            // }
          ],
          putShop: null,
          shopSets: null
        },
        // 个人
        columns1: [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "优惠券ID",
            align: "center",
            minWidth: 200,
            key: "couponId"
          },
          {
            title: "优惠券名称",
            align: "center",
            minWidth: 200,
            key: "couponName"
          },
          {
            title: "数量",
            align: "center",
            minWidth: 140,
            key: "useCount"
            // slot: "operate"
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
        ]
      };
    },
    created: function() {
      this.userToken = {
        jwttoken: localStorage.getItem("jwttoken")
      };
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.getprovincelist();
      this.getRetailerInfoListFn();
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
        getRequest("/system/area/city/" + this.provinceId).then(res => {
          if (res.code == 200) {
            this.cityList = res.data;
            // this.searchItem.areaId = "";
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      // 获取零售商
      getRetailerInfoListFn() {
        getRetailerInfoList().then(res => {
          if (res.code == 200) {
            this.retailerList = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      // 打开选择列表对话框
      openMerchantModal() {
        // this.getMerchantList();
        this.merchantDisplay = true;
      },
      // 优惠券列表
      getCouponFn() {
        // const reqParams = this.searchData;
        getCoupon(this.searchData.type, this.searchData.name, this.current).then(
          res => {
            if (res.isSuccess) {
              this.totalSize = res.data.total;
              this.merchantList = res.data.records;
              if (this.form.coupons.length != 0) {
                for (let i = 0; i < this.merchantList.length; i++) {
                  for (let j = 0; j < this.form.coupons.length; j++) {
                    if (
                      this.merchantList[i].couponId ==
                      this.form.coupons[j].couponId
                    ) {
                      this.merchantList[i]._checked = true;
                    }
                  }
                }
              }
            } else {
              this.$Message.error(res.msg);
            }
          }
        );
      },

      // 多选部分
      // 取消选中
      cancelCampagin(selection, row) {
        for (let i = 0; i < this.form.coupons.length; i++) {
          if (row.couponId == this.form.coupons[i].couponId) {
            this.form.coupons.splice(i, 1);
          }
        }
      },

      // 选中
      selectionCampagin(selection, row) {
        let data = {
          subTitle: "",
          couponUrl: ""
        };
        data.couponId = row.couponId;
        data.couponType = row.couponType;
        data.couponName = row.couponName;
        this.form.coupons.push(data);
      },

      //全选
      allCampagin(selection) {
        for (let i = 0; i < selection.length; i++) {
          let data = {
            subTitle: "",
            couponUrl: ""
          };
          data.couponId = selection[i].couponId;
          data.couponType = selection[i].couponType;
          data.couponName = selection[i].couponName;
          this.form.coupons.push(data);
        }
        // this.form.coupons.push(selection[i]);
        this.tempList = selection;
      },

      // 取消全选
      cancelAllCampagin(selection) {
        //去重
        var afterArr = uniqueArray(this.form.coupons, "couponId");
        this.form.coupons = afterArr;
        for (let i = 0; i < this.form.coupons.length; i++) {
          for (let j = 0; j < this.tempList.length; j++) {
            if (this.tempList[j].couponId == this.form.coupons[i].couponId) {
              this.form.coupons.splice(i, 1);
            }
          }
        }
      },

      // 移除
      delList(index) {
        this.form.coupons.splice(index, 1);
      },

      // 确认选择商户
      ok() {
        // if (this.merchantListTemp.length == 0) {
        //   this.msgErr("未选择商户");
        //   return;
        // }
        // this.addMerchantList = this.merchantListTemp;
        // this.merchantDisplay = false;
        if (this.form.coupons && this.form.coupons.length > 0) {
          // for(var obj of this.form.coupons){
          //     this.form.coupons.push(obj);
          // }
          var afterArr = uniqueArray(this.form.coupons, "couponId");
          this.form.coupons = afterArr;
          this.merchantDisplay = false;
        } else {
          this.msgErr("至少选一个商户");
        }
      },
      // 取消选择商户
      cancel() {
        this.merchantDisplay = false;
      },

      // 分页
      changeCurrent(current) {
        this.current = current;
        this.getCouponFn();
      },

      // 搜索
      search() {
        if (!this.searchData.type) {
          this.msgErr("请选择优惠券类型");
          return;
        }
        this.current = 1;
        // this.totalSize = 0; //总条数
        this.getCouponFn();
      },

      // 重置
      reset() {
        this.searchData.name = "";
        this.searchData.type = "";
        this.current = 1;
        this.search();
      },

      // 上传图片index传值
      makeIndex(index) {
        this.imgIndex = index;
      },

      //上传图片
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

      // 上传文件
      handleUpload(file) {
        this.file = file;
        // this.isCheckDisabled = false;
        // console.log(this.file);
        return false;
      },

      submit() {
        // console.log(this.addOrEdit);
        // return;
        if (!this.ruleValidate1()) {
          return;
        }
        let shopSets
        if(this.form.putShop == 1) {
          shopSets = [{venderId:this.retailer}]
        }else if (this.form.putShop == 2) {
          shopSets = [{provinceCode:this.provinceId,cityCode:this.cityId}]
        }

        let formData = new FormData();
        formData.append('putShop', JSON.stringify(this.form.putShop));
        formData.append('shopSets', JSON.stringify(shopSets));
        formData.append('coupons', JSON.stringify(this.form.coupons));
        if(this.form.putShop == 3) {
          formData.append('file', this.file);
        }

        if (this.addOrEdit == 1) {
          // 新增
          // let data = this.form;
          // if (this.form.merchantType == 0) {
          //   data.merchantId = this.addMerchantList[0].merchantId;
          // } else {
          //   data.brandId = this.addMerchantList[0].id;
          // }
          // data.createBy = this.userInfo.username;
          // data.modifiedBy = this.userInfo.username;
          // console.log(data);
          // return
          addAppVip(formData).then(res => {
            if (res.code == 200) {
              this.msgOk("新增成功");
              this.goback();
            } else if(res.code == 100001) {
              this.$Modal.confirm({
                    title: '提示',
                    content: res.msg,
                    okText: '继续添加'
                });
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

      // 验证
      ruleValidate1() {
        if (this.form.putShop == null) {
          this.msgErr("请输入投放门店");
          return;
        } else {
          if (this.form.putShop == 1) {
            if (!this.retailer) {
              this.msgErr("请选择零售商");
              return;
            }
          }
          if (this.form.putShop == 2) {
            if (!this.cityId) {
              this.msgErr("请选择城市");
              return;
            }
          }
          if (this.form.putShop == 3) {
            if (this.file == null) {
              this.msgErr("请上传文件");
              return;
            }
          }
        }

        // 优惠券
        if(this.form.coupons.length == 0) {
          this.msgErr("请选择优惠券");
          return;
        }
        for (let i = 0; i < this.form.coupons.length; i++) {
          if(!this.form.coupons[i].subTitle) {
            this.msgErr(this.form.coupons[i].couponName + '的副标题不能为空');
            return;
          }
          if(!this.form.coupons[i].couponUrl) {
            this.msgErr(this.form.coupons[i].couponName + '的详情大图不能为空');
            return;
          }
        }

        return true;
      },

      // 返回
      goback() {
        this.$emit("changeStatus", false);
      },

      // 下载
      downloadDoc() {
        // window.location.href = baseUrl+`/system/sys-shop-info/downloadTemplateShop`
        window.location.href = "/document/shop-20191119150247.docx";
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
