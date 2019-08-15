<template>
  <div>
    <div>
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem style="margin-left:20px;">
            <Button type="dashed" icon="md-arrow-round-back" @click="goback">返回列表</Button>
          </FormItem>
          <FormItem label="团类型：" :label-width="80">
            <Select v-model="searchData.groupType" style="width: 100%" placeholder="请选择">
              <Option :value="0" label="全部"></Option>
              <Option :value="2" label="多人团"></Option>
              <Option :value="1" label="单人团"></Option>
            </Select>
          </FormItem>
          <span>
            <FormItem label="抽奖开始时间：" :label-width="120">
              <DatePicker
                v-model="searchData.startTime"
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择开始日期"
                style="width: 100%"
              ></DatePicker>
            </FormItem>
          </span>
          <!-- <span v-if="isDrop">
            <FormItem label="模糊查询" :label-width="120">
              <Input
                style="width:100%"
                v-model="searchData.searchText"
                placeholder="模糊查询"
                @keyup.native="startQuery"
              />
            </FormItem>
          </span>-->
          <FormItem style="margin-left:35px;" class="br">
            <Button type="primary" icon="ios-search" @click="startQuery">搜索</Button>
            <Button icon="md-refresh" @click="reset">重置</Button>
            <!-- <a class="drop-down" @click="dropDown">
              {{dropDownContent}}
              <Icon :type="dropDownIcon"></Icon>
            </a>-->
          </FormItem>
        </Form>
      </Card>
      <Card :bordered="false">
        <div>
          <!-- 用户列表 -->
          <Table
            border
            width="100%"
            :columns="tableCol"
            :data="schedulesList"
            :loading="TableLoading"
          >
            <template slot-scope="{ row }" slot="action">
              <Button
                v-show="row.isTop === 0"
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="sendTotop(row.id, Number(!row.isTop))"
              >置顶</Button>
              <Button
                v-show="row.isTop === 1"
                type="error"
                size="small"
                @click="sendTotop(row.id, Number(!row.isTop))"
              >取消置顶</Button>
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
            :current="searchData.pageNum"
            @on-change="changeCurrent"
          ></Page>
        </Row>
        <!-- 分页器 -->
      </Card>
    </div>
  </div>
</template>

