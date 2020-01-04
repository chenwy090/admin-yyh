<template>
  <div>
    <div>
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
       
          <FormItem label="专题内容名称：" :label-width="120">
            <Input style="width:200px" v-model="searchData.name" placeholder="请输入专题内容名称" clearable  />
          </FormItem>
          <FormItem style="margin-left:35px;" class="br">
            <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            <Button icon="md-refresh" @click="reset">重置</Button>
          </FormItem>
        </Form>
      </Card>
      <Card :bordered="false">
        <Row class="operation">
          <Button type="primary" icon="md-add" @click="addStaff">新增</Button>
          <Button icon="md-refresh" @click="search">刷新</Button>
        </Row>
        <div>
          <!-- 用户列表 -->
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
              <span v-if="row.status == 0">创建</span>
              <span v-else-if="row.status == 1">上架</span>
              <span v-else-if="row.status == -1">下架</span>
            </template>

            <template slot-scope="{ row }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="editStaff(row)"
                v-if="row.status != 1"
              >编辑</Button>
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                disabled
                v-else
              >编辑</Button>
              <Button
                type="success"
                style="margin-right: 5px"
                size="small"
                @click="checkDetails(row)"
              >查看详情</Button>
              <Button type="error" size="small" v-if="row.status != 1" @click="delLuckyDrawFn(row)">删除</Button>
              <Button type="error" size="small" v-else disabled>删除</Button>
              <Button
                type="success"
                size="small"
                style="margin-left: 5px"
                v-if="row.status == 0 || row.status == -1"
                @click="updateStatus(row,1)"
              >上架</Button>
              <Button
                type="warning"
                size="small"
                style="margin-left: 5px"
                v-if="row.status == 1"
                @click="updateStatus(row,-1)"
              >下架</Button>
            </template>
          </Table>
          <!-- 用户列表 -->
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
    <!-- 新增抽奖活动 -->
    <Modal
      v-model="addStaffDisplay"
      :title="modalTitle"
      width="885"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >



      <Row class="box">
                      <Col span="3" class="left-text"> <span style="color:red">*</span> 专题内容名称</Col>
                          <Col span="8"  >
                              <Input style="width:250px" v-model="formValidate.name" placeholder="请输入" clearable :maxlength="15" />
                       </Col>

            </Row>

      <Row class="box">
                      <Col span="3" class="left-text"> <span style="color:red">*</span> 专题内容描述</Col>
                          <Col span="8"  >
                            <Input style="width:250px" v-model="formValidate.topicDesc" placeholder="请输入" clearable />
                       </Col>

            </Row>

 
 
        <!-- 上传图片 -->
  
         
             <Row class="box">
                      <Col span="3" class="left-text"> <span style="color:red">*</span> 专题内容图</Col>
                      <Col span="3"  >
                          <div class="imgSrc_box"   v-if="formValidate.imgUrl" >
                              <img  :src="formValidate.imgUrl" style="width:100%">
                          </div>
                       </Col>
                          <Col span="8"  >
                          <div style="width:100px; float:left">
                            <ImgCutter :label="'选择图片'"  :boxWidth="600"  :boxHeight="500" v-on:cutDown="cutDown" >
                                <button slot="openImgCutter"
                                        style="width:100px; background: border-box"
                                >上传图片</button>
                            </ImgCutter>
                          </div>
                          <br>
                          <div  class="left-text">专题内容图 (不大于1M, JPG/PNG/JPEG/BMP</div>
                       </Col>

                  </Row>

        <!-- 上传图片 -->

    <Row class="box">
                      <Col span="3" class="left-text"> <span style="color:red">*</span> 开始时间</Col>
                          <Col span="8"  >
                           <DatePicker
            type="date"
            placeholder="请选择"
            style="width: 250px"
            format="yyyy-MM-dd"
            @on-change="time1"
            :value="formValidate.startDate"
            @on-clear="clearTime1"
            :editable="false"
          ></DatePicker>
                 </Col>

            </Row>

   <Row class="box">
                      <Col span="3" class="left-text"> <span style="color:red">*</span> 结束时间</Col>
                          <Col span="8"  >
          <DatePicker
            type="date"
            placeholder="请选择"
            style="width: 250px"
            format="yyyy-MM-dd"
            @on-change="time2"
            :value="formValidate.endDate"
            @on-clear="clearTime2"
            :editable="false"
          ></DatePicker>
                 </Col>

            </Row>



 <Row class="box">
                      <Col span="3" class="left-text"> <span style="color:red">*</span> 优惠券活动：</Col>
                          <Col span="8"  >
         <Button @click="getCampaginListFn">点击选择优惠券</Button>
                 </Col>

            </Row>




      

        <!-- 活动列表 -->
        <Table border width="100%" :columns="columns4" :data="formValidate.specialTopicCouponList">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="error" size="small" @click="delCouponList(index,row)">删除</Button>
          </template>
          <template slot-scope="{ row}" slot="couponKind">
            <span v-if="row.couponKind == 1">超市券</span>
            <span v-else>周边券</span>
          </template>
        </Table>
        <!-- 活动列表 -->

        <Row style="margin:10px 0 0 739px">
          <Button type="text" @click="cancel">取消</Button>
        
          <Button type="primary" @click="addLuckyDrawFn()">保存</Button>
        </Row>
     
  </Modal>
    <!-- 新增抽奖活动 -->
    <!-- 查看详情 -->
    <Modal
      v-model="checkDetailsDisplay"
      title="查看详情"
      width="885"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Form ref="checkDetailsData" :model="checkDetailsData" :label-width="120">
        <FormItem label="专题内容名称:" required>
          <Input style="width:250px" v-model="formValidate.name" placeholder="请输入" disabled />
        </FormItem>
        <FormItem label="专题内容描述:" required>
          <Input style="width:250px" v-model="formValidate.topicDesc" placeholder="请输入" disabled/>
        </FormItem>
        <!-- 上传图片 -->
        <Form-item label="专题内容图:" required>
          <div
            style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
          >
            <img :src="formValidate.imgUrl" style="width:100%" />
          </div>
        </Form-item>
        <!-- 上传图片 -->
        <Form-item label="开始时间" required>
          <DatePicker
            type="date"
            placeholder="选择开始日期"
            style="width: 250px"
            format="yyyy-MM-dd"
            @on-change="time1"
            :value="formValidate.startDate"
            @on-clear="clearTime1"
            disabled
          ></DatePicker>
        </Form-item>
        <Form-item label="结束时间" required>
          <DatePicker
            type="date"
            placeholder="选择开始日期"
            style="width: 250px"
            format="yyyy-MM-dd"
            @on-change="time2"
            :value="formValidate.endDate"
            @on-clear="clearTime2"
            disabled
          ></DatePicker>
        </Form-item>
        <!-- 活动列表 -->
        <Table border width="100%" :columns="columns4" :data="formValidate.specialTopicCouponList">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="error" size="small" disabled>删除</Button>
          </template>
          <template slot-scope="{ row}" slot="couponKind">
            <span v-if="row.couponKind == 1">超市券</span>
            <span v-else>周边券</span>
          </template>
        </Table>
        <!-- 活动列表 -->
        <Row style="margin:10px 0 0 795px">
          <Button @click="close">关闭</Button>
        </Row>
      </Form>
    </Modal>
    <!-- 查看详情 -->
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
    <!-- 看二维码 -->
    <Modal v-model="wxQrcodeDisplay" title="查看二维码" width="700" footer-hide>
      <img style="width: 100%" :src="wxQrcode_url" />
    </Modal>
    <!-- 看二维码 -->
  </div>
</template>

<script>
import {
  getSpecialTopicList,
  getCampaginListData,
  addSpecialTopic,
  editSpecialTopic,
  delSpecialTopic,
  upSpecialTopic,
  editSpecialTopicData
} from "@/api/sys";
import { uploadOperationImage2AliOssURl } from "@/api/index";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from "@/libs/axios";
import ImgCutter from "@/components/ImgCutter.vue";
import { uniqueArray } from "@/libs/date";
export default {
  components: {
    ImgCutter
  },
  name: "person_gift",
  data() {
    return {
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      // 抽奖活动列表
      columns8: [
        {
          title: "操作",
          align: "center",
          width: 250,
          fixed: "left",
          slot: "action"
        },
        {
          title: "内容ID",
          align: "center",
          minWidth: 100,
          key: "id"
        },
        {
          title: "专题内容名称",
          align: "center",
          minWidth: 160,
          key: "name"
        },
        {
          title: "专题描述",
          align: "center",
          minWidth: 160,
          key: "topicDesc"
        },
        {
          title: "运营状态",
          align: "center",
          minWidth: 100,
          key: "status",
          slot: "status"
        },
        {
          title: "内容图",
          align: "center",
          minWidth: 160,
          key: "imgUrl",
          slot: "imgUrl"
        },
        {
          title: "开始时间",
          align: "center",
          minWidth: 160,
          key: "startDate"
        },
        {
          title: "结束时间",
          align: "center",
          minWidth: 160,
          key: "endDate"
        },
        {
          title: "创建人",
          align: "center",
          minWidth: 120,
          key: "createBy"
        },
        {
          title: "创建时间",
          align: "center",
          minWidth: 160,
          key: "createTime"
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
        },
        {
          title: "优惠券名称",
          align: "center",
          minWidth: 140,
          key: "name"
        },
        {
          title: "所属商户",
          align: "center",
          minWidth: 140,
          key: "merchantName"
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
          key: "merchantName"
        },
        {
          title: "投放渠道",
          align: "center",
          minWidth: 140,
          key: "sendChannelStr",
        },
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
        },
        {
          title: "投放渠道",
          align: "center",
          minWidth: 140,
          key: "sendChannelStr",
        },
      ],
      personGiftList: [], //抽奖活动列表数据
      CampaginList: [], //优惠活动列表数据
      campaginName: "", // 优惠活动名称
      campaginId: "", // 优惠活动id
      //campaginCampId:'', // 选中的优惠活动Id
      searchData: {
        // 查询参数
        // campId: null,
        name: ""
      },
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
      // 新增表单
      formValidate: {
        endDate: "",
        imgUrl: "",
        name: "",
        specialTopicCouponList: [],
        startDate: "",
        topicDesc: "" // 专题描述
      },
      file: null, // 上传门店列表
      // 上传专题内容图
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

  methods: {
    init() {},

    // 搜索
    search() {
      this.getStaffListFn(this.searchData);
      this.pagingType = "2";
    },

    // 重置
    reset() {
      this.searchData.name = "";
      this.pagingType = "1";
      this.search();
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
          sendChannel: 1,
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
          // console.log(this.formValidate.specialTopicCouponList.length);
          // console.log(this.formValidate.specialTopicCouponList[0].templateId);
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

    // // 优惠券重置
    // reset1() {
    //   this.searchData.campId = null;
    //   this.searchData.name = "";
    //   this.pagingType = "1";
    //   this.search1();
    // },

    // 查询列表
    getStaffListFn(obj) {
      this.TableLoading = true;
      getSpecialTopicList(obj, this.current).then(res => {
        if (res.code == 200) {
          this.TableLoading = false;
          if (res.data.records.length > 0) {
            this.personGiftList = res.data.records;
            this.current = res.data.current;
            this.totalSize = res.data.total;
          } else {
            this.personGiftList = res.data.records;
            this.msgErr("查询结果为0,请尝试更换您的筛选条件重新查询");
          }
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 新增按钮
    addStaff() {
      this.add_edit = 1;
      this.modalTitle = "新增专题活动";
      this.addStaffDisplay = true;
    },

    // 编辑按钮
    editStaff(row) {
      editSpecialTopic(row.id).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.formValidate = res.data;
          this.formValidate.delIds = [];
          // this.formValidate.cashCouponDrawSetList = res.data;
          // this.formValidate.ids = [];
          // this.campaginName = row.name;
          // this.campaginId = row.campId;
          // // this.editActId = res.data.actId
          this.add_edit = 2;
          this.modalTitle = "编辑专题活动";
          this.addStaffDisplay = true;
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 查看详情
    checkDetails(row) {
      editSpecialTopic(row.id).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.formValidate = res.data;
          this.checkDetailsDisplay = true;
        } else {
          this.msgErr(res.msg);
        }
      });
    },

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
      // console.log(this.formValidate.specialTopicCouponList);
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

    // 优惠活动点击保存
    // closeCampaginDisplay() {
    //   // console.log(123);
    //   // console.log(this.formValidate.campId);
    //   if (this.formValidate.campId == "") {
    //     this.msgErr("还未选择优惠活动,请点击列表选择");
    //     return;
    //   }
    //   this.CampaginList = [];
    //   this.campaginDisplay = false;
    // },

    // 添加时间时间段
    handleAdd() {
      // if (this.campaginGrabInfoList.length >= 15) {
      //   this.$Message.error("不能超过15个整点抢时间段");
      //   return;
      // } else {
      if (this.campaginId == "") {
        this.msgErr("请选择奖品优惠券活动后，才能新增");
        return;
      }
      this.formValidate.cashCouponDrawSetList.push({
        campId: this.campaginId, // 奖品优惠券活动ID
        limitCnt: null, // 限制数量
        percent: null, // 中奖概率，最多保留4位小数
        ticketMoney: null // 新人奖励现金券面额
      });
      // }
      // this.statusCheckChange();
    },

    // 删除时间时间段
    handleRemove(index, item) {
      this.formValidate.cashCouponDrawSetList.splice(index, 1);
      this.count();
      if (item.id) {
        this.formValidate.ids.push(item.id);
        // console.log(this.formValidate.delIds);
      }
      // this.statusCheckChange();
    },

    // 上传宣传图片(新增)
    handleSuccess1(res, file) {
      if (res.code == 200) {
        this.formValidate.imgUrl = res.image_url;
        let obj = [
          {
            url: res.image_url
          }
        ];
        this.uploadList1 = obj;

        this.msgOk("上传图片成功");
      } else {
        this.msgErr("上传图片失败，请重新上传");
      }
    },

    // 上传二维码超过1M提示
    handleMaxSize() {
      this.msgErr("上传图片不能超过1MB,请重新上传");
    },

    // 上传二维码格式不对
    formatError() {
      this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传");
    },
    cutDown: function(res) {
      this.formValidate.imgUrl = res.dataURL;
      // this.showSize();
      if (this.logImgSize > 1024) {
        this.$Message.error("图片不能大于1M");
        return;
      }
      var reqParams = {
        imgStr: res.dataURL.substr(22)
      };
      postRequest(
        "/operation/operation-info/uploadBase64Image2AliOss",
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.formValidate.imgUrl = res.image_url;
        } else {
          this.$Message.error(res.msg);
        }
      });
      this.isCheckDisabled = false;
    },

    // 保存
    addLuckyDrawFn() {
      // 验证
      if (!this.ruleValidate()) {
        return;
      }

      // console.log(this.formValidate);
      // return

      if (this.formValidate.delIds) {
        this.formValidate.delIds = this.formValidate.delIds.join();
      }

      if (this.add_edit == 1) {
        addSpecialTopic(this.formValidate).then(res => {
          if (res.code == 200) {
            this.msgOk("新增成功");
            this.getStaffListFn({});
            this.cancel();
          } else {
            this.msgErr(res.msg);
          }
        });
      } else if (this.add_edit == 2) {
        editSpecialTopicData(this.formValidate).then(res => {
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

    // 删除
    delLuckyDrawFn(row) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "<p>确认删除吗？</p>",
        onOk: () => {
          delSpecialTopic(row.id).then(res => {
            if (res.code == 200) {
              this.msgOk("删除成功");
              this.getStaffListFn({});
            } else {
              this.msgErr(res.msg);
            }
          });
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel');
        }
      });
    },

    //上下架
    updateStatus(row, num) {
      upSpecialTopic(row.id, num).then(res => {
        if (res.code == 200) {
          if (num == 1) {
            this.msgOk("上架成功");
          } else {
            this.msgOk("下架成功");
          }
          this.getStaffListFn({});
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 删除活动列表
    delCouponList(index, row) {
      if (row.id) {
        this.formValidate.delIds.push(row.id);
        // console.log(this.formValidate.delIds);
      }
      this.formValidate.specialTopicCouponList.splice(index, 1);
    },

    // 关闭对话框
    cancel() {
      this.addStaffDisplay = false;
      if (this.formValidate.delIds) {
        this.formValidate.delIds = [];
      }
      (this.formValidate.specialTopicCouponList = []),
        (this.formValidate.endDate = "");
      this.formValidate.startDate = "";
      this.formValidate.imgUrl = "";
      this.formValidate.topicDesc = "";
      this.formValidate.name = "";
    },

    // 关闭查看
    close() {
      this.checkDetailsDisplay = false;
      if (this.formValidate.delIds) {
        this.formValidate.delIds = [];
      }
      (this.formValidate.specialTopicCouponList = []),
        (this.formValidate.endDate = "");
      this.formValidate.startDate = "";
      this.formValidate.imgUrl = "";
      this.formValidate.topicDesc = "";
      this.formValidate.name = "";
    },

    // 关闭优惠券选择对话框
    campaginDisplayFn() {
      // 去重
      // console.log(this.formValidate.specialTopicCouponList);
      if (this.formValidate.specialTopicCouponList.length != 0) {
        var afterArr = uniqueArray(
          this.formValidate.specialTopicCouponList,
          "templateId"
        );
        this.formValidate.specialTopicCouponList = afterArr;
      }
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
        this.msgErr("没有输入专题名称");
        return;
      }
      if (this.formValidate.topicDesc == "") {
        this.msgErr("没有输入专题名称");
        return;
      }
      if (this.formValidate.imgUrl == "") {
        this.msgErr("请上传专题内容图片");
        return;
      }
      if (this.formValidate.startDate == "") {
        this.msgErr("请选择开始时间");
        return;
      }
      if (this.formValidate.endDate == "") {
        this.msgErr("请选择结束时间");
        return;
      }
      if (this.formValidate.startDate > this.formValidate.endDate) {
        this.msgErr("开始时间不能大于结束时间");
        return;
      }
      if (this.formValidate.specialTopicCouponList.length == 0) {
        this.msgErr("请选择优惠活动");
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
.imgSrc_box {
  float: left;
  width: 90px;
  height: 90px;
  line-height: 90px;
  margin-right: 10px;
  border: 1px dashed #dcdee2;
  background: #fff;
}

.left-text {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 12px;
  color: #515a6e;
  line-height: 1;
  padding: 10px 12px 10px 0;
  box-sizing: border-box;
}
.box {
  margin-bottom: 20px;
}
</style>
