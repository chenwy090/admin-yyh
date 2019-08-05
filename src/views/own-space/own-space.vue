<style lang="less">
  @import "./own-space.less";
</style>

<template>
  <div class="own-space">
    <Card>
      <Tabs :animated="false">
        <TabPane label="基本信息" name="info">
          <Form ref="userForm" :model="userForm" :label-width="100" label-position="right">
            <FormItem label="用户名称">
              <span>{{table_list.userName}}</span>
            </FormItem>

            <FormItem label="登录名称">
              <span>{{table_list.loginName}}</span>
            </FormItem>
            <FormItem label="所属部门：">
              <span>{{ table_list.deptName }}</span>
            </FormItem>

            <FormItem label="手机号：">
              <span>{{table_list.phonenumber}}</span>
            </FormItem>
            <FormItem label="邮箱：">
              <span>{{table_list.email}}</span>
            </FormItem>

            <FormItem label="性别：">
              <span v-if="table_list.sex == 0">男</span>
              <span v-else-if="table_list.sex == 1">女</span>
            </FormItem>

            <FormItem label="状态：">
              <span v-if="table_list.status == 0" style="color:#ed4014">禁用</span>
              <span v-else-if="table_list.status == 1" style="color:#19be6b">正常</span>
            </FormItem>

            <FormItem>
              <!-- <Button @click="cancel">返回</Button> -->
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="修改密码" name="password">
          <Form ref="editPwd" :model="editPwd" :label-width="100" label-position="right">
            <FormItem label="密码显示">
              <i-switch size="large" v-model="switch1" @on-change="switchChange">
                <span slot="open">显示</span>
                <span slot="close">隐藏</span>
              </i-switch>
            </FormItem>
            <FormItem label="原密码">
              <Input
                :type="inputType"
                v-model="editPwd.originalPwd"
                clearable
                placeholder="请输入原密码"
                style="width: 200px"
              />
            </FormItem>

            <FormItem label="新密码">
              <Input
                :type="inputType"
                v-model="editPwd.onePwd"
                clearable
                placeholder="最少输入6位,不能有空格"
                style="width: 200px"
              />
            </FormItem>
            <FormItem label="新密码检验">
              <Input
                :type="inputType"
                v-model="editPwd.twoPwd"
                clearable
                placeholder="最少输入6位,不能有空格"
                style="width: 200px"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="modifyPassword">确认修改</Button>
              <Button style="margin-left:30px" @click="resetting">重置</Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
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
    name: "ownspace_index",
    data() {
      return {
        userForm: {},
        saveLoading: false,
        table_list: [],
        current: 1,
        totalSize: 0, //总条数
        pageNum: 1, //开始条数
        limit: 10, //每页记录数
        allPosts: [],
        allRoles: [],
        switch1: false, //开关状态
        inputType: "password", //输入框状态
        // 修改密码
        editPwd: {
          originalPwd: "",
          onePwd: "",
          twoPwd: ""
        }
      };
    },
    methods: {
      init() {
        this.userForm = JSON.parse(this.getStore("userInfo"));

        this.updateTableList();
      },

      updateTableList() {
        const reqParams = {
          userName: this.userForm.username
        };
        postRequest(
          "/system/sys-user/list?pageNum=" +
            this.pageNum +
            "&pageSize=" +
            this.limit,
          reqParams
        ).then(res => {
          if (res.isSuccess) {
            this.table_list = res.data.records[0];
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      cancel() {
        this.$store.commit("removeTag", "ownspace");
        localStorage.pageOpenedList = JSON.stringify(
          this.$store.state.app.pageOpenedList
        );
        let lastPageName = "";
        let length = this.$store.state.app.pageOpenedList.length;
        if (length > 1) {
          lastPageName = this.$store.state.app.pageOpenedList[length - 1].name;
        } else {
          lastPageName = this.$store.state.app.pageOpenedList[0].name;
        }
        this.$router.push({
          name: lastPageName
        });
      },

      // 切换显示状态
      switchChange(status) {
        // console.log(this.switch1);
        if (status == true) {
          this.inputType = "text";
        } else if (status == false) {
          this.inputType = "password";
        }
      },

      // 修改密码
      modifyPassword() {
        if (this.editPwd.onePwd.indexOf(" ") >=0){
          this.$Message.error("新密码不能有空格");
          return
        }
        if (this.editPwd.twoPwd.indexOf(" ") >=0){
          this.$Message.error("新密码检验不能有空格");
          return
        }
        if (!this.editPwd.originalPwd) {
          this.$Message.error("原密码不能为空");
          return;
        }
        if (!this.editPwd.onePwd) {
          this.$Message.error("新密码不能为空");
          return;
        }
        if (!this.editPwd.twoPwd) {
          this.$Message.error("新密码检验不能为空");
          return;
        }
        if (this.editPwd.onePwd.length < 6) {
          this.$Message.error("新密码至少6位");
          return;
        }
        if (this.editPwd.twoPwd.length < 6) {
          this.$Message.error("新密码检验至少6位");
          return;
        }
        if (this.editPwd.onePwd != this.editPwd.twoPwd) {
          this.$Message.error("新密码两次输入不一样");
          return;
        }
        
        const newPassword = this.editPwd.twoPwd;
        const oldPassword = this.editPwd.originalPwd;
        postRequest(
          `/system/sys-user/editPassWord?newPassword=${newPassword}&oldPassword=${oldPassword}`
        ).then(res => {
          console.log(res);
          if (res.code == 200) {
            this.$Message.info({
              content: "密码修改成功,请重新登录",
              duration: 3
            });
            setTimeout(() => {
              this.logOutOk();
            }, 3500);
          } else {
            this.$Message.error(res.msg);
          }
        });
      },

      spaceFn1(event) {
        // console.log(event);
        // if (event.data == " ") {
        //   this.$Message.info({
        //     content: "不能以空格为密码",
        //     duration: 3
        //   });
        //   // let onePwd = this.editPwd.onePwd
        //   // this.editPwd.onePwd = this.editPwd.onePwd.substring(0,this.editPwd.onePwd.length-1)
        //   var lastIndex = this.editPwd.onePwd.lastIndexOf(" ");
        //   if (lastIndex > -1) {
        //     this.editPwd.onePwd = this.editPwd.onePwd.substring(0, lastIndex) + this.editPwd.onePwd.substring(lastIndex + 1, this.editPwd.onePwd.length);
        //   }
        // }
      },

      // 退出登录
      logOutOk() {
        this.$store.commit("logout", this);
        this.$store.commit("clearOpenedSubmenu");
        // 强制刷新页面 重新加载router
        location.reload();
      },

      //重置
      resetting() {
        this.editPwd.originalPwd = "";
        this.editPwd.onePwd = "";
        this.editPwd.twoPwd = "";
      }
    },
    mounted() {
      this.init();
    }
  };
</script>
