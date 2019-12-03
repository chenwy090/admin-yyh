<template>
    <div style="height: 100%">
        <Card  v-if="!AddViewDialogVisible&&!ShowViewDialogVisible" style="height: 100%">
            <div>
                <Card :bordered="false" style="margin-bottom:2px">
                    <Form ref="searchForm" label-position="right" :label-width="80" :model="searchForm" inline>
                        <FormItem label="公告标题" span="24" style="width:20%">
                            <Input v-model="searchForm.title" placeholder="公告标题" />
                        </FormItem>
                        <FormItem label="推送对象" span="24"  style="width:20%">
                            <Select v-model="searchForm.pushType" style="width:100%">
                                <Option v-for="(item,index) in pushTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="推送时间" span="35"  style="width:50%">
                            <DatePicker
                                    :value="searchForm.startTime"
                                    type="date"
                                    placeholder
                                    style="width: 40%"
                                    :options="options1"
                                    @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                            ></DatePicker>
                            -
                            <DatePicker
                                    :value="searchForm.endTime"
                                    type="date"
                                    placeholder
                                    style="width: 40%"
                                    :options="options2"
                                    @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                            ></DatePicker>
                        </FormItem>
                        <FormItem label="状态" span="24"  style="width:20%">
                            <Select v-model="searchForm.status" style="width:100%">
                                <Option value="">全部</Option>
                                <Option v-for="(item,index) in statusList" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem span="24" :label-width="1" style="width:23%">
                            <Button type="primary" class="submit" icon="ios-search" @click="search()" style="margin-right: 5px">搜索</Button>
                            <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                            <Button icon="md-refresh" @click="reset">重置</Button>
                        </FormItem>

                    </Form>
                </Card>
                <Card>
                    <Row class="operation">
                        <Button type="primary" icon="md-add" @click="addStaff">发公告</Button>
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
                                <!--<Button v-if="row.status==='0'"-->
                                <!--type="success"-->
                                <!--style="margin-right: 5px"-->
                                <!--size="small"-->
                                <!--@click="edit(row)"-->
                                <!--&gt;编辑</Button>-->
                                <Button type="info"
                                        style="margin-right: 5px"
                                        size="small"
                                        @click="showDetail(row)"
                                >查看</Button>
                                <Button v-if="row.status!=='1'"
                                        type="info"
                                        style="margin-right: 5px"
                                        size="small"
                                        @click="edit(row)"
                                >编辑</Button>
                                <Button
                                        v-if="row.status!=='1'"
                                        type="error"
                                        style="margin-right: 5px"
                                        size="small"
                                        @click="del(row)"
                                >删除</Button>
                                <Button
                                        v-if="row.status==='1'"
                                        type="error"
                                        style="margin-right: 5px"
                                        size="small"
                                        @click="stop(row)"
                                >终止</Button>
                            </template>
                            <template slot-scope="{ row }" slot="pushType">
                                <div>{{['','商户', '用户'][row.pushType]}}</div>
                            </template>
                            <template slot-scope="{ row }" slot="status">
                                <div>{{['待发布','已发布', '已结束','已终止'][row.status]}}</div>
                            </template>
                            <template slot-scope="{ row }" slot="time">
                                <div>{{row.startTime}}-{{row.endTime}}</div>
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
        <AddOrEdit ref="AddOrEdit" :viewDialogVisible="AddViewDialogVisible" @setViewDialogVisible="closeTab" @search="search"></AddOrEdit>
        <showDetail ref="showDetail" :viewDialogVisible="ShowViewDialogVisible" @setViewDialogVisible="closeTab"></showDetail>
    </div>
</template>

<script>
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    import AddOrEdit from "./addOrEditModal";
    import showDetail from "./showDetailModal";
    export default {
        name: "launchPageAd",
        components:{AddOrEdit,showDetail},
        data(){
            return{
                pushTypeList: [{value: '0', label: '全部'}, {value: '1', label: '商户'}, {value: '2', label: '用户'}],
                statusList:[{value:'',label:'全部'},{value:0,label:'待发布'},{value:1,label:'已发布'},{value:2,label:'已结束'},{value:2,label:'已终止'}],
                TableLoading: false,
                auditing:0,
                totalSize: 0,
                current: 1,
                listData: [],
                selectDataList: [],
                confirmValue:'',
                tableColumns: [
                    {
                        title: "操作",
                        width: 250,
                        align: "center",
                        slot: "action",
                        fixed: "left"
                    },
                    {
                        title: "公告标题",
                        width: 200,
                        align: "center",
                        key: "title"
                    },{
                        title: "推送对象",
                        width: 150,
                        align: "center",
                        slot: "pushType"
                    },{
                        title: "状态",
                        minWidth: 150,
                        align: "center",
                        slot: "status"
                    },{
                        title: "有效时间",
                        minWidth: 300,
                        align: "center",
                        slot: "time"
                    },{
                        title: "创建人",
                        minWidth: 200,
                        align: "center",
                        key: "createBy"
                    }

                ],
                searchForm: {
                    pushType: "",
                    title: "",
                    startTime: "",
                    endTime: "",
                    pageNum: 1,
                    pageSize: 10,
                    status:'',
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
                    this.searchForm.startTime = datetime?datetime+' 00:00:00':'';
                    this.options2 = {
                        disabledDate(date) {
                            return date.valueOf() < new Date(datetime) - 1000 * 60 * 60 * 24;
                        }
                    };
                    break;
                case 2:
                    this.searchForm.endTime = datetime?datetime+' 23:59:59':'';
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
                this.searchForm.pageNum = 1;
                this.current= 1;
                this.loadTableData();
            },
            reset(){
                this.searchForm.title = '';
                this.searchForm.pushType = '';
                this.searchForm.startTime = '';
                this.searchForm.endTime = '';
                this.searchForm.status = '';
                this.searchForm.pageNum = 1;
                this.current= 1;
                this.loadTableData();
            },
            loadTableData(page) {
                this.searchForm.pageNum = page||1;
                this.totalSize = 0;
                this.listData = [];
                this.TableLoading = true;
                postRequest(`/announcement/list?pageNum=${this.searchForm.pageNum}&pageSize=10`,this.searchForm
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
                    this.$refs['AddOrEdit'].resetRow(null,'add')
                })
            },
            edit(row){
                this.AddViewDialogVisible = true;
                this.$emit("closeTab",true)
                this.$nextTick(() => {
                    this.$refs['AddOrEdit'].resetRow(row,'edit')
                })
            },
            showDetail(row){
                console.log(12);
                this.ShowViewDialogVisible = true;
                this.$emit("closeTab",true)
                this.$nextTick(() => {
                    this.$refs['showDetail'].resetRow(row)
                })
            },
            del(row){
                this.$Modal.confirm({
                    title: '您确定要删除该条公告吗？',
                    onOk: () => {
                        postRequest(`/announcement/delete?id=${row.id}`,{id:row.id}
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
                    title: '您确定要终止该条公告吗？',
                    onOk: () => {
                        postRequest(`/announcement/stop?id=${row.id}`,{id:row.id}
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
                if (this.searchForm.pageNum != current) {
                    this.searchForm.pageNum = current;
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
                this.linkTo("cms");
            }
        }
    }
</script>

<style scoped>
    .operation {
        margin-bottom: 2vh;
    }
    .confirm-textarea{
        width: 100%;
        height: 100px;
        padding: 5px;
        outline: none;
    }
</style>
