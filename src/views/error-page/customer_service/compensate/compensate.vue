<template>
  <div>
    <div>
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="用户id" :label-width="120">
            <Input style="width:100%" v-model="searchData.memberId" placeholder="请输入" clearable />
          </FormItem>
           <FormItem label="状态" :label-width="120">
            <Input style="width:100%" v-model="searchData.status" placeholder="请输入" clearable />
          </FormItem>
           <FormItem label="发放的类型" :label-width="120">
            <Input style="width:100%" v-model="searchData.pushType" placeholder="请输入" clearable />
          </FormItem>
          <FormItem style="margin-left:35px;" class="br">
            <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            <Button icon="md-refresh" @click="reset">重置</Button>
          </FormItem>
        </Form>
      </Card>
      <Card :bordered="false">
        <Row class="operation">
          <Button type="primary" icon="md-add" @click="addStaff">发券</Button>
          <Button icon="md-refresh" @click="search">刷新</Button>
        </Row>
        <div>
          <!-- 推送列表 -->
          <Table
            border
            width="100%"
            :columns="columns8"
            :data="personGiftList"
            :loading="TableLoading"
          >
           <!--  <template slot-scope="{ row }" slot="action">
              <Button
                type="success"
                style="margin-right: 5px"
                size="small"
                @click="checkDetails(row)"
              >查看</Button>
            </template> -->
          </Table>
          <!-- 推送列表 -->
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
    <!-- 新增维权补偿-->
    <Modal
      v-model="addStaffDisplay"
      :title="modalTitle"
      width="885"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Form ref="formValidate" :model="formValidate" :label-width="120">
        <FormItem label="发放类型:" required>
          <Input style="width:250px" v-model="formValidate.pushType" placeholder="请输入" clearable />
        </FormItem>
         <FormItem label="发放的福利:" required>
           <RadioGroup v-model="formValidate.welfareType" >
              <Radio label="1" value="1" checked >
                  <span>优惠券</span>
              </Radio>
              <Radio label="2" value="2">
                  <span>U贝</span>
              </Radio>
          </RadioGroup>
        </FormItem> 
        <!-- <Row>
        <Col span="8" v-if="formValidate.welfareType == 1">
          <FormItem   label="选择优惠券" prop="templateId" :rules="{ required: true, message: '请选择优惠券' }">
            <Input v-model="formValidate.templateId" placeholder="点击按钮选择优惠券" disabled>
              <Button @click="handleChoose()" slot="append">选择</Button>
            </Input>
          </FormItem>
        </Col>
      </Row> -->
      <FormItem label="优惠券活动:" v-if="formValidate.welfareType == 1" required>
          <Row class="box" v-if="formValidate.welfareType == 1">
              <!-- <Col span="3" class="left-text"> <span style="color:red">*</span> 优惠券活动：</Col> -->
              <Col span="8"  >
                  <Button @click="getCampaginListFn">请选择优惠券</Button>
              </Col>
          </Row>
        </FormItem>
        <!--   <Row class="box" v-if="formValidate.welfareType == 1">
              <Col span="3" class="left-text"> <span style="color:red">*</span> 优惠券活动：</Col>
              <Col span="8"  >
                  <Button @click="getCampaginListFn">请选择优惠券</Button>
              </Col>
          </Row> -->
        <!-- 优惠券列表 -->
        <Table  v-if="formValidate.welfareType == 1" border width="100%" :columns="columns4" :data="formValidate.specialTopicCouponList">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="error" size="small" @click="delCouponList(index,row)">删除</Button>
          </template>
          <template slot-scope="{ row}" slot="couponKind">
            <span v-if="row.couponKind == 1">超市券</span>
            <span v-else>周边券</span>
          </template>
        </Table>
        <!-- 优惠券列表 -->
         <FormItem label="发放U贝标题:" v-if="formValidate.welfareType != 1" required>
          <Input style="width:250px" v-model="formValidate.uTitle" placeholder="请输入" v-if="formValidate.welfareType != 1"  clearable />
        </FormItem>
         <FormItem label="单人发放数量:" v-if="formValidate.welfareType != 1"  required>
          <Input style="width:250px" v-model="formValidate.uAmount" placeholder="请输入" clearable  v-if="formValidate.welfareType != 1" type="number"/>
        </FormItem>
        <FormItem
        label="用户id"
        prop="memberId"
        :rules="{ required: true, message: '必须按行输入memberId集' }"
      >
        <Row>
          <Col span="8">
            <Input v-model="formValidate.memberId" type="textarea" :rows="10" placeholder="memberId集" />
          </Col>
        </Row>
      </FormItem>
        <FormItem label="发放原因:" required>
          <RadioGroup v-model="formValidate.reason" vertical>
              <Radio label="客诉补偿" value="1">
                  <span>客诉补偿</span>
              </Radio>
              <Radio label="活动奖励"  value="2">
                  <span>活动奖励</span>
              </Radio>
              <Radio label="BD合作"  value="3">
                  <span>BD合作</span>
              </Radio>
               <Radio label="其他" value="4">
                  <span>其他</span>
              </Radio>
              <FormItem >
                <Input v-model="formValidate.reason" type="textarea"  placeholder="请输入其他原因"  clearable></Input>
              </FormItem>
          </RadioGroup>
      </FormItem>
        <FormItem label="备注:" >
          <Input style="width:250px" v-model="formValidate.remark" placeholder="请输入" clearable />
        </FormItem>
      <Row style="margin:10px 0 0 739px">
          <Button type="text" @click="cancel">取消</Button>
          <Button type="primary" @click="addLuckyDrawFn()">保存</Button>
        </Row>
      </Form>
    </Modal>
    <!-- 优惠活动对话框 -->
    <Modal
      v-model="campaginDisplay"
      title="请选择优惠活动"
      width="650"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Alert type="warning">请点击选择优惠券类型，按搜索，选择需要的优惠券</Alert>
      <Form ref="checkDetailsData" :model="checkDetailsData" :label-width="100">
        <FormItem label="优惠券类型：" style="display:inline-block">
          <!-- <Input style="width:200px" v-model="couponSearchData.couponType" placeholder="请输入" clearable /> -->
          <Select
            v-model="couponSearchData.couponType"
            style="width:200px"
            @on-change="optionChange"
          >
            <Option value="1">超市券</Option>
            <Option value="2">周边券</Option>
          </Select>
        </FormItem>
        <FormItem label="优惠券名称：" style="display:inline-block">
          <Input style="width:200px" v-model="couponSearchData.name" placeholder="请输入" clearable />
        </FormItem>
        <FormItem class="br" :label-width="10">
          <Button type="primary" icon="ios-search" @click="search1">搜索</Button>
          <!-- <Button icon="md-refresh" @click="reset1">重置</Button> -->
        </FormItem>
      </Form>
      <Table
        border
        ref="selection"
        :columns="couponSearchData.couponType == '1'?columns10:columns9"
        :data="CampaginList"
         @on-select="selectionCampagin"
        @on-select-cancel="cancelCampagin"
        @on-select-all="allCampagin"
        @on-select-all-cancel="cancelAllCampagin"
      ></Table>
      <!-- 分页器 -->
      <Row type="flex" justify="end" class="page">
        <Page
          :total="totalSize1"
          show-total
          show-elevator
          :current="current1"
           @on-change="changeCurrent1"
        ></Page>
      </Row>
      <!-- 分页器 -->
      <Row style="margin:10px 0 0 562px">
        <Button @click="campaginDisplayFn">保存</Button>
        <!-- <Button type="primary" @click="closeCampaginDisplay">确认</Button> -->
      </Row>
    </Modal>
    <!-- 优惠活动对话框 -->
    <!-- 新增维权补偿 -->
   <!--  <Modal v-model="couponModalShow" title="选择优惠券" width="800px" @footer-hide="false">
      <chooseCouponListView @seclectedTr-event="selectedTrCallBack"></chooseCouponListView>
    </Modal> -->

      <!-- 优惠活动对话框 -->
    <Modal
      v-model="failDisplay"
      title="失败数据"
      width="650"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
     <Table
            border
            width="100%"
            :columns="columns11"
            :data="failList"
            
          >
          </Table>
            <Row style="margin:10px 0 0 562px">
          <Button type="primary" @click="close">关闭</Button>
        </Row>
    </Modal>
    <!-- 优惠活动对话框 -->
  </div>
