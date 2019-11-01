<template>
  <div class="yyh-modal">
    <Modal class="yyh-modal" v-model="modalShow" :title="title" width="800"
      :styles="{top: '20px'}">
      <div style="height: 600px;overflow-y: auto;">
        <div class="yyh-modal-item" v-for="(el, i) in descConfig" :key="'modal_detail' + i" v-show="dataList[el[0]]">
          <span class="title">{{el[1]}}:</span>
          <span class="modal-content" v-if="el[1] === '活动开奖时间'" style="flex: 1">{{dataList[el[0]] ? dataList[el[0]] : ''}} &nbsp;&nbsp; {{dataList.openDrawTimeType == 2? ' 满' + dataList.openDrawTimeNeedPlayers + '人开奖': ''}}</span>
          <span class="modal-content" v-else-if="el[1] === '收费类型'" style="flex: 1">
            {{['免费券','付费券'][[el[0]-1]]}}
          </span>
          <span class="modal-content" v-else-if="el[1] === '售后条件'" style="flex: 1">
            <span v-for="value in el[0]">{{value.value}}</span>
          </span>
          <span class="modal-content" v-else-if="el[1] === '投放渠道'" style="flex: 1">
            <span v-for="value in el[0]">{{value.value}}</span>
          </span>
          <span class="modal-content" v-else-if="el[1] === '抽奖规则'" style="flex: 1">
            {{dataList[el[0]]}}
          </span>
          <span class="modal-content" v-else-if="el[0] in imgsConf" style="flex: 1">
            <div class="par yyh-modal-item">
              <span class="flex" style="width: 280px;">
                <!-- <span class="title width-5">列表banner</span> -->
                  <img class="mgr-1 banner-img" :src="dataList[el[0]]" alt="banner">
              </span>
              <!-- <span class="flex" style="width: 280px;">
                <span class="title width-5">详情banner</span>
                  <img class="mgr-1 banner-img" :src="dataList.advertBannerImgUrl" alt="banner">
              </span>
              <span class="flex" style="width: 280px;">
                <span class="title width-5" >logo图</span>
                  <img class="mgr-1 banner-img" :src="dataList.advertLogoImgUrl" alt="logo">
              </span> -->
            </div>
          </span>
          <span class="modal-content" v-else style="flex: 1">{{dataList[el[0]]}}</span>
        </div>

        <!-- <div class="par mgl-2 yyh-modal-item">
          <span class="flex" style="width: 280px;">
            <span class="title width-5">列表banner</span>
              <img class="mgr-1 banner-img" :src="dataList.drawActiveUrl" alt="banner">
          </span>
          <span class="flex" style="width: 280px;">
            <span class="title width-5">详情banner</span>
              <img class="mgr-1 banner-img" :src="dataList.advertBannerImgUrl" alt="banner">
          </span>
          <span class="flex" style="width: 280px;">
            <span class="title width-5" >logo图</span>
              <img class="mgr-1 banner-img" :src="dataList.advertLogoImgUrl" alt="logo">
          </span>
        </div> -->
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { postJson } from "@/libs/axios";
import { baseUrl } from "@/api/index";
export default {
  name: "ModalDetail",
  props: {
    title: {
      type: String,
      default: '查看详情'
    },
    show: {
      type: Boolean,
      default: false,
      oberser(e) {
        console.log(e)
      }
    },
    descConfig: Array,
  },
  data() {
    return {
      imgsConf: {
        img: '',
        imgUrl: '',
        couponSmallImg: '',
        couponBigImg: '',
        couponSimpleImg: '',
      },
      dataList: {
        groupType: -1
      },
      modalShow: false
    };
  },
  created() {

  },
  methods: {
    handleNone(e) {
      if (e === '' || typeof e !== 'string') {
        return ''
      }
      return `- ${e}`
    },
    handleAddress(val) {
      if (!val) {
        return ''
      }
      let e = val;
      let shopName = '';
      if (typeof e.shopName === 'string') {
        shopName = ' ' + e.shopName;
      }
      return (
        e.provinceName + ' ' + this.handleNone(e.cityName) +
        ' ' + this.handleNone(e.countryName) + shopName
      );
    },
    // 此方法给父组件调用的，勿动！！！
    async showByFather(obj) {
      console.log(this.dataList);

      if (obj) {
        this.dataList = obj;
        this.$Spin.hide();
      } else {
        this.$Spin.show();
      }
      this.modalShow = true;
    }
  }
};
</script>
<style lang="less" scoped>
.yyh-modal-item{
  display: flex;
  margin: .5em .8em;
  color: #666;

}
.yyh-modal{
  .title {
    color: #000;
    width: 18em;
    margin-right: 1em;
  }
  .banner-img{
    width: 110px; height: atuo;max-height: 600px;background: #eee;
  }
}
.flex{
  display: flex;
}
.flex-1{
  flex: 1
}
.mgr-1{
  margin-right: 1em;
}
.mgl-2{
  margin-left: 2em;
}
.par {
  margin-top: 1em;
  margin-bottom: 1em;
}
.width-5{
  width: 5em;
}
.title{
  display: inline-block;
}
.modal-content{
  max-width: 960px;
  max-height: 150px;
  overflow: auto;
  word-break: break-all;
}
</style>
