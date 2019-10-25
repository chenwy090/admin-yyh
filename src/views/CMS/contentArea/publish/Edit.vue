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
      <Row>
        <Col span="12" style="padding-right:10px">
          <span>选择发布账号</span>
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
          <span class="marginLeft20">今日发布：{{userInfo.todayPublishNum}}</span>
          <span class="marginLeft20">7日发布：{{userInfo.weekPublishNum}}</span>
          <span class="marginLeft20">粉丝：{{userInfo.followerNum}}</span>
        </Col>
      </Row>
      <Alert type="warning">视频/图片/GIF(1个视频/1个GIF/15张以内图片) 图片（不大于1M,JPG/JPEG/PNG）</Alert>
      <FormItem :label-width="10">
        <UploadImageMultiple></UploadImageMultiple>
      </FormItem>

      <FormItem
        label
        :label-width="10"
        prop="iconUrl"
        :rules="{ required: true, message: '请上传图片' }"
      >
        <UploadImage
          :fileUploadType="'iconUrl'"
          :defaultList="formData.defaultIconUrlList"
          @remove="removeIconUrl"
          @uploadSuccess="iconUrlUploadSuccess"
        ></UploadImage>
      </FormItem>

      <Divider />
      <Alert type="warning">选择图片（不大于1M,JPG/JPEG/PNG）</Alert>
      <Row type="flex" justify="start">
        <Col span="8">
          <FormItem label="U社区封面图片：" prop="coverImg" :rules="{ required: true, message: '请上传图片' }">
            <UploadImage
              :fileUploadType="'coverImg'"
              :defaultList="formData.defaultCoverImgList"
              @remove="removeCoverImg"
              @uploadSuccess="coverImgUploadSuccess"
            ></UploadImage>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="列表小图片：" prop="smallImg" :rules="{ required: true, message: '请上传图片' }">
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

      <FormItem label="适用城市：">
        <CompCheckBoxCity :cityList="cityList" @checked-city-list="getCheckedCityList"></CompCheckBoxCity>
      </FormItem>
      <FormItem label="标题：" prop="title" :rules="{ required: true, message: '请输入标题' }">
        <Input
          style="width:90%"
          v-model="formData.title"
          :maxlength="13"
          placeholder="请输入标题"
          clearable
        />
      </FormItem>

      <FormItem label="类型：">
        <Select v-model="formData.sourceType" style="width:120px" clearable>
          <Option v-for="(v,k) in sourceTypeOption" :value="k" :key="k">{{ v }}</Option>
        </Select>
      </FormItem>

      <!-- 描述 describe	内容介绍（文字详情） -->

      <FormItem label="描述：">
        <editor-bar
          v-model="formData.describe"
          :content="formData.describe"
          @on-change="change"
          @on-blur="blur"
        ></editor-bar>
      </FormItem>

      <FormItem label="标签：">
        <Tag
          v-for="tag in selectedTagList"
          v-if="tag.checked"
          :key="tag.id"
          :name="tag.name"
          closable
          @on-close="handleClose(tag)"
        >{{ tag.name }}</Tag>
        <Button icon="ios-add" type="dashed" size="small" @click="handleAdd">添加标签</Button>
      </FormItem>

      <Divider />
      <!-- :rules="{ required: true, validator: validateUbay }" -->
      <FormItem prop="addWatchNum" :rules="{ required: true, message: '请输入' }">
        增加观看人数
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.addWatchNum"
          placeholder="请输入数字"
          clearable
        />&nbsp;人
      </FormItem>
      <FormItem prop="addLikeNum" :rules="{ required: true, message: '请输入' }">
        增加点赞人数
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.addLikeNum"
          placeholder="请输入数字"
          clearable
        />&nbsp;人
      </FormItem>
      <FormItem prop="addShareNum" :rules="{ required: true, message: '请输入' }">
        增加分享人数
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.addShareNum"
          placeholder="请输入数字"
          clearable
        />&nbsp;人
      </FormItem>

      <FormItem prop="scanUbay" :rules="{ required: true, message: '请输入' }">
        有效阅读赚
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.scanUbay"
          placeholder="请输入数字"
          clearable
        />&nbsp;U贝
      </FormItem>

      <FormItem prop="likeUbay" :rules="{ required: true, message: '请输入' }">
        点赞赚
        <Input
          style="display:inline-block;width:100px"
          v-model="formData.likeUbay"
          placeholder="请输入数字"
          clearable
        />&nbsp;U贝
      </FormItem>

      <FormItem prop="shareUbay" :rules="{ required: true, message: '请输入' }">
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
      userInfo: {
        userId: "",
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

      // 类型 sourceType 1-官方 2-PGC 3-UGC
      sourceTypeOption: {
        "1": "官方",
        "2": "PGC",
        "3": "UGC"
      },
      ruleValidate: {},
      item: {},
      formData: {
        iconUrl: "", //首页分红banner图片
        defaultIconUrlList: [],

        id: "", //内容id
        userId: "", //发布用户id
        images: [
          /*{imgUrl}*/
        ], //图片
        defaultImagesList: [],
        coverImg: "", //封面图片URL
        defaultCoverImgList: [],
        smallImg: "", //列表小图片
        defaultSmallImgList: [],
        duration: "", //内容时常

        title: "", //	内容标题
        describe: "", //内容介绍（文字详情）

        contentTags: [], //	标签
        contentCoupon: [], //优惠券（非必填）
        citys: [], //适用城市

        sourceType: "", //内容创建人来源类型：1-官方 2-PGC 3-UGC

        addWatchNum: "", //	观看人数
        addLikeNum: "", //	点赞人数
        addShareNum: "", //	分享人数
        contentType: "", //	图片类型   1-Gif  2-图片轮播  3-视频
        scanUbay: "", //	  有效阅读赚 U贝
        likeUbay: "", //	点赞赚 U贝
        shareUbay: "" //	分享好友赚 U贝
      },

      cityList: [], //适用城市
      contentTags: [], //标签
      contentCoupon: [] //优惠券
    };
  },
  created() {
    this.getTagList();
    this.getUserList();
    this.getCityList();
  },
  methods: {
    handleQueryChange(phoneNumber) {
      this.findUser("phoneNumber", phoneNumber);
    },
    findUser(name, value) {
      let userInfo = {
        userId: "",
        todayPublishNum: 0, //今日发布
        weekPublishNum: 0, //7日发布
        followerNum: 0 //粉丝
      };

      let arr = this.userList.filter(item => {
        return item[name] == value;
      });

      this.userInfo = arr.length ? arr[0] : userInfo;
    },
    handleAddPhone() {
      this.showAddPhone = true;
    },
    handleAdd() {
      this.showTagList = true;
    },
    handleClose(tag) {
      const { tagId } = tag;
      this.tagList.some(item => {
        let r = item.tagId == tagId;
        if (r) {
          item._checked = false;
        }
        return r;
      });
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
        console.log("getCityList", data);
        this.cityList = data;
      } else {
        this.msgErr(msg);
      }
    },
    refreshUserList() {
      this.getUserList();
    },
    async getUserList(phoneNumber = "") {
      //发布用户查询
      const url = "/content/userlist";
      const { code, msg, data } = await postRequest(url, { phoneNumber });
      if (code == 200) {
        // data:[{id,name,sort}]
        this.userList = data.map(item => {
          item.phoneNumber = item.phoneNumber || "15657123900";
          return item;
        });
      } else {
        this.msgErr(msg);
      }
    },

    goback() {
      // this.linkTo("cms");
      this.action.compName = "publish-list";
    },
    removeIconUrl() {
      this.formData.iconUrl = "";
      this.formData.defaultIconUrlList = [];
    },
    iconUrlUploadSuccess({ imgUrl }) {
      this.formData.iconUrl = imgUrl;
      this.formData.defaultIconUrlList = [{ imgUrl }];
    },

    removeCoverImg() {
      this.formData.coverImg = "";
      this.formData.defaultCoverImgList = [];
    },
    removeSmallImg() {
      this.formData.smallImg = "";
      this.formData.defaultSmallImgList = [];
    },
    coverImgUploadSuccess({ imgUrl }) {
      this.formData.coverImg = imgUrl;
      this.formData.defaultCoverImgList = [{ imgUrl }];
    },
    smallImgUploadSuccess({ imgUrl }) {
      this.formData.smallImg = imgUrl;
      this.formData.defaultSmallImgList = [{ imgUrl }];
    },
    updateTagList(data) {
      console.log("selectedTagList----", data);
      this.tagList = data;
    },
    selectedCouponItem(data) {
      console.log("selectedCouponItem----", data);
      let { couponType, id, name } = data;
      // templateId 券模板id templateName 券模板名称

      this.formData.templateName = name;

      this.formData.contentCoupon = this.contentCoupon = [
        {
          couponId: id,
          couponName: name,
          couponType
        }
      ];
    },
    handleChooseCoupon() {
      this.showCouponList = true;
    },

    change(val) {
      console.log("change:", val);
      this.formData.describe = val;
    },
    blur(val) {
      console.log("blur:", val);
      this.formData.describe = val;
    },

    handleSubmit(name) {
      // 发布
      const url = "/content/Details";

      // postRequest(url, testData()).then(res => {
      //   if (res.code == 200) {
      //     this.msgOk("保存成功");
      //   } else {
      //     this.msgErr(res.msg);
      //   }
      // });

      // return;

      this.$refs[name].validate(valid => {
        console.log("valid", valid);
        if (!valid) {
          this.msgErr("数据验证失败！");
          return;
        }

        //清洗数据
        let formData = JSON.parse(JSON.stringify(this.formData));

        // images 图片
        formData.images = formData.defaultIconUrlList.map(item => {
          item.sort = 9999;
          return item;
        });

        // 标签
        formData.contentTags = this.tagList.filter(tag => {
          const { _checked, tagId, tagName } = tag;
          if (_checked) {
            return { tagId, tagName };
          }
        });

        console.log("submit formData:", formData);

        postRequest(url, formData).then(res => {
          if (res.code == 200) {
            this.msgOk("保存成功");
          } else {
            this.msgErr(res.msg);
          }
        });
      });
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

