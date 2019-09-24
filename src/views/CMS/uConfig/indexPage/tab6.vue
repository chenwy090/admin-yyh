<template>
  <div class="cms">{{tab.label}}</div>
</template>
<script>
export default {
  name: "tab6",
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          id: "tab6",
          name: "xxx",
          label: "好券一起领",
          compName: "tab6"
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