<template>
    <Modal  width="800"
            v-model="viewDialogVisible"
            title="优惠券选择"
            :closable="false"
            :mask-closable="false"
            footer-hide>
        <div>
            <div>
                <Card :bordered="false" style="margin-bottom:2px">
                    <Form ref="copponForm" label-position="right" :label-width="80" :model="copponForm" inline>
                        <FormItem label="商家名称" span="24" style="width:45%">
                            <Input v-model="copponForm.name" placeholder=" 请填写商家名称" :maxlength=20 />
                        </FormItem>
                        <FormItem label="省/市" span="24"  style="width:50%">
                            <Cascader :data="addressData" :load-data="addressLoad"></Cascader>
                        </FormItem>
                        <FormItem label="优惠卷名称" span="24" style="width:25%">
                            <Input v-model="copponForm.name" placeholder=" 请填写优惠卷名称" :maxlength=20 />
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
        <div style="text-align: center;margin:10px 0;">
            <Button style="margin-left: 8px;" type="primary" @click="couponSave">保存</Button>
            <Button style="margin-left: 8px;" @click="couponClose">关闭</Button>
        </div>
    </Modal>
</template>

<script>
    import { postRequest} from "@/libs/axios";
    export default {
        name: "couponModal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                TableLoading:'',
                copponForm:{
                    name:'',

                },
                totalSize: 0,
                current: 1,
                selectIndex:'',
                selectRow:{},
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
                tableColumns: [
                    {
                        title: "操作",
                        width: 200,
                        align: "center",
                        slot: "action",
                        fixed: "left"
                    },
                    {
                        title: "商家名称",
                        key: "name",
                        align: 'center',
                    },
                    {
                        title: "省/市",
                        key: "address",
                        align: 'center',
                    },
                    {
                        title: "优惠卷名称",
                        key: "coupon",
                        align: 'center',
                    },
                    {
                        title: "有效期",
                        key: "time",
                        align: 'center',
                    }
                ],
                listData: [],
                selectDataList: [],
            }
        },
        methods:{
            resetRow(row,coupon){
                this.copponForm.name = row.name;
                this.selectRow = coupon;
                this.loadTableData();
            },
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
                this.loadTableData();
            },
            reset(){

            },
            loadTableData(){
                postRequest(
                    "/campagin/list?pageNum=" + this.current + "&pageSize=" + '10',
                    // this.copponForm
                    {}
                ).then(res => {
                    this.TableLoading = false;
                    if (res.code == 200) {
                        this.totalSize = res.data.total;
                        this.listData = res.data.records;
                        if(this.selectRow.id){
                            res.data.records.forEach(function(v,i){
                                if(v.campId === that.selectRow.campId){
                                    that.selectIndex = i;
                                }
                            })
                        }
                    } else {
                        this.msgErr(res.msg);
                    }
                });
            },
            handleSelect(selection, index) {
                this.selectDataList = selection;
            },
            changeCurrent(current) {
                if (this.copponForm.current != current) {
                    this.copponForm.current = current;
                    this.loadTableData();
                }
            },
            selectBusiness(){
               this.selectRow = this.listData[this.selectIndex]
            },
            couponClose(){
                this.$emit('setViewDialogVisible', false)
            },
            couponSave(){
                if(!this.selectIndex&&this.selectIndex!==0){
                    this.$Message.error('请选择优惠卷');
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
