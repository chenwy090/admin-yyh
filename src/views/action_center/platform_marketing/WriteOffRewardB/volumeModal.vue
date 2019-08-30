<template>
    <Modal  width="800"
            v-model="viewDialogVisible"
            title="参与活动优惠券"
    :closable="false"
    :mask-closable="false"
            footer-hide>
        <div>
            <Tabs type="card">
                <TabPane label="商超">
                    <div>
                            <Card :bordered="false" style="margin-bottom:2px">
                                <Form ref="volumeForm" label-position="right" :label-width="80" :model="volumeForm" inline>
                                    <FormItem label="商户名称" span="24" style="width:25%">
                                        <Input v-model="volumeForm.name" placeholder=" 请填写商户名称" :maxlength=20 />
                                    </FormItem>
                                    <FormItem label="省/市" span="24"  style="width:23%">
                                        <Cascader :data="addressData" :load-data="addressLoad"></Cascader>
                                    </FormItem>
                                    <FormItem label="优惠卷名称" span="24"  style="width:23%">
                                        <!--<Select v-model="searchForm.status" style="width:100%">-->
                                            <!--<Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                                        <!--</Select>-->
                                        <Input v-model="volumeForm.name" placeholder="请填写优惠卷名称" :maxlength=20 />
                                    </FormItem>
                                    <FormItem span="24" :label-width="1" style="width:23%">
                                        <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')" style="margin-right: 5px">搜索</Button>
                                        <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                        <Button icon="md-refresh" @click="reset">重置</Button>
                                    </FormItem>

                                </Form>
                            </Card>
                            <Card>
                                <Row>
                                    <RadioGroup v-model="selectIndex1" @on-change="selectBusiness(1)" style="width: 100%;">
                                        <Table
                                                :loading="TableLoading"
                                                border
                                                :columns="tableColumns"
                                                :data="listData1"
                                                sortable="custom"
                                                ref="table"
                                                @on-selection-change="handleSelect"
                                        >
                                            <template slot-scope="{ row,index }" slot="action">
                                                <Radio :label="index"><span></span></Radio>
                                            </template>
                                        </Table>
                                    </RadioGroup>
                                </Row>
                                <!-- 分页 -->
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
                            </Card>
                    </div>
                </TabPane>
                <TabPane label="商户">
                    <div>
                        <Card :bordered="false" style="margin-bottom:2px">
                            <Form ref="volumeForm" label-position="right" :label-width="80" :model="volumeForm" inline>
                                <FormItem label="商户名称" span="24" style="width:25%">
                                    <Input v-model="volumeForm.name" placeholder=" 请填写商户名称" :maxlength=20 />
                                </FormItem>
                                <FormItem label="省/市" span="24"  style="width:23%">
                                    <Cascader :data="addressData" :load-data="addressLoad"></Cascader>
                                </FormItem>
                                <FormItem label="优惠卷名称" span="24"  style="width:23%">
                                    <!--<Select v-model="searchForm.status" style="width:100%">-->
                                    <!--<Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                                    <!--</Select>-->
                                    <Input v-model="volumeForm.name" placeholder="请填写优惠卷名称" :maxlength=20 />
                                </FormItem>
                                <FormItem span="24" :label-width="1" style="width:23%">
                                    <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')" style="margin-right: 5px">搜索</Button>
                                    <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                    <Button icon="md-refresh" @click="reset">重置</Button>
                                </FormItem>

                            </Form>
                        </Card>
                        <Card>
                            <Row>
                                <RadioGroup v-model="selectIndex2" @on-change="selectBusiness(2)" style="width: 100%;">
                                    <Table
                                            :loading="TableLoading"
                                            border
                                            :columns="tableColumns"
                                            :data="listData2"
                                            sortable="custom"
                                            ref="table"
                                            @on-selection-change="handleSelect"
                                    >
                                        <template slot-scope="{ row,index }" slot="action">
                                            <Radio :label="index"><span></span></Radio>
                                        </template>
                                    </Table>
                                </RadioGroup>
                            </Row>
                            <!-- 分页 -->
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
                        </Card>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <div style="text-align: center;margin: 20px 0;">
            <Button style="margin-left: 8px;" type="primary" @click="volumeSave">保存</Button>
            <Button style="margin-left: 8px;" @click="volumeClose">关闭</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        name: "volume-modal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
          return{
              TableLoading:'',
              volumeForm:{
                  name:'',

              },
              volumeObj:{},
              addressData:[
                  {
                      value: 'beijing',
                      label: '北京',
                      children: [],
                      loading: false
                  },
                  {
                      value: 'hangzhou',
                      label: '杭州',
                      children: [],
                      loading:false
                  }
              ],
              totalSize: 0,
              current: 1,
              selectIndex1:'',
              selectIndex2:'',
              tableColumns: [
                  {
                      title: "操作",
                      width: 60,
                      align: "center",
                      slot: "action",
                      fixed: "left"
                  },
                  {
                      title: "商户名称",
                      width: 220,
                      key: "name"
                  },
                  {
                      title: "省/市",
                      width: 200,
                      key: "type"
                  },
                  {
                      title: "优惠卷名称",
                      width: 200,
                      align: "center",
                      key: "jName",
                  },
                  {
                      title: "有效期",
                      width: 200,
                      key: "time"
                  }
              ],
              listData1: [
                  {name:'一兆韦德核销券赠脉动饮料1',
                      type:'浙江/杭州',
                      time:'2019-08-03-- 2019-08-15',
                      jName:'满100减20'},
                  {name:'动饮料1',
                      type:'浙江/杭州',
                      time:'2019-08-03-- 2019-08-15',
                      jName:'满100减20'},
              ],
              listData2: [
                  {name:'一兆韦德核销券赠脉动饮2',
                      type:'浙江/杭州',
                      time:'2019-08-03-- 2019-08-15',
                      jName:'满100减20'},
                  {name:'动饮料2',
                      type:'浙江/杭州',
                      time:'2019-08-03-- 2019-08-15',
                      jName:'满100减20'},
              ],
              selectDataList: [],
          }
        },
        methods:{
            search(){
                this.loadTableData();
            },
            resetRow(item){
                console.log(123);
                this.volumeObj = item;
                this.TableLoading = false;
            },
            reset(){

            },
            addressLoad(item,callback){
                item.loading = true;
                setTimeout(() => {
                    if (item.value === 'beijing') {
                        item.children = [
                            {
                                value: 'talkingdata',
                                label: 'TalkingData'
                            },
                            {
                                value: 'baidu',
                                label: '百度'
                            },
                            {
                                value: 'sina',
                                label: '新浪'
                            }
                        ];
                    } else if (item.value === 'hangzhou') {
                        item.children = [
                            {
                                value: 'ali',
                                label: '阿里巴巴'
                            },
                            {
                                value: '163',
                                label: '网易'
                            }
                        ];
                    }
                    item.loading = false;
                    callback();
                }, 1000);
            },
            loadTableData(){

            },
            handleSelect(selection, index) {
                this.selectDataList = selection;
            },
            changeCurrent(current) {
                if (this.volumeForm.current != current) {
                    this.volumeForm.current = current;
                    this.loadTableData(this.searchForm);
                }
            },
            selectBusiness(index){
                switch (index) {
                case 1:
                    this.selectIndex2 = '';
                    this.volumeObj.JObj = this.listData1[this.selectIndex1];
                    break;
                case 2:
                    this.selectIndex1 = '';
                    this.volumeObj.JObj = this.listData2[this.selectIndex2];
                    break;
                }
            },
            volumeClose(){
                this.$emit('setViewDialogVisible', false)
            },
            volumeSave(){
                if(!this.volumeObj.JObj){
                    this.$Message.error({
                        content: "请选择优惠券",
                        duration: 3
                    });
                }
                this.$emit('setViewDialogVisible', this.volumeObj)
            }
        }
    }
</script>

<style scoped>

</style>
