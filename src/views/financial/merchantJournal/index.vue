
<template>
    <div class="search">
        <Card>
            <Tabs @on-click="changeTab" v-model="tab_model" value="1">
                <TabPane v-for="(item,index) in tabs" :label="item.lable" :name="item.value" :key="index"></TabPane>
            </Tabs>
            <div v-if="tab_model=='1'">
                <merchantOne></merchantOne>
            </div>
            <div v-if="tab_model=='2'">
                <merchantMany></merchantMany>
            </div>
        </Card>
    </div>
</template>


<script>
    import merchantOne from './merchantOne'
    import merchantMany from './merchantMany'
    export default {
        name: "merchantJournal",
        components:{merchantOne,merchantMany},
        data(){
            return{
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
            // 切换tab
            changeTab(obj) {
                console.log(this.tab_model);
                // console.log(obj);
                // switch (obj) {
                // case "57":
                //     this.add_info.campType = "57";
                //     this.add_info.couponType = "";
                //
                //     // this.couponTypeDisabled = false;
                //
                //     break;
                // case "62":
                //     this.add_info.campType = "62";
                //     this.add_info.couponType = "2";
                //
                //     this.add_info.dateType = "2";
                //     // this.share();
                //     // this.couponTypeDisabled = true;
                //     break;
                // case "63":
                //     this.add_info.campType = "63";
                //     this.add_info.couponType = "4";
                //
                //     this.add_info.dateType = "2";
                //     // this.couponTypeDisabled = true;
                //     break;
                // case "64":
                //     this.add_info.campType = "64";
                //     this.add_info.couponType = "4";
                //
                //     this.add_info.dateType = "2";
                //     // this.couponTypeDisabled = true;
                //     break;
                // }
                //
                // this.updateTableList();
            },

        }
    }
</script>

<style scoped>

</style>
