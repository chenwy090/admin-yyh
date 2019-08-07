<template>
    <div>
      <i-form :label-width="180">

        <!-- 名称输入 -->
        <Form-item label="标题：" required>
          <Input
            type="text"
            placeholder="请输入"
            v-model="submitData.name"
            style="width:200px"
            v-if="addEdit == 1"
          />
          <Input
            type="text"
            placeholder="请输入"
            v-model="editData.name"
            style="width:200px"
            v-else
            :disabled="thematicStatus == 3?true:false"
          />
        </Form-item>
        <!-- 名称输入 -->

        <!-- <Form-item label="弹窗类型：" required>
          <Select v-model="submitData.showType" style="width:200px">
            <Option value="2">跳转内部页</Option>
          </Select>
        </Form-item> -->

        <!-- 选择专题 -->
        <Form-item label="专题活动选择：" required>
          <Button @click="getSpecialTopic()" :disabled="thematicStatus == 3?true:false">{{specialTopic}}</Button>
        </Form-item>
        <!-- 选择专题 -->

        <!-- 推荐位设置 -->
        <span style="margin-left:96px;font-size:12px;color:#515a6e;">推荐位设置：</span>
        <Form-item  style="margin-top:10px" :label-width="95" v-if="addEdit == 1">
          <Timeline pending>
            <TimelineItem
              v-for="(item, index) in submitData.operationTopicVOList"
              :key="index"
              style="padding:0;"
            >
              <Row>
                <Col span="1" style="width:40px;">
                  <p class="time">设置{{index+1}}</p>
                </Col>
                <Col span="15" style="width:900px;">
                  <Card style="height:220px">
                    <FormItem
                      label="运营位置选择:"
                      required
                      class="item"
                      :label-width="100"
                      style="width:470px"
                    >
                      <Select v-model="item.source" size="small" style="width:100px" placeholder="请选择终端" @on-change="optionChange(index)">
                        <Option value="1">小程序</Option>
                        <Option value="3">IOS</Option>
                        <Option value="2">安卓</Option>
                      </Select>
                      <Select v-model="item.appid" size="small" style="width:115px;margin-left:10px" placeholder="请选择appid" :disabled="item.source == 1?false:true">
                        <Option
                          :value="item1.appid"
                          v-for="(item1, index1) in appIdData"
                          :key="index1"
                        >{{item1.appName}}</Option>
                      </Select>
                      <Select v-model="item.sort" size="small" style="width:130px;margin-left:10px" placeholder="请选择运营位">
                        <Option
                          :value="item2.dictValue"
                          v-for="(item2, index2) in dictList"
                          :key="index2"
                        >{{item2.dictLabel}}</Option>
                      </Select>
                        <Select
                                v-model="item.shopCode"
                                placeholder="选择门店"
                                style="width:130px;margin-left:10px"
                        >
                            <Option
                                    v-for="(item,index) in shopList"
                                    :key="index"
                                    :value="item.shopId"
                            >{{item.shopName}}</Option>
                        </Select>
                    </FormItem>
                    <!-- 时间选择 -->
                    <Form-item label="选择时间:" required class="item" :label-width="85" style="width:345px">
                      <DatePicker
                        type="date"
                        placeholder="选择开始日期"
                        @on-change="time1"
                        @on-open-change="indexTime(index)"
                        format="yyyy-MM-dd"
                        :value="item.startDate"
                        :editable="false"
                        :clearable="false"
                        size="small"
                        style="width:120px"
                      ></DatePicker>
                      <DatePicker
                        type="date"
                        placeholder="选择结束日期"
                        @on-change="time2"
                        @on-open-change="indexTime(index)"
                        format="yyyy-MM-dd"
                        :value="item.endDate"
                        :editable="false"
                        :clearable="false"
                        size="small"
                        style="width:120px;margin-left:10px"
                      ></DatePicker>
                    </Form-item>
                    <!-- 时间选择 -->

                    <Button
                      type="error"
                      size="small"
                      style=" margin-left:1%;"
                      v-if="submitData.operationTopicVOList.length>1"
                      @click="handleRemove(index,item)"
                    >删除</Button>

                    <!-- 图片上传 -->
                    <!-- banner图片 -->
                    <Form-item
                      label="专题运营位图片:"
                      required
                      :label-width="110"
                      style="width:520px;margin-top:20px"
                    >
                      <div
                        style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                        v-if="item.imgUrl != ''"
                      >
                        <img :src="item.imgUrl" style="width:100%">
                      </div>
                      <div style="display: inline-block;">
                        <Upload
                          ref="upload"
                          type="drag"
                          :format="['jpg','jpeg','png','bmp']"
                          :on-success="handleSuccess1"
                          :action="url"
                          accept="image"
                          :max-size="1024"
                          :on-exceeded-size="handleMaxSize"
                          :on-format-error="formatError"
                          :defaultList="uploadList"
                          :headers="userToken"
                          :show-upload-list="false"
                          style="display: inline-block;width:90px;"
                        >
                          <div style="width: 90px;height:90px;line-height: 90px;" @click="indexRecord(index)">
                            <Icon type="ios-camera" size="20"/>
                          </div>
                        </Upload>
                        <p>选择专题运营位图片 (不大于1M, JPG/PNG/JPEG/BMP）</p>
                      </div>
                    </Form-item>
                    <!-- banner图片 -->
                    <!-- 图片上传 -->
                    
                  </Card>
                </Col>
              </Row>
            </TimelineItem>
          </Timeline>
        </Form-item>
        <!-- 编辑 -->
        <Form-item  style="margin-top:10px" :label-width="95" v-else>
          <Timeline pending>
            <TimelineItem
              style="padding:0;"
            >
              <Row>
                <Col span="1" style="width:40px">
                  <p class="time">设置 </p>
                </Col>
                <Col span="15" style="width:900px;">
                  <Card style="height:220px">
                    <FormItem
                      label="运营位置选择:"
                      required
                      class="item"
                      :label-width="100"
                      style="width:460px"
                    >
                      <Select v-model="editData.sourceName" size="small" style="width:100px" placeholder="请选择终端" disabled>
                        <Option value="小程序">小程序</Option>
                        <Option value="IOS">IOS</Option>
                        <Option value="安卓">安卓</Option>
                      </Select>
                      <!-- <span>终端:{{editData.sourceName}}</span>
                      <span style="margin-left:10px">运营位置:{{editData.sortName}}</span> -->
                      <Select v-model="editData.appid" size="small" style="width:115px;margin-left:10px" placeholder="请选择appid" disabled>
                        <Option
                          :value="item1.appid"
                          v-for="(item1, index1) in appIdData"
                          :key="index1"
                        >{{item1.appName}}</Option>
                      </Select>
                      <Select v-model="editData.sortName" size="small" style="width:125px;margin-left:10px" placeholder="请选择运营位" disabled>
                        <Option
                          :value="item2.dictLabel"
                          v-for="(item2, index2) in dictList"
                          :key="index2"
                        >{{item2.dictLabel}}</Option>
                      </Select>
                      <Select
                              v-model="editData.shopCode"
                              placeholder="选择门店"
                              style="width:130px;margin-left:10px"
                      >
                        <Option
                                v-for="(item,index) in shopList"
                                :key="index"
                                :value="item.shopId"
                        >{{item.shopName}}</Option>
                      </Select>
                    </FormItem>
                    <!-- 时间选择 -->
                    <Form-item label="选择时间:" required class="item" :label-width="85" style="width:345px">
                      <DatePicker
                        type="date"
                        placeholder="选择开始日期"
                        @on-change="time3"
                        format="yyyy-MM-dd"
                        :value="editData.startDate"
                        :editable="false"
                        :clearable="false"
                        size="small"
                        style="width:120px"
                        :disabled="thematicStatus == 3?true:false"
                      ></DatePicker>
                      <DatePicker
                        type="date"
                        placeholder="选择结束日期"
                        @on-change="time4"
                        format="yyyy-MM-dd"
                        :value="editData.endDate"
                        :editable="false"
                        :clearable="false"
                        size="small"
                        style="width:120px;margin-left:10px"
                        :disabled="thematicStatus == 3?true:false"
                      ></DatePicker>
                    </Form-item>
                    <!-- 时间选择 -->
                    <!-- v-if="submitData.arr.length>1" -->

                    <!-- 图片上传 -->
                    <!-- banner图片 -->
                    <Form-item
                      label="专题运营位图片:"
                      required
                      :label-width="110"
                      style="width:520px;margin-top:20px"
                    >
                      <div
                        style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                      >
                        <img :src="editData.imgUrl" style="width:100%">
                      </div>
                      <div style="display: inline-block;" v-if="thematicStatus != 3">
                        <Upload
                          ref="upload"
                          type="drag"
                          :format="['jpg','jpeg','png','bmp']"
                          :on-success="handleSuccess2"
                          :action="url"
                          accept="image"
                          :max-size="1024"
                          :on-exceeded-size="handleMaxSize"
                          :on-format-error="formatError"
                          :defaultList="uploadList"
                          :headers="userToken"
                          :show-upload-list="false"
                          style="display: inline-block;width:90px;"
                        >
                          <div style="width: 90px;height:90px;line-height: 90px;">
                            <Icon type="ios-camera" size="20"/>
                          </div>
                        </Upload>
                        <p>选择专题运营位图片 (不大于1M, JPG/PNG/JPEG/BMP）</p>
                      </div>
                    </Form-item>
                    <!-- banner图片 -->
                    <!-- 图片上传 -->
                    
                  </Card>
                </Col>
              </Row>
            </TimelineItem>
          </Timeline>
        </Form-item>
        <!-- 编辑 -->
        <!-- 推荐位设置 -->
        <Button type="success" @click="handleAdd" icon="md-add" style="margin-left:159px;width:900px" v-if="addEdit == 1">新增</Button>
        <Form-item :style="{'margin-top':'40px'}">
          <i-button
            type="primary"
            @click="submit"
            :disabled="thematicStatus == 3?true:false"
            size="large"
            :style="{'width':'150px','margin-right':'20px'}"
          >确定</i-button>
          <i-button size="large" icon="arrow-left-c" @click="backMsg">返回列表</i-button>
        </Form-item>
      </i-form>
      <!-- 选择专题活动对话框 -->
      <Modal
        v-model="specialTopicDisplay"
        title="选择专题活动"
        width="885"
        footer-hide
        :closable="false"
        :mask-closable="false"
      >
        <Form :label-width="70">
          <Table
            border
            highlight-row
            ref="selection"
            :columns="columns1"
            :data="specialTopicList"
            @on-current-change="selectionCampagin"
          >
          </Table>
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
          <Row style="margin:10px 0 0 797px">
            <Button @click="close()">关闭</Button>
            <!-- <Button type="primary" @click="addLuckyDrawFn()" :disabled="formValidate.templateId == ''? true : false">保存</Button> -->
          </Row>
        </Form>
      </Modal>
      <!-- 选择专题活动对话框 -->
    </div>
</template>

<<script>
import storeView from "./store";
import { getSpecialTopicList,getMiniApp,getDictData,addOperationTopic,editOperation } from "@/api/sys";
import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
import { postRequest, getRequest } from "@/libs/axios";

export default {
  name: "thematicOperation",
    components: {
        storeView
    },
  props: {
      thematicStatus: Number,
      thematicItem: Object
    },
  data() {
    return {
        index: 0,
      appIdData:[],
      dictList:[],
      // 提交数据
      submitData:{
        name: "",
        operationTopicVOList: [
          {
            appid: "",
            endDate: "",
            imgUrl: "",
            sort: null,
            source: null,
            startDate: ""
          }
        ],
        operationType: "yf_zt",
        pagePath: "",
      },
      specialTopic:'请选择',
      specialTopicDisplay: false,
      totalSize: 0,
      current: 1,
      specialTopicList:[],
      columns1:[
        {
          title: "专题内容名称",
          align: "center",
          minWidth: 160,
          key: "name"
        },
        {
          title: "专题描述",
          align: "center",
          minWidth: 160,
          key: "topicDesc"
        },
      ],
      flag_Submit: false, //防止重复点击
      // 图片上传
      uploadList:[],
      userToken:{},
      url: uploadOperationImage2AliOssURl,
      imgIndex:null,
      timeIndex:null, // 时间index
      editData:{
      }, // 编辑功能
      addEdit:null, // 1新增 2编辑
        shopList:[]
    }
  },

  created: function() {
    this.getMiniAppFn()
    this.getDictList()
    this.editToData()
      this.loadShops();
    this.userToken = {
        jwttoken: localStorage.getItem("jwttoken")
      };
  },

  methods: {
      loadShops: function() {
          postRequest("/system/sys-shop-info/list?pageNum=1&pageSize=2000", {}).then(res => {
              if (res.code == 200) {
                  this.shopList = res.data.records;
              } else {
                  this.$Message.error(res.msg);
              }
          });
      },
// 编辑传值
    editToData() {
      // console.log(this.thematicItem);
      this.addEdit = this.thematicStatus
      if(this.thematicStatus != 1) {
        this.editData = this.thematicItem
        // this.editData.sort = this.editData.sort + ''
        this.specialTopic = this.thematicItem.topicName
      }
    },

// 获取小程序app
    getMiniAppFn() {
      getMiniApp().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.appIdData = res.data;
        } else {
          this.msgErr("小程序appId获取失败");
        }
      });
    },

// 获取字典运营位
    getDictList(){
      getDictData('operation_sort').then(res=> {
        if (res.code == 200) {
          this.dictList = res.data;
        } else {
          this.msgErr("字典运营位获取失败");
        }
      })
    },

//获取专题活动列表
    getSpecialTopic() {
      let obj = {
        // operationStartDate : this.operation_data.startDate.slice(0,10),
        // operationEndDate : this.operation_data.endDate.slice(0,10),
        isEffective: 1,
        status : 1
      }
      getSpecialTopicList(obj,this.current).then(res => {
        if(res.code == 200) {
          this.specialTopicList = res.data.records;
          this.current = res.data.current;
          this.totalSize = res.data.total;
          this.specialTopicDisplay = true
        }else {
          this.msgErr(res.msg)
        }
      })
    },

//新增/编辑
    submit: function() {
      // console.log(this.submitData);
      // return
        console.info(JSON.stringify(this.submitData))
      if(this.thematicStatus == 1){
        if (!this.formCheck()) {
            return;
          }
      }else{
        if (!this.editformCheck()) {
            return;
          }
      }
      
      if (this.thematicStatus == 1) {
        
        addOperationTopic(this.submitData).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.msgOk("新增成功");
            this.back()
          } else {
            this.msgErr(res.msg);
          }
        });
      } else {
        editOperation(this.editData).then(res => {
          if (res.code == 200) {
            this.msgOk("编辑成功");
            this.back()
          } else {
            this.msgErr(res.msg);
          }
        });
      }
    },

