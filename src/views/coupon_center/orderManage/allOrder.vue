<template>
    <div style="height: 100%">
        <div v-if="!showViewDialogVisible" style="min-height: 100%">
            <Card style="height: 100%">
                <div>
                    <Card :bordered="false" style="margin-bottom:2px">
                        <Form ref="searchForm" label-position="right" :label-width="75" :model="searchForm" inline>
                            <FormItem label="领取人手机：" span="24" style="width:30%">
                                <Input v-model="searchForm.phoneNumber" placeholder="请填写领取人手机"/>
                            </FormItem>
                            <FormItem label="订单号：" span="24" style="width:30%">
                                <Input v-model="searchForm.orderNo" placeholder="请填写订单号"/>
                            </FormItem>
                            <FormItem label="状态：" span="24" style="width:30%">
                                <Select v-model="searchForm.status" placeholder="请选择状态">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="领取终端：" span="24" style="width:30%">
                                <Select v-model="searchForm.source" placeholder="请选择领取终端">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in sourceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <!--<FormItem label="套餐：" span="24"  style="width:20%">-->
                            <!--<Select v-model="searchForm.expandType" style="width:100%">-->
                            <!--<Option v-for="item in expandTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                            <!--</Select>-->
                            <!--</FormItem>-->
                            <FormItem label="领取时间：" span="35"  style="width:40%">
                                <DatePicker
                                        :value="searchForm.gmtCreateStart"
                                        type="date"
                                        placeholder
                                        style="width: 48%"
                                        :options="options1"
                                        @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                                ></DatePicker>
                                <div style="width: 2%;display: inline-block"></div>
                                <DatePicker
                                        :value="searchForm.gmtCreateEnd"
                                        type="date"
                                        placeholder
                                        style="width: 48%"
                                        :options="options2"
                                        @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                                ></DatePicker>
                            </FormItem>
                            <FormItem span="20" :label-width="1" style="width:23%">
                                <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')" style="margin-right: 5px">搜索</Button>
                                <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                <Button icon="md-refresh" @click="reset">重置</Button>
                            </FormItem>
                        </Form>
                    </Card>
                    <Card>
                        <Row class="operation">
                            <Button type="primary" icon="md-refresh" @click="refech">刷新</Button>
                            <span v-if="refreshData&&refreshData.allOrderCount">总共{{refreshData.allOrderCount}}单，待付款{{refreshData.pendingPaymentOrderCount}}单，已付款{{refreshData.paidOrderCount}}单，已取消{{refreshData.cancelledOrderCount}}单，退款{{refreshData.refundOrderCount}}单</span>
                            <!--<Button type="primary" icon="ios-download-outline" @click="downFn">下载</Button>-->
                        </Row>
                        <Row>
                            <Table
                                    :loading="TableLoading"
                                    border
                                    :columns="tableColumns"
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
        <!--<TokerModal ref="TokerModal" :viewDialogVisible="TokerViewDialogVisible" @setViewDialogVisible="closeTab" @search="search"></TokerModal>-->
        <!--<DownModal ref="DownModal" :viewDialogVisible="DownViewDialogVisible" @setViewDialogVisible="closeTab"></DownModal>-->
        <showDetailModal ref="showDetailModal" :viewDialogVisible="showViewDialogVisible" @setViewDialogVisible="closeTab"></showDetailModal>
    </div>
</template>

