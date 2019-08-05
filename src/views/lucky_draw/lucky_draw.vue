<template>
  <div>
    <div>
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="活动Id：" :label-width="85">
            <InputNumber
              style="width:100%"
              v-model="searchData.actId"
              placeholder="请输入活动Id"
              clearable
              :max="99999999999999999"
              :min="0"
              @keyup.native="changeNumber"
            />
          </FormItem>
          <span v-if="drop">
            <FormItem label="奖品优惠券活动Id：" :label-width="120">
              <InputNumber
                style="width:100%"
                v-model="searchData.campId"
                placeholder="请输入奖品优惠券活动Id"
                clearable
                :max="99999999999999999"
                :min="0"
                @keyup.native="changeNumber1"
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
            :data="LuckyDrawList"
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
      width="720"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Form ref="formValidate" :model="formValidate" :label-width="120">
        <Row>
          <FormItem label="奖品优惠券活动：" required>
            <Button @click="getCampaginListFn" v-if="this.campaginName == ''">未选择</Button>
            <Button @click="getCampaginListFn" v-else>{{campaginName}}</Button>
          </FormItem>
          <Timeline pending>
            <TimelineItem
              v-for="(item, index) in formValidate.drawActivityTimerangeList"
              :key="index"
              style="padding:0;"
            >
              <Row>
                <Col span="2">
                  <p class="time">时间段{{index+1}}</p>
                </Col>
                <Col span="22">
                  <Card>
                    <FormItem
                      label="中奖位置"
                      required
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="70"
                    >
                      <Tooltip trigger="focus" title="提醒" content="限制数量最小为1" placement="top">
                        <InputNumber
                          v-model="item.prizeSort"
                          placeholder="请输入"
                          style="width:100px"
                          :min="1"
                          :max="99999"
                        ></InputNumber>
                      </Tooltip>
                    </FormItem>
                    <FormItem
                      label="开始时间"
                      required
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="80"
                    >
                      <TimePicker
                        format="HH:mm"
                        placeholder="请选择时间"
                        style="width: 120px"
                        v-model="item.timeStart"
                        :disabled-hours="disabledTimg1"
                        :disabled-minutes="disabledTimg"
                        :disabled-seconds="disabledTimg"
                      ></TimePicker>
                    </FormItem>
                    <FormItem
                      label="结束时间"
                      required
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="80"
                    >
                      <TimePicker
                        format="HH:mm"
                        placeholder="请选择时间"
                        style="width: 120px"
                        v-model="item.timeEnd"
                        :disabled-hours="disabledTimg2"
                        :disabled-minutes="disabledTimg"
                        :disabled-seconds="disabledTimg"
                      ></TimePicker>
                    </FormItem>
                    <!-- <div>
                      <span
                        style="margin-left:148px;color:red"
                      >结束时间只能大于开始时间一小时，比如10:00—11:00,11:00—12:00</span>
                    </div>-->
                    <Button
                      type="error"
                      size="small"
                      style=" margin-left:5%;"
                      v-if="formValidate.drawActivityTimerangeList.length>1"
                      @click="handleRemove(index,item)"
                    >删除</Button>
                  </Card>
                </Col>
              </Row>
            </TimelineItem>
          </Timeline>
          <Button type="success" @click="handleAdd" icon="md-add" style="margin: 0 0 10px 613px">新增</Button>
          <Form-item label="开始时间：" required>
            <DatePicker
              type="date"
              placeholder="选择开始日期"
              style="width: 100%"
              @on-change="time1"
              format="yyyy-MM-dd"
              :value="formValidate.startDate"
              @on-clear="clearTime1"
            ></DatePicker>
          </Form-item>

          <Form-item label="结束时间：" required>
            <DatePicker
              type="date"
              placeholder="选择结束日期"
              style="width: 100%"
              @on-change="time2"
              format="yyyy-MM-dd"
              :value="formValidate.endDate"
              @on-clear="clearTime2"
            ></DatePicker>
          </Form-item>

          <FormItem label="活动限制总量：" required>
            <InputNumber
              v-model="formValidate.limitTotal"
              placeholder="请输入活动限制总量"
              style="width: 100%"
              disabled
            />
          </FormItem>

          <FormItem label="备注：">
            <Input v-model="formValidate.remark" placeholder="请输入备注" clearable/>
          </FormItem>

          <FormItem label="上传门店列表：" required>
            <Upload
              action="//jsonplaceholder.typicode.com/posts/"
              :before-upload="handleUpload"
              style="display:inline-block"
            >
              <Button icon="ios-cloud-upload-outline">请上传门店Excel文件</Button>
            </Upload>
            <Button
              icon="ios-cloud-download-outline"
              style="display:inline-block;margin-left:15px"
              v-if="add_edit != 1"
              @click="downloadStore"
            >导出该活动的门店</Button>
            <span style="color:#ffd77a;margin-left:15px" v-if="add_edit == 1">上传文件后才能保存</span>
          </FormItem>
        </Row>
        <Row style="margin-left:575px">
          <Button type="text" @click="cancel">取消</Button>
          <Button
            type="primary"
            @click="addLuckyDrawFn()"
            :disabled="isCheckDisabled"
            v-if="add_edit == 1"
          >保存</Button>
          <Button type="primary" @click="addLuckyDrawFn()" v-else>保存</Button>
        </Row>
      </Form>
    </Modal>
    <!-- 新增抽奖活动 -->
    <!-- 查看详情 -->
    <Modal
      v-model="checkDetailsDisplay"
      title="查看详情"
      width="720"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Form ref="checkDetailsData" :model="checkDetailsData" :label-width="120">
        <Row>
          <FormItem label="奖品优惠券活动：">
            <Button disabled>{{checkDetailsData.campName}}</Button>
          </FormItem>
          <Timeline pending>
            <TimelineItem
              v-for="(item, index) in checkDetailsData.drawActivityTimerangeList"
              :key="index"
              style="padding:0;"
            >
              <Row>
                <Col span="2">
                  <p class="time">时间段{{index+1}}</p>
                </Col>
                <Col span="22">
                  <Card>
                    <FormItem
                      label="中奖位置"
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="70"
                    >
                      <Tooltip trigger="focus" title="提醒" content="限制数量最小为1" placement="top">
                        <InputNumber
                          v-model="item.prizeSort"
                          placeholder="请输入"
                          style="width:100px"
                          :min="1"
                          disabled
                        ></InputNumber>
                      </Tooltip>
                    </FormItem>
                    <FormItem
                      label="开始时间"
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="80"
                    >
                      <TimePicker
                        format="HH:mm"
                        placeholder="请选择时间"
                        style="width: 120px"
                        v-model="item.timeStart"
                        :disabled-hours="disabledTimg1"
                        :disabled-minutes="disabledTimg"
                        :disabled-seconds="disabledTimg"
                        disabled
                      ></TimePicker>
                    </FormItem>
                    <FormItem
                      label="结束时间"
                      style="display: inline-block;margin-bottom: 5px;"
                      :label-width="80"
                    >
                      <TimePicker
                        format="HH:mm"
                        placeholder="请选择时间"
                        style="width: 120px"
                        v-model="item.timeEnd"
                        :disabled-hours="disabledTimg2"
                        :disabled-minutes="disabledTimg"
                        :disabled-seconds="disabledTimg"
                        disabled
                      ></TimePicker>
                    </FormItem>
                  </Card>
                </Col>
              </Row>
            </TimelineItem>
          </Timeline>
          <Form-item label="开始时间：">
            <DatePicker
              type="date"
              placeholder="选择开始日期"
              style="width: 100%"
              format="yyyy-MM-dd"
              :value="checkDetailsData.startDate"
              disabled
            ></DatePicker>
          </Form-item>

          <Form-item label="结束时间：">
            <DatePicker
              type="date"
              placeholder="选择结束日期"
              style="width: 100%"
              format="yyyy-MM-dd"
              :value="checkDetailsData.endDate"
              disabled
            ></DatePicker>
          </Form-item>

          <FormItem label="活动限制总量：">
            <InputNumber
              v-model="checkDetailsData.limitTotal"
              placeholder="请输入活动限制总量"
              style="width: 100%"
              disabled
            />
          </FormItem>

          <FormItem label="备注：">
            <Input v-model="checkDetailsData.remark" placeholder="请输入备注" disabled/>
          </FormItem>
        </Row>
        <Row style="margin-left:632px">
          <Button @click="checkDetailsDisplay = false">关闭</Button>
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
import { getLuckyDrawList, getCampaginList, addLuckyDraw, geiActivity, editLuckyDraw, delLuckyDraw } from '@/api/sys'
// import { uploadFile } from '@/libs/axios'
import { uploadOperationImage2AliOssURl } from "@/api/index";
import { baseUrl } from "@/api/index";
export default {
  name: "lucky_draw",
  // props: {
  //   merchantId: String
  //   },
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
          title: '活动Id',
          align: 'center',
          minWidth: 140,
          key: 'actId',
        },
        {
          title: '奖品优惠券活动名',
          align: 'center',
          minWidth: 160,
          key: 'campName',
        },
        {
          title: '活动开始时间',
          align: 'center',
          minWidth: 140,
          key: 'startDate',
        },
        {
          title: '活动结束时间',
          align: 'center',
          minWidth: 140,
          key: 'endDate',
        },
        {
          title: '活动限制总量',
          align: 'center',
          minWidth: 140,
          key: 'limitTotal',
        },
        {
          title: '创建人',
          align: 'center',
          minWidth: 140,
          key: 'createBy',
        },
        {
          title: '创建时间',
          align: 'center',
          minWidth: 140,
          key: 'createTime',
        },
        {
          title: '修改人',
          align: 'center',
          minWidth: 140,
          key: 'updateBy',
        },
        {
          title: '修改时间',
          align: 'center',
          minWidth: 140,
          key: 'updateTime',
        },
        // {
        //   title: '所属商户',
        //   align: 'center',
        //   minWidth: 120,
        //   key: 'merchantId',
        //   render: (h, params) => {
        //     for (let i = 0; i < this.merchantList.length; i++) {
        //       if(params.row.merchantId == this.merchantList[i].merchantId) {
        //         return h('span', this.merchantList[i].name);
        //       }else{
        //         return h('span', params.row.merchantId);
        //       }
        //     }
        //   }
        // },
      ], 
      // 优惠活动列表
      columns4:[
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '优惠活动名称',
          align: 'center',
          minWidth: 140,
          key: 'name',
        },
      ],
      LuckyDrawList: [], //抽奖活动列表数据
      CampaginList: [], //优惠活动列表数据
      campaginName:'', // 优惠活动名称
      //campaginCampId:'', // 选中的优惠活动Id
      searchData: { // 查询参数
        actId: null,
        campId: null,
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
        // actId: "",
        campId: "",
        // delIds: [],
        drawActivityTimerangeList: [
          {
            prizeSort: 1,
            timeEnd: "",
            timeStart: ""
          }
        ],
        endDate: "",
        limitTotal: null,
        remark: "",
        startDate: ""
      },
      file: null, // 上传门店列表
      editActId:'', // 编辑时actid
      //失效的分秒时间
      disabledTimg:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59],
      //开始失效的小时
      disabledTimg1:[0,1,2,3,4,5,6,7,8,9,21,22,23],
      //结束失效的小时
      disabledTimg2:[0,1,2,3,4,5,6,7,8,9,10,22,23],
      // 上传二维码图片
      uploadList1:[],
      url: uploadOperationImage2AliOssURl,
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
    'formValidate.drawActivityTimerangeList.length': function(newVal){
        if(newVal && this.formValidate.endDate != '') {
          this.computationTime()
        }
    },
    'formValidate.startDate': function(newVal){
        if(newVal && this.formValidate.endDate != '') {
          this.computationTime()
        }
    },
    'formValidate.endDate': function(newVal){
        if(newVal) {
          if(this.formValidate.startDate == '') {
            this.msgErr('开始时间未选择,请重新选择结束时间')
            return
          }
          let sTime = new Date(this.formValidate.startDate).valueOf()
          let eTime = new Date(this.formValidate.endDate).valueOf()
          let sss = eTime - sTime
          var days = sss / 1000 / 60 / 60 / 24;
          if(days < 0) {
            this.msgErr('结束时间不能小于开始时间,请重新选择结束时间')
            return
          }
          var daysRound = Math.floor(days) + 1;
          this.formValidate.limitTotal = daysRound * this.formValidate.drawActivityTimerangeList.length
        }
    },
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
      this.searchData.actId =  null
      this.searchData.campId =  null
      this.pagingType = '1'
      this.search()
    },

