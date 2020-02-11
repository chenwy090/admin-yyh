<template>
  <div>
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      :styles="{top: '20px'}"
      width="900"
      title="优惠券列表"
      @on-cancel="closeDialog"
    >
      <Tabs type="card" @on-click="setTab">
        <TabPane label="超市券" name="yhqM">
          <div class="query-row">
            <Card :bordered="false" style="margin-bottom:2px">
              <Form inline>
                <!-- 商户/品牌名称 -->
                <FormItem label="优惠券名称：" :label-width="100">
                  <Input
                    style="width:200px"
                    type="text"
                    v-model="searchData.name"
                    placeholder="请输入优惠券名称"
                    clearable
                  ></Input>
                </FormItem>
                <FormItem label="优惠券Id：" :label-width="80">
                  <Input
                    style="width:200px"
                    type="text"
                    v-model="searchData.id"
                    placeholder="请输入优惠券Id"
                    clearable
                  ></Input>
                </FormItem>
                <Button
                  type="primary"
                  icon="md-search"
                  class="marginLeft20"
                  @click="queryCouponList()"
                >搜索</Button>
                <Button icon="md-refresh" class="marginLeft20" click="reset" @click="reset">重置</Button>
              </Form>
            </Card>
          </div>
          <Card :bordered="false" style="margin-bottom:2px">
            <Table :columns="columnsYhq" :data="dataYhq" border></Table>
            <Row type="flex" justify="end" class="page">
              <!-- show-total 显示总数 共{{ total }}条 -->
              <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
              <Page
                show-total
                show-elevator
                :current="page.pageNum"
                :page-size="page.pageSize"
                :total="page.total"
                @on-change="changeCurrent"
              ></Page>
            </Row>
          </Card>
        </TabPane>
        <TabPane label="周边券" name="yhqZ">
          <div class="query-row">
            <Card :bordered="false" style="margin-bottom:2px">
              <Form inline>
                <!-- 商户/品牌名称 -->
                <FormItem label="优惠券名称：" :label-width="100">
                  <Input
                    style="width:200px"
                    type="text"
                    v-model="searchData.name"
                    placeholder="请输入优惠券名称"
                    clearable
                  ></Input>
                </FormItem>
                <FormItem label="优惠券Id：" :label-width="80">
                  <Input
                    style="width:200px"
                    type="text"
                    v-model="searchData.id"
                    placeholder="请输入优惠券Id"
                    clearable
                  ></Input>
                </FormItem>
                <Button
                  type="primary"
                  icon="md-search"
                  class="marginLeft20"
                  @click="queryCouponList()"
                >搜索</Button>
                <Button icon="md-refresh" class="marginLeft20" click="reset" @click="reset">重置</Button>
              </Form>
            </Card>
          </div>
          <Card :bordered="false" style="margin-bottom:2px">
            <Table :columns="columnsYhq" :data="dataYhq" border></Table>
            <Row type="flex" justify="end" class="page">
              <!-- show-total 显示总数 共{{ total }}条 -->
              <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
              <Page
                show-total
                show-elevator
                :current="page.pageNum"
                :page-size="page.pageSize"
                :total="page.total"
                @on-change="changeCurrent"
              ></Page>
            </Row>
          </Card>
        </TabPane>
      </Tabs>
      <div slot="footer">
        <Button type="error" size="large" @click="handleSubmit">确认</Button>
        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <!--优惠券的详细信息-->
    <Modal
      v-model="yhqDetail"
      :closable="true"
      :mask-closable="false"
      :styles="{top: '20px'}"
      width="500"
      :title="yhqTitle"
      @on-cancel="closeDialog"
    >
      <template v-if="action.type =='query'">
        <ul class="query-style-wrap">
          <li class="qs-item">
            <label class="label">优惠券ID：</label>
            <div class="value">{{formData.templateId}}</div>
          </li>
          <li class="qs-item">
            <label class="label">券当前剩余库存：</label>
            <div class="value">{{formData.surplusCount}}</div>
          </li>
          <li class="qs-item">
            <label class="label">主标题：</label>
            <div class="value">{{formData.mainTitle}}</div>
          </li>
          <li class="qs-item">
            <label class="label">副标题：</label>
            <div class="value">{{formData.subTitle}}</div>
          </li>
          <li class="qs-item">
            <label class="label">券图片：</label>
            <div class="value">
              <div class="img">
                <img :src="formData.img" />
              </div>
            </div>
          </li>
          <li class="qs-item">
            <label class="label">是否预告：</label>
            <div class="value">
              <template v-if="formData.isYg == 0">否</template>
              <!-- yGOptions:[{label:'全程预告',value:1},{label:'提前24小时',value:2},{label:'提前12小时',value:3}], -->
              <template v-if="formData.isYg == 1">
                是&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <template v-if="formData.isYgValue == 1">全程预告</template>
                <template v-if="formData.isYgValue == 2">提前24小时</template>
                <template v-if="formData.isYgValue == 3">提前12小时</template>
              </template>
            </div>
          </li>
          <li class="qs-item">
            <label class="label">领/购时间：</label>
            <div class="value">{{formData.beginTime}} - {{formData.endTime}}</div>
          </li>
        </ul>
      </template>
      <template v-else>
        <Form
          label-position="right"
          ref="form"
          :model="formData"
          :rules="ruleValidate"
          :label-width="100"
        >
          <FormItem label="选择优惠券：" prop="templateId">
            <Input
              style="width:200px;margin-right:5px;display:inline-table;vertical-align:middle"
              v-model="formData.templateId"
              disabled
            >
              <Button slot="append" @click="backToYhq">选择</Button>
            </Input>
            <span style="color:#ff5200">券当前剩余库存：{{formData.surplusCount}}</span>
          </FormItem>
          <FormItem
            label="主标题："
            prop="mainTitle"
            :rules="{required: true,validator: validateEmpty('请输入主标题名称',50)}"
          >
            <Input v-model="formData.mainTitle"></Input>
          </FormItem>
          <FormItem
            label="副标题："
            prop="subTitle"
            :rules="{required: true,validator: validateEmpty('请输入副标题名称',50)}"
          >
            <Input v-model="formData.subTitle"></Input>
          </FormItem>
          <FormItem label="券图片：" prop="img" :rules="{required: true,message:'输入图片'}">
            <div style="display:inline-block;vertical-align:middle">
              <UploadImage
                :fileUploadType="'img'"
                :defaultList="formData.defaultImgList"
                @remove="removeImg"
                @uploadSuccess="ImgUploadSuccess"
              ></UploadImage>
            </div>
            <span style="margin-left:10px;">图片限JPG、PNG格式，1MB以内，建议比例1:1</span>
          </FormItem>
          <FormItem label="是否预告：" prop="isYg" :rules="{required: true,message:'是否预告'}">
            <RadioGroup v-model="formData.isYg">
              <Radio
                v-for="(item,index) in isYgOption"
                :label="item.value"
                :key="index"
              >{{item.label}}</Radio>
            </RadioGroup>
            <Select v-model="formData.isYgValue" v-if="formData.isYg == 1" clearable>
              <Option
                v-for="(item,index) in yGOptions"
                :value="item.value"
                :label="item.label"
                :key="index"
              ></Option>
            </Select>
          </FormItem>
          <FormItem
            label="领/购时间："
            prop="beginTime"
            :rules="{required: true,  validator: validateTime}"
          >
            <DatePicker
              type="datetimerange"
              placeholder="请选时间"
              format="yyyy-MM-dd HH:mm:ss"
              style="display:inline-block;width: 300px"
              :value="daterange"
              @on-change="changeTime"
            ></DatePicker>
          </FormItem>
          <FormItem label=" ">
            券活动开始、结束时间：{{activityTime}}
            模块开始、结束时间:{{moduleStartTime}} -- {{moduleEndTime}}
          </FormItem>
        </Form>
      </template>
      <div slot="footer">
        <Button style="margin-left: 8px" @click="closeDialog">取消</Button>
        <Button type="error" @click="handleSubmitSave('form')" v-if="action.type != 'query'">保存提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import util from "@/libs/util";
