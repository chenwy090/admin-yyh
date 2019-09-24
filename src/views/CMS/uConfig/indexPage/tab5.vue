<template>
  <div class="cms">{{tab.label}}</div>
</template>
<script>
export default {
  name: "tab5",
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
         id: "tab5",
          name: "xxx",
          label: "品牌专区",
          compName: "tab5"
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