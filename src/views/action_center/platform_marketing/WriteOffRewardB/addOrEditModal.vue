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
                                :value="modal.applyDateRangeOpen"
                                type="date"
                                placeholder
                                style="width: 160px"
                                :options="options1"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                        ></DatePicker>
                        <div style="width: 2%;display: inline-block"></div>
                        <DatePicker
                                :value="modal.applyDateRangeClose"
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
                        <Button type="dashed" @click="openCoupon">{{couponObj[0]&&couponObj[0].name?couponObj[0].name:'参与活动券'}}</Button>
                    </FormItem>
                    </Col>
                </Row>
                <h3>赠送规则</h3>
                <Row class="padding-left-12">
                    <Col span="24">
                    <RadioGroup v-model="modal.type" vertical style="width: 100%">
                        <Radio label="type1" style="display: inline-block">
                            <span>核销赠券</span>
                        </Radio>
                            <div style="width: 2%;display: inline-block"></div>
                            <span class="colof-a2">(在核销商户券码时，赠送优惠券至店员卡包，前提店员是要优惠C端用户)</span>
                            <div style="width: 2%;display: inline-block"></div>
                            <Button style="float: right;" type="primary" icon="md-add" @click="addJList">新增</Button>
                                <div  v-for="(item,index) in JList" class="radio-item">
                                    <div>
                                        <span>每日核销范围在&nbsp;</span>
                                        <InputNumber
                                                :min="1"
                                                :step="1"
                                                type="text"
                                                :precision="0"
                                                v-model="item.min"
                                                placeholder="请输入数值"
                                        ></InputNumber>
                                        <div style="width: 2%;display: inline-block"></div>
                                        <InputNumber
                                                :min="1"
                                                :step="1"
                                                type="text"
                                                :precision="0"
                                                v-model="item.max"
                                                placeholder="请输入数值"
                                        ></InputNumber>
                                        <span>&nbsp;张时，赠送以下优惠券</span>
                                        <div style="width: 2%;display: inline-block"></div>
                                        <span class="colof-a2">(后面文本框的数值不填写，表示无限大)</span>
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <Button type="dashed" @click="openVolume(item)">{{item.JObj&&item.JObj.name?item.JObj.name:'请选择优惠券'}}</Button>
                                    </div>
                                    <div class="reduce-btn">
                                        <Button type="error" v-if="JList.length>1" shape="circle" icon="ios-trash" @click="reduce(JList,index)"></Button>
                                    </div>
                                </div>
                        <Radio label="type2" style="display: inline-block">
                            <span>核销赠U贝</span>
                        </Radio>
                            <div style="width: 2%;display: inline-block"></div>
                            <span class="colof-a2">(在核销主商户券码时，赠送平台U贝，前提店员是要优惠C端用户)</span>
                            <div style="width: 2%;display: inline-block"></div>
                            <Button  style="float: right;" type="primary" icon="md-add" @click="addUList">新增</Button>
                                <div  v-for="(item,index) in UList" class="radio-item">
                                    <span>每日核销范围在&nbsp;</span>
                                    <InputNumber
                                            :min="0"
                                            :step="1"
                                            type="text"
                                            :precision="0"
                                            v-model="item.min"
                                            placeholder="请输入数值"
                                    ></InputNumber>
                                    <div style="width: 2%;display: inline-block"></div>
                                    <InputNumber
                                            :min="1"
                                            :step="1"
                                            type="text"
                                            :precision="0"
                                            v-model="item.max"
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
                                                v-model="item.Unum"
                                                placeholder="请输入U贝数量"
                                                style="width: 150px"
                                        ></InputNumber>
                                    </div>
                                    <div class="reduce-btn">
                                        <Button type="error" v-if="UList.length>1" shape="circle" icon="ios-trash" @click="reduce(UList,index)"></Button>
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
                    applyDateRangeOpen:'',
                    applyDateRangeClose:'',
                    active:'',
                    type:'type1',
                    uNum:0,
                    mark:''
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
                JList:[{min:null,max:null,JObj:{}}],
                UList:[{min:null,max:null,Unum:null}],
                ruleValidate: {}
            }
        },
        methods:{
            numArrayValidator(list){
                var arr = list.sort(function(a,b){
                    return a.min - b.min
                })
                for(let i=0;i<arr.length-1;i++){
                    if(arr[i].max<=arr[i].min){
                        this.$Message.error({
                            content: "最小值不能大于等于最大值",
                            duration: 3
                        });
                        this.falg = false;
                        break;
                    }else if(arr[i].max>=arr[i+1].min){
                        this.$Message.error({
                            content: "请输入正确区间数值",
                            duration: 3
                        });
                        this.falg = false;
                        break;
                    }
                }
                return falg;
            },
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
                            return date.valueOf() < Date.now()-1000*60*60*24||date.valueOf() > new Date(datetime);
                        }
                    }
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
                }
            },
            openCoupon(){
                this.couponViewDialogModal = true;
            },
            selectCoupon(e){
                this.couponViewDialogModal = false;
                this.couponObj = e;

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
                this.JList.push({min:null,max:null,JObj:{}});
            },
            addUList(){
                this.UList.push({min:null,max:null,Unum:0});
            },
            reduce(list,index){
                list.splice(index,1);
            },
            ok(){
                this.numArrayValidator(this.UList);
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
</style>
