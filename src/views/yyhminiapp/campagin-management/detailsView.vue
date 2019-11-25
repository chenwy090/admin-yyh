<template>
  <div>
    <Tabs value="name1" :animated="false">
      <!-- 基础设置 -->
      <TabPane label="基础设置" name="name1">
        <div style="overflow: hidden;">
          <div style="float:left; width:100%">
            <Alert show-icon v-if="campId">
              活动ID :
              <span style="color:red">{{campId}}</span>
              <span slot="desc"></span>
            </Alert>

            <Form :model="edit_info" ref="edit_info" :label-width="100">
              <Row>
                <Col span="12">
                  <FormItem label="appid">
                    <Select
                      v-model="edit_info.appid"
                      style="width:300px"
                      placeholder="请输入选择appid"
                      disabled
                    >
                      <Option
                        v-for="item in appId_info"
                        :value="item.appid"
                        :key="item.appid"
                      >{{ item.appName }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="活动类型">
                    <Select v-model="edit_info.campType" style="width:300px" disabled>
                      <Option value="57">领优惠</Option>
                      <Option value="62">要优惠</Option>
                      <Option value="63">领优惠分享奖励</Option>
                      <Option value="64">要优惠参与奖励（接受分享/参团）</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <FormItem label="优惠券类型">
                    <Select
                      v-model="edit_info.couponType"
                      style="width:300px"
                      placeholder="请输入选择优惠券类型"
                      disabled
                    >
                      <Option value="1">换购券</Option>
                      <Option value="2">商品券</Option>
                      <Option value="3">折扣券</Option>
                      <Option value="4">全场券</Option>
                      <Option value="5">赠品券</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="活动标题">
                    <Input
                      type="text"
                      v-model="edit_info.name"
                      style="width:300px"
                      placeholder="请输入活动标题"
                      disabled
                    />
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <FormItem label="优惠面额描述" v-if="edit_info.campType==57">
                    <Input
                      type="textarea"
                      v-model="edit_info.couponValueDesc"
                      style="width:300px"
                      :autosize="{minRows: 4,maxRows: 8}"
                      placeholder="请输入优惠面额描述"
                      disabled
                    />
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="使用门槛描述">
                    <Input
                      type="textarea"
                      v-model="edit_info.doorsillDesc"
                      style="width:300px"
                      :autosize="{minRows: 4,maxRows: 8}"
                      placeholder="请填写使用门槛描述"
                      disabled
                    />
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <FormItem label="活动时间类型">
                    <Select
                      v-model="edit_info.dateType"
                      style="width:300px"
                      placeholder="请选择活动时间类型"
                      disabled
                    >
                      <Option value="1">固定日期时间范围有效</Option>
                      <Option value="2">相对兑换有效期</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="状态" placeholder="请选择状态">
                    <Select v-model="edit_info.status" style="width:300px" disabled>
                      <Option value="0">创建</Option>
                      <Option value="1">上架</Option>
                      <Option value="-1">下架</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>

              <Row v-if="edit_info.dateType =='1'">
                <Col span="12">
                  <FormItem label="开始日期">
                    <DatePicker
                      type="date"
                      v-model="edit_info.startDate"
                      placeholder="选择日期"
                      style="width: 300px"
                      disabled
                    ></DatePicker>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="结束日期">
                    <DatePicker
                      type="date"
                      placeholder="选择日期"
                      style="width:300px"
                      v-model="edit_info.endDate"
                      disabled
                    ></DatePicker>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <FormItem label="优惠券缩略图">
                    <img
                      :src="edit_info.couponImg"
                      style=" float: left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                    />
                  </FormItem>
                </Col>
                <Col span="12">
                  <Tooltip content="点击可查看大图 " placement="right">
                    <FormItem label="优惠券详情图">
                      <img
                        :src="edit_info.imgUrl"
                        @click="showBigImg(edit_info.imgUrl)"
                        style=" float: left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                      />
                    </FormItem>
                  </Tooltip>
                </Col>
              </Row>

              <FormItem label="优惠券模板">
                <Alert>
                  <Row>
                    <Col span="12">模版ID：{{edit_info.ticketTemplateId}}</Col>
                    <Col span="12">模版名称：{{edit_info.ticketName}}</Col>
                  </Row>

                  <Row v-if=" edit_info.ChangeDateType ===0">
                    <Col span="12">兑换开始时间：{{edit_info.ChangeStartDate}}</Col>
                    <Col span="12">兑换结束时间：{{edit_info.ChangeEndDate}}</Col>
                  </Row>

                  <Row v-if=" edit_info.ChangeDateType ===1">
                    <Col span="12">发券后+{{edit_info.ChangeStart}}天开始兑换</Col>
                    <Col span="12">发券后+{{edit_info.ChangeEnd}}天结束兑换</Col>
                  </Row>
                </Alert>
              </FormItem>

              <FormItem label="活动/领券规则">
                <Input
                  type="textarea"
                  v-model="edit_info.rules"
                  style="width:500px"
                  :autosize="{minRows: 4,maxRows: 8}"
                  placeholder="请填写活动/领券规则"
                  disabled
                />
              </FormItem>

              <FormItem label="领券规则">
                <Input
                  type="textarea"
                  v-model="edit_info.useDesc"
                  style="width:500px"
                  :autosize="{minRows: 4,maxRows: 8}"
                  disabled
                />
              </FormItem>

              <FormItem label="图文详情">
                <EditorBar
                  v-model="edit_info.discountDetail"
                  :content="edit_info.discountDetail"
                  :disabled="1"
                  style="width:400px;margin:0;"
                ></EditorBar>
              </FormItem>
            </Form>
          </div>
        </div>
      </TabPane>
      <!-- 基础设置 -->
      <!-- 规则设置 -->
      <TabPane label="规则设置" name="name2">
        <div style="overflow: hidden;">
          <div style="float:left; width:100%">
            <Alert show-icon>
              活动ID :
              <span style="color:red">{{campId}}</span>

              <span style="margin-left: 10%">
                设置总天数 :
                <span style="color:red">{{daySum}}</span>
              </span>
              <span slot="desc"></span>
            </Alert>
            <Form :model="edit_info1" ref="edit_info1" :label-width="160">
              <Row>
                <Col span="12">
                  <FormItem label="每人限领总数">
                    <InputNumber
                      :min="0"
                      type="text"
                      v-model="edit_info1.totalGetLimit"
                      placeholder="请输入"
                      style="width:200px"
                      disabled
                    ></InputNumber>
                    <span style="color:red">&nbsp;&nbsp;张</span>
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="投放渠道">
                    <Select v-model="edit_info1.sendChannel" style="width:200px" disabled>
                      <Option
                        v-for="item in res_list"
                        :value="item.dictValue"
                        :key="item.id"
                      >{{ item.dictLabel }}</Option>

                      <!-- <Option value="1"> 领优惠列表</Option>
                  <Option value="2">拉新奖励</Option>
                       <Option value="3"> 签到奖励</Option>
                  <Option value="4">领优惠分享领用奖励</Option>
                       <Option value="5"> 要优惠领优惠领券抽奖奖励</Option>
                      <Option value="6">新人奖励</Option>-->
                    </Select>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <FormItem label="邀请人数" v-if="edit_info1.sendChannel ==1">
                    <InputNumber
                      :min="0"
                      type="text"
                      v-model="edit_info1.shareInvitedCount"
                      placeholder="请输入"
                      style="width:200px"
                      disabled
                    ></InputNumber>
                    <span style="color:red">&nbsp;&nbsp;人</span>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="是否限抢券">
                    <Select v-model="edit_info1.isLimitGrap" style="width:200px" disabled>
                      <Option value="0">否</Option>
                      <Option value="1">是</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <FormItem label="排序">
                    <InputNumber
                      :min="0"
                      type="text"
                      v-model="edit_info1.orderBy"
                      placeholder="请输入"
                      style="width:200px"
                      disabled
                    ></InputNumber>
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="库存数量">
                    <Input
                      type="text"
                      v-model="edit_info1.stockCount"
                      placeholder="请输入"
                      style="width:200px"
                      disabled
                      v-if=" edit_info1.stockCount !=  '999999999'"
                    />
                    <Input
                      type="text"
                      placeholder="无限制"
                      style="width:200px"
                      disabled
                      v-if=" edit_info1.stockCount ==  '999999999'"
                    />
                    <span style="color:red">&nbsp;&nbsp;张</span>
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="默认推荐排除">
                    <Select v-model="edit_info1.isBlack" style="width:200px" disabled>
                      <Option value="0">否</Option>
                      <Option value="1">是</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </Form>

            <!--分享奖励配置-->
            <Form
              ref="shareModal"
              v-if="formShareModal.shareData.length"
              :model="formShareModal"
              :label-width="160"
              style="margin-top:20px"
            >
              <FormItem
                v-for="item in formShareModal.shareData"
                :key="item.id"
                :label="item.name"
                required
              >
                <InputNumber
                  :min="item.name== '倍数'?1:0"
                  :step="1"
                  type="text"
                  v-model="item.value"
                  placeholder="请输入"
                  style="width:320px"
                  disabled
                ></InputNumber>
                <span v-if="item.name!= '倍数'">&nbsp;&nbsp;U贝</span>
                <span v-if="item.name== '倍数'">&nbsp;&nbsp;倍</span>
              </FormItem>
            </Form>
          </div>
        </div>
      </TabPane>
      <!-- 规则设置 -->
      <!-- 整点抢设置 -->
      <TabPane label="整点抢设置" name="name3" v-if="edit_info1.isLimitGrap == 1">
        <div>
          <Alert show-icon>
            活动ID :
            <span style="color:red">{{campId}}</span>

            <span style="margin-left: 10%">
              设置总天数 :
              <span style="color:red">{{daySum}}</span>
            </span>
            <span style="margin-left: 10%">
              库存数量 :
              <span
                style="color:red"
                v-if=" edit_info1.stockCount !=  '999999999'"
              >{{edit_info1.stockCount}}</span>
              <span style="color:red" v-if=" edit_info1.stockCount ==  '999999999'">无限制</span>
            </span>

            <span slot="desc"></span>
          </Alert>

          <Form :label-width="100">
            <Timeline pending>
              <TimelineItem v-for="(item, index) in campaginGrabInfoList" :key="index">
                <Row>
                  <Col span="2">
                    <p class="time">设置{{index+1}}</p>
                  </Col>
                  <Col span="22">
                    <Card>
                      <Row>
                        <Col span="7">
                          <FormItem label="限制数量">
                            <InputNumber
                              v-model="item.limitCnt"
                              placeholder="请输入"
                              style="width:100px"
                              :min="1"
                              disabled
                            ></InputNumber>
                            <span style="color:red">&nbsp;&nbsp; 张</span>
                          </FormItem>
                        </Col>
                        <Col span="8">
                          <FormItem label="整点开始时间">
                            <TimePicker
                              format="HH:mm:ss"
                              placeholder="请选择时间"
                              style="width: 120px"
                              v-model="item.timeStart"
                              :disabled-minutes="[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]"
                              :disabled-seconds="[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]"
                              disabled
                            ></TimePicker>
                          </FormItem>
                        </Col>
                        <Col span="8">
                          <FormItem label="整点结束时间">
                            <TimePicker
                              format="HH:mm:ss"
                              placeholder="请选择时间"
                              style="width: 120px"
                              v-model="item.timeEnd"
                              :disabled-minutes="[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]"
                              :disabled-seconds="[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]"
                              disabled
                            ></TimePicker>
                          </FormItem>
                        </Col>

                        <!-- <Col span="1">
                        <Button
                          type="error"
                          size="small"
                          style=" margin-left:5%;"
                          v-if="campaginGrabInfoList.length>1"
                          @click="handleRemove(index,item)"
                        >删除</Button>
                        </Col>-->
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </TimelineItem>
            </Timeline>

            <!-- <FormItem>
            <Button type="success" @click="handleAdd" icon="md-add">新增</Button>
            </FormItem>-->

            <!-- <FormItem :label-width="220">
            <Button
              type="primary"
              @click="campaginGrabInfoEdit()"
              :loading="campaginGrabInfo_loading"
              style="width:220px; margin-right:30px;"
              :disabled="isCheckDisabled"
            >保存</Button>
            </FormItem>-->
          </Form>
        </div>
      </TabPane>
      <!-- 整点抢设置 -->
    </Tabs>

    <Modal v-model="bigImgDialog" title="查看大图" width="600" @on-cancel="bigImgCancel">
      <img style="width: 100%" :src="big_Image_url" />
    </Modal>
  </div>
</template>

<<script>
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
  } from "@/libs/axios";
