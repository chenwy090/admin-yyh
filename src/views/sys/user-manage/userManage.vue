

<template>
  <div class="search">
    <Row>
      <Col span="19" push="5">
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="用户名称" prop="userName">
                <Input
                  type="text"
                  v-model="searchForm.userName"
                  clearable
                  placeholder="请输入用户名"
                  style="width: 200px"
                />
              </Form-item>

              <span v-if="drop">
                <Form-item label="手机号" prop="phonenumber">
                  <InputNumber
                    :max="999999999999"
                    :min="0"
                    type="text"
                    v-model="searchForm.phonenumber"
                    clearable
                    placeholder="请输入手机号"
                    style="width: 200px"
                  />
                </Form-item>
                <Form-item label="邮箱" prop="email">
                  <Input
                    type="text"
                    v-model="searchForm.email"
                    clearable
                    placeholder="请输入邮箱"
                    style="width: 200px"
                  />
                </Form-item>
                <Form-item label="用户状态" prop="status">
                  <Select
                    v-model="searchForm.status"
                    placeholder="请选择"
                    clearable
                    style="width: 200px"
                  >
                    <Option value="1">正常</Option>
                    <Option value="0">禁用</Option>
                  </Select>
                </Form-item>
              </span>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="searchUser" type="primary" icon="ios-search">搜索</Button>
                <Button @click="resetForm('searchForm')">重置</Button>
                <a class="drop-down" @click="dropDown">
                  {{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a>
              </Form-item>
            </Form>
          </Row>
        </Card>
        <Card>
          <Row class="operation">
            <Button type="primary" icon="md-add" @click="addUseDisplayFn">添加用户</Button>

            <Button @click="update" icon="md-refresh">刷新</Button>
          </Row>
          <!-- 用户列表 -->
          <Row>
            <Table
              :loading="TableLoading"
              border
              :columns="tableColumns"
              :data="table_list"
              sortable="custom"
              ref="table"
            >
              <template slot-scope="{ row }" slot="operate">
                <Button
                  type="text"
                  size="small"
                  style="color:#2db7f5"
                  @click="ingputEditUserData(row)"
                >编辑</Button>
                <Button type="text" size="small" style="color:#ed4014" @click="inputDelUser(row)">删除</Button>
                <Button
                  type="text"
                  size="small"
                  style="color:#21b6b8"
                  @click="resetPassword(row)"
                >重置密码</Button>
              </template>
              <template slot-scope="{ row }" slot="sex">
                <span v-if="row.sex == 0">男</span>
                <span v-else-if="row.sex == 1">女</span>
              </template>
              <template slot-scope="{ row }" slot="status">
                <span v-if="row.status == 0" style="color:#ed4014">禁用</span>
                <span v-else-if="row.status == 1" style="color:#19be6b">正常</span>
              </template>
              <template slot-scope="{ row }" slot="createTime">
                <span v-if="row.createTime">{{row.createTime | timeFilters}}</span>
                <span v-else style="color:#ddd">暂无</span>
              </template>
              <template slot-scope="{ row }" slot="updateTime">
                <span v-if="row.updateTime">{{row.updateTime | timeFilters}}</span>
                <span v-else style="color:#ddd">暂无</span>
              </template>
              <template slot-scope="{ row }" slot="email">
                <span v-if="row.email">{{row.email}}</span>
                <span v-else style="color:#ddd">暂无</span>
              </template>
              <template slot-scope="{ row }" slot="phonenumber">
                <span v-if="row.phonenumber">{{row.phonenumber}}</span>
                <span v-else style="color:#ddd">暂无</span>
              </template>
              <template slot-scope="{ row }" slot="updateBy">
                <span v-if="row.updateBy">{{row.updateBy}}</span>
                <span v-else style="color:#ddd">暂无</span>
              </template>
            </Table>
          </Row>
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
      </Col>
      <!-- 左边树形部门 -->
      <Col span="5" pull="19">
        <Card>
          <p slot="title">
            <Icon type="ios-contacts"/>机构组织
            <Button type="text" size="small" class="refurbishBtn" @click="getTreeSectionFn">
              <Icon type="md-refresh" size="20" color="bule"/>
            </Button>
          </p>
          <Tree :data="treeSection" @on-select-change="getTreeDeptListFn"></Tree>
        </Card>
      </Col>
    </Row>
    <!-- 左边树形部门 -->
    <!-- 添加按钮弹框 -->
    <Modal
      v-model="addUseDisplay"
      :mask-closable="maskClosable"
      title="添加用戶"
      @on-ok="handleSubmit('formValidate')"
      @on-cancel="resetForm('formValidate')"
      :loading="loading"
      width="750"
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="登录名称" prop="loginName">
              <Input v-model="formValidate.loginName" placeholder="请输入登录名称" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="登录密码" prop="password">
              <Input
                v-model="formValidate.password"
                placeholder="请输入6位登录密码，不能有空格"
                type="password"
                clearable
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="部门名称" prop="deptId">
              <Button
                long
                @click="treeBtnDisplay = true"
                class="align"
                v-if="selectDeptCn == ''"
              >未绑定部门</Button>
              <Button long @click="treeBtnDisplay = true" class="align" v-else>{{ selectDeptCn }}</Button>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="用户名称" prop="userName">
              <Input v-model="formValidate.userName" placeholder="请输入用户名称" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="邮箱" prop="email">
              <Input v-model="formValidate.email" placeholder="请输入邮箱" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="手机" prop="phonenumber">
              <Input v-model="formValidate.phonenumber" placeholder="请输入手机" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="性别" prop="sex">
              <Select v-model="formValidate.sex" placeholder="请选择性别" class="align">
                <Option value="0">男</Option>
                <Option value="1">女</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="状态" prop="status">
              <Select v-model="formValidate.status" placeholder="请选择状态" class="align">
                <Option value="1">正常</Option>
                <Option value="0">禁用</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="岗位" prop="postIds">
              <Select v-model="formValidate.postIds" placeholder="请选择岗位（可以多选）" multiple>
                <Option
                  v-for="(item, index) in allPosts"
                  :key="index"
                  :value="item.postId"
                  :disabled="item.disabled"
                >{{item.postName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="角色" prop="roleIds">
              <CheckboxGroup v-model="formValidate.roleIds" style="width:530px">
                <Checkbox
                  v-for="(item, index) in allRoles"
                  :key="index"
                  :label="item.roleId"
                  :disabled="item.disabled"
                >{{item.roleName}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <!-- <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>-->
      </Form>
    </Modal>
    <!-- 添加按钮弹框 -->
    <!-- 树形部门弹框 （添加用户的部门按钮） -->
    <Modal v-model="treeBtnDisplay" title="请选择部门">
      <Tree :data="treeSection1" @on-select-change="inputDeptId"></Tree>
    </Modal>
    <!-- 树形部门弹框 （添加用户的部门按钮） -->
    <!-- 删除用户对话框 -->
    <!-- <Modal v-model="delUserDisplay" title="删除用户" @on-ok="delUser">
      <span style="color:red">确认删除该用户？</span>
    </Modal>-->
    <!-- 删除用户对话框 -->
    <!-- 编辑按钮弹框 -->
    <Modal
      v-model="editUseDisplay"
      :mask-closable="maskClosable"
      title="编辑用戶"
      @on-ok="editUseDataFn('editUseData')"
      @on-cancel="resetForm('editUseData')"
      :loading="loading"
      width="750"
    >
      <Form ref="editUseData" :model="editUseData" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="登录名称" prop="loginName">
              <Input v-model="editUseData.loginName" placeholder="请输入登录名称" clearable/>
            </FormItem>
          </Col>
          <Col span="12" style="height: 56.9px">
            <FormItem label="部门名称" prop="deptId">
              <Button
                long
                @click="treeBtnDisplay1 = true"
                class="align"
                v-if="!editUserDeptNameCn"
              >未绑定部门</Button>
              <Button
                long
                @click="treeBtnDisplay1 = true"
                class="align"
                v-else
              >{{ editUserDeptNameCn }}</Button>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="用户名称" prop="userName">
              <Input v-model="editUseData.userName" placeholder="请输入用户名称" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="邮箱" prop="email">
              <Input v-model="editUseData.email" placeholder="请输入邮箱" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="手机" prop="phonenumber">
              <Input v-model="editUseData.phonenumber" placeholder="请输入手机" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="性别" prop="sex">
              <Select v-model="editUseData.sex" placeholder="请选择性别" class="align">
                <Option value="1">女</Option>
                <Option value="0">男</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="状态" prop="status">
              <Select v-model="editUseData.status" placeholder="请选择状态" class="align">
                <Option value="1">正常</Option>
                <Option value="0">禁用</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="岗位" prop="postIds">
              <Select v-model="editUseData.postIds" placeholder="请选择岗位（可以多选）" multiple>
                <Option
                  v-for="(item, index) in allPosts"
                  :key="index"
                  :value="item.postId"
                  :disabled="item.disabled"
                >{{item.postName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="角色" prop="roleIds">
              <CheckboxGroup v-model="editUseData.roleIds" style="width:530px">
                <Checkbox
                  v-for="(item, index) in allRoles"
                  :key="index"
                  :label="item.roleId"
                  :disabled="item.disabled"
                >{{item.roleName}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <!-- <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>-->
      </Form>
    </Modal>
    <!-- 编辑按钮弹框 -->
    <!-- 树形部门弹框 （编辑用户的部门按钮） -->
    <Modal v-model="treeBtnDisplay1" title="请选择部门">
      <Tree :data="treeSection2" @on-select-change="inputEditDeptId"></Tree>
    </Modal>
    <!-- 树形部门弹框 （编辑用户的部门按钮） -->
  </div>
</template>

<script>
  import {
    getTreeSection,
    getTreeDeptList,
    addUser,
    delUser,
    resetPwd,
    getUserData,
    editUser
  } from "@/api/sys";

  export default {
    name: "user-manage",
    components: {},
    data() {
      return {
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",
        searchForm: {
          //搜索form
          userName: "",
          phonenumber: null,
          email: "",
          status: ""
        },
        current: 1,
        totalSize: 0, //总条数
        // pageNum: 1, //开始条数
        limit: 10, //每页记录数
        TableLoading: false,
        table_list: [],
        self: this,
        tableColumns: [
          //用户列表 字段显示
          {
            title: "操作",
            width: 190,
            align: "center",
            fixed: "left",
            slot: "operate"
          },
          {
            title: "ID",
            key: "userId",
            minWidth: 80
          },
          {
            title: "用户名称",
            key: "userName",
            minWidth: 145
          },
          {
            title: "登录名称",
            key: "loginName",
            minWidth: 145
          },
          {
            title: "部门",
            key: "deptName",
            minWidth: 145
          },
          {
            title: "创建人",
            key: "createBy",
            minWidth: 145
          },
          {
            title: "创建时间",
            key: "createTime",
            minWidth: 165,
            slot: "createTime"
          },
          {
            title: "修改人",
            key: "updateBy",
            minWidth: 145,
            slot: "updateBy"
          },
          {
            title: "修改时间",
            key: "updateTime",
            minWidth: 165,
            slot: "updateTime"
          },
          {
            title: "手机",
            key: "phonenumber",
            minWidth: 145,
            slot: "phonenumber"
          },
          {
            title: "邮件",
            key: "email",
            minWidth: 145,
            slot: "email"
          },
          {
            title: "性别",
            key: "sex",
            minWidth: 80,
            slot: "sex"
          },
          {
            title: "状态",
            key: "status",
            minWidth: 80,
            slot: "status"
          }
        ],

        treeSection: [], // 树状结构（界面左边）
        treeSection1: [], // 树状结构（添加用户）
        treeSection2: [], // 树状结构（编辑用户）
        addUseDisplay: false, //添加按钮显示
        loading: true, //解决对话框和表单验证冲突
        formValidate: {
          // 添加用户form表单
          //avatar: "", //头像路径
          deptId: 0, //部门id
          email: "", //用户邮箱
          loginName: "", //登录账号
          password: "", //密码
          phonenumber: "", //手机号
          postIds: [], //岗位id
          roleIds: [], //角色id
          sex: "", //性别
          status: "", //状态
          userName: "", //用户昵称
          userType: "00" //用户类型
        },
        // 用户验证
        ruleValidate: {
          loginName: [
            {
              required: true,
              message: "必须输入登录账号",
              trigger: "blur"
            }
          ],
          userName: [
            {
              required: true,
              message: "必须输入用户名称",
              trigger: "blur"
            }
          ],
          deptId: [
            {
              required: true,
              message: "必须选择部门称"
            }
          ],
          phonenumber: [
            // String regExp = "^(13[0-9]|14[56789]|15[0-3,5-9]|16[56]|17[0-3,5-8]|18[0-9]|19[189])\\d{8}$";
            {
              type: "number",
              message: "请输入正确的手机号",
              trigger: "change",
              transform(value) {
                var phone = /^(13[0-9]|14[56789]|15[0-3,5-9]|16[56]|17[0-3,5-8]|18[0-9]|19[189])\\d{8}$/;
                if (value) {
                  if (!phone.test(value)) {
                    return false;
                  } else {
                    return Number(value);
                  }
                }
              }
            }
          ],
          email: [
            { type: "email", message: "请输入正确邮箱", trigger: "change" }
          ],
          password: [
            {
              required: true,
              message: "必须输入密码",
              trigger: "blur"
            },
            {
              type: "string",
              min: 6,
              message: "密码不能小于6位",
              trigger: "change"
            }
          ],
          sex: [
            {
              required: true,
              message: "必须选择性别",
              trigger: "change"
            }
          ],
          status: [
            {
              required: true,
              message: "必须选择状态",
              trigger: "change"
            }
          ],
          postIds: [
            {
              required: true,
              type: "array",
              min: 1,
              message: "至少选择一个岗位",
              trigger: "change"
            }
          ],
          roleIds: [
            {
              required: true,
              type: "array",
              min: 1,
              message: "至少选择一个角色",
              trigger: "change"
            }
          ]
        },
        maskClosable: false, // 是否点击遮罩层关闭弹框
        treeBtnDisplay: false, //树形部门弹框显示(添加用户)
        clickDeptId: "", //当前选中的部门id
        // selectDeptId: 0, // 选择部门id （添加用户）
        selectDeptCn: "", // 选择部门中文名称 （添加用户）
        inquiryStatus: 1, //分页查询状态：1：全部用户 2：搜索 3：树形
        allPosts: [], //全部岗位
        allRoles: [], //全部角色
        delUserDisplay: false, //删除用户确认对话框显示
        // delUserId: 0, //要删除的用户id
        editUseDisplay: false, //编辑用户对话框显示
        editUseData: {
          // 编辑用户form表单
          deptId: 0, //部门id
          email: "", //用户邮箱
          loginName: "", //登录账号
          phonenumber: "", //手机号
          postIds: [], //岗位id
          roleIds: [], //角色id
          sex: "", //性别
          status: "", //状态
          userName: "", //用户昵称
          userType: "00", //用户类型
          userId: 0 // 编辑用户id
        },
        editUserDeptNameCn: "", // 编辑用户部门中文名
        treeBtnDisplay1: false // 编辑用户树形部门
      };
    },
    created() {
      this.getUserList();
      this.getTreeSectionFn();
    },

    methods: {
      // 刷新
      update() {
        this.searchUser();
      },

      // 获取用户列表
      getUserList() {
        // 加载动画
        this.TableLoading = true;
        getTreeDeptList({}).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.table_list = res.data.records;
            // 分页
            this.current = res.data.current;
            this.totalSize = res.data.total;
            this.inquiryStatus = 1;
            // 加载动画
            this.TableLoading = false;
          } else {
            this.msgErr("获取用户失败");
          }
        });
      },
      // 获取树形部门
      getTreeSectionFn() {
        getTreeSection().then(res => {
          //console.log("1111",res.depts);
          if (res.code == 200) {
            this.treeSection = this.treeMap(res.depts);
          } else {
            this.$Message.info("获取部门失败");
          }
        });
      },

      // 遍历树形部门数据
      treeMap(data) {
        let arr = [];
        // 第一层
        data.forEach(item => {
          let obj = {};
          obj.title = item.deptName;
          obj.id = item.deptId;
          obj.expand = true;
          if (item.children.length > 0) {
            let arr1 = [];
            // 第二层
            item.children.forEach(index => {
              let obj1 = {};
              obj1.title = index.deptName;
              obj1.id = index.deptId;
              obj1.expand = true;
              if (index.children.length > 0) {
                let arr2 = [];
                // 第三层
                index.children.forEach(value => {
                  let obj2 = {};
                  obj2.title = value.deptName;
                  obj2.id = value.deptId;
                  obj2.expand = true;
                  arr2.push(obj2);
                });
                obj1.children = arr2;
              }
              arr1.push(obj1);
            });
            obj.children = arr1;
          }
          arr.push(obj);
        });
        return arr;
      },

      //分页
      changeCurrent(current) {
        this.current = current;

        // 加载动画
        this.TableLoading = true;

        if (this.inquiryStatus == 1) {
          getTreeDeptList({}, current).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.table_list = res.data.records;
              // 分页
              this.current = res.data.current;
              this.totalSize = res.data.total;

              // 加载动画
              this.TableLoading = false;
            } else {
              this.msgErr("获取用户失败");
            }
          });
        } else if (this.inquiryStatus == 2) {
          getTreeDeptList(this.searchForm, current).then(res => {
            if (res.code == 200) {
              this.table_list = res.data.records;
              // 分页
              this.current = res.data.current;
              this.totalSize = res.data.total;
              this.inquiryStatus = 2;
              // 加载动画
              this.TableLoading = false;
            } else {
              this.msgErr("获取用户失败");
            }
          });
        } else if (this.inquiryStatus == 3) {
          let obj = {};
          obj.deptId = this.clickDeptId;
          // 加载动画
          this.TableLoading = true;
          getTreeDeptList(obj, current).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.table_list = res.data.records;
              // 分页
              this.current = res.data.current;
              this.totalSize = res.data.total;
              this.inquiryStatus = 3;
              // 加载动画
              this.TableLoading = false;
            } else {
              this.msgErr("获取部门失败");
            }
          });
        }
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

      //添加用户 隐藏/显示函数
      addUseDisplayFn() {
        getTreeSection().then(res => {
          if (res.code == 200) {
            this.allPosts = res.posts;
            //处理岗位
            for (let i = 0; i < this.allPosts.length; i++) {
              // （0正常 1停用）true为开启禁用
              if (this.allPosts[i].status == "1") {
                this.allPosts[i].disabled = true;
              } else if (this.allPosts[i].status == "0") {
                this.allPosts[i].disabled = false;
              }
            }
            this.allRoles = res.roles;
            //处理角色
            for (let i = 0; i < this.allRoles.length; i++) {
              // （0正常 1停用）true为开启禁用
              if (this.allRoles[i].status == "1") {
                this.allRoles[i].disabled = true;
              } else if (this.allRoles[i].status == "0") {
                this.allRoles[i].disabled = false;
              }
            }
            this.addUseDisplay = true;
            // console.log(this.allPosts);
            this.treeSection1 = this.treeMap(res.depts);
          } else {
            this.$Message.info("获取部门失败");
          }
        });
      },

      // 弹框按钮
      msgOk(txt) {
        this.$Message.info({
          content: txt,
          duration: 3
        });
      },
      msgErr(txt) {
        this.$Message.error({
          content: txt,
          duration: 3
        });
      },

      // 添加用户 提交form表单
      handleSubmit(name) {
        if (!this.selectDeptCn) {
          this.msgErr("部门不能为空");
          this.loading = false;
          return;
        }
        if (this.formValidate.password.indexOf(" ") >= 0) {
          this.msgErr("密码不能有空格");
          this.loading = false;
          return;
        }
        this.$refs[name].validate(valid => {
          if (valid) {
            // 成功
            const obj = {
              deptId: this.formValidate.deptId,
              loginName: this.formValidate.loginName,
              userName: this.formValidate.userName,
              password: this.formValidate.password,
              sex: this.formValidate.sex,
              email: this.formValidate.email,
              phonenumber: this.formValidate.phonenumber,
              status: this.formValidate.status,
              postIds: this.formValidate.postIds.toString(),
              roleIds: this.formValidate.roleIds.toString(),
              userType: this.formValidate.userType
            };

            addUser(obj).then(res => {
              //console.log(res);
              if (res.code == 200) {
                this.addUseDisplay = false;
                this.formValidate.postIds = [];
                this.formValidate.roleIds = [];
                this.resetForm(name);
                this.msgOk("添加用户成功");
                this.getUserList();
              } else {
                this.loading = false;
                this.msgErr(res.msg);
              }
            });
          } else {
            this.$Message.error("请输入必填项");
            setTimeout(() => {
              this.loading = false;
              this.$nextTick(() => {
                this.loading = true;
              });
            }, 500);
          }
        });
      },

      // 重置form表单
      resetForm(name) {
        if (name == "formValidate") {
          this.selectDeptCn = "";
        } else if (name == "selectDeptCn") {
          this.editUserDeptNameCn = "";
        }
        this.$refs[name].resetFields();
        if (name == "searchForm") {
          this.getUserList();
        }
      },

      // 点击树形部门获取列表
      getTreeDeptListFn(data) {
        if (data.length != 0) {
          // console.log(data);

          this.clickDeptId = data[0].id;
          // console.log(this.clickDeptId);
          let obj = {};
          obj.deptId = this.clickDeptId;
          // 加载动画
          this.TableLoading = true;
          getTreeDeptList(obj).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.table_list = res.data.records;
              // 分页
              this.current = res.data.current;
              this.totalSize = res.data.total;
              this.inquiryStatus = 3;
              // 加载动画
              this.TableLoading = false;
            } else {
              this.msgErr("获取部门失败");
            }
          });
        }
      },

      // 添加用户树形部门传值到form
      inputDeptId(data) {
        if (data.length != 0) {
          this.formValidate.deptId = data[0].id;
          this.selectDeptCn = data[0].title;
        } else {
          this.$Message.error("选择部门未成功");
        }
      },

      // 搜索用户信息
      searchUser() {
        getTreeDeptList(this.searchForm).then(res => {
          if (res.code == 200) {
            this.table_list = res.data.records;
            // 分页
            this.current = res.data.current;
            this.totalSize = res.data.total;
            this.inquiryStatus = 2;
            // 加载动画
            this.TableLoading = false;
            // 重置
            // this.resetForm('searchForm')
          } else {
            this.msgErr("获取用户失败");
          }
        });
      },

      //删除用户对话框
      inputDelUser(row) {
        // this.delUserId = row.userId;
        // this.delUserDisplay = true;
        this.$Modal.confirm({
          title: "删除用户",
          content: "<p>确认删除该用户？</p>",
          onOk: () => {
            delUser(row.userId).then(res => {
              if (res.code == 200) {
                this.msgOk("删除用户成功");
                this.getUserList();
              } else {
                this.msgErr("删除用户失败，请重试");
              }
            });
          },
          onCancel: () => {
            this.$Message.info("点击了取消");
          }
        });
      },

      // 删除用户
      // delUser() {
      //   delUser(this.delUserId).then(res => {
      //     if (res.code == 200) {
      //       this.msgOk("删除用户成功");
      //       this.getUserList();
      //     } else {
      //       this.msgErr("删除用户失败");
      //     }
      //   });
      // },

      // 重置密码
      resetPassword(row) {
        this.$Modal.confirm({
          title: "重置密码",
          content: "<p>确认初始化该用户密码为123456吗？</p>",
          onOk: () => {
            // 确认
            let obj = {
              userId: row.userId,
              deptId: row.deptId,
              password: "123456"
            };
            resetPwd(obj).then(res => {
              if (res.code == 200) {
                this.msgOk("重置用户密码成功");
              } else {
                this.msgErr("重置用户密码失败,请重试");
              }
            });
          },
          onCancel: () => {
            // 关闭
            this.msgOk("点击了取消");
          }
        });
      },

      // 传值到编辑用户
      ingputEditUserData(row) {
        this.editUseData.userId = row.userId;
        getUserData(row.userId).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.editUseData.deptId = res.user.deptId;
            this.editUseData.email = res.user.email;
            this.editUseData.loginName = res.user.loginName;
            this.editUseData.phonenumber = res.user.phonenumber;
            this.editUseData.sex = res.user.sex;
            this.editUseData.status = res.user.status;
            this.editUseData.userName = res.user.userName;
            this.editUseData.postIds = res.userPostIds;
            this.editUseData.roleIds = res.userRoleIds;

            this.editUserDeptNameCn = res.deptName;

            getTreeSection().then(res => {
              if (res.code == 200) {
                this.allPosts = res.posts;
                //处理岗位
                for (let i = 0; i < this.allPosts.length; i++) {
                  // （0正常 1停用）true为开启禁用
                  if (this.allPosts[i].status == "1") {
                    this.allPosts[i].disabled = true;
                  } else if (this.allPosts[i].status == "0") {
                    this.allPosts[i].disabled = false;
                  }
                }
                this.allRoles = res.roles;
                //处理角色
                for (let i = 0; i < this.allRoles.length; i++) {
                  // （0正常 1停用）true为开启禁用
                  if (this.allRoles[i].status == "1") {
                    this.allRoles[i].disabled = true;
                  } else if (this.allRoles[i].status == "0") {
                    this.allRoles[i].disabled = false;
                  }
                }
                this.editUseDisplay = true;
                this.treeSection2 = this.treeMap(res.depts);
              } else {
                this.$Message.info("获取部门失败");
              }
            });
          } else {
            this.msgErr("获取用户信息失败");
          }
        });
      },

      //编辑用户提交
      editUseDataFn(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            // 成功
            if (!this.editUserDeptNameCn) {
              this.msgErr("部门不能为空");
              this.loading = false;
              return;
            }
            // let obj = this.editUseData
            // obj.postIds = obj.postIds.toString()
            // obj.roleIds = obj.roleIds.toString()

            const obj = {
              deptId: this.editUseData.deptId,
              email: this.editUseData.email,
              loginName: this.editUseData.loginName,
              phonenumber: this.editUseData.phonenumber,
              postIds: this.editUseData.postIds.toString(),
              roleIds: this.editUseData.roleIds.toString(),
              sex: this.editUseData.sex,
              status: this.editUseData.status,
              userName: this.editUseData.userName,
              userType: this.editUseData.userType,
              userId: this.editUseData.userId
            };

            editUser(obj).then(res => {
              if (res.code == 200) {
                this.editUseDisplay = false;
                this.editUseData.postIds = [];
                this.editUseData.roleIds = [];
                this.resetForm(name);
                this.msgOk("编辑用户成功");
                this.getUserList();
              } else {
                this.loading = false;
                this.msgErr(res.msg);
              }
            });
          } else {
            this.$Message.error("请输入必填项");
            setTimeout(() => {
              this.loading = false;
              this.$nextTick(() => {
                this.loading = true;
              });
            }, 500);
          }
        });
      },

      // 添加用户树形部门传值到form
      inputEditDeptId(data) {
        if (data.length != 0) {
          this.editUseData.deptId = data[0].id;
          this.editUserDeptNameCn = data[0].title;
          //console.log(this.editUseData);
        } else {
          this.msgErr("选择部门未成功");
        }
      }
    },
    mounted() {},
    filters: {
      timeFilters: function(value) {
        if (value) {
          var date = value.slice(0, 10);
          var time = value.slice(11, 19);
          return date + " " + time;
        }
      }
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
