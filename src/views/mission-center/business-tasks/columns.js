// 商户预充值列表 商户类型 、 商户名称、 预充值余额（元）、 剩余U贝、 创建时间
export default [{
        title: "操作",
        align: "center",
        width: 200,
        fixed: "left",
        slot: "action"
    },
    {
        title: "序号",
        type: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: "任务名称",
        key: "name",
        align: "center",
        width: 120
    },
    {
        title: "预计消耗U贝",
        key: "anticipatedUbay",
        align: "center",
        width: 120
    },

    {
        title: "有效期",
        key: "startTimeAndEndTime",
        align: "center",
        minWidth: 160,
    },
    {
        title: "审核",
        key: "statusName",
        align: "center",
        minWidth: 140,
    },
    {
        title: "状态",
        key: "isStopName",
        align: "center",
        minWidth: 140,
    },
    {
        title: "创建时间",
        key: "gmtCreate",
        align: "center",
        minWidth: 140
    },
    {
        title: "操作人",
        key: "createBy",
        align: "center",
        minWidth: 140
    },
]
// 资金明细列表
export const udataColumns = [{
        title: "序号",
        type: 'index',
        width: 60,
        align: 'center'
    },
    {
        title: "用户ID",
        key: "id",
        align: "center",
        width: 120
    },
    {
        title: "用户昵称",
        key: "name",
        align: "center",
        width: 120
    },
    {
        title: "手机",
        key: "groupType",
        align: "center",
        width: 120
    },

    {
        title: "优惠券",
        key: "groupType",
        align: "center",
        minWidth: 100
    },
    {
        title: "类型",
        key: "name",
        align: "center",
        minWidth: 140
    },
    {
        title: "名称",
        key: "bigPrizeName",
        align: "center",
        minWidth: 140
    },
    {
        title: "奖励类型",
        key: "bigPrizeName",
        align: "center",
        minWidth: 140
    }, {
        title: "获得U贝",
        key: "bigPrizeName",
        align: "center",
        minWidth: 140
    }, {
        title: "创建时间",
        key: "bigPrizeName",
        align: "center",
        minWidth: 140
    },
]