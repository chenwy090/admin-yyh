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
                    <FormItem label="商户名称：">
                        <Select v-model="modal.type" style="width:150px" placeholder="请选择商户类型" @on-change="changeType">
                            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <div style="width: 2%;display: inline-block"></div>
                        <Button v-if="modal.type==1" type="dashed" :disabled="!modal.type"  style="min-width: 150px" @click="openBusinessModal">{{selectBusinessObj&&selectBusinessObj.realName?selectBusinessObj.realName:'请选择商户名称'}}</Button>
                        <Button v-if="modal.type==2" type="dashed" :disabled="!modal.type"  style="min-width: 150px" @click="openBrandModal">{{selectBrandObj&&selectBrandObj.realName?selectBrandObj.realName:'请选择品牌名称'}}</Button>
                        <div style="width: 2%;display: inline-block"></div>
                        <Button v-if="modal.type==2"  @click="brandList=[].concat(oldBrandList)">刷新</Button>
                        <div style="width: 2%;display: inline-block"></div>
                        <span v-if="modal.type==2&&upData.pushCustomerNum">套餐剩余拓客人数 {{upData.remainderPushNum}} 人，套餐截止时间 {{upData.endDate}}</span>
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
                                :max="1000000000"
                                placeholder="请填写推送人数"
                                style="width: 150px"
                        ></InputNumber>
                        <div style="width: 2%;display: inline-block"></div>
                        <span v-if="upData.pushCustomerNum">套餐剩余拓客人数 {{upData.remainderPushNum}} 人，套餐截止时间 {{upData.endDate}}</span>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12" v-if="modal.type==2">
                    <Col span="18">
                    <FormItem label="推送人数：">
                        <Col :key="index"  v-for="(item,index) in brandList" style="margin:10px 0">
                        <Input style="width:48%" v-model="item.merchantName" disabled/>
                        <div style="width: 2%;display: inline-block"></div>
                        <InputNumber
                                width="200"
                                :min="0"
                                :step="1"
                                type="text"
                                :precision="0"
                                :max="1000000000"
                                v-model="item.maxPushCount"
                                placeholder="请填写推送人数"
                                style="width: 150px"
                        ></InputNumber>
                        <div style="width: 2%;display: inline-block"></div>
                        <Button type="error" v-if="brandList.length>1" shape="circle" icon="ios-trash" @click="reduce(index)"></Button>
                    </Col>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="优惠券：">
                        <Button style="width: 150px" type="dashed" :disabled="!modal.type" @click="openCoupon">{{selectCouponObj&&selectCouponObj.title?selectCouponObj.title:'请选择优惠券'}}</Button>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="拓客时间">
                        <DatePicker
                                type="datetime"
                                placeholder
                                format="yyyy-MM-dd HH:mm"
                                :options="options"
                                @on-change="(datetime) =>{ changeDateTime(datetime)}"
                                style="width: 150px"
                        ></DatePicker>
                        <!--<div style="width: 2%;display: inline-block"></div>-->
                        <!--<Select v-model="modal.time1" style="width:50px" placeholder="请选择">-->
                            <!--<Option v-for="item in timeList1" :value="item-1" :key="item">{{ item-1 }}</Option>-->
                        <!--</Select>-->
                        <!--<div style="width: 2%;display: inline-block"></div>-->
                        <!--<Select v-model="modal.time2" style="width:50px" placeholder="请选择">-->
                            <!--<Option v-for="item in timeList2" :value="item-1" :key="item">{{ item-1 }}</Option>-->
                        <!--</Select>-->
                    </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button type="primary" @click="ok">拓客</Button>
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
    import { postRequest } from "@/libs/axios";
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
                typeList:[{value:'1',label:'本地商户(单店)'},{value:'2',label:'本地商户(多店)'}],
                statusList:[{value:0,label:'未开始'},{value:1,label:'进行中'},{value:2,label:'已终止'},{value:3,label:'已结束'}],
                modal:{
                    type:'1',
                    tokerDate:'',
                },
                upData:{},
                options:{
                    disabledDate(date){
                        return date.valueOf() < Date.now()+1000*60*60*24;
                    }
                },
                selectBusinessObj:{},
                selectBrandObj:{},
                brandList:[],
                oldBrandList:[],
                selectCouponObj:{},
                ruleValidate:{
                    requiredType: [{ required: true, message: '', trigger: 'blur' }]
                }
            }
        },
        methods:{
            changeType(){
                this.upData = {};
            },
            changeDateTime(datetime, index) {
                this.modal.tokerDate = datetime;
            },
            resetRow(row){
                this.modal.type = '1';
                this.modal.uNum = null;
                this.modal.date=new Date(Date.now()+2*1000*60*60*24);
                this.modal.time1='';
                this.modal.time2='';
                this.selectBusinessObj={};
                this.selectBrandObj={};
                this.brandList=[];
                this.oldBrandList=[];
                this.selectCouponObj={};
                this.upData={};
            },
            reduce(index){
                this.brandList.splice(index,1);
            },
            openBusinessModal(){
                this.businessVolumeModal = true;
                this.$nextTick(() => {
                    this.$refs['businessModal'].resetRow(this.selectBusinessObj);
                })
            },
            openBrandModal(){
                this.brandVolumeModal = true;
                this.$nextTick(() => {
                    this.$refs['brandModal'].resetRow(this.selectBrandObj);
                })
            },
            openCoupon(){
                if(this.selectBusinessObj.name||this.selectBrandObj.name){
                    this.couponVolumeModal = true;
                    this.$nextTick(() => {
                        this.$refs['couponModal'].resetRow({},this.selectCouponObj);
                    })
                }else{
                    this.$Message.error('请选择商家或品牌');
                }
            },
            selectBusiness(e){
                this.selectBusinessObj = e;
                this.businessVolumeModal = false;
                if(e&&e.id){
                    this.getPackageData(e.id,1);
                }
            },
            selectBrand(e){
                this.selectBrandObj = e;
                this.brandVolumeModal = false;
                if(e&&e.id){
                    this.getPackageData(e.id,2);
                }
            },
            selectCoupon(e){
                this.selectCouponObj = e;
                this.couponVolumeModal = false;
            },
            getPackageData(id,type){
                postRequest(`/merchant/merchantPackageInfo/getPackage`,{id:id,type: type}).then(res => {
                    if (res.code === "200") {
                        console.log(res);
                        this.upData = res.data;
                       if(this.modal.type==2){
                           if(res.data.merchantReqList&&res.data.merchantReqList.length){
                               res.data.merchantReqList.forEach(function(v,i){
                                   v.maxPushCount = 0;
                               });
                               this.oldBrandList = [].concat(res.data.merchantReqList);
                               this.brandList = [].concat(res.data.merchantReqList);
                           }


                       }
                    } else {
                        this.$Message.error(res.msg);
                        this.oldBrandList = [];
                        this.brandList = [];
                    }
                });
            },
            ok(){
                let params = {}
                if(!this.modal.type){
                    this.$Message.error('请选择商户类型');
                    return
                }
                if(!this.upData||!this.upData.id){
                    this.$Message.error('请选择有效套餐');
                    return
                }
                if(this.modal.type==1){
                    if(!this.selectBusinessObj.name){
                        this.$Message.error('请选择商户名称');
                        return
                    }else if(!this.modal.uNum||Number(this.modal.uNum)>Number(this.upData.remainderPushNum)){
                        this.$Message.error('请填写合适推送人数');
                        return
                    }else if(!this.selectCouponObj&&!this.selectCouponObj.merchantName){
                            this.$Message.error('请选择优惠券');
                        return
                    }else if(!this.modal.tokerDate){
                        this.$Message.error('请选择拓客时间');
                        return
                    }
                    params.cityCode = this.selectBusinessObj.cityCode;
                    params.cityName = this.selectBusinessObj.cityName;
                    params.couponId = this.selectCouponObj.templateId;
                    params.couponType = this.selectCouponObj.couponType;
                    params.couponName = this.selectCouponObj.title;
                    params.expandTime = this.modal.tokerDate+":00";
                    params.expandType = '2';
                    params.maxPushCount = this.modal.uNum;
                    params.merchantId =this.selectBusinessObj.merchantId;
                    params.merchantName =this.selectBusinessObj.realName;
                    params.merchantType ='1';
                    params.provinceCode = this.selectBusinessObj.provinceCode;
                    params.provinceName = this.selectBusinessObj.provinceName;
                    params.packageId = this.upData.id;
                }else if(this.modal.type==2){
                    if(!this.selectBrandObj.name){
                        this.$Message.error('请选择品牌名称');
                        return
                    }else if(!this.selectCouponObj&&!this.selectCouponObj.merchantName){
                        this.$Message.error('请选择优惠券');
                        return
                    }else if(!this.modal.tokerDate){
                        this.$Message.error('请选择拓客时间');
                        return
                    }
                    if(!this.brandList||!this.brandList.length){
                        this.$Message.error('请重新选择品牌');
                        return
                    }
                    var flag = true;
                    for(var i = 0;i<this.brandList.length;i++){
                        if(this.brandList[1].maxPushCount-0<=0&&flag){
                            flag = false;
                            this.$Message.error('请填写推送人数');
                            break;
                        }else if(this.brandList[1].maxPushCount-0>=Number(this.upData.remainderPushNum)&&flag){
                            flag = false;
                            this.$Message.error('推送人数不能大于套餐剩余人数');
                            break;
                        }
                    }
                    if( !flag ){
                        return;
                    }
                    // params.cityCode = this.selectBrandObj.cityCode;
                    // params.cityName = this.selectBrandObj.cityName;
                    params.couponId = this.selectCouponObj.templateId;
                    params.couponType = this.selectCouponObj.couponType;
                    params.couponName = this.selectCouponObj.title;
                    params.expandTime = this.modal.tokerDate+":00";
                    params.expandType = '2';
                    params.maxPushCount = this.modal.uNum;
                    params.merchantReqs = this.brandList;
                    params.merchantId =this.selectBrandObj.id;
                    params.merchantName =this.selectBrandObj.realName;
                    params.packageId =this.upData.id;
                    params.merchantType ='2';
                    // params.provinceCode = this.selectBrandObj.provinceCode;
                    // params.provinceName = this.selectBrandObj.provinceName;
                }
                postRequest(`/merchant/platform/expand/add`,params).then(res => {
                    if (res.code === "200") {
                        this.$Message.success('拓客成功,即将跳回列表');
                        this.$emit('setViewDialogVisible', false);
                        this.$emit('search');
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
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
