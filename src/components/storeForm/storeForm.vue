<template>
  <div>
    <!-- <FormItem label="投放门店：" :required="required">
      <RadioGroup v-model="modal.pushRange" @on-change="changeData">
        <Radio v-for="item in storeTypeList" :key="item.value" :label="item.value" :disabled="disabled">{{
          item.label
        }}</Radio>
      </RadioGroup>
    </FormItem> -->

    <div style="padding-bottom:10px">
      <template v-if="!disabled">
        <RadioGroup v-model="modal.pushRange" @on-change="changeData">
          <Radio v-for="item in storeTypeList" :key="item.value" :label="item.value" :disabled="disabled">{{
            item.label
          }}</Radio>
        </RadioGroup>
      </template>
      <template v-if="disabled">
        <span>{{ storeTypeList[modal.pushRange].label }}</span>
      </template>
    </div>

    <template v-if="modal.pushRange == 1">
      <Select
        :disabled="disabled"
        v-model="modal.venderName"
        placeholder="请选择零售商"
        @on-change="changeData"
        style="width:200px;padding:5px 0;"
      >
        <Option v-for="(item, index) in sysShopInfoData" h :value="item.venderName" :key="item.venderId + index">{{
          item.venderName
        }}</Option>
      </Select>

      <Table
        :columns="[
          { title: '门店编号', key: 'shopId' },
          { title: '商超门店名称', key: 'shopName' },
          { title: '零售商', key: 'venderName' },
          { title: '地址', key: 'address' },
        ]"
        :data="shopRequestListInfo"
        style="margin-top:1vh"
        v-if="shopRequestListInfo"
        border
      >
      </Table>
    </template>

    <template v-if="modal.pushRange == 2">
      <template v-for="(item, index) in cityList">
        <div style="display: flex;justify-content: flex-start;align-items: center;">
          <Select
            v-model="item.value1"
            placeholder="请选择省"
            style="width:150px;padding:5px 0;"
            :disabled="disabled"
            @on-change="proviceChange($event, index)"
          >
            <Option v-for="item in proviceSelect" :value="item" :key="item">{{ item }}</Option>
          </Select>
          <span style="padding: 0 10px;">/</span>
          <Select
            :disabled="disabled"
            v-model="item.value2"
            placeholder="请选择市"
            style="width:200px;padding:5px 0;"
            @on-change="changeData"
          >
            <Option v-for="item in item.cityList" :value="item" :key="item">{{ item }}</Option>
          </Select>
          <Icon
            v-if="!disabled"
            @click="cityRemove(index)"
            class="tag-remove"
            size="30"
            color="#ffb08f"
            type="ios-remove-circle-outline"
          />
          <Icon
            v-if="!disabled && index == 0"
            @click="cityAdd"
            class="tag-add"
            size="30"
            color="#2d8cf0"
            type="ios-add-circle-outline"
          />
        </div>
      </template>
      <Table
        :columns="[
          { title: '门店编号', key: 'shopId' },
          { title: '商超门店名称', key: 'shopName' },
          { title: '零售商', key: 'venderName' },
          { title: '地址', key: 'address' },
        ]"
        :data="shopRequestListInfo"
        style="margin-top:1vh"
        v-if="shopRequestListInfo"
        border
      >
      </Table>
    </template>

    <template v-if="modal.pushRange == 3">
      <div style="margin-bottom: 1vh;">
        <Button :disabled="disabled" style="margin-bottom: 1vh;" @click="showSelectShopFun()">选择门店</Button>
        <Table
          border
          :columns="[
            { title: '门店编号', key: 'shopId' },
            { title: '商超门店名称', key: 'shopName' },
            { title: '零售商', key: 'venderName' },
            { title: '地址', key: 'address' },
          ]"
          :data="shopListData"
        >
        </Table>
      </div>
      <storeView
        :visible.sync="showSelectShop"
        :shopListData.sync="shopListData"
        @update:shopListData="changeData"
      ></storeView>
    </template>
  </div>
