<template>
  <!--  U贝兑换 changeType = 0  -->
  <div class="exchange-edit">
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="500"
    >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{title}}</span>
      </p>
      <div>
        <template v-if="action.type == 'query'">
          <ul class="query-activity">
            <li class="item">
              <span class="label">活动类型：</span>
              <div class="value">{{activityInfo.activityTypeName}}</div>
            </li>
            <li class="item">
              <span class="label">活动名称：</span>
              <div class="value">{{activityInfo.name}}</div>
            </li>
            <li class="item">
              <span class="label">活动时间：</span>
              <div class="value">{{activityInfo.startTime}} - {{activityInfo.endTime}}</div>
            </li>
            <li class="item">
              <span class="label">开放城市：</span>
              <div class="value">
                <template v-if="activityInfo.openCityType == 1">全部城市</template>
                <template v-if="activityInfo.openCityType == 2">
                  <span v-for="item in activityInfo.cityList" :key="item.cityCode" style="margin-right:10px;">{{item.cityName}}</span>
                </template>
              </div>
            </li>
            <li class="item">
              <span class="label">活动链接：</span>
              <div class="value">
                <input v-model="h5Url" ref="code" style="border:0;outline:0;width:100%;color:#515a6e" />
              </div>
            </li>
            <div class="item">
              <span class="label"></span>
              <div class="value">
                <Button type="primary" @click="copyUrl">复制链接</Button>
                <Button type="primary" style="margin:0 10px;" @click="downLoadImg(1)">下载太阳码1</Button>
                <Button type="primary" @click="downLoadImg(2)">下载太阳码2</Button>
              </div>
            </div>
          </ul>


        </template>
        <template v-else>
          <Form
            label-position="right"
            ref="form"
            :model="formData"
            :rules="ruleValidate"
            :label-width="100"
          >
            <FormItem
              label="活动类型："
              prop="templateType"
              :rules="{ required: true, message: '请选择活动类型' }"
            >
              <Select v-model="formData.templateType" style="width:300px">
                <Option
                  v-for="(item,index) in activityTypeOption"
                  :value="item.type"
                  :key="index"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>

            <FormItem
              label="活动名称："
              prop="name"
              :rules="{required: true,  validator: validateEmpty('请输入活动名称',15)}"
            >
              <Tooltip trigger="focus" title="提醒" content="最多15个汉字" placement="right">
                <Input style="width:300px" v-model="formData.name" placeholder="请输入活动名称" clearable />
              </Tooltip>
            </FormItem>
            <FormItem label="活动时间：" prop="startTime" :rules="{ required: true, message: '请选择活动时间' }">
              <DatePicker
                type="datetimerange"
                placeholder="请选择活动时间"
                format="yyyy-MM-dd HH:mm:ss"
                style="display:inline-block;width: 300px"
                :value="daterange"
                @on-change="changeTime"
              ></DatePicker>
            </FormItem>
            <FormItem
              label="开放城市："
              prop="openCityType"
              :rules="{ required: true, message: '请选择开放城市' }"
            >
              <RadioGroup v-model="formData.openCityType">
                  <Radio v-for="(item,index) in openCityTypeOptions" :label="item.value" :key="index">{{item.label}}</Radio>
              </RadioGroup>
              <div class="change-city" v-if="formData.openCityType == 2">
                <CheckboxGroup v-model="formData.cityCodeList">
                  <Checkbox v-for="item in openCityList" :label="item.cityCode" :key="item.cityCode">{{item.cityName}}</Checkbox>
                </CheckboxGroup>
              </div>
            </FormItem>
          </Form>
        </template>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="handleSubmit('form')" v-if="action.type != 'query'">确认</Button>
        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>

    <Modal
      v-model="isShowCode"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialogCode"
      :styles="{top: '20px'}"
      width="500"
      title="下载太阳码"
    >
      <div class="code-img-url"><img :src="codeUrl" /></div>
      <div slot="footer">
        <Button @click="closeDialogCode" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>


  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("template");

import util from "@/libs/util";
import { postRequest } from "@/libs/axios";
import createFormData from "./createFormData";

