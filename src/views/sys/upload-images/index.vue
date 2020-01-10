<template>
  <!-- Withdrawal - switch -->
  <div class="wxconfig-edit">
    <!-- <Form ref="form" label-position="right" :label-width="120">
      <FormItem prop="items">
        <Row>
          <Col span="12">
            <Button type="dashed" size="small" @click="handleAdd" icon="md-add">新增图片</Button>
          </Col>
        </Row>
      </FormItem>
    </Form>-->

    <Form ref="form" label-position="right" :label-width="120">
      <FormItem>
        <FormGroup
          v-for="(oForm, index) in formDynamic.items"
          :key="index"
          :index="index"
          :formData="oForm"
          @imgUrlUploadSuccess="imgUrlUploadSuccess"
          @removeImgUrl="removeImgUrl"
          @handleSubmit="handleSubmit"
          @del="handleDel"
        ></FormGroup>
      </FormItem>
    </Form>
    <Row type="flex" justify="start">
      <Button type="primary" class="marginLeft20" icon="md-add" @click="handleAdd">新增图片</Button>
      <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
    </Row>
    <TableList ref="tableRef"></TableList>
  </div>
</template>

<script>
import util from "@/libs/util";
import { postRequest } from "@/libs/axios";
import createFormData from "./createFormData";

import FormGroup from "./FormGroup";

// 表格
import TableList from "./tableList";

export default {
  name: "sys-upload-image",
  components: { TableList, FormGroup },
  data() {
    return {
      formDynamic: createFormData(),
    };
  },
  methods: {
    refresh() {
      this.$refs.tableRef.refresh();
    },
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
    },
    handleAdd() {
      let item = createFormData();
      this.formDynamic.items.push(item);
    },
    handleDel(index) {
      this.formDynamic.items.splice(index, 1);
      // this.$emit("del", index);
    },
    handleSubmit(formData) {
      this.$refs.tableRef.add(formData);
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


