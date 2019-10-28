// 商户预充值列表 商户类型 、 商户名称、 预充值余额（元）、 剩余U贝、 创建时间
export default [
    {
        title: "操作",
        align: "center",
        width: 150,
        fixed: "left",
        slot: "action"
    },
    {
        title: "内容状态",
        align: "center",
        width: 100,
        key: "statusName",
    },
    // contentAction
    {
        title: "内容",
        key: "content",
        align: "left",
        width: 500,
        slot: "content",
        render: (h, params) => {
            let { title, content = "", images } = params.row;
            if (content.length > 100) {
                content = "内容太长啦。。。"
            }

            return <div>
                <h3>{title}</h3>
                <div domPropsInnerHTML={content}></div>
                <div >
                    {images.map(item => {
                        return <img width="50" src={item.imgUrl} />
                    })}
                </div>
            </div>
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
        width: 80
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
        minWidth: 80
    },
    {
        title: "用户id",
        key: "userId",
        align: "center",
        minWidth: 80
    },
    {
        title: "发布时间",
        key: "createTime",
        align: "center",
        minWidth: 180
    },
    {
        title: "用户状态",
        key: "userStatusName",
        align: "center",
        minWidth: 100
    },
    {
        title: "审核人",
        key: "auditName",
        align: "center",
        minWidth: 100
    },
]