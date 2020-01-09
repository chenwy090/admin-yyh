<template>
  <div class="province-list">
    <Row>
      <div style="float:left;width:200px;">
        <FormItem label="省份：" prop="provinceCode" :rules="{ required: true, message: '请选择省份' }">
          <Select
            v-model="data.provinceCode"
            placeholder="选择省"
            @on-change="provinceChange"
            :label-in-value="true"
            style="width:100px"
          >
            <Option
              v-for="(item,index) in provinceList"
              :key="index"
              :value="item.code"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
      </div>

      <div style="float:left;width:200px;">
        <FormItem label="城市：" prop="cityCode" :rules="{ required: true, message: '请选择市' }">
          <Select
            v-model="data.cityCode"
            placeholder="选择市"
            @on-change="cityChange"
            :label-in-value="true"
            style="width:100px"
          >
            <Option v-for="(item,index) in cityList" :key="index" :value="item.code">{{item.label}}</Option>
          </Select>
        </FormItem>
      </div>
      <div style="float:left;width:200px;">
        <FormItem label="地区：" prop="districtCode" :rules="{ required: true, message: '请选择区' }">
          <Select
            v-model="data.districtCode"
            placeholder="选择开通县区"
            @on-change="districtChange"
            :label-in-value="true"
            style="width:100px"
          >
            <Option
              v-for="(item,index) in districtList"
              :key="index"
              :value="item.code"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
      </div>
    </Row>
  </div>
</template>
<script>
import { getRequest } from "@/libs/axios";
export default {
  name: "province-list",
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },

  data() {
    return {
      provinceList: [], //{code: "330000", label: "浙江省", sort: 11}
      cityList: [], //{code: "310100", label: "上海市", sort: 1}
      districtList: [], //{code: "330206", label: "北仑区", sort: 1}
      province: "", //provinceName
      provinceCode: null,
      provinceName: null,
      city: "", //cityName
      cityCode: null,
      cityName: null,
      district: "", //districtName
      districtCode: null,
      districtName: null,
    };
  },
  methods: {
    async loadProvinceList() {
      // 已开通省份
      const url = "/system/address/components/list/province";
      const { code, msg, data } = await getRequest(url);
      if (code == 200) {
        this.provinceList = data;

        ["city", "district", "cityCode", "districtCode"].forEach(name => {
          this.data[name] = "";
        });
      } else {
        this.$Message.error(msg);
      }
    },
    //根据省份code获取城市信息数据
    async provinceChange(item) {
      // {label,value}
      let { label: provinceName, value: provinceCode } = item;
      this.provinceCode = provinceCode;
      this.provinceName = provinceName;

      this.cityList = [];
      this.districtList = [];

      this.cityCode = null;
      this.cityName = null;

      this.districtCode = null;
      this.districtName = null;

      // this.data.cityCode = "";
      // this.data.cityName = "";
      // this.data.districtCode = "";
      // this.data.districtName = "";

      this.$emit("sendProvinceCode", provinceCode, provinceName);

      // 已开通城市
      let url = `/system/address/components/list/city/${provinceCode}`;

      const { code, msg, data } = await getRequest(url);
      if (code == 200) {
        this.cityList = data;
      } else {
        this.$Message.error(msg);
      }
    },
    //根据城市code获取区县信息数据
    async cityChange(item) {
      let { label: cityName, value: cityCode } = item;

      this.cityCode = cityCode;
      this.cityName = cityName;

      this.districtList = [];
      this.districtCode = null;
      this.districtName = null;

      // this.data.districtCode = "";
      // this.data.districtName = "";

      this.$emit("sendCityCode", cityCode, cityName);

      // 已开通县区
      let url = `/system/address/components/list/district/${cityCode}`;
      const { code, msg, data } = await getRequest(url);
      if (code == 200) {
        this.districtList = data;
      } else {
        this.$Message.error(msg);
      }
    },
    //根据城市code获取区域信息数据
    districtChange(item) {
      let { label: districtName, value: districtCode } = item;
      this.districtCode = districtCode;
      this.districtName = districtName;

      this.$emit("sendDistrictCode", districtCode, districtName);
    },
    init() {
      const { provinceCode, cityCode, districtCode } = this.data;
      (async _ => {
        // 已开通省份
        const url = "/system/address/components/list/province";
        const { code, msg, data } = await getRequest(url);
        if (code == 200) {
          this.provinceList = data;
        } else {
          this.$Message.error(msg);
        }
      })();

      (async _ => {
        // 已开通城市
        let url = `/system/address/components/list/city/${provinceCode}`;
        const { code, msg, data } = await getRequest(url);
        if (code == 200) {
          this.cityList = data;
        } else {
          this.$Message.error(msg);
        }
      })();

      (async _ => {
        // 已开通县区
        let url = `/system/address/components/list/district/${cityCode}`;
        const { code, msg, data } = await getRequest(url);
        if (code == 200) {
          this.districtList = data;
        } else {
          this.$Message.error(msg);
        }
      })();
    },
  },
  async mounted() {
    if (this.data.province) {
      //编辑 查询级联数据
      this.init();
    } else {
      //新建 查询省数据
      await this.loadProvinceList();
    }
  },
};
</script>
<style lang="less" scoped>
.province-list {
  /deep/.ivu-form-item-content {
    min-width: 200px;
  }
}
</style>


