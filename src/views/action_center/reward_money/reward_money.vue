<template>
  <div>
    <Card>
      奖励金设置
      <div style="margin-top: 15px;">



  <Row class="box">
                   
       <Col span="4" class="left-text"> <span style="color:red">*</span> 新人注册奖励</Col>
                     
                         <Col span="8"   >
                           <InputNumber
                            type="text"
                            v-model="addData.registerMoney"
                            placeholder="请输入"
                            style="width:250px"
                            :max="9999"
                            :min="0.1"
                            :disabled="!buttonProhibit"
                          />&nbsp;&nbsp;元
                        <div style="display: inline-block;margin-left:20px" v-if="!buttonProhibit">
                          <Button size="small" @click="logDetailsFn('registerMoney')">查看日志</Button>
                          <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('registerMoney')">编辑日志</Button>
                        </div>
                       </Col>


          <Col span="4" class="left-text"> <span style="color:red">*</span> 单日提现金额上限</Col>
                     
                         <Col span="8"   >
                  <InputNumber
                  type="text"
                  v-model="addData.dailyCashLimit"
                  placeholder="请输入"
                  style="width:250px"
                  :max="9999"
                  :min="0.1"
                  :disabled="!buttonProhibit"
                />&nbsp;&nbsp;元
                <div style="display: inline-block;margin-left:20px" v-if="!buttonProhibit">
                  <Button size="small" @click="logDetailsFn('dailyCashLimit')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('dailyCashLimit')">编辑日志</Button>
                </div>
                       </Col>
 

               
 </Row>


   <Row class="box">
      <Col span="4" class="left-text"> <span style="color:red">*</span> 新人首次领券奖励</Col>
                     
                  <Col span="8"   >
                       <InputNumber
                        type="text"
                        v-model="addData.receiveCouponMoney"
                        placeholder="请输入"
                        style="width:250px"
                        :max="9999"
                        :min="0.1"
                        :disabled="!buttonProhibit"
                      />&nbsp;&nbsp;元
                      <div style="display: inline-block;margin-left:20px" v-if="!buttonProhibit">
                        <Button size="small" @click="logDetailsFn('receiveCouponMoney')">查看日志</Button>
                        <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('receiveCouponMoney')">编辑日志</Button>
                      </div>
                       </Col>

           <Col span="4" class="left-text"> <span style="color:red">*</span> 单日奖励好友数上限</Col>
                     
                  <Col span="8"   >
                  <InputNumber
                  type="text"
                  v-model="addData.dailyRakeBackLimit"
                  placeholder="请输入"
                  style="width:250px"
                  :max="9999"
                  :min="0.1"
                  :disabled="!buttonProhibit"
                />&nbsp;&nbsp;个
                <div style="display: inline-block;margin-left:20px" v-if="!buttonProhibit">
                  <Button size="small" @click="logDetailsFn('dailyRakeBackLimit')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('dailyRakeBackLimit')">编辑日志</Button>
                </div>
                       </Col>   
 </Row>
           

    <Row class="box">
                 
             <Col span="4" class="left-text"> <span style="color:red">*</span> 新人首次核销奖励</Col>
                     
                <Col span="8"   >
                    <InputNumber
                  type="text"
                  v-model="addData.useCouponMoney"
                  placeholder="请输入"
                  style="width:250px"
                  :max="9999"
                  :min="1"
                  :disabled="!buttonProhibit"
                />&nbsp;&nbsp;元
                <div style="display: inline-block;margin-left:20px" v-if="!buttonProhibit">
                  <Button size="small" @click="logDetailsFn('useCouponMoney')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('useCouponMoney')">编辑日志</Button>
                </div>
                       </Col>
               <Col span="4" class="left-text"> <span style="color:red">*</span> 提现最低金额</Col>
                     
                 <Col span="8"   >
                 <InputNumber
                  type="text"
                  v-model="addData.minCashLimit"
                  placeholder="请输入"
                  style="width:250px"
                  :max="9999"
                  :min="0.1"
                  :disabled="!buttonProhibit"
                />&nbsp;&nbsp;元
                <div style="display: inline-block;margin-left:20px" v-if="!buttonProhibit">
                  <Button size="small" @click="logDetailsFn('minCashLimit')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('minCashLimit')">编辑日志</Button>
                </div>
                       </Col>
 
 </Row>


    <Row class="box">
         
       <Col span="4" class="left-text"> <span style="color:red">*</span> 邀请者注册奖励</Col>
                     
                         <Col span="8"   >
                            <InputNumber
                  type="text"
                  v-model="addData.inviteRegisterMoney"
                  placeholder="请输入"
                  style="width:250px"
                  :max="9999"
                  :min="0.1"
                  :disabled="!buttonProhibit"
                />&nbsp;&nbsp;元
                <div style="display: inline-block;margin-left:20px" v-if="!buttonProhibit">
                  <Button size="small" @click="logDetailsFn('inviteRegisterMoney')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('inviteRegisterMoney')">编辑日志</Button>
                </div>
                       </Col>      
 
 
                  <Col span="4" class="left-text"> <span style="color:red">*</span> 邀请者好友首次领券奖励</Col>
                     
                  <Col span="8"   >
                    <InputNumber
                  type="text"
                  v-model="addData.inviteReceiveCouponMoney"
                  placeholder="请输入"
                  style="width:250px"
                  :max="9999"
                  :min="0.1"
                  :disabled="!buttonProhibit"
                />&nbsp;&nbsp;元
                <div style="display: inline-block;margin-left:20px" v-if="!buttonProhibit">
                  <Button size="small" @click="logDetailsFn('inviteReceiveCouponMoney')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('inviteReceiveCouponMoney')">编辑日志</Button>
                </div>
                       </Col>
           
 </Row>


  <Row class="box">


     <Col span="4" class="left-text"> <span style="color:red">*</span> 邀请者首次核销奖励</Col>
                     
                         <Col span="8"   >
                     <InputNumber
                  type="text"
                  v-model="addData.inviteUseCouponMoney"
                  placeholder="请输入"
                  style="width:250px"
                  :max="9999"
                  :min="0.1"
                  :disabled="!buttonProhibit"
                />&nbsp;&nbsp;元
                <div style="display: inline-block;margin-left:20px" v-if="!buttonProhibit">
                  <Button size="small" @click="logDetailsFn('inviteUseCouponMoney')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('inviteUseCouponMoney')">编辑日志</Button>
                </div>
                       </Col>

                 
 <Col span="4" class="left-text"> <span style="color:red">*</span> 邀新规则设置</Col>
                     
                  <Col span="8"   >
                 <Input
                  v-model="addData.rakeBackDesc"
                  :disabled="!buttonProhibit"
                  type="textarea"
                  :autosize="{minRows: 4,maxRows: 8}"
                  style="width:250px"
                ></Input>
                <div style="display: inline-block;margin-left:42px" v-if="!buttonProhibit">
                  <Button size="small" @click="logDetailsFn('rakeBackDesc')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('rakeBackDesc')">编辑日志</Button>
                </div>
                       </Col>
 
 </Row>


       
  <Row class="box">

                  <Col span="4" class="left-text"> <span style="color:red">*</span> 可提现规则说明</Col>
                     
                  <Col span="8"   >
                 <Input
                  v-model="addData.canCashDesc"
                  :disabled="!buttonProhibit"
                  type="textarea"
                  :autosize="{minRows: 4,maxRows: 8}"
                  style="width:250px"
                ></Input>
                <div style="display: inline-block;margin-left:42px" v-if="!buttonProhibit">
                  <Button size="small" @click="logDetailsFn('canCashDesc')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('canCashDesc')">编辑日志</Button>
                </div>
                       </Col>
                      <Col span="4" class="left-text"> <span style="color:red">*</span> 不可提现规则说明</Col>
                     
                         <Col span="8"   >
                    <Input
                  v-model="addData.notCashDesc"
                  :disabled="!buttonProhibit"
                  type="textarea"
                  :autosize="{minRows: 4,maxRows: 8}"
                  style="width:250px"
                ></Input>
                <div style="display: inline-block;margin-left:42px" v-if="!buttonProhibit">
                  <Button size="small" @click="logDetailsFn('notCashDesc')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEdit('notCashDesc')">编辑日志</Button>
                </div>
                       </Col>

 
 </Row>
   
