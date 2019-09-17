<template>
  <div>
    <div v-if="!merchantStaffAddPage">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
            <FormItem label="员工手机号：" :label-width="85">
                <InputNumber
                        style="width:100%"
                        v-model="searchData.mobile"
                        placeholder="请输入员工手机号"
                        clearable
                        :max="99999999999"
                        :min="0"
                        @keyup.native="changeNumber1"
                />
            </FormItem>
          <FormItem label="商户名称：" :label-width="85">
            <Input
              style="width:200px"
              type="text"
              v-model="searchData.merchantName"
              placeholder="请输入商户名称"
            ></Input>
          </FormItem>
            <FormItem label="状态：" :label-width="85">
                <Select v-model="searchData.status" placeholder="请选择状态" style="width: 150px">
                    <Option value="-1">全部</Option>
                    <Option value="0">正常</Option>
                    <Option value="1">已禁用</Option>
                </Select>
            </FormItem>
          <FormItem style="margin-left:35px;" class="br">
            <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            <Button icon="md-refresh" @click="reset">重置</Button>
          </FormItem>
        </Form>
      </Card>
      <Card :bordered="false">
        <Row class="operation">
          <Button type="primary" icon="md-add" @click="addInfo">新增</Button>
          <Button icon="md-refresh" @click="search">刷新</Button>
        </Row>
        <div>
          <!-- 用户列表 -->
          <Table border width="100%" :columns="columns8" :data="staffList" :loading="TableLoading">
            <template slot-scope="{ row }" slot="wxQrcode">
              <img
                :src="row.wxQrcode"
                v-if="row.wxQrcode != ''"
                style="width:40px"
                @click="wxQrcodeLook(row.wxQrcode)"
              >
            </template>

            <template slot-scope="{ row }" slot="action">
              <Button
                type="text"
                size="small"
                style="color: #f39913"
                v-if="row.status == '0'"
                @click="inputUnbinding(row)"
              >禁用</Button>
                <Button
                        type="text"
                        size="small"
                        style="color: #368029"
                        v-if="row.status == '1'"
                        @click="inputUnbinding(row)"
                >解禁</Button>
              <Button
                type="text"
                size="small"
                style="color:#2db7f5"
                @click="editInfo(row)"
              >编辑</Button>
              <!--<Button type="text" size="small" style="color:#ed4014"
                      @click="delStaffFn(row.employeeId)">删除</Button>-->
            </template>
          </Table>
          <!-- 用户列表 -->
        </div>
        <!-- 分页器 -->
        <Row type="flex" justify="end" class="page">
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

    <!-- 禁用 -->
    <Modal
      v-model="unbindDisplay"
      title="禁用/解禁原因"
      width="600"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
        <Divider style="margin-top: -10px">员工编号：{{banRemark.employeeId}}</Divider>
      <Row>
        <Input
            type="textarea"
            style="width:100%"
            v-model="banRemark.remark"
            placeholder="200个字符以内原因"
            clearable
            :rows="2"
        />
      </Row>
        <Row style="margin:10px 0 0 456px">
            <Button type="text" @click="unbindDisplay = false">取消</Button>
            <Button type="primary" @click="ban">{{banRemark.title}}</Button>
        </Row>
        <div>
            <Divider>操作日志</Divider>
        </div>
        <Table height="350" :columns="columns1" :data="data1"></Table>

    </Modal>
    <!-- 禁用 -->
    <!-- 看二维码 -->
    <Modal v-model="wxQrcodeDisplay" title="查看二维码" width="350" footer-hide>
      <img style="width: 100%" :src="wxQrcode_url">
    </Modal>
    <!-- 看二维码 -->


    <div v-if="merchantStaffAddPage == true">
        <merchantStaffAdd @changeStatus="showMerchantStaffAddStatus" :employeeId="employeeId"></merchantStaffAdd>
    </div>


  </div>
</template>

<<script>
import { getStaffList, getMerchantList, addStaff, editStaff, bind, delStaff } from '@/api/sys';
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
} from "@/libs/axios";
import { uploadOperationImage2AliOssURl } from "@/api/index";
import merchantStaffAdd from "./merchant-staff-add";

