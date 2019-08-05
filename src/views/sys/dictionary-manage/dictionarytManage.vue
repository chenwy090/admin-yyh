
<template>
  <div class="search">
    <div v-if="!dicDataPage">
      <Row>
        <Col>
          <Card>
            <Row>
              <Form
                ref="searchItem"
                :model="searchItem"
                inline
                :label-width="70"
                class="search-form"
              >
                <FormItem label="字典名称">
                  <Input
                    type="text"
                    v-model="searchItem.name"
                    clearable
                    placeholder="请输入角色名称"
                    style="width: 200px"
                  />
                </FormItem>

                <span v-if="drop">
                  <FormItem label="字典类型">
                    <Input
                      type="text"
                      v-model="searchItem.type"
                      clearable
                      placeholder="请输入字典类型"
                      style="width: 200px"
                    />
                  </FormItem>

                  <FormItem label="字典状态">
                    <Select
                      v-model="searchItem.status"
                      placeholder="请选择"
                      clearable
                      style="width: 200px"
                    >
                      <Option value>所有</Option>
                      <Option value="0">正常</Option>
                      <Option value="1">停用</Option>
                    </Select>
                  </FormItem>

                  <FormItem label="开始日期">
                    <DatePicker
                      type="date"
                      v-model="searchItem.startDate"
                      placeholder="选择日期"
                      style="width: 200px"
                    ></DatePicker>
                  </FormItem>

                  <FormItem label="结束日期">
                    <DatePicker
                      type="date"
                      placeholder="选择日期"
                      style="width:200px"
                      v-model="searchItem.endDate"
                    ></DatePicker>
                  </FormItem>
                </span>
                <FormItem style="margin-left:-35px;" class="br">
                  <Button @click="queryTableList" type="primary" icon="ios-search">搜索</Button>
                  <Button @click="refresh">重置</Button>
                  <a class="drop-down" @click="dropDown">
                    {{dropDownContent}}
                    <Icon :type="dropDownIcon"></Icon>
                  </a>
                </FormItem>
              </Form>
            </Row>
          </Card>
          <Card>
            <Row class="operation">
              <Button type="primary" icon="md-add" @click="addInfo()">新增</Button>

              <Button @click="updateTableList" icon="md-refresh">刷新</Button>
            </Row>

            <Row>
              <Table
                :loading="TableLoading"
                border
                :columns="tableColumns"
                :data="table_list"
                sortable="custom"
                ref="table"
              ></Table>
            </Row>
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
          </Card>
        </Col>
      </Row>
    </div>

    <Modal v-model="add_Modal_show" width="700" title="字典管理新增" :mask-closable="false">
      <Form :model="add_info" ref="add_info" :label-width="80" :rules="ruleValidate">
        <FormItem label="字典名称" prop="dictName">
          <Input v-model="add_info.dictName" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="字典类型" prop="dictCode">
          <Input v-model="add_info.dictCode" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="字典状态" prop="status">
          <Select v-model="add_info.status">
            <Option value="0">正常</Option>
            <Option value="1">停用</Option>
          </Select>
        </FormItem>

        <FormItem label="备注">
          <Input
            v-model="add_info.remark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入..."
            clearable
          />
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="add_Modal_show=false">取消</Button>

        <Button type="primary" @click="addOk('add_info')" :loading="add_loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="edit_Modal_show" width="700" title="字典管理编辑" :mask-closable="false">
      <Form :model="edit_info" ref="edit_info" :label-width="80" :rules="ruleValidate">
        <FormItem label="字典名称" prop="dictName">
          <Input v-model="edit_info.dictName" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="字典类型" prop="dictCode">
          <Input v-model="edit_info.dictCode" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="字典状态" prop="status">
          <Select v-model="edit_info.status">
            <Option value="0">正常</Option>
            <Option value="1">停用</Option>
          </Select>
        </FormItem>

        <FormItem label="备注">
          <Input
            v-model="edit_info.remark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入..."
            clearable
          />
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="edit_Modal_show=false">取消</Button>

        <Button type="primary" @click="editOk('edit_info')" :loading="edit_loading">保存</Button>
      </div>
    </Modal>

    <div v-if="dicDataPage">
      <dicDataList :dictCode="dictCode" @changeStatus="showStatus"></dicDataList>
    </div>
  </div>
