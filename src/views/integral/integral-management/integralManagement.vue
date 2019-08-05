
<template>
 <div id="app" class="search">
 <Card>

    <Tabs  @on-click="changeTab" >
        <TabPane v-for="(item,index) in tabs" :label="item.lable" :value="item.value" :key="index"></TabPane>
    </Tabs>

  
    <div style="margin-top: 15px;"  v-if=" currentTab!==4 &&currentTab!==5">
        <Form :label-width="180">
            <FormItem label="规则名称" required>
                <Input type="text" v-model="ruleName"  disabled
                         style="width:300px" />
            </FormItem>
           

            <FormItem label="积分值" required>
                <Input type="text" v-model="add_info.score"    @on-change="statusAddChange" 
                         style="width:300px" />
            </FormItem>


             <FormItem label="限制总次数" required>

        <Tooltip trigger="focus" title="提醒" content="0.表示无限制" placement="right">
              <Input type="text" v-model="add_info.totalLimit"  @on-change="statusAddChange"  placeholder="0.表示无限制"
                         style="width:300px" />
        </Tooltip>

               
            </FormItem>


               <FormItem label="按单个用户限制次数" required>

            <Tooltip trigger="focus" title="提醒" content="0.表示无限制" placement="right">
              <Input type="text" v-model="add_info.userLimit"  @on-change="statusAddChange"  placeholder="0.表示无限制"
                         style="width:300px" />
        </Tooltip>


            </FormItem>


            <FormItem style="{'margin-top':'54px'}">
             
                
            <Button  type="primary" size="large" @click="editRule" :loading="add_loading" 
                          :style="{width:'230px'}"  :disabled="isAddDisabled">
                    保存
                </Button >

            </FormItem>
        </Form>
    </div>
  

 <div style="margin-top: 15px;"  v-if=" currentTab===4">
        <Form :label-width="180">

            <FormItem label="活动名称" required>
                 <Input v-model="checkIn_info.name" type="text"    
                            style="width:300px" />

            </FormItem>

          
             <FormItem label="状态" required>
                <RadioGroup v-model="checkIn_info.status" @on-change="statusCheckChange">
                    <Radio label="0">禁用</Radio>
                    <Radio label="1">启用</Radio>
                </RadioGroup>
             </FormItem>
            <FormItem label="签到周期天数" required>
                <Input type="text" v-model="checkIn_info.cycleDays"    @on-change="statusCheckChange"   placeholder="例如7天/30天"
                         style="width:300px" />
            </FormItem>


             <FormItem label="每日签到奖励积分" required>
                <Input type="text" v-model="checkIn_info.dailyRewardRule"  @on-change="statusCheckChange"  placeholder="例如10积分"
                         style="width:300px" />
            </FormItem>


        <FormItem label="连续签到奖励积分规则" required>
               
    </FormItem>

        <FormItem   v-for="(item,index) in checkIn_info.continuousRewardRules"  :key="index">

         <span>连续</span>&nbsp;&nbsp;&nbsp;&nbsp;  
          <Input type="text" v-model="item.day"  @on-change="statusCheckChange"  placeholder="例如7天" style="width:100px" />
         &nbsp;&nbsp;  &nbsp;&nbsp;    <span> 日签到额外赠送</span>&nbsp;&nbsp;&nbsp;&nbsp;  
          <Input type="text" v-model="item.score"  @on-change="statusCheckChange"  placeholder="例如10积分"   style="width:100px" />
          
          
          &nbsp;&nbsp;  &nbsp;&nbsp;     <Button @click="handleRemove(index)" type="error" v-if="checkIn_info.continuousRewardRules.length>1">删除</Button>
       </FormItem>  
       
        <FormItem label="" >  
            <Button type="info"  @click="handleAdd" icon="md-add">增加一项</Button>
                    
        </FormItem> 

           
            <FormItem style="{'margin-top':'54px'}">

                 <Button  type="primary" size="large" @click="checkInEdit" :loading="checkIn_loading" 
                          :style="{width:'230px'}"  :disabled="isCheckDisabled">
                    保存
                </Button >

            </FormItem>
        </Form>
    </div>


 
 
 <div style="margin-top: 15px;"  v-if=" currentTab===5">
        <Form :label-width="180">

            <FormItem label="每人每天免费次数" required>
                 <Input v-model="parameter_info.dailyFreeTimes" type="text"      @on-change="statusParameterChange"
                            style="width:300px" />

            </FormItem>

            <FormItem label="每人每天限制兑换次数" required>
                <Input type="text" v-model="parameter_info.dailyLimitTimes"   @on-change="statusParameterChange"
                         style="width:300px" />
            </FormItem>
           
         <FormItem label="兑换要优惠一次所需积分" required>
                <Input type="text" v-model="parameter_info.requiredScore"  @on-change="statusParameterChange"  
                         style="width:300px" />
            </FormItem>
      
     
           <FormItem label="折扣比例" required>

                    <Tooltip trigger="focus" title="提醒" content="折扣比例在(0-1)之间" placement="right">
                        <InputNumber :max="1" :min="0" :step="0.01" v-model="parameter_info.discountRatio"  @on-change="statusParameterChange"  placeholder="随机范围在(0.1~0.5)之间"
                                style="width:300px"></InputNumber>
                    </Tooltip>
            </FormItem>


             <FormItem label="最低优惠额" required>
                <Input type="text" v-model="parameter_info.lowerDiscountAmount"  @on-change="statusParameterChange"  
                         style="width:300px" />
            </FormItem>

      
          <FormItem label="最高优惠额" required>
                <Input type="text" v-model="parameter_info.upperDiscountAmount"  @on-change="statusParameterChange"  
                         style="width:300px" />
            </FormItem>
      
             <FormItem label="团长优惠金额放大倍数" required>
                <Input type="text" v-model="parameter_info.multiple"  @on-change="statusParameterChange"  
                         style="width:300px" />
            </FormItem>

             <FormItem label="随机因子" required>

                    <Tooltip trigger="focus" title="提醒" content="随机范围在(0.1~0.5)之间" placement="right">
                
                        <InputNumber :max="0.5" :min="0.1" :step="0.1" v-model="parameter_info.randomSeed"  @on-change="statusParameterChange"  placeholder="随机范围在(0.1~0.5)之间"
                                style="width:300px"></InputNumber>

                    </Tooltip>

               
            </FormItem>
          
    

            <FormItem style="{'margin-top':'54px'}">
             
                <Button  type="primary" size="large" @click="parameterAdd" :loading="parameter_loading" v-if="!parameter_info.id"
                          :style="{width:'230px'}"  :disabled="isParameterDisabled">
                    保存
                </Button >

                 <Button  type="primary" size="large" @click="parameterEdit" :loading="parameter_loading" v-if="parameter_info.id"
                          :style="{width:'230px'}"  :disabled="isParameterDisabled">
                    保存
                </Button >

            </FormItem>
        </Form>
    </div>

 
 </Card>

