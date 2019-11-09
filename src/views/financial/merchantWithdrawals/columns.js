// 商户预充值列表 商户类型 、 商户名称、 预充值余额（元）、 剩余U贝、 创建时间
export default function createColumns() {
    return [
        {
            title: "操作",
            align: "center",
            width: 180,
            fixed: "left",
            slot: "action"
        },
        {
            title: "提现单号",
            key: "orderNo",
            align: "center",
            minWidth: 120
        },
        {
            title: "商户名称", //品牌名称
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
            key: "applyAmount",
            align: "center",
            width: 150,
            render: (h, params) => {
                let { applyAmount } = params.row;
                applyAmount = applyAmount === null ? "" : `${applyAmount}￥`;
                return (
                    <span>{applyAmount}</span>
                );
            }
        },
        {
            title: "提现服务费（元）",
            key: "withdrawFee",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
                let { withdrawFee } = params.row;
                withdrawFee = withdrawFee === null ? "" : `${withdrawFee}￥`;
                return (
                    <span>{withdrawFee}</span>
                );
            }
        },
        {
            title: "提现平台收取费（元）",
            key: "platformFee",
            align: "center",
            minWidth: 120,
            render: (h, params) => {
                let { platformFee } = params.row;
                platformFee = platformFee === null ? "" : `${platformFee}￥`;
                return (
                    <span>{platformFee}</span>
                );
            }
        },
        {
            title: "提现时间",
            key: "applyTime",
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
};

export function division100(n) {
    return Math.floor10(n / 100, -2);
}


// export default (function () {
//     return function () {
//         return {};
//     }();
// }());