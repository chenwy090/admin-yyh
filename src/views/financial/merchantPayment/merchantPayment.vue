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
            type="date"
            placeholder="请选择"
            style="width: 200px"
            :value="searchData.remitTime[0]"
            format="yyyy-MM-dd"
            @on-change="time1"
          ></DatePicker>
          <!-- &nbsp;至&nbsp; -->
        </FormItem>
        <FormItem label="提现时间: " :label-width="85">
          <DatePicker
            type="date"
            placeholder="请选择"
            style="width: 200px"
            :value="searchData.withdrawTime[0]"
            format="yyyy-MM-dd"
            @on-change="time2"
          ></DatePicker>
        </FormItem>
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
        <Table border width="100%" :columns="columns1" :data="staffList" :loading="TableLoading">
          <template slot-scope="{ row }" slot="gmtModified">
            <span>{{ row.gmtModified | time}}</span>
          </template>
          <template slot-scope="{ row }" slot="merchantType">
            <span v-if="row.merchantType == 0">本地商户 (单店)</span>
            <span v-else-if="row.merchantType == 1">本地商户 (多店)</span>
          </template>
          <template slot-scope="{ row }" slot="type">
            <span v-if="row.type == 'business'">企业</span>
            <span v-else-if="row.type == 'customer'">个人</span>
          </template>
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
          @on-change="changeCurrent"
        ></Page>
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
import { uploadOperationImage2AliOssURl } from "@/api/index";

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
          minWidth: 120,
          key: 'provinceCode',
        },
        {
          title: '提现人姓名',
          align: 'center',
          minWidth: 120,
          key: 'gmtModified',
        },
        {
          title: '提现人手机',
          align: 'center',
          minWidth: 120,
          key: 'gmtModified',
        },
        {
          title: '提现金额（元）',
          align: 'center',
          minWidth: 120,
          key: 'gmtModified',
        },
        {
          title: '提现服务费（元）',
          align: 'center',
          minWidth: 120,
          key: 'gmtModified',
        },
        {
          title: '提现平台收取费（元）',
          align: 'center',
          minWidth: 120,
          key: 'gmtModified',
        },
        {
          title: '提现时间',
          align: 'center',
          minWidth: 120,
          key: 'gmtModified',
        },
        {
          title: '打款时间',
          align: 'center',
          minWidth: 120,
          key: 'gmtModified',
        },
        {
          title: '打款状态',
          align: 'center',
          minWidth: 120,
          key: 'gmtModified',
        },
      ],
      staffList: [],
      searchData: { // 查询参数
        cityCode: "",
        limit: 10,
        merchantName: "",
        merchantType: 0,
        orderNo: "",
        page: 1,
        provinceCode: "",
        remitStatus: '',
        remitTime: [
          ""
        ],
        userName: "",
        userPhone: "",
        withdrawTime: [
          ""
        ]
      },
      // pagingType:'1', // 分页类型 1：初始化，2为搜索
      current: 1,
      totalSize: 0, //总条数
      TableLoading: false, //列表加载动画
    }
  },

  filters: {
　　　　time: function (value) {
          if(value) {
            let time1 = value.slice(0,10)
            let time2 = value.slice(11,19)
            return time1 + ' ' + time2
          }
　　　　}
　　},
  created: function() {
    this.getprovincelist()
    this.search()
  },
  methods: {

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
        this.reset()
      },

// 搜索
    search() {
      this.current = 1;
      this.totalSize = 0;//总条数

      // 页数
      this.searchData.page = this.current
      
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
      this.searchData.merchantName =  ''
      this.searchData.cityCode = "",
      this.searchData.limit = 10,
      this.searchData.merchantType = null,
      this.searchData.orderNo = "",
      this.searchData.page = 1,
      this.searchData.provinceCode = "",
      this.searchData.remitStatus = '',
      this.searchData.remitTime = [""],
      this.searchData.userName = "",
      this.searchData.userPhone = "",
      this.searchData.withdrawTime =[""],
      this.search()
    },


// 打款列表
    getMerchantPaymentFn(obj) {
      this.TableLoading = true;
      getMerchantPayment(obj).then(res => {
        if(res.code == 200){
          // console.log(res);
          this.staffList = res.data.records
          this.current = res.data.current
          this.totalSize = res.data.total
          this.TableLoading = false
        }else {
            this.TableLoading = false
          this.msgErr(res.msg)
        }
      })
    },

// 异常列表
    getAbnormalPaymentFn(obj) {
      this.TableLoading = true;
      getAbnormalPayment(obj).then(res => {
        if(res.code == 200){
          // console.log(res);
          this.staffList = res.data.records
          this.current = res.data.current
          this.totalSize = res.data.total
          this.TableLoading = false
        }else {
            this.TableLoading = false
          this.msgErr(res.msg)
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
      this.searchData.page = current
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
      changeNumber() {
        let str = "" + this.formValidate.mobile;
        if (str.indexOf(".") != -1) {
          let arr = str.split("");
          arr.splice(arr.length - 1);
          let str2 = arr.join("");
          this.formValidate.mobile = +str2;
          this.msgErr('只能输入整数')
        }
      },
      changeNumber1() {
        let str = "" + this.searchData.mobile;
        if (str.indexOf(".") != -1) {
          let arr = str.split("");
          arr.splice(arr.length - 1);
          let str2 = arr.join("");
          this.searchData.mobile = +str2;
          this.msgErr('只能输入整数')
        }
      },
      changeNumber2() {
        let str = "" + this.bindData.mobile;
        if (str.indexOf(".") != -1) {
          let arr = str.split("");
          arr.splice(arr.length - 1);
          let str2 = arr.join("");
          this.bindData.mobile = +str2;
          this.msgErr('只能输入整数')
        }
      },

      // 时间
      time1(e) {
        this.form1[0].validFrom = e;
      },
      time2(e) {
        this.form1[0].validUntil = e;
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
