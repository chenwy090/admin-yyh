<template>
    <div v-if="viewDialogVisible" class="modal" @click.stop>
        <Card>
            <p slot="title">平台拓客</p>
            <a href="#" slot="extra">
                <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
            </a>
            <Form :model="modal" ref="addOrEditModal" :rules="ruleValidate" :label-width="80" label-position="left">
                <!--<h3>平台拓客</h3>-->
                <Row class="padding-left-12">
                    <Col span="24">
                    <FormItem label="活动名称：">
                        <Select v-model="modal.type" style="width:150px" placeholder="请选择商户类型">
                            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <div style="width: 2%;display: inline-block"></div>
                        <Button v-if="modal.type==1" type="dashed" :disabled="!modal.type"  style="min-width: 150px" @click="businessVolumeModal = true;">{{selectBusinessObj&&selectBusinessObj.name?selectBusinessObj.name:'请选择商户名称'}}</Button>
                        <Button v-if="modal.type==2" type="dashed" :disabled="!modal.type"  style="min-width: 150px" @click="brandVolumeModal = true;">{{selectBrandObj&&selectBrandObj.name?selectBrandObj.name:'请选择品牌名称'}}</Button>
                        <div style="width: 2%;display: inline-block"></div>
                        <Button v-if="modal.type==2"  @click="brandList=oldBrandList">刷新</Button>
                        <div style="width: 2%;display: inline-block"></div>
                        <span v-if="modal.type==2">套餐剩余拓客人数 1000 人，套餐截止时间 2019-09-10</span>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12" v-if="modal.type==1">
                    <Col span="18">
                    <FormItem label="推送人数：">
                        <InputNumber
                                width="200"
                                :min="0"
                                :step="1"
                                type="text"
                                :precision="0"
                                v-model="modal.uNum"
                                placeholder="请填写推送人数"
                                style="width: 150px"
                        ></InputNumber>
                        <div style="width: 2%;display: inline-block"></div>
                        <span>套餐剩余拓客人数 1000 人，套餐截止时间 2019-09-10</span>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12" v-if="modal.type==2">
                    <Col span="18">
                    <FormItem label="推送人数：">
                        <Col  v-for="(item,index) in brandList" style="margin:10px 0">
                        <Input style="width:48%" v-model="item.name" disabled/>
                        <div style="width: 2%;display: inline-block"></div>
                        <InputNumber
                                width="200"
                                :min="0"
                                :step="1"
                                type="text"
                                :precision="0"
                                v-model="item.num"
                                placeholder="请填写推送人数"
                                style="width: 150px"
                        ></InputNumber>
                        <div style="width: 2%;display: inline-block"></div>
                        <Button type="error" v-if="JList.length>1" shape="circle" icon="ios-trash" @click="reduce(index)"></Button>
                    </Col>

                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="优惠卷：">
                        <Button style="width: 150px" type="dashed" :disabled="!modal.type" @click="openCoupon">{{selectCouponObj&&selectCouponObj.name?selectCouponObj.name:'请选择优惠卷'}}</Button>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="拓客时间">
                        <DatePicker
                                :value="modal.date"
                                type="date"
                                placeholder
                                style="width: 150px"
                                disabled
                        ></DatePicker>
                        <div style="width: 2%;display: inline-block"></div>
                        <Select v-model="modal.time1" style="width:50px" placeholder="请选择商户类型">
                            <Option v-for="item in timeList1" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                        <div style="width: 2%;display: inline-block"></div>
                        <Select v-model="modal.type" style="width:50px" placeholder="请选择商户类型">
                            <Option v-for="item in timeList2" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button type="primary" @click="close">拓客</Button>
                    <Button style="margin-left: 8px;" @click="close">关闭</Button>
                </FormItem>
            </Form>
        </Card>
        <!--</Modal>-->
        <brandModal ref="brandModal" :viewDialogVisible="brandVolumeModal" @setViewDialogVisible="selectBrand"></brandModal>
        <businessModal ref="businessModal" :viewDialogVisible="businessVolumeModal" @setViewDialogVisible="selectBusiness"></businessModal>
        <couponModal ref="couponModal" :viewDialogVisible="couponVolumeModal" @setViewDialogVisible="selectCoupon"></couponModal>
    </div>


</template>

<script>
    import brandModal from "./brandModal";
    import businessModal from "./businessModal"
    import couponModal from "./couponModal"
    export default {
        name: "TokerModal",
        components:{brandModal,businessModal,couponModal},
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                brandVolumeModal:false,
                businessVolumeModal:false,
                couponVolumeModal:false,
                timeList1:24,
                timeList2:60,
                typeList:[{value:'1',label:'本地商户(单店)'},{value:'2',label:'本地商户(多店)'}],
                statusList:[{value:0,label:'未开始'},{value:1,label:'进行中'},{value:2,label:'已终止'},{value:3,label:'已结束'}],
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
                    break;
                case 2:
                    this.modal.applyDateRangeClose = datetime;
                    break;
                }
            },
            resetRow(row){
                if(row){
                    this.titleName = "编辑";
                    this.modal.active =  "测试参与活动券"
                    this.modal.applyDateRangeClose= "2019-08-30"
                    this.modal.applyDateRangeOpen= "2019-08-27"
                    this.modal.mark= "测试核销赠酒案"
                    this.modal.name= "测试编辑"
                    this.modal.type= "type1"
                    this.modal.static= "1"
                }else{
                    this.titleName = '新增';
                    this.modal = {};
                }
            },
            reduce(index){
                this.brandList.splice(index,1);
            },
            openCoupon(){
                if(this.selectBusinessObj.name){
                    this.couponVolumeModal = true;
                    this.$nextTick(() => {
                        this.$refs['couponModal'].resetRow(this.selectBusinessObj);
                    })
                }else{
                    this.$Message.error('请选择商家');
                }
            },
            selectBusiness(e){
                this.selectBusinessObj = e;
                this.businessVolumeModal = false;
            },
            selectBrand(e){
                this.selectBrandObj = e;
                this.brandVolumeModal = false;
            },
            selectCoupon(e){
                this.selectCouponObj = e;
                this.couponVolumeModal = false;
            },
            ok(){
                console.log(this.modal);
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
