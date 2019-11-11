<template>
  <div>
    <div
      v-if="!addMerchantDisplay && !viewDetailsDispaly && !addCredentialsDispaly && !addContactInformationDispaly && !addSettlementAccountDispaly && !addSubordinateMerchantsDispaly"
    >
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="商户名称：" :label-width="85">
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
      <Card :bordered="false">
        <Row class="operation">
          <Button type="primary" icon="md-add" @click="addInfo()">新增</Button>
          <Button icon="md-refresh" @click="refreshFn()">刷新开户状态</Button>
        </Row>
        <div>
          <!-- 用户列表 -->
          <Table border width="100%" :columns="columns8" :data="staffList" :loading="TableLoading">
            <template slot-scope="{ row }" slot="action">
              <div v-if="row.type == 'business'">
                <!-- 企业 -->
                <Button type="text" size="small" @click="editInfo(row)">编辑商户</Button>
                <Button type="text" size="small" @click="viewDetailsFn(row)">查看详情</Button>
                <Button
                  type="text"
                  size="small"
                  @click="addCredentialsFn(row)"
                  v-if="row.progress != 4"
                >编辑证件</Button>
                <Button
                  type="text"
                  size="small"
                  disabled
                  v-else
                >编辑证件</Button>
                <Button
                  type="text"
                  size="small"
                  @click="addContactInformationFn(row)"
                  v-if="row.progress != 1 || row.progress != 4"
                >编辑联系人信息</Button>
                <Button
                  type="text"
                  size="small"
                  disabled
                  v-else
                >编辑联系人信息</Button>
                <Button
                  type="text"
                  size="small"
                  @click="addSettlementAccountFn(row)"
                  v-if="row.progress != 1 || row.progress != 2 || row.progress != 3"
                >结算账号</Button>
                <Button
                  type="text"
                  size="small"
                  disabled
                  v-else
                >结算账号</Button>
                <Button
                  type="text"
                  size="small"
                  @click="addSubordinateMerchantsFn(row,1)"
                  v-if="row.progress == 3 ||row.progress == 5 || row.progress == 6 || row.progress == 7"
                >子应用</Button>
                <Button
                  type="text"
                  size="small"
                  disabled
                  v-else
                >子应用</Button>
                <Button
                  type="text"
                  size="small"
                  @click="addSubordinateMerchantsFn(row,2)"
                  v-if="row.progress == 7"
                >打款验证</Button>
                <Button
                  type="text"
                  size="small"
                  disabled
                  v-else
                >打款验证</Button>
              </div>
              <div v-else-if="row.type == 'customer'">
                <!-- 个人 -->
                <Button type="text" size="small" @click="editInfo(row)">编辑商户</Button>
                <Button type="text" size="small" @click="viewDetailsFn(row)">查看详情</Button>
                <Button
                  type="text"
                  size="small"
                  @click="addCredentialsFn(row)"
                  v-if="row.progress == 1 || row.progress == 2 || row.progress == 5"
                >编辑证件</Button>
                <Button
                  type="text"
                  size="small"
                  disabled
                  v-else
                >编辑证件</Button>
                <Button
                  type="text"
                  size="small"
                  @click="addContactInformationFn(row)"
                  v-if="row.progress == 2 || row.progress == 5"
                >编辑用户信息</Button>
                <Button
                  type="text"
                  size="small"
                  disabled
                  v-else
                >编辑用户信息</Button>
                <Button
                  type="text"
                  size="small"
                  @click="addSettlementAccountFn(row)"
                  v-if="row.progress == 4 || row.progress == 5"
                >结算账号</Button>
                <Button
                  type="text"
                  size="small"
                  disabled
                  v-else
                >结算账号</Button>
              </div>

              <!-- <hr /> -->
              <!-- 测试用 -->
              <!-- <div>
                <Button type="text" size="small" @click="editInfo(row)">编辑商户</Button>
                <Button type="text" size="small" @click="addCredentialsFn(row)">编辑证件</Button>
                <Button type="text" size="small" @click="addContactInformationFn(row)">编辑用户（联系人）信息</Button>
                <Button type="text" size="small" @click="addSettlementAccountFn(row)">结算账号</Button>
                <Button type="text" size="small" @click="addSubordinateMerchantsFn(row,1)">子应用</Button>
                <Button type="text" size="small" @click="addSubordinateMerchantsFn(row,2)">打款验证</Button>
                <Button type="text" size="small" @click="viewDetailsFn(row)">查看详情</Button>
              </div> -->
            </template>
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
            <template slot-scope="{ row }" slot="openAccountStatus">
              <!-- <span v-if="row.openAccountStatus == 'submitted'">已提交待激活</span>
              <span v-else-if="row.openAccountStatus == 'pending'">处理审核中</span>
              <span v-else-if="row.openAccountStatus == 'succeeded'">开户成功</span>
              <span v-else-if="row.openAccountStatus == 'failed'">
                开户失败
                <Tooltip v-if="row.failureReason" :content="row.failureReason" placement="bottom">
                  （
                  <a>查看原因</a>）
                </Tooltip>
              </span>
              <span v-else-if="row.openAccountStatus == 'frozen'">
                账户冻结
                <Tooltip v-if="row.failureReason" :content="row.failureReason" placement="bottom">
                  （
                  <a>查看原因</a>）
                </Tooltip>
              </span>-->
              <span v-if="row.progress == 1 || row.progress == 2 || row.progress == 3">创建</span>
              <span v-else-if="row.progress == 4">开户成功</span>
              <span v-else-if="row.progress == 6">开户成功--结算审核通过</span>
              <span v-else-if="row.progress == 7">开户成功--结算其他</span>
              <span v-else-if="row.progress == 5">
                <span v-if="row.openAccountStatus == 'submitted'">已提交待激活</span>
                <span v-else-if="row.openAccountStatus == 'pending'">处理审核中</span>
                <span v-else-if="row.openAccountStatus == 'succeeded'">开户成功</span>
                <span v-else-if="row.openAccountStatus == 'failed'">
                  开户失败
                  <Tooltip v-if="row.failureReason" :content="row.failureReason" placement="bottom">
                    （
                    <a>查看原因</a>）
                  </Tooltip>
                </span>
                <span v-else-if="row.openAccountStatus == 'frozen'">
                  账户冻结
                  <Tooltip v-if="row.failureReason" :content="row.failureReason" placement="bottom">
                    （
                    <a>查看原因</a>）
                  </Tooltip>
                </span>
              </span>
            </template>
            <template slot-scope="{ row }" slot="bankCardStatus">
              <span v-if="row.bankCardStatus == 'submitted'">已提交待激活</span>
              <span v-else-if="row.bankCardStatus == 'pending'">处理审核中</span>
              <span v-else-if="row.bankCardStatus == 'succeeded'">开户成功</span>
              <span v-else-if="row.bankCardStatus == 'failed'">
                开户失败
                <Tooltip v-if="row.failureReason" :content="row.failureReason" placement="bottom">
                  （
                  <a>查看原因</a>）
                </Tooltip>
              </span>
              <span v-else-if="row.bankCardStatus == 'frozen'">
                账户冻结
                <Tooltip v-if="row.failureReason" :content="row.failureReason" placement="bottom">
                  （
                  <a>查看原因</a>）
                </Tooltip>
              </span>
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

    <div v-if="addMerchantDisplay == true">
      <addMerchant @changeStatus="showMerchantStaffAddStatus" :id="id" :addEdit="addEdit"></addMerchant>
    </div>
    <div v-if="viewDetailsDispaly == true">
      <viewDetails @changeStatus="showViewDetails" :id="id"></viewDetails>
    </div>
    <div v-if="addCredentialsDispaly == true">
      <addCredentials
        @changeStatus="showAddCredentials"
        :id="id"
        :businessCustomer="businessCustomer"
      ></addCredentials>
    </div>
    <div v-if="addContactInformationDispaly == true">
      <addContactInformation
        @changeStatus="showAddContactInformation"
        :id="id"
        :businessCustomer="businessCustomer"
      ></addContactInformation>
    </div>
    <div v-if="addSettlementAccountDispaly == true">
      <addSettlementAccount
        @changeStatus="showAddSettlementAccount"
        :id="id"
        :businessCustomer="businessCustomer"
      ></addSettlementAccount>
    </div>
    <div v-if="addSubordinateMerchantsDispaly == true">
      <addSubordinateMerchants
        @changeStatus="showAddSubordinateMerchants"
        :id="id"
        :smAndPv="smAndPv"
      ></addSubordinateMerchants>
    </div>
  </div>
