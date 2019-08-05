
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
              <FormItem label="字典名称">
                <Select
                  v-model="searchItem.dictCode"
                  placeholder="请选择"
                  clearable
                  style="width: 200px"
                >
                  <Option
                    v-for="(item, index) in dictCodeList"
                    :key="index"
                    :value="item.dictCode"
                  >{{item.dictName}}</Option>
                  <!-- <Option value="0">用户性别</Option>
                  <Option value="1">菜单状态</Option>
                  <Option value="2">系统开关</Option>
                  <Option value="3">任务状态</Option>
                  <Option value="4">系统是否</Option>
                  <Option value="5">通知类型</Option>
                  <Option value="6">操作类型</Option>
                  <Option value="7">系统状态</Option>-->
                </Select>
              </FormItem>

              <span v-if="drop">
                <FormItem label="字典标签">
                  <Input
                    type="text"
                    v-model="searchItem.dictLabel"
                    clearable
                    placeholder="请输入字典标签"
                    style="width: 200px"
                  />
                </FormItem>

                <FormItem label="数据状态">
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
            <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回</Button>
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
            >
              <template slot-scope="{ row }" slot="dictLabel">
                <!-- <img
                :src="row.wxQrcode"
                v-if="row.wxQrcode != ''"
                style="width:40px"
                @click="wxQrcodeLook(row.wxQrcode)"
                >-->
                <Button
                  size="small"
                  v-if="row.dictCode == 'image'"
                  @click="wxQrcodeLook(row.dictLabel)"
                >查看图片</Button>
                <span v-else>{{row.dictLabel}}</span>
              </template>
            </Table>
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

    <Modal v-model="add_Modal_show" width="700" title="数据字典新增" :mask-closable="false">
      <Form :model="add_info" ref="add_info" :label-width="80" :rules="ruleValidate">
        <Row>
          <Col span="12" v-if="searchItem.dictCode == 'image'">
            <FormItem label="字典类型">
              <Input v-model="searchItem.dictCode" placeholder="请输入" disabled clearable/>
            </FormItem>
          </Col>
          <Col span="12" v-if="searchItem.dictCode != 'image'">
            <FormItem label="字典标签" prop="dictLabel">
              <Input v-model="add_info.dictLabel" placeholder="请输入" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="字典键值" prop="dictValue">
              <Input v-model="add_info.dictValue" placeholder="请输入" clearable/>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12" v-if="searchItem.dictCode == 'image'">
            <FormItem label="字典标签" prop="dictLabel">
              <!-- <Input v-model="add_info.dictLabel" placeholder="请输入" clearable/> -->
              <!-- 上传图片 -->
              <div
                style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
              >
                <img :src="add_info.dictLabel" style="width:100%;height:100%">
              </div>
              <div style="display: inline-block;">
                <Upload
                  ref="upload"
                  :defaultList="uploadList1"
                  type="drag"
                  :format="['jpg','jpeg','png','bmp']"
                  :on-success="handleSuccess1"
                  :action="url"
                  accept="image"
                  :max-size="1024"
                  :on-exceeded-size="handleMaxSize"
                  :on-format-error="formatError"
                  :headers="userToken"
                  :show-upload-list="false"
                  style="display: inline-block;width:90px;"
                >
                  <!-- :before-upload="handleUploadicon"  :show-upload-list="false"-->
                  <div style="width: 90px;height:90px;line-height: 90px;">
                    <Icon type="ios-camera" size="20"/>
                  </div>
                </Upload>
              </div>
              <p style="width: 256px;height: 23px;line-height: 23px;">请上传图片(不大于1M, JPG/PNG/JPEG/BMP)</p>
              <!-- 上传图片 -->
            </FormItem>
          </Col>
          <Col span="12" v-if="searchItem.dictCode != 'image'">
            <FormItem label="字典类型" required>
              <Input v-model="searchItem.dictCode" placeholder="请输入" disabled clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="字典排序" prop="dictSort">
              <Input v-model="add_info.dictSort" placeholder="请输入" clearable/>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="系统默认" prop="isDefault">
              <Select v-model="add_info.isDefault">
                <Option value="Y">是</Option>
                <Option value="N">否</Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="状态" prop="status">
              <Select v-model="add_info.status">
                <Option value="0">正常</Option>
                <Option value="1">停用</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

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

    <Modal v-model="edit_Modal_show" width="700" title="数据字典编辑" :mask-closable="false">
      <Form :model="edit_info" ref="edit_info" :label-width="80" :rules="ruleValidate">
        <Row>
          <Col span="12" v-if="searchItem.dictCode == 'image'">
            <FormItem label="字典类型">
              <Input v-model="searchItem.dictCode" placeholder="请输入" disabled clearable/>
            </FormItem>
          </Col>
          <Col span="12" v-if="searchItem.dictCode != 'image'">
            <FormItem label="字典标签" prop="dictLabel">
              <Input v-model="edit_info.dictLabel" placeholder="请输入" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="字典键值" prop="dictValue">
              <Input v-model="edit_info.dictValue" placeholder="请输入" clearable/>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12" v-if="searchItem.dictCode == 'image'">
            <FormItem label="字典标签" prop="dictLabel">
              <!-- <Input v-model="edit_info.dictLabel" placeholder="请输入" clearable/> -->
              <!-- 上传图片 -->
              <div
                style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
              >
                <img :src="edit_info.dictLabel" style="width:100%;height:100%">
              </div>
              <div style="display: inline-block;">
                <Upload
                  ref="upload"
                  :defaultList="uploadList2"
                  type="drag"
                  :format="['jpg','jpeg','png','bmp']"
                  :on-success="handleSuccess2"
                  :action="url"
                  accept="image"
                  :max-size="1024"
                  :on-exceeded-size="handleMaxSize"
                  :on-format-error="formatError"
                  :headers="userToken"
                  :show-upload-list="false"
                  style="display: inline-block;width:90px;"
                >
                  <!-- :before-upload="handleUploadicon"  :show-upload-list="false"-->
                  <div style="width: 90px;height:90px;line-height: 90px;">
                    <Icon type="ios-camera" size="20"/>
                  </div>
                </Upload>
              </div>
              <p style="width: 256px;height: 23px;line-height: 23px;">请上传图片(不大于1M, JPG/PNG/JPEG/BMP)</p>
              <!-- 上传图片 -->
            </FormItem>
          </Col>
          <Col span="12" v-if="searchItem.dictCode != 'image'">
            <FormItem label="字典类型" required>
              <Input v-model="searchItem.dictCode" placeholder="请输入" disabled clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="字典排序" required>
              <Input v-model="edit_info.dictSort" placeholder="请输入" clearable/>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="系统默认" prop="isDefault">
              <Select v-model="edit_info.isDefault">
                <Option value="Y">是</Option>
                <Option value="N">否</Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="状态" prop="status">
              <Select v-model="edit_info.status">
                <Option value="0">正常</Option>
                <Option value="1">停用</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

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
    <!-- 查看图片 -->
    <Modal v-model="imageDisplay" title="查看图片" width="450" footer-hide>
      <img style="width: 100%" :src="image_url">
    </Modal>
    <!-- 查看图片 -->
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
  import { uploadOperationImage2AliOssURl } from "@/api/index";

  export default {
    name: "dicData",
    components: {},
    props: {
      dictCode: String
    },
    data() {
      return {
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",
        dictCodeList: [], // 字典名称列表
        searchItem: {
          // name: "",
          // type: "",
          status: "",
          // startDate: "",
          // endDate: ""
          dictLabel: "",
          dictCode: ""
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
            title: "字典类型",
            key: "dictCode",
            width: 150,
            align: "center"
          },
          {
            title: "字典标签",
            key: "dictLabel",
            minWidth: 150,
            align: "center",
            slot: "dictLabel"
          },
          {
            title: "字典键值",
            key: "dictValue",
            width: 150,
            align: "center"
          },
          {
            title: "字典排序",
            key: "dictSort",
            width: 110,
            sortable: true,
            align: "center"
          },

          {
            title: "状态",
            key: "status",
            width: 100,
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
            width: 100,
            align: "center"
          },
          {
            title: "创建时间",
            key: "createTime",
            minWidth: 140,
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
            minWidth: 140,
            align: "center",
            sortable: true
          },
          {
            title: "备注",
            key: "remark",
            align: "center",
            width: 200
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

        add_Modal_show: false,
        add_loading: false,
        add_info: {},

        edit_Modal_show: false,
        edit_info: {},
        edit_loading: false,
        ruleValidate: {
          dictLabel: [
            {
              required: true,
              message: "字典标签不能为空",
              trigger: "blur"
            }
          ],

          dictValue: [
            {
              required: true,
              message: "字典键值不能为空",
              trigger: "blur"
            }
          ],

          dictSort: [
            {
              required: true,
              message: "字典排序不能为空",
              trigger: "blur"
            }
          ],

          isDefault: [
            {
              required: true,
              message: "请选择系统默认",
              trigger: "change"
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

        table_list: [],
        searchType: "", // 查询状态：1初始化页面，2搜索页面
        // 上传二维码图片
        uploadList1: [],
        uploadList2: [],
        url: uploadOperationImage2AliOssURl,
        userToken: {}, //用户token
        imageDisplay:false, // 查看图片对话框显示
        image_url:'', // 查看图片路径
      };
    },

    created: function() {},
    methods: {
      init() {
        // this.searchItem.dictCode = this.dictCode
        // this.searchType = 1;
        const dictCodeStr = this.dictCode;
        this.searchItem.dictCode = dictCodeStr;
        this.updateTableList();
        this.getDictCodeList();
        this.userToken = {
          jwttoken: localStorage.getItem("jwttoken")
        };
      },

      // 获取字典名称列表
      getDictCodeList() {
        const reqParams = {
          dictName: "",
          dictCode: "",
          status: "",
          beginTime: "",
          endTime: ""
        };
        postRequest(
          "/system/sys-dict/list?pageNum=1&pageSize=100",
          reqParams
        ).then(res => {
          this.TableLoading = false;
          if (res.isSuccess) {
            this.dictCodeList = res.data.records;
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

      //	刷新页面
      refresh() {
        this.updateTableList();
      },

      //搜索
      queryTableList() {
        this.searchType = 2;
        this.updateTableList();
      },

      //分页

      changeCurrent(current) {
        this.pageNum = current;
        this.updateTableList();
        // if(this.searchType == 1){
        //   this.updateTableList(this.dictCode);
        // }else if (this.searchType == 2) {
        //   this.updateTableList(this.searchItem.dictCode);
        // }
      },

      updateTableList() {
        this.TableLoading = true;

        // if (this.searchItem.startDate != "" || this.searchItem.endDate != "") {
        //   if (
        //     this.searchItem.startDate.getTime() >
        //     this.searchItem.endDate.getTime()
        //   ) {
        //     this.$Message.error("开始日期不能大于结束日期");

        //     return;
        //   }
        // }

        const reqParams = {
          // dictValue: this.searchItem.name,
          dictLabel: this.searchItem.dictLabel,
          dictCode: this.searchItem.dictCode,
          status: this.searchItem.status
        };

        postRequest(
          "/system/sys-dict-data/list?pageNum=" +
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
        if (this.add_info.dictSort == undefined || this.add_info.dictSort == "") {
          this.$Message.error("字典排序还没有填写");
          return;
        }

        this.$refs[name].validate(valid => {
          if (valid) {
            const reqParams = {
              dictLabel: this.add_info.dictLabel,
              dictValue: this.add_info.dictValue,
              dictCode: this.searchItem.dictCode,

              dictSort: this.add_info.dictSort,

              isDefault: this.add_info.isDefault,
              status: this.add_info.status,
              remark: this.add_info.remark
            };
            this.add_loading = true;

            postRequest("/system/sys-dict-data/add", reqParams).then(res => {
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
        // console.log(item);
        this.edit_Modal_show = true;
        this.edit_info = item;
      },

      editOk(name) {
        if (
          this.edit_info.dictSort == undefined ||
          this.edit_info.dictSort == ""
        ) {
          this.$Message.error("字典排序还没有填写");
          return;
        }

        this.$refs[name].validate(valid => {
          if (valid) {
            const reqParams = {
              id: this.edit_info.id,
              dictId: this.edit_info.dictId,
              dictLabel: this.edit_info.dictLabel,
              dictValue: this.edit_info.dictValue,
              dictCode: this.searchItem.dictCode,

              dictSort: this.edit_info.dictSort,

              isDefault: this.edit_info.isDefault,
              status: this.edit_info.status,
              remark: this.edit_info.remark
            };
            this.edit_loading = true;

            postRequest("/system/sys-dict-data/edit", reqParams).then(res => {
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

      goback() {
        this.$emit("changeStatus", false);
      },

      //删除

      removeInfo(item) {
        const self = this;

        this.$Modal.confirm({
          title: "删除确认",
          content: `删除后不可恢复，是否继续删除？`,
          onOk: function() {
            self.$Loading.start();
            postRequest("/system/sys-dict-data/delete?id=" + item.id).then(
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

      // 新增上传图片
      handleSuccess1(res, file) {
        if (res.code == 200) {
          this.add_info.dictLabel = res.image_url;

          let obj = [
            {
              url: res.image_url
            }
          ];
          this.uploadList1 = obj;

          this.msgOk("上传图片成功");
        } else {
          this.msgErr("上传图片失败，请重新上传");
        }
      },

      // 编辑上传图片
      handleSuccess2(res, file) {
        if (res.code == 200) {
          this.edit_info.dictLabel = res.image_url;

          let obj = [
            {
              url: res.image_url
            }
          ];
          this.uploadList2 = obj;

          this.msgOk("上传图片成功");
        } else {
          this.msgErr("上传图片失败，请重新上传");
        }
      },

      // 上传二维码超过1M提示
      handleMaxSize() {
        this.msgErr("上传图片不能超过1MB,请重新上传");
      },

      // 上传二维码格式不对
      formatError() {
        this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传");
      },

      // 查看二位码
      wxQrcodeLook(url) {
        this.image_url = url;
        this.imageDisplay = true;
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
