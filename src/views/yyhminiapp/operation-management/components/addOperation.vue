<template>
  <Card>
    <div slot="title" style="height:60px">
      <span style="font-size:20px;">
        <span style="color: #f00;font-size:20px;">*</span>
        运营位类型：
      </span>

      <RadioGroup v-model="operationType" type="button">
        <!-- <Radio
          label="banner"
          style="border-radius: 4px;"
          v-if="operationType == 'banner' || operationType == ''"
        >banner广告</Radio> -->
        <!-- <Radio label="hv_coupon" style="margin-left: 20px;border-left: 1px solid #d9d9d9;border-radius: 4px;">
          超值领券
        </Radio>-->
        <Radio
          label="hp_window"
          style="margin-left: 20px;border-radius: 4px;"
          v-if="operationType == 'hp_window' || operationType == ''"
        >首页弹窗</Radio>
        <Radio
          label="yf_zt"
          style="margin-left: 20px;border-radius: 4px;"
          v-if="operationType == 'yf_zt' || operationType == ''"
        >专题活动</Radio>
      </RadioGroup>
      <Button
        icon="arrow-left-c"
        @click="back"
        v-if="!operationType"
        style="margin-left: 50px;"
        type="dashed"
      >返回列表</Button>
    </div>
    <div>
      <i-form
        :label-width="180"
        v-if="operationType=='hp_window'"
      >
        <Form-item label="小程序appid：" required>
          <!-- <Select v-model="operation_data.appid" placeholder="请选择" style="width:250px" :disabled="!createNew">
          <Option v-for="item in appStoreList" v-model="item.appid" :key="item.appid">
            {{item.venderName}}
          </Option>
          </Select>-->

          <Select v-model="operation_data.appid" style="width:250px" :disabled="operationStatus == 1?false:true">
            <Option
              :value="item.appid"
              v-for="(item, index) in appIdData"
              :key="index"
            >{{item.appName}}</Option>
          </Select>
        </Form-item>
        <!-- 名称输入 -->
        <Form-item
          label="标题："
          required
        >
          <Input
            type="text"
            placeholder="请输入"
            v-model="operation_data.name"
            style="width:200px"
            :disabled="operationStatus == 3?true:false"
          />
        </Form-item>
        <!-- 名称输入 -->
        <!-- banner图片 -->
        <Form-item
          label="弹窗图片："
          required
        >
          <div
            style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
            v-for="(item, index) in uploadList"
            :key="index"
          >
            <img :src="item.url" style="width:100%;height:100%">
          </div>
          <div style="display: inline-block;" v-if="operationStatus != 3">
            <Upload
              ref="upload"
              type="drag"
              :format="['jpg','jpeg','png','bmp']"
              :on-success="handleSuccess1"
              :action="url"
              accept="image"
              :max-size="1024"
              :on-exceeded-size="handleMaxSize"
              :on-format-error="formatError"
              :defaultList="uploadList"
              :headers="userToken"
              :show-upload-list="false"
              style="display: inline-block;width:90px;"
            >
              <!-- :before-upload="handleUploadicon"  :headers= "userToken"-->
              <div style="width: 90px;height:90px;line-height: 90px;">
                <Icon type="ios-camera" size="20"/>
              </div>
            </Upload>
            <!-- <p v-if="operationType=='banner'">选择banner图片 (不大于1M, JPG/PNG/JPEG/BMP，建议图片尺寸750*362）</p> -->
            <!-- <p v-if="operationType=='yf_zt'">选择专题运营位图片 (不大于1M, JPG/PNG/JPEG/BMP）</p> -->
            <p>选择弹窗图片 (不大于1M, JPG/PNG/JPEG/BMP，建议图片尺寸580*560）</p>
          </div>
        </Form-item>
        <!-- banner图片 -->
        <!-- 开始时间 -->
        <Form-item label="开始时间：" required>
          <DatePicker
            type="date"
            placeholder="选择开始日期"
            style="width: 250px"
            @on-change="time1"
            format="yyyy-MM-dd"
            :value="operation_data.startDate"
            @on-clear="clearTime1"
            :options="options3"
            :editable="false"
            :clearable="false"
            :disabled="operationStatus == 3?true:false"
          ></DatePicker>
        </Form-item>
        <!-- 开始时间 -->
        <!-- 结束时间 -->
        <Form-item label="结束时间：" required>
          <DatePicker
            type="date"
            placeholder="选择结束日期"
            style="width: 250px"
            @on-change="time2"
            format="yyyy-MM-dd"
            :value="operation_data.endDate"
            @on-clear="clearTime2"
            :options="options3"
            :editable="false"
            :clearable="false"
            :disabled="operationStatus == 3?true:false"
          ></DatePicker>
        </Form-item>
        <!-- 结束时间 -->
        <Form-item
          label="弹窗类型："
          required
        >
          <Select v-model="operation_data.showType" style="width:200px" :disabled="operationStatus == 3?true:false">
            <!-- <Option v-if="operationType=='banner'" value="1">广告</Option> -->
            <Option v-if="operationType=='hp_window'" value="2">跳转内部页</Option>
            <Option v-if="operationType=='hp_window'" value="3">跳转外部小程序</Option>
            <Option v-if="operationType=='hp_window'" value="5">新人奖励</Option>
          </Select>
        </Form-item>
        <!-- banner 放大 图片 -->
        <!-- <Form-item
          label="banner放大图片："
          required
          v-if="operationType=='banner'&&operation_data.showType == '1'"
        >
          <div
            style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
            v-for="(item, index) in uploadList1"
            :key="index"
          >
            <img :src="item.url" style="width:100%;height:100%">
          </div>
          <div style="display: inline-block;" v-if="operationStatus != 3">
            <Upload
              ref="upload"
              :defaultList="uploadList1"
              type="drag"
              :format="['jpg','jpeg','png','bmp']"
              :on-success="handleSuccess2"
              :action="url"
              accept="image"
              :max-size="1024"
              :on-exceeded-size="handleMaxSize"
              :on-format-error="formatError"
              :headers="userToken"
              :show-upload-list="false"
              style="display: inline-block;width:90px;"
            > -->
              <!-- :before-upload="handleUploadicon" -->
              <!-- <div style="width: 90px;height:90px;line-height: 90px;">
                <Icon type="ios-camera" size="20"/>
              </div>
            </Upload>
            <p>选择banner放大图片 (不大于1M, JPG/PNG/JPEG/BMP）</p>
          </div>
        </Form-item> -->
        <!-- banner 放大 图片 -->

        <Form-item label="跳转内部链接：" required v-if="operation_data.showType == '2'">
          <!-- <Select v-model="operation_data.pagePathType" @on-change="changePagePathType" style="width:200px">
          <Option v-for="item in pagePathType" v-model="item.value" v-if="item.label" :key="item.value">
            {{item.label}}
          </Option>
          </Select>-->
          <!-- <Select v-model="operation_data.pagePath" v-if="operation_data.pagePathType=='category'" @on-change="changeCategory" style="width:200px">
          <Option v-for="item in categoryList" v-model="item.category" :key="item.category">{{item.category}}</Option>
          </Select>-->
          <Input
            type="text"
            placeholder="请输入..."
            v-model="operation_data.pagePath"
            style="width:400px"
            :disabled="operationStatus == 3?true:false"
          />
          <!-- v-if="operation_data.pagePathType=='customized'"  -->
        </Form-item>

        <Form-item label="外部小程序信息：" required v-if="operation_data.showType == '3'">
          <Input
            type="text"
            placeholder="请输入json字符串，打开小程序信息：appId,path,extraData,envVersion"
            v-model="operation_data.miniAppInfo"
            style="width:400px"
            :disabled="operationStatus == 3?true:false"
          />
        </Form-item>
        <!-- <Form-item
          v-if="operationType =='banner'"
          :label="operationType=='banner' ? 'banner排序：':'广告位排序'"
          required
        >
          <InputNumber
            placeholder="请输入正整数，比如1"
            v-model="operation_data.sort"
            style="width:200px"
            :max="9999"
            :min="1"
            @keyup.native="changeNumber"
            :disabled="operationStatus == 3?true:false"
          />
        </Form-item> -->
        
        <Form-item :style="{'margin-top':'40px'}">
          <i-button
            type="primary"
            @click="submit"
            :disabled="operationStatus == 3?true:false"
            size="large"
            :style="{'width':'150px','margin-right':'20px'}"
          >确定</i-button>
          <i-button size="large" icon="arrow-left-c" @click="back">返回列表</i-button>
        </Form-item>
      </i-form>
    </div>

    <!-- 专题 -->
    <div v-if="operationType == 'yf_zt'">
      <thematic-operation @changeStatus="showStatus" :thematicStatus="thematicStatus" :thematicItem="thematicItem"></thematic-operation>
    </div>
    <!-- 专题 -->
  </Card>
</template>

<script>
  import { uploadFileRequest } from "@/libs/axios";
  import { addOperation, getMiniApp, editOperation , getSpecialTopicList, editSpecialTopic } from "@/api/sys";
  import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
  import thematicOperation from "./thematicOperation";
  export default {
    props: {
      operationStatus: Number,
      operationItem: Object
    },
    components: {
      thematicOperation
    },
    data() {
      return {
        operationType: "",
        operation_data: {
          appid: "",
          bigImgUrl: "", //banner点击放大URL
          endDate: "", //结束领取时间--必填
          imgUrl: "", //banner图片URL--必填
          miniAppInfo: "", //打开小程序信息 （忽略）
          name: "", //运营位名称--必填
          operationType: "", //运营类型
          pagePath: "", //小程序内部页面路径 （忽略）
          pagePathType: "", //(当operationType是hv_coupon且showType=2时必填)内部页类型:category-类目；coupon-优惠券；customized-自定义
          showType: "", //banner类型--必填 ( 广告类型 )
          sort: 1, //banner排序 --运营类型是banner-广告类或hv_coupon-超值领券时必填
          startDate: "", //开始领取时间--必填
          operationId: null
          // status: 0,
          // is_use_shop: 'false', // 是否有重新导入门店列表：是-true；否-false
          // filePath: '', //文件路径-必填
        },
        imgUrl: "", //banner图片URL--必填
        bigImgUrl: "", //banner点击放大URL
        appStoreList: [],
        miniAppList: [], // 微信小程序数据列表
        createNew: true, // 是否新建
        scenes: [],
        url: uploadOperationImage2AliOssURl,
        editInfo: null,
        pagePathType: [
          // {
          //     label: '优惠券品类列表',
          //     value: 'category'
          // },
          {
            label: "优惠券",
            value: "coupon"
          },
          {
            label: "自定义",
            value: "customized"
          }
        ],
        categoryList: [],
        couponList: [],
        flag_Submit: false, //防止重复点击
        userToken: {}, //用户token
        uploadList: [], // 上传图片数据
        uploadList1: [], // 上传图片数据
        appIdData: [],
        // 开始和结束时间限制
        options3: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        //专题活动
        specialTopic:'请选择',
        specialTopicDisplay: false,
        totalSize: 0,
        current: 1,
        specialTopicList:[],
        columns1:[
          {
            title: "专题内容名称",
            align: "center",
            minWidth: 160,
            key: "name"
          },
          {
            title: "专题描述",
            align: "center",
            minWidth: 160,
            key: "topicDesc"
          },
        ],
        thematicPage: false, // 专题页面
        thematicStatus: 1, // 传值专题到专题
        thematicItem: {}, // 传值数据到专题
      };
    },
    watch: {
      "operation_data.appid": {
        handler: function(newVal, oldVal) {
          this.operation_data.appid = newVal;
          this.changePagePathType(this.operation_data.pagePathType);
        },
        deep: true
      }
      // 'operation_data.startDate': {
      //   handler: function (newVal, oldVal) {
      //     this.operation_data.startDate = newVal;
      //     if (this.operation_data.endDate && (Date.parse(newVal) > Date.parse(this.operation_data.endDate))) {
      //       this.$Message.error('开始时间不能大于结束时间，请重新选择开始时间！', 3);
      //       this.$set('operation_data.startDate', null);
      //       return;
      //     }
      //     this.changePagePathType(this.operation_data.pagePathType);
      //   },
      //   deep: true
      // },
      // 'operation_data.endDate': {
      //   handler: function (newVal, oldVal) {
      //     this.operation_data.endDate = newVal;
      //     if (this.operation_data.startDate && (Date.parse(newVal) < Date.parse(this.operation_data.startDate))) {
      //       this.$Message.error('结束时间不可小于开始时间，请重新选择结束时间！', 3);
      //       this.$set('operation_data.endDate', null);
      //       return;
      //     }
      //     this.changePagePathType(this.operation_data.pagePathType);
      //   },
      //   deep: true
      // }
    },
    created: function() {
      this.getMiniAppFn();

      this.editInputData(this.operationStatus);
      // console.log(this.operationType);

      this.userToken = {
        jwttoken: localStorage.getItem("jwttoken")
      };

      // this.getWebankAppStore();
    },
    methods: {

      //子组件传参
      showStatus: function(e) {
        if(e == false) {
          this.back()
        }
      },

      // 编辑页面传值
      editInputData(num) {
        if (num == 2 || num == 3) {
          this.createNew = false;
          this.operationType = this.operationItem.operationType;
          // 传值到专题
          if (this.operationType == 'yf_zt') {
            this.thematicStatus = this.operationStatus
            this.thematicItem = this.operationItem
            return
          }
          
          this.operation_data.operationType = this.operationItem.operationType;
          this.operation_data.appid = this.operationItem.appid;
          //this.operation_data.venderId = this.editInfo.venderId;
          this.operation_data.operationId = this.operationItem.operationId;
          this.operation_data.name = this.operationItem.name;
          this.operation_data.startDate = this.operationItem.startDate;
          this.operation_data.endDate = this.operationItem.endDate;
          this.operation_data.showType = this.operationItem.showType + "";
          this.operation_data.pagePathType = this.operationItem.pagePathType;
          this.operation_data.imgUrl = this.operationItem.imgUrl;
          this.imgUrl = this.operationItem.imgUrl;
          // 显示图片
          this.uploadList = [{ url: this.operationItem.imgUrl }];

          this.operation_data.bigImgUrl = this.operationItem.bigImgUrl || "";
          this.bigImgUrl = this.operationItem.bigImgUrl || "";
          //显示图片
          this.uploadList1 = [{ url: this.operationItem.bigImgUrl }];

          this.operation_data.pagePath = this.operationItem.pagePath || "";
          this.operation_data.miniAppInfo = this.operationItem.miniAppInfo || "";
          this.operation_data.sort = this.operationItem.sort;
          // if(this.operationType == 'yf_zt') {
          //   this.getSpecialTopicName()
          // }
          
        }
      },

      // 获取小程序app
      getMiniAppFn() {
        getMiniApp().then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.appIdData = res.data;
          } else {
            this.msgErr("小程序appId获取失败");
          }
        });
      },

      //返回列表
      back() {
        let obj = {
          operationType:this.operationType,
          type:false
        }
        this.$emit("changeStatus", obj);
      },
      // 图片上传前
      handleUploadicon() {
        
      },

      // banner图片
      handleSuccess1(res, file) {
        // console.log('res=>',res);
        // console.log('file=>',file);
        if (res.code == 200) {
          this.operation_data.imgUrl = res.image_url;

          // 显示已上传图片
          // let obj = {
          //   'url': res.image_url
          // }
          // this.uploadList.push(obj)
          let obj = [
            {
              url: res.image_url
            }
          ];
          this.uploadList = obj;

          this.msgOk("上传图片成功");
        } else {
          this.msgErr("上传图片失败，请重新上传");
        }
      },

      // banner 放大 图片
      handleSuccess2(res, file) {
        // console.log('res=>',res);
        // console.log('file=>',file);
        if (res.code == 200) {
          this.operation_data.bigImgUrl = res.image_url;

          // 显示已上传图片
          // let obj = {
          //   'url': res.image_url
          // }
          // this.uploadList1.push(obj)
          let obj = [
            {
              url: res.image_url
            }
          ];
          this.uploadList1 = obj;

          this.msgOk("上传图片成功");
        } else {
          this.msgErr("上传图片失败，请重新上传");
        }
      },

      // 上传二维码超过1M提示
      handleMaxSize() {
        this.msgErr("上传图片不能超过1MB,请重新上传");
      },
      // 上传二维码格式不对
      formatError() {
        this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传");
      },

      handleGoodsSuccess(res, file) {
        this.goodsFile.attachedName = res.fileName;
        this.goodsFile.attachedFile = res.filePath;
        console.log(res);
      },
      handleBeforeGoodsUpload() {
        this.$refs.uploadGoods.clearFiles();
      },
      handleGoodsRemove() {
        this.goodsFile.attachedName = "";
        this.goodsFile.attachedFile = "";
      },
      //新增/编辑
      submit: function() {
        // console.log(this.operation_data);
        // return
        var formName =
          this.operationType == "yf_zt"
            ? "专题活动"
            : this.operationType == "banner"
            ? "banner"
            : "弹窗";
        if (!this.operation_data.appid) {
          this.$Message.error("请选择小程序appid名称！", 3);
          return;
        }
        if (!this.operation_data.name) {
          this.$Message.error("请输入" + formName + "名称！", 3);
          return;
        }
        if (!this.operation_data.imgUrl) {
          this.$Message.error("请上传" + formName + "图片！", 3);
          return;
        }
        if (!this.operation_data.startDate) {
          this.$Message.error("请选择开始日期！", 3);
          return;
        }
        if (!this.operation_data.endDate) {
          this.$Message.error("请选择结束日期！", 3);
          return;
        }
        if (
          Date.parse(this.operation_data.startDate) >
          Date.parse(this.operation_data.endDate)
        ) {
          this.$Message.error(
            formName + "开始时间不可大于" + formName + "结束时间！",
            3
          );
          return;
        }
        if (!this.operation_data.showType) {
          this.$Message.error("请选择" + formName + "类型！", 3);
          return;
        }
        if (
          this.operation_data.showType == "1" &&
          this.operationType == "banner" &&
          !this.operation_data.bigImgUrl
        ) {
          this.$Message.error("请上传放大广告图片！", 3);
          return;
        }
        if (this.operationType == "hv_coupon" || this.operationType == "banner") {
          if (!this.operation_data.sort) {
            this.$Message.error("请输入" + formName + "排序！", 3);
            return;
          }
        }

        // 清空另一个字段
        if (this.operation_data.showType == "2") {
          this.operation_data.miniAppInfo = "";
        }

        if (
          this.operationType != 'yf_zt'&&
          this.operation_data.showType == "2" &&
          !this.operation_data.pagePath
        ) {
          this.$Message.error("跳转内部链接不能为空！", 3);
          return;
        }

        if (this.operation_data.showType == "3") {
          this.operation_data.pagePath = "";
        }

        if (
          this.operation_data.showType == "3" &&
          !this.operation_data.miniAppInfo
        ) {
          this.$Message.error("请输入外部小程序json字符串！", 3);
          return;
        }

        // 专题活动判断
        if(this.operationType == 'yf_zt') {
          if(!this.operation_data.showType) {
            this.msgErr('请选择弹框类型')
            return
          }
          if(!this.operation_data.pagePath) {
            this.msgErr('请选择专题活动')
            return
          }
        }

        this.operation_data.operationType = this.operationType;
        
        if (this.operation_data.operationId == null) {
          
          addOperation(this.operation_data).then(res => {
            if (res.code == 200) {
              this.msgOk("新增成功");
              this.back()
            } else {
              this.msgErr(res.msg);
            }
          });
        } else {
          editOperation(this.operation_data).then(res => {
            if (res.code == 200) {
              this.msgOk("编辑成功");
              this.back()
            } else {
              this.msgErr(res.msg);
            }
          });
        }
      },
      // 获取微众优惠券下拉数据源接口
      getCouponStore: function(appid, startDate, endDate) {
        
        var reqObj = {
          appid: appid,
          startDate: startDate,
          endDate: endDate
        };
        zexApis.getCouponStore(reqObj).done(function(response) {
          if (response.code == 200) {
            this.couponList = response.data;
            if (!response.data.length) {
              this.$Message.error(
                "暂无可用优惠券模板，请选择其它小程序appid或时间段！",
                5
              );
            }
          } else {
            this.$Message.error(response.msg, 3);
          }
        });
      },
      changePagePathType: function(v) {
        if (v == "coupon") {
          this.clickCategory();
        }
      },
      clickCategory: function() {
        if (!this.operation_data.appid) {
          this.$Message.error("请选择小程序appid", 3);
          return;
        }
        
        if (
          this.operation_data.pagePathType == "coupon" &&
          this.operation_data.appid &&
          this.operation_data.startDate &&
          this.operation_data.endDate
        ) {
          this.getCouponStore(
            this.operation_data.appid,
            this.operation_data.startDate,
            this.operation_data.endDate
          );
        }
      },
      changeCoupon: function(v) {
        this.operation_data.pagePath = v;
      },

      //获取专题活动列表
      getSpecialTopic() {
        if(this.operation_data.startDate == '') {
          this.msgErr('请先选择开始时间')
          return
        }
        if(this.operation_data.endDate == '') {
          this.msgErr('请先选择结束时间')
          return
        }

        let obj = {
          operationStartDate : this.operation_data.startDate.slice(0,10),
          operationEndDate : this.operation_data.endDate.slice(0,10),
          status : 1
        }
        getSpecialTopicList(obj,this.current).then(res => {
          if(res.code == 200) {
            this.specialTopicList = res.data.records;
            this.current = res.data.current;
            this.totalSize = res.data.total;
            this.specialTopicDisplay = true
          }else {
            this.msgErr(res.msg)
          }
        })
      },

      //查询已选择的专题名称
      getSpecialTopicName() {
        let obj = {
          operationStartDate : this.operation_data.startDate.slice(0,10),
          operationEndDate : this.operation_data.endDate.slice(0,10),
          status : 1
        }
        editSpecialTopic(this.operation_data.pagePath).then(res => {
          if(res.code == 200) {
            this.specialTopic = '已选择' + res.data.name
          }else {
            this.msgErr(res.msg)
          }
        })
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
      },

      time1(e) {
        // console.log(e);
        if (e) {
          // this.clearSpecialTopic()
          let time = e.slice(0, 10) + " " + "00:00:00";
          this.operation_data.startDate = time;
        }
      },
      clearTime1() {
        // this.clearSpecialTopic()
        this.operation_data.startDate = "";
      },
      time2(e) {
        // console.log(e);
        if (e) {
          // this.clearSpecialTopic()
          let time = e.slice(0, 10) + " " + "23:59:59";
          this.operation_data.endDate = time;
        }
      },
      clearTime2() {
        // this.clearSpecialTopic()
        this.operation_data.endDate = "";
      },

      // 重置已选择的专题活动
      // clearSpecialTopic() {
      //   if(this.operationType == 'yf_zt' && this.operation_data.pagePath != '') {
      //     this.msgErr('重选时间，需重选专题活动')
      //     this.operation_data.pagePath = ''
      //     this.specialTopic = '请选择'
      //   }
      // },

      //过滤小数点
      changeNumber() {
        let str = "" + this.operation_data.sort;
        if (str.indexOf(".") != -1) {
          let arr = str.split("");
          arr.splice(arr.length - 1);
          let str2 = arr.join("");
          this.operation_data.sort = +str2;
          this.msgErr("只能输入整数");
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  .operation {
    margin-bottom: 2vh;
  }
  .select-count {
    font-size: 13px;
    font-weight: 600;
    color: #40a9ff;
  }
  .select-clear {
    margin-left: 10px;
  }
  .page {
    margin-top: 2vh;
  }
  .drop-down {
    font-size: 13px;
    margin-left: 5px;
  }
</style>

