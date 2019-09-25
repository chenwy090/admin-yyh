<template>
    <div class="content">
        <h3  v-if="!isCloseTab" >请选择配置模块</h3>
        <div v-if="!isCloseTab" class="table-box">
            <div class="table-item" @click="changeTab('bannerPage')">
                <div class="table-item-right">
                    <h3>开机广告</h3>
                </div>
            </div>
            <div class="table-item" @click="changeTab('bannerPage')">
                <div class="table-item-right">
                    <h3>首页</h3>
                </div>
            </div>
            <div class="table-item" @click="changeTab('bannerPage')">
                <div class="table-item-right">
                    <h3>赚钱banner</h3>
                </div>
            </div>
        </div>
        <!--<div :is="currentView"></div>-->
        <keep-alive include="WriteOffRewardC">
            <!-- 将缓存name为a或者b的组件，结合动态组件使用 -->
            <component @close="closeTab" :is="currentView"></component>
        </keep-alive>
    </div>
</template>

<script>
    import bannerPage from "./bannerPage/bannerPage"

    export default {
        name: "u-config",
        components: {bannerPage, },
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
    .content>h3{
        font-size: 24px;
        padding: 20px;
    }
    .table-box {
        width: 100%;
        display: flex;
        height: 120px;
        justify-content: space-between;
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
    .table-item-right{
        flex: 1;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        justify-content: space-evenly;
    }
    .table-item-right h3{
        text-align: center;
    }
    .table-item-right p{
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
