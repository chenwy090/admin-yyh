<template>
  <!--  U贝兑换 changeType = 0  -->
  <div class="exchange-edit">
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="800"
    >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{title}}</span>
      </p>
      <ul class="query-style-wrap" v-if="action.type == 'query'">
        <li class="qs-item">
          <label class="label">模块名称：</label>
          <div class="value">
            {{formData.name}}
          </div>
        </li>
        <li class="qs-item">
          <label class="label">模块标题：</label>
          <div class="value">
            <div class="img"><img :src="formData.titleImg" /></div>
          </div>
        </li>
        <li class="qs-item">
          <label class="label">适用时间：</label>
          <div class="value">
            {{formData.beginTime}} - {{formData.endTime}}
          </div>
        </li>
        <li class="qs-item">
          <label class="label">排序：</label>
          <div class="value">
            {{formData.order}}
          </div>
        </li>
        <li class="qs-item">
          <label class="label">内容类型：</label>
          <div class="value">
            <template v-if="formData.type == 1">优惠券</template>
            <template v-if="formData.type == 2">图片</template>  
          </div>
        </li>
        <li class="qs-item">
          <label class="label">内容样式：</label>
          <div class="value">
            <RadioGroup v-model="formData.template">
                <div class="template-list">
                  <div class="template-item" v-for="(item,index) in templateTypeOption" :key="index">
                    <p>{{item.name}}</p>
                    <div class="img-wrap">
                      <div class="img"><img :src="item.imgUrl" /></div>
                    </div>
                    <Radio :label="item.id" disabled>&nbsp;</Radio>
                  </div>
                </div>
            </RadioGroup>
              
          </div>
        </li>
        <li class="qs-item">
          <label class="label">库存：</label>
          <div class="value">
            <template v-if="formData.total == 1">显示</template>
            <template v-if="formData.total == 0">不显示</template>
          </div>
        </li>
        <li class="qs-item">
          <label class="label">导航icon：</label>
          <div class="value">
            <div class="img"><img :src="formData.iconImg" /></div>
          </div>
        </li>
        <li class="qs-item">
          <label class="label">导航默认背景：</label>
          <div class="value">
            {{formData.navigationDefaultBackground}}
          </div>
        </li>
        <li class="qs-item">
          <label class="label">导航选中背景：</label>
          <div class="value">
            {{formData.navigationBackground}}
          </div>
        </li>
      </ul>
      <div v-else>
        <Form
          label-position="right"
          ref="form"
          :model="formData"
          :rules="ruleValidate"
          :label-width="130"
        >
          <FormItem
            label="模块名称："
            prop="name"
            :rules="{required: true,  validator: validateEmpty('请输入模板名称',6)}"
          >
            <Tooltip trigger="focus" title="提醒" content="最多6个字符" placement="right">
              <Input
                style="width:300px"
                v-model="formData.name"
                placeholder="最多填写6个字符"
                clearable
              />
            </Tooltip>
          </FormItem>
          <FormItem
            label="模块标题："
            prop="titleImg"
            :rules="{required: true,message:'输入图片'}"
          >
            <div style="display:inline-block;vertical-align:middle">
              <UploadImage
                  :fileUploadType="'titleImg'"
                  :defaultList="formData.defaultImgList"
                  @remove="removeImg('titleImg')"
                  @uploadSuccess="ImgUploadSuccess('titleImg',$event)"
              ></UploadImage>
            </div>
            <span style="margin-left:10px;">限JPG、PNG格式，1MB以内，宽度建议 750px</span>
          </FormItem>
          <FormItem
            label="适用时间："
            prop="beginTime"
            :rules="{required: true,  validator: validateTime}"
          >
            <DatePicker
              type="datetimerange"
              placeholder="请选时间"
              format="yyyy-MM-dd HH:mm:ss"
              style="display:inline-block;width: 300px"
              :value="daterange"
              @on-change="changeTime"
            ></DatePicker>
          </FormItem>
          <FormItem
            label="排序："
            prop="order"
            :rules="{required: true,  validator: validateOrder}"
          >
            <Tooltip trigger="focus" title="提醒" content="极限填写正整数" placement="right">
              <Input
                style="width:300px"
                v-model="formData.order"
                placeholder="极限填写正整数"
                clearable
              />
            </Tooltip>
          </FormItem>
          <FormItem label="内容类型：" prop="type" :rules="{required: true,message:'选择内容类型'}">
            <RadioGroup v-model="formData.type">
                <Radio  v-for="(item,index) in contentTypeOption" :label="item.value" :key="index" :disabled="objectNum == 0 ? false : true">{{item.label}}</Radio>
            </RadioGroup>
            
          </FormItem>
          <FormItem label="" prop="template">
            <div class="type-tips">请选择内容的展示方式</div>
              <RadioGroup v-model="formData.template">
                <div class="template-list">
                  <div class="template-item" v-for="(item,index) in templateTypeOption" :key="index">
                    <p>{{item.name}}</p>
                    <div class="img-wrap">
                      <div class="img"><img :src="item.imgUrl" /></div>
                    </div>
                    <Radio :label="item.id" :disabled="objectNum == 0 ? false : true">&nbsp;</Radio>
                  </div>
                </div>
              </RadioGroup>
            </FormItem>
            <FormItem label="库存：" prop="total" :rules="{required: true,message:'输入库存'}">
               <RadioGroup v-model="formData.total">
                  <Radio v-for="(item,index) in totalTypeOption" :label="item.value" :key="index">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>

            <FormItem
              label="导航icon："
              prop="iconImg"
              :rules="{required: true,message:'输入图片'}"
            >
              <div style="display:inline-block;vertical-align:middle">
                <UploadImage
                    :fileUploadType="'iconImg'"
                    :defaultList="formData.defaultIconImgList"
                    @remove="removeImg('iconImg')"
                    @uploadSuccess="ImgUploadSuccess('iconImg',$event)"
                ></UploadImage>
              </div>
              <span style="margin-left:10px;">限JPG、PNG格式，1MB以内，尺寸比例1：1</span>
            </FormItem>
            <FormItem
              label="导航默认背景："
              prop="navigationDefaultBackground"  :rules="{required: true,message:'输入导航背景'}"
            >
               <Input
                  style="width:300px"
                  v-model="formData.navigationDefaultBackground"
                  placeholder="请填写色值"
                  clearable
                />
            </FormItem>
            <FormItem
              label="导航选中背景："
              prop="navigationBackground"  :rules="{required: true,message:'输入导航背景'}"
            >
               <Input
                  style="width:300px"
                  v-model="formData.navigationBackground"
                  placeholder="请填写色值"
                  clearable
                />
            </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="handleSubmit('form')" v-if="action.type != 'query'">确认</Button>
        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("template");

