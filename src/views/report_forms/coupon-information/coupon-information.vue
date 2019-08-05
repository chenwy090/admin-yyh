<template>
  <div>
    <Card>
      <Row>
        <Alert type="warning" show-icon>搜索框开始和结束时间不选择，默认导出当天的数据</Alert>
        <Form ref="searchForm" :model="searchForm" inline :label-width="95" class="search-form">
          <Form-item label="活动id" :label-width="60">
            <Input type="text" v-model="searchForm.campId" placeholder="请输入" style="width: 150px"/>
          </Form-item>
          <Form-item label="活动名称" :label-width="60">
            <Input type="text" v-model="searchForm.name" placeholder="请输入" style="width: 150px"/>
          </Form-item>
          <span v-if="drop">
            <Form-item label="门店id">
              <Input
                type="text"
                v-model="searchForm.shopId"
                placeholder="请输入"
                style="width: 150px"
              />
            </Form-item>
            <Form-item label="开始时间">
              <DatePicker
                type="date"
                placeholder="请选择"
                style="width: 150px"
                format="yyyy-MM-dd"
                @on-change="time1"
                :value="searchForm.startTime"
              ></DatePicker>
            </Form-item>
            <Form-item label="结束时间">
              <DatePicker
                type="date"
                placeholder="请选择"
                style="width: 150px"
                format="yyyy-MM-dd"
                @on-change="time2"
                :value="searchForm.endTime"
              ></DatePicker>
            </Form-item>
            <Form-item label="是否合计券">
              <Select v-model="searchForm.addUp" placeholder="请选择" style="width: 200px">
                <Option value=" ">否</Option>
                <Option value="0">是</Option>
              </Select>
            </Form-item>
            <!-- <Form-item label="核销开始时间">
              <DatePicker
                type="date"
                placeholder="请选择"
                style="width: 150px"
                format="yyyy-MM-dd"
                @on-change="time3"
                :value="searchForm.verifyStartTime"
              ></DatePicker>
            </Form-item>
            <Form-item label="核销结束时间">
              <DatePicker
                type="date"
                placeholder="请选择"
                style="width: 150px"
                format="yyyy-MM-dd"
                @on-change="time4"
                :value="searchForm.verifyEndTime"
              ></DatePicker>
            </Form-item>-->
          </span>
          <Form-item :label-width="0">
            <a class="drop-down" @click="dropDown">
              {{dropDownContent}}
              <Icon :type="dropDownIcon"></Icon>
            </a>
          </Form-item>
          <div class="br">
            <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            <Button type="warning" icon="md-arrow-round-down" @click="leadingOut">导出报表</Button>
            <Button @click="resetForm()">重置</Button>
          </div>
        </Form>
      </Row>
    </Card>
    <Card>
      <!-- <Row class="operation">
          <Button type="primary" icon="md-add" @click="addTimed()">新增</Button>
      </Row>-->
      <Table :columns="optionType == '' ? columns1 : columns2 " :data="data1" :loading="TableLoading">
        <template slot-scope="{ row }" slot="action">
          <Button
            type="success"
            size="small"
            style="margin-right:5px;"
            @click="inputCheck(row)"
          >查看详情</Button>
        </template>
      </Table>

      <Row type="flex" justify="end" class="page">
        <!-- 分页 -->
        <Page
          :total="totalSize"
          show-total
          show-elevator
          @on-change="changeCurrent"
          style="float: right"
          :current="current"
        ></Page>
        <!-- 分页 -->
      </Row>
      <!-- 查看弹框 -->
      <Modal title="查看详情" v-model="checkDsplay" :mask-closable="false" class="check" footer-hide width="1000">
        <div style="overflow: hidden;">
          <Table :columns="columns3" :data="data2" :loading="TableLoading1">
          </Table>
          <!-- 分页 -->
          <Page
            :total="totalSize1"
            show-total
            show-elevator
            @on-change="changeCurrent1"
            style="float: right; margin-top:10px"
            :current="current1"
          ></Page>
          <!-- 分页 -->
        </div>
      </Modal>
      <!-- 查看弹框 -->
    </Card>
  </div>
