<template>
  <div class="merchant-add">
    <Card>
      <Button type="dashed" icon="md-arrow-round-back" @click="goback">返回列表</Button>

      <Alert
        show-icon
        v-if="pageStatus == 'edit'"
        style="margin-left: 200px; width: 600px; margin-top: 10px"
      >
        员工id :
        <span style="color:red">{{packageId}}</span>
        <span slot="desc"></span>
      </Alert>
      <Row style="margin-left:1em;">
        <Row class="box flex-ac">
          <Col span="5" class="left-text">
            <span style="color:red">*</span>商户类型
          </Col>
          <Col span="15">
            <RadioGroup v-model="add_info.merchantType">
              <Radio :label="1" :disabled="pageStatus === 'read'">本地商户（单店）</Radio>
              <Radio :label="2" :disabled="pageStatus === 'read'">本地商户（多店）</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="box">
          <Col span="5" class="left-text">
            <span style="color:red">*</span>所属{{currentTitle}}
          </Col>
          <Col span="15">
            <Button @click="addMerchantList" style="width: 150px" :disabled="disabled2">点击选择所属{{currentTitle}}</Button>
            <Alert
              v-if="this.chooseMerchant.merchantId != '' && selectIsConfirm"
              type="success"
              show-icon
              style="width: 300px;margin-top: 15px"
            >
              <div>{{currentTitle}}名称：{{this.chooseMerchant.name}}</div>
              <div style="margin-top: 5px">{{currentTitle}}编号：{{this.chooseMerchant.merchantId}}</div>
            </Alert>
            <Alert
              v-if="this.chooseMerchant.merchantId == ''"
              type="error"
              show-icon
              style="width: 300px;margin-top: 15px"
            >
              <div>请选择所属{{currentTitle}}！只能选择一个哦！</div>
              <div></div>
            </Alert>
          </Col>
        </Row>
        <Row class="box" v-if="add_info.merchantType === 2">
          <Col span="5" class="left-text">
            <span style="color:red">*</span>商户列表
          </Col>
          <!-- <Col span="3" class="pdt-5">
          </Col> -->
          <Col span="6">
            <div>
              已选：{{listByBrand.length}} / {{listByBrand.length + listByBrandTrash.length}}
            </div>
            <div class="merchant-list">
              <div class="merchant-list-item" v-for="(item,i) in listByBrand" :key="'merchantaddL59' + i">
                {{item.name}}
                <Button class="select-btn" @click="delOne(i)" :disabled="pageStatus === 'read'">移出</Button>
              </div>
              <div class="yyh-nodata pdt-5">
                暂未选择任何商户
              </div>
            </div>
          </Col>
          <Col span="6" class="mgl-2">
            <div>已移出{{listByBrandTrash.length}}</div>
            <div class="merchant-list" v-show="listByBrandTrash.length > 0">
              <div class="merchant-list-item" v-for="(item,i) in listByBrandTrash" :key="'merchantaddL59' + i">
                {{item.name}}
                <Button class="select-btn" @click="addOne(i)" :disabled="pageStatus === 'read'">增加</Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row class="box">
          <Col span="5" class="left-text">
            <span style="color:red">*</span>套餐
          </Col>
          <Col span="5">
            <Select v-model="add_info.serviceCode" style="width:150px" :disabled="disabled2">
              <Option
                v-for="(item,index) in servicelist"
                :key="index"
                :value="item.serviceCode"
                :disabled="pageStatus === 'read'"
              >{{item.serviceName}}</Option>
            </Select>
          </Col>
        </Row>

        <Row class="box">
          <Col span="5" class="left-text">
            <span style="color:red">*</span>推送客户数上限
          </Col>
          <Col span="10">
            <InputNumber
              placeholder="请输入正整数，比如1"
              v-model="add_info.pushCustomerNum"
              style="width:200px"
              :max="10000"
              :min="1"
              @keyup.native="changeNumber"
              :disabled="disabled2 == true"
            />人/天
          </Col>
        </Row>

        <Row class="box">
          <Col span="5" class="left-text">
            <span style="color:red">*</span>套餐有效期
          </Col>
          <Col span="16">
            <DatePicker
              type="date"
              placeholder="请选择"
              style="width: 150px"
              format="yyyy-MM-dd"
              @on-change="time1"
              :value="add_info.startDate"
              :disabled="disabled2"
            ></DatePicker>
            <DatePicker
              class="mgl-10"
              type="date"
              placeholder="请选择"
              style="width: 150px"
              format="yyyy-MM-dd"
              @on-change="time2"
              :value="add_info.endDate"
              :disabled="disabled2"
            ></DatePicker>
          </Col>
        </Row>
        <Row class="box">
          <Col span="5" class="left-text">
            <span style="color:red">*</span>应收款
          </Col>
          <Col span="5">
            <InputNumber
              placeholder="请输入正整数，比如1"
              v-model="add_info.receivables"
              style="width:200px"
              :max="999999"
              :min="0"
              :disabled="disabled2"
            />
          </Col>
        </Row>

        <Row class="box">
          <Col span="5" class="left-text">
            <span style="color:red">*</span>合同号
          </Col>
          <Col span="16">
            <Tooltip trigger="focus" title="提醒" content="最多输入30个汉字" placement="right">
              <Input
                v-model="add_info.contractNumber"
                :maxlength="30"
                style="width:200px"
                placeholder="请输入合同号"
                clearable
                :disabled="disabled2"
              />
            </Tooltip>
          </Col>
        </Row>

        <Row class="box">
          <Col span="5" class="left-text">
            <span style="color:red">*</span>签单销售
          </Col>
          <Col span="16">
            <Tooltip trigger="focus" title="提醒" content="最多输入10个汉字" placement="right">
              <Input
                v-model="add_info.biller"
                :maxlength="10"
                style="width:200px"
                placeholder="请输入签单销售"
                clearable
                :disabled="disabled2"
              />
            </Tooltip>
          </Col>
        </Row>

        <Row class="box">
          <Col span="5" class="left-text">备注</Col>
          <Col span="16">
            <Tooltip trigger="focus" title="提醒" content="最多输入500个字符" placement="right">
              <Input
                type="textarea"
                style="width:400px"
                v-model="add_info.remark"
                placeholder="500个字符以内"
                clearable
                :rows="3"
              />
            </Tooltip>
          </Col>
        </Row>

        <Row class="box flex-ac">
          <Col span="5" class="left-text">
            <span style="color:red">*</span>收费条目
          </Col>
          <Col span="2">
            <Button type="primary" icon="md-add-circle" size="small" :disabled="disabled2" @click="compatible_addInfo">新增</Button>
          </Col>
        </Row>

        <Alert class="merchant-alert" v-if="compatibleList.length>0">
          <Row class="box" v-for="(item, index) in compatibleList" :key="index">
            <!-- <Col span="2" class="left-text"></Col> -->

            <Col span="24" class="flex alert-content">
              <Select v-model="item.paymentMode" style="width:100px" placeholder="支付方式">
                <Option v-for="item in payTypeList" :value="item.id" :key="item.id" :disabled="disabled2">{{ item.name }}</Option>
              </Select>
              <InputNumber
                placeholder="实际收款金额"
                :disabled="disabled2"
                v-model="item.actualAmount"
                style="width:120px"
                :max="99999999"
                :min="0"
              />
              <Input
                v-model="item.payee"
                :disabled="disabled2"
                :maxlength="10"
                style="width:100px"
                placeholder="收款人"
                clearable
              />
              <DatePicker
                type="date"
                placeholder="请填写收款日期"
                :disabled="disabled2"
                style="width: 150px"
                v-model="item.receivedDate"
              ></DatePicker>
              <Input
                v-model="item.serialNumber"
                :disabled="disabled2"
                :maxlength="20"
                style="width:150px"
                placeholder="请填写流水号"
                clearable
              />
              <Button
                type="error"
                icon="md-trash"
                size="small"
                style="margin-left: 5px"
                :disabled="disabled2"
                @click="compatible_delInfo(index,item)"
              ></Button>
            </Col>
          </Row>
        </Alert>

        <Row style="margin-top:54px" v-show="pageStatus !== 'read'">
          <Button
            type="info"
            @click="goback"
            style="width:240px;margin-right: 20px; float: left;"
          >取&nbsp;&nbsp;&nbsp;消</Button>
          <Button
            type="primary"
            :loading="edit_loading"
            style="width:240px; float: left;"
            @click="addPackage"
            :disabled="isCheckDisabled"
          >保存</Button>
        </Row>
      </Row>
    </Card>

    <Modal
      v-model="merchantTabDisplay"
      :title="add_info.merchantType === 2? '品牌列表': '商户列表'"
      width="800"
      footer-hide
      :mask-closable="false"
    >
      <div>
        <row>
          <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
            <FormItem :label="currentTitle + '编号'">
              <Input
                type="text"
                v-model="searchItem.merchantId"
                clearable
                :placeholder="`请输入${currentTitle}编号`"
                style="width: 150px"
              />
            </FormItem>
            <FormItem :label="currentTitle+'名称'">
              <Input
                type="text"
                v-model="searchItem.name"
                clearable
                :placeholder="`请输入${currentTitle}名称`"
                style="width: 150px"
              />
            </FormItem>
            <FormItem style label="所在地区" v-show="add_info.merchantType == 1">
              <Select
                v-model="searchItem.provinceId"
                style="width:150px"
                clearable
                @on-change="getcitylist"
              >
                <Option
                  v-for="(item,index) in provincelist"
                  :key="index"
                  :value="item.provinceCode"
                >{{item.provinceName}}</Option>
              </Select>
              <Select
                v-model="searchItem.cityId"
                style="width:150px"
                clearable
                @on-change="getarealist"
              >
                <Option
                  v-for="(item,index) in citylist"
                  :key="index"
                  :value="item.cityCode"
                >{{item.cityName}}</Option>
              </Select>
              <Select v-model="searchItem.areaId" style="width:150px" clearable>
                <Option
                  v-for="(item,index) in arealist"
                  :key="index"
                  :value="item.areaCode"
                >{{item.areaName}}</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-left:-35px;" class="br">
              <Button @click="search" type="primary" icon="ios-search">搜索</Button>
              <Button @click="refresh">重置</Button>
            </FormItem>
          </Form>
        </row>
        
        <!-- 品牌列表 -->
        <Table
          v-if="add_info.merchantType === 2"
          border
          width="100%"
          :columns="columnsBrand"
          :data="merchantList"
          :loading="TableLoading"
        >
        </Table>

        <!-- 商户列表 -->
        <Table
          v-else
          ref="selection"
          border
          width="100%"
          :columns="columnsMerchant"
          :data="merchantList"
          :loading="TableLoading"
        >
        </Table>
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
      </div>

      <Row style="margin-left:350px; margin-top: 30px">
        <Button style="margin-right: 20px" @click="cancel">取消</Button>
        <Button type="primary" @click="selectMerchant">确定</Button>
      </Row>
    </Modal>
  </div>
