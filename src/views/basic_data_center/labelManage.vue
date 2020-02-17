<template>
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="标签名称" prop="tag">
          <Input v-model="searchForm.tag" placeholder="请输入标签名称" style="width: 200px" />
        </Form-item>
        <Form-item label="标签状态" prop="disabled">
          <Select v-model="searchForm.disabled" placeholder="请选择" clearable style="width: 200px;">
            <Option value="">全部</Option>
            <Option value="2">已启用</Option>
            <Option value="1">已禁用</Option>
          </Select>
        </Form-item>
        <Form-item label="所属模块" prop="moduleId">
          <Select v-model="searchForm.moduleId" placeholder="请选择" clearable style="width: 200px;">
            <Option :value="item.id" v-for="(item, index) in moduleList" :key="item.id">{{ item.moduleName }}</Option>
          </Select>
        </Form-item>
        <Form-item style="margin-left:-35px;" class="br">
          <Button @click="search" type="primary" icon="ios-search">搜索</Button>
          <Button @click="resetForm('searchForm')">重置</Button>
        </Form-item>
      </Form>
    </Card>
    <Card style="margin-top: 1vh;">
      <Row class="operation">
        <Button type="primary" icon="md-add" @click="addLabelDisplayFn">新增标签</Button>
        <Button @click="refresh" icon="md-refresh">刷新</Button>
      </Row>
      <!-- 用户列表 -->
      <Table :loading="TableLoading" border :columns="tableColumns" :data="table_list" sortable="custom" ref="table">
        <template slot-scope="{ row }" slot="operate">
          <Button type="text" size="small" style="color:#2db7f5" @click="editLabelDisplayFn(row)">编辑</Button>
          <Button
            v-if="row.disabled == 1"
            type="text"
            size="small"
            style="color:#21b6b8"
            @click="statusLabelDisplayFn(row)"
            >启用</Button
          >
          <Button
            v-if="row.disabled == 2"
            type="text"
            size="small"
            style="color:#ed4014"
            @click="statusLabelDisplayFn(row)"
            >禁用</Button
          >
        </template>
        <template slot-scope="{ row }" slot="disabled">
          <Tag v-if="row.disabled == 2" color="#5cadff">启用</Tag>
          <Tag v-if="row.disabled == 1" color="red">禁用</Tag>
        </template>
        <template slot-scope="{ row }" slot="rizhi">
          <Button type="text" size="small" style="color:#2db7f5" @click="viewLabelDisplayFn(row)">查看</Button>
        </template>
      </Table>
      <!-- 用户列表 -->
      <!-- 分页 -->
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
      <!-- 分页 -->
    </Card>

    <Modal v-model="modalAddShow" title="新增" :mask-closable="false" @on-cancel="modalAddShow = false">
      <Form :model="labelData" ref="modalAddForm" :label-width="70" :rules="modalAddValidate" class="search-form">
        <Form-item label="所属模块" prop="moduleId">
          <Select v-model="labelData.moduleId" placeholder="请选择" clearable style="width: 200px;">
            <Option :value="item.id" v-for="(item, index) in moduleList" :key="item.id">{{ item.moduleName }}</Option>
          </Select>
        </Form-item>
        <Form-item label="标签名称" prop="tag">
          <Input v-model="labelData.tag" placeholder="请输入标签名称" style="width: 200px;" />
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalAddShow = false">取消</Button>
        <Button type="primary" @click="modalAddOk('modalAddForm')" :loading="loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="modalEditShow" title="编辑" :mask-closable="false" @on-cancel="modalEditShow = false">
      <Form :model="labelData" ref="modalEditForm" :label-width="70" :rules="modalAddValidate" class="search-form">
        <Form-item label="所属模块" prop="moduleId">
          <Select v-model="labelData.moduleId" placeholder="请选择" disabled style="width: 200px;">
            <Option :value="item.id" v-for="(item, index) in moduleList" :key="item.id">{{ item.moduleName }}</Option>
          </Select>
        </Form-item>
        <Form-item label="标签名称" prop="tag">
          <Input v-model="labelData.tag" placeholder="请输入标签名称" style="width: 200px;" />
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalEditShow = false">取消</Button>
        <Button type="primary" @click="modalEditOk('modalEditForm')" :loading="loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="modalDisplayShow" title="禁用理由" :mask-closable="false" @on-cancel="modalDisplayShow = false">
      <Form
        :model="labelData"
        ref="modalDisplayForm"
        :label-width="70"
        :rules="modalDisplayValidate"
        class="search-form"
      >
        <Form-item label="禁用理由" prop="remark">
          <Input v-model="labelData.remark" placeholder="请输入禁用理由" type="textarea" :rows="4" />
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalDisplayShow = false">取消</Button>
        <Button type="primary" @click="modalDisplayOk('modalDisplayForm')" :loading="loading">保存</Button>
      </div>
    </Modal>

    <Modal
      v-model="modalViewShow"
      title="操作日志"
      :mask-closable="false"
      @on-cancel="modalViewShow = false"
      width="954"
    >
      <Table
        :loading="TableLoadingRizhi"
        border
        :columns="tableColumnsRizhi"
        :data="table_list_rizhi"
        sortable="custom"
        ref="tableRizhi"
      >
        <template slot-scope="{ row }" slot="rizhi">
          <Tag>{{ row.operationType | operationType$ }}</Tag>
        </template>
        <template slot-scope="{ row }" slot="remark">
          <p v-if="row.remark" style="color: #ed4014;">{{ row.remark }}</p>
          <p v-if="!row.remark">无</p>
        </template>
      </Table>

      <Row type="flex" justify="end" class="page">
        <Page
          :total="totalSize2"
          show-total
          show-elevator
          @on-change="changeCurrent2"
          style="float: right"
          :current.sync="current2"
        ></Page>
      </Row>

      <div slot="footer">
        <Button type="text" @click="modalViewShow = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  commonTagGetModuleInfo,
  commonTagAddAndUpdateCommonTag,
  commonTagGetCommonTagInfo,
  commonTagGetCommonTagPageInfo,
  commonTagGetOperatorPageInfo,
  commonTagOpenAndCloseCommonTag,
} from "@/api/basicData";

