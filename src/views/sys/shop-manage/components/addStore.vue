<template>
  <Card>
     <p slot="title">{{add_edit}}</p>
   
   <p>
    <Form :label-width="180" class="form" :model="store_data" :rules="ruleValidate"  ref="store_data">
      <FormItem label="知而行门店号" prop="shopId">
        <Input placeholder="请输入正整数，比如1155" v-model="store_data.shopId" :disabled="type == 2" style="width:200px" />
      </FormItem>
      <FormItem label="零售商自有店号" prop="venderShopId">
        <!-- venderShopId -->
        <Input placeholder="请输入正整数，比如2625" v-model="store_data.venderShopId" style="width:200px" />
      </FormItem>
      <FormItem label="零售商编号" prop="venderId">
        <Input placeholder="请输入正整数，比如2625" v-model="store_data.venderId" style="width:200px" />
      </FormItem>
      <FormItem label="零售商名称" prop="venderName">
        <Input placeholder="请输入正整数，比如2625" v-model="store_data.venderName" style="width:200px" />
      </FormItem>
      <FormItem label="门店名称" prop="shopName">
        <Input type="text" placeholder="请输入门店名称" v-model="store_data.shopName" style="width:200px" />
      </FormItem>
      <FormItem label="门店类型" prop="categories">
        <Select v-model="store_data.categories" style="width:200px">
          <Option v-for="item in categoriesType" :value="item.label" :key="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="门店状态" prop="enabled">
        <Select v-model="store_data.enabled" style="width:200px">
          <Option  value="1" >正常</Option>
          <Option  value="0" >禁用</Option>
        </Select>
      </FormItem>
      <FormItem label="省份" prop="province">
        <Input type="text" placeholder="请输入门店所在省份" v-model="store_data.province" style="width:200px" />
      </FormItem>
      <FormItem label="城市" prop="city">
        <Input type="text" placeholder="请输入门店所在城市" v-model="store_data.city" style="width:200px" />
      </FormItem>
      <FormItem label="地区" prop="district">
        <Input type="text" placeholder="请输入门店所在地区" v-model="store_data.district" style="width:200px" />
      </FormItem>
      <!-- <FormItem label="纬度" prop="latitude">
        <Input type="text" placeholder="请输入纬度" v-model="store_data.latitude" style="width:200px" />
      </FormItem>
      <FormItem label="经度" prop="longitude">
        <Input type="text" placeholder="请输入经度" v-model="store_data.longitude" style="width:200px" />
      </FormItem> -->
      <FormItem label="详细地址" prop="address">
        <Input type="text" placeholder="请输入门店详细地址" v-model="store_data.address" style="width:400px" />
      </FormItem>
      <FormItem style="{'margin-top':'54px'}">
        <i-button type="primary" @click="submit" :disabled="flag_Submit" size="large" style="width:250px; margin-right:50px;">确定</i-button>
        <i-button size="large" icon="arrow-left-c" @click="back">返回列表</i-button>
      </FormItem>
    </Form>
  </p>
</Card>
</template>

