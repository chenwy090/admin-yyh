<template>
    <div style="height: 100%">
        <div style="min-height: 100%">
            <Card style="height: 100%">
                <div>
                    <Card :bordered="false" style="margin-bottom:2px">
                        <Form ref="searchForm" label-position="right" :label-width="75" :model="searchForm" inline>
                            <FormItem label="商户名称：" span="24" style="width:40%">
                                <Select v-model="searchForm.merchantType" style="width:48%" placeholder="请选择商户类型">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in merchantTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <div style="width: 2%;display: inline-block"></div>
                                <Input style="width:48%" v-model="searchForm.merchantName" placeholder="请填写商户名称" :disabled="!searchForm.merchantType" />
                            </FormItem>
                            <FormItem label="省/市：" span="24"  style="width:35%">
                                <Cascader :data="addressData" :load-data="addressLoad" v-model="addressValue"></Cascader>
                            </FormItem>
                            <!--<FormItem label="套餐：" span="24"  style="width:20%">-->
                            <!--<Select v-model="searchForm.expandType" style="width:100%">-->
                            <!--<Option v-for="item in expandTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                            <!--</Select>-->
                            <!--</FormItem>-->
                            <FormItem label="拓客时间：" span="35"  style="width:40%">
                                <DatePicker
                                        :value="searchForm.expandTimeStart"
                                        type="date"
                                        placeholder
                                        style="width: 48%"
                                        :options="options1"
                                        @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                                ></DatePicker>
                                <div style="width: 2%;display: inline-block"></div>
                                <DatePicker
                                        :value="searchForm.expandTimeEnd"
                                        type="date"
                                        placeholder
                                        style="width: 48%"
                                        :options="options2"
                                        @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                                ></DatePicker>
                            </FormItem>
                            <FormItem label="状态：" span="20"  style="width:23%">
                                <Select v-model="searchForm.status" style="width:100%">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
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
                            <Button type="primary" icon="md-add" @click="tokerFn">拓客</Button>
                            <Button type="primary" icon="ios-download-outline" @click="downFn">下载</Button>
                        </Row>
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
                                <template slot-scope="{ row }" slot="action">
                                    <Button
                                            type="info"
                                            style="margin-right: 5px"
                                            size="small"
                                            @click="showDetail(row)"
                                    >查看</Button>
                                    <Button
                                            type="error"
                                            style="margin-right: 5px"
                                            size="small"
                                            @click="del(row)"
                                            v-if="row.status==1"
                                    >删除</Button>
                                </template>
                                <template slot-scope="{ row }" slot="address">
                                    <div>{{row.provinceName+'/'+row.cityName}}</div>
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
        <!--<showDetailModal ref="showDetailModal" :viewDialogVisible="showViewDialogVisible" @setViewDialogVisible="closeTab"></showDetailModal>-->
    </div>
</template>

<script>
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    export default {
        name: "refundCheck",
        data(){
            return{
                merchantTypeList:[{value:'1',label:'本地商户(单店)'},{value:'2',label:'本地商户(多店)'}],
                statusList:[{value:'1',label:'未生效'},{value:'2',label:'已生效'},{value:'3',label:'已完成'}],
                expandTypeList:[{value:'0',label:'全部'},{value:'1',label:'精准拓客'},{value:'2',label:'平台拓客'}],
                TableLoading: false,
                totalSize: 0,
                listData: [],
                addressValue:[],
                selectDataList: [],
                tableColumns: [
                    {
                        title: "操作",
                        width: 150,
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
                        slot: "address",
                    },
                    {
                        title: "拓客人数",
                        width: 100,
                        align: "center",
                        key: "maxPushCount",
                    },
                    {
                        title: "状态",
                        width: 100,
                        key: "statusName"
                    },
                    {
                        title: "拓客时间",
                        minWidth: 250,
                        key: "expandTime"
                    },
                    {
                        title: "操作人",
                        minWidth: 150,
                        key: "operatorBy"
                    }
                ],
                searchForm: {
                    "merchantType":'',
                    "cityCode": '',
                    "provinceCode":'',
                    "expandTimeEnd": '',
                    "expandTimeStart": '',
                    "expandType": '',
                    "merchantName": '',
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
        created(){
            this.getProvinceList();
            this.loadTableData();
        },
        activated(){
        },
        methods:{
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
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.searchForm.expandTimeStart = datetime;
                    this.options2 = {
                        disabledDate(date){
                            return date.valueOf() <  new Date(datetime)-1000*60*60*24;
                        }
                    }
                    break;
                case 2:
                    this.searchForm.expandTimeEnd = datetime;
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
                this.searchForm.merchantType= '';
                this.searchForm.cityCode= '';
                this.searchForm.provinceCode= '';
                this.searchForm.expandTimeEnd= '';
                this.searchForm.expandTimeStart= '';
                this.searchForm.expandType= '';
                this.searchForm.merchantName= '';
                this.searchForm.status= '';
                this.searchForm.current = 1;
                this.current= 1;
                this.addressValue = [];
                this.loadTableData();
            },
            loadTableData(page) {
                this.searchForm.current = page||1;
                this.totalSize = 0;
                this.listData = [];
                this.TableLoading = true;
                postRequest(`/merchant/platform/expand/list?pageNum=${page||1}&pageSize=10`,{
                        "cityCode": this.addressValue[1]||'',
                        "provinceCode": this.addressValue[0]||'',
                        "expandTimeEnd": this.searchForm.expandTimeEnd,
                        "expandTimeStart":  this.searchForm.expandTimeStart,
                        "expandType":  this.searchForm.expandType,
                        "merchantName":  this.searchForm.merchantName,
                        "status":  this.searchForm.status,
                        "merchantType":  this.searchForm.merchantType
                    }
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
            tokerFn(){
                this.TokerViewDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs['TokerModal'].resetRow()
                })
            },
            downFn(row){
                this.DownViewDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs['DownModal'].resetRow()
                })
            },
            del(row){
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '<p>您确定要删除该平台拓客记录吗？</p>',
                    onOk: () => {
                        postRequest(`/merchant/platform/expand/delete?id=${row.id}`,{"id": row.id}
                        ).then(res => {
                            this.TableLoading = false;
                            if (res.code === "200") {
                                this.$Message.success("删除成功");
                                this.searchForm.current = 1;
                                this.loadTableData();
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    },
                    onCancel: () => {
                    }
                });
            },
            showDetail(row){
                this.showViewDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs['showDetailModal'].resetRow(row)
                })
            },
            handleSelect(selection, index) {
                this.selectDataList = selection;
            },
            batchAudit(){

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
        }
    }
</script>

<style scoped>
    .operation {
        margin-bottom: 2vh;
    }
</style>
