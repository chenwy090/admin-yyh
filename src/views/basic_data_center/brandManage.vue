
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
              <FormItem label="品牌名称">
                <Input
                  type="text"
                  v-model="searchItem.name"
                  clearable
                  placeholder="请输入品牌名称"
                  style="width: 200px"
                />
              </FormItem>

              <span v-if="drop">
                <!--<FormItem label="岗位名称">
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
                </FormItem>-->
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
            <Button type="primary" icon="md-add" @click="addMainInfo()">新增主品牌</Button>
            <Button type="primary" icon="md-add" @click="addSecondInfo()">新增子品牌</Button>

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
            >
              <template slot-scope="{ row }" slot="logoImage">
                <img :src="row.logo" style="width:74px;height:43px;" @click="showBigImg(row)">
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

    <Modal width="700" v-model="edit_Modal_show" :title="title" :mask-closable="false">
      <span v-if="edit_info.secondPage || edit_info.brandIsSecond">
      <Row  class="box">
        <Col span="2" class="left-text" style="width:100px" > 所属主品牌 </Col>
        <Col span="16">
          <Select v-model="edit_info.parentId" style="width:150px" clearable @on-change="getMainBrandlist">
            <Option v-for="(item,index) in parentList" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
        </Col>
      </Row>
        </span>
      <Row  class="box">
        <Col span="2" class="left-text" style="width:100px"> 品牌名称 </Col>
        <Col span="16">
          <Input
                  type="text"
                  v-model="edit_info.name"
                  style="width:300px"
                  @on-change="statusCheckChange"
                  placeholder="请输入品牌名称"
                  :maxlength="20"
          />
        </Col>
      </Row>
      <Row class="box">
        <Col span="2" class="left-text" style="width:100px"> <span style="color:red">*</span> 品牌logo</Col>
        <Col span="3"  >
          <div class="imgSrc_box"   v-if="logeImgSrc" >
            <img  :src="logeImgSrc" style="width:100%">
          </div>
        </Col>
        <Col span="8"  >
          <div style="width:100px; float:left">
            <ImgCutter :label="'选择图片'"  :boxWidth="600"  :boxHeight="500" :rate="1" v-on:cutDown="cutDown" >
              <button slot="openImgCutter"
                      style="width:100px; background: border-box"
              >上传图片</button>
            </ImgCutter>
          </div>
          <br>
          <div  class="left-text">选择品牌logo (不大于1M,JPG/PNG/JPEG/BMP）</div>
        </Col>

      </Row>
      <Row  class="box">
        <Col span="2" class="left-text" style="width:100px"> 品牌描述 </Col>
        <Col span="16">
          <Input
                  type="textarea"
                  v-model="edit_info.description"
                  :autosize="{minRows: 2,maxRows: 5}"
                  style="width:300px"
                  @on-change="statusCheckChange"
                  placeholder="请输入品牌描述"
                  :maxlength="50"
          />
        </Col>
      </Row>
      <div slot="footer">
        <Button type="text" @click="edit_Modal_show=false">取消</Button>

        <Button type="primary" @click="editOk('edit_info')" :loading="edit_loading">保存</Button>
      </div>
    </Modal>
    <Modal v-model="bigImgDialog" title="查看大图" width="600" @on-cancel="bigImgCancel">
      <img style="width: 100%" :src="big_Image_url" />
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
  import ImgCutter from "@/components/ImgCutter.vue";

  export default {
    components: {
      ImgCutter
    },
    name: "post-manage",
    data() {
      return {
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",

        searchItem: {
          name: ""
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
            title: "品牌logo",
            key: "logo",
            width: 150,
            align: "center",
            slot: "logoImage"
          },
          {
            title: "品牌ID",
            key: "id",
            width: 150,
            align: "center",
            sortable: true
          },
          {
            title: "品牌层级",
            key: "brandLevel",
            width: 150,
            align: "center",
            sortable: true
          },
          {
            title: "主品牌",
            key: "mainName",
            align: "center",
            width: 200,
            render: (h, params) => {
              const row = params.row;
              const color = "blue";
              const text = row.brandLevel == "1"?row.name:row.parentName ;

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
            title: "子品牌",
            key: "secondName",
            align: "center",
            width: 200,
            render: (h, params) => {
              const row = params.row;
              const color = "green";
              const text = row.brandLevel == "1"?"无":row.name;

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
            title: "关联商户数",
            key: "relationMerchantCount",
            width: 100,
            align: "center"
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
            width: 150,
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
                )
              ]);
            }
          }
        ],

        edit_Modal_show: false,
        edit_info: {
          parentId: "",
          parentName: "",
          name: "",
          logo: "",
          description: "",
          remark: null,
          logoImg: "",
          mainPage: false,
          secondPage:false,
          addFlag:false,
          editFlag:false,
          action:"",
          id:"",
          brandLevel:"",
          brandIsSecond:false
        },
        logeImgSrc: "",
        bigImgDialog:false,
        big_Image_url:"",
        /*logoImg: "",*/
        parentList: [],
        isCheckDisabled: true,
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
      cutDown: function(res) {
        this.logeImgSrc = res.dataURL;
        this.showSize();
        if (this.logImgSize > 1024) {
          this.$Message.error("图片不能大于1M");
          return;
        }
        var reqParams = {
          imgStr: res.dataURL.substr(22)
        };
        postRequest(
                "/operation/operation-info/uploadBase64Image2AliOss",
                reqParams
        ).then(res => {
          if (res.code == 200) {
            this.edit_info.logoImg = res.image_url;
          } else {
            this.$Message.error(res.msg);
          }
        });
        this.isCheckDisabled = false;
      },
      // 显示大图
      showBigImg: function(row) {
        this.bigImgDialog = true;
        this.big_Image_url = row.logo;
      },
      bigImgCancel: function() {
        this.bigImgDialog = false;
      },
      showSize() {
        //获取base64图片大小，返回MB数字
        var base64url = this.logeImgSrc;
        var str = base64url.replace("data:image/png;base64,", "");
        var equalIndex = str.indexOf("=");
        if (str.indexOf("=") > 0) {
          str = str.substring(0, equalIndex);
        }
        var strLength = str.length;
        var fileLength = parseInt(strLength - strLength / 8 * 2);
        // 由字节转换为MB
        var size = "";
        size = (fileLength / 1024).toFixed(2);
        var sizeStr = size + ""; //转成字符串
        var index = sizeStr.indexOf("."); //获取小数点处的索引
        var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
        if (dou == "00") {
          //判断后两位是否为00，如果是则删除00
          this.logImgSize =
                  sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
        }
        this.logImgSize = size;
      },
      init() {
        this.updateTableList();
        this.getMainBrandlist();
      },
      statusCheckChange() {
        this.isCheckDisabled = false;
      },
      //获取省份信息数据
      getMainBrandlist() {
        postRequest(
                "/merchant/brandMain/listall"
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
        this.searchItem.name = "";
        /*this.searchItem.code = "";
        this.searchItem.status = "";*/
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
        this.TableLoading = true;
        this.getMainBrandlist();
        const reqParams = {
          name: this.searchItem.name/*,
          postCode: this.searchItem.code,
          status: this.searchItem.status*/
        };

        postRequest(
          "/merchant/brandMain/list?pageNum=" +
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
          parentId: "",
          parentName: "",
          name: "",
          logo: "",
          logoImg: "",
          description: ""
        };
        this.edit_Modal_show = true;
        this.title = "岗位管理新增";
      },
      addMainInfo() {
        this.logeImgSrc="";
        this.edit_info = {
          mainPage: true,
          secondPage:false,
          action:"add",
          addFlag:true,
          editFlag:false,
          parentId: "",
          parentName: "",
          name: "",
          logo: "",
          logoImg: "",
          description: "",
          id:""
        };
        this.edit_Modal_show = true;
        this.title = "新增主品牌";
      },
      addSecondInfo() {
        this.logeImgSrc="";
        this.edit_info = {
          secondPage:true,
          mainPage: false,
          action:"add",
          addFlag:true,
          editFlag:false,
          parentId: "",
          parentName: "",
          name: "",
          logo: "",
          logoImg: "",
          description: "",
          id:""
        };
        this.edit_Modal_show = true;
        this.title = "新增子品牌";
      },

      //编辑
      editInfo(item) {
        this.edit_info = {
          //secondPage:true,
          //mainPage: false,
          action:"edit",
          addFlag:false,
          editFlag:true,
          parentId: item.parentId,
          parentName: item.parentName,
          brandLevel: item.brandLevel,
          name: item.name,
          logo: item.logo,
          logoImg: item.logo,
          description: item.description,
          id:item.id
        };
        this.edit_Modal_show = true;
        //this.edit_info = item;
        this.logeImgSrc = item.logo;
        this.title = "品牌编辑";
        if(this.edit_info.brandLevel=="2"){
          this.edit_info.brandIsSecond=true;
          this.edit_info.secondPage=true;
          this.edit_info.mainPage=false;
        }else{
          this.edit_info.brandIsSecond=false;
          this.edit_info.secondPage=false;
          this.edit_info.mainPage=true;
        }
      },

      editOk(name) {
        if (!this.edit_info.parentId && this.edit_info.secondPage) {
          this.$Message.error("请选择主品牌");
          return;
        }
        if (!this.edit_info.name) {
          this.$Message.error("请填写品牌名称");
          return;
        }
        if (!this.edit_info.logoImg) {
          this.$Message.error("请上传品牌logo");
          return;
        }
        /*this.$refs[name].validate(valid => {
          if (valid) {*/
            if (this.edit_info.postSort == "") {
              this.$Message.error("显示顺序不能为空");
              return;
            }
            if(this.edit_info.mainPage && this.edit_info.addFlag/*this.edit_info.action=="add"*/){
              this.requestUrl = "/merchant/brandMain/add";
              this.msg = "新增成功";
            }
            if(this.edit_info.mainPage && this.edit_info.editFlag/*this.edit_info.action=="edit"*/){
              this.requestUrl = "/merchant/brandMain/edit";
              this.msg = "编辑成功";
            }
            if(this.edit_info.secondPage && this.edit_info.addFlag/*this.edit_info.action=="add"*/){
              this.requestUrl = "/merchant/brandSecond/add";
              this.msg = "新增成功";
            }
            if(this.edit_info.secondPage && this.edit_info.editFlag/*this.edit_info.action=="edit"*/){
              this.requestUrl = "/merchant/brandSecond/edit";
              this.msg = "编辑成功";
            }

            /*if (!this.edit_info.id) {
              this.requestUrl = "/merchant/brandSecond/add";
              this.msg = "新增成功";
            } else {
              this.requestUrl = "/merchant/brandSecond/edit";
              this.msg = "编辑成功";
            }*/

            this.edit_loading = true;
            const reqParams = {
              parentId: this.edit_info.parentId,
              parentName: this.edit_info.parentName,
              name: this.edit_info.name,
              logo: this.edit_info.logoImg,
              remark: this.edit_info.remark,
              description: this.edit_info.description,
              id:this.edit_info.id
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
          /*} else {
            this.$Message.error("表单验证失败!");
          }
        });*/
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
