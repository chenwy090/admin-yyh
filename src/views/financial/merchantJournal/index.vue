
<template>
    <div class="search">
        <Card>
            <Tabs @on-click="changeTab" v-model="tab_model" value="1">
                <TabPane v-for="(item,index) in tabs" :label="item.lable" :name="item.value" :key="index"></TabPane>
            </Tabs>
            <ul style="display: flex;margin-bottom: 10px;">
              <li v-for="(item, i) in subtabItems" :key="item + i" @click="clickSubtab(i)" :class="{'tab-item': true, 'on': currentSubtab === i}">{{item.name}}</li>
            </ul>
            <template v-if="tab_model=='1'">
                <merchantOne v-if="currentSubtab === 0"></merchantOne>
            </template>
            <template v-if="tab_model=='2'">
                <merchantMany v-if="currentSubtab === 0"></merchantMany>
            </template>
            <WrongList ref="WrongList" v-show="currentSubtab > 0"></WrongList>
        </Card>
    </div>
</template>


<script>
    import merchantOne from './merchantOne'
    import merchantMany from './merchantMany'
    import WrongList from './WrongList'
    export default {
        name: "merchantJournal",
        components:{merchantOne,merchantMany, WrongList},
        data(){
            return{
                currentSubtab: 0,
                subtabItems: [{name: '交易流水', data: null},
                    {name: '分润异常', data: {url: '/trade/merchant/bill/sharing-failure/list',
                      index: 0,
                    }},
                    {name: '退款异常', data: {url: '/trade/merchant/bill/refund-failure/list',
                      index: 1,
                    }}
                ],
                tab_model:'1',
                tabs: [
                    {
                        lable: "商户（单店）",
                        value: "1"
                    },
                    {
                        lable: "商户（多店）",
                        value: "2"
                    }
                ],
            }
        },
        methods:{
            // 二级tab
            async clickSubtab(i) {
              this.currentSubtab = i;
              if (i > 0) {
                this.subtabItems[this.currentSubtab].data.merchantType = Number(this.tab_model);
                this.$refs.WrongList.renderData(this.subtabItems[this.currentSubtab].data);
              }
            },
            // 切换 一级tab
            changeTab(obj) {
                if (this.currentSubtab > 0) {
                  this.subtabItems[this.currentSubtab].data.merchantType = Number(this.tab_model);
                  this.$refs.WrongList.renderData(this.subtabItems[this.currentSubtab].data);
                }
            },

        }
    }
</script>

<style scoped>
.tab-item{
  list-style: none;
  padding: .3em 1em;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  cursor: pointer;
}
.tab-item:first-child{
  border-left: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
}
.tab-item:last-child{
  border-radius: 0 4px 4px 0;
}
.tab-item.on{
  color: #fff;
  background: #2db7f5;
  border-color: #2db7f5;
}
</style>
