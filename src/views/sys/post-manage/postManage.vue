
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
              <FormItem label="岗位编码">
                <Input
                  type="text"
                  v-model="searchItem.code"
                  clearable
                  placeholder="请输入岗位编码"
                  style="width: 200px"
                />
              </FormItem>

              <span v-if="drop">
                <FormItem label="岗位名称">
                  <Input
                    type="text"
                    v-model="searchItem.name"
                    clearable
                    placeholder="请输入岗位名称"
                    style="width: 200px"
                  />
                </FormItem>

                <FormItem label="岗位状态">
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

            <Button @click="queryTableList" icon="md-refresh">刷新</Button>
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

    <Modal width="700" v-model="edit_Modal_show" :title="title" :mask-closable="false">
      <Form :model="edit_info" ref="edit_info" :label-width="80" :rules="ruleValidate">
        <FormItem label="岗位名称" prop="postName">
          <Input v-model="edit_info.postName" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="岗位编码" prop="postCode">
          <Input v-model="edit_info.postCode" placeholder="请输入" clearable/>
        </FormItem>
        <FormItem label="显示顺序" required>
          <InputNumber :max="99999" :min="0" v-model="edit_info.postSort" placeholder="请输入" clearable style="width:100%"/>
        </FormItem>

        <FormItem label="岗位状态" prop="status">
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

  export default {
    name: "post-manage",
    components: {},
    data() {
      return {
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
            title: "岗位编号",
            key: "postId",
            width: 100,
            align: "center"
          },
          {
            title: "岗位编码",
            key: "postCode",
            width: 150,
            align: "center",
            sortable: true
          },
          {
            title: "岗位名称",
            key: "postName",
            width: 100,
            align: "center"
          },
          {
            title: "显示顺序",
            key: "postSort",
            width: 150,
            align: "center",
            sortable: true
          },

          {
            title: "状态",
            key: "status",
            align: "center",
            width: 100,
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
            width: 100,
            align: "center"
          },
          {
            title: "创建时间",
            key: "createTime",
            width: 200,
            align: "center",
            sortable: true
          },
          {
            title: "编辑人",
            key: "updateBy",
            width: 100,
            align: "center"
          },
          {
            title: "编辑时间",
            key: "updateTime",
            width: 200,
            align: "center",
            sortable: true
          },

          {
            title: "操作",
            key: "action",
            fixed: "left",
            align: "center",
            width: 200,
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
                )
              ]);
            }
          }
        ],

        edit_Modal_show: false,
        edit_info: {
          postId: "",
          postName: "",
          postCode: "",
          status: "",
          remark: "",
          postSort: null
        },
        edit_loading: false,
        ruleValidate: {
          postName: [
            {
              required: true,
              message: "岗位名称不能为空",
              trigger: "blur"
            }
          ],

          postCode: [
            {
              required: true,
              message: "岗位编码不能为空",
              trigger: "blur"
            }
          ],

          postSort: [
            {
              required: true,
              message: "显示顺序不能为空",
              trigger: "blur"
            }
          ],

          status: [
            {
              required: true,
              message: "请选择岗位状态",
              trigger: "change"
            }
          ]
        },
        requestUrl: "",
        msg: "",
        title: ""
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
        this.searchItem.code = ""
        this.searchItem.status = ""
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
        const reqParams = {
          postName: this.searchItem.name,
          postCode: this.searchItem.code,
          status: this.searchItem.status
        };

        postRequest(
          "/system/sys-post/list?pageNum=" +
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

      addInfo() {
        this.edit_info = {
          postId: "",
          postName: "",
          postCode: "",
          status: "0",
          remark: "",
          postSort: null
        };
        this.edit_Modal_show = true;
        this.title = "岗位管理新增";
      },

      //编辑
      editInfo(item) {
        this.edit_Modal_show = true;
        this.edit_info = item;
        this.title = "岗位管理编辑";
      },

      editOk(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.edit_info.postSort == "") {
              this.$Message.error("显示顺序不能为空");
              return;
            }

            if (!this.edit_info.postId) {
              this.requestUrl = "/system/sys-post/add";
              this.msg = "新增成功";
            } else {
              this.requestUrl = "/system/sys-post/edit";
              this.msg = "编辑成功";
            }

            this.edit_loading = true;
            const reqParams = {
              postId: this.edit_info.postId,
              postName: this.edit_info.postName,
              postCode: this.edit_info.postCode,
              status: this.edit_info.status,
              remark: this.edit_info.remark,
              postSort: this.edit_info.postSort
            };

            postRequest(this.requestUrl, reqParams).then(res => {
              this.edit_loading = false;
              if (res.code == 200) {
                this.$Message.info(this.msg);
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

      //删除

      removeInfo(item) {
        const self = this;

        this.$Modal.confirm({
          title: "删除确认",
          content: `删除后不可恢复，是否继续删除？`,
          onOk: function() {
            self.$Loading.start();
            postRequest("/system/sys-post/delete?postId=" + item.postId).then(
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
