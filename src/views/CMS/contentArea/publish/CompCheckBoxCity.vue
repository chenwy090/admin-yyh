<template>
  <!--  -->
  <div class="comp-check-box-city">
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
      <Checkbox
        :indeterminate="indeterminate"
        :value="checkAll"
        @click.prevent.native="handleCheckAll"
      >全选</Checkbox>
    </div>
    <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
      <Checkbox v-for="(item,index) in cityList" :key="index" :label="item">{{item.cityName}}</Checkbox>
    </CheckboxGroup>
  </div>
</template>
<script>
export default {
  props: {
    cityList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    checkAllGroup() {
      this.$emit("checked-city-list", this.checkAllGroup);
      console.log("watch:", this.checkAllGroup);
    }
  },
  data() {
    return {
      indeterminate: true,
      checkAll: false,
      checkAllGroup: []
      // data: [
      //   { cityName: "上海市", cityCode: "310100", shortName: "上海" },
      //   { cityName: "无锡市", cityCode: "320200", shortName: "无锡" },
      //   { cityName: "杭州市", cityCode: "330100", shortName: "杭州" }
      // ]
    };
  },
  methods: {
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = this.cityList;
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.cityList.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    }
  }
};
</script>
