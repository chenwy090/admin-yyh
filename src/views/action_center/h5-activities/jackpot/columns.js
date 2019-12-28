
export default [
    {
        title: "操作",
        align: "center",
        width: 180,
        fixed: "right",
        slot: "action"
    },
    {
        title: "模块名称",
        key: "name",
        align: "center",
        width: 140
    },
    {
        title: "排序",
        key: "order",
        align: "center",
        width: 100
    },
    {
        title: "商品数量",
        key: "productNum",
        align: "center",
        width: 100
    },
    // beginTime/endTime
    {
        title: "适用时间",
        key: "time",
        align: "center",
        minWidth: 120
    },
    {
        title: "状态",
        key: "status",
        align: "center",
        width: 100,
        render:(h,params) =>{
            switch (params.row.status) {
                case 0:
                    return h('span', '已结束');
                    break;
                case 1:
                    return h('span', '未开始');
                    break;
                case 2:
                    return h('span', '进行中');
                    break;
            }
        }
    },
    
];