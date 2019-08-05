<template>
  <div>
    <Form :label-width="180">
      <FormItem label="知而行门店号" required>
        <Input placeholder="请输入正整数，比如1155" :value="store_data.shopId" :disabled="type == 2" style="width:200px" />
      </FormItem>
      <FormItem label="零售商自有店号" required>
        <Input placeholder="请输入正整数，比如2625" :value="store_data.venderShopId" style="width:200px" />
      </FormItem>
      <FormItem label="门店名称" required>
        <Input type="text" placeholder="请输入门店名称" :value="store_data.shopName" style="width:200px" />
      </FormItem>
      <FormItem label="门店类型" required>
        <Select :model.sync="store_data.categories" style="width:200px">
          <Option v-for="item in categoriesType" :value="item.label" :key="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="省份" required>
        <Input type="text" placeholder="请输入门店所在省份" :value="store_data.province" style="width:200px" />
      </FormItem>
      <FormItem label="城市" required>
        <Input type="text" placeholder="请输入门店所在城市" :value="store_data.city" style="width:200px" />
      </FormItem>
      <FormItem label="地区" required>
        <Input type="text" placeholder="请输入门店所在地区" :value="store_data.district" style="width:200px" />
      </FormItem>
      <FormItem label="详细地址" required>
        <Input type="text" placeholder="请输入门店详细地址" :value="store_data.address" style="width:400px" />
      </FormItem>
      <FormItem style="{'margin-top':'54px'}">
        <i-button type="primary" @click="submit" :disabled="flag_Submit" size="large" :style="{width:'250px'}">确定</i-button>
        <i-button size="large" icon="arrow-left-c" @click="back">返回列表</i-button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appStoreList: [], //
      operationType: '',
      store_data: {
        appid: '',       //小程序唯一标识--必填
        shopId: '', //知而行门店号--必填
        venderShopId: '', //零售商自有店号--必填
        shopName: '', //知而行门店名称--必填
        categories: '',  //门店的类型,允许多个分类，不同级分类用“,”隔开: 如：超市,便利店--必填
        address: '', //门店所在的详细街道地址（不要填写省市信息）--必填
        city: '', //门店所在的城市--必填
        district: '', //门店所在地区--必填
        province: '', //门店所在的省份--必填
      },
      editInfo: null,
      categoriesType: [
        {
          label: '购物,超市',
          value: 1
        },
        {
          label: '购物,便利店',
          value: 2
        },
        {
          label: '购物,母婴儿童',
          value: 3
        },
      ],
      flag_Submit: false, //防止重复点击
    }
  },
  props: {
    type: Number,
    storeItem: Object
  },
  components: {

  },
  created: function () {
    console.log(this.type);
    if (this.type == 2) {
      this.store_data.appid = this.storeItem.appid;
      this.store_data.shopId = this.storeItem.shopId;
      this.store_data.venderShopId = this.storeItem.venderShopId;
      this.store_data.shopName = this.storeItem.shopName;
      this.store_data.categories = this.storeItem.categories;
      this.store_data.province = this.storeItem.province;
      this.store_data.city = this.storeItem.city;
      this.store_data.district = this.storeItem.district;
      this.store_data.address = this.storeItem.address;
    }
  },
  methods: {
    //返回列表
    back: function () {
      this.$emit('changeStatus', false);
    },
    submit: function () {
      if (this.type == 1) {
        console.log(新增门店);
      } else {
        console.log(编辑门店);
      }
    },
  }
}
</script>

<style>
</style>
