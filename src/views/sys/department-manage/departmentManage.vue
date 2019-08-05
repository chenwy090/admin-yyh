<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
              <FormItem label="部门名称">
                <Input
                  type="text"
                  v-model="searchItem.deptName"
                  clearable
                  placeholder="请输入部门名称"
                  style="width: 200px"
                />
              </FormItem>

              <span v-if="drop">
                <FormItem label="部门状态">
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
              <template slot-scope="scope" slot="status">
                <span v-if="scope.row.status == '1'" style="color:#ed4014">停止</span>
                <span v-if="scope.row.status == '0'" style="color:#19be6b">正常</span>
              </template>

              <template slot="likes" slot-scope="scope">
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

    <Modal v-model="add_Modal_show" title="部门管理新增" :mask-closable="false" width="700">
      <Form :model="add_info" ref="add_info" :label-width="80" :rules="ruleValidate">
        <FormItem label="上级部门" required>
          <Button @click="tree_Modal_show =true" style="width: 252px;">{{bumenname || '请选择'}}</Button>
        </FormItem>

        <FormItem label="部门名称" prop="deptName">
          <Input v-model="add_info.deptName" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="显示排序" required>
          <InputNumber :max="99999" :min="0" style="width:100%" v-model="add_info.orderNum" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="负责人" prop="leader">
          <Input v-model="add_info.leader" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="联系电话" prop="phone">
          <Input v-model="add_info.phone" placeholder="请输入手机或者固话（固话需加区号，如02012345678）" clearable/>
        </FormItem>

        <FormItem label="邮箱" prop="email">
          <Input v-model="add_info.email" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="状态" prop="status">
          <Select v-model="add_info.status">
            <Option value="0">正常</Option>
            <Option value="1">停用</Option>
          </Select>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="add_Modal_show=false">取消</Button>

        <Button type="primary" @click="addOk('add_info')" :loading="add_loading">保存</Button>
      </div>
    </Modal>

    <Modal
      width="700"
      v-model="edit_Modal_show"
      title="部门管理编辑"
      @on-ok="editOk"
      :loading="edit_loading"
      :mask-closable="false"
    >
      <Form :model="edit_info" ref="edit_info" :label-width="80" :rules="ruleValidate">
        <FormItem label="上级部门" required>
          <Button @click="tree_Modal_show1 =true" style="width: 252px;">{{bumenname || '请选择'}}</Button>
        </FormItem>

        <FormItem label="部门名称" prop="deptName">
          <Input v-model="edit_info.deptName" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="显示排序" required>
          <InputNumber :max="99999" :min="0" style="width:100%" v-model="edit_info.orderNum" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="负责人" prop="leader">
          <Input v-model="edit_info.leader" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="联系电话" prop="phone">
          <Input v-model="edit_info.phone" placeholder="请输入手机或者固话（固话需加区号，如02012345678）" clearable/>
        </FormItem>

        <FormItem label="邮箱" prop="email">
          <Input v-model="edit_info.email" placeholder="请输入" clearable/>
        </FormItem>

        <FormItem label="状态" prop="status">
          <Select v-model="edit_info.status">
            <Option value="0">正常</Option>
            <Option value="1">停用</Option>
          </Select>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="edit_Modal_show=false">取消</Button>

        <Button type="primary" @click="editOk('edit_info')" :loading="edit_loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="tree_Modal_show" width="400" @on-ok="treeOk" title="选择部门">
      <Tree :data="data2" @on-select-change="choiceAll" ref="tree4"></Tree>
    </Modal>
    <Modal v-model="tree_Modal_show1" width="400" @on-ok="treeOk1" title="选择部门">
      <Tree :data="data2" @on-select-change="choiceAll1" ref="tree4"></Tree>
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
    name: "dept-manage",
    components: {},
    data() {
      return {
        fold: true,
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",

        searchItem: {
          deptName: "",
          // type: "",
          status: "",
          // startDate: "",
          // endDate: ""
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
            key: "title",
            minWidth: 250,
            title: "部门名称"
          },
          {
            key: "orderNum",
            title: "排序",
            width: 80
          },

          {
            key: "status",
            title: "状态",
            type: "template",
            template: "status"
          },

          {
            key: "createTime",
            title: "创建时间"
          },

          {
            title: "操作",
            key: "likes",
            minWidth: "200px",
            type: "template",
            template: "likes"
          }
        ],
        loading: false,
        add_Modal_show: false,
        add_loading: false,
        add_info: {},

        edit_Modal_show: false,
        edit_info: {},
        edit_loading: false,
        tree_Modal_show: false,
        tree_Modal_show1: false,
        data2: [],
        parentId: "",
        bumenname: "",
        deptId: "",
        ruleValidate: {
          deptName: [
            {
              required: true,
              message: "部门名称不能为空",
              trigger: "blur"
            }
          ],

          phone: [
            {
              required: true,
              message: "联系电话不能为空",
              trigger: "blur"
            },
            {
              type: "number",
              message: "请输入正确的手机号或固话号",
              trigger: "change",
              transform(value) {
                var phone = /^[1][3,4,5,7,8][0-9]{9}$/;
                var fixed = /0\d{2,3}\d{8}/;
                if (value) {
                  if (!phone.test(value) && !fixed.test(value)) {
                    return false;
                  } else {
                    return Number(value);
                  }
                }
              }
            }
          ],

          leader: [
            {
              required: true,
              message: "负责人不能为空",
              trigger: "blur"
            }
          ],

          status: [
            {
              required: true,
              message: "请选择状态",
              trigger: "change"
            }
          ],

          email: [
            {
              required: true,
              message: "邮箱不能为空",
              trigger: "blur"
            },
            {
              type: "email",
              message: "输入的邮箱格式不对",
              trigger: "blur"
            }
          ]
        },
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
        this.searchItem.deptName = ""
        this.searchItem.status = ""
        this.updateTableList({});
      },

      //搜索
      queryTableList() {
        this.searchType = 2
        this.updateTableList(this.searchItem);
      },

      // 更新
      update() {
        if(this.searchItem.name == "" || this.searchItem.name == " ") {
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

        // const reqParams = {
        //   deptName: this.searchItem.name,

        //   status: this.searchItem.status
        // };

        postRequest("/system/sys-dept/tree", obj).then(res => {
          this.TableLoading = false;
          if (res.isSuccess) {
            this.totalSize = res.data.total;
            this.table_list = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      //列表end---------------------

      addInfo() {
        this.add_info = {};
        this.add_info.orderNum = null;
        this.add_Modal_show = true;
        this.parentId = "";
        this.bumenname = "";
        this.deptId = "";
      },

      addOk(name) {
        if (this.deptId == "") {
          this.$Message.error("上级部门还没选择");
          return;
        }
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.add_info.orderNum == "") {
              this.$Message.error("显示排序不能为空!");
              return;
            }
            var reqParams = {
              // deptId: this.deptId,
              parentId: this.deptId,
              deptName: this.add_info.deptName,
              orderNum: this.add_info.orderNum,
              leader: this.add_info.leader,
              phone: this.add_info.phone,
              email: this.add_info.email,
              status: this.add_info.status
            };

            // console.log(reqParams);
            // return

            postRequest("/system/sys-dept/add", reqParams).then(res => {
              if (res.code == 200) {
                this.$Message.info("新增成功！");
                setTimeout(() => {
                  this.add_Modal_show = false;
                  this.updateTableList({});
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

      editInfo(name) {
        var reqParams = {
          deptId: name.deptId
        };
        postRequest(
          "/system/sys-dept/selectDeptById?deptId=" + name.deptId,
          reqParams
        ).then(res => {
          console.log(res.msg);
          if (res.code == 200) {
            this.edit_info = res.data;
            this.edit_Modal_show = true;

            this.parentId = res.data.parentId;
            this.bumenname = res.data.parentName;
            this.deptId = res.data.deptId;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      edit_add(name) {
        console.log(name);
        this.add_Modal_show = true;
        this.parentId = name.parentId;
        this.bumenname = name.title;
        this.deptId = name.deptId;
      },

      // 编辑
      editOk(name) {
        if (this.edit_info.orderNum == "") {
          this.$Message.error("显示排序不能为空!");
          return;
        }
        this.$refs[name].validate(valid => {
          if (valid) {
            var reqParams = {
              deptId: this.deptId,
              parentId: this.parentId,
              deptName: this.edit_info.deptName,
              orderNum: this.edit_info.orderNum,
              leader: this.edit_info.leader,
              phone: this.edit_info.phone,
              email: this.edit_info.email,
              status: this.edit_info.status,
              delFlag: this.edit_info.delFlag,
              createBy: this.edit_info.createBy,
              createTime: this.edit_info.createTime
            };
            // console.log(reqParams);
            // return

            postRequest("/system/sys-dept/edit", reqParams).then(res => {
              console.log(res.msg);
              if (res.code == 200) {
                this.$Message.info("编辑成功！");
                setTimeout(() => {
                  this.edit_Modal_show = false;
                  this.updateTableList({});
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

      refreshDept() {
        var reqParams = {};

        postRequest("/system/sys-dept/tree", reqParams).then(res => {
          if (res.code == "200") {
            this.data2 = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      choiceAll: function(data) {
        if(data){
          console.log(data);
          this.deptId = data[0].deptId;
          this.parentId = data[0].parentId;
          this.bumenname = data[0].title;
        }
      },

      choiceAll1: function(data) {
        if(data){
          console.log(data);
          // this.deptId = data[0].deptId;
          this.parentId = data[0].deptId;
          this.bumenname = data[0].title;
        }
      },

      treeOk() {
        if (this.deptId == undefined) {
          this.$Message.error("请选择部门名称");
          return;
        } else {
          this.tree_Modal_show = false;
        }
      },

      treeOk1() {
        if (this.deptId == undefined) {
          this.$Message.error("请选择部门名称");
          return;
        } else {
          this.tree_Modal_show1 = false;
        }
      },

      removeInfo(item) {
        let this1 = this
        this.$Modal.confirm({
          title: "删除确认",
          content: `删除后不可恢复，是否继续删除？`,
          onOk: function() {
            this.$Loading.start();
            postRequest("/system/sys-dept/delete?deptId=" + item.deptId).then(
              res => {
                this.loading = false;
                if (res.code == 200) {
                  this.$Message.info("删除成功！");
                  this1.updateTableList({});
                } else {
                  // this.$Message.error("删除失败!请稍后再试...!");
                  this.$Message.error(res.msg);
                }
              }
            );
          },
          onCancel: () => {
            this.$Message.info("点击了取消");
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
