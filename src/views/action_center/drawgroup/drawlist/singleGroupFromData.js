export default {
    id: null,
    groupType: 1, //团类型不能为空
    name: "", //活动名称
    startTime: "", //活动开始时间
    openDrawTimeType: 1, //开奖时间配置1：固定时间、2：满多少人开奖
    openDrawTime: "", //开奖时间
    openDrawTimeNeedPlayers: 1, //type:2 满x人开奖 number
    winningRemarks: "", //领奖说明
    joinUserLevel: 1, //参加对象 用户等级
    
    drawRuleRemarks: "", //抽奖规则
    //----广告主信息：
    advertName: "", //广告主 名称
    advertIntro: "", //广告主 介绍 描述富文本
    advertBannerImgUrl: "", //广告主 banner图片url
    advertLogoImgUrl: "", //广告主 logo图片url

    // 活动大奖
    bigPrize: {
      type: 1,
      prizeName: "", //实物名称 奖项名称
      prizeNum: '', //实物个数 奖品个数
      couponType: 2, //优惠券类型1：周边券、2：商超券/ 超市券
      giftImg: "", //奖品图片地址
      prizeReferId: null //优惠券奖品关联ID
    },
    // 阳光普照奖
    normalPrize: {
      type: 1,
      prizeName: "",
      prizeNum: 0,
      couponType: 2,
      giftImg: "",
      prizeReferId: null
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