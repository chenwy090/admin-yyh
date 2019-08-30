<template>
    <div style="height: 100%">
        <div v-if="!TokerViewDialogVisible&&!DownViewDialogVisible" style="height: 100%">
            <Card style="height: 100%">
                <p slot="title">平台拓客</p>
                <a href="#" slot="extra">
                    <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
                </a>
                <div>
                    <Card :bordered="false" style="margin-bottom:2px">
                        <Form ref="searchForm" label-position="right" :label-width="75" :model="searchForm" inline>
                            <FormItem label="商户名称：" span="24" style="width:40%">
                                <Select v-model="searchForm.type" style="width:48%" placeholder="请选择商户类型">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <div style="width: 2%;display: inline-block"></div>
                                <Input style="width:48%" v-model="searchForm.name" placeholder="请填写商户名称" :disabled="!searchForm.type" />
                            </FormItem>
                            <FormItem label="省/市：" span="24"  style="width:35%">
                                <Cascader :data="addressData" :load-data="addressLoad"></Cascader>
                            </FormItem>
                            <FormItem label="套餐：" span="24"  style="width:20%">
                                <Select v-model="searchForm.status" style="width:100%">
                                    <Option v-for="item in packageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="拓客时间：" span="35"  style="width:40%">
                                <DatePicker
                                        :value="searchForm.applyDateRangeOpen"
                                        type="date"
                                        placeholder
                                        style="width: 48%"
                                        :options="options1"
                                        @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                                ></DatePicker>
                                <div style="width: 2%;display: inline-block"></div>
                                <DatePicker
                                        :value="searchForm.applyDateRangeClose"
                                        type="date"
                                        placeholder
                                        style="width: 48%"
                                        :options="options2"
                                        @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                                ></DatePicker>
                            </FormItem>
                            <FormItem label="状态：" span="20"  style="width:23%">
                                <Select v-model="searchForm.status" style="width:100%">
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
                                            type="error"
                                            style="margin-right: 5px"
                                            size="small"
                                            @click="del(row)"
                                    >删除</Button>
                                </template>
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
                    </Card>
                </div>
            </Card>
        </div>
        <TokerModal ref="TokerModal" :viewDialogVisible="TokerViewDialogVisible" @setViewDialogVisible="closeTab"></TokerModal>
        <DownModal ref="DownModal" :viewDialogVisible="DownViewDialogVisible" @setViewDialogVisible="closeTab"></DownModal>
    </div>
</template>

<script>
    import TokerModal from "./TokerModal";
    import DownModal from "./downLoadModal";
    export default {
        name: "PlatformToker",
        components:{TokerModal,DownModal},
        data(){
            return{
                typeList:[{value:0,label:'本地商户(单店)'},{value:1,label:'本地商户(多店)'}],
                statusList:[{value:0,label:'未生效'},{value:1,label:'生效中'},{value:2,label:'已完成'}],
                packageList:[{value:0,label:'全部'},{value:1,label:'精准拓客'},{value:2,label:'平台拓客'}],
                TableLoading: false,
                auditing:0,
                totalSize: 0,
                current: 1,
                listData: [
                    {name:'一兆韦德核销券赠脉动饮料',
                        type:'核销赠券',
                        activeTime:'2019-08-03-- 2019-08-15',
                        static:'未开始',
                        openId:'test',
                        openTime:'2019-08-03'}
                ],
                selectDataList: [],
                auditData:{},
                auditFlag: 0,
                tableColumns: [
                    {
                        title: "操作",
                        width: 200,
                        align: "center",
                        slot: "action",
                        fixed: "left"
                    },
                    {
                        title: "活动名称",
                        width: 220,
                        key: "name"
                    },
                    {
                        title: "赠送方式",
                        key: "type"
                    },
                    {
                        title: "活动时间",
                        width: 200,
                        align: "center",
                        slot: "activeTime",
                    },
                    {
                        title: "状态",
                        key: "static"
                    },
                    {
                        title: "操作人",
                        key: "openId"
                    },
                    {
                        title: "操作时间",
                        key: "openTime"
                    }
                ],
                searchForm: {
                    type:'',
                    name: '',
                    status:0,
                    applyDateRangeOpen:'',
                    applyDateRangeClose:'',
                    current: "1",
                    pageSize: "10"
                },
                addressData:[
                    {
                        value: 'beijing',
                        label: '北京',
                        children: [],
                        loading: false
                    },
                    {
                        value: 'hangzhou',
                        label: '杭州',
                        children: [],
                        loading:false
                    }
                ],
                options2:{
                    disabledDate(date){
                        return date.valueOf() < Date.now()-1000*60*60*24;
                    }
                },
                options1:{
                    disabledDate(date){
                        return date.valueOf() < Date.now()-1000*60*60*24;
                    }
                },
                TokerViewDialogVisible:false,
                ShowViewDialogVisible:false,
                DownViewDialogVisible:false,
            }
        },
        created(){
            console.log(2);
        },
        activated(){
            console.log(22);
        },
        methods:{
            addressLoad(item,callback){
                item.loading = true;
                setTimeout(() => {
                    if (item.value === 'beijing') {
                        item.children = [
                            {
                                value: 'talkingdata',
                                label: 'TalkingData'
                            },
                            {
                                value: 'baidu',
                                label: '百度'
                            },
                            {
                                value: 'sina',
                                label: '新浪'
                            }
                        ];
                    } else if (item.value === 'hangzhou') {
                        item.children = [
                            {
                                value: 'ali',
                                label: '阿里巴巴'
                            },
                            {
                                value: '163',
                                label: '网易'
                            }
                        ];
                    }
                    item.loading = false;
                    callback();
                }, 1000);
            },
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.searchForm.applyDateRangeOpen = datetime;
                    this.options2 = {
                        disabledDate(date){
                            return date.valueOf() <  new Date(datetime)-1000*60*60*24;
                        }
                    }
                    break;
                case 2:
                    this.searchForm.applyDateRangeClose = datetime;
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
                this.loadTableData(this.searchForm);
            },
            reset(){

            },
            loadTableData(formData) {
                this.totalSize = 0;
                this.listData = [];
                this.TableLoading = true;
                financialWithdrawApplyAuditList(formData).then(res => {
                    this.TableLoading = false;
                    if (res.code === "200") {
                        this.totalSize = res.data.total;
                        this.listData = res.data.records;
                    } else {
                        this.msgErr("获取数据失败");
                    }
                });
            },
            tokerFn(){
                this.TokerViewDialogVisible = true;
            },
            downFn(row){
                this.DownViewDialogVisible = true;
            },
            del(row){
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '<p>您确定要删除该平台拓客记录吗？</p>',
                    onOk: () => {
                        this.$Message.info('Clicked ok');
                    },
                    onCancel: () => {
                    }
                });
            },
            handleSelect(selection, index) {
                this.selectDataList = selection;
            },
            batchAudit(){

            },
            changeCurrent(current) {
                if (this.searchForm.current != current) {
                    this.searchForm.current = current;
                    this.loadTableData(this.searchForm);
                }
            },
            closeTab(e){
                this.TokerViewDialogVisible = false;
                this.DownViewDialogVisible=false;
                this.$emit("closeTab",false)
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
