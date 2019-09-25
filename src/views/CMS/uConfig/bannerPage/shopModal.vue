<template>
    <Modal  width="800"
            v-model="viewDialogVisible"
            title="内容选择"
            :closable="false"
            :mask-closable="false"
            footer-hide>
        <div>
            <div>
                <Card :bordered="false" style="margin-bottom:2px">
                    <Form ref="modalForm" label-position="right" :label-width="100" :model="modalForm" inline>
                        <FormItem label="商户名称" span="24" style="width:45%">
                            <Input v-model="modalForm.name" placeholder="商户名称" :maxlength=20 />
                        </FormItem>
                        <FormItem :label-width="0">
                            <span>所在地区：</span>
                            <Select
                                    v-model="modalForm.provinceId"
                                    style="width:150px"
                                    clearable
                                    @on-change="getcitylist"
                            >
                                <Option
                                        v-for="(item,index) in provincelist"
                                        :key="index"
                                        :value="item.provinceCode"
                                >{{item.provinceName}}</Option>
                            </Select>
                            <Select
                                    v-model="modalForm.cityId"
                                    style="width:150px"
                                    clearable
                                    @on-change="getarealist"
                            >
                                <Option
                                        v-for="(item,index) in citylist"
                                        :key="index"
                                        :value="item.cityCode"
                                >{{item.cityName}}</Option>
                            </Select>
                            <Select v-model="modalForm.areaId" style="width:150px" clearable>
                                <Option
                                        v-for="(item,index) in arealist"
                                        :key="index"
                                        :value="item.areaCode"
                                >{{item.areaName}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem span="24" :label-width="1" style="float: right;">
                            <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')" style="margin-right: 5px">搜索</Button>
                            <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                            <Button icon="md-refresh" @click="reset">重置</Button>
                        </FormItem>
                    </Form>
                </Card>
                <Row>
                    <RadioGroup v-model="selectIndex" @on-change="selectBusiness()" style="width: 100%;">
                        <Table
                                :loading="TableLoading"
                                border
                                :columns="tableColumns"
                                :data="listData"
                                sortable="custom"
                                ref="table"
                        >
                            <template slot-scope="{ row,index }" slot="action">
                                <Radio :label="index"><span></span></Radio>
                            </template>
                            <template
                                    slot-scope="{ row }"
                                    slot="address"
                            >{{row.province}} {{row.city}} {{row.district}} {{row.address}}</template>
                        </Table>
                    </RadioGroup>
                </Row>
                <!-- 分页 -->
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
        </div>
        <div style="text-align: center;margin: 10px 0;">
            <Button style="margin-left: 8px;" type="primary" @click="contentSave">保存</Button>
            <Button style="margin-left: 8px;" @click="contentClose">关闭</Button>
        </div>
    </Modal>
</template>

<script>
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    export default {
        name: "shopModal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                listData:[],
                selectIndex:'',
                TableLoading:'',
                modalForm:{
                    name:'',
                    current: 1,
                    provinceId:'',
                    cityId:'',
                    areaId:'',
                },
                totalSize: 0,
                current: 1,
                selectIndex:'',
                provincelist:[],
                citylist:[],
                arealist:[],

                tableColumns: [
                    {
                        title: "操作",
                        width: 80,
                        align: "center",
                        slot: "action",
                        fixed: "left"
                    },
                    {
                        title: "商户编号",
                        key: "merchantId",
                        sortable: true,
                        align: "center",
                        minWidth: 140
                    },
                    {
                        title: "商户名称",
                        key: "name",
                        align: "center",
                        minWidth: 120,
                        key: "name" //新店
                    },
                    {
                        title: "地址",
                        key: "address",
                        align: "center",
                        slot: "address",
                        minWidth: 220
                    },
                ],
            }
        },
        methods:{
            //获取省份信息数据
            getprovincelist() {
                postRequest("/system/area/province/list").then(res => {
                    if (res.code == 200) {
                        this.provincelist = res.data;
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            },
            //根据省份code获取城市信息数据
            getcitylist() {
                getRequest("/system/area/city/" + this.modalForm.provinceId).then(
                    res => {
                        if (res.code == 200) {
                            this.citylist = res.data;
                            this.modalForm.areaId = "";
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }
                );
            },
            //根据城市code获取区县信息数据
            getarealist() {
                getRequest("/system/area/district/" + this.modalForm.cityId).then(
                    res => {
                        if (res.code == 200) {
                            this.arealist = res.data;
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }
                );
            },
            resetRow(){
                this.getprovincelist();
                this.currentTab = '';
                this.modalForm.current= 1;
                this.current= 1;
                this.modalForm.name = '';
                this.loadTableData();

            },
            selectBusiness(index){
                switch (index) {
                case 1:
                    this.selectIndex2 = '';
                    break;
                case 2:
                    this.selectIndex1 = '';
                    break;
                }
            },
            search(){
                this.modalForm.current= 1;
                this.current= 1;
                this.loadTableData();
            },
            reset(){
                this.modalForm.current= 1;
                this.current= 1;
                this.modalForm.name = '';
                this.loadTableData();
            },
            loadTableData(page){
                this.modalForm.current = page||1;
                var that = this;
                // this.selectDataList = [];
                this.totalSize = 0;
                this.TableLoading = true;
                let params = {
                    pageNum: this.modalForm.current,
                    pageSize: 10,
                    name: this.modalForm.name,
                    provinceId: this.modalForm.provinceId,
                    cityId: this.modalForm.cityId,
                    areaId: this.modalForm.areaId,
                }
                postRequest("/merchant/merchantInfo/list?pageNum=" +
                    this.modalForm.current +
                    "&pageSize=" +
                    10,params
                ).then(res => {
                    this.TableLoading = false;
                    if (res.code === "200") {
                        this.totalSize = res.data.total;
                        this.listData = res.data.records||[];
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            changeCurrent(current) {
                if (this.modalForm.current != current) {
                    this.modalForm.current = current;
                    this.loadTableData(current);
                }
            },
            contentClose(){
                this.$emit('setViewDialogVisible', false)
            },
            contentSave(){
                if(!this.selectIndex){
                    this.$Message.error('请选择');
                    return;
                }
                this.$emit('setViewDialogVisible', this.selectDataList)
            }
        },
        created(){
        }
    }
</script>

<style scoped>
    .ivu-table-wrapper{
        overflow: visible;
    }
</style>
