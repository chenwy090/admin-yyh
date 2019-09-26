
<template>
  <!-- 收费条目 FeeEntry -->
  <div>
    <BusinessList
      v-if="showBusinessList"
      :showBusinessList.sync="showBusinessList"
      @seclectedTr-event="selectedTrCallBack"
    ></BusinessList>
    <BrandList
      v-if="showBrandList"
      :showBrandList.sync="showBrandList"
      @seclectedTr-event="selectedTrCallBack"
    ></BrandList>
    <SuperMarket
      v-if="showSuperMarketList"
      :showSuperMarketList.sync="showSuperMarketList"
      @seclectedTr-event="selectedTrCallBack"
    ></SuperMarket>
    <CouponList
      v-if="showCouponList"
      :showCouponList.sync="showCouponList"
      @seclectedTr-event="selectedCouponItem"
    ></CouponList>

    <!-- :label="'Item ' + index" -->
    <Alert>
      <FormItem label="商户类型：" :prop="`ruleInfoList.${index}.merchantType`">
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="10">
            <RadioGroup v-model="item.merchantType">
              <Radio v-for="item in businessTypeList" :label="item.value" :key="item.value">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
          </Col>
          <Col span="2">
            <Button
              type="error"
              icon="md-trash"
              size="small"
              @click="compatible_delInfo(index,item)"
            >删除</Button>
          </Col>
        </Row>
      </FormItem>
      <!-- :rules="{ required: true, message: '请选择${businessTypeLabel}' }" -->
      <!-- prop="businessName" -->
      <!-- :prop="`ruleInfoList.${index}.${item.merchantType?'brandName':'merhcantName'}`" -->
      <FormItem
        :label="`${businessTypeLabel}名称：`"
        :prop="`ruleInfoList.${index}.businessName`"
        :rules="{ required: true, validator: validateBusinessName }"
      >
        <Row>
          <Col span="10">
            <template v-if="item.merchantType!=3">
              <!-- v-model="item[`${item.merchantType?'brandName':'merhcantName'}`]" -->
              <Input
                style="width:300px"
                v-model="item.businessName"
                :placeholder="`点击按钮选择${businessTypeLabel}`"
                disabled
              >
                <Button @click="handleChoose" slot="append">选择</Button>
              </Input>
            </template>
            <template v-else>
              <!-- :label="item.businessName" -->
              <Select
                style="width:300px"
                :label="item.businessName"
                ref="retailerSel"
                @on-clear="clearSel"
                clearable
              >
                <Option
                  v-for="item in retailerInfoList"
                  :value="item.venderId"
                  :label="item.venderName"
                  :key="item.venderId"
                  @click.native="selectRetailer(item)"
                >
                  <span>{{item.venderName}}</span>
                  <span style="float:right;">关联店铺数{{item.num}}</span>
                </Option>
              </Select>
            </template>
          </Col>
        </Row>
      </FormItem>
      <Row class="box" style="margin-bottom:20px;">
        <Table size="small" border width="600px" :columns="dynamicColumns" :data="dynamicTableData">
          <template slot-scope="{ row }" slot="operate">
            <Button
              size="small"
              style="color:#2db7f5"
              @click="remove(row)"
              icon="ios-trash-outline"
            >移除</Button>
          </template>
        </Table>
      </Row>

      <!-- 商户余额 money U贝余额 ubay    -->
      <FormItem label="商户余额：">{{money}}&nbsp;元</FormItem>
      <FormItem label="U贝余额：">{{ubay}}&nbsp;贝</FormItem>
      <!-- :rules="{required: true,  validator: validateEmpty('请填写流水号'), trigger: 'blur'}" -->
      <FormItem
        label="消耗U贝："
        :prop="`ruleInfoList.${index}.anticipatedUbay`"
        :rules="{ required: true, validator: validateUbay }"
      >
        <Row>
          <Col span="10">
            <Input
              style="width:230px"
              v-model="item.anticipatedUbay"
              placeholder="请输入需要消耗U贝的数量"
              clearable
            />
          </Col>
        </Row>
      </FormItem>

      <!-- templateId  券模板id  templateName 券模板名称 -->
      <!-- :rules="{ required: true, validator: validateBusinessName }" -->
      <FormItem
        :label="`优惠券：`"
        :prop="`ruleInfoList.${index}.templateName`"
        :rules="{ required: true, validator: validateEmpty('请选择优惠券') }"
      >
        <Row>
          <Col span="10">
            <Input
              style="width:230px"
              v-model="item.templateName"
              :placeholder="`点击按钮选择优惠券`"
              disabled
            >
              <Button @click="handleChooseCoupon" slot="append">选择</Button>
            </Input>
          </Col>
        </Row>
      </FormItem>

      <!-- <FormItem
        label="截止时间："
        :prop="`ruleInfoList.${index}.endTime`"
        :rules="{required: true, validator: validateEmpty('请选择时间'), trigger: 'blur'}"
      >
        <Row>
          <Col span="6">
            <DatePicker
              type="date"
              placeholder="请选择时间"
              :value="item.endTime"
              @on-change="changeEndTime"
            ></DatePicker>
          </Col>
          <Col span="18">
            &nbsp;领取量低于
            <Input style="width:100px" v-model="item.receivedNum" placeholder="请填写数量" clearable />任务自动终止
          </Col>
        </Row>
      </FormItem>-->
      <!-- ----------------------------------------------------- -->
      <Divider />

      <Alert type="warning">下面四项为必填项，至少一项不能为0</Alert>
      <FormItem
        :label-width="0"
        :prop="`ruleInfoList.${index}.receiveAwardUbay`"
        :rules="{ required: true, validator: validateUbay }"
      >
        每领取一张券，奖励领取者
        <Input
          style="display:inline-block;width:100px"
          v-model="item.receiveAwardUbay"
          placeholder="请输入数字"
          clearable
        />&nbsp;U贝
        <!-- 通过分享领取不享受该奖励 -->
      </FormItem>
      <FormItem
        :label-width="0"
        :prop="`ruleInfoList.${index}.useAwardUbay`"
        :rules="{ required: true, validator: validateUbay }"
      >
        每核销一张券，奖励领取者
        <Input
          style="display:inline-block;width:100px"
          v-model="item.useAwardUbay"
          placeholder="请输入数字"
          clearable
        />&nbsp;U贝
        <!-- 通过分享领取核销，不享受该奖励 -->
      </FormItem>

      <Divider />
      <!-- ----------------------------------------------------- -->

      <FormItem
        :label-width="0"
        :prop="`ruleInfoList.${index}.shareReceiveAwardUbay`"
        :rules="{ required: true, validator: validateUbay }"
      >
        分享券被领取，奖励分享者
        <Input
          style="display:inline-block;width:100px"
          v-model="item.shareReceiveAwardUbay"
          placeholder="请输入数字"
          clearable
        />&nbsp;U贝
      </FormItem>
      <FormItem
        :label-width="0"
        :prop="`ruleInfoList.${index}.shareUseAwardUbay`"
        :rules="{ required: true, validator: validateUbay }"
      >
        分享券被核销，奖励分享者
        <Input
          style="display:inline-block;width:100px"
          v-model="item.shareUseAwardUbay"
          placeholder="请输入数字"
          clearable
        />&nbsp;U贝
      </FormItem>

      <!-- ------------------------------ -->
      <Divider />
      <Alert type="warning">选择图片（不大于5M,JPG/JPEG/PNG）</Alert>
      <Row type="flex" justify="start">
        <Col span="8">
          <UploadImage
            label="背景图："
            :fileUploadType="'banner'"
            :defaultList="item.defaultBannerList"
            @uploadSuccess="bannerUploadSuccess"
          ></UploadImage>
        </Col>
        <Col span="8">
          <UploadImage
            label="Logo："
            :fileUploadType="'logo'"
            :defaultList="item.defaultLogoList"
            @uploadSuccess="logoUploadSuccess"
          ></UploadImage>
        </Col>
      </Row>
      <!-- ------------------------------ -->
      <Divider />

      <Row class="share-info">
        <h3>分享设置</h3>
        <!-- 分享标题 shareTitle -->
        <FormItem label="分享标题：">
          <Row>
            <Col span="10">
              <Tooltip trigger="focus" title="提醒" content="最多20个汉字" placement="right">
                <Input
                  style="width:230px"
                  v-model="item.shareTitle"
                  :maxlength="20"
                  placeholder="请输入分享标题"
                ></Input>
              </Tooltip>
            </Col>
          </Row>
        </FormItem>
      </Row>

      <Row type="flex" justify="start">
        <Col span="8">
          <UploadImage
            label="分享Logo："
            :fileUploadType="'shareLogo'"
            :defaultList="item.defaultShareLogoList"
            @uploadSuccess="shareLogoUploadSuccess"
          ></UploadImage>
        </Col>
      </Row>
    </Alert>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("financial");
