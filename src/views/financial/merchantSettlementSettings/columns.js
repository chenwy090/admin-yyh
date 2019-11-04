// 商户预充值列表 商户类型 、 商户名称、 预充值余额（元）、 剩余U贝、 创建时间
export default [
    {
        title: "操作",
        align: "center",
        width: 180,
        fixed: "left",
        slot: "action"
    },
    {
        title: "结算商户",
        key: "merchantName",
        align: "center",
        minWidth: 120
    },
    /**
     * merchantType:
     * 0 merchantName
     * 1 brandName
     */
    {
        title: "商户类型",
        key: "merchantTypeDesc",
        align: "center",
        minWidth: 80
    },
    {
        title: "提现账号",
        key: "withdrawAccountNumber",
        align: "center",
        minWidth: 80
    },
    {
        title: "最低提现金额",
        key: "withdrawMin",
        align: "center",
        width: 150,
        render: (h, params) => {
            let { withdrawMin } = params.row;
            return (
                <span>{`${withdrawMin}￥`}</span>
            );
        }
    },

    {
        title: "商户分润比例",
        key: "merchantSharePercentage",
        align: "center",
        width: 150,
        render: (h, params) => {
            let { merchantSharePercentage: per } = params.row;
            return (
                <span>{`${per}%`}</span>
            );
        }
    },
    {
        title: "平台分润比例",
        key: "platformSharePercentage",
        align: "center",
        width: 150,
        render: (h, params) => {
            let { platformSharePercentage: per } = params.row;
            return (
                <span>{`${per}%`}</span>
            );
        }
    },
    // status
    {
        title: "审核状态",
        key: "auditDesc",
        align: "center",
        minWidth: 100
    },
    {
        title: "操作人",
        key: "auditBy",
        align: "center",
        minWidth: 120
    },
    {
        title: "操作时间",
        key: "auditTime",
        align: "center",
        minWidth: 160
    },
    {
        title: "审核日志",
        align: "center",
        minWidth: 160,
        slot: "auditLog",
    },
];


export const auditLogColoumns = [
    {
        title: "审核人",
        key: "auditUserName",
        align: "center",
        width: 160
    },
    {
        title: "审核时间",
        key: "auditTime",
        align: "center",
        width: 180
    },
    {
        title: "审核结果",
        key: "auditDesc",
        align: "center",
        width: 100
    },
    {
        title: "审核备注",
        key: "auditResultDesc",
        align: "center",
    },
];
export const withdrawUserColumns = [
    {
        title: "userID",
        key: "userID",
        align: "center"
    },
    {
        title: "手机号",
        key: "shopName",
        align: "center"
    },
    {
        title: "微信昵称",
        key: "venderName",
        align: "center"
    },
    {
        title: "头像",
        key: "venderName",
        align: "center"
    },
    {
        title: "商户角色",
        key: "venderName",
        align: "center"
    },
    {
        title: "操作",
        align: "center",
        key: "action",
        slot: "operate"
    }
];





export function division100(n) {
    return Math.floor10(n / 100, -2);
}