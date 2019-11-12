<template>
  <div class="xxx">
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form label-position="right" ref="form" :model="searchData" :label-width="120">
          <FormItem label="类型：">
            <RadioGroup v-model="searchData.downType">
              <Radio v-for="(v,k) in downTypeOption" :label="k" :key="k">
                <span>{{v}}明细</span>
              </Radio>
            </RadioGroup>
          </FormItem>

          <Row style="width:1000px;">
            <Col span="12">
              <FormItem label="商户(单店)：">
                <Row>
                  <Col span="16">
                    <div>
                      <RadioGroup
                        v-model="searchData.merchantType"
                        @on-change="handleChangeMerchantType"
                      >
                        <Radio v-for="(v,k) in merchantOption" :label="k" :key="k">
                          <span @click="handleChangeMerchantType(k)">{{v}}</span>
                        </Radio>
                      </RadioGroup>
                    </div>
                    <div>
                      <Input
                        v-model="searchData.merchantNames"
                        type="textarea"
                        style="width:300px;resize: none;"
                        :autosize="{minRows: 8,maxRows: 8}"
                        disabled
                      ></Input>
                    </div>
                  </Col>
                </Row>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="商户(多店)：">
                <Row>
                  <Col span="16">
                    <div>
                      <RadioGroup v-model="searchData.brandType" @on-change="handleChangeBrandType">
                        <Radio v-for="(v,k) in brandOption" :label="k" :key="k">
                          <span>{{v}}</span>
                        </Radio>
                      </RadioGroup>
                    </div>
                    <div>
                      <Input
                        v-model="searchData.brandNames"
                        type="textarea"
                        style="width:300px;resize: none;"
                        :autosize="{minRows: 8,maxRows: 8}"
                        disabled
                      ></Input>
                    </div>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <!-- 优惠券名称  v-if="searchData.downType!=3"-->
          <template v-if="searchData.downType!=3">
            <FormItem label="优惠券名称：">
              <Row>
                <Col span="10">
                  <div>
                    <Button @click="handleChooseCoupon" slot="append">点击按钮选择优惠券</Button>
                  </div>
                  <div style="margin-top:10px;">
                    <Input
                      v-model="searchData.cuoponNames"
                      type="textarea"
                      style="width:300px;resize: none;"
                      :autosize="{minRows: 8,maxRows: 8}"
                      disabled
                    ></Input>
                  </div>
                </Col>
              </Row>
            </FormItem>
          </template>

          <template v-if="searchData.downType==1">
            <FormItem label="支付方式：">
              <Select v-model="searchData.payMethod" style="width:100px" clearable>
                <Option v-for="(v,k) in payMethodOption" :value="k" :key="v">{{ v }}</Option>
              </Select>
            </FormItem>

            <FormItem label="交易类型：">
              <Select v-model="searchData.payType" style="width:100px" clearable>
                <Option v-for="(v,k) in payTypeOption" :value="k" :key="v">{{ v }}</Option>
              </Select>
            </FormItem>
          </template>
          <template v-else-if="searchData.downType==3">
            <FormItem label="审核状态：">
              <Select v-model="searchData.auditStatus" style="width:100px" clearable>
                <Option v-for="(v,k) in auditStatusOption" :value="k" :key="v">{{ v }}</Option>
              </Select>
            </FormItem>
          </template>

          <FormItem :label="`${timeRangeLabel}时间：`">
            <DatePicker
              type="daterange"
              placeholder="请选择日期"
              style="width: 200px"
              :value="timeRange"
              @on-change="changeStartDate"
            ></DatePicker>
          </FormItem>

          <FormItem :label-width="0">
            <Button icon="md-refresh" class="marginLeft20" @click="reset">重置</Button>
            <Button
              type="success"
              icon="ios-download-outline"
              class="marginLeft20"
              @click="exports"
            >导出</Button>
          </FormItem>
        </Form>
        <Row type="flex" justify="start"></Row>
      </Card>
    </div>

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

    <CouponList
      v-if="showCouponList"
      :showCouponList.sync="showCouponList"
      @seclectedTr-event="selectedCouponItem"
    ></CouponList>
  </div>
</template>
<script>
import { getRequest } from "@/libs/axios";

// 商户列表
import BusinessList from "./BusinessList";
// 品牌列表
import BrandList from "./BrandList";
// 优惠券商户
import CouponList from "./CouponList";

