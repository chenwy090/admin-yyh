<template>
  <div>
    <div v-if="!merchantRolePage">
      <Card :bordered="false">
        <Row class="operation">
          <Button type="primary" icon="md-add" @click="addInfo">新增</Button>
          <Button icon="md-refresh" @click="search">刷新</Button>
        </Row>
        <div>
          <!-- 列表 -->
          <Table border width="100%" :columns="columns" :data="roleList" :loading="TableLoading">
            <template slot-scope="{ row }" slot="action">
              <Button
                type="text"
                size="small"
                style="color: #f39913"
                v-if="row.status == '0'"
                @click="stop(row)"
              >停用</Button>
              <Button
                type="text"
                size="small"
                style="color: #368029"
                v-if="row.status == '1'"
                @click="use(row)"
              >启用</Button>
              <Button type="text" size="small" style="color:#2db7f5" @click="editInfo(row)">编辑</Button>
              <!--<Button type="text" size="small" style="color:#ed4014"
              @click="delete(row.id)">删除</Button>-->
            </template>
          </Table>
          <!-- 用户列表 -->
        </div>
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
      </Card>
    </div>

    <!-- 启用、停用 -->
    <Modal
      v-model="stopDisplay"
      title="启用/停用原因"
      width="600"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Divider style="margin-top: -10px">角色编号：{{stopRemark.roleId}}</Divider>
      <Row>
        <Input
          type="textarea"
          style="width:100%"
          v-model="stopRemark.remark"
          placeholder="200个字符以内原因"
          clearable
          :rows="2"
        />
      </Row>
      <Row style="margin:10px 0 0 456px">
        <Button type="text" @click="stopDisplay = false">取消</Button>
        <Button type="primary" @click="addStopOrUse">{{stopRemark.title}}</Button>
      </Row>
      <div>
        <Divider>操作日志</Divider>
        <Table height="350" :columns="remarkColumns" :data="remarkList"></Table>
      </div>
    </Modal>
    <!-- 启用、停用 -->

    <!-- 新增修改 -->
    <Modal
      v-model="addDisplay"
      :title="add_info.title"
      width="800"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Divider style="margin-top: 10px" v-if="add_info.id != ''">角色编号：{{add_info.id}}</Divider>
      <Row class="box">
        <Col span="4" class="left-text">
          <span style="color:red">*</span>角色类型名称
        </Col>
        <Col span="10">
          <Tooltip trigger="focus" title="提醒" content="最多10个汉字" placement="right">
            <Input
              type="text"
              v-model="add_info.name"
              style="width:300px"
              placeholder="请输入角色类型名称"
              @on-change="checkName"
              :maxlength="10"
            />
          </Tooltip>
        </Col>
      </Row>
      <Row class="box" style="margin-top: 10px">
        <Col span="4" class="left-text">
          <span style="color:red">*</span>分配权限
        </Col>
        <Col span="10">
          <Row class="box">
            <Col span="10">功能</Col>
            <Col span="10">权限</Col>
          </Row>
          <Row class="box">
            <Divider />
            <div style="width: 400px; float: left; margin-bottom: 10px;">
              <Checkbox
                :indeterminate="indeterminateCoupon"
                :value="checkAllCoupon"
                @click.prevent.native="handleCheckAllCoupon"
                style="float: left; margin-top: 2px; margin-right: 50px"
              >优惠券管理</Checkbox>
              <CheckboxGroup
                v-model="checkAllGroupCoupon"
                @on-change="checkAllGroupChangeCoupon"
                style="float: left; margin-left: -13px;"
              >
                <Checkbox label="1001">浏览</Checkbox>
                <Checkbox label="1002">新建/编辑</Checkbox>
                <Checkbox label="1003">下架</Checkbox>
              </CheckboxGroup>
            </div>
            <Divider />
            <div style="width: 400px; float: left; margin-bottom: 10px;">
              <Checkbox
                :indeterminate="indeterminateUse"
                :value="checkAllUse"
                @click.prevent.native="handleCheckAllUse"
                style="float: left; margin-top: 2px; margin-right: 50px"
              >核销管理</Checkbox>
              <CheckboxGroup
                v-model="checkAllGroupUse"
                @on-change="checkAllGroupChangeUse"
                style="float: left"
              >
                <Checkbox label="2001">核销</Checkbox>
                <Checkbox label="2002">核销记录</Checkbox>
                <Checkbox label="2003">赠券</Checkbox>
              </CheckboxGroup>
            </div>
            <Divider />
            <div style="width: 400px; float: left; margin-bottom: 10px;">
              <Checkbox
                :indeterminate="indeterminateCustomer"
                :value="checkAllCustomer"
                @click.prevent.native="handleCheckAllCustomer"
                style="float: left; margin-top: 2px; margin-right: 50px"
              >精准拓客</Checkbox>
              <CheckboxGroup
                v-model="checkAllGroupCustomer"
                @on-change="checkAllGroupChangeCustomer"
                style="float: left"
              >
                <Checkbox label="3001">浏览</Checkbox>
                <Checkbox label="3002">拓客</Checkbox>
                <Checkbox label="3003">拓客数据</Checkbox>
              </CheckboxGroup>
            </div>
            <Divider />
            <div style="width: 400px; float: left; margin-bottom: 10px;">
              <Checkbox
                :indeterminate="indeterminateIm"
                :value="checkAllIm"
                @click.prevent.native="handleCheckAllIm"
                style="float: left; margin-top: 2px; margin-right: 50px"
              >客服中心</Checkbox>
              <CheckboxGroup
                v-model="checkAllGroupIm"
                @on-change="checkAllGroupChangeIm"
                style="float: left"
              >
                <Checkbox label="4001">私信</Checkbox>
                <Checkbox label="4002">发券</Checkbox>
              </CheckboxGroup>
            </div>
            <Divider />
            <div style="width: 400px; float: left; margin-bottom: 10px;">
              <Checkbox
                :indeterminate="indeterminateAssignment"
                :value="checkAllAssignment"
                @click.prevent.native="handleCheckAllAssignment"
                style="float: left; margin-top: 2px; margin-right: 50px"
              >商户任务</Checkbox>
              <CheckboxGroup
                v-model="checkAllGroupAssignment"
                @on-change="checkAllGroupChangeAssignment"
                style="float: left"
              >
                <Checkbox label="5001">任务管理</Checkbox>
              </CheckboxGroup>
            </div>
            <Divider />
            <div style="width: 400px; float: left; margin-bottom: 10px;">
              <Checkbox
                :indeterminate="indeterminateReserveCenter"
                :value="checkAllReserveCenter"
                @click.prevent.native="handleCheckAllReserveCenter"
                style="float: left; margin-top: 2px; margin-right: 50px"
              >预约中心</Checkbox>
              <CheckboxGroup
                v-model="checkAllGroupReserveCenter"
                @on-change="checkAllGroupChangeReserveCenter"
                style="float: left"
              >
                <Checkbox label="6001">查看</Checkbox>
              </CheckboxGroup>
            </div>
            <Divider />
          </Row>
        </Col>
      </Row>
      <Row style="margin:10px 0 0 456px">
        <Button type="text" @click="addDisplay = false">取消</Button>
        <Button type="primary" @click="createOrUpdate">{{add_info.title}}</Button>
      </Row>
    </Modal>
    <!-- 新增修改 -->
  </div>
