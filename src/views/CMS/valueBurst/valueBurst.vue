<template>
  <div style="height: 100%">
    <h2>超值爆抢券</h2>
    <Card :bordered="false" style="margin-bottom:2px">
      <Form
        label-position="right"
        ref="form"
        :model="formData"
        :rules="ruleValidate"
        :label-width="130"
      >
        <FormItem
          label="主标题："
          prop="mainTitle"
          :rules="{ required: true, validator: validateEmpty('请输入主标题', 6) }"
        >
          <Tooltip trigger="focus" title="提醒" content="最多6个汉字" placement="right">
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
          <Tooltip trigger="focus" title="提醒" content="最多12个汉字" placement="right">
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
            <Button type="primary" :disabled="submitDisabled" @click="handleSubmit('form')">保存</Button>
          </FormItem>
        </div>
      </Form>
    </Card>
    <h2 class="mgt-20">内容设置</h2>
    <div>
      <Card :bordered="false" style="margin-bottom:2px">
        <Form ref="searchForm" label-position="right" :label-width="80" :model="searchForm" inline>
          <FormItem label="优惠券" span="24" style="width:20%">
            <Input v-model="searchForm.title" placeholder="优惠券标题" />
          </FormItem>
          <FormItem label="投放门店" span="24" style="width:15%">
            <Select v-model="searchForm.shopId" style="width:100%">
              <Option
                v-for="(item, index) in shopIds"
                :value="item.shopId"
                :key="index"
              >{{ item.shopName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="终端" span="24" style="width:15%">
            <Select v-model="searchForm.pushPlatform" style="width:100%" clearable>
              <Option
                v-for="(item, index) in clientTypeList"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态" span="24" style="width:15%">
            <Select v-model="searchForm.status" style="width:100%" clearable>
              <!-- <Option value>全部</Option> -->
              <Option
                v-for="(item, index) in statusList"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="投放位置" span="24" style="width:15%">
            <Select v-model="searchForm.orderBy" style="width:100%" clearable>
              <!-- <Option value>全部</Option> -->
              <Option
                v-for="(item, index) in orderByOptions"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="推荐时间" :label-width="80">
            <DatePicker
              type="daterange"
              placeholder="请选择日期"
              style="width: 200px"
              :value="daterange"
              @on-change="changeStartDate"
            ></DatePicker>
          </FormItem>
          <!-- <FormItem label="推荐时间" span="35" style="width:50%">
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
            ></DatePicker>-
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
          </FormItem>-->
          <FormItem span="24" :label-width="1" style="width:23%">
            <Button
              type="primary"
              class="submit"
              icon="ios-search"
              @click="search"
              style="margin-right: 5px"
            >搜索</Button>
            <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
            <Button icon="md-refresh" @click="reset">重置</Button>
          </FormItem>
        </Form>
      </Card>
      <Card>
        <Row class="operation">
          <Button type="primary" icon="md-add" @click="addItem">新增</Button>
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
            <template slot-scope="params" slot="action">
              <!--<Button v-if="row.status==='0'"-->
              <!--type="success"-->
              <!--style="margin-right: 5px"-->
              <!--size="small"-->
              <!--@click="edit(row)"-->
              <!--&gt;编辑</Button>-->
              <Button
                type="text"
                style="margin-right: 5px;color:#21b6b8"
                size="small"
                @click="apiSelectById(params.row.id)"
              >查看</Button>
              <Button
                v-if="params.row.statusTxt !== '已上架'"
                type="text"
                style="margin-right: 5px;color:#ed4014"
                size="small"
                @click="doEdit(params.row.id)"
              >编辑</Button>

              <Button
                v-if="params.row.status!==0"
                type="text"
                style="margin-right: 5px;color: #2d8cf0"
                size="small"
                @click="apiUpdown(params.row.id, params.row.status)"
              >{{["","下架","上架"][params.row.status]}}</Button>
              <!-- status:  1   2下架  2  1上架 -->
              <Button
                v-if="params.row.status==0"
                type="error"
                style="margin-right: 5px"
                size="small"
                @click="confirmDel(params.row.id, params.row.title)"
              >删除</Button>
            </template>

            <template slot-scope="{ row }" slot="time">
              <div>{{row.startTime}}-{{row.endTime}}</div>
            </template>
          </Table>
        </Row>
        <!-- 分页 -->
        <Row type="flex" justify="end" class="page mgt-10">
          <Page
            :total="totalSize"
            show-total
            show-elevator
            @on-change="changeCurrent"
            style="float: right"
            :current.sync="searchForm.pageNum"
          ></Page>
        </Row>
      </Card>
    </div>
    <burst-detail ref="burstDetail" />
    <burst-edit ref="burstEdit" :show="showEdit" />
     <Modal
        v-model="showRepeatModal"
        title="新增数据重复">
        <Table
            border
            :columns="repeatColumns"
            :data="repeatList"
            sortable="custom"
            ref="table"
            @on-selection-change="handleSelect"
          >
            <template slot-scope="params" slot="action">
              <!--<Button v-if="row.status==='0'"-->
              <!--type="success"-->
              <!--style="margin-right: 5px"-->
              <!--size="small"-->
              <!--@click="edit(row)"-->
              <!--&gt;编辑</Button>-->
              <Button
                type="text"
                style="margin-right: 5px;color:#21b6b8"
                size="small"
                @click="apiSelectById(params.row.id)"
              >查看</Button>
              <Button
                v-if="params.row.statusTxt !== '已上架'"
                type="text"
                style="margin-right: 5px;color:#ed4014"
                size="small"
                @click="doEdit(params.row.id)"
              >编辑</Button>

              <Button
                v-if="params.row.status!==0"
                type="text"
                style="margin-right: 5px;color: #2d8cf0"
                size="small"
                @click="apiUpdown(params.row.id, params.row.status)"
              >{{["","下架","上架"][params.row.status]}}</Button>
              <!-- status:  1   2下架  2  1上架 -->
              <Button
                v-if="params.row.status==0"
                type="error"
                style="margin-right: 5px"
                size="small"
                @click="confirmDel(params.row.id, params.row.title)"
              >删除</Button>
            </template>

            <template slot-scope="{ row }" slot="time">
              <div>{{row.startTime}}-{{row.endTime}}</div>
            </template>
          </Table>
    </Modal>
  </div>
</template>

<script>
// import { postRequest, getRequest,getSyncRequest } from "@/libs/axios";
import { postJson, postRequest, getRequest } from "@/libs/axios";
import util from "@/libs/util";
import { baseUrl } from "@/api/index";
import comm from "@/mixins/common";
import Detail from "./Detail";
import Edit from "./AddOrEdit";
export default {
  name: "valueBurst",
  components: {
    "burst-detail": Detail,
    "burst-edit": Edit
  },
  mixins: [comm],
  data() {
    return {
      repeatList: [],
      showRepeatModal: false,
      currentTitle: "",
      showEdit: 0,
      tab: {
        id: "tab2",
        type: 2,
        label: "超值爆抢券",
        compName: "tab2"
      },

      details: {}, // 详情数据
      listData: [], // 分页查询数据
      clientTypeList: [
        { value: 0, label: "小程序" },
        { value: 1, label: "安卓" },
        { value: 2, label: "ios" }
        // {value: 3, label: '其他'},
      ],
      options1: {},
      options2: {},
      statusList: [
        { value: 0, label: "待上架" },
        { value: 1, label: "已上架" },
        { value: 2, label: "已下架" }
      ],

      // 1-6   "" 爆抢位置1-6 orderBy
      orderByOptions: [
        { value: 1, label: "爆抢位置1" },
        { value: 2, label: "爆抢位置2" },
        { value: 3, label: "爆抢位置3" },
        { value: 4, label: "爆抢位置4" },
        { value: 5, label: "爆抢位置5" },
        { value: 6, label: "爆抢位置6" }
      ],
      shopIds: [],
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
          key: "orderByName"
        },
        {
          title: "投放门店数",
          width: 150,
          align: "center",
          key: "shopNum"
        },
        {
          title: "运营状态",
          width: 100,
          align: "center",
          key: "statusTxt"
        },
        {
          title: "投放终端",
          minWidth: 150,
          align: "center",
          key: "pushPlatformList",
          render: (h, { row }) => {
            let _clients = [];
            if (Array.isArray(row.pushPlatformList)) {
              _clients = row.pushPlatformList.map(el => el.pushPlatformTxt);
            }
            return h("div", _clients.join(","));
          }
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
          key: "updateBy"
        },
        {
          title: "操作时间",
          minWidth: 200,
          align: "center",
          key: "updateTime"
        }
      ],
      repeatColumns: [
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
          key: "orderByName"
        },
        {
          title: "推荐时间",
          width: 300,
          align: "center",
          slot: "time"
        }
      ],
      daterange: [], // 时间
      searchForm: {
        startTime: "",
        endTime: "",
        status: "",
        orderBy: "",
        title: "",
        shopId: "",
        pushPlatform: "",
        pageNum: 1,
        pageSize: 10
      },
      submitDisabled: false,

      formData: {
        id: "",
        mainTitle: "", //主标题：超值爆抢券
        subTitle: "" //副标题：大家都在领
      },
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
    this.getShopList();
    const _form = JSON.stringify(this.searchForm);
    const that = this;
    this.reset = () => {
      this.daterange = []; // 时间
      this.searchForm = JSON.parse(_form);
      this.getList();
    };
  },
  methods: {
    dataRepeat(list) {
      console.log(list, 456);
      this.repeatList = list;
      this.showRepeatModal = true;
    },
    addItem() {
      this.currentTitle = "新增";
      this.showEdit = Math.random();
    },
    doEdit(id) {
      this.apiSelectById(id, data => {
        this.$refs.burstEdit.alreadyGetDetail(data);
      });
      this.currentTitle = "编辑";
      this.showEdit = Math.random();
    },
    async getShopList() {
      // /system/sys-shop-info/list
      const url = "/system/sys-shop-info/list?pageNum=1&pageSize=9999";
      let params = {};
      let { code, msg, data } = await postRequest(url, params);
      if (code == 200) {
        if (Array.isArray(data.records)) {
          this.shopIds = data.records;
        }
      } else {
        this.msgErr(msg);
      }
    },
    handleSelect(selection, index) {
      this.selectDataList = selection;
    },
    changeCurrent(current) {
      this.searchForm.pageNum = current;
      this.getList();
    },
    changeStartDate(arr) {
      // yyyy-MM-dd HH:mm:ss
      let [startTime = "", endTime = ""] = arr;
      if (startTime) {
        startTime = `${startTime} 00:00:00`;
        endTime = `${endTime} 23:59:59`;
      }
      this.searchForm.startTime = startTime;
      this.searchForm.endTime = endTime;
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
      this.getList();
    },
    reset() {
      throw new Error("此方法需要重写");
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
      let url = `/hotCoupon/list`;
      let params = {
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime,
        orderBy: this.searchForm.orderBy,
        pushPlatform: this.searchForm.pushPlatform,
        shopId: this.searchForm.shopId,
        status: this.searchForm.status,
        title: this.searchForm.title
      };
      const query = {
        shopId: this.searchForm.shopId,
        pageNum: this.searchForm.pageNum,
        pageSize: this.searchForm.pageSize
      };
      url = url + util.g_json2query(query);
      Object.assign(params, this.searchForm);
      params = util.filterNull(params);
      let { code, msg, data } = await postRequest(url, params);
      if (code == 200) {
        if (Array.isArray(data.records)) {
          this.listData = data.records;
        }
        this.totalSize = data.total;
      } else {
        this.msgErr(msg);
      }
    },
    // 上下架
    async apiUpdown(id, status) {
      const url = "/hotCoupon/updown";
      // reasonInfo 非必须 下架原因
      // sysUserName 非必须
      // let query = util.g_json2query({id, status});
      let { code, msg, data } = await postRequest(url, { id, status });
      if (code == 200) {
        let msg = "下架成功";
        if (status == 2) {
          msg = "上架成功";
        }
        this.msgOk(msg);
        this.getList();
      } else {
        this.msgErr(msg);
      }
    },
    // 查看详情
    async apiSelectById(id, cb) {
      const url = "/hotCoupon/selectById?id=" + id;
      let { code, msg, data } = await postRequest(url, { id });
      if (code == 200) {
        this.details = data;
        if (typeof cb === "function") {
          cb(data);
        } else {
          this.$refs.burstDetail.showDetail(data);
        }
      } else {
        this.msgErr(msg);
      }
      if (!cb) {
        this.$refs.burstDetail.showDetail();
      }
    },
    // 删除 ok
    async apiDel(id) {
      const url = `/hotCoupon/delete?id=${id}`;
      let { code, msg, data } = await postRequest(url, {});
      if (code == 200) {
        this.msgOk("删除成功！");
        this.getList();
      } else {
        this.msgErr(msg);
      }
    },
    confirmDel(id, title) {
      this.$Modal.confirm({
        title: "是否确定删除？",
        content: `title: ${title}, id: ${id}`,
        onOk: () => {
          this.apiDel(id);
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
.mgt-20 {
  margin-top: 20px;
}
.operation {
  margin-bottom: 2vh;
}
</style>
