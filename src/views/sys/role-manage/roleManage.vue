
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
              <FormItem label="角色名称">
                <Input
                  type="text"
                  v-model="searchItem.name"
                  clearable
                  placeholder="请输入角色名称"
                  style="width: 200px"
                />
              </FormItem>

              <span v-if="drop">
                <FormItem label="权限字符">
                  <Input
                    type="text"
                    v-model="searchItem.type"
                    clearable
                    placeholder="请输入权限字符"
                    style="width: 200px"
                  />
                </FormItem>

                <FormItem label="角色状态">
                  <Select
                    v-model="searchItem.status"
                    placeholder="请选择"
                    clearable
                    style="width: 200px"
                  >
                    <Option value="">所有</Option>
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

    <Modal v-model="add_Modal_show" width="700" title="角色管理新增" :mask-closable="false">
      <Form :model="add_info" ref="add_info" :label-width="80" :rules="ruleValidate">
        <FormItem label="角色名称" prop="roleName">
          <Input type="text" v-model="add_info.roleName" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="权限字符" prop="roleKey">
          <Input type="text" v-model="add_info.roleKey" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="显示顺序" required>
          <InputNumber :max="99999" :min="0" v-model="add_info.roleSort" placeholder="请输入" clearable style="width:100%"/>
        </FormItem>

        <FormItem label="状态" prop="status">
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

        <FormItem label="菜单权限" required>
          <Button @click="tree_Modal_show =true" style="width: 252px;">{{menuName || '请选择'}}</Button>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="add_Modal_show=false">取消</Button>

        <Button type="primary" @click="addOk('add_info')" :loading="add_loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="edit_Modal_show" width="700" title="角色管理编辑" :mask-closable="false">
      <Form :model="edit_info" ref="edit_info" :label-width="80" :rules="ruleValidate">
        <FormItem label="角色名称" prop="roleName">
          <Input type="text" v-model="edit_info.roleName" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="权限字符" prop="roleKey">
          <Input type="text" v-model="edit_info.roleKey" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="显示顺序" required>
          <InputNumber :max="99999" :min="0" v-model="edit_info.roleSort" placeholder="请输入" clearable style="width:100%"/>
        </FormItem>

        <FormItem label="状态" prop="status">
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

        <FormItem label="菜单权限" required>
          <Button @click="tree_Modal_show =true" style="width: 252px;">{{menuName || '请选择'}}</Button>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="edit_Modal_show=false">取消</Button>

        <Button type="primary" @click="editOk('edit_info')" :loading="edit_loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="data_Modal_show" title="分配数据权限" :mask-closable="false">
      <Form :model="data_info" ref="data_info" :label-width="80">
        <FormItem label="角色名称">
          <Input type="text" v-model="data_info.roleName" placeholder="请输入" disabled clearable/>
        </FormItem>

        <FormItem label="权限字符">
          <Input type="text" v-model="data_info.roleKey" placeholder="请输入" disabled clearable/>
        </FormItem>

        <FormItem label="数据范围">
          <Select v-model="data_info.dataScope">
            <Option value="1">全部数据权限</Option>
            <Option value="2">自定数据权限</Option>
          </Select>
        </FormItem>

        <FormItem label="数据权限" v-if="data_info.dataScope==2">
          <Button @click="data_tree_Modal_show =true" style="width: 252px;">{{data_name || '请选择'}}</Button>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="data_Modal_show=false">取消</Button>

        <Button type="primary" @click="dataOk" :loading="data_loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="data_tree_Modal_show" width="400" @on-ok="choiceDeptOk" title="选择数据权限">
      <Tree :data="dept_treeList" @on-check-change="choiceDept" ref="tree4" show-checkbox></Tree>
    </Modal>

    <Modal v-model="tree_Modal_show" width="400" @on-ok="MenuTreeOk" title="选择菜单权限">
      <Tree :data="treeList" @on-check-change="choiceMenuTree" ref="tree" show-checkbox></Tree>
    </Modal>

    <Modal v-model="res_Modal_show" width="730" title="设置角色与资源关系">
      <Form>
        <CheckboxGroup v-model="res_info.menuIds">
          <Checkbox
            style="width:130px"
            v-for="(item, index) in res_list"
            :key="index"
            :label="item.menuId"
          >{{item.title}}</Checkbox>
        </CheckboxGroup>
      </Form>

      <div slot="footer">
        <Button type="text" @click="res_Modal_show=false">取消</Button>
        <Button type="primary" @click="resOk" :loading="res_loading">保存</Button>
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

  import { formatDate } from "@/libs/date";

  export default {
    name: "role-manage",
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
            title: "角色编号",
            key: "roleId",
            width: 150,
            align: "center"
          },
          {
            title: "角色名称",
            key: "roleName",
            width: 150,
            align: "center",
            sortable: true
          },

          {
            title: "权限字符",
            key: "roleKey",
            width: 150,
            align: "center",
            sortable: true
          },

          {
            title: "显示顺序",
            key: "roleSort",
            width: 150,
            align: "center",
            sortable: true
          },

          {
            title: "状态",
            key: "status",
            width: 150,
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
            title: "数据范围",
            key: "dataScope",
            width: 150,
            align: "center",
            render: (h, params) => {
              const row = params.row;
              const color = row.dataScope === "1" ? "blue" : "red";
              const text =
                row.dataScope === "1" ? "全部数据权限" : "自定数据权限";
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
            title: "删除标志",
            key: "flag",
            width: 100,
            align: "center",
            render: (h, params) => {
              const row = params.row;
              const color = row.flag === "2" ? "red" : "blue";
              const text = row.flag === "2" ? "删除" : "存在";
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
            title: "创建时间",
            key: "createTime",
            width: 200,
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                formatDate(new Date(params.row.createTime), "yyyy-MM-dd hh:mm")
              );
            }
          },
          {
            title: "备注",
            key: "remark",
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
                      color: "#19be6b"
                    },
                    on: {
                      click: () => {
                        this.dataInfo(params.row);
                      }
                    }
                  },
                  "数据权限"
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

                // h('Button', {
                //     props: {
                //         type: 'text',
                //         size: 'small'
                //     },
                //     style: {

                //         color: '#23c6c8'
                //     },
                //     on: {
                //         click: () => {
                //             this.resInfo(params.row)
                //         }
                //     }
                // }, '设置角色与资源关系')
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

        menuIdList: [],
        tree_Modal_show: false,
        menuName: "",
        menuIds: "",

        data_Modal_show: false,
        data_info: {},
        data_loading: false,
        dept_treeList: [],
        data_name: "",
        deptList: [],
        deptIds: "",
        data_tree_Modal_show: false,

        ruleValidate: {
          roleName: [
            {
              required: true,
              message: "角色名称不能为空",
              trigger: "blur"
            }
          ],

          roleKey: [
            {
              required: true,
              message: "权限字符不能为空",
              trigger: "blur"
            }
          ],

          roleSort: [
            {
              required: true,
              message: "显示顺序不能为空",
              trigger: "blur"
            }
          ],

          status: [
            {
              required: true,
              message: "请选择状态",
              trigger: "change"
            }
          ]
        },

        res_Modal_show: false,
        res_info: {},
        res_loading: false,

        res_columns: [
          {
            type: "selection",
            width: 60,
            align: "center"
          },

          {
            title: "资源ID",
            key: "resId",
            width: 100,
            align: "center"
          },
          {
            title: "资源编码",
            key: "resCode",
            width: 150,
            align: "center",
            sortable: true
          },
          {
            title: "资源名称",
            key: "resName",
            width: 100,
            align: "center"
          },
          {
            title: "资源类型",
            key: "resType",
            width: 150,
            align: "center",
            sortable: true
          },

          {
            title: "状态",
            key: "status",

            width: 150,
            render: (h, params) => {
              const row = params.row;
              const color =
                row.status === "0"
                  ? "blue"
                  : row.status === "C"
                  ? "green"
                  : "red";
              const text =
                row.status === "0"
                  ? "正常"
                  : row.status === "C"
                  ? "建档"
                  : "失效";

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
          }
        ],

        searchConName1: "",

        res_list: [],
        treeList: []
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

      //	刷新页面
      refresh() {
        // this.updateTableList(this.params);
          this.searchItem.name = "";
          this.searchItem.type = "";
          this.searchItem.status = "";
          this.searchItem.startDate = "";
          this.searchItem.endDate = "";
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
          roleName: this.searchItem.name,
          roleKey: this.searchItem.type,
          status: this.searchItem.status,
          startDate: this.searchItem.startDate,
          endDate: this.searchItem.endDate
        };

        postRequest(
          "/system/sys-role/page?pageNum=" +
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

      //菜单权限 start--------------
      choiceMenuTree(data) {
        this.menuName = "已选择";
        this.menuIdList = this.$refs.tree.getCheckedAndIndeterminateNodes();
        const new_menuIdList = [];
        for (let i of this.menuIdList) {
          new_menuIdList.push(i.menuId);
        }
        this.menuIds = new_menuIdList;
      },

      MenuTreeOk() {
        if (this.menuIdList.length == 0) {
          this.$Message.error("请选择菜单权限");
          return;
        } else {
          this.tree_Modal_show = false;
        }
      },

      //菜单权限end--------------

      //新增
      addInfo() {
        this.add_info = {};
        this.add_info.roleSort = null
        this.add_Modal_show = true;
        (this.menuName = ""), (this.menuIds = "");
        this.menuIdList = [];
        const reqParams = {};

        getRequest("/system/sys-menu/roleMenuTreeData", reqParams).then(res => {
          if (res.code == "200") {
            this.treeList = res.data.records;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      addOk(name) {
        
        this.$refs[name].validate(valid => {
          
          if (valid) {

            if (this.add_info.roleSort == undefined) {
              this.$Message.error("显示顺序不能为空");
              return;
            }

            if (this.menuIds == "") {
              this.$Message.error("请选择菜单权限");
              return;
            } else {
              this.menuIds = this.menuIds.toString();
            }

            this.add_loading = true;
            const reqParams = {
              roleName: this.add_info.roleName,
              roleKey: this.add_info.roleKey,
              roleSort: this.add_info.roleSort,
              status: this.add_info.status,
              remark: this.add_info.remark,
              menuIds: this.menuIds.toString()
            };

            postRequest("/system/sys-role/add", reqParams).then(res => {
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
        this.menuIds = item.menuIds;
        this.menuName = "已选择";

        const reqParams = {};

        getRequest(
          "/system/sys-menu/roleMenuTreeData?roleId=" + this.edit_info.roleId,
          reqParams
        ).then(res => {
          if (res.code == "200") {
            this.treeList = res.data.records;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      editOk(name) {
        let judge = false;

        judge = Array.isArray(this.menuIds);

        if (judge == true) {
          this.menuIds = this.menuIds.toString();
        } else {
          this.menuIds = this.menuIds;
        }

        if (this.edit_info.roleSort == "") {
          this.$Message.error("显示顺序不能为空");
          return;
        }

        this.$refs[name].validate(valid => {
          if (valid) {
            this.edit_loading = true;
            const reqParams = {
              roleId: this.edit_info.roleId,
              roleName: this.edit_info.roleName,
              roleKey: this.edit_info.roleKey,
              roleSort: this.edit_info.roleSort,
              status: this.edit_info.status,
              remark: this.edit_info.remark,

              delFlag: this.edit_info.delFlag,
              createBy: this.edit_info.createBy,
              createTime: this.edit_info.createTime,
              menuIds: this.menuIds
            };

            postRequest("/system/sys-role/edit", reqParams).then(res => {
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

      //删除

      removeInfo(item) {
        const self = this;

        this.$Modal.confirm({
          title: "删除确认",
          content: `删除后不可恢复，是否继续删除？`,
          onOk: function() {
            self.$Loading.start();
            getRequest("/system/sys-role/delete/" + item.roleId).then(res => {
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
            });
          },
          onCancel: () => {
            self.$Message.info("点击了取消");
          }
        });
      },

      //数据权限start---------------------
      dataInfo(item) {
        this.data_Modal_show = true;
        this.data_info = item;
        this.getDeptTree();
      },

      getDeptTree() {
        const reqParams = {
          roleId: this.data_info.roleId
        };
        postRequest("/system/sys-dept/tree", reqParams).then(res => {
          if (res.code == "200") {
            this.dept_treeList = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      choiceDept(data) {
        this.data_name = "已选择";
        this.deptList = data;

        const new_deptList = [];
        for (let i of this.deptList) {
          new_deptList.push(i.deptId);
        }
        this.deptIds = new_deptList;
      },

      choiceDeptOk() {
        if (this.deptList.length == 0) {
          this.$Message.error("请选择菜单权限");
          return;
        } else {
          this.data_tree_Modal_show = false;
        }
      },

      dataOk() {
        if (this.data_info.dataScope == "2" && this.deptIds == "") {
          this.$Message.error("请选择数据权限");
          return;
        } else {
          this.deptIds = this.deptIds.toString();
        }
        if (this.data_info.dataScope == "1") {
          this.deptIds = "";
        }
        this.data_loading = true;
        const reqParams = {
          roleId: this.data_info.roleId,
          dataScope: this.data_info.dataScope,
          deptIds: this.deptIds
        };
        postRequest("/system/sys-role/resetrule", reqParams).then(res => {
          this.data_loading = false;
          if (res.code == 200) {
            this.$Message.info("修改成功！");
            setTimeout(() => {
              this.data_Modal_show = false;
              this.updateTableList();
            }, 1200);
          } else {
            this.$Message.error(res.msg);
          }
        });
      },
      //数据权限end---------------------

      //设置角色与资源关系start--------------------------------
      resInfo(item) {
        this.res_Modal_show = true;
        this.res_info = item;
        this.getShopList();
      },

      getShopList() {
        const reqParams = {};

        getRequest("/system/sys-menu/roleMenuTreeData", reqParams).then(res => {
          if (res.code == 200) {
            this.res_list = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      resOk() {
        this.res_loading = true;
        const reqParams = {
          roleId: this.res_info.roleId,
          menuIds: this.res_info.menuIds.toString()
        };
        postRequest("/system/sys-role-menu/reset", reqParams).then(res => {
          this.res_loading = false;
          if (res.code == 200) {
            this.$Message.info("设置成功！");
            setTimeout(() => {
              this.res_Modal_show = false;
              this.updateTableList();
            }, 1200);
          } else {
            this.$Message.error(res.msg);
          }
        });
      }

      //设置角色与资源关系end--------------------------------
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
