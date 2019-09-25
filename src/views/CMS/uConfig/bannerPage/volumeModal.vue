<template>
    <Modal  width="800"
            v-model="viewDialogVisible"
            title="参与活动优惠券"
            :closable="false"
            :mask-closable="false"
            footer-hide>
        <div>
            <Tabs type="card">
                <TabPane label="商超">
                    <div>
                        <Card :bordered="false" style="margin-bottom:2px">
                            <Form ref="volumeForm" label-position="right" :label-width="80" :model="volumeForm" inline>
                                <FormItem label="商户名称" span="24" style="width:25%">
                                    <Input v-model="volumeForm.merchantName" placeholder=" 请填写商户名称" :maxlength=20 />
                                </FormItem>
                                <!--<FormItem label="省/市" span="24"  style="width:23%">-->
                                    <!--<Cascader :data="addressData" :load-data="addressLoad" v-model="addressValue"></Cascader>-->
                                <!--</FormItem>-->
                                <FormItem label="优惠券名称" span="24"  style="width:23%">
                                    <!--<Select v-model="searchForm.status" style="width:100%">-->
                                    <!--<Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                                    <!--</Select>-->
                                    <Input v-model="volumeForm.couponName" placeholder="请填写优惠券名称" :maxlength=20 />
                                </FormItem>
                                <FormItem span="24" :label-width="1" style="width:23%">
                                    <Button type="primary" class="submit" icon="ios-search" @click="search(1)" style="margin-right: 5px">搜索</Button>
                                    <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                    <Button icon="md-refresh" @click="reset(1)">重置</Button>
                                </FormItem>

                            </Form>
                        </Card>
                        <Card>
                            <Row>
                                <RadioGroup v-model="selectIndex1" @on-change="selectBusiness(1)" style="width: 100%;">
                                    <Table
                                            :loading="TableLoading1"
                                            border
                                            :columns="tableColumns"
                                            :data="listData1"
                                            sortable="custom"
                                            ref="table"
                                            @on-selection-change="handleSelect"
                                    >
                                        <template slot-scope="{ row,index }" slot="action">
                                            <Radio :label="index"><span></span></Radio>
                                        </template>
                                        <!--<template slot-scope="{ row,index }" slot="address">-->
                                            <!--<div>{{row.province+'/'+row.city}}</div>-->
                                        <!--</template>-->
                                        <template slot-scope="{ row,index }" slot="timer">
                                            <div v-if="row.dateType===1">{{row.startDate+'——'+row.endDate}}</div>
                                            <div v-if="row.dateType===2">永久有效</div>
                                        </template>
                                        <template slot-scope="{ row,index }" slot="isActivityCoupon">
                                            <div>{{row.isActivityCoupon==1?'否':'是'}}</div>
                                        </template>
                                    </Table>
                                </RadioGroup>
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
                        </Card>
                    </div>
                </TabPane>
                <TabPane label="商户">
                    <div>
                        <Card :bordered="false" style="margin-bottom:2px">
                            <Form ref="volumeForm" label-position="right" :label-width="80" :model="volumeForm" inline>
                                <FormItem label="商户名称" span="24" style="width:25%">
                                    <Input v-model="volumeForm.merchantName" placeholder=" 请填写商户名称" :maxlength=20 />
                                </FormItem>
                                <!--<FormItem label="省/市" span="24"  style="width:23%">-->
                                    <!--<Cascader :data="addressData" :load-data="addressLoad" v-model="addressValue"></Cascader>-->
                                <!--</FormItem>-->
                                <FormItem label="优惠券名称" span="24"  style="width:23%">
                                    <!--<Select v-model="searchForm.status" style="width:100%">-->
                                    <!--<Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                                    <!--</Select>-->
                                    <Input v-model="volumeForm.couponName" placeholder="请填写优惠券名称" :maxlength=20 />
                                </FormItem>
                                <FormItem span="24" :label-width="1" style="width:23%">
                                    <Button type="primary" class="submit" icon="ios-search" @click="search(2)" style="margin-right: 5px">搜索</Button>
                                    <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                    <Button icon="md-refresh" @click="reset(2)">重置</Button>
                                </FormItem>

                            </Form>
                        </Card>
                        <Card>
                            <Row>
                                <RadioGroup v-model="selectIndex2" @on-change="selectBusiness(2)" style="width: 100%;">
                                    <Table
                                            :loading="TableLoading2"
                                            border
                                            :columns="tableColumns"
                                            :data="listData2"
                                            sortable="custom"
                                            ref="table"
                                            @on-selection-change="handleSelect"
                                    >
                                        <template slot-scope="{ row,index }" slot="action">
                                            <Radio :label="index"><span></span></Radio>
                                        </template>
                                        <!--<template slot-scope="{ row,index }" slot="address">-->
                                            <!--<div>{{row.province+'/'+row.city}}</div>-->
                                        <!--</template>-->
                                        <template slot-scope="{ row,index }" slot="timer">
                                            <div>{{row.useStartTime+'——'+row.useEndTime}}</div>
                                        </template>
                                        <template slot-scope="{ row,index }" slot="isActivityCoupon">
                                            <div>{{row.isActivityCoupon==0?'否':'是'}}</div>
                                        </template>
                                    </Table>
                                </RadioGroup>
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
                        </Card>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <div style="text-align: center;margin: 20px 0;">
            <Button style="margin-left: 8px;" type="primary" @click="volumeSave">保存</Button>
            <Button style="margin-left: 8px;" @click="volumeClose">关闭</Button>
        </div>
    </Modal>
