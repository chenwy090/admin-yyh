// 审核日志
export default [
    {
        title: "审核人",
        key: "createBy",
        align: "center",
        width: 160
    },
    {
        title: "审核时间",
        key: "gmtCreate",
        align: "center",
        width: 180
    },
    {
        title: "审核结果",
        key: "status",
        align: "center",
        width: 100,
        render(h, params) {
            const { status } = params.row;
            let statusText = ""
            if (status == 2) {
                statusText = "未通过";
            }
            return <span>{statusText}</span>
        }
    },
    {
        title: "审核备注",
        key: "comment",
        align: "center",
    },
];