<template>
  <Modal
    class="yyh-modal"
    v-model="modalShow"
    :title="title"
    width="800"
    :styles="{ top: '20px' }"
  >
    <div style="height: 600px;overflow-y: auto;">
      <div class="yyh-modal-item">
        <span class="title">投放门店</span>
        <div
          class="modal-content"
          style="flex: 1;
          height: 300px"
        >
          <div>{{typeof pushRange === 'number'? rangeConf[pushRange]: ''}}</div>
          <div class="store-wrap mgt-10">
            <Table v-show="pushRange != 0" border :columns="columns2" :data="shopReqList"></Table>
          </div>
        </div>
      </div>

      <h2>投放内容</h2>
      <Table border :columns="columns1" :data="contentList"></Table>
    </div>
  </Modal>
</template>
<script>
// import util from "@/libs/util";
import comm from "@/mixins/common";

export default {
  name: "burst-detail",
  data() {
    return {
      title: "查看详情",
      modalShow: false,
      rangeConf: ['全国', '零售商', '城市', '自定义门店(单店)'],
      pushRange: '',
      columns1: [
        {
          title: "投放内容",
          key: "title"
        },
        {
          title: "投放位置",
          key: "orderByName"
        },
        {
          title: "投放终端",
          render: (h, {row}) => {
              let _list = [];
              if (Array.isArray(row.pushPlatformList)) {
                _list = row.pushPlatformList.map(el=> h('div', el.pushPlatformTxt));
              }
              return h('div', _list)
          }
        },
        {
          title: "投放时间",
          render: (h, {row}) => {
              return h('div', row.startTime + ' - ' + row.endTime)
          }
        }
      ],
      columns2: [
        {
          title: "门店编号",
          key: "shopId"
        },
        {
          title: "商超门店名称",
          key: "shopName"
        },
        {
          title: "零售商",
          key: "venderName"
        },
        {
          title: "地址",
          render: (h, {row}) => {
            return h('div', row.province + row.city)
          }
        }
      ],
      shopReqList: [],
      contentList: [
        {}
        // {
        //   title: "券标题",
        //   orderByName: 18,
        //   pushPlatformList: [
        //     {pushPlatformTxt: '小程序'},
        //     {pushPlatformTxt: 'android'},
        //     {pushPlatformTxt: 'ios'},
        //     {pushPlatformTxt: '其他'},
        //   ],
        //   startTime: "2016-10-03",
        //   endTime: "2017-10-03",
        // }
      ]
    };
  },
  mixins: [comm],
  methods: {
    showDetail(data) {
      if (Object.prototype.toString.call(data) === '[object Object]') {
        if(Array.isArray(data.shopReqList)){
          this.shopReqList = data.shopReqList;
        }
        const {title, orderByName, pushPlatformList, startTime, endTime} = data;
        this.contentList = [{title, orderByName, pushPlatformList, startTime, endTime}]
        this.pushRange = data.pushRange;
      } else {
        this.modalShow = true;
      }
    }
  },
};
</script>
<style lang="less" scoped>
.bd {
  border: 1px solid;
}
.yyh-modal-item {
  display: flex;
  margin: 0.5em 0.8em;
  color: #666;
}
.yyh-modal {
  .title {
    color: #000;
    width: 7em;
    margin-right: 1em;
  }
  .banner-img {
    width: 110px;
    height: atuo;
    max-height: 600px;
    background: #eee;
  }
}
.flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}
.mgr-1 {
  margin-right: 1em;
}
.mgl-2 {
  margin-left: 2em;
}
.par {
  margin-top: 1em;
  margin-bottom: 1em;
}
.width-5 {
  width: 5em;
}
.title {
  display: inline-block;
}
.modal-content {
  max-width: 960px;
  min-height: 150px;
  max-height: 400px;
  word-break: break-all;
}

.store-wrap{
  min-height: 150px;
  max-height: 281px;
  overflow: auto;
  margin-bottom: 10px;
}
</style>
