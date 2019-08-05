
<template>
  <div class="search">
    <Row v-if="!couponEditPage">
  <div
        style="width: 90%;background: #fff;box-shadow:0 6px 6px -4px rgba(0,0,0,.2);z-index: 5;position:fixed; padding:14px"
      >
         <Alert show-icon v-if="merchantId">
           商户编号 :  <span style="color:red">{{merchantId}}</span>
            <span slot="desc"></span>
          </Alert>
     </div>   
     <div style="padding-top: 100px">
        <Card >
          <Row>
            <Form ref="searchItem" :model="searchItem" inline :label-width="120" class="search-form">
              <FormItem label="优惠券模版ID">
                <Input
                  type="text"
                  v-model="searchItem.templateId"
                  clearable
                  placeholder="请输入优惠券模版ID"
                  style="width: 200px"
                />


              </FormItem>
       
              <span v-if="drop">
                <FormItem label="优惠券标题	">
                  <Input
                    type="text"
                    v-model="searchItem.title"
                    clearable
                    placeholder="请输入优惠券标题	"
                    style="width: 200px"
                  />
                </FormItem>


  

                <FormItem label="优惠券种类">
                  <Select
                    v-model="searchItem.couponKind"
                    placeholder="请选择优惠券种类"
                    clearable
                    style="width: 200px"
                  >
                    <Option value="">所有</Option>
                    <Option value="1">免费券</Option>
                    <Option value="2">付费券</Option>
                  </Select>
                </FormItem>

              

              <FormItem label="用券有效期类型">
                  <Select
                    v-model="searchItem.useDateType"
                    placeholder="请选择用券有效期类型"
                    clearable
                    style="width: 200px"
                  >
                    <Option value="">所有</Option>
                    <Option value="1">固定时间范围</Option>
                    <Option value="2">相对有效期</Option>
                  </Select>
                </FormItem>
          <FormItem label="优惠类型">
                  <Select
                    v-model="searchItem.couponType"
                    placeholder="请选择优惠类型"
                    clearable
                    style="width: 200px"
                  >
                    <Option value="">所有</Option>
                    <Option value="1">固定金额</Option>
                    <Option value="2">折扣</Option>
                  </Select>
                </FormItem>

             <FormItem label="状态">
                  <Select
                    v-model="searchItem.status"
                    placeholder="请选择状态"
                    clearable
                    style="width: 200px"
                  >
                    <Option value="">所有</Option>
                    <Option value="1">上架</Option>
                    <Option value="-1">下架</Option>
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
            
            <template slot-scope="{ row }" slot="couponBigImg">
                <Tooltip content="点击可查看大图 " placement="right">
              <img :src="row.couponBigImg" style="width:74px;height:43px;" @click="showBigImg(row)">
                </Tooltip>
            </template>
            


           <template slot-scope="{ row }" slot="ticketMoney">
              <span v-if="row.couponType==1">{{row.ticketMoney /100}} 元</span>
            <span v-if="row.couponType==2">{{row.ticketDiscount /10}} 折</span>
            </template>


          <template slot-scope="{ row }" slot="ChangeStart">
            <span v-if="row.useDateType ==1"> {{row.useStartDate}}</span>
              <span  v-if="row.useDateType ==2"> 加{{row.addDaysUseStart}}天开始生效</span>
            </template>


            <template slot-scope="{ row }" slot="ChangeEnd">
               <span  v-if="row.useDateType ==1"> {{row.useEndDate}}</span>
              <span v-if="row.useDateType ==2"> 加{{row.addDaysUseEnd}}天结束用券</span>
            </template>


           <template slot-scope="{ row }" slot="price">
              <span  v-if="row.couponKind ==2">{{row.price /100}} 元 </span>
              <span v-else >免费</span>
             
            </template>

           <template slot-scope="{ row }" slot="operate">
                <Button
                  type="text"
                  size="small"
                  style="color:#2db7f5"
                  @click="editInfo(row)" 
                 v-if="row.status == 0"
                >编辑</Button>
                 <!-- <Button type="text" size="small" style="color:#ed4014" @click="removeInfo(row)">删除</Button> -->
                    
              <Button type="text" size="small" style="color:#19be6b" @click="changeStatus(row)" v-if="row.status == 0 || row.status == -1 ">发布</Button>
                          
            <Button type="text" size="small" style="color:red" @click="changeStatus(row)" v-if="row.status == 1">下架</Button>
              
          
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
      </div>   
     
    </Row>

    <div v-if="couponEditPage">
      <couponEdit @changeStatus="showbasicSetStatus" :couponEdit_info="couponEdit_info" ></couponEdit>
    </div>
 
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

