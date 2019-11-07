<template>
    <div v-if="viewDialogVisible"  style="height: 100%">
        <div style="min-height: 100%">
            <Card style="height: 100%">
                <p slot="title">分账流水</p>
                <a href="#" slot="extra">
                    <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
                </a>
                <div>
                    <Card :bordered="false" style="margin-bottom:2px">
                        <Form ref="searchForm" label-position="right" :label-width="75" :model="searchForm" inline>
                            <FormItem label="订单号：" span="24" style="width:30%">
                                <Input v-model="searchForm.orderNo" placeholder="请填写订单号"/>
                            </FormItem>
                            <FormItem v-if="type==0" label="商户名称：" span="24" style="width:30%">
                                <Input v-model="searchForm.merchantName" placeholder="请填写商户名称"/>
                            </FormItem>
                            <FormItem v-if="type==1" label="品牌名称：" span="24" style="width:30%">
                                <Input v-model="searchForm.merchantName" placeholder="请填写品牌名称"/>
                            </FormItem>
                            <FormItem label="省/市：" span="24"  style="width:35%">
                                <Cascader :data="addressData" :load-data="addressLoad" v-model="addressValue"></Cascader>
                            </FormItem>
                            <FormItem label="优惠券名称：" span="24" style="width:30%">
                                <Input v-model="searchForm.couponName" placeholder="请填写优惠券名称"/>
                            </FormItem>
                            <FormItem label="支付方式：" span="24" style="width:30%">
                                <Select v-model="searchForm.payType" placeholder="请选择支付方式">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in payTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="渠道流水号：" span="24" style="width:30%">
                                <Input v-model="searchForm.channelNo" placeholder="请填写渠道流水号"/>
                            </FormItem>
                            <FormItem label="交易类型：" span="24" style="width:30%">
                                <Select v-model="searchForm.tradeType" placeholder="请选择交易类型">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in tradeTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <!--<FormItem label="套餐：" span="24"  style="width:20%">-->
                            <!--<Select v-model="searchForm.expandType" style="width:100%">-->
                            <!--<Option v-for="item in expandTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                            <!--</Select>-->
                            <!--</FormItem>-->
                            <FormItem label="交易时间：" span="35"  style="width:40%">
                                <DatePicker :value="searchForm.tradeTimeRange" type="datetimerange" placeholder="请选择交易时间" style="width: 200px"></DatePicker>
                            </FormItem>
                            <FormItem span="20" :label-width="1" style="width:23%">
                                <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')" style="margin-right: 5px">搜索</Button>
                                <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                <Button icon="md-refresh" @click="reset">重置</Button>
                            </FormItem>
                        </Form>
                    </Card>
                    <Card>
                        <Row>
                            <Table
                                    :loading="TableLoading"
                                    border
                                    :columns="type==0?tableColumns:tableColumns1"
                                    :data="listData"
                                    sortable="custom"
                                    ref="table"
                            >
                                <template slot-scope="{ row }" slot="action">
                                    <Button
                                            type="info"
                                            style="margin-right: 5px"
                                            size="small"
                                            @click="showDetail(row)"
                                    >查看详情</Button>
                                </template>
                            </Table>
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
                    </Card>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    export default {
        name: "thawingFlow",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                tradeTypeList:[{value:'1',label:'支付'},{value:'2',label:'退款'}],
                payTypeList:[{value:'1',label:'微信'},{value:'2',label:'支付宝'}],
                TableLoading: false,
                totalSize: 0,
                listData: [],
                addressValue:[],
                addressData:[],
                selectDataList: [],
                tableColumns: [
                    {
                        title: "订单号",
                        width: 200,
                        key: "orderNo"
                    },
                    {
                        title: "ping++交易号",
                        width: 200,
                        key: "tradeNo"
                    },
                    {
                        title: "优惠券名称",
                        width: 200,
                        align: "center",
                        key: "couponName",
                    },
                    {
                        title: "券码",
                        width: 200,
                        key: "barcode"
                    },
                    {
                        title: "核销时间",
                        width: 200,
                        key: "verifiedTime"
                    },
                    {
                        title: "商户名称",
                        minWidth: 250,
                        key: "merchantName"
                    },
                    {
                        title: "省/市",
                        minWidth: 250,
                        key: "city"
                    },
                    {
                        title: "核销金额（元）",
                        minWidth: 250,
                        key: "verifiedAmount"
                    },
                    {
                        title: "平台分润(%)",
                        width: 200,
                        align: "center",
                        key: "platformProfitRate",
                    },
                    {
                        title: "平台分润费（含通道）",
                        width: 250,
                        key: "totalFee"
                    },
                    {
                        title: "平台分润费（元）",
                        minWidth: 250,
                        key: "platformProfitFee"
                    },
                    {
                        title: "支付通道费(元)",
                        minWidth: 250,
                        key: "payChannelFee"
                    },
                    {
                        title: "核销结算金额（元）",
                        width: 250,
                        align: "center",
                        key: "paidAmount",
                    },
                    {
                        title: "支付方式",
                        width: 100,
                        key: "payType"
                    },
                    {
                        title: "渠道流水号",
                        minWidth: 250,
                        key: "channelNo"
                    },
                    {
                        title: "交易类型",
                        minWidth: 150,
                        key: "tradeTypeDesc"
                    },
                    {
                        title: "交易时间",
                        minWidth: 150,
                        key: "tradeTime"
                    },
                    {
                        title: "解冻时间",
                        minWidth: 150,
                        key: "tradeTime"
                    }
                ],
                tableColumns1: [
                    {
                        title: "订单号",
                        width: 200,
                        key: "orderNo"
                    },
                    {
                        title: "ping++交易号",
                        width: 200,
                        key: "tradeNo"
                    },
                    {
                        title: "优惠券名称",
                        width: 200,
                        align: "center",
                        key: "couponName",
                    },
                    {
                        title: "券码",
                        width: 200,
                        key: "barcode"
                    },
                    {
                        title: "核销时间",
                        width: 200,
                        key: "verifiedTime"
                    },
                    {
                        title: "品牌名称",
                        minWidth: 250,
                        key: "merchantName"
                    },
                    {
                        title: "核销金额（元）",
                        minWidth: 250,
                        key: "verifiedAmount"
                    },
                    {
                        title: "平台分润(%)",
                        width: 250,
                        align: "center",
                        key: "platformProfitRate",
                    },
                    {
                        title: "平台分润费（含通道）",
                        width: 250,
                        key: "totalFee"
                    },
                    {
                        title: "平台分润费（元）",
                        minWidth: 250,
                        key: "platformProfitFee"
                    },
                    {
                        title: "支付通道费(元)",
                        minWidth: 250,
                        key: "payChannelFee"
                    },
                    {
                        title: "核销结算金额（元）",
                        width: 250,
                        align: "center",
                        key: "paidAmount",
                    },
                    {
                        title: "支付方式",
                        width: 100,
                        key: "payType"
                    },
                    {
                        title: "渠道流水号",
                        minWidth: 250,
                        key: "channelNo"
                    },
                    {
                        title: "交易类型",
                        minWidth: 150,
                        key: "tradeTypeDesc"
                    },
                    {
                        title: "交易时间",
                        minWidth: 150,
                        key: "tradeTime"
                    },
                    {
                        title: "解冻时间",
                        minWidth: 150,
                        key: "tradeTime"
                    }
                ],
                refreshData:{},
                searchForm: {
                    "orderNo":'',
                    "merchantName": '',
                    "couponName":'',
                    merchantType:1,
                    "payType": '',
                    "channelNo": '',
                    "tradeType": '',
                    tradeTimeRange: ['', ''],
                    current: 1,
                    pageSize: 10
                },
                current: 1,
                addressData:[],
                type:0,
                TokerViewDialogVisible:false,
                DownViewDialogVisible:false,
                showViewDialogVisible:false,
            }
        },
        methods:{
            resetRow(type){
                this.reset();
                this.getProvinceList();
                this.type = type;
                this.searchForm.merchantType = type==0?0:1;
            },
            getProvinceList(formData) {
                postRequest(`/system/area/province/list`,{}).then(res => {
                    if (res.code === "200") {
                        console.log(res);
                        this.addressData = res.data||[];
                        if(this.addressData.length){
                            this.addressData.forEach(function(v){
                                v.value = v.provinceCode
                                v.label = v.shortName;
                                v.children= [];
                                v.loading = false
                            })
                        }
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            addressLoad(item,callback){
                item.loading = true;
                getSyncRequest("/system/area/city/" + item.provinceCode).then(res =>{
                    if (res.code === "200") {
                        item.children = res.data||[];
                        item.loading = false;
                        if(item.children.length){
                            item.children.forEach(function(v){
                                v.label = v.shortName;
                                v.value = v.cityCode
                            })
                        }
                        callback();
                    } else {
                        this.$Message.error("获取数据失败");
                        item.loading = false;
                        callback();
                    }
                });
            },
            search() {
                this.searchForm.current = 1;
                this.current= 1;
                this.loadTableData();
            },
            reset(){
                this.searchForm.orderNo= '';
                this.searchForm.merchantName= '';
                this.searchForm.couponName= '';
                this.searchForm.payType= '';
                this.searchForm.channelNo= '';
                this.searchForm.tradeType= '';
                this.searchForm.tradeTimeRange= ['', '']
                this.searchForm.current = 1;
                this.current= 1;
                this.loadTableData();
            },
            loadTableData(page) {
                this.searchForm.current = page||1;
                this.searchForm.pageNum = page||1;
                this.searchForm.provinceCode = this.addressValue[0];
                this.searchForm.cityCode =  this.addressValue[1];
                this.totalSize = 0;
                this.listData = [];
                this.TableLoading = true;
                postRequest(`/trade/merchant/bill/transaction/unfreeze/record/list?pageNum=${page||1}&pageSize=10`,this.searchForm
                ).then(res => {
                    this.TableLoading = false;
                    if (res.code === "200") {
                        this.totalSize = res.data.total;
                        this.listData = res.data.records;
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            changeCurrent(current) {
                if (this.searchForm.current != current) {
                    this.searchForm.current = current;
                    this.loadTableData(current);
                }
            },
            close(){
                this.$emit('setViewDialogVisible', false)
            }
        },
        created(){
        }
    }
</script>

<style scoped>
    .operation {
        margin-bottom: 2vh;
    }
</style>
