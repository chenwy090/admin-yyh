<template>
    <div style="height: 100%">
        <div style="min-height: 100%">
            <Card style="height: 100%">
                <div>
                    <Row>
                        <Table
                                :loading="TableLoading"
                                border
                                :columns="tableColumns"
                                :data="listData"
                                sortable="custom"
                                ref="table"
                        >
                            <!-- <template slot-scope="{ row }" slot="action">
                                <Button
                                        type="info"
                                        style="margin-right: 5px"
                                        size="small"
                                        @click="transactionFlowDialog(row)"
                                >交易流水</Button>
                                <Button
                                        type="info"
                                        style="margin-right: 5px"
                                        size="small"
                                        @click="thawingFlowDialog(row)"
                                >分账流水</Button>
                            </template> -->
                        </Table>
                    </Row>
                    <!-- 分页 -->
                    <Row type="flex" justify="end" class="page">
                        <Page
                                :total="totalSize"
                                show-total
                                show-elevator
                                @on-change="changeCurrent"
                                style="float: right"
                                :current.sync="current"
                        ></Page>
                    </Row>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import { postJson } from "@/libs/axios";
    import { baseUrl } from "@/api/index";
    export default {
        name: "WrongList",
        data(){
            return{
                current: 1,
                pageSize: 10,
                totalSize: 0,
                listData: [],
                TableLoading: false,
                tableColumns: [],
                columns: [
                  [
                    {
                        title: "异常原因",
                        minWidth: 200,
                        align: "center",
                        key: "failureMsg",
                        // fixed: "left"
                    },
                    {
                        title: "订单号",
                        width: 180,
                        align: "center",
                        key: "orderNo"
                    },
                    {
                        title: "交易单号",
                        width: 180,
                        align: "center",
                        key: "tradeNo",
                    },
                    {
                        title: "优惠券名称",
                        minWidth: 150,
                        align: "center",
                        key: "couponName",
                    },
                    {
                        title: "券码",
                        width: 150,
                        key: "barcode"
                    },
                    // {
                    //     title: "核销时间",
                    //     minWidth: 250,
                    //     key: "modifiedTime"
                    // },
                    {
                        title: "商户名称",
                        minWidth: 200,
                        align: "center",
                        key: "merchantName"
                    },
                    {
                        title: "核销金额",
                        minWidth: 100,
                        align: "center",
                        key: "paidAmount"
                    },
                    {
                        title: "平台分润（%）",
                        minWidth: 120,
                        align: "center",
                        key: "platformProfitRate"
                    },
                    {
                        title: "平台分润费（含通道）",
                        minWidth: 120,
                        align: "center",
                        key: "totalFee"
                    },
                    {
                        title: "平台分润费（元）",
                        minWidth: 120,
                        align: "center",
                        key: "platformProfitFee"
                    },
                    {
                        title: "支付通道费（元）",
                        minWidth: 120,
                        align: "center",
                        key: "payChannelFee"
                    },
                    {
                        title: "结算金额（元）",
                        minWidth: 120,
                        align: "center",
                        key: "paidAmount"
                    },
                    {
                        title: "支付方式",
                        minWidth: 100,
                        align: "center",
                        key: "payTypeDesc"
                    },
                    {
                        title: "渠道流水号",
                        minWidth: 120,
                        align: "center",
                        key: "channelNo"
                    },
                    {
                        title: "交易类型",
                        minWidth: 100,
                        align: "center",
                        key: "tradeTypeDesc"
                    },
                    {
                        title: "交易时间",
                        minWidth: 100,
                        align: "center",
                        key: "tradeTime"
                    }
                  ],
                  [
                    {
                        title: "异常原因",
                        minWidth: 200,
                        align: "center",
                        key: "failureMsg",
                        // fixed: "left"
                    },
                    {
                        title: "订单号",
                        width: 180,
                        align: "center",
                        key: "orderNo"
                    },
                    {
                        title: "交易单号",
                        width: 180,
                        align: "center",
                        key: "tradeNo",
                    },
                    {
                        title: "优惠券名称",
                        width: 200,
                        align: "center",
                        key: "couponName",
                    },
                    // {
                    //     title: "券码",
                    //     width: 200,
                    //     key: "freezeAmount"
                    // },
                    // {
                    //     title: "核销时间",
                    //     minWidth: 250,
                    //     key: "modifiedTime"
                    // },
                    {
                        title: "商户名称",
                        minWidth: 200,
                        align: "center",
                        key: "merchantName"
                    },
                    {
                        title: "交易金额",
                        minWidth: 200,
                        align: "center",
                        key: "orderAmount"
                    },
                    {
                        title: "平台分润（%）",
                        minWidth: 100,
                        align: "center",
                        key: "platformProfitRate"
                    },
                    {
                        title: "平台分润费（含通道）",
                        minWidth: 120,
                        align: "center",
                        key: "totalFee"
                    },
                    {
                        title: "平台分润费（元）",
                        minWidth: 120,
                        align: "center",
                        key: "platformProfitFee"
                    },
                    {
                        title: "支付通道费（元）",
                        minWidth: 120,
                        align: "center",
                        key: "payChannelFee"
                    },
                    {
                        title: "结算金额（元）",
                        minWidth: 120,
                        align: "center",
                        key: "paidAmount"
                    },
                    {
                        title: "支付方式",
                        minWidth: 100,
                        align: "center",
                        key: "payTypeDesc"
                    },
                    {
                        title: "渠道流水号",
                        minWidth: 120,
                        align: "center",
                        key: "channelNo"
                    },
                    {
                        title: "交易类型",
                        minWidth: 100,
                        align: "center",
                        key: "tradeTypeDesc"
                    },
                    {
                        title: "审核时间",
                        minWidth: 100,
                        align: "center",
                        key: "auditTime"
                    }
                  ]
                ],
                parentData: {},
            }
        },
        methods:{
            renderData(e) {
              console.log(e, 124);
              this.parentData = e;
              this.current = 1;
              this.tableColumns = this.columns[e.index];
              this.getData();
            },
            getData() {
              // this.$Spin.show();
              // setTimeout(_ => {
              //   this.$Spin.hide();
              // }, 10000);
              this.TableLoading = true;
              let params = {
                merchantType: this.parentData.merchantType,
                pageNum: this.current,
                pageSize: this.pageSize
              }
              postJson(
                baseUrl + this.parentData.url, params
              )
                .then(res => {
                  console.log(res, 77);
                  this.TableLoading = false;
                  if (res.code == 200) {
                    this.listData = res.data.records;
                    this.totalSize = res.data.total;
                    // this.totalSize
                    console.log(this.listData, 277);
                  }
                })
                .catch(err => {
                  this.TableLoading = false;
                  console.log(err, "financial/merchantJournal 335");
                });
            },

            changeCurrent(current) {
                this.current = current;
                this.getData();
            }
        }
    }
</script>

<style scoped>
    .operation {
        margin-bottom: 2vh;
    }
</style>
