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
          :loading="tableLoading"
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
            <Radio :disabled="addOrEdit == 3" :label="0">全国</Radio>
            <!-- <Radio :disabled="addOrEdit == 3" :label="1" style="margin-left:20px">零售商</Radio> -->
            <Radio :disabled="addOrEdit == 3" :label="2" style="margin-left:20px">城市</Radio>
            <Radio :disabled="addOrEdit == 3" :label="3" style="margin-left:20px">自定义门店</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="选择零售商: " v-if="form.putShop == 0 || form.putShop == 2" required>
          <Button
            type="primary"
            icon="md-add"
            @click="addOrDelVender(1)"
            v-if="addOrEdit != 3"
          >添加零售商</Button>
          <div
            v-for="(item, index) in retailer"
            :key="index"
            style="margin:10px 0 0 85px"
          >
            <Select v-model="item.venderId" style="width:260px" :disabled="addOrEdit == 3">
              <Option
                v-for="item in retailerList"
                :value="item.venderId"
                :key="item.value"
              >{{ item.venderName }}</Option>
            </Select>
            <Button
              shape="circle"
              icon="md-close"
              style="margin-left:10px"
              @click="addOrDelVender(2,index)"
              v-if="retailer.length != 1 && addOrEdit != 3"
            ></Button>
          </div>
        </FormItem>
        <FormItem label="选择城市: " v-if="form.putShop == 2" required>
          <Button
            type="primary"
            icon="md-add"
            @click="addOrDelCity(1)"
            v-if="addOrEdit != 3"
          >添加城市</Button>
          <div
            v-for="(list, num) in provinceOrcity"
            :key="num"
            style="margin:10px 0 0 74px"
          >
            <Select
              :disabled="addOrEdit == 3"
              v-model="list.provinceCode"
              style="width:100px"
              @on-change="getcitylist(num)"
            >
              <Option
                v-for="(item,index) in provinceList"
                :key="index"
                :value="item.provinceCode"
              >{{item.provinceName}}</Option>
            </Select>
            <Select
              :disabled="addOrEdit == 3"
              v-model="list.cityCode"
              style="width:100px;margin-left:10px"
            >
              <Option
                v-for="(item,index) in cityList[num]"
                :key="index"
                :value="item.cityCode"
              >{{item.cityName}}</Option>
            </Select>
            <Button
              shape="circle"
              icon="md-close"
              style="margin-left:10px"
              @click="addOrDelCity(2,num)"
              v-if="provinceOrcity.length != 1 && addOrEdit != 3"
            ></Button>
          </div>
        </FormItem>
        <FormItem label="上传门店excel: " v-if="form.putShop == 3 && addOrEdit != 3" required>
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            :before-upload="handleUpload"
            style="display:inline-block"
          >
            <Button icon="ios-cloud-upload-outline">{{addOrEdit==1?'上传文件':'修改上传文件'}}</Button>
          </Upload>
          <Button type="text" style="color:#169bd5" @click="downloadDoc()">下载模板</Button>
        </FormItem>
        <!-- 选择优惠券 -->
        <Button
          type="primary"
          style="margin-bottom:20px"
          v-if="addOrEdit != 3"
          @click="openMerchantModal()"
        >选择优惠券</Button>
        <Card
          v-for="(item,index) in form.coupons"
          :key="index"
          style="width:850px;margin-bottom:10px"
        >
          <div>
            <FormItem label="优惠券名称: " style="margin-bottom:0px">{{item.couponName}}</FormItem>
            <div v-if="addOrEdit == 3">
              <FormItem label="优惠券ID: " class="couponInformation">{{item.couponId}}</FormItem>
              <FormItem label="领券量: " class="couponInformation">{{item.receiveCount}}</FormItem>
              <FormItem label="剩余量: " class="couponInformation">{{item.surplusCount}}</FormItem>
              <FormItem label="核销量: " class="couponInformation">{{item.useCount}}</FormItem>
            </div>
            <FormItem label="优惠券详情副标题: " style="display:inline-block;width: 300px;">
              <Input
                :disabled="addOrEdit == 3"
                style="width:150px"
                type="text"
                v-model="item.subTitle"
                placeholder="请输入"
              ></Input>
            </FormItem>
            <FormItem label="优惠券详情大图: " style="display:inline-block;width: 350px;">
              <div
                style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                v-if="item.couponUrl"
              >
                <img :src="item.couponUrl" style="width:100%" />
              </div>
              <div style="display: inline-block;" v-if="addOrEdit != 3">
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
                    <Icon type="ios-camera" size="20" />
                  </div>
                </Upload>
                <!-- <p style="font-size:12px">选择微信二维码 (不大于1M,JPG/PNG/JPEG/BMP）</p> -->
              </div>
            </FormItem>
            <Button
              shape="circle"
              icon="md-close"
              v-if="form.coupons.length != 1 && addOrEdit != 3"
              @click="delList(index)"
            >删除</Button>
          </div>
        </Card>
        <!-- 选择优惠券 -->
        <FormItem style="margin-top:30px">
          <Button
            type="info"
            style="width:240px;margin-right: 20px; float: left;"
            @click="goback(1)"
          >{{addOrEdit != 3? '取&nbsp;&nbsp;&nbsp;消': '关&nbsp;&nbsp;&nbsp;闭'}}</Button>
          <Button
            type="primary"
            style="width:240px; float: left;"
            @click="submit()"
            v-if="addOrEdit != 3"
          >保&nbsp;&nbsp;&nbsp;存</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
  import {
    addAppVip,
    getAppVipInfo,
    editAppVip,
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
        tableLoading: false,
        // 编辑时要删除的id
        delCouponIds: [], //删除的优惠券id
        delShopSetIds: [], //删除的零售商和城市id
        // 上传文件
        file: null,
        // tempList: null, // 临时
        provinceOrcity: [{ provinceCode: "", cityCode: "" }], // 选中城市列表
        provinceId: "", // 省
        cityId: "", //市
        // 图片
        userToken: {},
        imgIndex: null,
        bsUploadList: [],
        url: uploadOperationImage2AliOssURl,
        retailer: [{ venderId: "" }], // 选中零售商
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
            key: "surplusCount"
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
      if (this.addOrEdit != 1) {
        this.getAppVipInfoFn();
      }
    },
    mounted() {},
    methods: {
      // 根据id获取信息
      getAppVipInfoFn() {
        getAppVipInfo(this.id).then(res => {
          if (res.code == 200) {
            this.form.putShop = res.data.putShop;
            // this.form.coupons = res.data.couponList;
            if (this.addOrEdit == 2) {
              let dataArr = res.data.couponList;
              for (let z = 0; z < dataArr.length; z++) {
                let data = {
                  id: dataArr[z].id,
                  couponType: dataArr[z].couponType,
                  couponId: dataArr[z].couponId,
                  subTitle: dataArr[z].subTitle,
                  couponUrl: dataArr[z].couponUrl,
                  couponName: dataArr[z].couponName
                };
                this.form.coupons.push(data);
              }
              this.form.id = res.data.id;
            } else if (this.addOrEdit == 3) {
              this.form.coupons = res.data.couponList;
            }
            // this.form.shopSets = res.data.shopSetList;
            if (res.data.putShop == 1) {
              this.retailer = [];
              let list = res.data.shopSetList;
              for (let i = 0; i < list.length; i++) {
                let data = { id: list[i].id, venderId: list[i].venderId };
                this.retailer.push(data);
              }
            } else if (res.data.putShop == 2) {
              this.provinceOrcity = [];
              let list = res.data.shopSetList;
              for (let i = 0; i < list.length; i++) {
                let data = {
                  id: list[i].id,
                  provinceCode: list[i].provinceCode,
                  cityCode: list[i].cityCode
                };
                this.provinceOrcity.push(data);
              }
              for (let j = 0; j < this.provinceOrcity.length; j++) {
                this.getcitylist(j);
              }
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
      getcitylist(num) {
        this.cityList.splice(num, 1, []);
        getRequest(
          "/system/area/city/" + this.provinceOrcity[num].provinceCode
        ).then(res => {
          if (res.code == 200) {
            this.cityList.splice(num, 1, res.data);
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      // 加减城市
      addOrDelCity(type, index) {
        if (type == 1) {
          this.provinceOrcity.push({ provinceCode: "", cityCode: "" });
        } else {
          if (this.addOrEdit == 2) {
            this.delShopSetIds.push(this.provinceOrcity[index].id);
            // console.log(this.delShopSetIds);
          }
          this.provinceOrcity.splice(index, 1);
          this.cityList.splice(index, 1);
        }
      },

      // 加减零售商
      addOrDelVender(type, index) {
        if (type == 1) {
          this.retailer.push({ venderId: "" });
        } else {
          if (this.addOrEdit == 2) {
            this.delShopSetIds.push(this.retailer[index].id);
            // console.log(this.delShopSetIds);
          }
          this.retailer.splice(index, 1);
        }
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
        this.merchantList = [];
        this.merchantDisplay = true;
      },
      // 优惠券列表
      getCouponFn() {
        this.tableLoading = true;
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
              this.tableLoading = false;
            } else {
              this.$Message.error(res.msg);
              this.tableLoading = false;
            }
          }
        );
      },

      // 多选部分
      // 取消选中
      cancelCampagin(selection, row) {
        for (let i = 0; i < this.form.coupons.length; i++) {
          if (row.couponId == this.form.coupons[i].couponId) {
            if (this.form.coupons[i].id) {
              this.delCouponIds.push(this.form.coupons[i].id);
            }
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
        // this.tempList = selection;
      },

      // 取消全选
      cancelAllCampagin(selection) {
        // console.log(this.tempList);
        // console.log(this.form.coupons);
        //去重
        var afterArr = uniqueArray(this.form.coupons, "couponId");
        this.form.coupons = afterArr;
        for (let i = 0; i < this.merchantList.length; i++) {
          for (let j = 0; j < this.form.coupons.length; j++) {
            if (this.merchantList[i].couponId == this.form.coupons[j].couponId) {
              this.form.coupons.splice(j, 1);
            }
          }
        }
      },

      // 移除
      delList(index) {
        if (this.addOrEdit == 2) {
          this.delCouponIds.push(this.form.coupons[index].id);
          // console.log(this.delCouponIds);
        }
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
        if (!this.ruleValidate1()) {
          return;
        }

        // console.log(shopSets);
        // return;

        if (this.addOrEdit == 1) {
          // 新增
          let shopSets;
          if (this.form.putShop == 1) {
            // 零售商
            let arr = [];
            for (let i = 0; i < this.retailer.length; i++) {
              let obj = { venderId: this.retailer[i] };
              arr.push(obj);
            }
            shopSets = arr;
          } else if (this.form.putShop == 2) {
            shopSets = this.provinceOrcity;
          }

          let formData = new FormData();
          formData.append("putShop", JSON.stringify(this.form.putShop));
          formData.append("shopSets", JSON.stringify(shopSets));
          formData.append("coupons", JSON.stringify(this.form.coupons));
          if (this.form.putShop == 3) {
            formData.append("file", this.file);
          }
          addAppVip(formData).then(res => {
            if (res.code == 200) {
              this.msgOk("新增成功");
              this.goback();
            } else if (res.code == 100001) {
              this.$Modal.confirm({
                title: "提示",
                content: res.msg,
                okText: "继续添加"
              });
            } else {
              this.msgErr(res.msg);
            }
          });
        } else {
          // 编辑
          let shopSets;
          if (this.form.putShop == 1) {
            // 零售商
            shopSets = this.retailer;
          } else if (this.form.putShop == 2) {
            shopSets = this.provinceOrcity;
          }
          let str1 = this.delShopSetIds ? this.delShopSetIds.toString() : "";
          let str2 = this.delCouponIds ? this.delCouponIds.toString() : "";
          // console.log(str);
          // return

          let formData = new FormData();
          formData.append("id", this.form.id);
          formData.append("putShop", this.form.putShop);
          formData.append("shopSets", JSON.stringify(shopSets));
          formData.append("delShopSetIds", str1);
          formData.append("coupons", JSON.stringify(this.form.coupons));
          formData.append("delCouponIds", str2);
          if (this.form.putShop == 3 && this.file) {
            formData.append("file", this.file);
          }
          editAppVip(formData).then(res => {
            if (res.code == 200) {
              this.msgOk("编辑成功");
              this.goback();
            } else if (res.code == 100001) {
              this.$Modal.confirm({
                title: "提示",
                content: res.msg,
                okText: "继续添加"
              });
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
          if (this.form.putShop == 0 || this.form.putShop == 2) {
            for (let i = 0; i < this.retailer.length; i++) {
              let num = i+1;
              if(!this.retailer[i].venderId) {
                this.msgErr("第" + num + "条零售商没有选择");
                return;
              }
            }
          }
          if (this.form.putShop == 2) {
            for (let i = 0; i < this.provinceOrcity.length; i++) {
              let num = i + 1;
              if (!this.provinceOrcity[i].provinceCode) {
                this.msgErr("第" + num + "条省份没有选择");
                return;
              }
              if (!this.provinceOrcity[i].cityCode) {
                this.msgErr("第" + num + "条城市没有选择");
                return;
              }
            }
            // if (!this.cityId) {
            //   this.msgErr("请选择城市");
            //   return;
            // }
          }
          if (this.form.putShop == 3 && this.addOrEdit == 1) {
            if (this.file == null) {
              this.msgErr("请上传文件");
              return;
            }
          }
        }

        // 优惠券
        if (this.form.coupons.length == 0) {
          this.msgErr("请选择优惠券");
          return;
        }
        for (let i = 0; i < this.form.coupons.length; i++) {
          if (!this.form.coupons[i].subTitle) {
            this.msgErr(this.form.coupons[i].couponName + "的副标题不能为空");
            return;
          }
          if (!this.form.coupons[i].couponUrl) {
            this.msgErr(this.form.coupons[i].couponName + "的详情大图不能为空");
            return;
          }
        }

        return true;
      },

      // 返回
      goback(num) {
        if (num && this.addOrEdit == 2) {
          this.$Modal.confirm({
            title: "提示",
            content: "确认要放弃当前操作吗？",
            okText: "放弃",
            onOk: () => {
              this.$emit("changeStatus", false);
            }
          });
        } else {
          this.$emit("changeStatus", false);
        }
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

  .couponInformation {
    /* margin-bottom: 0px; */
    display: inline-block;
    width: 200px;
  }
</style>