export default {
  name: "edit",
  props: {
    action: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => ({ type: "add" })
    }
  },
  computed: {
    ...mapGetters({
      // 映射 `this.activityTypeOption` 为 `store.getters.getActivityTypeOption`
      activityTypeOption: "getActivityTypeOption"
    })
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;
        this.isShow = true;
        console.log("xxxx");
        
        // 新增
        if (type == "add") {
          this.title = "创建活动";
          this.url = "/browsing/templateInfo/add";
          this.formData = createFormData();
          this.daterange = [];
        } else if(type == "query"){
          this.title = "查看活动";
          this.url = '/browsing/templateInfo/selectById';
          this.queryActivityInfo(data.id,type);
        }else {
          //edit 修改
          this.title = "修改活动";
          this.url = '/browsing/templateInfo/selectById'
          this.queryActivityInfo(data.id,type);
        }
      },
      deep: true
    }
  },
  data() {
    return {
      // 新增、修改 任务抽奖banner
      // /activityInfo/add新增 /activityInfo/edit修改
      url: "/browsing/templateInfo/add",
      isShow: false,
      title: "创建活动",
      daterange: [],
      formData: createFormData(),
      ruleValidate: {},
      openCityTypeOptions:[{label:'全部城市',value:1},{label:'指定城市',value:2}],
      openCityList:[],
      activityInfo:{},
      h5Url:'',
      isShowCode:false,
      codeUrl:''
    };
  },
  async created(){
    await this.queryOpenCity();
  },
  async mounted() { 
  },
  methods: {
    changeTime(arr) {
      // yyyy-MM-dd HH:mm:ss
      console.log(arr);
      let [beginTime, endTime] = arr;
      this.formData.startTime = beginTime;
      this.formData.endTime = endTime;
    },
    closeDialog() {
      //关闭对话框清除表单数据
      if(this.$refs['form']){
        this.$refs['form'].resetFields();
      }
      console.log("closeDialog");
      this.isShow = false;
      // this.$emit(`update:showExchange`, false);
    },
    async queryOpenCity(){
      await postRequest('/system/area/openCity/list').then(val =>{
        this.openCityList = val.data;
        if(val.code == 200){
          
        }
      })
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          // this.$Message.success("数据验证成功!");

          let oForm = JSON.parse(JSON.stringify(this.formData));



          let { code, msg } = await postRequest(this.url, oForm);
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
    validateEmpty(msg, len = 20) {
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
    async queryActivityInfo(id,type){
      let { code, msg ,data} =  await postRequest(this.url, {id:id});
      if(code == 200){
        if(type == 'query'){
          this.activityTypeOption.forEach(item =>{
            if(item.type == data.templateType){
              data.activityTypeName = item.name
            }
          })
          this.activityInfo = data;
          this.h5Url = this.activityInfo.h5Url;
        }else{
          this.url = "/browsing/templateInfo/edit";
          //获取city的code
          let cityCode = [];
          if(data.cityList == null){
            cityCode = [];
          }else{
            data.cityList.forEach(item =>{
              cityCode.push(item.cityCode)
            })
          }
          console.log(cityCode)
          this.formData = {
            id:data.id,
            templateType:data.templateType,
            name:data.name,
            openCityType:data.openCityType,
            cityCodeList:cityCode,
            startTime:data.startTime,
            endTime:data.endTime
          }
          let { startTime, endTime } = data;
          this.daterange = [startTime, endTime];
        }

      }else{
        this.msgErr(msg);
      }
    },
    copyUrl(){
      let copyText = this.$refs.code; 
      copyText.select(); // 选择对象
      document.execCommand("Copy");
    },
    downLoadImg(id){
      
      if( this.activityInfo.qrcodeList.length == 0){
        this.msgErr('暂无太阳码');
        return false;
      }
      this.isShowCode = true;
      if(id == 1){
        this.codeUrl = this.activityInfo.qrcodeList[0].qrcodeUrl;
      }else{
        this.codeUrl = this.activityInfo.qrcodeList[1].qrcodeUrl;
      }
      console.log(this.activityInfo)
    },
    closeDialogCode(){
      this.isShowCode = false;
      this.codeUrl = "";
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
  .change-city{
    border-top:1px #ddd solid;
    width:300px;
  }
  .query-activity{
    list-style:none;
    .item{
      display:flex;
      padding:10px 0;
    }
    .label{
      width:80px;
    }
    .value{
      flex:1
    }
  }
  .code-img-url{
    width:200px;
    height:200px;
    margin:0 auto;
    img{
      max-width:100%;
      max-height:100%;
    }
  }
</style>