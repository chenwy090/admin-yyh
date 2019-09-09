
<template>
  <!-- 收费条目 FeeEntry -->
  <div>
    <Alert>
      <div class="item">
        <span class="fl label">商户类型：</span>
        <span class="fl">{{item.merchantTypeName}}</span>
      </div>
      <div class="item">
        <span class="fl label">商户名称：</span>
        <span class="fl">{{item.name}}</span>
      </div>
      <div class="item">
        <span class="fl label">消耗U贝：</span>
        <span class="fl">{{item.anticipatedUbay}}</span>
      </div>
      <div class="item">
        <span class="fl label">优惠券：</span>
        <span class="fl">{{item.templateName}}</span>
      </div>
      <div class="item">
        <span class="fl label">截止时间：</span>
        <span class="fl">{{item.endTime}} 领取量低于{{item.receivedNum}}任务自动终止</span>
      </div>
      <!-- ----------------------------------------------------- -->
      <Divider />
      <div>
        每领取一张券，奖励领取者
        {{item.receiveAwardUbay}}&nbsp;U贝 &nbsp;通过分享领取不享受该奖励
      </div>
      <div>
        每核销一张券，奖励领取者 {{item.useAwardUbay}}
        &nbsp;U贝 &nbsp; 通过分享领取核销，不享受该奖励
      </div>

      <Divider />
      <!-- ----------------------------------------------------- -->
      <div>
        分享券被领取，奖励分享者 {{item.shareReceiveAwardUbay}}
        &nbsp;U贝
      </div>
      <div>
        分享券被核销，奖励分享者 {{item.shareUseAwardUbay}}
        &nbsp;U贝
      </div>
    </Alert>
  </div>
</template>
<script>
import BusinessList from "./BusinessList";
import BrandList from "./BrandList";
import CouponList from "./CouponList";

export default {
  name: "rules-item",
  components: {
    BusinessList,
    BrandList,
    CouponList
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
          merchantId: "", // 商户id
          merhcantName: "", // 商户名称
          brandId: "", // 品牌id
          brandName: "", // 品牌名称
          anticipatedUbay: "", // 预计消耗u贝数量
          templateId: "", //券模板id
          templateName: "", //券模板名称
          endTime: "", // 任务中止时间
          receivedNum: "", // 领取数量
          receiveAwardUbay: "", // 领取奖励，u贝数
          useAwardUbay: "", // 核销奖励，u贝数
          shareReceiveAwardUbay: "", // 分享后被领取奖励u贝数
          shareUseAwardUbay: "" // 分享后被核销奖励u贝数
        };
      }
    }
  },
  computed: {
    dynamicColumns() {
      return this.item.merchantType == 0 ? this.columns1 : this.columns2;
    }
  },
  watch: {
    ["item.merchantType"]() {
      const type = this.item.merchantType;
      // this.$refs.form.resetFields();
      this.businessTypeList.some(item => {
        let r = item.value == type;
        if (r) {
          this.businessTypeLabel = item.label;
        }
        return r;
      });
      // this.businessTypeLabel = this.businessTypeList[type];
      console.log("watch-----------,", type, this.$parent);
      // this.$refs.form.validateField("businessName");
    }
  },
  data() {
    return {
      showBusinessList: false,
      showBrandList: false,
      showCouponList: false,

      businessTypeLabel: "商户",
      // 商户类型 0-本地商户（单店），1-本地商户（多店）
      // businessTypeList: { 0: "商户", 1: "品牌" },
      businessTypeList: [
        { value: 0, label: "商户" },
        { value: 1, label: "品牌" }
      ],
      merchantTypeOption: [
        {
          value: 0,
          label: "本地商户（单店）"
        },
        {
          value: 1,
          label: "本地商户（多店）"
        }
      ],
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
      ],
      tableData: [],
      columns1: [
        {
          title: "商户编号",
          align: "center",
          width: 200,
          key: "merchantId"
        },
        {
          title: "商户名称",
          align: "center",
          width: 200,
          key: "name"
        },
        {
          title: "地址",
          align: "center",
          minWidth: 300,
          key: "address"
        },
        {
          title: "操作",
          align: "center",
          width: 140,
          key: "action",
          slot: "operate"
        }
      ],
      columns2: [
        {
          title: "品牌编号",
          align: "center",
          width: 200,
          key: "id"
        },
        {
          title: "品牌名称",
          align: "center",
          width: 200,
          key: "name"
        },
        {
          title: "关联店铺数",
          align: "center",
          minWidth: 300,
          key: "address"
        },
        {
          title: "操作",
          align: "center",
          width: 140,
          key: "action",
          slot: "operate"
        }
      ]
    };
  },

  methods: {
    changeEndTime(time) {
      this.item.endTime = time;
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
    remove() {
      let arr = ["brandId", "merchantId", "brandName", "merhcantName"];
      arr.forEach(name => {
        this.item[name] = "";
      });
      this.tableData = [];
    },
    selectedTrCallBack(data) {
      console.log(this.item.merchantType, "selectedTrCallBack----", data);
      let id = this.item.merchantType ? "brandId" : "merchantId";
      let name = this.item.merchantType ? "brandName" : "merhcantName";
      this.item[id] = data.id;
      this.item[name] = data.name;
      this.tableData = [data.row];
      console.log(id, name);
    },

    selectedCouponItem(data) {
      console.log("selectedCouponItem----", data);
      let { id, name } = data;
      // templateId 券模板id templateName 券模板名称
      this.item.templateId = id;
      this.item.templateName = name;
      console.log(id, name);
    },

    handleChoose() {
      //  商户类型 0-本地商户（单店），1-本地商户（多店）
      if (this.item.merchantType == 0) {
        this.showBusinessList = true;
      } else {
        // brand品牌
        this.showBrandList = true;
      }
    },
    handleChooseCoupon() {
      this.showCouponList = true;
    },

    validateBusinessName(rule, value, callback) {
      value += "";
      value = value.trim();
      // 允许不填
      if (value == "") {
        // ("请选择${businessTypeLabel}");
        return callback(`请选择${this.businessTypeLabel}`);
      }
      callback();
    },
    // 删除兼容品牌
    compatible_delInfo(index, item) {
      // console.log(this.$parent);
      this.$emit("del", index);
    },
    validateEmpty(msg) {
      return function(rule, value, callback) {
        console.log(1111111, rule, value);
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
<style lang="less" scoped>
.fl {
  float: left;
}
.item {
  height: 30px;
  line-height: 30px;
  .label {
    width: 88px;
    text-align: right;
  }
}
</style>