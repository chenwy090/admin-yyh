
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
        title: "模块样式",
        key: "styleImg",
        align: "center",
        width: 100,
        render:(h,params) =>{
            return h('div', [
                h('img', {
                    attrs: {
                        src: params.row.styleImg
                    },
                    style: {
                        width: '40px',
                        height: '40px'
                    }
                }),
            ]);
        }
    },
    {
        title: "模块ID",
        key: "id",
        align: "center",
        width: 140
    },
    {
        title: "排序",
        key: "sortBy",
        align: "center",
        width: 100
    },
    {
        title: "内容类型",
        key: "moduleType",
        align: "center",
        width: 100,
        render:(h,params) =>{
            switch (params.row.moduleType) {
                case 1:
                    return h('span', '优惠券');
                    break;
                case 2:
                    return h('span', '图片');
                    break;
            }
        }
    },
    {
        title: "内容样式",
        key: "styleName",
        align: "center",
        width: 100, 
    },
    {
        title: "商品数量",
        key: "objectNum",
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
        key: "timeStatus",
        align: "center",
        width: 100,
        render:(h,params) =>{
            switch (params.row.timeStatus) {
                case 1:
                    return h('span', '未开始');
                    break;
                case 2:
                    return h('span', '已开始');
                    break;
                case 3:
                    return h('span', '已结束');
                    break;
            }
        }
    },
    
];