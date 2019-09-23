<template>
    <div style="height: 100%">
        <div v-if="!AddViewDialogVisible&&!ShowViewDialogVisible" style="height: 100%">
            <Card style="height: 100%">
                <p slot="title">赚钱banner</p>
                <a href="#" slot="extra">
                    <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
                </a>
                <div>
                    <Card :bordered="false" style="margin-bottom:2px">
                        <Form ref="searchForm" label-position="right" :label-width="80" :model="searchForm" inline>
                            <FormItem label="门店" span="24" style="width:25%">
                                <Input v-model="searchForm.shopName" placeholder="活动名称" />
                            </FormItem>
                            <FormItem label="标题" span="24" style="width:25%">
                                <Input v-model="searchForm.title" placeholder="标题" />
                            </FormItem>
                            <FormItem label="开始时间" span="24"  style="width:25%">
                                <DatePicker
                                        :value="searchForm.startTime"
                                        type="date"
                                        placeholder
                                        style="width: 100%"
                                        :options="options1"
                                        @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                                ></DatePicker>
                            </FormItem>
                             <FormItem label="开始时间" span="24"  style="width:25%">
                                <DatePicker
                                        :value="searchForm.endTime"
                                        type="date"
                                        placeholder
                                        style="width: 100%"
                                        :options="options2"
                                        @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                                ></DatePicker>
                            </FormItem>
                            <FormItem label="终端" span="24"  style="width:23%">
                                <Select v-model="searchForm.type" style="width:100%">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="运营状态" span="24"  style="width:23%">
                                <Select v-model="searchForm.status" style="width:100%">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem span="24" :label-width="1" style="width:23%">
                                <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')" style="margin-right: 5px">搜索</Button>
                                <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                <Button icon="md-refresh" @click="reset">重置</Button>
                            </FormItem>

                        </Form>
                    </Card>
                    <Card>
                        <Row class="operation">
                            <Button type="primary" icon="md-add" @click="addStaff">新增</Button>
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
                                    <Button v-if="!(row.status==2||row.status==4)"
                                            type="success"
                                            style="margin-right: 5px"
                                            size="small"
                                            @click="edit(row)"
                                    >编辑</Button>
                                    <Button
                                            type="info"
                                            style="margin-right: 5px"
                                            size="small"
                                            @click="showDetail(row)"
                                    >查看</Button>
                                    <Button
                                            v-if="!(row.status==2||row.status==4)"
                                            type="error"
                                            style="margin-right: 5px"
                                            size="small"
                                            @click="del(row)"
                                    >删除</Button>
                                    <Button
                                            v-if="row.status==2"
                                            type="error"
                                            style="margin-right: 5px"
                                            size="small"
                                            @click="stop(row)"
                                    >下架</Button>
                                </template>
                                <template slot-scope="{ row }" slot="activeTime">
                                    <div>{{row.startTime+' - '+row.endTime}}</div>
                                </template>
                                <template slot-scope="{ row }" slot="status">
                                    <div>{{statusList[row.status-1].label}}</div>
                                </template>
                                <template slot-scope="{ row }" slot="awardType">
                                    <div>{{typeList[Number(row.awardType)-1].label}}</div>
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
        <AddOrEdit ref="AddOrEdit" :viewDialogVisible="AddViewDialogVisible" @setViewDialogVisible="closeTab" @search="search"></AddOrEdit>
        <showDetail ref="showDetail" :viewDialogVisible="ShowViewDialogVisible" @setViewDialogVisible="closeTab"></showDetail>
    </div>
</template>