</template>
<script>
  import { getCouponList, getQueryLogAll, getCouponInformation } from "@/api/sys";
  import { baseUrl } from "@/api/index";
  export default {
    name: "timed-task",
    data() {
      return {
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",
        TableLoading: false,
        TableLoading1: false,
        searchForm: {
          // 搜索
          campId: "",
          name: "",
          endTime: "",
          shopId: "",
          startTime: "",
          addUp:""
          // verifyEndTime: "",
          // verifyStartTime: ""
        },
        //列表字段显示1
        columns1: [
          {
            title: "操作",
            minWidth: 80,
            fixed: "left",
            slot: "action",
            align: "center"
          },
          {
            title: "活动id",
            key: "campId",
            minWidth: 150,
            align: "center"
          },
          {
            title: "活动名称",
            key: "name",
            minWidth: 150,
            align: "center"
          },
          {
            title: "领券总金额",
            key: "receiveMoney",
            minWidth: 150,
            align: "center"
          },
          {
            title: "领券数量",
            key: "receiveCount",
            minWidth: 150,
            align: "center"
          },
          {
            title: "未激活券数量",
            key: "notActiveCount",
            minWidth: 150,
            align: "center"
          },
          {
            title: "用券数量",
            key: "useCount",
            minWidth: 150,
            align: "center"
          },
          {
            title: "用券总金额",
            key: "useMoney",
            minWidth: 150,
            align: "center"
          }
        ],
        //列表字段显示2
        columns2: [
          {
            title: "领券总金额",
            key: "receiveMoney",
            minWidth: 150,
            align: "center"
          },
          {
            title: "领券数量",
            key: "receiveCount",
            minWidth: 150,
            align: "center"
          },
          {
            title: "未激活券数量",
            key: "notActiveCount",
            minWidth: 150,
            align: "center"
          },
          {
            title: "用券数量",
            key: "useCount",
            minWidth: 150,
            align: "center"
          },
          {
            title: "用券总金额",
            key: "useMoney",
            minWidth: 150,
            align: "center"
          }
        ],
        //查看详情列表字段显示3
        columns3: [
          {
            title: "活动id",
            key: "campId",
            minWidth: 150,
            align: "center"
          },
          {
            title: "活动名称",
            key: "name",
            minWidth: 150,
            align: "center"
          },
          {
            title: "领券总金额",
            key: "receiveMoney",
            minWidth: 100,
            align: "center"
          },
          {
            title: "领券数量",
            key: "receiveCount",
            minWidth: 95,
            align: "center"
          },
          {
            title: "未激活券数量",
            key: "notActiveCount",
            minWidth: 105,
            align: "center"
          },
          {
            title: "用券数量",
            key: "useCount",
            minWidth: 95,
            align: "center"
          },
          {
            title: "用券总金额",
            key: "useMoney",
            minWidth: 95,
            align: "center"
          },
          {
            title: "时间",
            key: "couponDate",
            minWidth: 110,
            align: "center"
          }
        ],
        data1: [], // 列表数据
        data2: [], // 查看详情列表数据
        current: 1, //当前页码
        totalSize: 0, //总条数
        current1: 1, //当前页码
        totalSize1: 0, //总条数
        searchType: "", // 1：页面初始化 2：搜索
        apiId: "", //接口id
        checkData: {}, //查看数据
        checkDsplay: false, // 查看对话框
        optionType: "", // 空：不统计 0：统计
        detailedCampId: '', // 查看详情的CampId
      };
    },
    created: function() {
      this.getList({});
      this.searchType = 1;
    },
    methods: {
      // 搜索
      search() {
        // console.log(this.searchForm);
        this.searchType = 2;
        this.current = 1;
        if(this.searchForm.addUp == '0'){
          this.optionType = "0"
        }else {
          this.optionType = ""
        }
        this.getList(this.searchForm);
      },

      // 渲染列表
      getList(obj) {
        // 加载动画
        this.TableLoading = true;
        getCouponList(obj, this.current).then(res => {
          //console.log(res);
          if (res.code == 200) {
            this.data1 = res.data.records;
            // 分页
            this.current = res.data.current;
            this.totalSize = res.data.total;
            // 加载动画
            this.TableLoading = false;
          } else {
            this.msgErr(res.msg);
            // 加载动画
            this.TableLoading = false;
          }
        });
      },

      // 分页
      changeCurrent(current) {
        this.current = current;
        if (this.searchType == 1) {
          this.getList({});
        } else if (this.searchType == 2) {
          // let searchForm2 = {
          //   code: this.searchForm.code,
          //   startDate: this.searchForm.startDate,
          //   endDate: this.searchForm.endDate,
          //   logType:
          //     this.searchForm.logType1 == undefined
          //       ? ""
          //       : this.searchForm.logType1 + this.searchForm.logType2,
          //   startTimeUsed: this.searchForm.timeUsed[0],
          //   endTimeUsed: this.searchForm.timeUsed[1]
          // };
          this.getList(this.searchForm);
        }
      },

      // 参看详情分页
      changeCurrent1(current) {
        this.current1 = current;
        this.getCouponInformationFn(this.detailedCampId,current)
      },

      // 查看详情
      inputCheck(row) {
        this.detailedCampId = row.campId
        this.getCouponInformationFn(this.detailedCampId,this.current1)
        this.checkDsplay = true
      },

      getCouponInformationFn(campId,current1) {
        this.TableLoading1 = true
        getCouponInformation(campId,current1).then(res => {
          if (res.code == 200) {
            this.data2 = res.data.records;
            // 分页
            this.current1 = res.data.current;
            this.totalSize1 = res.data.total;

            this.TableLoading1 = false
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 重置form表单
      resetForm() {
        this.searchForm.campId =  ""
        this.searchForm.name =  ""
        this.searchForm.endTime =  ""
        this.searchForm.shopId =  ""
        this.searchForm.startTime =  ""
        this.searchForm.addUp = ""
        this.optionType = ''
        this.searchType = 1;
        this.getList({});
      },

      // 导出确认
      leadingOut() {
        this.$Modal.confirm({
          title: "导出确认",
          content: `
              <p>确实将搜索结果导出Excel表格吗？</p>
              `,
          onOk: () => {
            this.deriveShopXls();
          },
          onCancel: () => {
            // this.$Message.info('Clicked cancel');
          }
        });
      },

      //导出
      deriveShopXls() {
        let addUp = this.searchForm.addUp == '0' ? '0' : ''
        window.location.href =
          baseUrl +
          `/coupon/receiveInfo/download?` +
          "&campId=" +
          this.searchForm.campId +
          "&name=" +
          this.searchForm.name +
          "&endTime=" +
          this.searchForm.endTime +
          "&shopId=" +
          this.searchForm.shopId +
          "&startTime=" +
          this.searchForm.startTime +
          // "&verifyEndTime=" +
          // this.searchForm.verifyEndTime +
          "&addUp=" +
          addUp;
        // "&verifyStartTime=" +
        // this.searchForm.verifyStartTime;
      },

      // 时间处理
      time1(e) {
        // let time = e.slice(0,10) + ' ' + '00:00:00'
        this.searchForm.startTime = e;
      },
      time2(e) {
        //let time = e.slice(0,10) + ' ' + '23:59:59'
        this.searchForm.endTime = e;
      },
      // time3(e) {
      //   //let time = e.slice(0,10) + ' ' + '23:59:59'
      //   this.searchForm.verifyStartTime = e;
      // },
      // time4(e) {
      //   //let time = e.slice(0,10) + ' ' + '23:59:59'
      //   this.searchForm.verifyEndTime = e;
      // },

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

      dropDown() {
        if (this.drop) {
          this.dropDownContent = "展开";
          this.dropDownIcon = "ios-arrow-down";
        } else {
          this.dropDownContent = "收起";
          this.dropDownIcon = "ios-arrow-up";
        }
        this.drop = !this.drop;
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

  .check {
    span {
      width: 100px;
      display: inline-block;
      font-size: 16px;
    }
  }
</style>