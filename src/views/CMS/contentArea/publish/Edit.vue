<template>
  <div class="publish-edit">
    <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回上一层</Button>

    <ModalAddPhone
      v-if="showAddPhone"
      :showAddPhone.sync="showAddPhone"
      @refreshUserList="refreshUserList"
    ></ModalAddPhone>

    <CouponList
      v-if="showCouponList"
      :showCouponList.sync="showCouponList"
      @seclectedTr-event="selectedCouponItem"
    ></CouponList>

    <ModalTagList
      v-if="showTagList"
      :showTagList.sync="showTagList"
      :tags="tags"
      :tagList="tagList"
      @seclectedTr-event="updateTagList"
    ></ModalTagList>

    <Form
      label-position="right"
      ref="form"
      :model="formData"
      :rules="ruleValidate"
      :label-width="130"
    >
      <Row v-if="action.type=='edit'">
        <Col span="12" style="padding-right:10px">
          <span>发布账号 {{formData.contentAuthor.phoneNumber}}</span>
          <span class="marginLeft20">今日发布：{{formData.contentAuthor.todayPublishNum}}</span>
          <span class="marginLeft20">7日发布：{{formData.contentAuthor.weekPublishNum}}</span>
          <span class="marginLeft20">粉丝：{{formData.contentAuthor.followerNum}}</span>
        </Col>
      </Row>
      <Row v-else>
        <Col span="24" style="padding-right:10px">
          <FormItem label="选择发布账号：" prop="userId" :rules="{ required: true, message: '发布账号不能为空' }">
            <Select
              v-model="formData.userId"
              clearable
              filterable
              style="width:200px;"
              @on-query-change="handleQueryChange"
            >
              <Option
                v-for="item in userList"
                :key="item.id"
                :value="item.userId"
              >{{ item.phoneNumber }}</Option>
            </Select>

            <Button icon="ios-add" type="dashed" size="small" @click="handleAddPhone">添加账号</Button>
            <span class="marginLeft20">今日发布：{{contentAuthor.todayPublishNum}}</span>
            <span class="marginLeft20">7日发布：{{contentAuthor.weekPublishNum}}</span>
            <span class="marginLeft20">粉丝：{{contentAuthor.followerNum}}</span>
          </FormItem>
        </Col>
      </Row>
      <Alert type="warning">视频/图片/GIF(1个视频/1个GIF/15张以内图片) 图片（不大于2M,GIF/JPG/JPEG/PNG）</Alert>
      <!-- :rules="{ required: true, message: '请上传图片类型' }" 
      :rules="{ required: true, validator: validateImages }"-->
      <FormItem label="图片类型：" prop="contentType">
        <RadioGroup v-model="formData.contentType" @on-change="changeContentType">
          <Radio v-for="item in contentTypeList" :label="item.value" :key="item.value">
            <span>{{item.label}}</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        :label-width="10"
        prop="images"
        :rules="{ required: true, validator: validateImages }"
      >
        <UploadImageMultiple
          :defaultList="formData.images"
          @remove="removeImages"
          @updateImages="removeImages"
          @uploadSuccess="imagesUploadSuccess"
        ></UploadImageMultiple>
      </FormItem>

      <FormItem label="轮播类型：" v-if="formData.images.length>1">
        <Select v-model="formData.isAutoplay" style="width:200px;" @on-change="changeContentType">
          <Option
            v-for="item in autoplayOptions"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>

      <Divider />
      <Alert type="warning">选择图片（不大2M,GIF/JPG/JPEG/PNG）</Alert>
      <Row type="flex" justify="start">
        <Col span="8">
          <FormItem label="U社区封面：" prop="smallImg" :rules="{ required: true, message: '请上传图片' }">
            <UploadImage
              :fileUploadType="'smallImg'"
              :defaultList="formData.defaultSmallImgList"
              @remove="removeSmallImg"
              @uploadSuccess="smallImgUploadSuccess"
            ></UploadImage>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="列表封面：" prop="coverImg" :rules="{ required: true, message: '请上传图片' }">
            <UploadImage
              :fileUploadType="'coverImg'"
              :defaultList="formData.defaultCoverImgList"
              @remove="removeCoverImg"
              @uploadSuccess="coverImgUploadSuccess"
            ></UploadImage>
          </FormItem>
        </Col>
      </Row>

      <FormItem label="内容时长：" prop="duration" :rules="{ required: true, message: '请输入内容时长' }">
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.duration"
          placeholder="请输入数字"
          clearable
        />&nbsp;秒
      </FormItem>
      <Divider />
      <!-- <FormItem label="优惠券(非必填)：">
        <Input
          style="width:230px"
          v-model="formData.templateName"
          :placeholder="`点击按钮选择优惠券`"
          disabled
        >
          <Button @click="handleChooseCoupon" slot="append">选择</Button>
        </Input>
      </FormItem>-->

      <FormItem
        label="优惠券(非必填)："
        prop="coupons"
        :rules="{ required: true, validator: validateCoupons }"
      >
        <Button type="primary" icon="md-add-circle" size="small" @click="addCoupons">新增</Button>
      </FormItem>

      <FormItem>
        <div v-for="(item,index) in formData.coupons" :key="item._id" style="margin-top:20px;">
          <Row type="flex">
            <Col style="width:250px;">
              <Input
                style="width:230px;"
                v-model="item.couponName"
                :placeholder="`点击按钮选择优惠券`"
                disabled
              >
                <Button @click="handleChooseCoupon(index)" slot="append">选择</Button>
              </Input>
            </Col>
            <Col span="2">
              <div class="couponSort">
                <!-- v-model="item.sort" @on-change="xxx($event,index)" -->
                <Input
                  style="display:inline-block;width:100px"
                  v-model="item.sort"
                  placeholder="请输入排序"
                  @input.native="changeCouponSort($event,index)"
                />
                <span class="error-msg">{{item.msg}}</span>
              </div>
            </Col>
            <Col span="2">
              <Button type="error" icon="md-trash" size="small" @click="delCoupon(index,item)">删除</Button>
            </Col>
          </Row>
        </div>
      </FormItem>

      <!-- 适用城市 -->

      <FormItem label="适用城市：" prop="citys" :rules="{ required: true, validator: validateCitys }">
        <CompCheckBoxCity
          :citys="citys"
          :cityList="cityList"
          @checked-city-list="getCheckedCityList"
        ></CompCheckBoxCity>
      </FormItem>
      <FormItem label="标题：" prop="title" :rules="{ required: true, message: '请输入标题' }">
        <Tooltip trigger="focus" title="提醒" content="最多26个汉字" placement="right">
          <Input
            style="display:inline-block;width:300px"
            v-model="formData.title"
            :maxlength="26"
            placeholder="请输入标题"
            clearable
          />
        </Tooltip>
      </FormItem>

      <FormItem label="类型：" prop="sourceType" :rules="{ required: true, message: '请输入类型' }">
        <Select v-model="formData.sourceType" style="width:120px" clearable>
          <Option v-for="(v,k) in sourceTypeOption" :value="parseInt(k)" :key="k">{{ v }}</Option>
        </Select>
      </FormItem>

      <!-- 描述 describe	内容介绍（文字详情） -->
      <FormItem label="描述：" prop="newDescribe" :rules="{ required: true, message: '请输入描述' }">
        <EditorBar
          v-model="formData.describe"
          :content="formData.describe"
          @on-change="change"
          @on-blur="blur"
        ></EditorBar>
      </FormItem>

      <FormItem label="标签：" prop="tags" :rules="{ required: true, validator: validateTags }">
        <Tag
          v-for="tag in tags"
          :key="tag.id"
          :name="tag.name"
          closable
          @on-close="handleClose(tag)"
        >{{ tag.name }}</Tag>
        <Button icon="ios-add" type="dashed" size="small" @click="handleAdd">添加标签</Button>
      </FormItem>

      <Divider />
      <!-- :rules="{ required: true, validator: validateUbay }" -->
      <FormItem prop="addWatchNum">
        增加观看人数
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.addWatchNum"
          placeholder="请输入数字"
          clearable
        />&nbsp;人
      </FormItem>
      <FormItem prop="addLikeNum">
        增加点赞人数
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.addLikeNum"
          placeholder="请输入数字"
          clearable
        />&nbsp;人
      </FormItem>
      <FormItem prop="addShareNum">
        增加分享人数
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.addShareNum"
          placeholder="请输入数字"
          clearable
        />&nbsp;人
      </FormItem>

      <FormItem prop="scanUbay">
        有效阅读赚
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.scanUbay"
          placeholder="请输入数字"
          clearable
        />&nbsp;U贝
      </FormItem>

      <FormItem prop="likeUbay">
        点赞赚
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.likeUbay"
          placeholder="请输入数字"
          clearable
        />&nbsp;U贝
      </FormItem>

      <FormItem prop="shareUbay">
        分享好友赚
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.shareUbay"
          placeholder="请输入数字"
          clearable
        />&nbsp;U贝
      </FormItem>

      <div style="margin-top:20px;">
        <FormItem label>
          <Button type="primary" :disabled="submitDisabled" @click="handleSubmit('form')">发布</Button>
        </FormItem>
      </div>
    </Form>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