</template>

<<script>
    import {
        getRequest,
        postRequest,
        putRequest,
        deleteRequest,
        uploadFileRequest
    } from "@/libs/axios";
    import { uploadOperationImage2AliOssURl } from "@/api/index";

    export default {
        name: "merchant-role",
        data() {
            return {
                indeterminateCoupon: false,
                checkAllCoupon: false,
                checkAllGroupCoupon: [],
                indeterminateUse: false,
                checkAllUse: false,
                checkAllGroupUse: [],
                indeterminateCustomer: false,
                checkAllCustomer: false,
                checkAllGroupCustomer: [],
                indeterminateIm: false,
                checkAllIm: false,
                checkAllGroupIm: [],
                indeterminateAssignment: false,
                checkAllAssignment: false,
                checkAllGroupAssignment: [],
                indeterminateReserveCenter: false,
                checkAllReserveCenter: false,
                checkAllGroupReserveCenter: [],
                stopRemark: {
                    roleId: '',
                    remark: '',
                    title: ''
                },
                remarkColumns:[
                    {
                        title: '操作时间',
                        key: 'time',
                        minWidth: 150,
                    },
                    {
                        title: '操作人',
                        key: 'operater',
                        minWidth: 100,
                    },
                    {
                        title: '类型',
                        key: 'operateType',
                        minWidth: 100,
                    },
                    {
                        title: '原因',
                        key: 'remark',
                        minWidth: 200,
                    }
                ],
                remarkList: [],
                current: 1,
                totalSize: 0,
                stopDisplay: false,
                merchantRolePage: false,
                columns: [
                    {
                        title: '操作',
                        align: 'center',
                        fixed: 'left',
                        slot: "action",
                        minWidth: 100,
                        width: 180,
                    },
                    {
                        title: '角色编号',
                        key: 'id',
                        minWidth: 50,
                    },
                    {
                        title: '角色类型',
                        key: 'name',
                        minWidth: 100,
                    },
                    {
                        title: '状态',
                        key: 'status',
                        minWidth: 100,
                        render: (h, params) => {
                            if(params.row.status == '0') {
                              return h('span', '启用');
                            }else if(params.row.status == '1') {
                                return h('span', '停用');
                            }
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        minWidth: 150,
                    },
                    {
                        title: '创建人',
                        key: 'createBy',
                        minWidth: 100,
                    },
                    {
                        title: '修改时间',
                        key: 'updateTime',
                        minWidth: 150,
                    },
                    {
                        title: '修改人',
                        key: 'updateBy',
                        minWidth: 100,
                    }
                ],
                roleList: [],
                TableLoading: false,
                addDisplay: false,
                addStatus: false,
                add_info: {
                  id: '',
                  name: '',
                  title: '新增',
                },
            }
        },

        created: function() {
            this.userToken = {
                jwttoken: localStorage.getItem("jwttoken")
            };
        },
        methods: {
            createOrUpdate(){
                console.info(JSON.stringify(this.add_info))
                if (this.add_info.name == ''){
                    this.msgErr('名称不能为空')
                    return
                }
                if (this.checkAllGroupCoupon.length == 0 && this.checkAllGroupUse.length == 0 && this.checkAllGroupCustomer.length == 0 && this.checkAllGroupIm.length == 0 && this.checkAllGroupAssignment.length == 0 && this.checkAllGroupReserveCenter.length == 0){
                    this.msgErr('至少选择一个权限')
                    return
                }
                var reqParam = {
                    id: this.add_info.id,
                    name: this.add_info.name,
                    checkAllGroupCoupon: this.checkAllGroupCoupon,
                    checkAllGroupUse: this.checkAllGroupUse,
                    checkAllGroupCustomer: this.checkAllGroupCustomer,
                    checkAllGroupIm: this.checkAllGroupIm,
                    checkAllGroupAssignment: this.checkAllGroupAssignment,
                    checkAllGroupReserveCenter: this.checkAllGroupReserveCenter,
                };
                console.info(JSON.stringify(reqParam))
                postRequest('/merchant/MerchantRoleInfo/add', reqParam).then(res => {
                    if(res.code == 200){
                        this.msgOk(this.add_info.title + "成功");
                        this.search();
                        this.addDisplay = false;
                    }else {
                        this.TableLoading = false
                        this.msgErr(res.msg)
                    }
                });
            },
            handleCheckAllCoupon () {
                if (this.indeterminateCoupon) {
                    this.checkAllCoupon = false;
                } else {
                    this.checkAllCoupon = !this.checkAllCoupon;
                }
                this.indeterminateCoupon = false;

                if (this.checkAllCoupon) {
                    this.checkAllGroupCoupon = ['1001', '1002', '1003'];
                } else {
                    this.checkAllGroupCoupon = [];
                }
            },
            checkAllGroupChangeCoupon (data) {
                if (data.length === 3) {
                    this.indeterminateCoupon = false;
                    this.checkAllCoupon = true;
                } else if (data.length > 0) {
                    this.indeterminateCoupon = true;
                    this.checkAllCoupon = false;
                } else {
                    this.indeterminateCoupon = false;
                    this.checkAllCoupon = false;
                }
            },
            handleCheckAllUse () {
                if (this.indeterminateUse) {
                    this.checkAllUse = false;
                } else {
                    this.checkAllUse = !this.checkAllUse;
                }
                this.indeterminateUse = false;

                if (this.checkAllUse) {
                    this.checkAllGroupUse = ['2001', '2002', '2003'];
                } else {
                    this.checkAllGroupUse = [];
                }
            },
            checkAllGroupChangeUse (data) {
                if (data.length === 2) {
                    this.indeterminateUse = false;
                    this.checkAllUse = true;
                } else if (data.length > 0) {
                    this.indeterminateUse = true;
                    this.checkAllUse = false;
                } else {
                    this.indeterminateUse = false;
                    this.checkAllUse = false;
                }
            },
            handleCheckAllCustomer () {
                if (this.indeterminateCustomer) {
                    this.checkAllCustomer = false;
                } else {
                    this.checkAllCustomer = !this.checkAllCustomer;
                }
                this.indeterminateCustomer = false;

                if (this.checkAllCustomer) {
                    this.checkAllGroupCustomer = ['3001', '3002', '3003'];
                } else {
                    this.checkAllGroupCustomer = [];
                }
            },
            checkAllGroupChangeCustomer (data) {
                if (data.length === 3) {
                    this.indeterminateCustomer = false;
                    this.checkAllCustomer = true;
                } else if (data.length > 0) {
                    this.indeterminateCustomer = true;
                    this.checkAllCustomer = false;
                } else {
                    this.indeterminateCustomer = false;
                    this.checkAllCustomer = false;
                }
            },
            handleCheckAllIm () {
                if (this.indeterminateIm) {
                    this.checkAllIm = false;
                } else {
                    this.checkAllIm = !this.checkAllIm;
                }
                this.indeterminateIm = false;

                if (this.checkAllIm) {
                    this.checkAllGroupIm = ['4001', '4002'];
                } else {
                    this.checkAllGroupIm = [];
                }
            },
            checkAllGroupChangeIm (data) {
                if (data.length === 2) {
                    this.indeterminateIm = false;
                    this.checkAllIm = true;
                } else if (data.length > 0) {
                    this.indeterminateIm = true;
                    this.checkAllIm = false;
                } else {
                    this.indeterminateIm = false;
                    this.checkAllIm = false;
                }
            },
            handleCheckAllAssignment () {
                if (this.indeterminateAssignment) {
                    this.checkAllAssignment = false;
                } else {
                    this.checkAllAssignment = !this.checkAllAssignment;
                }
                this.indeterminateAssignment = false;

                if (this.checkAllAssignment) {
                    this.checkAllGroupAssignment = ['5001'];
                } else {
                    this.checkAllGroupAssignment = [];
                }
            },
            checkAllGroupChangeAssignment (data) {
                if (data.length === 1) {
                    this.indeterminateAssignment = false;
                    this.checkAllAssignment = true;
                } else if (data.length > 0) {
                    this.indeterminateAssignment = true;
                    this.checkAllAssignment = false;
                } else {
                    this.indeterminateAssignment = false;
                    this.checkAllAssignment = false;
                }
            },
            handleCheckAllReserveCenter () {
                if (this.indeterminateReserveCenter) {
                    this.checkAllReserveCenter = false;
                } else {
                    this.checkAllReserveCenter = !this.checkAllReserveCenter;
                }
                this.indeterminateReserveCenter = false;

                if (this.checkAllReserveCenter) {
                    this.checkAllGroupReserveCenter = ['6001'];
                } else {
                    this.checkAllGroupReserveCenter = [];
                }
            },
            checkAllGroupChangeReserveCenter (data) {
                if (data.length === 1) {
                    this.indeterminateReserveCenter = false;
                    this.checkAllReserveCenter = true;
                } else if (data.length > 0) {
                    this.indeterminateReserveCenter = true;
                    this.checkAllReserveCenter = false;
                } else {
                    this.indeterminateReserveCenter = false;
                    this.checkAllReserveCenter = false;
                }
            },
            checkName() {

            },
            search(){
                this.current = 1;
                this.totalSize = 0;
                this.getRoleList();
            },
            stop(row){
                this.stopRemark.remark = '';
                this.stopDisplay = true;
                this.stopRemark.roleId = row.id;
                this.stopRemark.title = '停用';
                this.stopRemark.status = row.status;
                if(row.remark){
                    this.remarkList = JSON.parse(row.remark);
                }else {
                    this.remarkList = [];
                }
            },
            use(row){
                this.stopRemark.remark = '';
                //this.stopDisplay = true;
                this.stopRemark.roleId = row.id;
                this.stopRemark.title = '启用';
                this.stopRemark.status = row.status;
                var reqParam = {
                    id: this.stopRemark.roleId,
                    remark: this.stopRemark.remark.trim(),
                    status: this.stopRemark.status
                };
                postRequest("/merchant/MerchantRoleInfo/stop",
                    reqParam
                ).then(res => {
                    if(res.code == 200){
                        this.msgOk(this.stopRemark.title + '成功')
                        this.stopDisplay = false
                        this.search()
                    }else {
                        this.msgErr(res.msg)
                    }
                });
            },
            addStopOrUse(){
                console.info(this.stopRemark)
                if(this.stopRemark.remark.trim() == ""){
                    this.msgErr(this.stopRemark.remark + '原因不能为空');
                    return;
                }
                var reqParam = {
                    id: this.stopRemark.roleId,
                    remark: this.stopRemark.remark.trim(),
                    status: this.stopRemark.status
                };
                postRequest("/merchant/MerchantRoleInfo/stop",
                    reqParam
                ).then(res => {
                    if(res.code == 200){
                        this.msgOk(this.stopRemark.title + '成功')
                        this.stopDisplay = false
                        this.search()
                    }else {
                        this.msgErr(res.msg)
                    }
                });
            },

            delete(){

            },
            init(){
                this.getRoleList();
            },
            //查询所有角色列表
            getRoleList() {
                this.TableLoading = true;
                postRequest('/merchant/MerchantRoleInfo/list?isAsc=DESC&orderByColumn=1&pageNum='+ this.current +'&pageSize=10', {}).then(res => {
                    if(res.code == 200){
                        // console.log(res);
                        this.roleList = res.data.records
                        this.current = res.data.current
                        this.totalSize = res.data.total
                        this.TableLoading = false
                    }else {
                        this.TableLoading = false
                        this.msgErr(res.msg)
                    }
                });
            },

            addInfo() {
                this.add_info = {
                    id: '',
                    name: '',
                    title: '新增',
                };
                this.checkAllGroupCoupon = [];
                this.checkAllGroupUse = [];
                this.checkAllGroupCustomer = [];
                this.checkAllGroupIm = [];
                this.checkAllGroupAssignment = [];
                this.checkAllGroupReserveCenter = [];
                this.addDisplay = true;
            },
            //编辑
            editInfo(item) {
                this.add_info = {
                    id: item.id,
                    name: '',
                    title: '编辑',
                };
                this.selectById();
                this.addDisplay = true;
            },
            selectById(){
                if (this.add_info.id != ''){
                    postRequest("/merchant/MerchantRoleInfo/selectById?id=" + this.add_info.id).then(res => {
                        if (res.code == 200) {
                            this.add_info.id = res.data.id;
                            this.add_info.name = res.data.name;
                            this.checkAllGroupCoupon = res.data.checkAllGroupCoupon;
                            this.checkAllGroupUse = res.data.checkAllGroupUse;
                            this.checkAllGroupCustomer = res.data.checkAllGroupCustomer;
                            this.checkAllGroupIm = res.data.checkAllGroupIm;
                            this.checkAllGroupAssignment = res.data.checkAllGroupAssignment;
                            this.checkAllGroupReserveCenter = res.data.checkAllGroupReserveCenter;
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            },

// 分页（点击第几页）
            changeCurrent: function (current) {
                this.current = current;
                this.getRoleList();
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

            //返回列表
            back() {
                this.$emit("changeStatus", false);
            },

        },
        mounted() {
            this.init();
        }
    };
</script>
<style lang="less" scoped>
.operation {
  margin-bottom: 2vh;
}
</style>
