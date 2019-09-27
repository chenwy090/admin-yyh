<template>
    <Modal  width="800"
            v-model="viewDialogVisible"
            title="内容选择"
            :closable="false"
            :mask-closable="false"
            footer-hide>
        <div>
            <div>
                <Card :bordered="false" style="margin-bottom:2px">
                    <Form ref="modalForm" label-position="right" :label-width="100" :model="modalForm" inline>
                        <FormItem label="抽奖团名称" span="24" style="width:30%">
                            <Input v-model="modalForm.name" placeholder=" 抽奖团名称" :maxlength=20 />
                        </FormItem>
                        <FormItem label="状态" span="24"  style="width:30%">
                            <Select v-model="modalForm.status" style="width:100%">
                                <Option v-for="(item,index) in statusList" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem span="24" :label-width="1" style="float: right;">
                            <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')" style="margin-right: 5px">搜索</Button>
                            <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                            <Button icon="md-refresh" @click="reset">重置</Button>
                        </FormItem>
                    </Form>
                </Card>
                <Row>
                    <RadioGroup v-model="selectIndex" @on-change="selectBusiness()" style="width: 100%;">
                        <Table
                                :loading="TableLoading"
                                border
                                :columns="tableColumns"
                                :data="listData"
                                sortable="custom"
                                ref="table"
                        >
                            <template slot-scope="{ row,index }" slot="action">
                                <Radio :label="index"><span></span></Radio>
                            </template>
                        </Table>
                    </RadioGroup>
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
            <Button style="margin-left: 8px;" type="primary" @click="contentSave">保存</Button>
            <Button style="margin-left: 8px;" @click="contentClose">关闭</Button>
        </div>
    </Modal>
</template>

<script>
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    export default {
        name: "drawModal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                listData:[],
                statusList:[{value:'1',label:'未开始'},{value:'2',label:'进行中'}],
                selectIndex:'',
                TableLoading:'',
                modalForm:{
                    name:'',
                    status:'1',
                    current: 1,
                },
                totalSize: 0,
                current: 1,
                selectIndex:'',
                tableColumns: [
                    {
                        title: "操作",
                        width: 80,
                        align: "center",
                        slot: "action",
                        fixed: "left"
                    },
                    {
                        title: "抽奖团名称",
                        minWidth:400,
                        key: "name",
                        align: 'center',
                    },
                    {
                        title: "广告主",
                        minWidth:200,
                        key: "advertName",
                        align: 'center',
                    },
                ],
            }
        },
        methods:{
            resetRow(){
                this.currentTab = '';
                this.modalForm.current= 1;
                this.current= 1;
                this.modalForm.name = '';
                this.modalForm.status = '1';
                this.loadTableData();
            },
            selectBusiness(index){
                this.contentObj = this.listData[this.selectIndex];
                this.contentObj.shopId = this.contentObj.id;
                this.contentObj.shopName = this.contentObj.name;
            },
            search(){
                this.modalForm.current= 1;
                this.current= 1;
                this.loadTableData();
            },
            reset(){
                this.modalForm.current= 1;
                this.current= 1;
                this.modalForm.name = '';
                this.modalForm.status = '1';
                this.loadTableData();
            },
            loadTableData(page){
                this.modalForm.current = page||1;
                var that = this;
                // this.selectDataList = [];
                this.totalSize = 0;
                this.TableLoading = true;
                let params = {
                    pageNum: this.modalForm.current,
                    pageSize: 10,
                    name: this.modalForm.name,
                    status:this.modalForm.status
                }
                postRequest(`/drawDaily/activity/list`,params
                ).then(res => {
                    this.TableLoading = false;
                    if (res.code === "200") {
                        this.totalSize = res.data.total;
                        this.listData = res.data.records||[];
                        if(that.contentObj){
                            let that = this;
                            that.selectIndex = ''
                            this.listData.forEach(function(v,i){
                                if(that.contentObj.value == v.id&&that.contentObj.content == v.name){
                                    that.selectIndex = i;
                                }
                            })
                        }
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            changeCurrent(current) {
                if (this.modalForm.current != current) {
                    this.modalForm.current = current;
                    this.loadTableData(current);
                }
            },
            contentClose(){
                this.$emit('setViewDialogVisible', false)
            },
            contentSave(){
                if(!this.contentObj||!this.contentObj.shopId){
                    this.$Message.error('请选择');
                    return;
                }
                this.$emit('setViewDialogVisible', this.contentObj)
            }
        },
        created(){
        }
    }
</script>

<style scoped>
    .ivu-table-wrapper{
        overflow: visible;
    }
</style>