import util from "@/libs/util";
import { postRequest } from "@/libs/axios";
import UploadImage from "../components/UploadImage";
export default {
  name: "edit",
  props: {
    action: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => ({ type: "add" })
    }
  },
  components:{
    UploadImage
  },
  computed: {
    ...mapGetters({
      // 映射 `this.activityId` 为 `store.getters.getActivityId`
      activityId: "getActivityId"
    })
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;
        this.isShow = true;
        console.log(data)
        console.log("watch jackpot edit action:");
        // 新增
        if (type == "add") {
          this.title = "新增模块";
          this.url = "/browsing/templateModule/add";
          this.daterange = [];
        } else if(type == 'query'){
          this.title = "查看模块";
          this.url = "/browsing/templateModule/selectById";
          this.formData.id = data.id;
          this.queryTemplateModule(type);
        }else {
          //edit 修改
          this.title = "编辑模块";
          this.url = "/browsing/templateModule/selectById";
          this.formData.id = data.id;
          this.objectNum = data.objectNum;
          console.log(this.formData.objectNum)
          this.queryTemplateModule(type);
        }
      },
      deep: true
    }
  },
  data() {
    return {
      // 新增、修改 任务抽奖banner
      // /activityInfo/add新增 /activityInfo/edit修改
      url: "",
      isShow: false,
      title: "新增模板",
      daterange: [],
      formData: {
        id: "",
        name: "",
        beginTime: "",
        endTime: "",
        order:'',
        iconImg:'',
        defaultIconImgList:[],
        navigationDefaultBackground:'', //导航默认颜色
        titleImg:'',
        defaultImgList:[],
        type:'',
        template:'',
        total:'',
        navigationBackground:'' //导航选中颜色
      },
      ruleValidate: {},
      contentTypeOption:[{label:'优惠券',value:1},{label:'图片',value:2}],
      totalTypeOption:[{label:'是',value:1},{label:'否',value:0}],
      templateTypeOption:[],
      objectNum:0
    };
  },
  async created(){
    await this.queryTemplateType();
  },
  async mounted() {},
  methods: {
    changeTime(arr) {
      // yyyy-MM-dd HH:mm:ss
      console.log(arr);
      let [beginTime, endTime] = arr;
      this.formData.beginTime = beginTime;
      this.formData.endTime = endTime;
    },
    closeDialog() {
      //关闭对话框清除表单数据
      this.formData = {
        id: "",
        name: "",
        beginTime: "",
        endTime: "",
        order:'',
        iconImg:'',
        defaultIconImgList:[],
        navigationBackground:'',
        navigationDefaultBackground:'',
        titleImg:'',
        defaultImgList:[],
        type:'',
        template:'',
        total:''
      };
      console.log("closeDialog");
      this.isShow = false;
      // this.$emit(`update:showExchange`, false);
    },
    async queryTemplateType(){
      let {code,msg,data} = await postRequest('/browsing/templateType/list')
      if(code == 200){
        this.templateTypeOption = data;
      }else{
        this.msgErr(msg);  
      }
    },
    removeImg(name) {
      if(name == 'titleImg'){
        this.formData.titleImg = "";
        this.formData.defaultImgList = [];
      }else if(name == 'iconImg'){
        this.formData.iconImg = "";
        this.formData.defaultIconImgList = [];
      }
    },
    ImgUploadSuccess(name,{ imgUrl }) {
      if(name == 'titleImg'){
        this.formData.titleImg = imgUrl;
        this.formData.defaultImgList = [{ imgUrl }];
      }else if(name == 'iconImg'){
        this.formData.iconImg = imgUrl;
        this.formData.defaultIconImgList = [{ imgUrl }];
      }
    },
    async queryTemplateModule(type){
      let {code,msg,data} = await postRequest(this.url,{id:this.formData.id});
      
      if (code == 200) {
        const {id,browsingId,name,startTime,endTime,sortBy,navigationIcon,navigationBackground,titleImgUrl,moduleType,styleType,showStock,navigationDefaultBackground} = data;
          this.formData = {
            id: id,
            name: name,
            beginTime:startTime,
            endTime:endTime,
            order:sortBy,
            iconImg:navigationIcon,
            defaultIconImgList:[{imgUrl:navigationIcon}],
            navigationBackground:navigationBackground,
            titleImg:titleImgUrl,
            defaultImgList:[{imgUrl:titleImgUrl}],
            type:moduleType,
            template:styleType,
            total:showStock,
            navigationDefaultBackground:navigationDefaultBackground
          };
          this.daterange = [startTime, endTime];
          if(type == 'query'){

          }else if(type == 'edit'){  
            this.url = '/browsing/templateModule/edit'
          }
      } else {
        this.msgErr(msg);
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        
        if (valid) {
          const {formData:{id,name,beginTime,endTime,order,iconImg,navigationBackground,titleImg,type,template,total,navigationDefaultBackground}} = this;
          let params = {
            id:id,
            browsingId:this.activityId,
            endTime:endTime,
            moduleType:type,
            name:name,
            navigationBackground:navigationBackground,
            navigationIcon:iconImg,
            showStock:total,
            sortBy:order,
            startTime:beginTime,
            styleType:template,
            titleImgUrl:titleImg,
            navigationDefaultBackground:navigationDefaultBackground
          }
          console.log(params+'新增模块')
          let { code, msg } = await postRequest(this.url, params);

          if (code == 200) {
            this.msgOk("保存成功");
            // 关闭对话框
            this.closeDialog();
            //刷新列表数据
            this.$emit("refresh");
          } else {
            this.msgErr(msg);
          }
        } else {
          this.$Message.error("数据验证失败！");
        }
      });
    },


    validateTime(rule, value, callback) {
        this.$nextTick(_=>{
            let beginTime = this.formData.beginTime;
            let endTime = this.formData.endTime;
            if (beginTime == "" || endTime == "") {
                return callback('时间不能为空');
            }
            beginTime = new Date(beginTime);
            endTime = new Date(endTime);
            // if (beginTime < new Date()) {
            //     return callback(`开始时间不能小于当前时间`);
            // }
            if (endTime < new Date()) {
                return callback(`开始时间不能小于当前时间`);
            }
            if (beginTime >= endTime) {
                return callback(`结束时间必须大于开始时间`);
            }
            callback();
        });

    },

    validateEmpty(msg, len = 6) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        let length = util.getByteLen(value);
        if (length > len * 2) {
          return callback(`最多只能输入${len}个汉字`);
        }
        callback();
      };
    },
    validateOrder(rule, value, callback){
      // value += "";
      // value = value.trim();
      // // 允许不填
      let reg = /^(0|\+?[1-9][0-9]*)$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback('仅输入正整数');
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
    }
  }
};
</script>
<style scoped lang="less">
  .template-list{
  display: flex;
  align-items:center;
  .template-item{
    width: 100px; 
    text-align:center;
    margin-right:50px;
  }
  .img-wrap{
    
    .img{
      width:100px;
        height:100px;
        border:1px #ddd solid;
        line-height:100px;
    }
    img{
      max-width:100%;
      max-height:100%;
      vertical-align:middle;
    }
  }
}
.query-style-wrap{
    .qs-item{
      display:flex;
      padding:10px 0;
      align-items:center;
    }
    .label{
      width:100px;
    }
    .value{
      flex:1;
      .img{
        width:100px;
        height:100px;
        border:1px #ddd solid;
        line-height:100px;
      }
      img{
        width:100%;
        vertical-align:middle;
      }
    }
  }
</style>
