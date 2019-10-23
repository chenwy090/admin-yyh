<template>
  <div>
    <Form ref="form" :rules="formValite" :label-width="120">
      <Row>
        <Col span="8">
          <FormItem label="选择优惠券">
            <Input v-model="formData[0].campName" placeholder="点击按钮选择优惠券" disabled>
              <Button @click="handleChoose()" slot="append">选择</Button>
            </Input>
          </FormItem>
        </Col>
      </Row>
      <div class="copy-item" v-for="(formItem,index) in formData" :key="index" >
        <Row>
          <FormItem label="BackCode集">
            <Col span="20">
            <!--<Input v-model="form.backCode" type="textarea" :rows="10" placeholder="BackCode集" />-->
            <Upload ref="upload"
                    :show-upload-list="false"
                    :default-file-list="formItem.barcodeFileIdArr"
                    :on-success="(value)=> handleSuccess1(value,index)"
                    multiple
                    :action="url1"
                    :headers="userToken"
                    style="display: inline-block;width:200px;">
              <Button icon="ios-cloud-upload-outline">立即导入</Button>
            </Upload>
            <Button v-if="formItem.id&&formItem.barcodeFileId" @click='downLog(1,index)'>导入记录</Button>
            <div>{{formItem.barcodeFileName}}</div>
            </Col>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="投放位置">
            <Row>
              <Col span="4">
              <FormItem>
                <Select v-model="formItem.distributeChannel" placeholder="选择渠道" @on-change="distributeChannelChange">
                  <Option
                          v-for="item in distributeChannelList"
                          :value="item.value"
                          :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
              </Col>

              <Col span="4">
              <FormItem>
                <Select v-model="formItem.distributeLocation" placeholder="选择位置">
                  <Option
                          v-for="item in distributeLocationList"
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
        <FormItem label="投放门店">
          <div>
            <Upload ref="upload"
                    :show-upload-list="false"
                    :default-file-list="formItem.shopFileIdArr"
                    :on-success="(value)=> handleSuccess2(value,index)"
                    multiple
                    :action="url2"
                    :headers="userToken"
                    style="display: inline-block;width:200px;">
              <Button icon="ios-cloud-upload-outline">立即导入</Button>
            </Upload>
            <Button v-if="formItem.id&&formItem.shopFileId" @click='downLog(2,index)'>导入记录</Button>
            <div>{{formItem.shopFileName}}</div>
            <!--<storeView-->
            <!--:index="i"-->
            <!--v-on:sendProvinceId="sendProvinceId"-->
            <!--v-on:sendCityId="sendCityId"-->
            <!--v-on:sendAreaId="sendAreaId"-->
            <!--v-on:sendShopCode="sendShopCode"-->
            <!--@handleRemove-event="handleRemove"-->
            <!--:shop="item"-->
            <!--&gt;</storeView>-->
          </div>
        </FormItem>
        <!--<FormItem label=" ">-->
        <!--<Button type="dashed" long @click="handleAdd" icon="md-add" style="width:100px;"></Button>-->
        <!--</FormItem>-->
        <FormItem label="曝光量">
          <Row>
            <Col span="4">
            <Input v-model="formItem.exposureCount" placeholder="曝光量" type="text">
            <span slot="append">次</span>
            </Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="投放量">
          <Row>
            <Col span="4">
            <Input v-model="formItem.distributeCount" placeholder="投放量" type="text">
            <span slot="append">张</span>
            </Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="优惠力度">
          <Row>
            <Col span="4">
            <Input v-model="formItem.promotion" placeholder="优惠力度" type="text">
            <span slot="append">%</span>
            </Input>
            </Col>
          </Row>
        </FormItem>
        <Row>
          <Col span="12">
          <FormItem label="时间">
            <DatePicker
                    :value="datetimerange"
                    type="datetimerange"
                    placement="bottom-end"
                    placeholder="请选择日期"
                    @on-change="(value)=> datetimechange(value,index)"
                    style="width:450px;"
                    class="date-range"
            ></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <FormItem v-if="!formData[0].id" label=" ">
          <Button type="primary" @click="copyAdd(index)">复制新建</Button>
          <Button v-if="formData.length>1" style="margin-left: 8px" @click="copyDel(index)">删除</Button>
        </FormItem>
      </div>

      <FormItem label=" ">
        <Button type="primary" :loading="isLoading" @click="handleSubmit('form')">提交</Button>
        <!--<Button style="margin-left: 8px" @click="handleReset('form')">重置</Button>-->
      </FormItem>
    </Form>
    <Modal v-model="couponModalShow" title="选择优惠券" width="800px" @footer-hide="false">
      <chooseCouponListView @seclectedTr-event="selectedTrCallBack"></chooseCouponListView>
    </Modal>
    <Modal v-model="downLogModal" title="导入记录" width="800px" @footer-hide="false">
      <Table
              border
              :columns="tableColumns"
              :data="logData"
              ref="table"
              :highlight-row="true"
      >
        <template slot-scope="{ row }" slot="down">
          <Button @click='downLoad(row)'>立即下载</Button>
        </template>
      </Table>
    </Modal>
  </div>