</template>

<script>
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    export default {
        name: "volume-modal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                TableLoading1:'',
                TableLoading2:'',
                volumeForm:{
                    merchantName:'',
                    couponName:'',
                    current1: 1,
                    current2: 1,
                },
                volumeObj:{},
                totalSize1: 0,
                totalSize2: 0,
                current1: 1,
                current2: 1,
                // addressValue:[],
                selectIndex1:'',
                selectIndex2:'',
                tableColumns: [
                    {
                        title: "操作",
                        width: 80,
                        align: "center",
                        slot: "action",
                        fixed: "left"
                    },
                    {
                        title: "商户名称",
                        minWidth:200,
                        key: "merchantName",
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
                                    }, params.row.merchantName||params.row.shopName),
                                    h('span', {
                                        slot: 'content',
                                        style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                                    },params.row.merchantName||params.row.shopName)
                                ])
                            ])
                        }
                    },
                    {
                        title: "优惠券名称",
                        minWidth:200,
                        align: "center",
                        key: "title",
                    },
                    {
                        title: "有效期",
                        align: "center",
                        minWidth:300,
                        slot: "timer"
                    },
                    {
                        title: "活动券",
                        minWidth:100,
                        slot: "isActivityCoupon",
                        align: 'center',
                    },
                ],
                listData1: [],
                listData2: [],
                selectDataList: [],
            }
        },
        methods:{
            search(type){
                this.volumeForm.current1= 1;
                this.volumeForm.current2= 1;
                this.current1 = 1;
                this.current2 = 1;
                switch (type) {
                case 1:
                    this.loadTableData1();
                    break;
                case 2:
                    this.loadTableData2();
                    break;
                }
            },
            resetRow(item){
                this.volumeForm.current1= 1;
                this.volumeForm.current2= 1;
                this.current1 = 1;
                this.current2 = 1;
                this.volumeForm.merchantName = '';
                this.volumeForm.couponName = '';
                this.volumeObj = item;
                this.TableLoading = false;
                this.loadTableData1(item);
                this.loadTableData2(item);
            },
            reset(type){
                this.volumeForm.current1= 1;
                this.volumeForm.current2= 1;
                this.current1 = 1;
                this.current2 = 1;
                this.volumeForm.merchantName = '';
                this.volumeForm.couponName = '';
                switch (type) {
                case 1:
                    this.loadTableData1(this.volumeObj);
                    break;
                case 2:
                    this.loadTableData2(this.volumeObj);
                    break;
                }
                // this.addressValue = [];
            },
            loadTableData1(page){
                this.volumeForm.current1 = page||1;
                var that= this;
                this.totalSize1 = 0;
                this.listData1 = [];
                this.TableLoading1 = true;
                this.selectIndex1 = '';
                let params = {
                    page:page||1,
                    size:10,
                    // cityCode:this.addressValue[1]||'',
                    couponName:this.volumeForm.couponName,
                    merchantName:this.volumeForm.merchantName,
                    // provinceCode:this.addressValue[0]||'',
                }
                //商户券列表
                postRequest(`/coupon/superMarket/list?pageNum=${this.current1}&pageSize=10`,params
                ).then(res => {
                    this.TableLoading1 = false;
                    if (res.code === "200") {
                        this.totalSize1 = res.data.total;
                        this.listData1 = res.data.records;
                        if(this.volumeObj&&this.volumeObj.shopId){
                            let that = this;
                            that.selectIndex1 = '';
                            that.selectIndex2 = '';
                            this.listData1.forEach(function(v,i){
                                if(that.volumeObj.shopId == v.templateId&&that.volumeObj.shopName == v.title){
                                    that.selectIndex1 = i;
                                    that.selectIndex2 = '';
                                }
                            })
                        }
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            loadTableData2(item,page){
                this.volumeForm.current2 = page||1;
                var that= this;
                var item = this.volumeObj
                this.totalSize2 = 0;
                this.listData2 = [];
                this.TableLoading2 = true;
                this.selectIndex2 = '';
                let params = {
                    page:page||1,
                    size:10,
                    // cityCode:this.addressValue[1]||'',
                    couponName:this.volumeForm.couponName,
                    merchantName:this.volumeForm.merchantName,
                    // provinceCode:this.addressValue[0]||'',
                }
                //商超券列表
                postRequest(`/coupon/merchant/list`,params
                ).then(res => {
                    this.TableLoading2 = false;
                    if (res.code === "200") {
                        this.totalSize2 = res.data.total;
                        this.listData2 = res.data.records;
                        if(this.volumeObj&&this.volumeObj.shopId){
                            let that = this;
                            that.selectIndex1 = '';
                            that.selectIndex2 = '';
                            this.listData2.forEach(function(v,i){
                                if(that.volumeObj.shopId == v.templateId&&that.volumeObj.shopName == v.title){
                                    that.selectIndex2 = i;
                                    that.selectIndex1 = '';
                                }
                            })
                        }
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            handleSelect(selection, index) {
                this.selectDataList = selection;
            },
            changeCurrent1(current) {
                if (this.volumeForm.current1 != current) {
                    this.volumeForm.current1 = current;
                    this.loadTableData1(this.volumeObj,current);
                }
            },
            changeCurrent2(current) {
                if (this.current2 != current) {
                    this.current2 = current;
                    this.loadTableData2(this.volumeObj,current);
                }
            },
            selectBusiness(index){
                switch (index) {
                case 1:
                    this.selectIndex2 = '';
                    this.volumeObj = this.listData1[this.selectIndex1];
                    this.volumeObj.shopName = this.listData1[this.selectIndex1].title;
                    this.volumeObj.shopId = this.listData1[this.selectIndex1].templateId;
                    break;
                case 2:
                    this.selectIndex1 = '';
                    this.volumeObj = this.listData2[this.selectIndex2];
                    this.volumeObj.shopName = this.listData2[this.selectIndex2].title;
                    this.volumeObj.shopId = this.listData2[this.selectIndex2].templateId;
                    break;
                }
            },
            volumeClose(){
                this.$emit('setViewDialogVisible', false)
            },
            volumeSave(){
                if(!this.volumeObj||!this.volumeObj.shopId){
                    this.$Message.error({
                        content: "请选择优惠券",
                        duration: 3
                    });
                }
                this.$emit('setViewDialogVisible', this.volumeObj)
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