// 选中优惠活动
    selectionCampagin(row, oldCurrentRow) {
      if(this.addEdit == 1){
        this.submitData.pagePath = row.id
        this.specialTopic = row.name
      }else{
        this.editData.pagePath = row.id
        this.specialTopic = row.name
      }
      this.msgOk("选择成功，请点击关闭");
    },

// 分页
    changeCurrent: function(current) {
      this.current = current;
      this.getSpecialTopic()
    },

// 关闭查看
      close() {
        this.specialTopicDisplay = false
        this.current = 1
      },

// 新增设置端
    handleAdd() {
      this.submitData.operationTopicVOList.push({
        appid: "",
        endDate: "",
        imgUrl: "",
        sort: null,
        source: null,
        startDate: ""
      });
    },

// 删除设置段
    handleRemove(index, item) {
      this.submitData.operationTopicVOList.splice(index, 1);
      // if (item.id) {
      //   this.formValidate.delIds.push(item.id);
      // }
    },

// 提示返回列表
      backMsg() {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>信息将不被保存</p>",
          okText: '离开',
          cancelText: '再看看',
          onOk: () => {
            this.back()
          },
          onCancel: () => {
            this.$Message.info("Clicked cancel");
          }
        });
      },

//返回列表
    back() {
      this.$emit("changeStatus", false);
    },

