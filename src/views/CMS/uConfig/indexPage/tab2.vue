<template>
  <div class="cms">{{tab.label}}</div>
</template>
<script>
export default {
  name: "tab2",
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          id: "tab2",
          name: "xxx",
          label: "超值爆抢券",
          compName: "tab2"
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