</template>

<script>
  import {
    getCompensateList,
    getCampaginListData,
    selectByActivityId,
    addCompensate,
    editRedEnvelopmentData,
    selectByid,
    upStatus,
    selectmaterialByActivityId,
     addMateria,
     editMateria,
     selectmateriaById
  } from "@/api/sys";
  import { uploadOperationImage2AliOssURl } from "@/api/index";
  //import chooseCouponListView from "./chooseCouponList";
  export default {
    /*components: {
    chooseCouponListView
  },*/
    name: "compensate",
    data() {
      return {
        curItem:'',
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",
        // 活动列表
        columns8: [
          {
            title: "昵称",
            align: "center",
            minWidth: 100,
            key: "userName"
          },
          {
            title: "用户id",
            align: "center",
            minWidth: 160,
            key: "memberId"
          },
          {
            title: "券id",
            align: "center",
            minWidth: 160,
            key: "templateId"
          },
            {
            title: "发放福利",
            align: "center",
            minWidth: 100,
            key: "welfareInfo",
          },
            {
            title: "发放时间",
            align: "center",
            minWidth: 160,
            key: "createTime"
          },
          {
            title: "发放原因",
            align: "center",
            minWidth: 160,
            key: "reason",
          },
           {
            title: "发放的类型",
            align: "center",
            minWidth: 160,
            key: "pushType",
          },
         {
            title: "状态",
            align: "center",
            minWidth: 160,
            key: "status",
          },
          {
            title: "操作人员",
            align: "center",
            minWidth: 120,
            key: "createBy"
          },
           {
            title: "备注",
            align: "center",
            minWidth: 120,
            key: "remark"
          }
        ],
         // 优惠活动列表
      columns4: [
        {
          title: "操作",
          align: "center",
          width: 100,
          fixed: "left",
          slot: "action"
        },
        {
          title: "类型",
          align: "center",
          minWidth: 140,
          key: "couponKind",
          slot: "couponKind"
        },
        {
          title: "优惠券ID",
          align: "center",
          minWidth: 140,
          key: "templateId"
        }
      ],
         // 新增/编辑 周边券列表
      columns9: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "优惠券ID",
          align: "center",
          minWidth: 140,
          key: "templateId"
        },
        {
          title: "优惠券名称",
          align: "center",
          minWidth: 140,
          key: "title"
        },
        {
          title: "所属商户",
          align: "center",
          minWidth: 140,
          key: "merchantNames"
        }
      ],
      // 超市券
      columns10: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "优惠券ID",
          align: "center",
          minWidth: 140,
          key: "campId"
        },
        {
          title: "优惠券名称",
          align: "center",
          minWidth: 140,
          key: "name"
        }
      ],
       // 错误数据
      columns11: [
        {
          title: "用户id",
          align: "center",
          minWidth: 140,
          key: "memberId"
        },
        {
          title: "券id",
          align: "center",
          minWidth: 140,
          key: "templateId"
        }
      ],
        materiaValidate:[],
        failList: [],
        personGiftList: [], //红包冠名活动列表数据
        CampaginList: [], //优惠活动列表数据
        campaginName: "", // 优惠活动名称
        campaginId: "", // 优惠活动id
        //campaginCampId:'', // 选中的优惠活动Id
        searchData: {
          // 查询参数
          // campId: null,
          memberId: "",
          status: "",
          pushType: ""

        },
        couponModalShow: false,
        // 优惠券搜索
        couponSearchData: {
          couponType: "", //优惠券类型 1：超市券 2：周边券
          name: ""
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
        addmateriaStaffDisplay:false,//新增链路素材显示
        failDisplay:false,
        // 新增表单 
        formValidate: {
          pushType: "",
          welfareType: "",
          templateIdList: [],
          uAmount:"",
          uTitle: "",
          reason:"",
          specialTopicCouponList: [],
          remark: "" // 备注
        },
         // 新增链路素材表单 
        materiaformValidate: {
          chainName: "",
          chainCode: "",
          pageName: "",
          pageCode:"",
          textInfo: "",
          imgUrl:"",
          activityId:"",
          startDate: "",
          endDate:""
        },
        file: null, // 上传门店列表
        // 上传内容图
        uploadList1: [],
        url: uploadOperationImage2AliOssURl,
        userToken: {}, //用户token
        editEmployeeId: "", // 编辑员工编号
        //绑定/解绑
        bindData: {
          employeeId: "",
          mobile: null,
          type: ""
        },
        campaginDisplay: false, // 解绑对话框显示
        wxQrcodeDisplay: false, // 查看二维码对话框显示
        wxQrcode_url: "", // 查看二维码路径
        isCheckDisabled: true, // 启用按钮
        checkDetailsDisplay: false, // 查看详情对话框显示
        materialDisplay: false,
        materialData: [],//链路素材数据
        checkDetailsData: {} // 查看详情数据
      };
    },

    created: function() {
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
      init() {},

      // 搜索
      search() {
        this.current=1;
        this.getStaffListFn(this.searchData);
        this.pagingType = "2";
      },

      // 重置
      reset() {
        this.searchData.memberId = "";
        this.searchData.status = "";
        this.searchData.pushType = "";
        this.pagingType = "1";
        this.search();
      },

      // 查询列表
      getStaffListFn(obj) {
        this.TableLoading = true;
        getCompensateList(obj, this.current).then(res => {
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

      // 新增按钮
      addStaff() {
        this.add_edit = 1;
        this.modalTitle = "新增维权补偿";
        this.addStaffDisplay = true;
        //this.formValidate=null;
      },
    //选择优惠券
   /*  handleChoose: function() {
        this.couponModalShow = true;
      },
      selectedTrCallBack: function(ticketTemplateId) {
      this.formValidate.templateId = ticketTemplateId;
      this.couponModalShow = false;
    },*/
 // 选择优惠活动对话框
    getCampaginListFn() {
      this.campaginDisplay = true;
    },
 //下拉选择器
    optionChange() {
      this.CampaginList = [];
      this.couponSearchData.name = "";
      this.current1 = 1;
    },

   // 优惠券搜索
    search1() {
      if (this.couponSearchData.couponType == "") {
        this.msgErr("请选择优惠券类型");
        return;
      }
      let data = {};
      let url = "";
      if (this.couponSearchData.couponType == "1") {
        data = {
          isEffective: 1,
          campType: 57,
          status: 1,
          sendChannel: null,
          name: this.couponSearchData.name
        };
        url = "/campagin/list";
      } else {
        data = {
          templateStatus: "进行中",
          title: this.couponSearchData.name
        };
        url = "/merchantCouponTemplate/backList";
      }
      getCampaginListData(url, data, this.current1).then(res => {
        if (res.code == 200) {
          this.CampaginList = res.data.records;
           //console.log(this.formValidate.specialTopicCouponList.length);
           //console.log(this.formValidate.specialTopicCouponList[0].templateId);
          if (this.formValidate.specialTopicCouponList.length != 0) {
            if (this.couponSearchData.couponType == "1") {
              for (let i = 0; i < this.CampaginList.length; i++) {
                for (
                  let j = 0;
                  j < this.formValidate.specialTopicCouponList.length;
                  j++
                ) {
                  if (
                    this.formValidate.specialTopicCouponList[j].templateId ==
                    this.CampaginList[i].campId
                  ) {
                    this.CampaginList[i]._checked = true;
                  }
                }
              }
            } else {
              for (let i = 0; i < this.CampaginList.length; i++) {
                for (
                  let j = 0;
                  j < this.formValidate.specialTopicCouponList.length;
                  j++
                ) {
                  if (
                    this.formValidate.specialTopicCouponList[j].templateId ==
                    this.CampaginList[i].templateId
                  ) {
                    this.CampaginList[i]._checked = true;
                  }
                }
              }
            }
          }
          // 分页
          this.current1 = res.data.current;
          this.totalSize1 = res.data.total;
        } else {
          this.msgErr(res.msg);
        }
      });
    },

 // 选中优惠活动
    selectionCampagin(selection, row) {
      let obj = {};
      if (this.couponSearchData.couponType == 1) {
        obj = {
          templateId: row.campId,
          couponKind: this.couponSearchData.couponType,
          merchantName: "",
          name: row.name
        };
      } else {
        obj = {
          templateId: row.templateId,
          couponKind: this.couponSearchData.couponType,
          merchantName: row.merchantName,
          name: row.title
        };
      }
      this.formValidate.specialTopicCouponList.push(obj);
      this.msgOk("选择成功，点击保存即刻关闭");
       console.log(this.formValidate.specialTopicCouponList);
    },

    //全选优惠券
    allCampagin(selection) {
      let arr = [];
      if (this.couponSearchData.couponType == 1) {
        for (let i = 0; i < selection.length; i++) {
          let obj = {
            templateId: selection[i].campId,
            couponKind: this.couponSearchData.couponType,
            // merchantName: selection[i].merchantName || "",
            name: selection[i].name
          };
          this.formValidate.specialTopicCouponList.push(obj);
        }
      } else {
        for (let i = 0; i < selection.length; i++) {
          let obj = {
            templateId: selection[i].templateId,
            couponKind: this.couponSearchData.couponType,
            merchantName: selection[i].merchantName,
            name: selection[i].title
          };
          this.formValidate.specialTopicCouponList.push(obj);
        }
      }
      this.msgOk("选择成功，点击保存即刻关闭");
    },

    // 取消全选
    cancelAllCampagin(selection) {
      //去重
      var afterArr = uniqueArray(
        this.formValidate.specialTopicCouponList,
        "templateId"
      );
      this.formValidate.specialTopicCouponList = afterArr;

      if (this.couponSearchData.couponType == 1) {
        for (let i = 0; i < this.CampaginList.length; i++) {
          for (
            let j = 0;
            j < this.formValidate.specialTopicCouponList.length;
            j++
          ) {
            if (
              this.CampaginList[i].campId ==
              this.formValidate.specialTopicCouponList[j].templateId
            ) {
              if (this.formValidate.specialTopicCouponList[j].id) {
                this.formValidate.delIds.push(
                  this.formValidate.specialTopicCouponList[j].id
                );
              }
              this.formValidate.specialTopicCouponList.splice(j, 1);
            }
          }
        }
      } else {
        for (let i = 0; i < this.CampaginList.length; i++) {
          for (
            let j = 0;
            j < this.formValidate.specialTopicCouponList.length;
            j++
          ) {
            if (
              this.CampaginList[i].templateId ==
              this.formValidate.specialTopicCouponList[j].templateId
            ) {
              if (this.formValidate.specialTopicCouponList[j].id) {
                this.formValidate.delIds.push(
                  this.formValidate.specialTopicCouponList[j].id
                );
              }
              this.formValidate.specialTopicCouponList.splice(j, 1);
            }
          }
        }
      }
    },

    // 取消选中
    cancelCampagin(selection, row) {
      // console.log(123);
      // console.log(selection);
      // console.log(row);
      if (this.couponSearchData.couponType == 1) {
        for (
          let i = 0;
          i < this.formValidate.specialTopicCouponList.length;
          i++
        ) {
          if (
            row.campId == this.formValidate.specialTopicCouponList[i].templateId
          ) {
            if (this.formValidate.specialTopicCouponList[i].id) {
              this.formValidate.delIds.push(
                this.formValidate.specialTopicCouponList[i].id
              );
            }
            this.formValidate.specialTopicCouponList.splice(i, 1);
          }
        }
      } else {
        for (
          let i = 0;
          i < this.formValidate.specialTopicCouponList.length;
          i++
        ) {
          if (
            row.templateId ==
            this.formValidate.specialTopicCouponList[i].templateId
          ) {
            if (this.formValidate.specialTopicCouponList[i].id) {
              this.formValidate.delIds.push(
                this.formValidate.specialTopicCouponList[i].id
              );
            }
            this.formValidate.specialTopicCouponList.splice(i, 1);
          }
        }
      }
      // console.log(this.formValidate.specialTopicCouponList);
    },
 
     // 删除活动列表
    delCouponList(index, row) {
      if (row.id) {
        this.formValidate.delIds.push(row.id);
        // console.log(this.formValidate.delIds);
      }
      this.formValidate.specialTopicCouponList.splice(index, 1);
    },
      // 查看详情
     /* checkDetails(row) {
        selectByid(row.id).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.formValidate = res.data;
            this.checkDetailsDisplay = true;
          } else {
            this.msgErr(res.msg);
          }
        });
      },*/

      // 保存
      addLuckyDrawFn() {
        // 验证
        if (!this.ruleValidate()) {
          return;
        }
        if (this.add_edit == 1) {
          console.log( this.formValidate.specialTopicCouponList);
          this.formValidate.memberId=this.getSplitString(this.formValidate.memberId);
         /* for (
                  let j = 0;
                  j < this.formValidate.specialTopicCouponList.length;
                  j++
                ){
                   this.formValidate.templateIdList.push(this.formValidate.specialTopicCouponList[j].templateId)
                }*/
          //this.formValidate.templateIdList=this.formValidate.specialTopicCouponList
          addCompensate(this.formValidate).then(res => {
            if (res.code == 200) {
              this.msgOk("操作成功");
              this.getStaffListFn({});
              this.cancel();
              this.failList=res.data;
              if(this.failList!=null){
                this.failDisplay = true;
              }
            } else {
              this.msgErr(res.msg);
            }
          });
        } 
      },
      // 关闭对话框
      cancel() {
        this.addStaffDisplay = false;
        if (this.formValidate.delIds) {
          this.formValidate.delIds = [];
        }
        this.formValidate.pushType= "";
        this.formValidate.templateId = "";
        this.formValidate.welfareType = "";
        this.formValidate.uAmount = "";
        this.formValidate.memberId= "";
        this.formValidate.uTitle = "";
        this.formValidate.reason = "";
        this.formValidate.remark = "";
        this.formValidate.specialTopicCouponList = [];
      },

 


      // 关闭查看
      close() {
        this.failDisplay = false;
      },

      // 关闭链路查看
      closeMaterial() {
        this.materialDisplay = false;
        this.materiaValidate.activityId = "";
        this.materiaValidate.chainName = "";
        this.materiaValidate.chainCode = "";
        this.materiaValidate.pageName = "";
        this.materiaValidate.pageCode = "";
          this.materiaValidate.imgUrl = "";
        this.materiaValidate.textInfo = "";
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
      changeCurrent: function(current) {
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
      changeCurrent1: function(current) {
        this.current1 = current;
        this.search1();
      },

      // 验证
      ruleValidate() {
        if (this.formValidate.pushType == "") {
          this.msgErr("没有输入发放类型");
          return;
        }
        if (this.formValidate.welfareType == "") {
          this.msgErr("没有选择发放的福利");
          return;
        }
         if (this.formValidate.specialTopicCouponList.length == 0) {
        this.msgErr("请选择优惠活动");
        return;
      }
        if (this.formValidate.welfareType == 2) {
          if (this.formValidate.uTitle == "") {
            this.msgErr("没有输入发放U贝标题");
            return;
           }
            if (this.formValidate.uAmount == "") {
            this.msgErr("没有输入发放u币数量");
            return;
           }
        }
        if (this.formValidate.reason == "") {
          this.msgErr("请选择发放原因");
          return;
        }
        return true;
      },
      getSplitString: function(str) {
          if (!str || str.length == 0) {
            return "";
          }
          var arr = str.split(",");
          var resources = "";
          for (var i = 0; i < arr.length; i++) {
            var arr1 = arr[i].split(/\s+/);

            for (var j = 0; j < arr1.length; j++) {
              var temp = arr1[j].replace(/^\s+|\s+$/g, "");
              if (temp != "") {
                resources += temp + ",";
              }
            }
          }
          return resources;
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