// 记录时间index
    indexTime(index){
      this.timeIndex = index
    },

// 时间处理
    time1(e) {
      // console.log(e,index);
      if (e) {
        let time = e.slice(0, 10) + " " + "00:00:00";
        this.submitData.operationTopicVOList[this.timeIndex].startDate = time;
      }
    },
    time2(e) {
      // console.log(e);
      if (e) {
        let time = e.slice(0, 10) + " " + "23:59:59";
        this.submitData.operationTopicVOList[this.timeIndex].endDate = time;
      }
    },

// 编辑
    time3(e) {
      // console.log(e,index);
      if (e) {
        let time = e.slice(0, 10) + " " + "00:00:00";
        this.editData.startDate = time;
      }
    },
    time4(e) {
      // console.log(e);
      if (e) {
        let time = e.slice(0, 10) + " " + "23:59:59";
        this.editData.endDate = time;
      }
    },

// 记录图片index
    indexRecord(index) {
      // console.log(index);
      this.imgIndex = index
    },

// banner图片
    handleSuccess1(res, file,index) {
      if (res.code == 200) {
        this.submitData.operationTopicVOList[this.imgIndex].imgUrl = res.image_url
        // this.operation_data.imgUrl = res.image_url;
        // // 显示已上传图片
        // let obj = [
        //   {
        //     url: res.image_url
        //   }
        // ];
        // this.uploadList = obj;
        this.msgOk("上传图片成功");
      } else {
        this.msgErr("上传图片失败，请重新上传");
      }
    },

    handleSuccess2(res, file,index) {
      if (res.code == 200) {
        this.editData.imgUrl = res.image_url;
        // 显示已上传图片
        // let obj = [
        //   {
        //     url: res.image_url
        //   }
        // ];
        // this.uploadList = obj;
        this.msgOk("上传图片成功");
      } else {
        this.msgErr("上传图片失败，请重新上传");
      }
    },

