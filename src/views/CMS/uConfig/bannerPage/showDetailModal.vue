<template>
  <!--新增/编辑弹窗-->
  <!--<Modal width="800"-->
  <!--v-model="viewDialogVisible"-->
  <!--:title="titleName"-->
  <!--:closable="false"-->
  <!--:mask-closable="false"-->
  <!--footer-hide>-->
  <div v-if="viewDialogVisible" class="modal" @click.stop>
    <Card>
      <p slot="title">查看详情</p>
      <a href="#" slot="extra">
        <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
      </a>
      <Form
              :model="modal"
              ref="addOrEditModal"
              :rules="ruleValidate"
              :label-width="80"
              label-position="left"
      >
        <Row class="padding-left-12">
          <Col span="18">
          <FormItem label="标题">
            <span>{{modal.title}}</span>
          </FormItem>
          </Col>
        </Row>
        <Row class="padding-left-12">
          <Col span="18">
          <FormItem label="内容类型">
            <Select v-model="modal.type" style="width:30%" @on-change="changeType" disabled>
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}
              </Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row class="padding-left-12" v-if="modal.type==3||modal.type==4">
          <Col span="18">
          <FormItem label="链接">
            <span>{{modal.value}}</span>
          </FormItem>
          </Col>
        </Row>
        <Row class="padding-left-12" v-if="modal.type==1||modal.type==5||modal.type==6">
          <Col span="18">
          <FormItem label="内容选择">
            <Button type="dashed">
              <span v-if="modal.content"> {{modal.content}}</span>
            </Button>
          </FormItem>
          </Col>
        </Row>
        <Row class="padding-left-12" v-if="modal.type==2">
          <Col span="18">
          <FormItem label="内容选择：">
            <RadioGroup v-model="choujiangType">
              <Radio :label="'抽奖团'">抽奖团</Radio>
              <Radio :label="'抽奖广场'">抽奖广场</Radio>
            </RadioGroup>
            <div>
              <Button type="dashed" v-if="choujiangType=='抽奖团'">
                <span v-if="modal.content"> {{modal.content}}</span>
              </Button>
            </div>
          </FormItem>
          </Col>
        </Row>
        <h3>banner位设置</h3>
        <div style="padding: 20px;border: 1px solid #999;">
          <Row class="padding-left-12">
            <Col span="18">
            <!-- 门店类型： storeType 0 全国 1门店 -->
            <FormItem label="投放门店：">
              <RadioGroup v-model="modal.shopId">
                <Radio
                        v-for="item in storeTypeList"
                        :key="item.value"
                        :label="item.value"
                        disabled
                >{{ item.label }}</Radio>
              </RadioGroup>
            </FormItem>
            <template v-if="modal.shopId==1">
              <FormItem>
                <div v-for="(item,index) in modal.shopRequestList">
                  {{item.province}}/{{item.city}}/{{item.address}}  {{item.shopName}}
                </div>
              </FormItem>
            </template>
            </Col>
          </Row>
          <Row class="padding-left-12">
            <Col span="10">
            <FormItem label="投放位置">
              <Cascader :data="cascaderData" v-model="cascaderValue" disabled></Cascader>
            </FormItem>
            </Col>
          </Row>
          <Row class="padding-left-12">
            <Col span="18">
            <FormItem label="终端选择">
              <Select v-model="modal.clientType" style="width:30%" disabled>
                <Option v-for="item in clientTypeList" :value="item.value" :key="item.value" disabled>{{
                  item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row class="padding-left-12">
            <Col span="18">
            <FormItem label="选择时间">
              <DatePicker
                      disabled
                      :value="modal.startTime"
                      type="datetime"
                      placeholder
                      style="width: 30%"
                      :options="options1"
                      @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
              ></DatePicker>
              <div style="width: 2%;display: inline-block"></div>
              <DatePicker
                      disabled
                      :value="modal.endTime"
                      type="datetime"
                      placeholder
                      style="width: 30%"
                      :options="options2"
                      @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
              ></DatePicker>
            </FormItem>
            </Col>
          </Row>
          <Row class="padding-left-12">
            <Col span="18">
            <FormItem label="banner图片">
              <div class="demo-upload-list"  v-if="modal.image">
                <img :src="modal.image">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
                </div>
              </div>
              <Modal title="View Image" v-model="visible">
                <img :src="modal.image" v-if="visible"
                     style="width: 100%">
              </Modal>
            </FormItem>
            </Col>
          </Row>
        </div>
        <FormItem>
          <Button style="margin:20px" @click="close">返回</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
    import { uploadOperationImage2AliOssURl } from "@/api/index";
    import {postRequest, getRequest, getSyncRequest} from "@/libs/axios";
    export default {
        name: "add-or-edit-modal",
        props: {
            viewDialogVisible: {type: Boolean, default: false}
        },
        data() {
            return {
                choujiangType:'',
                userToken:'',
                url: uploadOperationImage2AliOssURl,
                drawDailyShopList:[
                    {provinceCode: null,
                        cityCode: null,
                        countryCode: null,
                        shopId: null,
                        shopName: null,
                        id: Math.random(),
                        status: 1}
                ],
                cascaderValue:[],
                cascaderData:[],
                contentObj:{},
                uploadList: [{}],
                defaultList: [],
                visible: false,
                storeTypeList: [{ value: '0', label: "全国" }, { value: '1', label: "门店" }],
                typeList: [{value: 1, label: '专题活动'}, {value: 2, label: '抽奖团'}, {value: 3, label: '内链'}, {value: 4, label: '外链'}, {value: 5, label: '商户'}, {value: 6, label: '优惠券'}],
                locationList: [{value: 1, label: '首页'}, {value: 2, label: '赚钱'}, {value: 3, label: '领优惠'}, {value: 4, label: '我的'}, {value: 5, label: '平台分红'}],
                businessLayerList: [{value: 1, label: '1号位置'}, {value: 2, label: '2号位置'}, {value: 3, label: '3号位置'}],
                layerPriorityList: [{value: 1, label: 'banner1'}, {value: 2, label: 'banner2'}, {value: 3, label: 'banner3'}, {value: 4, label: 'banner4'}, {value: 5, label: 'banner5'}],
                clientTypeList: [{value: '0', label: '全部'}, {value: '1', label: '小程序'}, {value: '2', label: 'android'}, {value: '3', label: 'ios'}],
                titleName: "",
                volumeViewDialogModal: false,
                contentViewDialogModal: false,
                drawViewDialogModal: false,
                shopViewDialogModal: false,
                modal: {
                    shopId:'',
                    title: "",
                    type: "",
                    value: '',
                    content:'',
                    shopRequestList: [],
                    location: '',
                    businessLayer: '',
                    layerPriority: '',
                    clientType: '',
                    startTime: "",
                    endTime: "",
                    image: '',
                },
                options1: {
                    disabledDate(date) {
                        return date.valueOf() < Date.now() - 1000 * 60 * 60 * 24;
                    }
                },
                options2: {
                    disabledDate(date) {
                        return date.valueOf() < Date.now() - 1000 * 60 * 60 * 24;
                    }
                },
                ruleValidate: {}
            };
        }, methods: {
            sendProvinceId(val, id) {
                this.drawDailyShopList.some((item, index) => {
                    if (item.id == id) {
                        this.drawDailyShopList[index].provinceCode = val;
                        return true;
                    }
                });
            },
            sendCityId(val, id) {
                this.drawDailyShopList.some((item, index) => {
                    if (item.id == id) {
                        this.drawDailyShopList[index].cityCode = val;
                        return true;
                    }
                });
            },
            sendAreaId(val, id) {
                this.drawDailyShopList.some((item, index) => {
                    if (item.id == id) {
                        this.drawDailyShopList[index].countryCode = val;
                        return true;
                    }
                });
            },
            sendShopId(val, name, id) {
                this.drawDailyShopList.some((item, index) => {
                    if (item.id == id) {
                        this.drawDailyShopList[index].shopId = val;
                        this.drawDailyShopList[index].shopName = name;
                        return true;
                    }
                });
            },
            shopRemove(id) {
                if (this.drawDailyShopList.length == 1) {
                    return this.msgErr("必须保留一条");
                }
                this.drawDailyShopList.some((item, index) => {
                    if (item.id == id) {
                        this.drawDailyShopList.splice(index, 1);
                        return true;
                    }
                });
            },
            handleAdd() {
                this.drawDailyShopList.push({
                    provinceCode: null,
                    cityCode: null,
                    countryCode: null,
                    shopId: null,
                    shopName: null,
                    id: Math.random(),
                    status: 1
                });
            },
            handleView(item) {
                this.visible = true;
            },
            handleSuccess(res, file) {
                console.log(res);
                if(res.code==200){
                    this.modal.image = res.image_url;
                }else{
                    this.$Message.error('上传失败')
                }
                // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit', desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload() {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            },
            changeType(){
                this.modal.value = '';
                this.modal.content = '';
            },
            getLocation(){
                postRequest(`/banner/getLocations`, null).then(res => {
                    console.log(123);
                    if (res.code == "200") {
                        this.cascaderData = res.data;
                    }else {
                        this.$Message.error(res.msg);
                    }
                });
            },
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.modal.startTime = datetime;
                    this.options2 = {
                        disabledDate(date) {
                            return date.valueOf() < new Date(datetime) - 1000 * 60 * 60 * 24;
                        }
                    };
                    break;
                case 2:
                    this.modal.endTime = datetime;
                    this.options1 = {
                        disabledDate(date) {
                            return (date.valueOf() < Date.now() - 1000 * 60 * 60 * 24 || date.valueOf() > new Date(datetime));
                        }
                    };
                    break;
                }
            },
            resetRow(row) {
                this.getData(row.id);
                this.getLocation();
                this.choujiangType = '';
                this.modal={
                    shopId:'',
                    title: "",
                    type: "",
                    value: '',
                    content:'',
                    shopRequestList: [],
                    location: '',
                    businessLayer: '',
                    layerPriority: '',
                    clientType: '',
                    startTime: "",
                    endTime: "",
                    image: '',
                },
                    this.options2 = {
                        disabledDate(date) {
                            return date.valueOf() < Date.now() - 1000 * 60 * 60 * 24;
                        }
                    };
                this.options1 = {
                    disabledDate(date) {
                        return date.valueOf() < Date.now() - 1000 * 60 * 60 * 24;
                    }
                };
            },
            getData(id){
                console.log(111);
                getRequest(`/banner/details/${id}`).then(res => {
                    if (res.code == "200") {
                        this.modal.title = res.data.bannerInfo.title;
                        this.modal.type = res.data.bannerInfo.type;
                        this.modal.image = res.data.bannerInfo.image;
                        this.modal.value = res.data.bannerInfo.value;
                        this.modal.content = res.data.bannerInfo.content;
                        this.modal.startTime = res.data.bannerInfo.startTime;
                        this.modal.endTime = res.data.bannerInfo.endTime;
                        this.modal.clientType = res.data.clients[0].toString();
                        if(!this.modal.value&&this.modal.type=='2'){
                            this.choujiangType = '抽奖广场';
                        }else{
                            this.choujiangType = '抽奖团';
                        }
                        if(res.data.allShop){
                            this.modal.shopId = '0'
                            this.modal.shopRequestList = [];
                        }else{
                            this.modal.shopId = '1'
                            this.modal.shopRequestList = res.data.shops;
                        }
                        this.cascaderValue =[res.data.location[0].location.toString(),res.data.location[0].businessLayer.toString(), res.data.location[0].layerPriority.toString() ]
                    }else {
                        this.$Message.error(res.msg);
                    }
                });
            },
            close() {
                this.$emit("setViewDialogVisible", false);
            }
        },
        created() {
            this.userToken = {
                jwttoken: localStorage.getItem("jwttoken")
            };
        }
    };
</script>

<style scoped>
  .modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background: #fff;
    padding: 10px;
    z-index: 1;
  }

  h3 {
    border-left: 3px solid #333;
    padding-left: 10px;
    margin: 15px 0;
  }

  .padding-left-12 {
    padding-left: 12px;
  }

  .colof-a2 {
    color: #a2a2a2;
  }

  .ivu-radio-group-vertical .ivu-radio-wrapper {
    height: auto;
  }


  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
