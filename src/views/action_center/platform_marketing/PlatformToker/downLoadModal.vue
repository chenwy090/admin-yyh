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
                        <Select v-model="modal.merchantType" style="width:150px" placeholder="请选择商户类型">
                            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <div style="width: 2%;display: inline-block"></div>
                        <Button v-if="modal.merchantType==1" type="dashed" :disabled="!modal.merchantType"  style="min-width: 150px" @click="openBusiness">
                            <span v-if="!selectBusinessObj.realName">请选择商户名称</span>
                            <span v-if="selectBusinessObj.realName">{{selectBusinessObj.realName}}</span>
                        </Button>
                        <Button v-if="modal.merchantType==2" type="dashed" :disabled="!modal.merchantType"  style="min-width: 150px" @click="openBrand">
                            <span v-if="!selectBrandObj.realName">请选择品牌名称</span>
                            <span v-if="selectBrandObj.realName">{{selectBrandObj.realName}}</span>
                        </Button>
                    </FormItem>
                    </Col>
                </Row>
                <Row v-if="modal.merchantType==2&&brandList.length">
                    <Col span="24">
                    <FormItem label="">
                        <div v-for="item in brandList">{{item.name}}</div>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="套餐：" span="24">
                        <Select v-model="modal.expandType" style="width:150px">
                            <Option v-for="item in packageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="拓客时间：">
                        <DatePicker
                                :value="modal.expandTimeStart"
                                type="date"
                                style="width: 150px"
                                :options="options1"
                                @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                        ></DatePicker>
                        <div style="width: 2%;display: inline-block"></div>
                        <DatePicker
                                :value="modal.expandTimeEnd"
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
    import { postRequest,downloadSteam} from "@/libs/axios";
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
                statusList:[{value:'1',label:'未生效'},{value:2,label:'已生效'},{value:3,label:'已完成'}],
                packageList:[{value:'',label:'全部'},{value:1,label:'精准拓客'},{value:2,label:'平台拓客'}],
                modal:{
                    expandType:'',
                    merchantType:'1',
                    expandTimeStart:'',
                    expandTimeEnd:'',
                    static:'',
                },
                brandList:[],
                options1:{},
                options2:{},
                selectBusinessObj:{},
                selectBrandObj:{},
                ruleValidate:{
                    requiredType: [{ required: true, message: '', trigger: 'blur' }]
                }
            }
        },
        methods:{
            changeDateTime(datetime, index) {
                switch (index) {
                case 1:
                    this.modal.expandTimeStart = datetime;
                    this.options2 = {
                        disabledDate(date){
                            return date.valueOf() <  new Date(datetime)-1000*60*60*24;
                        }
                    }
                    break;
                case 2:
                    this.modal.expandTimeEnd = datetime;
                    this.options1 = {
                        disabledDate(date){
                            return date.valueOf() > new Date(datetime);
                        }
                    }
                    break;
                }
            },
            resetRow(){
                this.expandType='';
                this.expandTimeStart='';
                this.expandTimeEnd='';
                this.merchantType='1';
                this.static='';
                this.brandList=[];
                this.selectBusinessObj = {};
                this.selectBrandObj = {};
            },
            getPackageData(id,type){
                postRequest(`/merchant/merchantBrand/list/merchant`,{brandId:id,brandLevel: 1}).then(res => {
                    if (res.code === "200") {
                        this.brandList = res.data||[];
                    } else {
                        this.$Message.error(res.msg);
                        this.brandList = [];
                    }
                });
            },
            openBusiness(e){
                this.businessVolumeModal = true;
                this.$nextTick(() => {
                    this.$refs['businessModal'].resetRow(this.selectBusinessObj,true);
                })
            },
            selectBusiness(e){
                this.selectBusinessObj = e;
                this.businessVolumeModal = false;
                if(e&&e.merchantId){
                    // this
                    // this.getPackageData(e.merchantId,1);
                }
            },
            openBrand(e){
                this.brandVolumeModal = true;
                this.$nextTick(() => {
                    this.$refs['brandModal'].resetRow(this.selectBrandObj,true);
                })
            },
            selectBrand(e){
                this.selectBrandObj = e;
                this.brandVolumeModal = false;
                if(e&&e.id){
                    this.getPackageData(e.id,2);
                }
            },
            downLoad(){
                if(!this.modal.merchantType){
                    this.$Message.error("请选择商户类型");
                    return
                }
                if(this.modal.merchantType=='1'&&!this.selectBusinessObj.realName){
                    this.$Message.error("请选择商户名称");
                    return
                }
                if(this.modal.merchantType=='2'&&!this.selectBrandObj.realName){
                    this.$Message.error("请选择品牌名称");
                    return
                }
                let params = {
                    expandTimeEnd :this.modal.expandTimeEnd,
                    expandTimeStart :this.modal.expandTimeStart,
                    expandType :this.modal.expandType,
                    merchantName :this.modal.merchantName,
                    merchantType :this.modal.merchantType,
                    status :this.modal.status,
                }
                params.merchantIds = [];
                if(this.modal.merchantType =='1'){
                    params.merchantName = this.selectBusinessObj.realName
                    params.merchantIds.push(this.selectBusinessObj.merchantId);
                }else if(this.modal.merchantType =='2'){
                    params.merchantName = this.selectBrandObj.realName;
                    this.brandList.forEach(function(v,i){
                        params.merchantIds.push(v.merchantId);
                    })
                }
                downloadSteam(`/merchant/platform/expand/download`,params).then(res => {
                    const content = res.data;
                    let fileName = res.headers["filename"];
                    const blob = new Blob([content], { type: "application/vnd.ms-excel" });
                    if ("download" in document.createElement("a")) {
                        // 非IE下载
                        const elink = document.createElement("a");
                        elink.download = decodeURI(fileName);
                        elink.style.display = "none";
                        elink.href = URL.createObjectURL(blob);
                        document.body.appendChild(elink);
                        elink.click();
                        URL.revokeObjectURL(elink.href); // 释放URL 对象
                        document.body.removeChild(elink);
                    } else {
                        // IE10+下载
                        navigator.msSaveBlob(blob, fileName);
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