<Row>
  
                  <Col span="4" class="left-text"> <span style="color:red">*</span> 宣传图片</Col>
                     
                  <Col span="8"   >
                    <div class="imgSrc_box"   v-if="propagatingImgUrl" >
                              <img  :src="propagatingImgUrl" style="width:100%">
                          </div>
                    
                          <div style="width:100px; float:left">
                            <ImgCutter :label="'选择图片'"  :boxWidth="500"  :boxHeight="400" v-on:cutDown="cutDown" >
                                <button slot="openImgCutter"
                                        style="width:100px; background: border-box"
                                >上传图片</button>
                            </ImgCutter>
                          </div>
                          <br>
                      

                  <div style="display: inline-block;margin-left: 152px;" v-if="!buttonProhibit" >
                  <Button size="small" @click="logDetailsFn('propagatingImgUrl')">查看日志</Button>
                  <Button size="small" type="warning" style="margin-left:10px" @click="inputEditImg()">编辑日志</Button>
                </div>
                <p v-if="buttonProhibit" class="left-text">宣传图片 (不大于1M, JPG/PNG/JPEG/BMP）</p>
                </Col>
</Row>

          

          <Row style="margin-top:54px;text-align: center">
            <!-- <Alert type="warning" show-icon style="width:250px" v-if="buttonProhibit">修改后才能保存</Alert> -->
            <Button
              type="primary"
              size="large"
              style="width:300px;"
              @click="addEditRebateRule"
              v-if="buttonProhibit"
            >保存</Button>
            <!-- v-if="buttonProhibit" -->
          </Row>
     
      </div>
    </Card>
      






    <!-- 查看日志对话框 -->
    <Modal v-model="logDetailsDisplay" :title="'查看' + titleTxt" width="900" footer-hide :mask-closable="false">
      <div v-if="titleTxt != '邀新规则设置' && titleTxt != '可提现规则说明' && titleTxt != '不可提现规则说明'">
        <!-- 列表部分 -->
        <Table border highlight-row ref="selection" :columns="columns4" :data="logDetailsList">
          <template slot-scope="{ row }" slot="reason">
            <Tooltip :max-width="200" :content="row.reason">
              <span>{{row.reason | msgFilters}}</span>
            </Tooltip>
          </template>
          <template slot-scope="{ row }" slot="afterValue">
            <div v-if="row.updateField == 'propagatingImgUrl'" style="width:100px">
              <img style="width:100%" :src="row.afterValue" alt="">
            </div>
            <div v-else>
              {{row.afterValue}}
            </div>
          </template>
          <template slot-scope="{ row }" slot="beforeValue">
            <div v-if="row.updateField == 'propagatingImgUrl'" style="width:100px">
              <img style="width:100%" :src="row.beforeValue" alt="">
            </div>
            <div v-else>
              {{row.beforeValue}}
            </div>
          </template>
        </Table>
        <!-- @on-current-change="selectionCampagin" -->
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
        <!-- 列表部分 -->
      </div>
      <div v-else>
        <!-- 详情部分 -->
        <Row>
          <Col span="12">
            <Form :label-width="120">
            <h2 style="display:inline-block; margin-left:30px">上一规则</h2>
            <span style="font-size:14px">（{{textObj.updataBy1}} &nbsp;&nbsp; - &nbsp;&nbsp; {{textObj.updateTime1}} ）</span>
            <FormItem :label="titleTxt + ':'">
              <Input
                v-model="textObj.afterValue1"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 3}"
                style="width:250px"
              ></Input>
            </FormItem>
            <FormItem label="备注:">
              <Input
                v-model="textObj.beforeReason1"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 3}"
                style="width:250px"
              ></Input>
            </FormItem>
            </Form>
          </Col>
          <Col span="12">
            <Form :label-width="120">
            <h2 style="display:inline-block; margin-left:30px">最新规则</h2>
            <span style="font-size:14px">（{{textObj.updataBy0}} &nbsp;&nbsp; - &nbsp;&nbsp; {{textObj.updateTime0}} ）</span>
            <FormItem :label="titleTxt + ':'">
              <Input
                v-model="textObj.afterValue0"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 3}"
                style="width:250px"
              ></Input>
            </FormItem>
            <FormItem label="备注:">
              <Input
                v-model="textObj.beforeReason0"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 3}"
                style="width:250px"
              ></Input>
            </FormItem>
            </Form>
          </Col>
        </Row>
        <!-- 详情部分 -->
      </div>
    </Modal>
    <!-- 查看日志对话框 -->
    <!-- 修改对话框 -->
    <Modal v-model="editDisplay" :title="'编辑' + titleTxt" footer-hide :mask-closable="false">
      <Form ref="editData" :model="editData" :label-width="158">
        <div v-if="titleTxt != '邀新规则设置' && titleTxt != '可提现规则说明' && titleTxt != '不可提现规则说明'">
          <!-- 数字输入 -->
          <FormItem :label="titleTxt +':'" required>
            <InputNumber
              v-model="editData.value"
              type="text"
              placeholder="请输入"
              style="width:250px"
              :max="9999"
              :min="0.1"
            ></InputNumber>
          </FormItem>
          <!-- 数字输入 -->
        </div>
        <div v-else>
          <!-- 文本域输入 -->
          <FormItem :label="titleTxt +':'" required>
            <Input
              v-model="editData.value"
              type="textarea"
              :autosize="{minRows: 4,maxRows: 8}"
              style="width:250px"
            ></Input>
          </FormItem>
          <!-- 文本域输入 -->
        </div>
        <FormItem label="备注:" required>
          <Input
            v-model="editData.reason"
            type="textarea"
            :autosize="{minRows: 4,maxRows: 8}"
            style="width:250px"
          ></Input>
        </FormItem>
      </Form>
      <Row style="margin:10px 0 0 375px">
        <Button type="text" @click="editDisplay = false">取消</Button>
        <Button type="primary" @click="edit()">确认</Button>
      </Row>
    </Modal>
    <!-- 修改对话框 -->
    <!-- 宣传图片修改对话框 -->
    <Modal v-model="upImgDisplay" :title="'编辑' + titleTxt" footer-hide :mask-closable="false">



   
