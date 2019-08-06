<template>
  <div>
    <Form ref="form" :model="form" :rules="formValite" :label-width="120">
      <Row>
        <Col span="8">
          <FormItem label="选择优惠券" prop="couponName" :rules="{ required: true, message: '请选择优惠券' }">
            <Input v-model="form.couponName" placeholder="点击按钮选择优惠券" disabled>
              <Button @click="handleChoose()" slot="append">选择</Button>
            </Input>
          </FormItem>
        </Col>
      </Row>
      <FormItem
        label="BackCode集"
        prop="backCode"
        :rules="{ required: true, message: '必须按行输入BackCode集' }"
      >
        <Row>
          <Col span="8">
            <Input v-model="form.backCode" type="textarea" :rows="10" placeholder="BackCode集" />
          </Col>
        </Row>
      </FormItem>
      <Row>
        <FormItem label="投放位置">
          <Row>
            <Col span="4">
              <FormItem prop="firstSite">
                <Select v-model="form.firstSite" placeholder="选择渠道" @on-change="firstSiteChange">
                  <Option
                    v-for="item in firstSiteList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>

            <Col span="4">
              <FormItem prop="secondSite">
                <Select v-model="form.secondSite" placeholder="选择位置">
                  <Option
                    v-for="item in secondSiteList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <Row>
        <Col span="24">
          <FormItem>
            <p
              style="color:red"
            >*要优惠详情－0号位的barcode必须和优惠券保持一致。例如：用户扫农夫山泉300mlbarcode，扫出来的优惠券也必须是扫农夫山泉300ml优惠券</p>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="投放门店" v-for="(item, index) in form.shops" v-if="item.status" :key="index">
        <storeView
          :index="item.index"
          v-on:sendProvinceId="sendProvinceId"
          v-on:sendCityId="sendCityId"
          v-on:sendAreaId="sendAreaId"
          v-on:sendShopCode="sendShopCode"
          @handleRemove-event="handleRemove"
          :shop="item"
        ></storeView>
      </FormItem>
      <FormItem label=" ">
        <Button type="dashed" long @click="handleAdd" icon="md-add" style="width:100px;"></Button>
      </FormItem>
      <FormItem label="曝光量" prop="showNum">
        <Row>
          <Col span="4">
            <Input v-model="form.showNum" placeholder="曝光量" type="number">
              <span slot="append">次</span>
            </Input>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="投放量" prop="num">
        <Row>
          <Col span="4">
            <Input v-model="form.num" placeholder="投放量" type="number">
              <span slot="append">张</span>
            </Input>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="优惠力度" prop="discounts">
        <Row>
          <Col span="4">
            <Input v-model="form.discounts" placeholder="优惠力度" type="number">
              <span slot="append">%</span>
            </Input>
          </Col>
        </Row>
      </FormItem>
      <Row>
        <Col span="12">
          <FormItem label="时间" prop="startDate" :rules="{ required: true, message: '请选择日期' }">
            <DatePicker
              type="datetimerange"
              placement="bottom-end"
              placeholder="请选择日期"
              @on-change="datetimechange"
              style="width:450px;"
              class="date-range"
            ></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <FormItem label=" ">
        <Button type="primary" @click="handleSubmit('form')">提交</Button>
        <Button style="margin-left: 8px" @click="handleReset('form')">重置</Button>
      </FormItem>
    </Form>
    <Modal v-model="couponModalShow" title="选择优惠券" width="800px" @footer-hide="false">
      <chooseCouponListView @seclectedTr-event="selectedTrCallBack"></chooseCouponListView>
    </Modal>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/libs/axios";
