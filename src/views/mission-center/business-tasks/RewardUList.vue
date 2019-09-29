<template>
  <div class="xxx">
    <!-- 赏U列表 RewardUList   -->
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="任务名称：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.name" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="审核：" :label-width="60">
            <Select v-model="searchData.status" style="width:120px" clearable>
              <Option v-for="(v,k) in statusOption" :value="k" :key="k">{{ v }}</Option>
              <!-- <Option v-for="(item,k) in statusOption" :value="item.value" :key="k">{{ item.label }}</Option> -->
            </Select>
          </FormItem>

          <FormItem label="状态：" :label-width="60">
            <Select v-model="searchData.isStop" style="width:120px" clearable>
              <Option v-for="(v,k) in isStopOption" :value="k" :key="k">{{ v }}</Option>
              <!-- <Option v-for="(item,k) in isStopOption" :value="item.value" :key="k">{{ item.label }}</Option> -->
            </Select>
          </FormItem>

          <FormItem :label-width="0">
            <Button type="primary" icon="ios-search" @click="queryTableData()">搜索</Button>
            <Button icon="md-refresh" class="marginLeft20" @click="reset">重置</Button>
          </FormItem>
        </Form>
        <Row type="flex" justify="start">
          <Button type="primary" icon="md-add" @click="addOrEdit('add')">新增</Button>
          <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <!-- 
          按钮显示的逻辑如下：
          审核状态 status 0-待审核 1-审核通过 2-审核失败
          状态： isStop "0": "未开始", "1": "进行中", "2": "已结束", "3": "已终止"
          1.查看：只要有记录，即可显示
          2.数据：只要有记录，即可显示
          3.编辑：只有在“待审核、审核未通过”状态下，才可显示    status：0/2
          4.审核：只有在“待审核”状态下，才可显示 status：0
          5.下架：只有在“审核通过且状态未开始、审核通过且状态进行中”  status：1 isStop 0/1
          6.删除：只有在“待审核、审核未通过”状态下，才可显示 status：0/2
          -->
          <!-- 点击“查看”按钮时，跳转到查看赏U页面 -->
          <Button type="success" size="small" style="margin-right: 5px" @click="toDetail(row)">查看</Button>
          <Button type="success" size="small" style="margin-right: 5px" @click="toData(row)">数据</Button>
          <!-- 只有“待审核、审核通过未开始”状态，才会显示“编辑” -->

          <template v-if="row.status==0||row.status==2">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="addOrEdit('edit',row)"
            >编辑</Button>
          </template>
          <!-- 只有“待审核”状态，才会显示审核按钮。 -->
          <template v-if="row.status==0">
            <Button type="success" size="small" @click="examine(row)">审核</Button>
          </template>
          <!-- 下架：只有在“审核通过且状态未开始、审核通过且状态进行中”  status：1 isStop 0/1 -->
          <template v-if="row.status==1 && (row.isStop==0||row.isStop==1)">
            <Poptip
              :transfer="true"
              confirm
              placement="bottom-end"
              title="确认下架此商户任务吗?"
              @on-ok="dowm(row)"
              @on-cancel="cancelDown"
              ok-text="确认"
              cancel-text="取消"
              word-wrap
            >
              <!-- <Button type="warning" size="small" @click="dowm(row)">下架</Button> -->
              <Button type="warning" size="small">下架</Button>
            </Poptip>
          </template>
          <!-- 只有“待审核、未通过”状态，才会显示“删除”按钮 -->
          <template v-if="row.status==0||row.status==2">
            <Poptip
              :transfer="true"
              confirm
              placement="bottom-end"
              title="确认删除此任务吗?"
              @on-ok="ok(row)"
              @on-cancel="cancel"
              ok-text="确认"
              cancel-text="取消"
              word-wrap
            >
              <Button type="error" size="small" style="margin-left: 5px">删除</Button>
            </Poptip>
          </template>
        </template>
      </Table>
      <!-- 分页器 -->
      <Row type="flex" justify="end" class="page">
        <!-- show-total 显示总数 共{{ total }}条 -->
        <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
        <Page
          show-total
          show-elevator
          :current="page.pageNum"
          :page-size="page.pageSize"
          :total="page.total"
          @on-change="changeCurrent"
        ></Page>
      </Row>
    </Card>

    <Drawer v-model="showDetail" :closable="true" width="820" :styles="styles">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>任务详情</span>
      </p>
      <RewardUDetail v-if="showDetail" :showDetail.sync="showDetail" :detailData="detailData"></RewardUDetail>
    </Drawer>

    <Modal v-model="examineModal" :closable="true" width="300" @on-visible-change="formModalChange">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>审核</span>
      </p>
      <div>
        <Form label-position="left" ref="formValidate" :model="formValidate" :rules="ruleValidate">
          <FormItem label="审核结果：" prop="status">
            <RadioGroup v-model="formValidate.status">
              <Radio v-for="(v,k) in examineStatusOption" :key="k" :label="k">{{ v }}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            label="填写原因："
            prop="reason"
            :rules="{ required: formValidate.status == 2?true:false,validator:formValidate.status == 2?validateReason:null }"
          >
            <Row>
              <Col span="16">
                <Input
                  v-model="formValidate.reason"
                  type="textarea"
                  :autosize="{minRows: 3,maxRows: 6}"
                  :placeholder="reasonPlaceholder"
                ></Input>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="check('formValidate')">确认</Button>
        <Button @click="cancelHandleReset('formValidate')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  queryRewardUList,
  queryDetailById,
  checkMerchant, // 审核
  downMerchant, // 下架
  delMerchant, // 删除
  queryMerchantDataById // 数据
} from "@/api/sys";
import columns from "./columns";

