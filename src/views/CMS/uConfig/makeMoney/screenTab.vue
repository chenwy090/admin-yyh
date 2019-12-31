<template>
  <div style="min-height: 400px;margin-bottom: 100px">
    <Card style="height: 100%">
      <div>
        <div class="shunxu">
          <p>请你设置筛选项与显示顺序</p>
          <Button size="small" type="success" slot="extra">新增</Button>
        </div>
      </div>

      <Card>
        <Form :model="screenData" ref="modalAddForm2" :label-width="70" class="search-form" :rules="modalAddValidate">
          <Form-item label="城市" prop="status">
            <Select
              v-model="screenData.provice"
              placeholder="请选择省"
              style="width:100px"
              @on-change="proviceChange($event)"
            >
              <Option v-for="item in proviceSelect" :value="item" :key="item">{{ item }}</Option>
            </Select>
            /
            <Select v-model="screenData.city" placeholder="请选择市" style="width:100px">
              <Option v-for="item in citySelect" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </Form-item>
          <Form-item label="筛选项">
            <Row
              ><Button
                size="small"
                type="success"
                @click="
                  modalAddShow = true
                  tagsValue = []
                "
                >设置筛选项</Button
              >
              <span style="padding-left:10px;color:#999;">拖拽设置顺序</span>
            </Row>

            <CompSortDrag :list="tagsAllValue">
              <template v-for="(item, index) in tagsAllValue">
                <Row class="tagsAllValue" :key="index">
                  <div class="tags">
                    <Tag closable @on-close="tagsRemove(index)">{{ item.name }}</Tag>
                  </div>
                </Row>
              </template>
            </CompSortDrag>
          </Form-item>
        </Form>
      </Card>
    </Card>

    <Modal
      v-model="modalAddShow"
      title="请你在以下类目进行选择"
      :mask-closable="false"
      @on-cancel="modalAddShow = false"
    >
      <CheckboxGroup v-model="tagsValue">
        <template v-for="item in tagsList">
          <Checkbox :label="item.id">{{ item.name }}</Checkbox>
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
import * as cms from '@/api/cms'

import CompSortDrag from '@/components/CompSortDrag'

export default {
  inject: ['linkTo'],
  components: { CompSortDrag },
  data() {
    return {
      screenData: {},
      proviceSelect: [],
      citySelect: [],
      modalAddValidate: {},
      modalAddShow: false,
      tagsList: [
        { id: 1, name: '商超' },
        { id: 2, name: '餐饮' },
        { id: 3, name: '丽人' },
        { id: 4, name: '亲子' },
        { id: 5, name: '运动健身' },
        { id: 6, name: '休闲娱乐' },
        { id: 7, name: '教培' },
        { id: 8, name: '到家服务' },
      ],
      tagsValue: [],
      tagsAllValue: [],
    }
  },
  mounted() {
    cms.shopProvice().then(res => {
      if (res.isSuccess) {
        this.proviceSelect = res.data
      }
    })
  },
  methods: {
    proviceChange(provinceName) {
      this.screenData.city = ''
      cms.shopCity({ province: provinceName }).then(res => {
        if (res.isSuccess) {
          this.citySelect = res.data
        }
      })
    },
    modalAddOk() {
      this.tagsAllValue = this.tagsList.filter(item => this.tagsValue.includes(item.id))
      this.modalAddShow = false
    },
    tagsRemove(index) {
      this.tagsAllValue.splice(index, 1)
    },
  },
}
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
</style>