import EditorBar from "@/components/EditorBar";

import CouponList from "./CouponList";

import UploadImageMultiple from "./UploadImageMultiple";
import UploadImage from "./UploadImage";

import ModalAddPhone from "./ModalAddPhone";
import CompCheckBoxCity from "./CompCheckBoxCity";
import ModalTagList from "./ModalTagList";

import testData from "./data";

export default {
  name: "publish-edit",
  inject: ["linkTo", "msgOk", "msgErr"],
  props: {
    action: {
      type: Object,
      default: function() {
        return {
          id: Math.random(),
          compName: "publish-edit",
          type: "list", // list/add/edit
          data: {}
        };
      }
    }
  },
  components: {
    ModalAddPhone,
    CompCheckBoxCity,
    CouponList,
    UploadImageMultiple,
    UploadImage,
    EditorBar,
    ModalTagList
  },
  watch: {
    ["formData.userId"]() {
      const { userId } = this.formData;
      console.log("watch formData.userId:", userId);
      this.findUser("userId", userId);
    }
  },
  data() {
    return {
      showAddPhone: false,
      contentAuthor: {
        //contentAuthor
        userId: "",
        phoneNumber: "",
        todayPublishNum: 0, //今日发布
        weekPublishNum: 0, //7日发布
        followerNum: 0 //粉丝
      },
      userList: [],
      showTagList: false,
      tagList: [],
      selectedTagList: [],
      showCouponList: false,
      submitDisabled: false,
      // isAutoplay   1 -自动  0 -手动
      autoplayOptions: [
        { value: 0, label: "手动轮播" },
        { value: 1, label: "自动轮播" }
      ],
      //contentType 1-Gif  2-图片轮播  3-视频 区分一下 提交的时候什么图片类型
      contentTypeList: [
        { value: 1, label: "Gif" },
        { value: 2, label: "图片轮播" }
        // { value: 3, label: "视频" }
      ],
      // 类型 sourceType 1-官方 2-PGC 3-UGC
      sourceTypeOption: {
        "1": "官方",
        "2": "PGC",
        "3": "UGC"
      },
      ruleValidate: {},
      item: {},

      couponIndex: -1,
      formData: {
        id: "", //内容id
        userId: "", //发布用户id
        contentAuthor: {
          id: "",
          followerNum: "",
          phoneNumber: "",
          todayPublishNum: "",
          userId: "",
          weekPublishNum: ""
        },
        isAutoplay: 0,
        images: [
          /*{imgUrl}*/
        ], //图片
        defaultImagesList: [],
        coverImg: "", //封面图片URL
        defaultCoverImgList: [],
        smallImg: "", //列表封面
        defaultSmallImgList: [],
        duration: "", //内容时常

        title: "", //	内容标题
        describe: "", //内容介绍（文字详情）
        newDescribe: "",

        tags: [], //	标签
        coupons: [], //优惠券（非必填）
        citys: [], //适用城市

        sourceType: "", //内容创建人来源类型：1-官方 2-PGC 3-UGC

        addWatchNum: "", //	观看人数
        addLikeNum: "", //	点赞人数
        addShareNum: "", //	分享人数
        contentType: 1, //	图片类型   1-Gif  2-图片轮播  3-视频
        scanUbay: "", //	  有效阅读赚 U贝
        likeUbay: "", //	点赞赚 U贝
        shareUbay: "" //	分享好友赚 U贝
      },
      images: [], //图片15张 1张gif
      cityList: [], //适用城市
      citys: [], //适用城市
      tags: [], //标签
      coupons: [] //优惠券
    };
  },
  created() {
    this.getTagList();
    this.getCityList();

    if (this.action.type == "add") {
      this.getUserList();
    } else if (this.action.type == "edit") {
      let { id } = this.action.data;
      this.queryDetails(id);
    }
  },
  methods: {
    changeCouponSort(ev, index) {
      this.couponIndex = index;
      let { coupons: arr } = this.formData;
      let coupon = arr[index];

      let { value } = ev.target;

      value = value.replace(/\D/g, "");

      coupon.sort = value;
      coupon.msg = "";

      if (value.length == 0) {
        coupon.msg = "请输入排序";
      } else {
        //验证sort是否重复
        //清空所有错误信息
        arr.forEach(item => {
          item.isRepeat = false;
          item.msg = item.sort === "" ? "请输入排序" : "";
        });

        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (item.sort == "" || item.isRepeat) continue;
          for (let j = i + 1; j < arr.length; j++) {
            if (item.sort == arr[j].sort) {
              item.isRepeat = arr[j].isRepeat = true;
              item.msg = arr[j].msg = `${item.sort}重复了`;
            }
          }
        }
      }
      //修改 couponsFlag 状态
      // 判断是否有小于等于 0 的sort
      let couponsFlag = arr.some(item => {
        return item.sort <= 0;
      });
      this.formData.couponsFlag = !couponsFlag;
      this.formData.coupons = JSON.parse(JSON.stringify(arr));

      console.log("change sort : newCoupon ", JSON.stringify(arr));
    },
    addCoupons() {
      let arr = JSON.parse(JSON.stringify(this.formData.coupons));

      let max = -1;
      if (arr.length == 0) {
        max = 1;
      } else if (arr.length == 1) {
        max = Number(arr[0].sort) + 1;
      } else {
        arr.sort((obj1, obj2) => obj2.sort - obj1.sort);
        max = Number(arr[0].sort) + 1;
      }

      max = max || 1;

      this.formData.coupons.push({
        _id: Math.random(),
        couponId: "",
        couponName: "",
        couponType: 1,
        sort: max,
        msg: ""
      });

      console.log(
        "add this.formData.coupons:",
        JSON.stringify(this.formData.coupons)
      );
    },
    delCoupon(index) {
      console.log("delrules:", index);
      this.formData.coupons.splice(index, 1);
    },
    changeContentType(type) {
      console.log(type);
    },
    async queryDetails(id) {
      //查询内容详情
      const url = "/content/queryDetails";
      const { code, msg, data } = await postRequest(url, { id });
      if (code == 200) {
        // data:[{id,name,sort}]
        this.formData = data;
        // const { sourceType, tags = [], citys = [], coupons = [] } = data;
        let {
          isAutoplay,
          images,
          smallImg,
          coverImg,
          sourceType,
          tags,
          citys,
          coupons,
          describe,
          contentAuthor
        } = data;
        isAutoplay = +isAutoplay; //bollean --> number
        images = images || [];
        tags = tags || [];
        citys = citys || [];
        coupons = coupons || [];

        this.citys = citys;
        this.tags = tags;

        // this.contentAuthor = contentAuthor;

        this.formData.isAutoplay = isAutoplay;
        this.formData.newDescribe = describe;

        let imagesFlag = true;
        // images 图片
        this.formData.images = images.map(item => {
          item._id = Math.random();
          item.msg = "";
          if (item.sort === undefined) {
            item.sort = -1;
            item.msg = "请输入排序";
            imagesFlag = false;
          }
          return item;
        });

        console.log("defaultList images ", imagesFlag, this.formData.images);

        // 有非法数据 不允许提交
        this.formData.imagesFlag = imagesFlag;

        let defaultSmallImgList = [];
        if (smallImg) {
          defaultSmallImgList = [{ imgUrl: smallImg }];
        }
        let defaultCoverImgList = [];
        if (coverImg) {
          defaultCoverImgList = [{ imgUrl: coverImg }];
        }

        this.formData.defaultSmallImgList = defaultSmallImgList;
        this.formData.defaultCoverImgList = defaultCoverImgList;

        let couponsFlag = true;
        this.formData.coupons = coupons.map(item => {
          item._id = Math.random();
          item.msg = "";
          if (item.sort === undefined) {
            item.sort = -1;
            item.msg = "请输入排序";
            couponsFlag = false;
          }
          return item;
        });
        // 有非法数据 不允许提交
        this.formData.couponsFlag = couponsFlag;

        // this.formData.templateName = couponNames;

        // this.tagList.forEach(tag => {
        //   tag._checked = false;
        //   for (let i = 0; i < tags.length; i++) {
        //     let r = tag.tagId == tags[i].tagId;
        //     if (r) {
        //       tag._checked = true;
        //     }
        //   }
        // });

        // this.formData.tags = this.tagList;
      } else {
        this.msgErr(msg);
      }
    },
    handleQueryChange(phoneNumber) {
      this.findUser("phoneNumber", phoneNumber);
    },
    findUser(name, value) {
      let contentAuthor = {
        userId: "",
        todayPublishNum: 0, //今日发布
        weekPublishNum: 0, //7日发布
        followerNum: 0 //粉丝
      };

      let arr = this.userList.filter(item => {
        return item[name] == value;
      });

      this.contentAuthor = arr.length ? arr[0] : contentAuthor;
    },
    handleAddPhone() {
      this.showAddPhone = true;
    },
    handleAdd() {
      this.showTagList = true;
    },
    handleClose(tag) {
      this.tags = this.tags.filter(({ id }) => id != tag.id);
      // this.tags = this.tags.filter(({ tagId }) => tagId != tag.tagId);
    },
    async getTagList() {
      //标签查询
      const url = "/tag/list";
      const { code, msg, data } = await postRequest(url);
      if (code == 200) {
        // data:[{id,name,sort}]
        this.tagList = data.map(item => {
          item._checked = false;
          return item;
        });
      } else {
        this.msgErr(msg);
      }
    },
    getCheckedCityList(data) {
      this.formData.citys = data;
    },
    async getCityList() {
      //标签查询
      const url = "/system/area/city/list";

      const { code, msg, data } = await postRequest(url);

      if (code == 200) {
        this.cityList = data;
      } else {
        this.msgErr(msg);
      }
    },
    refreshUserList(data) {
      // this.getUserList();
      let r = this.userList.some((item, index) => {
        let r = item.phoneNumber == data.phoneNumber;

        if (r) {
          this.userList.splice(index, 1, data);
        }
        return r;
      });

      if (!r) {
        this.userList.push(data);
      }

      this.formData.userId = "";
      this.$nextTick(_ => {
        this.formData.userId = data.userId;
      });
    },
    async getUserList(phoneNumber = "") {
      //发布用户查询
      const url = "/content/userlist";
      const { code, msg, data } = await postRequest(url, { phoneNumber });
      if (code == 200) {
        // data:[{id,name,sort}]
        this.userList = data;
      } else {
        this.msgErr(msg);
      }
    },

    goback() {
      // this.linkTo("cms");
      this.action.compName = "publish-list";
    },
    removeImages(images) {
      this.formData.images = images;
      console.log("removeImages", images);
    },
    imagesUploadSuccess({ images }) {
      this.formData.images = images;
      console.log("imagesUploadSuccess", images);
    },

    removeCoverImg() {
      this.formData.coverImg = "";
      this.formData.defaultCoverImgList = [];
    },
    removeSmallImg() {
      this.formData.smallImg = "";
      this.formData.defaultSmallImgList = [];
    },
    coverImgUploadSuccess({ imgUrl, coverImgHeight, coverImgWidth }) {
      this.formData.coverImg = imgUrl;
      this.formData.coverImgHeight = coverImgHeight;
      this.formData.coverImgWidth = coverImgWidth;
      this.formData.defaultCoverImgList = [{ imgUrl }];
    },
    smallImgUploadSuccess({ imgUrl, coverImgHeight, coverImgWidth }) {
      console.log(1);
      this.formData.smallImg = imgUrl;
      // this.formData.coverImgHeight = coverImgHeight;
      // this.formData.coverImgWidth = coverImgWidth;
      this.formData.defaultSmallImgList = [{ imgUrl }];
    },
    updateTagList(data) {
      console.log("selectedTagList----", data);
      this.tags = data;
    },
    selectedCouponItem(data) {
      console.log("selectedCouponItem----", data);
      let { couponType, id: couponId, name: couponName } = data;

      let { coupons } = this.formData;

      // 判断是否重复
      let r = coupons.some(item => item.couponId == couponId);
      if (r) {
        return this.msgErr("券已存在，请不要重复添加！");
      }
      // templateId 券模板id templateName 券模板名称

      // this.formData.templateName = couponName;
      // this.formData.coupons = this.coupons = [
      //   { couponId, couponName, couponType }
      // ];
      let coupon = coupons[this.couponIndex];
      let newCoupon = { ...coupon, couponId, couponName, couponType };
      this.formData.coupons.splice(this.couponIndex, 1, newCoupon);

      console.log("coupon:", JSON.stringify(coupon));
      console.log("newCoupon:", JSON.stringify(newCoupon));
    },
    handleChooseCoupon(index) {
      this.couponIndex = index;
      this.showCouponList = true;
    },
    change(val) {
      console.log("change:", val);
      this.formData.newDescribe = val;
    },
    blur(val) {
      console.log("blur:", val);
      this.formData.newDescribe = val;
    },

    handleSubmit(name) {
      // 发布
      const url = "/content/Details";
      console.log(this.formData);

      this.$refs[name].validate(valid => {
        console.log("valid", valid);
        if (!valid) {
          this.msgErr("数据验证失败！");
          return;
        }

        //清洗数据
        let formData = JSON.parse(JSON.stringify(this.formData));

        formData.describe = formData.newDescribe;

        // images 图片
        // formData.images = formData.defaultIconUrlList.map(item => {
        //   item.sort = 9999;
        //   return item;
        // });

        // 标签 this.tags
        formData.tags = this.tags.filter(tag => {
          const { id, name } = tag;
          return { id, name };
        });

        console.log("submit formData:", formData);
        postRequest(url, formData).then(res => {
          if (res.code == 200) {
            this.msgOk("保存成功");
            this.goback();
          } else {
            this.msgErr(res.msg);
          }
        });
      });
    },

    // validateImages(rule, value, callback) {
    //   console.log("validateImages", rule, value);
    //   if (!value.length) {
    //     return callback("请上传图片");
    //   }
    //   if (!this.formData.imagesFlag) {
    //     return callback("请输入大于等于1的排序字段");
    //   }
    //   callback();
    // },
    validateImages(rule, value, callback) {
      console.log("validateImages", rule, value);

      if (!this.formData.images.length) {
        return callback("请上传图片");
      }
      let r = this.formData.images.some(item => {
        return item.sort === "" || item.msg !== "";
      });
      if (r) {
        return callback("图片排序设置错误");
      }
      callback();
    },
    validateCoupons(rule, value, callback) {
      console.log("validateCoupons", rule, value);
  
      let arr = this.formData.coupons;

      if (arr.length == 0) {
        return callback();
      }

      //修改 couponsFlag 状态
      // 判断是否有小于等于 0 的sort
      let couponsFlag = arr.some(item => {
        return item.sort <= 0;
      });

      if (!couponsFlag) {
        return callback("请输入大于等于1的排序字段");
      }

      let r = arr.some(item => {
        return item.couponName === "" || item.sort === "" || item.msg !== "";
      });
      if (r) {
        return callback("添加优惠券错误，请选择优惠券或填入正确的排序字段");
      }

      callback();
    },
    validateCitys(rule, value, callback) {
      console.log("validateCitys", rule, value);
      if (!this.formData.citys.length) {
        return callback("请选择适用城市");
      }
      callback();
    },
    validateTags(rule, value, callback) {
      console.log("validateTags", rule, value);
      if (!this.tags.length) {
        return callback("请选择标签");
      }
      callback();
    },
    validateEmpty(msg) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        callback();
      };
    }
  }
};
</script>
<style lang="less" scoped>
.marginLeft20 {
  margin-left: 20px;
}

.publish-edit {
  .couponSort {
    position: relative;
    .error-msg {
      position: absolute;
      left: 0;
      top: 26px;
      color: red;
    }
  }
}
</style>

