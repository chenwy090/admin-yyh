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
            <p slot="title">新增</p>
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
                        <Input
                                type="text"
                                v-model="modal.title"
                                placeholder="请填写标题"
                                style="width: 30%"
                        ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="内容类型">
                        <Select v-model="modal.type" style="width:30%" @on-change="changeType">
                            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12" v-if="modal.type==3||modal.type==4">
                    <Col span="18">
                    <FormItem label="链接">
                        <Input
                                type="text"
                                v-model="modal.value"
                                placeholder="请输入链接"
                                style="width: 100%"
                        ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12" v-if="modal.type==1||modal.type==5||modal.type==6">
                    <Col span="18">
                    <FormItem label="内容选择">
                        <Button type="dashed" @click="openContent">
                            <span v-if="!modal.content">请选择</span>
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
                            <Button type="dashed" @click="openContent" v-if="choujiangType=='抽奖团'">
                                <span v-if="!modal.content">请选择</span>
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
                                >{{ item.label }}</Radio>
                            </RadioGroup>
                        </FormItem>
                        <template v-if="modal.shopId==1">
                            <FormItem>
                                <template v-for="(item,index) in drawDailyShopList">
                                    <storeView
                                            :key="index"
                                            :id="item.id"
                                            v-on:sendProvinceId="sendProvinceId"
                                            v-on:sendCityId="sendCityId"
                                            v-on:sendAreaId="sendAreaId"
                                            v-on:sendShopId="sendShopId"
                                            @handleRemove-event="shopRemove"
                                            :shop="item"
                                    ></storeView>
                                </template>
                            </FormItem>
                            <FormItem label>
                                <Button type="dashed" long @click="handleAdd" icon="md-add" style="width:100px;"></Button>
                            </FormItem>
                        </template>
                        </Col>
                    </Row>
                    <Row class="padding-left-12">
                        <Col span="10">
                        <FormItem label="投放位置">
                            <template>
                                <Cascader id="1" :data="cascaderData" v-model="cascaderValue" filterable></Cascader>
                            </template>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="padding-left-12">
                        <Col span="18">
                        <FormItem label="终端选择">
                            <Select v-model="modal.clientType" style="width:30%">
                                <Option v-for="item in clientTypeList" :value="item.value" :key="item.value">{{item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="padding-left-12">
                        <Col span="18">
                        <FormItem label="选择时间">
                            <DatePicker
                                    :value="modal.startTime"
                                    type="date"
                                    placeholder
                                    style="width: 20%"
                                    :options="options1"
                                    @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                            ></DatePicker>
                            <div style="width: 2%;display: inline-block"></div>
                            <DatePicker
                                    :value="modal.endTime"
                                    type="date"
                                    placeholder
                                    style="width: 20%"
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
                                    <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
                                </div>
                            </div>
                            <Upload v-if="!modal.image"
                                    ref="upload"
                                    :show-upload-list="false"
                                    :default-file-list="defaultList"
                                    :on-success="handleSuccess"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    :before-upload="handleBeforeUpload"
                                    multiple
                                    type="drag"
                                    :action="url"
                                    :headers="userToken"
                                    style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <Modal title="View Image" v-model="visible">
                                <img :src="modal.image" v-if="visible"
                                     style="width: 100%">
                            </Modal>
                        </FormItem>
                        </Col>
                    </Row>
                </div>
                <FormItem>
                    <Button style="margin:20px" type="primary" size="large" @click="ok()">保存</Button>
                    <Button style="margin:20px" @click="close">返回</Button>
                </FormItem>
            </Form>
        </Card>
        <!--</Modal>-->
        <volumeModal
                ref="volumeModal"
                :viewDialogVisible="volumeViewDialogModal"
                @setViewDialogVisible="selectContent"
        ></volumeModal>
        <contentModal
                ref="contentModal"
                :viewDialogVisible="contentViewDialogModal"
                @setViewDialogVisible="selectContent"
        ></contentModal>
        <drawModal
                ref="drawModal"
                :viewDialogVisible="drawViewDialogModal"
                @setViewDialogVisible="selectContent"
        ></drawModal>
        <shopModal
                ref="shopModal"
                :viewDialogVisible="shopViewDialogModal"
                @setViewDialogVisible="selectContent"
        ></shopModal>
    </div>
</template>

<script>
    import { uploadOperationImage2AliOssURl } from "@/api/index";
    import {postRequest, getRequest, getSyncRequest} from "@/libs/axios";
    import volumeModal from "./volumeModal";
    import contentModal from "./contentModal";
    import drawModal from "./drawModal";
    import shopModal from "./shopModal";
    import storeView from "./store";

    export default {
        name: "add-or-edit-modal",
        components: {volumeModal, contentModal, drawModal,shopModal,storeView},
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
                contentObj:{},
                uploadList: [{}],
                defaultList: [],
                visible: false,
                storeTypeList: [{ value: '0', label: "全国" }, { value: '1', label: "门店" }],
                typeList: [{value: 1, label: '专题活动'}, {value: 2, label: '抽奖团'}, {value: 3, label: '内链'}, {value: 4, label: '外链'}, {value: 5, label: '商户'}, {value: 6, label: '优惠券'}],
                clientTypeList: [{value: '0', label: '全部'}, {value: '1', label: '小程序'}, {value: '2', label: 'android'}, {value: 3, label: 'ios'}],
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
                    couponType:'',
                    shopRequestList: [],
                    location: '',
                    businessLayer: '',
                    layerPriority: '',
                    clientType: '',
                    startTime: "",
                    endTime: "",
                    image: '',
                },
                cascaderData: [],
                cascaderValue:[],
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
            handleRemove(file) {
                this.modal.image = '';
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
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.modal.startTime = datetime+ ' 00:00:00';
                    this.options2 = {
                        disabledDate(date) {
                            return date.valueOf() < new Date(datetime) - 1000 * 60 * 60 * 24;
                        }
                    };
                    break;
                case 2:
                    this.modal.endTime = datetime+ ' 23:59:59';
                    this.options1 = {
                        disabledDate(date) {
                            return (date.valueOf() < Date.now() - 1000 * 60 * 60 * 24 || date.valueOf() > new Date(datetime));
                        }
                    };
                    break;
                }
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
            resetRow(row) {
                this.getLocation();
                this.choujiangType = '';
                this.cascaderValue = [];
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
            openContent() {
                // this.contentViewDialogModal = true;
                switch (this.modal.type) {
                case 1:
                    this.contentViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["contentModal"].resetRow({content:this.modal.content,value:this.modal.value});
                    });
                    break;
                case 2:
                    this.drawViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["drawModal"].resetRow({content:this.modal.content,value:this.modal.value});
                    });
                    break;
                case 5:
                    this.shopViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["shopModal"].resetRow({content:this.modal.content,value:this.modal.value});
                    });
                    break;
                case 6:
                    this.volumeViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["volumeModal"].resetRow({content:this.modal.content,value:this.modal.value});
                    });
                    break;
                }
            },
            selectContent(e) {
                this.contentViewDialogModal = false;
                this.drawViewDialogModal = false;
                this.shopViewDialogModal = false;
                this.volumeViewDialogModal = false;
                if (e) {
                    this.modal.value = e.shopId;
                    this.modal.content = e.shopName;
                    this.modal.couponType = e.couponType;
                }
            },
            changeRadio() {
                if (this.modal.wardType == '1') {
                    this.JawardRuleDtos = [{
                        verifyCountMin: null,
                        verifyCountMax: null,
                        awardAmount: null,
                        awardType: '2',
                        couponType: '',
                        awardName: ''
                    }];
                    this.UawardRuleDtos = [{
                        verifyCountMin: null,
                        verifyCountMax: null,
                        awardAmount: null,
                        awardType: '1',
                        couponType: '',
                        awardName: ''
                    }];
                } else {
                    this.UawardRuleDtos = [{
                        verifyCountMin: null,
                        verifyCountMax: null,
                        awardAmount: null,
                        awardType: '1',
                        couponType: '',
                        awardName: ''
                    }];
                    this.JawardRuleDtos = [{
                        verifyCountMin: null,
                        verifyCountMax: null,
                        awardAmount: null,
                        awardType: '1',
                        couponType: '',
                        awardName: ''
                    }];
                }
            },
            ok() {
                this.modal.location = this.cascaderValue[0];
                this.modal.businessLayer = this.cascaderValue[1];
                this.modal.layerPriority = this.cascaderValue[2];
                if(!this.modal.title){
                    this.$Message.error('请填写标题');
                    return;
                }
                if(!this.modal.type){
                    this.$Message.error('请选择内容类型');
                    return;
                }
                if(this.modal.type ==2 && this.choujiangType == '抽奖广场'){
                    this.modal.value = '0';
                    this.modal.content = '0';
                }
                if(this.modal.type==3||this.modal.type==4){
                    this.modal.content = this.modal.value;
                }
                if(!this.modal.value||!this.modal.content){
                    this.$Message.error('请选择内容或链接');
                    return;
                }
                if(!this.modal.shopId&&this.modal.shopId!==0){
                    this.$Message.error('请选择投放门店');
                    return;
                }
                if(!this.modal.location){
                    this.$Message.error('请选择投放位置');
                    return;
                }
                if(!this.modal.businessLayer){
                    this.$Message.error('请选择运营位置');
                    return;
                }
                if(!this.modal.layerPriority){
                    this.$Message.error('请选择运营位');
                    return;
                }
                if(!this.modal.clientType){
                    this.$Message.error('请选择终端');
                    return;
                }
                if(!this.modal.startTime||!this.modal.endTime){
                    this.$Message.error('请选择时间');
                    return;
                }
                if(!this.modal.image){
                    this.$Message.error('请上传图片');
                    return;
                }
                this.modal.shopRequestList = [];
                if(this.modal.shopId==1){
                    for(var i =0;i<this.drawDailyShopList.length;i++){
                        if(!this.drawDailyShopList[i].shopId||!this.drawDailyShopList[i].shopName){
                            this.$Message.error('请选择投放门店');
                            break;
                        }else{
                            this.modal.shopRequestList.push({shopId:this.drawDailyShopList[i].shopId,shopName:this.drawDailyShopList[i].shopName})
                        }
                    }
                }else{
                    this.modal.shopRequestList.push({
                        shopId:0,
                        shopName:'全国'
                    })
                }
                if (true) {
                    postRequest(`/banner/saveBanner`, this.modal).then(res => {
                        if (res.code == "200") {
                            this.$Message.success("新增成功");
                            this.$emit("setViewDialogVisible", false);
                            this.$emit("search");
                        }else if(res.code == "9999"){
                            var tamplate = `<p>该时间段内，以下门店在所选运营位上已有活动：</p>`
                            res.data.forEach(function(v,i){
                                tamplate = tamplate + `<p><span>${v.provinceName} &nbsp;&nbsp;</span> <span>${v.cityName}&nbsp;&nbsp;</span><span>${v.areaName}&nbsp;&nbsp;</span><span>${v.shopName}&nbsp;&nbsp;</span><span>${v.startTime}&nbsp;&nbsp;</span>-<span>${v.endTime}&nbsp;&nbsp;</span><span>${v.content}</span></p>`
                            })
                            this.$Modal.confirm({
                                title: '提示',
                                width:700,
                                content:tamplate,
                                onOk: () => {
                                }
                            });
                        }else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
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

    /*.ivu-radio-group-vertical .ivu-radio-wrapper {*/
        /*height: auto;*/
    /*}*/


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
