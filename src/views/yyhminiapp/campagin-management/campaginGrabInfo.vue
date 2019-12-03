
<template>
  <!-- 领优惠---基础设置 -->
  <div class="search">
    <div v-if="!campaginManagementPage">
      <div
        style="width: 100%;background: #fff;box-shadow:0 6px 6px -4px rgba(0,0,0,.2);z-index: 1;position:fixed; padding:14px"
      >
        <Steps :current="2">
          <Step title="基础设置" content="已经完成"></Step>
          <Step title="规则设置" content="已经完成"></Step>
          <Step title="整点抢设置" content="进行中"></Step>
        </Steps>
      </div>
      <div style="padding-top: 80px">
        <Card>
          <p slot="title">领优惠---整点抢设置</p>

          <a href="#" slot="extra">
            <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回上一层</Button>
          </a>

          <Alert show-icon>
            <span style="margin-left: 1%">
              活动ID :
              <span style="color:red">{{campId}}</span>
            </span>
            <span style="margin-left: 20%">
              设置总天数 :
              <span style="color:red">{{daySum}}</span>
            </span>
            <span style="margin-left: 20%">
              库存数量 :
              <span style="color:red" v-if=" stockCount !=  '999999999'">{{stockCount}}</span>
              <span style="color:red" v-if=" stockCount ==  '999999999'">无限制</span>
            </span>
            <br />
            <span style="line-height: 2">
              <span style="color:red">注意：每个设置的限制数量，必须乘于设置总天数，并且小于库存数量</span>
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
                          <FormItem label="限制数量" required>
                            <Tooltip trigger="focus" title="提醒" content="限制数量最小为1" placement="top">
                              <InputNumber
                                v-model="item.limitCnt"
                                placeholder="请输入"
                                style="width:100px"
                                :min="1"
                                @on-change="statusCheckChange"
                              ></InputNumber>
                              <span style="color:red">&nbsp;&nbsp; 张</span>
                            </Tooltip>
                          </FormItem>
                        </Col>
                        <Col span="8">
                          <FormItem label="整点开始时间" required>
                            <TimePicker
                              format="HH:mm:ss"
                              placeholder="请选择时间"
                              style="width: 120px"
                              v-model="item.timeStart"
                              :steps="[1, 60,60]"
                              @on-change="statusCheckChange"
                            ></TimePicker>
                          </FormItem>
                        </Col>
                        <Col span="8">
                          <FormItem label="整点结束时间" required>
                            <TimePicker
                              format="HH:mm:ss"
                              placeholder="请选择时间"
                              style="width: 120px"
                              v-model="item.timeEnd"
                              :disabled-minutes="[0]"
                              :disabled-seconds="[0]"
                              :steps="[1, 59,59]"
                              @on-change="statusCheckChange"
                            ></TimePicker>
                          </FormItem>
                        </Col>

                        <Col span="1">
                          <Button
                            type="error"
                            size="small"
                            style=" margin-left:5%;"
                            v-if="campaginGrabInfoList.length>1"
                            @click="handleRemove(index,item)"
                          >删除</Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </TimelineItem>
            </Timeline>

            <FormItem>
              <Button type="success" @click="handleAdd" icon="md-add">新增</Button>
            </FormItem>

            <FormItem :label-width="220">
              <Alert
                type="warning"
                show-icon
                v-if="isCheckDisabled == true"
                style="width:220px"
              >修改后才能保存</Alert>
              <Button
                type="primary"
                @click="campaginGrabInfoEdit()"
                :loading="campaginGrabInfo_loading"
                style="width:220px; margin-right:30px;"
                :disabled="isCheckDisabled"
              >保存</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    </div>
    <div v-if="campaginManagementPage">
      <campaginManagement @changeStatus="showcampaginGrabInfo"></campaginManagement>
    </div>

    <Modal v-model="next_modal" width="360" title="设置成功" @on-cancel="closeModal">
      <p>即将跳转领优惠列表...</p>

      <div slot="footer">
        <Button type="success" size="large" long @click="closeModal">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from "@/libs/axios";

import { formatDate } from "@/libs/date";
import campaginManagement from "./campaginManagement";

