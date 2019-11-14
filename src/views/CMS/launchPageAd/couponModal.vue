<template>
    <Modal  width="800"
            v-model="viewDialogVisible"
            :title="title"
            :closable="false"
            :mask-closable="false"
            footer-hide>
        <div>
            <div v-if="type=='1'">
                <Card :bordered="false" style="margin-bottom:2px">
                    <Form ref="copponForm1" label-position="right" :label-width="80" :model="copponForm1" inline>
                        <FormItem label="商超名称" span="24" style="width:45%">
                            <Input v-model="copponForm1.merchantName" placeholder=" 请填写商超名称" :maxlength=20 />
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
                    <RadioGroup v-model="selectIndex" @on-change="selectBusiness(1)" style="width: 100%;">
                    <Table
                            :loading="TableLoading1"
                            border
                            :columns="tableColumns1"
                            :data="listData1"
                            ref="table1"
                    >
                        <template slot-scope="{ row,index }" slot="action">
                            <Radio :label="index"><span></span></Radio>
                        </template>
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
            </div>
            <div v-if="type=='2'">
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
                    <RadioGroup v-model="selectIndex" @on-change="selectBusiness(2)" style="width: 100%;">
                    <Table
                            :loading="TableLoading2"
                            border
                            :columns="tableColumns2"
                            :data="listData2"
                            ref="table2"
                    >
                        <template slot-scope="{ row,index }" slot="action">
                            <Radio :label="index"><span></span></Radio>
                        </template>
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
            </div>
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
                type:'1',
                title:'',
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
                couponObj:{},
                totalSize1: 0,
                totalSize2: 0,
                current1: 1,
                current2: 1,
                selectIndex:null,
                tableColumns1: [
                    {
                        title: "操作",
                        width: 80,
                        align: "center",
                        slot: "action",
                        fixed: "left"
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
                        title: "操作",
                        width: 80,
                        align: "center",
                        slot: "action",
                        fixed: "left"
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
                listData1: [
                ],
                listData2: [
                ],
            }
        },
        methods:{
            resetRow(type,obj){
                this.contentObj = obj;
                this.type = type;
                this.selectIndex = null;
                if(this.type=='2'){
                    this.title = '周边券详情';
                }else{
                    this.title = '商超券详情';
                }
                this.couponObj = {};
                this.copponForm1.current= 1;
                this.current1= 1;
                this.copponForm2.current= 1;
                this.current2= 1;
                this.copponForm1.couponName = '';
                this.copponForm1.merchantName = '';
                this.copponForm2.couponName = '';
                this.copponForm2.merchantName = '';
                if(this.type=='2'){
                    this.loadTableData2();
                }else{
                    this.loadTableData1();
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
                if(this.type=='2'){
                    this.loadTableData2();
                }else{
                    this.loadTableData1();
                }
                // this.addressValue = [];
            },
            loadTableData1(page){
                this.copponForm1.current = page||1;
                var that = this;
                this.totalSize1 = 0;
                this.listData1 = [];
                this.TableLoading1 = true;
                let params = {
                    page:page||1,
                    size:10,
                    couponName:this.copponForm1.couponName,
                    merchantName:this.copponForm1.merchantName,
                }
                //商户券列表
                postRequest(`/coupon/superMarket/list`,params
                ).then(res => {
                    console.log(111);
                    this.TableLoading1 = false;
                    if (res.code === "200") {
                        this.totalSize1 = res.data.total;
                        this.listData1 = res.data.records||[];
                        var that = this;
                        this.index=null;
                        if(this.contentObj.shopName&&this.contentObj.shopId){
                            this.listData1.forEach(function(v,i){
                                if(v.templateId===that.contentObj.shopId){
                                    that.selectIndex = i;
                                }
                            })
                        }
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            loadTableData2(page){
                this.copponForm2.current = page||1;
                var that = this;
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
                        var that = this;
                        this.i=null;
                        if(this.contentObj.shopName&&this.contentObj.shopId){
                            this.listData2.forEach(function(v,i){
                                if(v.templateId===that.contentObj.shopId){
                                    that.selectIndex = i;
                                }
                            })
                        }
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
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
                if(!this.couponObj.shopName||!this.couponObj.shopId){
                    this.$Message.error('请选择');
                    return;
                }
                this.$emit('setViewDialogVisible', this.couponObj)
            },
            selectBusiness(index){
                switch (index) {
                case 1:
                    this.couponObj.shopName = this.listData1[this.selectIndex].title;
                    this.couponObj.couponType = '1';
                    this.couponObj.shopId = this.listData1[this.selectIndex].templateId;
                    break;
                case 2:
                    this.couponObj.shopName = this.listData2[this.selectIndex].title;
                    this.couponObj.couponType = '2';
                    this.couponObj.shopId = this.listData2[this.selectIndex].templateId;
                    break;
                }
            },
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
