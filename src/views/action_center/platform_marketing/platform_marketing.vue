<template>
    <div class="content">
        <!--<Tabs v-if="!isCloseTab" @on-click="changeTab" v-model="currentView" type="card">-->
        <!--<TabPane label="核销返奖励（用户）" name="WriteOffRewardC">-->
        <!--</TabPane>-->
        <!--<TabPane label="核销返奖励（商家）" name="WriteOffRewardB">-->
        <!--</TabPane>-->
        <!--<TabPane label="平台拓客" name="PlatformToker">-->
        <!--</TabPane>-->
        <!--</Tabs>-->
        <div v-if="!isCloseTab" class="table-box">
            <div class="table-item" @click="changeTab('WriteOffRewardC')">
                <div class="table-item-left">
                    <div class="img-box" style="text-align:center;line-height: 60px;">
                        <img src="../../../assets/WriteOffRewardC.png" alt="">
                    </div>
                </div>
                <div class="table-item-right">
                    <h3>核销返奖励（用户）</h3>
                    <p>用户核券后，即可获得优惠券、U贝奖励</p>
                </div>
            </div>
            <div class="table-item" @click="changeTab('WriteOffRewardB')">
                <div class="table-item-left">
                    <div class="img-box" style="text-align:center;line-height: 60px;">
                        <img src="../../../assets/WriteOffRewardB.png" alt="">
                    </div>
                </div>
                <div class="table-item-right">
                    <h3>核销返奖励（商家）</h3>
                    <p>奖励商户核销员，提升店员核销积极性</p>
                </div>
            </div>
            <div class="table-item" @click="changeTab('PlatformToker')">
                <div class="table-item-left">
                    <div class="img-box" style="text-align:center;line-height: 60px;">
                        <img src="../../../assets/PlatformToker.png" alt="">
                    </div>
                </div>
                <div class="table-item-right">
                    <h3>平台拓客</h3>
                    <p>推送精准客户给到门店，提升门店销量</p>
                </div>
            </div>
        </div>
        <!--<div :is="currentView"></div>-->
        <keep-alive include="PlatformToker,WriteOffRewardB,WriteOffRewardC">
            <!-- 将缓存name为a或者b的组件，结合动态组件使用 -->
            <component @close="closeTab" :is="currentView"></component>
        </keep-alive>
    </div>
</template>

<script>
    import PlatformToker from "./PlatformToker/PlatformToker"
    import WriteOffRewardB from "./WriteOffRewardB/WriteOffRewardB"
    import WriteOffRewardC from "./WriteOffRewardC/WriteOffRewardC"

    export default {
        name: "platform_marketing",
        components: {PlatformToker, WriteOffRewardB, WriteOffRewardC},
        data() {
            return {
                isCloseTab: false, currentView: '',
            }
        },
        methods: {
            changeTab(obj) {
                console.log(obj);
                this.currentView = obj;
                this.isCloseTab = true;
            },
            closeTab(e) {
                this.isCloseTab = e;
                this.currentView = '';
            }
        }
    }
</script>

<style scoped>
    .content {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }

    .table-box {
        width: 100%;
        display: flex;
        height: 120px;
        justify-content: space-around;
        box-sizing: border-box;
    }
    .table-item{
        flex: 1;
        min-width: 200px;
        max-width: 400px;
        display: flex;
        background: #dbdbdb;
        margin: 20px;
        cursor: pointer;
    }
    .table-item-left{
        width: 80px;
        min-width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .table-item-left .img-box{
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 30px;
    }
    .img-box img{
        width: 100%;
    }
    .table-item-right{
        flex: 1;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        justify-content: space-evenly;
    }
    .table-item-right p{
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