// 下拉框清空
    optionChange(index) {
      this.submitData.operationTopicVOList[index].appid = ''
      // console.log(this.submitData.operationTopicVOList[index].appid);
    },

// 验证 新增
    formCheck: function() {
      if(!this.submitData.name) {
        this.msgErr('标题不能为空')
        return
      }
      if(!this.submitData.pagePath) {
        this.msgErr('请选择专题活动')
        return
      }

      for (let i = 0; i < this.submitData.operationTopicVOList.length; i++) {
        let index = i+1
        if(!this.submitData.operationTopicVOList[i].source) {
          this.msgErr('设置'+index+'的终端未选择')
          return
        }
        if(this.submitData.operationTopicVOList[i].source == 1 && !this.submitData.operationTopicVOList[i].appid) {
          this.msgErr('设置'+index+'的小程序appid未选择')
          return
        }
        if(!this.submitData.operationTopicVOList[i].sort) {
          this.msgErr('设置'+index+'的运营位未选择')
          return
        }
        if(!this.submitData.operationTopicVOList[i].startDate) {
          this.msgErr('设置'+index+'的开始时间未选择')
          return
        }
        if(!this.submitData.operationTopicVOList[i].endDate) {
          this.msgErr('设置'+index+'的结束时间未选择')
          return
        }

        if(!this.submitData.operationTopicVOList[i].shopCode) {
            this.msgErr('设置'+index+'的投放门店未选择')
            return
        }

        if (
          this.submitData.operationTopicVOList[i].startDate >
          this.submitData.operationTopicVOList[i].endDate
        ) {
          this.msgErr(
            "设置" + index + "开始时间不能大于结束时间"
          );
          return;
        }
        if(!this.submitData.operationTopicVOList[i].imgUrl) {
          this.msgErr('设置'+index+'的专题运营位图片未上传')
          return
        }
      }
      return true;
    },
// 验证 编辑
    editformCheck: function() {
      if(!this.editData.name) {
        this.msgErr('请输入专题运营位名称')
        return
      }
      if(!this.editData.pagePath) {
        this.msgErr('请选择专题活动')
        return
      }

        if(!this.editData.shopCode) {
            this.msgErr('投放门店未选择')
            return
        }
      if(!this.editData.startDate) {
        this.msgErr('开始时间未选择')
        return
      }
      if(!this.editData.endDate) {
        this.msgErr('结束时间未选择')
        return
      }

      if (
        this.editData.startDate >
        this.editData.endDate
      ) {
        this.msgErr(
          "开始时间不能大于结束时间"
        );
        return;
      }
      if(!this.editData.imgUrl) {
        this.msgErr('专题运营位图片未上传')
        return
      }
      
      return true;
    },

// 上传二维码超过1M提示
    handleMaxSize() {
      this.msgErr("上传图片不能超过1MB,请重新上传");
    },
// 上传二维码格式不对
    formatError() {
      this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传");
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
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
  .time {
    width: 55px;
    font-size: 14px;
    font-weight: 700;
  }
  .item{
    width: 200px;
    display: inline-block;
    margin-bottom: 5px;
  }
</style>
