<template>
    <div>
        <div>
            <Card :bordered="false" style="margin-bottom:2px">
                <Form inline>
                    <FormItem label="优惠券名称：" :label-width="120">
                        <Input style="width:100%" v-model="searchData.couponName" placeholder="请输入" clearable/>
                    </FormItem>
                    <Form-item label="投放渠道：" :label-width="85">
                        <Select
                                v-model="searchData.distributeChannel"
                                placeholder="请选择渠道"
                                clearable
                                style="width: 200px"
                        >
                            <Option value="1">要优惠详情</Option>
                            <Option value="2">要优惠领劵成功页</Option>
                            <Option value="3">团员拼团成功页</Option>
                            <Option value="4">团员拼团失败页</Option>
                            <Option value="5">团长拼团成功页</Option>
                            <Option value="6">团长拼团失败页</Option>
                            <Option value="7">领优惠领券成功页</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="投放位置：" :label-width="85">
                        <Select
                                v-model="searchData.distributeLocation"
                                placeholder="请选择位置"
                                clearable
                                style="width: 200px"
                        >
                            <Option value="0">0号位</Option>
                            <Option value="1">1号位</Option>
                            <Option value="2">2号位</Option>
                            <Option value="3">3号位</Option>
                        </Select>
                    </Form-item>
                    <FormItem style="margin-left:35px;" class="br">
                        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
                        <Button icon="md-refresh" @click="reset">重置</Button>
                    </FormItem>
                </Form>
            </Card>
            <Card :bordered="false">
                <Row class="operation">
                    <Button type="primary" icon="md-add" @click="addStaff">添加优惠券</Button>
                    <!--<Button  @click="searchConflict">检查冲突券</Button>-->
                    <Button  @click="downLoad">冲突券下载</Button>
                </Row>
                <div>
                    <!-- 冠名活动列表 -->
                    <Table
                            border
                            width="100%"
                            :columns="columns8"
                            :data="personGiftList"
                            :loading="TableLoading"
                    >
                        <template slot-scope="{ row }" slot="imgUrl">
                            <img
                                    :src="row.imgUrl"
                                    v-if="row.imgUrl != ''"
                                    style="width:40px"
                                    @click="lookImg(row.imgUrl)"
                            />
                        </template>
                        <template slot-scope="{ row }" slot="status">
                            <span v-if="row.recommendStatus == 0">创建</span>
                            <span v-else-if="row.recommendStatus == 1">上架</span>
                            <span v-else-if="row.recommendStatus == -1">下架</span>
                        </template>

                        <template slot-scope="{ row }" slot="location">
                            <span v-if="row.distributeLocation == 0">0号位</span>
                            <span v-else-if="row.distributeLocation == 1">1号位</span>
                            <span v-else-if="row.distributeLocation == 2">2号位</span>
                            <span v-else-if="row.distributeLocation == 3">3号位</span>
                        </template>

                        <template slot-scope="{ row }" slot="channel">
                            <span v-if="row.distributeChannel == 1">要优惠详情页</span>
                            <span v-else-if="row.distributeChannel == 2">要优惠领券成功页</span>
                            <span v-else-if="row.distributeChannel == 3">团员拼团成功页</span>
                            <span v-else-if="row.distributeChannel == 4">团员拼团失败页</span>
                            <span v-else-if="row.distributeChannel == 5">团长拼团成功页</span>
                            <span v-else-if="row.distributeChannel == 6">团长拼团失败页</span>
                            <span v-else-if="row.distributeChannel == 7">领优惠领券成功页</span>
                        </template>

                        <template slot-scope="{ row }" slot="action">
                                 <Button
                                        type="primary"
                                        size="small"
                                        style="margin-right: 5px"
                                        @click="editStaff(row)"

                                >编辑
                                </Button>
                            <Button
                                    type="success"
                                    size="small"
                                    style="margin-left: 5px"
                                    v-if="row.recommendStatus == 0 || row.recommendStatus == -1"
                                    @click="updateStatus(row,1)"
                            >上架
                            </Button>
                            <Button
                                    type="success"
                                    size="small"
                                    style="margin-left: 5px"
                                    v-if="row.recommendStatus == 1"
                                    @click="down(row)"
                            >下架
                            </Button>


                        </template>
                        <template slot-scope="{ row }" slot="download">
                            <Button
                                    type="success"
                                    size="small"
                                    style="margin-left: 5px"
                                    @click="bcDownload(row)"
                            >下载
                            </Button>
                        </template>
                        <template slot-scope="{ row }" slot="query">
                            <Button
                                    type="success"
                                    size="small"
                                    style="margin-left: 5px"
                                    @click="query(row)"
                            >查看
                            </Button>
                        </template>

                    </Table>
                    <!-- 冠名活动列表 -->
                </div>
                <!-- 分页器 -->
                <Row type="flex" justify="end" class="page">
                    <Page
                            :total="totalSize"
                            show-total
                            show-elevator
                            :current="current"
                            @on-change="changeCurrent"
                    ></Page>
                </Row>
                <!-- 分页器 -->
            </Card>

        </div>
        <Modal
                v-model="materialDisplay"
                title="下架优惠券"
                width="885"
                footer-hide
                :closable="false"
                :mask-closable="false"
        >
            <!--   <Form ref="materialData" :model="materialData" :label-width="120">

              </Form> -->
            <Row>
                <Input
                        type="textarea"
                        style="width:100%"
                        v-model="downBindData.remark"
                        placeholder="200个字符以内原因"
                        clearable
                        :rows="2"
                />
            </Row>

            <Row style="margin:10px 0 0 795px">
                <Button @click="downStatus">确认</Button>
                <Button @click="closeMaterial">取消</Button>
            </Row>
        </Modal>

        <Modal
                v-model="queryShopDisplay"
                title="查看"
                width="885"
                footer-hide
                :closable="false"
                :mask-closable="false"
        >
            <!--   <Form ref="materialData" :model="materialData" :label-width="120">

              </Form> -->
            <div>
                <Table
                        border
                        width="100%"
                        :columns="columns4"
                        :data="queryList"
                        :loading="TableLoading"
                >

                </Table>
            </div>

            <Row style="margin:10px 0 0 795px">
                <Button @click="closeQuery">关闭</Button>
            </Row>
        </Modal>

        <Modal
                v-model="bcDownloadDisplay"
                title="查看"
                width="885"
                footer-hide
                :closable="false"
                :mask-closable="false"
        >
            <!--   <Form ref="materialData" :model="materialData" :label-width="120">

              </Form> -->
            <div>
                <Table
                        border
                        width="100%"
                        :columns="columns1"
                        :data="bcDownloadList"
                        :loading="TableLoading"
                >

                </Table>
            </div>

            <Row style="margin:10px 0 0 795px">
                <Button @click="closeBCDownload">关闭</Button>
            </Row>
        </Modal>

         <Modal
                v-model="formShow"
                :title="formTitle"
                width="1000"
                footer-hide
                :closable="true"
                :mask-closable="false"
                @on-visible-change="formModalChange"
        >
        <formView ref="form" @closeFormModal-event="closeFormModal" ></formView>
        </Modal>




        <div v-if="searchConflictDisplay">

            <Modal
                v-model="searchConflictDisplay"
                title="检查冲突券"
                width="70%"
                footer-hide
                :closable="true"
               >
               <conflictView ref="table"></conflictView>
          </Modal>

        </div>

    </div>
