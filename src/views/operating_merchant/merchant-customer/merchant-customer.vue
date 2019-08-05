<template>
    <div>
        <div v-if="!merchantCustomerAddPage">
            <Card :bordered="false">
                <Card>
                    <Row>
                        <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
                            <FormItem label="合同号">
                                <Input
                                        type="text"
                                        v-model="searchItem.contractNumber"
                                        clearable
                                        placeholder="请输入合同号"
                                        style="width: 200px"
                                />
                            </FormItem>
                            <FormItem label="商户名称">
                                <Input
                                        type="text"
                                        v-model="searchItem.name"
                                        clearable
                                        placeholder="请输入商户名称"
                                        style="width: 200px"
                                />
                            </FormItem>
                            <span v-if="drop">
                            <FormItem label="省/市">
                                <Select v-model="searchItem.province" style="width:150px" clearable @on-change="getcitylist">
                                    <Option v-for="(item,index) in provincelist" :key="index" :value="item.provinceCode">{{item.provinceName}}</Option>
                                </Select>
                                <Select v-model="searchItem.city" style="width:150px" clearable>
                                    <Option v-for="(item,index) in citylist" :key="index" :value="item.cityCode" >{{item.cityName}}</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="行业">
                                <component ref="industryViewChild" v-bind:is='industryView' v-on:sendMainIndustryId="mainIndustryId"  v-on:sendSecondIndustryId="secondIndustryId"></component>
                                <Input type="text" style="display:none"  v-model="searchItem.mainIndustryId"/>
                                <Input type="text" style="display:none" v-model="searchItem.industryId" />
                            </FormItem>

                            <FormItem label="状态">
                                <Select v-model="searchItem.isStop" style="width:150px" clearable>
                                    <Option v-for="(item,index) in statusList" :key="index" :value="item.val">{{item.name}}</Option>
                                </Select>
                            </FormItem>

                            </span>
                            <FormItem style="margin-left:-35px;" class="br">
                                <Button @click="search" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="searchFormReset">重置</Button>
                                <a class="drop-down" style="margin-left:10px" @click="dropDown">
                                    {{dropDownContent}}
                                    <Icon :type="dropDownIcon"></Icon>
                                </a>
                            </FormItem>

                        </Form>
                    </Row>
                </Card>
                <Row class="operation">
                    <Button type="primary" icon="md-add" @click="addInfo">新增</Button>
                    <Button icon="md-refresh" @click="search">刷新</Button>
                </Row>
                <div>
                    <!-- 列表 -->
                    <Table border width="100%" :columns="columns" :data="packageList" :loading="TableLoading">
                        <template slot-scope="{ row }" slot="action">
                            <!--<Button
                                    type="text"
                                    size="small"
                                    style="color: #f39913"
                            >查看</Button>
                            <Button
                                    type="text"
                                    size="small"
                                    style="color: #368029"
                            >升级</Button>-->

                            <Button 
                                    type="text"
                                    size="small"
                                    style="color: #363591"
                                    @click="invoice(row)"
                                    v-if="row.isInvoice == '0'"
                            >开票</Button>
                            <Button
                                    type="text"
                                    size="small"
                                    style="color: red"
                                    @click="stop(row)"
                                    v-if="row.status == '生效中' "
                            >终止</Button>
                            <Button
                                    type="text"
                                    size="small"
                                    style="color:#2db7f5"
                                    @click="editInfo(row)"
                                    v-if="row.status == '未开始' || row.status == '生效中'"
                            >编辑</Button>
                            <Button type="text"
                                    size="small"
                                    style="color:#ed4014"
                                    @click="del(row)"
                                    v-if="row.status == '未开始'"
                            >删除</Button>
                        </template>
                    </Table>
                    <!-- 用户列表 -->
                </div>
                <!-- 分页器 -->
                <Row type="flex" justify="end" class="page">
                    <Page
                            :total="totalSize"
                            show-total
                            show-elevator
                            :current="current"
                            @on-change="changeCurrent"
                    ></Page>
                </Row>
                <!-- 分页器 -->
            </Card>
        </div>


        <div v-if="merchantCustomerAddPage == true">
            <merchantCustomerAdd @changeStatus="showMerchantStaffAddStatus" :packageId="packageId"></merchantCustomerAdd>
        </div>

      <Modal
        v-model="stopModalShow"
        title="终止操作"
        :footer-hide="true"
        @on-visible-change="stopFormModalChange"
      >
        <Form ref="stopForm" :label-width="80" :model="stopForm" :rules="stopFormRule">
          <FormItem label="理由描述" prop="remarks">
            <Input v-model="stopForm.remarks" type="textarea" :rows="4" placeholder="理由描述" />
          </FormItem>
          <FormItem>
            <ButtonGroup>
              <Button type="text" size="large" @click="stopCancel()">取消</Button>
              <Button type="primary" size="large" @click="stopFormOk('stopForm')">确定</Button>
            </ButtonGroup>
          </FormItem>
        </Form>
      </Modal>
    </div>
