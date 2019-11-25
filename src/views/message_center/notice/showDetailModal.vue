<template>
  <!--新增/编辑弹窗-->
  <!--<Modal width="800"-->
  <!--v-model="viewDialogVisible"-->
  <!--:title="titleName"-->
  <!--:closable="false"-->
  <!--:mask-closable="false"-->
  <!--footer-hide>-->
  <div v-if="viewDialogVisible" class="modal">
    <Card>
      <p slot="title">查看详情</p>
      <a href="#" slot="extra">
        <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
      </a>
      <Form
              :model="modal"
              ref="addOrEditModal"
              :rules="ruleValidate"
              :label-width="80"
              label-position="left"
      >
        <Row class="padding-left-12">
          <Col span="18">
          <FormItem label="公告标题">
            <div>{{modal.title}}</div>
          </FormItem>
          </Col>
        </Row>
        <Row class="padding-left-12">
          <Col span="18">
          <FormItem label="公告内容">
            <div>{{modal.contentInfo}}</div>
          </FormItem>
          </Col>
        </Row>
        <Row class="padding-left-12">
          <Col span="18">
          <FormItem label="有效期">
            <div>{{modal.startTime}}-{{modal.endTime}}</div>
          </FormItem>
          </Col>
        </Row>
        <h3>推送目标</h3>
        <div style="padding: 20px;border: 1px solid #999;">
          <Row class="padding-left-12">
            <Col span="18">
            <FormItem label="推送对象">
              <Select v-model="modal.pushType" style="width:30%" disabled>
                <Option v-for="item in pushTypeList" :value="item.value" :key="item.value">{{item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row class="padding-left-12">
            <Col span="18">
            <FormItem label="推送范围">
              <!--<RadioGroup v-model="modal.pushRange">-->
                <!--<Radio :label="'1'"></Radio>-->
                <!--<Radio :label="'2'">部分商户</Radio>-->
              <!--</RadioGroup>-->
              <div>{{['','所有商户','部分商户'][modal.pushRange]}}
                <span v-if="modal.pushRange=='2'">{{shopList.length}}家</span>
              </div>
              <div>
                <Button v-if="modal.pushRange=='2'&&shopList.length" type="dashed" style="max-width: 100%;">
                  <Button :key="index" v-for="(item,index) in shopList" class="coupon-item" style="float: left;margin: 5px;">
                    {{item.shopName +'&nbsp&nbsp'}}
                    <Icon type="ios-close"/>
                  </Button>
                </Button>
              </div>
            </FormItem>
            </Col>
          </Row>
        </div>
        <FormItem>
          <!--<Button style="margin:20px" type="primary" size="large" @click="ok()">保存</Button>-->
          <Button style="margin:20px" @click="close">返回</Button>
        </FormItem>
      </Form>
    </Card>
    <!--</Modal>-->
    <!--<volumeModal-->
    <!--ref="volumeModal"-->
    <!--:viewDialogVisible="volumeViewDialogModal"-->
    <!--@setViewDialogVisible="selectContent"-->
    <!--&gt;</volumeModal>-->
    <!--<contentModal-->
    <!--ref="contentModal"-->
    <!--:viewDialogVisible="contentViewDialogModal"-->
    <!--@setViewDialogVisible="selectContent"-->
    <!--&gt;</contentModal>-->
    <!--<drawModal-->
    <!--ref="drawModal"-->
    <!--:viewDialogVisible="drawViewDialogModal"-->
    <!--@setViewDialogVisible="selectContent"-->
    <!--&gt;</drawModal>-->
    <!--<shopModal-->
    <!--ref="shopModal"-->
    <!--:viewDialogVisible="shopViewDialogModal"-->
    <!--@setViewDialogVisible="selectContent"-->
    <!--&gt;</shopModal>-->
  </div>
</template>

<script>
    import {postRequest, getRequest, getSyncRequest} from "@/libs/axios";

    export default {
        name: "show-detail-modal",
        // components: {volumeModal, contentModal, drawModal,shopModal,storeView},
        props: {
            viewDialogVisible: {type: Boolean, default: false}
        },
        data() {
            return {
                titleName:'',
                pushTypeList: [{value: '1', label: '商户'}, {value: '2', label: '用户'}],
                volumeViewDialogModal: false,
                contentViewDialogModal: false,
                drawViewDialogModal: false,
                shopViewDialogModal: false,
                shopList:[],
                modal: {
                    title: "",
                    pushType: "",
                    contentInfo: '',
                    startTime: "",
                    endTime: "",
                    pushType:'',
                    pushRange: '',
                    shopId:[],
                },
                ruleValidate: {}
            };
        }, methods: {
            resetRow(row) {
                this.shopList = [];
                this.modal={
                    title: "",
                    pushType: "",
                    contentInfo: '',
                    startTime: "",
                    endTime: "",
                    pushType:'',
                    pushRange: '',
                    shopId:[]
                };
                postRequest(`/announcement/selectById?id=${row.id}`, {id:row.id}).then(res => {
                    console.log(res);
                    if (res.code == "200") {
                        this.modal = res.data;
                        this.modal.pushType = String(res.data.pushType);
                        this.modal.pushRange = String(res.data.pushRange);
                        this.shopList = res.data.shopInfoList||[];
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

<style  lang="less" scoped>
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
