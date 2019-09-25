<template>
  <div class="cms">{{tab.label}}</div>
</template>
<script>
export default {
  name: "tab4",
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
        id: "tab4",
          name: "xxx",
          label: "平台分红",
          compName: "tab4"
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