export default {
  data() {
    return {
      searchForm: {
        page: 1,
        size: 10,
        tag: "",
        disabled: "",
        moduleId: 0,
      },
      searchFormRizhi: {
        page: 1,
        size: 10,
      },

      current: 1,
      totalSize: 0, //总条数
      // pageNum: 1, //开始条数
      TableLoading: false,
      table_list: [],
      tableColumns: [
        {
          title: "操作",
          width: 190,
          align: "center",
          fixed: "left",
          slot: "operate",
        },
        {
          title: "序号",
          width: 190,
          align: "center",
          key: "sort",
        },
        {
          title: "状态",
          width: 190,
          align: "center",
          slot: "disabled",
        },
        {
          title: "所属模块",
          width: 190,
          align: "center",
          key: "moduleName",
        },
        {
          title: "标签名称",
          align: "center",
          key: "tag",
        },
        {
          title: "操作日志",
          width: 190,
          align: "center",
          slot: "rizhi",
        },
      ],
      modalAddShow: false,
      modalEditShow: false,
      modalDisplayShow: false,
      modalViewShow: false,

      loading: false,

      labelData: {
        moduleId: "",
        tag: "",
        remark: "",
      },
      modalAddValidate: {
        moduleId: [
          {
            required: true,
            message: "所属模块不能为空",
            trigger: "change",
            type: "number",
          },
        ],
        tag: [
          {
            required: true,
            message: "标签名称不能为空",
            trigger: "blur",
          },
          {
            max: 10,
            message: "标签名称最多10个汉字",
            trigger: "blur",
          },
        ],
      },
      modalDisplayValidate: {
        remark: [
          {
            required: true,
            message: "禁用理由不能为空",
            trigger: "blur",
          },
          {
            max: 20,
            message: "禁用理由最多20个汉字",
            trigger: "blur",
          },
        ],
      },

      table_list_rizhi: [],
      totalSize2: 0,
      current2: 1,
      TableLoadingRizhi: false,
      tableColumnsRizhi: [
        {
          title: "操作人",
          width: 190,
          align: "center",
          key: "modifiedBy",
        },
        {
          title: "时间",
          width: 240,
          align: "center",
          key: "gmtModified",
        },
        {
          title: "操作",
          width: 190,
          align: "center",
          key: "operationType",
          slot: "rizhi",
        },
        {
          title: "备注",
          width: 300,
          align: "center",
          key: "remark",
          slot: "remark",
        },
      ],
      moduleList: [],
    };
  },
  filters: {
    operationType$: function(value) {
      if (!value) return "";
      switch (value) {
        case 1:
          return "新增";
        case 2:
          return "编辑";
        case 3:
          return "启用";
        case 4:
          return "禁用";
      }
    },
  },
  mounted() {
    commonTagGetModuleInfo().then(res => {
      if (res && res.code == 200) {
        this.moduleList = res.data.records;
        this.moduleList.unshift({
          moduleName: "全部",
          id: 0,
        });
      } else {
        this.$Message.error(res.msg);
      }
    });

    this.getList();
  },
  methods: {
    refresh() {
      this.getList();
    },
    search() {
      this.searchForm.page = 1;
      this.totalSize = 0;
      this.getList();
    },
    getList() {
      this.TableLoading = true;
      commonTagGetCommonTagPageInfo(this.searchForm).then(res => {
        this.TableLoading = false;
        if (res && res.code == 200) {
          this.table_list = res.data.records;
          this.totalSize = res.data.total;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    getListRizhi() {
      this.TableLoadingRizhi = true;
      commonTagGetOperatorPageInfo(this.searchFormRizhi).then(res => {
        this.TableLoadingRizhi = false;
        if (res && res.code == 200) {
          this.table_list_rizhi = res.data.records;
          this.totalSize2 = res.data.total;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    changeCurrent(current) {
      this.searchForm.page = current;
      this.getList();
    },
    changeCurrent2(current) {
      this.searchFormRizhi.page = current;
      this.getListRizhi();
    },

    // 重置form表单
    resetForm(name) {
      this.searchForm.page = 1;
      this.totalSize = 0;
      this.$refs[name].resetFields();
      if (name == "searchForm") {
        this.getList();
      }
    },
    viewLabelDisplayFn(item) {
      this.modalViewShow = true;
      this.searchFormRizhi.tagId = item.id;
      this.getListRizhi();
    },
    statusLabelDisplayFn(item) {
      this.labelData = item;
      if (item.disabled == 1) {
        commonTagOpenAndCloseCommonTag({
          tagId: item.id,
          remark: "",
          type: 2,
        }).then(res => {
          if (res && res.code == 200) {
            this.getList();
          } else {
            this.$Message.error(res.msg);
          }
        });
      } else {
        this.modalDisplayShow = true;
      }
    },
    editLabelDisplayFn(item) {
      commonTagGetCommonTagInfo({
        tagId: item.id,
      }).then(res => {
        if (res && res.code == 200) {
          this.modalEditShow = true;
          this.labelData = res.data;
          this.labelData.moduleId = item.moduleId;
        } else {
          this.$Message.error(res.msg);
        }
      });
      // this.labelData = {}
    },
    addLabelDisplayFn() {
      this.labelData = {};
      this.modalAddShow = true;
    },
    modalAddOk(name) {
      this.$refs[name].validate(valid => {
        if (!valid) return;
        this.loading = true;
        this.labelData.tagId = 0;
        commonTagAddAndUpdateCommonTag(this.labelData).then(res => {
          this.loading = false;
          if (res && res.code == 200) {
            this.modalAddShow = false;
            this.$Message.success("新增成功！");
            this.search();
          } else {
            this.$Message.error(res.msg);
          }
        });
      });
    },
    modalEditOk(name) {
      this.$refs[name].validate(valid => {
        if (!valid) return;
        this.loading = true;
        let { moduleId, id, tag } = this.labelData;
        commonTagAddAndUpdateCommonTag({
          moduleId: moduleId,
          tag: tag,
          tagId: id,
        }).then(res => {
          this.loading = false;
          if (res && res.code == 200) {
            this.modalEditShow = false;
            this.$Message.success("修改成功！");
            this.search();
          } else {
            this.$Message.error(res.msg);
          }
        });
      });
    },
    modalDisplayOk(name) {
      let { id, remark } = this.labelData;
      this.$refs[name].validate(valid => {
        if (!valid) return;
        this.loading = true;
        commonTagOpenAndCloseCommonTag({
          tagId: id,
          remark: remark,
          type: 1,
        }).then(res => {
          if (res && res.code == 200) {
            this.loading = false;
            this.modalDisplayShow = false;
            this.getList();
          } else {
            this.$Message.error(res.msg);
          }
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.operation {
  margin-bottom: 2vh;
}

.page {
  margin-top: 2vh;
}
</style>
