export default function createFormData() {
    return {
        items: [
            {
                _id: Math.random(),
                title: '', //标题
                imgUrl: '',// 图片地址
                defaultImgUrlList: [],
            },
        ],
    };
};