import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
import { formatDate } from "@/libs/date";
import EditorBar from "@/components/EditorBar";

export default {
  name: "detailsView",
  components: { EditorBar },
  props: {
      camp_Info: Object
    },
  data() {
    return {
        formShareModal:{
            shareData:[]
        },
       bigImgDialog: false,
      big_Image_url: "",
    // 基础设置---------------------------------------------------------------------------------------------
        receiveRuleSetPage: false,
        edit_info: {
          appid: "",
          campType: "",
          couponType: "",
          couponValueDesc: "",
          dateType: "",
          doorsillDesc: "",
          endDate: "",
          imgUrl: "",
          name: "",
          rules: "",
          startDate: "",
          status: "",
          ticketTemplateId: "",
          useDesc: "",
          ChangeDateType: "",
          ChangeStartDate: "",
          ChangeEndDate: "",
          ChangeStart: "",
          ChangeEnd: "",
        },
        campId: "",
        imgUrl: "",
        url: uploadOperationImage2AliOssURl,
        uploadList: [],
        uploadList1: [],
        camp_pageStatus: "",
        appId_info: [],
        currentChooseID: "",
        currentChooseName: "",
    // 基础设置---------------------------------------------------------------------------------------------

    // 规则设置---------------------------------------------------------------------------------------------
        edit_info1: {
          addRequiredScore: 0,
          freeTimes: 0,
          isLimitGrap: "0",
          isShow: "0",
          label: "",
          shareInvitedAwardAmount: 0,
          shareInvitedCount: 0,
          shareUseRakeBackPercent: 0,
          sort: 0,
          stockCount: "",
          totalGetLimit: 0,
          isBlack:null,
        },
        res_list:[],
          current: 1,
      totalSize: 0, //总条数
      pageNum: 1, //开始条数
      limit: 10, //每页记录数
        // campId: "",
        status: "",
        daySum: "",

        currentid: "", // 点击单选框得到的id（临时）

    // 规则设置---------------------------------------------------------------------------------------------

    // 整点抢设置-------------------------------------------------------------------------------------------
        next_modal: false,
        campaginManagementPage: false,
        campaginGrabInfoList: [
          { campId: "", limitCnt: 1, timeEnd: "", timeStart: "" }
        ],
        campaginGrabInfo_campId: "",
        campaginGrabInfo_delId: [],

    // 整点抢设置-------------------------------------------------------------------------------------------
      };

  },

    created() {
    },
    methods: {

      init() {
        // 基础设置------------------------------------------------------------------
        this.camp_pageStatus = this.getStore("camp_pageStatus");
        this.getAppId();
        this.getCampInfo();
        this.dataProcessing();
        // 基础设置------------------------------------------------------------------

        // 规则设置------------------------------------------------------
        this.campId = this.camp_Info.campId

        this.updateTableList();
             this.getTicketTemplate();
        // 规则设置------------------------------------------------------

        // 整点抢设置----------------------------------------------------------------

        this.getCampaginGrabInfoList();
        // 整点抢设置----------------------------------------------------------------
          this.share(this.campId);
      },
        share(campId){
            this.formShareModal.shareData = [];
            postRequest('/commonConfig/queryConfigByCode',{
                    code:campId
                }
            ).then(res => {
                if (res.code == 200) {
                    if(res.data||res.data.noOverallCommonConfigList){
                        this.formShareModal.shareData = res.data.noOverallCommonConfigList||[];
                        this.formShareModal.shareData.forEach(function(v){
                            v.value = Number(v.value)||0;
                        })
                        this.shareDisplay = true;
                    }else{
                        this.$Message.error('未查询到数据');
                    }
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
      // 基础设置---------------------------------------------------------------------------------------------
      getCampInfo() {
          this.editInfo();
      },

  showBigImg(row) {
      this.bigImgDialog = true;
      this.big_Image_url = row;
    },
  //获取活动标签ID
    getTicketTemplate() {
      const reqParams = {
        dictCode: "send_channel"
      };

      postRequest(
        "/system/sys-dict-data/list?pageNum=" +
          this.pageNum +
          "&pageSize=" +
          this.limit,
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.res_list = res.data.records;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },


      //基础设置
      editInfo() {
        this.edit_info = this.camp_Info;

        this.edit_info.appid = this.camp_Info.appid;
        this.campId = this.camp_Info.campId;

        this.edit_info.name = this.camp_Info.name;
         this.edit_info.rules = this.camp_Info.rules.replace(/\\n/g, "\n");
      this.edit_info.couponValueDesc = this.camp_Info.couponValueDesc.replace(
        /\\n/g,
        "\n"
      );
      this.edit_info.doorsillDesc = this.camp_Info.doorsillDesc.replace(
        /\\n/g,
        "\n"
      );

        this.edit_info.imgUrl = this.camp_Info.imgUrl;
       this.edit_info.couponImg = this.camp_Info.couponImg;
        this.edit_info.campType = "57";

        this.edit_info.couponType =
          this.camp_Info.couponType == 1
            ? "1"
            : this.camp_Info.couponType == 2
            ? "2"
            : this.camp_Info.couponType == 3
            ? "3"
            : this.camp_Info.couponType == 4
            ? "4"
            : "5";

        this.edit_info.status =
          this.camp_Info.status == 0
            ? "0"
            : this.camp_Info.status == 1
            ? "1"
            : "-1";

        // console.log(this.edit_info.status);

        this.edit_info.ticketTemplateId = this.camp_Info.ticketTemplateId;

        this.currentChooseID = this.edit_info.ticketTemplateId;

        this.currentChooseName = this.edit_info.ticketName;

        // this.chooseResArray = this.edit_info.ticketTemplateId;

        this.edit_info.dateType = this.camp_Info.dateType == 1 ? "1" : "2";
        this.edit_info.startDate = this.camp_Info.startDate || "";
        this.edit_info.endDate = this.camp_Info.endDate || "";

        this.edit_info.useDesc = this.camp_Info.useDesc;

    this.edit_info.ChangeDateType = this.camp_Info.ChangeDateType;
    this.edit_info.ChangeStartDate = this.camp_Info.ChangeStartDate;
    this.edit_info.ChangeEndDate = this.camp_Info.ChangeEndDate;
    this.edit_info.ChangeStart = this.camp_Info.ChangeStart;
    this.edit_info.ChangeEnd = this.camp_Info.ChangeEnd;


console.log(this.edit_info.ChangeDateType)

      },
      // 组件传值
      showReceiveRuleSetStatus(e) {
        // if (e.type == 1) {
        //   this.$emit("changeStatus", false);
        // }
        // this.receiveRuleSetPage = e.Return;
      },

      //获取APPid
      getAppId() {
        getRequest("/miniapp/miniapp-info/store").then(res => {
          if (res.code == 200) {
            this.appId_info = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      // 获取天数
      dataProcessing() {
        var old_sDate = formatDate(
          new Date(this.edit_info.startDate),
          "yyyy-MM-dd hh:mm:ss"
        );

        var old_eDate = formatDate(
          new Date(this.edit_info.endDate),
          "yyyy-MM-dd hh:mm:ss"
        );

        var new_sdate = new Date(old_sDate.replace(/-/g, "/"));
        var new_edate = new Date(old_eDate.replace(/-/g, "/"));
        var days = new_edate.getTime() - new_sdate.getTime();
        this.daySum = parseInt(days / (1000 * 60 * 60 * 24));

        // this.setStore("daySum", daySum);
      },


    // 基础设置---------------------------------------------------------------------------------------------

    // 规则设置---------------------------------------------------------------------------------------------
      updateTableList() {
        const reqParams = {
          campId: this.campId
        };

        postRequest(
          "/campaignReceiveRule/queryRule?campId=" + this.campId,
          reqParams
        ).then(res => {
          if (res.isSuccess) {
            // console.log(res.data);
            if (res.data) {
              this.edit_info1 = res.data;
              this.campId = res.data.campId;
              this.edit_info1.isLimitGrap = res.data.isLimitGrap.toString()
              this.edit_info1.sendChannel = res.data.sendChannel.toString()
              this.edit_info1.stockCount= res.data.stockCount.toString()
              this.edit_info1.isBlack = res.data.isBlack.toString()
              this.edit_info1.shareUseRakeBackPercent =
                res.data.shareUseRakeBackPercent * 100;
              this.status = "edit";
              this.currentid = res.data.label;
            } else {
              this.edit_info1 = {
                addRequiredScore: 0,
                freeTimes: 0,
                isLimitGrap: "0",
                isShow: "0",
                label: "",
                shareInvitedAwardAmount: 0,
                shareInvitedCount: 0,
                shareUseRakeBackPercent: 0,
                orderBy: 9999,
                stockCount: "",
                totalGetLimit: 0
              }
              this.status = "add";
            }
          } else {
            this.$Message.error(res.msg);
          }
        });
      },
    // 规则设置---------------------------------------------------------------------------------------------


    // 整点抢设置---------------------------------------------------------------------------------------------

      // 获取整点抢设置列表
      getCampaginGrabInfoList() {
        const reqParams = {
          campId: this.campId
        };

        postRequest(
          "/campaginGrabInfo/selectCampaginGrabInfoByCampId?campId=" +
            this.campId,
          reqParams
        ).then(res => {
          if (res.code == 200) {
            if (res.data.length > 0) {
              this.campaginGrabInfoList = res.data;
            } else {
              this.campaginGrabInfoList = [
                {
                  campId: this.campId,
                  id: "",
                  limitCnt: 1,
                  timeEnd: "",
                  timeStart: ""
                }
              ];
            }
          }
        });
      },
    // 整点抢设置---------------------------------------------------------------------------------------------
    bigImgCancel: function() {
      this.bigImgDialog = false;
    },
    },
    mounted() {
      this.init();
    }
};
</script>

