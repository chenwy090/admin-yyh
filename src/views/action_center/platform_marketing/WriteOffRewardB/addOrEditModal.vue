<template>
    <!--新增/编辑弹窗-->
    <!--<Modal width="800"-->
            <!--v-model="viewDialogVisible"-->
            <!--:title="titleName"-->
           <!--:closable="false"-->
           <!--:mask-closable="false"-->
           <!--footer-hide>-->
    <div v-if="viewDialogVisible" class="modal" @click.stop>
        <Card>
            <p slot="title">新增</p>
            <a href="#" slot="extra">
                <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
            </a>
            <Form :model="modal" ref="addOrEditModal" :rules="ruleValidate" :label-width="80" label-position="left">
                <h3>活动信息</h3>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="活动名称:">
                        <Input
                                type="text"
                                v-model="modal.name"
                                placeholder="请填写活动名称，20字以内"
                                style="width: 100%"
                                :maxlength=20
                        ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="活动时间:">
                        <DatePicker
                                :value="modal.startTime"
                                type="date"
                                placeholder
                                style="width: 160px"
                                :options="options1"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                        ></DatePicker>
                        <div style="width: 2%;display: inline-block"></div>
                        <DatePicker
                                :value="modal.endTime"
                                type="date"
                                placeholder
                                style="width: 160px"
                                :options="options2"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                        ></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <h3>请选择参与活动券</h3>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="参与活动券:">
                        <Button type="dashed" @click="openCoupon">
                            <span v-if="couponObj.length===0">参与活动券</span>
                            <Button v-for="(item,index) in couponObj" class="coupon-item">
                                {{item.title +'&nbsp&nbsp'}}
                                <Icon @click="reMoveCoupon(index)" type="ios-close"/>
                            </Button>
                        </Button>
                    </FormItem>
                    </Col>
                </Row>
                <h3>赠送规则</h3>
                <Row class="padding-left-12">
                    <Col span="24">
                    <RadioGroup v-model="modal.wardType" vertical style="width: 100%" :on-change="changeRadio">
                        <Radio label="1" style="display: inline-block">
                            <span>核销赠券</span>
                        </Radio>
                            <div style="width: 2%;display: inline-block"></div>
                            <span class="colof-a2">(在核销商户券码时，赠送优惠券至店员卡包，前提店员是要优惠C端用户)</span>
                            <div style="width: 2%;display: inline-block"></div>
                            <Button style="float: right;" type="primary" icon="md-add" @click="addJList">新增</Button>
                                <div  v-for="(item,index) in JawardRuleDtos" class="radio-item">
                                    <div>
                                        <span>每日核销范围在&nbsp;</span>
                                        <InputNumber
                                                :min="1"
                                                :step="1"
                                                type="text"
                                                :precision="0"
                                                v-model="item.verifyCountMin"
                                                placeholder="请输入数值"
                                        ></InputNumber>
                                        <div style="width: 2%;display: inline-block"></div>
                                        <InputNumber
                                                :min="1"
                                                :step="1"
                                                type="text"
                                                :precision="0"
                                                v-model="item.verifyCountMax"
                                                placeholder="请输入数值"
                                        ></InputNumber>
                                        <span>&nbsp;张时，赠送以下优惠券</span>
                                        <div style="width: 2%;display: inline-block"></div>
                                        <span class="colof-a2">(后面文本框的数值不填写，表示无限大)</span>
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <Button type="dashed" @click="openVolume(item)">{{item.awardName||item.title?item.awardName||item.title:'请选择优惠券'}}</Button>
                                    </div>
                                    <div class="reduce-btn">
                                        <Button type="error" v-if="JawardRuleDtos.length>1" shape="circle" icon="ios-trash" @click="reduce(JawardRuleDtos,index)"></Button>
                                    </div>
                                </div>
                        <Radio label="2" style="display: inline-block">
                            <span>核销赠U贝</span>
                        </Radio>
                            <div style="width: 2%;display: inline-block"></div>
                            <span class="colof-a2">(在核销主商户券码时，赠送平台U贝，前提店员是要优惠C端用户)</span>
                            <div style="width: 2%;display: inline-block"></div>
                            <Button  style="float: right;" type="primary" icon="md-add" @click="addUList">新增</Button>
                                <div  v-for="(item,index) in UawardRuleDtos" class="radio-item">
                                    <span>每日核销范围在&nbsp;</span>
                                    <InputNumber
                                            :min="0"
                                            :step="1"
                                            type="text"
                                            :precision="0"
                                            v-model="item.verifyCountMin"
                                            placeholder="请输入数值"
                                    ></InputNumber>
                                    <div style="width: 2%;display: inline-block"></div>
                                    <InputNumber
                                            :min="1"
                                            :step="1"
                                            type="text"
                                            :precision="0"
                                            v-model="item.verifyCountMax"
                                            placeholder="请输入数值"
                                    ></InputNumber>
                                    <span>&nbsp;张时，赠送以下U贝</span>
                                    <span class="colof-a2">(后面文本框的数值不填写，表示无限大)</span>
                                    <div style="margin: 10px 0;">
                                        <InputNumber
                                                :min="0"
                                                :step="1"
                                                type="text"
                                                :precision="0"
                                                v-model="item.awardAmount"
                                                placeholder="请输入U贝数量"
                                                style="width: 150px"
                                        ></InputNumber>
                                    </div>
                                    <div class="reduce-btn">
                                        <Button type="error" v-if="UawardRuleDtos.length>1" shape="circle" icon="ios-trash" @click="reduce(UawardRuleDtos,index)"></Button>
                                    </div>
                                </div>
                    </RadioGroup>
                    </Col>
                </Row>
                <FormItem>
                    <Button style="margin:20px" type="primary" size="large" @click="ok()">保存</Button>
                    <!--<Button style="margin-left: 8px;float: right;" @click="close">关闭</Button>-->
                </FormItem>
            </Form>
        </Card>
    <!--</Modal>-->
        <volumeModal ref="volumeModal" :viewDialogVisible="selectActiveVolumeModal" @setViewDialogVisible="selectVolume"></volumeModal>
        <couponModal ref="couponModal" :viewDialogVisible="couponViewDialogModal" @setViewDialogVisible="selectCoupon"></couponModal>
    </div>
