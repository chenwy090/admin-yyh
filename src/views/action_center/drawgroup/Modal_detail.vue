<template>
  <div class="yyh-modal">
    <Modal class="yyh-modal" v-model="modalShow" title="详情"
      :styles="{top: '20px'}">
      <div v-if="dataList.groupType !== -1">
        <div class="yyh-modal-item" v-for="(el, i) in descConfig[Number(dataList.groupType-1)]" :key="'modal_detail' + i">
          <span class="title" style="width: 8em">{{el[1]}}:</span>
          <span v-if="el[1] === '投放门店'" style="flex: 1">{{handleAddress(dataList[el[0]])}}</span>
          <span v-else-if="el[1] === '活动大奖'" style="flex: 1;">
            <div style="display: flex;">
<<<<<<< HEAD
              <img v-if="dataList[el[0]].type == '2'" class="mgr-1 banner-img" :src="dataList[el[0]].giftImg" alt="奖品图">
=======
              <img v-if="dataList[el[0]].type == '2'" class="mgr-1 " style="width: 100px; height: 100px;background: #ddd;" :src="dataList[el[0]].giftImg" alt="奖品图">
>>>>>>> feature/branch_zhanglei_1.5.4
              <span class="mgr-1 flex-1">奖品名称：{{dataList[el[0]].type == '3' ? dataList[el[0]].prizeName + 'U贝' : dataList[el[0]].prizeName}}
                &nbsp;({{dataList[el[0]].prizeNum}}位)
              </span>
            </div>
          </span>
          <span v-else-if="el[1] === '阳光普照奖'" style="flex: 1">
            <div style="display: flex;">
<<<<<<< HEAD
              <img v-if="dataList[el[0]].type == '2'" class="mgr-1 banner-img" :src="dataList[el[0]].prizeName" alt="奖品图">
              <span class="mgr-1 flex-1">奖品名称：<span v-show="dataList[el[0]].type == '3'">&nbsp;{{dataList[el[0]].prizeNum}}</span>{{dataList[el[0]].type == '3' ? dataList[el[0]].prizeName + 'U贝' : dataList[el[0]].prizeName}}
                <span v-show="dataList[el[0]].type != '3' && dataList[el[0]].prizeNum">&nbsp;({{dataList[el[0]].prizeNum}}位)</span>
=======
              <img v-if="dataList[el[0]].type == '2'" class="mgr-1 " style="width: 100px; height: 100px;background: #ddd;" :src="dataList[el[0]].prizeName" alt="奖品图">
              <span class="mgr-1 flex-1">奖品名称：{{dataList[el[0]].type == '3' ? dataList[el[0]].prizeName + 'U贝' : dataList[el[0]].prizeName}}
                &nbsp;({{dataList[el[0]].prizeNum}}位)
>>>>>>> feature/branch_zhanglei_1.5.4
              </span>
            </div>
          </span>
          <span v-else-if="el[1] === '参与对象'" style="flex: 1">{{dataList[el[0]] ? dataList[el[0]] : dataList.joinUserLevel == 0 ? '全部' : ''}}</span>
          <span v-else style="flex: 1">{{dataList[el[0]] !== undefined ? dataList[el[0]] : ''}}{{el[1] === '开团有效时间'? ' 分钟': ''}}</span>
        </div>
        <!-- 广告主相关 -->
        <div class="par">
          广告主信息:
        </div>
        <div class="par mgl-2 yyh-modal-item">
          <span class="title" style="width: 3em">名称：</span><span class="flex-1">{{typeof dataList.advertName === 'string' ? dataList.advertName : ''}}</span>
        </div>
        <div class="par mgl-2 yyh-modal-item">
          <span class="title" style="width: 3em">简介：</span><span class="flex-1" v-html="typeof dataList.advertIntro === 'string' ? dataList.advertIntro : ''"></span>
        </div>
        <div class="par mgl-2 yyh-modal-item">
          <span class="flex" style="width: 280px;">
            <span class="title width-5">banner图</span>
              <img class="mgr-1 banner-img" :src="dataList.advertBannerImgUrl" alt="banner">                        
          </span>
          <span class="flex" style="width: 280px;">
            <span class="title width-5" >logo图</span>
              <img class="mgr-1 banner-img" :src="dataList.advertLogoImgUrl" alt="logo">            
          </span>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { postJson } from "@/libs/axios";
