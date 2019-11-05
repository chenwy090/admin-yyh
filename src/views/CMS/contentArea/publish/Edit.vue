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
      <!-- :rules="{ required: true, message: '请上传图片类型' }" -->
      <FormItem
        label="图片类型："
        prop="contentType"
        :rules="{ required: true, validator: validateImages }"
      >
        <RadioGroup v-model="formData.contentType" @on-change="changeContentType">
          <Radio v-for="item in contentTypeList" :label="item.value" :key="item.value">
            <span>{{item.label}}</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem :label-width="10">
        <UploadImageMultiple
          :defaultList="formData.images"
          @remove="removeImages"
          @uploadSuccess="imagesUploadSuccess"
        ></UploadImageMultiple>
      </FormItem>

      <Divider />
      <Alert type="warning">选择图片（不大2M,GIF/JPG/JPEG/PNG）</Alert>
      <Row type="flex" justify="start">
        <Col span="8">
          <FormItem label="U社区封面：" prop="coverImg" :rules="{ required: true, message: '请上传图片' }">
            <UploadImage
              :fileUploadType="'coverImg'"
              :defaultList="formData.defaultCoverImgList"
              @remove="removeCoverImg"
              @uploadSuccess="coverImgUploadSuccess"
            ></UploadImage>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="列表封面：" prop="smallImg" :rules="{ required: true, message: '请上传图片' }">
            <UploadImage
              :fileUploadType="'smallImg'"
              :defaultList="formData.defaultSmallImgList"
              @remove="removeSmallImg"
              @uploadSuccess="smallImgUploadSuccess"
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
      <FormItem label="优惠券(非必填)：">
        <Input
          style="width:230px"
          v-model="formData.templateName"
          :placeholder="`点击按钮选择优惠券`"
          disabled
        >
          <Button @click="handleChooseCoupon" slot="append">选择</Button>
        </Input>
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
        <Input
          style="display:inline-block;width:200px"
          v-model="formData.title"
          :maxlength="13"
          placeholder="请输入标题"
          clearable
        />
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
        const {
          smallImg,
          coverImg,
          sourceType,
          tags = [],
          citys = [],
          coupons = [],
          describe,
          contentAuthor
        } = data;

        this.citys = citys;
        this.tags = tags;

        // this.contentAuthor = contentAuthor;

        this.formData.newDescribe = describe;

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

        let couponNames = coupons.map(({ couponName }) => couponName).join(",");
        this.formData.templateName = couponNames;

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
        console.log(1);
        this.formData.images = images;
      console.log("imagesUploadSuccess", this.formData.images);
    },

    removeCoverImg() {
      this.formData.coverImg = "";
      this.formData.defaultCoverImgList = [];
    },
    removeSmallImg() {
      this.formData.smallImg = "";
      this.formData.defaultSmallImgList = [];
    },
    coverImgUploadSuccess({ imgUrl,coverImgHeight,coverImgWidth }) {
      this.formData.coverImg = imgUrl;
        // this.formData.coverImgHeight = coverImgHeight;
        // this.formData.coverImgWidth = coverImgWidth;
      this.formData.defaultCoverImgList = [{ imgUrl }];
    },
    smallImgUploadSuccess({ imgUrl,coverImgHeight,coverImgWidth }) {
        console.log(1);
        this.formData.smallImg = imgUrl;
        this.formData.coverImgHeight = coverImgHeight;
        this.formData.coverImgWidth = coverImgWidth;
      this.formData.defaultSmallImgList = [{ imgUrl }];
    },
    updateTagList(data) {
      console.log("selectedTagList----", data);
      this.tags = data;
    },
    selectedCouponItem(data) {
      console.log("selectedCouponItem----", data);
      let { couponType, id: couponId, name: couponName } = data;
      // templateId 券模板id templateName 券模板名称

      this.formData.templateName = couponName;

      this.formData.coupons = this.coupons = [
        { couponId, couponName, couponType }
      ];
    },
    handleChooseCoupon() {
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
          // this.msgErr("数据验证失败！");
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

    validateImages(rule, value, callback) {
      console.log("validateImages", rule, value);
      if (!this.formData.contentType) {
        return callback("请选择图片类型");
      }
      if (!this.formData.images.length) {
        return callback("请上传图片");
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
      console.log("validateCitys", rule, value);
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
</style>

