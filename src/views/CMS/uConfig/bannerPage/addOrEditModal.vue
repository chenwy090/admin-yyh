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
                                placeholder="请填写活动名称，20字以内"
                                style="width: 100%"
                        ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="内容类型">
                        <Select v-model="modal.type" style="width:30%">
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
                                v-model="modal.vlaue"
                                placeholder="请输入链接"
                                style="width: 100%"
                        ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12" v-if="modal.type==1||modal.type==2||modal.type==5||modal.type==6">
                    <Col span="18">
                    <FormItem label="内容选择">
                        <Button type="dashed" @click="openContent">
                            <span v-if="!contentObj.name">请选择</span>
                            <span v-if="contentObj.name"> {{contentObj.name}}</span>
                        </Button>
                    </FormItem>
                    </Col>
                </Row>
                <h3>banner位设置</h3>
                <div style="padding: 20px;border: 1px solid #999;">
                    <Row class="padding-left-12">
                        <Col span="18">
                        <FormItem label="门店选择">
                            <Button type="dashed" @click="openContent">
                                <span v-if="!contentObj">请选择</span>
                                <!--<Button :key="index" v-for="(item,index) in couponObj" class="coupon-item">-->
                                    <!--{{item.title +'&nbsp&nbsp'}}-->
                                    <!--<Icon @click.stop="reMoveCoupon(index)" type="ios-close"/>-->
                                <!--</Button>-->
                            </Button>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="padding-left-12">
                        <Col span="18">
                        <FormItem label="投放位置">
                            <Select v-model="modal.location" style="width:30%">
                                <Option v-for="item in locationList" :value="item.value" :key="item.value">{{ item.label
                                    }}
                                </Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="padding-left-12">
                        <Col span="18">
                        <FormItem label="运营位置">
                            <Select v-model="modal.businessLayer" style="width:30%">
                                <Option v-for="item in businessLayerList" :value="item.value" :key="item.value">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="padding-left-12">
                        <Col span="18">
                        <FormItem label="运营位选择">
                            <Select v-model="modal.layerPriority" style="width:30%">
                                <Option v-for="item in layerPriorityList" :value="item.value" :key="item.value">{{
                                    item.label }}
                                </Option>
                            </Select>
                            <span style="margin: 0 10px 0 30px;">终端选择</span>
                            <Select v-model="modal.clientType" style="width:30%">
                                <Option v-for="item in clientTypeList" :value="item.value" :key="item.value">{{
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
                                    :value="modal.startTime"
                                    type="date"
                                    placeholder
                                    style="width: 48%"
                                    :options="options1"
                                    @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                            ></DatePicker>
                            <div style="width: 2%;display: inline-block"></div>
                            <DatePicker
                                    :value="modal.endTime"
                                    type="date"
                                    placeholder
                                    style="width: 48%"
                                    :options="options2"
                                    @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                            ></DatePicker>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="padding-left-12">
                        <Col span="18">
                        <FormItem label="banner图片">
                            <div class="demo-upload-list" v-for="item in uploadList">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
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
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <Modal title="View Image" v-model="visible">
                                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible"
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
                @setViewDialogVisible="selectVolume"
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
    import {postRequest, getRequest, getSyncRequest} from "@/libs/axios";
    import volumeModal from "./volumeModal";
    import contentModal from "./contentModal";
    import drawModal from "./drawModal";
    import shopModal from "./shopModal";

    export default {
        name: "add-or-edit-modal", components: {volumeModal, contentModal, drawModal,shopModal}, props: {
            viewDialogVisible: {type: Boolean, default: false}
        }, data() {
            return {
                contentObj:{},
                uploadList: [{}],
                defaultList: [],
                visible: false,
                typeList: [{value: 1, label: '专题活动'}, {value: 2, label: '抽奖团'}, {value: 3, label: '内链'}, {
                    value: 4,
                    label: '外链'
                }, {value: 5, label: '商户'}, {value: 6, label: '优惠券'}],
                locationList: [{value: 1, label: '首页'}, {value: 2, label: '赚钱'}, {value: 3, label: '领优惠'}, {
                    value: 4,
                    label: '我的'
                }, {value: 5, label: '平台分红'}],
                businessLayerList: [{value: 1, label: '1号位置'}, {value: 2, label: '2号位置'}, {value: 3, label: '3号位置'}],
                layerPriorityList: [{value: 1, label: 'banner1'}, {value: 2, label: 'banner2'}, {
                    value: 3,
                    label: 'banner3'
                }, {value: 4, label: 'banner4'}, {value: 5, label: 'banner5'}],
                clientTypeList: [{value: 0, label: '全部'}, {value: 1, label: 'ios'}, {
                    value: 2,
                    label: 'android'
                }, {value: 3, label: '小程序'}],
                titleName: "",
                volumeViewDialogModal: false,
                contentViewDialogModal: false,
                drawViewDialogModal: false,
                shopViewDialogModal: false,
                modal: {
                    title: "",
                    type: "",
                    value: '',
                    shopRequestList: '',
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
            handleView(name) {
                this.imgName = name;
                this.visible = true;
            }, handleRemove(file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            }, handleSuccess(res, file) {
                file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            }, handleFormatError(file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            }, handleMaxSize(file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit', desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            }, handleBeforeUpload() {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            }, changeDateTime(datetime, index) {
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
            }, resetRow(row) {
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
                if (row) {
                    this.titleName = "编辑";
                    this.modal.id = row.id;
                    // /merchant/activity/award/activity/{id}
                    getRequest(`/customer/activity/award/activity/${row.id}`).then(res => {
                        if (res.code === "200") {
                            var data = res.data;
                            this.modal.name = data.name;
                            this.modal.startTime = data.startTime;
                            this.modal.wardType = data.awardType.toString();
                            this.modal.endTime = data.endTime;
                            this.modal.type = "2";
                            this.modal.status = data.status;
                            if (data.awardRuleVos && data.awardRuleVos.length) {
                                data.awardRuleVos.forEach(function (v, i) {
                                    v.awardAmount = v.award;
                                });
                            }
                            if (data.awardType == "1") {
                                this.JawardRuleDtos = data.awardRuleVos;
                                this.JawardRuleDtos.forEach(function (v, i) {
                                    if (!v.verifyCountMax) {
                                        v.verifyCountMax = null;
                                    }
                                    if (!v.verifyCountMin) {
                                        v.verifyCountMin = null;
                                    }
                                });
                                this.UawardRuleDtos = [{
                                    verifyCountMin: null,
                                    verifyCountMax: null,
                                    awardAmount: null,
                                    awardType: "1",
                                    couponType: "",
                                    awardName: ""
                                }];
                            } else
                                if (data.awardType == "2") {
                                    this.UawardRuleDtos = data.awardRuleVos;
                                    this.UawardRuleDtos.forEach(function (v, i) {
                                        if (!v.verifyCountMax) {
                                            v.verifyCountMax = null;
                                        }
                                        if (!v.verifyCountMin) {
                                            v.verifyCountMin = null;
                                        }
                                    });
                                    this.JawardRuleDtos = [{
                                        verifyCountMin: null,
                                        verifyCountMax: null,
                                        awardAmount: null,
                                        awardType: "2",
                                        couponType: "",
                                        awardName: ""
                                    }];
                                }
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                } else {
                    this.titleName = "新增";
                    this.modal.name = "";
                    this.modal.startTime = "";
                    this.modal.wardType = "1";
                    this.modal.endTime = "";
                    this.modal.type = "1";
                    this.JawardRuleDtos = [{
                        verifyCountMin: null,
                        verifyCountMax: null,
                        awardAmount: null,
                        awardType: "1",
                        couponType: "",
                        awardName: ""
                    }];
                    this.UawardRuleDtos = [{
                        verifyCountMin: null,
                        verifyCountMax: null,
                        awardAmount: null,
                        awardType: "2",
                        couponType: "",
                        awardName: ""
                    }];
                }
            }, openVolume(item) {
                this.selectActiveVolumeModal = true;
                this.$nextTick(() => {
                    this.$refs["volumeModal"].resetRow(item);
                });
            }, openContent() {
                // this.contentViewDialogModal = true;
                switch (this.modal.type) {
                case 1:
                    this.contentViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["contentModal"].resetRow();
                    });
                    break;
                case 2:
                    this.drawViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["drawModal"].resetRow();
                    });
                    break;
                case 5:
                    this.shopViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["shopModal"].resetRow();
                    });
                    break;
                case 6:
                    this.volumeViewDialogModal = true;
                    this.$nextTick(() => {
                        this.$refs["volumeModal"].resetRow();
                    });
                    break;
                }
            },
            selectContent(e) {
                this.contentViewDialogModal = false;
                this.drawViewDialogModal = false;
                this.shopViewDialogModal = false;
                this.volumeViewDialogModal = false;
                // if (e) {
                //     var that = this;
                //     if (this.couponObj.length == 0) {
                //         this.couponObj = e;
                //     } else
                //         if ((e[0].shopName && !this.couponObj[0].shopName) || e[0].merchantName && !this.couponObj[0].merchantName) {
                //             this.couponObj = e;
                //         } else {
                //             e.forEach(function (v, i) {
                //                 that.couponObj.forEach(function (value, index) {
                //                     debugger
                //                     if (v.templateId === (value.templateId || value.id)) {
                //                         that.couponObj.splice(index, 1);
                //                     }
                //                 });
                //             });
                //             this.couponObj = this.couponObj.concat(e);
                //         }
                // }
            }, selectVolume(e) {
                this.selectActiveVolumeModal = false;
            }, changeRadio() {
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
            }, ok() {
                // /merchant/activity/award/add/activity
                // /merchant/activity/award/update/activity

                if (this.titleName == "新增") {
                    postRequest(`/customer/activity/award/add/activity`, params).then(res => {
                        if (res.code === "200") {
                            this.$Message.success("新增成功");
                            this.$emit("setViewDialogVisible", false);
                            this.$emit("search");
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                } else {
                    postRequest(`/customer/activity/award/update/activity`, params).then(res => {
                        if (res.code === "200") {
                            this.$Message.success("编辑成功");
                            this.$emit("setViewDialogVisible", false);
                            this.$emit("search");
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            }, close() {
                this.$emit("setViewDialogVisible", false);
            }
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

    .coupon-item {
        position: relative;
        margin: 10px;
    }

    .coupon-item .ivu-icon {
        position: absolute;
    }
</style>
