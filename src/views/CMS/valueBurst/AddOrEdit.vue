<template>
<div>
  <Modal
    class="yyh-modal"
    v-model="modalShow"
    :title="title"
    width="1000"
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
              <Radio v-for="(el, i) in rangeConf" :label="i" :key="'line19'+i">{{el}}</Radio>
          </RadioGroup>
          <div v-show="pushRange == 1" class="mgt-10">
            <Select v-model="venderName" style="width:150px" placeholder="选择零售商">
                <Option v-for="(item,index) in venderNames" :value="item" :key="'L23' + index">{{ item }}</Option>
            </Select>
          </div>
          <div v-show="pushRange == 2" class="mgt-10">
              <Select
                class="mgr-10"
                v-model="province"
                style="width:150px"
                clearable
                @on-change="getcitylist"
              >
                <Option
                  v-for="(item, index) in provincelist"
                  :key="'line36'+index"
                  :value="item.provinceName"
                  >{{ item.provinceName }}</Option
                >
              </Select>
              <Select
                v-model="city"
                style="width:150px"
                clearable
              >
                <Option
                  v-for="(item, index) in citylist"
                  :key="'line48'+index"
                  :value="item.cityName"
                  >{{ item.cityName }}</Option
                >
              </Select>
          </div>
          <div v-show="pushRange == 3" class="mgt-10">
            <Button @click="chooseStore">选择门店</Button>
            <div class="store-wrap mgt-10">
              <Table border :columns="columns2" :data="shopReqList"></Table>
            </div>
          </div>
        </div>
      </div>
      <h2>投放设置</h2>
      <Button v-if="title !== '编辑'" type="primary" icon="md-add" @click="hotCouponVoList.push(JSON.parse(hotListItem))">增加一条</Button>
      <Table border :columns="columns1" :data="hotCouponVoList">
        <template slot="content" slot-scope="params">
            <Button
              size="small"
              style="color:#2d8cf0"
              @click="showCouponFn(params.index)"
            >选择优惠券</Button>
            <p class="mgt-5">{{hotCouponVoList[params.index].title}}</p>
            <!-- <p v-for="(el,i) in hotCouponVoList" :key="'line71'+i">{{el.title}}</p> -->
        </template>
        <!-- <template slot="content" slot-scope="params">
            <Input  v-model="hotCouponVoList[params.index].title" style="width:120px"></Input>
        </template> -->
        <template slot="pushPos" slot-scope="params">
            <Select v-model="hotCouponVoList[params.index].orderBy" style="width:110px">
                <Option v-for="(item,index) in '123456'" :value="Number(item)" :key="'L34' + index">{{ '爆抢位置' + item }}</Option>
            </Select>
        </template>
        <template slot="pushClients" slot-scope="params">
          <CheckboxGroup v-model="hotCouponVoList[params.index].pushPlatformList">
              <Checkbox style="width: 60px" v-for="el in clientTypeList" :label="el.value" :key="el.label">{{el.label}}</Checkbox>
          </CheckboxGroup>
        </template>
        <template slot="pushTime" slot-scope="params">
          <DatePicker type="date" v-model="hotCouponVoList[params.index].startTime" placeholder="Select date and time" style="width: 200px"></DatePicker>至<!--
          --><DatePicker type="date" v-model="hotCouponVoList[params.index].endTime" placeholder="Select date and time" style="width: 200px"></DatePicker>
        </template>
        <template slot="operate" slot-scope="params" v-if="title !== '编辑'">
            <Button
              size="small"
              style="color:#2db7f5"
              @click="remove(params.index)"
              icon="ios-trash-outline"
            >移除</Button>
        </template>
      </Table>
    </div>
    <div slot="footer">
      <Button type="primary" @click="submitOk">保存</Button>
    </div>
  </Modal>
  <StoreList
      v-if="showStoreList"
      :showStoreList.sync="showStoreList"
      :checked="checkedStoreList"
      :shopLists="shopIds"
      @storeSelect="selectedTrCallBack"
    ></StoreList>
  <ChooseCoupon
      v-if="showChooseCoupon"
      :single="true"
      :showChooseCoupon.sync="showChooseCoupon"
      :checkedData="checkedData"
      @couponSelect="selectedCoupon"
    ></ChooseCoupon>
