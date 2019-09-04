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
                            <Input v-model="copponForm.name" placeholder=" 请填写商家名称" :maxlength=20 />
                        </FormItem>
                        <FormItem label="省/市" span="24"  style="width:50%">
                            <Cascader :data="addressData" :load-data="addressLoad"></Cascader>
                        </FormItem>
                        <FormItem label="优惠卷名称" span="24" style="width:25%">
                            <Input v-model="copponForm.name" placeholder=" 请填写优惠卷名称" :maxlength=20 />
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
                        <template slot-scope="{ row }" slot="activeTime">
                            <div>{{row.activeTime}}</div>
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
        <div style="text-align: center">
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
                    name:'',

                },
                totalSize: 0,
                current: 1,
                selectIndex:'',
                selectRow:{},
                addressData:[],
                tableColumns: [
                    {
                        type: 'selection', width: 60, align: 'center'
                    },
                    {
                        title: "商家名称",
                        key: "name",
                        align: 'center',
                    },
                    {
                        title: "省/市",
                        key: "address",
                        align: 'center',
                    },
                    {
                        title: "优惠卷名称",
                        key: "coupon",
                        align: 'center',
                    },
                    {
                        title: "有效期",
                        key: "time",
                        align: 'center',
                    }
                ],
                listData: [
                    {id:'223',name:'一兆韦德核销券赠脉动饮料',address:'浙江省/杭州市',coupon:'满100减50',time:'2019-08-29 -- 2019-09-10'},
                    {id:'223',name:'阿里巴巴',address:'浙江省/杭州市',coupon:'满100减50',time:'2019-08-29 -- 2019-09-10'}
                ],
                selectDataList: [],
            }
        },
        methods:{
            resetRow(row){
                // this.copponForm.name = row.name;
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
                                v.value = v.provinceCode
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

            },
            loadTableData(){

            },
            handleSelect(selection, index) {
                this.selectDataList = selection;
            },
            changeCurrent(current) {
                if (this.copponForm.current != current) {
                    this.copponForm.current = current;
                    this.loadTableData(this.searchForm);
                }
            },
            selectBusiness(){
                console.log(this.selectIndex);
                this.selectRow = this.listData[this.selectIndex]
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
            this.TableLoading=false,
                console.log(2);
        }
    }
</script>

<style scoped>

</style>
