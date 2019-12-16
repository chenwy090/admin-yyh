
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
        title: "任务类型",
        key: "assignmentTypeName",
        align: "center",
        minWidth: 140
    },
    {
        title: "任务标题",
        key: "name",
        align: "center",
        minWidth: 120
    },
    {
        title: "次数限制",
        key: "executeNum",
        align: "center",
        width: 100
    },
    {
        title: "可获能量",
        key: "rewardPoints",
        align: "center",
        width: 100
    },
];