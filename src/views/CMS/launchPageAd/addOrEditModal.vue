<template>
    <!--新增/编辑弹窗-->
    <Modal  width="800"
            v-model="viewDialogVisible"
            :title="titleName"
            :closable="false"
            :mask-closable="false"
            footer-hide>
            <Form
                    :model="modal"
                    ref="addOrEditModal"
                    :rules="ruleValidate"
                    :label-width="80"
                    label-position="left"
            >
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="广告标题">
                        <Input
                                type="text"
                                :maxlength="20"
                                v-model="modal.title"
                                placeholder="请填广告标题"
                                style="width: 30%"
                        ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="广告图片">
                        <div class="demo-upload-list"  v-if="modal.imgUrl">
                            <img :src="modal.imgUrl">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
                            </div>
                        </div>
                        <Upload v-if="!modal.imgUrl"
                                ref="upload"
                                :show-upload-list="false"
                                :default-file-list="defaultList"
                                :on-success="handleSuccess"
                                :format="['jpg','png']"
                                :max-size="1024"
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
                            <img :src="modal.imgUrl" v-if="visible"
                                 style="width: 100%">
                        </Modal>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="投放终端">
                        <Select v-model="modal.clientType" multiple style="width:50%">
                            <Option v-for="item in clientTypeList" :value="item.value" :key="item.value">{{item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="投放时间">
                        <DatePicker
                                :value="modal.startTime"
                                type="datetime"
                                placeholder="请输入开始时间"
                                style="width: 30%"
                                :options="options1"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                        ></DatePicker>
                        <div style="display: inline-block"> &nbsp;至&nbsp; </div>
                        <DatePicker
                                :value="modal.endTime"
                                type="datetime"
                                placeholder="请输入结束时间"
                                style="width: 30%"
                                :options="options2"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                        ></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="是否跳转：">
                        <RadioGroup v-model="modal.jumpFlag">
                            <Radio :label="1">跳转</Radio>
                            <Radio :label="0">不跳转</Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12" v-if="modal.jumpFlag=='1'">
                    <Col span="18">
                    <FormItem label="跳转类型">
                        <Select v-model="modal.contentType" style="width:30%" @on-change="changeType">
                            <Option v-for="item in contentTypeList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12" v-if="modal.jumpFlag=='1'&&(modal.contentType==3||modal.contentType==4)">
                    <Col span="18">
                    <FormItem label="跳转内容">
                        <Input
                                type="text"
                                v-model="modal.contentValue"
                                placeholder="请输入链接"
                                style="width: 100%"
                        ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12" v-if="modal.jumpFlag=='1'&&(modal.contentType==1||modal.contentType==10||modal.contentType==11||modal.contentType==12)">
                    <Col span="18">
                    <FormItem label="跳转内容">
                        <Button type="dashed" @click="openContent">
                            <span v-if="!modal.contentValue">请选择</span>
                            <span v-if="modal.contentValue"> {{modal.contentTitle}}</span>
                        </Button>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <div style="text-align: center">
                        <Button @click="close">返回</Button>
                        <Button style="margin:20px" type="primary" @click="ok()">保存</Button>
                    </div>
                </Row>
            </Form>
        <!--</Card>-->
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
        <couponModal
                ref="couponModal"
                :viewDialogVisible="conponViewDialogModal"
                @setViewDialogVisible="selectContent"
        ></couponModal>
    </Modal>
</template>

<script>
    import { uploadOperationImage2AliOssURl } from "@/api/index";
    import {postRequest, getRequest, getSyncRequest} from "@/libs/axios";
    import contentModal from "./contentModal";
    import drawModal from "./drawModal";
    import couponModal from "./couponModal";
    // import shopModal from "./shopModal";
    // import storeView from "./store";

    export default {
        name: "add-or-edit-modal",
        components: {contentModal,drawModal,couponModal},
        props: {
            viewDialogVisible: {type: Boolean, default: false}
        },
        data() {
            return {
                userToken:'',
                url: uploadOperationImage2AliOssURl,
                contentObj:{},
                uploadList: [{}],
                defaultList: [],
                visible: false,
                contentTypeList: [{value: 1, label: '专题活动'}, {value: 2, label: '抽奖广场页'}, {value: 3, label: '内链'}, {value: 4, label: '外链'}, {value: 5, label: '平台分红页'}, {value: 6, label: '领优惠页－周边券'},{value: 7, label: '领优惠页－超市券'}, {value: 10, label: '抽奖团'}, {value: 11, label: '周边券详情'},{value: 12, label: '商超券详情'}],
                clientTypeList: [{value: 1, label: '小程序'}, {value: 2, label: 'android'}, {value: 3, label: 'ios'}],
                titleName: "新增",
                contentViewDialogModal: false,
                drawViewDialogModal: false,
                conponViewDialogModal: false,
                modal: {
                    clientType:[],
                    contentTitle: "",
                    contentType: "",
                    contentValue: '',
                    id:'',
                    imgUrl: '',
                    jumpFlag: '',
                    startTime: "",
                    endTime: "",
                    title: '',
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
            handleView(item) {
                this.visible = true;
            },
            handleRemove(file) {
                this.modal.imgUrl = '';
            },
            handleSuccess(res, file) {
                console.log(res);
                if(res.code==200){
                    this.modal.imgUrl = res.image_url;
                }else{
                    this.$Message.error('上传失败')
                }
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
                this.modal.contentValue = '';
                this.modal.contentTitle = '';
            },
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.modal.startTime = datetime
                    this.options2 = {
                        disabledDate(date) {
                            var a = new Date(datetime)
                            if(a<new Date()){
                                a = new Date();
                            }
                            return date.valueOf() < a - 1000 * 60 * 60 * 24;
                        }
                    };
                    break;
                case 2:
                    this.modal.endTime =  datetime
                    this.options1 = {
                        disabledDate(date) {
                            return (date.valueOf() < Date.now() - 1000 * 60 * 60 * 24 || date.valueOf() > new Date(datetime));
                        }
                    };
                    break;
                }
            },
            resetRow(row,type) {
                if(type=='add'){
                    this.titleName='新增';
                    this.modal={
                        clientType:[],
                        contentTitle: "",
                        contentType: "",
                        contentValue: '',
                        id:'',
                        imgUrl: '',
                        jumpFlag: '',
                        startTime: "",
                        endTime: "",
                        title: '',
                    };
                }else{
                    this.titleName='编辑';
                    postRequest(`/page/ad/get`,{id:row.id}).then(res => {
                        if (res.code == "200") {
                            this.modal.title = res.data.title;
                            this.modal.id = res.data.id;
                            this.modal.contentTitle = res.data.contentTitle;
                            this.modal.imgUrl = res.data.imgUrl;
                            this.modal.contentValue = res.data.contentValue;
                            this.modal.startTime = res.data.startTime;
                            this.modal.endTime = res.data.endTime;
                            this.modal.clientType = res.data.clientType;
                            this.modal.contentType = res.data.contentType;
                            this.modal.jumpFlag = res.data.jumpFlag;
                        }else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
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
                switch (this.modal.contentType) {
                case 1:
                    this.contentViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["contentModal"].resetRow({content:this.modal.contentTitle,value:this.modal.contentValue});
                    });
                    break;
                case 10:
                    this.drawViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["drawModal"].resetRow({content:this.modal.contentTitle,value:this.modal.contentValue});
                    });
                    break;
                case 11:
                    this.conponViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["couponModal"].resetRow('2',{shopName:this.modal.contentTitle,shopId:this.modal.contentValue});
                    });
                    break;
                case 12:
                    this.conponViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["couponModal"].resetRow('1',{shopName:this.modal.contentTitle,shopId:this.modal.contentValue});
                    });
                    break;
                }
            },
            selectContent(e) {
                this.contentViewDialogModal = false;
                this.drawViewDialogModal = false;
                this.conponViewDialogModal = false;
                if (e) {
                    this.modal.contentValue = e.shopId;
                    this.modal.contentTitle = e.shopName;
                }
            },
            changeRadio() {
                this.modal.contentValue = '';
                this.modal.contentTitle = '';
            },
            ok() {
                if(!this.modal.title){
                    this.$Message.error('请填写标题');
                    return;
                }
                if(this.modal.jumpFlag!==0&&this.modal.jumpFlag!==1){
                    this.$Message.error('请选择跳转类型');
                    return;
                }
                if(this.modal.jumpFlag==1){
                    if(!this.modal.contentType){
                        this.$Message.error('请选择内容类型');
                        return;
                    }
                    if(this.modal.contentType===1||this.modal.contentType===3||this.modal.contentType===4||this.modal.contentType===10||this.modal.contentType===11||this.modal.contentType===12){
                        if(!this.modal.contentValue){
                            this.$Message.error('请选择内容或链接');
                            return;
                        }
                    }
                }
                if(!this.modal.clientType.length){
                    this.$Message.error('请选择终端');
                    return;
                }
                if(!this.modal.startTime||!this.modal.endTime){
                    this.$Message.error('请选择时间');
                    return;
                }
                if(new Date(this.modal.startTime)>=new Date(this.modal.endTime)){
                    this.$Message.error('开始时间不能大于等于结束时间');
                    return;
                }
                if(!this.modal.imgUrl){
                    this.$Message.error('请上传图片');
                    return;
                }
                if (true) {
                    postRequest(`/page/ad/save`, this.modal).then(res => {
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
