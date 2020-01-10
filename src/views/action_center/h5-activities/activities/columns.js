
export default [
    {
        title: "操作",
        align: "center",
        width: 240,
        fixed: "left",
        slot: "action"
    },
    {
        title: "活动名称",
        key: "name",
        align: "center",
        width: 140
    },
    {
        title: "活动ID",
        key: "id",
        align: "center",
        width: 120
    },
    // beginTime/endTime
    {
        title: "活动时间",
        key: "time",
        align: "center",
        minWidth: 100
    },
    {
        title: "活动类型",
        key: "activityTypeName",
        align: "center",
        minWidth: 140
    },
    // status
    {
        title: "当前状态",
        key: "statusName",
        align: "center",
        minWidth: 140
    },
    {
        title: "修改人",
        key: "modifiedBy",
        align: "center",
        minWidth: 140
    },
    {
        title: "修改时间",
        key: "gmtModified",
        align: "center",
        minWidth: 140
    },
];