</template>

<script>
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    import volumeModal from "./volumeModal"
    import couponModal from "./couponModalB"
    export default {
        name: "add-or-edit-modal",
        components:{volumeModal,couponModal},
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                titleName:'',
                selectActiveVolumeModal:false,
                selectActiveVolumeObj:{},
                couponViewDialogModal:false,
                couponObj:[],
                modal:{
                    name:'',
                    startTime:'',
                    endTime:'',
                    awardType:'1',
                    type:'1'
                },
                options2:{
                    disabledDate(date){
                        return date.valueOf() < Date.now()-1000*60*60*24;
                    }
                },
                options1:{
                    disabledDate(date){
                        return date.valueOf() < Date.now()-1000*60*60*24;
                    }
                },
                JawardRuleDtos:[{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'1',couponType:'',awardName:''}],
                UawardRuleDtos:[{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'2',couponType:'',awardName:''}],
                ruleValidate: {}
            }
        },
        methods:{
            numArrayValidator(list){
                var flag = true;
                var arr = list.sort(function(a,b){
                    return (a.verifyCountMin||0) - (b.verifyCountMin||0)
                })
                for(let i=0;i<arr.length-1;i++){
                    if((arr[i].verifyCountMax||Infinity)<=(arr[i].verifyCountMin||0)){
                        this.$Message.error({
                            content: "最小值不能大于等于最大值",
                            duration: 3
                        });
                        flag = false;
                        break;
                    }else if((arr[i].verifyCountMax||Infinity)>=(arr[i+1].verifyCountMin||0)){
                        this.$Message.error({
                            content: "请输入正确区间数值",
                            duration: 3
                        });
                        flag = false;
                        break;
                    }
                }
                return flag;
            },
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.modal.startTime = datetime;
                    this.options2 = {
                        disabledDate(date){
                            return date.valueOf() <  new Date(datetime)-1000*60*60*24;
                        }
                    }
                    break;
                case 2:
                    this.modal.endTime = datetime;
                    this.options1 = {
                        disabledDate(date){
                            return date.valueOf() < Date.now()-1000*60*60*24||date.valueOf() > new Date(datetime);
                        }
                    }
                    break;
                }
            },
            changeRadio(){
                // this.awardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'',couponType:'',awardName:''}];
            },
            resetRow(row){
                this.options2={
                    disabledDate(date){
                        return date.valueOf() < Date.now()-1000*60*60*24;
                    }
                };
                this.options1={
                    disabledDate(date){
                        return date.valueOf() < Date.now()-1000*60*60*24;
                    }
                };
                if(row){
                    this.titleName = "编辑";
                    this.modal.id= row.id;
                    // /merchant/activity/award/activity/{id}
                    getRequest(`/merchant/activity/award/activity/${row.id}`).then(res => {
                        if (res.code === "200") {
                            var data = res.data;
                            this.modal.name = data.name;
                            this.modal.startTime = data.startTime;
                            this.modal.wardType = data.awardType.toString();
                            this.modal.endTime = data.endTime;
                            this.modal.type = '2';
                            this.couponObj = data.coupons;
                            this.modal.status = data.status;
                            if(data.awardRuleVos&&data.awardRuleVos.length){
                                data.awardRuleVos.forEach(function(v,i){
                                    v.awardAmount = v.award;
                                });
                            }
                            if(data.awardType=='1'){
                                this.JawardRuleDtos = data.awardRuleVos;
                                this.UawardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'1',couponType:'',awardName:''}];
                            }else if(data.awardType=='2'){
                                this.UawardRuleDtos = data.awardRuleVos;
                                this.JawardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'2',couponType:'',awardName:''}];
                            }
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }else{
                    this.titleName = '新增';
                    this.modal.name = '';
                    this.modal.startTime = '';
                    this.modal.wardType = '';
                    this.modal.endTime = '';
                    this.modal.type = '1';
                    this.couponObj = [];
                    this.JawardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'1',couponType:'',awardName:''}];
                    this.UawardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'2',couponType:'',awardName:''}];
                }
            },
            openCoupon(){
                this.couponViewDialogModal = true;
                this.$nextTick(() => {
                    this.$refs['couponModal'].resetRow(this.couponObj);
                })
            },
            selectCoupon(e){
                this.couponViewDialogModal = false;
                if(e){
                    var that = this;
                    e.forEach(function (v,i) {
                        that.couponObj.forEach(function(value,index){
                            if(v.templateId === (value.templateId||value.id)){
                                e.splice(i,1);
                            }
                        })
                    })
                    this.couponObj = this.couponObj.concat(e);
                }
            },
            openVolume(item){
                this.selectActiveVolumeModal = true;
                this.$nextTick(() => {
                    this.$refs['volumeModal'].resetRow(item);
                })
            },
            selectVolume(){
                this.selectActiveVolumeModal = false;
            },
            addJList(){
                this.JawardRuleDtos.push({verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'1',couponType:'',awardName:''});
            },
            addUList(){
                this.UawardRuleDtos.push({verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'2',couponType:'',awardName:''});
            },
            reduce(list,index){
                list.splice(index,1);
            },
            reMoveCoupon(index){
                this.couponObj.splice(index,1);
            },
            ok(){

                // /merchant/activity/award/add/activity
                // /merchant/activity/award/update/activity
                let params =  {
                    "endTime": this.modal.endTime,
                    "id": this.modal.id,
                    "name": this.modal.name,
                    "startTime": this.modal.startTime,
                    "type": this.modal.type,
                    "wardType": this.modal.wardType,
                    type:2
                }
                let couponIds = [];
                this.couponObj.forEach(function(v,i){
                    couponIds.push(v.templateId||v.id);
                });
                params.couponIds = couponIds;
                if(!this.modal.wardType){
                    this.$Message.error('请选择赠送类型');
                    return;
                }
                if(this.modal.wardType=='1'){
                    params.awardRuleDtos = this.JawardRuleDtos;
                }else if(this.modal.wardType=='2'){
                    params.awardRuleDtos = this.UawardRuleDtos;
                }
                if(this.numArrayValidator( params.awardRuleDtos)){
                    if(this.titleName=='新增'){
                        postRequest(`/merchant/activity/award/add/activity`,params).then(res => {
                            if (res.code === "200") {
                                this.$Message.success("新增成功");
                                this.$emit('setViewDialogVisible', false)
                                this.$emit('search')
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    }else{
                        postRequest(`/merchant/activity/award/update/activity`,params).then(res => {
                            if (res.code === "200") {
                                this.$Message.success("编辑成功");
                                this.$emit('setViewDialogVisible', false)
                                this.$emit('search')
                            } else {
                                this.$Message.error(res.msg);
                            }
                        })
                    }
                }
            },
            close() {
                this.$emit('setViewDialogVisible', false)
            }
        }
    }
</script>

<style scoped>
    .modal{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100%;
        background: #fff;
        padding: 10px;
        z-index: 1;
    }
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
    .reduce-btn{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-20px,-50%);
    }
    .radio-item{
       width: 100%;
        border: 1px solid #f4f4f4;
        padding: 10px;
        margin: 10px 0;
        position: relative;
    }
    .coupon-item{

    }
</style>
