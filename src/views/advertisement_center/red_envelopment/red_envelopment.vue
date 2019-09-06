<template>
  <div>
    <div>
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="冠名活动名称：" :label-width="120">
            <Input style="width:100%" v-model="searchData.name" placeholder="请输入" clearable />
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
            <template slot-scope="{ row }" slot="amount">
              <span v-if="row.chargeType ==1">row.exposureAmount</span>
              <span v-else-if="row.chargeType == 0">personGiftList.exposureAmount/personGiftList.activityAmount</span>
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
              >查看</Button>
               <Button
              type="error"
              size="small"
              style="margin-right: 5px"
              @click="materialinfo(row)"
               >
              链路
            </Button>
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
    <!-- 新增冠名活动 -->
    <Modal
      v-model="addStaffDisplay"
      :title="modalTitle"
      width="885"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Form ref="formValidate" :model="formValidate" :label-width="120">
        <FormItem label="冠名活动名称:" required>
          <Input style="width:250px" v-model="formValidate.name" placeholder="请输入" clearable />
        </FormItem>
         <FormItem label="跟单销售:" required>
          <Input style="width:250px" v-model="formValidate.saleName" placeholder="请输入" clearable />
        </FormItem>
         <FormItem label="计费方式:" required>
           <RadioGroup v-model="formValidate.chargeType" >
            <!--  <Radio label="1">按时间</Radio>
                <Radio label="2">按曝光次数</Radio> -->
              <Radio label="1" value="1" >
                  <span>按时间</span>
              </Radio>
              <Radio label="2" value="2" checked>
                  <span>按曝光次数</span>
              </Radio>
          </RadioGroup>
        </FormItem>
         <FormItem label="冠名次数:" >
          <Input style="width:250px" v-model="formValidate.activityAmount" placeholder="请输入" clearable  v-if="formValidate.chargeType != 1" type="number"/>
        </FormItem>
        <Form-item label="开始时间" required>
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
        </Form-item>
        <Form-item label="结束时间" required>
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
        </Form-item>
        <FormItem label="备注:" >
          <Input style="width:250px" v-model="formValidate.remark" placeholder="请输入" clearable />
        </FormItem>
   <!--    <Table border :columns="columns12" :data="data6">
              <template slot-scope="{ row }" slot="name">
                  <strong>{{ row.name }}</strong>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                  <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">编辑</Button>
              </template>
          </Table> -->


      <Row style="margin:10px 0 0 739px">
          <Button type="text" @click="cancel">取消</Button>
          <Button type="primary" @click="addLuckyDrawFn()">保存</Button>
        </Row>
      </Form>
    </Modal>
    <!-- 新增冠名活动 -->

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
        <FormItem label="冠名活动名称:" required>
          <Input style="width:250px" v-model="formValidate.name" placeholder="请输入" disabled/>
        </FormItem>
         <FormItem label="跟单销售:" required>
          <Input style="width:250px" v-model="formValidate.saleName" placeholder="请输入"   disabled/>
        </FormItem>
         <FormItem label="计费方式:" required>
           <RadioGroup v-model="formValidate.chargeType" >
            <!--  <Radio label="1">按时间</Radio>
                <Radio label="2">按曝光次数</Radio> -->
              <Radio label="1" value="formValidate.chargeType" v-if="formValidate.chargeType == 1"  disabled>
                  <span>按时间</span>
              </Radio>
              <Radio label="2" value="formValidate.chargeType" v-if="formValidate.chargeType == 2" disabled>
                  <span>按曝光次数</span>
              </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="冠名次数:" >
          <Input style="width:250px" v-model="formValidate.activityAmount" placeholder="请输入"   v-if="formValidate.chargeType != 1" type="number" disabled/>
        </FormItem>
        <FormItem label="备注:" required>
          <Input style="width:250px" v-model="formValidate.remark" placeholder="请输入" disabled/>
        </FormItem>
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
        <!-- 链路列表 -->
        <Table border width="100%" :columns="columns4" :data="formValidate.materialList">
          <template slot-scope="{ row, index }" slot="imgUrl">
            <img :src="row.imgUrl" style="width:40px; height:40px;" />
         <!--    <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
            <Button type="error" size="small" @click="remove(index)">Delete</Button> -->
          </template>
        </Table>
        <!-- 链路列表 -->
        <Row style="margin:10px 0 0 795px">
          <Button @click="close">关闭</Button>
        </Row>
      </Form>
    </Modal>
    <!-- 查看详情 -->

    <!-- 查看链路素材 -->
    <Modal
      v-model="materialDisplay"
      title="链路信息"
      width="885"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
    <!--   <Form ref="materialData" :model="materialData" :label-width="120">

      </Form> -->
       <Row class="operation">
          <Button type="primary" icon="md-add" @click="addmateriaStaff">新增</Button>
        </Row>
      <Table border width="100%" :columns="columns5" :data="materiaValidate">
          <template slot-scope="{ row }" slot="action">
                  <Button
                    type="primary"
                    size="small"
                    style="margin-right: 5px"
                    @click="editmateriaStaff(row)"
                  >编辑</Button>
          </template>
          <template slot-scope="{ row, index }" slot="imgUrl">
            <img :src="row.imgUrl" style="width:40px; height:40px;"  />
          </template>
        </Table>
        <Row style="margin:10px 0 0 795px">
          <Button @click="closeMaterial">关闭</Button>
        </Row>
    </Modal>
    <!-- 查看链路素材 -->
    <!-- 新增链路素材 -->
    <Modal
      v-model="addmateriaStaffDisplay"
      :title="modalTitle"
      width="885"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
        <Form ref="materiaformValidate" :model="materiaformValidate" :label-width="120">
         <FormItem label="活动ID:" required>
          <Input style="width:250px" v-model="curItem"  placeholder="请输入" disabled clearable />
        </FormItem>
        <FormItem label="链路名称:" required>
          <Input style="width:250px" v-model="materiaformValidate.chainName" placeholder="请输入" clearable />
        </FormItem>
         <FormItem label="链路code:" required>
          <Input style="width:250px" v-model="materiaformValidate.chainCode" placeholder="请输入" clearable />
        </FormItem>
          <FormItem label="页面名称:" required>
          <Input style="width:250px" v-model="materiaformValidate.pageName" placeholder="请输入" clearable />
        </FormItem>
         <FormItem label="页面code:" required>
          <Input style="width:250px" v-model="materiaformValidate.pageCode" placeholder="请输入" clearable />
        </FormItem>
        <FormItem label="文案:" >
          <Input style="width:250px" type="textarea" v-model="materiaformValidate.textInfo" placeholder="请输入" maxlength="20" clearable />
        </FormItem>
         <Form-item label="开始时间" required>
          <DatePicker
            type="date"
            placeholder="选择开始日期"
            style="width: 250px"
            format="yyyy-MM-dd"
            @on-change="time3"
            :value="materiaformValidate.startDate"
            @on-clear="clearTime3"
          ></DatePicker>
        </Form-item>
        <Form-item label="结束时间" required>
          <DatePicker
            type="date"
            placeholder="选择开始日期"
            style="width: 250px"
            format="yyyy-MM-dd"
            @on-change="time4"
            :value="materiaformValidate.endDate"
            @on-clear="clearTime4"
          ></DatePicker>
        </Form-item>
        <!-- 上传图片 -->
        <Form-item label="图片:" required>
          <div
            style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
          >
            <img :src="materiaformValidate.imgUrl"  style="width:40px; height:40px;"  />
          </div>
          <div style="display: inline-block;">
            <Upload
              ref="upload"
              :defaultList="uploadList1"
              type="drag"
              :format="['jpg','jpeg','png','bmp']"
              :on-success="handleSuccess1"
              :action="url"
              accept="image"
              :max-size="1024"
              :on-exceeded-size="handleMaxSize"
              :on-format-error="formatError"
              :headers="userToken"
              :show-upload-list="false"
              style="display: inline-block;width:90px;"
            >
              <!-- :before-upload="handleUploadicon"  :show-upload-list="false"-->
              <div style="width: 90px;height:90px;line-height: 90px;">
                <Icon type="ios-camera" size="20" />
              </div>
            </Upload>
          </div>
          <p>品牌图 (不大于1M, JPG/PNG/JPEG/BMP）</p>
            </Form-item>
        <!-- 上传图片 -->
      <Row style="margin:10px 0 0 739px">
          <Button type="text" @click="canceladdMeateria">取消</Button>
          <Button type="primary" @click="addMateriaFn()">保存</Button>
        </Row>
      </Form>
    </Modal>
    <!-- 新增链路素材 -->
  </div>
</template>

<script>
  import {
    getRedEnvelopmentList,
    getCampaginListData,
    selectByActivityId,
    addRedEnvelopment,
    editRedEnvelopmentData,
    selectByid,
    upStatus,
    selectmaterialByActivityId,
     addMateria,
     editMateria,
     selectmateriaById
  } from "@/api/sys";
  import { uploadOperationImage2AliOssURl } from "@/api/index";
  export default {
    name: "nameing_activity",
    data() {
      return {
        curItem:'',
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",
        // 活动列表
        columns8: [
          {
            title: "操作",
            align: "center",
            width: 250,
            fixed: "left",
            slot: "action"
          },
          {
            title: "活动ID",
            align: "center",
            minWidth: 100,
            key: "activityId"
          },
          {
            title: "冠名活动名称",
            align: "center",
            minWidth: 160,
            key: "name"
          },
            {
            title: "冠名状态",
            align: "center",
            minWidth: 100,
            key: "status",
            slot: "status"
          },
          {
            title: "冠名次数",
            align: "center",
            minWidth: 160,
            key: "amount",
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
            title: "销售人员",
            align: "center",
            minWidth: 120,
            key: "saleName"
          },
          {
            title: "创建时间",
            align: "center",
            minWidth: 160,
            key: "createTime"
          }
        ],
        // 冠名活动列表
        columns4: [
          {
            title: "红包冠名活动id",
            align: "center",
            minWidth: 140,
            key: "activityId",
          },
          {
            title: "红包冠名链路code",
            align: "center",
            minWidth: 140,
            key: "chainCode"
          },
          {
            title: "红包冠名页面code",
            align: "center",
            minWidth: 140,
            key: "pageCode"

          },
           {
            title: "图片",
            align: "center",
            minWidth: 140,
            slot: "imgUrl",
          },
          {
            title: "文案",
            align: "center",
            minWidth: 140,
            key: "textInfo"
          }
        ],

      // 链路素材活动列表
        columns5: [
        {
            title: "操作",
            align: "center",
            width: 250,
            fixed: "left",
            slot: "action"
          },
          {
            title: "红包冠名活动id",
            align: "center",
            minWidth: 140,
            key: "activityId",
          },
           {
            title: "红包冠名链路名称",
            align: "center",
            minWidth: 140,
            key: "chainName"
          },
          {
            title: "红包冠名链路code",
            align: "center",
            minWidth: 140,
            key: "chainCode"
          },
           {
            title: "红包冠名页面名称",
            align: "center",
            minWidth: 140,
            key: "pageName"

          },
          {
            title: "红包冠名页面code",
            align: "center",
            minWidth: 140,
            key: "pageCode"

          },
           {
            title: "图片",
            align: "center",
            minWidth: 140,
            slot: "imgUrl",
          },
          {
            title: "文案",
            align: "center",
            minWidth: 140,
            key: "textInfo"
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
        ],
        materiaValidate:[],

        personGiftList: [], //红包冠名活动列表数据
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
        addmateriaStaffDisplay:false,//新增链路素材显示
        // 新增表单
        formValidate: {
          name: "",
          saleName: "",
          chargeType: "1",
          exposureAmount:"",
          startDate: "",
          endDate:"",
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
        this.searchData.name = "";
        this.pagingType = "1";
        this.search();
      },

      // 查询列表
      getStaffListFn(obj) {
        this.TableLoading = true;
        getRedEnvelopmentList(obj, this.current).then(res => {
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
        this.modalTitle = "新增红包冠名活动";
        this.addStaffDisplay = true;
        //this.formValidate=null;
      },
      // 新增冠名素材按钮
      addmateriaStaff() {
        this.add_edit = 1;
        this.modalTitle = "新增链路素材";
        this.addmateriaStaffDisplay = true;
        const activityId =  this.activityId;
        this.materiaformValidate.activityId=activityId;
      },


      // 编辑按钮
      editStaff(row) {
        selectByActivityId(row.activityId).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.formValidate = res.data;
            this.formValidate.delIds = []

            // this.formValidate.cashCouponDrawSetList = res.data;
            // this.formValidate.ids = [];
            // this.campaginName = row.name;
            // this.campaginId = row.campId;
            // // this.editActId = res.data.actId
            this.add_edit = 2;
            this.modalTitle = "编辑红包冠名活动";
            this.addStaffDisplay = true;
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 编辑链路素材按钮
      editmateriaStaff(row) {
        selectmateriaById(row.id).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.materiaformValidate = res.data;
            this.add_edit = 2;
            this.modalTitle = "编辑红包冠名活动";
            this.addmateriaStaffDisplay = true;
          } else {
            this.msgErr(res.msg);
          }
        });
      },
    // 查询某活动下的链路素材
      materialinfo(row) {
        this.curItem = row.activityId
        selectmaterialByActivityId(row.activityId).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.materiaValidate = res.data;
            this.formValidate.delIds = []
            this.modalTitle = "红包冠名链路";
            this.materialDisplay = true;
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      materialinfolist(activityId) {
        selectmaterialByActivityId(activityId).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.materiaValidate = res.data;
            this.formValidate.delIds = []
            this.modalTitle = "红包冠名链路";
            this.materialDisplay = true;
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 查看详情
      checkDetails(row) {
        selectByid(row.id).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.formValidate = res.data;
            this.checkDetailsDisplay = true;
          } else {
            this.msgErr(res.msg);
          }
        });
      },

 // 上传宣传图片(新增)
      handleSuccess1(res, file) {
        if (res.code == 200) {
          this.materiaformValidate.imgUrl = res.image_url;
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

      // 保存链路素材
      addMateriaFn() {

        this.materiaformValidate.activityId=this.curItem;
       console.log(this.materiaformValidate.startDate);
       console.log(this.materiaformValidate.endDate);
        // 验证
        if (!this.addMateriaruleValidate()) {
          return;
        }
        if (this.add_edit == 1) {
          addMateria(this.materiaformValidate).then(res => {
            if (res.code == 200) {
              this.msgOk("新增成功");
              this.materialinfolist(this.curItem);
              this.canceladdMeateria();
            } else {
              this.msgErr(res.msg);
            }
          });
        } else if (this.add_edit == 2) {
          editMateria(this.materiaformValidate).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.msgOk("编辑成功");
              this.materialinfolist(this.curItem);
              this.canceladdMeateria();
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
        upStatus(row.id, num).then(res => {
          if(res.code == 200){
            if(num == 1){
              this.msgOk('上架成功')
            }else {
              this.msgOk('下架成功')
            }
            this.getStaffListFn({});
          }else {
            this.msgErr(res.msg)
          }
        });
      },

      // 删除活动列表
      delCouponList(index, row) {
        if(row.id){
          this.formValidate.delIds.push(row.id)
          // console.log(this.formValidate.delIds);
        }
        this.formValidate.specialTopicCouponList.splice(index,1)
      },

      // 关闭对话框
      cancel() {
        this.addStaffDisplay = false;
        if (this.formValidate.delIds) {
          this.formValidate.delIds = [];
        }
        this.formValidate.activityAmount= "";
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
         this.materiaformValidate.startDate = "";
         this.materiaformValidate.endDate = "";
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
          this.msgErr("请选择结束时间");
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
         if (this.materiaformValidate.startDate == "") {
          this.msgErr("请选择开始时间");
          return;
        }
        if (this.materiaformValidate.endDate == "") {
          this.msgErr("请选择结束时间");
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

 // 时间过滤
      time3(e) {
        // console.log(e);
        if (e) {
          let time = e.slice(0, 10) + " " + "00:00:00";
          this.materiaformValidate.startDate = time;
        }
      },
      clearTime3() {
        this.materiaformValidate.startDate = "";
      },
      time4(e) {
        // console.log(e);
        if (this.materiaformValidate.startDate == "") {
          this.msgErr("开始时间未选择");
          return;
        }
        if (e) {
          let time = e.slice(0, 10) + " " + "23:59:59";
          this.materiaformValidate.endDate = time;
        }
      },
      clearTime4() {
        this.materiaformValidate.endDate = "";
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
</style>
