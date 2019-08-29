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
        title: "商户类型",
        key: "groupType",
        align: "center",
        width: 120
    },
    {
        title: "商户名称",
        key: "name",
        align: "center",
        width: 120
    },
    {
        title: "预充值余额（元）",
        key: "groupType",
        align: "center",
        minWidth: 100
    },
    {
        title: "剩余U贝",
        key: "name",

        align: "center",
        minWidth: 140
    },
    {
        title: "创建时间",
        key: "bigPrizeName",
        align: "center",
        minWidth: 140
    },
]
// 报名成功用户
export const totalPlayerColumns = [{
    title: "昵称",
    key: "nickName",
    align: "center",
}, {
    title: "手机号",
    key: "phoneNumber",
    align: "center",
}, {
    title: "报名时间",
    key: "join_time",
    align: "center",
}]

export const totalTicketColumns = [{
    title: "昵称",
    key: "nickName",
    align: "center",
}, {
    title: "奖券",
    key: "ticket_code",
    align: "center",
}, {
    title: "手机号",
    key: "phoneNumber",
    align: "center",
}]

export const detailColumns = [{
    title: "昵称",
    key: "nickName",
    align: "center",
}, {
    title: "奖项",
    key: "prize",
    align: "center",
}, {
    title: "收件人",
    key: "realName",
    align: "center",
}, {
    title: "手机号",
    key: "phoneNumber",
    align: "center",
}, {
    title: "邮寄地址",
    key: "address",
    align: "center",
}, {
    title: "发放状态",
    key: "statusName",
    align: "center",
}, {
    title: "奖品发送失败备注",
    key: "memo",
    align: "center",
}, {
    title: "物流信息",
    key: "logistics",
    align: "center",
    slot: 'logistics'
}]

// --------------抽奖团banner位---------------------------------
export const bannerWayColumns = [{
        title: "操作",
        align: "center",
        width: 200,
        fixed: "left",
        slot: "action"
    }, {
        title: "抽奖id或链接",
        key: "nickName",
        align: "center",
        slot: 'idLinkUrl'
    }, {
        title: "图片",
        key: "imgUrl",
        align: "center",
        slot: "img"
    },
    // modifiedBy modifiedBy createBy 
    {
        title: "最近修改人",
        key: "createAndModifiedBy",
        align: "center",
        minWidth: 105,
        slot: 'createAndModifiedBy'
    },
    // gmtModified  gmtModified gmtCreate
    {
        title: "最近修改时间",
        key: "gmtModifiedAndCreate",
        align: "center",
        width: 170,
        slot: 'gmtModifiedAndCreate'
    },



    {
        title: "上架时间",
        key: "onlineTime",
        align: "center",
    }
]