</template>
<script>
    import axios from 'axios';
    import { baseUrl } from "@/api/index";
import { postRequest,downloadSteam, getRequest} from "@/libs/axios";
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
        isLoading:false,
        tableColumns:[
            {
                title: "日期",
                align: "center",
                minWidth: 100,
                key: "createTime"
            },
            {
                title: "操作人",
                align: "center",
                minWidth: 100,
                key: "createBy"
            },
            {
                title: "文件",
                align: "center",
                minWidth: 100,
                slot: "down"
            },
        ],
        logData:[],
        downLogModal:false,
        defaultList1:[],
        defaultList2:[],
        userToken:'',
        url1: baseUrl+'/file/record/upload/barocde',
        url2: baseUrl+'/file/record/upload/shop',
      index: 0,
      showStore:false,
      datetimerange:[],
        formData:[
            {
                id: null,
                campId: null,
                campName: null,
                barcode: null,
                barcodeFileIdArr: [],
                barcodeFileId: null,
                barcodeFileName: null,
                distributeChannel: null,
                distributeLocation: null,
                distributeCount: null,
                exposureCount: null,
                promotion: null,
                distributeStartDate: null,
                distributeEndDate: null,
                shopVOList: null,
                shopFileIdArr:[],
                shopFileId:null,
                shopFileName:null,
            }
        ],
      formValite: {
      },
      distributeChannelList: [
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
      distributeLocationList: [],
      shoplist: [],
      couponModalShow: false
    };
  },
  methods: {
     loadForm: function(id) {
         this.formData=[
             {
                 id: null,
                 campId: null,
                 campName: null,
                 barcode: null,
                 barcodeFileIdArr: [],
                 barcodeFileId: null,
                 barcodeFileName: null,
                 distributeChannel: null,
                 distributeLocation: null,
                 distributeCount: null,
                 exposureCount: null,
                 promotion: null,
                 distributeStartDate: null,
                 distributeEndDate: null,
                 shopVOList: null,
                 shopFileIdArr:[],
                 shopFileId:null,
                 shopFileName:null,
             }
         ];
         this.isLoading=false;
          this.showStore = true;
          if(id===null || id === undefined || id === ''){
             return;
          }
          this.formData[0].shops = []
          postRequest("/couponrecommend/selectById?id="+id).then(res =>{
             if (res.code == 200) {
              var info =  res.data;
              this.formData[0].id = id;
              this.formData[0].campId = info.campId;
              this.formData[0].campName = info.campName;
              this.formData[0].barcodeFileId = info.barcodeFileId;
              this.formData[0].barcodeFileName = info.barcodeFileName;
              this.formData[0].shopFileId = info.shopFileId;
              this.formData[0].shopFileName = info.shopFileName;
              this.formData[0].createTime = info.createTime;
              this.formData[0].createBy = info.createBy;
              this.formData[0].distributeChannel = info.distributeChannel + "";
              this.distributeChannelChange();
              this.formData[0].distributeLocation = info.distributeLocation + "";
               if (this.formData[0].distributeChannel !== "1" && undefined !== this.formData[0].distributeChannel) {
                 this.distributeLocationList.splice(0, 1);
               }
              this.formData[0].distributeCount = info.distributeCount;
              this.formData[0].exposureCount = info.exposureCount;
              this.formData[0].promotion = info.promotion;
              this.formData[0].distributeStartDate = info.distributeStartDate;
              this.formData[0].distributeEndDate = info.distributeEndDate;
              this.datetimerange.push(this.formData[0].distributeStartDate);
              this.datetimerange.push(this.formData[0].distributeEndDate);
            } else {
              this.$Message.error(res.msg);
            }
          });
        getRequest("/couponrecommend/barcodeRelation/list/"+id).then(res => {
                    if (res.code == 200) {
                        var backcode = [];
                        res.data.forEach(v=>{
                            backcode.push(v.barcode) ;
                        });
                          this.formData[0].barcode = backcode.toString().replace(/[,]/g,"\r\n");
                      } else {
                        this.$Message.error(res.msg);
                      }
                  });
           var param = {}
           param.id = id;
        postRequest("/couponrecommend/shopRelation/listCodeShop",param).then(res => {
          if (res.code == 200) {
              var shops = [];
              var inx = 0;
                this.formData[0].shopVOList = []
               res.data.forEach(v=>{

                   var shop = {};
                    shop.provinceId = v.province;
                    shop.cityId = v.city;
                    shop.areaId = v.district;
                    shop.shopCode = v.shopCode;
                    shop.shopName = v.shopName;
                    shop.index = inx;
                    shop.status = 1;
                    this.formData[0].shopVOList.push(shop) ;
                    inx ++;
              });
            } else {
              this.$Message.error(res.msg);
            }
          });

    },
    handleSubmit: function(name) {
         this.isLoading=true;
         var that = this;
         var isOk = true;
         for(var a=0;a<this.formData.length;a++){
             if(!that.formData[0].campName||!that.formData[0].campId){
                 this.$Message.error('请选择优惠券');
                 isOk = false;
                 break;
             }
             if(!that.formData[a].barcode&&(!that.formData[a].barcodeFileName||!that.formData[a].barcodeFileId)){
                 this.$Message.error('请上传BackCode集');
                 isOk = false;
                 break;
             }
             if(!that.formData[a].distributeChannel){
                 this.$Message.error('请选择渠道');
                 isOk = false;
                 break;
             }
             if(!that.formData[a].distributeLocation){
                 this.$Message.error('请选择位置');
                 isOk = false;
                 break;
             }
             if(!that.formData[a].shopVOList&&!that.formData[a].shopFileId){
                 this.$Message.error('请上传投放门店');
                 isOk = false;
                 break;
             }
             if(!that.formData[a].exposureCount){
                 this.$Message.error('请填写曝光量');
                 isOk = false;
                 break;
             }
             if(!that.formData[a].distributeCount){
                 this.$Message.error('请填写投放量');
                 isOk = false;
                 break;
             }
             if(!that.formData[a].promotion){
                 this.$Message.error('请填写优惠力度');
                 isOk = false;
                 break;
             }
             if(!that.formData[a].distributeStartDate||!that.formData[a].distributeEndDate){
                 this.$Message.error('请选择时间');
                 isOk = false;
                 break;
             }
        }
        if(!isOk){
            return;
        }
        if(this.formData[0].id !== null && this.formData[0].id!== undefined && this.formData[0].id!==""){
            console.log("-------------edit------------")
            postRequest("/couponrecommend/edit", this.formData[0]).then(res => {
                this.isLoading=false;
                if (res.code == 200) {
                    this.$emit("closeFormModal-event");
                } else {
                    this.$Message.error(res.msg);
                }
            });
            this.isLoading = false;
            return;
        }else{
            let resList = []
            for(var a=0;a<this.formData.length;a++) {
                let req = postRequest("/couponrecommend/add", this.formData[a]);
                resList.push(req);
            }
            axios.all(resList).then(res => {
                var errMsg = '';
                res.forEach(function(v){
                    if (v.code == 200) {
                    } else {
                        errMsg = v.msg;
                    }
                })
                if(!errMsg){
                    this.$emit("closeFormModal-event");
                }else{
                    this.$Message.error(errMsg);
                }
                this.isLoading = false;
                return;
            });
            // postRequest("/couponrecommend/edit", this.formData[0]).then(res => {
            //     console.log("-------------add------------")
            //     if (res.code == 200) {
            //         this.$emit("closeFormModal-event");
            //     } else {
            //         this.$Message.error(res.msg);
            //     }
            // });
        }
    },
    handleReset: function(name) {
      this.$refs[name].resetFields();
      this.formData[0].distributeStartDate = null;
    },
    handleChoose: function() {
      this.couponModalShow = true;
    },
    handleAdd: function() {
        this.index++;
      this.formData[0].shops.push({
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
      this.formData[0].shops[index].status = 0;
    },
    distributeChannelChange: function() {
      this.distributeLocationList = [
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
      if (this.formData[0].distributeChannel != "1") {
        this.distributeLocationList.splice(0, 1);
      }
    },
    selectedTrCallBack: function(campId, campName) {
      this.formData[0].campId = campId;
      this.formData[0].campName = campName;
      this.couponModalShow = false;
    },
    sendProvinceId: function(val, index) {
      this.formData[0].shops[index].provinceId = val;
    },
    sendCityId: function(val, index) {
      this.formData[0].shops[index].cityId = val;
    },
    sendAreaId: function(val, index) {
      this.formData[0].shops[index].areaId = val;
    },
    sendShopCode: function(val, name, index) {
      this.formData[0].shops[index].shopCode = val;
      this.formData[0].shops[index].shopName = name;
    },
    datetimechange: function(e,index) {
      this.formData[index].distributeStartDate = e[0];
      this.formData[index].distributeEndDate = e[1];
    },
    modalClose: function() {
      this.showStore = false;
      this.datetimerange = [];
      this.formData[0].shops = null;
      this.formData[0].id = null;
      this.formData[0]= {
        id: null,
        campId: null,
        campName: null,
        barcode: null,
        distributeChannel: null,
        distributeLocation: null,
        distributeCount: null,
        exposureCount: null,
        promotion: null,
          createBy: null,
          createTime: null,
        distributeStartDate: null,
        distributeEndDate: null,
          barcodeFileName: null,
          barcodeFileId: null,
          shopFileName: null,
          shopFileId: null,
          shopVOList:null,
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
      }
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
    },
      handleSuccess1(res, index) {
          console.log(res);
          if(res.code==200){
              this.formData[index].barcodeFileId = res.fileId;
              this.formData[index].barcodeFileName = res.fileName;
          }else{
              this.$Message.error('上传失败')
          }
      },
      handleSuccess2(res, index) {
          console.log(res);
          if(res.code==200){
              this.formData[index].shopFileId = res.fileId;
              this.formData[index].shopFileName = res.fileName;
          }else{
              this.$Message.error('上传失败')
          }
      },
      downLoad(item){
         var url;
         if(item.type==1){
             url = '/file/record/download/barcode?fileId='+item.id;
         }else{
             url = '/file/record/download/shop?fileId='+item.id;
         }
          downloadSteam(url,null).then(res => {
              const content = res.data;
              const { filename } = res.headers;

              const blob = new Blob([content], { type: "application/vnd.ms-excel" });
              const oA = document.createElement("a");
              if ("download" in oA) {
                  // 非IE下载
                  oA.download = decodeURI(filename);
                  oA.style.display = "none";
                  oA.href = URL.createObjectURL(blob);
                  document.body.appendChild(oA);
                  oA.click();
                  URL.revokeObjectURL(oA.href); // 释放URL 对象
                  document.body.removeChild(oA);
              } else {
                  // IE10+下载
                  navigator.msSaveBlob(blob, filename);
              }
          });
      },
      copyAdd(index){
         this.formData.push(JSON.parse(JSON.stringify(this.formData[index])));
      },
      copyDel(index){
          this.formData.splice(index,1);
      },
      downLog(type,index){
          this.downLogModal = true;
          // /couponrecommend/selectById
          if(type==1){
              this.logData = [{
                  type:type,
                  id:this.formData[index].barcodeFileId,
                  createTime:this.formData[index].createTime,
                  createBy:this.formData[index].createBy,
              }]
          }else{
              this.logData = [{
                  type:type,
                  id:this.formData[index].shopFileId,
                  createTime:this.formData[index].createTime,
                  createBy:this.formData[index].createBy,
              }]
          }
      }
  },
  mounted: function() {
    this.init();
  },
    created() {
        this.userToken = {
            jwttoken: localStorage.getItem("jwttoken")
        };
    }
};
</script>
<style scoped>
  .copy-item{
    margin: 10px;
    border: 1px solid #f4f4f4;
    padding:20px 10px;
  }
</style>


