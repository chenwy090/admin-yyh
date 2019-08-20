<template>
  <div>
    <Row>
      <Col span="4">
        <FormItem
          :prop="'drawDailyShopList['+index+'].provinceCode'"
          :rules="{ required: true, message: '请选择省份' }"
        >
          <Select
            v-model="provinceCode"
            placeholder="选择省"
            @on-change="provinceChange"
            :label-in-value="true"
          >
            <Option
              v-for="(item,index) in provinceList"
              :key="index"
              :value="item.provinceCode"
            >{{item.provinceName}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="4">
        <FormItem>
          <Select
            v-model="cityCode"
            placeholder="选择市"
            @on-change="cityChange"
            :label-in-value="true"
          >
            <Option
              v-for="(item,index) in cityList"
              :key="index"
              :value="item.cityCode"
            >{{item.cityName}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="4">
        <FormItem>
          <Select
            v-model="countryCode"
            placeholder="选择区"
            @on-change="areaChange"
            :label-in-value="true"
          >
            <Option
              v-for="(item,index) in areaList"
              :key="index"
              :value="item.areaCode"
            >{{item.areaName}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="4">
        <FormItem>
          <Select
            v-model="shopId"
            placeholder="选择门店"
            @on-change="shopIdChange"
            :label-in-value="true"
          >
            <Option
              v-for="(item,index) in shopList"
              :key="index"
              :value="item.shopId"
            >{{item.shopName}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="2">
        <Button type="dashed" long @click="handleRemove()" icon="ios-close"></Button>
      </Col>
    </Row>
  </div>
</template>
<script>
import {
  postRequest,
  getRequest,
  postSyncRequest,
  getSyncRequest
} from "@/libs/axios";
export default {
  props: {
    id: Number,
    index: Number,
    shop: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },

  data() {
    return {
      isInit: 0,
      provinceList: [],
      cityList: [],
      areaList: [],
      shopList: [],
      provinceCode: null,
      cityCode: null,
      countryCode: null,
      shopId: null,
      provinceName: null,
      cityName: null,
      districtName: null
    };
  },
  methods: {
    loadProvinceList() {
      return postSyncRequest("/system/area/province/list").then(res => {
        if (res.code == 200) {
          this.provinceList = res.data;

          ["provinceCode", "cityCode", "countryCode", "shopId"].forEach(
            name => {
              this[name] = this.shop[name];
              // console.log(name, this[name]);
            }
          );
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //根据省份code获取城市信息数据
    provinceChange(item, callback) {
      this.cityList = [];
      this.areaList = [];
      this.shopList = [];
      this.cityCode = null;
      this.countryCode = null;
      this.shopId = null;
      this.cityName = null;
      this.districtName = null;
      this.provinceName = item.label;
      this.$emit("sendProvinceId", this.provinceCode, this.shop.id);
      getSyncRequest("/system/area/city/" + this.provinceCode).then(res => {
        if (res.code == 200) {
          this.cityList = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
      // this.loadShops();
    },
    //根据城市code获取区县信息数据
    cityChange(item, callback) {
      this.areaList = [];
      this.shopList = [];
      this.countryCode = null;
      this.shopId = null;
      this.districtName = null;
      if (!item) {
        this.cityName = null;
      } else {
        this.cityName = item.label;
      }
      this.$emit("sendCityId", this.cityCode, this.shop.id);
      getSyncRequest("/system/area/district/" + this.cityCode).then(res => {
        if (res.code == 200) {
          this.areaList = res.data;
          if (callback) {
            callback();
          }
          // this.loadShops();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //根据城市code获取区域信息数据
    areaChange(item) {
      this.shopList = [];
      this.shopId = null;
      if (!item) {
        this.districtName = null;
      } else {
        this.districtName = item.label;
      }
      this.$emit("sendAreaId", this.countryCode, this.shop.id);
      this.loadShops();
    },
    shopIdChange(item) {
      console.log("shopIdChange111", item, this.shop.id);
      if (!item) {
        this.$emit("sendShopId", this.shopId, null, this.shop.id);
      } else {
        this.$emit("sendShopId", this.shopId, item.label, this.shop.id);
      }
    },
    loadShops() {
      if (!this.provinceName) {
        return this.$Message.error("请选择省份");
      }
      if (!this.cityName) {
        return this.$Message.error("请选择区县");
      }
      if (!this.districtName) {
        return this.$Message.error("请选择区域");
      }
      // if (!this.shopId) {
      //   return this.$Message.error("请选择门店");
      // }
      postRequest("/system/sys-shop-info/list?pageNum=1&pageSize=2000", {
        province: this.provinceName,
        city: this.cityName,
        district: this.districtName
      }).then(res => {
        if (res.code == 200) {
          this.shopList = res.data.records;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    handleRemove() {
      this.$emit("handleRemove-event", this.shop.id);
    },
    init() {
      postRequest("/system/area/province/list")
        .then(res => {
          if (res.code == 200) {
            this.provinceList = res.data;
          } else {
            this.$Message.error(res.msg);
          }
          return res;
        })
        .then(res => {
          if (this.shop.provinceCode) {
            this.provinceCode = this.shop.provinceCode;
            this.provinceName = this.provinceList.find(
              el => el.provinceCode == this.provinceCode
            ).provinceName;
          }
          console.log("provinceCode", this.provinceCode);

          return res;
        })
        .then(res => {
          getSyncRequest("/system/area/city/" + this.provinceCode)
            .then(res => {
              if (res.code == 200) {
                this.cityList = res.data;
                this.cityCode = this.shop.cityCode;
                this.countryCode = null;
                if (this.shop.cityCode) {
                  this.cityName = this.cityList.find(
                    el => el.cityCode == this.cityCode
                  ).cityName;
                }

                console.log("cityName", this.cityName);
              } else {
                this.$Message.error(res.msg);
              }
              return res;
            })
            .then(res => {
              if (this.shop.cityCode) {
                getSyncRequest("/system/area/district/" + this.cityCode).then(
                  res => {
                    if (res.code == 200) {
                      this.areaList = res.data;
                      this.countryCode = this.shop.countryCode;
                      if (this.shop.countryCode) {
                        this.districtName = this.areaList.find(
                          el => el.areaCode == this.countryCode
                        ).areaName;
                      }

                      if (this.shop.shopId) {
                        this.shopId = `${this.shop.shopId}`;
                        this.loadShops();
                      }
                    } else {
                      this.$Message.error(res.msg);
                    }
                  }
                );
              }
            });
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadProvinceList();
      // console.log(111,this.shop);
      // 修改 级联查询
      if (this.shop.provinceCode) {
        this.init();
      }
    });
  }
};
</script>