export default {
  name: "merchant-staff",
    components: {
        merchantStaffAdd,
    },
  data() {
    return {
        employeeId: "",
        merchantStaffAddPage: false,
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
          width: 180,
          fixed: 'left',
          slot: "action",
        },
        {
          title: '编号',
          align: 'center',
          width: 140,
          key: 'employeeId',
        },
        {
          title: '关联商户',
          align: 'center',
          minWidth: 200,
          ellipsis: true,
            align: 'left',
          key: 'merchantNames',
            render: (h, params) => {
                return h('div', [
                    h('Tooltip', {
                        props: { placement: 'top' }
                    }, [
                        h('span', {
                            style: {
                                display: 'inline-block',
                                width: params.column._width*0.85+'px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            },
                        }, params.row.merchantNames),
                        h('span', {
                            slot: 'content',
                            style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                        },params.row.merchantNames)
                    ])
                ])
            }
          // render: (h, params) => {
          //   for (let i = 0; i < this.merchantList.length; i++) {
          //     if(params.row.merchantId == this.merchantList[i].merchantId) {
          //       return h('span', this.merchantList[i].name);
          //     }else{
          //       return h('span', params.row.merchantId);
          //     }
          //   }
          // }
        },
        {
          title: '名称',
          align: 'center',
          minWidth: 120,
          key: 'realName',
        },
        {
          title: '手机号',
          align: 'center',
          minWidth: 120,
          key: 'mobile',
        },
          {
              title: '角色类型',
              ellipsis: true,
              align: 'left',
              minWidth: 200,
              key: 'roles',
              render: (h, params) => {
                  return h('div', [
                      h('Tooltip', {
                          props: { placement: 'top' }
                      }, [
                          h('span', {
                              style: {
                                  display: 'inline-block',
                                  width: params.column._width*0.85+'px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                              },
                          }, params.row.roles),
                          h('span', {
                              slot: 'content',
                              style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                          },params.row.roles)
                      ])
                  ])
              }
          },
          {
              title: '状态',
              align: 'center',
              minWidth: 120,
              key: 'statusName',
          },
          {
              title: '来源',
              align: 'center',
              minWidth: 120,
              key: 'status',
          },
        {
          title: '员工岗位描述',
          align: 'center',
          minWidth: 120,
          key: 'postDesc',
        },
        {
          title: '员工微信号',
          align: 'center',
          minWidth: 120,
          key: 'wxAccount',
        },
        {
          title: '微信号二维码',
          align: 'center',
          minWidth: 120,
          key: 'wxQrcode',
          slot: "wxQrcode",
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
      addStaffDisplay: false, // 新增对话框显示
      // 新增表单
      formValidate:{
        merchantId: "",
        mobile: null,
        postDesc: "",
        profile: "",
        realName: "",
        serviceContent: "",
        wxAccount: "",
        wxQrcode: ""
      },
      // 上传二维码图片
      uploadList1:[],
      url: uploadOperationImage2AliOssURl,
      userToken: {}, //用户token
      editStaffDisplay: false, // 编辑对话框显示
      editEmployeeId: '', // 编辑员工编号
      //绑定/解绑
      banRemark:{
        employeeId: "",
        remark: "",
        type: "",
        title: "禁用"
      },
      unbindDisplay:false, // 解绑对话框显示
      wxQrcodeDisplay:false, // 查看二维码对话框显示
      wxQrcode_url:'', // 查看二维码路径
    }
  },

  created: function() {
    // console.log(this.merchantId);
    this.searchData.merchantId = this.merchantId
    this.formValidate.merchantId = this.merchantId
    this.getMerchantListFn()
    this.search()
    this.userToken = {
        jwttoken: localStorage.getItem("jwttoken")
      };
  },
  methods: {
      showMerchantStaffAddStatus(e) {
          this.merchantStaffAddPage = e;
          this.search();
      },

      addInfo() {
          this.setStore("pageStatus", "add");
          this.merchantStaffAddPage = true;
      },
      //编辑
      editInfo(item) {
          this.setStore("pageStatus", "edit");
          this.employeeId = item.employeeId;
          this.merchantStaffAddPage = true;
      },

    init() {},

// 搜索
    search() {
      this.current = 1;
      this.totalSize = 0;//总条数
      this.getStaffListFn(this.searchData)
      // this.pagingType = '2'
    },

// 重置
    reset() {
      this.searchData.realName =  ''
      this.searchData.mobile =  null
      this.pagingType = '1'
      this.search()
    },


// 获取商户列表
    getMerchantListFn() {
      getMerchantList().then(res => {
        if(res.code == 200) {
          this.merchantList = res.data.records
        }else {
          this.msgErr(res.msg)
        }
      })
    },

// 查询列表
    getStaffListFn(obj) {
      this.TableLoading = true;
      var status = obj.status;
      if (status == '-1'){
          status = null;
      }
        var reqParam = {
            status: status,
            merchantName: obj.merchantName,
            mobile: obj.mobile
        };
      getStaffList(reqParam, this.current).then(res => {
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

// 新增员工对话框
    // addStaff() {
    //   getMerchantList().then(res => {
    //     if(res.code == 200) {
    //       this.merchantList = res.data.records
    //       this.addStaffDisplay = true
    //     }else {
    //       this.msgErr(res.msg)
    //     }
    //   })
    // },

// 上传二维码
    handleSuccess2(res, file) {
        if (res.code == 200) {
          this.formValidate.wxQrcode = res.image_url;

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

// 上传二维码超过1M提示
    handleMaxSize(){
      this.msgErr('上传图片不能超过1MB,请重新上传')
    },

// 上传二维码格式不对
    formatError() {
      this.msgErr('只能上传jpg,jpeg,png,bmp格式,请重新上传')
    },

// 新增员工
    addStaffFn() {
      // 验证
      if (!this.ruleValidate()) {
        return;
      }
      // console.log(this.formValidate);
      // return
      addStaff(this.formValidate).then(res => {
        if(res.code == 200) {
          // console.log(res);
          this.msgOk('新增成功')
          this.search()
          this.cancel()
        }else {
          this.msgErr(res.msg)
        }
      })
    },


// 关闭对话框
    cancel() {
      this.editEmployeeId = ''
      // this.formValidate.merchantId = ""
      this.formValidate.mobile = null
      this.formValidate.postDesc = ""
      this.formValidate.profile = ""
      this.formValidate.realName = ""
      this.formValidate.serviceContent = ""
      this.formValidate.wxAccount = ""
      this.formValidate.wxQrcode = ""
      this.addStaffDisplay = false;
      this.editStaffDisplay = false;
    },

// 禁用、解禁弹框
    inputUnbinding(row) {
      this.banRemark.employeeId = row.employeeId;
      this.banRemark.remark = "";
      this.banRemark.status = row.status;
        if(row.remark){
            this.data1 = JSON.parse(row.remark);
        }else {
            this.data1 = [];
        }
        if (this.banRemark.status == '0'){
            this.banRemark.title = "禁用";
        }else if (this.banRemark.status == '1'){
            this.banRemark.title = "解禁";
        }
        this.unbindDisplay = true;
    },

// 禁用、解禁保存
    ban(){
          console.info(this.banRemark)
      var errMsg = "";
      if (this.banRemark.status == '0'){
          errMsg = "禁用";
      }else if (this.banRemark.status == '1'){
          errMsg = "解禁";
      }
      if(this.banRemark.remark.trim() == ""){
        this.msgErr(errMsg + '原因不能为空');
        return;
      }
      var reqParam = {
          employeeId: this.banRemark.employeeId,
          remark: this.banRemark.remark.trim(),
          status: this.banRemark.status
      };
        postRequest("/merchant/merchantEmployee/ban",
            reqParam
        ).then(res => {
            if(res.code == 200){
                this.msgOk(errMsg + '成功')
                this.unbindDisplay = false
                this.search()
            }else {
                this.msgErr(res.msg)
            }
        });
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
        this.getStaffListFn(this.searchData);
      // }
    },

// 查看二位码
    wxQrcodeLook(url) {
      this.wxQrcode_url = url
      this.wxQrcodeDisplay = true
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

// 验证
      ruleValidate(){
        // if(this.formValidate.merchantId == ''){
        //   this.msgErr('所属商家还没选择')
        //   return
        // }
        if(this.formValidate.realName == ''){
          this.msgErr('员工名称不能为空')
          return
        }
        if(this.formValidate.mobile == null){
          this.msgErr('员工电话不能为空')
          return
        }
        var phone = /^[1][3,4,5,7,8][0-9]{9}$/;
        if(!phone.test(this.formValidate.mobile)){
          this.msgErr('请输入常规手机号')
          return
        }
        if(this.formValidate.wxAccount == ''){
          this.msgErr('员工微信号不能为空')
          return
        }
        // var wx = /[\W]/g
        // if(wx.test(this.formValidate.wxAccount)){
        //   this.msgErr('员工微信号不能输入中文')
        //   return
        // }
        if(this.formValidate.wxQrcode == ''){
          this.msgErr('员工微信号二维码没有上传')
          return
        }
        if(this.formValidate.postDesc == ''){
          this.msgErr('员工岗位不能为空')
          return
        }
        if(this.formValidate.profile == ''){
          this.msgErr('员工一句话描述不能为空')
          return
        }
        if(this.formValidate.serviceContent == ''){
          this.msgErr('员工服务内容不能为空')
          return
        }
        return true
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

    //返回列表
      back() {
        this.$emit("changeStatus", false);
      },
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
  .ivu-table-wrapper{
    overflow: visible;
  }
</style>