<script>
    import showDetailModal from './showDetailModal';
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    export default {
        name: "allOrder",
        components:{showDetailModal},
        data(){
            return{
                // mini: 微信小程序 IOS: 苹果app Android: 安卓app
                // 1: 待付款 2:已取消 3: 已付款 4: 退款 5: 已完成
                sourceList:[{value:'mini',label:'微信小程序'},{value:'IOS',label:'苹果app'},{value:'Android',label:'安卓app'}],
                statusList:[{value:'1',label:'待付款'},{value:'2',label:'已取消'},{value:'3',label:'已付款'},{value:'4',label:'退款'},{value:'5',label:'已完成'}],
                TableLoading: false,
                totalSize: 0,
                listData: [],
                addressValue:[],
                selectDataList: [],
                tableColumns: [
                    {
                        title: "操作",
                        width: 200,
                        align: "center",
                        slot: "action",
                        fixed: "left"
                    },
                    {
                        title: "订单编号",
                        width: 200,
                        key: "orderNo"
                    },
                    {
                        title: "状态",
                        width: 220,
                        align: "center",
                        key: "statusStr",
                    },
                    {
                        title: "优惠券ID",
                        width: 200,
                        align: "center",
                        key: "couponId",
                    },
                    {
                        title: "优惠券标题",
                        width: 200,
                        key: "couponTitle"
                    },
                    {
                        title: "所属商户",
                        minWidth: 250,
                        key: "merchantName"
                    },
                    {
                        title: "数量",
                        minWidth: 150,
                        key: "amount"
                    },
                    {
                        title: "单价",
                        width: 100,
                        align: "center",
                        key: "price",
                    },
                    {
                        title: "总价",
                        width: 100,
                        key: "totalPrice"
                    },
                    {
                        title: "U贝抵扣",
                        minWidth: 250,
                        key: "ubayDiscount"
                    },
                    {
                        title: "红包抵扣",
                        minWidth: 150,
                        key: "redEnvelopeDiscount"
                    },
                    {
                        title: "实付款",
                        width: 100,
                        align: "center",
                        key: "realPay",
                    },
                    {
                        title: "买家",
                        width: 100,
                        key: "phoneNumber"
                    },
                    {
                        title: "付款时间",
                        minWidth: 250,
                        key: "payTime"
                    },
                    {
                        title: "渠道",
                        minWidth: 150,
                        key: "source"
                    }
                ],
                refreshData:{},
                searchForm: {
                    "gmtCreateEnd":'',
                    "gmtCreateStart": '',
                    "orderNo":'',
                    "phoneNumber": '',
                    "source": '',
                    "status": '',
                    current: 1,
                    pageSize: 10
                },
                current: 1,
                addressData:[],
                options2:{},
                options1:{},
                TokerViewDialogVisible:false,
                DownViewDialogVisible:false,
                showViewDialogVisible:false,
            }
        },
        methods:{
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.searchForm.gmtCreateStart = datetime;
                    this.options2 = {
                        disabledDate(date){
                            return date.valueOf() <  new Date(datetime)-1000*60*60*24;
                        }
                    }
                    break;
                case 2:
                    this.searchForm.gmtCreateEnd = datetime;
                    this.options1 = {
                        disabledDate(date){
                            return date.valueOf() < Date.now()-1000*60*60*24||date.valueOf() > new Date(datetime);
                        }
                    }
                    break;
                }
            },
            search() {
                this.searchForm.current = 1;
                this.current= 1;
                this.loadTableData();
            },
            reset(){
                this.searchForm.gmtCreateEnd= '';
                this.searchForm.gmtCreateStart= '';
                this.searchForm.orderNo= '';
                this.searchForm.phoneNumber= '';
                this.searchForm.source= '';
                this.searchForm.status= '';
                this.searchForm.current = 1;
                this.current= 1;
                this.loadTableData();
                this.refech();
            },
            loadTableData(page) {
                this.searchForm.current = page||1;
                this.searchForm.pageNum = page||1;
                this.totalSize = 0;
                this.listData = [];
                this.TableLoading = true;
                postRequest(`/trade/fund/account/order/page?pageNum=${page||1}&pageSize=10`,this.searchForm
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
            refech() {
                this.refreshData = {};
                getRequest(`/trade/fund/account/order/status`,null
                ).then(res => {
                    console.log(1111);
                    // this.TableLoading = false;
                    if (res.code === "200") {
                        this.refreshData = res.data.retData;
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            showDetail(row){
                this.showViewDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs['showDetailModal'].resetRow(row)
                })
            },
            changeCurrent(current) {
                if (this.searchForm.current != current) {
                    this.searchForm.current = current;
                    this.loadTableData(current);
                }
            },
            closeTab(e){
                this.TokerViewDialogVisible = false;
                this.DownViewDialogVisible=false;
                this.showViewDialogVisible=false;
            },
            close(){
                this.$emit("close",false);
            }
        },
        created(){
            this.reset();
        }
    }
</script>

<style scoped>
    .operation {
        margin-bottom: 2vh;
    }
</style>
