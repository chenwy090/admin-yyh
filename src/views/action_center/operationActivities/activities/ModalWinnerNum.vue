<template>
  <!-- 编辑/查看次数 -->
  <div class="coupon-list-box">
    <Modal
      v-model="isShow"
      width="500"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
    >
      <div slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{title}}</span>
      </div>
      <Form label-position="right" ref="form" :model="formData" :label-width="120">
        <!-- 点击后，在弹层中，填写和显示以下信息：
本次增加次数：仅支持填写正整数；
实际中奖次数：此处数值仅用于展示，不可操作，具体值=活动累计实际中奖次数（实时计算）；
        显示中奖次数：此处数值仅用于展示，不可操作，具体值=本次新增中奖次数+实际中奖次数+累计手动增加中奖次数（不含本次）；-->
        <template v-if="action.type=='edit'">
          <FormItem
            label="本次增加次数："
            prop="addWinnerNum"
            :rules="{ required: true, message: '请输入增加次数' }"
          >
            <Input
              type="text"
              style="width:60%"
              v-model="formData.addWinnerNum"
              placeholder="请填写正整数"
              clearable
            />
          </FormItem>
        </template>
        <FormItem label="实际中奖次数：" prop="realWinnerNum">{{formData.realWinnerNum}}&nbsp;&nbsp;人</FormItem>
        <FormItem label="显示中奖次数：" prop="viewWinnerNum">{{formData.viewWinnerNum}}&nbsp;&nbsp;人</FormItem>
      </Form>
      <div slot="footer">
        <Button style="margin-right: 20px" @click="closeDialog">{{action.type=='edit'?"取消":"关闭"}}</Button>
        <Button v-if="action.type=='edit'" type="error" @click="handleSubmit('form')">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
export default {
  name: "tag-list",
  props: {
    action: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => ({ type: "query" })
    }
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;
        this.isShow = true;
        console.log("xxxx this.action", JSON.stringify(this.action));
        // 查询
        if (type == "query") {
          this.title = "查询次数";
          //   this.url = "/activityInfo/add";
          //   Object.keys(this.formData).forEach(name => {
          //     this.formData[name] = "";
          //   });
          this.formData = JSON.parse(JSON.stringify(data));
        } else {
          //edit 编辑次数
          this.title = "编辑次数";
          this.url = "/activityInfo/editWinner";
          this.$nextTick(() => {
            Object.keys(this.formData).forEach(name => {
              this.formData[name] = data[name];
            });
          });
        }
      },
      deep: true
    }
  },
  data() {
    return {
      isShow: false,
      title: "查询次数",
      //   实际中奖次数 realWinnerNum: 0  显示中奖次数 viewWinnerNum: 0
      formData: {
        id: "",
        addWinnerNum: "",
        realWinnerNum: 0,
        viewWinnerNum: 0
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.msgOk("数据验证成功!");

          let oForm = JSON.parse(JSON.stringify(this.formData));

          let { code, msg } = await postRequest(this.url, oForm);

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
          this.$Message.error("数据验证失败！");
        }
      });
    },
    // 关闭
    cancel() {
      this.closeDialog();
    },
    closeDialog() {
      //关闭对话框
      console.log("closeDialog");
      this.isShow = false;
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3
      });
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
.form > div {
  display: inline-block;
}
</style>

<style lang="less">
.bussiness-list-box {
  /*调整table cell间隔和行高*/
  .ivu-table-cell {
    padding-left: 1px;
    padding-right: 1px;
  }
  .ivu-table-small td {
    height: 30px;
  }
}
</style>
