<template>
  <!--新增/编辑弹窗-->
  <Modal  width="800"
          v-model="viewDialogVisible"
          title="查看详情"
          :closable="false"
          :mask-closable="false"
          footer-hide>
    <Form
            :model="modal"
            ref="addOrEditModal"
            :rules="ruleValidate"
            :label-width="80"
            label-position="left"
    >
      <Row class="padding-left-12">
        <Col span="18">
        <FormItem label="广告标题">
          <Input
                  type="text"
                  :maxlength="10"
                  v-model="modal.title"
                  placeholder="请填广告标题"
                  style="width: 30%"
          ></Input>
        </FormItem>
        </Col>
      </Row>
      <Row class="padding-left-12">
        <Col span="18">
        <FormItem label="广告图片">
          <div class="demo-upload-list">
            <img :src="modal.imgUrl">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
            </div>
          </div>
          <Modal title="View Image" v-model="visible">
            <img :src="modal.imgUrl" v-if="visible"
                 style="width: 100%">
          </Modal>
        </FormItem>
        </Col>
      </Row>
      <Row class="padding-left-12">
        <Col span="18">
        <FormItem label="投放终端">
          <div>{{modal.clientStr}}</div>
        </FormItem>
        </Col>
      </Row>
      <Row class="padding-left-12">
        <Col span="18">
        <FormItem label="投放时间">
          <div>{{modal.startTime}}--{{modal.endTime}}</div>
        </FormItem>
        </Col>
      </Row>
      <Row class="padding-left-12">
        <Col span="18">
        <FormItem label="是否跳转：">
          <div>{{['不跳转','跳转'][modal.jumpFlag]}}</div>
        </FormItem>
        </Col>
      </Row>
      <Row class="padding-left-12" v-if="modal.jumpFlag=='1'">
        <Col span="18">
        <FormItem label="跳转类型">
          <Select v-model="modal.contentType" style="width:30%" disabled>
            <Option v-for="item in contentTypeList" :value="item.value" :key="item.value">{{ item.label }}
            </Option>
          </Select>
        </FormItem>
        </Col>
      </Row>
      <Row class="padding-left-12" v-if="modal.jumpFlag=='1'&&(modal.contentType==3||modal.contentType==4)">
        <Col span="18">
        <FormItem label="跳转内容">
          <div>{{modal.contentValue}}</div>
        </FormItem>
        </Col>
      </Row>
      <Row class="padding-left-12" v-if="modal.jumpFlag=='1'&&(modal.contentType==1||modal.contentType==10||modal.contentType==11||modal.contentType==12)">
      <Col span="18">
        <FormItem label="跳转内容">
          <Button type="dashed">
            <span> {{modal.contentTitle}}</span>
          </Button>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <div style="text-align: center">
          <Button @click="close">返回</Button>
        </div>
      </Row>
    </Form>
  </Modal>
</template>

<script>
    import { uploadOperationImage2AliOssURl } from "@/api/index";
    import {postRequest, getRequest, getSyncRequest} from "@/libs/axios";
    import contentModal from "./contentModal";
    import drawModal from "./drawModal";
    // import shopModal from "./shopModal";
    // import storeView from "./store";

    export default {
        name: "add-or-edit-modal",
        props: {
            viewDialogVisible: {type: Boolean, default: false}
        },
        data() {
            return {
                visible: false,
                contentTypeList: [{value: 1, label: '专题活动'}, {value: 2, label: '抽奖广场页'}, {value: 3, label: '内链'}, {value: 4, label: '外链'}, {value: 5, label: '平台分红页'}, {value: 6, label: '领优惠页－周边券'},{value: 7, label: '领优惠页－超市券'}, {value: 10, label: '抽奖团'}, {value: 11, label: '周边券详情'},{value: 12, label: '商超券详情'}],
                clientTypeList: [{value: '1', label: '小程序'}, {value: '2', label: 'android'}, {value: 3, label: 'ios'}],
                volumeViewDialogModal: false,
                contentViewDialogModal: false,
                drawViewDialogModal: false,
                shopViewDialogModal: false,
                modal: {
                    clientType:[],
                    contentTitle: "",
                    contentType: "",
                    clientStr: "",
                    contentValue: '',
                    id:'',
                    imgUrl: '',
                    jumpFlag: '',
                    startTime: "",
                    endTime: "",
                    title: '',
                },
                ruleValidate: {}
            };
        }, methods: {
            handleView(item) {
                this.visible = true;
            },
            resetRow(row,type) {
                this.modal = {
                    clientType:[],
                    contentTitle: "",
                    contentType: "",
                    clientStr: "",
                    contentValue: '',
                    id:'',
                    imgUrl: '',
                    jumpFlag: '',
                    startTime: "",
                    endTime: "",
                    title: '',
                };
                postRequest(`/page/ad/get`,{id:row.id}).then(res => {
                    if (res.code == "200") {
                        this.modal.title = res.data.title;
                        this.modal.id = res.data.id;
                        this.modal.contentTitle = res.data.contentTitle;
                        this.modal.imgUrl = res.data.imgUrl;
                        this.modal.clientStr = res.data.clientStr;
                        this.modal.contentValue = res.data.contentValue;
                        this.modal.startTime = res.data.startTime;
                        this.modal.endTime = res.data.endTime;
                        this.modal.clientType = res.data.clientType;
                        this.modal.contentType = res.data.contentType;
                        this.modal.jumpFlag = res.data.jumpFlag;
                    }else {
                        this.$Message.error(res.msg);
                    }
                });
            },
            close() {
                this.$emit("setViewDialogVisible", false);
            }
        },
        created() {
        }
    };
</script>

<style scoped>
  .modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background: #fff;
    padding: 10px;
    z-index: 1;
  }

  h3 {
    border-left: 3px solid #333;
    padding-left: 10px;
    margin: 15px 0;
  }

  .padding-left-12 {
    padding-left: 12px;
  }

  /*.ivu-radio-group-vertical .ivu-radio-wrapper {*/
  /*height: auto;*/
  /*}*/


  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