<script>
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    import AddOrEdit from "./addOrEditModal";
    import showDetail from "./showDetailModal";
    export default {
        name: "bannerPage",
        components:{AddOrEdit,showDetail},
        data(){
            return{
                typeList:[{value:1,label:'ios'},{value:2,label:'android'},{value:2,label:'小程序'}],
                statusList:[{value:0,label:'下架'},{value:1,label:'上架'}],
                TableLoading: false,
                auditing:0,
                totalSize: 0,
                current: 1,
                listData: [],
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
                        title: "门店",
                        width: 200,
                        align: "center",
                        key: "shopName"
                    },
                    {
                        title: "标题",
                        width: 150,
                        align: "center",
                        slot: "title"
                    },
                    {
                        title: "内容Id",
                        width: 200,
                        align: "center",
                        slot: "id",
                    },
                    {
                        title: "终端",
                        width: 100,
                        align: "center",
                        slot: "type"
                    },
                    {
                        title: "运营位类型",
                        minWidth: 100,
                        align: "center",
                        key: "createBy"
                    },
                    {
                        title: "已选活动",
                        minWidth: 200,
                        align: "center",
                        key: "createTime"
                    },{
                        title: "运营位置",
                        minWidth: 200,
                        align: "center",
                        key: "createTime"
                    },{
                        title: "运营图片",
                        minWidth: 200,
                        align: "center",
                        key: "createTime"
                    },{
                        title: "运营状态",
                        minWidth: 200,
                        align: "center",
                        key: "createTime"
                    },{
                        title: "开始时间",
                        minWidth: 200,
                        align: "center",
                        key: "startTime"
                    },{
                        title: "结束时间",
                        minWidth: 200,
                        align: "center",
                        key: "endTime"
                    },{
                        title: "创建人",
                        minWidth: 200,
                        align: "center",
                        key: "operator"
                    }

                ],
                searchForm: {
                    shopName: "",
                    title: "",
                    startTime: "",
                    endTime: "",
                    page: 1,
                    size: 10,
                    status:"",
                    type:'',
                },
                AddViewDialogVisible:false,
                ShowViewDialogVisible:false,
                options1: {},
                options2: {},
            }
        },
        created(){
            console.log(2);
            this.loadTableData();
        },
        activated(){
            console.log(1);
            this.loadTableData();
        },
        methods:{
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.modal.startTime = datetime;
                    this.options2 = {
                        disabledDate(date) {
                            return date.valueOf() < new Date(datetime) - 1000 * 60 * 60 * 24;
                        }
                    };
                    break;
                case 2:
                    this.modal.endTime = datetime;
                    this.options1 = {
                        disabledDate(date) {
                            return (
                                date.valueOf() < Date.now() - 1000 * 60 * 60 * 24 ||
                                date.valueOf() > new Date(datetime)
                            );
                        }
                    };
                    break;
                }
            },
            search() {
                this.searchForm.page = 1;
                this.current= 1;
                this.loadTableData();
            },
            reset(){
                this.searchForm.shopName = '';
                this.searchForm.startTime = '';
                this.searchForm.endTime = '';
                this.searchForm.status = '';
                this.searchForm.type = '';
                this.searchForm.page = 1;
                this.current= 1;
                this.loadTableData();
            },
            loadTableData(page) {
                this.searchForm.page = page||1;
                this.totalSize = 0;
                this.listData = [];
                this.TableLoading = true;
                postRequest(`/banner/setting/getPlantFromSetting?pageNum=${this.searchForm.page}&pageSize=10`,{  "pageNum": 10,
                        "pegeSize": 1
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
            addStaff(){
                this.AddViewDialogVisible = true;
                this.$emit("closeTab",true)
                this.$nextTick(() => {
                    this.$refs['AddOrEdit'].resetRow()
                })
            },
            edit(row){
                this.AddViewDialogVisible = true;
                this.$emit("closeTab",true)
                this.$nextTick(() => {
                    this.$refs['AddOrEdit'].resetRow(row)
                })
            },
            showDetail(row){
                this.ShowViewDialogVisible = true;
                this.$emit("closeTab",true)
                this.$nextTick(() => {
                    this.$refs['showDetail'].resetRow(row)
                })
            },
            del(row){
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '<p>您确定要删除该条活动吗？</p>',
                    onOk: () => {
                        postRequest(`/customer/activity/award/activity/status`,{id:row.id,status:0,type:1}
                        ).then(res => {
                            this.TableLoading = false;
                            if (res.code === "200") {
                                this.search();
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    },
                    onCancel: () => {
                    }
                });
            },
            stop(row){
                this.$Modal.confirm({
                    title: '确认终止',
                    content: '<p>您确定要终止该条活动吗？</p>',
                    onOk: () => {
                        // /merchant/activity/award/activity/status
                        postRequest(`/customer/activity/award/activity/status`,{id:row.id,status:4,type:1}
                        ).then(res => {
                            this.TableLoading = false;
                            if (res.code === "200") {
                                this.search();
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
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
                if (this.searchForm.page != current) {
                    this.searchForm.page = current;
                    this.loadTableData(current);
                }
            },
            closeTab(e){
                this.AddViewDialogVisible = false;
                this.ShowViewDialogVisible=false;
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
