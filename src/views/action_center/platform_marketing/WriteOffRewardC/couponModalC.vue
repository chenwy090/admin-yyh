<template>
    <Modal  width="800"
            v-model="viewDialogVisible"
            title="优惠券选择"
            :closable="false"
            :mask-closable="false"
            footer-hide>
        <div>
            <Tabs type="card" @on-click="changeTab">
                <TabPane label="商超">
                    <div>
                        <Card :bordered="false" style="margin-bottom:2px">
                            <Form ref="copponForm1" label-position="right" :label-width="80" :model="copponForm1" inline>
                                <FormItem label="商家名称" span="24" style="width:45%">
                                    <Input v-model="copponForm1.merchantName" placeholder=" 请填写商家名称" :maxlength=20 />
                                </FormItem>
                                <!--<FormItem label="省/市" span="24"  style="width:50%">-->
                                <!--<Cascader :data="addressData" :load-data="addressLoad" v-model="addressValue"></Cascader>-->
                                <!--</FormItem>-->
                                <FormItem label="优惠券名称" span="24" style="width:25%">
                                    <Input v-model="copponForm1.couponName" placeholder=" 请填写优惠券名称" :maxlength=20 />
                                </FormItem>
                                <FormItem span="24" :label-width="1" style="float: right;">
                                    <Button type="primary" class="submit" icon="ios-search" @click="search1('searchForm')" style="margin-right: 5px">搜索</Button>
                                    <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                    <Button icon="md-refresh" @click="reset">重置</Button>
                                </FormItem>
                            </Form>
                        </Card>
                        <Row>
                            <Table
                                    :loading="TableLoading1"
                                    border
                                    :columns="tableColumns1"
                                    :data="listData1"
                                    sortable="custom"
                                    ref="table1"
                                    @on-selection-change="handleSelect1"
                            >
                                <template slot-scope="{ row,index }" slot="address">
                                    <div>{{row.province+'/'+row.city}}</div>
                                </template>
                                <template slot-scope="{ row,index }" slot="timer">
                                    <div v-if="row.dateType===1">{{row.startDate+'——'+row.endDate}}</div>
                                    <div v-if="row.dateType===2">永久有效</div>
                                </template>
                                <template slot-scope="{ row,index }" slot="isActivityCoupon">
                                    <div>{{row.isActivityCoupon==1?'否':'是'}}</div>
                                </template>
                            </Table>
                        </Row>
                        <!-- 分页 -->
                        <Row type="flex" justify="end" class="page">
                            <Page
                                    :total="totalSize1"
                                    show-total
                                    show-elevator
                                    @on-change="changeCurrent1"
                                    style="float: right"
                                    :current.sync="current1"
                            ></Page>
                        </Row>
                    </div>
                </TabPane>
                <TabPane label="商户">
                    <div>
                        <Card :bordered="false" style="margin-bottom:2px">
                            <Form ref="copponForm2" label-position="right" :label-width="80" :model="copponForm2" inline>
                                <FormItem label="商家名称" span="24" style="width:45%">
                                    <Input v-model="copponForm2.merchantName" placeholder=" 请填写商家名称" :maxlength=20 />
                                </FormItem>
                                <!--<FormItem label="省/市" span="24"  style="width:50%">-->
                                <!--<Cascader :data="addressData" :load-data="addressLoad" v-model="addressValue"></Cascader>-->
                                <!--</FormItem>-->
                                <FormItem label="优惠券名称" span="24" style="width:25%">
                                    <Input v-model="copponForm2.couponName" placeholder=" 请填写优惠券名称" :maxlength=20 />
                                </FormItem>
                                <FormItem span="24" :label-width="1" style="float: right;">
                                    <Button type="primary" class="submit" icon="ios-search" @click="search2('searchForm')" style="margin-right: 5px">搜索</Button>
                                    <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                    <Button icon="md-refresh" @click="reset">重置</Button>
                                </FormItem>
                            </Form>
                        </Card>
                        <Row>
                            <Table
                                    :loading="TableLoading2"
                                    border
                                    :columns="tableColumns2"
                                    :data="listData2"
                                    sortable="custom"
                                    ref="table2"
                                    @on-selection-change="handleSelect2"
                            >
                                <template slot-scope="{ row,index }" slot="address">
                                    <div>{{row.province+'/'+row.city}}</div>
                                </template>
                                <template slot-scope="{ row,index }" slot="timer">
                                    <div>{{row.useStartTime+' —— '+row.useEndTime}}</div>
                                </template>
                                <template slot-scope="{ row,index }" slot="isActivityCoupon">
                                    <div>{{row.isActivityCoupon==0?'否':'是'}}</div>
                                </template>
                            </Table>
                        </Row>
                        <!-- 分页 -->
                        <Row type="flex" justify="end" class="page">
                            <Page
                                    :total="totalSize2"
                                    show-total
                                    show-elevator
                                    @on-change="changeCurrent2"
                                    style="float: right"
                                    :current.sync="current2"
                            ></Page>
                        </Row>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <div style="text-align: center;margin: 10px 0;">
            <Button style="margin-left: 8px;" type="primary" @click="couponSave">保存</Button>
            <Button style="margin-left: 8px;" @click="couponClose">关闭</Button>
        </div>
    </Modal>
