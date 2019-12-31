export default function createFormData() {
    return {
        items: [
            {
                _id: Math.random(),
                wxnumber: '',
                qrcodeImgUrl: '',
                defaultQrcodeImgUrlList: [],
            },
        ],
    };
};