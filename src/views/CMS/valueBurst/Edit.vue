<template>
<div>
  <Modal
    class="yyh-modal"
    v-model="modalShow"
    :title="title"
    width="800"
    @on-ok="submitOk"
    :styles="{ top: '20px' }"
  >
    <div style="height: 600px;overflow-y: auto;">
      <div class="yyh-modal-item">
        <span class="title">选择投放门店</span>
        <div
          class="modal-content"
          style="flex: 1"
        >
          <RadioGroup v-model="pushRange">
              <Radio v-for="(el, i) in rangeConf" :label="i" :key="el">{{el}}</Radio>
          </RadioGroup>

          <div v-show="pushRange === 3" class="mgt-10">
            <Button @click="chooseStore">选择门店</Button>
            <div class="store-wrap mgt-10">
              <Table border :columns="columns2" :data="shopReqList"></Table>
            </div>
          </div>
        </div>
      </div>
      <h2>编辑投放内容</h2>
      <Button type="primary" icon="md-add" @click="hotCouponVoList.push(JSON.parse(hotListItem))">增加一条</Button>
      <Table border :columns="columns1" :data="hotCouponVoList">
        <template slot="pushClients" slot-scope="params">
          <CheckboxGroup v-model="hotCouponVoList[params.index].pushPlatformList">
              <Checkbox style="width: 60px" v-for="el in clientTypeList" :value="el.value" :label="el.label" :key="el.label"></Checkbox>
          </CheckboxGroup>
        </template>
        <template slot="content" slot-scope="params">
            <Input  v-model="hotCouponVoList[params.index].title" style="width:120px"></Input>
        </template>
        <template slot="pushPos" slot-scope="params">
            <Select v-model="hotCouponVoList[params.index].orderByName" style="width:110px">
                <Option v-for="(item,index) in '123456'" :value="Number(item)" :key="'L34' + index">{{ '爆抢位置' + item }}</Option>
            </Select>
        </template>
        <template slot="pushTime" slot-scope="params">
          <DatePicker type="datetime" v-model="hotCouponVoList[params.index].startTime" placeholder="Select date and time" style="width: 200px"></DatePicker>至<!--
          --><DatePicker type="datetime" v-model="hotCouponVoList[params.index].endTime" placeholder="Select date and time" style="width: 200px"></DatePicker>
        </template>
        <template slot="operate" slot-scope="params">
            <Button
              size="small"
              style="color:#2db7f5"
              @click="remove(params.index)"
              icon="ios-trash-outline"
            >移除</Button>
        </template>
      </Table>
    </div>
  </Modal>
  <StoreList
      v-if="showStoreList"
      :showStoreList.sync="showStoreList"
      :checked="checkedStoreList"
      :shopLists="shopIds"
      @storeSelect="selectedTrCallBack"
    ></StoreList>
</div>
</template>
<script>
import StoreList from "@/components/StoreList";
import util from "@/libs/util";
import comm from "@/mixins/common";

export default {
  name: "burst-edit",
  components: {StoreList},
  props: {
    show: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      clientTypeList: [
          {value: 0, label: '小程序'},
          {value: 1, label: '安卓'},
          {value: 2, label: 'ios'},
          {value: 3, label: '其他'},
      ],
      showStoreList: false,
      checkedStoreList: [],// 已选的门店
      shopId: '',
      shopIds: [],
      title: "新增",
      modalShow: false,
      rangeConf: ['全国', '零售商', '城市', '自定义门店(单店)'],
      pushRange: '',

      columns1: [
        {
          title: "投放内容",
          key: "title",
          width: '145',
          slot: 'content'
        },
        {
          title: "投放位置",
          key: "orderByName",
          width: '145',
          slot: 'pushPos'
        },
        {
          title: "投放终端",
          width: '120',
          slot: 'pushClients'
          // render: (h, {row}) => {
          //     let _list = [];
          //     if (Array.isArray(row.pushPlatformList)) {
          //       _list = row.pushPlatformList.map(el=> h('div', el.pushPlatformTxt));
          //     }
          //     return h('div', _list)
          // }
        },
        {
          title: "投放时间",
          slot: 'pushTime'
          // render: (h, {row}) => {
          //     return h('div', row.startTime + ' - ' + row.endTime)
          // }
        },
        {
          title: "操作",
          slot: 'operate',
          width: '100'
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
      hotListItem: JSON.stringify({
          title: "John Brown",
          orderByName: 18,
          pushPlatformList: [
            {pushPlatformTxt: '小程序'},
            {pushPlatformTxt: 'android'},
            {pushPlatformTxt: 'ios'},
            {pushPlatformTxt: '其他'},
          ],
          startTime: "2016-10-03",
          endTime: "2017-10-03",
      }),
      hotCouponVoList: [
        {
          title: "John Brown",
          orderByName: 18,
          pushPlatformList: [
            {pushPlatformTxt: '小程序'},
            {pushPlatformTxt: 'android'},
            {pushPlatformTxt: 'ios'},
            {pushPlatformTxt: '其他'},
          ],
          startTime: "2016-10-03",
          endTime: "2017-10-03",
        },
        {
          title: "John Brown",
          orderByName: 18,
          pushPlatformList: [
            {pushPlatformTxt: '小程序'},
            {pushPlatformTxt: 'android'},
            {pushPlatformTxt: 'ios'},
            {pushPlatformTxt: '其他'},
          ],
          startTime: "2016-10-03",
          endTime: "2017-10-03",
        }
      ]
    };
  },
  mixins: [comm],
  methods: {
    chooseStore() {
      this.showStoreList = true;
    },
    selectedTrCallBack(e) {
      console.log('chooseStore is', e);
      this.shopReqList = e;
    },
    submitOk() {
      let params = {
        hotCouponVoList: this.hotCouponVoList,
        pushRange: this.pushRange,
        shopInfo: this.shopReqList
      }
      if (false) {
        return; // 参数有问题
      }
      this.$parent.apiAdd(JSON.parse(JSON.stringify(params)));
      this.hotCouponVoList = [];
      this.shopReqList = [];
      this.pushRange = '';
    },
    remove(i) {
      this.hotCouponVoList.splice(i, 1);
    },

  },
  mounted() {
  },
  watch: {
    show(e) {
      this.modalShow = !this.modalShow;
      if (this.modalShow && this.shopIds.length < 1 && Array.isArray(this.$parent.shopIds)) {
        this.shopIds = this.$parent.shopIds;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.bd {
  border: 1px solid;
}
.mgt-10{
  margin-top: 10px
}
.yyh-modal-item {
  display: flex;
  margin: 0.5em 0.8em;
  color: #666;
}
.yyh-modal {
  .title {
    color: #000;
    width: 8em;
    margin-right: 1em;
  }
  .banner-img {
    width: 110px;
    height: atuo;
    max-height: 600px;
    background: #eee;
  }
  .ivu-table-wrapper, .ivu-table {
    overflow: initial;
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
  max-height: 280px;
  overflow: auto;
  margin-bottom: 10px;
}
</style>