// 查询列表
    getStaffListFn(obj) {
      this.TableLoading = true
      getLuckyDrawList(obj,this.current).then(res => {
        if(res.code == 200){
          // console.log(res);
          this.LuckyDrawList = res.data.records
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
      this.modalTitle = '新增抽奖活动'
      this.addStaffDisplay = true
    },

// 编辑按钮
    editStaff(row) {
      geiActivity(row.actId).then(res => {
        // console.log(res);
        if(res.code == 200) {
          this.formValidate = res.data
          this.formValidate.delIds = []
          this.campaginName = res.data.campName
          this.editActId = res.data.actId
          this.add_edit = 2
          this.modalTitle = '编辑抽奖活动'
          this.addStaffDisplay = true
        }else {
          this.msgErr(res.msg)
        }
      })
    },

// 查看详情
    checkDetails(row) {
      geiActivity(row.actId).then(res => {
        // console.log(res);
        if(res.code == 200) {
          this.checkDetailsData = res.data
          this.checkDetailsDisplay = true
        }else {
          this.msgErr(res.msg)
        }
      })
    },

// 选择优惠活动对话框
    getCampaginListFn() {
      getCampaginList().then(res=> {
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
      this.formValidate.campId = currentRow.campId
      this.campaginName = currentRow.name
      this.msgOk('选择成功')
    },

// 关闭优惠活动
    closeCampaginDisplay(){
      // console.log(123);
      // console.log(this.formValidate.campId);
      if(this.formValidate.campId == '') {
        this.msgErr('还未选择优惠活动')
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
        this.formValidate.drawActivityTimerangeList.push({
          prizeSort: 1,
          timeEnd: "",
          timeStart: ""
        });
      // }
      // this.statusCheckChange();
    },

// 删除时间时间段
    handleRemove(index, item) {
      this.formValidate.drawActivityTimerangeList.splice(index, 1);
      if (item.id) {
        this.formValidate.delIds.push(item.id);
        // console.log(this.formValidate.delIds);
      }
      // this.statusCheckChange();
    },

// 上传门店列表
    handleUpload (file) {
      this.file = file;
      this.isCheckDisabled = false;
      // console.log(this.file);
      return false;
    },

// 导出门店
    downloadStore() {
      // console.log(this.formValidate.actId);
      // return
      window.location.href =baseUrl+
        `/draw/activity/download?` +
        "actId=" +
        this.formValidate.actId
    },

// 保存
    addLuckyDrawFn() {
      // 验证
      if (!this.ruleValidate()) {
        return;
      }

      // console.log(this.formValidate);
      // return

      if(this.formValidate.delIds) {
        this.formValidate.delIds = this.formValidate.delIds.join()
      }

      // console.log(this.formValidate);
      // return

      let formData = new FormData();
      formData.append('requestData', JSON.stringify(this.formValidate));
      formData.append('file', this.file);
      
      if(this.add_edit == 1) {
        addLuckyDraw(formData).then(res => {
          if(res.code == 200){
            this.msgOk('新增成功')
            this.getStaffListFn({})
            this.cancel()
          }else {
            this.msgErr(res.msg)
          }
        })
      }else if(this.add_edit == 2) {
        editLuckyDraw(formData,this.editActId).then(res => {
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
          content: '<p>确认删除当前抽奖活动吗？</p>',
          onOk: () => {
            delLuckyDraw(row.actId).then(res => {
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
      this.formValidate.campId = ""
      if(this.formValidate.delIds){
        this.formValidate.delIds = []
      }
      this.formValidate.drawActivityTimerangeList = [
        {
          prizeSort : 1,
          timeEnd : "",
          timeStart : "",
        }
      ],
      this.formValidate.endDate = ""
      this.formValidate.limitTotal = null
      this.formValidate.remark = ""
      this.formValidate.startDate = ""
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

// 上传文件后启用保存按钮
    // statusCheckChange() {
      
    // },

//过滤小数点
      changeNumber() {
        let str = "" + this.searchData.actId;
        if (str.indexOf(".") != -1) {
          let arr = str.split("");
          arr.splice(arr.length - 1);
          let str2 = arr.join("");
          this.searchData.actId = +str2;
          this.msgErr('不能输入小数点')
        }
      },
      changeNumber1() {
        let str = "" + this.searchData.campId;
        if (str.indexOf(".") != -1) {
          let arr = str.split("");
          arr.splice(arr.length - 1);
          let str2 = arr.join("");
          this.searchData.campId = +str2;
          this.msgErr('不能输入小数点')
        }
      },
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
        if( this.formValidate.campId == ''){
          this.msgErr('奖品优惠券活动还未选择')
          return
        }
        
        for (var i = 0; i < this.formValidate.drawActivityTimerangeList.length; i++) {
          var resultIndex = i + 1;
          if (this.formValidate.drawActivityTimerangeList[i].prizeSort === "") {
            this.msgErr("时间段" + resultIndex + "条限制数量不能为空！");
            return;
          }

          let str = this.formValidate.drawActivityTimerangeList[i].prizeSort + ""

          if(str.indexOf('.') != -1) {
            this.msgErr("时间段" + resultIndex + "条的中奖位置不能有小数点！");
            return
          }

          if (this.formValidate.drawActivityTimerangeList[i].timeStart === "") {
            this.msgErr("时间段" + resultIndex + "条开始时间不能为空！");
            return;
          }
          if (this.formValidate.drawActivityTimerangeList[i].timeEnd === "") {
            this.msgErr("时间段" + resultIndex + "条结束时间不能为空！");
            return;
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

          if (
            this.formValidate.drawActivityTimerangeList[i].timeStart >
            this.formValidate.drawActivityTimerangeList[i].timeEnd
          ) {
            this.msgErr(
              "时间段" + resultIndex + "开始时间不能大于结束时间"
            );
            return;
          }

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

        if( this.formValidate.startDate == ''){
          this.msgErr('开始时间还未选择')
          return
        }
        if( this.formValidate.endDate == ''){
          this.msgErr('结束时间还未选择')
          return
        }
        return true
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
        if(this.formValidate.startDate == ''){
          this.msgErr('开始时间未选择')
          return
        }
        if (e) {
          let time = e.slice(0, 10) + " " + "23:59:59";
          this.formValidate.endDate = time;
        }
      },
      clearTime2() {
        this.formValidate.endDate = "";
      },

      computationTime() {
        let sTime = new Date(this.formValidate.startDate).valueOf()
        let eTime = new Date(this.formValidate.endDate).valueOf()
        let sss = eTime - sTime
        var days = sss / 1000 / 60 / 60 / 24;
        var daysRound = Math.floor(days) + 1;
        this.formValidate.limitTotal = daysRound * this.formValidate.drawActivityTimerangeList.length
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
