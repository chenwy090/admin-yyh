<template>
  <div>
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
          <Form-item label="请求路径" prop="logType1">
            <Select
              v-model="searchForm.logType1"
              placeholder="请选择"
              style="width: 80px;margin-right:5px"
            >
              <Option value="/yyh-app/">/yyh-app/</Option>
              <Option value="/zex-mgr/">/zex-mgr/</Option>
            </Select>
            <Input
              type="text"
              v-model="searchForm.logType2"
              placeholder="请输入路径"
              style="width: 140px"
            />
          </Form-item>
          <span v-if="drop">
            <Form-item label="开始时间" prop="startDate">
              <DatePicker
                type="date"
                placeholder="选择开始日期"
                style="width: 250px"
                format="yyyy-MM-dd"
                @on-change="time1"
                :value="searchForm.startDate"
              ></DatePicker>
            </Form-item>
            <Form-item label="结束时间" prop="endDate">
              <DatePicker
                type="date"
                placeholder="选择开始日期"
                style="width: 250px"
                format="yyyy-MM-dd"
                @on-change="time2"
                :value="searchForm.endDate"
              ></DatePicker>
            </Form-item>
            <!-- <Form-item label="请求路径" prop="url">
              <Input
                type="text"
                v-model="searchForm.url"
                clearable
                placeholder="请输入请求路径"
                style="width: 200px"
              />
            </Form-item>-->
            <Form-item label="响应码" prop="code">
              <Input
                type="text"
                v-model="searchForm.code"
                clearable
                placeholder="请输入响应码"
                style="width: 200px"
              />
            </Form-item>
          </span>
          <Form-item label="响应时间范围（毫秒）" :label-width="180" prop="timeUsed">
            <Slider
              style="width:400px;display:block"
              v-model="searchForm.timeUsed"
              :max="3000"
              range
            ></Slider>
          </Form-item>
          <Form-item style="margin-left:-35px;" class="br" prop>
            <Button type="primary" icon="ios-search" @click="search">搜索</Button>
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
      <!-- <Row class="operation">
          <Button type="primary" icon="md-add" @click="addTimed()">新增</Button>
      </Row>-->
      <Table :columns="columns1" :data="data1" :loading="TableLoading">
        <template slot-scope="{ row }" slot="action">
          <Button type="success" size="small" style="margin-right:5px;" @click="inputCheck(row)">查看</Button>
          <!-- <Button type="warning" size="small" style="margin-right:5px;" @click="recover(row)">恢复</Button>
        <Button type="primary" size="small" style="margin-right:5px;" @click="edit(row)">编辑</Button>
          <Button type="error" size="small" style="margin-right:5px;" @click="delTimed(row)">删除</Button>-->
        </template>
        <template slot-scope="{ row }" slot="msg">
          <span>{{row.msg | msgFilters}}</span>
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
      <Modal v-model="checkDsplay" :mask-closable="false" class="check" footer-hide width="800">
        <div style="margin-bottom:10px">
          <span>id:</span>
          <Input v-model="checkData.id"/>
        </div>
        <div style="margin-bottom:10px">
          <span>响应码:</span>
          <Input type="textarea" :rows="1" v-model="checkData.code"/>
        </div>
        <div style="margin-bottom:10px">
          <span>ip:</span>
          <Input v-model="checkData.ip"/>
        </div>
        <div style="margin-bottom:10px">
          <span>请求方式:</span>
          <Input v-model="checkData.method"/>
        </div>
        <div style="margin-bottom:10px">
          <span>url:</span>
          <Input v-model="checkData.uri"/>
        </div>
        <div style="margin-bottom:10px">
          <span>args:</span>
          <Input type="textarea" :rows="4" v-model="checkData.args"/>
        </div>
        <div style="margin-bottom:10px">
          <span>returning:</span>
          <Input type="textarea" :rows="6" v-model="checkData.returning"/>
        </div>
      </Modal>
      <!-- 查看弹框 -->
    </Card>
  </div>
