<template>
  <div>
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      :styles="{top: '20px'}"
      width="600"
    >detail</Modal>
  </div>
</template>
<script>
export default {
  name:"detail",
  data() {
    return {
      isShow: true
    };
  }
};
</script>