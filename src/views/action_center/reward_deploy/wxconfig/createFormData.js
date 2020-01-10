export default function createFormData() {
    return {
        // 最多添加100个微信号
        items: [
            {
                _id: Math.random(),
                id: "",
                wechatNo: '', //微信号
                groupUrl: '',// 微信二维码
                defaultGroupUrlList: [],
                isDeleted:0,
            },
        ],
    };
};