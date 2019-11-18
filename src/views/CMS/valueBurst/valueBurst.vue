<template>
  <div style="height: 100%">
    <h2>超值爆抢券</h2>
    <Card :bordered="false" style="margin-bottom:2px">
        <Form
          label-position="right"
          ref="form"
          :model="formData"
          :rules="ruleValidate"
          :label-width="130">
            <FormItem
                label="主标题："
                prop="mainTitle"
                :rules="{ required: true, validator: validateEmpty('请输入主标题', 6) }">
                <Tooltip
                trigger="focus"
                title="提醒"
                content="最多6个汉字"
                placement="right"
                >
                <Input
                    style="width:200px"
                    v-model="formData.mainTitle"
                    :maxlength="20"
                    placeholder="请输入主标题"
                    clearable
                />
                </Tooltip>
            </FormItem>
            <!-- :rules="{ required: formData.subTitle.length, message: '请输入副标题' }" -->
            <FormItem label="副标题：" prop="subTitle" :rules="subTitleRules">
                <Tooltip
                trigger="focus"
                title="提醒"
                content="最多12个汉字"
                placement="right"
                >
                <Input
                    style="width:200px"
                    v-model="formData.subTitle"
                    :maxlength="20"
                    placeholder="请输入副标题"
                    clearable
                    @on-clear="clearValidateMsg('subTitle')"
                />
                </Tooltip>
            </FormItem>
            <div style="margin-top:20px;">
                <FormItem label>
                <Button
                    type="primary"
                    :disabled="submitDisabled"
                    @click="handleSubmit('form')"
                    >保存</Button
                >
                </FormItem>
            </div>
        </Form>
    </Card>
    <h2>内容设置</h2>
    <div>
      <Card :bordered="false" style="margin-bottom:2px">
        <Form
          ref="searchForm"
          label-position="right"
          :label-width="80"
          :model="searchForm"
          inline>
          
          <FormItem label="优惠券" span="24" style="width:20%">
            <Input v-model="searchForm.title" placeholder="优惠券标题" />
          </FormItem>
          <FormItem label="投放门店" span="24" style="width:15%">
            <Select v-model="searchForm.shopId" style="width:100%">
              <Option
                v-for="(item, index) in merchantList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="终端" span="24" style="width:15%">
            <Select v-model="searchForm.pushPlatform" style="width:100%">
              <Option
                v-for="(item, index) in clientTypeList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="状态" span="24" style="width:15%">
            <Select v-model="searchForm.status" style="width:100%">
              <Option value="">全部</Option>
              <Option
                v-for="(item, index) in statusList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="投放位置" span="24" style="width:15%">
            <Select v-model="searchForm.status" style="width:100%">
              <Option value="">全部</Option>
              <Option
                v-for="(item, index) in statusList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>

          <FormItem label="推荐时间" span="35" style="width:50%">
            <DatePicker
              :value="searchForm.startTime"
              type="date"
              placeholder
              style="width: 40%"
              :options="options1"
              @on-change="
                datetime => {
                  changeDateTime(datetime, 1);
                }
              "
            ></DatePicker>
            -
            <DatePicker
              :value="searchForm.endTime"
              type="date"
              placeholder
              style="width: 40%"
              :options="options2"
              @on-change="
                datetime => {
                  changeDateTime(datetime, 2);
                }
              "
            ></DatePicker>
          </FormItem>
          <FormItem span="24" :label-width="1" style="width:23%">
            <Button
              type="primary"
              class="submit"
              icon="ios-search"
              @click="search"
              style="margin-right: 5px"
              >搜索</Button
            >
            <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
            <Button icon="md-refresh" @click="reset">重置</Button>
          </FormItem>
        </Form>
      </Card>
        <Card>
            <Row class="operation">
                <Button type="primary" icon="md-add">新增</Button>
            </Row>
            <Row>
                <Table
                        :loading="TableLoading"
                        border
                        :columns="tableColumns"
                        :data="listData"
                        sortable="custom"
                        ref="table"
                        @on-selection-change="handleSelect"
                >
                    <template slot-scope="{ row }" slot="action">
                        <!--<Button v-if="row.status==='0'"-->
                        <!--type="success"-->
                        <!--style="margin-right: 5px"-->
                        <!--size="small"-->
                        <!--@click="edit(row)"-->
                        <!--&gt;编辑</Button>-->
                        <Button
                                type="info"
                                style="margin-right: 5px"
                                size="small"
                                @click="showDetail(row)"
                        >查看</Button>
                        <Button
                                v-if="row.status=='0'||row.status=='2'"
                                type="error"
                                style="margin-right: 5px"
                                size="small"
                                @click="edit(row)"
                        >编辑</Button>
                        <Button
                                v-if="row.status=='1'"
                                type="error"
                                style="margin-right: 5px"
                                size="small"
                                @click="apiUpdown(row.id, row.status)"
                        >{{row.status==1? '下': '上'}}架</Button>
                        <Button
                                v-if="row.status=='0'||row.status=='2'"
                                type="error"
                                style="margin-right: 5px"
                                size="small"
                                @click="apiAdd(row.id)"
                        >删除</Button>
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <div>{{['待上架','已上架', '已下架'][row.status]}}</div>
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        <div>{{row.startTime}}-{{row.endTime}}</div>
                    </template>
                </Table>
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
  </div>
