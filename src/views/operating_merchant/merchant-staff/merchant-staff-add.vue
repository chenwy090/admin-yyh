<template>
    <div>
        <Card >
                <Button type="dashed" icon="md-arrow-round-back" @click="goback">返回列表</Button>

            <Alert show-icon v-if="pageStatus == 'edit'" style="margin-left: 200px; width: 600px; margin-top: 10px">
                员工id :
                <span style="color:red">{{employeeId}}</span>
                <span slot="desc"></span>
            </Alert>
            <Row  style="margin-left:15%;">
                <Row class="box">
                    <Col span="3" class="left-text"><span style="color:red">*</span>手机号</Col>
                    <Col span="10">
                        <Input
                                type="text"
                                v-model="add_info.mobile"
                                style="width:300px"
                                placeholder="请输入手机号"
                                :maxlength="11"
                                @on-change="clearOpenid"
                        />
                        <Button
                                icon="ios-construct"
                                @click="checkMobile"
                        >检查手机号</Button>
                    </Col>
                    <Col span="6">
                        <Alert v-if="checkResult == 1" type="success" show-icon>A success prompt</Alert>
                        <Alert v-if="checkResult == 2" type="error" show-icon>{{checkMsg}}</Alert>
                    </Col>
                </Row>
                <Row class="box">
                    <Col span="3" class="left-text"><span style="color:red">*</span>姓名</Col>
                    <Col span="16">
                        <Tooltip trigger="focus" title="提醒" content="最多5个汉字" placement="right">
                            <Input
                                    type="text"
                                    v-model="add_info.realName"
                                    style="width:300px"
                                    placeholder="请输入姓名"
                                    :maxlength="5"
                            />
                        </Tooltip>
                    </Col>
                </Row>

                <Row class="box">
                    <Col span="3" class="left-text"><span style="color:red">*</span>微信号</Col>
                    <Col span="16">
                        <Tooltip trigger="focus" title="提醒" content="微信号6-20个字母、数字、下划线、减号，必须以字母开头" placement="right">
                            <Input
                                    type="text"
                                    v-model="add_info.wxAccount"
                                    style="width:300px"
                                    placeholder="请输入微信号"
                                    :maxlength="20"
                            />
                        </Tooltip>
                    </Col>
                </Row>

                <Row class="box">
                    <Col span="3" class="left-text"><span style="color:red">*</span>微信二维码</Col>
                    <Col span="20">
                        <div
                                style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                                v-for="(item, index) in bsUploadList"
                                :key="index"
                        >
                            <img :src="item.url" style="width:100%">
                        </div>
                        <div style="display: inline-block;">
                            <Upload
                                    ref="upload"
                                    type="drag"
                                    :format="['jpg','jpeg','png','bmp']"
                                    :on-success="bsHandleSuccess"
                                    :action="url"
                                    accept="image"
                                    :max-size="1024"
                                    :on-exceeded-size="handleMaxSize"
                                    :on-format-error="formatError"
                                    :defaultList="bsUploadList"
                                    :headers="userToken"
                                    :show-upload-list="false"
                                    style="display: inline-block;width:90px;"
                            >
                                <div style="width: 90px;height:90px;line-height: 90px;">
                                    <Icon type="ios-camera" size="20"/>
                                </div>
                            </Upload>
                            <p style="font-size:12px">选择微信二维码 (不大于1M,JPG/PNG/JPEG/BMP）</p>
                        </div>
                    </Col>
                </Row>

                <Row class="box">
                    <Col span="3" class="left-text"><span style="color:red">*</span>职位</Col>
                    <Col span="16">
                        <Tooltip trigger="focus" title="提醒" content="最最多输入6个汉字" placement="right">
                            <Input
                                    v-model="add_info.postDesc"
                                    :maxlength="6"
                                    style="width:300px"
                                    placeholder="请输入员工职位（最多输入6个汉字）"
                                    clearable
                            />
                        </Tooltip>
                    </Col>
                </Row>

                <Row class="box">
                    <Col span="3" class="left-text"><span style="color:red">*</span>一句话描述</Col>
                    <Col span="16">
                        <Tooltip trigger="focus" title="提醒" content="最最多输入12个汉字" placement="right">
                            <Input
                                    v-model="add_info.profile"
                                    :maxlength="12"
                                    style="width:300px"
                                    placeholder="请输入一句话描述（最多输入12个汉字）"
                                    clearable
                            />
                        </Tooltip>
                    </Col>
                </Row>

                <Row class="box">
                    <Col span="3" class="left-text"><span style="color:red">*</span>服务内容</Col>
                    <Col span="16">
                        <Tooltip trigger="focus" title="提醒" content="最多输入30个汉字" placement="right">
                            <Input
                                    v-model="add_info.serviceContent"
                                    :maxlength="30"
                                    style="width:300px"
                                    placeholder="请输入服务内容（最多输入30个汉字）"
                                    clearable
                            />
                        </Tooltip>
                    </Col>
                </Row>

                <Row  class="box">
                    <Col span="3" class="left-text"> <span style="color:red">*</span> 角色类型 </Col>
                    <Col span="16">
                    <CheckboxGroup v-model="add_info.roleIdList" span="3">
                        <Checkbox
                                style="width:130px"
                                v-for="(item, index) in roleList"
                                :key="item.id"
                                :label="item.id"
                        >{{item.name}}</Checkbox>
                    </CheckboxGroup>
                    </Col>
                </Row>

                <Row class="box">
                    <Col span="3" class="left-text"><span style="color:red">*</span>所属商户</Col>
                    <Col span="16">
                        <Button @click="addMerchantList">点击选择所属商户</Button>
                    </Col>
                </Row>
                <Row class="box">
                    <Table
                            border width="600px"
                            :columns="columnsSelectMerchant"
                            :data="add_info.merchantList"
                    >

                        <template slot-scope="{ row }" slot="operate">
                            <Button
                                    size="large"
                                    style="color:#2db7f5"
                                    @click="remove(row)"
                                    icon="ios-trash-outline"
                            >移除</Button>
                        </template>
                    </Table>
                </Row>

                <Alert style="margin-top: 10px;" type="warning" show-icon v-if="removeAlert">提醒：移除后，需要提交保存才能保存结果。</Alert>

                <Row style="margin-top:54px">
                    <Button
                            type="info"
                            @click="goback"
                            style="width:240px;margin-right: 20px; float: left;"
                    >取&nbsp&nbsp&nbsp消</Button>
                    <Button
                            type="primary"
                            :loading="edit_loading"
                            style="width:240px; float: left;"
                            @click="addStaffFn"
                            :disabled="isCheckDisabled"
                    >保存</Button>
                </Row>
            </Row>
        </Card>

        <Modal
                v-model="merchantTabDisplay"
                title="商户列表"
                width="800"
                footer-hide
                :closable="false"
                :mask-closable="false"
        >
            <div>
                <row>
                    <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
                        <FormItem label="商户编号">
                            <Input
                                    type="text"
                                    v-model="searchItem.merchantId"
                                    clearable
                                    placeholder="请输入商户编号"
                                    style="width: 150px"
                            />
                        </FormItem>
                        <FormItem label="商户名称">
                            <Input
                                    type="text"
                                    v-model="searchItem.name"
                                    clearable
                                    placeholder="请输入商户名称"
                                    style="width: 150px"
                            />
                        </FormItem>
                        <FormItem style="" label="所在地区">
                            <Select v-model="searchItem.provinceId" style="width:150px" clearable @on-change="getcitylist">
                                <Option v-for="(item,index) in provincelist" :key="index" :value="item.provinceCode">{{item.provinceName}}</Option>
                            </Select>
                            <Select v-model="searchItem.cityId" style="width:150px" clearable @on-change="getarealist">
                                <Option v-for="(item,index) in citylist" :key="index" :value="item.cityCode" >{{item.cityName}}</Option>
                            </Select>
                            <Select v-model="searchItem.areaId" style="width:150px" clearable >
                                <Option v-for="(item,index) in arealist" :key="index" :value="item.areaCode" >{{item.areaName}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem style="margin-left:-35px;" class="br">
                            <Button @click="search" type="primary" icon="ios-search">搜索</Button>
                            <Button @click="refresh">重置</Button>
                        </FormItem>
                    </Form>
                </row>

                <!-- 商户列表 -->
                <Table
                        ref="selection"
                        border width="100%"
                        :columns="columnsMerchant"
                        :data="merchantList"
                        @on-select="selectionCampagin"
                        @on-select-cancel="cancelCampagin"
                        @on-select-all="allCampagin"
                        @on-select-all-cancel="cancelAllCampagin"
                        :loading="TableLoading"
                >
                </Table>
                <Row type="flex" justify="end" class="page">
                    <Page
                            :total="totalSize"
                            show-total
                            show-elevator
                            @on-change="changeCurrent"
                            style="float: right"
                            :current.sync="current"
                    ></Page>
                </Row>
            </div>

            <Row style="margin-left:350px; margin-top: 30px">
                <Button style="margin-right: 20px" @click="cancel">取消</Button>
                <Button type="primary" @click="selectMerchant">确定</Button>
            </Row>

        </Modal>

        <Modal
                v-model="userInfoDisplay"
                title="user 列表"
                width="900"
                footer-hide
                :closable="false"
                :mask-closable="false"
        >
            <div>
                <!-- 用户列表 -->
                <Table
                        ref="selection"
                        border width="100%"
                        :columns="columns"
                        :data="userList"
                >
                    <template slot-scope="{ row }" slot="avatarUrl">
                        <img
                                :src="row.avatarUrl"
                                v-if="row.avatarUrl != ''"
                                style="width:40px"
                                @click="avatarUrlLook(row.avatarUrl)"
                        >
                    </template>
                </Table>
            </div>
            <Row style="margin-left: 370px; margin-top: 30px">
                <Button style="margin-right: 20px" @click="cancel">取消</Button>
                <Button type="primary" @click="addUser">确定</Button>
            </Row>
        </Modal>

        <Modal v-model="avatarUrlDisplay" title="查看二维码" width="350" footer-hide>
            <img style="width: 100%" :src="avatarUrl_url">
        </Modal>
    </div>
</template>
<script>
import { getMerchantList, addStaff, editStaff} from '@/api/sys';
import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest} from "@/libs/axios";
import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
import { formatDate, checkImageWH, checkImage, uniqueArray} from "@/libs/date";

export default {
    name: "merchant-staff-add",
    props: {
        employeeId: String
    },
    data() {
        return {
            userToken: {}, //用户token
            add_info: {
                employeeId: "",
                mobile: "",
                realName: "",
                wxAccount: "",
                wxQrcode: "",
                postDesc: "",
                profile: "",
                serviceContent: "",
                roleIdList: [],
                merchantList: [],
                memberId: "",
                openid: "",
            },
            edit_loading: false,
            isCheckDisabled: false,
            bsUploadList: [],
            url: uploadOperationImage2AliOssURl,
            roleList: [],
            pageStatus: "",
            merchantTabDisplay: false, // 商户选择框显示
            userInfoDisplay: false,     //用户选择显示框
            checkResult: 0,
            checkMsg: "",
            chooseUser: {
              openid: "",
              memberId: "",
            },
            columns: [
                {
                    title: "选择",
                    key: "ticketTemplateID",
                    width: 70,
                    align: "center",
                    render: (h, params) => {
                        let openid = params.row.openid;
                        let memberId = params.row.memberId;
                        let flag = false;
                        if (this.chooseUser.openid === openid) {
                            flag = true;
                        } else {
                            flag = false;
                        }
                        let self = this;
                        return h("div", [
                            h("Radio", {
                                props: {
                                    value: flag
                                },
                                on: {
                                    "on-change": () => {
                                        self.chooseUser.openid = openid;
                                        self.chooseUser.memberId = memberId;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '微信号二维码',
                    align: 'center',
                    minWidth: 140,
                    key: 'avatarUrl',
                    slot: "avatarUrl",
                },
                {
                    title: '微信昵称',
                    align: 'center',
                    width: 140,
                    key: 'nickName',
                },
                {
                    title: '用户ID',
                    align: 'center',
                    width: 240,
                    key: 'memberId',
                },
                {
                    title: 'openID',
                    align: 'center',
                    width: 270,
                    key: 'openid',
                },
            ],
            userList: [],
            avatarUrl_url:'', // 查看二维码路径
            avatarUrlDisplay:false, // 查看二维码对话框显示
            currentChooseID: "",
            chooseResArray: [],
            columnsMerchant: [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    title: '商户编号',
                    align: 'center',
                    minWidth: 130,
                    key: 'merchantId',
                },
                {
                    title: '商户名称',
                    align: 'center',
                    width: 230,
                    key: 'name',
                },
                {
                    title: '所属地区',
                    align: 'center',
                    width: 340,
                    key: 'address',
                    render: (h, params) => {
                        let address = params.row.province + params.row.city + params.row.district + params.row.address;
                        return h('span', address);

                    }
                }
            ],
            columnsSelectMerchant: [
                {
                    title: '商户编号',
                    align: 'center',
                    width: 200,
                    key: 'merchantId',
                },
                {
                    title: '商户名称',
                    align: 'center',
                    width: 200,
                    key: 'name',
                },
                {
                    title: '地址',
                    align: 'center',
                    minWidth: 300,
                    key: 'address',
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 140,
                    key: "action",
                    slot: "operate",
                }
            ],
            merchantList: [],
            current: 1,
            totalSize: 0, //总条数
            pageNum: 1, //开始条数
            TableLoading: false,
            searchItem: {
                merchantId: "",
                name: "",
                provinceId: "",
                cityId: "",
                areaId: ""
            },
            provincelist: [],
            citylist: [],
            arealist: [],
            selectedMerchantList: [],//选中的商户列表
            removeAlert: false,
        }
    },
    created: function() {
        this.userToken = {
            jwttoken: localStorage.getItem("jwttoken")
        };
    },
    methods: {
        //获取省份信息数据
        getprovincelist() {
            postRequest(
                "/system/area/province/list"
            ).then(res => {
                if (res.code == 200) {
                    this.provincelist = res.data;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        //根据省份code获取城市信息数据
        getcitylist() {
            getRequest(
                "/system/area/city/"+this.searchItem.provinceId
            ).then(res => {
                if (res.code == 200) {
                    this.citylist = res.data;
                    this.searchItem.areaId = '';
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        //根据城市code获取区县信息数据
        getarealist() {
            getRequest(
                "/system/area/district/"+this.searchItem.cityId
            ).then(res => {
                if (res.code == 200) {
                    this.arealist = res.data;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },

        // 取消选中
        cancelCampagin(selection, row) {
            for (let i = 0; i < this.selectedMerchantList.length; i++ ) {
                if ( row.merchantId == this.selectedMerchantList[i].merchantId ) {
                    this.selectedMerchantList.splice(i, 1);
                }
            }
        },

        // 选中
        selectionCampagin(selection, row) {
            this.selectedMerchantList.push(row);
        },

        //全选
        allCampagin(selection) {
            for (let i = 0; i < selection.length; i++) {
                this.selectedMerchantList.push(selection[i]);
            }
        },

        // 取消全选
        cancelAllCampagin(selection) {
            //去重
            var afterArr = uniqueArray(
                this.selectedMerchantList,
                "merchantId"
            );
            this.selectedMerchantList = afterArr;
            for (let i = 0; i < this.selectedMerchantList.length; i++ ) {
                for (let j = 0; j < this.merchantList.length; j++ ) {
                    if ( selection[j].merchantId == this.selectedMerchantList[i].merchantId ) {
                        this.selectedMerchantList.splice(i, 1);
                    }
                }
            }
        },

        // 查看二维码
        avatarUrlLook(url) {
            this.avatarUrl_url = url;
            this.avatarUrlDisplay = true;
        },

        goback() {
            this.$emit("changeStatus", false);
        },

        //上传微信二维码
        bsHandleSuccess(res, file) {
            if (res.code == 200) {
                this.add_info.wxQrcode = res.image_url;
                if (this.bsUploadList.length == 0) {
                    let obj = {
                        url: res.image_url
                    };
                    this.bsUploadList.push(obj);
                } else {
                    this.bsUploadList[0].url = res.image_url;
                }
                this.$Message.info("上传图片成功");
            } else {
                this.$Message.error("上传图片失败，请重新上传");
            }
        },

        handleMaxSize(file) {
            this.$Message.error("图片不大于1M");
        },

        formatError() {
            this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传");
        },

        handleBeforeUpload(file) {
            return checkImage(file);
        },

        //查询所有角色列表
        getRoleList() {
            postRequest("/merchant/MerchantRoleInfo/all").then(res => {
                if (res.code == 200) {
                    this.roleList = res.data;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },

        init() {
            this.pageStatus = this.getStore("pageStatus");
            this.getRoleList();
            this.getprovincelist();
            this.getEmployeeInfo();
        },

        getEmployeeInfo(){
            if (this.pageStatus == 'edit' && this.employeeId){
                postRequest("/merchant/merchantEmployee/selectById?id=" + this.employeeId).then(res => {
                    if (res.code == 200) {
                        console.info(JSON.stringify(res.data))
                        this.add_info = res.data;
                        let obj = {
                            url: res.data.wxQrcode
                        };
                        this.bsUploadList.push(obj);
                        var roleIdList = [];
                        if (res.data.roleIdList){
                            for (var o of res.data.roleIdList){
                                roleIdList.push(parseInt(o))
                            }
                        }
                        this.add_info.roleIdList = roleIdList;
                        this.add_info.employeeId = this.employeeId;
                        console.info(JSON.stringify(this.add_info))
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            }
        },

        addUser(){
            if (this.chooseUser && this.chooseUser.openid){
                this.add_info.openid = this.chooseUser.openid;
                this.add_info.memberId = this.chooseUser.memberId;
                this.userInfoDisplay = false;
                this.checkResult = 1;
            }else {
                this.$Message.error("请选择一个用户！");
            }
        },

        // 关闭商户选择框
        cancel() {
            this.merchantTabDisplay = false;
            this.userInfoDisplay = false;
        },

        //弹出商户选择框
        addMerchantList(){
            this.merchantTabDisplay = true;
            this.selectedMerchantList = [],
            this.getMerchantListFn();
        },

        search(){
            this.current = 1;
            this.totalSize = 0;//总条数
            this.pageNum = 1; //开始条数
            this.getMerchantListFn();
        },

        // 获取商户列表
        getMerchantListFn() {
            this.TableLoading = false;
            const reqParams = {
                merchantId: this.searchItem.merchantId,
                name: this.searchItem.name,
                provinceCode: this.searchItem.provinceId,
                cityCode: this.searchItem.cityId,
                areaCode: this.searchItem.areaId
            };
            postRequest('/merchant/merchantInfo/list?isAsc=DESC&orderByColumn=1&pageNum='+ this.pageNum +'&pageSize=10', reqParams).then(res =>{
                if(res.code == 200) {
                    this.totalSize = res.data.total;
                    this.merchantList = res.data.records
                }else {
                    this.msgErr(res.msg)
                }
                this.TableLoading = false;
            });
        },

        //确定选择商户
        selectMerchant(){
            if (this.selectedMerchantList && this.selectedMerchantList.length > 0){
                for(var obj of this.selectedMerchantList){
                    this.add_info.merchantList.push(obj);
                }
                var afterArr = uniqueArray(
                    this.add_info.merchantList,
                    "merchantId"
                );
                this.add_info.merchantList = afterArr;
                this.merchantTabDisplay = false;
            }else {
                this.msgErr("至少选一个商户");
            }
        },

        remove(row){
            this.removeAlert = true;
            for (let i = 0; i < this.add_info.merchantList.length; i++ ) {
                if ( row.merchantId == this.add_info.merchantList[i].merchantId ) {
                    this.add_info.merchantList.splice(i, 1);
                }
            }
        },

        //重置商户搜索条件
        refresh() {
            // this.updateTableList(this.params);
            this.searchItem.name = "";
            this.searchItem.provinceId = "";
            this.searchItem.cityId = "";
            this.searchItem.areaId = "";
            this.updateTableList();
        },

        //分页
        changeCurrent(current) {
            this.pageNum = current;
            this.getMerchantListFn();
        },

        clearOpenid(){
            this.add_info.openid = "";
            this.add_info.memberId = "";
            this.checkResult = 0;
        },

        // 全局提示
        msgOk(txt) {
            this.$Message.info({
                content: txt,
                duration: 3
            });
        },

        checkMobile(){
            this.add_info.openid = "";
            this.add_info.memberId = "";
            this.chooseUser = {
                openid: "",
                memberId: ""
            };
            if (!this.add_info.mobile){
                this.$Message.error('请输入手机号');
                return;
            }
            var url = "/merchant/merchantInfo/checkMobile/" + this.add_info.mobile;
            postRequest(url).then(res => {
                if (res.code == 200) {
                    this.checkResult = 1;
                    this.add_info.memberId = res.data[0].memberId;
                    this.add_info.openid = res.data[0].openid;
                } else {
                    this.$Message.error(res.msg);
                    this.checkMsg = res.msg;
                    this.checkResult = 2;
                    console.info(res)
                    this.userList = res.data;
                    if (res.data){
                        if (res.data.length > 1){
                            this.userInfoDisplay = true;
                        }
                    }


                }
            });
        },
        // 新增员工
        addStaffFn() {
            // 验证
            if (!this.ruleValidate()) {
                return;
            }

            var merchantIdList = [];
            if (this.add_info.merchantList){
                for(var obj of this.add_info.merchantList){
                    merchantIdList.push(
                        obj.merchantId
                    );
                }
            }
            let reqParam = {
                employeeId: this.add_info.employeeId,
                mobile: this.add_info.mobile,
                realName: this.add_info.realName,
                wxAccount: this.add_info.wxAccount,
                wxQrcode: this.add_info.wxQrcode,
                postDesc: this.add_info.postDesc,
                profile: this.add_info.profile,
                serviceContent: this.add_info.serviceContent,
                roleIdList: this.add_info.roleIdList,
                merchantIdList: merchantIdList,
                memberId: this.add_info.memberId,
                openid: this.add_info.openid,
            };
            var msg = "新增";
            if (this.pageStatus == 'edit' && this.employeeId){
                msg = "编辑";
            }
            this.edit_loading = true;
            this.isCheckDisabled = true;

            addStaff(reqParam).then(res => {
                if(res.code == 200) {
                    // console.log(res);
                    this.msgOk(msg + '成功')
                    this.goback();
                }else {
                    this.msgErr(res.msg)
                }
                this.edit_loading = false;
                this.isCheckDisabled = false;
            })
        },
        msgErr(txt) {
            this.$Message.error({
                content: txt,
                duration: 3
            });
        },
        // 验证
        ruleValidate(){
            // if(this.formValidate.merchantId == ''){
            //   this.msgErr('所属商家还没选择')
            //   return
            // }

            if(this.add_info.mobile == ""){
                this.msgErr('员工电话不能为空')
                return
            }
            if(this.add_info.memberId == "" || this.add_info.openid == ""){
                this.msgErr('请检查手机号')
                return
            }
            /*var phone = /^[1][3,4,5,7,8][0-9]{9}$/;
            if(!phone.test(this.add_info.mobile)){
                this.msgErr('请输入常规手机号')
                return
            }*/
            if(this.add_info.realName == ''){
                this.msgErr('员工名称不能为空')
                return
            }
            if(this.add_info.wxAccount == ''){
                this.msgErr('员工微信号不能为空')
                return
            }
            if(this.add_info.wxQrcode == ''){
                this.msgErr('员工微信号二维码没有上传')
                return
            }
            if(this.add_info.postDesc == ''){
                this.msgErr('员工岗位不能为空')
                return
            }
            if(this.add_info.profile == ''){
                this.msgErr('员工一句话描述不能为空')
                return
            }
            if(this.add_info.serviceContent == ''){
                this.msgErr('员工服务内容不能为空')
                return
            }
            if(!this.add_info.roleIdList || this.add_info.roleIdList.length == 0){
                this.msgErr('角色类型不能为空')
                return
            }
            if(!this.add_info.merchantList || this.add_info.merchantList.length == 0){
                this.msgErr('所属商户不能为空')
                return
            }
            return true;
        },

    },
    mounted() {
        this.init();
    }
}
</script>

<style>
    .form > div {
        display: inline-block;
    }
    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }
    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }
    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .left-text {
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 12px;
        color: #515a6e;
        line-height: 1;
        padding: 10px 12px 10px 0;
        box-sizing: border-box;
    }
    .box {
        margin-bottom: 20px;
    }
</style>