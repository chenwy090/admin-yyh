<template>
    <Modal  width="800"
            v-model="viewDialogVisible"
            title="商户选择"
            :closable="false"
            :mask-closable="false"
            footer-hide>
        <div>
            <div>
                <Card :bordered="false" style="margin-bottom:2px">
                    <Form ref="businessModal" label-position="right" :label-width="80" :model="businessModal" inline>
                        <FormItem label="商户名称" span="24" style="width:25%">
                            <Input v-model="businessModal.name" placeholder=" 请填写商户名称" :maxlength=20 />
                        </FormItem>
                        <FormItem label="省/市" span="24"  style="width:40%">
                            <Cascader :data="addressData" :load-data="addressLoad"></Cascader>
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
            <Button style="margin-left: 8px;" type="primary" @click="businessSave">保存</Button>
            <Button style="margin-left: 8px;" @click="businessClose">关闭</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        name: "businessModal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                TableLoading:'',
                businessModal:{
                    name:'',

                },
                selectRow:'',
                selectIndex:"",
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
                totalSize: 0,
                current: 1,
                tableColumns: [
                    {
                        title: "操作",
                        width: 50,
                        align: "center",
                        slot: "action",
                        fixed: "left"
                    },
                    {
                        title: "商户名称",
                        key: "name",
                        align: 'center',
                    },
                    {
                        title: "省/市",
                        key: "address",
                        align: 'center',
                    }
                ],
                listData: [
                    {name:'一兆韦德核销券赠脉动饮料',address:'浙江省/杭州市',coupon:'满100减50',time:'2019-08-29 -- 2019-09-10'},
                    {name:'阿里巴巴',address:'浙江省/杭州市',coupon:'满100减50',time:'2019-08-29 -- 2019-09-10'}
                ],
                selectDataList: [],
            }
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
            search(){
                this.TableLoading = false;
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
                if (this.businessModal.current != current) {
                    this.businessModal.current = current;
                    this.loadTableData(this.searchForm);
                }
            },
            selectBusiness(){
                console.log(this.selectIndex);
                this.selectRow = this.listData[this.selectIndex]
            },
            businessClose(){
                this.$emit('setViewDialogVisible', false)
            },
            businessSave(){
                if(!this.selectIndex&&this.selectIndex!==0){
                    this.$Message.error('请选择商户');
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