</template>

<script>
  import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
  } from "@/libs/axios";

  import dicDataList from "./dicData";

  export default {
    name: "dic-manage",
    components: {
      dicDataList
    },
    data() {
      return {
        dicDataPage: false,
        dictCode: "",
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",

        searchItem: {
          name: "",
          type: "",
          status: "",
          startDate: "",
          endDate: ""
        },

        current: 1,
        totalSize: 0, //总条数
        pageNum: 1, //开始条数
        limit: 10, //每页记录数
        TableLoading: false,
        table_list: [],
        self: this,
        tableColumns: [
          {
            title: "字典编号",
            key: "dictId",
            minWidth: 100,

            align: "center"
          },
          {
            title: "字典名称",
            key: "dictName",
            minWidth: 100,
            align: "center"
          },

          {
            title: "字典类型",
            key: "dictCode",
            minWidth: 150,
            sortable: true,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small",
                      backgroundColor: "#000000"
                    },
                    style: {
                      color: "#ff3300"
                    },
                    on: {
                      click: () => {
                        this.dicDataInfo(params.row);
                      }
                    }
                  },
                  params.row.dictCode
                )
              ]);
            }
          },

          {
            title: "字典状态",
            key: "status",
            minWidth: 100,
            align: "center",
            render: (h, params) => {
              const row = params.row;
              const color = row.status === "1" ? "red" : "blue";
              const text = row.status === "1" ? "停用" : "正常";

              return h(
                "Tag",
                {
                  props: {
                    color: color
                  }
                },
                text
              );
            }
          },

          {
            title: "创建人",
            key: "createBy",
            minWidth: 100,
            align: "center"
          },
          {
            title: "创建时间",
            key: "createTime",
            minWidth: 200,
            align: "center",
            sortable: true
          },
          {
            title: "编辑人",
            key: "updateBy",
            align: "center",
            minWidth: 100
          },
          {
            title: "编辑时间",
            key: "updateTime",
            minWidth: 200,
            align: "center",
            sortable: true
          },
          {
            title: "备注",
            key: "remark",
            minWidth: 200,
            align: "center"
          },

          {
            title: "操作",
            key: "action",
            fixed: "left",
            align: "center",
            minWidth: 200,
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small"
                    },
                    style: {
                      color: "#5cadff"
                    },
                    on: {
                      click: () => {
                        this.editInfo(params.row);
                      }
                    }
                  },
                  "编辑"
                ),

                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small"
                    },
                    style: {
                      color: "#ff3300"
                    },
                    on: {
                      click: () => {
                        this.removeInfo(params.row);
                      }
                    }
                  },
                  "删除"
                ),

                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small"
                    },
                    style: {
                      color: "#19be6b"
                    },
                    on: {
                      click: () => {
                        this.dicDataInfo(params.row);
                      }
                    }
                  },
                  "列表"
                )
              ]);
            }
          }
        ],

        add_Modal_show: false,
        add_loading: false,
        add_info: {},

        edit_Modal_show: false,
        edit_info: {},
        edit_loading: false,
        ruleValidate: {
          dictName: [
            {
              required: true,
              message: "字典名称不能为空",
              trigger: "blur"
            }
          ],

          dictCode: [
            {
              required: true,
              message: "字典类型不能为空",
              trigger: "blur"
            }
          ],

          status: [
            {
              required: true,
              message: "请选择字典状态",
              trigger: "change"
            }
          ]
        }
      };
    },

    created: function() {},
    methods: {
      init() {
        this.updateTableList();
      },

      dropDown() {
        if (this.drop) {
          this.dropDownContent = "展开";
          this.dropDownIcon = "ios-arrow-down";
        } else {
          this.dropDownContent = "收起";
          this.dropDownIcon = "ios-arrow-up";
        }
        this.drop = !this.drop;
      },

      //	重置页面
      refresh() {
        this.searchItem.name = ""
        this.searchItem.type = ""
        this.searchItem.status = ""
        this.searchItem.startDate = ""
        this.searchItem.endDate = ""
        this.updateTableList();
      },

      //搜索
      queryTableList() {
        this.updateTableList();
      },

      //分页

      changeCurrent(current) {
        this.pageNum = current;
        this.updateTableList();
      },

      updateTableList() {
        this.TableLoading = true;

        if (this.searchItem.startDate != "" || this.searchItem.endDate != "") {
          if (
            this.searchItem.startDate.getTime() >
            this.searchItem.endDate.getTime()
          ) {
            this.$Message.error("开始日期不能大于结束日期");

            return;
          }
        }
        const reqParams = {
          dictName: this.searchItem.name,
          dictCode: this.searchItem.type,
          status: this.searchItem.status,
          beginTime: this.searchItem.startDate,
          endTime: this.searchItem.endDate
        };

        postRequest(
          "/system/sys-dict/list?pageNum=" +
            this.pageNum +
            "&pageSize=" +
            this.limit,
          reqParams
        ).then(res => {
          this.TableLoading = false;

          if (res.isSuccess) {
            this.totalSize = res.data.total;
            this.table_list = res.data.records;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      //新增
      addInfo() {
        this.add_info = {};
        this.add_Modal_show = true;
      },

      addOk(name) {
        if (this.deptId == "") {
          this.$Message.error("部门名称还没有选择！");
          return;
        }

        this.$refs[name].validate(valid => {
          if (valid) {
            const reqParams = {
              dictName: this.add_info.dictName,
              dictCode: this.add_info.dictCode,
              status: this.add_info.status,
              remark: this.add_info.remark
            };

            this.add_loading = true;

            postRequest("/system/sys-dict/add", reqParams).then(res => {
              this.add_loading = false;
              if (res.code == 200) {
                this.$Message.info("新增成功！");
                setTimeout(() => {
                  this.add_Modal_show = false;
                  this.updateTableList();
                }, 1200);
              } else {
                this.$Message.error(res.msg);
              }
            });
          } else {
            this.$Message.error("表单验证失败!");
          }
        });
      },

      //编辑

      editInfo(item) {
        this.edit_Modal_show = true;
        this.edit_info = item;
      },

      editOk(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            const reqParams = {
              dictId: this.edit_info.dictId,
              dictName: this.edit_info.dictName,
              dictCode: this.edit_info.dictCode,
              status: this.edit_info.status,
              remark: this.edit_info.remark
            };
            this.edit_loading = true;
            postRequest("/system/sys-dict/edit", reqParams).then(res => {
              this.edit_loading = false;
              if (res.code == 200) {
                this.$Message.info("编辑成功！");
                setTimeout(() => {
                  this.edit_Modal_show = false;
                  this.updateTableList();
                }, 1200);
              } else {
                this.$Message.error(res.msg);
              }
            });
          } else {
            this.$Message.error("表单验证失败!");
          }
        });
      },

      // 跳转列表

      dicDataInfo(item) {
        this.dictCode = item.dictCode;

        this.dicDataPage = true;
      },

      showStatus(e) {
        this.dicDataPage = e;
      },

      //删除

      removeInfo(item) {
        const self = this;

        this.$Modal.confirm({
          title: "删除确认",
          content: `删除后不可恢复，是否继续删除？`,
          onOk: function() {
            self.$Loading.start();
            postRequest("/system/sys-dict/delete?dictId=" + item.dictId).then(
              res => {
                self.loading = false;

                if (res.code == "200") {
                  self.$Message.info("删除成功！");

                  setTimeout(() => {
                    self.pageNum = 1;
                    self.updateTableList();
                  }, 1200);
                } else {
                  self.$Message.error(res.msg);
                }
              }
            );
          },
          onCancel: () => {
            self.$Message.info("点击了取消");
          }
        });
      }
    },
    mounted() {
      this.init();
    }
  };
</script>


<style lang="less" scoped>
  .operation {
    margin-bottom: 2vh;
  }
  .select-count {
    font-size: 13px;
    font-weight: 600;
    color: #40a9ff;
  }
  .select-clear {
    margin-left: 10px;
  }
  .page {
    margin-top: 2vh;
  }
  .drop-down {
    font-size: 13px;
    margin-left: 5px;
  }
</style>
