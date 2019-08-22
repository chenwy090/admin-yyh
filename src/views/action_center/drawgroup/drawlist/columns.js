// 抽奖团配置表格列表
export default [{
        title: "操作",
        align: "center",
        width: 200,
        fixed: "left",
        slot: "action"
    },
    {
        type: 'index',
        width: 60,
        title: "序号",
        align: 'center'
    },
    {
        key: "id",
        title: "ID",
        align: "center",
        width: 120
    },

    {
        title: "状态",
        key: "statusName",
        align: "center",
        width: 120
    },
    {
        title: "团类型",
        key: "groupType",
        align: "center",
        minWidth: 100
    },
    {
        key: "name",
        title: "抽奖名称",
        align: "center",
        minWidth: 140
    },
    {
        title: "大奖",
        key: "bigPrizeName",
        align: "center",
        minWidth: 140
    },
    {
        title: "阳光普照奖",
        key: "normalPrizeName",
        align: "center",
        minWidth: 140
    },
    {
        title: "抽奖开始时间",
        key: "startTime",
        align: "center",
        width: 170
    },
    {
        title: "抽奖开奖时间",
        key: "openDrawTime",
        align: "center",
        width: 170
    },
    {
        title: "广告主",
        key: "advertName",
        align: "center",
        minWidth: 80
    },

    // modifiedBy createBy
    {
        title: "最近修改人",
        key: "createAndModifiedBy",
        align: "center",
        minWidth: 105,
        slot: 'createAndModifiedBy'
    },
    // gmtModified gmtCreate
    {
        title: "最近修改时间",
        key: "gmtModifiedAndCreate",
        align: "center",
        width: 170,
        slot: 'gmtModifiedAndCreate'
    },
    {
        title: "报名成功用户",
        key: "totalPlayer",
        align: "center",
        minWidth: 120,
        slot: 'totalPlayer'
    },
    {
        title: "排列五数字",
        key: "winningRefValue",
        align: "center",
        minWidth: 140
    },
    {
        title: "抽奖券",
        key: "totalTicket",
        align: "center",
        minWidth: 140,
        slot: 'totalTicket'
    },
    {
        title: "开奖结果",
        key: "winningRefValue",
        align: "center",
        minWidth: 140,
        slot: 'result'
    }
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