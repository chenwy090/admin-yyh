<template>
  <div>
    <Card :bordered="false" style="margin-bottom:2px">
      <Tabs :value="type" @on-click="tabsFn">
        <TabPane label="商户（单店）" name="1"></TabPane>
        <TabPane label="商户（多店）" name="2"></TabPane>
        <TabPane label="异常打款（单店）" name="3"></TabPane>
        <TabPane label="异常打款（多店）" name="4"></TabPane>
      </Tabs>
      <Form inline v-if="type == 1 || type == 2">
        <FormItem label="提现单号: " :label-width="85">
          <Input style="width:200px" type="text" v-model="searchData.orderNo" placeholder="请输入商户名称"></Input>
        </FormItem>
        <FormItem :label="type == 1?'商户名称: ':'品牌名称: '" :label-width="85">
          <Input
            style="width:200px"
            type="text"
            v-model="searchData.merchantName"
            placeholder="请输入商户名称"
          ></Input>
        </FormItem>
        <FormItem label="市/省: " v-if="type == 1" style="width: 270px;">
          <Select v-model="searchData.provinceCode" style="width:100px" @on-change="getcitylist()">
            <Option
              v-for="(item,index) in provinceList"
              :key="index"
              :value="item.provinceCode"
            >{{item.provinceName}}</Option>
          </Select>
          <Select v-model="searchData.cityCode" style="width:100px;margin-left:10px">
            <Option
              v-for="(item,index) in cityList"
              :key="index"
              :value="item.cityCode"
            >{{item.cityName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="提现人名称: " :label-width="85">
          <Input
            style="width:200px"
            type="text"
            v-model="searchData.userName"
            placeholder="请输入商户名称"
          ></Input>
        </FormItem>
        <FormItem label="提现人手机: " :label-width="85">
          <Input
            style="width:200px"
            type="text"
            v-model="searchData.userPhone"
            placeholder="请输入商户名称"
          ></Input>
        </FormItem>
        <FormItem label="打款时间: " :label-width="85">
          <DatePicker
            type="daterange"
            placeholder="请选择"
            style="width: 200px"
            :value="searchData.remitTime"
            format="yyyy-MM-dd"
            @on-change="time1"
          ></DatePicker>
          <!-- &nbsp;至&nbsp; -->
        </FormItem>
        <FormItem label="提现时间: " :label-width="85">
          <DatePicker
            type="daterange"
            placeholder="请选择"
            style="width: 200px"
            :value="searchData.withdrawTime"
            format="yyyy-MM-dd"
            @on-change="time2"
          ></DatePicker>
        </FormItem>
        <!-- <FormItem label="提现时间：" :label-width="80">
          <DatePicker
            type="daterange"
            placeholder="请选择日期"
            style="width: 200px"
            :value="daterange"
            @on-change="changeStartDate"
          ></DatePicker>
        </FormItem>-->
        <FormItem label="打款状态: " :label-width="85">
          <Select v-model="searchData.remitStatus" style="width:100px;margin-left:10px">
            <Option :value="1">处理中</Option>
            <Option :value="2">已完成（打款成功）</Option>
            <Option :value="3">提现到账失败</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-left:35px;" class="br">
          <Button type="primary" icon="ios-search" @click="search">搜索</Button>
          <Button icon="md-refresh" @click="reset">重置</Button>
        </FormItem>
      </Form>
      <!-- <Row class="operation">
        <Button type="primary" icon="md-add" @click="addInfo()">新增</Button>
        <Button icon="md-refresh" @click="search">刷新</Button>
      </Row>-->
      <div>
        <!-- 用户列表 -->
        <Table border width="100%" :columns="type == 1?columns1:type == 2?columns2:type == 3?columns3:columns4" :data="tableData" :loading="tableLoading">
          <!-- 提现时间 -->
          <template slot-scope="{ row }" slot="applyTime">
            <div>{{ row.applyTime | data}}</div>
            <div>{{ row.applyTime | time}}</div>
          </template>
          <!-- 打款时间 -->
          <template slot-scope="{ row }" slot="remitTime">
            <div>{{ row.remitTime | data}}</div>
            <div>{{ row.remitTime | time}}</div>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status == 1">处理中</span>
            <span v-else-if="row.status == 2">已完成（打款成功）</span>
            <span v-else-if="row.status == 3">提现到账失败</span>
          </template>
          <!-- <template slot-scope="{ row }" slot="type">
            <span v-if="row.type == 'business'">企业</span>
            <span v-else-if="row.type == 'customer'">个人</span>
          </template>-->
        </Table>
        <!-- 用户列表 -->
      </div>
      <!-- 分页器 -->
      <Row type="flex" justify="end" style="margin-top:20px">
        <Page
          :total="totalSize"
          show-total
          show-elevator
          :current="current"
          :page-size="10"
          @on-change="changeCurrent"
        ></Page>

        <!-- <Page
          show-total
          show-elevator
          :current="current"
          :page-size="searchData.pageSize"
          :total="page.total"
          @on-change="changeCurrent"
        ></Page> -->
      </Row>
      <!-- 分页器 -->
    </Card>
  </div>
</template>

<<script>
import { getMerchantPayment, getAbnormalPayment } from '@/api/sys';
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
} from "@/libs/axios";

export default {
  name: "merchant-capitalAccount",
    components: {
    },
  data() {
    return {
      type:'1',
      provinceList: [], //省份
      cityList: [], //城市
      data1: [],
      columns1: [
        {
          title: '提现单号',
          align: 'center',
          minWidth: 140,
          key: 'orderNo',
        },
        {
          title: 'ping++交易号',
          align: 'center',
          width: 140,
          key: 'callbackOrder',
        },
        {
          title: '商户名称',
          align: 'center',
          minWidth: 120,
          key: 'merchantName',
        },
        {
          title: '省/市',
          align: 'center',
          minWidth: 80,
          key: 'provinceCode',
          render: (h, params) => {
            let name = params.row.provinceCode
            for (let i = 0; i < this.provinceList.length; i++) {
              if(this.provinceList[i].provinceCode == params.row.provinceCode) {
                name = this.provinceList[i].shortName
              }
		        // 不能用else
            }
            return h("div",name);
          }
        },
        {
          title: '提现人姓名',
          align: 'center',
          minWidth: 120,
          key: 'userName',
        },
        {
          title: '提现人手机',
          align: 'center',
          minWidth: 120,
          key: 'userPhone',
        },
        {
          title: '提现金额（元）',
          align: 'center',
          minWidth: 120,
          key: 'applyAmount',
        },
        {
          title: '提现服务费（元）',
          align: 'center',
          minWidth: 140,
          key: 'withdrawFee',
        },
        {
          title: '提现平台收取费（元）',
          align: 'center',
          minWidth: 160,
          key: 'platformFee',
        },
        {
          title: '提现时间',
          align: 'center',
          minWidth: 120,
          key: 'applyTime',
          slot: 'applyTime',
        },
        {
          title: '打款时间',
          align: 'center',
          minWidth: 120,
          key: 'remitTime',
          slot: 'remitTime',
        },
        {
          title: '打款状态',
          align: 'center',
          minWidth: 120,
          key: 'status',
          slot: 'status',
        },
      ],
      columns2: [
        {
          title: '提现单号',
          align: 'center',
          minWidth: 140,
          key: 'orderNo',
        },
        {
          title: 'ping++交易号',
          align: 'center',
          width: 140,
          key: 'callbackOrder',
        },
        {
          title: '品牌名称',
          align: 'center',
          minWidth: 120,
          key: 'merchantName',
        },
        {
          title: '提现人姓名',
          align: 'center',
          minWidth: 120,
          key: 'userName',
        },
        {
          title: '提现人手机',
          align: 'center',
          minWidth: 120,
          key: 'userPhone',
        },
        {
          title: '提现金额（元）',
          align: 'center',
          minWidth: 120,
          key: 'applyAmount',
        },
        {
          title: '提现服务费（元）',
          align: 'center',
          minWidth: 140,
          key: 'withdrawFee',
        },
        {
          title: '提现平台收取费（元）',
          align: 'center',
          minWidth: 160,
          key: 'platformFee',
        },
        {
          title: '提现时间',
          align: 'center',
          minWidth: 120,
          key: 'applyTime',
          slot: 'applyTime',
        },
        {
          title: '打款时间',
          align: 'center',
          minWidth: 120,
          key: 'remitTime',
          slot: 'remitTime',
        },
        {
          title: '打款状态',
          align: 'center',
          minWidth: 120,
          key: 'status',
          slot: 'status',
        },
      ],
      columns3: [
        {
          title: '异常原因',
          align: 'center',
          minWidth: 140,
          key: 'failureReason',
        },
        {
          title: '提现单号',
          align: 'center',
          width: 120,
          key: 'orderNo',
        },
        {
          title: '商户名称',
          align: 'center',
          minWidth: 120,
          key: 'merchantName',
        },
        {
          title: '省/市',
          align: 'center',
          minWidth: 80,
          key: 'provinceCode',
          render: (h, params) => {
            let name = params.row.provinceCode
            for (let i = 0; i < this.provinceList.length; i++) {
              if(this.provinceList[i].provinceCode == params.row.provinceCode) {
                name = this.provinceList[i].shortName
              }
		        // 不能用else
            }
            return h("div",name);
          }
        },
        {
          title: '提现人姓名',
          align: 'center',
          minWidth: 120,
          key: 'userName',
        },
        {
          title: '提现人手机',
          align: 'center',
          minWidth: 120,
          key: 'userPhone',
        },
        {
          title: '提现金额（元）',
          align: 'center',
          minWidth: 120,
          key: 'applyAmount',
        },
        {
          title: '提现服务费（元）',
          align: 'center',
          minWidth: 140,
          key: 'withdrawFee',
        },
        {
          title: '提现平台收取费（元）',
          align: 'center',
          minWidth: 160,
          key: 'platformFee',
        },
        {
          title: '提现时间',
          align: 'center',
          minWidth: 120,
          key: 'applyTime',
          slot: 'applyTime',
        },
      ],
      columns4: [
        {
          title: '异常原因',
          align: 'center',
          minWidth: 140,
          key: 'failureReason',
        },
        {
          title: '提现单号',
          align: 'center',
          width: 140,
          key: 'orderNo',
        },
        {
          title: '品牌名称',
          align: 'center',
          minWidth: 120,
          key: 'merchantName',
        },
        {
          title: '提现人姓名',
          align: 'center',
          minWidth: 120,
          key: 'userName',
        },
        {
          title: '提现人手机',
          align: 'center',
          minWidth: 120,
          key: 'userPhone',
        },
        {
          title: '提现金额（元）',
          align: 'center',
          minWidth: 120,
          key: 'applyAmount',
        },
        {
          title: '提现服务费（元）',
          align: 'center',
          minWidth: 140,
          key: 'withdrawFee',
        },
        {
          title: '提现平台收取费（元）',
          align: 'center',
          minWidth: 160,
          key: 'platformFee',
        },
        {
          title: '提现时间',
          align: 'center',
          minWidth: 120,
          key: 'applyTime',
          slot: 'applyTime',
        },
      ],
      tableData: [],
      daterange: [],
      searchData: { // 查询参数
        merchantType: 0,
        merchantName: "",
        orderNo: "",
        provinceCode: "",
        cityCode: "",
        remitStatus: '',
        remitTime: [ "",""],
        userName: "",
        userPhone: "",
        withdrawTime: ["",""],
        pageNum: 1, //页码
        pageSize: 10, //每页数量
      },
      // page: {
      //   pageNum: 1, //页码
      //   pageSize: 10, //每页数量
      //   total: 0 //数据总数
      // },
      // pagingType:'1', // 分页类型 1：初始化，2为搜索
      current: 1,
      totalSize: 0, //总条数
      tableLoading: false, //列表加载动画
    }
  },

  filters: {
　　　　data: function (value) {
          if(value) {
            let time1 = value.slice(0,10)
            return time1 
          }
　　　　},
　　　　time: function (value) {
          if(value) {
            let time2 = value.slice(11,19)
            return time2
          }
　　　　}
　　},
  created: function() {
    this.getprovincelist()
    this.search()
  },
  methods: {
    // changeStartDate(arr) {
    //   // yyyy-MM-dd HH:mm:ss
    //   console.log(arr);
    //   // this.daterange = arr;
    //   this.searchData.withdrawTime = arr;
    //   let [startTime, endTime] = arr;
    //   if (startTime) {
    //     startTime = `${arr[0]}:00`;
    //     endTime = `${arr[1]}:00`;
    //   }
    //   console.log(startTime, endTime);
    //   // this.searchData.withdrawTime = [startTime,endTime];
    // },
      //获取省份信息数据
      getprovincelist() {
        postRequest("/system/area/province/list").then(res => {
          if (res.code == 200) {
            this.provinceList = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
      },
      //根据省份code获取城市信息数据
      getcitylist() {
        if(!this.searchData.provinceCode) {
          return
        }
        getRequest("/system/area/city/" + this.searchData.provinceCode).then(
          res => {
            if (res.code == 200) {
              this.cityList = res.data;
              // this.searchItem.areaId = "";
            } else {
              this.$Message.error(res.msg);
            }
          }
        );
      },

      tabsFn(name) {
        this.type = name
        this.tableData = []
        this.reset()
      },

// 搜索
    search() {
      // 页数
      // this.page.pageNum = 1;
      // this.page.total = 0;//总条数

      if(this.type == 1) {
          this.searchData.merchantType = 0
          this.getMerchantPaymentFn(this.searchData)
        }else if(this.type == 2) {
          this.searchData.merchantType = 1
          this.getMerchantPaymentFn(this.searchData)
        }else if(this.type == 3) {
          this.searchData.merchantType = 0
          this.getAbnormalPaymentFn(this.searchData)
        }else if(this.type == 4) {
          this.searchData.merchantType = 1
          this.getAbnormalPaymentFn(this.searchData)
        }
      // this.getMerchantPaymentFn(this.searchData)
    },

// 重置
    reset() {
      this.daterange = []; // 时间

      this.searchData = { // 查询参数
        merchantType: 0,
        merchantName: "",
        orderNo: "",
        provinceCode: "",
        cityCode: "",
        remitStatus: '',
        remitTime: [ "",""],
        userName: "",
        userPhone: "",
        withdrawTime: ["",""],
        pageNum: 1, //页码
        pageSize: 10, //每页数量
      };

      // this.page = {
      //   pageNum: 1, //页码
      //   pageSize: 10, //每页数量
      //   total: 0 //数据总数
      // };
      this.search()
    },


// 打款列表
    async getMerchantPaymentFn(obj) {
      this.tableLoading = true;
      // let reqPrams = {
      //   ...obj,...this.page
      // };
      // let {
      //   code,
      //   data: { records, current, total, size }
      // } = await 
      getMerchantPayment(obj).then(res => {
        if(res.code == 200){
          // console.log(res);
          // this.tableData = res.data.records
          // this.current = res.data.current
          // this.totalSize = res.data.total
          this.tableData = res.data.records;
          this.current = res.data.current; //分页查询起始记录
          this.totalSize = res.data.total; //列表总数
          // this.page.pageSize = size; //每页数据
          this.tableLoading = false;
        }else {
          this.msgErr(res.msg)
          this.tableLoading = false;
        }
      })
    },

// 异常列表
   async getAbnormalPaymentFn(obj) {
      this.tableLoading = true;
    //    let reqPrams = {
    //     ...obj,...this.page
    //   };
    //  let {
    //     code,
    //     data: { records, current, total, size }
    //   } = await  
      getAbnormalPayment(obj).then(res => {
        if(res.code == 200){
          // console.log(res);
          // this.tableData = res.data.records
          // this.current = res.data.current
          // this.totalSize = res.data.total
          this.tableData = res.data.records;
          this.current = res.data.current; //分页查询起始记录
          this.totalSize = res.data.total; //列表总数
          // this.page.pageSize = size; //每页数据
          this.tableLoading = false;
        }else {
          this.msgErr(res.msg)
          this.tableLoading = false;
        }
      })
    },
// 删除
    delStaffFn(id) {
      // console.log(id);
      // return
      this.$Modal.confirm({
          title: '删除确认',
          content: '<p>确认删除当前员工吗？</p>',
          onOk: () => {
            delStaff(id).then(res => {
              if(res.code == 200){
                this.msgOk('删除成功')
                this.search()
              }else {
                this.msgErr(res.msg)
              }
            })
          },
          onCancel: () => {
              // this.$Message.info('Clicked cancel');
          }
      });

    },

// 分页（点击第几页）
    changeCurrent: function (current) {
      this.current = current;
      this.searchData.pageNum = current
      if(this.type == 1) {
          this.searchData.merchantType = 0
          this.getMerchantPaymentFn(this.searchData)
        }else if(this.type == 2) {
          this.searchData.merchantType = 1
          this.getMerchantPaymentFn(this.searchData)
        }else if(this.type == 3) {
          this.searchData.merchantType = 0
          this.getAbnormalPaymentFn(this.searchData)
        }else if(this.type == 4) {
          this.searchData.merchantType = 1
          this.getAbnormalPaymentFn(this.searchData)
        }
    },

//过滤小数点
      // changeNumber() {
      //   let str = "" + this.formValidate.mobile;
      //   if (str.indexOf(".") != -1) {
      //     let arr = str.split("");
      //     arr.splice(arr.length - 1);
      //     let str2 = arr.join("");
      //     this.formValidate.mobile = +str2;
      //     this.msgErr('只能输入整数')
      //   }
      // },
      // changeNumber1() {
      //   let str = "" + this.searchData.mobile;
      //   if (str.indexOf(".") != -1) {
      //     let arr = str.split("");
      //     arr.splice(arr.length - 1);
      //     let str2 = arr.join("");
      //     this.searchData.mobile = +str2;
      //     this.msgErr('只能输入整数')
      //   }
      // },
      // changeNumber2() {
      //   let str = "" + this.bindData.mobile;
      //   if (str.indexOf(".") != -1) {
      //     let arr = str.split("");
      //     arr.splice(arr.length - 1);
      //     let str2 = arr.join("");
      //     this.bindData.mobile = +str2;
      //     this.msgErr('只能输入整数')
      //   }
      // },

      // 时间
      time1(e) {
        this.searchData.remitTime = e;
      },
      time2(e) {
        this.searchData.withdrawTime = e;
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

    // dropDown() {
    //   if (this.drop) {
    //     this.dropDownContent = "展开";
    //     this.dropDownIcon = "ios-arrow-down";
    //   } else {
    //     this.dropDownContent = "收起";
    //     this.dropDownIcon = "ios-arrow-up";
    //   }
    //   this.drop = !this.drop;
    // },

  },
};
</script>
<style lang="less" scoped>
.operation {
  margin-bottom: 2vh;
}
.ivu-table-wrapper {
  overflow: visible;
}
</style>
