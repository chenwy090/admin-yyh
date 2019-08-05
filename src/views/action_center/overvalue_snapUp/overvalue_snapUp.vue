<template>
  <div>
    <div>
      <Card :bordered="false">
        <Row class="operation">
          <Button icon="md-refresh" @click="getStaffListFn">刷新</Button>
        </Row>
        <div>
          <!-- 门店列表 -->
          <Table
            border
            width="100%"
            :columns="columns8"
            :data="shopList"
            :loading="TableLoading"
          >
            <template slot-scope="{ row }" slot="action">
              <Button
                type="success"
                style="margin-right: 5px"
                size="small"
                @click="checkDetails(row)"
              >设置爆抢券</Button>
              <!-- <Button type="error" size="small" @click="delLuckyDrawFn(row)">删除</Button> -->
            </template>
          </Table>
          <!-- 门店列表 -->
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
      <!-- <Alert type="warning">请点击选择优惠券类型，按搜索，选择需要的优惠券，选择后才能保存</Alert> -->
      <Form ref="formValidate" :model="formValidate" :label-width="70">
        <FormItem label="" :label-width="10">
          <RadioGroup v-model="formValidate.couponKind" type="button" @on-change="optionChange">
            <Radio label="1">超市券</Radio>
            <Radio label="2">周边券</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="券名称:">
          <Input style="width:150px" v-model="searchData.name" placeholder="请输入" clearable />
          <Button type="primary" icon="ios-search" style="margin-left:10px" @click="search">搜索</Button>
        </FormItem>
        <Table
          border
          highlight-row
          ref="selection"
          :columns="columns10"
          :data="CampaginList"
          @on-current-change="selectionCampagin"
        >
          <template slot-scope="{ row }" slot="name">
            <span v-if="formValidate.couponKind == 1">{{row.name}}</span>
            <span v-else-if="formValidate.couponKind == 2">{{row.title}}</span>
          </template>
          <template slot-scope="{ row }" slot="ChangeStartDate">
            <span v-if="formValidate.couponKind == 1 && row.changeDateType == 0">{{row.changeStartDate}}</span>
            <span v-else-if="formValidate.couponKind == 1 && row.changeDateType == 1">发券后+{{row.changeStart}}天开始兑换</span>
            <span v-else-if="formValidate.couponKind == 2 && row.useDateType == 1">{{row.useStartDate}}</span>
            <span v-else-if="formValidate.couponKind == 2 && row.useDateType == 2">发券后+{{row.addDaysUseStart}}天开始兑换</span>
          </template>
          <template slot-scope="{ row }" slot="ChangeEndDate">
            <span v-if="formValidate.couponKind == 1 && row.changeDateType == 0">{{row.changeEndDate}}</span>
            <span v-else-if="formValidate.couponKind == 1 && row.changeDateType == 1">发券后+{{row.changeEnd}}天结束兑换</span>
            <span v-else-if="formValidate.couponKind == 2 && row.useDateType == 1">{{row.useEndDate}}</span>
            <span v-else-if="formValidate.couponKind == 2 && row.useDateType == 2">发券后+{{row.addDaysUseEnd}}天结束兑换</span>
          </template>
        </Table>
        <!-- 分页器 -->
          <Row type="flex" justify="end" class="page">
            <Page
              :total="totalSize2"
              show-total
              show-elevator
              :current="current2"
              @on-change="changeCurrent2"
            ></Page>
          </Row>
          <!-- 分页器 -->
        <Row style="margin:10px 0 0 739px">
          <Button type="text" @click="cancel">取消</Button>
          <Button type="primary" @click="addLuckyDrawFn()" :disabled="formValidate.templateId == ''? true : false">保存</Button>
        </Row>
      </Form>
    </Modal>
    <!-- 新增抽奖活动 -->
    <!-- 查看详情 -->
    <Modal
      v-model="checkDetailsDisplay"
      :title="'查看爆抢券 - ' + checkDetailsName"
      width="1200"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Form ref="checkDetailsData" :model="checkDetailsData" :label-width="120">
        <Row class="operation">
          <Button type="primary" icon="md-add" @click="addStaff">新增</Button>
        </Row>
        <!-- 爆抢券列表 -->
          <Table
            border
            width="100%"
            :columns="columns9"
            :data="hotCouponList"
            :loading="TableLoading"
          >
            <template slot-scope="{ row }" slot="action">
              <Button type="error" size="small" @click="delLuckyDrawFn(row)">删除</Button>
            </template>
            <template slot-scope="{ row }" slot="sorting">
              <Button type="info" size="small" @click="editSort('up',row)">上升</Button>
              <Button type="info" size="small" style="margin-left:5px" @click="editSort('down',row)">下降</Button>
            </template>
            <template slot-scope="{ row }" slot="ChangeStartDate">
              <span v-if="row.couponKind == 1 && row.dateType == 0">{{row.ChangeStartDate}}</span>
              <span v-else-if="row.couponKind == 1 && row.dateType == 1">发券后+{{row.ChangeStart}}天开始兑换</span>
              <span v-else-if="row.couponKind == 2 && row.dateType == 1">{{row.use_start_date}}</span>
              <span v-else-if="row.couponKind == 2 && row.dateType == 2">发券后+{{row.add_days_use_start}}天开始兑换</span>
            </template>
            <template slot-scope="{ row }" slot="ChangeEndDate">
              <span v-if="row.couponKind == 1 && row.dateType == 0">{{row.ChangeEndDate}}</span>
              <span v-else-if="row.couponKind == 1 && row.dateType == 1">发券后+{{row.ChangeEnd}}天结束兑换</span>
              <span v-else-if="row.couponKind == 2 && row.dateType == 1">{{row.use_end_date}}</span>
              <span v-else-if="row.couponKind == 2 && row.dateType == 2">发券后+{{row.add_days_use_end}}天结束兑换</span>
            </template>
          </Table>
          <!-- 爆抢券列表 -->
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
        <Row style="margin: 10px 0 0 1112px">
          <Button @click="close">关闭</Button>
        </Row>
      </Form>
    </Modal>
    <!-- 查看详情 -->
    <!-- 优惠活动对话框 -->
    <!-- <Modal
      v-model="campaginDisplay"
      title="请选择优惠活动"
      width="600"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <div style="height:443px;overflow: auto;">
        <Table
          border
          highlight-row
          ref="selection"
          :columns="columns10"
          :data="CampaginList"
          @on-current-change="selectionCampagin"
        ></Table>
      </div>
      <Row style="margin:10px 0 0 455px">
        <Button type="text" @click="campaginDisplay = false">取消</Button>
        <Button type="primary" @click="closeCampaginDisplay">确认</Button>
      </Row>
    </Modal> -->
    <!-- 优惠活动对话框 -->
  </div>