</template>

<script>
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    export default {
        name: "couponModal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                TableLoading1:'',
                TableLoading2:'',
                copponForm1:{
                    merchantName:'',
                    couponName:'',
                    current: 1,
                },
                copponForm2:{
                    merchantName:'',
                    couponName:'',
                    current: 1,
                },
                totalSize1: 0,
                totalSize2: 0,
                current1: 1,
                current2: 1,
                selectIndex:'',
                selectRow:{},
                // addressData:[],
                // addressValue:[],
                tableColumns1: [
                    {
                        type: 'selection', width: 60, align: 'center'
                    },
                    {
                        title: "商超名称",
                        minWidth:150,
                        key: "merchantName",
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Tooltip', {
                                    props: { placement: 'top' }
                                }, [
                                    h('span', {
                                        style: {
                                            display: 'inline-block',
                                            width: params.column._width*0.85+'px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        },
                                    }, params.row.shopName),
                                    h('span', {
                                        slot: 'content',
                                        style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                                    },params.row.shopName)
                                ])
                            ])
                        }
                    },
                    // {
                    //     title: "省/市",
                    //     minWidth:200,
                    //     slot: "address",
                    //     align: 'center',
                    // },
                    {
                        title: "优惠券名称",
                        minWidth:200,
                        key: "title",
                        align: 'center',
                    },
                    {
                        title: "有效期",
                        minWidth:300,
                        slot: "timer",
                        align: 'center',
                    },
                    {
                        title: "活动券",
                        minWidth:100,
                        slot: "isActivityCoupon",
                        align: 'center',
                    },
                ],
                tableColumns2: [
                    {
                        type: 'selection', width: 60, align: 'center'
                    },
                    {
                        title: "商家名称",
                        minWidth:150,
                        key: "merchantName",
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Tooltip', {
                                    props: { placement: 'top' }
                                }, [
                                    h('span', {
                                        style: {
                                            display: 'inline-block',
                                            width: params.column._width*0.85+'px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        },
                                    }, params.row.merchantName),
                                    h('span', {
                                        slot: 'content',
                                        style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                                    },params.row.merchantName)
                                ])
                            ])
                        }
                    },
                    // {
                    //     title: "省/市",
                    //     minWidth:200,
                    //     slot: "address",
                    //     align: 'center',
                    // },
                    {
                        title: "优惠券名称",
                        minWidth:200,
                        key: "title",
                        align: 'center',
                    },
                    {
                        title: "有效期",
                        minWidth:300,
                        slot: "timer",
                        align: 'center',
                    },
                    {
                        title: "活动券",
                        minWidth:100,
                        slot: "isActivityCoupon",
                        align: 'center',
                    },
                ],
                currentTab:'',
                listData1: [
                ],
                listData2: [
                ],
                selectDataList: [],
            }
        },
        methods:{
            resetRow(){
                this.currentTab = '';
                this.copponForm1.current= 1;
                this.current1= 1;
                this.copponForm2.current= 1;
                this.current2= 1;
                this.copponForm1.couponName = '';
                this.copponForm1.merchantName = '';
                this.copponForm2.couponName = '';
                this.copponForm2.merchantName = '';
                // this.addressValue = [];
                // this.copponForm.name = row.name;
                this.loadTableData1();
                this.selectDataList = [];
                this.handleSelectAll();
            },
            handleSelectAll () {
                this.$refs.table1.selectAll(false);
                this.$refs.table2.selectAll(false);
            },
            // getProvinceList(formData) {
            //     postRequest(`/system/area/province/list`,{}).then(res => {
            //         if (res.code === "200") {
            //             console.log(res);
            //             this.addressData = res.data||[];
            //             if(this.addressData.length){
            //                 this.addressData.forEach(function(v){
            //                     v.value = v.provinceCode
            //                     v.label = v.shortName;
            //                     v.children= [];
            //                     v.loading = false
            //                 })
            //             }
            //         } else {
            //             this.$Message.error("获取数据失败");
            //         }
            //     });
            // },
            // addressLoad(item,callback){
            //     item.loading = true;
            //     getSyncRequest("/system/area/city/" + item.provinceCode).then(res =>{
            //         if (res.code === "200") {
            //             item.children = res.data||[];
            //             item.loading = false;
            //             if(item.children.length){
            //                 item.children.forEach(function(v){
            //                     v.label = v.shortName;
            //                     v.value = v.cityCode
            //                 })
            //             }
            //             callback();
            //         } else {
            //             this.$Message.error("获取数据失败");
            //             item.loading = false;
            //             callback();
            //         }
            //     });
            // },
            changeTab(e){
                console.log(e);
                if(this.currentTab !== e){
                    this.currentTab = e;
                    if(e===0){
                        this.loadTableData1();
                        this.handleSelectAll();
                    }else{
                        this.loadTableData2();
                        this.handleSelectAll();
                    }
                }
            },
            search1(){
                this.copponForm1.current= 1;
                this.current1= 1;
                this.loadTableData1();
            },
            search2(){
                this.copponForm2.current= 1;
                this.current2= 1;
                this.loadTableData2();
            },
            reset(){
                this.copponForm.current= 1;
                this.current= 1;
                this.copponForm.couponName = '';
                this.copponForm.merchantName = '';
                this.loadTableData1();
                this.loadTableData2();
                // this.addressValue = [];
            },
            loadTableData1(page){
                this.copponForm1.current = page||1;
                var that = this;
                // this.selectDataList = [];
                this.totalSize1 = 0;
                this.listData1 = [];
                this.TableLoading1 = true;
                let params = {
                    page:page||1,
                    size:10,
                    // cityCode:this.addressValue[1]||'',
                    couponName:this.copponForm1.couponName,
                    merchantName:this.copponForm1.merchantName,
                    // provinceCode:this.addressValue[0]||'',
                }
                //商户券列表
                postRequest(`/coupon/superMarket/list`,params
                ).then(res => {
                    this.TableLoading1 = false;
                    if (res.code === "200") {
                        this.totalSize1 = res.data.total;
                        this.listData1 = res.data.records||[];
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            loadTableData2(page){
                this.copponForm2.current = page||1;
                var that = this;
                // this.selectDataList = [];
                this.totalSize2 = 0;
                this.listData2 = [];
                this.TableLoading2 = true;
                let params = {
                    page:page||1,
                    size:10,
                    // cityCode:this.addressValue[1]||'',
                    couponName:this.copponForm2.couponName,
                    merchantName:this.copponForm2.merchantName,
                    // provinceCode:this.addressValue[0]||'',
                }
                //商户券列表
                postRequest(`/coupon/merchant/list`,params
                ).then(res => {
                    this.TableLoading2 = false;
                    if (res.code === "200") {
                        this.totalSize2 = res.data.total;
                        this.listData2 = res.data.records||[];
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            handleSelect1(selection, index) {
                this.selectDataList = selection;
            },
            handleSelect2(selection, index) {
                this.selectDataList = selection;
            },
            changeCurrent1(current) {
                if (this.copponForm1.current != current) {
                    this.copponForm1.current = current;
                    this.loadTableData1(current);
                }
            },
            changeCurrent2(current) {
                if (this.copponForm2.current != current) {
                    this.copponForm2.current = current;
                    this.loadTableData2(current);
                }
            },
            couponClose(){
                this.$emit('setViewDialogVisible', false)
            },
            couponSave(){
                if(this.selectDataList.length==0){
                    this.$Message.error('请选择');
                    return;
                }
                this.$emit('setViewDialogVisible', this.selectDataList)
            }
        },
        created(){
            // this.getProvinceList();
        }
    }
</script>

<style scoped>
    .ivu-table-wrapper{
        overflow: visible;
    }
</style>
