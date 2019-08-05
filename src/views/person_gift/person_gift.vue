<template>
  <div>
    <div>
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="奖品优惠券活动ID：" :label-width="120">
            <InputNumber
              style="width:100%"
              v-model="searchData.campId"
              placeholder="请输入奖品优惠券活动ID"
              clearable
              :max="99999999999999999"
              :min="0"
              @keyup.native="changeNumber"
            />
          </FormItem>
          <span v-if="drop">
            <FormItem label="优惠券活动名称：" :label-width="120">
              <Input
                style="width:100%"
                v-model="searchData.name"
                placeholder="请输入优惠券活动名称"
                clearable
              />
            </FormItem>
          </span>
          <FormItem style="margin-left:35px;" class="br">
            <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            <Button icon="md-refresh" @click="reset">重置</Button>
            <a class="drop-down" @click="dropDown">
              {{dropDownContent}}
              <Icon :type="dropDownIcon"></Icon>
            </a>
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
            <template slot-scope="{ row }" slot="wxQrcode">
              <img
                :src="row.wxQrcode"
                v-if="row.wxQrcode != ''"
                style="width:40px"
                @click="wxQrcodeLook(row.wxQrcode)"
              >
            </template>

            <template slot-scope="{ row }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="editStaff(row)"
              >编辑</Button>
              <Button
                type="success"
                style="margin-right: 5px"
                size="small"
                @click="checkDetails(row)"
              >查看详情</Button>
              <Button type="error" size="small" @click="delLuckyDrawFn(row)">删除</Button>
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
      <Form ref="formValidate" :model="formValidate" :label-width="120">
        <FormItem label="奖品优惠券活动：" required>
          <Button @click="getCampaginListFn" v-if="this.campaginName == ''">未选择</Button>
          <Button @click="getCampaginListFn" v-else>{{campaginName}}</Button>
        </FormItem>
        <Row>
          <Timeline pending>
            <TimelineItem
              v-for="(item, index) in formValidate.cashCouponDrawSetList"
              :key="index"
              style="padding:0;"
            >
              <Row>
                <Col span="2">
                  <p class="time">概率{{index+1}}</p>
                </Col>
                <Col span="22">
                  <Card>
                    <FormItem
                      label="现金券面额"
                      required
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="85"
                    >
                      <InputNumber
                        placeholder="请输入"
                        :min="1"
                        :max="9999999999999"
                        style="width: 120px"
                        v-model="item.ticketMoney"
                      />&nbsp;&nbsp;元
                    </FormItem>
                    <FormItem
                      label="限制张数"
                      required
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="110"
                    >
                      <InputNumber
                        v-model="item.limitCnt"
                        placeholder="请输入"
                        style="width:100px"
                        :min="1"
                        :max="9999999999999"
                        @on-change="percentWatch"
                      />&nbsp;&nbsp;张
                    </FormItem>
                    <FormItem
                      label="中奖概率"
                      required
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="110"
                    >
                      <InputNumber
                        placeholder="请选择时间"
                        style="width: 120px"
                        disabled
                        v-model="item.percent"
                      />
                    </FormItem>
                    <Button
                      type="error"
                      size="small"
                      style=" margin-left:5%;"
                      v-if="formValidate.cashCouponDrawSetList.length>1"
                      @click="handleRemove(index,item)"
                    >删除</Button>
                  </Card>
                </Col>
              </Row>
            </TimelineItem>
          </Timeline>
          <Button type="success" @click="handleAdd" icon="md-add" style="margin: 0 0 10px 776px">新增</Button>
        </Row>
        <Row style="margin-left:739px">
          <Button type="text" @click="cancel">取消</Button>
          <!-- <Button
            type="primary"
            @click="addLuckyDrawFn()"
            :disabled="isCheckDisabled"
            v-if="add_edit == 1"
          >保存</Button>-->
          <Button type="primary" @click="addLuckyDrawFn()">保存</Button>
        </Row>
      </Form>
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
        <Row>
          <FormItem label="奖品优惠券活动：">
            <Button disabled>{{campaginName}}</Button>
          </FormItem>
          <Timeline pending>
            <TimelineItem
              v-for="(item, index) in checkDetailsData.cashCouponDrawSetList"
              :key="index"
              style="padding:0;"
            >
              <Row>
                <Col span="2">
                  <p class="time">概率{{index+1}}</p>
                </Col>
                <Col span="22">
                  <Card>
                    <FormItem
                      label="现金券面额"
                      required
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="85"
                    >
                      <InputNumber
                        placeholder="请输入"
                        style="width: 120px"
                        v-model="item.ticketMoney"
                        disabled
                      />&nbsp;&nbsp;元
                    </FormItem>
                    <FormItem
                      label="限制张数"
                      required
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="110"
                    >
                      <InputNumber
                        v-model="item.limitCnt"
                        disabled
                        placeholder="请输入"
                        style="width:100px"
                        :min="1"
                        :max="9999999999999"
                        @on-change="percentWatch"
                      />&nbsp;&nbsp;张
                    </FormItem>
                    <FormItem
                      label="中奖概率"
                      required
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="110"
                    >
                      <InputNumber
                        placeholder="请选择时间"
                        style="width: 120px"
                        disabled
                        v-model="item.percent"
                      />
                    </FormItem>
                  </Card>
                </Col>
              </Row>
            </TimelineItem>
          </Timeline>
        </Row>
        <Row style="margin-left:795px">
          <Button @click="close">关闭</Button>
        </Row>
      </Form>
    </Modal>
    <!-- 查看详情 -->
    <!-- 优惠活动对话框 -->
    <Modal
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
          :columns="columns4"
          :data="CampaginList"
          @on-current-change="selectionCampagin"
        ></Table>
      </div>
      <Row style="margin:10px 0 0 455px">
        <Button type="text" @click="campaginDisplay = false">取消</Button>
        <Button type="primary" @click="closeCampaginDisplay">确认</Button>
      </Row>
    </Modal>
    <!-- 优惠活动对话框 -->
  </div>
