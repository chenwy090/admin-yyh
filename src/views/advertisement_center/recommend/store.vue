<template>
  <div>
    <Row>
      <Col span="4">
        <FormItem
          :prop="'shops['+index+'].provinceId'"
          :rules="{ required: true, message: '请选择省份' }"
        >
          <Select
            v-model="provinceId"
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
            v-model="cityId"
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
            v-model="areaId"
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
            v-model="shopCode"
            placeholder="选择门店"
            @on-change="shopCodeChange"
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
import { postRequest, getRequest } from "@/libs/axios";
export default {
  props: {
    index: Number,
    shop: Object
  },
  data() {
    return {
      isInit: 0,
      provinceList: [],
      cityList: [],
      areaList: [],
      shopList: [],
      provinceId: null,
      cityId: null,
      areaId: null,
      shopCode: null,
      provinceName: null,
      cityName: null,
      districtName: null
    };
  },
  methods: {
    loadProvinceList: function(callback) {
      postRequest("/system/area/province/list").then(res => {
        if (res.code == 200) {
          this.provinceList = res.data;
          if(callback){
            callback();
          }
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    loadCityList: function() {
      
    },
    loadAreaList: function() {
     
    },
    //根据省份code获取城市信息数据
    provinceChange(item, callback) {
      this.provinceName =  item.label;
      this.$emit("sendProvinceId", this.provinceId, this.index);
      getRequest("/system/area/city/" + this.provinceId).then(res => {
        if (res.code == 200) {
          this.cityList = res.data;
          this.areaId = null;
          if(callback){
            callback();
          }
        } else {
          this.$Message.error(res.msg);
        }
      });
      this.loadShops();
    },
    //根据城市code获取区县信息数据
    cityChange(item, callback) {
      this.cityName = item.label;
      this.$emit("sendCityId", this.cityId, this.index);
      getRequest("/system/area/district/" + this.cityId).then(res => {
        if (res.code == 200) {
          this.areaList = res.data;
          if(callback){
            callback();
          }
        } else {
          this.$Message.error(res.msg);
        }
      });
      this.loadShops();
    },
     //根据城市code获取区域信息数据
    areaChange(item) {
      this.districtName = item.label;
      this.$emit("sendAreaId", this.areaId, this.index);
      this.loadShops();
    },
    shopCodeChange(item) {
      this.$emit("sendShopCode", this.shopCode, item.label, this.index);
    },
    loadShops: function() {
      if(this.isInit == 1){
        return;
      }
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
      this.$emit("handleRemove-event", this.index);
    },
    init: function() {
     var globalThis = this;
     this.loadProvinceList(function(){
        if (globalThis.shop.provinceId) {
          globalThis.isInit=1;
          globalThis.provinceId = globalThis.shop.provinceId;
          globalThis.provinceName = globalThis.provinceList.find((el) => (el.provinceCode ==  globalThis.provinceId)).provinceName; 
          if(globalThis.shop.cityId){
            globalThis.provinceChange({lable: globalThis.provinceName}, function(){
              globalThis.cityId = globalThis.shop.cityId;
              globalThis.cityName = globalThis.cityList.find((el) => (el.cityCode ==  globalThis.cityId)).cityName;
              if(globalThis.shop.areaId){
                globalThis.cityChange({lable: globalThis.cityName}, function(){
                    globalThis.areaId = globalThis.shop.areaId;
                    globalThis.districtName = globalThis.areaList.find((el) => (el.areaCode ==  globalThis.areaId)).areaName;
                    if (globalThis.shop.provinceId) {
                      globalThis.isInit=0;
                      globalThis.loadShops();
                      globalThis.shopCode = globalThis.shop.shopCode;
                    }
                });
                
              }
            });
          }
        }
     });
    }
  },
  mounted: function() {
     this.init();
  }
};
</script>
