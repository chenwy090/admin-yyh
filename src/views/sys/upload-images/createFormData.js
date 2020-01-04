export default function createFormData() {
    return {
        items: [
            {
                _id: Math.random(),
                wxnumber: '', //微信号
                imgUrl: '',// 图片地址
                defaultImgUrlList: [],
            },
        ],
    };
};