</template>

<<script>
import { getPersonGiftList, getCampagin_6List, addPersonGift, geiPersonGiftData, editPersonGift, delPersonGift } from '@/api/sys'
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
          title: '操作',
          align: 'center',
          width: 200,
          fixed: 'left',
          slot: "action",
        },
        {
          title: '奖品优惠券活动ID',
          align: 'center',
          minWidth: 140,
          key: 'campId',
        },
        {
          title: '优惠券活动名称',
          align: 'center',
          minWidth: 160,
          key: 'name',
        },
      ], 
      // 优惠活动列表
      columns4:[
        {
          title: '优惠活动名称',
          align: 'center',
          minWidth: 140,
          key: 'name',
        },
      ],
      personGiftList: [], //抽奖活动列表数据
      CampaginList: [], //优惠活动列表数据
      campaginName:'', // 优惠活动名称
      campaginId:'', // 优惠活动id
      //campaginCampId:'', // 选中的优惠活动Id
      searchData: { // 查询参数
        campId: null,
        name: '',
      },
      // pagingType:'1', // 分页类型 1：初始化，2为搜索
      current: 1,
      totalSize: 0, //总条数
      TableLoading: false, //列表加载动画
      merchantList:[], // 商户列表
      add_edit: null, // 1为新增，2为编辑
      modalTitle: '', // 对话框标题文字
      addStaffDisplay: false, // 新增对话框显示
      // 新增表单
      formValidate:{
        cashCouponDrawSetList: [
          {
            campId: this.campaginId, // 奖品优惠券活动ID
            limitCnt: null, // 限制数量
            percent: 1, // 中奖概率，最多保留4位小数
            ticketMoney: null // 新人奖励现金券面额
          }
        ]
      },
      file: null, // 上传门店列表
      // 上传二维码图片
      uploadList1:[],
      userToken: {}, //用户token
      editEmployeeId: '', // 编辑员工编号
      //绑定/解绑
      bindData:{
        employeeId: "",
        mobile: null,
        type: ""
      },
      campaginDisplay:false, // 解绑对话框显示
      wxQrcodeDisplay:false, // 查看二维码对话框显示
      wxQrcode_url:'', // 查看二维码路径
      isCheckDisabled: true, // 启用按钮
      checkDetailsDisplay: false, // 查看详情对话框显示
      checkDetailsData: {}, // 查看详情数据
    }
  },

  created: function() {
    this.getStaffListFn({})
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
      this.getStaffListFn(this.searchData)
      // this.pagingType = '2'
    },

