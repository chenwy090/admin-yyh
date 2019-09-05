<template>
    <!--新增/编辑弹窗-->
    <Modal width="800"
           v-model="viewDialogVisible"
           title="查看详情"
           :closable="false"
           :mask-closable="false"
           footer-hide>
        <Form :model="modal" ref="addOrEditModal" :rules="ruleValidate" :label-width="80" label-position="left">
            <h3>活动信息</h3>
            <Row class="padding-left-12">
                <Col span="18">
                <FormItem label="活动名称">
                    {{modal.name}}
                </FormItem>
                </Col>
            </Row>
            <Row class="padding-left-12">
                <Col span="18">
                <FormItem label="活动时间">
                    {{modal.startTime}} -- {{modal.endTime}}
                </FormItem>
                </Col>
            </Row>
            <Row class="padding-left-12">
                <Col span="18">
                <FormItem label="状态">
                    <!--<DatePicker-->
                    <!--:value="modal.applyDateRangeOpen"-->
                    <!--type="date"-->
                    <!--placeholder-->
                    <!--style="width: 160px"-->
                    <!--@on-change="(datetime) =>{ changeDateTime(datetime, 1)}"-->
                    <!--&gt;</DatePicker>&#45;&#45;-->
                    <!--<DatePicker-->
                    <!--:value="modal.applyDateRangeClose"-->
                    <!--type="date"-->
                    <!--placeholder-->
                    <!--style="width: 160px"-->
                    <!--@on-change="(datetime) =>{ changeDateTime(datetime, 2)}"-->
                    <!--&gt;</DatePicker>-->
                    {{statusList[modal.static].label}}
                </FormItem>
                </Col>
            </Row>
            <h3>请选择参与活动券</h3>
            <Row class="padding-left-12">
                <Col span="18">
                <FormItem label="参与活动券">
                    <!--<Input v-model="modal.active" type="textarea" placeholder="请选择要参与活动优惠券" />-->
                    <Button type="dashed">
                        <span v-if="couponObj.length===0">参与活动券</span>
                        <span v-for="item in couponObj">{{item.title +'&nbsp&nbsp'}}</span>
                    </Button>
                </FormItem>
                </Col>
            </Row>
            <h3>赠送规则</h3>
            <Row class="padding-left-12">
                <Col span="18">
                <RadioGroup v-model="modal.wardType" vertical style="width: 100%">
                    <Radio label="1" style="display: inline-block">
                        <span>核销赠券</span>
                    </Radio>
                    <div style="width: 2%;display: inline-block"></div>
                    <span class="colof-a2">(在核销商户券码时，赠送优惠券至店员卡包，前提店员是要优惠C端用户)</span>
                    <div style="width: 2%;display: inline-block"></div>
                    <div  v-for="(item,index) in JawardRuleDtos" class="radio-item">
                        <div>
                            <span>每日核销范围在&nbsp;</span>
                            <InputNumber
                                    :min="1"
                                    :step="1"
                                    type="text"
                                    :precision="0"
                                    v-model="item.verifyCountMin"
                                    disabled
                                    placeholder="请输入数值"
                            ></InputNumber>
                            <div style="width: 2%;display: inline-block"></div>
                            <InputNumber
                                    :min="1"
                                    :step="1"
                                    type="text"
                                    :precision="0"
                                    v-model="item.verifyCountMax"
                                    disabled
                                    placeholder="请输入数值"
                            ></InputNumber>
                            <span>&nbsp;张时，赠送以下优惠券</span>
                            <div style="width: 2%;display: inline-block"></div>
                            <span class="colof-a2">(后面文本框的数值不填写，表示无限大)</span>
                        </div>
                        <div style="margin: 10px 0;">
                            <Button type="dashed">{{item.title}}</Button>
                        </div>
                    </div>
                    <Radio label="2" style="display: inline-block">
                        <span>核销赠U贝</span>
                    </Radio>
                    <div style="width: 2%;display: inline-block"></div>
                    <span class="colof-a2">(在核销主商户券码时，赠送平台U贝，前提店员是要优惠C端用户)</span>
                    <div style="width: 2%;display: inline-block"></div>
                    <div  v-for="(item,index) in UawardRuleDtos" class="radio-item">
                        <span>每日核销范围在&nbsp;</span>
                        <InputNumber
                                :min="0"
                                :step="1"
                                type="text"
                                :precision="0"
                                disabled
                                v-model="item.verifyCountMin"
                                placeholder="请输入数值"
                        ></InputNumber>
                        <div style="width: 2%;display: inline-block"></div>
                        <InputNumber
                                :min="1"
                                :step="1"
                                type="text"
                                :precision="0"
                                disabled
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
                                    disabled
                                    placeholder="请输入U贝数量"
                                    style="width: 150px"
                            ></InputNumber>
                        </div>
                    </div>
                </RadioGroup>
                </Col>
            </Row>
            <FormItem>
                <Button style="margin-left: 8px;float: right;" @click="close">关闭</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
    import { postRequest, getRequest,getSyncRequest,uploadformData } from "@/libs/axios";
    export default {
        name: "show-detail-modal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                titleName:'',
                statusList:[{value:0,label:'未开始'},{value:1,label:'进行中'},{value:2,label:'已终止'},{value:3,label:'已结束'}],
                modal:{
                    name:'',
                    startTime:'',
                    endTime:'',
                    awardType:'1',
                    type:'1',
                    id:'',
                    static:'0',
                },
                JawardRuleDtos:[{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'1',couponType:'',awardName:''}],
                UawardRuleDtos:[{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'2',couponType:'',awardName:''}],
                selectActiveVolumeObj:{},
                couponObj:[],
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
                }
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