</template>

<script>
    import { postRequest,downloadSteam} from "@/libs/axios";
    import {
        getRecomondList,
        eidtStatus,
        queryShopInfo,
        backCodeDownload
    } from "@/api/sys";
    import {uploadOperationImage2AliOssURl} from "@/api/index";
    import conflictView from "./conflict";
    import formView from "./form";
    export default  {
        name: "recommend",
        components: {formView,conflictView},
        data() {
            return {
                id:null,
                formShow: false,
                formTitle: "添加优惠券",
                curItem: '',
                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                // 活动列表
                columns8: [
                    {
                        title: "操作",
                        align: "center",
                        width: 150,
                        fixed: "left",
                        slot: "action"
                    },
                    {
                        title: "推荐ID",
                        align: "center",
                        minWidth: 100,
                        key: "id"
                    },
                    {
                        title: "优惠券名称",
                        align: "center",
                        minWidth: 100,
                        key: "couponName"
                    },
                    {
                        title: "推荐状态",
                        align: "center",
                        minWidth: 160,
                        key: "recommendStatus",
                        slot:"status"
                    },
                    {
                        title: "BackCode集",
                        align: "center",
                        minWidth: 120,
                        slot: "download"
                    },
                    {
                        title: "投放渠道",
                        align: "center",
                        minWidth: 160,
                        key: "distributeChannel",
                        slot:"channel"
                    },
                    {
                        title: "已曝光量",
                        align: "center",
                        minWidth: 100,
                        key: "actualExposureCount",
                    },

                    {
                        title: "投放位置",
                        align: "center",
                        minWidth: 160,
                        key: "distributeLocation",
                        slot:"location"
                    },
                    {
                        title: "投放时间",
                        align: "center",
                        minWidth: 360,
                        key:"distributeStartDate",
                        render: (h, params) => {
                            let row = params.row;
                            return h('span',row.distributeStartDate+' -- '+row.distributeEndDate);
                        }
                    },
                    {
                        title: "投放门店",
                        align: "center",
                        minWidth: 120,
                        slot:"query"
                    },
                    {
                        title: "投放量",
                        align: "center",
                        minWidth: 120,
                        key: "distributeCount"
                    },
                    {
                        title: "优惠力度",
                        align: "center",
                        minWidth: 160,
                        key: "promotion"
                    },
                    {
                        title: "曝光量",
                        align: "center",
                        minWidth: 160,
                        key: "exposureCount"
                    },
                    {
                        title: "已领取量",
                        align: "center",
                        minWidth: 160,
                        key: "receivableCount"
                    }
                ],
                columns4: [
                    {
                        title: "省",
                        align: "center",
                        width: 150,
                        fixed: "left",
                        key:"province"
                    },
                    {
                        title: "市",
                        align: "center",
                        minWidth: 100,
                        key: "city"
                    },
                    {
                        title: "区",
                        align: "center",
                        minWidth: 160,
                        key: "district"
                    },
                    {
                        title: "门店",
                        align: "center",
                        minWidth: 120,
                        key:"shopName"
                    }
                ],
                columns1: [
                    {
                        title: "backcode",
                        align: "center",
                        width: 150,
                        fixed: "left",
                        key:"barcode"
                    }
                ],
                materiaValidate: [],

                personGiftList: [], //红包冠名活动列表数据
                queryList: [], //查看数据
                bcDownloadList:[],//backcode 下载数据
                campaginName: "", // 优惠活动名称
                campaginId: "", // 优惠活动id
                //campaginCampId:'', // 选中的优惠活动Id
                searchData: {
                    // 查询参数
                    // campId: null,
                    couponName: "",
                    distributeChannel: "",
                    distributeLocation: ""
                },

                queryData:{
                    id:""
                },

                // pagingType:'1', // 分页类型 1：初始化，2为搜索
                current: 1,
                totalSize: 0, //总条数
                // 优惠券列表
                current1: 1,
                totalSize1: 0, //总条数
                TableLoading: false, //列表加载动画
                merchantList: [], // 商户列表
                add_edit: null, // 1为新增，2为编辑
                modalTitle: "", // 对话框标题文字
                addStaffDisplay: false, // 新增对话框显示
                searchConflictDisplay: false, // 新增对话框显示
                bcDownloadDisplay: false,
                addmateriaStaffDisplay: false,//新增链路素材显示
                // 新增表单
                formValidate: {
                    name: "",
                    saleName: "",
                    chargeType: "1",
                    exposureAmount: "",
                    startDate: "",
                    endDate: "",
                    remark: "" // 备注
                },
                // 新增链路素材表单
                materiaformValidate: {
                    chainName: "",
                    chainCode: "",
                    pageName: "",
                    pageCode: "",
                    textInfo: "",
                    imgUrl: "",
                    activityId: ""
                },
                file: null, // 上传门店列表
                // 上传内容图
                uploadList1: [],
                url: uploadOperationImage2AliOssURl,
                userToken: {}, //用户token
                editEmployeeId: "", // 编辑员工编号
                //下架绑定数据
                downBindData: {
                    id: "",
                    status: null,
                    remark: ""
                },
                campaginDisplay: false, // 解绑对话框显示
                wxQrcodeDisplay: false, // 查看二维码对话框显示
                wxQrcode_url: "", // 查看二维码路径
                isCheckDisabled: true, // 启用按钮
                checkDetailsDisplay: false, // 查看详情对话框显示
                materialDisplay: false,
                queryShopDisplay:false,
                materialData: [],//链路素材数据
                checkDetailsData: {} // 查看详情数据
            };
        },

        created: function () {
            this.getStaffListFn({});
            this.pagingType = "1";
            this.userToken = {
                jwttoken: localStorage.getItem("jwttoken")
            };
        },
        watch: {
            // 'formValidate.cashCouponDrawSetList.limitCnt': function(newVal){
            //   console.log(123);
            //     if(formValidate.cashCouponDrawSetList.length > 1) {
            //       console.log(456);
            //     }
            // },
        },

        methods: {
            init() {
            },

            // 搜索
            search() {
                this.current = 1;
                this.getStaffListFn(this.searchData);
                this.pagingType = "2";
            },

            // 重置
            reset() {
                this.searchData.couponName = null;
                this.searchData.distributeLocation = null;
                this.searchData.distributeChannel = null;
                this.pagingType = "1";
                this.search();
            },

            // 查询列表
            getStaffListFn(obj) {
                this.TableLoading = true;
                getRecomondList(obj, this.current).then(res => {
                    if (res.code == 200) {
                        this.personGiftList = res.data.records;
                        this.current = res.data.current;
                        this.totalSize = res.data.total;
                        this.TableLoading = false;
                    } else {
                        this.msgErr(res.msg);
                    }
                });
            },

            //下架
            down(row){
                this.downBindData.id = row.id;
                this.downBindData.remark ="";
                //this.add_edit = 1;
                this.modalTitle = "下架优惠券";
                this.materialDisplay = true;
            },

            // 新增按钮
            addStaff() {
                  this.formShow = true;
                   this.$refs.form.loadForm(null);
            },
            // 冲突检查
            searchConflict(){
              this.searchConflictDisplay = true;
            },

            // 编辑按钮
            editStaff(row) {
                this.formShow = true;
                this.formTitle="编辑优惠券";
                this.id = row.id;
                this.$refs.form.loadForm(this.id);
            },

            // 保存
            addLuckyDrawFn() {
                // 验证
                if (!this.ruleValidate()) {
                    return;
                }
                if (this.add_edit == 1) {
                    addRedEnvelopment(this.formValidate).then(res => {
                        if (res.code == 200) {
                            this.msgOk("新增成功");
                            this.getStaffListFn({});
                            this.cancel();
                        } else {
                            this.msgErr(res.msg);
                        }
                    });
                } else if (this.add_edit == 2) {
                    editRedEnvelopmentData(this.formValidate).then(res => {
                        // console.log(res);
                        if (res.code == 200) {
                            this.msgOk("编辑成功");
                            this.getStaffListFn({});
                            this.cancel();
                        } else {
                            this.msgErr(res.msg);
                        }
                    });
                }
            },

            downStatus(){
                if(this.downBindData.remark == null){
                    this.msgErr("请填写下架原因")
                }
                this.downBindData.status = -1;
                eidtStatus(this.downBindData).then(res => {
                    if (res.code == 200) {
                        this.msgOk('下架成功')
                        this.materialDisplay = false;
                        this.getStaffListFn({});
                    } else {
                        this.msgErr(res.msg)
                    }
                });
            },

            //上下架
            updateStatus(row, num) {
                this.downBindData.id = row.id;
                this.downBindData.status = num;
                eidtStatus(this.downBindData).then(res => {
                    if (res.code == 200) {
                        if (num == 1) {
                            this.msgOk('上架成功')
                        } else {
                            this.msgOk('下架成功')
                        }
                        this.getStaffListFn({});
                    } else {
                        this.msgErr(res.msg)
                    }
                });
            },

            bcDownload(row) {
                console.log(row.id);
                backCodeDownload(row.id).then(res => {
                    if (res.code == 200) {
                        this.bcDownloadList = res.data;
                        this.TableLoading = false;
                    } else {
                        this.msgErr(res.msg);
                    }
                });
                this.bcDownloadDisplay = true;
             },

            query(row) {
                this.queryData.id = row.id;
                queryShopInfo(this.queryData).then(res => {
                    if (res.code == 200) {
                        this.queryList = res.data;
                        this.TableLoading = false;
                    } else {
                        this.msgErr(res.msg);
                    }
                });
                this.queryShopDisplay = true;
            },

            closeQuery(){
                this.queryShopDisplay = false;
            },

            closeBCDownload(){
                this.bcDownloadDisplay = false;
            },

            // 删除活动列表
            delCouponList(index, row) {
                if (row.id) {
                    this.formValidate.delIds.push(row.id)
                    // console.log(this.formValidate.delIds);
                }
                this.formValidate.specialTopicCouponList.splice(index, 1)
            },

            // 关闭对话框
            cancel() {
                this.addStaffDisplay = false;
                if (this.formValidate.delIds) {
                    this.formValidate.delIds = [];
                }
                this.formValidate.activityAmount = "";
                this.formValidate.activityId = "";
                this.formValidate.amount = "";
                this.formValidate.chargeType = "";
                this.formValidate.endDate = "";
                this.formValidate.startDate = "";
                this.formValidate.imgUrl = "";
                this.formValidate.topicDesc = "";
                this.formValidate.name = "";
                this.formValidate.status = "";
                this.formValidate.saleName = "";
                this.formValidate.remark = "";
            },

            // 关闭链路对话框
            canceladdMeateria() {
                this.addmateriaStaffDisplay = false;
                this.materiaformValidate.chainName = "";
                this.materiaformValidate.chainCode = "";
                this.materiaformValidate.imgUrl = "";
                this.materiaformValidate.pageCode = "";
                this.materiaformValidate.pageName = "";
                this.materiaformValidate.textinfo = "";
            },
            // 关闭查看
            close() {
                this.checkDetailsDisplay = false;
                if (this.formValidate.delIds) {
                    this.formValidate.delIds = [];
                }
                this.formValidate.specialTopicCouponList = [],
                    this.formValidate.endDate = "";
                this.formValidate.startDate = "";
                this.formValidate.imgUrl = "";
                this.formValidate.topicDesc = "";
                this.formValidate.name = "";
                this.cancel();
            },

            // 关闭链路查看
            closeMaterial() {
                this.materialDisplay = false;
            },

            // 关闭优惠券选择对话框
            campaginDisplayFn() {
                this.campaginDisplay = false;
                this.CampaginList = [];
                this.couponSearchData.couponType = "";
                this.couponSearchData.name = "";
                this.totalSize1 = 0;
                this.current1 = 1;
            },

            // 分页（点击第几页）
            changeCurrent: function (current) {
                // var self = this;
                // self.banner_page_req.start = current * self.banner_page_req.limit - self.banner_page_req.limit;
                this.current = current;
                if (this.pagingType == 1) {
                    this.getStaffListFn({});
                } else if (this.pagingType == 2) {
                    this.getStaffListFn(this.searchData);
                }
            },

            // 优惠券活动分页
            changeCurrent1: function (current) {
                this.current1 = current;
                this.search1();
            },

            //过滤小数点
            // changeNumber() {
            //   let str = "" + this.searchData.campId;
            //   if (str.indexOf(".") != -1) {
            //     let arr = str.split("");
            //     arr.splice(arr.length - 1);
            //     let str2 = arr.join("");
            //     this.searchData.campId = +str2;
            //     this.msgErr("不能输入小数点");
            //   }
            // },

            // 验证
            ruleValidate() {
                if (this.formValidate.name == "") {
                    this.msgErr("没有输入冠名名称");
                    return;
                }
                if (this.formValidate.saleName == "") {
                    this.msgErr("没有输入跟单销售");
                    return;
                }
                if (this.formValidate.radio == "") {
                    this.msgErr("没有选择计费方式");
                    return;
                }
                if (this.formValidate.startDate == "") {
                    this.msgErr("请选择开始时间");
                    return;
                }
                if (this.formValidate.endDate == "") {
                    this.msgErr("请选择开始时间");
                    return;
                }
                return true;
            },


            addMateriaruleValidate() {
                if (this.materiaformValidate.chainName == "") {
                    this.msgErr("没有输入链路名称");
                    return;
                }
                if (this.materiaformValidate.chainCode == "") {
                    this.msgErr("没有输入链路code");
                    return;
                }
                if (this.materiaformValidate.pageName == "") {
                    this.msgErr("没有输入页面名称");
                    return;
                }
                if (this.materiaformValidate.pageCode == "") {
                    this.msgErr("没有输入页面code");
                    return;
                }
                if (this.materiaformValidate.textInfo == "") {
                    this.msgErr("没有输入文案");
                    return;
                }
                return true;
            },
            // 时间过滤
            time1(e) {
                // console.log(e);
                if (e) {
                    let time = e.slice(0, 10) + " " + "00:00:00";
                    this.formValidate.startDate = time;
                }
            },
            clearTime1() {
                this.formValidate.startDate = "";
            },
            time2(e) {
                // console.log(e);
                if (this.formValidate.startDate == "") {
                    this.msgErr("开始时间未选择");
                    return;
                }
                if (e) {
                    let time = e.slice(0, 10) + " " + "23:59:59";
                    this.formValidate.endDate = time;
                }
            },
            clearTime2() {
                this.formValidate.endDate = "";
            },

            // 查看二位码
            lookImg(url) {
                this.wxQrcode_url = url;
                this.wxQrcodeDisplay = true;
            },

            // 全局提示
            msgOk(txt) {
                this.$Message.info({
                    content: txt,
                    duration: 3
                });
            },

            msgErr(txt) {
                this.$Message.error({
                    content: txt,
                    duration: 3
                });
            },

            dropDown() {
                if (this.drop) {
                    this.dropDownContent = "展开";
                    this.dropDownIcon = "ios-arrow-down";
                } else {
                    this.dropDownContent = "收起";
                    this.dropDownIcon = "ios-arrow-up";
                }
                this.drop = !this.drop;
            },
            formModalChange : function(sta){
                if(!sta){
                    this.$refs.form.modalClose();
                    this.search() ;
                }
            },
            closeFormModal:function(){
                this.formShow = false;
            },
             closeConflictModal:function(){
                this.searchConflictDisplay = false;
            },
            downLoad(){
                var url = '/couponrecommend/conflict/excel/download';
                downloadSteam(url,null).then(res => {
                    const content = res.data;
                    const { filename } = res.headers;

                    const blob = new Blob([content], { type: "application/vnd.ms-excel" });
                    const oA = document.createElement("a");
                    if ("download" in oA) {
                        // 非IE下载
                        oA.download = decodeURI(filename);
                        oA.style.display = "none";
                        oA.href = URL.createObjectURL(blob);
                        document.body.appendChild(oA);
                        oA.click();
                        URL.revokeObjectURL(oA.href); // 释放URL 对象
                        document.body.removeChild(oA);
                    } else {
                        // IE10+下载
                        navigator.msSaveBlob(blob, filename);
                    }
                });
            }
        },
        mounted() {
            this.init();
        }
    };
</script>
<style lang="less" scoped>
    .operation {
        margin-bottom: 2vh;
    }

    .select-count {
        font-size: 13px;
        font-weight: 600;
        color: #40a9ff;
    }

    .select-clear {
        margin-left: 10px;
    }

    .page {
        margin-top: 2vh;
    }

    .drop-down {
        font-size: 13px;
        margin-left: 5px;
    }
</style>