const { mapState: mapStateMissionCenter } = createNamespacedHelpers(
  "missionCenter"
);

import BusinessList from "./BusinessList";
import BrandList from "./BrandList";
import CouponList from "./CouponList";
import SuperMarket from "./SuperMarket";

import UploadImage from "./UploadImage";

import createTypeDate from "./typeData";
let typeData = createTypeDate();

export default {
  name: "rules-item",
  inject: [
    "businessTypeList",
    "merchantTypeOption",
    "getMoneyAndUbay",
    "msgOk",
    "msgErr"
  ],
  created() {
    // console.log("rules-item businessTypeList",this.businessTypeList, this.msgOk);
    // 初始化数据
    this.typeData = createTypeDate();
    setTimeout(() => {
      const type = this.item.merchantType;
      let td = this.typeData[`type${type}`];
      td.id = this.item.businessId;
      td.name = this.item.businessName;
      this.dynamicColumns = td.columns;
      // console.log("this.item:", JSON.stringify(this.item));

      if (this.type == "edit") {
        // 编辑
        this.setMoneyAndUbay(type, td.id);
      }
    }, 1000);
  },
  components: {
    BusinessList,
    BrandList,
    SuperMarket,
    CouponList,
    UploadImage
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: function() {
        return {
          // 奖励规则
          // 商户类型 0-本地商户（单店），1-本地商户（多店）
          merchantType: 0,
          businessId: "",
          businessName: "",
          merchantId: "", // 商户id
          merhcantName: "", // 商户名称
          brandId: "", // 品牌id
          brandName: "", // 品牌名称
          anticipatedUbay: "", // 预计消耗u贝数量
          couponType: 0, //优惠券类型 0-商超券 1-商户/周边券
          templateId: "", //券模板id
          templateName: "", //券模板名称
          endTime: "", // 任务中止时间
          receivedNum: "", // 领取数量
          receiveAwardUbay: "", // 领取奖励，u贝数
          useAwardUbay: "", // 核销奖励，u贝数
          shareReceiveAwardUbay: "", // 分享后被领取奖励u贝数
          shareUseAwardUbay: "", // 分享后被核销奖励u贝数
          defaultBannerList: [],
          imgUrl: "",
          defaultLogoList: [],
          logoUrl: "",
          defaultShareLogoList: [],
          shareLogo: ""
        };
      }
    }
  },
  computed: {
    ...mapState(["retailerInfoList"]),
    ...mapStateMissionCenter(["type"])
  },
  watch: {
    ["item.merchantType"]() {
      const type = this.item.merchantType;
      // this.$refs.form.resetFields();

      let typeData = this.typeData[`type${type}`];
      // typeData.id = this.item.businessId;
      // typeData.name = this.item.businessName;
      // this.dynamicColumns = typeData.columns;

      // let typeData = this.typeData[`type${type}`];

      console.log(type, this.type, { ...typeData });

      let { id, name, label, desc, columns, tableData } = typeData;

      this.businessTypeLabel = label;
      this.businessTypePlaceholder = desc;
      this.dynamicColumns = columns;
      this.dynamicTableData = tableData;
      this.item.businessId = id;
      this.item.businessName = name;
      // 新增
      if (this.type == "add") {
        // this.item.businessId = id;
        // this.item.businessName = name;
      } else if (this.type == "edit") {
        // 编辑
        // this.item.businessId = id;
        // this.item.businessName = name;
      }

      // console.log("refForm:", this.$parent.$parent);
      // console.log("refForm:", this.$parent.$parent.fields);
      // console.log("refForm:", `ruleInfoList.${this.index}.businessName`);
      this.$parent.$parent.validateField(
        `ruleInfoList.${this.index}.businessName`
      );
    }
  },
  data() {
    return {
      typeData,
      money: 0, // 商户余额 moneyBalance
      ubay: 0, // U贝余额  ubayBalance

      showBusinessList: false,
      showBrandList: false,
      showSuperMarketList: false,
      showCouponList: false,

      businessTypeLabel: "商户",
      businessTypePlaceholder: "商户",
      dynamicColumns: [],
      dynamicTableData: [],
      // 商户类型 0-本地商户（单店），1-本地商户（多店）
      // businessTypeList: { 0: "商户", 1: "品牌" },
      // businessTypeList: [
      //   { value: 0, label: "商户" },
      //   { value: 1, label: "品牌" }
      // ],
      // merchantTypeOption: [
      //   {
      //     value: 0,
      //     label: "本地商户（单店）"
      //   },
      //   {
      //     value: 1,
      //     label: "本地商户（多店）"
      //   }
      // ],
      payTypeList: [
        {
          id: "1",
          name: "现金"
        },
        {
          id: "2",
          name: "微信"
        },
        {
          id: "3",
          name: "支付宝"
        },
        {
          id: "4",
          name: "银行卡"
        }
      ]
    };
  },
  methods: {
    bannerUploadSuccess(data) {
      this.item.imgUrl = data.imgUrl;
    },
    logoUploadSuccess(data) {
      this.item.logoUrl = data.imgUrl;
    },
    shareLogoUploadSuccess(data) {
      this.item.shareLogo = data.imgUrl;
    },
    changeEndTime(time) {
      this.item.endTime = time;
    },

    selectRetailer(row) {
      // venderName: "上海世纪联华", num: 7, venderId: "80"}
      const { venderId: id, venderName: name, num } = row;
      const { merchantType: type } = this.item;
      let typeData = this.typeData[`type${type}`];
      this.item.businessId = typeData.id = id;
      this.item.businessName = typeData.name = name;
      this.dynamicTableData = typeData.tableData = [{ ...row }];
      console.log("dynamicTableData", JSON.stringify(this.dynamicTableData));
      this.setMoneyAndUbay(type, id);
    },
    async setMoneyAndUbay(type, id) {
      const { money, ubay } = await this.getMoneyAndUbay(type, id);
      this.money = money;
      this.ubay = ubay;
    },
    selectedTrCallBack(data) {
      console.log(this.item.merchantType, "selectedTrCallBack----", data);
      const { merchantType: type, couponType, id, name, row } = data;
      let typeData = this.typeData[`type${type}`];

      this.item.businessId = typeData.id = id;
      this.item.businessName = typeData.name = name;
      this.dynamicTableData = typeData.tableData = [row];
      this.setMoneyAndUbay(type, id);
      // let id = this.item.merchantType ? "brandId" : "merchantId";
      // let name = this.item.merchantType ? "brandName" : "merhcantName";
      // this.item[id] = data.id;
      // this.item[name] = data.name;
      // this.tableData = [data.row];
      // console.log(id, name);
    },

    selectedCouponItem(data) {
      console.log("selectedCouponItem----", data);
      let { couponType, id, name } = data;
      // templateId 券模板id templateName 券模板名称

      this.item.couponType = couponType;
      this.item.templateId = id;
      this.item.templateName = name;
      console.log(couponType, id, name);
    },
    handleChoose() {
      //  '商户类型 0-本地商户（单店），1-本地商户（多店）' 2 商超门店、3 零售商
      const arr = [
        "showBusinessList",
        "showBrandList",
        "showSuperMarketList",
        "retailer"
      ];
      const type = this.item.merchantType;
      this[arr[type]] = true;
    },

    clearSel() {
      // 清空select绑定值
      // this.$refs.retailerSel.clearSingleSelect();
      console.log("clear");
      const type = this.item.merchantType;
      let typeData = this.typeData[`type${type}`];

      this.item.businessId = typeData.id = "";
      this.item.businessName = typeData.name = "";
      this.dynamicTableData = typeData.tableData = [];
    },
    remove() {
      let arr = ["brandId", "merchantId", "brandName", "merhcantName"];
      arr.forEach(name => {
        this.item[name] = "";
      });
      const type = this.item.merchantType;
      let typeData = this.typeData[`type${type}`];

      this.item.businessId = typeData.id = "";
      this.item.businessName = typeData.name = "";
      this.dynamicTableData = typeData.tableData = [];
      if (type == 3) {
        // 清空select绑定值
        this.$refs.retailerSel.clearSingleSelect();
      }
    },
    handleChooseCoupon() {
      this.showCouponList = true;
    },
    // 删除兼容品牌
    compatible_delInfo(index, item) {
      // console.log(this.$parent);
      this.$emit("del", index);
    },
    //验证正整数 	只能输入大于等于0的数值。
    validateUbay(rule, value, callback) {
      var reg = /^([0-9][0-9]*)$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于等于0的正整数"));
      }
    },
    validateBusinessName(rule, value, callback) {
      value += "";
      value = value.trim();
      // 允许不填
      if (value == "") {
        // ("请选择${businessTypeLabel}");
        return callback(`请选择${this.businessTypePlaceholder}`);
      }
      callback();
    },
    validateEmpty(msg) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        callback();
      };
    }
  }
};
</script>