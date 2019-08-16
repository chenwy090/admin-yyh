<template>
  <div class="draw">
    <component :is="compName" @changeComp="changeComp"></component>
  </div>
</template>
<script>
import DrawConfig from "./DrawConfig";
import SchedulesDaily from "./schedules_daily";
import Bannerway from "./Bannerway";

export default {
  name: "draw",
  components: {
    [DrawConfig.name]: DrawConfig,
    [SchedulesDaily.name]: SchedulesDaily,
    [Bannerway.name]: Bannerway
  },
  data() {
    return {
      compName: DrawConfig.name
    };
  },
  methods: {
    changeComp(name) {
      this.compName = name;
    }
  }
};
</script>
<style scoped>
</style>