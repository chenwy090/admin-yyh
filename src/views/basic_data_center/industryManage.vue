
<template>
  <div class="search">
    <div v-if="!secondIndustryManagePage">
    <Row>
      <Col>
        <Card>
          <Row class="operation">
            <Button type="primary" icon="md-add" @click="addFirstInfo()">新增一级行业</Button>
            <Button type="primary" icon="md-add" @click="addSecondInfo()">新增二级行业</Button>
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
    </div>
    <Modal width="700" v-model="edit_Modal_show" :title="title" :mask-closable="false">
      <Form :model="edit_info" ref="edit_info" :label-width="80" :rules="ruleValidate">
        <span v-if="edit_info.firstPage && !edit_info.industryIsSecond">
          <FormItem label="一级行业" >
            <Input v-model="edit_info.name" placeholder="请输入" :maxlength="20" clearable/>
          </FormItem>
         </span>
        <span v-if="edit_info.secondPage || edit_info.industryIsSecond">
          <FormItem label="一级行业" >
            <!--<Input v-model="edit_info.pa" placeholder="请输入" clearable/>-->
            <Select v-model="edit_info.parentId" style="width:150px" clearable @on-change="getFirstIndustrylist">
            <Option v-for="(item,index) in parentList" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
          </FormItem>
          <FormItem label="二级行业" >
            <Input v-model="edit_info.name" placeholder="请输入" :maxlength="20" clearable/>
          </FormItem>
        </span>
        <FormItem label="排序" prop="orderBy">
          <InputNumber v-model="edit_info.orderBy" placeholder="请输入" :min="0" :max="999999" clearable/>
        </FormItem>
        <FormItem label="备注">
          <Input
            v-model="edit_info.remark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入..."
            :maxlength="50"
            clearable
          />
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="edit_Modal_show=false">取消</Button>

        <Button type="primary" @click="editOk('edit_info')" :loading="edit_loading">保存</Button>
      </div>
    </Modal>

    <div v-if="secondIndustryManagePage == true">
      <secondIndustryManage @changeStatus="showMerchantStaffAddStatus" :parentId="parentId"></secondIndustryManage>
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
  import secondIndustryManage from "./industryManageSecond";

  export default {
    name: "industry-manage",
    components: {
      secondIndustryManage,
    },
    data() {
      return {
        parentId:"",
        secondIndustryManagePage: false,
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",

        searchItem: {
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
            title: "一级行业",
            key: "name",
            width: 200,
            align: "center"
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            width: 150,
            render: (h, params) => {
              const row = params.row;
              const color = row.status == "1" ? "blue" : "red";
              const text = row.status == "1" ? "显示" : "隐藏";

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
            title: "排序",
            key: "orderBy",
            width: 100,
            align: "center"
          },
          {
            title: "创建人",
            key: "createBy",
            width: 170,
            align: "center"
          },
          {
            title: "创建时间",
            key: "createTime",
            width: 250,
            align: "center",
            sortable: true
          },
          {
            title: "操作",
            key: "action",
            fixed: "left",
            align: "center",
            width: 250,
            render: (h, params) => {
              const row = params.row;

              const color = row.status == 1?"red":"#5cadff";
              const text = row.status == 1?"隐藏":"显示";
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
                            color: color
                          },
                          on: {
                            click: () => {
                              this.updateStatusInfo(params.row);
                            }
                          }
                        },
                        text
                ),
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
                              this.secondIndustryInfo(params.row);
                            }
                          }
                        },
                        "二级行业"
                )
              ]);
            }
          }
        ],

        edit_Modal_show: false,
        parentList:[],
        edit_info: {
          id: "",
          parentId: "",
          name: "",
          status: "",
          orderBy: "",
          industryLevel: "",
          remark: null,
          firstPage:false,
          secondPage:false,
          action:"",
          industryIsSecond:false
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
        this.getFirstIndustrylist();
      },
      getFirstIndustrylist() {
        postRequest(
                "/merchant/industryMain/listall"
        ).then(res => {
          if (res.code == 200) {
            this.parentList = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
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
        /*this.searchItem.name = ""
        this.searchItem.code = ""
        this.searchItem.status = ""*/
        this.updateTableList();
      },

      //搜索
      queryTableList() {
        this.pageNum=1;
        this.totalSize=0;
        this.updateTableList();
      },

      //分页

      changeCurrent(current) {
        this.pageNum = current;
        this.updateTableList();
      },

      updateTableList() {
        this.getFirstIndustrylist();
        this.TableLoading = true;
        const reqParams = {
          /*postName: this.searchItem.name,
          postCode: this.searchItem.code,
          status: this.searchItem.status*/
        };

        postRequest(
          "/merchant/industryMain/list?pageNum=" +
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
      showMerchantStaffAddStatus(e) {
        this.secondIndustryManagePage = e;
        //this.updateTableList();
      },

      secondIndustryInfo(item) {
        this.parentId=item.id;
        this.setStore("pageStatus", "second");
        this.secondIndustryManagePage = true;
      },
      addInfo() {
        this.edit_info = {
          postId: "",
          postName: "",
          postCode: "",
          status: "1",
          remark: "",
          postSort: null
        };
        this.edit_Modal_show = true;
        this.title = "岗位管理新增";
      },
      addFirstInfo() {
        this.edit_info = {
          id: "",
          name: "",
          industryLevel:1,
          orderBy: "",
          status: "1",
          parentId: "",
          parentId: "",
          remark: "",
          firstPage:true,
          secondPage:false,
          action:"add"
        };
        this.edit_Modal_show = true;
        this.title = "一级行业新增";
      },
      addSecondInfo() {
        this.edit_info = {
          id: "",
          name: "",
          industryLevel:2,
          orderBy: "",
          status: "1",
          parentId: "",
          remark: "",
          firstPage:false,
          secondPage:true,
          action:"add"
        };
        this.edit_Modal_show = true;
        this.title = "二级行业新增";
      },

      //编辑
      editInfo(item) {
        this.edit_info = {
          id: item.id,
          name: item.name,
          industryLevel:item.industryLevel,
          orderBy: item.orderBy,
          status: item.status,
          parentId: item.parentId,
          remark: item.remark,
          action:"edit"
        };
        if(this.edit_info.industryLevel=="1"){
          this.edit_info.industryIsSecond=false;
          this.edit_info.firstPage=true;
          this.edit_info.secondPage=false;
        }else{
          this.edit_info.industryIsSecond=true;
          this.edit_info.firstPage=false;
          this.edit_info.secondPage=true;
        }
        this.edit_Modal_show = true;
        this.title = "行业编辑";
      },

      editOk(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (!this.edit_info.parentId && this.edit_info.secondPage) {
              this.$Message.error("请选择一级行业");
              return;
            }
            if (!this.edit_info.name) {
              this.$Message.error("请输入行业名称");
              return;
            }

            if (!this.edit_info.orderBy) {
              this.$Message.error("请输入排序");
              return;
            }

            if(this.edit_info.firstPage && this.edit_info.action=="add"){
              this.requestUrl = "/merchant/industryMain/add";
              this.msg = "新增成功";
            }
            if(this.edit_info.firstPage && this.edit_info.action=="edit"){
              this.requestUrl = "/merchant/industryMain/edit";
              this.msg = "编辑成功";
            }
            if(this.edit_info.secondPage && this.edit_info.action=="add"){
              this.requestUrl = "/merchant/industrySecond/add";
              this.msg = "新增成功";
            }
            if(this.edit_info.secondPage && this.edit_info.action=="edit"){
              this.requestUrl = "/merchant/industrySecond/edit";
              this.msg = "编辑成功";
            }

            this.edit_loading = true;
            const reqParams = {
              id: this.edit_info.id,
              name: this.edit_info.name,
              industryLevel: this.edit_info.industryLevel,
              parentId: this.edit_info.parentId,
              orderBy: this.edit_info.orderBy,
              status: this.edit_info.status,
              remark: this.edit_info.remark
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

      //状态更新
      updateStatusInfo(item) {
        const self = this;
        const text=item.status==1?"您确定要将记录修改为隐藏状态吗？修改后，对应的二级行业状态都会被修改为隐藏"
                :"确定要将记录修改为显示状态吗？修改后，对应的二级行业状态都会被修改为显示";
        const consStatus = item.status==1?0:1;

        this.$Modal.confirm({
          title: "确认",
          content: text,
          onOk: function() {
            self.$Loading.start();
            postRequest("/merchant/industryMain/statusEdit?id=" + item.id + "&status="+consStatus).then(
              res => {
                self.loading = false;

                if (res.code == "200") {
                  self.$Message.info("更新成功！");

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
