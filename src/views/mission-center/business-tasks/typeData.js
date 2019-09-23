export default function createTypeDate() {
    //  ["商户", "品牌|商户", "商超", "零售商"]
    //  本地商户（单店）本地商户（多店）商超门店零售商 
    return {
        type0: {
            type: 0,
            id: "",
            name: "",
            label: "商户",
            desc: "商户", //本地商户（单店）
            columns: [{
                    title: "商户编号",
                    align: "center",
                    width: 200,
                    key: "merchantId"
                },
                {
                    title: "商户名称",
                    align: "center",
                    width: 200,
                    key: "name"
                },
                {
                    title: "操作",
                    align: "center",
                    key: "action",
                    slot: "operate"
                }
            ],
            tableData: []
        },
        type1: {
            type: 1,
            id: "",
            name: "",
            label: "品牌",
            desc: "品牌", //本地商户（多店）
            columns: [{
                    title: "品牌名称",
                    align: "center",
                    width: 200,
                    key: "name"
                },
                {
                    title: "关联店铺数",
                    align: "center",
                    width: 200,
                    key: "relationMerchantCount"
                },
                {
                    title: "操作",
                    align: "center",
                    key: "action",
                    slot: "operate"
                }
            ],
            tableData: []
        },
        type2: {
            type: 2,
            id: "",
            name: "",
            label: "商超",
            desc: "商超门店",
            columns: [{
                    title: "知而行编号",
                    key: "shopId",
                    align: "center"
                },
                {
                    title: "门店名称",
                    key: "shopName",
                    align: "center"
                },
                {
                    title: "零售商名称",
                    key: "venderName",
                    align: "center"
                },
                {
                    title: "操作",
                    align: "center",
                    key: "action",
                    slot: "operate"
                }
            ],
            tableData: []
        },
        type3: {
            type: 3,
            id: "",
            name: "",
            label: "零售商",
            desc: "零售商",
            columns: [{
                    title: "零售商名称",
                    align: "center",
                    width: 200,
                    key: "venderName"
                },
                {
                    title: "关联店铺数",
                    align: "center",
                    width: 200,
                    key: "num"
                },
                {
                    title: "操作",
                    align: "center",
                    key: "action",
                    slot: "operate"
                }
            ],
            tableData: []
        }
    };
};