import { baseUrl } from "@/api/index";
export default {
  name: "ModalDetail",
  data() {
    return {
      dataList: {
        groupType: -1
      },
      modalShow: false,
      descConfig: []
    };
  },
  computed: {
    ...mapState({
      singleData: state => state.singleModalData
    })
  },
  created() {
    // 单人团配置
    this.descConfig[0] = [
      ["name", "活动名称"],
      ["startTime", "活动开始时间"],
      // 2 开奖类型，需要单独配置
      ["openDrawTime", "活动开奖时间"],

      ["bigPrize", "活动大奖"],
      ["normalPrize", "阳光普照奖"],
      ["joinUserLevelName", "参与对象"],
      ["couponName", "参加用券"],
      ["drawRuleRemarks", "抽奖规则"]
    ];
    // 多人团配置
    this.descConfig[1] = [
      ["name", "活动名称"],
      ["startTime", "活动开始时间"],
      // 2 开奖类型，需要单独配置
      ["openDrawTime", "活动开奖时间"],

      ["drawDailyShopList", "投放门店"],
      ["bigPrize", "活动大奖"],
      ["normalPrize", "阳光普照奖"],
      ["joinUserLevelName", "参与对象"],
      ["maxOpenGroupCount", "开团总次数"],
      ["groupPlayerCount", "成团人数"],
      ["userOpenGroupCount", "开团次数"],
      ["openGroupMinutes", "开团有效时间"],
      ["openGroupFee", "开团消耗U贝"],
      ["userOpenGroupCount", "参团次数"],
      ["joinGroupFee", "参团消耗U贝"],
      ["drawRuleRemarks", "抽奖规则"]
    ];
  },
  mounted() {},
  watch: {},

  methods: {
    handleNone(e) {
      if (e === '' || typeof e !== 'string') {
        return ''
      }
      return `- ${e}`
    },
    handleAddress(val) {
      if (!val || !val[0]) {
        return ''
      }
      let e = val[0];
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
    async show(row) {
      let id = row.id;
      let host = baseUrl;
      // if (process.env.NODE_ENV === "development") {
        // id = 14;
        // host = "http://192.168.31.170:8088/zex-mgr";
      // }
      this.$Spin.show();
      setTimeout(_ => {
        this.$Spin.hide();
      }, 10000);
      await postJson(
        host + "/drawDaily/activity/selectById",
        { id }
      )
        .then(res => {
          console.log(res);
          // 接口成功返回数据
          if (res.code == 200) {
            this.dataList = res.data;
          }
        })
        .catch(err => {
          console.log(err, "modal_detail");
        });

      this.$Spin.hide();
      this.modalShow = true;
    },
    cancel() {},

    /**
     * 下面这些公共方法可以抽离到 \libs\util.js 或者mixin
     */
    /**
     * 时间戳转时间
     */
    // 根据毫秒数格式化时间,时间格式有三种，根据format的数值改变：2位年月，3为年月日，5为年月日时分，6为年月日时分秒，默认5
    // str 为yyyy-mm-dd分隔符
    ms2date: (time, format, str) => {
      var currentdate,
        ms = Number(time),
        date = new Date(time),
        cut1 = "-",
        cut2 = ":";

      if (!isNaN(ms) && ms > 99999999) {
        date = new Date(Number(ms));
      }
      if (isNaN(date.getTime())) {
        // 非法时间 Invalid Date
        return time;
      }
      if (ms === 0) {
        // 传了 空
        return time;
      }
      let objYear = date.getFullYear(),
        objMonth = date.getMonth() + 1,
        objDate = date.getDate(),
        objHours = date.getHours(),
        objMinutes = date.getMinutes(),
        objSeconds = date.getSeconds();
      if (typeof str === "string") {
        cut1 = str;
      }
      if (objMonth >= 1 && objMonth <= 9) {
        objMonth = "0" + objMonth;
      }
      if (objDate >= 0 && objDate <= 9) {
        objDate = "0" + objDate;
      }
      if (objHours >= 0 && objHours <= 9) {
        objHours = "0" + objHours;
      }
      if (objMinutes >= 0 && objMinutes <= 9) {
        objMinutes = "0" + objMinutes;
      }
      if (objSeconds >= 0 && objSeconds <= 9) {
        objSeconds = "0" + objSeconds;
      }
      if (format == 2) {
        currentdate = objYear + cut1 + objMonth;
      } else if (format == 3) {
        currentdate = objYear + cut1 + objMonth + cut1 + objDate;
      } else if (format == 5) {
        currentdate =
          objYear +
          cut1 +
          objMonth +
          cut1 +
          objDate +
          " " +
          objHours +
          cut2 +
          objMinutes;
      } else if (format == 6) {
        currentdate =
          objYear +
          cut1 +
          objMonth +
          cut1 +
          objDate +
          " " +
          objHours +
          cut2 +
          objMinutes +
          cut2 +
          objSeconds;
      } else {
        currentdate =
          objYear +
          cut1 +
          objMonth +
          cut1 +
          objDate +
          " " +
          objHours +
          cut2 +
          objMinutes;
      }
      return currentdate;
    },
    cloneObj(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3
      });
    },

    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3
      });
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
  }
  .banner-img{
<<<<<<< HEAD
    width: 200px; height: atuo;max-height: 600px;background: #ddd;
=======
    width: 100px; height: atuo;max-height: 200px;background: #ddd;
>>>>>>> feature/branch_zhanglei_1.5.4
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
</style>
