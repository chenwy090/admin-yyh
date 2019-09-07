<template>
    <Modal  width="800"
            v-model="viewDialogVisible"
            title="优惠券选择"
            :closable="false"
            :mask-closable="false"
            footer-hide>
        <div>
            <div>
                <Card :bordered="false" style="margin-bottom:2px">
                    <Form ref="copponForm" label-position="right" :label-width="80" :model="copponForm" inline>
                        <FormItem label="商家名称" span="24" style="width:45%">
                            <Input v-model="copponForm.merchantName" placeholder=" 请填写商家名称" :maxlength=20 />
                        </FormItem>
                        <FormItem label="省/市" span="24"  style="width:50%">
                            <Cascader :data="addressData" :load-data="addressLoad" v-model="addressValue"></Cascader>
                        </FormItem>
                        <FormItem label="优惠卷名称" span="24" style="width:25%">
                            <Input v-model="copponForm.couponName" placeholder=" 请填写优惠卷名称" :maxlength=20 />
                        </FormItem>
                        <FormItem span="24" :label-width="1" style="float: right;">
                            <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')" style="margin-right: 5px">搜索</Button>
                            <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                            <Button icon="md-refresh" @click="reset">重置</Button>
                        </FormItem>
                    </Form>
                </Card>
                <Row>
                    <Table
                            :loading="TableLoading"
                            border
                            :columns="tableColumns"
                            :data="listData"
                            sortable="custom"
                            ref="table"
                            @on-selection-change="handleSelect"
                    >
                        <template slot-scope="{ row,index }" slot="address">
                            <div>{{row.province+'/'+row.city}}</div>
                        </template>
                        <template slot-scope="{ row,index }" slot="timer">
                            <div>{{row.useStartTime+' -- '+row.useEndTime}}</div>
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
                TableLoading:'',
                copponForm:{
                    merchantName:'',
                    couponName:'',
                    current:1
                },
                totalSize: 0,
                current: 1,
                selectIndex:'',
                selectRow:{},
                addressData:[],
                addressValue:[],
                tableColumns: [
                    {
                        type: 'selection', width: 60, align: 'center'
                    },
                    {
                        title: "商家名称",
                        key: "merchantName",
                        align: 'center',
                    },
                    {
                        title: "省/市",
                        slot: "address",
                        align: 'center',
                    },
                    {
                        title: "优惠卷名称",
                        key: "title",
                        align: 'center',
                    },
                    {
                        title: "有效期",
                        slot: "time",
                        align: 'center',
                    }
                ],
                listData: [
                ],
                selectDataList: [],
            }
        },
        methods:{
            resetRow(row){
                this.copponForm.couponName = '';
                this.copponForm.current = 1;
                this.copponForm.merchantName = '';
                this.addressValue = [];
                // this.copponForm.name = row.name;
                this.loadTableData(row);
                this.selectDataList = [];
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
            search(){
                this.loadTableData();
            },
            reset(){
                this.copponForm.couponName = '';
                this.copponForm.current = 1;
                this.copponForm.merchantName = '';
                this.addressValue = [];
            },
            loadTableData(row){
                var that = this;
                this.selectDataList = [];
                this.totalSize = 0;
                this.listData = [];
                this.TableLoading = true;
                let params = {
                    page:this.copponForm.current,
                    size:10,
                    cityCode:this.addressValue[1]||'',
                    couponName:this.copponForm.couponName,
                    merchantName:this.copponForm.merchantName,
                    provinceCode:this.addressValue[0]||'',
                }
                //商户券列表
                postRequest(`/coupon/merchant/list`,params
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
            handleSelect(selection, index) {
                this.selectDataList = selection;
            },
            changeCurrent(current) {
                if (this.copponForm.current != current) {
                    this.copponForm.current = current;
                    this.loadTableData();
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
            this.getProvinceList();
        }
    }
</script>

<style scoped>

</style>
