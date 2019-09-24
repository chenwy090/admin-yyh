<template>
  <div class="cms">{{tab.label}}</div>
</template>
<script>
export default {
  name: "tab1",
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          id: "tab1",
          name: "xxx",
          label: "核销扫码区",
          compName: "tab1"
        };
      }
    }
  },
  computed: {},
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="less" scoped>
</style>


<style scoped>
</style>