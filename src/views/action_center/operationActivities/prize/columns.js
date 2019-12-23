
export default [
    {
        title: "操作",
        align: "center",
        width: 180,
        fixed: "right",
        slot: "action"
    },
    {
        type: 'index',
        width: 60,
        title: "序号",
        align: 'center'
    },
    {
        title: "奖品名称",
        key: "name",
        align: "center",
        width: 140
    },
    // prizeType 奖品类型：1:实物、2：优惠券
    {
        title: "奖品类型",
        key: "prizeTypeName",
        align: "center",
        width: 120
    },
    {
        title: "消耗积分",
        key: "couponPrizeCount",
        align: "center",
        width: 100,
        render: (h, params) => {
            let { level } = params.row;
            let levelOption = { 2: "小奖100", 1: "大奖1000" };
            return <span>{levelOption[level]}</span>
        }
    },
    {
        title: "总库存",
        key: "prizeNum",
        align: "center",
        minWidth: 140
    },
    {
        title: "剩余库存",
        key: "remainNum",
        align: "center",
        minWidth: 140
    },
    {
        title: "奖品价值（元）",
        key: "prizeValue",
        align: "center",
        minWidth: 140
    },
    {
        title: "中奖概率（%）",
        key: "winningPercent",
        align: "center",
        minWidth: 140
    },
];

export const detailColumns = [
    {
        type: 'index',
        width: 60,
        title: "序号",
        align: 'center'
    },
    {
        title: "奖品名称",
        key: "name",
        align: "center",
        width: 140
    },
    // prizeType 奖品类型：1:实物、2：优惠券
    {
        title: "奖品类型",
        key: "prizeTypeName",
        align: "center",
        width: 120
    },
    {
        title: "消耗积分",
        key: "couponPrizeCount",
        align: "center",
        width: 100,
        render: (h, params) => {
            let { level } = params.row;
            let levelOption = { 2: "小奖100", 1: "大奖1000" };
            return <span>{levelOption[level]}</span>
        }
    },
    {
        title: "总库存",
        key: "prizeNum",
        align: "center",
        minWidth: 140
    },
    {
        title: "剩余库存",
        key: "remainNum",
        align: "center",
        minWidth: 140
    },
    {
        title: "奖品价值（元）",
        key: "prizeValue",
        align: "center",
        minWidth: 140
    },
    {
        title: "中奖概率（%）",
        key: "winningPercent",
        align: "center",
        minWidth: 140
    },
];