</template>

<<script>
    import {
        getRequest,
        postRequest,
        putRequest,
        deleteRequest,
        uploadFileRequest
    } from "@/libs/axios";
    import merchantCustomerAdd from "./merchant-customer-add";
    import { uploadOperationImage2AliOssURl } from "@/api/index";

import industryView from "./industry";

    export default {
        name: "merchant-customer",
        components: {
            merchantCustomerAdd,
                industryView
        },
        data() {
             const stopFormRemarks = (rule, value, callback) => {
                if (value.length > 100) {
                    callback(new Error("不能超过100个字"));
                    return;
                }
                if (value === "") {
                    callback(new Error("必须输入理由"));
                    return;
                }
                callback();
                };
            return {
                packageId: "",
                merchantCustomerAddPage: false,
                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                searchItem: {
                    contractNumber: null,
                    name: null,
                    province: null,
                    city: null,
                    mainIndustry: null,
                    secondIndustry: null ,
                    status: null 
                },
                statusList: [
                    {name: '已终止',val:"1"},
                    {name: '生效中',val:"0"},
                    {name: '未开始',val:"10"},
                    {name: '已结束',val:"20"}
                ],
                columns: [
                    {
                        title: '操作',
                        align: 'center',
                        fixed: 'left',
                        slot: "action",
                        minWidth: 200,
                        width: 280,
                    },
                    {
                        title: '合同号',
                        key: 'contractNumber',
                        minWidth: 120,
                    },
                    {
                        title: '商户名称',
                        key: 'name',
                        minWidth: 100,
                    },
                    {
                        title: '省/市',
                        key: 'address',
                        minWidth: 150,
                    },
                    {
                        title: '行业',
                        key: 'industry',
                        minWidth: 100,
                    },
                    {
                        title: '状态',
                        key: 'status',
                        minWidth: 100,
                    },
                    {
                        title: '套餐',
                        key: 'serviceName',
                        minWidth: 100,
                    },
                    {
                        title: '应收款（元）',
                        key: 'receivables',
                        minWidth: 130,
                    },
                    {
                        title: '开票状态',
                        key: 'dateTime',
                        minWidth: 150,
                        render: (h, params) => {
                            if(params.row.isInvoice == '0') {
                                return h('span', '未开票');
                            }else if(params.row.isInvoice == '1') {
                                return h('span', '已开票');
                            }
                        }
                    },
                    {
                        title: '套餐有效期',
                        key: 'dateTime',
                        minWidth: 200,
                    }
                ],
                packageList: [],
                TableLoading: false,
                current: 1,
                totalSize: 0,
                provincelist: [],
                citylist: [],
                industryView: 'industryView',
                stopModalShow: false,
                selectRow:{},
                stopForm: {
                    remarks:"",
                    id:""
                },
                stopFormRule: {
                remarks: [{ validator: stopFormRemarks, trigger: "blur" }]
            },
            }
        },

        created: function() {
            this.userToken = {
                jwttoken: localStorage.getItem("jwttoken")
            };
        },
        methods: {
            showMerchantStaffAddStatus(e) {
                this.merchantCustomerAddPage = e;
                this.search();
            },

            addInfo() {
                this.setStore("pageStatus", "add");
                this.merchantCustomerAddPage = true;
            },
            //编辑
            editInfo(item) {
                console.info(JSON.stringify(item))
                var pageStatus = '';
                if (item.status == '未开始'){
                    pageStatus = 'edit1';
                }else if (item.status == '生效中'){
                    pageStatus = 'edit2';
                }
                this.setStore("pageStatus", pageStatus);
                this.packageId = '' + item.id;
                this.merchantCustomerAddPage = true;
            },
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = "展开";
                    this.dropDownIcon = "ios-arrow-down";
                } else {
                    this.dropDownContent = "收起";
                    this.dropDownIcon = "ios-arrow-up";
                }
                this.drop = !this.drop;
            },
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
                    "/system/area/city/"+this.searchItem.province
                ).then(res => {
                    if (res.code == 200) {
                        this.citylist = res.data;
                        this.searchItem.areaId = '';
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            },
            search(){
                this.current = 1;
                this.totalSize = 0;
                this.getPackageList();
            },

            init(){
                this.getPackageList();
                this.getprovincelist();
            },

            refresh(){

            },

            del(row) {
                console.info(JSON.stringify(row))
                var name = row.name ? row.name : '';
                var id = row.id;
                this.$Modal.confirm({
                    title: "删除确认",
                    content: '您确定要删除' + name + '套餐吗？',
                    onOk: () => {
                        postRequest('/merchant/merchantPackageInfo/delete?id='+ id).then(res => {
                            if(res.code == 200){
                                this.search();
                            }
                        });
                    },
                    onCancel: () => {
                        // this.$Message.info('Clicked cancel');
                    }
                });
            },
            stopFormOk:function(form){
                var name = this.selectRow.name ? this.selectRow.name : '';
                this.stopForm.id = this.selectRow.id;
                this.$refs[form].validate(valid => {
                    if (valid) {
                        this.$Modal.confirm({
                        title: "终止确认",
                        content: '您确定要终止' + name + '套餐吗？',
                        onOk: () => {
                            postRequest('/merchant/merchantPackageInfo/stop', this.stopForm).then(res => {
                                this.stopModalShow = false;
                                if(res.code == 200){
                                   this.search();
                                }else{
                                    this.msgErr("操作失败");
                                }
                            });
                        },
                        onCancel: () => {
                        }
                    });
                    }
                });
                
            },
            stopCancel: function(){
                 this.stopModalShow = false;
                 this.stopFormModalChange();
            },
            stopFormModalChange: function(){
                 this.stopForm.id = "";
                 this.stopForm.remarks="";
            },
            stop(row) {
                this.stopModalShow = true;
                this.selectRow = row;
            },

            invoice(row) {
                console.info(JSON.stringify(row))
                var contractNumber = row.contractNumber ? row.contractNumber : '';
                var id = row.id;
                this.$Modal.confirm({
                    title: "开票确认",
                    content: '合同号为' + contractNumber + '是否已开具发票？',
                    onOk: () => {
                        postRequest('/merchant/merchantPackageInfo/invoice?id='+ id).then(res => {
                            if(res.code == 200){
                                for (let obj of this.packageList){
                                    if (obj.id == id){
                                        obj.isInvoice = '1';
                                    }
                                }
                            }
                        });
                    },
                    onCancel: () => {
                        // this.$Message.info('Clicked cancel');
                    }
                });
            },


            //查询列表
            getPackageList() {
                this.TableLoading = true;
                postRequest('/merchant/merchantPackageInfo/list?isAsc=DESC&orderByColumn=1&pageNum='+ this.current +'&pageSize=10', this.searchItem).then(res => {
                    if(res.code == 200){
                        // console.log(res);
                        this.packageList = res.data.records
                        this.current = res.data.current
                        this.totalSize = res.data.total
                        this.TableLoading = false
                    }else {
                        this.TableLoading = false
                        this.msgErr(res.msg)
                    }
                });
            },

            // 分页（点击第几页）
            changeCurrent: function (current) {
                this.current = current;
                this.getPackageList();
            },

            // 全局提示
            msgOk(txt) {
                this.$Message.info({
                    content: txt,
                    duration: 3
                });
            },

            msgErr(txt) {
                this.$Message.error({
                    content: txt,
                    duration: 3
                });
            },

            //返回列表
            back() {
                this.$emit("changeStatus", false);
            },
            mainIndustryId:function(val){
                this.searchItem.mainIndustry=val;
            }
            ,secondIndustryId:function(val){
                this.searchItem.secondIndustry=val;
            },
            searchFormReset: function () {
                this.searchItem.contractNumber= null;
                this.searchItem.name= null;
                this.searchItem.province= null;
                this.searchItem.city= null;
                this.searchItem.mainIndustry=null;
                this.searchItem.secondIndustry= null;
                this.searchItem.isStop=null;
                if(this.$refs.industryViewChild){
                    this.$refs.industryViewChild.reset();
                }
            }

        },
        mounted() {
            this.init();
        }
    };
</script>
<style lang="less" scoped>
    .operation {
        margin-bottom: 2vh;
    }
</style>
