<template>
    <!--新增/编辑弹窗-->
    <!--<Modal width="800"-->
    <!--v-model="viewDialogVisible"-->
    <!--:title="titleName"-->
    <!--:closable="false"-->
    <!--:mask-closable="false"-->
    <!--footer-hide>-->
    <div v-if="viewDialogVisible" class="modal">
        <Card>
            <p slot="title">{{titleName}}</p>
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
                    <FormItem label="公告标题">
                        <Input
                                type="text"
                                :maxlength="20"
                                v-model="modal.title"
                                placeholder="请填写公告标题"
                                style="width: 30%"
                        ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="公告内容">
                        <Input v-model="modal.contentInfo" :maxlength="40" show-word-limit type="textarea" placeholder="Enter something..." style="width: 200px" />
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="有效期">
                        <DatePicker
                                :value="modal.startTime"
                                type="date"
                                placeholder="请输入开始时间"
                                style="width: 30%"
                                :options="options1"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                        ></DatePicker>
                        <div style="width: 2%;display: inline-block"></div>
                        <DatePicker
                                :value="modal.endTime"
                                type="date"
                                placeholder="请输入结束时间"
                                style="width: 30%"
                                :options="options2"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                        ></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <h3>推送目标</h3>
                <div style="padding: 20px;border: 1px solid #999;">
                    <Row class="padding-left-12">
                        <Col span="18">
                        <FormItem label="推送对象">
                            <Select v-model="modal.pushType" style="width:30%">
                                <Option v-for="item in pushTypeList" :value="item.value" :key="item.value">{{item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="padding-left-12">
                        <Col span="18">
                            <FormItem label="推送范围">
                                <RadioGroup v-model="modal.pushRange">
                                    <Radio :label="'1'">所有商户</Radio>
                                    <Radio :label="'2'">部分商户</Radio>（只有在选定的商超范围内的商户才显示公告）
                                </RadioGroup>
                                <div>
                                    <Button v-if="modal.pushRange=='2'" type="dashed" @click="openContent" style="max-width: 100%">
                                        <span v-if="shopList.length===0">请选择</span>
                                        <Button :key="index" v-for="(item,index) in shopList" class="coupon-item" style="float: left;margin: 5px;">
                                            {{item.shopName +'&nbsp&nbsp'}}
                                            <Icon @click.stop="reMove(index)" type="ios-close"/>
                                        </Button>
                                    </Button>
                                </div>
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
        <!--<volumeModal-->
                <!--ref="volumeModal"-->
                <!--:viewDialogVisible="volumeViewDialogModal"-->
                <!--@setViewDialogVisible="selectContent"-->
        <!--&gt;</volumeModal>-->
        <!--<contentModal-->
                <!--ref="contentModal"-->
                <!--:viewDialogVisible="contentViewDialogModal"-->
                <!--@setViewDialogVisible="selectContent"-->
        <!--&gt;</contentModal>-->
        <!--<drawModal-->
                <!--ref="drawModal"-->
                <!--:viewDialogVisible="drawViewDialogModal"-->
                <!--@setViewDialogVisible="selectContent"-->
        <!--&gt;</drawModal>-->
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
    import shopModal from "./shopModal";

    export default {
        name: "add-or-edit-modal",
        components: {shopModal},
        props: {
            viewDialogVisible: {type: Boolean, default: false}
        },
        data() {
            return {
                titleName:'',
                pushTypeList: [{value: '1', label: '商户'}, {value: '2', label: '用户'}],
                shopViewDialogModal: false,
                url:'',
                shopList:[],
                modal: {
                    id:'',
                    title: "",
                    pushType: "",
                    contentInfo: '',
                    startTime: "",
                    endTime: "",
                    pushType:'',
                    pushRange: '',
                    shopId:[],
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
            getData(id){
                postRequest(`/announcement/selectById?id=${id}`, {id:id}).then(res => {
                    console.log(res);
                    if (res.code == "200") {
                        var that = this;
                        this.modal = res.data;
                        this.modal.pushType = String(res.data.pushType);
                        this.modal.pushRange = String(res.data.pushRange);
                        this.shopList = res.data.shopInfoList||[];
                        this.modal.shopId = [];
                        if(this.shopList.length){
                            this.shopList.forEach(function(v,i){
                                that.modal.shopId.push(v.shopId);
                            })
                        }
                    }else {
                        this.$Message.error(res.msg);
                    }
                });
            },
            changeType(){
                this.modal.value = '';
                this.modal.content = '';
            },
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.modal.startTime = datetime+' 00:00:00';
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
                    this.modal.endTime =  datetime+' 23:59:59';
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
                    this.titleName = '新增';
                    this.url = '/announcement/add';
                    this.shopList = [];
                    this.modal={
                        title: "",
                        pushType: "",
                        contentInfo: '',
                        startTime: "",
                        endTime: "",
                        pushType:'',
                        pushRange: '',
                        shopId:[]
                    };
                }else{
                    this.titleName = '编辑';
                    this.url = '/announcement/edit';
                    this.shopList = [];
                    this.modal={
                        title: "",
                        pushType: "",
                        contentInfo: '',
                        startTime: "",
                        endTime: "",
                        pushType:'',
                        pushRange: '',
                        shopId:[]
                    };
                    this.getData(row.id);
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
                this.shopViewDialogModal = true;
                this.$nextTick(() => {
                    this.$refs["shopModal"].resetRow();
                });
            },
            selectContent(e) {
                this.shopViewDialogModal = false;
                if (e) {
                    var that = this;
                    console.log(e);
                    if(e&&e.length){
                        this.shopList = e;
                        that.modal.shopId = [];
                        e.forEach(function(v){
                            that.modal.shopId.push(v.shopId);
                        })
                    }
                    // this.modal.value = e.shopId;
                    // this.modal.content = e.shopName;
                    // this.modal.couponType = e.couponType;
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
            reMove(index){
                this.shopList.splice(index,1);
                var that = this;
                that.modal.shopId = [];
                this.shopList.forEach(function(v,i){
                    that.modal.shopId.push(v.shopId);
                })
            },
            ok() {
                if(!this.modal.title){
                    this.$Message.error('请填写公告标题');
                    return;
                }
                if(!this.modal.contentInfo){
                    this.$Message.error('请选择公告内容');
                    return;
                }
                if(!this.modal.startTime||!this.modal.endTime){
                    this.$Message.error('请选择有效期');
                    return;
                }
                if(!this.modal.pushType){
                    this.$Message.error('请选择推送对象');
                    return;
                }
                console.log(111);
                if(!this.modal.pushRange){
                    this.$Message.error('请选择推送范围');
                    return;
                }

                postRequest(this.url, this.modal).then(res => {
                    if (res.code == "200") {
                        this.$Message.success("保存成功");
                        this.$emit("setViewDialogVisible", false);
                        this.$emit("search");
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