<script>
import { getSchedules } from "@/api/sys";
import { postRequest } from "@/libs/axios";
import { baseUrl } from "@/api/index";
export default {
  name: "schedule-daily",
  data() {
    return {
      // 是否展开 模糊查询
      // isDrop: false,
      // dropDownContent: "展开",
      // dropDownIcon: "ios-arrow-down",

      // 抽奖活动列表
      tableCol: [
        {
          title: "排序",
          align: "center",
          width: 120,
          fixed: "left",
          slot: "action"
        },
        {
          title: "团类型",
          align: "center",
          minWidth: 140,
          key: "groupType"
        },
        {
          title: "抽奖名称",
          align: "center",
          minWidth: 160,
          key: "name"
        },
        {
          title: "大奖",
          align: "center",
          minWidth: 140,
          key: "bigPrizeName"
        },
        {
          title: "阳光普照奖",
          align: "center",
          minWidth: 140,
          key: "normalPrizeName"
        },
        {
          title: "抽奖开始时间",
          align: "center",
          minWidth: 140,
          key: "startTime"
        },
        {
          title: "开奖时间",
          align: "center",
          minWidth: 140,
          key: "openDrawTime"
        },
        {
          title: "广告主",
          align: "center",
          minWidth: 140,
          key: "advertName"
        }
      ],
      schedulesList: [], //抽奖活动列表数据
      //campaginCampId:'', // 选中的优惠活动Id
      searchData: {
        // 查询参数
        startTime: "",
        searchText: "",
        groupType: 0,
        pageNum: 1,
        pageSize: 10
      },
      // pagingType:'1', // 分页类型 1：初始化，2为搜索
      totalSize: 0, //总条数
      TableLoading: false //列表加载动画
    };
  },
  mounted() {
    this.reset = () => {
      this.cloneObj(this.searchData);
      this.startQuery();
    };
    this.startQuery();
  },
  watch: {},

  methods: {
    goback() {
      this.$emit("changeComp", "draw-config");
    },
    // dropDown() {
    //   if (this.isDrop) {
    //     this.dropDownContent = "展开";
    //     this.dropDownIcon = "ios-arrow-down";
    //   } else {
    //     this.dropDownContent = "收起";
    //     this.dropDownIcon = "ios-arrow-up";
    //   }
    //   this.isDrop = !this.isDrop;
    // },
    /**
     * 时间戳转时间
     */
    // 根据毫秒数格式化时间,时间格式有三种，根据format的数值改变：2位年月，3为年月日，5为年月日时分，6为年月日时分秒，默认5
    // str 为yyyy-mm-dd分隔符
    ms2date: (time, format, str) => {
      var currentdate,
        ms = Number(time),
        date = new Date(time),
        cut1 = "-",
        cut2 = ":";

      if (!isNaN(ms) && ms > 99999999) {
        date = new Date(Number(ms));
      }
      if (isNaN(date.getTime())) {
        // 非法时间 Invalid Date
        return time;
      }
      if (ms === 0) {
        // 传了 空
        return time;
      }
      let objYear = date.getFullYear(),
        objMonth = date.getMonth() + 1,
        objDate = date.getDate(),
        objHours = date.getHours(),
        objMinutes = date.getMinutes(),
        objSeconds = date.getSeconds();
      if (typeof str === "string") {
        cut1 = str;
      }
      if (objMonth >= 1 && objMonth <= 9) {
        objMonth = "0" + objMonth;
      }
      if (objDate >= 0 && objDate <= 9) {
        objDate = "0" + objDate;
      }
      if (objHours >= 0 && objHours <= 9) {
        objHours = "0" + objHours;
      }
      if (objMinutes >= 0 && objMinutes <= 9) {
        objMinutes = "0" + objMinutes;
      }
      if (objSeconds >= 0 && objSeconds <= 9) {
        objSeconds = "0" + objSeconds;
      }
      if (format == 2) {
        currentdate = objYear + cut1 + objMonth;
      } else if (format == 3) {
        currentdate = objYear + cut1 + objMonth + cut1 + objDate;
      } else if (format == 5) {
        currentdate =
          objYear +
          cut1 +
          objMonth +
          cut1 +
          objDate +
          " " +
          objHours +
          cut2 +
          objMinutes;
      } else if (format == 6) {
        currentdate =
          objYear +
          cut1 +
          objMonth +
          cut1 +
          objDate +
          " " +
          objHours +
          cut2 +
          objMinutes +
          cut2 +
          objSeconds;
      } else {
        currentdate =
          objYear +
          cut1 +
          objMonth +
          cut1 +
          objDate +
          " " +
          objHours +
          cut2 +
          objMinutes;
      }
      return currentdate;
    },
    cloneObj(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    startQuery() {
      this.TableLoading = true;
      let params = this.cloneObj(this.searchData);
      params.startTime = this.ms2date(params.startTime, 3);
      getSchedules(params)
        .then(res => {
          if (res.code == 200) {
            // console.log(res);
            this.schedulesList = res.data.records;
            this.totalSize = res.data.total;
            this.TableLoading = false;
          } else {
            this.msgErr(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 重置 此方法已重写！！！
    reset() {},

    // 置顶 or 取消置顶
    sendTotop(id, isTop) {
      // /drawDaily/banner/upTotop
      postRequest("/drawDaily/banner/upTotop", { id, isTop })
        .then(res => {
          console.log(res, 200);
          let texts = ["取消", ""];
          if (res.code == 200) {
            this.msgOk(texts[isTop] + "置顶成功！");
            this.startQuery();
          } else {
            this.msgErr(texts[isTop] + "置顶失败，请稍后再试！");
          }
        })
        .catch(err => {
          console.log(err, "schedules_daily 202");
        });
    },

    // 分页（点击第几页）
    changeCurrent: function(current) {
      this.searchData.pageNum = current;
      this.startQuery(this.searchData);
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
<style lang="less" scoped>
.operation {
  margin-bottom: 2vh;
}
.select-count {
  font-size: 13px;
  font-weight: 600;
  color: #40a9ff;
}
.select-clear {
  margin-left: 10px;
}
.page {
  margin-top: 2vh;
}
.drop-down {
  font-size: 13px;
  margin-left: 5px;
}
</style>
