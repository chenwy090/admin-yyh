<template>
    <div style="height: 100%">
        <div v-if="!transactionFlowDialogVisible&&!thawingFlowDialogVisible" style="min-height: 100%">
            <Card style="height: 100%">
                <div>
                    <Card :bordered="false" style="margin-bottom:2px">
                        <Form ref="searchForm" label-position="right" :label-width="75" :model="searchForm" inline>
                            <FormItem label="商户名称：" span="24" style="width:30%">
                                <Input v-model="searchForm.merchantName" placeholder="请填写商户名称"/>
                            </FormItem>
                            <FormItem label="省/市：" span="24"  style="width:30%">
                                <Cascader :data="addressData" :load-data="addressLoad" v-model="addressValue"></Cascader>
                            </FormItem>
                            <FormItem span="20" :label-width="1" style="width:30%">
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
                                            @click="transactionFlowDialog(row)"
                                    >交易流水</Button>
                                    <Button
                                            type="info"
                                            style="margin-right: 5px"
                                            size="small"
                                            @click="thawingFlowDialog(row)"
                                    >分账流水</Button>
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
        <thawingFlow ref="thawingFlowModal" :viewDialogVisible="thawingFlowDialogVisible" @setViewDialogVisible="closeTab"></thawingFlow>
        <transactionFlow ref="transactionFlowModal" :viewDialogVisible="transactionFlowDialogVisible" @setViewDialogVisible="closeTab"></transactionFlow>
    </div>
</template>

<script>
    import thawingFlow from './thawingFlow';
    import transactionFlow from './transactionFlow';
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    export default {
        name: "merchantMany",
        components:{thawingFlow,transactionFlow},
        data(){
            return{
                cType: '0',
                // mini: 微信小程序 IOS: 苹果app Android: 安卓app
                // 1: 待付款 2:已取消 3: 已付款 4: 退款 5: 已完成
                sourceList:[{value:'mini',label:'微信小程序'},{value:'IOS',label:'苹果app'},{value:'Android',label:'安卓app'}],
                statusList:[{value:'1',label:'待付款'},{value:'2',label:'已取消'},{value:'3',label:'已付款'},{value:'4',label:'退款'},{value:'5',label:'已完成'}],
                TableLoading: false,
                totalSize: 0,
                listData: [],
                addressData:[],
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
                        title: "商户名称",
                        width: 200,
                        key: "merchantName"
                    },
                    {
                        title: "省/市",
                        width: 220,
                        align: "center",
                        key: "city",
                    },
                    {
                        title: "可提现金额(元)",
                        width: 200,
                        align: "center",
                        key: "balanceAmount",
                    },
                    {
                        title: "冻结金额(元)",
                        width: 200,
                        key: "freezeAmount"
                    },
                    {
                        title: "更新时间",
                        minWidth: 250,
                        key: "modifiedTime"
                    }
                ],
                searchForm: {
                    "merchantName":'',
                    "merchantType": '0',
                    current: 1,
                    pageSize: 10
                },
                current: 1,
                addressData:[],
                options2:{},
                options1:{},
                thawingFlowDialogVisible:false,
                transactionFlowDialogVisible:false,
            }
        },
        methods:{
            search() {
                this.searchForm.current = 1;
                this.current= 1;
                this.loadTableData();
            },
            reset(){
                this.searchForm.merchantName= '';
                this.searchForm.provinceCode = '';
                this.searchForm.cityCode =  '';
                this.addressValue = [];
                this.searchForm.current = 1;
                this.current= 1;
                this.loadTableData();
                this.getProvinceList();
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
            loadTableData(page) {
                this.searchForm.current = page||1;
                this.searchForm.pageNum = page||1;
                this.searchForm.provinceCode = this.addressValue[0];
                this.searchForm.cityCode =  this.addressValue[1];
                this.totalSize = 0;
                this.listData = [];
                this.TableLoading = true;
                postRequest(`/trade/merchant/bill/summary/list?pageNum=${page||1}&pageSize=10`,this.searchForm
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
            thawingFlowDialog(row){
                this.thawingFlowDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs['thawingFlowModal'].resetRow(0, {merchantName: row.merchantName})
                })
            },
            transactionFlowDialog(row){
                this.transactionFlowDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs['transactionFlowModal'].resetRow(0, {merchantName: row.merchantName})
                })
            },
            changeCurrent(current) {
                if (this.searchForm.current != current) {
                    this.searchForm.current = current;
                    this.loadTableData(current);
                }
            },
            closeTab(e){
                this.transactionFlowDialogVisible=false;
                this.thawingFlowDialogVisible=false;
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
