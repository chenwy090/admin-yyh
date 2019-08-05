<template>
  <div>
    <div>
      <Tabs :animated="false" value="child1" @on-click="tabChange">
      <TabPane label="业务审核" name="child1"></TabPane>
      <TabPane label="财务审核" name="child2"></TabPane>
      <TabPane label="已打款" name="child3"></TabPane>
      <TabPane label="打款失败" name="child4"></TabPane>
      <TabPane label="奖励金充值管理" name="child5"></TabPane>
    </Tabs>
    </div>
    <div :is="currentView"></div>
  </div>
</template>

<script>
 import child1 from './pre-audit-list';
 import child2 from './financial-audit-list';
 import child3 from './paid-list';
 import child4 from './pay-failure-list';
 import child5 from './award-recharge-list';

 

 export default {
   data () {
     return {
       child1: 'child1',
       child2: 'child2',
       child3: 'child3',
       child4: 'child4',
       child5: 'child5',
       currentView: 'child1'
     };
   },
   methods: {
     tabChange(tabItem) {
       this.currentView = tabItem;
     }
   },
   components: {
     child1,
     child2,
     child3,
     child4,
     child5
   }
 };
</script>