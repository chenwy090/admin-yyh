<template>
  <div>
    <FormItem label="投放门店：">
      <RadioGroup v-model="modal.pushRange" @on-change="changeData">
        <Radio v-for="item in storeTypeList" :key="item.value" :label="item.value" :disabled="disabled">{{
          item.label
        }}</Radio>
      </RadioGroup>
    </FormItem>

    <template v-if="modal.pushRange == 1">
      <FormItem>
        <Select v-model="modal.venderName" placeholder="请选择零售商" @on-change="changeData" style="width:200px">
          <Option v-for="item in sysShopInfoData" h :value="item.venderName" :key="item.venderName">{{
            item.venderName
          }}</Option>
        </Select>
      </FormItem>
    </template>

    <template v-if="modal.pushRange == 2">
      <FormItem label="选择城市">
        <Row style="margin-bottom: 1vh;">
          <Icon @click="cityAdd" class="tag-add" size="30" color="#2d8cf0" type="ios-add-circle-outline" />
        </Row>
        <template v-for="(item, index) in cityList">
          <Row :key="index">
            <Col style="width:400px" span="10">
              <Select
                v-model="item.value1"
                placeholder="请选择省"
                style="width:150px"
                @on-change="proviceChange($event, index)"
              >
                <Option v-for="item in proviceSelect" :value="item" :key="item">{{ item }}</Option>
              </Select>
              <Select v-model="item.value2" placeholder="请选择市" style="width:200px" @on-change="changeData">
                <Option v-for="item in item.cityList" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </Col>
            <Col span="2">
              <Icon
                @click="cityRemove(index)"
                class="tag-remove"
                size="30"
                color="#ffb08f"
                type="ios-remove-circle-outline"
              />
            </Col>
          </Row>
        </template>
      </FormItem>
    </template>

    <template v-if="modal.pushRange == 3">
      <div style="margin-bottom: 1vh;">
        <Button :disabled="disabled" style="margin-bottom: 1vh;" @click="showSelectShopFun()">选择门店</Button>
        <Table
          :columns="[
            { title: '门店编号', key: 'shopId' },
            { title: '商超门店名称', key: 'shopName' },
            { title: '零售商', key: 'venderName' },
            { title: '地址', key: 'address' },
          ]"
          :data="shopListData"
        >
        </Table>
      </div>
      <storeView
        :visible.sync="showSelectShop"
        :shopListData.sync="shopListData"
        @update:shopListData="changeData"
      ></storeView>
    </template>
  </div>
</template>
<script>
import storeView from './store'
import * as cms from '@/api/cms'
export default {
  components: { storeView },
  props: ['pushRange', 'shopRequestList', 'disabled'],
  data() {
    return {
      modal: {
        pushRange: 0,
        venderName: '',
        shopRequestList: [],
      },
      storeTypeList: [
        { value: 0, label: '全国' },
        { value: 1, label: '零售商' },
        { value: 2, label: '城市' },
        { value: 3, label: '自定义门店' },
      ],
      showSelectShop: false,
      shopListData: [],
      cityList: [
        {
          value1: '',
          value2: '',
          citylist: [],
        },
      ],
      proviceSelect: [],
      sysShopInfoData: [], // 零售商列表
    }
  },
  computed: {},
  watch: {
    pushRange(val, oVal) {
      console.info(val, oVal)
      this.modal.pushRange = val
    },
    shopRequestList(val, oVal) {
      console.info(val, oVal)
      this.modal.shopRequestList = val
      this.echoData()
    },
  },
  methods: {
    initData() {
      cms.shopProvice().then(res => {
        if (res.isSuccess) {
          this.proviceSelect = res.data
        }
      })
      cms.getVenderInfo().then(res => {
        if (res.isSuccess) {
          this.sysShopInfoData = res.data
        }
      })
    },
    proviceChange(provinceName, index) {
      this.cityList[index].value2 = []
      cms.shopCity({ province: provinceName }).then(res => {
        if (res.isSuccess) {
          let item = this.cityList[index]
          this.$set(item, 'cityList', res.data)
        }
      })
    },
    // 门店选择相关
    showSelectShopFun() {
      this.showSelectShop = !this.showSelectShop
    },
    showSelectShopFun2(val) {
      this.showSelectShop = val
    },
    // shopListDataFun(list) {
    //   this.shopListData = list
    //   console.info(list)
    // },
    cityAdd() {
      this.cityList.push({
        value1: '',
        value2: [],
        citylist: [],
      })
    },
    cityRemove(index) {
      this.cityList.splice(index, 1)
    },
    changeData() {
      switch (this.modal.pushRange) {
        case 0:
          this.modal.shopRequestList = []
          break
        case 1:
          this.modal.shopRequestList = [
            {
              venderName: this.modal.venderName,
            },
          ]
          break
        case 2:
          this.modal.shopRequestList = this.cityList.map(item => {
            return {
              province: item.value1,
              city: item.value2,
            }
          })
          break
        case 3:
          this.modal.shopRequestList = this.shopListData.map(item => {
            return {
              shopId: item.shopId,
              shopName: item.shopName,
              venderName: item.venderName,
              address: item.address,
            }
          })
          break
      }

      // console.info(this.modal.shopRequestList)
      this.$emit('update:pushRange', this.modal.pushRange)
      this.$emit('update:shopRequestList', this.modal.shopRequestList)
    },
    echoData() {
      switch (this.modal.pushRange) {
        case 0:
          break
        case 1:
          break
        case 2:
          break
        case 3:
          this.shopListData = this.shopRequestList.map(item => {
            return {
              shopId: item.shopId,
              shopName: item.shopName,
              venderName: item.venderName,
              address: item.address,
            }
          })
          break
      }
    },
  },
  mounted() {
    this.initData()
  },
}
</script>
<style lang="less" scoped></style>
