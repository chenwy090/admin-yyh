<template>
  <!-- Withdrawal - switch -->
  <div class="wxconfig-edit">
    <!--修改 提现-开关 对话框-->
    <!-- v-model="showEdit" -->
    <Modal
      :value="showEdit"
      :title="action.title"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="700"
    >
      <Form ref="form" label-position="right" :model="formDynamic" :label-width="120">
        <FormItem prop="items" :rules="{ required: true, validator: validateWxList }">
          <Row>
            <Col span="12">
              <Button type="dashed" long size="small" @click="handleAdd" icon="md-add">添加微信号</Button>
            </Col>
          </Row>
        </FormItem>

        <template v-for="(item, index) in formDynamic.items">
          <Row :key="index" v-if="item.isDeleted==0">
            <Col span="12">
              <FormItem
                :label="`微信号.${index+1}: `"
                :prop="`items.${index}.wechatNo`"
                :rules="{required: true,  validator: validateEmpty('请输入微信号')}"
              >
                <Input
                  type="text"
                  style="width:80%"
                  v-model.trim="item.wechatNo"
                  placeholder="请输入微信号"
                ></Input>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem
                :label-width="0"
                :prop="`items.${index}.groupUrl`"
                :rules="{ required: true, message: '请上传图片' }"
              >
                <UploadImage
                  :fileUploadType="'groupUrl'"
                  :defaultList="item.defaultGroupUrlList"
                  @remove="removeQrcodeImgUrl(index)"
                  @uploadSuccess="qrcodeImgUrlUploadSuccess($event,index)"
                ></UploadImage>
              </FormItem>
            </Col>
            <Col span="4">
              <Button @click="handleRemove(index)">删除</Button>
            </Col>
          </Row>
        </template>
      </Form>
      <div slot="footer">
        <Button type="error" @click="handleSubmit('form')">确认</Button>
        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import util from "@/libs/util";
import { postRequest } from "@/libs/axios";
import createFormData from "./createFormData";

import UploadImage from "./UploadImage";

export default {
  name: "wxconfig-edit",
  components: { UploadImage },
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
        console.log("edit watch action", data);
        // 新增
        if (type == "edit") {
          //edit 修改
          this.url = "/kefu/saveAllKefuWechatGroup";
          this.formDynamic.items = JSON.parse(JSON.stringify(data));
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      ruleValidate: {},
      isShow: true,
      formDynamic: createFormData(),
    };
  },
  created() {},
  methods: {
    removeQrcodeImgUrl(index) {
      console.log("removeQrcodeImgUrl", index);
      let item = this.formDynamic.items[index];
      item.groupUrl = "";
      item.defaultGroupUrlList = [];
      this.formDynamic.items.splice(index, 1, item);
    },
    qrcodeImgUrlUploadSuccess({ imgUrl }, index) {
      console.log("qrcodeImgUrlUploadSuccess", imgUrl, index);
      let item = this.formDynamic.items[index];
      item.groupUrl = imgUrl;
      item.defaultGroupUrlList = [{ imgUrl }];

      // this.formDynamic.items.splice(index, 1, item);
    },
    closeDialog() {
      //关闭对话框清除表单数据
      console.log("closeDialog");
      this.isShow = false;
      this.$emit("update:showEdit", false);
    },

    handleAdd() {
      let item = createFormData().items[0];
      this.formDynamic.items.push(item);
    },
    handleRemove(index) {
      let item = this.formDynamic.items[index];

      if (item.id === "") {
        //新增 直接删除
        this.formDynamic.items.splice(index, 1);
      } else {
        //修改 更改状态
        item.isDeleted = 1;
        this.formDynamic.items.splice(index, 1, item);
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          // this.msgOk("数据验证成功!");
          let oForm = JSON.parse(JSON.stringify(this.formDynamic));

          let { items } = oForm;
          console.log("items:", items);
          // 获取没有删除的数据
          let arr = items.filter(item => item.isDeleted === 0);

          // 判重
          let json = {};
          let flag = false; // 默认没有重复的微信号
          let no = ""; //微信号
          for (let i = 0; i < arr.length; i++) {
            const { wechatNo } = arr[i];
            if (json[wechatNo]) {
              flag = true; //有重复的微信好
              no = wechatNo;
              break;
            } else {
              json[wechatNo] = true;
            }
          }

          console.log("flag=>", flag);

          if (flag) {
            return this.msgErr(`${no}微信号重复`);
          }

          let { code, msg } = await postRequest(this.url, { allKefuWechatGroup: items });

          if (code == 200) {
            this.msgOk("保存成功");
            // 关闭对话框
            this.closeDialog();
            //刷新列表数据
            this.$emit("refresh");
          } else {
            this.msgErr(msg);
          }
        } else {
          this.msgErr("数据验证失败,请检查表单!");
        }
      });
    },
    validateEmpty(msg, len = 20) {
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
    validateWxList(rule, value, callback) {
      console.log("validateWxList", rule, value);
      if (!value.length) {
        return callback("请添加微信号");
      }
      callback();
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


