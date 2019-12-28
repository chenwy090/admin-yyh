<template>
  <Modal v-model="visible2" width="900" @on-ok="visibleChange(true)" @on-cancel="visibleChange(false)">
    <Card :bordered="false" style="margin-bottom:2px">
      <Form ref="searchForm" label-position="right" :label-width="80" :model="searchForm" inline>
        <FormItem label="门店" span="24" style="width:25%" prop="shopId">
          <Input v-model="searchForm.shopId" placeholder="门店shopId" clearable />
        </FormItem>
        <FormItem label="门店" span="24" style="width:25%" prop="shopName">
          <Input v-model="searchForm.shopName" placeholder="门店名称" clearable />
        </FormItem>

        <FormItem span="24" :label-width="1" style="width:23%">
          <Button type="primary" class="submit" icon="ios-search" @click="search()" style="margin-right: 5px"
            >搜索</Button
          >
          <Button icon="md-refresh" @click="reset">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card>
      <Row>
        <Col span="19">
          <Table
            :data="dataList"
            :columns="[
              { type: 'selection', align: 'center' },
              { title: '门店编号', key: 'shopId' },
              { title: '门店名称', key: 'shopName' },
              { title: '所属地区', key: 'address' },
            ]"
            @on-selection-change="listSelect"
          >
          </Table>
        </Col>
        <Col span="5" style="padding-left: 1vh;">
          <H3>已选门店 <Button size="small" @click="shopIdList = []">移除全部</Button> </H3>
          <div style="max-height: 500px;overflow: auto;padding-top:1vh;">
            <Row v-for="(item, index) in shopIdList" :key="index">
              <Col span="4">
                <Icon style="cursor: pointer;" type="ios-remove-circle-outline" @click="shopIdRemove(item, index)" />
              </Col>
              <Col span="20">
                <Tag :name="item.shopName">
                  {{ item.shopName }}
                </Tag>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Card>
    <Row type="flex" justify="end" class="page" style="padding-top: 1vh;">
      <Page
        :total="totalSize"
        show-total
        show-elevator
        @on-change="changeCurrent"
        style="float: right"
        :current.sync="current"
      ></Page>
    </Row>
  </Modal>
</template>
<script>
import { getShopList } from '@/api/sys'
import { postRequest, getRequest, postSyncRequest, getSyncRequest } from '@/libs/axios'
export default {
  props: ['visible'],
  data() {
    return {
      totalSize: 0,
      current: 0,
      searchForm: {
        shopId: '',
        shopName: '',
        title: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10,
        status: null,
        type: 0,
      },
      dataList: [],
      shopIdList: [],
      visible2: false,
    }
  },
  watch: {
    visible(val) {
      this.visible2 = val
    },
  },
  methods: {
    getList() {
      getShopList(this.searchForm, this.searchForm.pageNum).then(res => {
        if (res.isSuccess) {
          this.dataList = res.data.records
          this.totalSize = res.data.total
          this.current = res.data.current
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    changeCurrent(current) {
      if (this.searchForm.pageNum != current) {
        this.searchForm.pageNum = current
        this.getList()
      }
    },
    search() {
      this.searchForm.pageNum = 1
      this.getList()
    },
    reset() {
      this.$refs['searchForm'].resetFields()
      this.search()
    },
    listSelect(selection) {
      console.info(selection)
      let list = this.shopIdList.map(item => item.shopId)
      let list2 = selection.filter(item => !list.includes(item.shopId))
      this.shopIdList.push(...list2)
    },
    shopIdRemove(item, index) {
      this.shopIdList.splice(index, 1)
    },
    visibleChange(visible) {
      if (visible) {
        this.$emit('shopListData', this.shopIdList)
      }
      this.$emit('update:visible', false)
    },
  },
  mounted() {
    this.getList()
  },
}
</script>
