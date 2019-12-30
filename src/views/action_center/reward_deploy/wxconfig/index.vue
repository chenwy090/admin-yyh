<template>
  <!-- Withdrawal - switch -->
  <div style="margin-bottom: 20px;">
    <Row>
      <h3>微信配置</h3>
      <Button
        size="small"
        type="primary"
        icon="md-add"
        class="marginLeft20"
        @click="addOrEdit('add')"
      >新增</Button>
      <Button size="small" icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
    </Row>
    <div>
      <Table border width="100%" :columns="columns" :data="tableData" :loading="tableLoading">
        <template slot-scope="{ row }" slot="action">
          <Button type="success" style="margin-right: 5px" size="small" @click="openModal(row)">修改</Button>
        </template>
      </Table>
      <!-- 分页器 -->
      <Row type="flex" justify="end" class="page">
        <!-- show-total 显示总数 共{{ total }}条 -->
        <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
        <Page
          show-total
          show-elevator
          :current="page.pageNum"
          :page-size="page.pageSize"
          :total="page.total"
          @on-change="handleCurrentChange"
        ></Page>
      </Row>
    </div>

    <!--新增/修改 微信 对话框-->
    <!-- <Edit :action="action" @refresh="queryTableData"></Edit> -->
    <Edit v-if="showEdit" :showEdit.sync="showEdit" :action="action" @refresh="queryTableData"></Edit>
  </div>
</template>

<script>
import { queryRewardUList } from '@/api/sys'
import { postRequest } from '@/libs/axios'
import { tableMixin } from '@/mixins'

import columns from './columns'

import Edit from './Edit'

export default {
  name: 'wx-config',
  mixins: [tableMixin()],
  components: { Edit },
  data() {
    return {
      showEdit: false,
      action: {
        title: '',
        _id: Math.random(),
        id: '',
        type: '', //add/edit/detail/audit
        data: {},
      },
      modal: {
        levelName: '提现-开关',
        isopen: false,
      },
      columns,
      tableColumns: columns,
    }
  },
  created() {
    this.queryTableData()
  },
  methods: {
    // // 刷新搜索
    // refresh() {
    //   this.queryTableData()
    // },
    async addOrEdit(type, row) {
      // type //add/edit/detail/audit
      console.log('addOrEdit1 action', type, row)
      let _id = Math.random()
      let title = '添加微信号'
      let data = null

      if (type == 'edit') {
        title = '编辑微信号'
        data = await this.queryDataById(row.id)
      }
      this.action = { _id, type, title, data };
      this.showEdit = true;
    },
    async queryDataById(id) {
      // 查询详情
      const url = `/trade/merchant/withdraw/detail`
      // const { code, data, msg } = await getRequest(url, { id });
      const { code, data, msg } = await getRequest(url,{id})
      if (code == 200) {
        return data
      } else {
        this.msgErr(msg)
      }
    },
    switchStatusChange(status) {
      // console.log("开关状态：" + status);
      this.formData.status = status ? 0 : 1
      // console.log("开关状态status：" + this.formData.status);
    },
    openModal(item) {
      this.modal.isopen = true
      this.formData = JSON.parse(JSON.stringify(item))
      // console.log("this.formData:", this.formData);
    },
    closeDialog() {
      this.modal.isopen = false
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.msgOk('数据验证成功!')
          this.saveChange()
        } else {
          this.msgErr('数据验证失败,请检查表单!')
        }
      })
    },
    // tableLoading
    async queryTableData() {
      this.tableLoading = true

      queryRewardUList({
        ...this.searchData,
        ...this.page,
      }).then(res => {
        // console.log(res);
        const {
          code,
          data: { current, total, size, records },
        } = res

        if (code == 200) {
          this.statusOption = {
            '0': '待审核',
            '1': '已通过',
            '2': '未通过',
          }
          this.isStopOption = {
            '0': '未开始',
            '1': '进行中',
            '2': '已结束',
            '3': '已终止',
          }
          this.tableData = records.map(item => {
            // startTimeAndEndTime
            item.startTimeAndEndTime = `${item.startTime}-${item.endTime}`
            // statusName
            item.statusName = this.statusOption[item.status]
            // isStopName
            item.isStopName = this.isStopOption[item.isStop]
            return item
          })

          this.page.pageNum = current //分页查询起始记录
          this.page.total = total //列表总数
          this.page.pageSize = size //每页数据
        } else {
          this.msgErr(code + ' 数据加载失败!')
        }
        this.tableLoading = false
      })
    },
    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.queryTableData(pageNum)
    },
    async saveChange() {
      const url = '/drawconfig/edit'
      const { code, msg } = await postRequest(url, this.formData)
      if (code == 200) {
        this.queryTableData()
        setTimeout(() => {
          this.modal.isopen = false
        }, 500)
      } else {
        this.msgErr(msg)
      }
    },
    validateEmpty(msg, len = 20) {
      return function(rule, value, callback) {
        value += ''
        value = value.trim()
        if (value == '') {
          return callback(msg)
        }
        if (value.length > len) {
          return callback(`最多只能输入${len}个汉字`)
        }
        callback()
      }
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3,
      })
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3,
      })
    },
  },
}
</script>

<style scoped>
h3 {
  display: inline-block;
  border: 1px solid #d8d3d3;
  padding: 5px 10px;
  margin: 10px 0;
}
</style>