import UploadImage from "../components/UploadImage";
import { postRequest } from "@/libs/axios";
export default {
  components: {
    UploadImage,
  },
  props: {
    action: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => ({ type: "add" }),
    },
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;

        if (type == "add") {
          this.isShow = true;
          this.yhqDetail = false;
          //this.daterange = [];
          this.currentChoose = "";
          this.yhqTitle = "增加优惠券";
          this.url = "/browsing/templateCoupon/add";
        } else if (type == "edit") {
          this.yhqDetail = true;
          this.isShow = false;
          this.yhqTitle = "编辑优惠券";
          this.url = "/browsing/templateCoupon/edit";
          this.setFormDataVaule(data.data);
        } else if (type == "query") {
          this.yhqDetail = true;
          this.isShow = false;
          this.yhqTitle = "查看优惠券";
          this.setFormDataVaule(data.data);
        }
        console.log("优惠券");
        this.moduleId = data.moduleId;
        this.browsingId = data.browsingId;
        this.moduleStartTime = data.moduleStartTime;
        this.moduleEndTime = data.moduleEndTime;

        console.log(data.data);
        console.log(data);
        this.queryCouponList();
      },
      deep: true,
    },
  },
  data() {
    return {
      moduleStartTime: "",
      moduleEndTime: "",
      url: "",
      yhqTitle: "",
      moduleId: "",
      browsingId: "",
      useTime: "",
      activityTime: "",
      searchData: {
        name: "",
        id: "",
        type: 1,
      },
      currentChoose: "",
      columnsYhq: [
        {
          title: "选择",
          align: "center",
          width: 100,
          render: (h, params) => {
            let id = params.row.templateId;
            let flag = false;
            if (this.currentChoose === id) {
              flag = true;
            } else {
              flag = false;
            }
            let self = this;
            return h("div", [
              h("Radio", {
                props: {
                  value: flag,
                },
                on: {
                  "on-change": () => {
                    self.currentChoose = id;
                    self.currentTableRow = params.row;
                  },
                },
              }),
            ]);
          },
        },
        {
          title: "优惠券Id",
          key: "templateId",
          align: "center",
          width: 140,
        },
        {
          title: "优惠券名称",
          key: "couponName",
          align: "center",
        },
      ],
      dataYhq: [],
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0, //数据总数
      },
      isShow: false,
      yhqDetail: false,
      formData: {
        id: "",
        templateId: "",
        surplusCount: "",
        beginTime: "",
        endTime: "",
        isYg: "",
        isYgValue: "",
        img: "",
        defaultImgList: [],
        mainTitle: "",
        subTitle: "",
      },
      ruleValidate: {},
      daterange: [],
      yGOptions: [
        { label: "全程预告", value: 1 },
        { label: "提前24小时", value: 2 },
        { label: "提前12小时", value: 3 },
      ],
      currentTableRow: "",
      isYgOption: [
        { label: "否", value: 0 },
        { label: "是", value: 1 },
      ],
      currentMouldId: "",
    };
  },
  async created() {},
  methods: {
    changeCurrent(pageNum) {
      this.queryCouponList(pageNum);
    },
    closeDialog() {
      this.isShow = false;
      this.yhqDetail = false;
      this.$emit("refresh");
    },
    removeImg() {
      this.formData.img = "";
      this.formData.defaultImgList = [];
    },
    ImgUploadSuccess({ imgUrl }) {
      this.formData.img = imgUrl;
      this.formData.defaultImgList = [{ imgUrl }];
    },
    handleSubmit() {
      //显示优惠券的信息
      this.yhqDetail = true;
      console.log(this.currentTableRow);
      const {
        currentTableRow: {
          templateId,
          surplusCount,
          mainTitle,
          subTitle,
          imgUrl,
          useStartDate,
          useEndDate,
          startDate,
          endDate,
        },
        moduleStartTime,
        moduleEndTime,
      } = this;
      this.formData = {
        id: this.currentMouldId,
        templateId: templateId,
        surplusCount: surplusCount,
        mainTitle: mainTitle,
        subTitle: subTitle,
        img: imgUrl,
        defaultImgList: [{ imgUrl: imgUrl }],
        beginTime: moduleStartTime,
        endTime: moduleEndTime,
        isYg: "",
        isYgValue: "",
      };
      //赋值
      this.daterange = [moduleStartTime, moduleEndTime];
      //this.useTime = (useStartDate == null ? "" : useStartDate) + '--' + useEndDate; //券的时间
      this.activityTime = (startDate == null ? "" : startDate) + "--" + (endDate == null ? "" : endDate);
    },
    async queryCouponList(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.loading = true;
      const {
        searchData: { name, id, type },
      } = this;
      let params = {
        couponName: name.trim(),
        templateId: id.trim(),
        couponType: type,
        // pageNum: this.page.pageNum,
        // pageSize: this.page.pageSize,
        ...this.page,
      };
      const url = "/browsing/templateCoupon/list";
      let { code, msg, data } = await postRequest(url, params);
      //   let { code, msg, data, current, total, size } = await postRequest(url, params);
      debugger;
      if (code == 200) {
        if (data.dataList == null) {
          this.dataYhq = [];
          this.page = {
            pageNum: 1, //页码
            pageSize: 10, //每页数量
            total: 0, //数据总数
          };
          return false;
        }
        if (type == 2) {
          for (let i = 0; i < data.dataList.length; i++) {
            let item = data.dataList[i];
            item.time = item.startDate + "--" + item.endDate;
          }
        }
        this.dataYhq = data.dataList;
        this.page.pageNum = data.pageNum; //分页查询起始记录
        this.page.total = data.totalCount; //列表总数
        this.page.pageSize = data.pageSize; //每页数据
      } else {
        this.dataYhq = [];
        this.msgErr(code + " 数据加载失败!");
      }
    },
    setTab(value) {

      this.currentChoose = "";
      //  yhqM:超市券 type:1   yhqZ:周边券 type:2
      if (value == "yhqM") {
        this.searchData.type = 1;
        this.page.pageSize = 10;
        this.searchData.name = "";
        this.searchData.id = "";
        this.columnsYhq.pop();
        this.queryCouponList();
      } else {
        this.searchData.type = 2;
        this.page.pageSize = 10;
        this.searchData.name = "";
        this.searchData.id = "";
        this.columnsYhq.push({ title: "有效期", key: "time", align: "center" });
        this.queryCouponList();
      }
    },
    reset() {
      this.daterange = [];
      // 重置查询参数
      this.searchData = {
        name: "",
        id: "",
        type: 1,
      };
      this.page = {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0, //数据总数
      };

      //重新查询一遍
      this.queryCouponList();
    },
    setFormDataVaule(data) {
      //回显数据
      const {
        couponType, //yhqM:超市券 type:1   yhqZ:周边券 type:2
        mainTitle,
        id,
        templateId,
        subTitle,
        surplusCount,
        contentType,
        isHerald,
        heraldType,
        startTime,
        endTime,
        jumpType,
        imgUrl,
        startDate,
        endDate,
      } = data;

      this.searchData.type = couponType;

      this.formData = {
        id,
        templateId,
        surplusCount,
        beginTime: startTime,
        endTime,
        isYg: isHerald,
        isYgValue: heraldType == null ? "" : heraldType,
        img: imgUrl,
        defaultImgList: [{ imgUrl: imgUrl }],
        mainTitle,
        subTitle,
      };
      this.activityTime = startDate + "--" + endDate;
      this.daterange = [startTime, endTime];
    },
    handleSubmitSave(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          const {
            formData: { id, templateId, surplusCount, beginTime, endTime, isYg, isYgValue, img, mainTitle, subTitle },
            searchData: { type },
            moduleId,
            browsingId,
          } = this;
          let params = {
            browsingId,
            couponId: templateId,
            couponType: type,
            endTime,
            id,
            imgUrl: img,
            isHerald: isYg,
            mainTitle,
            moduleId,
            startTime: beginTime,
            subTitle,
          };
          if (isYg == 1) {
            if (isYgValue == "") {
              this.$Message.error("请选择预告类型");
              return false;
            }
            params.heraldType = isYgValue;
          } else {
            params.heraldType = "";
          }

          let { code, msg } = await postRequest(this.url, params);
          if (code == 200) {
            this.msgOk("保存成功");
            this.$refs["form"].resetFields();
            this.yhqDetail = false;
            this.isShow = false;
            this.$emit("refresh");
          } else {
            this.msgErr(msg);
          }
        } else {
          this.$Message.error("数据验证失败！");
        }
      });
    },
    changeTime(arr) {
      // yyyy-MM-dd HH:mm:ss
      console.log(arr);
      let [beginTime, endTime] = arr;
      this.formData.beginTime = beginTime;
      this.formData.endTime = endTime;
    },
    backToYhq() {
      console.log(this.formData);
      this.daterange = [];
      this.yhqDetail = false;
      this.isShow = true;
      this.currentChoose = "";
      this.currentMouldId = this.formData.id;
    },
    validateTime(rule, value, callback) {
      this.$nextTick(_ => {
        let beginTime = this.formData.beginTime;
        let endTime = this.formData.endTime;
        if (beginTime == "" || endTime == "") {
          return callback("时间不能为空");
        }

        beginTime = new Date(beginTime);
        endTime = new Date(endTime);
        // if (beginTime < new Date()) {
        //     return callback(`开始时间不能小于当前时间`);
        // }
        if (endTime < new Date()) {
          return callback(`开始时间不能小于当前时间`);
        }
        if (beginTime >= endTime) {
          return callback(`结束时间必须大于开始时间`);
        }
        callback();
      });
    },
    validateEmpty(msg, len = 6) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        let length = util.getByteLen(value);
        if (length > len * 2) {
          return callback(`最多只能输入${len}个汉字`);
        }
        callback();
      };
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3,
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3,
      });
    },
  },
};
</script>
<style scoped lang="less">
.query-style-wrap {
  .qs-item {
    display: flex;
    padding: 10px 0;
    align-items: center;
  }
  .label {
    width: 100px;
  }
  .value {
    flex: 1;
    .img {
      width: 100px;
      height: 100px;
      border: 1px #ddd solid;
      line-height: 100px;
    }
    img {
      width: 100%;
      vertical-align: middle;
    }
  }
}
</style>
