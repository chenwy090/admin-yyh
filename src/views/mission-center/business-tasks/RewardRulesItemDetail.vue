
<template>
  <!-- 收费条目 FeeEntry -->
  <div>
    <Alert>
      <div class="item">
        <span class="fl label">商户类型：</span>
        <span class="fl">{{item.merchantTypeName}}</span>
      </div>
      <div class="item">
        <span class="fl label">商户名称：</span>
        <span class="fl">{{item.name}}</span>
      </div>
      <div class="item">
        <span class="fl label">消耗U贝：</span>
        <span class="fl">{{item.anticipatedUbay}}</span>
      </div>
      <div class="item">
        <span class="fl label">优惠券：</span>
        <span class="fl">{{item.templateName}}</span>
      </div>
      <div class="item">
        <span class="fl label">截止时间：</span>
        <span class="fl">{{item.endTime}} 领取量低于{{item.receivedNum}}任务自动终止</span>
      </div>
      <!-- ----------------------------------------------------- -->
      <Divider />
      <div>
        每领取一张券，奖励领取者
        {{item.receiveAwardUbay}}&nbsp;U贝
      </div>
      <div>
        每核销一张券，奖励领取者 {{item.useAwardUbay}}
        &nbsp;U贝
      </div>

      <Divider />
      <!-- ----------------------------------------------------- -->
      <div>
        分享券被领取，奖励分享者 {{item.shareReceiveAwardUbay}}
        &nbsp;U贝
      </div>
      <div>
        分享券被核销，奖励分享者 {{item.shareUseAwardUbay}}
        &nbsp;U贝
      </div>
      <Divider />

      <Row type="flex" justify="start">
        <Col span="8">
          <FormItem label="背景图：">
            <img :src="item.imgUrl" style="width:70px;" />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="Logo：">
            <img :src="item.logoUrl" style="width:70px;" />
          </FormItem>
        </Col>
      </Row>
      <!-- ------------------------------ -->
      <Divider />

      <Row class="share-info">
        <h3>分享设置</h3>
        <!-- 分享标题 shareTitle -->
        <div class="item">
          <span class="fl label">分享标题：</span>
          <span class="fl">{{item.shareTitle}}</span>
        </div>
      </Row>
      <!-- ----------------- -->
      <Row type="flex" justify="start">
        <Col span="8">
          <FormItem label="分享Logo：">
            <img :src="item.shareLogo" style="width:70px;" />
          </FormItem>
        </Col>
      </Row>
    </Alert>
  </div>
</template>
<script>
export default {
  name: "rules-item",
  props: {
    item: {
      type: Object,
      default: function() {
        return {
          // 奖励规则
          // 商户类型 0-本地商户（单店），1-本地商户（多店）
          merchantType: 0,
          merchantId: "", // 商户id
          merhcantName: "", // 商户名称
          brandId: "", // 品牌id
          brandName: "", // 品牌名称
          anticipatedUbay: "", // 预计消耗u贝数量
          couponType: 0, //优惠券类型 0-商超券 1-商户/周边券
          templateId: "", //券模板id
          templateName: "", //券模板名称
          endTime: "", // 任务中止时间
          receivedNum: "", // 领取数量
          receiveAwardUbay: "", // 领取奖励，u贝数
          useAwardUbay: "", // 核销奖励，u贝数
          shareReceiveAwardUbay: "", // 分享后被领取奖励u贝数
          shareUseAwardUbay: "", // 分享后被核销奖励u贝数
          defaultBannerList: [],
          imgUrl: "",
          defaultLogoList: [],
          logoUrl: "",
          defaultShareLogoList: [],
          shareLogo: ""
        };
      }
    }
  },

  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.fl {
  float: left;
}
.item {
  height: 30px;
  line-height: 30px;
  .label {
    width: 88px;
    text-align: right;
  }
}
</style>