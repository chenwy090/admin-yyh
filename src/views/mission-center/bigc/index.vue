<template>
  <div class="xxx">
    <!-- 赏U列 页面配置 bigc   -->
    <Drawer :value="showBigc" :closable="true" width="820" :styles="styles" @on-close="closeDialog">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>赏U页面配置</span>
      </p>
      <Edit :bigcData="bigcData"></Edit>
    </Drawer>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("bigc");

import { getRequest, postRequest } from "@/libs/axios";
import createFormData from "./createFormData";
import Edit from "./Edit";

//设置单词首字母为大写
const firstUpperCase = s => s.replace(/\b(\w)|\s(\w)/g, m => m.toUpperCase());

export default {
  name: "bigc",
  inject: ["msgOk", "msgErr"],
  components: {
    Edit,
  },
  props: {
    // showBigc: {
    //   type: Boolean,
    //   default: false,
    // },
    action: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => ({
        title: "",
        _id: Math.random(),
        id: "",
        type: "add", //add/edit/detail/audit
        data: {},
      }),
    },
  },
  computed: {
    ...mapState(["showBigc"]),
  },
  watch: {
    action: {
      async handler(val, oldVal) {
        let { data } = this.action;
        //add/edit 新增/修改
        this.bigcData = await this.queryBigcById(data.id);
        console.log("watch bigc edit action:", type, this.bigcData);
      },
      deep: true,
    },
  },
  data() {
    return {
      // showBigc: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static",
      },
      ruleValidate: {},
      bigcData: {},
    };
  },
  methods: {
    ...mapMutations(["setAssignmentId", "setShowBigc"]),
    closeDialog() {
      console.log("closeDialog");
      this.setShowBigc(false); //关闭对话框
    },
    async queryBigcById(id) {
      // 根据Id获取详情
      const url = "/merchant/assignment/page/detail";
      let { code, data, msg } = await getRequest(url, { id });

      const arr = [
        "headerImgUrl",
        "rewardButtonUrl",
        "eventRuleButtonUrl",
        "footerImgUrl",
        "couponHeaderImgUrl",
        "couponBoxImgUrl",
        "couponWaveImgUrl",
      ];

      if (code == 200) {
        if (data) {
          // 编辑
          arr.forEach(name => {
            let imgUrl = data[name] || "";
            data[`default${firstUpperCase(name)}List`] = imgUrl ? [{ imgUrl }] : [];
          });
        } else {
          // 新增
          data = createFormData();
        }
        console.log("queryBigcById:", data);
        return data;
      } else {
        // msgOk msgErr
        return this.msgErr("数据查询失败！");
      }
    },
  },
};
</script>
<style scoped>
.underline {
  text-decoration: underline;
}
.table-box {
  min-height: 100px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.marginLeft20 {
  margin-left: 20px;
}
</style>