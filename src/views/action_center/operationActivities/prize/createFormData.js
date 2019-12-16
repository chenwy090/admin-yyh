export default function createFormData() {
    return {
        name: "",
        prizepoolId: "", // 所属奖池ID
        level: 2, // 1-大奖 2-普通奖
        prizeType: 1, //  奖品类型：1:实物、2：优惠券
        couponType: 1, // 优惠券类型：1：周边券、2：商超券
        couponId: "", // 优惠券ID
        couponName: "", // 优惠券名称
        prizeImg: "", // 奖品图片
        prizeValue: "", // 奖品价值
        prizeNum: "", // 奖品库存
        remainNum: "", // 剩余库存
        drawMode: 1, // 1-按概率 2-按奖池累计抽奖次数
        winningPercent: "", // 中奖概率
        winningNo: "" // 中奖对应的抽奖次数列表（按‘-’分割；针对 按奖池累计抽奖次数）}
    };
};