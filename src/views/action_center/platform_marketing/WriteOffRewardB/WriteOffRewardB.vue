<template>
   <div style="height: 100%!important;position: static">
       <div v-if="!AddViewDialogVisible&&!ShowViewDialogVisible">
           <Card :bordered="false" style="margin-bottom:2px">
               <Form ref="searchForm" label-position="right" :label-width="80" :model="searchForm" inline>
                   <FormItem label="活动名称" span="24" style="width:25%">
                       <Input v-model="searchForm.name" placeholder="活动名称" />
                   </FormItem>
                   <FormItem label="赠送方式" span="24"  style="width:23%">
                       <Select v-model="searchForm.type" style="width:100%">
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
                           <Button
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
       <AddOrEdit ref="AddOrEdit" :viewDialogVisible="AddViewDialogVisible" @setViewDialogVisible="closeTab"></AddOrEdit>
       <showDetail ref="showDetail" :viewDialogVisible="ShowViewDialogVisible" @setViewDialogVisible="closeTab"></showDetail>
   </div>
</template>

<script>
    import AddOrEdit from "./addOrEditModal";
    import showDetail from "./showDetailModal";
    export default {
        name: "WriteOffRewardB",
        components:{AddOrEdit,showDetail},
        data(){
            return{
                typeList:[{value:1,label:'核销赠券'},{value:2,label:'核销赠U贝'}],
                statusList:[{value:0,label:'未开始'},{value:1,label:'进行中'},{value:2,label:'已终止'},{value:3,label:'已结束'}],
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
                    current: "1",
                    pageSize: "10"
                },
                AddViewDialogVisible:false,
                ShowViewDialogVisible:false,
            }
        },
        created(){
            console.log(2);
        },
        activated(){
            console.log(22);
        },
        methods:{
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
                    content: '<p>删除后无法恢复，您确定删除吗？</p>',
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
                this.AddViewDialogVisible = false;
                this.ShowViewDialogVisible=false;
                this.$emit("closeTab",false)
            }
        }
    }
</script>

<style scoped>
    .operation {
        margin-bottom: 2vh;
    }
</style>
