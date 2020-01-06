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
          <Table :data="dataList" :columns="columns" @on-selection-change="listSelect" ref="selection"> </Table>
        </Col>
        <Col span="5" style="padding-left: 1vh;">
          <H3
            >已选门店
            <Button size="small" @click="shopIdRemoveAll()">移除全部</Button>
          </H3>
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
import { getShopList } from "@/api/sys";
import { postRequest, getRequest, postSyncRequest, getSyncRequest } from "@/libs/axios";
export default {
  props: ["visible", "shopListData"],
  data() {
    return {
      totalSize: 0,
      current: 0,
      searchForm: {
        shopId: "",
        shopName: "",
        title: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
        status: null,
        type: 0,
      },
      dataList: [],
      shopIdList: [],
      visible2: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "商户编号",
          align: "center",
          minWidth: 130,
          key: "shopId",
        },
        {
          title: "商户名称",
          align: "center",
          width: 230,
          key: "shopName",
        },
        {
          title: "所属地区",
          align: "center",
          width: 340,
          key: "address",
          render: (h, params) => {
            let { shopName, province, city } = params.row;
            let address = `${province}${city}`;
            params.row.name = shopName;
            params.row.address = address;
            return <span>{address}</span>;
          },
        },
      ],
    };
  },
  watch: {
    visible(val) {
      this.visible2 = val;
    },
  },
  methods: {
    getList() {
      getShopList(this.searchForm, this.searchForm.pageNum).then(res => {
        if (res.isSuccess) {
          let list = this.shopIdList.map(item => item.shopId);
          res.data.records.forEach((item2, index) => {
            item2._checked = list.indexOf(item2.shopId) != -1;
          });
          this.dataList = res.data.records;
          this.totalSize = res.data.total;
          this.current = res.data.current;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    changeCurrent(current) {
      if (this.searchForm.pageNum != current) {
        this.searchForm.pageNum = current;
        this.getList();
      }
    },
    search() {
      this.searchForm.pageNum = 1;
      this.getList();
    },
    reset() {
      this.$refs["searchForm"].resetFields();
      this.search();
    },
    listSelect(selection) {
      // 过滤重复数据 添加到已选门店
      let list = this.shopIdList.map(item => item.shopId);
      let list2 = selection.filter(item => !list.includes(item.shopId));
      this.shopIdList.push(...list2);

      // 查询不包含被选的数组 已选门店过滤掉没有被选数据
      let list3 = selection.map(item => item.shopId);
      let list4 = this.dataList.filter(item => !list3.includes(item.shopId)).map(item => item.shopId);
      this.shopIdList = this.shopIdList.filter(item => !list4.includes(item.shopId));
    },
    shopIdRemove(item, index) {
      this.shopIdList.splice(index, 1);
      let list = this.shopIdList.map(item => item.shopId);
      let _dataList = JSON.parse(JSON.stringify(this.dataList));
      _dataList.forEach((item2, index) => {
        item2._checked = list.indexOf(item2.shopId) != -1;
      });
      this.dataList = _dataList;
    },
    shopIdRemoveAll() {
      if (this.shopIdList.length <= 0) return;
      let _dataList = JSON.parse(JSON.stringify(this.dataList));
      _dataList.forEach((item2, index) => {
        item2._checked = false;
      });
      this.dataList = _dataList;
      this.shopIdList = [];
    },
    visibleChange(visible) {
      if (visible) {
        this.$emit("update:shopListData", [...this.shopIdList]);
      }
      this.$emit("update:visible", false);
    },
  },
  mounted() {
    this.getList();
    this.shopIdList = [...this.shopListData];
  },
};
</script>
