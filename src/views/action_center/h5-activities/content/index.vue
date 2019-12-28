<template>
  <div>
    <component :is="oVueComponent" :action="action"></component>
  </div>
</template>
<script>


export default {
  name: "activity-content",
  props: {
    action: {
      type: Object,
      default: () => ({
        _id: Math.random(),
        title: "编辑内容",
        type: "edit", //edit/query
        data: {}
      })
    }
  },
  computed: {
    oVueComponent() {
      let { type } = this.action;
      let compName = type == "query" ? "Detail" : "Edit";
      return () => import(`./${compName}`);
    }
  }
};
</script>