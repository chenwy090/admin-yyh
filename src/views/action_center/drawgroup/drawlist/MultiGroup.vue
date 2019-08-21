<template>
  <div class="multi-group">
    <Form ref="form" :model="form" :rules="formValite" :label-width="120">
      <FormItem label="活动名称：" prop="name" :rules="{ required: true, message: '请输入活动名称' }">
        <Row>
          <Col span="10">
            <Input style="width:90%" v-model="form.name" placeholder="请输入" clearable />
          </Col>
        </Row>
      </FormItem>
      <FormItem label="活动开始时间：" prop="startTime" :rules="{ required: true, message: '请选择活动开始时间' }">
        <Row>
          <Col span="10">
            <DatePicker
              style="width:90%"
              :value="form.startTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              placeholder="请选择活动开始时间"
              :options="m_dateOptions"
              @on-change="startTimeChange"
              class="date-range"
            ></DatePicker>
          </Col>
        </Row>
      </FormItem>
      <!-- //开奖时间配置1：固定时间、2：满多少人开奖 -->
      <FormItem label="活动开奖时间：">
        <RadioGroup v-model="form.openDrawTimeType" @on-change="form.openDrawTime = ''">
          <Radio
            v-for="item in openDrawTimeTypeList"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</Radio>
        </RadioGroup>
      </FormItem>

      <template v-if="form.openDrawTimeType==1">
        <FormItem label prop="openDrawTime" :rules="{ required: true, message: '请选择活动开奖时间' }">
          <Row>
            <Col span="10">
              <DatePicker
                style="width:90%"
                :value="form.openDrawTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="请选择活动开奖时间"
                :options="m_dateOptions"
                @on-change="openDrawTimeChange"
                class="date-range"
              ></DatePicker>
            </Col>
          </Row>
        </FormItem>
      </template>
      <template v-else-if="form.openDrawTimeType==2">
        <FormItem label prop="openDrawTime" :rules="{ required: true, message: '请选择活动开奖时间' }">
          <Row>
            <Col span="10">
              <TimePicker
                style="width:90%"
                :value="form.openDrawTime"
                format="HH:mm"
                placeholder="请选择活动开奖时间"
                @on-change="openDrawTimeChange"
                class="date-range"
              ></TimePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          label="满x人开奖："
          prop="openDrawTimeNeedPlayers"
          :rules="{ required: true, message: '请输入人数' }"
        >
          <Row>
            <Col span="10">
              <Input
                style="width:90%"
                v-model="form.openDrawTimeNeedPlayers"
                placeholder="请输入人数"
                clearable
              />
            </Col>
          </Row>
        </FormItem>
      </template>

      <FormItem label="投放门店：" v-for="(item,index) in form.drawDailyShopList" :key="item.id">
        <storeView
          :id="item.id"
          :index="index"
          v-on:sendProvinceId="sendProvinceId"
          v-on:sendCityId="sendCityId"
          v-on:sendAreaId="sendAreaId"
          v-on:sendShopId="sendShopId"
          @handleRemove-event="handleRemove"
          :shop="item"
        ></storeView>
      </FormItem>
      <FormItem label>
        <Button type="dashed" long @click="handleAdd" icon="md-add" style="width:100px;"></Button>
      </FormItem>

      <!-- 1:实物、2：优惠券、3：U贝 -->
      <FormItem label="活动大奖：">
        <RadioGroup v-model="form.bigPrizeTemp.type">
          <Radio v-for="item in typeList" :key="item.value" :label="item.value">{{ item.label }}</Radio>
        </RadioGroup>
      </FormItem>
      <template v-if="form.bigPrizeTemp.type==1">
        <Row>
          <Col span="8">
            <FormItem label="实物名称：">
              <Input
                style="width:90%"
                v-model="form.bigPrizeTemp.prizeName1"
                placeholder="请输入实物名称"
                :maxlength="15"
                clearable
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="实物个数：">
              <Input
                style="width:90%"
                v-model="form.bigPrizeTemp.prizeNum1"
                placeholder="请输入个数"
                disabled
              />
            </FormItem>
          </Col>
          <Col span="8">
            <UploadImage
              label="实物banner："
              :fileUploadType="'bigPrizeGifImage'"
              :defaultList="form.bigPrizeGifImageList"
              @uploadSuccess="bigPrizeUploadSuccess"
            ></UploadImage>
          </Col>
        </Row>
      </template>
      <template v-else-if="form.bigPrizeTemp.type==2">
        <Row>
          <Col span="10">
            <FormItem
              label="选择优惠券"
              prop="bigPrizeTemp.prizeName2"
              :rules="{ required: true, message: '请选择优惠券' }"
            >
              <Input
                :key="11"
                v-model="form.bigPrizeTemp.prizeName2"
                placeholder="点击按钮选择优惠券"
                disabled
              >
                <Button @click="handleChoose('bigPrize')" slot="append">选择</Button>
              </Input>
            </FormItem>
          </Col>
        </Row>
      </template>
      <template v-else-if="form.bigPrizeTemp.type==3">
        <FormItem
          label="U贝数："
          prop="bigPrizeTemp.prizeNum3"
          :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
        >
          <Row>
            <Col span="10">
              <Input
                :key="111"
                style="width:90%"
                v-model="form.bigPrizeTemp.prizeNum3"
                placeholder="请输入U贝数"
                clearable
              />
            </Col>
          </Row>
        </FormItem>
      </template>
      <FormItem label="阳光普照奖：">
        <RadioGroup v-model="form.normalPrizeTemp.type">
          <Radio v-for="item in typeList" :key="item.value" :label="item.value">{{ item.label }}</Radio>
        </RadioGroup>
      </FormItem>

      <template v-if="form.normalPrizeTemp.type==1">
        <Row>
          <Col span="8">
            <FormItem label="实物名称：">
              <Input
                style="width:90%"
                v-model="form.normalPrizeTemp.prizeName1"
                placeholder="请输入实物名称"
                clearable
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="实物个数：">
              <Input
                style="width:90%"
                v-model="form.normalPrizeTemp.prizeNum1"
                placeholder="请输入个数"
                disabled
              />
            </FormItem>
          </Col>
          <Col span="8">
            <UploadImage
              label="实物banner："
              :fileUploadType="'normalPrizeGifImage'"
              :defaultList="form.normalPrizeGifImageList"
              @uploadSuccess="normalPrizeUploadSuccess"
            ></UploadImage>
          </Col>
        </Row>
      </template>
      <template v-else-if="form.normalPrizeTemp.type==2">
        <Row>
          <Col span="10">
            <FormItem
              label="选择优惠券"
              prop="normalPrizeTemp.prizeName2"
              :rules="{ required: true, message: '请选择优惠券' }"
            >
              <Input
                :key="22"
                v-model="form.normalPrizeTemp.prizeName2"
                placeholder="点击按钮选择优惠券"
                disabled
              >
                <Button @click="handleChoose('normalPrize')" slot="append">选择</Button>
              </Input>
            </FormItem>
          </Col>
        </Row>
      </template>
      <template v-else-if="form.normalPrizeTemp.type==3">
        <FormItem
          label="U贝数："
          prop="normalPrizeTemp.prizeNum3"
          :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
        >
          <Row>
            <Col span="10">
              <Input
                :key="222"
                style="width:90%"
                v-model="form.normalPrizeTemp.prizeNum3"
                placeholder="请输入输入U贝数"
                clearable
              />
            </Col>
          </Row>
        </FormItem>
      </template>

      <FormItem label="领奖说明" prop="winningRemarks" :rules="{ required: false, message: '请输入领奖说明' }">
        <Row>
          <Col span="10">
            <Input style="width:90%" v-model="form.winningRemarks" placeholder="请输入领奖说明" clearable />
          </Col>
        </Row>
      </FormItem>

      <!-- 参与对象［必选，单选］参与对象［必选，单选］ -->
      <FormItem label="参与对象：">
        <RadioGroup v-model="form.joinUserLevel">
          <Radio
            v-for="item in joinUserLevelList"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem
        label="总开团数："
        prop="maxOpenGroupCount"
        :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
      >
        <Row>
          <Col span="10">
            <Input
              style="width:90%"
              v-model="form.maxOpenGroupCount"
              placeholder="请输入总开团数"
              clearable
            />
          </Col>
        </Row>
      </FormItem>

      <FormItem
        label="成团人数："
        prop="groupPlayerCount"
        :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
      >
        <Row>
          <Col span="10">
            <Input
              style="width:90%"
              v-model="form.groupPlayerCount"
              placeholder="请输入成团人数"
              clearable
            />
          </Col>
        </Row>
      </FormItem>

      <FormItem
        label="每人开团次数："
        prop="userOpenGroupCount"
        :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
      >
        <Row>
          <Col span="10">
            <Input
              style="width:90%"
              v-model="form.userOpenGroupCount"
              placeholder="请输入开团次数"
              clearable
            />
          </Col>
        </Row>
      </FormItem>

      <!-- 开团有效分钟数 -->
      <FormItem
        label="开团有效时间："
        prop="openGroupMinutes"
        :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
      >
        <Row>
          <Col span="10">
            <Input
              style="width:80%"
              v-model="form.openGroupMinutes"
              placeholder="请输入开团有效时间"
              clearable
            />分钟
          </Col>
        </Row>
      </FormItem>

      <FormItem
        label="开团消耗U贝："
        prop="openGroupFee"
        :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
      >
        <Row>
          <Col span="10">
            <Input style="width:90%" v-model="form.openGroupFee" placeholder="请输入开团消耗U贝" clearable />
          </Col>
        </Row>
      </FormItem>
      <FormItem
        label="参团次数："
        prop="userJoinGroupCount"
        :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
      >
        <Row>
          <Col span="10">
            <Input
              style="width:90%"
              v-model="form.userJoinGroupCount"
              placeholder="请输入参团次数"
              clearable
            />
          </Col>
        </Row>
      </FormItem>
      <FormItem
        label="参团消耗U贝："
        prop="joinGroupFee"
        :rules="{ required: true, validator: checkIsPositiveIntegerEx0 }"
      >
        <Row>
          <Col span="10">
            <Input style="width:90%" v-model="form.joinGroupFee" placeholder="请输入参团消耗U贝" clearable />
          </Col>
        </Row>
      </FormItem>

      <FormItem label="团失败u贝返还：">
        <RadioGroup v-model="form.isFailureBackFee">
          <!-- isFailureBackFee -->
          <Radio
            v-for="item in failureBackFeeList"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem
        label="抽奖规则："
        prop="drawRuleRemarks"
        :rules="{ required: true, message: '抽奖规则描述不能为空' }"
      >
        <Row>
          <Col span="10">
            <Input v-model="form.drawRuleRemarks" type="textarea" :rows="6" placeholder="抽奖规则" />
          </Col>
        </Row>
      </FormItem>

      <FormItem label="广告主名称：" prop="advertName" :rules="{ required: false, message: '请输入广告主名称' }">
        <Row>
          <Col span="10">
            <Input style="width:90%" v-model="form.advertName" placeholder="请输入广告主名称" clearable />
          </Col>
        </Row>
      </FormItem>

      <FormItem
        label="介绍："
        prop="advertIntro"
        :rules="{ required: false, message: '请输入广告主 描述富文本' }"
      >
        <Row>
          <Col span="10">
            <Input v-model="form.advertIntro" type="textarea" :rows="6" placeholder="请输入广告主 描述富文本" />
          </Col>
        </Row>
      </FormItem>

      <!-- 广告主 banner图片url advertBannerImgUrl   广告主 logo图片url advertLogoImgUrl -->

      <Alert type="warning">选择图片(不大于1M,JPG/PNG/JPEG/BMP）</Alert>
      <Row type="flex" justify="end">
        <Col span="8">
          <!-- <FormItem label="Banner图：">
            <UploadImage :fileUploadType="'banner'" @uploadSuccess="bannerUploadSuccess"></UploadImage>
          </FormItem>-->
          <UploadImage
            label="列表banner："
            :fileUploadType="'drawActive'"
            :defaultList="form.defaultDrawActiveList"
            @uploadSuccess="drawActiveUploadSuccess"
          ></UploadImage>
        </Col>
        <Col span="8">
          <UploadImage
            label="详情Banner："
            :fileUploadType="'banner'"
            :defaultList="form.defaultBannerList"
            @uploadSuccess="bannerUploadSuccess"
          ></UploadImage>
        </Col>
        <Col span="8">
          <UploadImage
            label="Logo："
            :fileUploadType="'logo'"
            :defaultList="form.defaultLogoList"
            @uploadSuccess="logoUploadSuccess"
          ></UploadImage>
        </Col>
      </Row>

      <div style="margin-top:20px;">
        <FormItem label>
          <Button type="primary" @click="handleSubmit('form')">提交</Button>
          <!-- <Button style="margin-left: 8px" @click="handleReset('form')">重置</Button> -->
        </FormItem>
      </div>
    </Form>
    <Modal
      v-model="couponModalShow"
      title="选择优惠券"
      width="650"
      :footer-hide="true"
      :closable="false"
      :mask-closable="false"
      :styles="{top: '20px'}"
    >
      <chooseCouponListView
        v-if="couponModalShow"
        :prizeType="prizeType"
        @seclectedTr-event="selectedTrCallBack"
      ></chooseCouponListView>
    </Modal>
  </div>
</template>
<script>
import multiFormData from "./multiGroupFromData";
import singleFormData from "./multiGroupFromData";
import { postRequest, getRequest } from "@/libs/axios";
import storeView from "./store";
import chooseCouponListView from "./chooseCouponList";
import UploadImage from "./UploadImage";

import comm from "@/mixins/common";

// this.$emit("closeFormModal-event");

export default {
  name: "multi-group",
  components: {
    storeView,
    chooseCouponListView,
    UploadImage
  },
  mixins: [comm],
  mounted() {
    let { drawType, multiFormData, drawData } = this.$store.state;
    if (drawType == "add" || drawType == "add_cache") {
      this.form = JSON.parse(JSON.stringify(multiFormData));
    } else if (drawType == "edit") {
      this.form = JSON.parse(JSON.stringify(drawData));
    }
  },
  data() {
    //验证正整数+正小数+0
    const checkIsPositive = (rule, value, callback) => {
      var reg = /^\d+(?=\.{0,1}\d+$|$)/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于等于0的正数"));
      }
    };

    return {
      defaultList: [
        // {
        //   imgUrl: "https://image.52iuh.cn/wx_mini/ILJAe1kLiF.png"
        // },
        // {
        //   imgUrl: "https://image.52iuh.cn/wx_mini/NlXpxCBPzg.png"
        // }
      ],
      //isFailureBackFee 团失败是否返还费用
      failureBackFeeList: [
        { value: 1, label: "是" },
        { value: 0, label: "否" }
      ],
      // openDrawTimeType 开奖时间配置1：固定时间、2：满多少人开奖
      openDrawTimeTypeList: [
        { value: 1, label: "固定时间" },
        { value: 2, label: "相对时间（满x人开奖）" }
      ],

      // 优惠券类型1：周边券、2：商超券
      couponType: 2,
      couponTypelList: [
        { value: 1, label: "周边券" },
        { value: 2, label: "商超券" }
      ],

      couponId: "", //优惠券ID（单人团参团条件）
      couponName: "", // 优惠券名称

      //   1:实物、2：优惠券、3：U贝
      //   type: 1,
      typeList: [
        { value: 1, label: "实物" },
        { value: 2, label: "优惠券" },
        { value: 3, label: "U贝" }
      ],
      prizeName: "", // 奖项名称
      // 优惠券类型1：周边券、2：商超券
      couponType: 2,
      couponTypelList: [
        { value: 1, label: "周边券" },
        { value: 2, label: "商超券" }
      ],

      prizeReferId: "", //优惠券奖品关联ID
      prizeNum: "", //奖品个数
      giftImg: "", //奖品图片地址

      joinUserLevelList: [
        { value: 1, label: "新人" },
        { value: 2, label: "新客" },
        { value: 3, label: "老客" },
        { value: 4, label: "红人" },
        { value: 5, label: "达人" },
        { value: 0, label: "所有人" }
      ],

      index: 1,
      prizeType: "",
      couponModalShow: false,
      showStore: true,
      form: JSON.parse(JSON.stringify(multiFormData)),
      formValite: {}
    };
  },

  activated() {
    let { drawType, multiFormData, drawData } = this.$store.state;
    if (drawType == "add" || drawType == "add_cache") {
      this.form = JSON.parse(JSON.stringify(multiFormData));
    } else if (drawType == "edit") {
      this.form = JSON.parse(JSON.stringify(drawData));
    }
  },
  deactivated() {
    let { drawType } = this.$store.state;
    if (drawType == "add_cache") {
      this.$store.commit("g_setData", {
        //多人团
        multiFormData: JSON.parse(JSON.stringify(this.form))
      });
    }
  },
  methods: {
    //验证正整数
    checkIsPositiveIntegerEx0(rule, value, callback) {
      var reg = /^([0-9][0-9]*)$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于等于0的正整数"));
      }
    },
    // 大奖和阳光普照奖
    bigPrizeUploadSuccess({ imgUrl }) {
      this.form.bigPrizeTemp.giftImg = imgUrl;
      this.form.bigPrizeGifImageList = [{ imgUrl }];
    },
    normalPrizeUploadSuccess({ imgUrl }) {
      this.form.normalPrizeTemp.giftImg = imgUrl;
      this.form.normalPrizeGifImageList = [{ imgUrl }];
    },
    // 广告主 banner图片url advertBannerImgUrl   广告主 logo图片url advertLogoImgUrl -->
    drawActiveUploadSuccess(data) {
      this.form.drawActiveUrl = data.imgUrl;
    },
    bannerUploadSuccess(data) {
      this.form.advertBannerImgUrl = data.imgUrl;
    },
    logoUploadSuccess(data) {
      this.form.advertLogoImgUrl = data.imgUrl;
    },
    changeComp(name) {
      this.compName = name;
    },

    startTimeChange(time) {
      this.form.startTime = time;
    },
    openDrawTimeChange(time) {
      this.form.openDrawTime = time;
    },
    selectedTrCallBack(data) {
      if (typeof data != "boolean") {
        // prizeType => 多人团 bigPrize normalPrize | singlePrize 单人团
        if (this.prizeType == data.prizeType) {
          if (data.prizeType != "singlePrize") {
            this.form[`${this.prizeType}Temp`].couponType = data.couponType;
            this.form[`${this.prizeType}Temp`].prizeReferId = data.id;
            this.form[`${this.prizeType}Temp`].prizeName2 = data.name;
          }
        }
      }
      this.couponModalShow = false;
    },

    handleChoose(prizeType) {
      this.prizeType = prizeType;
      this.couponModalShow = true;
    },
    handleAdd() {
      this.index++;
      this.form.drawDailyShopList.push({
        id: Math.random(),
        provinceCode: null,
        cityCode: null,
        countryCode: null,
        shopId: null,
        shopName: null,
        index: this.index,
        status: 1
      });
    },
    sendProvinceId(val, id) {
      this.form.drawDailyShopList.some((item, index) => {
        if (item.id == id) {
          this.form.drawDailyShopList[index].provinceCode = val;
          return true;
        }
      });
    },
    sendCityId(val, id) {
      this.form.drawDailyShopList.some((item, index) => {
        if (item.id == id) {
          this.form.drawDailyShopList[index].cityCode = val;
          return true;
        }
      });
    },
    sendAreaId(val, id) {
      this.form.drawDailyShopList.some((item, index) => {
        if (item.id == id) {
          this.form.drawDailyShopList[index].countryCode = val;
          return true;
        }
      });
    },
    sendShopId(val, name, id) {
      this.form.drawDailyShopList.some((item, index) => {
        if (item.id == id) {
          this.form.drawDailyShopList[index].shopId = val;
          this.form.drawDailyShopList[index].shopName = name;
          return true;
        }
      });
    },
    handleRemove(id) {
      if (this.form.drawDailyShopList.length == 1) {
        return this.msgErr("必须保留一条");
      }
      this.form.drawDailyShopList.some((item, index) => {
        if (item.id == id) {
          this.form.drawDailyShopList.splice(index, 1);
          return true;
        }
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let { openDrawTimeType, startTime, openDrawTime } = this.form;
          if (openDrawTimeType == 1) {
            let d1 = new Date(startTime);
            let d2 = new Date(openDrawTime);

            if (d1 >= d2) {
              let msg = "活动开奖时间不能小于等于活动开始时间";
              return this.msgErr(msg);
            }
          }
          //  /drawDaily/activity/add  新增
          const url = "/drawDaily/activity/add";

          //清洗数据
          let formData = JSON.parse(JSON.stringify(this.form));
          formData.bigPrize = this.formatFormData(formData.bigPrizeTemp);
          formData.normalPrize = this.formatFormData(formData.normalPrizeTemp);
          formData.groupType = 2;
          postRequest(url, formData).then(res => {
            if (res.code == 200) {
              this.$emit("closeFormModal-event");
            } else {
              this.$Message.error(res.msg);
            }
          });
        }
      });
    },

    //格式化提交数据
    formatFormData(data) {
      let temp = {
        type: 1,
        prizeName: "", //实物名称 奖项名称  实物：选择后填写实物名称，最多15个汉字
        prizeNum: "", //实物个数 奖品个数
        giftImg: "", //奖品图片地址
        couponType: 2, //优惠券类型1：周边券、2：商超券/ 超市券 优惠券：选择领优惠券和周边券
        prizeReferId: null //优惠券奖品关联ID
      };
      let { type } = data;
      temp.type = type;
      if (type == 1) {
        temp.prizeName = data.prizeName1;
        temp.prizeNum = data.prizeNum1;
        temp.giftImg = data.giftImg;
      } else if (type == 2) {
        temp.couponType = data.couponType;
        temp.prizeReferId = data.prizeReferId;
        temp.prizeName = data.prizeName2;
      } else {
        temp.prizeNum = data.prizeNum3;
      }
      return temp;
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.form.startDate = null;
      this.form.endDate = null;
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3
      });
    }
  }
};
</script>
<style scoped>
</style>