<script>
import { addShop, editShop } from "@/api/sys";
export default {
  data() {
    return {
      add_edit: '',
      appStoreList: [], //
      operationType: '',
      store_data: {
        address: '', // 详细地址 必
        categories: '', // 类型
        city: '', // 城市 必
        district: '', // 地区 必
        enabled: 0, // 状态
        // latitude: '', // 纬度
        // longitude: '', // 经度
        province: '', // 省份 必
        shopId: '', // 门店号 必
        shopName: '', // 门店名 必
        venderId: '', // 零售商编号 必
        venderName: '', // 零售商名称 必
        venderShopId: '' // 零售商自有店号 必
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
      
      ruleValidate: { // 输入验证
        shopId: [
          {
            required: true,
            message: "必须输入知而行门店号",
            trigger: "blur"
          }
        ],
        venderShopId: [
          {
            required: true,
            message: "必须输入零售商自有店号",
            trigger: "blur"
          }
        ],
        venderId: [
          {
            required: true,
            message: "必须输入零售商编号",
            trigger: "blur"
          }
        ],
        venderName: [
          {
            required: true,
            message: "请输入零售商名称",
            trigger: "blur"
          }
        ],
        shopName: [
          { required: true,
            message: "请输入门店名称", 
            trigger: "blur" 
          }
        ],
        categories: [
          {
            required: true,
            message: "必须选择门店类型",
            trigger: "change"
          }
        ],
        enabled: [
          {
            required: true,
            message: "必须选择门店状态",
            trigger: "change"
          }
        ],
        province: [
          {
            required: true,
            message: "必须输入省份",
            trigger: "blur"
          }
        ],
        city: [
          {
            required: true,
            message: "必须输入城市",
            trigger: "blur"
          }
        ],
        district: [
          {
            required: true,
            message: "必须输入地区",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "必须输入详细地址",
            trigger: "blur"
          }
        ],
      },
    }
  },
  props: {
    type: Number,
    storeItem: Object
  },
  components: {

  },
  created: function () {
    //console.log(this.type);
    if (this.type == 2) {
      
    }

    this.typeTxt()
  },
  methods: {
// 判断当前类型
    typeTxt () {
      if(this.type == 1) {
        this.add_edit = '新增门店'
      } else if (this.type == 2) {
        this.add_edit = '编辑门店'
        //console.log(this.storeItem);
        
        this.store_data.address = this.storeItem.address
        this.store_data.categories = this.storeItem.categories
        this.store_data.city = this.storeItem.city
        this.store_data.district = this.storeItem.district
        this.store_data.enabled = this.storeItem.enabled.toString()
        // this.store_data.latitude = this.storeItem.latitude
        // this.store_data.longitude = this.storeItem.longitude
        this.store_data.province = this.storeItem.province
        this.store_data.shopId = this.storeItem.shopId
        this.store_data.shopName = this.storeItem.shopName
        this.store_data.venderId = this.storeItem.venderId
        this.store_data.venderName = this.storeItem.venderName
        this.store_data.venderShopId = this.storeItem.venderShopId

        // this.store_data.appid = this.storeItem.appid;
        // this.store_data.shopId = this.storeItem.shopId;
        // this.store_data.venderShopId = this.storeItem.venderShopId;
        // this.store_data.shopName = this.storeItem.shopName;
        // this.store_data.categories = this.storeItem.categories;
        // this.store_data.province = this.storeItem.province;
        // this.store_data.city = this.storeItem.city;
        // this.store_data.district = this.storeItem.district;
        // this.store_data.address = this.storeItem.address;


      }
    },

    //返回列表
    back: function () {
      this.$emit('changeStatus', false);
    },

// 发送请求
    submit: function () {
      if (this.type == 1) {
        // 新增
        //console.log('新增');
        this.$refs['store_data'].validate(valid => {
          if (valid) {
            // 成功
            addShop(this.store_data).then( res => {
              if (res.code == 200) {
                this.msgOk('成功')
                //重置
                // this.$refs['store_data'].resetFields();
                this.$emit('changeStatus', false);
              } else {
                this.msgErr(res.msg)
              }
            })
          } else {
            this.msgErr('请输入必填项');
          }
        });

      } else if (this.type == 2) {

        //console.log('编辑');
        this.$refs['store_data'].validate(valid => {
          if (valid) {
            // 成功
            editShop(this.store_data).then( res => {
              if (res.code == 200) {
                this.msgOk('成功')
                //重置
                // this.$refs['store_data'].resetFields();
                this.$emit('changeStatus', false);
              } else {
                this.msgErr(res.msg)
              }
            })
          } else {
            this.msgErr('请输入必填项');
          }
        });
      }



      
    },

    msgOk (txt) {
      this.$Message.info({
          content: txt,
          duration: 3
          });
    },

    msgErr (txt) {
      this.$Message.error({
          content: txt,
          duration: 3
          });
    }
  }
}
</script>

<style>
.form {
  width: 800px;
}
.form > div {
  display: inline-block;
}
</style>