// 重置
    reset() {
      this.searchData.campId =  null
      this.searchData.name =  ''
      this.pagingType = '1'
      this.search()
    },

// 查询列表
    getStaffListFn(obj) {
      this.TableLoading = true
      getPersonGiftList(obj,this.current).then(res => {
        if(res.code == 200){
          // console.log(res);
          this.personGiftList = res.data.records
          this.current = res.data.current
          this.totalSize = res.data.total
          this.TableLoading = false
        }else {
          this.msgErr(res.msg)
        }
      })
    },

// 新增按钮
    addStaff() {
      this.add_edit = 1
      this.modalTitle = '新增新人礼包'
      this.addStaffDisplay = true
    },

// 编辑按钮
    editStaff(row) {
      geiPersonGiftData(row.campId).then(res => {
        // console.log(res);
        if(res.code == 200) {
          this.formValidate.cashCouponDrawSetList = res.data
          this.formValidate.ids = []
          this.campaginName = row.name
          this.campaginId = row.campId
          // this.editActId = res.data.actId
          this.add_edit = 2
          this.modalTitle = '编辑新人礼包'
          this.addStaffDisplay = true
        }else {
          this.msgErr(res.msg)
        }
      })
    },

// 查看详情
    checkDetails(row) {
      geiPersonGiftData(row.campId).then(res => {
        // console.log(res);
        if(res.code == 200) {
          this.campaginName = row.name
          this.checkDetailsData.cashCouponDrawSetList = res.data
          this.checkDetailsDisplay = true
        }else {
          this.msgErr(res.msg)
        }
      })
    },

// 选择优惠活动对话框
    getCampaginListFn() {
      getCampagin_6List().then(res=> {
        if(res.code == 200) {
          // console.log(res);
          let arr = res.data.records
          for (let i = 0; i < arr.length; i++) {
            if(arr[i].status == 1){
              this.CampaginList.push(arr[i])
            }
          }
          this.campaginDisplay = true;
          // console.log(this.CampaginList);
        }else {
          this.msgErr(res.msg)
        }
      })
    },

// 选中优惠活动
    selectionCampagin(currentRow,oldCurrentRow) {
      // console.log(currentRow);
      this.campaginId = currentRow.campId
      for (let i = 0; i < this.formValidate.cashCouponDrawSetList.length; i++) {
        this.formValidate.cashCouponDrawSetList[i].campId = currentRow.campId
      }
      this.campaginName = currentRow.name
      this.msgOk('选择成功')
    },

// 优惠活动点击保存
    closeCampaginDisplay(){
      // console.log(123);
      // console.log(this.formValidate.campId);
      if(this.formValidate.campId == '') {
        this.msgErr('还未选择优惠活动,请点击列表选择')
        return;
      }
      this.CampaginList = []
      this.campaginDisplay = false
    },

