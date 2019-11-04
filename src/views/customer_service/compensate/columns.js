

export const columns8 = [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: "昵称",
        align: "center",
        minWidth: 100,
        key: "userName"
    },
    {
        title: "用户id",
        align: "center",
        minWidth: 160,
        key: "userId"
    },
    {
        title: "券id",
        align: "center",
        minWidth: 160,
        key: "templateId"
    },
    {
        title: "发放福利",
        align: "center",
        minWidth: 100,
        key: "welfareInfo"
    },
    {
        title: "发放的类型",
        align: "center",
        minWidth: 160,
        key: "pushType"
    },
    {
        title: "发放原因",
        align: "center",
        minWidth: 160,
        key: "reason"
    },
    {
        title: "状态标志",
        align: "center",
        minWidth: 160,
        slot: "statusFlag"
    },
    {
        title: "状态",
        align: "center",
        minWidth: 160,
        key: "status"
    },
    {
        title: "操作人员",
        align: "center",
        minWidth: 120,
        key: "createBy"
    },
    {
        title: "提交时间",
        align: "center",
        minWidth: 160,
        key: "createTime"
    },
    {
        title: "发送时间",
        align: "center",
        minWidth: 160,
        key: "sendTime"
    },
    {
        title: "备注",
        align: "center",
        minWidth: 120,
        key: "remark"
    }
];
// 优惠活动列表
export const columns4 = [
    {
        title: "操作",
        align: "center",
        width: 100,
        fixed: "left",
        slot: "action"
    },
    {
        title: "类型",
        align: "center",
        minWidth: 140,
        key: "couponKind",
        slot: "couponKind"
    },
    {
        title: "优惠券ID",
        align: "center",
        minWidth: 140,
        key: "templateId"
    }
];
// 新增/编辑 周边券列表
export const columns9 = [
    {
        type: "selection",
        width: 60,
        align: "center"
    },
    {
        title: "优惠券ID",
        align: "center",
        minWidth: 140,
        key: "templateId"
    },
    {
        title: "优惠券名称",
        align: "center",
        minWidth: 140,
        key: "title"
    },
    {
        title: "所属商户",
        align: "center",
        minWidth: 140,
        key: "merchantName"
    }
];
// 超市券
export const columns10 = [
    {
        type: "selection",
        width: 60,
        align: "center"
    },
    {
        title: "优惠券ID",
        align: "center",
        minWidth: 140,
        key: "campId"
    },
    {
        title: "优惠券名称",
        align: "center",
        minWidth: 140,
        key: "name"
    }
];
// 错误数据
export const columns11 = [
    {
        title: "用户id",
        align: "center",
        minWidth: 140,
        key: "userId"
    },
    {
        title: "券id",
        align: "center",
        minWidth: 140,
        key: "templateId"
    }
];