import storeView from "./store";
import chooseCouponListView from "./chooseCouponList";
export default {
  components: {
    storeView,
    chooseCouponListView
  },
  props: {
    id: Number
  },
  data() {
    //验证正整数+正小数+0
    const checkIsPositive = (rule, value, callback) => {
      var reg = /^\d+(?=\.{0,1}\d+$|$)/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于等于0的正数"));
      }
    };
    //验证正整数
    const checkIsPositiveIntegerEx0 = (rule, value, callback) => {
      var reg = /^([1-9][0-9]*)$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于0的正整数"));
      }
    };

    return {
      index: 0,
      form: {
        id: null,
        couponId: null,
        couponName: null,
        backCode: null,
        firstSite: null,
        secondSite: null,
        num: null,
        showNum: null,
        discounts: null,
        startDate: null,
        endDate: null,
        shops: [
          {
            provinceId: null,
            cityId: null,
            areaId: null,
            shopCode: null,
            shopName: null,
            index: 0,
            status: 1
          }
        ]
      },
      formValite: {
        firstSite: [{ required: true, message: "请选择投放渠道" }],
        secondSite: [{ required: true, message: "请选择投放位置" }],
        num: [
          {
            required: true,
            validator: checkIsPositiveIntegerEx0,
            trigger: "blur"
          }
        ],
        showNum: [
          {
            required: true,
            validator: checkIsPositiveIntegerEx0,
            trigger: "blur"
          }
        ],
        discounts: [
          { required: true, validator: checkIsPositive, trigger: "blur" }
        ]
      },
      firstSiteList: [
        {
          label: "要优惠详情页",
          value: "1"
        },
        {
          label: "要优惠领券成功页",
          value: "2"
        },
        {
          label: "团员拼团成功页",
          value: "3"
        },
        {
          label: "团员拼团失败页",
          value: "4"
        },
        {
          label: "团长拼团成功页",
          value: "5"
        },
        {
          label: "团长拼团失败页",
          value: "6"
        },
        {
          label: "领优惠领券成功页",
          value: "7"
        }
      ],
      secondSiteList: [],
      shoplist: [],
      couponModalShow: false
    };
  },
  methods: {
    loadForm: function(id) {
      this.handleReset('form');
      this.form = {
        id: null,
        couponId: "",
        couponName: "",
        backCode: "",
        firstSite: "",
        secondSite: "",
        num: "",
        discounts: "",
        startDate:"1212",
        endDate:"2121",
        shops: [
          {
            provinceId: "",
            cityId: "",
            areaId: 1,
            shopCode: null,
            shopName: null,
            index: 0,
            status: 1
          },
          {
            provinceId: "",
            cityId: "",
            areaId: 2,
            shopCode: null,
            shopName: null,
            index: 0,
            status: 1
          }
        ]
      };
     
       getRequest("/couponrecommend/barcodeRelation/list/"+id).then(res => {
          if (res.code == 200) {
              var backcode = [];  
              res.data.forEach(v=>{  
                   backcode.push(v.barcode) ;
              });
                this.form.backCode = backcode.toString().replace(/[,]/g,"\r\n");
            } else {
              this.$Message.error(res.msg);
            }
        });
        var param = {}
        param.id = id;
        postRequest("/couponrecommend/shopRelation/listShop",param).then(res => {
          if (res.code == 200) {
                
                //this.form.backCode = backcode.toString().replace(/[,]/g,"\r\n");
            } else {
              this.$Message.error(res.msg);
            }
       });
      postRequest("/couponrecommend/selectById?id="+id).then(res => {
            if (res.code == 200) {
              var info =  res.data;
              this.form.id = id;
              this.form.couponId = info.campId;
              this.form.couponName = info.campName;
              this.form.firstSite = info.distributeChannel + "";
              this.form.secondSite = info.distributeLocation + "";
              this.form.num = info.distributeCount;
              this.form.showNum = info.exposureCount;
              this.form.discounts = info.promotion;
              this.form.startDate = info.distributeStartDate;
              this.form.endDate = info.distributeEndDate;
            } else {
              this.$Message.error(res.msg);
            }
          });
      
    },
    handleSubmit: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var param = {};
          param.id = this.form.id;
          param.campId = this.form.couponId;
          param.barcodeString = this.getSplitString(this.form.backCode);
          param.distributeChannel = this.form.firstSite;
          param.distributeLocation = this.form.secondSite;
          param.exposureCount = this.form.num;
          param.distributeCount = this.form.showNum;
          param.promotion = this.form.discounts;
          param.distributeStartDate = this.form.startDate;
          param.distributeEndDate = this.form.endDate;
          var shops = this.form.shops.filter(function(element, index, array) {
            return element.status == 1;
          });
          param.shopVOList = shops.map(s => {
            var shop = {};
            shop.province = s.provinceId;
            shop.city = s.cityId;
            shop.district = s.areaId;
            shop.shopCode = s.shopCode;
            shop.shopName = s.shopName;
            return shop;
          });
        
          if(this.form.id !== null && this.form.id!== undefined && this.form.id!==""){
            console.log("-------------edit------------")
             postRequest("/couponrecommend/edit", param).then(res => {
            if (res.code == 200) {
              this.$emit("closeFormModal-event");
            } else {
              this.$Message.error(res.msg);
            }
          });

          return;
          }
          postRequest("/couponrecommend/add", param).then(res => {
            console.log("-------------add------------")
            if (res.code == 200) {
              this.$emit("closeFormModal-event");
            } else {
              this.$Message.error(res.msg);
            }
          });

         
        } else {
          //this.$Message.error("Fail!");
        }
      });
    },
    handleReset: function(name) {
      this.$refs[name].resetFields();
      this.form.startDate = null;
      this.form.endDate = null;

      /*  : {
        id: null,
        couponId: null,
        couponName: null,
        backCode: null,
        firstSite: null,
        secondSite: null,
        num: null,
        showNum: null,
        discounts: null,
        startDate: null,
        endDate: null,
        shops: [
          {
            provinceId: null,
            cityId: null,
            areaId: null,
            shopCode: null,
            shopName: null,
            index: 0,
            status: 1
          }
        ]
      }, */
    },
    handleChoose: function() {
      this.couponModalShow = true;
    },
    handleAdd: function() {
      this.index++;
      this.form.shops.push({
        provinceId: null,
        cityId: null,
        areaId: null,
        shopCode: null,
        shopName: null,
        index: this.index,
        status: 1
      });
    },
    handleRemove: function(index) {
      if (index == 0) {
        this.msgErr("必须保留一条");
        return;
      }
      this.form.shops[index].status = 0;
    },
    firstSiteChange: function() {
      this.secondSiteList = [
        {
          label: "0号位",
          value: "0"
        },
        {
          label: "1号位",
          value: "1"
        },
        {
          label: "2号位",
          value: "2"
        },
        {
          label: "3号位",
          value: "3"
        }
      ];
      if (this.form.firstSite != "1") {
        this.secondSiteList.splice(0, 1);
      }
    },
    selectedTrCallBack: function(couponId, couponName) {
      this.form.couponId = couponId;
      this.form.couponName = couponName;
      this.couponModalShow = false;
    },
    sendProvinceId: function(val, index) {
      this.form.shops[index].provinceId = val;
    },
    sendCityId: function(val, index) {
      this.form.shops[index].cityId = val;
    },
    sendAreaId: function(val, index) {
      this.form.shops[index].areaId = val;
    },
    sendShopCode: function(val, name, index) {
      this.form.shops[index].shopCode = val;
      this.form.shops[index].shopName = name;
    },
    datetimechange: function(e) {
      this.form.startDate = e[0];
      this.form.endDate = e[1];
      console.log(this.form);
    },
    modalClose: function() {
      console.log(111);
      this.form.shops = [];
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3
      });
    },
    init: function() {},
    getSplitString: function(str) {
      if (!str || str.length == 0) {
        return "";
      }
      var arr = str.split(",");
      var resources = "";
      for (var i = 0; i < arr.length; i++) {
        var arr1 = arr[i].split(/\s+/);

        for (var j = 0; j < arr1.length; j++) {
          var temp = arr1[j].replace(/^\s+|\s+$/g, "");
          if (temp != "") {
            resources += temp + ",";
          }
        }
      }
      return resources;
    }
  },
  mounted: function() {
    this.init();
  }
};
</script>


