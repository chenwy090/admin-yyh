package com.zex.drawdaily.entity.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author zhanglei
 * @description
 * @created 2019/8/15 0015
 */
@Data
@ApiModel(value = "DrawDailyActivityByIdVO")
public class DrawDailyActivityByIdVO {
    @ApiModelProperty(value = "id")
    private Long id;

    /**
     * 1:单人团、2：多人团
     */
    @ApiModelProperty(value = "1:单人团、2：多人团", required = true)
    @NotNull(message = "团类型不能为空")
    private Integer groupType;

    /**
     * 活动名称
     */
    @NotNull(message = "活动名称不能为空")
    @ApiModelProperty(value = "活动名称", required = true)
    private String name;

    /**
     * 活动开始时间
     */
    @NotNull(message = "活动开始时间不能为空")
    @ApiModelProperty(value = "活动开始时间", required = true)
    private String startTime;

    /**
     * 开奖时间配置1：固定时间、2：满多少人开奖
     */
    @ApiModelProperty(value = "开奖时间配置1：固定时间、2：满多少人开奖", required = true)
    @NotNull(message = "开奖时间配置不能为空")
    private Integer openDrawTimeType;

    /**
     * 开奖时间
     */
    @NotNull(message = "开奖时间配置不能为空")
    @ApiModelProperty(value = "开奖时间", required = true)
    private String openDrawTime;

    /**
     * 满多少人开奖
     */
    @ApiModelProperty(value = "满多少人开奖")
    private Integer openDrawTimeNeedPlayers;

    @NotNull(message = "投放门店不能为空")
    @ApiModelProperty(value = "投放门店列表", required = true)
    private List<DrawDailyShop> drawDailyShopList;

    @NotNull(message = "大奖不能为空")
    @ApiModelProperty(value = "大奖", required = true)
    private PrizeVO bigPrize;

    @NotNull(message = "阳光普照奖不能为空")
    @ApiModelProperty(value = "阳光普照奖", required = true)
    private PrizeVO normalPrize;

    /**
     * 领奖说明
     */
    @ApiModelProperty(value = "领奖说明")
    private String winningRemarks;

    /**
     * 参加活动条件用户等级
     */
    @NotNull(message = "参加对象不能为空")
    @ApiModelProperty(value = "参加对象 用户等级", required = true)
    private Integer joinUserLevel;

    /**
     * 总开团数
     */
    @NotNull(message = "总开团数不能为空")
    @ApiModelProperty(value = "总开团数", required = true)
    private Integer maxOpenGroupCount;

    /**
     * 成团人数
     */
    @NotNull(message = "成团人数不能为空")
    @ApiModelProperty(value = "成团人数", required = true)
    private Integer groupPlayerCount;

    /**
     * 开团有效分钟数
     */
    @NotNull(message = "开团有效分钟数不能为空")
    @ApiModelProperty(value = "开团有效分钟数", required = true)
    private Integer openGroupMinutes;

    /**
     * 用户开团次数
     */
    @NotNull(message = "用户开团次数不能为空")
    @ApiModelProperty(value = "用户开团次数", required = true)
    private Integer userOpenGroupCount;

    /**
     * 用户参团次数限制
     */
    @NotNull(message = "用户参团次数限制不能为空")
    @ApiModelProperty(value = "用户参团次数限制", required = true)
    private Integer userJoinGroupCount;

    /**
     * 费用类型1：U贝
     */
    @NotNull(message = "费用类型1不能为空")
    @ApiModelProperty(value = "费用类型1：U贝", required = true)
    private Integer feeType;

    /**
     * 开团费用(U贝)
     */
    @NotNull(message = "开团费用不能为空")
    @ApiModelProperty(value = "开团费用(U贝)", required = true)
    private Integer openGroupFee;

    /**
     * 参团费用(U贝 )
     */
    @NotNull(message = "参团费用不能为空")
    @ApiModelProperty(value = "参团费用(U贝 )", required = true)
    private Integer joinGroupFee;

    /**
     * 团失败是否返还费用
     */
    @NotNull(message = "团失败是否返还费用不能为空")
    @ApiModelProperty(value = "团失败是否返还费用", required = true)
    private Integer isFailureBackFee;

    /**
     * 抽奖规则描述
     */
    @NotNull(message = "抽奖规则描述不能为空")
    @ApiModelProperty(value = "抽奖规则描述", required = true)
    private String drawRuleRemarks;

    /**
     * 广告主名称
     */
    @ApiModelProperty(value = "广告主名称")
    private String advertName;

    /**
     * 广告主 描述富文本
     */
    @ApiModelProperty(value = "广告主 描述富文本")
    private String advertIntro;

    /**
     * 广告主 banner图片url
     */
    @ApiModelProperty(value = "广告主 banner图片url")
    private String advertBannerImgUrl;

    /**
     *  广告主 logo图片url
     */
    @ApiModelProperty(value = "广告主 logo图片url")
    private String advertLogoImgUrl;

    /**
     * 优惠券类型1：周边券、2：商超券
     */
    @ApiModelProperty(value = "优惠券类型1：周边券、2：商超券")
    private Integer couponType;

    /**
     * 优惠券ID（单人团参团条件）
     */
    @ApiModelProperty(value = "优惠券ID（单人团参团条件）")
    private String couponId;

    /**
     * 优惠券名称
     */
    @ApiModelProperty(value = "优惠券名称")
    private String couponName;
	
	
	
	
	public class PrizeVO {
		/**
		 * 1:实物、2：优惠券、3：U贝
		 */
		@ApiModelProperty(value = "1:实物、2：优惠券、3：U贝")
		private Integer type;

		/**
		 * 奖项名称
		 */
		@ApiModelProperty(value = "奖项名称")
		private String prizeName;

		/**
		 * 优惠券类型1：周边券、2：商超券
		 */
		@ApiModelProperty(value = "优惠券类型1：周边券、2：商超券")
		private Integer couponType;

		/**
		 * 优惠券奖品关联ID
		 */
		@ApiModelProperty(value = "优惠券奖品关联ID")
		private Integer prizeReferId;

		/**
		 * 奖品个数
		 */
		@ApiModelProperty(value = "奖品个数")
		private Integer prizeNum;

		/**
		 * 奖品图片地址
		 */
		@ApiModelProperty(value = "奖品图片地址")
		private String giftImg;
	}
	
	public class DrawDailyShop {
		/**
		 * 省代码
		 */
		@ApiModelProperty(value = "省代码")
		@NotNull(message = "省不能为空")
		private String provinceCode;

		/**
		 * 市代码
		 */
		@ApiModelProperty(value = "省代码")
		private String cityCode;

		/**
		 * 区代码
		 */
		@ApiModelProperty(value = "省代码")
		private String countryCode;

		/**
		 * 投放门店id
		 */
		@ApiModelProperty(value = "省代码")
		private Integer shopId;
	}
}
