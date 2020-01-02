export default function createFormData() {
    return {
        // 最多添加100个微信号
        items: [
            {
                _id: Math.random(),
                // 序号
                // 配置项：添加微信号
                // 配置值 取第一个微信的微信号
                // 修改人
                // 修改时间
                wxnumber: '', //微信号
                qrcodeImgUrl: '',// 微信二维码
                defaultQrcodeImgUrlList: [],
            },
        ],
    };
};