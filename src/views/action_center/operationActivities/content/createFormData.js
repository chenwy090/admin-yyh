export default function createFormData() {
    return {
        activityId: "",
        activityPicTextList: [
            {
                type: 1, //图文使用的位置：1-邀请助力 2-分享活动会场 3-邀请好友 4-下载APP
                id: "", //主键、自增长ID, 编辑时必传
                picUrlLabel: "邀请助力分享图",
                picUrl: "", //图片URL
                defaultPicUrlList: [],
                remarkLabel: "邀请助力分享文案",
                remark: "", //备注文案
                buttonText: "" //按钮文案
            },
            {
                type: 2, //图文使用的位置：1-邀请助力 2-分享活动会场 3-邀请好友 4-下载APP
                id: "", //主键、自增长ID, 编辑时必传
                picUrlLabel: "分享活动会场图",
                picUrl: "", //图片URL
                defaultPicUrlList: [],
                remarkLabel: "分享活动会场文案",
                remark: "", //备注文案
                buttonText: "" //按钮文案
            },
            {
                type: 3, //图文使用的位置：1-邀请助力 2-分享活动会场 3-邀请好友 4-下载APP
                id: "", //主键、自增长ID, 编辑时必传
                picUrlLabel: "邀请好友页背景",
                picUrl: "", //图片URL
                defaultPicUrlList: [],
                remarkLabel: "邀请好友页文案",
                remark: "", //备注文案
                buttonText: "" //按钮文案
            },
            {
                type: 4, //图文使用的位置：1-邀请助力 2-分享活动会场 3-邀请好友 4-下载APP
                id: "", //主键、自增长ID, 编辑时必传
                picUrlLabel: "下载APP页图片",
                picUrl: "", //图片URL
                defaultPicUrlList: [],
                remarkLabel: "下载APP页文案",
                remark: "", //备注文案
                buttonTextLabel: "下载按钮文案", //按钮文案
                buttonText: "" //按钮文案
            },
        ]
    };
};

