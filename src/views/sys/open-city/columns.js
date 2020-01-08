// 开通城市
import TableExpand from './TableExpand.vue';
export default [
    {
        type: 'expand',
        width: 50,
        render: (h, params) => {
            return h(TableExpand, {
                props: {
                    row: params.row
                }
            })
        }
    },
    {
        type: 'index',
        width: 80,
        title: "序号",
        align: 'center'
    },
    {
        title: "省",
        key: "provinceName",
        align: "center",
        minWidth: 120
    },
    {
        title: "省code",
        key: "provinceCode",
        align: "center",
        minWidth: 120
    },
    {
        title: "开通状态",
        key: "opened",
        align: "center",
        minWidth: 170,
        render(h, params) {
            let { opened } = params.row;
            let text = "";
            let color = "";
            if (opened) {
                text = "已开通";
                color = "#19be6b";//success
            } else {
                text = "未开通";
                color = "#ed4014";//error
            }
            return <span {...{ style: { color } }}> {text}</span >;
        }

    },
];
// {cityName: "北京市", cityCode: "110100", opened: 0, sort: 1}
export const citycolumns = [
    {
        title: "操作",
        align: "center",
        width: 200,
        fixed: "left",
        slot: "action"
    },
    {
        type: 'index',
        width: 80,
        title: "序号",
        align: 'center'
    },
    {
        title: "市",
        key: "cityName",
        align: "center",
        minWidth: 120
    },
    {
        title: "市code",
        key: "cityCode",
        align: "center",
        minWidth: 120
    },
    {
        title: "开通状态",
        key: "opened",
        align: "center",
        minWidth: 170,
        render(h, params) {
            let { opened } = params.row;
            let text = "";
            let color = "";
            if (opened) {
                text = "已开通";
                color = "#19be6b";//success
            } else {
                text = "未开通";
                color = "#ed4014";//error
            }
            return <span style={{ color }}>{text}</span>;
        }

    },
]