</div>
</template>
<script>
import StoreList from "@/components/StoreList";
import ChooseCoupon from "@/components/ChooseCoupon";
import util from "@/libs/util";
import comm from "@/mixins/common";
import { postJson, postRequest, getRequest } from "@/libs/axios";

export default {
  name: "burst-edit",
  components: {StoreList, ChooseCoupon},
  props: {
    show: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      checkedData: {},
      provincelist: [],
      citylist: [],
      province: '',
      city: '',
      venderName: '',
      currentContentIndex: '',
      showChooseCoupon: false,
      clientTypeList: [
          {value: 0, label: '小程序'},
          {value: 1, label: '安卓'},
          {value: 2, label: 'ios'},
          {value: 3, label: '其他'},
      ],
      showStoreList: false,
      checkedStoreList: [],// 已选的门店
      shopId: '',
      shopIds: [], // 门店列表
      venderNames: [], // 门店类别
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
          key: "orderBy",
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
          orderBy: '',
          pushPlatformList: [],
          startTime: "",
          endTime: "",
          couponKind: '',
          templateId: '',
          title: "",
      }),
      hotCouponVoList: [
        {
          orderBy: '',
          pushPlatformList: [],
          startTime: "",
          endTime: "",

          couponKind: '',
          templateId: '',
          title: "",
        }
      ]
    };
  },
  mixins: [comm],
  methods: {
    async apiAdd(e) {
      // e = {
      //   "hotCouponVoList": [
      //     {
      //       "couponKind": 2,
      //       "endTime": "2019-11-11",
      //       "startTime": "2019-11-03",
      //       "orderBy": 2,
      //       "pushPlatform": [ // java: 此处统一为 pushPlatformList
      //       // "pushPlatformList": [ // java: 此处统一为 pushPlatformList
      //         0,
      //         1
      //       ],
      //       "templateId": "20191113220136",
      //       "title": "分润测试劵"
      //     }
      //   ],
      //   "pushRange": 3,
      //   "shopInfo": [
      //     {
      //       "venderId": "80",
      //       "venderName": "浙江世纪联华",
      //       "shopId": "1229",
      //       "venderShopId": "1229",
      //       "shopName": "杭州江城店",
      //       "categories": "购物,超市",
      //       "address": "江城路558号",
      //       "city": "杭州市",
      //       "district": "上城区",
      //       "province": "浙江省",
      //       "longitude": "120.17624",
      //       "latitude": "30.235",
      //       "enabled": 1,
      //       "createBy": "suncongying",
      //       "createTime": "2019-07-30 10:52:18",
      //       "updateBy": "",
      //       "updateTime": null,
      //       "_checked": false
      //     }
      //   ]
      // }
        const url = "/hotCoupon/add";
        this.$Spin.show();
        setTimeout(() => {
            this.$Spin.hide();
        }, 6000);
        let { code, msg, data } = await postRequest(url, e);
        if (code == 200) {
          this.$Spin.hide();
          this.msgOk('新增成功');
          this.$parent.getList();
        } else {
          this.msgErr(msg);
        }
    },
    
    // 编辑
    async apiEdit(e) {
      const url = "/hotCoupon/edit";
      this.$Spin.show();
        setTimeout(() => {
            this.$Spin.hide();
        }, 6000);
      let { code, msg, data } = await postRequest(url, e);
      if (code == 200) {
        this.$Spin.hide();
        this.msgOk('编辑成功');
        this.$parent.getList();
      } else {
        this.msgErr(msg);
      }
    },
    showCouponFn(i) {
      this.showChooseCoupon = true;
      this.currentContentIndex = i;
      if (Array.isArray(this.hotCouponVoList) && this.hotCouponVoList[0]) {
        this.checkedData = this.hotCouponVoList[0];
      }
    },
    selectedCoupon(arr) {
      let e = arr[0]
      if (typeof e === 'object' && 'campId' in e) {
        // 超市券
        this.hotCouponVoList[this.currentContentIndex].couponKind = 1;
        this.hotCouponVoList[this.currentContentIndex].templateId = e.campId;
        this.hotCouponVoList[this.currentContentIndex].title = e.name;
      } else {
        // 周边券
        this.hotCouponVoList[this.currentContentIndex].couponKind = e.couponKind;
        this.hotCouponVoList[this.currentContentIndex].templateId = e.templateId;
        this.hotCouponVoList[this.currentContentIndex].title = e.title;
      }
    },
    chooseStore() {
      this.showStoreList = true;
    },
    selectedTrCallBack(e) {
      this.shopReqList = e;
    },
    /**
     * 根据规则，找到有问题的项
     * rules: [
     *  ['couponKind', '优惠券类型'],
     *  ['orderBy', '爆抢位置'],
     *  ...
     * ]
     */
    handleMsg(arr, rules) {
      let res = {
        status: true,
        index: -1,
        list: []
      }
      const len = arr.length;
      for (let i = 0; i < len; i++) {
        let handleRes = this.handleNull(arr[i], rules);
        if (Object.keys(handleRes).length > 0) {
          res.status = false;
          res.index = i;
          res.list = handleRes;
          break;
        }
      }
      return res;
    },
    /**
     * rules: [[key: '中文提示']]
     */
    handleNull(obj, rules) {
      let res = [];
      rules.forEach((el, i) => {
        if (Array.isArray(obj[el[0]])) {
          if(obj[el[0]].length < 1) {
            res.push(el)
          }
        } else {
          if(obj[el[0]] === '' || obj[el[0]] === undefined) {
            res.push(el)
          }
        }
      })
      return res;
    },
    submitOk() {
      // 这里做一下参数检测和提示 。。。
      if (typeof this.pushRange !== 'number') {
        return this.msgErr('请选择投放范围');
      }
      if (this.hotCouponVoList.length < 0) {
        return this.msgErr('至少要有一条内容');
      }
      if (Array.isArray(this.hotCouponVoList)) {
        this.hotCouponVoList.forEach((el,i) => {
          if (Object.prototype.toString.call(el.startTime) === '[object Date]') {
            this.hotCouponVoList[i].startTime = el.startTime.toISOString().slice(0, 10);
          } else if (typeof el.startTime === 'string') {
            this.hotCouponVoList[i].startTime = el.startTime.slice(0, 10);
          }
          if (Object.prototype.toString.call(el.endTime) === '[object Date]') {
            this.hotCouponVoList[i].endTime = el.endTime.toISOString().slice(0, 10);
          } else if (typeof el.endTime === 'string') {
            this.hotCouponVoList[i].endTime = el.endTime.slice(0, 10);
          }
        });
      } else {
        console.warn('hotCouponVoList 有问题')
        return;
      }
      let rules = [
        ['couponKind', '【请选择优惠券】 couponKind'],
        ['templateId', '【请选择优惠券】 templateId'],
        ['orderBy', '【投放位置】'],
        ['pushPlatformList', '【投放终端】'],
        ['startTime', '【投放时间】 startTime'],
        ['endTime', '【投放时间】 endTime'],
      ];
      const handleRes = this.handleMsg(this.hotCouponVoList, rules);
      if (handleRes.status !== true) {
        let _descs = handleRes.list.map(el=> el[1]);
        this.$Modal.warning({
          title: `投放设置的第${handleRes.index + 1}行有问题：`,
          content: _descs.join(',')
        });
        return;
      }
      let params = {
        hotCouponVoList: this.hotCouponVoList,
        pushRange: this.pushRange
      }
      if (this.pushRange == 1) {
        if (!this.venderName) {
          return this.msgErr('请选择零售商');
        }
        params.shopInfo = [{
          venderName: this.venderName
        }]
      } else if (this.pushRange == 2) {
        if (!this.province) {
          return this.msgErr('请选择省');
        }
        if (this.city) {
          params.shopInfo = [{
            city: this.city,
            province: this.province,
          }]
        } else {
          params.shopInfo = [{
            province: this.province
          }]
        }
      } else if (this.pushRange == 3) {
        params.shopInfo = this.shopReqList
      }
      // 做一些参数检测 给对应的提示
      if (false) {
        return; // 参数有问题
      }
      if (this.title === '编辑') {
        this.apiEdit(JSON.parse(JSON.stringify(params)));
      } else {
        this.apiAdd(JSON.parse(JSON.stringify(params)));
      }
      this.hotCouponVoList = [];
      this.shopReqList = [];
      this.pushRange = '';
      this.modalShow = false;
    },
    remove(i) {
      this.hotCouponVoList.splice(i, 1);
    },
    filterByName(arr, name) {
      let obj = {}
      arr.forEach(el=>{
        obj[el[name]] = ''
      })
      return Object.keys(obj);
    },
    //获取省份信息数据
    getprovincelist() {
      const url = "/system/area/province/list";
      postRequest(url).then(res => {
        if (res.code == 200) {
          this.provincelist = res.data;
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    //根据省份code获取城市信息数据
    getcitylist(provinceName) {
      if (!provinceName) {
        this.province = ''
        this.city = ''
        return this.citylist = []
      }
      let i = util.findIndex(this.provincelist, 'provinceName', provinceName);
      if (i === -1) {
        console.warn('未找到该 provinceName');
        return;
      }
      const url = "/system/area/city/" + this.provincelist[i].provinceCode;
      getRequest(url).then(res => {
        if (res.code == 200) {
          this.citylist = res.data;
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    // 在父级调用的 别删： 编辑时回填操作
    alreadyGetDetail(data) {
      // data = {
      //   "id": 329,
      //   "title": "分润测试劵",
      //   "couponKind": 2,
      //   "templateId": "20191113220136",
      //   "orderBy": 3,
      //   "orderByName": "爆抢位置3",
      //   "startTime": "2019-11-20T00:00",
      //   "endTime": "2019-11-29T23:59:59",
      //   "pushPlatformList": [
      //     {
      //       "pushPlatform": 0,
      //       "pushPlatformTxt": "小程序 "
      //     },
      //     {
      //       "pushPlatform": 1,
      //       "pushPlatformTxt": "安卓"
      //     }
      //   ],
      //   "pushRange": 2,
      //   "shopReqList": [
      //     {
      //       "shopId": null,
      //       "shopName": null,
      //       "venderName": null,
      //       "province": "浙江省",
      //       "city": "杭州市"
      //     }
      //   ]
      // }
      this.$Spin.hide();
      this.pushRange = data.pushRange;
      // 投放位置
      this.hotCouponVoList[0].orderBy = data.orderBy;
      // 投放终端 回填
      this.hotCouponVoList[0].pushPlatformList = data.pushPlatformList.map(el=> el.pushPlatform);
      // 投放时间
      if (data.startTime) {
        this.hotCouponVoList[0].startTime = new Date(data.startTime);
      }
      if (data.endTime) {
        this.hotCouponVoList[0].endTime = new Date(data.endTime);
      }

      if(data.pushRange == 1) {
        this.venderName = data.shopReqList[0].venderName;
      } else if (data.pushRange == 2) {
        this.province = data.shopReqList[0].province;
        this.getcitylist(this.province);
        this.city = data.shopReqList[0].city;
      }  else if (data.pushRange == 3) {
        this.shopReqList = data.shopReqList;
      }
      this.checkedData = {
        couponKind: data.couponKind,
        templateId: data.templateId,
        title: data.title
      }
    }

  },
  mounted() {
    this.getprovincelist();
  },
  watch: {
    show(e) {
      this.modalShow = !this.modalShow;
      this.title = this.$parent.currentTitle;
      if (this.modalShow && this.shopIds.length < 1 && Array.isArray(this.$parent.shopIds)) {
        this.shopIds = JSON.parse(JSON.stringify(this.$parent.shopIds));
        this.venderNames = this.filterByName(this.shopIds, 'venderName');
        if (this.title === '编辑') {
          // 当前是编辑模式
          this.$Spin.show();
          setTimeout(() => {
              this.$Spin.hide();
          }, 6000);
          if (this.columns1.slice(-1)[0] && this.columns1.slice(-1)[0].slot === 'operate') {
            this.columns1.pop();
          }
        }
      }
      if (this.modalShow) {
        if (this.hotCouponVoList.length < 1) {
          this.hotCouponVoList = [JSON.parse(this.hotListItem)];
        }
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