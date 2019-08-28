<template>
    <div class="content">
        <Tabs v-if="!isCloseTab" @on-click="changeTab" v-model="currentView" type="card">
            <TabPane label="核销返奖励（用户）" name="WriteOffRewardC">
            </TabPane>
            <TabPane label="核销返奖励（商家）" name="WriteOffRewardB">
            </TabPane>
            <TabPane label="平台拓客" name="PlatformToker">
            </TabPane>
        </Tabs>
        <!--<div :is="currentView"></div>-->
        <keep-alive include="PlatformToker,WriteOffRewardB,WriteOffRewardC">
            <!-- 将缓存name为a或者b的组件，结合动态组件使用 -->
            <component @closeTab="closeTab" :is="currentView"></component>
        </keep-alive>
    </div>
</template>

<script>
    import PlatformToker from "./PlatformToker/PlatformToker"
    import WriteOffRewardB from "./WriteOffRewardB/WriteOffRewardB"
    import WriteOffRewardC from "./WriteOffRewardC/WriteOffRewardC"
    export default {
        name: "platform_marketing",
        components:{PlatformToker,WriteOffRewardB,WriteOffRewardC},
        data(){
            return{
                isCloseTab:false,
                currentView:'WriteOffRewardC',
            }
        },
        methods:{
            changeTab(obj){
                console.log(obj);
            },
            closeTab(e){
                this.isCloseTab = e;
            }
        }
    }
</script>

<style scoped>
.content{
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>
