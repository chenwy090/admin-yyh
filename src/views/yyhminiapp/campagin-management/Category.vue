
<template>
  <!-- 收费条目 BrandItem -->
  <div>
    <!-- :label="'Item ' + index"   :prop="`categoryList.${index}.firstClassCode`"-->
    <div>data:{{data}}</div>
    <Row>
      <FormItem
        :prop="'categoryList['+index+'].firstClassCode'"
        :rules="{ required: true, message: '请选择一级分类' }"
        style="display:inline-block;width:150px"
      >
        <Select v-model="data.firstClassCode" clearable @on-change="get2" size="small">
          <Option
            v-for="(item, index) in list1"
            :key="index"
            :value="item.classCode"
          >{{ item.className }}</Option>
        </Select>
      </FormItem>
      <FormItem
        :prop="'categoryList['+index+'].secondClassCode'"
        :rules="{ required: true, message: '请选择二级分类' }"
        style="display:inline-block;width:150px"
      >
        <Select v-model="data.secondClassCode" clearable @on-change="get3" size="small">
          <Option
            v-for="(item, index) in list2"
            :key="index"
            :value="item.classCode"
          >{{ item.className }}</Option>
        </Select>
      </FormItem>
      <FormItem
        :prop="'categoryList['+index+'].threeClassCode'"
        :rules="{ required: true, message: '请选择三级分类' }"
        style="display:inline-block;width:150px"
      >
        <Select v-model="data.threeClassCode" clearable size="small">
          <Option
            @click.native="getId(item.id)"
            v-for="(item, index) in list3"
            :key="index"
            :value="item.classCode"
          >{{ item.className }}</Option>
        </Select>
      </FormItem>
      <Button
        style="display:inline-block;width:100px;margin-left:20px;color: red;border-color: red;"
        type="dashed"
        long
        @click="handleRemove(index)"
        size="small"
        icon="ios-close"
      ></Button>
    </Row>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
export default {
  name: "category",
  created() {},
  components: {},
  props: {
    index: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => ({
        id: "",
        firstClassCode: "",
        secondClassCode: "",
        threeClassCode: ""
      })
    }
  },
  computed: {},
  watch: {},
  data() {
    return {
      firstClassCode: "",
      secondClassCode: "",
      threeClassCode: "",
      categoryList: [],
      list1: [],
      list2: [],
      list3: []
    };
  },

  mounted() {
    console.log("mounted data:", { ...this.data });

    if (!this.data.firstClassCode) {
      this.get1();
    } else {
      // 级联查询
      this.edit();
    }
  },
  methods: {
    edit() {
      const url = "/campagin/selectGoodClassByCode";
      postRequest(url, {})
        .then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            this.list1 = data;
          }
        })
        .then(_ => {
          postRequest(url, {
            parentCode: this.data.firstClassCode
          }).then(res => {
            let { code, msg, data } = res;
            if (code == 200) {
              this.list2 = data;
            }
          });
        })
        .then(_ => {
          postRequest(url, {
            parentCode: this.data.secondClassCode
          }).then(res => {
            let { code, msg, data } = res;
            if (code == 200) {
              this.list3 = data;
            }
          });
        });
    },
    getId(id) {
      this.data.id = id;
      console.log("this.id", id);
    },
    //一级分类
    async get1() {
      const url = "/campagin/selectGoodClassByCode";
      let { code, msg, data } = await postRequest(url, {});
      if (code == 200) {
        this.list1 = data;
        this.list2 = [];
        this.list3 = [];

        this.data.secondClassCode = "";
        this.data.threeClassCode = "";
      } else {
        this.msgErr(msg);
      }
    },
    //二级分类
    async get2() {
      const url = "/campagin/selectGoodClassByCode";
      let { code, msg, data } = await postRequest(url, {
        parentCode: this.data.firstClassCode
      });
      if (code == 200) {
        this.list2 = data;
        this.list3 = [];
        this.data.threeClassCode = "";
      } else {
        this.msgErr(msg);
      }
    },
    //三级分类
    async get3() {
      const url = "/campagin/selectGoodClassByCode";
      let { code, msg, data } = await postRequest(url, {
        parentCode: this.data.secondClassCode
      });
      if (code == 200) {
        this.list3 = data;
      } else {
        this.msgErr(msg);
      }
    },
    // 删除兼容品牌
    del(index, item) {
      // console.log(this.$parent);
      this.$emit("del", index);
    },
    handleRemove(index) {
      this.$emit("del", index);
    },
    //验证正整数 	只能输入大于等于0的数值。
    validateUbay(rule, value, callback) {
      var reg = /^([0-9][0-9]*)$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于等于0的正整数"));
      }
    },
    validateBusinessName(rule, value, callback) {
      value += "";
      value = value.trim();
      // 允许不填
      if (value == "") {
        // ("请选择${businessTypeLabel}");
        return callback(`请选择${this.businessTypePlaceholder}`);
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