import { formatDate } from "@/libs/date";
import couponEdit from "./couponEdit";
export default {
  name: "merchant-information",
  components: {
    couponEdit
  },
  props: {
    merchantId: String
  },
  data() {
    return {
      couponEditPage: false,

      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",

      searchItem: {
        templateId: "",
        title: "",
        couponKind: "",
        couponType: "",
        useDateType: "",
        status: ""
      },
      couponEdit_info: {},
      current: 1,
      totalSize: 0, //总条数
      pageNum: 1, //开始条数
      limit: 10, //每页记录数
      TableLoading: false,
      table_list: [],
      self: this,
      bigImgDialog: false, //显示大图
      big_Image_url: "",
      tableColumns: [
        {
          title: "商户编号",
          key: "merchantId",
          align: "center",
          width: 150
        },
        {
          title: "优惠券模板ID",
          key: "templateId",
          sortable: true,
          align: "center",
          width: 150
        },

        {
          title: "优惠券标题",
          key: "title",
          align: "center",
          width: 150
        },

        {
          title: "优惠券详情图",
          align: "center",
          width: 120,
          key: "couponBigImg",
          slot: "couponBigImg"
        },
        {
          title: "优惠类型",
          key: "couponType",
          align: "center",
          width: 150,
          render: (h, params) => {
            const row = params.row;
            const color = row.couponType === 1 ? "blue" : "red";
            const text = row.couponType === 1 ? "固定金额" : "折扣";

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
          title: "优惠金额/优惠折扣",

          align: "center",
          width: 150,
          slot: "ticketMoney"
        },

        {
          title: "优惠券种类",
          key: "couponKind",
          width: 150,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.couponKind === 1
                ? "green"
                : row.couponKind === 2 ? "blue" : "red";
            const text =
              row.couponKind === 1
                ? "免费券"
                : row.couponKind === 2 ? "付费券" : "其他";

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
          title: "购买价格(单位为元)",
          key: "price",
          align: "center",
          width: 150,
          slot: "price"
        },
        {
          title: "活动开始时间",
          key: "startDate",
          align: "center",
          width: 150
        },

        {
          title: "活动结束时间",
          key: "endDate",
          align: "center",
          width: 150
        },

        {
          title: "用券有效期类型",
          key: "useDateType",
          align: "center",
          width: 150,
          render: (h, params) => {
            const row = params.row;
            const color = row.useDateType === 1 ? "blue" : "red";
            const text = row.useDateType === 1 ? "固定时间范围" : "相对有效期";

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
          title: "用券开始时间",
          width: 200,
          align: "center",
          slot: "ChangeStart"
        },

        {
          title: "用券结束时间",
          width: 200,
          align: "center",
          slot: "ChangeEnd"
        },

        {
          title: "状态",
          key: "status",
          width: 150,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.status === 0 ? "green" : row.status === 1 ? "blue" : "red";
            const text =
              row.status === 0 ? "创建" : row.status === 1 ? "上架" : "下架";

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
          title: "用户限领数量",
          key: "getLimit",
          align: "center",
          width: 150
        },
        {
          title: "库存数量",
          key: "stockCount",
          align: "center",
          width: 150
        },
        {
          title: "操作",
          key: "action",
          fixed: "left",
          align: "center",
          slot: "operate",
          width: 200
        }
      ]
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
      this.searchItem.templateId = "";
      this.searchItem.title = "";
      this.searchItem.couponKind = "";
      this.searchItem.couponType = "";
      this.searchItem.useDateType = "";
      this.searchItem.status = "";

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
        merchantId: this.merchantId,
        templateId: this.searchItem.templateId,
        title: this.searchItem.title,
        couponKind: this.searchItem.couponKind,
        couponType: this.searchItem.couponType,
        useDateType: this.searchItem.useDateType,
        status: this.searchItem.status
      };

      postRequest(
        "/merchantCouponTemplate/list?pageNum=" +
          this.pageNum +
          "&pageSize=" +
          this.limit,
        reqParams
      ).then(res => {
        this.TableLoading = false;

        this.totalSize = res.data.total;
        this.table_list = res.data.records;
      });
    },

    //新增
    addInfo() {
      this.setStore("camp_pageStatus", "add");

      this.couponEdit_info.merchantId = this.merchantId;
      this.couponEditPage = true;
    },

    //编辑
    editInfo(item) {
      this.setStore("camp_pageStatus", "edit");
      this.couponEdit_info = item;
      this.couponEditPage = true;
    },

    showbasicSetStatus(e) {
      this.couponEditPage = e;
      this.updateTableList();
    },

    // 显示大图
    showBigImg: function(row) {
      this.bigImgDialog = true;
      this.big_Image_url = row.couponBigImg;
    },
    bigImgCancel: function() {
      this.bigImgDialog = false;
    },

    //更改列表上下架
    changeStatus(item) {
      const self = this;

      let new_status = "";
      switch (item.status) {
        case 0:
          new_status = "1";
          break;
        case 1:
          new_status = "-1";
          break;
        case -1:
          new_status = "1";
          break;
        case "0":
          new_status = "1";
          break;
        case "1":
          new_status = "-1";
          break;
        case "-1":
          new_status = "1";
          break;
      }
      console.log(this.pageNum);
      this.$Modal.confirm({
        title: "更改状态",
        content: `是否继续更改状态？`,

        onOk: function() {
          const reqParams = {
            templateId: item.templateId,
            status: new_status
          };

          postRequest(
            "/merchantCouponTemplate/updStatus/?templateId=" +
              item.templateId +
              "&status=" +
              new_status,
            reqParams
          ).then(res => {
            self.loading = false;

            if (res.code == "200") {
              self.$Message.info("更改状态成功！");

              setTimeout(() => {
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
          getRequest("/merchantCouponTemplate/edit/" + item.templateId).then(
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
