<template>
  <div class="single-group">single-group</div>
</template>
<script>
export default {
  name: "single-group",
  props: {},
  components: {
    // [MultiGroup.name]: MultiGroup,
  },
  watch: {
    modalWinningList() {
      console.log(this.modalWinningList, this.id);
      this.modalDetail = true;
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    changeComp(name) {
      this.compName = name;
    }
  }
};
</script>
<style scoped>
.draw-content {
  width: 800px;
  margin: 0 auto;
  border: 1px solid red;
  overflow: hidden;
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