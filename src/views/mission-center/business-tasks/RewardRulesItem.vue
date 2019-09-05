
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

    <!-- :label="'Item ' + index" -->
    <Alert>
      {{typeof item.merchantType}}---{{item.merchantType}}
      <FormItem label="商户类型：" :prop="`ruleInfoList.${index}.merchantType`">
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="4">
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
      <FormItem
        :label="`所属${businessTypeLabel}：`"
        :prop="`ruleInfoList.${index}.${item.merchantType?'brandName':'merhcantName'}`"
        :rules="{ required: true, validator: validateBusinessName }"
      >
        <Row>
          <Col span="10">
            <Input
              style="width:230px"
              v-model="item[`${item.merchantType?'brandName':'merhcantName'}`]"
              :placeholder="`点击按钮选择${businessTypeLabel}`"
              disabled
            >
              <Button @click="handleChoose" slot="append">选择</Button>
            </Input>
          </Col>
        </Row>
      </FormItem>
      <Row class="box" style="margin-bottom:20px;">
        <Table size="small" border width="600px" :columns="dynamicColumns" :data="tableData">
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

      <FormItem
        label="截止时间："
        :prop="`ruleInfoList.${index}.endTime`"
        :rules="{required: true, validator: validateEmpty('请选择时间'), trigger: 'blur'}"
      >
        <Row>
          <Col span="6">
            <DatePicker
              style="width:230px"
              type="date"
              placeholder="请选择时间"
              :value="item.endTime"
              @on-change="changeEndTime"
            ></DatePicker>
          </Col>
          <Col span="18">
            领取量低于
            <Input style="width:100px" v-model="item.receivedNum" placeholder="请填写数量" clearable />任务自动终止
          </Col>
        </Row>
      </FormItem>
      <!-- ----------------------------------------------------- -->
      <Divider />
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
        />&nbsp;U贝 &nbsp;通过分享领取不享受该奖励
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
        />&nbsp;U贝 &nbsp; 通过分享领取核销，不享受该奖励
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
    </Alert>
  </div>
</template>
<script>
import BusinessList from "./BusinessList";
import BrandList from "./BrandList";
export default {
  name: "rules-item",
  components: {
    BusinessList,
    BrandList
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
      console.log("watch-----------,", type,this.$parent);
      // this.$refs.form.validateField("businessName");
    }
  },
  data() {
    return {
      showBusinessList: false,
      showBrandList: false,
      businessTypeLabel: "商户",
      // 商户类型 0-本地商户（单店），1-本地商户（多店）
      // businessTypeList: { 0: "商户", 1: "品牌" },
      businessTypeList: [
        { value: 0, label: "商户" },
        { value: 1, label: "品牌" }
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
          key: "merchantId"
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
    handleChoose() {
      //  商户类型 0-本地商户（单店），1-本地商户（多店）
      if (this.item.merchantType == 0) {
        this.showBusinessList = true;
      } else {
        // brand品牌
        this.showBrandList = true;
      }
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