</template>

<<script>
import { getMerchantFundList, getMerchantList, addStaff, editStaff, bind, delStaff,refresh } from '@/api/sys';
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
} from "@/libs/axios";
import { uploadOperationImage2AliOssURl } from "@/api/index";
import addMerchant from "./addMerchant";
import viewDetails from "./view-details";
import addCredentials from "./addCredentials";
import addContactInformation from "./addContactInformation";
import addSettlementAccount from "./addSettlementAccount";
import addSubordinateMerchants from "./addSubordinateMerchants";

export default {
  name: "merchant-capitalAccount",
    components: {
      addMerchant,
      viewDetails,
      addCredentials,
      addContactInformation,
      addSettlementAccount,
      addSubordinateMerchants,
    },
  data() {
    return {
      businessCustomer: '', // 个人还是企业
      addEdit: null, // 1:新增 2：编辑
      smAndPv: 1 , // 1子商户 2打款验证
      addSubordinateMerchantsDispaly: false, // 编辑子商户应用
      addSettlementAccountDispaly: false, // 编辑结算账号 显示
      addContactInformationDispaly: false, // 编辑用户（联系人）信息 显示
      addCredentialsDispaly: false, // 编辑证件 显示
      viewDetailsDispaly:false, //查看详情 显示
      id: null,
      addMerchantDisplay: false,
      drop: false,
      dropDownIcon: "ios-arrow-down",
        columns1: [
            {
                title: '操作者',
                key: 'operater'
            },
            {
                title: '操作类型',
                key: 'operateType'
            },
            {
                title: '原因',
                key: 'remark'
            },
            {
                title: '操作时间',
                key: 'time'
            }
        ],
        data1: [],
      columns8: [
        {
          title: '操作',
          align: 'center',
          width: 250,
          fixed: 'left',
          slot: "action",
        },
        {
          title: '商户/品牌名称',
          align: 'center',
          minWidth: 120,
          key: 'merchantName',
        },
        {
          title: '商户类型',
          align: 'center',
          width: 140,
          key: 'merchantType',
          slot: "merchantType",
        },
        {
          title: '存管账号类型',
          align: 'center',
          minWidth: 120,
          key: 'type',
          slot: "type",
        },
        {
          title: '开户状态',
          align: 'center',
          minWidth: 120,
          key: 'openAccountStatus',
          slot: "openAccountStatus",
        },
        {
          title: '商户结算信息状态',
          align: 'center',
          minWidth: 120,
          key: 'bankCardStatus',
          slot: "bankCardStatus",
        },
        {
          title: '操作人',
          align: 'center',
          minWidth: 120,
          key: 'modifiedBy',
        },
        {
          title: '操作时间',
          align: 'center',
          minWidth: 120,
          key: 'gmtModified',
          slot: "gmtModified",
        },
      ],
      staffList: [],
      searchData: { // 查询参数
        status: '',
        merchantName: '',
        mobile: null,
      },
      // pagingType:'1', // 分页类型 1：初始化，2为搜索
      current: 1,
      totalSize: 0, //总条数
      TableLoading: false, //列表加载动画
      merchantList:[], // 商户列表
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
    // console.log(this.merchantId);
    // this.searchData.merchantId = this.merchantId
    // this.formValidate.merchantId = this.merchantId
    // this.getMerchantListFn()
    this.search()
    this.userToken = {
        jwttoken: localStorage.getItem("jwttoken")
      };
  },
  methods: {

    // 新增
    addInfo() {
        // this.setStore("pageStatus", "add");
        this.addEdit = 1
        this.id = ''
        this.addMerchantDisplay = true;
    },
    //编辑
    editInfo(row) {
        // this.setStore("pageStatus", "edit");
        this.addEdit = 2
        this.id = row.id;
        this.addMerchantDisplay = true;
    },

    // 查看详情
    viewDetailsFn(row) {
      this.id = row.id;
      this.viewDetailsDispaly  = true
    },

    // 证件编辑
    addCredentialsFn(row) {
      this.id = row.id;
      this.businessCustomer = row.type
      this.addCredentialsDispaly  = true
    },

    // 用户信息编辑
    addContactInformationFn(row) {
      this.id = row.id;
      this.businessCustomer = row.type
      this.addContactInformationDispaly  = true
    },

    // 结算账户编辑
    addSettlementAccountFn(row) {
      this.id = row.id;
      this.businessCustomer = row.type
      this.addSettlementAccountDispaly  = true
    },

    // 子商户应用 和 打款验证 编辑
    addSubordinateMerchantsFn(row, num) {
      this.id = row.id;
      this.smAndPv = num
      this.addSubordinateMerchantsDispaly  = true
    },

    // 新增编辑返回数据
    showMerchantStaffAddStatus(e) {
        this.addMerchantDisplay = e;
        this.search();
    },

    // 查看详情返回数据
    showViewDetails (e) {
      this.viewDetailsDispaly = e;
    },

    // 证件编辑返回数据
    showAddCredentials (e) {
      this.addCredentialsDispaly = e;
    },

    // 用户信息返回数据
    showAddContactInformation (e) {
      this.addContactInformationDispaly = e;
    },

    // 结算账户返回数据
    showAddSettlementAccount (e) {
      this.addSettlementAccountDispaly = e;
    },

    // 子商户应用返回数据
    showAddSubordinateMerchants (e) {
      this.addSubordinateMerchantsDispaly = e;
    },

    // 刷新
    refreshFn() {
      refresh().then(res => {
        if(res.code == 200) {
          this.search()
        }else {
          this.$Modal.warning({
            title: '刷新失败',
            content: '请稍后再试'
          });
        }
      })
    },

// 搜索
    search() {
      this.current = 1;
      this.totalSize = 0;//总条数
      this.getMerchantFundListFn(this.searchData)
      // this.pagingType = '2'
    },

// 重置
    reset() {
      this.searchData.merchantName =  ''
      // this.searchData.realName =  ''
      // this.searchData.mobile =  null
      // this.pagingType = '1'
      this.search()
    },


// // 获取商户列表
//     getMerchantListFn() {
//       getMerchantList().then(res => {
//         if(res.code == 200) {
//           this.merchantList = res.data.records
//         }else {
//           this.msgErr(res.msg)
//         }
//       })
//     },

// 查询列表
    getMerchantFundListFn(obj) {
      this.TableLoading = true;
        var reqParam = {
            name: obj.merchantName,
            pageNum: this.current,
            pageSize: 10
        };
      getMerchantFundList(reqParam).then(res => {
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
      // var self = this;
      // self.banner_page_req.start = current * self.banner_page_req.limit - self.banner_page_req.limit;
      this.current = current;
      // if(this.pagingType == 1){
      // } else if (this.pagingType == 2) {
        this.getMerchantFundListFn(this.searchData);
      // }
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
    },

  },
};
</script>
<style lang="less" scoped>
  .operation {
    margin-bottom: 2vh;
  }
  // .select-count {
  //   font-size: 13px;
  //   font-weight: 600;
  //   color: #40a9ff;
  // }
  // .select-clear {
  //   margin-left: 10px;
  // }
  // .page {
  //   margin-top: 2vh;
  // }
  // .drop-down {
  //   font-size: 13px;
  //   margin-left: 5px;
  // }
  .ivu-table-wrapper {
    overflow: visible;
  }
</style>
