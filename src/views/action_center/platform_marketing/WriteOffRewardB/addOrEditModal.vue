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
                    <FormItem label="活动名称">
                        <Input
                                type="text"
                                v-model="modal.name"
                                placeholder="请填写活动名称，20字以内"
                                style="width: 100%"
                        ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="活动时间">
                        <DatePicker
                                :value="modal.applyDateRangeOpen"
                                type="date"
                                placeholder
                                style="width: 160px"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                        ></DatePicker>--
                        <DatePicker
                                :value="modal.applyDateRangeClose"
                                type="date"
                                placeholder
                                style="width: 160px"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                        ></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <h3>请选择参与活动券</h3>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="参与活动券">
                        <Input v-model="modal.active" type="textarea" placeholder="请选择要参与活动优惠券" />
                    </FormItem>
                    </Col>
                </Row>
                <h3>赠送规则</h3>
                <Row class="padding-left-12">
                    <Col span="18">
                    <RadioGroup v-model="modal.type" vertical>
                        <Radio label="type1">
                            <span>核销赠券 <span class="colof-a2">(在核销主商户券码时，赠送合作方发放的优惠券)</span></span>
                            <div style="width: 100%">
                                <Input v-model="modal.mark" type="textarea" placeholder="请选择要参与活动优惠券" />
                            </div>
                        </Radio>
                        <Radio label="type2">
                            <span>核销赠U贝 <span class="colof-a2">(在核销主商户券码时，赠送平台费U贝)</span></span>
                            <div style="width: 100%">
                                <InputNumber
                                        :min="0"
                                        :step="1"
                                        type="text"
                                        :precision="0"
                                        v-model="modal.uNum"
                                        placeholder="请输入U贝数量"
                                ></InputNumber>
                                <span>(只能输入整数)</span>
                            </div>
                        </Radio>
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
    </div>
</template>

<script>
    export default {
        name: "add-or-edit-modal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                titleName:'',
                modal:{
                    name:'',
                    applyDateRangeOpen:'',
                    applyDateRangeClose:'',
                    active:'',
                    type:'核销赠U贝',
                    uNum:0,
                    mark:''
                },
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
                }else{
                    this.titleName = '新增';
                    this.modal = {};
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
</style>
