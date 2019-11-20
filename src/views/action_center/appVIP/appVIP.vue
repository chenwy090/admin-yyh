<template>
  <div>
    <div v-if="addOrEditDisplay">
      <addOrEdit @changeStatus="addOrEditChange()" :addOrEdit="addOrEdit" :id="id"></addOrEdit>
    </div>
    <div v-if="!addOrEditDisplay">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="投放门店: " :label-width="85">
            <Select v-model="searchData.putShop" style="width:200px">
              <Option value="0">全国</Option>
              <Option value="1">零售商</Option>
              <Option value="2">城市</Option>
              <Option value="3">自定义门店</Option>
            </Select>
          </FormItem>
          <FormItem label="优惠券: " :label-width="85">
            <Input
              style="width:200px"
              type="text"
              v-model="searchData.couponName"
              placeholder="请输入"
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
            <Button type="primary" icon="md-add" @click="addInfo(1)">新增</Button>
            <Button icon="md-refresh" @click="refreshFn()">刷新</Button>
          </Row>
          <!-- 用户列表 -->
          <Table border width="100%" :columns="columns1" :data="tableData" :loading="tableLoading">
            <template slot-scope="{ row }" slot="action">
              <Button type="text" size="small" @click="viewDetailsFn(row)">查看</Button>
              <Button
                type="text"
                size="small"
                :disabled="row.status == 1"
                @click="editInfo(row.id)"
              >编辑</Button>
              <Button type="text" size="small" v-if="row.status != 1" @click="upLow(row.id, 1)">上架</Button>
              <Button type="text" size="small" v-else @click="lowDisplay = true;lowId = row.id">下架</Button>
              <Button
                type="text"
                size="small"
                :disabled="row.status == 1"
                @click="delStaffFn(row.id, 2)"
              >删除</Button>
            </template>
            <!-- <template slot-scope="{ row }" slot="applyTime">
              <div>{{ row.applyTime | data}}</div>
              <div>{{ row.applyTime | time}}</div>
            </template>
            <template slot-scope="{ row }" slot="remitTime">
              <div>{{ row.remitTime | data}}</div>
              <div>{{ row.remitTime | time}}</div>
            </template>-->
            <template slot-scope="{ row }" slot="status">
              <span v-if="row.status == 1">上架</span>
              <span v-else-if="row.status == 0">创建</span>
              <span v-else-if="row.status == -1">下架</span>
            </template>
            <template slot-scope="{ row }" slot="putShop">
              <span v-if="row.putShop == 0">全国</span>
              <span v-else-if="row.putShop == 1">零售商</span>
              <span v-else-if="row.putShop == 2">城市</span>
              <span v-else-if="row.putShop == 3">自定义门店</span>
            </template>
            <template slot-scope="{ row }" slot="couponName">
              <span>{{row.couponName | ellipsis}}</span>
              <a style="margin-left:10px" @click="seeCouponInfo(row.id)">查看</a>
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

    <!-- 选择商户对话框 -->
    <Modal
      v-model="seeCouponDisplay"
      title="查看优惠券详情"
      :closable="false"
      :mask-closable="false"
      footer-hide
      width="800"
    >
      <div>
        <!-- 商户列表 -->
        <Table border highlight-row :columns="columns2" :data="seeCouponList">
          <!-- <template slot-scope="{ row }" slot="action">
              <Button type="text" size="small">查看</Button>
          </template>-->
        </Table>
        <!-- 商户列表 -->
      </div>
      <!-- 分页器 -->
      <div style="margin-top: 20px;overflow: hidden;">
        <div style="float: right;" slot="footer">
          <Button style="margin-right: 20px" @click="seeCouponDisplay = false">关闭</Button>
          <!-- <Button type="primary">确定</Button> -->
        </div>
      </div>
    </Modal>
    <!-- 选择商户对话框 -->

    <!-- 下架对话框 -->
    <Modal
      v-model="lowDisplay"
      title="下架原因"
      :closable="false"
      :mask-closable="false"
      footer-hide
      width="350"
    >
      <Input style="width:300px" type="textarea" :rows="4" v-model="lowTxt" placeholder="请输入"></Input>
      <div style="margin-top: 20px;overflow: hidden;">
        <div style="float: right;" slot="footer">
          <Button style="margin-right: 20px" @click="lowDisplay = false">取消</Button>
          <Button type="primary" @click="upLow(lowId, -1)">确定</Button>
        </div>
      </div>
    </Modal>
    <!-- 下架对话框 -->
  </div>
