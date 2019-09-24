<template>
  <div class="cms">{{tab.label}}</div>
</template>
<script>
export default {
  name: "tab3",
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          id: "tab3",
          name: "xxx",
          label: "免费抽大奖",
          compName: "tab3"
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