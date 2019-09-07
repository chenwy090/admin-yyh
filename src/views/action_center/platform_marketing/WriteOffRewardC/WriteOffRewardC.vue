<template>
    <div style="height: 100%">
        <div v-if="!AddViewDialogVisible&&!ShowViewDialogVisible" style="height: 100%">
            <Card style="height: 100%">
                <p slot="title">核销返奖励（用户）</p>
                <a href="#" slot="extra">
                    <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
                </a>
                <div>
                    <Card :bordered="false" style="margin-bottom:2px">
                        <Form ref="searchForm" label-position="right" :label-width="80" :model="searchForm" inline>
                            <FormItem label="活动名称" span="24" style="width:25%">
                                <Input v-model="searchForm.name" placeholder="活动名称" />
                            </FormItem>
                            <FormItem label="赠送方式" span="24"  style="width:23%">
                                <Select v-model="searchForm.awardType" style="width:100%">
                                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="状态" span="24"  style="width:23%">
                                <Select v-model="searchForm.status" style="width:100%">
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
                                    <Button v-if="row.status!=2"
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
                                            v-if="row.status!=2"
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
                                    >终止</Button>
                                </template>
                                <template slot-scope="{ row }" slot="activeTime">
                                    <div>{{row.startTime+' - '+row.endTime}}</div>
                                </template>
                                <template slot-scope="{ row }" slot="status">
                                    <div>{{statusList[row.status].label}}</div>
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
    import AddOrEdit from "./addOrEditModalC";
    import showDetail from "./showDetailModalC";
    export default {
        name: "WriteOffRewardC",
        components:{AddOrEdit,showDetail},
        data(){
            return{
                typeList:[{value:1,label:'核销赠券'},{value:2,label:'核销赠U贝'}],
                statusList:[{value:1,label:'未开始'},{value:2,label:'进行中'},{value:3,label:'已结束'},{value:4,label:'已终止'}],
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
                        title: "活动名称",
                        width: 200,
                        align: "center",
                        key: "name"
                    },
                    {
                        title: "赠送方式",
                        width: 150,
                        align: "center",
                        slot: "awardType"
                    },
                    {
                        title: "活动时间",
                        width: 200,
                        align: "center",
                        slot: "activeTime",
                    },
                    {
                        title: "状态",
                        width: 100,
                        align: "center",
                        slot: "status"
                    },
                    {
                        title: "操作人",
                        width: 100,
                        align: "center",
                        key: "createBy"
                    },
                    {
                        title: "操作时间",
                        width: 150,
                        align: "center",
                        key: "createTime"
                    }
                ],
                searchForm: {
                    awardType: "",
                    name: "",
                    page: 0,
                    size: 10,
                    status:"",
                    type:1,
                },
                AddViewDialogVisible:false,
                ShowViewDialogVisible:false,
            }
        },
        created(){
            // this.loadTableData();
        },
        activated(){
            this.loadTableData();
        },
        methods:{
            search() {
                this.current = 1;
                this.loadTableData(this.searchForm);
            },
            reset(){
                this.searchForm.name = '';
                this.searchForm.page = 1;
                this.searchForm.awardType = '';
                this.searchForm.status = '';
            },
            loadTableData(formData) {
                this.totalSize = 0;
                this.listData = [];
                this.TableLoading = true;
                postRequest(`/customer/activity/award/activity/list?pageNum=${this.current}&pageSize=10`,this.searchForm
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
                if (this.current != current) {
                    this.current = current;
                    this.loadTableData(this.searchForm);
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
