<template>
  <Card style="height: 100%">
    <p slot="title"></p>
    <a href="#" slot="extra">
      <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回上一层</Button>
    </a>
    <Tabs value="name1" type="card">
      <TabPane label="筛选项" name="name1">
        <screenTab></screenTab>
      </TabPane>
      <TabPane label="为你推荐" name="name2">
        <recommendTab></recommendTab>
      </TabPane>
      <TabPane label="同步券" name="name3">
        <syncTab></syncTab>
      </TabPane>
    </Tabs>
  </Card>
</template>
<script>
import recommendTab from './recommendTab' // 筛选项
import screenTab from './screenTab' // 为你推荐
import syncTab from './syncTab' // 同步券
export default {
  components: {
    recommendTab,
    screenTab,
    syncTab,
  },
  inject: ['linkTo'],
  methods: {
    goback() {
      this.linkTo('cms')
    },
  },
}
</script>
<style lang="less" scoped></style>