</div>
</template>

<script>
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from "@/libs/axios";

export default {
  name: "role-manage",
  components: {},
  data() {
    return {
      tabs: [
        {
          lable: "用户注册积分",
          value: "register"
        },
        {
          lable: "推荐注册积分",
          value: "recommendRegister"
        },
        {
          lable: "核券积分",
          value: "useCoupon"
        },
        {
          lable: "推荐核券积分",
          value: "recommendUseCoupon"
        },
        {
          lable: "签到积分",
          value: "checkIn"
        },
        {
          lable: "要优惠全局参数",
          value: "parameter"
        }
      ],
      isAddDisabled: true, //默认按钮是禁用状态

      add_info: {
        id: "",
        name: "",
        score: "",
        totalLimit: "",
        trigger: "",
        userLimit: ""
      },
      add_loading: false,
      ruleType: "register",
      ruleName: "",
      currentTab: 0,

      checkIn_info: {
        continuousRewardRules: [
          {
            day: "",
            index: 1,
            score: ""
          }
        ],
        cycleDays: "",
        dailyRewardRule: "",
        name: "",
        signinRuleId: "",
        status: "",
        remark: ""
      },
      checkIn_loading: false,
      isCheckDisabled: true,

      parameter_info: {
        dailyFreeTimes: "",
        dailyLimitTimes: "",
        discountRatio: "",
        id: "",
        lowerDiscountAmount: "",
        multiple: "",
        randomSeed: "",
        requiredScore: "",
        upperDiscountAmount: ""
      },
      parameter_loading: false,
      isParameterDisabled: true,
      ScoreRuleurl: "",
      ScoreRuleMsg: "",
      ScoreRuleurl: "",
      SigninRuleMsg: "",
      CampaignGlobalSeturl: "",
      CampaignGlobalSetMsg: ""
    };
  },

  created: function() {},

  methods: {
    init() {
      if (this.currentTab === 4) {
        this.getCheckIn();
      } else if (this.currentTab === 5) {
        this.getParameter();
      } else {
        this.ruleType = this.tabs[0].value;
        this.ruleName = this.tabs[0].lable;

        this.getRule();
      }
    },

    // 切换tab
    changeTab(obj) {
      console.log(obj);
      this.currentTab = obj;
      this.ruleType = this.tabs[obj].value;
      this.ruleName = this.tabs[obj].lable;
      this.add_info.name = this.tabs[obj].lable;

      if (this.currentTab === 4) {
        this.getCheckIn();
      } else if (this.currentTab === 5) {
        this.getParameter();
      } else {
        this.getRule();
      }
    },
    //根据触发行为类型查询积分规则详情
    getRule() {
      const reqParams = {
        trigger: this.ruleType
      };
      getRequest("/score/ScoreRule/selectScoreRule", reqParams).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.add_info = res.data;
          } else {
            this.add_info = {
              id: "",
              name: "",
              score: "",
              totalLimit: "",
              trigger: "",
              userLimit: ""
            };
          }
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    //保存积分规则
    editRule() {
      if (this.add_info.score == "" || this.add_info.score == undefined) {
        this.$Message.error("积分值不能为空！");
        return;
      }

      if (
        this.add_info.totalLimit == "" ||
        this.add_info.totalLimit == undefined
      ) {
        this.$Message.error("限制总次数不能为空！");
        return;
      }
      if (
        this.add_info.userLimit == "" ||
        this.add_info.userLimit == undefined
      ) {
        this.$Message.error("按单个用户限制次数不能为空！");
        return;
      }

      if (!this.add_info.id) {
        this.ScoreRuleurl = "/score/ScoreRule/add";
        this.ScoreRuleMsg = "新增成功";
      } else {
        this.ScoreRuleurl = "/score/ScoreRule/edit";
        this.ScoreRuleMsg = "编辑成功";
      }

      this.add_loading = true;
      const reqParams = {
        id: this.add_info.id,
        score: this.add_info.score,
        totalLimit: this.add_info.totalLimit,
        trigger: this.ruleType,
        userLimit: this.add_info.userLimit
      };

      postRequest(this.ScoreRuleurl, reqParams).then(res => {
        this.add_loading = false;
        if (res.code == 200) {
          this.$Message.info(this.ScoreRuleMsg);
          this.getRule();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    statusAddChange() {
      this.isAddDisabled = false;
    },

    handleAdd() {
      if (this.checkIn_info.continuousRewardRules.length > 5) {
        this.$Message.error("连续签到奖励积分规则最多伟5条！");
        return;
      } else {
        this.index++;
        this.checkIn_info.continuousRewardRules.push({
          index: this.index,
          day: "",
          score: ""
        });
      }
    },

    handleRemove(index) {
      this.checkIn_info.continuousRewardRules.splice(index, 1);
    },

    //查询签到积分详情
    getCheckIn() {
      getRequest("/score/SigninRule/selectSigninRule").then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.checkIn_info = res.data;
            this.checkIn_info.status = res.data.status == 0 ? "0" : "1";
          } else {
            this.checkIn_info = {
              continuousRewardRules: [
                {
                  day: "",
                  index: 1,
                  score: ""
                }
              ],
              cycleDays: "",
              dailyRewardRule: "",
              name: "",
              signinRuleId: "",
              status: ""
            };
          }
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    //编辑保存签到积分
    checkInEdit() {
      if (this.checkIn_info.name == "" || this.checkIn_info.name == undefined) {
        this.$Message.error("活动名称不能为空！");
        return;
      }

      for (var i of this.checkIn_info.continuousRewardRules) {
        if (!i.day || !i.score) {
          this.$Message.error("连续签到奖励积分规则填写不完全！");
          return;
        }
      }

      if (
        this.checkIn_info.cycleDays == "" ||
        this.checkIn_info.cycleDays == undefined
      ) {
        this.$Message.error("签到周期天数不能为空！");
        return;
      }

      if (
        this.checkIn_info.dailyRewardRule == "" ||
        this.checkIn_info.dailyRewardRule == undefined
      ) {
        this.$Message.error("每日签到奖励积分不能为空！");
        return;
      }

      if (!this.checkIn_info.signinRuleId) {
        this.SigninRuleurl = "/score/SigninRule/add";
        this.SigninRuleMsg = "新增成功";
      } else {
        this.ScoreRuleurl = "/score/SigninRule/edit";
        this.SigninRuleMsg = "编辑成功";
      }

      this.checkIn_loading = true;
      const reqParams = {
        continuousRewardRules: JSON.stringify(
          this.checkIn_info.continuousRewardRules
        ),
        cycleDays: this.checkIn_info.cycleDays,
        dailyRewardRule: this.checkIn_info.dailyRewardRule,
        name: this.checkIn_info.name,
        signinRuleId: this.checkIn_info.signinRuleId,
        status: this.checkIn_info.status,
        remark: this.checkIn_info.remark
      };
      postRequest(this.SigninRuleurl, reqParams).then(res => {
        this.checkIn_loading = false;
        if (res.code == 200) {
          this.$Message.info(this.SigninRuleMsg);

          this.getCheckIn();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    statusCheckChange() {
      this.isCheckDisabled = false;
    },

    //查询要优惠全局参数详情
    getParameter() {
      getRequest("/campaign/CampaignGlobalSet/selectCampaignGlobalSet").then(
        res => {
          if (res.code == 200) {
            if (res.data) {
              this.parameter_info = res.data;
            } else {
              this.parameter_info = {
                dailyFreeTimes: "",
                dailyLimitTimes: "",
                discountRatio: "",
                id: "",
                lowerDiscountAmount: "",
                multiple: "",
                randomSeed: "",
                requiredScore: "",
                upperDiscountAmount: ""
              };
            }
          } else {
            this.$Message.error(res.msg);
          }
        }
      );
    },

    //编辑保存要优惠全局参数
    parameterEdit() {
      if (
        this.parameter_info.dailyFreeTimes == "" ||
        this.parameter_info.dailyFreeTimes == undefined
      ) {
        this.$Message.error("每人每天免费次数不能为空！");
        return;
      }

      if (
        this.parameter_info.dailyLimitTimes == "" ||
        this.parameter_info.dailyLimitTimes == undefined
      ) {
        this.$Message.error("每人每天限制兑换次数不能为空！");
        return;
      }
      if (
        this.parameter_info.discountRatio == "" ||
        this.parameter_info.discountRatio == undefined
      ) {
        this.$Message.error("折扣比例不能为空！");
        return;
      }

      if (
        this.parameter_info.lowerDiscountAmount == "" ||
        this.parameter_info.lowerDiscountAmount == undefined
      ) {
        this.$Message.error("最低优惠额不能为空！");
        return;
      }
      if (
        this.parameter_info.multiple == "" ||
        this.parameter_info.multiple == undefined
      ) {
        this.$Message.error("团长优惠金额放大倍数不能为空！");
        return;
      }

      if (
        this.parameter_info.randomSeed == "" ||
        this.parameter_info.randomSeed == undefined
      ) {
        this.$Message.error("随机因子不能为空！");
        return;
      } else {
        if (
          this.parameter_info.randomSeed > 0.5 ||
          this.parameter_info.randomSeed < 0.1
        ) {
          this.$Message.error("随机因子的范围在0.1~0.5！");
          return;
        }
      }

      if (
        this.parameter_info.requiredScore == "" ||
        this.parameter_info.requiredScore == undefined
      ) {
        this.$Message.error("兑换要优惠一次所需积分不能为空！");
        return;
      }
      if (
        this.parameter_info.upperDiscountAmount == "" ||
        this.parameter_info.upperDiscountAmount == undefined
      ) {
        this.$Message.error("最高优惠额不能为空！");
        return;
      }

      if (!this.checkIn_info.signinRuleId) {
        this.CampaignGlobalSeturl = "/campaign/CampaignGlobalSet/add";
        this.CampaignGlobalSetMsg = "新增成功";
      } else {
        this.CampaignGlobalSeturl = "/campaign/CampaignGlobalSet/edit";
        this.CampaignGlobalSetMsg = "编辑成功";
      }

      this.parameter_loading = true;
      const reqParams = {
        id: this.parameter_info.id,
        dailyFreeTimes: this.parameter_info.dailyFreeTimes,
        dailyLimitTimes: this.parameter_info.dailyLimitTimes,
        discountRatio: this.parameter_info.discountRatio,
        lowerDiscountAmount: this.parameter_info.lowerDiscountAmount,
        multiple: this.parameter_info.multiple,
        randomSeed: this.parameter_info.randomSeed,
        requiredScore: this.parameter_info.requiredScore,
        upperDiscountAmount: this.parameter_info.upperDiscountAmount
      };

      postRequest(this.CampaignGlobalSeturl, reqParams).then(res => {
        this.parameter_loading = false;
        if (res.code == 200) {
          this.$Message.info(this.CampaignGlobalSetMsg);
          this.getParameter();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    statusParameterChange() {
      this.isParameterDisabled = false;
    }
  },
  mounted() {
    this.init();
  }
};
</script>