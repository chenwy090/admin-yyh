<template>
  <div>
    <div v-if="addOrEditDisplay">
      <addOrEdit @changeStatus="addOrEditChange()" :addOrEdit="addOrEdit" :id="id"></addOrEdit>
    </div>
    <div v-if="!addOrEditDisplay">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="投放门店: " :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.orderNo" placeholder="请输入商户名称"></Input>
          </FormItem>
          <FormItem label="优惠券: " :label-width="85">
            <Input
              style="width:200px"
              type="text"
              v-model="searchData.merchantName"
              placeholder="请输入商户名称"
            ></Input>
          </FormItem>
          <FormItem style="margin-left:35px;" class="br">
            <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            <Button icon="md-refresh" @click="reset">重置</Button>
          </FormItem>
        </Form>
      </Card>
      <Card :bordered="false" style="margin-bottom:2px">
        <div>
          <Row class="operation">
            <span style="margin-right:20px">app专享福利配置</span>
            <Button type="primary" icon="md-add" @click="addInfo()">新增</Button>
            <Button icon="md-refresh" @click="refreshFn()">刷新</Button>
          </Row>
          <!-- 用户列表 -->
          <Table
            border
            width="100%"
            :columns="columns1"
            :data="tableData"
            :loading="tableLoading"
          >
            <template slot-scope="{ row }" slot="action">
              <Button type="text" size="small" @click="viewDetailsFn(row)">查看</Button>
              <Button type="text" size="small" @click="editInfo(row)">编辑</Button>
              <Button type="text" size="small" @click="editInfo(row)">上架</Button>
              <Button type="text" size="small" @click="editInfo(row)">删除</Button>
            </template>
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
          ></Page>-->
        </Row>
        <!-- 分页器 -->
      </Card>
    </div>
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
import addOrEdit from "./addOrEdit";

export default {
  name: "merchant-capitalAccount",
    components: {
      addOrEdit
    },
  data() {
    return {
      id:null,
      addOrEdit:null,
      addOrEditDisplay:false,
      provinceList: [], //省份
      cityList: [], //城市
      data1: [],
      columns1: [
        {
          title: '操作',
          align: 'center',
          width: 200,
          fixed: 'left',
          slot: "action",
        },
        {
          title: '投放门店',
          align: 'center',
          minWidth: 140,
          key: 'orderNo',
        },
        {
          title: '优惠券',
          align: 'center',
          width: 140,
          key: 'callbackOrder',
        },
        {
          title: '剩余总量',
          align: 'center',
          minWidth: 120,
          key: 'merchantName',
        },
        {
          title: '领券量',
          align: 'center',
          minWidth: 120,
          key: 'userName',
        },
        {
          title: '修改人',
          align: 'center',
          minWidth: 120,
          key: 'userPhone',
        },
        {
          title: '修改时间',
          align: 'center',
          minWidth: 120,
          key: 'applyAmount',
        },
        
      ],
      tableData: [],
      daterange: [],
      searchData: { // 查询参数
        merchantName: "",
        orderNo: "",
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
    this.search()
  },
  methods: {
    addInfo(type) {
      this.addOrEdit = type
      this.addOrEditDisplay = true
    },
    // 新增编辑返回数据
    addOrEditChange(e) {
        this.addOrEditDisplay = e;
        // this.search();
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
      this.getMerchantPaymentFn(this.searchData)
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
      // if(this.type == 1) {
      //     this.searchData.merchantType = 0
      //     this.getMerchantPaymentFn(this.searchData)
      //   }else if(this.type == 2) {
      //     this.searchData.merchantType = 1
      //     this.getMerchantPaymentFn(this.searchData)
      //   }else if(this.type == 3) {
      //     this.searchData.merchantType = 0
      //     this.getAbnormalPaymentFn(this.searchData)
      //   }else if(this.type == 4) {
      //     this.searchData.merchantType = 1
      //     this.getAbnormalPaymentFn(this.searchData)
      //   }
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
      time1(arr) {
        let [startTime, endTime] = arr;
        if (startTime) {
          startTime = `${arr[0]} 00:00:00`;
          endTime = `${arr[1]} 23:59:59`;
        }
        this.searchData.remitTime = [startTime, endTime];
      },
      time2(arr) {
        let [startTime, endTime] = arr;
        if (startTime) {
          startTime = `${arr[0]} 00:00:00`;
          endTime = `${arr[1]} 23:59:59`;
        }
        this.searchData.withdrawTime = [startTime, endTime];
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