</template>

<script>
  import {
    getShopList,
    getHotCouponList,
    getCampaginListData,
    addHotCoupon,
    editHotCoupon,
    delHotCoupon
  } from "@/api/sys";
  export default {
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
            width: 200,
            fixed: "left",
            slot: "action"
          },
          {
            title: "城市",
            align: "center",
            minWidth: 140,
            key: "city"
          },
          {
            title: "门店名",
            align: "center",
            minWidth: 160,
            key: "shopName"
          }
        ],
        // 爆抢券列表
        columns9: [
          {
            title: "操作",
            align: "center",
            width: 100,
            fixed: "left",
            slot: "action"
          },
          {
            title: "排序",
            align: "center",
            minWidth: 100,
            slot: "sorting"
          },
          {
            title: "券名称",
            align: "center",
            minWidth: 160,
            key: "name"
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
            title: "兑换开始时间",
            align: "center",
            minWidth: 160,
            key: "ChangeStartDate",
            slot: "ChangeStartDate"
          },
          {
            title: "兑换结束时间",
            align: "center",
            minWidth: 160,
            key: "ChangeEndDate",
            slot: "ChangeEndDate"
          },
        ],
        // 超市券/周边券列表
        columns10: [
          {
            title: "优惠券名称",
            align: "center",
            minWidth: 140,
            slot: "name"
          },
          {
            title: "活动开始时间",
            align: "center",
            minWidth: 160,
            key: "startDate"
          },
          {
            title: "活动结束时间",
            align: "center",
            minWidth: 160,
            key: "endDate"
          },
          {
            title: "兑换开始时间",
            align: "center",
            minWidth: 160,
            key: "ChangeStartDate",
            slot: "ChangeStartDate"
          },
          {
            title: "兑换结束时间",
            align: "center",
            minWidth: 160,
            key: "ChangeEndDate",
            slot: "ChangeEndDate"
          },
        ],
        // 
        // columns11: [
        //   {
        //     title: "优惠券ID",
        //     align: "center",
        //     minWidth: 140,
        //     key: "templateId"
        //   },
        //   {
        //     title: "优惠券名称",
        //     align: "center",
        //     minWidth: 140,
        //     key: "title"
        //   },
        //   {
        //     title: "所属商户",
        //     align: "center",
        //     minWidth: 140,
        //     key: "merchantName"
        //   }
        // ],
        shopList: [], //门店列表数据
        CampaginList: [], //优惠活动列表数据
        campaginName: "", // 优惠活动名称
        campaginId: "", // 优惠活动id
        //campaginCampId:'', // 选中的优惠活动Id
        searchData: {
          name: ""
        },
        // pagingType:'1', // 分页类型 1：初始化，2为搜索
        current: 1,
        totalSize: 0, //总条数
        TableLoading: false, //列表加载动画
        merchantList: [], // 商户列表
        add_edit: null, // 1为新增，2为编辑
        modalTitle: "", // 对话框标题文字
        addStaffDisplay: false, // 新增对话框显示
        // 新增表单
        formValidate: {
          couponKind: '',
          shopId: "",
          templateId: "",
        },
        file: null, // 上传门店列表
        // 上传二维码图片
        uploadList1: [],
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
        checkDetailsData: {}, // 查看详情数据
        hotCouponList:[], //爆抢券列表数据
        current1:1, // 分页 - 爆抢券
        totalSize1: 0, //总条数 - 爆抢券
        current2:1, // 分页 - 新增
        totalSize2: 0, //总条数 - 新增
        checkDetailsName:'', //爆抢券名称
      };
    },

    created: function() {
      this.getStaffListFn({});
    },
    methods: {
      init() {},

      // 查询门店列表
      getStaffListFn() {
        this.TableLoading = true;
        getShopList({}, this.current).then(res => {
          if (res.code == 200) {
            // console.log(res);
            this.shopList = res.data.records;
            this.current = res.data.current;
            this.totalSize = res.data.total;
            this.TableLoading = false;
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 优惠券搜索
      search() {
        if (this.formValidate.couponKind == "") {
          this.msgErr("请选择优惠券类型");
          return;
        }
        let data = {};
        let url = "";
        if (this.formValidate.couponKind == "1") {
          data = {
            isEffective: 1,
            campType: 57,
            status: 1,
            sendChannel: 1,
            name: this.searchData.name,
            requestFrom:'hotCoupon',
            shopId:this.formValidate.shopId
          };
          url = "/campagin/list";
        } else {
          data = {
            isEffective: 1,
            templateStatus: '进行中',
            title: this.searchData.name,
            requestFrom:'hotCoupon',
            shopId:this.formValidate.shopId
          };
          url = "/merchantCouponTemplate/backList";
        }
        getCampaginListData(url, data, this.current2).then(res => {
          if (res.code == 200) {
            this.CampaginList = res.data.records;
            // 分页
            this.current2 = res.data.current;
            this.totalSize2 = res.data.total;
          } else {
            this.msgErr(res.msg);
          }
        });
      },


      // 新增按钮
      addStaff() {
        this.add_edit = 1;
        this.modalTitle = "新增爆抢券";
        this.addStaffDisplay = true;
      },

      // 查看详情
      checkDetails(row) {
        this.formValidate.shopId = row.shopId
        this.checkDetailsName = row.shopName
        this.getHotCoupon()
        this.checkDetailsDisplay = true;
      },

      // 获取爆抢券列表
      getHotCoupon(){
        getHotCouponList(this.current1,this.formValidate.shopId).then(res => {
          if (res.code == 200) {
            this.hotCouponList = res.data.records;
            this.current1 = res.data.current;
            this.totalSize1 = res.data.total;
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 选中优惠活动
      selectionCampagin(currentRow, oldCurrentRow) {
        if(this.formValidate.couponKind == 1) {
          this.formValidate.templateId = currentRow.campId
        }else {
          this.formValidate.templateId = currentRow.templateId
        }
        this.msgOk("选择成功，请点击保存");
      },

      // 优惠活动点击保存
      closeCampaginDisplay() {
        // console.log(123);
        // console.log(this.formValidate.campId);
        if (this.formValidate.campId == "") {
          this.msgErr("还未选择优惠活动,请点击列表选择");
          return;
        }
        this.CampaginList = [];
        this.campaginDisplay = false;
      },

      // 保存
      addLuckyDrawFn() {
        addHotCoupon(this.formValidate).then(res => {
          if (res.code == 200) {
            this.addStaffDisplay = false
            this.msgOk("新增成功");
            this.getHotCoupon();
            this.cancel();
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 上升 下降
      editSort(event,row) {
        editHotCoupon(event,row.id).then(res => {
          if(res.code == 200) {
            this.getHotCoupon()
            this.msgOk('修改排序成功')
          }else {
            this.msgErr(res.msg)
          }
        })
      },

      // 删除
      delLuckyDrawFn(row) {
        this.$Modal.confirm({
          title: "删除确认",
          content: "<p>确认删除吗？</p>",
          onOk: () => {
            delHotCoupon(row.id).then(res => {
              if(res.code == 200) {
                this.getHotCoupon()
                this.msgOk('删除成功')
              }else {
                this.msgErr(res.msg)
              }
            })
          },
          onCancel: () => {
            // this.$Message.info('Clicked cancel');
          }
        });
      },

      // 关闭 新增
      cancel() {
        this.addStaffDisplay = false;
        this.formValidate.couponKind = ''
        this.formValidate.templateId = ''
        this.CampaginList = []
        this.current2 = 1
        // 重置搜索框
        this.searchData.name = '';
      },

      // 关闭查看
      close() {
        this.checkDetailsDisplay = false;
        this.formValidate.shopId = ''
        this.hotCouponList = []
        this.current1 = 1
      },

      // 分页
      changeCurrent: function(current) {
        this.current = current;
        this.getStaffListFn();
      },

      // 分页 - 爆抢券
      changeCurrent1: function(current) {
        this.current1 = current;
        this.getHotCoupon()
      },

      // 分页 - 新增
      changeCurrent2: function(current) {
        this.current2 = current;
        this.search()
      },

      //单选触发
      optionChange() {
        this.CampaginList = [];
        this.formValidate.templateId = '';
        this.searchData.name = '';
        // 分页
        this.current2 = 1
        this.totalSize2 = 0
      },

      //过滤小数点
      changeNumber() {
        let str = "" + this.searchData.campId;
        if (str.indexOf(".") != -1) {
          let arr = str.split("");
          arr.splice(arr.length - 1);
          let str2 = arr.join("");
          this.searchData.campId = +str2;
          this.msgErr("不能输入小数点");
        }
      },
      // changeNumber1() {
      //   let str = "" + this.searchData.campId;
      //   if (str.indexOf(".") != -1) {
      //     let arr = str.split("");
      //     arr.splice(arr.length - 1);
      //     let str2 = arr.join("");
      //     this.searchData.campId = +str2;
      //     this.msgErr('不能输入小数点')
      //   }
      // },
      changeNumber2() {
        let str = "" + this.bindData.mobile;
        if (str.indexOf(".") != -1) {
          let arr = str.split("");
          arr.splice(arr.length - 1);
          let str2 = arr.join("");
          this.bindData.mobile = +str2;
          this.msgErr("不能输入小数点");
        }
      },

      // 验证
      ruleValidate() {
        if (this.campaginId == "") {
          this.msgErr("请选择奖品优惠券活动");
          return;
        }
        // if( this.formValidate.campId == ''){
        //   this.msgErr('奖品优惠券活动还未选择')
        //   return
        // }

        for (var i = 0; i < this.formValidate.cashCouponDrawSetList.length; i++) {
          var resultIndex = i + 1;
          // if (this.formValidate.cashCouponDrawSetList[i].prizeSort === "") {
          //   this.msgErr("概率" + resultIndex + "条限制数量不能为空！");
          //   return;
          // }
          if (this.formValidate.cashCouponDrawSetList[i].ticketMoney == null) {
            this.msgErr("概率" + resultIndex + "的现金券面额不能为空！");
            return;
          }

          if (this.formValidate.cashCouponDrawSetList[i].limitCnt == null) {
            this.msgErr("概率" + resultIndex + "的限制张数不能为空！");
            return;
          }

          let str = this.formValidate.cashCouponDrawSetList[i].limitCnt + "";

          if (str.indexOf(".") != -1) {
            this.msgErr("概率" + resultIndex + "的限制张数不能有小数点！");
            return;
          }
        }
        return true;
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