// 添加时间时间段
    handleAdd() {
      // if (this.campaginGrabInfoList.length >= 15) {
      //   this.$Message.error("不能超过15个整点抢时间段");
      //   return;
      // } else {
        if(this.campaginId == '') {
          this.msgErr('请选择奖品优惠券活动后，才能新增')
          return
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

// 保存
    addLuckyDrawFn() {
      // 验证
      if (!this.ruleValidate()) {
        return;
      }

      // console.log(this.formValidate);
      // return

      if(this.formValidate.ids) {
        this.formValidate.ids = this.formValidate.ids.join()
      }
      // let arr = []
      // for (let i = 0; i < this.formValidate.cashCouponDrawSetList.length; i++) {
      //   arr.push(this.formValidate.cashCouponDrawSetList[i])
      //   arr[i].percent = arr[i].percent / 100
      // }
      
      if(this.add_edit == 1) {
        addPersonGift(this.formValidate).then(res => {
          if(res.code == 200){
            this.msgOk('新增成功')
            this.getStaffListFn({})
            this.cancel()
          }else {
            this.msgErr(res.msg)
          }
        })
      }else if(this.add_edit == 2) {
        editPersonGift(this.formValidate).then(res => {
          // console.log(res);
          if(res.code == 200){
            this.msgOk('编辑成功')
            this.getStaffListFn({})
            this.cancel()
          }else {
            this.msgErr(res.msg)
          }
        })
      }

      
    },

// 删除
    delLuckyDrawFn(row){
      this.$Modal.confirm({
          title: '删除确认',
          content: '<p>确认删除当前新人礼包吗？</p>',
          onOk: () => {
            delPersonGift(row.campId).then(res => {
              if(res.code == 200) {
                this.msgOk('删除成功')
                this.getStaffListFn({})
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

// 关闭对话框
    cancel() {
      this.addStaffDisplay = false
      // this.formValidate.campId = ""
      if(this.formValidate.ids){
        this.formValidate.ids = []
      }
      this.formValidate.cashCouponDrawSetList = [
        {
          campId: this.campaginId, // 奖品优惠券活动ID
          limitCnt: null, // 限制数量
          percent: 1, // 中奖概率，最多保留4位小数
          ticketMoney: null // 新人奖励现金券面额
        }
      ],
      // this.formValidate.endDate = ""
      // this.formValidate.limitTotal = null
      // this.formValidate.remark = ""
      // this.formValidate.startDate = ""
      this.campaginName = ""
      this.campaginId = ""
    },

// 关闭查看
    close() {
      this.checkDetailsDisplay = false
      this.campaginName = ""
    },


// 分页（点击第几页）
    changeCurrent: function (current) {
      // var self = this;
      // self.banner_page_req.start = current * self.banner_page_req.limit - self.banner_page_req.limit;
      this.current = current;
      // if(this.pagingType == 1){
      // } else if (this.pagingType == 2) {
        this.getStaffListFn(this.searchData);
      // }
    },

// 计算概率
    percentWatch() {
      // for (let i = 0; i < this.formValidate.cashCouponDrawSetList.length; i++) {
      //   var resultIndex = i + 1
      //   if(this.formValidate.cashCouponDrawSetList[i].ticketMoney == null) {
      //     this.msgErr("概率" + resultIndex + "的现金券面额不能为空！");
      //   }
      // }
      if(this.formValidate.cashCouponDrawSetList.length > 1) {
        this.count()
      }
    },

// 计算输入
    count() {
      let num = 0
      let divide, multiply
      let data = this.formValidate.cashCouponDrawSetList[0].limitCnt
      for (let i = 0; i < this.formValidate.cashCouponDrawSetList.length; i++) {
        num += this.formValidate.cashCouponDrawSetList[i].limitCnt
      }
      for (let j = 0; j < this.formValidate.cashCouponDrawSetList.length; j++) {
        divide = this.formValidate.cashCouponDrawSetList[j].limitCnt / num
        // console.log(divide);
        // multiply = divide.toFixed(4) * 100
        this.formValidate.cashCouponDrawSetList[j].percent = Number(divide.toString().match(/^\d+(?:\.\d{0,4})?/))
      }
      let num1 = 0
      let reduce,adding
      let l = this.formValidate.cashCouponDrawSetList.length - 1
      for (let k = 0; k < this.formValidate.cashCouponDrawSetList.length; k++) {
        num1 += this.formValidate.cashCouponDrawSetList[k].percent
      }
      if( num1 != 1) {
        reduce =  1 - num1
        adding = this.formValidate.cashCouponDrawSetList[l].percent + reduce
        this.formValidate.cashCouponDrawSetList[l].percent = Number(adding.toFixed(4))
      }
      // let divide, cut , multiply , cut1 , cut2
      // for (let j = 0; j < this.formValidate.cashCouponDrawSetList.length; j++) {
      //     divide = data/num
      //     cut  = divide.toFixed(6)
      //     multiply = cut * 100
      //     cut1 = multiply.toFixed(4)
      //     if(cut1.substring(3,cut1.indexOf(".") + 5) == '0000') {
      //       cut2 = cut1.slice(0,2)
      //       // console.log(cut2);
      //       this.formValidate.cashCouponDrawSetList[j].percent = Number(cut2)
      //     } else {
      //       // console.log(cut1);
      //       this.formValidate.cashCouponDrawSetList[j].percent =  Number(cut1)
      //     }
      // }
    },

//过滤小数点
      changeNumber() {
        let str = "" + this.searchData.campId;
        if (str.indexOf(".") != -1) {
          let arr = str.split("");
          arr.splice(arr.length - 1);
          let str2 = arr.join("");
          this.searchData.campId = +str2;
          this.msgErr('不能输入小数点')
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
          this.msgErr('不能输入小数点')
        }
      },

// 验证
      ruleValidate(){
        if(this.campaginId == '') {
          this.msgErr('请选择奖品优惠券活动')
          return
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

          let str = this.formValidate.cashCouponDrawSetList[i].limitCnt + ""

          if(str.indexOf('.') != -1) {
            this.msgErr("概率" + resultIndex + "的限制张数不能有小数点！");
            return
          }

          // if (
          //   this.formValidate.drawActivityTimerangeList[i].timeStart ==
          //   this.formValidate.drawActivityTimerangeList[i].timeEnd
          // ) {
          //   this.msgErr(
          //     "时间段" + resultIndex + "开始时间不能等于结束时间"
          //   );
          //   return;
          // }

          // if (
          //   this.formValidate.drawActivityTimerangeList[i].timeStart >
          //   this.formValidate.drawActivityTimerangeList[i].timeEnd
          // ) {
          //   this.msgErr(
          //     "时间段" + resultIndex + "开始时间不能大于结束时间"
          //   );
          //   return;
          // }

          // let ts = Number(this.formValidate.drawActivityTimerangeList[i].timeStart.slice(0,2)) + 1
          // let te = Number(this.formValidate.drawActivityTimerangeList[i].timeEnd.slice(0,2))
          // if(ts != te) {
          //   this.msgErr('时间段' + resultIndex + '结束时间只能大于开始时间一小时')
          //   return
          // }
        }

      //   for (var i = 0; i < this.formValidate.drawActivityTimerangeList.length; i++) {
      //   if (this.formValidate.drawActivityTimerangeList.length > i + 1) {
      //     var resultIndex = i + 1;

      //     // if (
      //     //   this.formValidate.drawActivityTimerangeList[i + 1].timeStart <=
      //     //   this.formValidate.drawActivityTimerangeList[i].timeStart
      //     // ) {
      //     //   this.msgErr(
      //     //     "时间段" +
      //     //       resultIndex +
      //     //       "的开始时间不能和" +
      //     //       "时间段" +
      //     //       [resultIndex + 1] +
      //     //       "的开始时间交叉"
      //     //   );
      //     //   return;
      //     // }

      //     if (
      //       this.formValidate.drawActivityTimerangeList[i + 1].timeStart <=
      //       this.formValidate.drawActivityTimerangeList[i].timeEnd
      //     ) {
      //       this.msgErr(
      //         "时间段" +
      //           resultIndex +
      //           "的结束时间不能大于" +
      //           "时间段" +
      //           [resultIndex + 1] +
      //           "的开始时间"
      //       );
      //       return;
      //     }

      //   }
      // }
        return true
      },

// 时间过滤
      // time1(e) {
      //   // console.log(e);
      //   if (e) {
      //     let time = e.slice(0, 10) + " " + "00:00:00";
      //     this.formValidate.startDate = time;
      //   }
      // },
      // clearTime1() {
      //   this.formValidate.startDate = "";
      // },
      // time2(e) {
      //   // console.log(e);
      //   if(this.formValidate.startDate == ''){
      //     this.msgErr('开始时间未选择')
      //     return
      //   }
      //   if (e) {
      //     let time = e.slice(0, 10) + " " + "23:59:59";
      //     this.formValidate.endDate = time;
      //   }
      // },
      // clearTime2() {
      //   this.formValidate.endDate = "";
      // },

      // computationTime() {
      //   let sTime = new Date(this.formValidate.startDate).valueOf()
      //   let eTime = new Date(this.formValidate.endDate).valueOf()
      //   let sss = eTime - sTime
      //   var days = sss / 1000 / 60 / 60 / 24;
      //   var daysRound = Math.floor(days) + 1;
      //   this.formValidate.limitTotal = daysRound * this.formValidate.drawActivityTimerangeList.length
      // },

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
