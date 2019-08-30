<template>
    <div v-if="viewDialogVisible" class="modal" @click.stop>
        <Card>
            <p slot="title">下载</p>
            <a href="#" slot="extra">
                <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
            </a>
            <Form :model="modal" ref="addOrEditModal" :rules="ruleValidate" :label-width="80" label-position="left">
                <Row class="padding-left-12">
                    <Col span="24">
                    <FormItem label="商户名称：">
                        <Select v-model="modal.type" style="width:150px" placeholder="请选择商户类型">
                            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <div style="width: 2%;display: inline-block"></div>
                        <Button v-if="modal.type==1" type="dashed" :disabled="!modal.type"  style="min-width: 150px" @click="businessVolumeModal = true;">{{selectBusinessObj&&selectBusinessObj.name?selectBusinessObj.name:'请选择商户名称'}}</Button>
                        <Button v-if="modal.type==2" type="dashed" :disabled="!modal.type"  style="min-width: 150px" @click="brandVolumeModal = true;">{{selectBrandObj&&selectBrandObj.name?selectBrandObj.name:'请选择品牌名称'}}</Button>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="套餐：" span="24">
                        <Select v-model="modal.status" style="width:150px">
                            <Option v-for="item in packageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="拓客时间：">
                        <DatePicker
                                :value="modal.applyDateRangeOpen"
                                type="date"
                                style="width: 150px"
                                :options="options1"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                        ></DatePicker>
                        <div style="width: 2%;display: inline-block"></div>
                        <DatePicker
                                :value="modal.applyDateRangeClose"
                                type="date"
                                :options="options2"
                                style="width: 150px"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                        ></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button type="primary" @click="downLoad">下载</Button>
                    <Button style="margin-left: 8px;" @click="close">关闭</Button>
                </FormItem>
            </Form>
        </Card>
        <!--</Modal>-->
        <brandModal ref="brandModal" :viewDialogVisible="brandVolumeModal" @setViewDialogVisible="selectBrand"></brandModal>
        <businessModal ref="businessModal" :viewDialogVisible="businessVolumeModal" @setViewDialogVisible="selectBusiness"></businessModal>

    </div>


</template>

<script>
    import brandModal from "./brandModal";
    import businessModal from "./businessModal"
    export default {
        name: "downLoadModal",
        components:{brandModal,businessModal},
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                brandVolumeModal:false,
                businessVolumeModal:false,
                timeList1:24,
                timeList2:60,
                typeList:[{value:'1',label:'本地商户(单店)'},{value:'2',label:'本地商户(多店)'}],
                statusList:[{value:0,label:'未开始'},{value:1,label:'进行中'},{value:2,label:'已终止'},{value:3,label:'已结束'}],
                packageList:[{value:0,label:'全部'},{value:1,label:'精准拓客'},{value:2,label:'平台拓客'}],
                modal:{
                    type:'1',
                    name:'',
                    date:new Date(Date.now()+2*1000*60*60*24),
                    applyDateRangeOpen:'',
                    applyDateRangeClose:'',
                    active:'',
                    type:'核销赠U贝',
                    uNum:0,
                    mark:'',
                    static:'0',
                },
                options1:{},
                options2:{},
                selectBusinessObj:{},
                selectBrandObj:{},
                brandList:[
                    {name:'aaaa',num:0},
                    {name:'bbbb',num:0},
                    {name:'cccc',num:0},
                    {name:'dddd',num:0},
                ],
                oldBrandList:[
                    {name:'aaaa',num:0},
                    {name:'bbbb',num:0},
                    {name:'cccc',num:0},
                    {name:'dddd',num:0},
                ],
                selectCouponObj:{},
                ruleValidate:{
                    requiredType: [{ required: true, message: '', trigger: 'blur' }]
                }
            }
        },
        methods:{
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.modal.applyDateRangeOpen = datetime;
                    this.options2 = {
                        disabledDate(date){
                            return date.valueOf() <  new Date(datetime)-1000*60*60*24;
                        }
                    }
                    break;
                case 2:
                    this.modal.applyDateRangeClose = datetime;
                    this.options1 = {
                        disabledDate(date){
                            return date.valueOf() > new Date(datetime);
                        }
                    }
                    break;
                }
            },
            resetRow(row){
            },
            selectBusiness(e){
                this.selectBusinessObj = e;
                this.businessVolumeModal = false;
            },
            selectBrand(e){
                this.selectBrandObj = e;
                this.brandVolumeModal = false;
            },
            downLoad(){
                this.$emit('setViewDialogVisible', false)
            },
            close() {
                this.$emit('setViewDialogVisible', false)
            }
        }
    }
</script>

<style scoped>
    h3{
        border-left: 3px solid #333;
        padding-left: 10px;
        margin: 15px 0;
    }
    .padding-left-12{
        padding-left: 12px;
    }
    .colof-a2{
        color:#a2a2a2;
    }
    .ivu-radio-group-vertical .ivu-radio-wrapper{
        height: auto;
    }
</style>
