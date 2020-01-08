// 开通城市
export default function changeOpendStatus(opened) {
    let obj = {};
    if (opened) {
        // 开通 ---> 进行关闭操作 -->未开通
        obj = {
            url: "/system/city/close",
            loading: "正在关闭...",
            loadingSuccess: "关闭成功",
            openTitle: "确认要关闭此城市吗?",
            openType: "error",
            openText: "关闭",
        };
    } else {
        // 未开通 ---> 进行开通操作
        obj = {
            url: "/system/city/open",
            loading: "正在开通...",
            loadingSuccess: "开通成功",
            openTitle: "确认要开通此城市吗?",
            openType: "success",
            openText: "开通",
        };
    }

    return obj;
}