<Row>
  
                  <Col span="4" class="left-text"> <span style="color:red">*</span> 宣传图片</Col>
                     
                  <Col span="20"   >
                  <div class="imgSrc_box"   v-if="addData.propagatingImgUrl" >
                              <img  :src="addData.propagatingImgUrl" style="width:100%">
                          </div>
                    
                          <div style="width:300px; float:left">
                            <ImgCutter :label="'选择图片'"  :boxWidth="500"  :boxHeight="400" v-on:cutDown="cutDown" >
                                <button slot="openImgCutter"
                                        style="width:100px; background: border-box"
                                >上传图片</button>
                            </ImgCutter>
                          </div>
                          <br>
                          <div  class="left-text">选择宣传图片 (不大于1M,JPG/PNG/JPEG/BMP）</div>
                       </Col>
                       
</Row>

<Row>
        <Col span="4" class="left-text"> <span style="color:red">*</span> 备注</Col>
                     
                  <Col span="20"   >
                  <Input
              v-model="editData.reason"
              type="textarea"
              :autosize="{minRows: 4,maxRows: 8}"
              style="width:250px"
            ></Input>
               </Col>


</Row>



    
    
      <Row style="margin:10px 0 0 375px">
        <Button type="text" @click="upImgDisplay = false">取消</Button>
        <Button type="primary" @click="editImg()">确认</Button>
      </Row>
    </Modal>
    <!-- 宣传图片修改对话框 -->
  </div>
</template>
<script>
import {
  getRakeBackRule,
  addRakeBackRule,
  logDetailsApi,
  editRakeBackRule
} from "@/api/sys";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from "@/libs/axios";
import { uploadOperationImage2AliOssURl } from "@/api/index";
import ImgCutter from "@/components/ImgCutter.vue";
export default {
  components: {
    ImgCutter
  },
  name: "timed-task",
  data() {
    return {
      propagatingImgUrl: "",
      addData: {
        canCashDesc: "", //可提现规则说明
        dailyCashLimit: null, //每日提现上限
        dailyRakeBackLimit: null, //每日奖励好友数上限
        inviteReceiveCouponMoney: null, //邀请首次领券奖励
        inviteRegisterMoney: null, //邀请注册奖励
        inviteUseCouponMoney: null, //邀请首次核销奖励
        minCashLimit: null, //提现最低门槛
        notCashDesc: "", //不可提现规则说明
        propagatingImgUrl: "", //宣传图片
        rakeBackDesc: "", //邀新规则
        receiveCouponMoney: null, //首次领券奖励
        registerMoney: null, //新人注册奖励
        useCouponMoney: null //首次核销奖励
      },
      addEdit: "", // 新增或者编辑，1：新增，2：编辑
      delDisplay: false, // 删除对话框显示
      buttonProhibit: true, // 按键禁用
      signinRuleId: "", //签到活动规则id
      logDetailsDisplay: false, //查看日志显示
      logDetailsList: [], // 查看日志列表数据
      columns4: [
        {
          title: "时间",
          align: "center",
          minWidth: 140,
          key: "updateTime"
        },
        {
          title: "修改前",
          align: "center",
          minWidth: 140,
          key: "beforeValue",
          slot: "beforeValue"
        },
        {
          title: "修改后",
          align: "center",
          minWidth: 140,
          key: "afterValue",
          slot: "afterValue"
        },
        {
          title: "修改人",
          align: "center",
          minWidth: 140,
          key: "updateBy"
        },
        {
          title: "备注",
          align: "center",
          minWidth: 140,
          key: "reason",
          slot: "reason"
        }
      ],
      field: "", // 字段
      titleTxt: "", // 查看日志title
      current: 1, // 查看分页
      totalSize: 0, // 总页数
      textObj: {}, // 文字查看详情对话框数据
      // 编辑
      editDisplay: false, // 编辑显示
      editData: {
        // 编辑数据
        id: "",
        value: null,
        reason: "",
        field: ""
      },
      // 上传宣传图片
      uploadList1: [],
      uploadList2: [],
      url: uploadOperationImage2AliOssURl,
      userToken: {}, //用户token
      upImgDisplay: false // 上传宣传图对话框
    };
  },
  filters: {
    msgFilters: function(value) {
      if (value) {
        if (value.length > 10) {
          let str = value.slice(0, 10);
          return str + "...";
        } else {
          return value;
        }
      }
    }
  },
  created: function() {
    this.getList();
    this.userToken = {
      jwttoken: localStorage.getItem("jwttoken")
    };
  },
  methods: {
    // 渲染列表
    getList() {
      getRakeBackRule().then(res => {
        //console.log(res);
        if (res.code == 200) {
          if (res.data) {
            this.addData.id = res.data.id;
            this.addData.dailyCashLimit = res.data.dailyCashLimit;
            this.addData.dailyRakeBackLimit = res.data.dailyRakeBackLimit;
            this.addData.inviteReceiveCouponMoney =
              res.data.inviteReceiveCouponMoney;
            this.addData.inviteRegisterMoney = res.data.inviteRegisterMoney;
            this.addData.inviteUseCouponMoney = res.data.inviteUseCouponMoney;
            this.addData.minCashLimit = res.data.minCashLimit;
            this.addData.propagatingImgUrl = res.data.propagatingImgUrl;
            this.addData.receiveCouponMoney = res.data.receiveCouponMoney;
            this.addData.registerMoney = res.data.registerMoney;
            this.addData.useCouponMoney = res.data.useCouponMoney;
            this.addData.notCashDesc = res.data.notCashDesc.replace(
              /\\n/g,
              "\n"
            );
            this.addData.canCashDesc = res.data.canCashDesc.replace(
              /\\n/g,
              "\n"
            );
            this.addData.rakeBackDesc = res.data.rakeBackDesc.replace(
              /\\n/g,
              "\n"
            );

            this.addEdit = "2";
            this.buttonProhibit = false;
          } else {
            this.addEdit = "1";
            this.buttonProhibit = true;
          }
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 新增
    addEditRebateRule() {
      // 验证
      if (!this.ruleValidate()) {
        return;
      }
      const data = {
        dailyCashLimit: this.addData.dailyCashLimit,
        dailyRakeBackLimit: this.addData.dailyRakeBackLimit,
        inviteReceiveCouponMoney: this.addData.inviteReceiveCouponMoney,
        inviteRegisterMoney: this.addData.inviteRegisterMoney,
        inviteUseCouponMoney: this.addData.inviteUseCouponMoney,
        minCashLimit: this.addData.minCashLimit,
        propagatingImgUrl: this.addData.propagatingImgUrl,
        receiveCouponMoney: this.addData.receiveCouponMoney,
        registerMoney: this.addData.registerMoney,
        useCouponMoney: this.addData.useCouponMoney,
        notCashDesc: this.addData.notCashDesc
          .replace(/\t/g, "")
          .replace(/\n/g, "\\n"),
        canCashDesc: this.addData.canCashDesc
          .replace(/\t/g, "")
          .replace(/\n/g, "\\n"),
        rakeBackDesc: this.addData.rakeBackDesc
          .replace(/\t/g, "")
          .replace(/\n/g, "\\n")
      };
      addRakeBackRule(data).then(res => {
        if (res.code == 200) {
          this.msgOk("保存成功");
          // this.addRebateRuleDisplay = false;
          // this.resettingFrom();
          this.getList();
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 查看对话框传值
    logDetailsFn(field) {
      this.field = field;
      this.titleTxtFn(field);
      logDetailsApi(field, this.current).then(res => {
        if (res.code == 200) {
          this.logDetailsList = res.data.records;
          if (
            field == "rakeBackDesc" ||
            field == "canCashDesc" ||
            field == "notCashDesc"
          ) {
            // console.log(123);
            // for (let i = 0; i < this.logDetailsList.length; i++) {
            //   this.logDetailsList[i].afterValue = this.logDetailsList[i].afterValue.replace(/\\n/g,"\n")
            //   this.logDetailsList[i].beforeValue = this.logDetailsList[i].beforeValue.replace(/\\n/g,"\n")
            // }
            // console.log(this.logDetailsList);
            if (this.logDetailsList.length != 0) {
              this.textObj = {
                afterValue0:
                  this.logDetailsList[0].afterValue.replace(/\\n/g, "\n") || "",
                beforeReason0: this.logDetailsList[0].reason || "",
                updataBy0: this.logDetailsList[0].updateBy || "",
                updateTime0: this.logDetailsList[0].updateTime || "",
                afterValue1:
                  this.logDetailsList[1].afterValue.replace(/\\n/g, "\n") || "",
                beforeReason1: this.logDetailsList[1].reason || "",
                updataBy1: this.logDetailsList[1].updateBy || "",
                updateTime1: this.logDetailsList[1].updateTime || ""
              };
            } else {
              this.textObj = {
                afterValue0: "暂无",
                beforeReason0: "暂无",
                updataBy0: "暂无",
                updateTime0: "暂无",
                afterValue1: "暂无",
                beforeReason1: "暂无",
                updataBy1: "暂无",
                updateTime1: "暂无"
              };
            }
          }
          this.current = res.data.current;
          this.totalSize = res.data.total;
          this.logDetailsDisplay = true;
        }
      });
    },

    // 分页（点击第几页）
    changeCurrent: function(current) {
      this.current = current;
      logDetailsApi(this.field, this.current).then(res => {
        if (res.code == 200) {
          this.logDetailsList = res.data.records;
          this.current = res.data.current;
          this.totalSize = res.data.total;
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 标题文字切换
    titleTxtFn(str) {
      if (str == "registerMoney") {
        this.titleTxt = "新人注册奖励";
      }
      if (str == "receiveCouponMoney") {
        this.titleTxt = "新人首次领券奖励";
      }
      if (str == "useCouponMoney") {
        this.titleTxt = "新人首次核销奖励";
      }
      if (str == "inviteRegisterMoney") {
        this.titleTxt = "邀请者注册奖励";
      }
      if (str == "inviteReceiveCouponMoney") {
        this.titleTxt = "邀请者好友首次领券奖励";
      }
      if (str == "inviteUseCouponMoney") {
        this.titleTxt = "邀请者首次核销奖励";
      }
      if (str == "rakeBackDesc") {
        this.titleTxt = "邀新规则设置";
      }
      if (str == "dailyCashLimit") {
        this.titleTxt = "单日提现金额上限";
      }
      if (str == "dailyRakeBackLimit") {
        this.titleTxt = "单日奖励好友数上限";
      }
      if (str == "minCashLimit") {
        this.titleTxt = "提现最低金额";
      }
      if (str == "canCashDesc") {
        this.titleTxt = "可提现规则说明";
      }
      if (str == "notCashDesc") {
        this.titleTxt = "不可提现规则说明";
      }
      if (str == "propagatingImgUrl") {
        this.titleTxt = "宣传图片";
      }
    },

    // 传值编辑日志
    inputEdit(field) {
      this.editData.id = this.addData.id;
      this.editTitleTxtFn(field);
      this.editDisplay = true;
    },

    // 编辑提交
    edit() {
      // console.log(this.editData);
      // return
      if (this.editData.reason == "") {
        this.msgErr("备注还未填写");
        return;
      }
      const data = {
        id: this.editData.id,
        value:
          typeof this.editData.value == "number"
            ? this.editData.value
            : this.editData.value.replace(/\t/g, "").replace(/\n/g, "\\n"),
        reason: this.editData.reason,
        field: this.editData.field
      };
      editRakeBackRule(data).then(res => {
        if (res.code == 200) {
          this.msgOk("编辑成功");
          this.editClear();
          this.getList();
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    editClear() {
      (this.editData = {
        id: "",
        value: null,
        reason: "",
        field: ""
      }),
        (this.editDisplay = false);
    },

    // 编辑 标题切换 赋值
    editTitleTxtFn(str) {
      if (str == "registerMoney") {
        this.titleTxt = "新人注册奖励";
        this.editData.value = this.addData.registerMoney;
        this.editData.field = "registerMoney";
      }
      if (str == "receiveCouponMoney") {
        this.titleTxt = "新人首次领券奖励";
        this.editData.value = this.addData.receiveCouponMoney;
        this.editData.field = "receiveCouponMoney";
      }
      if (str == "useCouponMoney") {
        this.titleTxt = "新人首次核销奖励";
        this.editData.value = this.addData.useCouponMoney;
        this.editData.field = "useCouponMoney";
      }
      if (str == "inviteRegisterMoney") {
        this.titleTxt = "邀请者注册奖励";
        this.editData.value = this.addData.inviteRegisterMoney;
        this.editData.field = "inviteRegisterMoney";
      }
      if (str == "inviteReceiveCouponMoney") {
        this.titleTxt = "邀请者好友首次领券奖励";
        this.editData.value = this.addData.inviteReceiveCouponMoney;
        this.editData.field = "inviteReceiveCouponMoney";
      }
      if (str == "inviteUseCouponMoney") {
        this.titleTxt = "邀请者首次核销奖励";
        this.editData.value = this.addData.inviteUseCouponMoney;
        this.editData.field = "inviteUseCouponMoney";
      }
      if (str == "rakeBackDesc") {
        this.titleTxt = "邀新规则设置";
        this.editData.value = this.addData.rakeBackDesc;
        this.editData.field = "rakeBackDesc";
      }
      if (str == "dailyCashLimit") {
        this.titleTxt = "单日提现金额上限";
        this.editData.value = this.addData.dailyCashLimit;
        this.editData.field = "dailyCashLimit";
      }
      if (str == "dailyRakeBackLimit") {
        this.titleTxt = "单日奖励好友数上限";
        this.editData.value = this.addData.dailyRakeBackLimit;
        this.editData.field = "dailyRakeBackLimit";
      }
      if (str == "minCashLimit") {
        this.titleTxt = "提现最低金额";
        this.editData.value = this.addData.minCashLimit;
        this.editData.field = "minCashLimit";
      }
      if (str == "canCashDesc") {
        this.titleTxt = "可提现规则说明";
        this.editData.value = this.addData.canCashDesc;
        this.editData.field = "canCashDesc";
      }
      if (str == "notCashDesc") {
        this.titleTxt = "不可提现规则说明";
        this.editData.value = this.addData.notCashDesc;
        this.editData.field = "notCashDesc";
      }
      // if(str == 'propagatingImgUrl') {
      //   this.titleTxt = '宣传图片'
      //   this.editData.value = this.addData.propagatingImgUrl
      //   this.editData.field = 'propagatingImgUrl'
      // }
    },

    // 传值上传图片
    inputEditImg() {
      this.titleTxt = "宣传图片";
      this.editData.id = this.addData.id;
      this.editData.field = "propagatingImgUrl";
      this.upImgDisplay = true;
      // console.log(this.editData);
    },

    // 图片编辑提交
    editImg() {
      if (this.editData.reason == "") {
        this.msgErr("备注还未填写");
        return;
      }
      const data = {
        id: this.editData.id,
        value: this.addData.propagatingImgUrl,
        reason: this.editData.reason,
        field: this.editData.field
      };
      editRakeBackRule(data).then(res => {
        if (res.code == 200) {
          this.msgOk("编辑成功");
          (this.editData = {
            id: "",
            value: null,
            reason: "",
            field: ""
          }),
            (this.upImgDisplay = false);
          this.getList();
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 验证
    ruleValidate() {
      if (this.addData.dailyCashLimit == null) {
        this.msgErr("单日提现金额上限不能为空");
        return;
      }
      if (this.addData.dailyRakeBackLimit == null) {
        this.msgErr("单日奖励好友数上限不能为空");
        return;
      }
      if (this.addData.inviteReceiveCouponMoney == null) {
        this.msgErr("邀请者好友首次领券奖励不能为空");
        return;
      }
      if (this.addData.inviteRegisterMoney == null) {
        this.msgErr("邀请者注册奖励不能为空");
        return;
      }
      if (this.addData.inviteUseCouponMoney == null) {
        this.msgErr("邀请者首次核销奖励不能为空");
        return;
      }
      if (this.addData.minCashLimit == null) {
        this.msgErr("提现最低金额不能为空");
        return;
      }
      if (this.addData.receiveCouponMoney == null) {
        this.msgErr("新人首次领券奖励不能为空");
        return;
      }
      if (this.addData.registerMoney == null) {
        this.msgErr("新人注册奖励不能为空");
        return;
      }
      if (this.addData.useCouponMoney == null) {
        this.msgErr("新人首次核销奖励不能为空");
        return;
      }
      if (this.addData.canCashDesc == "") {
        this.msgErr("可提现规则说明不能为空");
        return;
      }
      if (this.addData.rakeBackDesc == "") {
        this.msgErr("邀新规则设置不能为空");
        return;
      }
      if (this.addData.notCashDesc == "") {
        this.msgErr("不可提现规则说明不能为空");
        return;
      }
      if (this.addData.propagatingImgUrl == "") {
        this.msgErr("宣传图片不能为空");
        return;
      }

      return true;
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

    cutDown: function(res) {
      console.log(res);
      this.propagatingImgUrl = res.dataURL;

      var reqParams = {
        imgStr: res.dataURL.substr(22)
      };

      uploadFileRequest(
        "/operation/operation-info/uploadBase64Image2AliOss",
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.addData.propagatingImgUrl = res.image_url;
        } else {
          this.$Message.error(res.msg);
        }
      });
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
.imgSrc_box {
  float: left;
  width: 90px;
  height: 90px;
  line-height: 90px;
  margin-right: 10px;
  border: 1px dashed #dcdee2;
  background: #fff;
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
</style>