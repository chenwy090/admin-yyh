// 商户预充值列表 商户类型 、 商户名称、 预充值余额（元）、 剩余U贝、 创建时间
export default [
    {
        title: "操作",
        align: "center",
        width: 200,
        fixed: "left",
        slot: "action"
    },
    {
        title: "内容状态",
        align: "center",
        width: 200,
        key: "statusName",
    },
    // contentAction
    {
        title: "内容",
        key: "content",
        align: "center",
        width: 120,
        slot: "content",
        render: (h, params) => {
            let { content } = params.row;
            if (content.length > 100) {
                content = "内容太长啦。。。"
            }
            return h("div", {//用来写原生的DOM属性
                domProps: {
                    innerHTML: content
                }
            });
        }
    },
    {
        title: "标签",
        key: "tagNames",
        align: "center",
        width: 120
    },
    {
        title: "类型",
        key: "sourceTypeName",
        align: "center",
        width: 120
    },

    {
        title: "热度",
        key: "hotValue",
        align: "center",
        minWidth: 170,
    },
    {
        title: "优惠券",
        key: "couponNames",
        align: "center",
        minWidth: 140,
    },
    {
        title: "城市",
        key: "cityNames",
        align: "center",
        minWidth: 140,
    },
    // {
    //     title: "适用门店",
    //     key: "shopNames",
    //     align: "center",
    //     minWidth: 150
    // },
    {
        title: "内容id",
        key: "id",
        align: "center",
        minWidth: 150
    },
    {
        title: "用户id",
        key: "userId",
        align: "center",
        minWidth: 150
    },
    {
        title: "发布时间",
        key: "createTime",
        align: "center",
        minWidth: 150
    },
    {
        title: "用户状态",
        key: "userStatusName",
        align: "center",
        minWidth: 150
    },
    {
        title: "审核人",
        key: "auditBy",
        align: "center",
        minWidth: 140
    },
]