<template>
  <div class="xxx">
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form label-position="right" ref="form" :model="searchData" :label-width="120">
          <FormItem label="类型：">
            <RadioGroup v-model="searchData.downType">
              <Radio v-for="(v,k) in downTypeOption" :label="k" :key="k">
                <span>{{v}}</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="商户(单店)：">
            <Row>
              <Col span="16">
                <div>
                  <RadioGroup v-model="searchData.merchantType">
                    <Radio v-for="(v,k) in merchantOption" :label="k" :key="k">
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
          <FormItem label="商户(多店)：">
            <Row>
              <Col span="16">
                <div>
                  <RadioGroup v-model="searchData.brandType">
                    <Radio v-for="(v,k) in brandOption" :label="k" :key="k">
                      <span>{{v}}</span>
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

          <FormItem label="审核状态：">
            <Select v-model="searchData.auditStatus" style="width:100px" clearable>
              <Option v-for="(v,k) in auditStatusOption" :value="k" :key="v">{{ v }}</Option>
            </Select>
          </FormItem>

          <FormItem label="提现时间：">
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
  </div>
</template>
<script>
import { getRequest } from "@/libs/axios";
export default {
  name: "withdraw-details",
  inject: ["download", "msgOk", "msgErr"],
  components: {
    // ModalAuditLogList,
    // Edit,
    // Detail,
    // Audit
  },

  data() {
    return {
      // 类型
      downTypeOption: {
        "1": "交易明细",
        "2": "解冻明细",
        "3": "提现明细"
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
        timeRange: [] //提现时间
      }
    };
  },
  mounted() {},
  methods: {
    exports() {
      const url = "/trade/merchant/withdraw/download/list";

      console.log("导出",this.searchData);
      
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
        merchantNames: [],
        merchantIds: [],

        brandType: "0", //品牌
        brandNames: [],
        brandIds: [],

        auditStatus: "", //审核状态
        timeRange: [] //提现时间
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