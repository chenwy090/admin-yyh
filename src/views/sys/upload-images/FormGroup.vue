<template>
  <Form ref="form" :model="formData" :lable-width="lableWidth" label-position="right">
    <Row>
      <Col span="3">
        <FormItem prop="imgUrl" :rules="{ required: true, message: '请上传图片' }">
          <UploadImage
            :fileUploadType="'imgUrl'"
            :defaultList="formData.defaultImgUrlList"
            @remove="removeImgUrl"
            @uploadSuccess="imgUrlUploadSuccess"
          ></UploadImage>
        </FormItem>
      </Col>

      <Col span="5">
        <FormItem
          :lable-width="60"
          :label="`标题.${index+1}: `"
          prop="title"
          :rules="{ required: true, message: '请填写标题' }"
        >
          <Input type="text" style="width:70%" v-model.trim="formData.title" placeholder="标题"></Input>
        </FormItem>
      </Col>
      <Col span="6">
        <FormItem
          :lable-width="60"
          :label="`图片.${index+1}: `"
          prop="imgUrl"
          :rules="{ required: true, message: '请上传图片' }"
        >
          <Input
            type="text"
            disabled
            style="width:70%"
            v-model.trim="formData.imgUrl"
            placeholder="图片地址"
          ></Input>
          <ButtonGroup size="small">
            <Button
              size="small"
              type="success"
              v-clipboard:copy="formData.imgUrl"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >复制</Button>
            <Button size="small" type="primary" :to="formData.imgUrl" target="_blank">新窗口打开</Button>
          </ButtonGroup>
        </FormItem>
      </Col>
      <Col span="4">
        <ButtonGroup>
          <Button @click="handleSubmit(index)">保存</Button>
          <Button type="error" @click="handleDel">删除</Button>
        </ButtonGroup>
      </Col>
    </Row>
  </Form>
</template>

<script>
import UploadImage from "./UploadImage";

export default {
  name: "FormGroup",
  components: { UploadImage },
  props: {
    formData: {
      type: Object,
      default: () => {
        ({
          _id: Math.random(),
          title: "", //标题
          imgUrl: "", // 图片地址
          defaultImgUrlList: [],
        });
      },
    },
    lableWidth: {
      type: Number,
      default: 100,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  mounted() {},
  methods: {
    // 复制成功时的回调函数
    onCopy(e) {
      this.$Message.success("内容已复制到剪切板！");
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$Message.error("抱歉，复制失败！");
    },
    removeImgUrl(index) {
      console.log("removeImgUrl", this.index);
      this.$emit("removeImgUrl", this.index);
    },
    imgUrlUploadSuccess(data) {
      console.log("imgUrlUploadSuccess data", data, this.index);
      this.$emit("imgUrlUploadSuccess", data, this.index);
    },
    handleDel() {
      this.$emit("del", this.index);
    },
    handleSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let { title, imgUrl: url } = this.formData;
          this.$emit("handleSubmit", { title, url });
        } else {
          return this.msgErr("数据验证失败！");
        }
      });
    },
  },
};
</script>

<style scoped>
</style>