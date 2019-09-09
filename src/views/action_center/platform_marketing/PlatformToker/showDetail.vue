<template>
    <div v-if="viewDialogVisible" class="modal" @click.stop>
        <Card>
            <p slot="title">查看详情</p>
            <a href="#" slot="extra">
                <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
            </a>
            <Form ref="addOrEditModal" :label-width="80" label-position="left">
                <Row class="padding-left-12">
                    <Col span="24">
                    <FormItem label="商户名称：">
                        <span>{{data.merchantName}}</span>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="24">
                    <FormItem label="拓客时间：">
                        <span>{{data.expandTime}}</span>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="优惠券：" span="24">
                        <span>{{data.couponName}}</span>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="padding-left-12">
                    <Col span="18">
                    <FormItem label="状态：" span="24">
                        <span>{{data.statusName}}</span>
                    </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button style="margin-left: 8px;" @click="close">关闭</Button>
                </FormItem>
            </Form>
        </Card>
    </div>


</template>

<script>
    import { postRequest} from "@/libs/axios";
    export default {
        name: "showDetailModal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
            return{
                data:{}
            }
        },
        methods:{
            resetRow(row){
                postRequest(`/merchant/platform/expand/selectById`,{
                        id:row.id
                    }
                ).then(res => {
                    if (res.code === "200") {
                        this.data = res.data||{};
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            close() {
                this.$emit('setViewDialogVisible', false)
            }
        }
    }
</script>

<style scoped>
    h3{
        border-left: 3px solid #333;
        padding-left: 10px;
        margin: 15px 0;
    }
    .padding-left-12{
        padding-left: 12px;
    }
    .colof-a2{
        color:#a2a2a2;
    }
    .ivu-radio-group-vertical .ivu-radio-wrapper{
        height: auto;
    }
</style>
