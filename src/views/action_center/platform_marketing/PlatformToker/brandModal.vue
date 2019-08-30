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
        <div style="text-align: center">
            <Button style="margin-left: 8px;" type="primary" @click="brandSave">保存</Button>
            <Button style="margin-left: 8px;" @click="brandClose">关闭</Button>
        </div>
    </Modal>
</template>

<script>
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

                },
                totalSize: 0,
                current: 1,
                selectIndex:'',
                selectRow:{},
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
                        key: "name",
                        align: 'center',
                    }
                ],
                listData: [
                    {name:'一兆韦德核销券赠脉动饮料'},
                    {name:'阿里巴巴'}
                ],
                selectDataList: [],
            }
        },
        methods:{
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
                if (this.brandForm.current != current) {
                    this.brandForm.current = current;
                    this.loadTableData(this.searchForm);
                }
            },
            selectBusiness(){
                console.log(this.selectIndex);
                this.selectRow = this.listData[this.selectIndex]
            },
            brandClose(){
                this.$emit('setViewDialogVisible', false)
            },
            brandSave(){
                if(!this.selectIndex&&this.selectIndex!==0){
                    this.$Message.error('请选择品牌');
                    return;
                }
                this.$emit('setViewDialogVisible', this.selectRow)
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
