<template>
  <div style="min-height: 400px;margin-bottom: 100px">
    <Card style="height: 100%">
      <div>
        <div class="shunxu">
          <p>请你设置筛选项与显示顺序</p>
          <Button size="small" type="success" slot="extra" @click="screenAdd">新增</Button>
        </div>
      </div>

      <template v-for="(screenData, index) in screenList">
        <Card style="margin-top:1vh;" :key="screenData.id + index">
          <div slot="extra" style="cursor: pointer;" @click="screenDelete(screenData, index)">
            <Icon size="20" color="#af1c1c" type="md-trash" />
          </div>
          <Form :model="screenData" ref="modalAddForm2" :label-width="70" class="search-form" :rules="modalAddValidate">
            <Form-item label="城市" prop="status">
              <Select
                v-model="screenData.provinceCode"
                placeholder="请选择省"
                style="width:100px"
                @on-change="proviceChange($event, screenData)"
              >
                <Option v-for="item in proviceSelect" :value="item.provinceCode" :key="item.provinceId">{{
                  item.provinceName
                }}</Option>
              </Select>
              /
              <Select v-model="screenData.cityCode" placeholder="请选择市" style="width:100px">
                <Option v-for="item in screenData.citySelect" :value="item.cityCode" :key="item.cityId">{{
                  item.cityName
                }}</Option>
              </Select>
            </Form-item>
            <Form-item label="筛选项">
              <Row
                ><Button
                  size="small"
                  type="success"
                  @click="
                    selectData = screenData;
                    modalAddShow = true;
                    tagsValue = [];
                  "
                  >设置筛选项</Button
                >
                <span style="padding-left:10px;color:#999;">拖拽设置顺序</span>
              </Row>

              <CompSortDrag :list="screenData.industryVO">
                <template v-for="(item, index) in screenData.industryVO">
                  <Row class="tagsAllValue" :key="index">
                    <div class="tags">
                      <Tag closable @on-close="tagsRemove(screenData, index)">{{ item.industryName }}</Tag>
                    </div>
                  </Row>
                </template>
              </CompSortDrag>
            </Form-item>
            <Form-item>
              <Button type="success" @click="save(screenData)">保存</Button>
            </Form-item>
          </Form>
        </Card>
      </template>
    </Card>

    <Row type="flex" justify="end" class="page">
      <Page
        :total="totalSize"
        show-total
        show-elevator
        @on-change="changeCurrent"
        style="float: right"
        :current.sync="current"
      ></Page>
    </Row>

    <Modal
      v-model="modalAddShow"
      title="请你在以下类目进行选择"
      :mask-closable="false"
      @on-cancel="modalAddShow = false"
    >
      <CheckboxGroup v-model="tagsValue">
        <template v-for="item in tagsList">
          <Checkbox :label="item.industryId">{{ item.industryName }}</Checkbox>
        </template>
      </CheckboxGroup>

      <div slot="footer">
        <Button type="text" @click="modalAddShow = false">取消</Button>
        <Button size="small" type="success" @click="modalAddOk">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import * as cms from "@/api/cms";

import CompSortDrag from "@/components/CompSortDrag";

export default {
  inject: ["linkTo"],
  components: { CompSortDrag },
  data() {
    return {
      screenList: [],
      selectData: {}, // 被选中的值
      screenData: {},
      proviceSelect: [],
      citySelect: [],
      modalAddValidate: {},
      modalAddShow: false,
      tagsList: [],
      tagsValue: [],
      current: 0,
      totalSize: 0,
      fromData: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    cms.filterProvince().then(res => {
      if (res.isSuccess) {
        this.proviceSelect = res.data;
      }
    });

    cms.filterIndustryMain().then(res => {
      if (res.isSuccess) {
        this.tagsList = res.data;
      }
    });

    this.pageList();
  },
  methods: {
    search() {
      this.fromData.pageNum = 1;
      this.pageList();
    },
    pageList() {
      cms.filterList(this.fromData).then(res => {
        if (res.isSuccess) {
          this.screenList = res.data.records;
          this.totalSize = res.data.total;
          this.current = res.data.current;
          this.screenList.forEach(item => {
            ~function(item) {
              this.proviceChange(item.provinceCode, item);
            }.bind(this)(item);
          });
        }
      });
    },
    changeCurrent(current) {
      this.fromData.pageNum = current;
      this.pageList();
    },
    proviceChange(provinceCode, screenData) {
      if (!provinceCode) return;
      cms.filterCityByProvince(provinceCode).then(res => {
        if (res.isSuccess) {
          this.$set(screenData, "citySelect", res.data);
        }
        console.info(screenData);
      });
    },
    modalAddOk() {
      this.selectData.industryVO = this.tagsList.filter(item => this.tagsValue.includes(item.industryId));
      this.modalAddShow = false;
    },
    tagsRemove(screenData, index) {
      screenData.industryVO.splice(index, 1);
    },
    screenAdd() {
      this.screenList.unshift({
        industryVO: [],
        citySelect: [],
      });
    },
    save(item) {
      item.industryVO = item.industryVO.map((i, indx, list) => {
        return {
          industryId: i.industryId,
          industryName: i.industryName,
          sortNum: list.length - indx,
        };
      });

      if (!item.cityCode || !item.provinceCode) {
        this.$Message.error("请选择城市！");
        return;
      }

      cms.filterDetails(item).then(res => {
        if (res.isSuccess) {
          this.$Message.success(item.id ? "修改成功！" : "新增成功！");
          this.search();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    screenDelete(item, index) {
      if (!item.id) {
        this.screenList.splice(index, 1);
        return;
      }
      this.$Modal.confirm({
        title: "删除",
        content: "<p>您确定要删除该记录吗？</p>",
        onOk: () => {
          cms
            .filterDelete({
              provinceCode: item.provinceCode,
              cityCode: item.cityCode,
              id: item.id,
            })
            .then(res => {
              if (res.isSuccess) {
                this.$Message.success("删除成功！");
                this.search();
              } else {
                this.$Message.error(res.msg);
              }
            });
        },
        onCancel: () => {
          console.info("onCancel");
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.shunxu {
  display: flex;
  justify-content: space-between;
  > p {
    color: #999;
  }
}
.tagsAllValue {
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon {
    display: block;
    cursor: pointer;
  }
  .tags {
    min-width: 150px;
  }
  .tags-icon {
    display: flex;
  }
}
.page {
  margin-top: 1vh;
}
</style>