export default {
  name: "campaginGrabInfo",
  props: {},
  components: {
    campaginManagement
  },

  data() {
    return {
      next_modal: false,
      campaginManagementPage: false,
      campaginGrabInfoList: [
        { campId: "", limitCnt: 1, timeEnd: "", timeStart: "" }
      ],
      campaginGrabInfo_loading: false,
      campaginGrabInfo_campId: "",
      campaginGrabInfo_delId: [],
      campaginGrabInfo_loading: false,
      isCheckDisabled: true,
      daySum: "",
      stockCount: "",
      campId: ""
    };
  },

  created: function() {
    this.init();
  },
  methods: {
    init() {
      this.daySum = this.getStore("daySum");
      this.stockCount = this.getStore("stockCount");
      console.log(this.stockCount);
      this.campId = this.getStore("campId");

      this.getCampaginGrabInfoList();
    },

    //整点抢设置------------------------------------

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

    // 保存整点抢设置
    campaginGrabInfoEdit() {
      if (this.campaginGrabInfoList.length > 15) {
        this.$Message.error("不能超过15个整点抢设置", 3);
        return;
      }
      var maxIntegerNumber = 0;
      for (var i = 0; i < this.campaginGrabInfoList.length; i++) {
        var resultIndex = i + 1;
        if (this.campaginGrabInfoList[i].limitCnt === "") {
          this.$Message.error("设置" + resultIndex + "条限制数量不能为空！");
          return;
        }
        if (this.campaginGrabInfoList[i].timeStart === "") {
          this.$Message.error("设置" + resultIndex + "条开始时间不能为空！");
          return;
        }
        if (this.campaginGrabInfoList[i].timeEnd === "") {
          this.$Message.error("设置" + resultIndex + "条结束时间不能为空！");
          return;
        }

        if (
          this.campaginGrabInfoList[i].timeStart ==
          this.campaginGrabInfoList[i].timeEnd
        ) {
          this.$Message.error(
            "设置" + resultIndex + "开始时间不能等于结束时间"
          );
          return;
        }

        if (
          this.campaginGrabInfoList[i].timeStart >
          this.campaginGrabInfoList[i].timeEnd
        ) {
          this.$Message.error(
            "设置" + resultIndex + "开始时间不能大于结束时间"
          );
          return;
        }

        maxIntegerNumber += this.campaginGrabInfoList[i].limitCnt;
      }

      for (var i = 0; i < this.campaginGrabInfoList.length; i++) {
        if (this.campaginGrabInfoList.length > i + 1) {
          var resultIndex = i + 1;

          if (
            this.campaginGrabInfoList[i + 1].timeStart <=
            this.campaginGrabInfoList[i].timeEnd
          ) {
            this.$Message.error(
              "设置" +
                resultIndex +
                "的结束时间不能大于" +
                "设置" +
                [resultIndex + 1] +
                "的开始时间"
            );
            return;
          }
        }
      }
      if (this.stockCount != "999999999") {
        if (maxIntegerNumber * this.daySum > this.stockCount) {
          this.$Message.error("库存数量不足(请在规则设置修改库存数量)");
          return;
        }
      }

      var reqParams = {
        daySum: this.daySum,
        campId: this.campId,
        delIds: this.campaginGrabInfo_delId.join(),
        campaginGrabInfoParamVOList: this.campaginGrabInfoList
      };

      postRequest("/campaginGrabInfo/edit", reqParams).then(res => {
        if (res.code == 200) {
          // this.$Message.info("整点抢设置保存成功！");
          this.isCheckDisabled = true;
          this.next_modal = true;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    // 添加整点抢设置
    handleAdd() {
      if (this.campaginGrabInfoList.length >= 15) {
        this.$Message.error("不能超过15个整点抢设置");
        return;
      } else {
        this.campaginGrabInfoList.push({
          campId: this.campId,
          limitCnt: 1,
          timeEnd: "",
          timeStart: ""
        });
      }
      this.statusCheckChange();
    },

    handleRemove(index, item) {
      this.campaginGrabInfoList.splice(index, 1);
      if (item.id) {
        this.campaginGrabInfo_delId.push(item.id);
      }
      this.statusCheckChange();
    },

    //整点抢设置------------------------------------

    showcampaginGrabInfo(e) {
      this.campaginManagementPage = e;
    },
    // 跳转列表

    closeModal() {
      this.next_modal = false;
      setTimeout(() => {
        this.setStore("campId", "");
        this.setStore("daySum", "");

        this.setStore("stockCount", "");

        // this.campaginManagementPage = true;
        this.$emit("changeStatus", { Return: false, type: 1 });
      }, 1200);
    },

    statusCheckChange() {
      this.isCheckDisabled = false;
    },

    // 跳转列表

    goback() {
      this.$emit("changeStatus", { Return: false, isNext: true });
    }
  },
  mounted() {
    this.init();
  }
};
</script>


<style scoped>
.time {
  font-size: 14px;
  font-weight: bold;
}
.content {
  padding-left: 5px;
}
</style>
