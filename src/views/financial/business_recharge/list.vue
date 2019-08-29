<template>
  <div class="bussiness">
    <component :is="compName" @changeComp="changeComp"></component>
  </div>
</template>
<script>
import BusinessRecharge from "./BusinessRecharge";
// import SchedulesDaily from "./schedules_daily";
// import Bannerway from "./Bannerway";

export default {
  name: "bussiness",
  components: {
    [BusinessRecharge.name]: BusinessRecharge,  
  },
  data() {
    return {
      compName: BusinessRecharge.name
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