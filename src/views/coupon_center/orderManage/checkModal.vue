<template>
    <div v-if="viewDialogVisible" class="modal" @click.stop>
        <Card>
            <p slot="title">审核</p>
            <a href="#" slot="extra">
                <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
            </a>
            <Form ref="addOrEditModal" :label-width="100" label-position="left">
                <h3>订单信息</h3>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        订单编号：{{dataInfo.orderNo}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        订单状态：{{dataInfo.status}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        数量：{{dataInfo.amount}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        单价：{{dataInfo.price}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        总价：{{dataInfo.totalPrice}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        实付款：{{dataInfo.realPay}}   U贝抵扣：{{dataInfo.ubayDiscount}}  红包抵扣：{{dataInfo.redEnvelopeDiscount}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        渠道：{{dataInfo.source}}
                    </div>
                    </Col>
                </Row>

                <h3>交易记录</h3>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        下单时间：{{dataInfo.gmtCreate}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        付款时间：{{dataInfo.payTime}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        付款方式：{{dataInfo.payType}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        交易流水号：{{dataInfo.transactionNo}}
                    </div>
                    </Col>
                </Row>

                <h3>买家信息</h3>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        买家昵称：{{dataInfo.nickName}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        买家账号：{{dataInfo.phoneNumber}}
                    </div>
                    </Col>
                </Row>

                <h3>优惠券信息</h3>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        卡券编码：{{dataInfo.couponId}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        优惠券所属商户：{{dataInfo.merchantName}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        有效时间：{{dataInfo.endUseTime}}
                    </div>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div>
                        售后信息：{{dataInfo.sale}}
                    </div>
                    </Col>
                </Row>

                <h3>券码信息</h3>
                <Row class="padding-left-12">
                    <Col span="18">
                    <div v-for="item in dataInfo.coupon">
                        <p>券码：{{item.barCode}}</p>
                        <p>状态：{{item.status}}</p>
                        <p v-if="item.endUseTime">过期时间：{{item.endUseTime}}</p>
                        <p v-if="item.useTime">核销时间：{{item.useTime}}</p>
                        <p v-if="item.pplyRefundTime">申请退款时间：{{item.pplyRefundTime}}</p>
                        <p v-if="item.refundSuccessTime">退款时间：{{item.refundSuccessTime}}</p>
                        <p v-if="item.refundFailTime">退款时间：{{item.refundFailTime}}</p>
                        <p v-if="item.refundReason">退款原因：{{item.refundReason}}</p>
                        <p v-if="item.transactionNo">交易流水号：{{item.transactionNo}}</p>
                        <p v-if="item.auditUser">操作人：{{item.auditUser}}</p>
                        <p v-if="item.nickName">核销人：{{item.nickName}}</p>
                        <p v-if="item.phoneNumber">手机号：{{item.phoneNumber}}</p>
                        <p v-if="item.merchantName">核销门店：{{item.merchantName}}</p>
                        <p v-if="item.auditTime">操作时间：{{item.auditTime}}</p>
                        <p v-if="item.remark">备注：{{item.remark}}</p>
                    </div>
                    </Col>
                </Row>


                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="审核：" span="24" :labelWidth="80">
                        <RadioGroup v-model="auditStatus" style="width: 100%;margin: 10px;">
                            <Radio label="2">
                                <span>通过</span>
                            </Radio>
                            <Radio label="3">
                                <span>不通过</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="备注：" span="24" :labelWidth="80">
                        <Input v-model="remark" type="textarea" :rows="4" placeholder="请输入备注" />
                    </FormItem>
                    </Col>
                </Row>



                <FormItem>
                    <Button type="primary" style="margin-left: 8px;float: right;" @click="check">确定</Button>
                    <Button style="margin-left: 8px;float: right;" @click="close">关闭</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
    <!--</Modal>-->
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
                auditStatus:'2',
                remark:'',
                statusList:[{value:1,label:'未开始'},{value:2,label:'进行中'},{value:3,label:'已结束'},{value:4,label:'已终止'}],
                dataInfo:{},
            }
        },
        methods:{
            resetRow(row){
                this.orderRefundId = row.id;
                if(row){
                    // /merchant/activity/award/activity/{id}
                    // /trade/fund/account/order/refundOrderDetails/{id}
                    getRequest(`/trade/fund/account/order/refundOrderDetails/${row.id}`).then(res => {
                        if (res.code === "200") {
                            this.dataInfo = res.data.retData;
                            this.dataInfo.merchantName = res.data.merchantName;
                            this.dataInfo.sale = res.sale;
                            this.dataInfo.coupon = res.coupon;
                        } else {
                            this.$Message.error('获取数据失败');
                        }
                    });
                }
            },
            close() {
                this.$emit('setViewDialogVisible', false)
            },
            check(){
                var params = {
                    auditStatus:this.auditStatus,
                    remark:this.remark,
                    orderRefundId:this.orderRefundId
                }
                postRequest(`/trade/fund/account/order/leafletRefundAudit`,params
                ).then(res => {
                    this.TableLoading = false;
                    if (res.code === "200") {
                        this.$emit('setViewDialogVisible', false)
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
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
    .radio-item {
        width: 100%;
        border: 1px solid #f4f4f4;
        padding: 10px;
        margin: 10px 0;
        position: relative;
    }
</style>