</template>

<<script>
import { getAppVipList, getAbnormalPayment, getCouponData, updateStatus } from '@/api/sys';
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
      // 下架原因
      lowId:null,
      lowTxt:'',
      lowDisplay: false,
      // 查看优惠券详情
      seeCouponDisplay: false,
      seeCouponList: [],
      id:null,
      addOrEdit:null,
      addOrEditDisplay:false,
      provinceList: [], //省份
      cityList: [], //城市
      data1: [],
      columns1: [ //活动列表
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
          key: 'putShop',
          slot: "putShop",
        },
        {
          title: '优惠券',
          align: 'center',
          width: 240,
          key: 'couponName',
          slot: "couponName",
        },
        {
          title: '状态',
          align: 'center',
          width: 100,
          key: 'status',
          slot: "status",
        },
        {
          title: '剩余总量',
          align: 'center',
          minWidth: 120,
          key: 'surplusCount',
        },
        {
          title: '领券量',
          align: 'center',
          minWidth: 120,
          key: 'receiveCount',
        },
        {
          title: '修改人',
          align: 'center',
          minWidth: 120,
          key: 'updateBy',
        },
        {
          title: '修改时间',
          align: 'center',
          minWidth: 120,
          key: 'updateTime',
        },
        
      ],
      columns2: [ // 优惠券列表
        {
          title: '优惠券',
          align: 'center',
          minWidth: 140,
          key: 'putShop',
        },
        {
          title: '剩余库存',
          align: 'center',
          width: 240,
          key: 'couponName',
        },
        {
          title: '领券量',
          align: 'center',
          minWidth: 120,
          key: 'surplusCount',
        },
        {
          title: '核销量',
          align: 'center',
          minWidth: 120,
          key: 'receiveCount',
        },
      ],
      tableData: [],
      daterange: [],
      searchData: { // 查询参数
        couponName: "",
        putShop: "",
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
    ellipsis: function (value) {
      if(value) {
        if(value.length > 10) {
          let txt = value.slice(0,10) + '...'
          return txt
        }else {
          return value
        }
      }
　　},
// 　　　　time: function (value) {
//           if(value) {
//             let time2 = value.slice(11,19)
//             return time2
//           }
// 　　　　}
　　},
  created: function() {
    this.search()
  },
  methods: {
    // 新增
    addInfo(type) {
      this.addOrEdit = type
      this.addOrEditDisplay = true
    },
    editInfo(id) {
      this.addOrEdit = 2
      this.id = id
      this.addOrEditDisplay = true
    },
    // 新增编辑返回数据
    addOrEditChange(e) {
        this.addOrEditDisplay = e;
        this.search();
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
      this.getAppVipListFn(this.searchData)
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

// 列表
    getAppVipListFn(obj) {
      this.tableLoading = true;
      let data = {
        couponName: obj.couponName,
        putShop: obj.putShop,
      }
      getAppVipList(data,obj.pageNum).then(res => {
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

    // 查看优惠券详情
    seeCouponInfo(id) {
      
      getCouponData(id).then(res => {
        if(res.code == 200){
          this.seeCouponDisplay = true
          this.seeCouponList = res.data.records
        }else {
          this.msgErr(res.msg)
        }
      })
    },

    // 上下架
    upLow(id,type) {
      if(type == -1 && !this.lowTxt) {
        this.msgErr('请输入下架原因')
        return
      }
      updateStatus(id,type,this.lowTxt).then(res => {
        if(res.code == 200){
          this.msgOk('操作成功')
          this.search()
          this.lowDisplay = false
        }else {
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
      this.searchData.pageNum = current
      this.search()
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
