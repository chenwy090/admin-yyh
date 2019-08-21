export default {
  id: null,
  groupType: 1, //团类型不能为空
  name: "", //活动名称
  startTime: "", //活动开始时间
  openDrawTimeType: 1, //开奖时间配置1：固定时间、2：满多少人开奖
  openDrawTime: "", //开奖时间
  openDrawTimeNeedPlayers: 1, //type:2 满x人开奖 number

  winningRemarks: "", //领奖说明
  joinUserLevel: 0, //参加对象 用户等级

  // 单人团 参加条件：
  couponId: "",	//优惠券ID（单人团参团条件）
  couponName: "",	//优惠券名称
  couponType: "",	//优惠券类型1：周边券、2：商超券

  isFailureBackFee: 1, //团失败u贝返还
  drawRuleRemarks: "", //抽奖规则
  //----广告主信息：
  advertName: "", //广告主 名称
  advertIntro: "", //广告主 介绍 描述富文本
  drawActiveUrl: "",//列表banner
  advertBannerImgUrl: "", //广告主 banner图片url
  advertLogoImgUrl: "", //广告主 logo图片url

  // 大奖和阳光普照 实物图片
  bigPrizeGifImageList: [],
  normalPrizeGifImageList: [],
  //广告图数据
  defaultDrawActiveList: [],
  defaultBannerList: [],
  defaultLogoList: [],

  // 活动大奖 ［必选，单选］：  U贝：填写整数U贝数： prizeNum
  bigPrize: {
    type: 1,
    prizeName: "", //实物名称 奖项名称  实物：选择后填写实物名称，最多15个汉字
    prizeNum: 1, //实物个数 奖品个数
    giftImg: "", //奖品图片地址
    couponType: 2, //优惠券类型1：周边券、2：商超券/ 超市券 优惠券：选择领优惠券和周边券
    prizeReferId: null //优惠券奖品关联ID
  },

  //   1:实物、2：优惠券、3：U贝 
  bigPrizeTemp: {
    type: 1,
    // 1:实物
    prizeName1: "",
    prizeNum1: 1, //不可编辑
    giftImg: "", //奖品图片地址

    //2：优惠券
    couponType: 2, //优惠券类型1：周边券、2：商超券/ 超市券 优惠券：选择领优惠券和周边券
    prizeReferId: null, //优惠券奖品关联ID

    //3 U贝 
    prizeNum3: "", //可编辑

  },
  // 阳光普照奖
  normalPrize: {
    type: 1,
    prizeName: "",
    prizeNum: 1,
    giftImg: "",
    couponType: 2,
    prizeReferId: null
  },
  //   1:实物、2：优惠券、3：U贝 
  normalPrizeTemp: {
    type: 1,
    // 1:实物
    prizeName1: "",
    prizeNum1: 1, //不可编辑
    giftImg: "", //奖品图片地址

    //2：优惠券
    couponType: 2, //优惠券类型1：周边券、2：商超券/ 超市券 优惠券：选择领优惠券和周边券
    prizeReferId: null, //优惠券奖品关联ID
    prizeName2: "",

    //3 U贝 
    prizeNum3: "", //可编辑

  },
  drawDailyShopList: [
    {
      id: Math.random(),
      provinceCode: null,
      cityCode: null,
      countryCode: null, //areaId
      shopId: null,
      shopName: null,
      index: 1
    }
  ]
}