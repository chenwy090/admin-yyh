<template>
    <div v-if="viewDialogVisible" class="modal" @click.stop>
        <Card>
            <p slot="title">查看详情</p>
            <a href="#" slot="extra">
                <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
            </a>
            <Form :model="modal" ref="addOrEditModal" :rules="ruleValidate" :label-width="100" label-position="left">
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
                        {{modal.status?statusList[modal.status-1].label:''}}
                    </FormItem>
                    </Col>
                </Row>
                <h3>请选择参与活动券</h3>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="参与活动券">
                        <Button type="dashed" v-if="couponObj.length">
                            <span v-for="item in couponObj">{{item.title +'&nbsp&nbsp'}}</span>
                        </Button>
                    </FormItem>
                    </Col>
                </Row>
                <h3>赠送规则</h3>
                <Row class="padding-left-12">
                    <Col span="24">
                    <div v-if="modal.wardType==1">
                        <FormItem label="赠送规则">
                            <!--<Input v-model="modal.active" type="textarea" placeholder="请选择要参与活动优惠券" />-->
                            <span>核销赠券</span>
                            <div style="width: 2%;display: inline-block"></div>
                            <span class="colof-a2">(在核销商户券码时，赠送优惠券至店员卡包，前提店员是要优惠C端用户)</span>
                            <div style="width: 2%;display: inline-block"></div>
                            <div  v-for="(item,index) in JawardRuleDtos" class="radio-item">
                                <div style="margin: 10px 0;">
                                    <Button type="dashed">{{item.title}}</Button>
                                </div>
                            </div>
                        </FormItem>
                    </div>
                    <div v-if="modal.wardType==2">
                        <FormItem label="核销赠U贝">
                            <!--<Input v-model="modal.active" type="textarea" placeholder="请选择要参与活动优惠券" />-->
                            <span>核销赠券</span>
                            <div style="width: 2%;display: inline-block"></div>
                            <span class="colof-a2">(在核销主商户券码时，赠送平台U贝，前提店员是要优惠C端用户)</span>
                            <div style="width: 2%;display: inline-block"></div>
                            <div  v-for="(item,index) in UawardRuleDtos" class="radio-item">
                                <div style="margin: 10px 0;">
                                    <InputNumber
                                            :min="0"
                                            :step="1"
                                            type="text"
                                            :precision="0"
                                            v-model="item.award"
                                            disabled
                                            placeholder="请输入U贝数量"
                                            style="width: 150px"
                                    ></InputNumber>
                                </div>
                            </div>
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="创建时间" >
                        <span>{{modal.createTime}}</span>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="最后修改时间">
                        <span>{{modal.updateTime}}</span>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="最后修改人">
                        <span>{{modal.updateBy}}</span>
                    </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button style="margin-left: 8px;float: right;" @click="close">关闭</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
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
                data:{},
                titleName:'',
                statusList:[{value:1,label:'未开始'},{value:2,label:'进行中'},{value:3,label:'已结束'},{value:4,label:'已终止'}],
                modal:{
                    name:'',
                    startTime:'',
                    endTime:'',
                    wardType:'1',
                    type:'1',
                    id:'',
                    static:'0',
                    createTime:'',
                    updateBy:'',
                    updateTime:'',
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
                this.modal = {};
                this.couponObj = [];
                if(row){
                    this.data = row;
                    this.modal.id= row.id;
                    // /merchant/activity/award/activity/{id}
                    getRequest(`/customer/activity/award/activity/${row.id}`).then(res => {
                        if (res.code === "200") {
                            var data = res.data;
                            this.modal.name = data.name;
                            this.modal.startTime = data.startTime;
                            this.modal.wardType = data.awardType.toString();
                            this.modal.endTime = data.endTime;
                            this.modal.type = '2';
                            this.couponObj = data.coupons;
                            this.modal.status = data.status;
                            this.modal.createTime=data.createTime;
                            this.modal.updateBy=data.updateBy;
                            this.modal.updateTime=data.updateTime;
                            if(data.awardType=='1'){
                                this.JawardRuleDtos = data.awardRuleVos;
                                this.UawardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'1',couponType:'',awardName:''}];
                            }else if(data.awardType=='2'){
                                this.UawardRuleDtos = data.awardRuleVos;
                                this.JawardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'2',couponType:'',awardName:''}];
                            }
                        } else {
                            this.$Message.error('获取数据失败')
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
