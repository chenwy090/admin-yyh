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
        title: "提现单号",
        key: "applyAmount",
        align: "center",
        minWidth: 120
    },
    {
        title: "商户名称",
        key: "merchantName",
        align: "center",
        minWidth: 100
    },
    {
        title: "省/市",
        key: "provinceName", //provinceName/cityName
        align: "center",
        minWidth: 120,
        render: (h, params) => {
            let { provinceName, cityName } = params.row;

            provinceName = provinceName || "";
            cityName = cityName || "";
            return (
                <span>{`${provinceName}/${cityName}`}</span>
            );
        }
    },
    {
        title: "提现人姓名",
        key: "userName",
        align: "center",
        width: 150,
    },
    {
        title: "提现人手机",
        key: "userPhone",
        align: "center",
        width: 150,
    },
    {
        title: "提现金额（元）",
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
    {
        title: "提现服务费（元）",
        key: "auditStatusDesc",
        align: "center",
        minWidth: 100
    },
    {
        title: "提现平台收取费（元）",
        key: "auditBy",
        align: "center",
        minWidth: 120,
        render: (h, params) => {
            let { withdrawMin } = params.row;
            withdrawMin = withdrawMin === null ? "不限制" : `${withdrawMin}￥`;
            return (
                <span>{withdrawMin}</span>
            );
        }
    },
    {
        title: "提现时间",
        key: "auditTime",
        align: "center",
        minWidth: 160
    },
    {
        title: "审核状态",
        key: "auditStatusDesc",
        align: "center",
        minWidth: 130,
    },
    {
        title: "开票",
        key: "invoiceStatusDesc",
        align: "center",
        minWidth: 130,
    }
];


export function division100(n) {
    return Math.floor10(n / 100, -2);
}