export default {
  name: "withdraw-details",
  inject: ["download", "msgOk", "msgErr"],
  components: {
    BusinessList,
    BrandList,
    CouponList
  },
  watch: {
    ["searchData.downType"]() {
      const { downType } = this.searchData;
      this.timeRangeLabel = this.downTypeOption[downType];
    }
  },
  data() {
    return {
      showBusinessList: false,
      showBrandList: false,
      showCouponList: false,
      timeRangeLabel: "交易",
      // 类型  明细
      downTypeOption: {
        "1": "交易",
        "2": "解冻",
        "3": "提现"
      },
      merchantOption: {
        "0": "全部商户",
        "1": "部分商户"
      },
      brandOption: {
        "0": "全部品牌",
        "1": "部分品牌"
      },
      // 审核状态： auditStatus  1待审核、2审核通过、3审核失败
      auditStatusOption: {
        "1": "待审核",
        "2": "审核通过",
        "3": "审核失败"
      },

      //交易明细:支付方式/交易类型
      // 支付方式 payMethod  1 支付宝 2 微信
      payMethodOption: {
        "1": "支付宝",
        "2": "微信"
      },

      // 交易类型 payType 1 支付 2 退款
      payTypeOption: {
        "1": "支付",
        "2": "退款"
      },

      // 查询参数
      timeRange: [],
      searchData: {
        downType: "3",
        merchantType: "0", //商户
        merchantNames: "",
        merchantIds: [],

        brandType: "0", //品牌
        brandNames: "",
        brandIds: [],

        auditStatus: "", //审核状态
        timeRange: [], //提现时间

        // 解冻明细
        cuoponNames: "",
        cuoponIds: [],

        payMethod: "", //支付方式
        payType: "" //交易类型
      }
    };
  },
  mounted() {},
  methods: {
    handleChangeMerchantType(type) {
      if (type == 1) {
        this.showBusinessList = true;
      } else {
        this.searchData.merchantNames = "";
        this.searchData.merchantIds = [];
      }
    },
    handleChangeBrandType(type) {
      if (type == 1) {
        this.showBrandList = true;
      } else {
        this.searchData.brandNames = "";
        this.searchData.brandIds = [];
      }
    },
    handleChooseCoupon() {
      this.showCouponList = true;
    },
    selectedCouponItem(data) {
      console.log("selectedCouponItem----", data);
      let { couponType, id, name } = data;
      // templateId 券模板id templateName 券模板名称
      let cuoponNames = [];
      let cuoponIds = [];
      data.forEach(item => {
        cuoponNames.push(item.title);
        cuoponIds.push(item.templateId);
      });
      this.searchData.cuoponNames = cuoponNames.join(",");
      this.searchData.cuoponIds = cuoponIds;
    },
    selectedTrCallBack(data) {
      let { type, arr } = data;
      console.log("selectedTrCallBack----", type, arr);

      let merchantNames = [];
      let merchantIds = [];
      let brandNames = [];
      let brandIds = [];
      arr.forEach(item => {
        // 0商户 1品牌
        if (type == 0) {
          merchantNames.push(item.merchantName);
          merchantIds.push(item.merchantId);
        } else {
          brandNames.push(item.merchantName);
          brandIds.push(item.brandId);
        }
      });

      if (type == 0) {
        this.searchData.merchantNames = merchantNames.join(",");
        this.searchData.merchantIds = merchantIds;
      } else {
        this.searchData.brandNames = brandNames.join(",");
        this.searchData.brandIds = brandIds;
      }
      console.log(" this.searchData----", this.searchData);
    },

    exports() {
      const url = "/trade/merchant/withdraw/download/list";

      console.log("导出", this.searchData);

      this.download(url, this.searchData);
    },
    changeStartDate(arr) {
      // yyyy-MM-dd HH:mm:ss
      console.log(arr);
      // this.timeRange = arr;
      this.searchData.timeRange = arr;
      let [startTime, endTime] = arr;
      if (startTime) {
        startTime = `${arr[0]}:00`;
        endTime = `${arr[1]}:00`;
      }
      console.log(startTime, endTime);
    },

    reset() {
      // 重置查询参数
      this.timeRange = []; // 时间
      this.searchData = {
        downType: "3",
        merchantType: "0", //商户
        merchantNames: "",
        merchantIds: [],

        brandType: "0", //品牌
        brandNames: "",
        brandIds: [],

        auditStatus: "", //审核状态
        timeRange: [], //提现时间

        // 解冻明细
        cuoponNames: "",
        cuoponIds: [],

        payMethod: "", //支付方式
        payType: "" //交易类型
      };
    }
  }
};
</script>
<style scoped>
.underline {
  text-decoration: underline;
}
.table-box {
  min-height: 100px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.marginLeft20 {
  margin-left: 20px;
}
</style>