</template>

<script>
// import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
import { postJson, postRequest } from "@/libs/axios";
import { baseUrl } from "@/api/index";
import comm from "@/mixins/common";
export default {
  name: "valueBurst",
  components: {},
  mixins: [comm],
  data() {
    return {
        tab: {
            id: "tab6",
            type: 6,
            name: "xxx",
            label: "好券一起领",
            compName: "tab6"
        },

        details: {}, // 详情数据
        listData: [], // 分页查询数据
        clientTypeList: [
            {value: 0, label: '小程序'},
            {value: 1, label: '安卓'},
            {value: 2, label: 'ios'},
            {value: 3, label: '其他'},
        ],
        options1: {},
        options2: {},
        statusList: [
            { value: 0, label: "待上架" },
            { value: 1, label: "已上架" },
            { value: 2, label: "已下架" }
        ],
        merchantList: [],
        TableLoading: false,
        tableColumns: [
            {
                title: "操作",
                width: 250,
                align: "left",
                slot: "action",
                fixed: "left"
            },
            {
                title: "ID",
                width: 200,
                align: "center",
                key: "id"
            },
            {
                title: "优惠券名称",
                width: 200,
                align: "center",
                key: "title"
            },
            {
                title: "投放位置",
                width: 150,
                align: "center",
                key: "id"
            },
            {
                title: "投放门店数",
                width: 150,
                align: "center",
                key: "id"
            },
            {
                title: "运营状态",
                width: 100,
                align: "center",
                slot: "status",
            },
            {
                title: "投放终端",
                minWidth: 150,
                align: "center",
                key: "clientStr"
            },
            {
                title: "推荐时间",
                width: 300,
                align: "center",
                slot: "time"
            },
            {
                title: "操作人",
                minWidth: 100,
                align: "center",
                key: "modifiedBy"
            },
            {
                title: "操作时间",
                minWidth: 200,
                align: "center",
                key: "gmtModified"
            }
        ],
        searchForm: {
            startTime: "",
            endTime: "",
            status: '',
            orderBy: '',
            title: "",
            shopId: '',
            pushPlatform: '',
            pageNum: 1,
            pageSize: 10,
        },
        submitDisabled: false,
        formData: {
            id: "",
            mainTitle: "", //主标题：超值爆抢券
            subTitle: "" //副标题：大家都在领
        },
        current: 1,
        totalSize: 0,
        ruleValidate: {}
    };
  },
  computed: {
    subTitleRules() {
      if (this.formData.subTitle.length) {
        return {
          required: true,
          validator: this.validateEmpty("请输入副标题", 12)
        };
      } else {
        return { required: false };
      }
    }
  },
  watch: {
    ["formData.subTitle"]() {
      this.formData.subTitle = this.formData.subTitle.trim();
      if (this.formData.subTitle.length) {
        this.$refs.form.validateField("subTitle");
      } else {
        //清空校验
        this.clearValidateMsg("subTitle");
      }
    }
  },
  created() {
    this.getData();
    this.getList();
    const _form = JSON.stringify(this.searchForm);
    const that = this;
    this.reset = () => {
        this.searchForm = JSON.parse(_form);
        this.getList();
    }
  },
  activated() {},
  methods: {
    handleSelect(selection, index) {
        this.selectDataList = selection;
    },
    changeCurrent(current) {
        if (this.searchForm.pageNum != current) {
            this.searchForm.pageNum = current;
            this.loadTableData(current);
        }
    },
    changeDateTime(datetime, index) {
      if (!datetime) {
        return;
      }
      switch (index) {
        case 1:
          this.searchForm.startTime = datetime ? datetime + " 00:00:00" : "";
          this.options2 = {
            disabledDate(date) {
              return date.valueOf() < new Date(datetime) - 1000 * 60 * 60 * 24;
            }
          };
          break;
        case 2:
          this.searchForm.endTime = datetime ? datetime + " 23:59:59" : "";
          this.options1 = {
            disabledDate(date) {
              return (
                date.valueOf() < Date.now() - 1000 * 60 * 60 * 24 ||
                date.valueOf() > new Date(datetime)
              );
            }
          };
          break;
      }
    },
    search() {
      this.searchForm.pageNum = 1;
      this.current = 1;
      this.getList();
    },
    reset() {
      throw new Error('此方法需要重写');
    },
    async getData() {
      const url = "/page/module/layout/getCommonSetting";
      const { type } = this.tab;
      const site = 1;
      let { code, msg, data } = await postRequest(url, { type, site });
      if (code == 200) {
        if (data == "") {
          data = {
            id: "",
            type: "",
            mainTitle: "", //主标题：超值爆抢券
            subTitle: "", //副标题：大家都在领
            iconUrl: "" //副标题：大家都在领
          };
        }
        this.formData = data;
      } else {
        this.msgErr(msg);
      }
    },
    async getList() {
      const url = "/hotCoupon/list";
      const site = 1;
      let params = {
        // endTime	string
        // allowEmptyValue: false
        // 结束时间 yyyy_MM_dd

        // orderBy	integer($int32)
        // allowEmptyValue: false
        // 爆抢位置1-6

        // pushPlatform	integer($int32)
        // allowEmptyValue: false
        // 投放终端 0 小程序 1 安卓 2 ios 3其他

        // shopId	string
        // allowEmptyValue: false
        // 门店

        // startTime	string
        // allowEmptyValue: false
        // 开始时间 yyyy_MM_dd

        // status	integer($int32)
        // allowEmptyValue: false
        // 状态 0待上架 1 上架 2下架

        // title	string
        // allowEmptyValue: false
        // 优惠券标题
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime,
        orderBy: this.searchForm.orderBy,
        pushPlatform: this.searchForm.pushPlatform,
        shopId: this.searchForm.shopId,
        status: this.searchForm.status,
        title: this.searchForm.title
      };
      params = {};
      let { code, msg, data } = await postRequest(url, params);
      if (code == 200) {
        console.log(data);
        this.listData = data;
      } else {
        this.msgErr(msg);
      }
    },
    // 上下架
    async apiUpdown(id, status) {
      const url = "/hotCoupon/updown";
      // reasonInfo 非必须 下架原因
      // sysUserName 非必须 
      let { code, msg, data } = await postRequest(url, {id, status});
      if (code == 200) {
        console.log(data);
        this.listData = data;
      } else {
        this.msgErr(msg);
      }
    },
    // 查看详情
    async apiSelectById(id) {
      const url = "/hotCoupon/selectById";
      const site = 1;
      let { code, msg, data } = await postRequest(url, {id});
      if (code == 200) {
        console.log(data);
        this.details = data;
      } else {
        this.msgErr(msg);
      }
    },
    // 编辑
    async apiEdit() {
      const url = "/hotCoupon/edit";
      const site = 1;
      let params = {
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime,
        orderBy: this.searchForm.orderBy,
        pushPlatform: this.searchForm.pushPlatform,
        shopId: this.searchForm.shopId,
        status: this.searchForm.status,
        title: this.searchForm.title
      };
      params = {};
      let { code, msg, data } = await postRequest(url, params);
      if (code == 200) {
        console.log(data);
        this.listData = data;
      } else {
        this.msgErr(msg);
      }
    },
    // 删除
    async apiSelectById() {
      const url = "/hotCoupon/delete";
      const site = 1;
      let params = {
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime,
        orderBy: this.searchForm.orderBy,
        pushPlatform: this.searchForm.pushPlatform,
        shopId: this.searchForm.shopId,
        status: this.searchForm.status,
        title: this.searchForm.title
      };
      params = {};
      let { code, msg, data } = await postRequest(url, params);
      if (code == 200) {
        console.log(data);
        this.listData = data;
      } else {
        this.msgErr(msg);
      }
    },
    // 新增
    async apiAdd(id) {
      const url = "/hotCoupon/add";
      let { code, msg, data } = await postRequest(url, {id});
      if (code == 200) {
        console.log(data);
        this.listData = data;
      } else {
        this.msgErr(msg);
      }
    },
    validateEmpty(msg, len = 20) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        if (value.length > len) {
          return callback(`最多只能输入${len}个汉字`);
        }
        callback();
      };
    },
    //清空校验
    clearValidateMsg(name) {
      this.$refs.form.fields.some(function(e) {
        let r = e.prop == name;
        r && e.resetField();
        return r;
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        console.log("valid", valid);
        if (!valid) {
          this.msgErr("数据验证失败！");
          return;
        }

        //清洗数据
        let formData = JSON.parse(JSON.stringify(this.formData));
        const { type } = this.tab;
        formData.site = 1;
        formData.type = type;

        // 超值爆抢首页配置
        const url = "/page/module/layout/saveCommonSetting";
        postRequest(url, formData).then(res => {
          if (res.code == 200) {
            this.msgOk("保存成功");
          } else {
            this.msgErr(res.msg);
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.operation {
  margin-bottom: 2vh;
}
.confirm-textarea {
  width: 100%;
  height: 100px;
  padding: 5px;
  outline: none;
}
</style>