</template>
<script>
import storeView from "./store";
import * as cms from "@/api/cms";
export default {
  components: { storeView },
  props: ["pushRange", "shopRequestList", "shopRequestListInfo", "disabled", "required"],
  data() {
    return {
      modal: {
        pushRange: 0,
        venderName: "",
        shopRequestList: [],
      },
      isChangeData: false,
      storeTypeList: [
        { value: 0, label: "全国" },
        { value: 1, label: "零售商" },
        { value: 2, label: "城市" },
        { value: 3, label: "自定义门店" },
      ],
      showSelectShop: false,
      shopListData: [],
      cityList: [
        {
          value1: "",
          value2: "",
          citylist: [],
        },
      ],
      proviceSelect: [],
      sysShopInfoData: [], // 零售商列表
    };
  },
  computed: {},
  watch: {
    pushRange(val, oVal) {
      this.modal.pushRange = val || 0;
    },
    shopRequestList(val, oVal) {
      if (this.isChangeData) return;
      this.modal.shopRequestList = val;
      this.echoData();
    },
  },
  methods: {
    initData() {
      cms.shopProvice().then(res => {
        if (res.isSuccess) {
          this.proviceSelect = res.data;
        }
      });
      cms.getVenderInfo().then(res => {
        if (res.isSuccess) {
          this.sysShopInfoData = res.data;
        }
      });
    },
    proviceChange(provinceName, index) {
      if (!provinceName) return;
      this.cityList[index].value2 = [];
      cms.shopCity({ province: provinceName }).then(res => {
        if (res.isSuccess) {
          let item = this.cityList[index];
          this.$set(item, "cityList", res.data);
        }
      });
    },
    // 门店选择相关
    showSelectShopFun() {
      this.showSelectShop = !this.showSelectShop;
    },
    showSelectShopFun2(val) {
      this.showSelectShop = val;
    },
    cityAdd() {
      this.cityList.push({
        value1: "",
        value2: "",
        citylist: [],
      });
      this.changeData();
    },
    cityRemove(index) {
      if (this.cityList.length == 1) return;
      this.cityList.splice(index, 1);
      this.changeData();
    },
    changeData() {
      this.isChangeData = true;
      switch (this.modal.pushRange) {
        case 0:
          this.modal.shopRequestList = [];
          break;
        case 1:
          this.modal.shopRequestList = [
            {
              venderName: this.modal.venderName,
            },
          ];
          break;
        case 2:
          this.modal.shopRequestList = this.cityList.map(item => {
            return {
              province: item.value1,
              city: item.value2,
            };
          });
          break;
        case 3:
          this.modal.shopRequestList = this.shopListData.map(item => {
            return {
              shopId: item.shopId,
              shopName: item.shopName,
              venderName: item.venderName,
              address: item.address,
            };
          });
          break;
      }

      // console.info(this.modal.shopRequestList)
      this.$emit("update:pushRange", this.modal.pushRange);
      this.$emit("update:shopRequestList", this.modal.shopRequestList);
    },
    echoData() {
      switch (this.modal.pushRange) {
        case 0:
          break;
        case 1:
          this.modal.venderName = this.shopRequestList[0].venderName;
          break;
        case 2:
          this.cityList = this.shopRequestList.map(item => {
            return {
              cityList: [item.city],
              value1: item.province,
              value2: item.city,
            };
          });

          this.cityList.forEach((item, index) => {
            this.proviceChange(item.province, index);
          });

          break;
        case 3:
          this.shopListData = this.shopRequestList.map(item => {
            return {
              shopId: item.shopId,
              shopName: item.shopName,
              venderName: item.venderName,
              address: item.address,
            };
          });
          break;
      }
    },
  },
  mounted() {
    this.initData();
    this.modal.pushRange = this.pushRange || 0;
    this.modal.shopRequestList = this.shopRequestList || [];
    this.echoData();
  },
};
</script>
<style lang="less" scoped></style>
