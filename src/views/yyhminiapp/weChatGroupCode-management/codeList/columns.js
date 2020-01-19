
export default [
    {
        title: "操作",
        align: "center",
        width: 320,
        fixed: "right",
        slot: "action"
    },
    {
        title: "活码名称",
        key: "title",
        align: "center",
        width: 300
    },
    {
        title: "活码备注",
        key: "remark",
        align: "center",
        width: 300
    },
    // beginTime/endTime
    {
        title: "关联码数量",
        key: "relatedQrcodeNum",
        align: "center",
        minWidth: 120
    },
    {
        title: "今日获取次数",
        key: "todayTimes",
        align: "center",
        minWidth: 120
    },
    // status
    {
        title: "累计获取次数",
        key: "totalTimes",
        align: "center",
        minWidth: 120
    },
    {
        title: "剩余获取次数",
        key: "surplusTimes",
        align: "center",
        minWidth: 120
    }
];