package com.zex.merchant.vo;

import com.baomidou.mybatisplus.annotation.TableId;
import com.zex.merchant.entity.MerchantCouponRelation;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * @author zhanglei
 * @description
 * @created 2019/10/25 0025
 */
@Data
@ApiModel(value = "周边券详情对象")
public class MerchantCouponTemplateDetailResultVO {
    /**
     * 优惠券模板ID，序列递增
     */
    @TableId(value = "template_id")
    @ApiModelProperty("优惠券模板ID")
    private String templateId;

    /**
     * 优惠标题
     */
    @ApiModelProperty("优惠标题")
    private String title;

    /**
     * 优惠副标题
     */
    @ApiModelProperty("优惠副标题")
    private String subTitle;

    /**
     * 优惠类型：1.固定金额；2.折扣；3-满减；4-体验券；5-换购券；6-赠品券；
     */
    @ApiModelProperty("优惠类型：1.固定金额；2.折扣；3-满减；4-体验券；5-换购券；6-赠品券；")
    private Integer couponType;

    /**
     * 金额，当coupon_type=1时填写
     */
    @ApiModelProperty("额，当coupon_type=1时填写")
    private BigDecimal ticketMoney;

    /**
     * 折扣百分比,当coupon_type=2时填写
     */
    @ApiModelProperty("折扣百分比,当coupon_type=2时填写")
    private Integer ticketDiscount;

    /**
     * 消费满的金额，当coupon_type=3时填写
     */
    @ApiModelProperty("消费满的金额，当coupon_type=3时填写")
    private BigDecimal fullAmout;

    /**
     * 消费减的金额，当coupon_type=3时填写
     */
    @ApiModelProperty("消费减的金额，当coupon_type=3时填写")
    private BigDecimal decreaseAmount;

    /**
     * 显示文案，当coupon_type=1或2,3是拼接文案，当coupon_type=4或者5或者6时直接填写
     */
    @ApiModelProperty("显示文案，当coupon_type=1或2,3是拼接文案，当coupon_type=4或者5或者6时直接填写")
    private String displayText;

    /**
     * 专属客服，yyh_merchant_employee表id
     */
    @ApiModelProperty("专属客服，yyh_merchant_employee表id")
    private String employeeId;

    /**
     * 分类
     */
    @ApiModelProperty("分类")
    private String category;

    /**
     * 优惠券种类：1.免费券；2.付费券；其他待扩展，如积分换购
     */
    @ApiModelProperty("优惠券种类：1.免费券；2.付费券；其他待扩展，如积分换购")
    private Integer couponKind;

    /**
     * 购买价格，单位分
     */
    @ApiModelProperty("购买价格，单位分")
    private Integer price;

    /**
     * 优惠标签-预留字段
     */
    @ApiModelProperty("优惠标签-预留字段")
    private String label;

    /**
     * 活动开始时间
     */
    @ApiModelProperty("活动开始时间")
    private LocalDateTime startDate;

    /**
     * 活动结束时间
     */
    @ApiModelProperty("活动结束时间")
    private LocalDateTime endDate;

    /**
     * 用券有效期类型：1.固定时间范围；2.相对有效期；
     */
    @ApiModelProperty("用券有效期类型：1.固定时间范围；2.相对有效期；")
    private Integer useDateType;

    /**
     * 用券开始时间；当use_date_type=1时填写
     */
    @ApiModelProperty("用券开始时间；当use_date_type=1时填写")
    private LocalDateTime useStartDate;

    /**
     * 用券结束时间；当use_date_type=1时填写
     */
    @ApiModelProperty("用券结束时间；当use_date_type=1时填写")
    private LocalDateTime useEndDate;

    /**
     * 加X天开始生效（相对领券日期）；当use_date_type=2时填写
     */
    @ApiModelProperty("加X天开始生效（相对领券日期）；当use_date_type=2时填写")
    private Integer addDaysUseStart;

    /**
     * 加Y天结束用券（相对领券日期）；当use_date_type=2时填写，Y需大于X
     */
    @ApiModelProperty("加Y天结束用券（相对领券日期）；当use_date_type=2时填写，Y需大于X")
    private Integer addDaysUseEnd;

    /**
     * 优惠券缩略图
     */
    @ApiModelProperty("优惠券缩略图")
    private String couponSmallImg;

    /**
     * 优惠券详情图
     */
    @ApiModelProperty("优惠券详情图")
    private String couponBigImg;

    /**
     * 购买须知
     */
    @ApiModelProperty("购买须知")
    private String buyNotes;

    /**
     * 券使用说明
     */
    @ApiModelProperty("券使用说明")
    private String useDesc;

    /**
     * 用户限领数量
     */
    @ApiModelProperty("用户限领数量")
    private Integer getLimit;

    /**
     * 库存数量
     */
    @ApiModelProperty("库存数量")
    private Integer stockCount;

    /**
     * 是否活动券：0-不是活动券, 1-活动券
     */
    @ApiModelProperty("是否活动券：0-不是活动券, 1-活动券")
    private Integer isActivityCoupon;

    /**
     * 人工排序字段：顺序排序，创建时前端表单默认9999
     */
    @ApiModelProperty("人工排序字段：顺序排序，创建时前端表单默认9999")
    private Integer orderBy;

    /**
     * 状态：0.创建, 1.上架,-1.下架
     */
    @ApiModelProperty("状态：0.创建, 1.上架,-1.下架")
    private Integer status;
    /**
     * 优惠券简图
     */
    @ApiModelProperty("优惠券简图")
    private String couponSimpleImg;

    /**
     * 商户名称，多个商户
     */
    @ApiModelProperty("商户名称，多个商户")
    private String merchantNames;

    /**
     * 被领取的数量
     */
    @ApiModelProperty("被领取的数量")
    private Integer receiveCount;
    /**
     * 剩余库存
     */
    @ApiModelProperty("剩余库存")
    private Integer surplusCount;
    /**
     * 来源
     */
    @ApiModelProperty("来源")
    private String source;

    /**
     * 周边劵的状态
     */
    @ApiModelProperty("周边劵的状态")
    private String templateStatus;

    @ApiModelProperty("商戶列表")
    private Set<MerchantCouponRelation> merchantList;

    /**
     *优惠券来源
     */
    @ApiModelProperty("优惠券来源")
    private Integer couponSource;

    /**
     *券码类型
     */
    @ApiModelProperty("券码类型")
    private Integer couponCodeType;

    /**
     *使用打开方式
     */
    @ApiModelProperty("使用打开方式")
    private Integer userOpenWithCoupon;

    /**
     *第三方Url
     */
    @ApiModelProperty("第三方Url")
    private String thirdUrl;

    @ApiModelProperty("新标签，是否新，1-是，0-否")
    private Integer isNew;

    @ApiModelProperty("热标签，是否新，1-是，0-否")
    private Integer isHot;

}
