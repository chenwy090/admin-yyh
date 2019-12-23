
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
              <Form-item label="会员手机号：" :label-width="100" prop="purePhoneNumber">
                <InputNumber
                  :max="999999999999"
                  :min="0"
                  type="text"
                  v-model="searchItem.phoneNumber"
                  clearable
                  placeholder="请输入手机号"
                  style="width: 180px"
                />
              </Form-item>

              <span v-show="drop">
                <Form-item label="注册渠道：" :label-width="85">
                  <Select
                    v-model="searchItem.source"
                    placeholder="请选择"
                    clearable
                    style="width: 200px"
                  >
                    <Option value>全部</Option>
                    <Option value="1">领优惠分享</Option>
                    <Option value="2">周边券分享</Option>
                    <Option value="3">要优惠发起拼券邀请</Option>
                    <Option value="4">要优惠参团助力邀请</Option>
                    <Option value="5">专属二维码分享邀请好友</Option>
                    <Option value="6">商家员工名片分享</Option>
                    <Option value="7">要优惠立即领取分享</Option>
                    <Option value="8">所有分享到小程序首页</Option>
                  </Select>
                </Form-item>
                <!--2019.12.23 注释
                <FormItem label="否促核销核销用户:" :label-width="130">
                  <Select v-model="searchItem.isWriteoffUser" style="width:100px">
                    <Option
                      v-for="(item,index) in writeoffUserList"
                      :value="item.value"
                      :key="index"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>

                 <FormItem label="促核销有效期：" :label-width="120" v-if="searchItem.isWriteoffUser == 1">
                  <DatePicker
                    type="daterange"
                    placeholder="请选择日期"
                    style="display:inline-block;width: 200px"
                    :value="daterange"
                    @on-change="changeStartDate"
                  ></DatePicker>
                </FormItem>-->
              </span>
              <FormItem style="margin-left:-35px;" class="br">
                <Button @click="queryTableList" type="primary" icon="ios-search">搜索</Button>
                <Button @click="reset">重置</Button>
                <a class="drop-down" @click="dropDown">
                  {{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a>
              </FormItem>
            </Form>
          </Row>

          <Row class="operation">
            <Button type="success" class="marginLeft20" @click="upload">更新促核销名单</Button>
          </Row>
        </Card>
        <Card>
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
          <Input v-model="edit_info.postName" placeholder="请输入" clearable />
        </FormItem>

        <FormItem label="岗位编码" prop="postCode">
          <Input v-model="edit_info.postCode" placeholder="请输入" clearable />
        </FormItem>
        <FormItem label="显示顺序" required>
          <InputNumber
            :max="99999"
            :min="0"
            v-model="edit_info.postSort"
            placeholder="请输入"
            clearable
            style="width:100%"
          />
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

    <!-- 不可赚钱/恢复赚钱 -->
    <Modal title="不可赚钱/恢复赚钱" v-model="updateAccountDisplay" :mask-closable="false" footer-hide>
      <Form ref="formCustom" :model="formCustom" :label-width="80" style="margin-top:20px">
        <FormItem label="填写原因" required>
          <Input type="textarea" :rows="2" v-model="formCustom.remark" style="width:300px"></Input>
          <!--<Input type="textarea" :rows="2" style="width:300px" ></Input>-->
        </FormItem>
        <FormItem>
          <Button type="primary" @click="updateAccountStatusFn">确认</Button>
          <Button style="margin-left: 8px" @click="updateAccountDisplay = false">关闭</Button>
        </FormItem>
      </Form>
    </Modal>

    <FileImport
      v-if="showFileImport"
      :showFileImport.sync="showFileImport"
      @refresh="updateTableList"
    ></FileImport>
  </div>
</template>

<script>
import { postRequest } from "@/libs/axios";
import FileImport from "./FileImport";

export default {
  name: "post-manage",
  components: { FileImport },
  data() {
    return {
      showDateSearch: false,
      // 文件上传
      showFileImport: false,
      // 是否促核销核销用户:isWriteoffUser  全部 空字符串""/ 1是/0否
      writeoffUserList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],
      // 促核销有效期:  startTime/endTime  格式:yyyy-MM-dd
      daterange: [],
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      searchItem: {
        phoneNumber: null,
        source: "",
        isWriteoffUser: "",
        startTime: "",
        endTime: ""
      },

      current: 1,
      totalSize: 0, //总条数
      pageNum: 1, //开始条数
      limit: 10, //每页记录数
      TableLoading: false,
      table_list: [],
      self: this,
      tableColumns: [
        // 是否促核销核销用户:isWriteoffUser 返回0/1==>前端转中文 1是、0否
        {
          title: "是否促核销",
          key: "isWriteoffUser",
          width: 200,
          align: "center",
          render: (h, params) => {
            const text = params.row.isWriteoffUser == "1" ? "是" : "否";
            return h("span", text);
          }
        },
        {
          title: "促核销开始时间",
          key: "startTime",
          width: 200,
          align: "center"
        },
        {
          title: "促核销结束时间",
          key: "endTime",
          width: 200,
          align: "center"
        },
        {
          title: "会员Id",
          key: "userVerifyCode",
          width: 200,
          align: "center"
        },
        {
          title: "可提现余额",
          key: "withdrawalBalance",
          width: 150,
          align: "center",
          sortable: true
        },
        {
          title: "userId",
          key: "userId",
          width: 150,
          align: "center"
        },
        {
          title: "手机号",
          key: "phoneNumber",
          width: 150,
          align: "center"
        },
        {
          title: "微信昵称",
          key: "nickName",
          width: 150,
          align: "center"
        },
        {
          title: "注册时间",
          key: "registerTime",
          width: 150,
          align: "center"
        },
        {
          title: "注册渠道",
          key: "source",
          width: 200,
          align: "center"
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          width: 100,
          render: (h, params) => {
            const row = params.row;
            const color = row.status == "1" ? "blue" : "red";
            const text =
              row.status == "1"
                ? "有效"
                : row.status == "2"
                ? "冻结"
                : "无账号";

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
          title: "操作",
          key: "action",
          fixed: "left",
          align: "center",
          width: 120,
          render: (h, params) => {
            const row = params.row;

            const color =
              row.status == 1 ? "red" : row.status == 2 ? "#5cadff" : "";
            const text =
              row.status == 1 ? "不可赚钱" : row.status == 2 ? "恢复赚钱" : "";
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    //color: "#5cadff",
                    color: color
                  },
                  on: {
                    click: () => {
                      this.inputUpdateAccountStatus(params.row);
                    }
                  }
                },
                text
              )
            ]);
          }
        },
        {
          title: "操作日志",
          key: "action",
          align: "center",
          width: 100,
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
                "查看"
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
      title: "",
      updateAccountDisplay: false, // 查看对话框
      // 审核form
      formCustom: {
        type: "", // USER_MANAGE会员管理
        id: "",
        userId: "",
        status: "",
        operation: "", // 操作
        remark: "" // 备注
      }
    };
  },

  created: function() {},
  methods: {
    init() {
      this.updateTableList();
    },
    changeStartDate(arr) {
      // yyyy-MM-dd
      this.searchItem.startTime = arr[0];
      this.searchItem.endTime = arr[1];
    },
    upload() {
      this.showFileImport = true;
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

    // 重置页面
    reset() {
      this.daterange = [];
      this.searchItem.isWriteoffUser = "";
      this.searchItem.startTime = "";
      this.searchItem.endTime = "";
      this.searchItem.phoneNumber = "";
      this.searchItem.source = "";
      /*this.searchItem.status = ""*/
      this.updateTableList();
    },

    //搜索
    queryTableList() {
      this.pageNum = 1;
      this.totalSize = 0;
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
        // phoneNumber: this.searchItem.phoneNumber,
        // source: this.searchItem.source,
        ...this.searchItem
      };

      let url = `/mini-user/list?pageNum=${this.pageNum}&pageSize=${this.limit}`;
      postRequest(url, reqParams).then(res => {
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
    updateAccountStatus(item) {
      this.edit_Modal_show = true;
      this.edit_info = item;
      this.title = "岗位管理编辑";
    },

    //编辑 查看详情优先级不高
    editInfo(item) {
      /*this.edit_Modal_show = true;
        this.edit_info = item;
        this.title = "岗位管理编辑";*/
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

    // 传值到审核对话框
    inputUpdateAccountStatus(row) {
      this.formCustom.userId = row.userId;
      this.formCustom.type = "会员管理";
      this.formCustom.status = row.status == 1 ? 2 : 1;
      this.updateAccountDisplay = true;
    },

    // 更新账户
    updateAccountStatusFn() {
      if (!this.formCustom.remark) {
        this.$Message.error("请填写操作原因!");
        return;
      }
      const reqParams = {
        userId: this.formCustom.userId,
        status: this.formCustom.status,
        remark: this.formCustom.remark,
        type: this.formCustom.type
      };
      postRequest("/account/edit", reqParams).then(res => {
        if (res.code == 200) {
          this.msgOk("更新成功");
          this.updateAccountDisplay = false;
          //this.getList({});
          // 清空输入框
          this.formCustom.userId = "";
          this.formCustom.type = "";
          this.formCustom.status = "";
          this.formCustom.remark = "";
          this.updateTableList();
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    // 全局提示
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
    },
    removeInfoTest(item) {
      const self = this;

      this.$Modal.confirm({
        title: "不可赚钱/恢复赚钱",
        content: `填写原因`,
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