</template>
<script>
  import { getQueryLogList, getQueryLogAll } from "@/api/sys";
  export default {
    name: "timed-task",
    data() {
      return {
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "ios-arrow-down",
        TableLoading: false,
        searchForm: {
          // 搜索
          code: "",
          endDate: "",
          logType1: " ",
          logType2: "",
          startDate: "",
          timeUsed: [0, 300],
          url: "",
          code: ""
        },
        //列表字段显示
        columns1: [
          {
            title: "操作",
            minWidth: 80,
            fixed: "left",
            slot: "action",
            align: "center"
          },
          {
            title: "id",
            key: "id",
            minWidth: 150,
            align: "center"
          },
          {
            title: "请求地址",
            key: "uri",
            minWidth: 200,
            align: "center"
          },
          {
            title: "请求方式",
            key: "method",
            minWidth: 100,
            align: "center"
          },
          {
            title: "ip地址",
            key: "ip",
            minWidth: 150,
            align: "center"
          },
          {
            title: "响应码",
            key: "code",
            minWidth: 150,
            align: "center"
          },
          {
            title: "响应码说明",
            key: "msg",
            minWidth: 150,
            align: "center",
            slot: "msg",
          },
          {
            title: "耗时(单位毫秒)",
            key: "timeUsed",
            minWidth: 120,
            align: "center"
          },
          {
            title: "请求时间",
            key: "requestTime",
            minWidth: 220,
            align: "center"
          }
        ],
        data1: [], // 列表数据
        current: 1, //当前页码
        totalSize: 0, //总条数
        searchType: "", // 1：页面初始化 2：搜索
        apiId: "", //接口id
        checkData: {}, //查看数据
        checkDsplay: false // 查看对话框
      };
    },
    filters: {
      msgFilters:function(value) {
        if(value) {
          if(value.length > 10) {
            let str = value.slice(0,10)
            return str + '...'
          }else {
            return value
          }
        }
      }
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
        let searchForm2 = {
          code: this.searchForm.code,
          startDate: this.searchForm.startDate,
          endDate: this.searchForm.endDate,
          logType:
            this.searchForm.logType1 == undefined
              ? ""
              : this.searchForm.logType1 + this.searchForm.logType2,
          startTimeUsed: this.searchForm.timeUsed[0],
          endTimeUsed: this.searchForm.timeUsed[1]
        };
        //console.log(searchForm2);
        this.getList(searchForm2);
      },

      // 渲染列表
      getList(obj) {
        // 加载动画
        this.TableLoading = true;
        getQueryLogList(obj, this.current).then(res => {
          //console.log(res);
          if (res.code == 200) {
            this.data1 = res.page.records;
            // 分页
            this.current = res.page.current;
            this.totalSize = res.page.total;
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
          let searchForm2 = {
            code: this.searchForm.code,
            startDate: this.searchForm.startDate,
            endDate: this.searchForm.endDate,
            logType:
              this.searchForm.logType1 == undefined
                ? ""
                : this.searchForm.logType1 + this.searchForm.logType2,
            startTimeUsed: this.searchForm.timeUsed[0],
            endTimeUsed: this.searchForm.timeUsed[1]
          };
          this.getList(searchForm2);
        }
      },

      // 传值到查看对话框
      inputCheck(row) {
        // this.apiId = row.id
        getQueryLogAll(row.id).then(res => {
          if (res.code == 200) {
            this.checkData = res.data;
            if (this.checkData) {
              this.checkDsplay = true;
            }
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 重置form表单
      resetForm(name) {
        this.searchForm.logType2 = "";
        this.$refs[name].resetFields();
        // console.log(this.searchForm);
        if (name == "searchForm") {
          this.getList({});
          this.searchType = 1;
        }
      },

      // 时间处理
      time1(e) {
        // let time = e.slice(0,10) + ' ' + '00:00:00'
        this.searchForm.startDate = e;
      },
      time2(e) {
        //let time = e.slice(0,10) + ' ' + '23:59:59'
        this.searchForm.endDate = e;
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