</template>
<script>
import { getMerchantList, addStaff, editStaff } from "@/api/sys";
import {
  getRequest,
  postRequest,
  postJson,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from "@/libs/axios";
import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
import { formatDate, checkImageWH, checkImage, uniqueArray } from "@/libs/date";

export default {
  name: "merchant-customer-add",
  props: {
    packageId: String
  },
  data() {
    return {
      listByBrandTrash: [],
      listByBrand: [],
      selectIsConfirm: false,
      userToken: {}, //用户token
      disabled2: false,
      payTypeList: [
        {
          id: "1",
          name: "现金"
        },
        {
          id: "2",
          name: "微信"
        },
        {
          id: "3",
          name: "支付宝"
        },
        {
          id: "4",
          name: "银行卡"
        }
      ],
      servicelist: [
        {
          serviceCode: "merchant_customer",
          serviceName: "精准拓客"
        },
        {
          serviceCode: "merchant_platform",
          serviceName: "平台拓客"
        }
      ],
      // 权益订购 增加
      add_info: {
        // 商户类型 - 1.5.4.1
        remark: "",
        serviceCode: "merchant_customer",
        serviceName: "精准拓客",
        pushCustomerNum: null,
        startDate: "",
        endDate: "",
        receivables: null,
        biller: "",
        contractNumber: "",
        // 商户类型 1单店 2品牌（多店
        merchantType: "",
        id: ""
      },
      edit_loading: false,
      isCheckDisabled: false,
      bsUploadList: [],
      url: uploadOperationImage2AliOssURl,
      roleList: [],
      pageStatus: "",
      merchantTabDisplay: false, // 商户选择框显示
      userInfoDisplay: false, //用户选择显示框
      checkResult: 0,
      checkMsg: "",
      chooseMerchant: {
        merchantId: "",
        name: ""
      },
      userList: [],
      avatarUrl_url: "", // 查看二维码路径
      avatarUrlDisplay: false, // 查看二维码对话框显示
      currentChooseID: "",
      columnsMerchant: [
        {
          title: "选择",
          key: "chooseMerchantId",
          width: 70,
          slot: 'check',
          align: "center",
          render: (h, params) => {
            let merchantId = params.row.merchantId;
            let name = params.row.name;
            let flag = false;
            if (this.chooseMerchant.merchantId === merchantId) {
              flag = true;
            } else {
              flag = false;
            }
            let self = this;
            return h("div", [
              h("Radio", {
                props: {
                  value: flag
                },
                on: {
                  "on-change": () => {
                    self.chooseMerchant.merchantId = merchantId;
                    self.chooseMerchant.name = name;
                  }
                }
              })
            ]);
          }
        },
        {
          title: "商户编号",
          align: "center",
          minWidth: 160,
          key: "merchantId"
        },
        {
          title: "商户名称",
          align: "center",
          width: 230,
          key: "name"
        },
        {
          title: "地址",
          align: "center",
          width: 340,
          key: "address",
          render: (h, params) => {
            let address =
              params.row.province +
              params.row.city +
              params.row.district +
              params.row.address;
            return h("span", address);
          }
        }
      ],
      columnsBrand: [
        {
          title: "选择",
          key: "chooseMerchantId",
          width: 70,
          slot: 'check',
          align: "center",
          render: (h, params) => {
            let id = params.row.id;
            let name = params.row.name;
            let flag = false;
            if (this.chooseMerchant.merchantId === id) {
              flag = true;
            } else {
              flag = false;
            }
            let self = this;
            return h("div", [
              h("Radio", {
                props: {
                  value: flag
                },
                on: {
                  "on-change": () => {
                    self.chooseMerchant.merchantId = id;
                    self.chooseMerchant.name = name;
                    // 品牌等级
                    self.chooseMerchant.brandLevel = params.row.brandLevel
                  }
                }
              })
            ]);
          }
        },
        // {
        //   title: "编号",
        //   align: "center",
        //   minWidth: 160,
        //   key: "id"
        // },
        {
          title: "品牌名称",
          align: "center",
          // width: 230,
          key: "name"
        }
      ],
      merchantList: [],
      current: 1,
      totalSize: 0, //总条数
      pageNum: 1, //开始条数
      TableLoading: false,
      searchItem: {
        merchantId: "",
        name: "",
        provinceId: "",
        cityId: "",
        areaId: ""
      },
      provincelist: [],
      citylist: [],
      arealist: [],
      selectedMerchantList: [], //选中的商户列表
      compatibleList: [], //收款明细
      deleteChargesList: []
    };
  },
  computed: {
    currentTitle() {
      let _title = "商户";
      if (this.add_info.merchantType === 2) {
        _title = '品牌';
      }
      return _title
    }
  },
  created: function() {
    this.userToken = {
      jwttoken: localStorage.getItem("jwttoken")
    };
  },
  methods: {
    addOne(i) {
      this.listByBrand.push(...this.listByBrandTrash.splice(i, 1));
    },
    delOne(i) {
      this.listByBrandTrash.push(...this.listByBrand.splice(i, 1));
    },
    // 增加兼容品牌
    compatible_addInfo() {
      this.compatibleList.push({
        id: "",
        paymentMode: "",
        actualAmount: null,
        payee: "",
        receivedDate: "",
        serialNumber: ""
      });
    },

    // 删除兼容品牌
    compatible_delInfo(index, item) {
      if (item.id != "") {
        this.deleteChargesList.push(item.id);
      }
      this.compatibleList.splice(index, 1);
    },
    time1(e) {
      this.add_info.startDate = e;
    },
    time2(e) {
      this.add_info.endDate = e;
    },
    time3(e, index) {},
    //获取省份信息数据
    getprovincelist() {
      postRequest("/system/area/province/list").then(res => {
        if (res.code == 200) {
          this.provincelist = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //根据省份code获取城市信息数据
    getcitylist() {
      getRequest("/system/area/city/" + this.searchItem.provinceId).then(
        res => {
          if (res.code == 200) {
            this.citylist = res.data;
            this.searchItem.areaId = "";
          } else {
            this.$Message.error(res.msg);
          }
        }
      );
    },
    //根据城市code获取区县信息数据
    getarealist() {
      getRequest("/system/area/district/" + this.searchItem.cityId).then(
        res => {
          if (res.code == 200) {
            this.arealist = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        }
      );
    },

    // 查看二维码
    avatarUrlLook(url) {
      this.avatarUrl_url = url;
      this.avatarUrlDisplay = true;
    },

    goback() {
      this.$emit("changeStatus", false);
    },

    //上传微信二维码
    bsHandleSuccess(res, file) {
      if (res.code == 200) {
        this.add_info.wxQrcode = res.image_url;
        if (this.bsUploadList.length == 0) {
          let obj = {
            url: res.image_url
          };
          this.bsUploadList.push(obj);
        } else {
          this.bsUploadList[0].url = res.image_url;
        }
        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
    },

    handleMaxSize(file) {
      this.$Message.error("图片不大于1M");
    },

    formatError() {
      this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传");
    },

    handleBeforeUpload(file) {
      return checkImage(file);
    },

    //查询所有角色列表
    getRoleList() {
      postRequest("/merchant/MerchantRoleInfo/all").then(res => {
        if (res.code == 200) {
          this.roleList = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    init() {
      this.pageStatus = this.getStore("pageStatus");
      this.getRoleList();
      this.getprovincelist();
      this.getPackageInfo();

      console.info(this.pageStatus);
      if (this.pageStatus == "edit1") {
      } else if (this.pageStatus == "edit2" || this.pageStatus === 'read') {
        this.disabled2 = true;
      }
    },

    // 关闭商户选择框
    cancel() {
      this.chooseMerchant = {
        brandLevel: '',
        merchantId: "",
        name: ""
      };
      this.merchantTabDisplay = false;
      this.userInfoDisplay = false;
    },

    //弹出商户选择框
    addMerchantList() {
      this.merchantTabDisplay = true;
      (this.selectedMerchantList = []), this.getMerchantListFn();
    },

    search() {
      this.current = 1;
      this.totalSize = 0; //总条数
      this.pageNum = 1; //开始条数
      this.getMerchantListFn();
    },

    // 获取商户列表
    getMerchantListFn() {
      this.TableLoading = false;
      
      let reqParams = {
        merchantId: this.searchItem.merchantId,
        name: this.searchItem.name,
        // provinceCode: this.searchItem.provinceId,
        // cityCode: this.searchItem.cityId,
        // areaCode: this.searchItem.areaId
      };
      if (this.add_info.merchantType == 1) {
        reqParams = {
          merchantId: this.searchItem.merchantId,
          name: this.searchItem.name,
          provinceCode: this.searchItem.provinceId,
          cityCode: this.searchItem.cityId,
          areaCode: this.searchItem.areaId
        }
      }
      // 接口：       商户列表-单个,                 商户列表-单个,                   商户列表-多个（品牌）
      const urls = ['/merchant/merchantInfo/list', '/merchant/merchantInfo/list', '/merchant/brandMain/list/data'];
      let host = baseUrl;
      // if (this.add_info.merchantType === 2){
      //   delete reqParams.name
      // }
      postJson(
        host + urls[Number(this.add_info.merchantType)] + `?isAsc=DESC&orderByColumn=1&pageSize=10&pageNum=${this.pageNum}`,
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.totalSize = res.data.total;
          this.merchantList = res.data.records;
        } else {
          this.msgErr(res.msg);
        }
        this.TableLoading = false;
      });
    },

    //确定选择商户
    selectMerchant() {
      this.selectIsConfirm = true;
      // return;
      if (
        this.chooseMerchant.merchantId &&
        this.chooseMerchant.merchantId != ""
      ) {
        this.merchantTabDisplay = false;
        if (this.add_info.merchantType === 2) {
          this.getMerchantByBrand();
        }
      } else {
        this.msgErr("至少选一个商户");
      }
    },
    // 新增权益时 根据品牌选商户
    getMerchantByBrand() {
      // /merchant/merchantBrand/list/merchant 查询品牌下的商户
      let host = baseUrl;
      if (process.env.NODE_ENV !== 'development') {
        this.listByBrand = [];
      }
      let params = {brandId: this.chooseMerchant.merchantId, brandLevel: this.chooseMerchant.brandLevel};
      postJson(host + "/merchant/merchantBrand/list/merchant", params).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.listByBrand = res.data;
          if (res.data.length < 1) {
            this.msgErr("未获取到该品牌下门店，（您可以去添加或与我们联系）");
          }
        } else {
          this.msgErr(res.msg);
        }
      }).catch(err=>{
        console.log(err, 'operating_merchant/merchant-customer/merchant-customer-add, Line929')
      });
    },
    //重置商户搜索条件
    refresh() {
      // this.updateTableList(this.params);
      this.searchItem.merchantId = "";
      this.searchItem.name = "";
      this.searchItem.provinceId = "";
      this.searchItem.cityId = "";
      this.searchItem.areaId = "";
      this.updateTableList();
    },

    //分页
    changeCurrent(current) {
      this.pageNum = current;
      this.getMerchantListFn();
    },

    clearOpenid() {
      this.add_info.userId = "";
      this.checkResult = 0;
    },

    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3
      });
    },

    // 新增
    addPackage() {
      // 验证
      if (!this.ruleValidate()) {
        return;
      }
      let reqParam = this.add_info;
      var serviceChargesList = [];
      if (this.add_info.merchantType === 2 && this.listByBrand.length < 1) {
        this.msgErr('至少选择一个商户');
        return;
      }
      for (let obj of this.compatibleList) {
        let paymentMode = obj.paymentMode;
        if (paymentMode == "") {
          this.msgErr("请填写支付方式");
          return;
        }
        let actualAmount = obj.actualAmount;
        if (actualAmount == null) {
          this.msgErr("请填写实际收款金额");
          return;
        }
        let payee = obj.payee;
        if (payee == "") {
          this.msgErr("请填写收款人");
          return;
        }

        let receivedDate = obj.receivedDate;
        if (receivedDate == "") {
          this.msgErr("请填写收款日期");
          return;
        }

        let serialNumber = obj.serialNumber;
        if (serialNumber == "") {
          this.msgErr("请填写流水号");
          return;
        }

        obj.receivedDate = formatDate(new Date(obj.receivedDate), "yyyy-MM-dd");
        serviceChargesList.push(obj);
      }
      reqParam.serviceChargesList = serviceChargesList;
      reqParam.merchantId = this.chooseMerchant.merchantId;
      reqParam.deleteChargesList = this.deleteChargesList;
      var msg = "新增";
      if (this.pageStatus == "edit") {
        msg = "编辑";
      }
      this.edit_loading = true;
      this.isCheckDisabled = true;
      console.info(JSON.stringify(reqParam));
      // 参数结构
      // let params = {
      //   // 签单销售
      //   "biller": "qiandan222",
      //   // 品牌ID 选择的是单店则不需要此字段
      //   brandId: '',
      //   // 
      //   // "merchantId": "2019082253207", 去掉了？ ！！！！！！！！！！！！
      //   // 商户id集合
      //   merchantIdList: [],
      //   // 合同号
      //   "contractNumber": "hetonghao1",
      //   // 有效期start - end
      //   "startDate": "2019-09-03",
      //   "endDate": "2019-09-10",
      //   "id": "",
      //   // 商户类型 1: 单店、2: 多店
      //   "merchantType": '',
      //   // 推送人数上限
      //   "pushCustomerNum": 1,
      //   // 应收款额
      //   "receivables": 1,
      //   // 备注
      //   "remark": "备注",
      //   // 收款条目
      //   "serviceChargesList": [
      //     {
      //       "id": "",
      //       // 支付方式
      //       "paymentMode": "3",
      //       // 实际收款金额
      //       "actualAmount": 1,
      //       // 收款人
      //       "payee": "2",
      //       // 收款日期
      //       "receivedDate": "2019-09-03",
      //       // 流水号
      //       "serialNumber": "test001"
      //     }
      //   ],
      //   // 套餐类型 string
      //   "serviceCode": "merchant_customer",
      //   // "serviceName": "精准拓客",
      //   // "deleteChargesList": []
      // }
      if (this.add_info.merchantType === 2) {
        reqParam.brandId = reqParam.merchantId;
        reqParam.merchantIdList = this.listByBrand.map(el=>{
          return {id: el.merchantId}
        })
      } else {
        reqParam.merchantIdList = [{id: reqParam.merchantId}];
      }
      delete reqParam.merchantId;
      delete reqParam.serviceName;
      delete reqParam.deleteChargesList;
      let host = baseUrl;
      if (msg === '新增') {
        delete reqParam.id
      }
      postJson(host + "/merchant/merchantPackageInfo/add", reqParam).then(res => {
        if (res.code == 200) {
          console.log(msg);
          this.msgOk(msg + "成功");
          this.goback();
        } else {
          this.msgErr(res.msg);
        }
        this.edit_loading = false;
        this.isCheckDisabled = false;
      });
    },

    getPackageInfo() {
      if (this.pageStatus != "add" && this.packageId) {
        postRequest(
          "/merchant/merchantPackageInfo/selectById?id=" + this.packageId
        ).then(res => {
          if (res.code == 200) {
            this.add_info = {
              merchantType: res.data.merchantType,
              serviceCode: "merchant_customer",
              serviceName: "精准拓客",
              pushCustomerNum: parseInt(res.data.pushCustomerNum),
              startDate: res.data.startDate,
              endDate: res.data.endDate,
              receivables: parseInt(res.data.receivables),
              biller: res.data.biller,
              contractNumber: res.data.contractNumber,
              id: res.data.id,
              remark: res.data.remark
            };
            this.chooseMerchant = {
              merchantId: res.data.merchantId,
              name: res.data.merchantName
            };
            this.compatibleList = res.data.serviceChargesList;
            this.listByBrand = res.data.merchantIdList;
            if (this.add_info.merchantType === 2) {
              // brandId merchantName
              this.this.chooseMerchant.name = res.data.merchantName;
              this.this.chooseMerchant.merchantId = res.data.brandId;
            }
            console.info(JSON.stringify(this.add_info));
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
    },

    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3
      });
    },
    // 验证
    ruleValidate() {
      if (this.add_info.merchantType === "") {
        this.msgErr("请选择商户类型");
        return;
      }
      if (this.chooseMerchant.merchantId == "") {
        this.msgErr(`所属${this.currentTitle}不能为空`);
        return;
      }
      if (this.add_info.serviceCode == "") {
        this.msgErr("套餐不能为空");
        return;
      }
      if (this.add_info.pushCustomerNum == "") {
        this.msgErr("推送客户数上限不能为空");
        return;
      }
      if (this.add_info.startDate == "" || this.add_info.endDate == "") {
        this.msgErr("套餐有效期不能为空");
        return;
      }
      if (this.add_info.biller == "") {
        this.msgErr("签单销售不能为空");
        return;
      }
      if (this.compatibleList.length < 1) {
        this.msgErr("请至少添加一个收费条目");
        return;
      }
      return true;
    },
    //过滤小数点
    changeNumber() {
      let str = "" + this.add_info.pushCustomerNum;
      if (str.indexOf(".") != -1) {
        let arr = str.split("");
        arr.splice(arr.length - 1);
        let str2 = arr.join("");
        this.operation_data.sort = +str2;
        this.msgErr("只能输入整数");
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
.form > div {
  display: inline-block;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.left-text {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 12px;
  color: #515a6e;
  line-height: 1;
  padding: 10px 12px 10px 0;
  box-sizing: border-box;
}
.box {
  margin-bottom: 20px;
}
.flex-ac{
  display: flex;
  align-items: center;
}
.merchant-add .merchant-alert{
  padding: 8px 16px;
  max-width: 760px;
  margin: 0 auto;
}
.alert-content{
  justify-content: space-between;
}
.merchant-list{
  max-height: 180px;
  overflow: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px 10px;
}
.merchant-list-item {
  margin-top: 4px;
  padding-bottom: 4px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}
.merchant-list .select-btn{
  padding: .2em .5em;
}
</style>
