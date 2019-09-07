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
                                        <Cascader :data="addressData" :load-data="addressLoad" v-model="addressValue"></Cascader>
                                    </FormItem>
                                    <FormItem label="优惠卷名称" span="24"  style="width:23%">
                                        <!--<Select v-model="searchForm.status" style="width:100%">-->
                                            <!--<Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                                        <!--</Select>-->
                                        <Input v-model="volumeForm.name" placeholder="请填写优惠卷名称" :maxlength=20 />
                                    </FormItem>
                                    <FormItem span="24" :label-width="1" style="width:23%">
                                        <Button type="primary" class="submit" icon="ios-search" @click="search(1)" style="margin-right: 5px">搜索</Button>
                                        <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                        <Button icon="md-refresh" @click="reset">重置</Button>
                                    </FormItem>

                                </Form>
                            </Card>
                            <Card>
                                <Row>
                                    <RadioGroup v-model="selectIndex1" @on-change="selectBusiness(1)" style="width: 100%;">
                                        <Table
                                                :loading="TableLoading1"
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
                                            <template slot-scope="{ row,index }" slot="address">
                                                <div>{{row.province+'/'+row.city}}</div>
                                            </template>
                                            <template slot-scope="{ row,index }" slot="timer">
                                                <div>{{row.startDate+'/'+row.endDate}}</div>
                                            </template>
                                        </Table>
                                    </RadioGroup>
                                </Row>
                                <!-- 分页 -->
                                <Row type="flex" justify="end" class="page">
                                    <Page
                                            :total="totalSize1"
                                            show-total
                                            show-elevator
                                            @on-change="changeCurrent1"
                                            style="float: right"
                                            :current.sync="current1"
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
                                    <Cascader :data="addressData" :load-data="addressLoad" v-model="addressValue"></Cascader>
                                </FormItem>
                                <FormItem label="优惠卷名称" span="24"  style="width:23%">
                                    <!--<Select v-model="searchForm.status" style="width:100%">-->
                                    <!--<Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                                    <!--</Select>-->
                                    <Input v-model="volumeForm.name" placeholder="请填写优惠卷名称" :maxlength=20 />
                                </FormItem>
                                <FormItem span="24" :label-width="1" style="width:23%">
                                    <Button type="primary" class="submit" icon="ios-search" @click="search(2)" style="margin-right: 5px">搜索</Button>
                                    <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                                    <Button icon="md-refresh" @click="reset">重置</Button>
                                </FormItem>

                            </Form>
                        </Card>
                        <Card>
                            <Row>
                                <RadioGroup v-model="selectIndex2" @on-change="selectBusiness(2)" style="width: 100%;">
                                    <Table
                                            :loading="TableLoading2"
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
                                        <template slot-scope="{ row,index }" slot="address">
                                            <div>{{row.province+'/'+row.city}}</div>
                                        </template>
                                        <template slot-scope="{ row,index }" slot="timer">
                                            <div>{{row.useStartTime+'/'+row.useEndTime}}</div>
                                        </template>
                                    </Table>
                                </RadioGroup>
                            </Row>
                            <!-- 分页 -->
                            <Row type="flex" justify="end" class="page">
                                <Page
                                        :total="totalSize2"
                                        show-total
                                        show-elevator
                                        @on-change="changeCurrent2"
                                        style="float: right"
                                        :current.sync="current2"
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
    import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
    export default {
        name: "volume-modal",
        props: {
            viewDialogVisible: { type: Boolean, default: false }
        },
        data(){
          return{
              TableLoading1:'',
              TableLoading2:'',
              volumeForm:{
                  name:'',
                  current2:1,
                  current1:1,
              },
              volumeObj:{},
              addressData:[],
              totalSize1: 0,
              totalSize2: 0,
              current1: 1,
              current2: 1,
              addressValue:[],
              selectIndex1:'',
              selectIndex2:'',
              tableColumns: [
                  {
                      title: "操作",
                      width: 80,
                      align: "center",
                      slot: "action",
                      fixed: "left"
                  },
                  {
                      title: "商户名称",
                      width: 220,
                      key: "merchantName"
                  },
                  {
                      title: "省/市",
                      width: 200,
                      slot: "address"
                  },
                  {
                      title: "优惠卷名称",
                      width: 200,
                      align: "center",
                      key: "title",
                  },
                  {
                      title: "有效期",
                      width: 200,
                      slot: "timer"
                  }
              ],
              listData1: [],
              listData2: [],
              selectDataList: [],
          }
        },
        methods:{
            search(type){
                switch (type) {
                case 1:
                    this.loadTableData1();
                    break;
                case 2:
                    this.loadTableData2();
                    break;
                }
            },
            resetRow(item){
                this.volumeForm.merchantName = '';
                this.volumeForm.couponName = '';
                this.addressValue = [];
                this.volumeObj = item;
                this.TableLoading = false;
                this.loadTableData1(item);
                this.loadTableData2(item);
            },
            reset(){

            },
            getProvinceList(formData) {
                postRequest(`/system/area/province/list`,{}).then(res => {
                    if (res.code === "200") {
                        console.log(res);
                        this.addressData = res.data||[];
                        if(this.addressData.length){
                            this.addressData.forEach(function(v){
                                v.value = v.provinceCode
                                v.label = v.shortName;
                                v.children= [];
                                v.loading = false
                            })
                        }
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            addressLoad(item,callback){
                item.loading = true;
                getSyncRequest("/system/area/city/" + item.provinceCode).then(res =>{
                    if (res.code === "200") {
                        item.children = res.data||[];
                        item.loading = false;
                        if(item.children.length){
                            item.children.forEach(function(v){
                                v.label = v.shortName;
                                v.value = v.cityCode
                            })
                        }
                        callback();
                    } else {
                        this.$Message.error("获取数据失败");
                        item.loading = false;
                        callback();
                    }
                });
            },
            loadTableData1(){
                var that = this;
                var item = this.volumeObj
                this.totalSize1 = 0;
                this.listData1 = [];
                this.TableLoading1 = true;
                this.selectIndex1 = '';
                let params = {
                    page:this.volumeForm.current1,
                    size:10,
                    cityCode:this.addressValue[1]||'',
                    couponName:this.volumeForm.couponName,
                    merchantName:this.volumeForm.merchantName,
                    provinceCode:this.addressValue[0]||'',
                }
                //商户券列表
                postRequest(`/coupon/superMarket/list?pageNum=${this.current1}&pageSize=10`,params
                ).then(res => {
                    this.TableLoading1 = false;
                    if (res.code === "200") {
                        this.totalSize1 = res.data.total;
                        this.listData1 = res.data.records;
                        if(item&&item.awardAmount){
                            res.data.records.forEach(function(v,i){
                                if(v.templateId ===(item.awardAmount||item.award)){
                                    that.selectIndex1 = i;
                                }
                            })
                        }
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            loadTableData2(){
                var that = this;
                var item = this.volumeObj
                this.totalSize2 = 0;
                this.listData2 = [];
                this.TableLoading2 = true;
                this.selectIndex2 = '';
                let params = {
                    page:this.volumeForm.current2,
                    size:10,
                    cityCode:this.addressValue[1]||'',
                    couponName:this.volumeForm.couponName,
                    merchantName:this.volumeForm.merchantName,
                    provinceCode:this.addressValue[0]||'',
                }
                //商超券列表
                postRequest(`/coupon/merchant/list?pageNum=${this.current2}&pageSize=10`,params
                ).then(res => {
                    this.TableLoading2 = false;
                    if (res.code === "200") {
                        this.totalSize2 = res.data.total;
                        this.listData2 = res.data.records;
                        if(item&&item.awardAmount){
                            res.data.records.forEach(function(v,i){
                                if(v.templateId === (item.awardAmount||item.award)){
                                    that.selectIndex2 = i;
                                }
                            })
                        }
                    } else {
                        this.$Message.error("获取数据失败");
                    }
                });
            },
            handleSelect(selection, index) {
                this.selectDataList = selection;
            },
            changeCurrent1(current) {
                if (this.volumeForm.current1 != current) {
                    this.volumeForm.current1 = current;
                    this.loadTableData1();
                }
            },
            changeCurrent2(current) {
                if (this.volumeForm.current2 != current) {
                    this.volumeForm.current2 = current;
                    this.loadTableData2();
                }
            },
            selectBusiness(index){
                switch (index) {
                case 1:
                    this.selectIndex2 = '';
                    this.volumeObj.JObj = this.listData1[this.selectIndex1];
                    this.volumeObj.awardName = this.listData1[this.selectIndex1].title;
                    this.volumeObj.couponType = '1';
                    this.volumeObj.awardAmount = this.listData1[this.selectIndex1].templateId;
                    break;
                case 2:
                    this.selectIndex1 = '';
                    this.volumeObj.JObj = this.listData2[this.selectIndex2];
                    this.volumeObj.awardName = this.listData1[this.selectIndex1].title;
                    this.volumeObj.couponType = '2';
                    this.volumeObj.awardAmount = this.listData1[this.selectIndex1].templateId;
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
        },
        created(){
            this.getProvinceList();
        }
    }
</script>

<style scoped>

</style>
