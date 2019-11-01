
<template>
    <div class="search">
        <Card>
            <Tabs @on-click="changeTab" v-model="tab_model" value="1">
                <TabPane v-for="(item,index) in tabs" :label="item.lable" :name="item.value" :key="index"></TabPane>
            </Tabs>
            <div v-if="tab_model=='1'">
                <allOrder></allOrder>
            </div>
            <div v-if="tab_model=='2'">
                <refundCheck></refundCheck>
            </div>
        </Card>
    </div>
</template>


<script>
    import allOrder from './allOrder'
    import refundCheck from './refundCheck'
    export default {
        name: "order-manage",
        components:{allOrder,refundCheck},
        data(){
            return{
                tab_model:'1',
                tabs: [
                    {
                        lable: "全部订单",
                        value: "1"
                    },
                    {
                        lable: "退款审核",
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
