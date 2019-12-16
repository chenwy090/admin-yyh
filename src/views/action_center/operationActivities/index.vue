<template>
  <!-- 运营活动 -->
  <div class="xxx">
    <Activities></Activities>
  </div>
</template>
<script>
import Activities from "./activities";
export default {
  name: "xxxxxxxxxxxx",
  components: {
    Activities
    // Consume
  },
  watch: {},
  data() {
    return {};
  },
  created() {},
  methods: {}
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