

<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
              <FormItem label="菜单名称">
                <Input
                  type="text"
                  v-model="searchItem.menuName"
                  clearable
                  placeholder="请输入菜单名称"
                  style="width: 200px"
                />
              </FormItem>

              <span v-if="drop">
                <FormItem label="菜单状态">
                  <Select
                    v-model="searchItem.visible"
                    placeholder="请选择"
                    clearable
                    style="width: 200px"
                  >
                    <Option value=" ">所有</Option>
                    <Option value="1">正常</Option>
                    <Option value="0">停用</Option>
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
            <Button class="ivu-btn ivu-btn-info" @click="fold =false">全部展开</Button>
            <Button class="ivu-btn ivu-btn-error" @click="fold =true">全部折叠</Button>

            <Button @click="update" icon="md-refresh">刷新</Button>
          </Row>

          <Row>
            <Spin size="large" fix v-if="TableLoading"></Spin>
            <tree-table
              expand-key="title"
              :expand-type="false"
              :selectable="false"
              :columns="tableColumns"
              :data="table_list"
              :show-index="true"
              :is-fold="fold"
            >
              <template slot-scope="scope" slot="visible">
                <span v-if="scope.row.visible == '0'" style="color:#ed4014">隐藏</span>
                <span v-if="scope.row.visible == '1'" style="color:#19be6b">显示</span>
              </template>

              <template slot-scope="scope" slot="menuType">
                <Tag checkable color="primary" v-if="scope.row.menuType == 'M'">目录</Tag>
                <Tag checkable color="success" v-if="scope.row.menuType == 'C'">菜单</Tag>

                <Tag checkable color="warning" v-else-if="scope.row.menuType == 'F'">按钮</Tag>
              </template>

              <template slot="likes" slot-scope="scope" style=" align: center">
                <Button
                  type="text"
                  @click="editInfo(scope.row)"
                  size="small"
                  style=" color: #5cadff"
                >编辑</Button>&nbsp;&nbsp;&nbsp;
                <Button
                  type="text"
                  @click="edit_add(scope.row)"
                  size="small"
                  style=" color: #19be6b"
                >新增</Button>&nbsp;&nbsp;&nbsp;
                <Button
                  type="text"
                  @click="removeInfo(scope.row)"
                  size="small"
                  style=" color: #ff3300"
                >删除</Button>
              </template>
            </tree-table>
          </Row>
        </Card>
      </Col>
    </Row>

    <Modal width="700" v-model="add_Modal_show" title="菜单管理新增" :mask-closable="false">
      <Form :model="add_info" ref="add_info" :label-width="80">
        <FormItem label="菜单类型" required>
          <RadioGroup v-model="add_info.menuType">
            <Radio label="M">目录</Radio>
            <Radio label="C">菜单</Radio>
            <Radio label="F">按钮</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="上级菜单" v-if="add_info.menuType =='C'" required>
          <Button @click="tree_Modal_show =true" style="width: 252px;">{{bumenname || '请选择'}}</Button>
        </FormItem>

        <FormItem label="菜单名称" required>
          <Input v-model="add_info.title" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="菜单路径" v-if="add_info.menuType !='F'" required>
          <Input v-model="add_info.path" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="显示排序" required>
          <InputNumber :max="99999" :min="0" style="width:100%" v-model="add_info.orderNum" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="图标" v-if="add_info.menuType=='M'" required>
          <Input v-model="add_info.icon" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="请求地址" v-if="add_info.menuType=='C'" required>
          <Input v-model="add_info.url" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="权限标识" v-if="add_info.menuType !='M'">
          <Input v-model="add_info.perms" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="菜单状态" required>
          <Select v-model="add_info.visible">
            <Option value="1">显示</Option>
            <Option value="0">隐藏</Option>
          </Select>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="add_Modal_show=false">取消</Button>

        <Button type="primary" @click="addOk('add_info')" :loading="add_loading">保存</Button>
      </div>
    </Modal>

    <Modal width="700" v-model="edit_Modal_show" title="菜单管理编辑" :mask-closable="false">
      <Form :model="edit_info" ref="edit_info" :label-width="80">
        <FormItem label="菜单类型" required>
          <RadioGroup v-model="edit_info.menuType">
            <Radio label="M">目录</Radio>
            <Radio label="C">菜单</Radio>
            <Radio label="F">按钮</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="上级菜单" required v-if="edit_info.menuType =='C'">
          <Button @click="tree_Modal_show =true" style="width: 252px;">{{bumenname || '请选择'}}</Button>
        </FormItem>

        <FormItem label="菜单名称" required>
          <Input v-model="edit_info.title" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="菜单路径" v-if="edit_info.menuType !='F'" required>
          <Input v-model="edit_info.path" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="显示排序" required>
          <InputNumber :max="99999" :min="0" style="width:100%" v-model="edit_info.orderNum" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="图标" v-if="edit_info.menuType=='M'" required>
          <Input v-model="edit_info.icon" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="请求地址" v-if="edit_info.menuType=='C'" required>
          <Input v-model="edit_info.url" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="权限标识" v-if="edit_info.menuType !='M'">
          <Input v-model="edit_info.perms" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="菜单状态" required>
          <Select v-model="edit_info.visible">
            <Option value="1">显示</Option>
            <Option value="0">隐藏</Option>
          </Select>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="edit_Modal_show=false">取消</Button>

        <Button type="primary" @click="editOk('edit_info')" :loading="edit_loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="tree_Modal_show" width="400" @on-ok="treeOk" title="选择菜单">
      <Tree :data="data2" @on-select-change="choiceAll" ref="tree4"></Tree>
    </Modal>

    <Modal v-model="logOut_Modal_show" width="400"  :closable="false"  title="是否重新登录">
      <p style="color: red;">菜单变更需要重新登录即可生效</p>


       <div slot="footer">
            <Button type="error" size="large"  @click="logOutOk">确定</Button>
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
    name: "menu-manage",
    components: {},
    data() {
      return {
        fold: true,
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",

        searchItem: {
          menuName: "",
          // type: "",
          visible: "",
          // startDate: "",
          // endDate: ""
        },

        TableLoading: false,
        table_list: [],

        tableColumns: [
          {
            key: "title",
            minWidth: 250,
            title: "菜单名称"
          },
          {
            key: "path",
            minWidth: 200,
            title: "菜单路径"
          },

          {
            key: "orderNum",
            title: "排序"
          },
          {
            key: "url",
            title: "请求地址",
            minWidth: 250
          },
          {
            key: "visible",
            title: "类型",
            type: "template",
            template: "visible"
          },

          {
            title: "类型",
            key: "menuType",
            width: 80,

            type: "template",
            template: "menuType"
          },

          {
            key: "perms",
            title: "权限标识"
          },

          {
            title: "操作",
            key: "likes",
            align: "center",
            minWidth: "200px",
            type: "template",
            template: "likes"
          }
        ],

        add_Modal_show: false,
        add_loading: false,
        add_info: {},

        edit_Modal_show: false,
        edit_info: {},
        edit_loading: false,
        tree_Modal_show: false,
        data2: [],
        parentId: "",
        bumenname: "",
        menuId: "",
        ruleValidate: {},

        logOut_Modal_show: false,
        searchType: "" // 查询状态 1.初始化，2：搜索
      };
    },

    created: function() {},
    methods: {
      init() {
        this.searchType = 1;
        this.updateTableList({});
        this.refreshDept();
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
        this.searchItem.menuName = ''
        this.searchItem.visible = ''
        this.updateTableList({});
      },

      //搜索
      queryTableList() {
        this.searchType = 2;
        this.updateTableList(this.searchItem);
      },

      // 更新
      update() {
        if(this.searchItem.menuName == "" || this.searchItem.menuName == " ") {
          this.updateTableList({});
        } else {
          this.updateTableList(this.searchItem);
        }
      },

      //分页
      changeCurrent(current) {
        this.pageNum = current;
        if(this.searchType == 1) {
          this.updateTableList({});
        } else {
          this.updateTableList(this.searchItem);
        }
      },

      updateTableList(obj) {
        this.TableLoading = true;

        // let reqParams = {
        //     menuName: this.searchItem.name,
        //     visible: this.searchItem.status
        //   };

        postRequest("/system/sys-menu/rightTree", obj).then(res => {
          this.TableLoading = false;
          if (res.isSuccess) {
            this.table_list = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      //列表end---------------------

      //新增

      addInfo() {
        this.add_info = {};
        this.add_info.orderNum = null;
        this.add_Modal_show = true;
        this.parentId = null;
        this.bumenname = null;
        this.menuId = null;
      },

      addOk(name) {
        if (this.add_info.menuType == undefined || this.add_info.menuType == "") {
          this.$Message.error("菜单类型还没有填写!");
          return;
        }

        if (this.add_info.title == undefined || this.add_info.title == "") {
          this.$Message.error("菜单名称还没有填写!");
          return;
        }

        if (this.add_info.menuType == "F") {
          this.add_info.path = "#";
        } else {
          if (this.add_info.path == undefined || this.add_info.path == "") {
            this.$Message.error("菜单路径还没有填写!");
            return;
          }
        }


        if (this.add_info.orderNum == undefined || this.add_info.orderNum == "") {
          this.$Message.error("显示排序还没有填写!");
          return;
        }

        if (this.add_info.menuType == "M") {
          this.add_info.url = "Main";

          if (this.add_info.icon == undefined || this.add_info.icon == "") {
            this.$Message.error("图标还没有填写!");
            return;
          }
        }

        if (this.add_info.visible == undefined || this.add_info.visible == "") {
          this.$Message.error("菜单状态还没有填写!");
          return;
        }


        if (this.add_info.menuType == "C") {
          if (this.bumenname == undefined || this.bumenname == "") {
            this.$Message.error("请选择上级菜单!");
            return;
          }

          if (this.add_info.url == undefined || this.add_info.url == "") {
            this.$Message.error("请求地址还没有填写!");
            return;
          }
        }


        this.add_loading = true;
        const reqParams = {
          path: this.add_info.path,
          parentId: this.menuId,
          title: this.add_info.title,
          orderNum: this.add_info.orderNum,
          url: this.add_info.url,
          menuType: this.add_info.menuType,
          visible: this.add_info.visible,
          perms: this.add_info.perms,
          icon: this.add_info.icon,
          remark: this.add_info.remark,
          menuName: this.add_info.title
        };

        postRequest("/system/sys-menu/add", reqParams).then(res => {
          this.add_loading = false;
          if (res.code == 200) {
            this.$Message.info("新增成功！");
            setTimeout(() => {
              this.add_Modal_show = false;

              this.logOut_Modal_show = true;
            }, 1200);
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      editInfo(name) {
        this.edit_Modal_show = true;
        this.edit_info = name;
        this.parentId = name.parentId;
        this.bumenname = name.parentName;
        this.menuId = name.menuId;
      },

      edit_add(name) {
        this.add_Modal_show = true;
        this.add_info.orderNum = null
        this.parentId = name.parentId;
        this.bumenname = name.parentName;
        this.menuId = name.menuId;
      },
      // 编辑

      editOk(name) {
        if (
          this.edit_info.menuType == undefined ||
          this.edit_info.menuType == ""
        ) {
          this.$Message.error("菜单类型还没有填写!");
          return;
        }

        if (this.edit_info.title == undefined || this.edit_info.title == "") {
          this.$Message.error("菜单名称还没有填写!");
          return;
        }
        if (
          this.edit_info.orderNum == undefined ||
          this.edit_info.orderNum == ""
        ) {
          this.$Message.error("显示排序还没有填写!");
          return;
        }
        if (this.edit_info.visible == undefined || this.edit_info.visible == "") {
          this.$Message.error("菜单状态还没有填写!");
          return;
        }

        if (this.edit_info.menuType == "M") {
          this.edit_info.url = "Main";

          if (this.edit_info.icon == undefined || this.edit_info.icon == "") {
            this.$Message.error("图标还没有填写!");
            return;
          }
        }

        if (this.edit_info.menuType == "C") {
          if (this.edit_info.url == undefined || this.edit_info.url == "") {
            this.$Message.error("请求地址还没有填写!");
            return;
          }
        }

        if (this.edit_info.menuType == "F") {
          this.edit_info.path = "#";
        } else {
          if (this.edit_info.path == undefined || this.edit_info.path == "") {
            this.$Message.error("菜单路径还没有填写!");
            return;
          }
        }

        this.edit_loading = true;
        const reqParams = {
          menuId: this.edit_info.menuId,

          path: this.edit_info.path,

          title: this.edit_info.title,
          icon: this.edit_info.icon,
          remark: this.edit_info.remark,
          parentId: this.edit_info.parentId,
          orderNum: this.edit_info.orderNum,
          url: this.edit_info.url,
          menuType: this.edit_info.menuType,
          visible: this.edit_info.visible,
          perms: this.edit_info.perms,
          createBy: this.edit_info.createBy,
          createTime: this.edit_info.createTime,
          menuName: this.edit_info.title
        };
        postRequest("/system/sys-menu/edit", reqParams).then(res => {
          this.edit_loading = false;
          if (res.code == 200) {
            this.$Message.info("编辑成功！");
            setTimeout(() => {
              this.edit_Modal_show = false;

              this.logOut_Modal_show = true;
            }, 1200);
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      //上级菜单start-----------

      refreshDept() {
        const reqParams = {};
        postRequest("/system/sys-menu/rightTree", reqParams).then(res => {
          if (res.code == "200") {
            this.data2 = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      choiceAll: function(data) {
        this.menuId = data[0].menuId;
        this.parentId = data[0].menuId;
        this.bumenname = data[0].title;
      },

      treeOk() {
        if (this.menuId == undefined) {
          this.$Message.error("请选择菜单名称");
          return;
        } else {
          this.tree_Modal_show = false;
        }
      },

      //上级菜单end---------------------

      //删除

      removeInfo(item) {
        const self = this;

        this.$Modal.confirm({
          title: "删除确认",
          content: `删除后不可恢复，是否继续删除？`,
          onOk: function() {
            self.$Loading.start();

            postRequest("/system/sys-menu/delete?menuId=" + item.menuId).then(
              res => {
                self.loading = false;

                if (res.code == "200") {
                  self.$Message.info("删除成功！");

                  setTimeout(() => {
                    self.logOut_Modal_show = true;
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
      },

      // 退出
      logOutOk() {
        this.$store.commit("logout", this);
        this.$store.commit("clearOpenedSubmenu");
        // 强制刷新页面 重新加载router
        location.reload();
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
