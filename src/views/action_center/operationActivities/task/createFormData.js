export default function createFormData() {
    return {
        activityId: "", // 活动id
        prizepoolId: "", // 奖池id
        assignmentType: 1, // 任务类型
        name: "", // 任务标题
        rewardPoints: "", // 奖励的能量

        // 领优惠券
        assignmentObject: "", //couponId 任务类型是1，领优惠券时此字段传优惠券id
        couponType: 1, // 优惠券类型：1：周边券、2：商超券
        couponId: "", // 优惠券ID
        couponName: "", // 优惠券名称

        // 页面类型：1-商超券 2-周边券  4-领优惠频道页 5-抽奖广场页 6-活动主页 7-优惠券详情页 8-内容详情页
        assignmentObjectType: 1, // 页面类型 |任务类型是1，领优惠券时此字段传优惠券类型，1-商超券 2-周边券 couponType
        isRecommend: 1, // 是否推荐：0-未推荐 1-被推荐

        // 邀请助力
        executeNum: ""
        // 浏览页面
    };
};