import RewardUDetail from "./RewardUDetail";
export default {
  name: "reward-u",
  inject: ["merchantTypeOption", "msgOk", "msgErr"],
  components: {
    RewardUDetail
  },
  watch: {
    ["formValidate.status"]() {
      const status = this.formValidate.status;
      const arr = ["", "请输入通过原因", "请输入50字以内未通过原因"];
      this.reasonPlaceholder = arr[status];
      //清空验证
      if (status == 1) {
        this.$refs.formValidate.resetFields();
      }

      console.log("reasonPlaceholder", status, this.reasonPlaceholder);
    }
  },
  data() {
    // const validateReason = (rule, value, callback) => {
    //   value += "";
    //   value = value.trim();
    //   if (value == "") {
    //     callback(new Error("审核原因不能为空"));
    //   } else if (value.length >= 50) {
    //     callback(new Error("请输入50字以内的字符"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      showDetail: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      id: "",
      //审核
      examineModal: false,
      // 审核状态 1-审核通过 2-审核不通过
      examineStatusOption: {
        "1": "通过",
        "2": "不通过"
      },
      // 请输入50字以内未通过原因
      reasonPlaceholder: "请输入通过原因",
      formValidate: {
        status: "1",
        reason: ""
      },
      ruleValidate: {
        // reason: [
        //   {
        //     required: true,
        //     validator: validateReason,
        //     trigger: "blur"
        //   }
        // ]
      },
      //审核 status examineType ： “待审核、已通过、未通过” 默认显示“请选择”。  审核状态status 0-待审核 1-审核通过 2-审核失败
      statusOption: {
        "0": "待审核",
        "1": "已通过",
        "2": "未通过"
      },
      // 状态 status 显示“未开始、进行中、已结束、已终止”选项。	默认显示“请选择”。
      // isStop 是否终止 1-中止，0-正常
      // isStop "0": "未开始", "1": "进行中", "2": "已结束", "3": "已终止"
      isStopOption: {
        "0": "未开始",
        "1": "进行中",
        "2": "已结束",
        "3": "已终止"
      },
      // merchantTypeOption: { 0: "本地商户（单店）", 1: "本地商户（多店）" },
      // 查询参数
      searchData: {
        name: "", //任务名称
        status: "", // 审核类型
        isStop: "" //状态
      },
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      columns,
      tableData: [],
      detailData: {} //查看详情
    };
  },
  created() {
    // console.log("okkk", this.msgOk);
    this.queryTableData();
  },
  methods: {
    formModalChange(flag) {
      if (!flag) {
        //清空form表单数据
        this.formValidate = {
          status: "1",
          reason: ""
        };
      }
    },
    validateReason(rule, value, callback) {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("审核原因不能为空"));
      } else if (value.length >= 50) {
        callback(new Error("请输入50字以内的字符"));
      } else {
        callback();
      }
    },
    async queryRowById(id) {
      const { code, data } = await queryDetailById(id);
      if (code == 200) {
        // 审核 status 状态  isStop 是否终止 1-中止，0-正常

        // statusOption/isStopOption
        const { isStop, status, startTime, endTime, ruleInfoList } = data;

        data.statusName = this.statusOption[status]; //审核
        data.isStopName = this.isStopOption[isStop]; //状态
        data.daterange = [startTime, endTime];
        data.ruleInfoList = (ruleInfoList || []).map(item => {
          // item.imgUrl = "https://image.52iuh.cn/wx_mini/LGHFWoUdOt.jpg";
          // item.logoUrl = "https://image.52iuh.cn/wx_mini/vENhDz3BZg.png";
          const {
            merchantType,
            merchantId,
            brandId,
            name,
            imgUrl,
            logoUrl,
            shareLogo
          } = item;
          let row = null;
          // 商户类型 0-本地商户（单店），1-本地商户（多店）
          item.merchantTypeName = this.merchantTypeOption[merchantType];

          if (merchantType == 0) {
            item.businessId = item.merchantId = merchantId;
            item.businessName = item.merhcantName = name;
            item.brandId = "";
            item.brandName = "";
            // row = { merchantId: merchantId, name };
          } else {
            item.businessId = item.brandId = brandId;
            item.businessName = item.brandName = name;
            item.merchantId = "";
            item.merhcantName = "";
            // row = { id: brandId, name };
          }

          item.defaultBannerList = [];
          if (imgUrl) {
            item.defaultBannerList = [{ imgUrl }];
          }
          item.defaultLogoList = [];
          if (logoUrl) {
            item.defaultLogoList = [{ imgUrl: logoUrl }];
          }

          // 分享Logo：
          item.defaultShareLogoList = [];
          if (shareLogo) {
            item.defaultShareLogoList = [{ imgUrl: shareLogo }];
          }

          // item.tableData = [row];
          item.tableData = [];
          return item;
        });
        return data;
      } else {
        // msgOk msgErr
        return this.msgErr("数据查询失败！");
      }
    },
    async toDetail(row) {
      //查看详情
      const data = await this.queryRowById(row.id);

      if (data) {
        this.showDetail = true;
        this.detailData = data;
        // this.linkTo("reward-u-detail", data);
      }
    },
    async toData({ id, name }) {
      let { code } = await queryMerchantDataById(id);
      this.linkTo("reward-u-data", { id, name });
    },
    examine(row) {
      this.examineModal = true;
      this.id = row.id;
      // 审核状态 1-审核通过 2-审核不通过
    },
    check(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          const { code, msg } = await checkMerchant({
            id: this.id,
            ...this.formValidate
          });

          if (code == 200) {
            this.msgOk("审核成功");
            this.queryTableData();
            this.cancelHandleReset(name);
          } else {
            this.msgErr(msg);
          }
        }
      });
    },
    async dowm({ id }) {
      const { code, msg } = await downMerchant(id);
      if (code == 200) {
        this.msgOk("下架成功");
        //查询table
        this.queryTableData();
      } else {
        this.msgErr(msg);
      }
      // this.refresh();
    },
    async ok({ id }) {
      this.$Message.info("正在删除");
      console.log("del", id);
      const { code, msg } = await delMerchant(id);
      if (code == 200) {
        this.msgOk("删除成功");
        //查询table
        this.queryTableData();
      } else {
        this.msgErr(msg);
      }
    },
    cancelDown() {
      this.$Message.info("已取消下架");
    },
    cancel() {
      this.$Message.info("已取消删除");
    },
    async addOrEdit(type, row) {
      let payload = null;
      if (type == "add") {
        payload = { type };
      }
      if (type == "edit") {
        let data = await this.queryRowById(row.id);
        payload = { type, id: row.id, name: row.name, data };
      }
      let compName = "reward-u-edit";
      this.linkTo(compName, payload);
    },

    linkTo(compName, data) {
      this.$store.dispatch("missionCenter/changeView", {
        compName,
        ...data
      });
    },
    // 刷新搜索
    refresh() {
      this.queryTableData(this.page.pageNum);
    },
    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.queryTableData(pageNum);
    },
    // 查询
    queryTableData(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.loading = true;

      queryRewardUList({
        ...this.searchData,
        ...this.page
      }).then(res => {
        // console.log(res);
        const {
          code,
          data: { current, total, size, records }
        } = res;

        if (code == 200) {
          this.tableData = records.map(item => {
            // startTimeAndEndTime
            item.startTimeAndEndTime = `${item.startTime}-${item.endTime}`;
            // statusName
            item.statusName = this.statusOption[item.status];
            // isStopName
            item.isStopName = this.isStopOption[item.isStop];
            return item;
          });

          this.page.pageNum = current; //分页查询起始记录
          this.page.total = total; //列表总数
          this.page.pageSize = size; //每页数据
        } else {
          this.$Message.error(res.code + " 数据加载失败!", 3);
        }
        this.loading = false;
      });
    },
    reset() {
      // 重置查询参数
      this.searchData = {
        name: "", //任务名称
        status: "", // 审核类型
        isStop: "" //状态
      };

      this.page = {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      };

      //重新查询一遍
      this.queryTableData();
    },
    // 审核-------------------------------------
    cancelHandleReset(name) {
      this.examineModal = false;
      this.$nextTick(() => {
        this.$refs[name].resetFields();
      });
    }
  }
};
</script>
<style scoped>
.underline {
  text-decoration: underline;
}
.table-box {
  min-height: 100px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.marginLeft20 {
  margin-left: 20px;
}
</style>