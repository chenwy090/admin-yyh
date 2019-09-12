<template>
    <Modal  width="800"
            v-model="viewDialogVisible"
            title="品牌选择"
            :closable="false"
            :mask-closable="false"
            footer-hide>
        <div>
            <div>
                <Card :bordered="false" style="margin-bottom:2px">
                    <Form ref="brandForm" label-position="right" :label-width="80" :model="brandForm" inline>
                        <FormItem label="品牌名称" span="24" style="width:25%">
                            <Input v-model="brandForm.name" placeholder=" 请填写品牌名称" :maxlength=20 />
                        </FormItem>
                        <FormItem span="24" :label-width="1" style="float: right;">
                            <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')" style="margin-right: 5px">搜索</Button>
                            <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                            <Button icon="md-refresh" @click="reset">重置</Button>
                        </FormItem>
                    </Form>
                </Card>
                <Row>
                    <RadioGroup v-model="selectIndex" @on-change="selectBusiness" style="width: 100%;">
                        <Table
                                :loading="TableLoading"
                                border
                                :columns="tableColumns"
                                :data="listData"
                                sortable="custom"
                                ref="table"
                                @on-selection-change="handleSelect"
                        >
                            <template slot-scope="{ row,index }" slot="action">
                                <Radio :label="index"><span></span></Radio>
                            </template>
                            <template slot-scope="{ row }" slot="activeTime">
                                <div>{{row.activeTime}}</div>
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
        <div style="text-align: center;margin:10px">
            <Button style="margin-left: 8px;" type="primary" @click="brandSave">保存</Button>
            <Button style="margin-left: 8px;" @click="brandClose">关闭</Button>
        </div>
    </Modal>
</template>

<script>
    import { postRequest} from "@/libs/axios";
    export default {
        name: "brandModal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                TableLoading:'',
                brandForm:{
                    name:'',
                    current: 1,
                },
                totalSize: 0,
                current: 1,
                selectIndex:'',
                selectRow:{},
                isDown:false,
                tableColumns: [
                    {
                        title: "操作",
                        width: 200,
                        align: "center",
                        slot: "action",
                        fixed: "left"
                    },
                    {
                        title: "品牌名称",
                        key: "realName",
                        align: 'center',
                    }
                ],
                listData: [],
                selectDataList: [],
            }
        },
        methods:{
            resetRow(row,status){
                if(status){
                    this.isDown = true;
                }
                this.brandForm.name = '';
                this.brandForm.current = 1;
                this.selectRow = row;
                this.loadTableData()
            },
            search(){
                this.loadTableData();
            },
            reset(){
                this.brandForm.current = 1;
                this.brandForm.name = '';
            },
            handleSelect(selection, index) {
                this.selectDataList = selection;
            },
            changeCurrent(current) {
                if (this.brandForm.current != current) {
                    this.brandForm.current = current;
                    this.loadTableData();
                }
            },
            selectBusiness(){
                console.log(this.selectIndex);
                this.selectRow = this.listData[this.selectIndex]
            },
            brandClose(){
                this.$emit('setViewDialogVisible',this.selectRow)
            },
            brandSave(){
                if(!this.selectIndex&&this.selectIndex!==0){
                    this.$Message.error('请选择品牌');
                    return;
                }
                this.$emit('setViewDialogVisible', this.selectRow)
            },
            loadTableData(){
                let that = this;
                this.TableLoading=true;
                this.selectIndex = '';
                postRequest(`/merchant/platform/expand/listBrand?pageNum=${this.brandForm.current}&pageSize=10`,{
                        name:this.brandForm.name,
                        pageNum: this.current,
                        pageSize: 10,
                        status:this.isDown?null:2,
                    }
                ).then(res => {
                    this.TableLoading=false;
                    if (res.code === "200") {
                        this.totalSize = res.data.total;
                        this.listData = res.data.records;
                        if(this.selectRow.id){
                            res.data.records.forEach(function(v,i){
                                console.log(111);
                                if(v.id === that.selectRow.id){
                                    that.selectIndex = i;
                                }
                            })
                        }
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            }
        },
        created(){
            //
        }
    }
</script>

<style scoped>

</style>
