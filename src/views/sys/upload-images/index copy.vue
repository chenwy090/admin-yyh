<template>
  <!-- Withdrawal - switch -->
  <div class="wxconfig-edit">
    <Form ref="form" label-position="right" :model="formDynamic" :label-width="120">
      <FormItem prop="items">
        <Row>
          <Col span="12">
            <Button type="dashed" size="small" @click="handleAdd" icon="md-add">新增图片</Button>
          </Col>
        </Row>
      </FormItem>
      <template v-for="(item, index) in formDynamic.items">
        <Row :key="index">
          <Col span="5">
            <FormItem :prop="`items.${index}.imgUrl`" :rules="{ required: true, message: '请上传图片' }">
              <UploadImage
                :compress="true"
                :fileUploadType="'imgUrl'"
                :defaultList="item.defaultImgUrlList"
                @remove="removeImgUrl(index)"
                @uploadSuccess="imgUrlUploadSuccess($event,index)"
              ></UploadImage>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="`图片.${index+1}: `" :prop="`items.${index}.imgUrl`">
              <Input
                type="text"
                style="width:70%"
                disabled
                v-model.trim="item.imgUrl"
                placeholder="图片地址"
              ></Input>
              <Button
                type="success"
                v-clipboard:copy="item.imgUrl"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >复制</Button>
              <Button type="primary" :to="item.imgUrl" target="_blank">新窗口打开</Button>
            </FormItem>
          </Col>
          <Col span="4">
            <Button type="error" @click="handleRemove(index)">删除</Button>
          </Col>
        </Row>
      </template>
    </Form>
    <TableList ref="tableRef"></TableList>
  </div>
</template>

<script>
import util from "@/libs/util";
import { postRequest } from "@/libs/axios";
import createFormData from "./createFormData";

import UploadImage from "./UploadImage";

// 表格
import TableList from "./tableList";

export default {
  name: "sys-upload-image",
  components: { UploadImage, TableList },
  props: {
    showEdit: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Object,
      default: () => ({
        _id: Math.random(),
        title: "添加微信号",
        type: "edit", //add/edit/detail/audit
        data: {},
      }),
    },
  },
  watch: {
    action: {
      handler() {
        let { type, data } = this.action;
        // this.isShow = true;
        console.log("watch action");
        // 新增
        if (type == "add") {
          this.url = "/activityInfo/add";
          this.formData = createFormData();
        } else {
          //edit 修改
          this.url = "/activityInfo/edit";
          this.formData = JSON.parse(JSON.stringify(data));
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      ruleValidate: {},
      modal: {
        levelName: "提现-开关",
        isopen: false,
      },
      isShow: true,
      formData: createFormData(),
      formDynamic: {
        items: [
          {
            _id: Math.random(),
            wxnumber: "",
            qrcodeImgUrl: "",
            defaultQrcodeImgUrlList: [],
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 复制成功时的回调函数
    onCopy(e) {
      this.$Message.success("内容已复制到剪切板！");
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$Message.error("抱歉，复制失败！");
    },
    //  <UploadImage
    //             :compress="true"
    //             :fileUploadType="'imgUrl'"
    //             :defaultList="item.defaultImgUrlList"
    //             @remove="removeImgUrl(index)"
    //             @uploadSuccess="imgUrlUploadSuccess($event,index)"
    //           ></UploadImage>
    removeImgUrl(index) {
      console.log("removeQrcodeImgUrl", index);
      let item = this.formDynamic.items[index];
      item.imgUrl = "";
      item.defaultImgUrlList = [];
      this.formDynamic.items.splice(index, 1, item);
    },
    imgUrlUploadSuccess({ imgUrl }, index) {
      console.log("qrcodeImgUrlUploadSuccess", imgUrl, index);
      let item = this.formDynamic.items[index];
      item.imgUrl = imgUrl;
      item.defaultImgUrlList = [{ imgUrl }];
      this.formDynamic.items.splice(index, 1, item);

      this.$refs.tableRef.add({ title: "xxxxx", url: imgUrl });
    },

    handleAdd() {
      let item = createFormData();
      this.formDynamic.items.push(item);
    },
    handleRemove(index) {
      this.formDynamic.items.splice(index, 1);
      // this.$emit("del", index);
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

<style scoped>
h3 {
  display: inline-block;
  border: 1px solid #d8d3d3;
  padding: 5px 10px;
  margin: 10px 0;
}
</style>


